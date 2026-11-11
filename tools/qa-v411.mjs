import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.SPECWATT_URL || "http://127.0.0.1:4174";
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 393, height: 852 },
  locale: "en-US",
});
const checks = [];
try {
  await page.clock.install({ time: new Date("2026-11-11T12:54:00Z") });
  await page.goto(`${base}/#devices`);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(
    await page.evaluate(() => document.fonts.check("16px Manrope")),
    true,
  );
  checks.push("Bundled Cyrillic and Latin Manrope loads");
  await page
    .getByRole("button", { name: "Открыть Светильник", exact: true })
    .click();
  await page.locator(".back-label").click();
  await expect(page.locator(".phone-screen h1")).toHaveText("Ваши устройства");
  checks.push("Detail back returns to Devices");
  await page.goto(`${base}/#planner`);
  await page
    .getByRole("button", { name: "Новое расписание", exact: false })
    .click();
  await expect(page.getByLabel("Включить в")).toHaveAttribute("type", "text");
  await page.getByLabel("Включить в").fill("23:45");
  await page.getByLabel("Выключить в").fill("23:59");
  await expect(page.getByLabel("Включить в")).toHaveValue("23:45");
  checks.push("24-hour editing independent of OS locale");
  await page.goto(`${base}/#home`);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page
    .getByRole("switch", { name: "LED-лента: питание", exact: true })
    .click();
  await page
    .getByRole("switch", { name: "Светильник: питание", exact: true })
    .click();
  const saved = await page.evaluate(() =>
    localStorage.getItem("specwatt-channels"),
  );
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Авто", exact: true })
    .click();
  await page.getByRole("switch", { name: "Разрешить авто для CH2" }).click();
  await expect(page.locator(".decision-flow")).toContainText("8,4 Вт из 7 Вт");
  await expect(page.locator(".decision-flow")).toContainText(
    "Стоп · превышен лимит",
  );
  assert.equal(
    await page.evaluate(() => localStorage.getItem("specwatt-channels")),
    saved,
  );
  checks.push(
    "Autopilot preview stops an 8.4 W proposal without changing channels",
  );
  await page.goto(`${base}/#journal`);
  await expect(page.locator(".journal-group")).toHaveCount(1);
  await page
    .locator(".phone-screen")
    .screenshot({ path: "docs/v411/after/journal-with-actions.png" });
  checks.push("Real current-session actions are grouped in the journal");
  await fs.writeFile(
    "docs/v411/qa-v41.json",
    JSON.stringify({ checks }, null, 2),
  );
  console.log(JSON.stringify({ checks }));
} finally {
  await browser.close();
}
