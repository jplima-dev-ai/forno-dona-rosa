const { test, expect } = require('@playwright/test');
const { collectConsoleErrors } = require('../fixtures/helpers');

test('3.4.1 post-paint hydration keeps critical home flows operable', async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto('/');

  await page.waitForFunction(() => document.documentElement.dataset.fornoRuntime === 'hydrated');
  await page.waitForFunction(() => window.FORNO_APP && window.FORNO_CHECKOUT && window.FORNO_ROSA);

  await expect(page.locator('.menu-card').first()).toBeVisible();
  const add = page.locator('[data-quick-add]').first();
  await expect(add).toBeVisible();
  await add.click();
  await expect(page.locator('#cart-count')).not.toHaveText('0');

  await page.locator('#open-cart').click();
  await expect(page.locator('#cart-dialog')).toBeVisible();
  await page.locator('#send-cart').click();
  await expect(page.locator('#checkout-dialog')).toBeVisible();
  await expect(page.locator('#checkout-dialog-title')).toBeFocused();
  await page.locator('#checkout-close').click();

  await page.locator('[data-rosa-open]').first().click();
  await expect(page.locator('#rosa-dialog')).toBeVisible();
  await page.locator('#rosa-close').click();

  expect(errors).toEqual([]);
});
