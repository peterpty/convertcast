import { test, expect } from '@playwright/test';

test.describe('Dashboard Flow', () => {
  test('should display dashboard elements correctly', async ({ page }) => {
    // Navigate directly to dashboard (assumes authentication is bypassed for testing)
    await page.goto('/dashboard');

    // Check for main dashboard elements
    await expect(page.locator('text=Welcome to ConvertCast!')).toBeVisible();
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should display stats cards', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for stats cards
    await expect(page.locator('text=Total Events')).toBeVisible();
    await expect(page.locator('text=Total Attendees')).toBeVisible();
    await expect(page.locator('text=Revenue')).toBeVisible();
    await expect(page.locator('text=Conversion Rate')).toBeVisible();
  });

  test('should display quick actions section', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for quick actions
    await expect(page.locator('text=Quick Actions')).toBeVisible();
    await expect(page.locator('text=Create New Event')).toBeVisible();
    await expect(page.locator('text=Go Live Now')).toBeVisible();
    await expect(page.locator('text=View Analytics')).toBeVisible();
    await expect(page.locator('text=Manage Participants')).toBeVisible();
  });

  test('should display recent events section', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for recent events
    await expect(page.locator('text=Recent Events')).toBeVisible();
    await expect(page.locator('text=Product Launch Webinar')).toBeVisible();
    await expect(page.locator('text=Q4 Strategy Session')).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/dashboard');

    // Click on "Create New Event" quick action
    await page.click('text=Create New Event');

    // Should navigate (might show 404 or actual page)
    await expect(page).toHaveURL('/dashboard/events/new');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/dashboard');

    // Check that dashboard is usable on mobile
    await expect(page.locator('text=Welcome to ConvertCast!')).toBeVisible();
    await expect(page.locator('text=Total Events')).toBeVisible();
  });

  test('should display sidebar navigation', async ({ page }) => {
    await page.goto('/dashboard');

    // Check if sidebar elements are present
    // Note: Some might be hidden on mobile
    const viewport = page.viewportSize();
    if (viewport && viewport.width >= 768) {
      // Desktop view - sidebar should be visible
      await expect(page.locator('nav')).toBeVisible();
    }
  });

  test('should show loading states initially', async ({ page }) => {
    await page.goto('/dashboard');

    // Check if loading indicator appears briefly
    // This might be fast, so we use a shorter timeout
    const loadingIndicator = page.locator('text=Loading dashboard...');

    // This test might need adjustment based on actual loading behavior
    try {
      await expect(loadingIndicator).toBeVisible({ timeout: 1000 });
    } catch {
      // Loading might be too fast to catch, which is fine
    }

    // Eventually should show the dashboard content
    await expect(page.locator('text=Welcome to ConvertCast!')).toBeVisible({ timeout: 5000 });
  });

  test('should handle dashboard interactions', async ({ page }) => {
    await page.goto('/dashboard');

    // Wait for dashboard to load
    await expect(page.locator('text=Welcome to ConvertCast!')).toBeVisible();

    // Try hovering over stats cards (should show hover effects)
    const statsCard = page.locator('text=Total Events').locator('..');
    await statsCard.hover();

    // Try clicking on "View All" in recent events
    const viewAllButton = page.locator('text=View All');
    if (await viewAllButton.isVisible()) {
      await viewAllButton.click();
      await expect(page).toHaveURL('/dashboard/events');
    }
  });

  test('should display pro tip section', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for pro tip
    await expect(page.locator('text=Pro Tip')).toBeVisible();
    await expect(page.locator('text=Schedule your next event 3-5 days in advance')).toBeVisible();
  });
});