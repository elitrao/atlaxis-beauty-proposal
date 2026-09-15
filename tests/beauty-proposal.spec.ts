import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("shows the proposal cover and project totals", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Маркетинговая упаковка проекта" })).toBeVisible();
  await expect(page.getByText("180 000 ₽")).toBeVisible();
  await expect(page).toHaveURL(/#slide-1$/);
});

test("navigates through the presentation with buttons and keyboard", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Следующий экран" }).click();
  await expect(page.getByRole("heading", { name: "Маркетинговая упаковка проекта" })).toBeVisible();
  await expect(page).toHaveURL(/#slide-2$/);
  await page.keyboard.press("End");
  await expect(page.getByRole("heading", { name: "Рост начинается с измерения" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Скачать КП" })).toBeVisible();
});

test("opens a direct slide link without hydration errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/#slide-5");
  await expect(page.getByRole("heading", { name: "Работа с UGC-креаторами" })).toBeVisible();
  expect(errors.filter((message) => message.includes("Hydration failed"))).toEqual([]);
});

test("has no automatically detectable accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
