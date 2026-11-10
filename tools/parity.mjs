import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const state = JSON.parse(
  await fs.readFile("docs/figma-v4-delivery.json", "utf8"),
);
await fs.mkdir("docs/v4/screens", { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1800, height: 1080 },
  deviceScaleFactor: 1,
  timezoneId: "Asia/Bishkek",
  locale: "ru-RU",
  reducedMotion: "reduce",
});
try {
  // Snapshot fixture only: match the session-start minute in the original Figma capture.
  await page.clock.install({ time: new Date("2026-11-10T12:54:00Z") });
  await page.goto("http://127.0.0.1:4173/?gallery=all&designexport");
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() =>
    Promise.all([...document.images].map((i) => i.decode())),
  );
  const rows = [];
  for (const screen of state.screens) {
    const target = page.locator(`[data-route="${screen.route}"] .phone-screen`);
    const size = await target.boundingBox();
    if (size.width !== 393)
      throw new Error(`${screen.route} is ${size.width}px, expected 393`);
    await target.screenshot({
      path: `docs/v4/screens/web-${screen.route}.png`,
      animations: "disabled",
    });
    rows.push({ ...screen, webWidth: size.width, webHeight: size.height });
  }
  for (const group of ["states", "workflows"]) {
    await page.goto(`http://127.0.0.1:4173/?gallery=${group}&designexport`);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() =>
      Promise.all([...document.images].map((i) => i.decode())),
    );
    for (const item of await page.locator(".gallery-item").all()) {
      const key = await item.getAttribute("data-route");
      await item.locator(".phone-screen").screenshot({
        path: `docs/v4/screens/web-${key}.png`,
        animations: "disabled",
      });
    }
  }
  await fs.writeFile(
    "artifacts/parity-layout.json",
    JSON.stringify(rows, null, 2),
  );
  const comparisons = [
    ...rows.map((s) => ({ ...s, web: s.route, figma: s.route })),
    ...state.states.map((s, i) => ({
      ...s,
      web: i === 8 ? "state-overload" : `state-${i}`,
      figma: `state-${i}`,
    })),
    ...state.workflowStates.map((s, i) => ({
      ...s,
      web: [
        "energy-День",
        "energy-Месяц",
        "planner-saved",
        "planner-editing",
        "planner-conflict",
        "permission-granted",
      ][i],
      figma: [
        "energy-День",
        "energy-Месяц",
        "planner-saved",
        "planner-editing",
        "planner-conflict",
        "permission-granted",
      ][i],
    })),
  ];
  const html = `<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>SpecWATT V4 · React ↔ Figma</title><style>body{font-family:Arial,sans-serif;background:#e9e6e0;color:#202425;margin:32px}h1{font-weight:500}section{margin-block:48px}.pair{display:flex;align-items:flex-start;gap:24px;flex-wrap:wrap}figure{margin:0}img{width:393px;max-width:90vw;display:block}figcaption{margin-bottom:12px}a{color:inherit}</style><h1>SpecWATT V4 · проверка React ↔ Figma</h1><p>393 px, Manrope. Слева — Chromium; справа — реальные Figma-слои. Разница сглаживания, теней и SVG-импорта возможна. Часы в браузерных снимках зафиксированы только как тестовая фикстура.</p><p><a href="https://www.figma.com/design/${state.fileKey}">Открыть редактируемый Figma</a> · <a href="http://127.0.0.1:4173/#home">Интерактивное приложение</a></p>${comparisons.map((s) => `<section><h2>${s.name}</h2><div class="pair"><figure><figcaption>React / ${s.route}</figcaption><img src="screens/web-${s.web}.png" loading="lazy"></figure><figure><figcaption>Figma / ${s.id}</figcaption><img src="screens/figma-${s.figma}.png" loading="lazy"></figure></div></section>`).join("")}</html>`;
  await fs.writeFile("docs/v4/review.html", html);
  console.log(
    JSON.stringify({
      screens: rows.map((r) => ({
        route: r.route,
        width: r.webWidth,
        height: r.webHeight,
      })),
      states: 15,
    }),
  );
} finally {
  await browser.close();
}
