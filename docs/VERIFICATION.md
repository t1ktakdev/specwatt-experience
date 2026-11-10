# Experience V3 verification — 10 November 2026, Asia/Bishkek

Stable starting point: `0623f3e`. Worktree: `SpecWATT-Experience-v3`, branch `codex/experience-v3`. The original SpecWATT repository and its Android application were read only.

## QA 1 — Visual fidelity: completed locally

Inspected the actual supplied Nahidul Islam and Sheikh Naeem reference images and real headless Chromium screenshots of all 12 routes. Preserved Warm Graphite / Ambient Amber and Manrope; refined surfaces, object scale, card hierarchy and touch controls. Corrected excessive Home / Analytics height, the planner empty-state density and catalogue caption tracking after visual inspection. Long-screen lower sections are captured separately. Subjective design review is not a claim of pixel identity to the references.

## QA 2 — Asset diversity: passed

Welcome: unique architecture. Lighting: different bedroom and lighting composition. Home: dedicated SVG object. Three hero sources decode successfully and are distinct; no screen references the retained V1 `ambient-room.webp`. Small cards use SVG icons. Responsive WebP outputs: 63,940 / 69,372 bytes at 960w, 15,170 / 17,312 bytes at 480w. Provenance is in `ASSETS.md`; reference authors' artwork is not shipped. Sixteen exported/product SVG files parsed successfully as XML.

## QA 3 — Function and safety: passed

- 12 Node unit tests, zero failures, no skips. New guards were first exercised by failing tests before implementation.
- CH1 / CH2 / CH3 remain 1.8 / 4.2 / 2.4 W, limit 7 W. CH3 has no switch or schedule option.
- Browser tests cover rejected 8.4 W load, unchanged power after rejection, valid switching, unknown connection states and disabled commands.
- V3 tests cover editor/save/reload/pause, schedule load calculation and conflict refusal; final consent revocation; journal refusal event; keyboard chart selection; persisted reduced motion; unavailable real pairing and absence of controller network requests.
- Plans are stored locally and never execute. Autopilot sends no background commands. Lighting brightness is a visual concept.

## QA 4 — Figma ↔ code parity: NOT PERFORMED

Direct plugin `whoami`: `MCP tool codex_apps/figma.whoami is not available to the model` (`isError: true`). Separately registered `figma-remote` failed initialization: `Auth required, when send initialize request`.

No authenticated plan/file was resolved. No Figma file, edit, screenshot, import or parity result is claimed. `COMPONENT-MAP.md`, generated tokens and `design-export/` preserve a concrete transfer path. Code layers alone would not satisfy editable Design layer requirements.

## QA 5 — Product validation: local and public checks passed

- `npm run build`: TypeScript + generated tokens + production Vite build passed.
- `npm run typecheck`, `npm run lint`, `npm test`: passed. Lint here is Prettier formatting, not an ESLint ruleset.
- `node tools/qa.mjs`: 12 routes × 320 / 393 / 440 CSS px; no checked horizontal overflow or page errors. First pass found journal filter overflow at 320 px; fixed, final pass zero findings.
- `node tools/qa-v3.mjs`: all seven extended scenario groups passed, zero console/page errors and HTTP failures.
- `node tools/accessibility.mjs`: axe WCAG A/AA checks on the initial view of 12 routes, zero reported violations. No full WCAG certification or manual screen-reader claim.
- `node tools/capture.mjs ...`: actual route screenshots, lower-content views, four-screen and 12-screen overview. Asset decode and bundled Manrope verified in the browser.
- Public site verified separately at 11:22 Asia/Bishkek on 10 November 2026. `verify-live.mjs` rendered all 12 V3 routes, checked HTTP 200, bundled Manrope, image decode, overload refusal, switching, scene slider, periods and CH3. Zero page errors or failed responses.
- `qa-v3.mjs https://t1ktakdev.github.io/specwatt-experience/` also passed all seven extended scenario groups against the published app; no console errors or failed HTTP responses. These are actual public checks, not an inference from the local build.
- Published application source: `4b001e07df84fdceb5910e902c19d0b51be49bd8`. [Merged PR #1](https://github.com/t1ktakdev/specwatt-experience/pull/1). [Successful Pages build and deploy](https://github.com/t1ktakdev/specwatt-experience/actions/runs/42761448168). PR checks also passed in [run 42761221345](https://github.com/t1ktakdev/specwatt-experience/actions/runs/42761221345).
- `live-verification.json`, `live-qa-v3.json` and `screenshots/published-overview.png` retain public verification evidence. Later evidence-only documentation commits do not change the deployed application.

## Android scope

Five actual native screen sources, native controls, safe-area shell, SVG instrument and guarded local hook were adapted in `native/`; TypeScript passed against installed React Native 0.88 / React 19.3 / safe-area / SVG definitions. The original app is not modified. No Metro bundle, APK, emulator/device rendering, native screen-reader test or fontScale 1.0 / 1.3 / 1.5 proof exists. Remaining native routes, Expo Router integration, persistence and real transport are explicitly pending.

Kyrgyz localization, hardware telemetry, controller acknowledgements, tariff calculations and timed execution remain unimplemented in this Experience repository.
