import { test, expect } from '@playwright/test';

test('application should load successfully', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/products/);
});


// test('inspect products page', async ({ page }) => {
//   await page.goto('/');

//   console.log('URL:', page.url());
//   console.log('TITLE:', await page.title());
//   console.log('PAGE CONTENT:', await page.locator('body').innerText());
// });
test('login page should display all elements', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByRole('heading', {
    name: 'Welcome back'
  })).toBeVisible();

  await expect(page.getByText('Login to your account')).toBeVisible();

  await expect(page.getByText('Email', { exact: true })).toBeVisible();

  await expect(page.getByText('Password', { exact: true })).toBeVisible();

  await expect(page.getByRole('button', {
    name: 'Login'
  })).toBeVisible();

  await expect(page.getByRole('link', {
    name: 'Register'
  })).toBeVisible();
  
});
test('user should be able to enter login credentials', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill('test@example.com');

  await page.getByLabel('Password').fill('password123');

  await expect(page.getByLabel('Email')).toHaveValue('test@example.com');

  await expect(page.getByLabel('Password')).toHaveValue('password123');
});
test('user should login successfully and navigate to products', async ({ page }) => {
  await page.goto('/login');

  // Enter valid credentials
  await page.getByLabel('Email').fill('test123@example.com');
  await page.getByLabel('Password').fill('123456');

  // Submit login form
  await page.getByRole('button', { name: 'Login' }).click();

  // Verify successful navigation
  await expect(page).toHaveURL(/\/products$/);

  // Verify authentication token is saved
  const token = await page.evaluate(() => localStorage.getItem('token'));

  expect(token).toBeTruthy();
});
test('should display an error for invalid login credentials', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill('test123@example.com');
  await page.getByLabel('Password').fill('wrongpassword');

  await page.getByRole('button', { name: 'Login' }).click();

  // User should remain on login page
  await expect(page).toHaveURL(/\/login/);

  // Error message should be visible
  await expect(page.locator('.error-message')).toBeVisible();

  // Authentication token should not be saved
  const token = await page.evaluate(() =>
    localStorage.getItem('token')
  );

  expect(token).toBeNull();
});
test('unauthenticated user should be redirected to login', async ({ page }) => {
  // Start without an authentication token
  await page.goto('/');

  await page.evaluate(() => localStorage.removeItem('token'));

  // Try to access the protected page
  await page.goto('/products');

  // Verify guard redirects to login
  await expect(page).toHaveURL(/\/login/);

  // Verify the original destination is preserved
  await expect(page).toHaveURL(/returnUrl=%2Fproducts/);
});
test('authenticated user should be able to logout', async ({ page }) => {
  // Login
  await page.goto('/login');

  await page.getByLabel('Email').fill('test123@example.com');
  await page.getByLabel('Password').fill('123456');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/\/products$/);

  // Verify token exists
  await expect.poll(() =>
    page.evaluate(() => localStorage.getItem('token'))
  ).not.toBeNull();

  // Open profile dropdown
  await page.getByRole('button', {
    name: 'Toggle profile menu'
  }).click();

  // Verify dropdown is visible
  await expect(page.locator('.profile-dropdown')).toBeVisible();

  // Click Logout
  await page.getByRole('button', {
    name: 'Logout'
  }).click();

  // Verify navigation
  await expect(page).toHaveURL(/\/login/);

  // Verify token is removed
  await expect.poll(() =>
    page.evaluate(() => localStorage.getItem('token'))
  ).toBeNull();
  // Try accessing protected route after logout
await page.goto('/products');

// Auth guard should redirect to login
await expect(page).toHaveURL(/\/login/);
});

