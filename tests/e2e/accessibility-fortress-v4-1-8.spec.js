const { test, expect } = require('@playwright/test');

const viewports = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1366, height: 768 }
];

for (const viewport of viewports) {
  test(`4.1.8 ordering reflow ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow).toBe(false);
    await expect(page.locator('#portion-form')).toBeVisible();
    await expect(page.locator('#mesa-form')).toBeVisible();
    await expect(page.locator('#pairing-form')).toBeVisible();
  });
}

test('4.1.8 native controls and focus targets remain semantic', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#portion-adults')).toHaveAttribute('type','number');
  await expect(page.locator('#mesa-style')).toHaveJSProperty('tagName','SELECT');
  await expect(page.locator('#pairing-pizza')).toHaveJSProperty('tagName','SELECT');
  await expect(page.locator('#rosa-dialog')).toHaveJSProperty('tagName','DIALOG');
  await expect(page.locator('#checkout-dialog')).toHaveJSProperty('tagName','DIALOG');
});

test('4.1.8 reduced motion stylesheet is active', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const behavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  expect(behavior).toBe('auto');
});
