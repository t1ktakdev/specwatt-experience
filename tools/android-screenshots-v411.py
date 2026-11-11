"""Capture the installed, separate V4.1 Android preview through adb."""
import json
import argparse
import os
import subprocess
import time
import xml.etree.ElementTree as ET
from pathlib import Path

root = Path(__file__).resolve().parents[1]
adb = str(Path(os.environ.get('ANDROID_HOME', Path.home() / 'AppData/Local/Android/Sdk')) / 'platform-tools/adb.exe')
package = 'dev.specwatt.experience.v411.preview'
out = root / 'docs/v411/android'
routes = ['welcome','home','lighting','energy','devices','device','autopilot','planner','journal','setup','settings','protected']
expected = dict(zip(routes, ['Энергия.', 'Добрый вечер.', 'Атмосферный свет', 'Энергия в деталях', 'Ваши устройства', 'Основной свет', 'Правила света', 'План нагрузки', 'Журнал событий', 'SPECWATT / 01 ИЗ 03', 'Настройки', 'Под защитой']))
expected.update({'setup?step=2':'SPECWATT / 02 ИЗ 03','setup?step=3':'SPECWATT / 03 ИЗ 03'})

def run(*args):
    return subprocess.check_output([adb, *args], timeout=30)

def snapshot(path):
    path.write_bytes(run('exec-out','screencap','-p'))

def hierarchy():
    result = subprocess.run([adb,'shell','uiautomator','dump','/sdcard/specwatt-v411.xml'],capture_output=True,timeout=30,check=True)
    if b'null root node' in result.stderr:
        return None
    if b'dumped to:' not in result.stdout:
        raise RuntimeError((result.stdout+result.stderr).decode('utf-8','replace'))
    return run('shell','cat','/sdcard/specwatt-v411.xml')

old_scale = run('shell','settings','get','system','font_scale').decode().strip()
parser = argparse.ArgumentParser()
parser.add_argument('--scales', nargs='+', default=['1.0','1.3','1.5'])
args = parser.parse_args()
prior_path = out / 'capture-results.json'
results = json.loads(prior_path.read_text())['captures'] if prior_path.exists() else []
results = [r for r in results if r['scale'] not in args.scales]
try:
    for scale in args.scales:
        run('shell','settings','put','system','font_scale',scale)
        run('shell','am','force-stop',package)
        target = out / scale
        target.mkdir(parents=True, exist_ok=True)
        for route in routes + ['setup?step=2','setup?step=3']:
            run('shell','am','start','-n',f'{package}/.MainActivity','-a','android.intent.action.VIEW','-d',f'specwatt-experience-v411://{route}')
            time.sleep(1.2)
            key = route.replace('?step=','-')
            for attempt in range(3):
                xml = hierarchy()
                if xml is None:
                    time.sleep(1)
                    continue
                texts = [n.attrib.get('text','') for n in ET.fromstring(xml).iter('node')]
                if any(expected[route] in t for t in texts):
                    break
                time.sleep(1)
            else:
                raise RuntimeError(f'Expected route did not render: {scale} {route}')
            snapshot(target / f'{key}.png')
            (target / f'{key}.xml').write_bytes(xml)
            texts = [n.attrib.get('text','') for n in ET.fromstring(xml).iter('node')]
            if any('Unable to load script' in t or 'Render Error' in t for t in texts):
                raise RuntimeError(f'Android runtime failed: {scale} {route}')
            # Exercise each real scroll view, retaining the fixed navigation and safe area.
            for _ in range(6):
                run('shell','input','swipe','540','1650','540','450','120')
            time.sleep(.25)
            bottom = hierarchy()
            if bottom is None:
                time.sleep(.5)
                bottom = hierarchy()
            if bottom is None:
                raise RuntimeError(f'No bottom hierarchy: {scale} {route}')
            snapshot(target / f'{key}-bottom.png')
            (target / f'{key}-bottom.xml').write_bytes(bottom)
            results.append({'scale':scale,'route':route,'texts':sum(bool(t) for t in texts),'scrollExercised':True,'top':f'{scale}/{key}.png','bottom':f'{scale}/{key}-bottom.png'})
        print(f'Captured {scale}: 12 routes + 3 setup steps', flush=True)
finally:
    run('shell','settings','put','system','font_scale',old_scale)
    (out / 'capture-results.json').write_text(json.dumps({'originalFontScale':old_scale,'captures':results},indent=2),encoding='utf-8')
print(f'{len(results)} Android captures; original font scale restored')
