// Walk the Wise & Wealthy mobile mockup through a few screens (it self-renders a
// phone frame) → phone-framed gallery items. Captured from the live mockup URL.
import { chromium } from "playwright";

const URL = "https://rcgabriel.dev/wise-wealthy/index.html";
const OUT = "public/media";
const advance = [/continuer/i, /commencer/i, /suivant/i, /passer/i, /c'est parti/i];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
await page.waitForTimeout(3500);

for (let i = 1; i <= 5; i++) {
  await page.screenshot({ path: `${OUT}/ww-screen-${i}.jpg`, type: "jpeg", quality: 90 });
  console.log(`captured ww-screen-${i}`);
  // Try to advance to the next distinct screen.
  let clicked = false;
  for (const re of advance) {
    const btn = page.getByRole("button", { name: re }).first();
    if (await btn.count().catch(() => 0)) {
      await btn.click({ timeout: 1500 }).catch(() => {});
      clicked = true;
      break;
    }
  }
  if (!clicked) {
    // Fall back: click a generic primary button near the bottom.
    await page.mouse.click(195, 720).catch(() => {});
  }
  await page.waitForTimeout(1400);
}

await ctx.close();
await browser.close();
console.log("done");
