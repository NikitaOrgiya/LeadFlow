import { z } from "zod";

import { SERVICES } from "@/lib/pricing/pricing-config";
import { countPhoneDigits } from "@/lib/utils/phone";

const SERVICE_SLUGS = SERVICES.map((service) => service.slug) as [string, ...string[]];

const emailField = z
  .union([z.literal(""), z.string().trim().max(160, "Максимум 160 символов").email("Некорректный email")])
  .optional();

/**
 * Поля, которые заполняет пользователь. Используется и в форме на клиенте
 * (react-hook-form + zodResolver), и как основа серверной схемы.
 */
export const leadFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Минимум 2 символа")
    .max(80, "Максимум 80 символов"),
  phone: z
    .string()
    .trim()
    .min(1, "Укажите телефон")
    .max(32, "Слишком длинный номер")
    .regex(/^[0-9+\-()\s]+$/, "Допустимы цифры, пробелы, скобки, дефисы и +")
    .refine((value) => countPhoneDigits(value) >= 10, "Телефон должен содержать минимум 10 цифр"),
  email: emailField,
  company: z.string().trim().max(120, "Максимум 120 символов").optional().or(z.literal("")),
  message: z.string().trim().max(2000, "Максимум 2000 символов").optional().or(z.literal("")),
  serviceSlug: z.enum(SERVICE_SLUGS, { message: "Выберите услугу" }),
  consent: z.literal(true, { message: "Необходимо согласие на обработку данных" }),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

/**
 * Полная схема тела запроса POST /api/leads. Honeypot и время заполнения
 * проверяются на сервере отдельно, до Zod-валидации (см. app/api/leads/route.ts) —
 * здесь они присутствуют только для типизации и ограничения длины.
 */
export const leadApiPayloadSchema = leadFormSchema.extend({
  optionSelections: z.record(z.string(), z.union([z.boolean(), z.number()])).default({}),
  honeypot: z.string().max(200).optional().default(""),
  formRenderedAt: z.number().int().nonnegative(),
});

export type LeadApiPayload = z.infer<typeof leadApiPayloadSchema>;
