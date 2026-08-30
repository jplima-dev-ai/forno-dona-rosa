const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI
    ? [['list'], ['html', { outputFolder: 'artifacts/test-evidence/browser-report', open: 'never' }]]
    : [['list']],
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
  },
  webServer: process.env.E2E_BASE_URL ? undefined : {
    command: 'python -m http.server 4173 --bind 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    { name: 'chromium-desktop', use: { browserName: 'chromium', viewport: { width: 1366, height: 768 } } },
    { name: 'chromium-phone-320', use: { browserName: 'chromium', viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true } },
    { name: 'chromium-phone-390', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: 'chromium-phone-430', use: { browserName: 'chromium', viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true } },
    { name: 'chromium-tablet', use: { browserName: 'chromium', viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: 'chromium-landscape', use: { browserName: 'chromium', viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true } },
  ],
  outputDir: 'artifacts/test-evidence/playwright-output',
});
