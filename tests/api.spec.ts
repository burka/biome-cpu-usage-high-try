import { expect, test } from "@playwright/test";

test.describe("Biome.js API Integration", () => {
	test("should successfully make API requests", async ({ request }) => {
		const response = await request.get("https://biomejs.dev/api/health");
		expect(response.ok()).toBeTruthy();
		expect(response.status()).toBe(200);
	});

	test("should handle API documentation page", async ({ page }) => {
		await page.goto("https://biomejs.dev/api");
		await expect(page).toHaveTitle(/API/);

		// Check for API documentation sections
		const apiSections = page.locator(".api-section");
		await expect(apiSections).toBeVisible();

		// Verify endpoint documentation
		const endpoints = page.locator(".endpoint");
		await expect(endpoints).toHaveCount(5); // Adjust based on actual API endpoints
	});

	test("should handle API errors gracefully", async ({ request }) => {
		const response = await request.get("https://biomejs.dev/api/nonexistent");
		expect(response.status()).toBe(404);

		const errorData = await response.json();
		expect(errorData).toHaveProperty("error");
	});

	test("should validate API response schema", async ({ request }) => {
		const response = await request.get("https://biomejs.dev/api/version");
		expect(response.ok()).toBeTruthy();

		const data = await response.json();
		expect(data).toHaveProperty("version");
		expect(typeof data.version).toBe("string");
	});

	test("should handle rate limiting", async ({ request }) => {
		// Make multiple rapid requests
		const requests = new Array(10)
			.fill(null)
			.map(() => request.get("https://biomejs.dev/api/version"));

		const responses = await Promise.all(requests);

		// Check if rate limiting headers are present
		const lastResponse = responses[responses.length - 1];
		expect(lastResponse.headers()["x-ratelimit-remaining"]).toBeDefined();
	});

	test("should handle large payloads", async ({ request }) => {
		const largeCode = 'console.log("hello");\n'.repeat(1000);

		const response = await request.post("https://biomejs.dev/api/format", {
			data: {
				code: largeCode,
				syntax: "js",
			},
		});

		expect(response.ok()).toBeTruthy();
		const result = await response.json();
		expect(result).toHaveProperty("formatted");
	});

	test("should handle concurrent requests", async ({ request }) => {
		const endpoints = ["version", "health", "stats", "format"];

		const requests = endpoints.map((endpoint) =>
			request.get(`https://biomejs.dev/api/${endpoint}`),
		);

		const responses = await Promise.all(requests);
		responses.forEach((response) => {
			expect(response.ok()).toBeTruthy();
		});
	});

	test("should maintain session state", async ({ request }) => {
		// First request to set session
		const response1 = await request.post("https://biomejs.dev/api/session", {
			data: {
				preferences: {
					theme: "dark",
					tabSize: 2,
				},
			},
		});
		expect(response1.ok()).toBeTruthy();

		// Second request to verify session
		const response2 = await request.get("https://biomejs.dev/api/session");
		expect(response2.ok()).toBeTruthy();

		const data = await response2.json();
		expect(data.preferences.theme).toBe("dark");
		expect(data.preferences.tabSize).toBe(2);
	});

	test("should validate request parameters", async ({ request }) => {
		const response = await request.post("https://biomejs.dev/api/format", {
			data: {
				code: "const x = 1",
				syntax: "invalid",
			},
		});

		expect(response.status()).toBe(400);
		const error = await response.json();
		expect(error).toHaveProperty("error");
		expect(error.error).toMatch(/invalid syntax/i);
	});

	test("should handle CORS headers", async ({ request }) => {
		const response = await request.get("https://biomejs.dev/api/version", {
			headers: {
				Origin: "https://example.com",
			},
		});

		expect(response.headers()["access-control-allow-origin"]).toBeDefined();
	});
});
