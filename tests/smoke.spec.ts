import { test, expect } from "playwright/test";

const LOCALES = ["fr", "en"] as const;

for (const locale of LOCALES) {
  test.describe(`[${locale}] Navigation`, () => {
    test("homepage loads with h1", async ({ page }) => {
      await page.goto(`/${locale}`);
      const h1 = page.locator("h1");
      await expect(h1).toBeVisible();
    });

    test("all nav links resolve to 200", async ({ page }) => {
      const paths = [
        `/${locale}`,
        `/${locale}/about`,
        `/${locale}/experience`,
        `/${locale}/contact`,
        `/${locale}/projects`,
      ];
      for (const path of paths) {
        const res = await page.goto(path);
        expect(res?.status()).toBe(200);
      }
    });

    test("project detail pages load", async ({ page }) => {
      const slugs = ["the-mad-space", "cadence", "fastercom-tms", "dpm-calendar", "financej"];
      for (const slug of slugs) {
        const res = await page.goto(`/${locale}/projects/${slug}`);
        expect(res?.status()).toBe(200);
        await expect(page.locator("article")).toBeVisible();
      }
    });

    test("404 returns for unknown route", async ({ page }) => {
      const res = await page.goto(`/${locale}/this-does-not-exist`);
      expect(res?.status()).toBe(404);
    });
  });

  test.describe(`[${locale}] SEO`, () => {
    test("has meta description", async ({ page }) => {
      await page.goto(`/${locale}`);
      const desc = page.locator('meta[name="description"]');
      await expect(desc).toHaveAttribute("content", /.+/);
    });

    test("has lang attribute", async ({ page }) => {
      await page.goto(`/${locale}`);
      const lang = await page.locator("html").getAttribute("lang");
      expect(lang).toBe(locale);
    });

    test("has JSON-LD schema", async ({ page }) => {
      await page.goto(`/${locale}`);
      const jsonLd = page.locator('script[type="application/ld+json"]');
      await expect(jsonLd).toBeAttached();
      const content = await jsonLd.textContent();
      expect(content).toContain("Ralph Christian Gabriel");
    });
  });

  test.describe(`[${locale}] Accessibility`, () => {
    test("skip link exists and targets #main", async ({ page }) => {
      await page.goto(`/${locale}`);
      const skip = page.locator('a[href="#main"]');
      await expect(skip).toBeAttached();
    });

    test("main element has id=main", async ({ page }) => {
      await page.goto(`/${locale}`);
      const main = page.locator("main#main");
      await expect(main).toBeVisible();
    });

    test("all images have alt text", async ({ page }) => {
      await page.goto(`/${locale}/about`);
      const images = page.locator("img");
      const count = await images.count();
      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute("alt");
        expect(alt).toBeTruthy();
      }
    });
  });

  test.describe(`[${locale}] Conversion`, () => {
    test("CV download link exists", async ({ page }) => {
      await page.goto(`/${locale}`);
      const cvLink = page.locator(`a[href*="cv/ralph-gabriel-cv-${locale}"]`);
      await expect(cvLink.first()).toBeVisible();
    });

    test("email link exists", async ({ page }) => {
      await page.goto(`/${locale}`);
      const email = page.locator('a[href="mailto:christian8339@hotmail.com"]');
      await expect(email.first()).toBeVisible();
    });

    test("Cal.com booking link works", async ({ page }) => {
      await page.goto(`/${locale}/contact`);
      const calLink = page.locator('a[href*="cal.com/ralphchristiangabriel"]');
      await expect(calLink.first()).toBeVisible();
    });
  });
}

test("theme toggle switches dark/light", async ({ page }) => {
  await page.goto("/en");
  // Wait for hydration — theme button renders after mount
  const themeBtn = page.locator('button[aria-label*="theme"]');
  await expect(themeBtn).toBeVisible({ timeout: 10000 });
  const htmlBefore = await page.locator("html").getAttribute("class") ?? "";
  await themeBtn.click();
  // Class should change after toggle
  await page.waitForFunction(
    (before) => document.documentElement.getAttribute("class") !== before,
    htmlBefore,
    { timeout: 5000 }
  );
  const htmlAfter = await page.locator("html").getAttribute("class") ?? "";
  expect(htmlAfter).not.toBe(htmlBefore);
});

test("language switcher navigates between locales", async ({ page }) => {
  await page.goto("/en/about");
  // Wait for page content (About uses h2 as section heading, not h1)
  await expect(page.locator("h2").first()).toBeVisible({ timeout: 10000 });
  // Click FR button in desktop nav
  const frBtn = page.locator('button[aria-label="Passer en français"]').first();
  await frBtn.click();
  await page.waitForURL("**/fr/about", { timeout: 10000 });
  expect(page.url()).toContain("/fr/about");
});

test("sitemap.xml is accessible", async ({ page }) => {
  const res = await page.goto("/sitemap.xml");
  expect(res?.status()).toBe(200);
});

test("robots.txt is accessible", async ({ page }) => {
  const res = await page.goto("/robots.txt");
  expect(res?.status()).toBe(200);
});
