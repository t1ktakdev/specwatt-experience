# React ↔ React Native ↔ Figma V4

Verified editable file: https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q . These are real node IDs, not planned names. Native source coverage is complete for 12 routes and three setup steps; Android device parity remains unverified.

| Route     | React                          | React Native                           | Figma frame                                                                    |
| --------- | ------------------------------ | -------------------------------------- | ------------------------------------------------------------------------------ |
| welcome   | `src/screens/Welcome.tsx`      | `native/screens.tsx · NativeWelcome`   | [15:298](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=15-298)   |
| home      | `src/screens/Home.tsx`         | `native/screens.tsx · NativeHome`      | [15:386](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=15-386)   |
| lighting  | `src/screens/Lighting.tsx`     | `native/screens.tsx · NativeLighting`  | [15:762](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=15-762)   |
| energy    | `src/screens/Energy.tsx`       | `native/screens.tsx · NativeEnergy`    | [15:978](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=15-978)   |
| devices   | `src/screens/Devices.tsx`      | `native/Devices.tsx`                   | [15:1262](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=15-1262) |
| device    | `src/screens/DeviceDetail.tsx` | `native/DeviceDetail.tsx`              | [15:1564](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=15-1564) |
| protected | `src/screens/Protected.tsx`    | `native/screens.tsx · NativeProtected` | [15:1796](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=15-1796) |
| autopilot | `src/screens/Autopilot.tsx`    | `native/Autopilot.tsx`                 | [15:1983](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=15-1983) |
| planner   | `src/screens/Planner.tsx`      | `native/Planner.tsx`                   | [15:2246](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=15-2246) |
| journal   | `src/screens/Journal.tsx`      | `native/Journal.tsx`                   | [15:2501](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=15-2501) |
| setup     | `src/screens/Setup.tsx`        | `native/Setup.tsx`                     | [15:2679](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=15-2679) |
| setup-2   | `src/screens/Setup.tsx`        | `native/Setup.tsx · step 2`            | [15:2829](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=15-2829) |
| setup-3   | `src/screens/Setup.tsx`        | `native/Setup.tsx · step 3`            | [15:2953](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=15-2953) |
| settings  | `src/screens/Settings.tsx`     | `native/Settings.tsx`                  | [15:3085](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=15-3085) |

Shared tokens: `design-tokens.json` → `src/tokens.css`, `native/tokens.ts`, 62 Figma primitive/semantic variables and seven Manrope text styles.

Shared component sets: Toggle `11:18` (four states), Navigation `11:151` (four tabs), Primary `11:173` (neutral/amber × default/pressed/disabled), DeviceCard `11:595` (tile/row × CH1/CH2 × off/on/unknown). CH3 has no toggle component.

Fifteen additional state frames, 23 navigation prototype frames and the complete ID ledger are in [figma-v4-delivery.json](figma-v4-delivery.json). The prototype contains 108 native hotspots; playback was not tested. Code Connect was not published: the local library is mapped manually here.

Review the actual 393 px image pairs in [review.html](v4/review.html). Text/image/vector structure is audited separately in [figma-audit.json](v4/figma-audit.json). Raster images are original interior assets only. There are no flattened UI screenshots inside delivered screens.
