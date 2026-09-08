const { test, expect } = require('@playwright/test');

test('configurator exposes four semantic stages and review', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.configurator-steps li')).toHaveCount(4);
  await expect(page.locator('#configurator-step-1')).toContainText('Escolha tamanho e sabores');
  await expect(page.locator('#configurator-step-2')).toContainText('Personalize do seu jeito');
  await expect(page.locator('#configurator-review-title')).toHaveText('Revise sua pizza');
  await expect(page.getByRole('button', { name: 'Adicionar esta pizza à sacola' })).toBeVisible();
});

test('review follows flavor, family size, crust, quantity and notes', async ({ page }) => {
  await page.goto('/');
  await page.locator('#pizza-select').selectOption('dona-rosa');
  await page.locator('#size-select').selectOption('familia');
  await page.locator('#crust-select').selectOption('catupiry');
  await page.locator('#quantity').fill('2');
  await page.locator('#remove-ingredients').fill('cebola');
  await page.locator('#notes').fill('bem assada');
  await expect(page.locator('#config-review-flavor')).toContainText('Dona Rosa');
  await expect(page.locator('#config-review-size')).toContainText('Família');
  await expect(page.locator('#config-review-size')).toContainText('40 cm');
  await expect(page.locator('#config-review-crust')).toHaveText('Catupiry');
  await expect(page.locator('#config-review-qty')).toHaveText('2');
  await expect(page.locator('#config-review-remove')).toHaveText('cebola');
  await expect(page.locator('#config-review-notes')).toHaveText('bem assada');
});

test('submit adds reviewed family pizza to Bag', async ({ page }) => {
  await page.goto('/');
  await page.locator('#pizza-select').selectOption('margherita');
  await page.locator('#size-select').selectOption('familia');
  await page.getByRole('button', { name: 'Adicionar esta pizza à sacola' }).click();
  await page.locator('#open-cart').click();
  await expect(page.locator('#cart-items')).toContainText('Família');
  await expect(page.locator('#cart-items')).toContainText('Margherita');
});
