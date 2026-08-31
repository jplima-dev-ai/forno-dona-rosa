const { expect } = require('@playwright/test');

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    const clientWidth = root.clientWidth;
    const isInsideIntentionalHorizontalScroller = (element) => {
      let current = element.parentElement;
      while (current && current !== document.body) {
        const style = getComputedStyle(current);
        const overflowX = style.overflowX;
        const canScrollHorizontally = (overflowX === 'auto' || overflowX === 'scroll') && current.scrollWidth > current.clientWidth + 1;
        if (canScrollHorizontally) return true;
        current = current.parentElement;
      }
      return false;
    };
    const isInsideVisuallyClippedAccessibleRegion = (element) => {
      let current = element;
      while (current && current !== document.body) {
        const style = getComputedStyle(current);
        const rect = current.getBoundingClientRect();
        const clipped = style.clip !== 'auto' || style.clipPath !== 'none';
        const tinyHiddenBox = rect.width <= 2 && rect.height <= 2 && (style.overflow === 'hidden' || style.overflowX === 'hidden');
        if (clipped && tinyHiddenBox) return true;
        current = current.parentElement;
      }
      return false;
    };
    const offenders = Array.from(document.querySelectorAll('body *')).map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        element,
        tag: element.tagName.toLowerCase(),
        id: element.id || '',
        className: typeof element.className === 'string' ? element.className : '',
        left: Math.round(rect.left * 100) / 100,
        right: Math.round(rect.right * 100) / 100,
        width: Math.round(rect.width * 100) / 100,
      };
    }).filter((item) => {
      const escapesViewport = item.right > clientWidth + 1 || item.left < -1;
      return escapesViewport && !isInsideIntentionalHorizontalScroller(item.element) && !isInsideVisuallyClippedAccessibleRegion(item.element);
    }).slice(0, 12).map(({ element, ...item }) => item);
    return {
      scrollWidth: root.scrollWidth,
      clientWidth,
      offenders,
      rootOverflowX: getComputedStyle(root).overflowX,
      bodyOverflowX: getComputedStyle(document.body).overflowX,
    };
  });
  expect(overflow.offenders, `uncontained horizontal overflow: ${JSON.stringify(overflow)}`).toEqual([]);
  expect(overflow.scrollWidth, `root horizontal overflow: ${JSON.stringify(overflow)}`).toBeLessThanOrEqual(overflow.clientWidth + 1);
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
