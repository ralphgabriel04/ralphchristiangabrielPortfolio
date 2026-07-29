// Capture the mobile-first design mockups at a phone viewport, for phone-framed
// gallery items. Captured from the live (CSP-free) mockup URLs.
// Usage: node scripts/capture-mobile.mjs
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = "https://rcgabriel.dev";
const TARGETS = [
  { name: "vibe-mobile", path: "/vibe/index.html", settleMs: 4000, scroll: 780 },
  { name: "wise-wealthy-mobile", path: "/wise-wealthy/index.html", settleMs: 4000, scroll: 780 },
  { name: "dpm-mobile", path: "/dpm-elevate/index.html", settleMs: 4000, scroll: 780 },
];

const OUT_DIR = "public/media";
await mkdir(OUT_DIR, { recursive: true });
const browser = await chromium.launch();

for (const t of TARGETS) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  try {
    await page.goto(`${BASE}${t.path}`, { waitUntil: "networkidle", timeout: 45000 }).catch(async () => {
      await page.goto(`${BASE}${t.path}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    });
    await page.waitForTimeout(t.settleMs);
    await page.screenshot({ path: `${OUT_DIR}/${t.name}-1.jpg`, type: "jpeg", quality: 90 });
    // A second screen further down the app.
    await page.mouse.wheel(0, t.scroll);
    await page.waitForTimeout(1300);
    await page.screenshot({ path: `${OUT_DIR}/${t.name}-2.jpg`, type: "jpeg", quality: 90 });
    console.log(`✓ ${t.name} (2 screens)`);
  } catch (e) {
    console.error(`✗ ${t.name}: ${e.message}`);
  } finally {
    await ctx.close();
  }
}
await browser.close();
console.log("done");
