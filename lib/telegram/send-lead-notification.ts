import "server-only";

import { getTelegramBotToken, getTelegramChatId } from "@/lib/utils/env";
import { logServerError } from "@/lib/utils/errors";
import { formatPriceRange } from "@/lib/utils/currency";

export type LeadNotificationInput = {
  publicNumber: string;
  name: string;
  phone: string;
  email?: string | null;
  company?: string | null;
  serviceName: string;
  optionLabels: string[];
  estimatedMin: number | null;
  estimatedMax: number | null;
  message?: string | null;
};

const MAX_MESSAGE_LENGTH = 3500;
const MAX_COMMENT_LENGTH = 800;
const TELEGRAM_REQUEST_TIMEOUT_MS = 5000;

function buildMessage(lead: LeadNotificationInput): string {
  const lines = [
    `🆕 Новая заявка ${lead.publicNumber}`,
    `👤 Имя: ${lead.name}`,
  ];

  if (lead.company) {
    lines.push(`🏢 Компания: ${lead.company}`);
  }

  lines.push(`📞 Телефон: ${lead.phone}`);

  if (lead.email) {
    lines.push(`✉️ Email: ${lead.email}`);
  }

  lines.push(`🛠 Услуга: ${lead.serviceName}`);

  if (lead.optionLabels.length > 0) {
    lines.push("⚙️ Опции:");
    for (const label of lead.optionLabels) {
      lines.push(`— ${label}`);
    }
  }

  if (lead.estimatedMin !== null && lead.estimatedMax !== null) {
    lines.push("💰 Предварительная стоимость:");
    lines.push(formatPriceRange(lead.estimatedMin, lead.estimatedMax));
  }

  if (lead.message) {
    const comment =
      lead.message.length > MAX_COMMENT_LENGTH
        ? `${lead.message.slice(0, MAX_COMMENT_LENGTH)}…`
        : lead.message;
    lines.push("💬 Комментарий:");
    lines.push(comment);
  }

  const text = lines.join("\n");
  return text.length > MAX_MESSAGE_LENGTH ? `${text.slice(0, MAX_MESSAGE_LENGTH)}…` : text;
}

/**
 * Отправляет уведомление менеджеру в Telegram. Сообщение отправляется без
 * parse_mode (обычный текст), поэтому пользовательский ввод не может
 * сломать разметку — в plain text Telegram не интерпретирует спецсимволы.
 * Никогда не бросает исключение наружу: ошибка Telegram не должна приводить
 * к потере уже сохранённой заявки, вызывающий код должен просто залогировать
 * неуспех и вернуть пользователю успешный ответ.
 */
export async function sendLeadTelegramNotification(
  lead: LeadNotificationInput
): Promise<{ success: boolean }> {
  try {
    const token = getTelegramBotToken();
    const chatId = getTelegramChatId();
    const text = buildMessage(lead);

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
      // Не даём зависшему Telegram API держать ответ /api/leads бесконечно —
      // заявка к этому моменту уже сохранена, дальше это best-effort попытка.
      signal: AbortSignal.timeout(TELEGRAM_REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      logServerError("telegram", `sendMessage failed with status ${response.status}`);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    logServerError("telegram", error);
    return { success: false };
  }
}
