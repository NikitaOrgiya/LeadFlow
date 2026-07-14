import { describe, expect, it } from "vitest";

import { calculatePrice } from "@/lib/pricing/calculate-price";

describe("calculatePrice", () => {
  it("считает базовую услугу без опций", () => {
    const result = calculatePrice("landing", {});
    expect(result).not.toBeNull();
    expect(result?.min).toBe(35_000);
    expect(result?.max).toBe(42_000);
  });

  it("применяет наценку +30% за срочность ко всей сумме", () => {
    const result = calculatePrice("landing", { urgent: true });
    // 35000 * 1.3 = 45500
    expect(result?.min).toBe(45_500);
    expect(result?.max).toBe(54_600);
  });

  it("учитывает дополнительные страницы (per_unit)", () => {
    const result = calculatePrice("corporate-site", { extra_pages: 3 });
    // 60000 + 3 * 5000 = 75000
    expect(result?.min).toBe(75_000);
    expect(result?.max).toBe(90_000);
    expect(result?.selectedOptionLabels.some((label) => label.includes("3"))).toBe(true);
  });

  it("учитывает внешние интеграции (per_unit)", () => {
    const result = calculatePrice("automation", { integrations: 2 });
    // 50000 + 2 * 15000 = 80000
    expect(result?.min).toBe(80_000);
    expect(result?.max).toBe(96_000);
  });

  it("учитывает административную панель (flat)", () => {
    const result = calculatePrice("mini-crm", { admin_panel: true });
    // 80000 + 25000 = 105000
    expect(result?.min).toBe(105_000);
    expect(result?.max).toBe(126_000);
  });

  it("учитывает авторизацию пользователей (flat)", () => {
    const result = calculatePrice("telegram-bot", { auth: true });
    // 45000 + 20000 = 65000
    expect(result?.min).toBe(65_000);
    expect(result?.max).toBe(78_000);
  });

  it("складывает несколько опций одновременно", () => {
    const result = calculatePrice("mini-crm", {
      admin_panel: true,
      extra_pages: 3,
    });
    // 80000 + 25000 + 15000 = 120000
    expect(result?.min).toBe(120_000);
    expect(result?.max).toBe(144_000);
  });

  it("ограничивает количество страниц верхней границей (не более 20)", () => {
    const result = calculatePrice("landing", { extra_pages: 999 });
    // 35000 + 20 * 5000 = 135000, а не 35000 + 999 * 5000
    expect(result?.min).toBe(135_000);
  });

  it("не уходит в отрицательные значения при отрицательном количестве", () => {
    const result = calculatePrice("landing", { integrations: -5 });
    expect(result?.min).toBe(35_000);
  });

  it("максимальная оценка всегда равна минимальной + 20%", () => {
    const result = calculatePrice("ai-assistant", { auth: true, file_upload: true });
    expect(result).not.toBeNull();
    if (!result) return;
    expect(result.max).toBe(Math.round((result.min * 1.2) / 100) * 100);
  });

  it("возвращает null для неизвестной услуги", () => {
    expect(calculatePrice("does-not-exist", {})).toBeNull();
  });
});
