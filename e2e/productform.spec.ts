
import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';
test('should show validation errors when submitting an empty product form', async ({ page }) => {
  await login(page);

  await page.goto('/products/new');

  await expect(
    page.getByRole('heading', { name: 'Product Form' })
  ).toBeVisible();

  await page.getByRole('button', { name: 'Save Product' }).click();

  await expect(page.getByText('Title is required')).toBeVisible();

  await expect(page.getByText('Price is required')).toBeVisible();

  await expect(page).toHaveURL(/\/products\/new$/);
});
test('should show validation error for whitespace-only title', async ({ page }) => {
  await login(page);
  await page.goto('/products/new');

  await page.getByLabel('Title:').fill('   ');
  await page.getByRole('button', { name: 'Save Product' }).click();

  await expect(
    page.getByText('Title cannot contain only spaces')
  ).toBeVisible();
});
test('should show validation error when title has fewer than 3 characters', async ({ page }) => {
  await login(page);
  await page.goto('/products/new');

  await page.getByLabel('Title:').fill('AB');
  await page.getByRole('button', { name: 'Save Product' }).click();

  await expect(
    page.getByText('Title must contain at least 3 characters')
  ).toBeVisible();
});
test('should show validation error when price is zero', async ({ page }) => {
  await login(page);
  await page.goto('/products/new');

  await page.getByLabel('Title:').fill('Test Product');
  await page.getByLabel('Price:').fill('0');

  await page.getByRole('button', { name: 'Save Product' }).click();

  await expect(
    page.getByText('Price must be greater than 0')
  ).toBeVisible();
});
test('should create a product with valid details and image', async ({ page }) => {
  await login(page);
  await page.goto('/products/new');

  // Enter product details
  await page.getByLabel('Title:').fill('Playwright Test Product');
  await page.getByLabel('Price:').fill('99');

  // Upload a small test PNG image
const imagePath = 'e2e/fixtures/test-product.svg';

await page.locator('input[type="file"]').setInputFiles(imagePath);

  // Verify image preview
  await expect(
    page.getByAltText('Product preview')
  ).toBeVisible();

  // Submit form
  await page.getByRole('button', { name: 'Save Product' }).click();

  // Successful creation should navigate to products
  await expect(page).toHaveURL(/\/products$/);
});
test('should show validation error when product image is missing', async ({ page }) => {
  await login(page);
  await page.goto('/products/new');

  await page.getByLabel('Title:').fill('Test Product');
  await page.getByLabel('Price:').fill('99');

  await page.getByRole('button', { name: 'Save Product' }).click();

  await expect(
    page.getByText('Product image is required')
  ).toBeVisible();

  await expect(page).toHaveURL(/\/products\/new$/);
});
test('should show validation error when title exceeds 50 characters', async ({ page }) => {
  await login(page);
  await page.goto('/products/new');

  // Enable the maximum length validator
  await page.getByRole('button', {
    name: 'Enable 50-character limit'
  }).click();

  // Enter 51 characters
  await page.getByLabel('Title:').fill('A'.repeat(51));

  await page.getByLabel('Price:').fill('99');

  await page.getByRole('button', { name: 'Save Product' }).click();

  await expect(
    page.getByText('Title cannot exceed 50 characters')
  ).toBeVisible();
});
test('should accept a title with exactly 50 characters', async ({ page }) => {
  await login(page);
  await page.goto('/products/new');

  await page.getByRole('button', {
    name: 'Enable 50-character limit'
  }).click();

  await page.getByLabel('Title:').fill('A'.repeat(50));
  await page.getByLabel('Price:').fill('99');

  await page.locator('input[type="file"]').setInputFiles(
    'e2e/fixtures/test-product.svg'
  );

  await page.getByRole('button', { name: 'Save Product' }).click();

  await expect(page).toHaveURL(/\/products$/);
});
test('should show validation error when price is negative', async ({ page }) => {
  await login(page);
  await page.goto('/products/new');

  await page.getByLabel('Title:').fill('Test Product');
  await page.getByLabel('Price:').fill('-10');

  await page.getByRole('button', { name: 'Save Product' }).click();

  await expect(
    page.getByText('Price must be greater than 0')
  ).toBeVisible();
});
test('should reset all product form fields and image preview', async ({ page }) => {
  await login(page);
  await page.goto('/products/new');

  // Enter product details
  await page.getByLabel('Title:').fill('Test Product');
  await page.getByLabel('Price:').fill('99');

  // Upload image
  await page.locator('input[type="file"]').setInputFiles(
    'e2e/fixtures/test-product.svg'
  );

  // Verify image preview exists
  await expect(
    page.getByAltText('Product preview')
  ).toBeVisible();

  // Click Reset
  await page.getByRole('button', { name: 'Reset' }).click();

  // Verify fields are cleared
  await expect(page.getByLabel('Title:')).toHaveValue('');
  await expect(page.getByLabel('Price:')).toHaveValue('');

  // Verify image preview is removed
  await expect(
    page.getByAltText('Product preview')
  ).toHaveCount(0);

  // Verify file input is cleared
  await expect(
    page.locator('input[type="file"]')
  ).toHaveValue('');
});
test('should stay on product form when clicking Stay in unsaved changes dialog', async ({ page }) => {
  await login(page);
  await page.goto('/products/new');

  // Make the form dirty
  await page.getByLabel('Title:').fill('Unsaved Product');

  // Try navigating away
  await page.getByRole('link', { name: 'Products' }).click();

  // Verify confirmation dialog
  await expect(
    page.getByRole('heading', { name: 'Unsaved Changes' })
  ).toBeVisible();

  // Choose Stay
  await page.getByRole('button', { name: 'Stay' }).click();

  // Verify dialog closes and user remains on the form
  await expect(
    page.getByRole('heading', { name: 'Unsaved Changes' })
  ).toHaveCount(0);

  await expect(page).toHaveURL(/\/products\/new$/);
});
test('should navigate away when clicking Leave in unsaved changes dialog', async ({ page }) => {
  await login(page);
  await page.goto('/products/new');

  // Make the form dirty
  await page.getByLabel('Title:').fill('Unsaved Product');

  // Try navigating away
  await page.getByRole('link', { name: 'Products' }).click();

  // Verify confirmation dialog
  await expect(
    page.getByRole('heading', { name: 'Unsaved Changes' })
  ).toBeVisible();

  // Choose Leave
  await page.getByRole('button', { name: 'Leave' }).click();

  // Verify navigation succeeds
  await expect(page).toHaveURL(/\/products$/);

  // Verify product listing appears
  await expect(
    page.getByRole('heading', { name: 'Product Management' })
  ).toBeVisible();
});
test('should navigate away without showing dialog when form is untouched', async ({ page }) => {
  await login(page);
  await page.goto('/products/new');

  await page.getByRole('link', { name: 'Products' }).click();

  await expect(page).toHaveURL(/\/products$/);

  await expect(
    page.getByRole('heading', { name: 'Unsaved Changes' })
  ).toHaveCount(0);
});
test('should load existing product details in the edit form', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');

  await expect(page.getByLabel('Title:')).toHaveValue(
    'Essence Mascara Lash Princess'
  );

  await expect(page.getByLabel('Price:')).toHaveValue('9.99');

  await expect(page.getByAltText('Product preview')).toBeVisible();
});
test('should update an existing product', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');

  // Change product details
  await page.getByLabel('Title:').fill('Updated Mascara');
  await page.getByLabel('Price:').fill('19.99');

  // Listen for PUT or PATCH response
  const updateResponse = page.waitForResponse(response =>
    response.url().includes('/products/1') &&
    ['PUT', 'PATCH'].includes(response.request().method())
  );

  // Save once
  await page.getByRole('button', { name: 'Save Product' }).click();

  // Get API response
  const response = await updateResponse;

  // Verify successful response
  expect(response.ok()).toBeTruthy();

  const updatedProduct = await response.json();

  // Verify updated values returned by API
  expect(updatedProduct.title).toBe('Updated Mascara');
  expect(updatedProduct.price).toBe(19.99);

  // Verify navigation
  await expect(page).toHaveURL(/\/products$/);
});
test('should show unsaved changes dialog when leaving edit form', async ({ page }) => {
  await login(page);
  await page.goto('/products/1/edit');

  await page.getByLabel('Title:').fill('Temporary Updated Title');

  await page.getByRole('link', { name: 'Products' }).click();

  await expect(
    page.getByRole('heading', { name: 'Unsaved Changes' })
  ).toBeVisible();

  await page.getByRole('button', { name: 'Stay' }).click();

  await expect(page).toHaveURL(/\/products\/1\/edit$/);
});
test('should discard changes and navigate away when clicking Leave', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');

  await page.getByLabel('Title:').fill('Temporary Product Name');

  await page.getByRole('link', { name: 'Products' }).click();

  // Verify confirmation dialog
  await expect(
    page.getByRole('heading', { name: 'Unsaved Changes' })
  ).toBeVisible();

  // Confirm leaving
  await page.getByRole('button', { name: 'Leave' }).click();

  // Verify navigation
  await expect(page).toHaveURL(/\/products$/);

  // Verify dialog is closed
  await expect(
    page.getByRole('heading', { name: 'Unsaved Changes' })
  ).toHaveCount(0);
});
test('should prevent updating product with empty title', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');

  await page.getByLabel('Title:').fill('');

  await page.getByRole('button', { name: 'Save Product' }).click();

  await expect(
    page.getByText('Title is required')
  ).toBeVisible();

  await expect(page).toHaveURL(/\/products\/1\/edit$/);
});
test('should prevent updating product with zero price', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');

  await page.getByLabel('Price:').fill('0');

  await page.getByRole('button', { name: 'Save Product' }).click();

  await expect(
    page.getByText('Price must be greater than 0')
  ).toBeVisible();

  await expect(page).toHaveURL(/\/products\/1\/edit$/);
});
test('should prevent updating product with whitespace-only title', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');

  await page.getByLabel('Title:').fill('   ');

  await page.getByRole('button', { name: 'Save Product' }).click();

  await expect(
    page.getByText('Title cannot contain only spaces')
  ).toBeVisible();

  await expect(page).toHaveURL(/\/products\/1\/edit$/);
});
test('should prevent updating product with negative price', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');

  await page.getByLabel('Price:').fill('-10');

  await page.getByRole('button', { name: 'Save Product' }).click();

  await expect(
    page.getByText('Price must be greater than 0')
  ).toBeVisible();

  await expect(page).toHaveURL(/\/products\/1\/edit$/);
});
test('should prevent updating product with title exceeding 50 characters', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');

  // Enable the 50-character validator
  await page.getByRole('button', {
    name: 'Enable 50-character limit'
  }).click();

  await page.getByLabel('Title:').fill('A'.repeat(51));

  await page.getByRole('button', {
    name: 'Save Product'
  }).click();

  await expect(
    page.getByText('Title cannot exceed 50 characters')
  ).toBeVisible();

  await expect(page).toHaveURL(/\/products\/1\/edit$/);
});
test('should allow updating product with exactly 50 characters', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');

  await page.getByRole('button', {
    name: 'Enable 50-character limit'
  }).click();

  const validTitle = 'A'.repeat(50);

  await page.getByLabel('Title:').fill(validTitle);

  await page.getByRole('button', {
    name: 'Save Product'
  }).click();

  await expect(page).toHaveURL(/\/products$/);
});
test('should retain existing image when updating product without selecting a new image', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');

  // Capture the existing image URL
  const imagePreview = page.getByAltText('Product preview');

  await expect(imagePreview).toBeVisible();

  const originalImage = await imagePreview.getAttribute('src');

  // Change only title and price
  await page.getByLabel('Title:').fill('Updated Mascara Without Image');
  await page.getByLabel('Price:').fill('29.99');

  // Verify existing image preview is retained
  await expect(imagePreview).toBeVisible();
  await expect(imagePreview).toHaveAttribute('src', originalImage!);

  // Listen for update API response
  const updateResponse = page.waitForResponse(response =>
    response.url().includes('/products/1') &&
    ['PUT', 'PATCH'].includes(response.request().method())
  );
console.log('Original image:', originalImage);
  await page.getByRole('button', { name: 'Save Product' }).click();

  const response = await updateResponse;

  expect(response.ok()).toBeTruthy();

  const updatedProduct = await response.json();
console.log('Updated API response:', updatedProduct);

  expect(updatedProduct.title).toBe('Updated Mascara Without Image');
  expect(updatedProduct.price).toBe(29.99);
 expect(updatedProduct.thumbnail).toBe(originalImage);

  await expect(page).toHaveURL(/\/products$/);
});
test('should update existing product with a new image', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');

  // Select a new image
  await page.locator('input[type="file"]').setInputFiles(
    'e2e/fixtures/test-product.svg'
  );

  // Verify new image preview
  const imagePreview = page.getByAltText('Product preview');

  await expect(imagePreview).toBeVisible();

  await expect(imagePreview).toHaveAttribute(
    'src',
    /^blob:/
  );

  // Update title and price
  await page.getByLabel('Title:').fill('Mascara With New Image');
  await page.getByLabel('Price:').fill('39.99');

  // Listen for API response
  const updateResponse = page.waitForResponse(response =>
    response.url().includes('/products/1') &&
    ['PUT', 'PATCH'].includes(response.request().method())
  );

  await page.getByRole('button', { name: 'Save Product' }).click();

  const response = await updateResponse;

  expect(response.ok()).toBeTruthy();

  const updatedProduct = await response.json();

  expect(updatedProduct.title).toBe('Mascara With New Image');
  expect(updatedProduct.price).toBe(39.99);

  await expect(page).toHaveURL(/\/products$/);
});
test('should navigate away without dialog when edit form is untouched', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');

  // Verify edit form loaded
  await expect(page.getByLabel('Title:')).toHaveValue(
    'Essence Mascara Lash Princess'
  );

  // Navigate away without changing anything
  await page.getByRole('link', { name: 'Products' }).click();

  // Verify navigation succeeds
  await expect(page).toHaveURL(/\/products$/);

  // Verify no unsaved changes dialog
  await expect(
    page.getByRole('heading', { name: 'Unsaved Changes' })
  ).toHaveCount(0);
});
test('should update only title while retaining existing image and price', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');

  const titleInput = page.getByLabel('Title:');
  const priceInput = page.getByLabel('Price:');
  const imagePreview = page.getByAltText('Product preview');

  const originalPrice = await priceInput.inputValue();
  const originalImage = await imagePreview.getAttribute('src');

  await titleInput.fill('Mascara Title Only Updated');

  await expect(priceInput).toHaveValue(originalPrice);
  await expect(imagePreview).toHaveAttribute('src', originalImage!);

  const updateResponse = page.waitForResponse(response =>
    response.url().includes('/products/1') &&
    ['PUT', 'PATCH'].includes(response.request().method())
  );

  await page.getByRole('button', { name: 'Save Product' }).click();

  const response = await updateResponse;
  expect(response.ok()).toBeTruthy();

  const updatedProduct = await response.json();

  expect(updatedProduct.title).toBe('Mascara Title Only Updated');
  expect(updatedProduct.price).toBe(Number(originalPrice));
  expect(updatedProduct.thumbnail).toBe(originalImage);

  await expect(page).toHaveURL(/\/products$/);
});
test('should update only price while retaining existing title and image', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');

  const titleInput = page.getByLabel('Title:');
  const priceInput = page.getByLabel('Price:');
  const imagePreview = page.getByAltText('Product preview');

  const originalTitle = await titleInput.inputValue();
  const originalImage = await imagePreview.getAttribute('src');

  await priceInput.fill('799.99');

  await expect(titleInput).toHaveValue(originalTitle);
  await expect(imagePreview).toHaveAttribute('src', originalImage!);

  const updateResponse = page.waitForResponse(response =>
    response.url().includes('/products/1') &&
    ['PUT', 'PATCH'].includes(response.request().method())
  );

  await page.getByRole('button', { name: 'Save Product' }).click();

  const response = await updateResponse;
  expect(response.ok()).toBeTruthy();

  const updatedProduct = await response.json();

  expect(updatedProduct.price).toBe(799.99);
  expect(updatedProduct.title).toBe(originalTitle);
  expect(updatedProduct.thumbnail).toBe(originalImage);

  await expect(page).toHaveURL(/\/products$/);
});

