"""Write the current Figma/source mapping without replacing the V4 record."""
from pathlib import Path
import json
root = Path(__file__).resolve().parents[1]
docs = root / 'docs'
web = {'device':'DeviceDetail','protected':'Protected','setup-2':'Setup','setup-3':'Setup'}
native = {k:'native/screens.tsx' for k in ['welcome','home','lighting','energy','protected']}
native.update({k:f'native/{v}.tsx' for k,v in {'devices':'Devices','device':'DeviceDetail','autopilot':'Autopilot','planner':'Planner','journal':'Journal','setup':'Setup','settings':'Settings','setup-2':'Setup','setup-3':'Setup'}.items()})
rows = json.loads((docs/'figma-v41-screens.json').read_text())['screens'] + json.loads((docs/'figma-v41-states.json').read_text())['screens']
lines = ['# React ↔ React Native ↔ Figma V4.1 Candidate','','Текущие реальные узлы после визуальной проверки и очистки временных импортов. V4 сохранён ниже. Нативные снимки получены на отдельном x86_64 Android preview; системные элементы отличаются от веба. Figma playback не проверен.','','| Экран / состояние | React | React Native | Figma |','|---|---|---|---|']
for r in rows:
    route=r['route']
    source = 'src/components/LimitDialog.tsx' if route=='limit' else f'src/screens/{web.get(route,route.capitalize())}.tsx'
    rn = 'native/Experience.tsx · notice' if route=='limit' else native[route]
    r.update(reactSource=source,nativeSource=rn)
    lines.append(f'| {r["key"]} | `{source}` | `{rn}` | [{r["id"]}](https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id={r["id"].replace(":","-")}) |')
lines += ['', 'Candidate страницы: Screens `69:9`, Components `75:9`, States `84:92`, Prototype `89:9`. Прототип: 29 фреймов 393 × 852 и 210 переходов; [точные ID](figma-v41-prototype.json).','', '| Переиспользуемый компонент | Реализация | Реальные master IDs |','|---|---|---|','| CH1/CH2 Tile, Row, Unknown | `src/components/ui.tsx · DeviceCard`, `native/components.tsx · NativeDeviceTile` | `94:43`, `94:73`, `94:96`, `94:126`, `94:149`, `94:179` |','| Энергобаланс Known / Unknown | `src/components/LoadBudget.tsx`, `native/components.tsx · NativePower` | `94:240`, `94:209` |','| Toggle Off / On / Disabled / Unavailable | `src/components/ui.tsx · Toggle`, `native/controls.tsx · NativeToggle` | set `86:21`, variants `86:9`, `86:12`, `86:15`, `86:18` |','| Предметные изображения / LED-вектор | `src/components/ProductVisual.tsx`, `native/Product.tsx` | image fills CH1 и настоящие VECTOR CH2 внутри устройств |','| Primary / check / arrow, Nav, Brand, StatusBar | `src/components/ui.tsx`, `native/components.tsx`, `native/Experience.tsx` | существующая библиотека V4, включая check `40:38` и arrow `40:34` |','', 'Сохранены существующие 31 primitive + 31 semantic variables и семь text styles. Декоративные полупрозрачные краски не привязываются к непрозрачному alias, иначе Figma сбрасывает alpha. Текущие counts, размеры, fonts и image fills: [figma-audit.json](v41/figma-audit.json). Публикация Code Connect не выполнялась; это явная проверенная карта исходников.','', '---','']
path=docs/'COMPONENT-MAP.md'
old=path.read_text(encoding='utf-8')
if not old.startswith('# React ↔ React Native ↔ Figma V4.1 Candidate'):
    path.write_text('\n'.join(lines)+old,encoding='utf-8')
(docs/'figma-v41-map.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Mapped {len(rows)} final frames and native sources')
