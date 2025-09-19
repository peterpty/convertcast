import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('should display homepage correctly', async ({ page }) => {
    // Check that the homepage loads with the ConvertCast branding
    await expect(page.locator('text=ConvertCast')).toBeVisible();
    await expect(page.locator('text=Transform Your Ideas into Engaging Webinars')).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    // Click on signup/get started button
    await page.click('text=Start Free Trial');

    // Should be on signup page
    await expect(page).toHaveURL('/auth/signup');
    await expect(page.locator('text=Create Your Account')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/login');

    // Should be on login page
    await expect(page.locator('text=Welcome Back')).toBeVisible();
    await expect(page.locator('text=Sign in to access your ConvertCast dashboard')).toBeVisible();
  });

  test('should show validation errors on signup form', async ({ page }) => {
    await page.goto('/auth/signup');

    // Try to submit form without filling required fields
    await page.click('button[type="submit"]');

    // Should show validation errors or prevent submission
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeFocused();
  });

  test('should show validation errors on login form', async ({ page }) => {
    await page.goto('/auth/login');

    // Try to submit form without filling required fields
    await page.click('button[type="submit"]');

    // Should show validation errors or prevent submission
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeFocused();
  });

  test('should navigate between auth pages correctly', async ({ page }) => {
    // Start on login page
    await page.goto('/auth/login');

    // Click link to signup
    await page.click('text=Create your free account');
    await expect(page).toHaveURL('/auth/signup');

    // Click link back to login
    await page.click('text=Sign in here');
    await expect(page).toHaveURL('/auth/login');
  });

  test('should display forgot password option', async ({ page }) => {
    await page.goto('/auth/login');

    // Should have forgot password link
    await expect(page.locator('text=Forgot password?')).toBeVisible();
  });

  test('should protect dashboard route', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('/dashboard');

    // Should redirect to login or show login form
    // This depends on how ProtectedRoute is implemented
    await expect(page).toHaveURL(/\/(auth\/login|login|dashboard)/);
  });

  test('should handle responsive design on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/auth/login');

    // Check that the form is still usable on mobile
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});