# V4.1 Candidate · текущая проверка

Полная проверка нового художественного цикла, Android и сохранности исходников: [DELIVERY](v41/DELIVERY.md). Независимые сравнения всех 29 состояний: [review.html](v41/review.html). Актуальные узлы: [COMPONENT-MAP](COMPONENT-MAP.md). Нижеследующая запись сохранена как история исходного V4.

# Experience V4 verification — 10 November 2026, Asia/Bishkek

Source: real `origin/main` at `263a4dfe54ec12b1f8ff3a1160d97f93a01a5074` (v1.1.0). Isolated branch `codex/experience-v4-crafted-figma`, package v1.2.0. The original SpecWATT repository, backend/firmware and both rejected Figma files were not modified.

## QA1 · Art direction — verified locally

All four supplied PNGs were opened and inspected. The per-route audit is in [V4-WORK.md](V4-WORK.md). The original before collages and oval close-up are in `v4/before-*.png`.

All twelve routes were revised and visually inspected, including their lower content. Welcome retains its architecture; Home replaces the rejected oval with an architectural LED profile; detail uses a coherent disk pendant. Inventory rows, policy controls, schedule lanes, a chronological journal, a truthful setup topology and a compact CH3 passport replace repeated hero-card compositions. Two distinct original interiors are retained; no reference artist's artwork is shipped.

## QA2 · Figma editability — verified

[Actual new Figma file](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q), authored through authenticated `figma-remote`. The initial editable rectangle/text/vector/Auto Layout probe was rendered, inspected and removed.

Final readback: ten nonempty pages; fourteen core frames cover twelve routes with all three setup steps; fifteen additional interface states; 23 prototype frames; 62 scoped variables; seven Manrope text styles; 32 components including four variant sets. Screens contain real TEXT, VECTOR, FRAME, INSTANCE and Auto Layout nodes. Raster fills in product screens are only the two interior assets, not flattened interfaces. Primary has editable label and icon-swap properties; CH3 has no toggle.

[Layer audit](v4/figma-audit.json) records real node types, fonts, dimensions, image fills, bindings and component definitions. All inspected text uses Manrope. One empty loading-indicator frame retains the captured pulse opacity; it is not hidden UI content. [Delivery ledger](figma-v4-delivery.json) contains current IDs. Raw capture roots and the temporary probe were removed.

The prototype's 108 native hotspot reactions were read back successfully. **Playback was not tested.** Code Connect is not published; [COMPONENT-MAP.md](COMPONENT-MAP.md) is the verified manual mapping.

## QA3 · React ↔ Figma — verified with documented differences

[Comparison gallery](v4/review.html) uses actual Chromium and Figma renders at 393 px. Fourteen core-frame widths and full-content heights match the browser geometry. Fifteen state pairs are retained as well. A frozen clock is used only in screenshot fixtures.

Visual checks covered crop, hierarchy, text, controls, graphs and long-screen lower sections. Inspection found and corrected captured entrance opacity/translation, fallback Inter chart labels, grid placement, slider vectors, button tones, setup progress, empty-state width and modal clipping. Final editor screenshots include editable times and Check icon instances.

Remaining differences: font antialiasing/weight, shadows/gradients, asymmetric borders and SVG-label positioning. Chromium's native time input follows its OS 12-hour presentation; the editable Figma specimen uses 24-hour times. This is not a pixel-identity claim or proof of native Android parity.

## QA4 · Behavior, safety and motion — verified in browser/shared model

- `npm test`: **16/16 passed**, no skipped tests.
- CH1/CH2/CH3 remain 1.8/4.2/2.4 W; limit 7 W. CH3 is excluded from switching, scheduling and autopilot. An 8.4 W request preserves prior state.
- Offline/loading/error block commands; unknown power is not zero or confirmed on.
- Planner tests cover save/reload/edit/pause/delete, exact load segments, overlap rejection and unchanged saved plans. Review found a misleading first-day draft preview; shared strict `previewPlan` now selects the actual conflict day. Regression tests first failed, then passed, including malformed native time and same-ID edit handling.
- Review also found that a `?screen=home` entry could pin the screen after a tab click. Hash navigation now takes precedence; the browser regression verifies tab navigation and Back.
- Explicit consent/revocation, refusal events, journal filters, conceptual brightness and setup with no controller request are exercised.
- `qa-v4` observes an actual running **420 ms** chart transition and its settled opacity, hover/tap/keyboard selection, period units/totals and reduced motion. Screen/control/planner transitions use shared tokens; not every animation timing was individually measured.
- Independent read-only code review rechecked both P2 fixes and the native time-preview issue; no remaining concrete findings in those fixes.

Schedules never execute by time, autopilot sends no background commands, and pairing never claims real registration.

## QA5 · Delivery and Android — web verified; device partial

Executed successfully on the final application source:

| Check                                         | Result                                                      |
| --------------------------------------------- | ----------------------------------------------------------- |
| `npm test`                                    | 16 passed                                                   |
| `npm run typecheck`                           | Passed                                                      |
| `npm run lint`                                | Passed; Prettier formatting, not ESLint                     |
| `npm run build`                               | Passed; production Vite output                              |
| `npm run typecheck --prefix native`           | Passed                                                      |
| `npm run typecheck --prefix native/host`      | Passed                                                      |
| `npm run export:android --prefix native/host` | Passed; Expo/Metro Android Hermes bundle                    |
| `node tools/qa.mjs`                           | 12 routes × 320/393/440 px; no checked overflow/page errors |
| `node tools/qa-v3.mjs`                        | Seven extended scenario groups passed; no failed responses  |
| `node tools/qa-v4.mjs`                        | Five V4 scenario groups passed; no page/HTTP errors         |
| `node tools/accessibility.mjs`                | 12 initial route views, zero reported axe A/AA violations   |
| `node tools/parity.mjs`                       | 14 core + 15 state screenshots generated                    |

Machine-readable browser reports and geometry are retained in `v4/`. CI independently installs the native host and exports Android; its final run is recorded with the PR after pushing.

All twelve native routes and three setup steps are implemented with React Native primitives, a local guarded runtime, navigation, notices, reduced motion, bundled Manrope and original images. The isolated Expo host is runnable source, not integration into the original Android application. Local validation reused a compatible installed dependency tree; lockfiles are committed for clean CI installation.

**Not performed:** APK build, emulator/physical-device screenshots, native screen-reader, fontScale 1.0/1.3/1.5, Figma prototype playback or full manual WCAG certification. Native persistence is in memory. No hardware telemetry, transport/acknowledgements, timed execution, tariff calculation or Kyrgyz localization is implemented.

The V4 branch is delivered through a PR and local interactive preview. Stable V3 Pages is not replaced; no public V4 deployment is claimed.
