const { test, expect } = require('@playwright/test');
const { expectNoHorizontalOverflow, addCalabresa } = require('../fixtures/helpers');

const mobileProjects = new Set(['chromium-phone-320','chromium-phone-390','chromium-phone-430','chromium-tablet','chromium-landscape']);

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(!mobileProjects.has(testInfo.project.name), 'mobile usability matrix only');
  await page.goto('/');
});

test('primary ordering path is understandable without opening secondary features', async ({ page }) => {
  const primary = page.getByRole('link', { name: 'Pedir agora' }).first();
  await expect(primary).toBeVisible();
  await primary.click();
  await expect(page).toHaveURL(/\/menu\/$/);
  await expect(page.locator('#menu-search')).toBeVisible();
  await expect(page.locator('#menu-grid')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test('customer can search, add and reach Bag with one-handed mobile controls', async ({ page }) => {
  await addCalabresa(page);
  const bagBar = page.locator('#mobile-bag-bar');
  if (await bagBar.isVisible()) await bagBar.click();
  else await page.locator('#open-cart').click();
  await expect(page.locator('#cart-dialog')).toBeVisible();
  await expect(page.locator('#cart-dialog button, #cart-dialog a').filter({ hasText: /endereço|continuar|pedido/i }).first()).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test('interactive targets remain practically tappable', async ({ page }) => {
  await page.goto('/menu/');
  const tooSmall = await page.evaluate(() => [...document.querySelectorAll('.btn, .small-action, .filter-chip, .mobile-nav a, .mobile-nav button, .cart-button, .site-search-button, .choice-card, input:not([type="hidden"]), select')]
    .filter(el => {
      const cs=getComputedStyle(el); if(cs.display==='none'||cs.visibility==='hidden'||el.disabled) return false;
      const r=el.getBoundingClientRect(); if(r.width===0||r.height===0) return false;
      return r.width < 40 || r.height < 40;
    }).slice(0,12).map(el => ({tag:el.tagName, text:(el.innerText||el.getAttribute('aria-label')||'').trim().slice(0,60), w:Math.round(el.getBoundingClientRect().width), h:Math.round(el.getBoundingClientRect().height)})));
  expect(tooSmall).toEqual([]);
});
