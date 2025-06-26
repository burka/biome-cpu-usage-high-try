import { expect, test } from "@playwright/test";

test.describe("Biome.js Documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://biomejs.dev/reference");
  });

  test("should load documentation page", async ({ page }) => {
    await expect(page).toHaveTitle(/Reference/);
    await expect(page.locator("h1")).toContainText("Reference");
  });

  test("should navigate between documentation sections", async ({ page }) => {
    // Navigate to different sections
    const sections = ["analyzer", "formatter", "linter", "configuration"];

    for (const section of sections) {
      await page.goto(`https://biomejs.dev/${section}`);
      await expect(page).toHaveURL(new RegExp(section));
      await expect(page.locator("main")).toBeVisible();
    }
  });

  test("should have working pagination", async ({ page }) => {
    const nextButton = page.getByRole("link", { name: /next/i });
    const prevButton = page.getByRole("link", { name: /previous/i });

    // Verify navigation buttons
    await expect(nextButton).toBeVisible();
    await expect(prevButton).toBeVisible();

    // Navigate to next page
    const currentUrl = page.url();
    await nextButton.click();
    await expect(page.url()).not.toBe(currentUrl);
  });

  test("should handle mobile responsive layout", async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Check for mobile menu button
    const menuButton = page.getByRole("button", { name: /menu/i });
    await expect(menuButton).toBeVisible();

    // Open mobile menu
    await menuButton.click();

    // Verify sidebar is visible in mobile view
    const sidebar = page.locator(".sidebar");
    await expect(sidebar).toBeVisible();
  });
});
