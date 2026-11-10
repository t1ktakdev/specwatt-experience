import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.argv[2] || "http://127.0.0.1:4173/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 393, height: 852 },
  deviceScaleFactor: 2,
});
const errors = [],
  failedResponses = [],
  checks = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("response", (r) => {
  if (r.status() >= 400)
    failedResponses.push({ url: r.url(), status: r.status() });
});
await fs.mkdir("artifacts", { recursive: true });
async function go(route) {
  await page.goto(`${base}#${route}`);
  await page.evaluate(() => document.fonts.ready);
}
async function shot(name) {
  await page.screenshot({
    path: `artifacts/v3-${name}.png`,
    animations: "disabled",
  });
}
try {
  await go("home");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole("switch", { name: "Светильник: питание" }).click();
  await expect(page.getByRole("dialog")).toContainText("8,4 Вт");
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Журнал событий", exact: true })
    .click();
  await expect(page.locator(".event-warning")).toContainText("отклонён");
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Авто", exact: true })
    .click();
  await page.getByRole("switch", { name: "Разрешить авто для CH2" }).click();
  await page.getByRole("switch", { name: "Демо-автопилот" }).click();
  await expect(
    page.getByRole("switch", { name: "Демо-автопилот" }),
  ).toBeChecked();
  await shot("permission-granted");
  await page.getByRole("switch", { name: "Разрешить авто для CH2" }).click();
  await expect(
    page.getByRole("switch", { name: "Демо-автопилот" }),
  ).not.toBeChecked();
  checks.push(
    "Overload rejection recorded in session journal; revoking final consent disables autopilot",
  );

  await go("planner");
  await page.getByRole("button", { name: "Первое расписание" }).click();
  await page.getByRole("button", { name: "Сохранить демо-план" }).click();
  await expect(page.locator(".load-preview h2")).toContainText("6,6");
  await page.getByRole("button", { name: "Добавить", exact: true }).click();
  await page.getByLabel("Канал", { exact: true }).selectOption("CH1");
  await page.getByRole("button", { name: "Сохранить демо-план" }).click();
  await expect(page.getByRole("alert")).toContainText("8,4 Вт");
  await shot("schedule-conflict");
  await page.getByRole("button", { name: "Закрыть расписание" }).click();
  await page
    .getByRole("button", { name: "Изменить расписание Вечерний свет" })
    .click();
  await page.getByLabel("Включить в").fill("20:00");
  await page.getByRole("button", { name: "Сохранить демо-план" }).click();
  await page.reload();
  await expect(page.locator(".schedule-item")).toContainText("20:00");
  await shot("planner-edited");
  await page.getByRole("switch", { name: "Расписание Вечерний свет" }).click();
  await expect(page.locator(".load-preview h2")).toContainText("2,4");
  await page.getByRole("button", { name: "Вс 00" }).click();
  await expect(page.locator(".empty-schedules")).toContainText(
    "День без расписаний",
  );
  checks.push(
    "Planner edit/reload, nominal timeline, pause, empty day and overload conflict rejection",
  );

  await go("energy");
  await page.getByRole("slider", { name: "Интервал графика" }).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".chart-selection")).toContainText("Сб");
  await expect(page.locator(".chart-selection")).toContainText("0,15");
  checks.push(
    "Chart is inspectable with keyboard; selection reports interval and energy unit",
  );

  await go("settings");
  await page.getByLabel("Состояние соединения").selectOption("offline");
  await page.getByRole("button", { name: "Посмотреть на главной" }).click();
  await expect(
    page.getByRole("img", { name: "Текущая мощность неизвестна" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Открыть Светильник" }).click();
  await expect(page.locator(".object-status")).toContainText(
    "НЕТ ПОДТВЕРЖДЕНИЯ",
  );
  await expect(
    page.getByRole("switch", { name: "Светильник: питание" }),
  ).toBeDisabled();
  await shot("device-offline");
  await page
    .getByRole("button", { name: "Вернуться к подключённому демо" })
    .click();
  checks.push(
    "Offline device state and accessible power gauge are unknown, not zero or confirmed on",
  );

  await go("settings");
  await page.getByRole("switch", { name: "Меньше движения" }).click();
  await page.reload();
  await expect(
    page.getByRole("switch", { name: "Меньше движения" }),
  ).toBeChecked();
  assert.equal(
    await page.locator("html").getAttribute("class"),
    "reduce-motion",
  );
  checks.push(
    "Reduced-motion preference persists and matches the toggle after reload",
  );

  const controllerRequests = [];
  page.on("request", (r) => {
    if (r.url().includes("controller.example"))
      controllerRequests.push(r.url());
  });
  await go("setup");
  await page
    .getByRole("button", { name: "У меня есть контроллер", exact: false })
    .click();
  await page.getByRole("button", { name: "Посмотреть настройку" }).click();
  await expect(
    page.getByRole("button", { name: "Подключение недоступно" }),
  ).toBeDisabled();
  await shot("hardware-unavailable");
  await page.getByRole("button", { name: "Продолжить в демо" }).click();
  await page.getByLabel("Адрес сервера").fill("http://");
  await page.getByRole("button", { name: "Продолжить настройку" }).click();
  await expect(page.getByLabel("Адрес сервера")).toBeVisible();
  await page.getByLabel("Адрес сервера").fill("https://controller.example");
  await page.getByRole("button", { name: "Продолжить настройку" }).click();
  await expect(page.locator(".setup-description")).toContainText(
    "Физическое устройство не подключено",
  );
  assert.deepEqual(controllerRequests, []);
  await shot("setup-demo-ready");
  checks.push(
    "Real controller path explicitly unavailable; demo validates URL but sends no network request",
  );

  const heroSources = [];
  for (const route of ["welcome", "home", "lighting"]) {
    await go(route);
    await page.evaluate(() =>
      Promise.all([...document.images].map((i) => i.decode())),
    );
    const sources = await page
      .locator(".phone-screen img")
      .evaluateAll((xs) =>
        xs.map((i) => ({ source: i.currentSrc, width: i.naturalWidth })),
      );
    assert.ok(sources.every((s) => s.width > 0));
    heroSources.push(...sources.map((s) => s.source));
  }
  assert.equal(new Set(heroSources).size, 2);
  await go("home");
  await expect(
    page.getByRole("img", {
      name: "Архитектурная LED-линия: световой профиль CH2",
    }),
  ).toBeVisible();
  assert.equal(await page.locator(".ambient-tile img").count(), 0);
  checks.push(
    "Two distinct decoded interiors; Home has an editable architectural LED vector instead of the rejected oval object",
  );
  await page.evaluate(() => localStorage.clear());
  assert.deepEqual(errors, []);
  assert.deepEqual(failedResponses, []);
  console.log(JSON.stringify({ checks, errors, failedResponses }, null, 2));
  await fs.writeFile(
    "artifacts/qa-v3.json",
    JSON.stringify({ base, checks, errors, failedResponses }, null, 2),
  );
} finally {
  await browser.close();
}
