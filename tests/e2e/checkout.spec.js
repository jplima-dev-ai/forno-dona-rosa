const { test, expect } = require('@playwright/test');
const { addCalabresa } = require('../fixtures/helpers');

async function openCheckout(page) {
  await addCalabresa(page);
  await page.locator('#open-cart').click();
  await page.locator('#send-cart').click();
  await expect(page.locator('#checkout-dialog')).toBeVisible();
}

test('pickup never exposes delivery address fields', async ({ page }) => {
  await openCheckout(page);
  await page.locator('[data-test="fulfillment-pickup"]').check();
  const deliveryFields = page.locator('[data-delivery-fields]');
  const count = await deliveryFields.count();
  for (let i=0;i<count;i++) {
    await expect(deliveryFields.nth(i)).toBeHidden();
    const controls=deliveryFields.nth(i).locator('input,select,textarea,button');
    for(let j=0;j<await controls.count();j++) await expect(controls.nth(j)).toBeDisabled();
  }
  await expect(page.locator('[data-pickup-fields]')).toBeVisible();
});

test('cash change cannot be lower than order subtotal', async ({ page }) => {
  await openCheckout(page);
  await page.locator('[data-test="fulfillment-pickup"]').check();
  await page.locator('#checkout-name').fill('Cliente Teste');
  await page.locator('#checkout-payment-cash').check();
  await page.locator('#checkout-change-for').fill('1,00');
  await page.locator('#checkout-form button[type="submit"]').click();
  await expect(page.locator('#checkout-change-for-error')).toBeVisible();
});
