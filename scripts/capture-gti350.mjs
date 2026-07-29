// One-off capture of the GTI350 Tron Light Cycles game (local vanilla-JS repo).
// Serves the repo over a tiny static HTTP server (ES modules need http, not
// file://), starts a round via the "Go" button, lets the trails grow, then
// screenshots the canvas → public/media/gti350.jpg.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const ROOT = "C:/Users/ralph/OneDrive/Documents/GitHub/gti350-lab1-tron-light-cycles";
const OUT = "public/media/gti350.jpg";
const PORT = 3230;

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon",
};

const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, `http://localhost`).pathname);
    if (p === "/") p = "/index.html";
    const file = normalize(join(ROOT, p));
    if (!file.startsWith(normalize(ROOT))) { res.writeHead(403).end(); return; }
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": MIME[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end("not found");
  }
});

await new Promise((r) => server.listen(PORT, r));
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 900, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
try {
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(600);
  // Start a round; steer both cycles (J1 = arrows, J2 = WASD) through a few
  // turns so the trails bend into a fuller pattern. Invalid reversals are
  // ignored by the game, so a simple right→down→left→up loop reads well.
  await page.click('button:has-text("Go")').catch(() => {});
  const steps = [
    ["ArrowRight", "KeyD"], ["ArrowUp", "KeyW"], ["ArrowLeft", "KeyA"],
    ["ArrowDown", "KeyS"], ["ArrowRight", "KeyD"], ["ArrowUp", "KeyW"],
  ];
  for (const [a, b] of steps) {
    await page.waitForTimeout(420);
    await page.keyboard.press(a).catch(() => {});
    await page.keyboard.press(b).catch(() => {});
  }
  await page.waitForTimeout(700);
  const canvas = page.locator("#gameCanvas");
  await canvas.screenshot({ path: OUT, type: "jpeg", quality: 90 });
  console.log(`✓ gti350 → ${OUT}`);
} catch (e) {
  console.error("✗ gti350 failed:", e.message);
} finally {
  await ctx.close();
  await browser.close();
  server.close();
}
