# SpecWATT Experience V4.1 Candidate

Отдельный художественный цикл от PR #2 (`2b6c6d9`): 12 маршрутов, три шага подключения и 15 состояний обновлены в React, редактируемой Figma и React Native. CH3 защищён, лимит 7 Вт сохранён; основной SpecWATT, V3 и PR #2 не изменены. Публикация не выполнялась.

- [Реальные V4 → V4.1 React ↔ Figma сравнения и Android](docs/v41/review.html)
- [Пять проходов QA, решения и ограничения](docs/v41/DELIVERY.md)
- [Figma Candidate](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=69-9)
- [Актуальные узлы и исходные компоненты](docs/COMPONENT-MAP.md)

Локальный запуск: `npm ci`, затем `npm run dev -- --port 4174`. Проверки: `npm test`, `npm run lint`, `npm run build`; браузерные проверки принимают `SPECWATT_URL`. Android preview — самостоятельный React Native интерфейс, отдельный пакет `dev.specwatt.experience.v41.preview`; сборка проверена на x86_64-эмуляторе. Инструкции — [native/README.md](native/README.md).

Ниже сохранена документация исходного V4.

# SpecWATT Experience V4

React + TypeScript, editable Figma, and an isolated React Native / Expo 58 host. Warm Graphite × Ambient Amber and Manrope are retained. All values and interactions are local demonstrations; no hardware is connected.

- [Editable Figma](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q)
- [Figma navigation prototype](https://www.figma.com/proto/CZEjsvoYoT7888KQ0o7B5Q/SpecWATT?node-id=25-232&page-id=25-231&scaling=scale-down)
- [React/native/Figma mapping](docs/COMPONENT-MAP.md)
- [Actual screenshot comparisons](docs/v4/review.html)
- [Verification and limits](docs/VERIFICATION.md)

The stable V3 GitHub Pages site is not replaced by this branch. The original `t1ktakdev/SpecWATT` repository, firmware and backend are unchanged.

## Run and review

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4173/#home`, `?gallery=all`, `?gallery=states`, or `?gallery=workflows`. Twelve routes include all three setup steps. `?designexport` is the static, full-content capture layout; normal routes retain transitions, scrolling and fixed navigation.

```sh
npm test
npm run typecheck
npm run lint
npm run build
node tools/qa.mjs
node tools/qa-v3.mjs
node tools/qa-v4.mjs
node tools/accessibility.mjs
```

The browser suites run a separate headless Chromium process. They never control the user's browser or desktop. Lint is Prettier formatting, not ESLint.

## Native host

```sh
npm ci --prefix native --ignore-scripts
npm run typecheck --prefix native
npm ci --prefix native/host --ignore-scripts
npm run typecheck --prefix native/host
npm run export:android --prefix native/host
npm start --prefix native/host
```

The host loads bundled Manrope and both original interiors, owns a local navigation stack and exposes all twelve React Native routes. Android Hermes export passes; no APK or Android device rendering is claimed. Native state is in memory for the current session. See [native/README.md](native/README.md).

CH1 / CH2 / CH3 remain 1.8 / 4.2 / 2.4 W with a 7 W limit. CH3 cannot be switched or scheduled. Offline/loading/error block commands; unknown power is shown as unknown. Autopilot requires explicit permission and executes no background commands. Web schedules are local and do not execute. Scene brightness changes a visual concept only. Setup sends no requests to an entered address.

`tools/figma-*.js` are construction transcripts for `figma-remote`, with IDs from this run, not standalone Node scripts. Raw captures were deliberately removed after semantic composition. `tools/parity.mjs` recreates browser snapshots; Figma screenshots are fetched separately through the authenticated official server.
