# React ↔ native ↔ Figma handoff

Figma is unavailable in this Codex session. All destinations below are **planned names**, not existing Figma nodes or Code Connect mappings. No two-way synchronization is claimed.

| Web source                                        | Native source                                 | Planned Figma destination           |
| ------------------------------------------------- | --------------------------------------------- | ----------------------------------- |
| `design-tokens.json` → `src/tokens.css`           | generated `native/tokens.ts`                  | Foundations / Tokens                |
| `components/ui.tsx` / Primary, Toggle, DeviceCard | NativeButton, NativeDeviceTile, native Switch | Components / States                 |
| `components/ui.tsx` / ConnectionBanner            | SourceLabel / unknown data display            | Edge Cases / Safety                 |
| `components/charts.tsx` / PowerGauge              | NativePower                                   | Components / Power instrument       |
| `screens/Welcome.tsx`                             | NativeWelcome                                 | Main Screens / Welcome              |
| `screens/Home.tsx`                                | NativeHome                                    | Main Screens / Home                 |
| `screens/Lighting.tsx`                            | NativeLighting                                | Main Screens / Lighting             |
| `screens/Energy.tsx`                              | NativeEnergy                                  | Main Screens / Energy               |
| Devices, DeviceDetail                             | tile primitives only                          | Extended Screens / Devices / Detail |
| Protected                                         | NativeProtected                               | Edge Cases / Safety / CH3           |
| Autopilot, Planner, Journal, Settings             | pending                                       | Extended Screens                    |
| Setup (3 steps, demo/hardware choice)             | pending                                       | Onboarding & Connection             |

## Shared states

- Toggle: off, on, disabled; 44 CSS px touch area (native 48 dp wrapper).
- DeviceCard: on, off, unknown connection; nominal W derived from shared model.
- PowerGauge: current value or unknown. Unknown never becomes 0 W.
- Autopilot: permission required, allowed, paused/unavailable; no background actuation.
- Schedule: empty, editor, validation error, saved, paused, edited, no plans on selected day.
- CH3: protected in all connection states, no actuation component.
- Connection: online local demo, offline, loading, error.

## Supported transfer when authentication returns

1. Verify a direct successful `whoami` and resolve the actual plan.
2. Create `SpecWATT — Experience V3 · Premium Product Design`.
3. Use the available official Code to Canvas capture workflow on the working route URLs. `send_code_to_figma` alone creates code layers, not native design shapes; it does not satisfy editability.
4. Establish semantic variables, text styles, component variants and auto-layout using supported `use_figma` APIs. Use the source component/state matrix above.
5. Assign imported image fills from the same WebP files. Import `design-export/` icons and product vectors.
6. Record real file/node IDs here; take Figma screenshots and compare at 393 CSS px equivalent with code screenshots. Resolve typography, spacing, image crop and state differences. Only then mark QA 4 passed.

`npm run export:vectors` renders editable SVG source from actual React components. It is not a Figma import and does not export entire screens as bitmaps disguised as editable designs.
