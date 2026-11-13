import { Page } from '@playwright/test';

export async function login(page: Page) {
  await page.goto('/login');

  await page.getByLabel('Email').fill('test123@example.com');
  await page.getByLabel('Password').fill('123456');

  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForURL('**/products');
}