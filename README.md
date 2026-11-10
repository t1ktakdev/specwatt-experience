# SpecWATT Experience V3 — Energy, considered.

A standalone, interactive mobile experience in React + TypeScript. Warm graphite, ambient amber, original interior imagery, local Manrope fonts and real SVG iconography. Built separately from the original SpecWATT application.

**Working web prototype + isolated native UI sources. No Figma file has been created or imported. No hardware is connected; no APK has been built.**

## Open

- Published prototype: https://t1ktakdev.github.io/specwatt-experience/
- Four-screen overview: https://t1ktakdev.github.io/specwatt-experience/?gallery
- All 12 screens: https://t1ktakdev.github.io/specwatt-experience/?gallery=all
- Open a screen directly with `#home`, `#lighting`, `#energy`, etc.

## Run locally

Node 24:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4173/ .

```sh
npm test
npm run build
npx playwright install chromium
node tools/qa.mjs
node tools/accessibility.mjs
node tools/qa-v3.mjs
node tools/verify-live.mjs
npm run lint
npm run export:vectors
npm ci --prefix native --ignore-scripts
npm run typecheck --prefix native
```

The browser checks use a separate, headless Chromium process. They never control the user's browser or desktop. `artifacts/` contains generated screenshots and QA evidence and is ignored by Git.

## Screens & behavior

12 routes: Welcome, Home, Lighting, Energy, Devices, Device Detail, Protected CH3, Autopilot, Load Planner, Activity Journal, First Setup and Settings. Setup contains three steps. Connection previews include offline, loading and error; the planner includes empty, editor and saved states.

- CH1 / CH2 switches change local simulated state and recompute W.
- CH3 is always protected; there is no switch or schedule option.
- 8.4 W simultaneous load is rejected against the 7 W demo limit.
- Autopilot requires explicit channel consent. It sends no background commands.
- Schedules can be added, edited, toggled, deleted and retained in localStorage. The timeline uses their nominal loads and rejects overlaps above 7 W. They do not execute.
- The scene dimmer changes the image presentation only. Hardware dimming is not confirmed.
- Energy periods and graph selection are interactive. All history and comparisons are demo values; no actual tariff or savings claims.
- Setup distinguishes demo and real-controller paths. Hardware pairing is explicitly unavailable; no requests are sent to the entered address.
- The event journal records local switches, overload refusals, consent and schedule actions for the current session.
- All persistence is local to the browser. No analytics, accounts or remote telemetry.

## Source & handoff

Reusable components live in `src/components/`, screen modules in `src/screens/`, domain guards in `src/model.ts`, schedule validation in `src/lib/planner.ts`, context in `src/state/`. `design-tokens.json` generates `src/tokens.css` and `native/tokens.ts` during build. Welcome and Lighting use distinct original interiors; Home uses a dedicated SVG object. `design-export/` contains editable icons and product vectors rendered from actual components.

`native/` contains five adapted React Native screens, shared controls and a guarded local demo hook for the existing Expo 58 / RN 0.88 stack. These sources pass TypeScript checks but are not integrated, bundled or device-validated. See `native/README.md` and `docs/COMPONENT-MAP.md` for the actual boundary and transfer mapping.

`DESIGN.md` records the reference principles, confirmed product scope and documented Figma import routes. With an authorized official Figma MCP connection, capture the published screen routes using Code to canvas, then add component instances, auto-layout and variable bindings with `use_figma`. A browser capture alone does not produce a fully componentized Figma design system.

V3 technical check: plugin `whoami` returns `MCP tool codex_apps/figma.whoami is not available to the model`; separately registered `figma-remote` fails initialization with `Auth required, when send initialize request`. Figma parity QA remains unperformed.

See `ASSETS.md` and `licenses/` for asset provenance.

## Verification limits

Validated in Chromium at 320 / 393 / 440 px and in a desktop composition. This does not prove Android native behavior, ESP32 integration or hardware safety. Russian UI is implemented; Kyrgyz localization and native fontScale validation are not implemented. The original application's source and previous Figma design were not changed.
