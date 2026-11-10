// Local source script-tag capture in an isolated headless browser. Never opens user windows.
import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const [captureId, route = "home"] = process.argv.slice(2);
if (!captureId)
  throw new Error("Pass the single-use ID returned by generate_figma_design");
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
  const gallery = ["all", "states", "workflows"].includes(route);
  const selector = gallery ? ".gallery" : ".phone-screen";
  const page = await browser.newPage({
    viewport: { width: gallery ? 1800 : 393, height: 852 },
    deviceScaleFactor: 1,
  });
  page.on("console", (m) => {
    if (m.type() === "error") console.log(m.text().slice(0, 400));
  });
  const endpoint = `https://mcp.figma.com/mcp/capture/${captureId}/submit?bindVariables=true&promptId=cf86c003-754b-4f5d-b0da-4c8947a9727a`;
  await page.goto(
    `http://127.0.0.1:4173/?${gallery ? `gallery=${route}` : `screen=${route}`}&designexport#figmacapture=${captureId}&figmaendpoint=${encodeURIComponent(endpoint)}&figmadelay=1800&figmaselector=${selector}`,
  );
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(22000);
  await page.locator(selector).screenshot({
    path: `artifacts/design-${route}.png`,
    animations: "disabled",
  });
  console.log(
    JSON.stringify({
      route,
      title: await page.title(),
      layers: await page.locator(".phone-screen *").count(),
    }),
  );
} finally {
  await fs.writeFile("index.html", original);
  await browser.close();
}
