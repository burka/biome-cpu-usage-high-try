import { expect, test } from "@playwright/test";

test.describe("Biome.js Documentation", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("https://biomejs.dev/reference");
	});

	test("should load documentation page", async ({ page }) => {
		await expect(page).toHaveTitle(/Reference/);
		await expect(page.locator("h1")).toContainText("Reference");
	});

	test("should have working sidebar navigation", async ({ page }) => {
		const sidebar = page.locator(".sidebar");
		await expect(sidebar).toBeVisible();

		// Check for sidebar categories
		const sidebarCategories = sidebar.locator(".category");
		await expect(sidebarCategories).toHaveCount(5); // Adjust based on actual categories
	});

	test("should have working search functionality", async ({ page }) => {
		const searchButton = page.getByRole("button", { name: /search/i });
		await expect(searchButton).toBeVisible();

		// Open search
		await searchButton.click();

		// Search input should be visible
		const searchInput = page.getByRole("textbox", { name: /search/i });
		await expect(searchInput).toBeVisible();

		// Type a search term
		await searchInput.fill("linter");

		// Wait for search results
		const searchResults = page.locator(".search-results");
		await expect(searchResults).toBeVisible();
		await expect(searchResults.locator("li")).toHaveCount(1);
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

	test("should display code examples properly", async ({ page }) => {
		// Navigate to a page with code examples
		await page.goto("https://biomejs.dev/reference/configuration");

		const codeBlocks = page.locator("pre code");
		await expect(codeBlocks).toBeVisible();

		// Verify syntax highlighting
		const highlightedCode = page.locator(".token");
		await expect(highlightedCode).toBeVisible();
	});

	test("should have working copy code buttons", async ({ page }) => {
		await page.goto("https://biomejs.dev/reference/configuration");

		const copyButtons = page.locator('button[aria-label*="copy"]');
		await expect(copyButtons).toBeVisible();

		// Click first copy button
		await copyButtons.first().click();

		// Verify copy feedback (might need adjustment based on actual implementation)
		await expect(copyButtons.first()).toHaveText(/copied/i);
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
