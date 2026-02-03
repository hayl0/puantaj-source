import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should check login page responsiveness', async ({ page }) => {
    await page.goto('/login');
    const card = page.locator('.glass-card');
    await expect(card).toBeVisible();
    // Check if card width is adapted (e.g. not overflowing)
    const viewportSize = page.viewportSize();
    const box = await card.boundingBox();
    if (viewportSize && box) {
        expect(box.width).toBeLessThanOrEqual(viewportSize.width);
    }
  });

  // Note: Since dashboard is protected, we can't easily test sidebar without login.
  // We'll skip sidebar test for now unless we mock auth.
});
