import { expect, test } from "@playwright/test";

test.describe("Biome.js Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://biomejs.dev");
  });

  test("should have correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/Biome/);
  });

  test("should display main hero section", async ({ page }) => {
    const heroSection = page.locator(".hero-section");
    await expect(heroSection).toBeVisible();
    await expect(heroSection.locator("h1")).toContainText("Biome");
  });

  test("should have working navigation links", async ({ page }) => {
    const navLinks = page.locator("nav a");
    await expect(navLinks).toHaveCount(4); // Adjust based on actual nav items

    // Test each navigation link
    for (const link of await navLinks.all()) {
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href");
    }
  });

  test('should have functional "Get Started" button', async ({ page }) => {
    const getStartedButton = page.getByRole("link", { name: /get started/i });
    await expect(getStartedButton).toBeVisible();
    await expect(getStartedButton).toHaveAttribute("href", "/getting-started");
  });

  test("should display feature sections", async ({ page }) => {
    const featureSections = page.locator(".feature-section");
    await expect(featureSections).toHaveCount(3); // Adjust based on actual features count

    // Verify each feature section has content
    for (const section of await featureSections.all()) {
      await expect(section.locator("h2")).toBeVisible();
      await expect(section.locator("p")).toBeVisible();
    }
  });

  test("should have working GitHub link", async ({ page }) => {
    const githubLink = page.locator('a[href*="github.com"]').first();
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/biomejs/biome",
    );
  });

  test("should have working theme switcher", async ({ page }) => {
    const themeSwitcher = page.locator('button[aria-label*="theme"]');
    await expect(themeSwitcher).toBeVisible();

    // Click theme switcher
    await themeSwitcher.click();

    // Verify theme change (you might need to adjust the selector based on actual implementation)
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});
