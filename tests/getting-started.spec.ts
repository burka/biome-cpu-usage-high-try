import { expect, test } from "@playwright/test";

test.describe("Biome.js Getting Started Guide", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("https://biomejs.dev/guides/getting-started/");
	});

	test("should display correct page title", async ({ page }) => {
		await expect(page).toHaveTitle(/Getting Started/);
	});

	test("should show installation commands", async ({ page }) => {
		const npmCommand = page.locator('code:has-text("npm install")');
		const pnpmCommand = page.locator('code:has-text("pnpm add")');
		const yarnCommand = page.locator('code:has-text("yarn add")');

		await expect(npmCommand).toBeVisible();
		await expect(pnpmCommand).toBeVisible();
		await expect(yarnCommand).toBeVisible();
	});

	test("should have copyable code blocks", async ({ page }) => {
		const codeBlocks = page.locator("pre code");
		await expect(codeBlocks).toHaveCount(5); // Adjust based on actual count

		const copyButtons = page.locator('button[aria-label*="copy"]');
		await expect(copyButtons).toHaveCount(5); // Should match code blocks count
	});

	test("should show configuration file example", async ({ page }) => {
		const configExample = page.locator('pre code:has-text("biome.json")');
		await expect(configExample).toBeVisible();
	});

	test("should have working table of contents", async ({ page }) => {
		const toc = page.locator('nav[aria-label="Table of Contents"]');
		await expect(toc).toBeVisible();

		const tocLinks = toc.locator("a");
		const linksCount = await tocLinks.count();
		expect(linksCount).toBeGreaterThan(0);

		// Test first TOC link
		await tocLinks.first().click();
		await expect(page).toHaveURL(/getting-started.*#/);
	});

	test("should have correct next/previous navigation", async ({ page }) => {
		const nextLink = page.getByRole("link", { name: /next/i });
		const prevLink = page.getByRole("link", { name: /previous/i });

		await expect(nextLink).toBeVisible();
		await expect(prevLink).toBeVisible();

		const initialUrl = page.url();
		await nextLink.click();
		await expect(page.url()).not.toBe(initialUrl);
	});

	test("should have working CLI command examples", async ({ page }) => {
		const cliCommands = [
			"biome init",
			"biome check",
			"biome format",
			"biome lint",
		];

		for (const command of cliCommands) {
			const commandBlock = page.locator(`code:has-text("${command}")`);
			await expect(commandBlock).toBeVisible();
		}
	});

	test("should show correct folder structure", async ({ page }) => {
		const folderStructure = page.locator('pre:has-text("node_modules")');
		await expect(folderStructure).toBeVisible();
	});

	test("should validate all external links", async ({ page }) => {
		const externalLinks = page.locator('a[href^="http"]');
		const links = await externalLinks.all();

		for (const link of links) {
			const href = await link.getAttribute("href");
			expect(href).toBeTruthy();
			expect(href).toMatch(/^https?:\/\//);
		}
	});

	test("should handle code highlighting", async ({ page }) => {
		const highlightedCode = page.locator(".token");
		await expect(highlightedCode).toBeVisible();

		// Check specific syntax highlighting
		const keywords = page.locator(".token.keyword");
		await expect(keywords).toBeVisible();
	});

	test("should have working breadcrumb navigation", async ({ page }) => {
		const breadcrumbs = page.locator('nav[aria-label="Breadcrumb"]');
		await expect(breadcrumbs).toBeVisible();

		const breadcrumbLinks = breadcrumbs.locator("a");
		await expect(breadcrumbLinks).toHaveCount(2); // Guides > Getting Started
	});
});
