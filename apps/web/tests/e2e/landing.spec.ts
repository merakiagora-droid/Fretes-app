import { test, expect } from '@playwright/test';
test('landing renderiza CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading',{ name:/Conectamos/i })).toBeVisible();
  await expect(page.getByRole('link',{ name:/Começar agora/i })).toBeVisible();
});
test('navega para login', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link',{ name:/Entrar/i }).click();
  await expect(page).toHaveURL(/login/);
});
