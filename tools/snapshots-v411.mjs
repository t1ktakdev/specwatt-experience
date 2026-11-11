import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const base = process.env.SPECWATT_URL || "http://127.0.0.1:4174";
const b = await chromium.launch();
const p = await b.newPage({
  viewport: { width: 1800, height: 1080 },
  reducedMotion: "reduce",
  timezoneId: "Asia/Bishkek",
  locale: "ru-RU",
});
const layouts = [];
await fs.mkdir("docs/v411/mobile", { recursive: true });
try {
  await p.clock.install({ time: new Date("2026-11-11T12:54:00Z") });
  for (const gallery of ["all", "states", "workflows"]) {
    await p.goto(`${base}/?gallery=${gallery}&designexport`);
    await p.evaluate(() => document.fonts.ready);
    await p.evaluate(() =>
      Promise.all([...document.images].map((i) => i.decode())),
    );
    if (!(await p.evaluate(() => document.fonts.check("16px Manrope"))))
      throw new Error("Manrope failed");
    for (const item of await p.locator(".gallery-item").all()) {
      let key = await item.getAttribute("data-route");
      key = key
        .replace("energy-День", "energy-day")
        .replace("energy-Месяц", "energy-month");
      const screen = item.locator(".phone-screen"),
        box = await screen.boundingBox();
      if (box.width !== 393)
        throw new Error(`Expected 393px: ${key} ${box.width}`);
      await screen.screenshot({
        path: `docs/v411/after/web-${key}.png`,
        animations: "disabled",
      });
      layouts.push({ key, width: box.width, height: box.height });
    }
  }
  for (const width of [320, 440]) {
    await p.setViewportSize({ width, height: 852 });
    for (const route of [
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
      "setup-2",
      "setup-3",
    ]) {
      await p.goto(
        `${base}/${route.startsWith("setup-") ? `?setupStep=${route.at(-1)}#setup` : `#${route}`}`,
      );
      await p.evaluate(() => document.fonts.ready);
      await p.evaluate(() =>
        Promise.all([...document.images].map((i) => i.decode())),
      );
      await p.screenshot({
        path: `docs/v411/mobile/${route}-${width}-top.png`,
        animations: "disabled",
      });
      const content = p.locator(".screen-content");
      if (await content.count()) {
        await content.evaluate((e) => (e.scrollTop = e.scrollHeight));
        await p.screenshot({
          path: `docs/v411/mobile/${route}-${width}-bottom.png`,
          animations: "disabled",
        });
      }
    }
  }
  await fs.writeFile(
    "docs/v411/layouts.json",
    JSON.stringify(layouts, null, 2),
  );
  console.log(
    JSON.stringify({ pairs: layouts.length, mobileWidths: [320, 440] }),
  );
} finally {
  await b.close();
}
