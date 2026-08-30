const { test, expect } = require('@playwright/test');
const { expectNoHorizontalOverflow, collectConsoleErrors } = require('../fixtures/helpers');

const routes = ['/', '/menu/', '/order/', '/about/', '/experience/', '/location/', '/help/', '/privacy/', '/articles/', '/articles/wood-fired-pizza-flavor/', '/categories/ingredients/', '/products/dona-rosa/', '/products/calabresa/'];

for (const route of routes) {
  test(`route ${route} is navigable and stable`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response && response.ok()).toBeTruthy();
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('.skip-link').first()).toHaveAttribute('href', '#main-content');
    await expectNoHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });
}

test('deep product URL can be opened directly', async ({ page }) => {
  await page.goto('/products/calabresa/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Calabresa/i);
  await expect(page.locator('[data-product-page-add="calabresa"]')).toBeVisible();
});
