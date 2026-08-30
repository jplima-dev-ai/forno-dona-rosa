const { expect } = require('@playwright/test');

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(overflow.scrollWidth, `horizontal overflow: ${JSON.stringify(overflow)}`).toBeLessThanOrEqual(overflow.clientWidth + 1);
}

async function collectConsoleErrors(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  return errors;
}

async function addCalabresa(page) {
  await page.goto('/menu/');
  const search = page.locator('#menu-search');
  await search.fill('calabreza');
  const add = page.locator('[data-quick-add="calabresa"]');
  await expect(add).toBeVisible();
  await add.click();
  await expect(page.locator('#cart-count')).not.toHaveText('0');
}

module.exports = { expectNoHorizontalOverflow, collectConsoleErrors, addCalabresa };
