const { test, expect } = require('@playwright/test');

test('3.4.0 critical configured commerce path survives reload', async ({ page }) => {
  await page.goto('/');
  await page.locator('#pizza-select').selectOption('calabresa');
  await page.locator('#size-select').selectOption('familia');
  await page.getByRole('button', { name: 'Adicionar esta pizza à sacola' }).click();
  await page.reload();
  await page.locator('#open-cart').click();
  await expect(page.locator('#cart-items')).toContainText('Família');
  await expect(page.locator('#cart-items')).toContainText('Calabresa');
});

test('3.4.0 Bag edit remains reversible before checkout', async ({ page }) => {
  await page.goto('/');
  await page.locator('#pizza-select').selectOption('margherita');
  await page.getByRole('button', { name: 'Adicionar esta pizza à sacola' }).click();
  await page.locator('#open-cart').click();
  await page.getByRole('button', { name: 'Editar pizza' }).click();
  const editor=page.locator('[data-bag-editor]');
  await editor.locator('select[name="size"]').selectOption('familia');
  await editor.getByRole('button', { name: 'Cancelar' }).click();
  await expect(page.locator('[data-bag-item-summary]').first()).toContainText('Média · 30 cm');
});

test('3.4.0 checkout keeps pickup isolated from address fields', async ({ page }) => {
  await page.goto('/');
  await page.locator('#pizza-select').selectOption('dona-rosa');
  await page.getByRole('button', { name: 'Adicionar esta pizza à sacola' }).click();
  await page.locator('#open-cart').click();
  await page.locator('#send-cart').click();
  await page.locator('#checkout-fulfillment-pickup').check();
  await expect(page.locator('[data-delivery-fields]:visible')).toHaveCount(0);
});

test('3.4.0 Rosa price query does not mutate Bag', async ({ page }) => {
  await page.goto('/');
  await page.locator('#pizza-select').selectOption('calabresa');
  await page.getByRole('button', { name: 'Adicionar esta pizza à sacola' }).click();
  const before=await page.evaluate(()=>window.FORNO_APP.getBagItems());
  await page.locator('[data-rosa-open]').first().click();
  await page.locator('#rosa-input').fill('quanto fica a calabresa família?');
  await page.locator('#rosa-form').getByRole('button', { name: /enviar/i }).click();
  const after=await page.evaluate(()=>window.FORNO_APP.getBagItems());
  expect(after).toEqual(before);
});

test('3.4.0 fortress is active on nested static page', async ({ page }) => {
  await page.goto('/menu/');
  const hrefs=await page.locator('link[rel="stylesheet"]').evaluateAll(els=>els.map(e=>e.getAttribute('href')));
  expect(hrefs.some(h=>h&&h.includes('accessibility-fortress-v4-1-8.css'))).toBe(true);
});
