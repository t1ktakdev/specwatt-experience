import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const [id, view = "home", selector = ".phone-screen"] = process.argv.slice(2);
if (!id) throw new Error("A fresh official capture ID is required");
const original = await fs.readFile("index.html", "utf8");
const browser = await chromium.launch({ headless: true });
try {
  await fs.writeFile(
    "index.html",
    original.replace(
      "</head>",
      '<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script></head>',
    ),
  );
  const page = await browser.newPage({
    viewport: { width: 1800, height: 1080 },
    reducedMotion: "reduce",
    locale: "ru-RU",
    timezoneId: "Asia/Bishkek",
  });
  await page.clock.install({ time: new Date("2026-11-10T12:54:00Z") });
  const endpoint = `https://mcp.figma.com/mcp/capture/${id}/submit?bindVariables=true&promptId=d6826c4d-cdd1-45bd-ac58-59776e81c1ae`;
  await page.goto(
    `http://127.0.0.1:4174/?${["all", "states", "workflows"].includes(view) ? `gallery=${view}` : `screen=${view}`}&designexport#figmacapture=${id}&figmaendpoint=${encodeURIComponent(endpoint)}&figmadelay=1600&figmaselector=${encodeURIComponent(selector)}`,
    { waitUntil: "domcontentloaded" },
  );
  await page.locator(selector).waitFor({ state: "visible" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(24000);
  console.log(
    JSON.stringify({
      view,
      selector,
      layers: await page.locator(selector + " *").count(),
    }),
  );
} finally {
  await fs.writeFile("index.html", original);
  await browser.close();
}
