import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
const errors = [],
  failed = [],
  checks = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("response", (r) => {
  if (r.status() >= 400) failed.push({ url: r.url(), status: r.status() });
});
try {
  await page.goto("http://127.0.0.1:4173/?screen=home");
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Энергия", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Энергия в деталях" }),
  ).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Добрый вечер." }),
  ).toBeVisible();
  checks.push("Query-route entry preserves tab navigation and browser back");
  await page.goto("http://127.0.0.1:4173/#energy");
  await page.evaluate(() => document.fonts.ready);
  assert.equal(
    await page.evaluate(() => document.fonts.check("16px Manrope")),
    true,
  );
  await page.getByRole("button", { name: "День", exact: true }).click();
  const plot = page.locator(".chart-v4 > svg");
  const animation = await plot.evaluate((element) => {
    const running = element.getAnimations()[0];
    return running
      ? {
          duration: running.effect.getTiming().duration,
          state: running.playState,
        }
      : null;
  });
  assert.equal(animation?.duration, 420);
  await page.waitForTimeout(450);
  assert.equal(
    await plot.evaluate((element) => getComputedStyle(element).opacity),
    "1",
  );
  checks.push(
    "Chart period transition runs for 420 ms and reaches its settled state",
  );
  const box = await plot.boundingBox();
  await page.mouse.move(box.x + box.width * 0.15, box.y + box.height * 0.45);
  await expect(page.locator(".chart-selection output")).toHaveText("4,2 Вт");
  const slider = page.getByRole("slider", { name: "Интервал графика" });
  const before = Number(await slider.inputValue());
  await slider.focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(Number(await slider.inputValue()), before + 1);
  for (const [period, total] of [
    ["Неделя", "0,91"],
    ["Месяц", "3,30"],
  ]) {
    await page.getByRole("button", { name: period, exact: true }).click();
    await expect(page.locator(".analytics-number > div")).toContainText(total);
    await expect(page.locator(".chart-selection output")).toContainText(
      "кВт·ч",
    );
  }
  checks.push(
    "Loaded Manrope; chart hover, keyboard selection and three real period states",
  );
  await page.goto("http://127.0.0.1:4173/#planner");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page
    .getByRole("button", { name: "Новое расписание", exact: true })
    .click();
  for (const day of ["Пн", "Ср", "Чт", "Пт"])
    await page
      .locator(".day-selector")
      .getByRole("button", { name: day, exact: true })
      .click();
  await page.getByRole("button", { name: "Сохранить демо-план" }).click();
  await page
    .getByRole("button", { name: "Новое расписание", exact: true })
    .click();
  await page.getByLabel("Канал", { exact: true }).selectOption("CH1");
  await expect(page.locator(".draft-load > span")).toContainText("Вт");
  await expect(page.locator(".draft-load svg")).toHaveAttribute(
    "aria-label",
    /8,4 Вт/,
  );
  await page.getByRole("button", { name: "Сохранить демо-план" }).click();
  await expect(page.getByRole("alert")).toContainText("8,4 Вт");
  assert.equal(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("specwatt-plans")).length,
    ),
    1,
  );
  await page.screenshot({
    path: "artifacts/v4-conflict.png",
    animations: "disabled",
  });
  checks.push(
    "Draft conflict is visible on the chart; rejection preserves the single saved plan",
  );
  await page.goto("http://127.0.0.1:4173/?gallery=states&designexport");
  assert.equal(await page.locator(".gallery-item").count(), 9);
  await page.goto("http://127.0.0.1:4173/?gallery=workflows&designexport");
  assert.equal(await page.locator(".gallery-item").count(), 6);
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page
      .locator(".chart-v4 > svg")
      .first()
      .evaluate((e) => getComputedStyle(e).animationName),
    "none",
  );
  checks.push(
    "Nine edge cases, six workflow states and reduced-motion snapshots",
  );
  assert.deepEqual(errors, []);
  assert.deepEqual(failed, []);
  await fs.writeFile(
    "artifacts/qa-v4.json",
    JSON.stringify({ checks, errors, failed }, null, 2),
  );
  console.log(JSON.stringify({ checks, errors, failed }, null, 2));
} finally {
  await browser.close();
}
