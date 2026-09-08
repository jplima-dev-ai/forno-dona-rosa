const { test, expect } = require('@playwright/test');

const projects = new Set(['chromium-phone-320','chromium-phone-390','chromium-tablet','chromium-desktop']);

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(!projects.has(testInfo.project.name), 'representative variant-commerce matrix only');
  await page.goto('/');
});

test('size selector exposes medium, large and family with contextual pricing', async ({ page }) => {
  await page.locator('#pizza-select').selectOption('margherita');
  const size = page.locator('#size-select');
  await expect(size).toHaveCount(1);
  const labels = await size.locator('option').allTextContents();
  expect(labels).toHaveLength(3);
  expect(labels[0]).toMatch(/Média.*30 cm.*1–2.*R\$/);
  expect(labels[1]).toMatch(/Grande.*35 cm.*2–3.*R\$/);
  expect(labels[2]).toMatch(/Família.*40 cm.*3–5.*R\$/);
  await size.selectOption('familia');
  await expect(page.locator('#size-help')).toContainText('Família');
  await expect(page.locator('#price-preview')).not.toHaveText('R$ 0,00');
});

test('selected family variant persists into the Bag', async ({ page }) => {
  await page.locator('#pizza-select').selectOption('calabresa');
  await page.locator('#size-select').selectOption('familia');
  await page.locator('#order-form button[type="submit"]').click();
  await page.locator('#open-cart').click();
  await expect(page.locator('#cart-dialog')).toBeVisible();
  await expect(page.locator('#cart-items')).toContainText('Família');
  await expect(page.locator('#cart-items')).toContainText('40 cm');
});

test('half-and-half keeps only common available variants', async ({ page }) => {
  await page.locator('#pizza-select').selectOption('margherita');
  await page.locator('#half-half').check();
  await page.locator('#pizza-select-2').selectOption('quatro-formaggi');
  await expect(page.locator('#size-select option')).toHaveCount(3);
  await page.locator('#size-select').selectOption('grande');
  await expect(page.locator('#size-help')).toContainText('35 cm');
});
