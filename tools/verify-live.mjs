import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base =
  process.argv[2] || "https://t1ktakdev.github.io/specwatt-experience/";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 393, height: 852 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();
const failures = [],
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("response", (r) => {
  if (r.status() >= 400) failures.push({ url: r.url(), status: r.status() });
});
await fs.mkdir("artifacts", { recursive: true });
for (const route of [
  "welcome",
  "home",
  "lighting",
  "energy",
  "devices",
  "device",
  "protected",
  "autopilot",
  "planner",
  "journal",
  "setup",
  "settings",
]) {
  const response = await page.goto(`${base}#${route}`);
  if (response) assert.equal(response.status(), 200);
  await expect(page.locator(".experience")).toHaveAttribute(
    "data-version",
    "3",
  );
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() =>
    Promise.all([...document.images].map((i) => i.decode())),
  );
  assert.equal(
    await page.evaluate(() => document.fonts.check("400 16px Manrope")),
    true,
  );
  await page.screenshot({
    path: `artifacts/live-${route}.png`,
    animations: "disabled",
  });
}
await page.goto(`${base}#home`);
await page.getByRole("switch", { name: "Светильник: питание" }).click();
await expect(page.getByRole("dialog")).toContainText("8,4 Вт");
await page.keyboard.press("Escape");
await expect(page.getByRole("dialog")).not.toBeVisible();
await page.getByRole("switch", { name: "LED-лента: питание" }).click();
await expect(page.locator(".hero-number")).toContainText("2,4");
await page.getByRole("switch", { name: "LED-лента: питание" }).click();
await expect(page.locator(".hero-number")).toContainText("6,6");
await page.goto(`${base}#lighting`);
await page.getByRole("slider").fill("35");
await expect(page.locator(".brightness-heading")).toContainText("35");
await page.goto(`${base}#energy`);
await page.getByRole("button", { name: "День", exact: true }).click();
await expect(page.locator(".analytics-number")).toContainText("0,12");
await page.getByRole("button", { name: "Месяц", exact: true }).click();
await expect(page.locator(".analytics-number")).toContainText("3,30");
await page.goto(`${base}#protected`);
assert.equal(await page.getByRole("switch").count(), 0);
await page.setViewportSize({ width: 1800, height: 1080 });
await page.goto(`${base}?gallery`);
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() =>
  Promise.all([...document.images].map((i) => i.decode())),
);
await page.screenshot({
  path: "artifacts/live-overview.png",
  fullPage: true,
  animations: "disabled",
});
const result = {
  url: base,
  verifiedAt: new Date().toISOString(),
  http: 200,
  fonts: "Manrope loaded",
  assets: "image and bundled assets loaded",
  checks: [
    "12 V3 screen renders",
    "power limit rejection",
    "Escape closes modal",
    "channel switching",
    "concept slider",
    "analytics periods",
    "CH3 protected",
  ],
  errors,
  failedResponses: failures,
};
await fs.writeFile(
  "artifacts/live-verification.json",
  JSON.stringify(result, null, 2),
);
await browser.close();
console.log(JSON.stringify(result, null, 2));
assert.deepEqual(errors, []);
assert.deepEqual(failures, []);
