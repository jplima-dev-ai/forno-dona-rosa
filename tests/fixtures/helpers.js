const { expect } = require('@playwright/test');

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    const clientWidth = root.clientWidth;
    const offenders = Array.from(document.querySelectorAll('body *')).map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        tag: element.tagName.toLowerCase(),
        id: element.id || '',
        className: typeof element.className === 'string' ? element.className : '',
        left: Math.round(rect.left * 100) / 100,
        right: Math.round(rect.right * 100) / 100,
        width: Math.round(rect.width * 100) / 100,
      };
    }).filter((item) => item.right > clientWidth + 1 || item.left < -1).slice(0, 12);
    return { scrollWidth: root.scrollWidth, clientWidth, offenders };
  });
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
