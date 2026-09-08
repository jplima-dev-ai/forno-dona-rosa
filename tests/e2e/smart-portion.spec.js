const { test, expect } = require('@playwright/test');
const representative = new Set(['chromium-phone-320','chromium-phone-390','chromium-tablet','chromium-desktop']);
test.beforeEach(async ({ page }, testInfo) => {
  test.skip(!representative.has(testInfo.project.name), 'representative smart-portion matrix only');
  await page.goto('./');
});
test('Smart Portion recommends a family pizza for four adults', async ({ page }) => {
  await page.locator('#portion-adults').fill('4');
  await page.locator('#portion-children').fill('0');
  await page.getByRole('button',{name:'Calcular sugestão'}).click();
  await expect(page.locator('#portion-result')).toBeVisible();
  await expect(page.locator('#portion-result-summary')).toContainText('Família');
  await expect(page.locator('#portion-result-detail')).toContainText('Estimativa de referência');
});
test('high appetite changes the recommendation for three adults', async ({ page }) => {
  await page.locator('#portion-adults').fill('3');
  await page.locator('#portion-form').getByRole('radio', { name: /Alto/ }).check();
  await page.getByRole('button',{name:'Calcular sugestão'}).click();
  await expect(page.locator('#portion-result-summary')).toContainText('Família');
});
test('suggested size can be handed off to configurator', async ({ page }) => {
  await page.locator('#portion-adults').fill('4');
  await page.getByRole('button',{name:'Calcular sugestão'}).click();
  await page.getByRole('button',{name:/Usar tamanho Família/}).click();
  await expect(page.locator('#size-select')).toHaveValue('familia');
});
test('planner does not cause horizontal page overflow', async ({ page }) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBeFalsy();
});
