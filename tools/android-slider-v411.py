"""Regression: vertical page scrolling must not adjust the conceptual scene."""
from pathlib import Path
import subprocess, time, re, json
import xml.etree.ElementTree as E

root=Path(__file__).resolve().parents[1]
out=root/'docs/v411/android/interactions'
adb=str(Path.home()/'AppData/Local/Android/Sdk/platform-tools/adb.exe')
package='dev.specwatt.experience.v411.preview'
def run(*args): return subprocess.check_output([adb,*args],timeout=30)
def tree():
    result=run('shell','uiautomator','dump','/sdcard/v411-slider.xml')
    assert b'dumped to:' in result
    return E.fromstring(run('shell','cat','/sdcard/v411-slider.xml'))
def shot(name): (out/(name+'.png')).write_bytes(run('exec-out','screencap','-p'))
old=run('shell','settings','get','system','font_scale').decode().strip()
checks=[]
try:
    for scale in ['1.0','1.3','1.5']:
        run('shell','settings','put','system','font_scale',scale)
        run('shell','am','force-stop',package)
        run('shell','am','start','-n',package+'/.MainActivity','-a','android.intent.action.VIEW','-d','specwatt-experience-v411://lighting')
        time.sleep(4)
        for _ in range(6):
            t=tree()
            candidates=[n for n in t.iter('node') if n.get('content-desc','').startswith('Яркость концептуальной сцены')]
            if candidates: break
            run('shell','input','swipe','900','1700','900','900','200')
        assert candidates, 'Slider not reachable'
        slider=candidates[0]
        assert '70%' in slider.get('content-desc','')
        x1,y1,x2,y2=map(int,re.findall(r'\d+',slider.get('bounds')))
        x=(x1+x2)//2; y=(y1+y2)//2
        run('shell','input','swipe',str(x),str(y),str(x),str(max(300,y-650)),'400')
        # Restore the top for a fresh value inspection, without touching a preset.
        for _ in range(3): run('shell','input','swipe','900','400','900','1700','200')
        t=tree()
        assert any('70%' in n.get('text','') or ('Яркость концептуальной сцены' in n.get('content-desc','') and '70%' in n.get('content-desc','')) for n in t.iter('node')), 'Vertical scrolling changed the brightness'
        shot('slider-vertical-'+scale)
        # Reveal it again, then verify an intentional horizontal drag.
        for _ in range(6):
            t=tree(); candidates=[n for n in t.iter('node') if n.get('content-desc','').startswith('Яркость концептуальной сцены')]
            if candidates: break
            run('shell','input','swipe','900','1700','900','900','200')
        assert candidates
        x1,y1,x2,y2=map(int,re.findall(r'\d+',candidates[0].get('bounds'))); y=(y1+y2)//2
        run('shell','input','swipe',str(x1+40),str(y),str(x2-40),str(y),'500')
        t=tree(); values=[n.get('content-desc','') for n in t.iter('node') if n.get('content-desc','').startswith('Яркость концептуальной сцены')]
        assert values and '70%' not in values[0], 'Horizontal drag failed to adjust brightness'
        shot('slider-horizontal-'+scale)
        checks.append({'fontScale':scale,'verticalScrollPreserves70':True,'horizontalDrag':values[0]})
finally:
    run('shell','settings','put','system','font_scale',old)
(out/'slider-results.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(checks,ensure_ascii=True))
