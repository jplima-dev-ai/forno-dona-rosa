const { test, expect } = require('@playwright/test');

test.describe('3.4.0 Rosa Order Concierge stabilization', () => {
  test('adds an explicitly sized pizza through natural language', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[data-rosa-open]').first().click();
    const input=page.locator('#rosa-input');
    await input.fill('quero uma calabresa grande');
    await page.locator('#rosa-form').getByRole('button', { name: 'Enviar' }).click();
    await expect(page.locator('#rosa-log')).toContainText(/Calabresa Artesanal Grande/i);
    const added = await page.evaluate(() => window.FORNO_APP.getBagItems());
    expect(added.some((item) => item.pizzaId === 'calabresa' && item.size === 'grande')).toBe(true);
    await page.locator('#rosa-close').click();
    await page.getByRole('button', { name: /Sacola/i }).first().click();
    await expect(page.locator('#cart-items')).toContainText(/Grande/i);
  });

  test('size change requires confirmation and then updates the bag', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.FORNO_APP.addConfiguredBundle([{pizzaId:'calabresa',pizza2Id:null,size:'grande',crust:'tradicional',qty:1,remove:'',notes:''}]));
    await page.locator('button[data-rosa-open]').first().click();
    const input=page.locator('#rosa-input');
    await input.fill('troque a primeira pizza para família');
    await page.locator('#rosa-form').getByRole('button', { name: 'Enviar' }).click();
    await expect(page.locator('#rosa-log')).toContainText(/Você confirma/i);
    await input.fill('sim');
    await page.locator('#rosa-form').getByRole('button', { name: 'Enviar' }).click();
    await expect(page.locator('#rosa-log')).toContainText(/agora está no tamanho Família/i);
    const items=await page.evaluate(() => window.FORNO_APP.getBagItems());
    expect(items[0].size).toBe('familia');
  });

  test('price question never mutates the bag', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.FORNO_APP.addConfiguredBundle([{pizzaId:'calabresa',pizza2Id:null,size:'grande',crust:'tradicional',qty:1,remove:'',notes:''}]));
    const before=await page.evaluate(() => JSON.stringify(window.FORNO_APP.getBagItems()));
    await page.locator('button[data-rosa-open]').first().click();
    const input=page.locator('#rosa-input');
    await input.fill('quanto fica a calabresa família?');
    await page.locator('#rosa-form').getByRole('button', { name: 'Enviar' }).click();
    const after=await page.evaluate(() => JSON.stringify(window.FORNO_APP.getBagItems()));
    expect(after).toBe(before);
  });
});
