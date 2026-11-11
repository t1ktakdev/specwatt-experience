"""Build review artifacts from independently captured browser/Figma PNGs."""
from pathlib import Path
import json
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
out = root / 'docs/v41'
screens = json.loads((root / 'docs/figma-v41-screens.json').read_text())['screens']
states = json.loads((root / 'docs/figma-v41-states.json').read_text())['screens']
rows = screens + states
keys = [r['name'].split()[-1] for r in rows]
for width in [320, 440]:
    for part in ['top','bottom']:
        sheet = Image.new('RGB', (1400,1120), '#eeeeee')
        draw = ImageDraw.Draw(sheet)
        for i,key in enumerate(keys[:14]):
            path = out / f'mobile/{key}-{width}-{part}.png'
            if not path.exists():
                path = out / f'mobile/{key}-{width}-top.png'
            im = Image.open(path).convert('RGB')
            im = im.resize((190,round(im.height*190/im.width)))
            x,y=(i%7)*200,(i//7)*560
            draw.text((x,y),key,fill='black')
            sheet.paste(im,(x,y+20))
        sheet.save(out / f'mobile/inspect-{width}-{part}.png')
for offset in range(0, len(rows), 3):
    sheet = Image.new('RGB', (6 * 210, 1200), '#ece9e3')
    d = ImageDraw.Draw(sheet)
    for j, key in enumerate(keys[offset:offset+3]):
        for k, kind in enumerate(['web', 'figma']):
            im = Image.open(out / f'after/{kind}-{key}.png').convert('RGB')
            im = im.resize((200, round(im.height * 200 / im.width)))
            x = (j * 2 + k) * 210
            d.text((x, 3), f'{kind} / {key}', fill='black')
            sheet.paste(im, (x, 25))
    sheet.save(out / f'after/accepted-pairs-{offset//3}.png')

for scale in ['1.0','1.3','1.5']:
    sheet = Image.new('RGB',(1540,1000),'#eeeeee')
    draw = ImageDraw.Draw(sheet)
    for i,key in enumerate(keys[:14]):
        path = out / f'android/{scale}/{key}.png'
        if not path.exists():
            continue
        im = Image.open(path).convert('RGB').resize((210,455))
        x,y=(i%7)*220,(i//7)*500
        draw.text((x,y),key,fill='black')
        sheet.paste(im,(x,y+22))
    sheet.save(out / f'android/verified-{scale}.png')

html = '''<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>SpecWATT V4.1 · Приёмка</title><style>body{font-family:system-ui,sans-serif;margin:32px;background:#e9e6e0;color:#202425;line-height:1.5}h1,h2{font-weight:500}.pair{display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap}figure{margin:0}img{width:393px;max-width:90vw;display:block}figcaption{margin:12px 0}section{margin:64px 0}a{color:inherit}nav{display:flex;gap:16px;flex-wrap:wrap}.native img{width:300px}p{max-width:1000px}</style><h1>SpecWATT V4.1 Candidate</h1><p>29 независимых сравнений: исходный V4 → React V4.1 → редактируемые слои Figma V4.1. Ширина 393 px; время и данные зафиксированы одной тестовой фикстурой. Растровые снимки здесь — доказательства, а не содержимое Figma.</p><p><a href="https://www.figma.com/design/CZEjsvoYoT7888KQ0o7B5Q?node-id=69-9">Figma Candidate</a> · <a href="https://www.figma.com/proto/CZEjsvoYoT7888KQ0o7B5Q?node-id=91-9&page-id=89-9&scaling=scale-down">Прототип (playback не проверен)</a> · <a href="http://127.0.0.1:4174/#home">Интерактивный локальный React</a> · <a href="DELIVERY.md">Решения и пять проходов QA</a></p><nav>'''
for key in keys:
    html += f'<a href="#{key}">{key}</a>'
html += '</nav>'
for r, key in zip(rows, keys):
    html += f'<section id="{key}"><h2>{key}</h2><div class="pair">'
    old_key={'energy-day':'energy-День','energy-month':'energy-Месяц'}.get(key,key)
    for caption, src in [('V4 / React',f'../v4/screens/web-{old_key}.png'),('V4.1 / React',f'after/web-{key}.png'),(f'V4.1 / Figma · {r["id"]}',f'after/figma-{key}.png')]:
        html += f'<figure><figcaption>{caption}</figcaption><a href="{src}"><img src="{src}" loading="lazy" alt="{caption} · {key}"></a></figure>'
    html += '</div><p>'
    for w in [320,440]:
        path = out / f'mobile/{key}-{w}-top.png'
        if path.exists():
            html += f'<a href="mobile/{path.name}">{w} px / верх</a> · '
            if (out / f'mobile/{key}-{w}-bottom.png').exists():
                html += f'<a href="mobile/{key}-{w}-bottom.png">низ</a> · '
    html += '</p></section>'
html += '<section class="native"><h2>Android · реальные снимки эмулятора</h2><p>Отдельное нативное приложение, не WebView. Полный контент доступен прокруткой. Три масштаба системного шрифта.</p>'
for scale in ['1.0','1.3','1.5']:
    html += f'<h3>fontScale {scale}</h3><div class="pair">'
    for key in keys[:14]:
        path = out / f'android/{scale}/{key}.png'
        if path.exists():
            html += f'<figure><figcaption>{key}</figcaption><a href="android/{scale}/{key}.png"><img src="android/{scale}/{key}.png" loading="lazy" alt="Android {key} {scale}"></a></figure>'
    html += '</div>'
html += '</section></html>'
(out / 'review.html').write_text(html, encoding='utf-8')
print(f'Built {len(rows)} comparison entries and 10 inspection sheets')
