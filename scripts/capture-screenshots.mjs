// Portfolio screenshot capture (Playwright).
// Usage: node scripts/capture-screenshots.mjs [name ...]
//   no args  → capture every target
//   names    → capture only the matching targets (by `name`)
//
// Each target is captured at a 16:9 viewport (the project card frames media as
// aspect-video, object-top), @2x for crispness, saved as an optimized JPEG in
// public/media. Extend TARGETS to add apps/features/pages.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const TARGETS = [
  {
    name: "tatzy",
    url: "https://tatzy-taxi.vercel.app",
    settleMs: 3500,
  },
  {
    name: "dpm-elevate-app",
    url: "https://dpm-calendar.vercel.app",
    settleMs: 4000,
  },
];

const OUT_DIR = "public/media";
const VW = 1440;
const VH = 810; // 16:9

const only = process.argv.slice(2);
const targets = only.length ? TARGETS.filter((t) => only.includes(t.name)) : TARGETS;

await mkdir(OUT_DIR, { recursive: true });
const browser = await chromium.launch();

for (const t of targets) {
  const ctx = await browser.newContext({
    viewport: { width: VW, height: VH },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  const out = `${OUT_DIR}/${t.name}.jpg`;
  try {
    try {
      await page.goto(t.url, { waitUntil: "networkidle", timeout: 45000 });
    } catch {
      await page.goto(t.url, { waitUntil: "domcontentloaded", timeout: 45000 });
    }
    await page.waitForTimeout(t.settleMs ?? 2500);
    await page.screenshot({ path: out, type: "jpeg", quality: 88 });
    console.log(`✓ ${t.name} → ${out} (${t.url})`);
  } catch (err) {
    console.error(`✗ ${t.name} failed: ${err.message}`);
  } finally {
    await ctx.close();
  }
}

await browser.close();
console.log("done");
