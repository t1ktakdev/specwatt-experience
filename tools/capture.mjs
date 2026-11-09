import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 393, height: 852 },
  deviceScaleFactor: 2,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await fs.mkdir("artifacts", { recursive: true });
for (const name of process.argv.length > 2
  ? process.argv.slice(2)
  : ["welcome", "home", "lighting", "energy"]) {
  await page.goto(`http://127.0.0.1:4173/#${name}`);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() =>
    Promise.all(
      [...document.images].map((img) => img.decode().catch(() => {})),
    ),
  );
  await page.waitForTimeout(500);
  await page.screenshot({
    animations: "disabled",
    path: `artifacts/${name}.png`,
  });
}
await page.setViewportSize({ width: 1800, height: 1080 });
await page.goto("http://127.0.0.1:4173/?gallery");
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
await page.screenshot({
  animations: "disabled",
  path: "artifacts/final-gallery.png",
  fullPage: true,
});
console.log(JSON.stringify({ errors }));
await browser.close();
