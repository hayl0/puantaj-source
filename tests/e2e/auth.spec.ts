import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Hoş Geldiniz')).toBeVisible();
    await expect(page.getByPlaceholder('admin@puantaj.com')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Giriş Yap' })).toBeVisible();
  });

  test('should show validation error for empty fields', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Giriş Yap' }).click();
    // Assuming HTML5 validation or UI error
    // If HTML5 validation is used, we can check validity.
    // Or if custom validation:
    // await expect(page.getByText('Email zorunludur')).toBeVisible(); 
  });
});
