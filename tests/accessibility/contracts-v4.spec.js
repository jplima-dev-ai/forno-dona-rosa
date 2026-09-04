const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const routes = ['/', '/menu/', '/order/', '/products/dona-rosa/', '/admin/'];
for (const route of routes) {
  test(`v4 accessibility contract: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'])
      .analyze();
    const blocking = results.violations.filter(v => ['serious','critical'].includes(v.impact));
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
    await expect(page.locator('main').first()).toBeVisible();
  });
}

test('Rosa dialog has an accessible focus lifecycle', async ({ page }) => {
  await page.goto('/');
  const opener = page.locator('[data-rosa-open]').first();
  await opener.focus();
  await opener.click();
  const dialog = page.locator('#rosa-dialog');
  await expect(dialog).toHaveAttribute('open', '');
  await expect(page.locator('#rosa-dialog-title')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toHaveAttribute('open', '');
  await expect(opener).toBeFocused();
});

test('reflow baseline has no page-level horizontal overflow at 320 CSS px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/menu/', { waitUntil: 'domcontentloaded' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow).toBe(false);
});

test('forced-colors and reduced-motion do not remove critical controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-rosa-open]').first()).toBeVisible();
  await expect(page.locator('main').first()).toBeVisible();
});
