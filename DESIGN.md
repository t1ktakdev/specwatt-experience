# V4.1 Candidate · текущее направление

Warm Graphite × Ambient Amber сохраняется. Референс A задаёт предметный масштаб и физические материалы, B — атмосферу и переход от интерьера к управлению, C — числовую и причинную ясность. Собственные изображения концептуального светильника явно подписаны; фотографии референсов не поставляются.

Двенадцать задач образуют разные композиции: архитектурный Welcome, энергобаланс Home, интерьер Lighting, исследуемая аналитика Energy, инвентарные строки Devices, предмет Device Detail, последовательность решений Autopilot, временная диаграмма Planner, хронология Journal, три стадии Setup, операционные группы Settings и паспорт защиты CH3. Прозрачность декоративных слоёв не связывается с непрозрачными цветовыми переменными Figma. Основные цвета и типографика используют существующие токены; 62 переменные сохранены.

29 пар при одинаковых данных доступны в [приёмке V4.1](docs/v41/review.html). Android имеет собственные системные Switch, клавиатуру, Safe Area и прокрутку; воспроизведение Figma не проверено. Детальные наблюдения и подтверждения — [DELIVERY](docs/v41/DELIVERY.md).

Ниже сохранено описание исходного V4.

# Experience V4 · Warm Graphite × Ambient Amber

V4 starts from the real v1.1.0 repository at `263a4df`; it preserves Welcome's original architectural photograph and Manrope, and improves the full twelve-route experience. The original SpecWATT application and both rejected Figma files remain unchanged.

Home's rejected oval is replaced by an architectural LED profile. Energy has a legible, inspectable interval chart and exact channel-energy allocations. Devices uses an inventory rather than the Home card composition. Detail has a coherent disk pendant. Autopilot is a permission-led policy editor. The planner shows protected base load, per-channel lanes and conflicting draft intervals. Journal is a chronological ledger. Setup uses a truthful connection topology rather than a pseudo board. Settings is grouped operationally. CH3 is a safety passport with its role in the power budget.

The shared token file generates CSS/native tokens. The editable Figma file contains foundations, 62 variables, seven text styles, 32 component variants/primitives, fourteen core frames covering twelve routes and three setup steps, fifteen additional states, handoff and a navigation prototype. [IDs and source mapping](docs/COMPONENT-MAP.md).

The supplied four images were inspected. Three original collage references and the oval close-up are retained under `docs/v4/` for review. The Dribbble references informed composition, lighting and density; their artwork is not shipped. Welcome and Lighting use two different original AI-generated interiors retained from V3. UI, icons, graphs and the new LED rail/pendant are editable DOM/SVG/native/Figma layers.

Parities are assessed at 393 px from actual Chromium and Figma renders. Small differences remain in antialiasing, gradient/shadow rendering, asymmetric borders and SVG label positioning. Figma import errors in opacity, transforms, grid spans, button tones, progress indicators, range inputs and fallback SVG fonts were corrected through layer inspection and screenshot comparison. This is not a claim of pixel-identical rendering.

Motion is functional in the web app: chart/schedule entrance 420 ms, screen transition 350 ms, controls 200 ms, with reduced-motion support. Native route transitions compile and honor AccessibilityInfo; device runtime remains unverified. The Figma prototype has verified navigation links; playback/animated behavior is not claimed.
