import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test('should display the product management page', async ({ page }) => {
  await login(page);

  await expect(
    page.getByRole('heading', { name: 'Product Management' })
  ).toBeVisible();

  await expect(
    page.getByText('Manage and organize your product inventory.')
  ).toBeVisible();

  await expect(
    page.getByRole('button', { name: /Create Product/ })
  ).toBeVisible();

  await expect(page.locator('app-product-list')).toBeVisible();
});
test('should navigate to the create product page', async ({ page }) => {
  await login(page);

  await page.getByRole('button', { name: /Create Product/ }).click();

  await expect(page).toHaveURL(/\/products\/new$/);
});
test('should display the create product form', async ({ page }) => {
  await login(page);
  await page.goto('/products/new');

  await expect(
    page.getByRole('heading', { name: 'Product Form' })
  ).toBeVisible();

  await expect(page.getByLabel('Title:')).toBeVisible();
  await expect(page.getByLabel('Price:')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Product Image:' })).toBeVisible();

  await expect(
    page.getByRole('button', { name: 'Save Product' })
  ).toBeVisible();
});
test('should display product records with IDs, prices and actions', async ({ page }) => {
  await login(page);

  const firstRow = page.locator('.products-table tbody tr').first();

  await expect(firstRow).toBeVisible();

  await expect(firstRow.locator('.product-id')).toBeVisible();
  await expect(firstRow.locator('.product-price')).toBeVisible();

  await expect(
    firstRow.getByRole('button', { name: 'View' })
  ).toBeVisible();

  await expect(
    firstRow.getByRole('button', { name: 'Delete' })
  ).toBeVisible();
});
test('should navigate to product details when clicking View', async ({ page }) => {
  await login(page);

  const firstRow = page.locator('.products-table tbody tr').first();

  const productId = await firstRow
    .locator('.product-id')
    .innerText();

  await firstRow.getByRole('button', { name: 'View' }).click();

  await expect(page).toHaveURL(new RegExp(`/products/${productId.replace('#', '')}$`));
});
test('should keep product when delete is cancelled', async ({ page }) => {
  await login(page);

  const firstRow = page.locator('.products-table tbody tr').first();

  const productId = await firstRow.locator('.product-id').innerText();

  page.on('dialog', async dialog => {
    // TODO: Accept or dismiss the confirmation?
    await dialog.dismiss();
  });

  await firstRow.getByRole('button', { name: 'Delete' }).click();

  // TODO: Verify that the same product row still exists.
  await expect(
    page.getByText(productId, { exact: true })
  ).toBeVisible();
});
test('should delete product when confirmation is accepted', async ({ page }) => {
  await login(page);

  const firstRow = page.locator('.products-table tbody tr').first();

  const productId = await firstRow.locator('.product-id').innerText();

  // Register dialog handler
  page.on('dialog', async dialog => {
    // TODO: Accept or dismiss the confirmation?
    await dialog.accept();
  });
  // Click Delete
  await firstRow.getByRole('button', { name: 'Delete' }).click();
  // Verify product is removed
  await expect(
    page.getByText(productId, { exact: true })
  ).toHaveCount(0);
});
test('should navigate to the next page of products', async ({ page }) => {
  await login(page);

  const firstRow = page.locator('.products-table tbody tr').first();
  const firstProductId = await firstRow.locator('.product-id').innerText();

  await page.getByRole('button', { name: 'Next' }).click();

  await expect(page).toHaveURL(/page=2/);

  await expect(
    page.getByRole('button', { name: '2', exact: true })
  ).toBeDisabled();

  await expect(
    page.getByText(firstProductId, { exact: true })
  ).toHaveCount(0);
});
test('should navigate to the previous page of products', async ({ page }) => {
  await login(page);

  const firstRow = page.locator('.products-table tbody tr').first();
  const firstProductId = await firstRow.locator('.product-id').innerText();

  await page.getByRole('button', { name: 'Next' }).click();

  await expect(page).toHaveURL(/page=2/);

  // Your implementation starts here
    await expect(
    page.getByRole('button', { name: '2', exact: true })
  ).toBeDisabled();

  await expect(
    page.getByText(firstProductId, { exact: true })
  ).toHaveCount(0);
   await page.getByRole('button', { name: 'Previous' }).click();
    await expect(page).toHaveURL(/page=1/);
       await expect(
    page.getByRole('button', { name: '1', exact: true })
  ).toBeDisabled();
   await expect(
    page.getByText(firstProductId, { exact: true })
  ).toBeVisible();
});
test('should filter products by search term', async ({ page }) => {
 await login(page);

  const searchInput = page.getByRole('textbox', {
    name: 'Search products...'
  });

  await searchInput.fill('phone');

  await expect(page).toHaveURL(/search=phone/);

  const productRows = page.locator('.products-table tbody tr');

  await expect(productRows).toHaveCount(10);

  await expect(productRows.first()).toBeVisible();

  await expect(
    page.getByText('Apple iPhone Charger', { exact: true })
  ).toBeVisible();
});
test('should sort products by price low to high', async ({ page }) => {
  await login(page);

  // Locate sorting dropdown
  const sortDropdown = page.getByRole('combobox', {
    name: 'Sort products'
  });

  // Select Price: Low to High
  await sortDropdown.selectOption({
    label: 'Price: Low to High'
  });

  // Verify URL contains ascending sort parameter
  await expect(page).toHaveURL(/sort=price-asc/);

  // Locate product rows
  const productRows = page.locator('.products-table tbody tr');

  // Wait for first two product rows
  await expect(productRows.nth(1)).toBeVisible();

  // Get first product price
  const firstPriceText = await productRows
    .nth(0)
    .locator('.product-price')
    .innerText();

  // Get second product price
  const secondPriceText = await productRows
    .nth(1)
    .locator('.product-price')
    .innerText();

  // Convert price strings into numbers
  const firstPrice = Number(firstPriceText.replace(/[^\d.]/g, ''));
  const secondPrice = Number(secondPriceText.replace(/[^\d.]/g, ''));

  // Verify ascending price order
  expect(firstPrice).toBeLessThanOrEqual(secondPrice);
});
test('should sort products by price high to low', async ({ page }) => {
  await login(page);

  // Locate sorting dropdown
  const sortDropdown = page.getByRole('combobox', {
    name: 'Sort products'
  });

  // Select Price: High to Low
  await sortDropdown.selectOption({
    label: 'Price: High to Low'
  });

  // Verify URL contains descending sort parameter
  await expect(page).toHaveURL(/sort=price-desc/);

  // Locate product rows
  const productRows = page.locator('.products-table tbody tr');

  // Wait for first two product rows
  await expect(productRows.nth(1)).toBeVisible();

  // Get first product price
  const firstPriceText = await productRows
    .nth(0)
    .locator('.product-price')
    .innerText();

  // Get second product price
  const secondPriceText = await productRows
    .nth(1)
    .locator('.product-price')
    .innerText();

  // Convert prices into numbers
  const firstPrice = Number(firstPriceText.replace(/[^\d.]/g, ''));
  const secondPrice = Number(secondPriceText.replace(/[^\d.]/g, ''));

  // Verify descending price order
  expect(firstPrice).toBeGreaterThanOrEqual(secondPrice);
});
test('should search and sort products by price', async ({ page }) => {
  await login(page);

  const searchInput = page.getByRole('textbox', {
    name: 'Search products...'
  });

  // Step 1: Search for phone
  await searchInput.fill('phone');

  // Wait for the initial search result
  await expect(
    page.getByText('Apple iPhone Charger', { exact: true })
  ).toBeVisible();

  // Step 2: Select ascending price sorting
  const sortDropdown = page.getByRole('combobox', {
    name: 'Sort products'
  });

  const sortResponse = page.waitForResponse(response =>
    response.url().includes('/products/search') &&
    response.url().includes('sortBy=price') &&
    response.url().includes('order=asc') &&
    response.ok()
  );

  await sortDropdown.selectOption({
    label: 'Price: Low to High'
  });

  // Wait for the sorted API response
  await sortResponse;

  // Step 3: Verify URL parameters
  await expect(page).toHaveURL(/search=phone/);
  await expect(page).toHaveURL(/sort=price-asc/);

  // Step 4: Read product prices
  const priceElements = page.locator(
    '.products-table tbody tr .product-price'
  );

  await expect(priceElements.first()).toBeVisible();

  const priceTexts = await priceElements.allInnerTexts();

  const prices = priceTexts.map(price =>
    Number(price.replace(/[^\d.]/g, ''))
  );

  // Step 5: Verify ascending order
  for (let i = 0; i < prices.length - 1; i++) {
    expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
  }
});
