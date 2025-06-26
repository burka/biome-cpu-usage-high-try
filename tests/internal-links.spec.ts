import { expect, test } from "@playwright/test";

test.describe("Biome.js Internal Links", () => {
	const pages = [
		"/",
		"/guides/getting-started",
		"/reference",
		"/blog",
		"/playground",
		"/guides",
		"/analyzer",
		"/formatter",
		"/linter",
	];

	test("should validate all internal links on homepage", async ({ page }) => {
		await page.goto("https://biomejs.dev");

		const internalLinks = page.locator('a[href^="/"]');
		const links = await internalLinks.all();

		for (const link of links) {
			const href = await link.getAttribute("href");
			expect(href).toBeTruthy();
			await link.click();
			await expect(page).toHaveURL(new RegExp(href.replace("/", "\\/")));
			await page.goBack();
		}
	});

	test("should validate navigation menu links", async ({ page }) => {
		await page.goto("https://biomejs.dev");

		const navLinks = page.locator("nav a");
		const links = await navLinks.all();

		for (const link of links) {
			const href = await link.getAttribute("href");
			if (href?.startsWith("/")) {
				await link.click();
				await expect(page).not.toHaveURL("https://biomejs.dev");
				await page.goBack();
			}
		}
	});

	test("should check all footer links", async ({ page }) => {
		await page.goto("https://biomejs.dev");

		const footerLinks = page.locator("footer a");
		const links = await footerLinks.all();

		for (const link of links) {
			const href = await link.getAttribute("href");
			if (href?.startsWith("/")) {
				await link.click();
				await expect(page).toHaveURL(new RegExp(href.replace("/", "\\/")));
				await page.goBack();
			}
		}
	});

	test("should validate documentation sidebar links", async ({ page }) => {
		await page.goto("https://biomejs.dev/reference");

		const sidebarLinks = page.locator(".sidebar a");
		const links = await sidebarLinks.all();

		for (const link of links) {
			const href = await link.getAttribute("href");
			if (href?.startsWith("/")) {
				await link.click();
				await expect(page).toHaveURL(new RegExp(href.replace("/", "\\/")));
				await page.goBack();
			}
		}
	});

	test("should check anchor links in documentation", async ({ page }) => {
		await page.goto("https://biomejs.dev/guides/getting-started");

		const anchorLinks = page.locator('a[href^="#"]');
		const links = await anchorLinks.all();

		for (const link of links) {
			const href = await link.getAttribute("href");
			await link.click();
			await expect(page.url()).toContain(href);
		}
	});

	test("should validate cross-references between guides", async ({ page }) => {
		for (const guidePath of pages) {
			await page.goto(`https://biomejs.dev${guidePath}`);

			const guideLinks = page.locator('main a[href^="/guides"]');
			const links = await guideLinks.all();

			for (const link of links) {
				const href = await link.getAttribute("href");
				await link.click();
				await expect(page).toHaveURL(new RegExp(href?.replace("/", "\\/")));
				await page.goBack();
			}
		}
	});

	test("should check API reference cross-links", async ({ page }) => {
		await page.goto("https://biomejs.dev/reference");

		const apiLinks = page.locator('a[href^="/reference"]');
		const links = await apiLinks.all();

		for (const link of links) {
			const href = await link.getAttribute("href");
			await link.click();
			await expect(page).toHaveURL(new RegExp(href?.replace("/", "\\/")));
			await page.goBack();
		}
	});

	test("should validate blog post links from index", async ({ page }) => {
		await page.goto("https://biomejs.dev/blog");

		const blogLinks = page.locator('article a[href^="/blog"]');
		const links = await blogLinks.all();

		for (const link of links) {
			const href = await link.getAttribute("href");
			await link.click();
			await expect(page).toHaveURL(new RegExp(href?.replace("/", "\\/")));
			await page.goBack();
		}
	});

	test("should check related posts links", async ({ page }) => {
		await page.goto("https://biomejs.dev/blog");
		await page.locator("article a").first().click();

		const relatedLinks = page.locator(".related-posts a");
		const links = await relatedLinks.all();

		for (const link of links) {
			const href = await link.getAttribute("href");
			if (href?.startsWith("/")) {
				const currentUrl = page.url();
				await link.click();
				await expect(page.url()).not.toBe(currentUrl);
				await page.goBack();
			}
		}
	});

	test("should validate search result links", async ({ page }) => {
		await page.goto("https://biomejs.dev");

		// Open search
		await page.getByRole("button", { name: /search/i }).click();

		// Type search term
		await page.getByRole("textbox", { name: /search/i }).fill("configuration");

		// Wait for and check search results
		const searchResults = page.locator(".search-result a");
		await expect(searchResults).toBeVisible();

		const links = await searchResults.all();
		for (const link of links) {
			const href = await link.getAttribute("href");
			if (href?.startsWith("/")) {
				await link.click();
				await expect(page).toHaveURL(new RegExp(href.replace("/", "\\/")));
				await page.goBack();
				// Reopen search
				await page.getByRole("button", { name: /search/i }).click();
			}
		}
	});

	test("should check version selector links", async ({ page }) => {
		await page.goto("https://biomejs.dev");

		const versionSelector = page.locator(".version-selector");
		if (await versionSelector.isVisible()) {
			await versionSelector.click();

			const versionLinks = page.locator(".version-selector a");
			const links = await versionLinks.all();

			for (const link of links) {
				const href = await link.getAttribute("href");
				if (href?.startsWith("/")) {
					await link.click();
					await expect(page).toHaveURL(new RegExp(href.replace("/", "\\/")));
					await page.goBack();
				}
			}
		}
	});
});
