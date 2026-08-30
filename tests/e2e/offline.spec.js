const { test, expect } = require('@playwright/test');

test('service worker does not cache admin surface as public shell', async ({ page }) => {
  await page.goto('/service-worker.js');
  const text = await page.textContent('body');
  expect(text).not.toContain('"./admin/"');
});

test('offline fallback remains reachable', async ({ page }) => {
  const response = await page.goto('/offline.html');
  expect(response && response.ok()).toBeTruthy();
  await expect(page.getByRole('heading').first()).toBeVisible();
});
