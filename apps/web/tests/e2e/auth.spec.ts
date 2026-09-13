import { test, expect } from '@playwright/test';
test('cadastro mostra tipos', async ({ page }) => {
  await page.goto('/cadastro');
  await expect(page.getByRole('button',{ name:/Motorista/i })).toBeVisible();
  await expect(page.getByRole('button',{ name:/Embarcador/i })).toBeVisible();
});
test('login alterna para telefone', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button',{ name:/Telefone/i }).click();
  await expect(page.getByPlaceholder(/99999/)).toBeVisible();
});
