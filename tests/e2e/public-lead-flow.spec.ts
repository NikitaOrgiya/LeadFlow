import { test, expect } from "@playwright/test";

test.describe("Публичный сценарий: расчёт стоимости и отправка заявки", () => {
  test("пользователь рассчитывает стоимость и отправляет заявку", async ({ page }) => {
    await page.goto("/");

    await page.locator("#calculator-service").click();
    await page.getByRole("option", { name: "Мини-CRM" }).click();
    await page.getByText("Административная панель").click();

    await expect(page.locator("#calculator")).toContainText("105 000");

    await page.route("**/api/leads", async (route) => {
      const request = route.request();
      const body = request.postDataJSON();

      expect(body.name).toBe("Иван Тестов");
      expect(body.serviceSlug).toBe("mini-crm");
      expect(body.consent).toBe(true);
      expect(body.honeypot).toBe("");

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          leadNumber: "LF-2026-0099",
          estimatedMin: 120000,
          estimatedMax: 144000,
        }),
      });
    });

    await page.locator("#lead-name").fill("Иван Тестов");
    await page.locator("#lead-phone").fill("+7 999 111-22-33");
    await page.locator("#lead-consent").click();

    await page.getByRole("button", { name: "Отправить заявку" }).click();

    await page.waitForURL("**/success?**");
    await expect(page.getByRole("heading", { name: /LF-2026-0099/ })).toBeVisible();
    await expect(page.getByText("120 000–144 000")).toBeVisible();
  });

  test("некорректная форма показывает ошибки и не отправляется", async ({ page }) => {
    let requestSent = false;
    await page.route("**/api/leads", async (route) => {
      requestSent = true;
      await route.fulfill({ status: 200, body: "{}" });
    });

    await page.goto("/#lead-form");

    await page.getByRole("button", { name: "Отправить заявку" }).click();

    await expect(page.getByText("Минимум 2 символа")).toBeVisible();
    await expect(page.getByText("Укажите телефон")).toBeVisible();
    await expect(page.getByText("Необходимо согласие на обработку данных")).toBeVisible();

    expect(requestSent).toBe(false);
  });
});
