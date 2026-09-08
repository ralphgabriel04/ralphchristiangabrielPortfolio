import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:3123";
const shots = [
  { name: "services-mobile-390", w: 390, h: 844 },   // iPhone 12/13/14
  { name: "services-mobile-360", w: 360, h: 800 },   // small Android
  { name: "services-tablet-768", w: 768, h: 1024 },  // iPad portrait (sm→2col)
];

const browser = await chromium.launch();
for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 2 });
  await page.goto(`${BASE}/fr`, { waitUntil: "networkidle" });
  const sec = page.locator("#sec-services");
  await sec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700); // let reveal animations settle
  await sec.screenshot({ path: `C:/tmp/${s.name}.png` });
  // report the computed columns + any horizontal overflow
  const info = await page.evaluate(() => {
    const grid = document.querySelector("#sec-services .grid");
    const cols = grid ? getComputedStyle(grid).gridTemplateColumns.split(" ").length : 0;
    const doc = document.documentElement;
    return { cols, overflow: doc.scrollWidth - doc.clientWidth, cards: document.querySelectorAll("#sec-services .grid > *").length };
  });
  console.log(`${s.name}: ${s.w}px → ${info.cols} col, ${info.cards} cards, h-overflow=${info.overflow}px`);
  await page.close();
}
await browser.close();