test('authenticated session should persist after page reload', async ({ page }) => {
  // Login
  await page.goto('/login');

  await page.getByLabel('Email').fill('test123@example.com');
  await page.getByLabel('Password').fill('123456');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/\/products$/);

  // Reload browser
  await page.reload();

  // Verify session is restored
  await expect(page).toHaveURL(/\/products$/);

  // Verify token still exists
  await expect.poll(() =>
    page.evaluate(() => localStorage.getItem('token'))
  ).not.toBeNull();
});
test('should redirect user to originally requested page after login', async ({ page }) => {
  // Attempt to access protected page
  await page.goto('/products');

  // Verify redirect to login
  await expect(page).toHaveURL(/\/login/);

  // Login
  await page.getByLabel('Email').fill('test123@example.com');
  await page.getByLabel('Password').fill('123456');

  await page.getByRole('button', { name: 'Login' }).click();

  // Verify redirect to original destination
  await expect(page).toHaveURL(/\/products$/);
});
test('should navigate to register page from login', async ({ page }) => {
  await page.goto('/login');

  await page.getByRole('link', { name: 'Register' }).click();

  await expect(page).toHaveURL(/\/register$/);
});
test('should display register page correctly', async ({ page }) => {
  await page.goto('/register');

  await expect(
    page.getByRole('heading', { name: 'Create Account' })
  ).toBeVisible();

  await expect(
    page.getByText('Create your account to get started')
  ).toBeVisible();

  await expect(page.getByLabel('Name')).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();

  await expect(
    page.getByRole('button', { name: 'Register' })
  ).toBeVisible();

  await expect(
    page.getByRole('link', { name: 'Login' })
  ).toBeVisible();
});
test('should validate required registration fields', async ({ page }) => {
  await page.goto('/register');

  const name = page.getByLabel('Name');
  const email = page.getByLabel('Email');
  const password = page.getByLabel('Password');

  // Trigger name validation
  await name.fill('Test');
  await name.clear();
  await name.blur();

  // Trigger email validation
  await email.fill('invalid-email');
  await email.clear();
  await email.blur();

  // Trigger password validation
  await password.fill('123456');
  await password.clear();
  await password.blur();

  // Verify validation messages
  await expect(page.getByText('Name is required.')).toBeVisible();

  await expect(
    page.getByText('Enter a valid email address.')
  ).toBeVisible();

  await expect(
    page.getByText('Password must be at least 6 characters.')
  ).toBeVisible();
});


test('should validate email format and password minimum length', async ({ page }) => {
  await page.goto('/register');

  await page.getByLabel('Name').fill('Test User');

  const email = page.getByLabel('Email');
  await email.fill('invalid-email');
  await email.blur();

  const password = page.getByLabel('Password');
  await password.fill('123');
  await password.blur();

  // Verify email validation
  await expect(
    page.getByText('Enter a valid email address.')
  ).toBeVisible();

  // Verify password minimum length
  await expect(
    page.getByText('Password must be at least 6 characters.')
  ).toBeVisible();

  // Register button should remain disabled
  await expect(
    page.getByRole('button', { name: 'Register' })
  ).toBeDisabled();
});

test('should navigate to login page from register', async ({ page }) => {
  await page.goto('/register');

  await page.getByRole('link', { name: 'Login' }).click();

  await expect(page).toHaveURL(/\/login$/);

  await expect(
    page.getByRole('heading', { name: 'Welcome back' })
  ).toBeVisible();
});
test('should register a new user and redirect to login', async ({ page }) => {
  const email = `playwright-${Date.now()}@example.com`;

  await page.goto('/register');

  await page.getByLabel('Name').fill('Playwright Test User');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('Test123456');

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole('heading', { name: 'Welcome back' })
  ).toBeVisible();
});
test.only('should show an error when registering with an existing email', async ({ page }) => {
  await page.goto('/register');

  await page.getByLabel('Name').fill('Existing User');
  await page.getByLabel('Email').fill('test123@example.com');
  await page.getByLabel('Password').fill('Test123456');

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.locator('.error-message')).toBeVisible();
  await expect(page).toHaveURL(/\/register$/);
});