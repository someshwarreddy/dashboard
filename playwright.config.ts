import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',

  fullyParallel: true,

  reporter: 'html',

  use: {
    baseURL: 'http://localhost:4200',
    headless: false,
      launchOptions: {
    slowMo: 1000,
  },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
   reuseExistingServer: true,
    timeout: 120_000,
  },
});