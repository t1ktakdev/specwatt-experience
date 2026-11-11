const base = process.env.SPECWATT_URL || "http://127.0.0.1:4173";
import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 393, height: 852 },
  deviceScaleFactor: 2,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const routes = [
  "welcome",
  "home",
  "lighting",
  "energy",
  "devices",
  "device",
  "autopilot",
  "planner",
  "journal",
  "setup",
  "settings",
  "protected",
];
const report = { checks: [], overflow: [], errors };
await fs.mkdir("artifacts", { recursive: true });
async function visit(route) {
  await page.goto(`${base}/#${route}`);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() =>
    Promise.all([...document.images].map((i) => i.decode().catch(() => {}))),
  );
  await page.waitForTimeout(150);
}
for (const width of [320, 393, 440]) {
  await page.setViewportSize({ width, height: 852 });
  for (const route of routes) {
    await visit(route);
    const bad = await page.evaluate(() =>
      [
        ...document.querySelectorAll(
          ".phone-screen h1,.phone-screen h2,.phone-screen h3,.device-card,.detail-row,.page-header,.compact-header,.primary-button,.filter-chips,.form-label",
        ),
      ]
        .filter((e) => e.scrollWidth > e.clientWidth + 2)
        .map((e) => ({
          class: e.className,
          text: e.textContent.slice(0, 70),
          width: e.clientWidth,
          scroll: e.scrollWidth,
        })),
    );
    if (bad.length) report.overflow.push({ width, route, bad });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `${route} ${width}: horizontal body overflow`,
    );
    if (width === 393)
      await page.screenshot({
        animations: "disabled",
        path: `artifacts/${route}.png`,
      });
  }
}
report.checks.push("12 routes × 3 widths: render and horizontal overflow");
await page.setViewportSize({ width: 393, height: 852 });
await visit("home");
await page.evaluate(() => {
  localStorage.clear();
});
await page.reload();
await page.getByRole("switch", { name: "Светильник: питание" }).click();
await expect(page.getByRole("dialog")).toContainText("8,4 Вт");
await expect(page.locator(".hero-number")).toContainText("6,6");
await page.getByRole("button", { name: "Понятно" }).click();
await page.getByRole("switch", { name: "LED-лента: питание" }).click();
await expect(page.locator(".hero-number")).toContainText("2,4");
await page.getByRole("switch", { name: "Светильник: питание" }).click();
await expect(page.locator(".hero-number")).toContainText("4,2");
report.checks.push("Power limit rejection and successful channel switching");
await visit("protected");
assert.equal(await page.getByRole("switch").count(), 0);
report.checks.push("CH3 has no switch");
await visit("settings");
await page.getByLabel("Состояние соединения").selectOption("offline");
await page.getByRole("button", { name: "Посмотреть на главной" }).click();
await expect(page.locator(".hero-number")).toContainText("—");
assert.equal(
  await page.getByRole("switch", { name: "Светильник: питание" }).isDisabled(),
  true,
);
await page.screenshot({
  animations: "disabled",
  path: "artifacts/offline.png",
});
await page
  .getByRole("button", { name: "Вернуться к подключённому демо" })
  .click();
report.checks.push(
  "Offline: unknown current power, disabled control, demo recovery",
);
for (const state of ["loading", "error"]) {
  await visit("settings");
  await page.getByLabel("Состояние соединения").selectOption(state);
  await page.getByRole("button", { name: "Посмотреть на главной" }).click();
  await expect(page.locator(".hero-number")).toContainText("—");
  await page.screenshot({
    animations: "disabled",
    path: `artifacts/${state}.png`,
  });
  await page
    .getByRole("button", { name: "Вернуться к подключённому демо" })
    .click();
}
report.checks.push("Loading and error states do not display fresh telemetry");
await visit("lighting");
await page.locator("input[type=range]").fill("35");
await expect(page.locator(".brightness-heading")).toContainText("35");
await page.getByRole("button", { name: "Яркий акцент", exact: true }).click();
await expect(page.locator(".brightness-heading")).toContainText("100");
report.checks.push("Concept scene slider and presets");
await visit("energy");
await page.getByRole("button", { name: "Месяц", exact: true }).click();
await expect(page.locator(".analytics-number")).toContainText("3,30");
await page.getByRole("button", { name: "День", exact: true }).click();
await expect(page.locator(".analytics-number")).toContainText("0,12");
report.checks.push("Analytics periods update totals and chart");
await visit("autopilot");
await page.getByRole("switch", { name: "Демо-автопилот" }).click();
await expect(
  page.getByRole("switch", { name: "Демо-автопилот" }),
).not.toBeChecked();
await page.getByRole("switch", { name: "Разрешить авто для CH2" }).click();
await page.getByRole("switch", { name: "Демо-автопилот" }).click();
await expect(
  page.getByRole("switch", { name: "Демо-автопилот" }),
).toBeChecked();
await visit("home");
await visit("autopilot");
await expect(
  page.getByRole("switch", { name: "Разрешить авто для CH2" }),
).toBeChecked();
report.checks.push(
  "Autopilot requires explicit channel consent; consent survives navigation",
);
await visit("planner");
await page.getByRole("button", { name: "Первое расписание" }).click();
await expect(page.getByRole("dialog")).toBeVisible();
assert.equal(await page.locator("option[value=CH3]").count(), 0);
await page.getByRole("button", { name: "Сохранить демо-план" }).click();
await expect(page.locator(".schedule-item")).toContainText("Вечерний свет");
await page.reload();
await expect(page.locator(".schedule-item")).toContainText("19:00");
await page.screenshot({
  animations: "disabled",
  path: "artifacts/planner-saved.png",
});
await page
  .getByRole("button", { name: "Удалить расписание Вечерний свет" })
  .click();
await expect(page.locator(".empty-schedules")).toBeVisible();
report.checks.push("Schedule save/reload/delete; CH3 excluded");
await visit("setup");
await page.getByRole("button", { name: "Посмотреть настройку" }).click();
await page
  .getByLabel("Пример адреса сервера · без подключения")
  .fill("https://demo.example");
await page.getByRole("button", { name: "Продолжить настройку" }).click();
await expect(
  page.getByRole("heading", { name: "Ваш интерфейс готов к исследованию." }),
).toBeVisible();
await expect(page.locator(".setup-description")).toContainText(
  "Физическое устройство не подключено",
);
report.checks.push("Setup explicitly ends in demo, not hardware success");
await page.emulateMedia({ reducedMotion: "reduce" });
await visit("home");
assert.equal(
  await page.locator("main").evaluate((e) => getComputedStyle(e).animationName),
  "none",
);
report.checks.push("Reduced-motion preference");
await page.evaluate(() => localStorage.clear());
await page.setViewportSize({ width: 1440, height: 1000 });
await visit("home");
await page.screenshot({
  animations: "disabled",
  path: "artifacts/desktop.png",
});
await page.goto(`${base}/?gallery`);
await page.setViewportSize({ width: 1800, height: 1080 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(250);
await page.screenshot({
  animations: "disabled",
  path: "artifacts/final-gallery.png",
  fullPage: true,
});
await fs.writeFile("artifacts/qa-report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
assert.deepEqual(errors, []);
assert.deepEqual(report.overflow, []);
