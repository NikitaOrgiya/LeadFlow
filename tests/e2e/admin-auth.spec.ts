import { test, expect } from "@playwright/test";

test.describe("Защита административной панели", () => {
  test("неавторизованный пользователь перенаправляется с /admin на /admin/login", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForURL("**/admin/login");
    await expect(page.getByText("LeadFlow Admin")).toBeVisible();
  });

  test("неавторизованный пользователь перенаправляется с /admin/leads на /admin/login", async ({ page }) => {
    await page.goto("/admin/leads");
    await page.waitForURL("**/admin/login");
  });

  test("неавторизованный пользователь перенаправляется с карточки заявки на /admin/login", async ({ page }) => {
    await page.goto("/admin/leads/00000000-0000-0000-0000-000000000000");
    await page.waitForURL("**/admin/login");
  });
});
