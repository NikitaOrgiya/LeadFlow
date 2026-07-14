import { describe, expect, it } from "vitest";

import { countPhoneDigits, normalizePhone } from "@/lib/utils/phone";

describe("normalizePhone", () => {
  it("нормализует российский номер с пробелами (8 → +7)", () => {
    expect(normalizePhone("8 999 123 45 67")).toBe("+79991234567");
  });

  it("нормализует номер со скобками", () => {
    expect(normalizePhone("+7 (999) 123-45-67")).toBe("+79991234567");
  });

  it("нормализует номер с дефисами без кода страны (10 цифр → +7)", () => {
    expect(normalizePhone("999-123-45-67")).toBe("+79991234567");
  });

  it("сохраняет ведущий +", () => {
    expect(normalizePhone("+79991234567")).toBe("+79991234567");
  });

  it("не бросает исключение и не искажает слишком короткий номер", () => {
    // Отклонение слишком коротких номеров происходит на уровне Zod-схемы
    // (см. tests/unit/lead-schema.test.ts) до вызова normalizePhone —
    // здесь важно, что функция ведёт себя предсказуемо и не падает.
    expect(normalizePhone("12345")).toBe("+12345");
    expect(normalizePhone("")).toBe("");
  });

  it("предсказуемо обрабатывает международный номер без ведущего +", () => {
    expect(normalizePhone("380991234567")).toBe("+380991234567");
  });
});

describe("countPhoneDigits", () => {
  it("считает только цифры, игнорируя форматирование", () => {
    expect(countPhoneDigits("+7 (999) 123-45-67")).toBe(11);
    expect(countPhoneDigits("123")).toBe(3);
    expect(countPhoneDigits("")).toBe(0);
  });
});
