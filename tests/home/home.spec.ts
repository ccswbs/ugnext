import { test, expect } from "@playwright/test";
import path from "path";

test("home-spotlight-analytics", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector("#uofg-homepage-spotlight-hero");

  for (let i = 2; i <= 5; i++) {
    await page.waitForSelector(`#uofg-homepage-spotlight-card-${i}`);
  }
});

test("home-visual-regression", async ({ page, isMobile }) => {
  await page.goto("/");
  const images = page.locator("img:visible");

  await expect(images).toHaveCount(isMobile ? 10 : 11);

  // Wait for images to load
  for (const img of await images.all()) {
    await img.scrollIntoViewIfNeeded();
    await expect(img).toHaveJSProperty("complete", true);
    await expect(img).not.toHaveJSProperty("naturalWidth", 0);
  }

  await expect(page).toHaveScreenshot("home.png", {
    fullPage: true,
    stylePath: path.join(__dirname, "home.css"),
    maxDiffPixelRatio: 0.01,
  });
});
