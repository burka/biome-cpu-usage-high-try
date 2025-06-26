import { expect, test } from "@playwright/test";

test.describe("Biome.js Playground", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("https://biomejs.dev/playground");
	});

	test("should load playground page", async ({ page }) => {
		await expect(page).toHaveTitle(/Playground/);
		await expect(page.locator("h1")).toContainText("Playground");
	});

	test("should have working code editor", async ({ page }) => {
		const editor = page.locator(".monaco-editor");
		await expect(editor).toBeVisible();

		// Type some code
		await page.keyboard.type("const x = 1;");

		// Verify code appears in editor
		const editorContent = await page.locator(".monaco-editor").textContent();
		expect(editorContent).toContain("const x = 1;");
	});

	test("should format code", async ({ page }) => {
		// Input unformatted code
		const unformattedCode = `function   test(   )  {
      console.log(  "hello"   );
    }`;

		// Find and clear the editor
		const editor = page.locator(".monaco-editor");
		await editor.click();
		await page.keyboard.press("Control+A");
		await page.keyboard.press("Delete");

		// Type the unformatted code
		await page.keyboard.type(unformattedCode);

		// Click format button
		const formatButton = page.getByRole("button", { name: /format/i });
		await formatButton.click();

		// Verify code is formatted
		const formattedContent = await editor.textContent();
		expect(formattedContent).not.toBe(unformattedCode);
	});

	test("should show linting errors", async ({ page }) => {
		// Input code with lint errors
		const codeWithErrors = "const unused = 1;";

		// Clear and type new code
		const editor = page.locator(".monaco-editor");
		await editor.click();
		await page.keyboard.press("Control+A");
		await page.keyboard.press("Delete");
		await page.keyboard.type(codeWithErrors);

		// Wait for lint errors to appear
		const errorMarkers = page.locator(".error-marker");
		await expect(errorMarkers).toBeVisible();
	});

	test("should have working configuration panel", async ({ page }) => {
		// Open configuration panel
		const configButton = page.getByRole("button", { name: /configuration/i });
		await configButton.click();

		// Verify configuration options are visible
		const configPanel = page.locator(".config-panel");
		await expect(configPanel).toBeVisible();

		// Toggle some options
		const toggles = configPanel.locator('input[type="checkbox"]');
		await toggles.first().click();

		// Verify toggle state changed
		await expect(toggles.first()).toBeChecked();
	});

	test("should be able to share playground state", async ({ page }) => {
		// Click share button
		const shareButton = page.getByRole("button", { name: /share/i });
		await shareButton.click();

		// Verify share URL is generated
		const shareUrl = page.locator(".share-url");
		await expect(shareUrl).toBeVisible();
		await expect(shareUrl).toHaveAttribute("href", /playground/);
	});

	test("should handle different file types", async ({ page }) => {
		// Test different file type selections
		const fileTypes = [".js", ".ts", ".jsx", ".tsx"];

		for (const fileType of fileTypes) {
			// Select file type
			const fileTypeSelector = page.locator("select.file-type-selector");
			await fileTypeSelector.selectOption(fileType);

			// Verify editor updates accordingly
			const editor = page.locator(".monaco-editor");
			await expect(editor).toHaveAttribute(
				"data-mode",
				new RegExp(fileType.substring(1)),
			);
		}
	});

	test("should persist editor state", async ({ page }) => {
		// Type some code
		const testCode = 'const test = "persistence";';
		const editor = page.locator(".monaco-editor");
		await editor.click();
		await page.keyboard.type(testCode);

		// Reload the page
		await page.reload();

		// Verify code persists
		const editorContent = await editor.textContent();
		expect(editorContent).toContain(testCode);
	});

	test("should handle keyboard shortcuts", async ({ page }) => {
		const editor = page.locator(".monaco-editor");
		await editor.click();

		// Test common shortcuts
		// Format
		await page.keyboard.press("Shift+Alt+F");

		// Undo
		await page.keyboard.press("Control+Z");

		// Redo
		await page.keyboard.press("Control+Shift+Z");

		// Verify editor still responds
		await expect(editor).toBeVisible();
	});
});
