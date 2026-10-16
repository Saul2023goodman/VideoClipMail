"""Capture the unchanged native monitor against the frozen later-mailbox transport."""
from pathlib import Path
from datetime import datetime, timezone
from playwright.sync_api import sync_playwright
from PIL import Image
import functools, hashlib, http.server, json, threading

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT.parents[1]
OUT = ROOT / 'public/native/v8'
OUT.mkdir(exist_ok=True)
DATA = json.loads((ROOT / 'src/demo-data.json').read_text())
LIFE = json.loads((ROOT / 'src/lifecycle-data.json').read_text())
mock = (ROOT / 'scripts/offline-provider.js').read_text().replace('__DATA__', json.dumps(DATA)).replace('__MAILBOX__', (ROOT / 'analysis/mailbox-fixture.json').read_text()).replace('window.__later=false', 'window.__later=true')

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args): pass

server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(APP)))
threading.Thread(target=server.serve_forever, daemon=True).start()
origin = f'http://127.0.0.1:{server.server_port}'
report = {'revision': 'lifecycle-v8', 'offline': True, 'unchangedApplication': True, 'errors': [], 'dpr': 2, 'contacts': {}, 'sourceHashes': {n: hashlib.sha256((APP/n).read_bytes()).hexdigest() for n in ['app.js', 'operations.js', 'app.css', 'ui-system.css']}}

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
        context = browser.new_context(viewport={'width':1920, 'height':1600}, device_scale_factor=2, timezone_id='Australia/Sydney')
        context.route('**/*', lambda r: r.continue_() if r.request.url.startswith(origin+'/') else r.abort())
        context.add_init_script(mock)
        page = context.new_page()
        page.on('pageerror', lambda error: report['errors'].append(str(error)))
        page.clock.install(time=datetime(2027,2,14,22,0,tzinfo=timezone.utc))
        page.clock.pause_at(datetime(2027,2,14,22,0,1,tzinfo=timezone.utc))
        page.goto(origin+'/app.html', wait_until='domcontentloaded')
        page.clock.run_for(2400)
        page.evaluate('document.fonts.ready')
        page.evaluate('''() => {
          const original=NMDAOperations.monitoringRoots;
          NMDAOperations.monitoringRoots=(...args)=>{const result=original(...args);window.__nativeRoots=JSON.parse(JSON.stringify(result));return result;};
          const create=NMDAOperations.createFollowUpTasks;
          NMDAOperations.createFollowUpTasks=(...args)=>{const result=create(...args);window.__nativeCreated=JSON.parse(JSON.stringify(result));return result;};
        }''')
        def settle(ms=600):
            page.clock.run_for(ms)
            page.wait_for_timeout(70)
        def click(selector):
            page.locator(selector).filter(visible=True).first.dispatch_event('click')
            settle()
        click('[data-tab="utilities"]')
        click('[data-open-utility="monitor"]')
        click('#nmda-monitor-sync')
        settle(2800)
        assert page.locator('.nmda-contact-card').count()==60
        click('#nmda-monitor-open-template')
        page.locator('#nmda-monitor-template-body').fill(LIFE['policy']['templateBody'])
        click('#nmda-monitor-save-template')
        click('#nmda-monitor-settings-done')
        click('[data-monitor-filter="all"]')
        roots = page.evaluate('window.__nativeRoots')
        report['rootCount'] = len(roots)
        native = {g['lastOutbound']['recipients'][0]['email']:g for g in roots}
        for d in LIFE['decisions']:
            g=native[d['email']]
            assert g['eligibility']['eligible']==d['eligible'], d['email']
            assert g['eligibility']['reason']==d['reason'], d['email']
        report['allSixtyDecisionMatches'] = True
        cards=page.locator('.nmda-contact-card')
        for i in [0,10,16,20,30,42,50,56]:
            d=DATA[i];card=cards.filter(has_text=d['email']).first
            card.scroll_into_view_if_needed();settle(120)
            card.screenshot(path=str(OUT/f'contact-{i:02d}.png'))
            head=card.locator('.nmda-contact-card-head')
            head.screenshot(path=str(OUT/f'head-{i:02d}.png'))
            detail=card.locator('.nmda-contact-history')
            if detail.count():
                detail.evaluate('(e)=>e.open=true');settle(100)
                detail.screenshot(path=str(OUT/f'history-{i:02d}.png'))
            box=card.bounding_box()
            pieces={}
            for key,sel in [('head','.nmda-contact-card-head'),('metrics','.nmda-contact-metrics'),('decision','.nmda-contact-decision'),('history','.nmda-contact-history'),('confirmation','.nmda-monitor-reply-evidence')]:
                el=card.locator(sel)
                if el.count() and el.is_visible():
                    b=el.bounding_box();pieces[key]={'x':b['x']-box['x'],'y':b['y']-box['y'],'w':b['width'],'h':b['height']}
                    if key=='confirmation':el.screenshot(path=str(OUT/f'confirmation-{i:02d}.png'))
            report['contacts'][str(i)]={'email':d['email'],'text':card.inner_text(),'box':box,'pieces':pieces}
            if i==16:
                node=card.locator('.nmda-monitor-path-node').filter(has_text='Auto-replies do not count').first
                assert node.count()
                old=node.get_attribute('style')
                node.evaluate('e=>{e.style.position="fixed";e.style.left="12px";e.style.top="12px";e.style.width="340px";e.style.zoom="3";e.style.zIndex="100000";}')
                settle(100);node.screenshot(path=str(OUT/'automatic-native-proof.png'))
                node.evaluate('(e,s)=>{if(s==null)e.removeAttribute("style");else e.setAttribute("style",s)}',old)
            if i==56:
                button=card.locator('[data-reply-disposition="human"]')
                old=button.get_attribute('style')
                button.evaluate('e=>{e.style.position="fixed";e.style.left="12px";e.style.top="12px";e.style.zoom="3";e.style.zIndex="100000";}')
                settle(100);button.screenshot(path=str(OUT/'confirm-human-native-button.png'))
                button.evaluate('(e,s)=>{if(s==null)e.removeAttribute("style");else e.setAttribute("style",s)}',old)
            if detail.count():detail.evaluate('(e)=>e.open=false')
        click('[data-monitor-filter="attention"]')
        click('[data-monitor-subfilter="due"]')
        assert cards.count()==20
        listing=page.locator('#nmda-monitor-list')
        listing.evaluate('''e=>{let a=e;while(a&&a!==document.documentElement){a.style.setProperty('overflow','visible','important');a.style.setProperty('max-height','none','important');a.style.setProperty('contain','none','important');a=a.parentElement;}window.scrollTo(0,0);}''')
        settle(120)
        box=listing.bounding_box()
        page.set_viewport_size({'width':1920,'height':int(box['y']+box['height']+160)})
        settle(200)
        listing.screenshot(path=str(OUT/'due-list.png'))
        box=listing.bounding_box()
        slots=[]
        for i,card in enumerate(cards.all()):
            b=card.bounding_box();email=next(d['email'] for d in LIFE['decisions'] if d['email'] in card.inner_text())
            index=next(d['index'] for d in LIFE['decisions'] if d['email']==email)
            assert LIFE['decisions'][index]['eligible']
            card.screenshot(path=str(OUT/f'due-row-{index:02d}.png'))
            slots.append({'index':index,'email':email,'x':b['x']-box['x'],'y':b['y']-box['y'],'w':b['width'],'h':b['height'],'file':f'v8/due-row-{index:02d}.png'})
        hide=page.add_style_tag(content='#nmda-monitor-list .nmda-contact-card{visibility:hidden!important}')
        listing.screenshot(path=str(OUT/'due-empty.png'))
        hide.evaluate('(e)=>e.remove()')
        page.locator('#nmda-monitor-select-visible').set_checked(True,force=True)
        settle(180)
        listing.screenshot(path=str(OUT/'due-selected-list.png'))
        bulk=page.locator('#nmda-monitor-bulkbar');bulk.screenshot(path=str(OUT/'selected-bulkbar.png'))
        report['selectedText']=page.locator('#nmda-monitor-selection-copy').inner_text()
        assert '20 selected' in report['selectedText']
        report['due']={'w':box['width'],'h':box['height'],'slots':slots,'selectedText':report['selectedText'],'bulkbar':bulk.bounding_box(),'background':listing.evaluate('e=>getComputedStyle(e).backgroundColor'),'captureViewport':page.viewport_size}
        click('#nmda-monitor-batch-create');settle(2200)
        created=page.evaluate('window.__nativeCreated')
        assert len(created['created'])==20 and len(created['skipped'])==0
        report['generated']={'created':len(created['created']),'skipped':len(created['skipped'])}
        assert not report['errors'],report['errors']
        report['currentApplicationHashesMatch']=all(hashlib.sha256((APP/n).read_bytes()).hexdigest()==digest for n,digest in report['sourceHashes'].items())
        assert report['currentApplicationHashesMatch']
        report['images']={file.name:{'w':Image.open(file).width,'h':Image.open(file).height} for file in OUT.glob('*.png')}
        (ROOT/'analysis/native-followup-v8.json').write_text(json.dumps(report,indent=2)+'\n')
        (ROOT/'src/followup-layout-v8.json').write_text(json.dumps({'due':report['due'],'contacts':report['contacts'],'images':report['images'],'source':'Unchanged native application; frozen offline mailbox.'},indent=2)+'\n')
        print(json.dumps({'contacts':60,'decisionMatches':60,'nativeEligibleRows':len(slots),'generated':report['generated'],'errors':report['errors']}),flush=True)
        browser.close()
finally:
    server.shutdown();server.server_close()
