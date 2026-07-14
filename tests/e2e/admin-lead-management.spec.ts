import { test, expect } from "@playwright/test";

// Полный сценарий (поиск, фильтры, изменение статуса) требует реальный
// Supabase-проект с администратором — см. README. Здесь проверяется
// поведение формы входа, которое не зависит от внешних сервисов.
test.describe("Форма входа администратора", () => {
  test("показывает ошибки валидации при некорректных данных", async ({ page }) => {
    await page.goto("/admin/login");

    await page.locator("#admin-email").fill("not-an-email");
    await page.locator("#admin-password").fill("123");
    await page.getByRole("button", { name: "Войти" }).click();

    await expect(page.getByText("Некорректный email")).toBeVisible();
    await expect(page.getByText("Минимум 6 символов")).toBeVisible();
  });

  test("показывает сообщение об отсутствии доступа по параметру error=forbidden", async ({ page }) => {
    await page.goto("/admin/login?error=forbidden");
    await expect(page.getByText("У вас нет доступа к административной панели.")).toBeVisible();
  });
});
