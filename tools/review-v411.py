"""Arrange actual captures for review; never paint or retouch application pixels."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json

root = Path(__file__).resolve().parents[1]
out = root / 'docs/v411'
routes = ['welcome','home','lighting','energy','devices','device','autopilot','planner','journal','setup','settings','protected','setup-2','setup-3']
font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 20)
(out/'review').mkdir(exist_ok=True)
for scale in ['1.0','1.3','1.5']:
    for suffix in ['', '-bottom']:
        for group in range(3):
            keys=routes[group*5:group*5+5]
            canvas=Image.new('RGB',(320*len(keys),745),'#e8e6e1')
            draw=ImageDraw.Draw(canvas)
            for i,key in enumerate(keys):
                image=Image.open(out/'android'/scale/(key+suffix+'.png'))
                image.thumbnail((310,690))
                canvas.paste(image,(320*i+5,36))
                draw.text((320*i+8,8),key+suffix,font=font,fill='#151719')
            canvas.save(out/'review'/f'android-{scale}-{group}{suffix}.jpg',quality=92)
    for key in ['home','device','energy','planner','autopilot','settings']:
        canvas=Image.new('RGB',(800,900),'#e8e6e1');draw=ImageDraw.Draw(canvas)
        for i,(version,label) in enumerate([('v41','V4.1 / BEFORE'),('v411','V4.1.1 / AFTER')]):
            image=Image.open(root/'docs'/version/'android'/scale/(key+'.png'))
            image.thumbnail((393,852));canvas.paste(image,(i*400,38))
            draw.text((i*400+8,8),label,font=font,fill='#151719')
        canvas.save(out/'review'/f'{key}-{scale}-before-after.png')

# Full original Planner frames remain next to these explicitly labelled detail crops.
canvas=Image.new('RGB',(1110,250),'#e8e6e1');draw=ImageDraw.Draw(canvas)
for i,(path,top,label) in enumerate([
    (out/'after/web-planner.png',945.40625,'React / card'),
    (root/'docs/v41/after/figma-planner.png',950.3125,'Figma / before'),
    (out/'figma/planner.png',950.3125,'Figma / after'),
]):
    image=Image.open(path).crop((23,round(top),370,round(top)+185))
    canvas.paste(image,(i*370+8,45));draw.text((i*370+8,10),label,font=font,fill='#151719')
canvas.save(out/'review/planner-button-detail.png')

options=''.join(f'<option>{r}</option>' for r in routes)
html='''<!doctype html><html lang="ru"><meta charset="utf-8"><title>SpecWATT V4.1.1 · реальные снимки</title>
<style>body{font:16px system-ui;margin:24px;background:#eeece8;color:#202322}header{position:sticky;top:0;background:#eeece8;padding:12px 0}select{font:inherit;padding:8px}main{display:grid;grid-template-columns:repeat(4,minmax(200px,1fr));gap:20px}img{width:100%;display:block}h2{font-size:16px}p{max-width:1000px;line-height:1.5}</style>
<header><h1>SpecWATT V4.1.1 — реальные снимки</h1><label>Экран <select id="route">OPTIONS</select></label> <label>Android fontScale <select id="scale"><option>1.0</option><option>1.3</option><option>1.5</option></select></label> <label><input id="bottom" type="checkbox"> Конец прокрутки</label></header>
<p>Все изображения получены из React, Figma и установленного Android APK. Android 15/API 35: фон системной панели тёмный; светлая окраска её значков игнорируется этим образом эмулятора. Это ограничение не помечено как исправленное. Поля и вычисления Figma демонстрируют состояния; фактические ввод, отказы и разрешения проверяются в React и Android.</p>
<main><section><h2>Android V4.1 — до</h2><img id="before"></section><section><h2>Android V4.1.1 — после</h2><img id="after"></section><section><h2>Figma V4.1 — исправленный макет</h2><img id="figma"></section><section><h2>React V4.1 — проверенная основа</h2><img id="web"></section></main>
<script>function update(){let r=document.querySelector('#route').value,s=document.querySelector('#scale').value,b=document.querySelector('#bottom').checked;document.querySelector('#before').src='../v41/android/'+s+'/'+r+'.png';document.querySelector('#after').src='android/'+s+'/'+r+(b?'-bottom':'')+'.png';document.querySelector('#figma').src='figma/'+r+'.png';document.querySelector('#web').src='after/web-'+r+'.png';}for(const n of document.querySelectorAll('select,input'))n.onchange=update;document.querySelector('#route').value='home';update();</script></html>'''.replace('OPTIONS',options)
(out/'review.html').write_text(html,encoding='utf-8')
print('Actual before/after pairs, all 84 Android frames, Planner detail and local review gallery generated')
