import { test, expect } from '@playwright/test';

const BASE_URL = 'https://puantajpro.site';
const USER = {
  email: 'halilibrahimdemr@aol.com',
  password: 'warbeh-6birdu-zAgjyc'
};

test.describe('Production Smoke Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Disable animations to avoid "element not stable" errors
    await page.addInitScript(() => {
      const style = document.createElement('style');
      style.innerHTML = `
        *, *::before, *::after {
          animation: none !important;
          transition: none !important;
        }
      `;
      document.head.appendChild(style);
    });
  });

  test('Login and Verify Dashboard', async ({ page }) => {
    // Monitor console
    page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));
    page.on('pageerror', err => console.log(`BROWSER ERROR: ${err}`));

    console.log('Navigating to login page...');
    await page.goto('/login');
    
    console.log('Filling credentials...');
    await page.fill('input[type="email"]', USER.email);
    await page.fill('input[type="password"]', USER.password);
    
    console.log('Clicking login...');
    await page.click('button[type="submit"]', { force: true });

    // Check for error message
    const error = page.locator('.text-red-400');
    if (await error.isVisible({ timeout: 3000 })) {
        const text = await error.textContent();
        console.error('Login failed with error:', text);
        // Fail the test explicitly if login fails
        throw new Error(`Login failed: ${text}`);
    }

    console.log('Waiting for dashboard navigation...');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 20000 });
    
    console.log('Checking dashboard content...');
    await page.waitForLoadState('domcontentloaded');
    
    // Check for either Admin or User welcome message
    await expect(page.locator('body')).toContainText(/Merhaba|Hoş Geldin/);
    
    // Optional check for title/brand
    try {
        await expect(page.getByText('Puantaj Pro')).toBeVisible({ timeout: 2000 });
    } catch {
        console.log('Puantaj Pro text not visible (likely mobile view)');
    }
  });

  test('Check Navigation to Modules', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', USER.email);
    await page.fill('input[type="password"]', USER.password);
    await page.click('button[type="submit"]', { force: true });
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 20000 });

    // Vardiya
    console.log('Checking Vardiya...');
    await page.goto('/vardiya');
    await page.waitForLoadState('networkidle'); // Wait for API calls
    await expect(page.getByText('Vardiya Planlaması')).toBeVisible();
    
    // Wait for calendar with longer timeout
    try {
        // Check if loading spinner is present
        const loader = page.locator('.lucide-loader-2');
        if (await loader.isVisible()) {
            console.log('Loader is visible, waiting for it to disappear...');
            await loader.waitFor({ state: 'hidden', timeout: 5000 });
        }
        
        // Check for TUI Calendar controls
        await expect(page.getByText('Bugün')).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('Ay', { exact: true })).toBeVisible();
        await expect(page.getByText('Hafta')).toBeVisible();
    } catch (e) {
        console.log('WARNING: ShiftCalendar (TUI) not found.');
        throw e;
    }
    
    // Puantaj
    console.log('Checking Puantaj...');
    await page.goto('/puantaj');
    await expect(page.getByText('Puantaj Takibi')).toBeVisible();

    // Izin
    console.log('Checking Izin...');
    await page.goto('/izin');
    await expect(page.getByText('İzin Yönetimi')).toBeVisible();
  });
});
