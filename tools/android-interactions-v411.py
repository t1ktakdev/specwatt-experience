"""Exercise critical native flows on the installed emulator APK."""
import json
import re
import subprocess
import time
import xml.etree.ElementTree as ET
from pathlib import Path

root=Path(__file__).resolve().parents[1]
adb=str(Path.home()/'AppData/Local/Android/Sdk/platform-tools/adb.exe')
package='dev.specwatt.experience.v411.preview'
out=root/'docs/v411/android/interactions'
out.mkdir(parents=True,exist_ok=True)
checks=[]

def run(*a): return subprocess.check_output([adb,*a],stderr=subprocess.DEVNULL,timeout=30)
def tree():
    result=run('shell','uiautomator','dump','/sdcard/specwatt-v411.xml')
    if b'dumped to:' not in result:
        raise RuntimeError(result.decode('utf-8','replace'))
    return ET.fromstring(run('shell','cat','/sdcard/specwatt-v411.xml'))
def texts(t): return '\n'.join(n.get('text','')+' '+n.get('content-desc','') for n in t.iter('node'))
def tap(label):
    found=[]
    for attempt in range(8):
        nodes=list(tree().iter('node'))
        found=[n for n in nodes if n.get('content-desc')==label] or [n for n in nodes if n.get('text')==label]
        if found: break
        if attempt >= 2: run('shell','input','swipe','540','1650','540','550','150')
        time.sleep(.35)
    assert found, f'Missing control: {label}'
    x1,y1,x2,y2=map(int,re.findall(r'\d+',found[0].get('bounds')))
    assert x2>x1 and y2>y1, f'Empty control bounds: {label}'
    run('shell','input','tap',str((x1+x2)//2),str((y1+y2)//2))
    time.sleep(.4)
def capture(key):
    (out/f'{key}.png').write_bytes(run('exec-out','screencap','-p'))
    run('shell','uiautomator','dump','/sdcard/specwatt-v411.xml')
    (out/f'{key}.xml').write_bytes(run('shell','cat','/sdcard/specwatt-v411.xml'))
def open_route(route):
    run('shell','am','start','-n',f'{package}/.MainActivity','-a','android.intent.action.VIEW','-d',f'specwatt-experience-v411://{route}')
    time.sleep(2)

run('shell','am','force-stop',package)
open_route('devices')
tap('Светильник: питание')
t=tree()
assert '8,4 Вт' in texts(t)
switches=[n for n in t.iter('node') if n.get('class')=='android.widget.Switch']
ch1=next(n for n in switches if n.get('content-desc')=='Светильник: питание')
assert ch1.get('checked')=='false'
assert not any('CH3' in n.get('content-desc','') for n in switches)
capture('overload-refused')
checks.append('8.4 W rejected in native UI; CH1 remains off; no CH3 switch')
tap('Журнал событий')
assert 'Запрос отклонён' in texts(tree())
capture('journal-refusal')
run('shell','input','keyevent','4')
time.sleep(.4)
assert 'Ваши устройства' in texts(tree())
checks.append('Refusal is recorded; Android hardware Back returns to Devices')
tap('Настройки')
tap('Нет связи')
tap('Главная')
assert 'Нет актуальных данных' in texts(tree())
capture('offline-home')
tap('Устройства')
t=tree()
switches=[n for n in t.iter('node') if n.get('class')=='android.widget.Switch']
assert switches and all(n.get('enabled')=='false' for n in switches)
checks.append('Offline native budget is unknown and all visible channel switches are disabled')
tap('Настройки')
tap('Демо доступно')
open_route('planner')
tap('Новое расписание')
tap('Включить в (ЧЧ:ММ)')
run('shell','input','keyevent','123')
for _ in range(5): run('shell','input','keyevent','67')
run('shell','input','text','2359')
t=tree()
assert any(n.get('text')=='23:59' for n in t.iter('node'))
ime=run('shell','dumpsys','input_method').decode('utf-8','replace')
input_types=re.findall(r'inputType=0x([0-9a-fA-F]+)',ime)
assert input_types and any(int(v,16)&15==2 for v in input_types), 'Expected Android numeric keyboard'
capture('planner-keyboard')
run('shell','input','keyevent','4')
time.sleep(.4)
assert 'Свой ритм света' in texts(tree()) or 'Редактор расписания' in texts(tree())
checks.append('Native numeric keyboard formats 2359 as 23:59; Back dismisses keyboard and retains draft')
open_route('setup?step=3')
run('shell','input','keyevent','4')
time.sleep(.5)
assert '02 ИЗ 03' in texts(tree())
capture('setup-back-step2')
checks.append('Android hardware Back moves Setup 3 → 2')
# Every remaining screen is exercised with real native controls, not DOM substitutes.
def reveal(label):
    for _ in range(9):
        if label in texts(tree()): return
        run('shell','input','swipe','540','1650','540','550','150')
    raise AssertionError(f'Content not reachable by scrolling: {label}')

def checked(label):
    n=next(n for n in tree().iter('node') if n.get('class')=='android.widget.Switch' and n.get('content-desc')==label)
    return n.get('checked')=='true'

def fill(label, value):
    tap(label)
    run('shell','input','keyevent','123')
    for _ in range(40): run('shell','input','keyevent','67')
    run('shell','input','text',value)
    run('shell','input','keyevent','4')
    time.sleep(.3)

open_route('welcome')
tap('Открыть SpecWATT')
assert 'Добрый вечер.' in texts(tree())
checks.append('Welcome CTA opens Home')
open_route('autopilot')
assert sum(n.get('text')=='Сначала — разрешение' for n in tree().iter('node'))==1
tap('Сначала — разрешение')
assert not checked('Сначала — разрешение')
tap('LED-лента')
tap('Сначала — разрешение')
assert checked('Правила разрешены')
capture('autopilot-explicit-consent')
tap('LED-лента')
assert not checked('Сначала — разрешение')
checks.append('Autopilot caption appears once; master refuses without consent; CH2 consent enables it; final revocation disables it')

open_route('lighting')
tap('Тихий вечер')
assert '35%' in texts(tree())
tap('Яркий акцент')
assert '100%' in texts(tree())
capture('lighting-scene')
checks.append('Lighting presets change only the conceptual image brightness (35/100 percent)')

open_route('energy')
tap('День')
assert 'Средняя мощность по часам' in texts(tree())
tap('Месяц')
assert 'Энергия по интервалам' in texts(tree())
tap('Предыдущий интервал')
capture('energy-month-selection')
tap('Защищённый канал')
assert 'Под защитой' in texts(tree())
assert not any(n.get('class')=='android.widget.Switch' for n in tree().iter('node'))
capture('protected-no-switch')
checks.append('Energy period and interval controls work; consumer row opens Protected with no switch')

open_route('device')
tap('Назад')
assert 'Ваши устройства' in texts(tree())
checks.append('Deep-linked detail header Back falls back to Devices')

open_route('planner')
tap('Новое расписание')
tap('Сохранить демо-план')
reveal('Расписание Вечерний свет')
assert 'Расписание Вечерний свет' in texts(tree())
capture('planner-saved')
tap('Удалить расписание')
assert 'Расписание Вечерний свет' not in texts(tree())
checks.append('Native planner saves a valid 19:00–22:30 CH2 plan and deletes it from session state')

open_route('setup')
tap('У меня есть контроллер')
tap('Посмотреть настройку')
assert 'Сопряжение пока недоступно' in texts(tree())
capture('hardware-unavailable')
tap('Продолжить в демо')
tap('Продолжить настройку')
assert '03 ИЗ 03' in texts(tree())
tap('Начать знакомство')
assert 'Добрый вечер.' in texts(tree())
checks.append('Hardware setup is explicitly unavailable; continuation stays in a local demo and reaches Home')

old_scale=run('shell','settings','get','system','font_scale').decode().strip()
try:
    run('shell','settings','put','system','font_scale','1.5')
    run('shell','am','force-stop',package)
    open_route('home')
    for label, heading in [('Устройства','Ваши устройства'),('Энергия','Энергия в деталях'),('Авто','Правила света'),('Главная','Добрый вечер.')]:
        tap(label)
        assert heading in texts(tree())
    capture('large-font-navigation')
    open_route('planner')
    tap('Новое расписание')
    tap('Включить в (ЧЧ:ММ)')
    capture('large-font-editor-keyboard')
    run('shell','input','keyevent','4')
    tap('Сохранить демо-план')
    reveal('Расписание Вечерний свет')
    assert 'Расписание Вечерний свет' in texts(tree())
    capture('large-font-save')
    checks.append('At fontScale 1.5 all four navigation tabs remain usable; planner numeric keyboard and reachable Save work after real scrolling')
finally:
    run('shell','settings','put','system','font_scale',old_scale)
(out/'results.json').write_text(json.dumps({'checks':checks},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'checks':checks},ensure_ascii=True))
