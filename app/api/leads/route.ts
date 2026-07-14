import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { calculatePrice } from "@/lib/pricing/calculate-price";
import { getServiceBySlug } from "@/lib/pricing/pricing-config";
import { leadApiPayloadSchema } from "@/lib/validation/lead";
import { normalizePhone } from "@/lib/utils/phone";
import { logServerError, USER_ERROR_MESSAGES } from "@/lib/utils/errors";
import { sendLeadTelegramNotification } from "@/lib/telegram/send-lead-notification";

export const dynamic = "force-dynamic";

/**
 * Минимальное время заполнения формы человеком. Более быстрая отправка
 * почти всегда означает бота, отправляющего запрос напрямую в API.
 */
const MIN_FILL_TIME_MS = 1200;

function badRequest(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

function serverError(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 500 });
}

async function handleLeadSubmission(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest(USER_ERROR_MESSAGES.validation);
  }

  if (typeof body !== "object" || body === null) {
    return badRequest(USER_ERROR_MESSAGES.validation);
  }

  const raw = body as Record<string, unknown>;

  // 1-2. Honeypot: поле должно быть пустым — если заполнено, это бот.
  const honeypot = typeof raw.honeypot === "string" ? raw.honeypot : "";
  if (honeypot.length > 0) {
    return badRequest(USER_ERROR_MESSAGES.spam);
  }

  // 3. Время заполнения формы: слишком быстрая отправка — признак бота.
  const formRenderedAt = typeof raw.formRenderedAt === "number" ? raw.formRenderedAt : null;
  if (formRenderedAt === null || Date.now() - formRenderedAt < MIN_FILL_TIME_MS) {
    return badRequest(USER_ERROR_MESSAGES.spam);
  }

  // 4. Zod-валидация остальных полей.
  const parsed = leadApiPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    logServerError(
      "api/leads:validation_failed",
      parsed.error.issues.map((i) => i.message).join("; ")
    );
    return badRequest(USER_ERROR_MESSAGES.validation);
  }

  const payload = parsed.data;

  // 5. Нормализация телефона.
  const normalizedPhone = normalizePhone(payload.phone);

  // 6-7. Пересчёт стоимости на сервере — клиентским значениям не доверяем.
  const estimate = calculatePrice(payload.serviceSlug, payload.optionSelections);
  const serviceConfig = getServiceBySlug(payload.serviceSlug);
  if (!estimate || !serviceConfig) {
    return badRequest(USER_ERROR_MESSAGES.validation);
  }

  const supabase = createAdminClient();

  // 8. Найти услугу в базе (для внешнего ключа и проверки is_active).
  // slug уже проверен Zod-схемой против списка известных услуг, поэтому
  // "неизвестная услуга" на этом шаге невозможна — но услуга может быть
  // отсутствовать в ещё не заполненной seed-данными базе (не ошибка,
  // сохраняем без FK) или быть явно деактивирована администратором
  // (ошибка, заявку не принимаем).
  const { data: serviceRow, error: serviceLookupError } = await supabase
    .from("services")
    .select("id, is_active")
    .eq("slug", payload.serviceSlug)
    .maybeSingle();

  if (serviceLookupError) {
    logServerError("api/leads:service_lookup_failed", serviceLookupError.message);
    // Не блокируем заявку из-за сбоя чтения справочника — service_name уже
    // известен из конфигурации, FK на services в этом случае просто не
    // проставляется.
  }

  if (serviceRow && serviceRow.is_active === false) {
    return badRequest("Эта услуга временно недоступна. Выберите другую или свяжитесь с нами.");
  }

  // 9. Сгенерировать публичный номер заявки атомарно в базе.
  const { data: leadNumber, error: numberError } = await supabase.rpc("generate_lead_number");

  if (numberError || !leadNumber) {
    logServerError("api/leads:number_generation_failed", numberError);
    return serverError(USER_ERROR_MESSAGES.generic);
  }

  // 10. Сохранить заявку.
  const { error: insertError } = await supabase.from("leads").insert({
    public_number: leadNumber,
    name: payload.name,
    phone: normalizedPhone,
    email: payload.email || null,
    company: payload.company || null,
    service_id: serviceRow?.id ?? null,
    service_name: serviceConfig.name,
    message: payload.message || null,
    selected_options: estimate.selectedOptionLabels,
    estimated_min: estimate.min,
    estimated_max: estimate.max,
    status: "new",
    source: "website",
  });

  if (insertError) {
    logServerError("api/leads:insert_failed", insertError.message, leadNumber);
    return serverError(USER_ERROR_MESSAGES.generic);
  }

  // 11. Уведомление в Telegram — ошибка здесь не должна приводить к потере
  // уже сохранённой заявки, поэтому результат не влияет на ответ клиенту.
  const notification = await sendLeadTelegramNotification({
    publicNumber: leadNumber,
    name: payload.name,
    phone: normalizedPhone,
    email: payload.email || null,
    company: payload.company || null,
    serviceName: serviceConfig.name,
    optionLabels: estimate.selectedOptionLabels,
    estimatedMin: estimate.min,
    estimatedMax: estimate.max,
    message: payload.message || null,
  });

  if (!notification.success) {
    logServerError("api/leads:telegram_failed", "Уведомление не отправлено, заявка сохранена", leadNumber);
  }

  // 12. Безопасный JSON-ответ.
  return NextResponse.json({
    success: true,
    leadNumber,
    estimatedMin: estimate.min,
    estimatedMax: estimate.max,
  });
}

export async function POST(request: Request) {
  try {
    return await handleLeadSubmission(request);
  } catch (error) {
    // Любая непредвиденная ошибка (например, недоступность Supabase на
    // сетевом уровне) не должна возвращать пользователю технические
    // детали — только безопасный JSON-ответ с понятным сообщением.
    logServerError("api/leads:unexpected", error);
    return serverError(USER_ERROR_MESSAGES.generic);
  }
}
