import { test, expect } from "@playwright/test";

test("home-spotlight-analytics", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector("#uofg-homepage-spotlight-hero");

  for (let i = 2; i <= 5; i++) {
    await page.waitForSelector(`#uofg-homepage-spotlight-card-${i}`);
  }
});
