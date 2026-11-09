# Delivery verification — 10 November 2026 (Asia/Bishkek)

Published app commit: `e51984f`. Successful GitHub Pages run: https://github.com/t1ktakdev/specwatt-experience/actions/runs/42684308003

## Executed checks

- TypeScript and production Vite build: passed locally and on GitHub.
- 6 domain tests: passed, including CH3 immutability, load-limit rejection, unknown connection states and coherent illustrative energy totals.
- 12 routes at 320 / 393 / 440 CSS px: no checked horizontal overflow or JavaScript errors.
- Browser scenarios: switching, blocked overload, unknown power offline, disabled commands, loading/error, scene presets, period changes, consent, saved/reloaded/deleted schedules and demo setup.
- axe WCAG A/AA rules on the initial rendered view of all 12 routes: no reported violations after correcting three text contrast issues. This is not a claim of complete WCAG certification or manual screen-reader coverage.
- Public deployment: HTTP 200, bundled Manrope loaded, interior image decoded, no HTTP failures or page errors; interaction smoke checks passed. See `live-verification.json`.

## Visual passes

1. Layout: inspected real headless-browser screenshots, corrected navigation overlap in analytics; confirmed three consumption rows visible at the primary mobile size.
2. Craft: increased service text sizes, desaturated excess green in secondary screens, shortened the autopilot hero to expose the schedule action, corrected contrast and precise kWh formatting.
3. Reference comparison: visually compared the four-screen composition with the supplied references for atmosphere, light, scale, hierarchy, photographic balance and surface depth. Final screenshots were taken after fixes, with finite animations fast-forwarded for deterministic capture.

The published preview remains a web prototype. No Figma import, physical ESP32 test, native Android validation or Kyrgyz localization is claimed. The official original SpecWATT repository was read but not edited.