test('should prevent updating when price is empty', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');

  const priceInput = page.getByLabel('Price:');

  await priceInput.fill('');

  await page.getByRole('button', { name: 'Save Product' }).click();

  await expect(page.getByText('Price is required')).toBeVisible();

  await expect(page).toHaveURL(/\/products\/1\/edit$/);
});
test('should prevent updating when price is negative', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');

  await page.getByLabel('Price:').fill('-100');

  await page.getByRole('button', { name: 'Save Product' }).click();

  await expect(page.getByText('Price must be greater than 0')).toBeVisible();

  await expect(page).toHaveURL(/\/products\/1\/edit$/);
});
test('should restore original values when reset is clicked in edit mode', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');
  const titleInput = page.getByLabel('Title:');
const priceInput = page.getByLabel('Price:');
const imagePreview = page.getByAltText('Product preview');

await expect(titleInput).toHaveValue('Essence Mascara Lash Princess');



  const originalTitle = await titleInput.inputValue();
  const originalPrice = await priceInput.inputValue();
  const originalImage = await imagePreview.getAttribute('src');

  await titleInput.fill('Temporary Updated Title');
  await priceInput.fill('999');

  await page.getByRole('button', { name: 'Reset' }).click();

  await expect(titleInput).toHaveValue(originalTitle);
  await expect(priceInput).toHaveValue(originalPrice);
  await expect(imagePreview).toHaveAttribute('src', originalImage!);
});
test('should restore original image when reset is clicked after selecting a new image', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');

  const imagePreview = page.getByAltText('Product preview');

  const originalImage = await imagePreview.getAttribute('src');

await page.locator('input[type="file"]').setInputFiles(
  'e2e/fixtures/test-product.svg'
);

  await expect(imagePreview).toHaveAttribute('src', /^blob:/);

  await page.getByRole('button', { name: 'Reset' }).click();

  await expect(imagePreview).toHaveAttribute('src', originalImage!);
});
test('should clear validation errors when reset is clicked', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');

  await page.getByLabel('Title:').fill('');
  await page.getByLabel('Price:').fill('');

  await page.getByRole('button', { name: 'Save Product' }).click();

  await expect(page.getByText('Title is required')).toBeVisible();
  await expect(page.getByText('Price is required')).toBeVisible();

  await page.getByRole('button', { name: 'Reset' }).click();

  await expect(page.getByText('Title is required')).toHaveCount(0);
  await expect(page.getByText('Price is required')).toHaveCount(0);
});
test('should disable save button while saving', async ({ page }) => {
  await login(page);
  await page.goto('/products/1/edit');

  await page.getByLabel('Title:').fill('Updated Product');

  await page.route('**/products/1', async route => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    await route.continue();
  });

  const updateResponse = page.waitForResponse(response =>
    response.url().includes('/products/1') &&
    ['PUT', 'PATCH'].includes(response.request().method())
  );

  const saveButton = page.getByRole('button', { name: 'Save Product' });

  await saveButton.click();

  await expect(saveButton).toBeDisabled();

const response = await updateResponse;
expect(response.ok()).toBeTruthy();

await expect(page).toHaveURL(/\/products$/);

  
});
test('should navigate to product list after successful update', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');

  await page.getByLabel('Title:').fill('Navigation Test Product');

  const updateResponse = page.waitForResponse(response =>
    response.url().includes('/products/1') &&
    ['PUT', 'PATCH'].includes(response.request().method())
  );

  await page.getByRole('button', { name: 'Save Product' }).click();

  const response = await updateResponse;
  expect(response.ok()).toBeTruthy();

  await expect(page).toHaveURL(/\/products$/);

  await expect(
    page.getByText('Unsaved Changes')
  ).toHaveCount(0);
});
test('should enable save button after update failure', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');

  await page.getByLabel('Title:').fill('Failed Update Test');

  await page.route('**/products/1', async route => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Update failed' })
    });
  });

  const updateResponse = page.waitForResponse(response =>
    response.url().includes('/products/1') &&
    ['PUT', 'PATCH'].includes(response.request().method())
  );

  const saveButton = page.getByRole('button', { name: 'Save Product' });

  await saveButton.click();

  const response = await updateResponse;
  expect(response.status()).toBe(500);

  await expect(saveButton).toBeEnabled();
  await expect(page).toHaveURL(/\/products\/1\/edit$/);
});
test('should show unsaved changes dialog after failed update', async ({ page }) => {
  await login(page);

  await page.goto('/products/1/edit');

  await page.getByLabel('Title:').fill('Failed Update Test');

  await page.route('**/products/1', async route => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Update failed' })
    });
  });

  const updateResponse = page.waitForResponse(response =>
    response.url().includes('/products/1') &&
    ['PUT', 'PATCH'].includes(response.request().method())
  );

  await page.getByRole('button', { name: 'Save Product' }).click();

  const response = await updateResponse;
  expect(response.status()).toBe(500);

  await expect(
    page.getByRole('button', { name: 'Save Product' })
  ).toBeEnabled();

  await page.getByRole('link', { name: 'Products' }).click();

 await expect(
  page.getByRole('heading', { name: 'Unsaved Changes' })
).toBeVisible();

  await page.getByRole('button', { name: 'Stay' }).click();

  await expect(page).toHaveURL(/\/products\/1\/edit$/);
});
test('should navigate away when user chooses Leave after failed update', async ({ page }) => {
  // Step 1: Login
  await login(page);

  // Step 2: Open edit product page
  await page.goto('/products/1/edit');

  // Step 3: Wait until existing product is loaded
  const titleInput = page.getByLabel('Title:');

  await expect(titleInput).toHaveValue(
    'Essence Mascara Lash Princess'
  );

  // Step 4: Change product title
  await titleInput.fill('Failed Update Test');

  // Step 5: Log actual browser requests
  page.on('request', request => {
    if (request.url().includes('/products/')) {
      console.log(
        'REQUEST:',
        request.method(),
        request.url()
      );
    }
  });

  // Step 6: Log browser console messages
  // page.on('console', message => {
  //   console.log('BROWSER:', message.text());
  // });

  // Step 7: Intercept update API and return failure
  await page.route('**/products/1', async route => {
    // console.log('INTERCEPTED:', route.request().url());

    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Update failed'
      })
    });
  });

  // Step 8: Wait for update API response
  const updateResponsePromise = page.waitForResponse(
    response => {
      return (
        response.url().includes('/products/1') &&
        ['PUT', 'PATCH'].includes(
          response.request().method()
        )
      );
    },
    { timeout: 15000 }
  );

  // Step 9: Click Save
  await page.getByRole('button', {
    name: 'Save Product'
  }).click();

  // Step 10: Verify API failure
  const response = await updateResponsePromise;

  // console.log('RESPONSE STATUS:', response.status());

  expect(response.status()).toBe(500);

  // Step 11: Verify Save button is enabled again
  await expect(
    page.getByRole('button', {
      name: 'Save Product'
    })
  ).toBeEnabled();

  // Step 12: Click Products navigation link
  await page.getByRole('link', {
    name: 'Products'
  }).click();

  // Step 13: Verify unsaved changes dialog
  await expect(
    page.getByRole('heading', {
      name: 'Unsaved Changes'
    })
  ).toBeVisible();

  // Step 14: Choose Leave
  await page.getByRole('button', {
    name: 'Leave'
  }).click();

  // Step 15: Verify navigation
  await expect(page).toHaveURL(/\/products$/);
});
test('should retain existing image preview when file selection is cancelled', async ({ page }) => {
  // Step 1: Login
  await login(page);

  // Step 2: Open edit page
  await page.goto('/products/1/edit');

  // Step 3: Wait for existing image preview
  const imagePreview = page.getByAltText('Product preview');

  await expect(imagePreview).toBeVisible();

  // Step 4: Capture original image URL
  const originalImage = await imagePreview.getAttribute('src');

  expect(originalImage).toBeTruthy();

  // Step 5: Open file chooser
  const fileChooserPromise = page.waitForEvent('filechooser');

  await page.locator('input[type="file"]').click();

  const fileChooser = await fileChooserPromise;

  // Step 6: Simulate cancelling file selection
  await fileChooser.setFiles([]);

  // Step 7: Verify existing image is retained
  await expect(imagePreview).toHaveAttribute(
    'src',
    originalImage!
  );

  await expect(imagePreview).toBeVisible();
});