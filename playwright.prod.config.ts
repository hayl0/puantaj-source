import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: 'prod.spec.ts',
  timeout: 60000,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'https://puantajpro.site',
    trace: 'on-first-retry',
    screenshot: 'on',
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
