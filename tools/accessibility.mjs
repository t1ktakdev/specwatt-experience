const base = process.env.SPECWATT_URL || "http://127.0.0.1:4173";
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 393, height: 852 },
});
const page = await context.newPage();
const report = [];
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
  await page.goto(`${base}/#${route}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  report.push({
    route,
    violations: result.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  });
}
await fs.writeFile(
  "artifacts/accessibility.json",
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
assert.ok(
  report.every((r) => r.violations.length === 0),
  "Accessibility violations: see artifacts/accessibility.json",
);
