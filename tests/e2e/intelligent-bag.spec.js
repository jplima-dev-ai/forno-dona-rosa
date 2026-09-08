const { test, expect } = require('@playwright/test');

test('Bag edits family pizza without rebuilding the item', async ({ page }) => {
  await page.goto('/');
  await page.locator('#pizza-select').selectOption('margherita');
  await page.locator('#size-select').selectOption('grande');
  await page.getByRole('button', { name: 'Adicionar esta pizza à sacola' }).click();
  await page.locator('#open-cart').click();
  await page.getByRole('button', { name: 'Editar pizza' }).click();
  const editor = page.locator('[data-bag-editor]');
  await expect(editor).toBeVisible();
  await editor.locator('select[name="size"]').selectOption('familia');
  await editor.locator('select[name="crust"]').selectOption('catupiry');
  await editor.locator('input[name="remove"]').fill('cebola');
  await editor.locator('textarea[name="notes"]').fill('bem assada');
  await editor.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(page.locator('#cart-items')).toContainText('Família');
  await expect(page.locator('#cart-items')).toContainText('Catupiry');
  await expect(page.locator('#cart-items')).toContainText('Remover: cebola');
  await expect(page.locator('#cart-items')).toContainText('Obs.: bem assada');
});

test('cancel keeps original Bag configuration', async ({ page }) => {
  await page.goto('/');
  await page.locator('#pizza-select').selectOption('calabresa');
  await page.getByRole('button', { name: 'Adicionar esta pizza à sacola' }).click();
  await page.locator('#open-cart').click();
  await page.getByRole('button', { name: 'Editar pizza' }).click();
  const editor = page.locator('[data-bag-editor]');
  await editor.locator('select[name="size"]').selectOption('familia');
  await editor.getByRole('button', { name: 'Cancelar' }).click();
  await expect(page.locator('[data-bag-item-summary]').first()).toContainText('Média · 30 cm');
});
