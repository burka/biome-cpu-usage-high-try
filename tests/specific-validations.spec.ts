import { expect, test } from "@playwright/test";

test.describe("Biome.js Specific Validations", () => {
  test("should have valid meta tags", async ({ page }) => {
    await page.goto("https://biomejs.dev");

    // Check essential meta tags
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
    );
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
      "content",
    );
    await expect(page.locator("meta[charset]")).toBeVisible();
  });

  test("should have valid Open Graph tags", async ({ page }) => {
    await page.goto("https://biomejs.dev");

    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
    );
    await expect(
      page.locator('meta[property="og:description"]'),
    ).toHaveAttribute("content");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
    );
  });

  test("should load favicon", async ({ page }) => {
    await page.goto("https://biomejs.dev");

    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toBeVisible();
    await expect(favicon).toHaveAttribute("href");
  });

  test("should have valid canonical URLs", async ({ page }) => {
    const pages = ["/", "/guides/getting-started", "/blog", "/reference"];

    for (const path of pages) {
      await page.goto(`https://biomejs.dev${path}`);
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute(
        "href",
        new RegExp(`https://biomejs.dev${path}`),
      );
    }
  });

  test("should handle 404 page correctly", async ({ page }) => {
    await page.goto("https://biomejs.dev/nonexistent-page");

    await expect(page).toHaveTitle(/404/);
    await expect(page.locator("h1")).toContainText(/404|Not Found/);

    // Check if there's a link back to home
    const homeLink = page.getByRole("link", { name: /home/i });
    await expect(homeLink).toBeVisible();
  });

  test("should have working language switcher if present", async ({ page }) => {
    await page.goto("https://biomejs.dev");

    const langSwitcher = page.locator(".language-switcher");
    if (await langSwitcher.isVisible()) {
      await langSwitcher.click();

      const langOptions = page.locator(".language-options");
      await expect(langOptions).toBeVisible();
    }
  });

  test("should have valid RSS feed link", async ({ page }) => {
    await page.goto("https://biomejs.dev/blog");

    const rssLink = page.locator('link[type="application/rss+xml"]');
    await expect(rssLink).toHaveAttribute("href");
  });

  test("should load custom fonts", async ({ page }) => {
    await page.goto("https://biomejs.dev");

    const fontLinks = page.locator('link[rel="preload"][as="font"]');
    await expect(fontLinks).toBeVisible();
  });

  test("should have valid manifest.json", async ({ request }) => {
    const response = await request.get("https://biomejs.dev/manifest.json");
    expect(response.ok()).toBeTruthy();

    const manifest = await response.json();
    expect(manifest).toHaveProperty("name");
    expect(manifest).toHaveProperty("short_name");
    expect(manifest).toHaveProperty("icons");
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("https://biomejs.dev");

    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1); // Only one h1 per page

    const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();
    let previousLevel = 1;

    for (const heading of headings) {
      const level = Number.parseInt(
        await heading.evaluate((el) =>
          el.tagName.toLowerCase().replace("h", ""),
        ),
      );
      expect(level).toBeLessThanOrEqual(previousLevel + 1); // No skipping levels
      previousLevel = level;
    }
  });

  test("should have valid ARIA labels", async ({ page }) => {
    await page.goto("https://biomejs.dev");

    const ariaElements = page.locator("[aria-label]");
    const elements = await ariaElements.all();

    for (const element of elements) {
      const ariaLabel = await element.getAttribute("aria-label");
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel?.length).toBeGreaterThan(0);
    }
  });

  test("should handle keyboard navigation", async ({ page }) => {
    await page.goto("https://biomejs.dev");

    // Press Tab to start keyboard navigation
    await page.keyboard.press("Tab");

    // Check if focus indicator is visible
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });

  test("should have proper alt text for images", async ({ page }) => {
    await page.goto("https://biomejs.dev");

    const images = page.locator("img[alt]");
    const imageElements = await images.all();

    for (const img of imageElements) {
      const alt = await img.getAttribute("alt");
      expect(alt).toBeTruthy();
      expect(alt?.length).toBeGreaterThan(0);
    }
  });

  test("should load required assets", async ({ page }) => {
    await page.goto("https://biomejs.dev");

    // Check CSS files
    const cssLinks = page.locator('link[rel="stylesheet"]');
    await expect(cssLinks).toBeVisible();

    // Check JavaScript files
    const scripts = page.locator("script[src]");
    await expect(scripts).toBeVisible();
  });

  test("should handle print styles", async ({ page }) => {
    await page.goto("https://biomejs.dev");

    const printStyles = page.locator('link[rel="stylesheet"][media="print"]');
    if ((await printStyles.count()) > 0) {
      await expect(printStyles).toHaveAttribute("href");
    }
  });
});
