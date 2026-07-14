import { describe, expect, it } from "vitest";

import { leadApiPayloadSchema, leadFormSchema } from "@/lib/validation/lead";

const validLead = {
  name: "Иван Тестов",
  phone: "+7 999 123-45-67",
  email: "ivan@example.com",
  company: "Тестовая компания",
  message: "Нужен лендинг для запуска продукта.",
  serviceSlug: "landing",
  consent: true as const,
};

describe("leadFormSchema", () => {
  it("принимает корректную заявку", () => {
    const result = leadFormSchema.safeParse(validLead);
    expect(result.success).toBe(true);
  });

  it("принимает корректную заявку без необязательных полей", () => {
    const result = leadFormSchema.safeParse({
      name: "Иван Тестов",
      phone: "+79991234567",
      serviceSlug: "landing",
      consent: true,
    });
    expect(result.success).toBe(true);
  });

  it("отклоняет пустое имя", () => {
    const result = leadFormSchema.safeParse({ ...validLead, name: "" });
    expect(result.success).toBe(false);
  });

  it("отклоняет имя из одного символа (меньше минимума в 2 символа)", () => {
    const result = leadFormSchema.safeParse({ ...validLead, name: "А" });
    expect(result.success).toBe(false);
  });

  it("отклоняет некорректный телефон (недостаточно цифр)", () => {
    const result = leadFormSchema.safeParse({ ...validLead, phone: "12345" });
    expect(result.success).toBe(false);
  });

  it("отклоняет телефон с недопустимыми символами", () => {
    const result = leadFormSchema.safeParse({ ...validLead, phone: "+7 999 abc 45 67" });
    expect(result.success).toBe(false);
  });

  it("отклоняет слишком длинный комментарий (> 2000 символов)", () => {
    const result = leadFormSchema.safeParse({ ...validLead, message: "a".repeat(2001) });
    expect(result.success).toBe(false);
  });

  it("принимает комментарий ровно в 2000 символов", () => {
    const result = leadFormSchema.safeParse({ ...validLead, message: "a".repeat(2000) });
    expect(result.success).toBe(true);
  });

  it("отклоняет некорректный email", () => {
    const result = leadFormSchema.safeParse({ ...validLead, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("допускает пустую строку email (поле необязательное)", () => {
    const result = leadFormSchema.safeParse({ ...validLead, email: "" });
    expect(result.success).toBe(true);
  });

  it("отклоняет неизвестную услугу", () => {
    const result = leadFormSchema.safeParse({ ...validLead, serviceSlug: "does-not-exist" });
    expect(result.success).toBe(false);
  });

  it("отклоняет заявку без согласия на обработку данных", () => {
    const result = leadFormSchema.safeParse({ ...validLead, consent: false });
    expect(result.success).toBe(false);
  });
});

describe("leadApiPayloadSchema", () => {
  const validPayload = {
    ...validLead,
    optionSelections: { admin_panel: true },
    honeypot: "",
    formRenderedAt: Date.now() - 5000,
  };

  it("принимает корректный payload с пустым honeypot", () => {
    const result = leadApiPayloadSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("не падает при заполненном honeypot — поле остаётся строкой для ручной проверки в route.ts", () => {
    // Само по себе отклонение подозрительной заявки по honeypot происходит
    // в app/api/leads/route.ts до вызова Zod (см. ТЗ п.15) — схема лишь
    // ограничивает длину поля и не должна падать на "подозрительном" вводе.
    const result = leadApiPayloadSchema.safeParse({ ...validPayload, honeypot: "i-am-a-bot" });
    expect(result.success).toBe(true);
    expect(result.data?.honeypot).toBe("i-am-a-bot");
  });

  it("отклоняет чрезмерно длинный honeypot", () => {
    const result = leadApiPayloadSchema.safeParse({ ...validPayload, honeypot: "a".repeat(201) });
    expect(result.success).toBe(false);
  });

  it("требует formRenderedAt", () => {
    const withoutTimestamp: Record<string, unknown> = { ...validPayload };
    delete withoutTimestamp.formRenderedAt;
    const result = leadApiPayloadSchema.safeParse(withoutTimestamp);
    expect(result.success).toBe(false);
  });
});
