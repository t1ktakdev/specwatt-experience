# React ↔ React Native ↔ Figma V4.1 Candidate

Текущие реальные узлы после визуальной проверки и очистки временных импортов. V4 сохранён ниже. Нативные снимки получены на отдельном x86_64 Android preview; системные элементы отличаются от веба. Figma playback не проверен.

| Экран / состояние  | React                            | React Native                     | Figma                                                                          |
| ------------------ | -------------------------------- | -------------------------------- | ------------------------------------------------------------------------------ |
| welcome            | `src/screens/Welcome.tsx`        | `native/screens.tsx`             | [75:194](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=75-194)   |
| home               | `src/screens/Home.tsx`           | `native/screens.tsx`             | [75:284](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=75-284)   |
| lighting           | `src/screens/Lighting.tsx`       | `native/screens.tsx`             | [75:706](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=75-706)   |
| energy             | `src/screens/Energy.tsx`         | `native/screens.tsx`             | [75:921](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=75-921)   |
| devices            | `src/screens/Devices.tsx`        | `native/Devices.tsx`             | [75:1199](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=75-1199) |
| device             | `src/screens/DeviceDetail.tsx`   | `native/DeviceDetail.tsx`        | [75:1487](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=75-1487) |
| autopilot          | `src/screens/Autopilot.tsx`      | `native/Autopilot.tsx`           | [75:1710](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=75-1710) |
| planner            | `src/screens/Planner.tsx`        | `native/Planner.tsx`             | [75:2002](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=75-2002) |
| journal            | `src/screens/Journal.tsx`        | `native/Journal.tsx`             | [75:2257](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=75-2257) |
| setup              | `src/screens/Setup.tsx`          | `native/Setup.tsx`               | [75:2465](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=75-2465) |
| settings           | `src/screens/Settings.tsx`       | `native/Settings.tsx`            | [75:2613](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=75-2613) |
| protected          | `src/screens/Protected.tsx`      | `native/screens.tsx`             | [75:2922](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=75-2922) |
| setup-2            | `src/screens/Setup.tsx`          | `native/Setup.tsx`               | [75:3108](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=75-3108) |
| setup-3            | `src/screens/Setup.tsx`          | `native/Setup.tsx`               | [75:3218](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=75-3218) |
| state-0            | `src/screens/Home.tsx`           | `native/screens.tsx`             | [85:9](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=85-9)       |
| state-1            | `src/screens/Home.tsx`           | `native/screens.tsx`             | [85:447](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=85-447)   |
| state-2            | `src/screens/Home.tsx`           | `native/screens.tsx`             | [85:879](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=85-879)   |
| state-3            | `src/screens/Lighting.tsx`       | `native/screens.tsx`             | [85:1313](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=85-1313) |
| state-4            | `src/screens/DeviceDetail.tsx`   | `native/DeviceDetail.tsx`        | [85:1528](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=85-1528) |
| state-5            | `src/screens/Journal.tsx`        | `native/Journal.tsx`             | [85:1751](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=85-1751) |
| state-6            | `src/screens/Autopilot.tsx`      | `native/Autopilot.tsx`           | [85:1930](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=85-1930) |
| state-7            | `src/screens/Protected.tsx`      | `native/screens.tsx`             | [85:2222](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=85-2222) |
| state-overload     | `src/components/LimitDialog.tsx` | `native/Experience.tsx · notice` | [85:2408](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=85-2408) |
| energy-day         | `src/screens/Energy.tsx`         | `native/screens.tsx`             | [85:2432](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=85-2432) |
| energy-month       | `src/screens/Energy.tsx`         | `native/screens.tsx`             | [85:2725](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=85-2725) |
| planner-saved      | `src/screens/Planner.tsx`        | `native/Planner.tsx`             | [85:2997](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=85-2997) |
| planner-editing    | `src/screens/Planner.tsx`        | `native/Planner.tsx`             | [85:3278](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=85-3278) |
| planner-conflict   | `src/screens/Planner.tsx`        | `native/Planner.tsx`             | [85:3648](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=85-3648) |
| permission-granted | `src/screens/Autopilot.tsx`      | `native/Autopilot.tsx`           | [85:4021](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=85-4021) |

Candidate страницы: Screens `69:9`, Components `75:9`, States `84:92`, Prototype `89:9`. Прототип: 29 фреймов 393 × 852 и 210 переходов; [точные ID](figma-v41-prototype.json).

| Переиспользуемый компонент                     | Реализация                                                                       | Реальные master IDs                                               |
| ---------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| CH1/CH2 Tile, Row, Unknown                     | `src/components/ui.tsx · DeviceCard`, `native/components.tsx · NativeDeviceTile` | `94:43`, `94:73`, `94:96`, `94:126`, `94:149`, `94:179`           |
| Энергобаланс Known / Unknown                   | `src/components/LoadBudget.tsx`, `native/components.tsx · NativePower`           | `94:240`, `94:209`                                                |
| Toggle Off / On / Disabled / Unavailable       | `src/components/ui.tsx · Toggle`, `native/controls.tsx · NativeToggle`           | set `86:21`, variants `86:9`, `86:12`, `86:15`, `86:18`           |
| Предметные изображения / LED-вектор            | `src/components/ProductVisual.tsx`, `native/Product.tsx`                         | image fills CH1 и настоящие VECTOR CH2 внутри устройств           |
| Primary / check / arrow, Nav, Brand, StatusBar | `src/components/ui.tsx`, `native/components.tsx`, `native/Experience.tsx`        | существующая библиотека V4, включая check `40:38` и arrow `40:34` |

Сохранены существующие 31 primitive + 31 semantic variables и семь text styles. Декоративные полупрозрачные краски не привязываются к непрозрачному alias, иначе Figma сбрасывает alpha. Текущие counts, размеры, fonts и image fills: [figma-audit.json](v41/figma-audit.json). Публикация Code Connect не выполнялась; это явная проверенная карта исходников.

---

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
