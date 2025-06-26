import { expect, test } from "@playwright/test";

test.describe("Biome.js Blog", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("https://biomejs.dev/blog/");
	});

	test("should display blog index page", async ({ page }) => {
		await expect(page).toHaveTitle(/Blog/);
		await expect(page.locator("h1")).toContainText("Blog");
	});

	test("should list blog posts", async ({ page }) => {
		const blogPosts = page.locator("article");
		const postsCount = await blogPosts.count();
		expect(postsCount).toBeGreaterThan(0);
	});

	test("should show post metadata", async ({ page }) => {
		const firstPost = page.locator("article").first();

		// Check date
		await expect(firstPost.locator("time")).toBeVisible();

		// Check author
		await expect(firstPost.locator(".author")).toBeVisible();

		// Check title
		await expect(firstPost.locator("h2")).toBeVisible();
	});

	test("should have working post links", async ({ page }) => {
		const firstPostLink = page.locator("article a").first();
		const href = await firstPostLink.getAttribute("href");
		expect(href).toContain("/blog/");

		await firstPostLink.click();
		await expect(page).toHaveURL(/\/blog\/.+/);
	});

	test("should display post content correctly", async ({ page }) => {
		// Navigate to first blog post
		await page.locator("article a").first().click();

		// Check post structure
		await expect(page.locator("article")).toBeVisible();
		await expect(page.locator("h1")).toBeVisible();
		await expect(page.locator(".post-content")).toBeVisible();
	});

	test("should handle code snippets in posts", async ({ page }) => {
		// Navigate to first blog post
		await page.locator("article a").first().click();

		const codeBlocks = page.locator("pre code");
		if ((await codeBlocks.count()) > 0) {
			await expect(codeBlocks.first()).toBeVisible();
			await expect(page.locator(".token")).toBeVisible(); // Syntax highlighting
		}
	});

	test("should handle images in posts", async ({ page }) => {
		// Navigate to first blog post
		await page.locator("article a").first().click();

		const images = page.locator("article img");
		for (const image of await images.all()) {
			await expect(image).toBeVisible();
			const src = await image.getAttribute("src");
			expect(src).toBeTruthy();
		}
	});

	test("should have working social share buttons", async ({ page }) => {
		// Navigate to first blog post
		await page.locator("article a").first().click();

		const shareButtons = page.locator(".share-buttons a");
		for (const button of await shareButtons.all()) {
			const href = await button.getAttribute("href");
			expect(href).toMatch(/twitter\.com|linkedin\.com|facebook\.com/);
		}
	});

	test("should paginate blog posts", async ({ page }) => {
		const pagination = page.locator(".pagination");
		if (await pagination.isVisible()) {
			const nextButton = pagination.locator('a:has-text("Next")');
			if (await nextButton.isVisible()) {
				const currentPage = page.url();
				await nextButton.click();
				await expect(page.url()).not.toBe(currentPage);
			}
		}
	});

	test("should have working category filters", async ({ page }) => {
		const categories = page.locator(".category-filter");
		if ((await categories.count()) > 0) {
			await categories.first().click();
			await expect(page.url()).toContain("category=");
		}
	});

	test("should format dates correctly", async ({ page }) => {
		const dates = page.locator("time");
		for (const date of await dates.all()) {
			const dateText = await date.textContent();
			expect(dateText).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		}
	});

	test("should handle responsive images", async ({ page }) => {
		// Navigate to first blog post
		await page.locator("article a").first().click();

		const images = page.locator("article img");
		for (const image of await images.all()) {
			const srcset = await image.getAttribute("srcset");
			const loading = await image.getAttribute("loading");
			expect(loading).toBe("lazy");
			if (srcset) {
				expect(srcset).toContain("1x");
				expect(srcset).toContain("2x");
			}
		}
	});
});
