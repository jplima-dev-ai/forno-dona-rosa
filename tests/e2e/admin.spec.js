const { test, expect } = require('@playwright/test');

test('admin simple mode protects non-technical operator from advanced fields', async ({ page }) => {
  await page.goto('/admin/');
  await page.locator('#onboarding-dialog').evaluate(el => { if (el.open) el.close(); });
  await page.locator('#admin-mode').selectOption('simple');
  await expect(page.locator('.admin-advanced').first()).toBeHidden();
  await page.locator('#admin-mode').selectOption('advanced');
  await expect(page.locator('.admin-advanced').first()).toBeVisible();
});

test('admin change can be previewed and undone', async ({ page }) => {
  await page.goto('/admin/');
  await page.locator('#onboarding-dialog').evaluate(el => { if (el.open) el.close(); });
  await page.locator('#product-select').selectOption({ index: 1 });
  const price = page.locator('[data-test="admin-product-price"]');
  const original = await price.inputValue();
  await price.fill(String(Number(original || '1') + 1));
  await page.locator('#product-save').click();
  await page.locator('[data-test="admin-preview-refresh"]').click();
  await expect(page.locator('[data-test="admin-undo"]')).toBeEnabled();
  await page.locator('[data-test="admin-undo"]').click();
});
