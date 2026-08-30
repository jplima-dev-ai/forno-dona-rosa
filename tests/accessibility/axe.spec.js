const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const routes = ['/', '/menu/', '/order/', '/products/dona-rosa/', '/location/', '/help/', '/articles/', '/articles/wood-fired-pizza-flavor/', '/admin/'];

for (const route of routes) {
  test(`axe serious/critical gate: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
    const blocking = results.violations.filter(v => ['serious','critical'].includes(v.impact));
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });
}

test('critical dialogs expose names and usable close paths', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-rosa-open]').first().click();
  await expect(page.locator('#rosa-dialog')).toHaveAttribute('open', '');
  await expect(page.locator('#rosa-dialog-title')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#rosa-dialog')).not.toHaveAttribute('open', '');
});
