#!/usr/bin/env python3
"""Capture the unchanged app with fictional data and offline Chrome API bindings."""
import ast
import base64
import csv
import functools
import http.server
import io
import json
from pathlib import Path
import threading

from playwright.sync_api import sync_playwright

PROJECT = Path('/workspace/videos/smartmail-chaos-choreographed')
SOURCE = Path('/workspace/VideoClipMail')
OUT = PROJECT / 'public/textures'
OUT.mkdir(parents=True, exist_ok=True)
mock = next(ast.literal_eval(node.value) for node in ast.parse(Path('/workspace/smartmail-tools/offline-smoke.py').read_text()).body if isinstance(node, ast.Assign) and any(isinstance(t, ast.Name) and t.id == 'mock' for t in node.targets))
mock += r"""
(() => {
 const account='demo@example.org';
 const empty={messages:[],complete:true,total:0,pages:1};
 let historyVisible=false;
 window.__setDemoMailboxHistory=()=>{historyVisible=true;};
 const sent={...empty,messages:[
  {id:'fictional-sent-1',recipients:[{name:'Maya Chen',email:'maya@atlas.example.org'}],subject:'A collaboration idea for Atlas Studio',sentAt:'2026-10-02T01:30:00Z'},
  {id:'fictional-sent-2',recipients:[{name:'Alex Morgan',email:'alex@cedar.example.org'}],subject:'A collaboration idea for Cedar Research',sentAt:'2026-10-06T01:30:00Z'},
  {id:'fictional-sent-3',recipients:[{name:'Nora Reed',email:'nora@atlas.example.org'}],subject:'A collaboration idea for Atlas Studio',sentAt:'2026-10-07T01:30:00Z'}
 ],total:3};
 const inbox={...empty,messages:[{id:'fictional-reply-1',sender:{name:'Alex Morgan',email:'alex@cedar.example.org'},subject:'Re: A collaboration idea for Cedar Research',receivedAt:'2026-10-08T09:00:00Z',inReplyTo:'fictional-sent-2',preview:'Thanks for the thoughtful note. Let us find a time to talk.'}],total:1};
 chrome.runtime.sendMessage=async message => {
  if(message.type==='NMDA_CONNECTION_STATUS')return {connected:true,authenticated:true,account,tabId:1};
  if(message.type==='NMDA_ACCOUNT_INFO')return {ok:true,account};
  if(['NMDA_READ_MAILBOX_STATE','NMDA_READ_DEDUPE_HISTORY'].includes(message.type))
   return {ok:true,complete:true,account,sent:historyVisible?sent:empty,drafts:empty,inbox:historyVisible?inbox:empty,historyMonths:0};
  if(message.type==='NMDA_READ_SCHEDULED_DRAFTS')return {ok:true,drafts:[],complete:true};
  if(message.type==='NMDA_SCAN_DRAFT_ATTACHMENTS')return {ok:true,complete:true,drafts:Array.from({length:3},(_,i)=>({id:'fictional-draft-'+i,ok:true,subject:'A collaboration idea',recipients:[{email:['jamie@northstar.example.org','avery@meridian.example.org','riley@northstar.example.org'][i]}],scheduleAt:'2030-11-07T07:30:00+08:00',attachments:[{id:'fictional-attachment-'+i,kind:'attachment',name:'Collaboration overview.pdf',size:1054}]}))};
  throw new Error('No external or send operations in this fictional demo: '+message.type);
 };
})();
"""

names = ['Maya Chen','Alex Morgan','Nora Reed','Jamie Park','Sam Rivera','Avery Lane','Riley Stone','Taylor Brooks']
institutions = ['Atlas Studio','Cedar Research','Atlas Studio','Northstar Lab','Cedar Research','Meridian Works','Northstar Lab','Meridian Works']
buffer = io.StringIO()
writer = csv.writer(buffer)
writer.writerow(['ID','Recipient','Institution','Subject','Body','Attachment','Scheduled Time','Tags'])
rows=[]
for i, (name, institution) in enumerate(zip(names, institutions)):
    first = name.split()[0]
    domain=institution.split()[0].lower()
    date='2030-11-14' if institution in institutions[:i] else '2030-11-07'
    rows.append([i+1, f'{first.lower()}@{domain}.example.org', institution, f'A collaboration idea for {institution}', f'Hi {first},\n\nYour work on accessible tools caught our attention. We are exploring a small research collaboration around clearer digital workflows.\n\nWould a brief conversation next week be useful? We can share a concise overview beforehand.\n\nBest,\nThe SmartMail demo team', 'Collaboration overview.pdf',date+' 07:30','Research collaboration'])
    writer.writerow(rows[-1])
writer.writerow(rows[0])
fixture = buffer.getvalue()
(PROJECT/'analysis/fictional-campaign.csv').write_text(fixture)
roster_buffer=io.StringIO()
roster_writer=csv.writer(roster_buffer)
roster_writer.writerow(['Name','Email','Institution'])
for name,institution,row in zip(names,institutions,rows):roster_writer.writerow([name,row[1],institution])
roster_fixture=roster_buffer.getvalue()
(PROJECT/'analysis/fictional-roster.csv').write_text(roster_fixture)
pdf=b'%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 0/Kids[]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF'

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args): pass

server = http.server.ThreadingHTTPServer(('127.0.0.1',0), functools.partial(Quiet,directory=str(SOURCE)))
thread = threading.Thread(target=server.serve_forever, daemon=True)
thread.start()
origin = f'http://127.0.0.1:{server.server_port}'
layout = {}

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/usr/bin/chromium',headless=True)
        context = browser.new_context(viewport={'width':1920,'height':1080},device_scale_factor=2,timezone_id='Asia/Singapore')
        context.route('**/*',lambda route: route.continue_() if route.request.url.startswith(origin+'/') else route.abort())
        context.add_init_script(mock)
        page = context.new_page()
        errors=[]
        page.on('pageerror',lambda error: errors.append(str(error)))
        page.goto(origin+'/app.html',wait_until='networkidle')
        page.locator('#nmda-root').wait_for(state='visible')
        # Provide the two missing symbols in the declared Inter font. Unicode
        # range keeps all existing Latin typography and native geometry intact.
        symbol_font=base64.b64encode(Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf').read_bytes()).decode()
        page.add_style_tag(content="@font-face{font-family:Inter;src:url(data:font/ttf;base64,"+symbol_font+");unicode-range:U+2197,U+21E7;}")
        page.evaluate('document.fonts.ready')
        def snap(name, selectors):
            page.evaluate('document.fonts.ready')
            page.screenshot(path=str(OUT/(name+'-full.png')))
            records=[]
            for key, selector in selectors.items():
                items=page.locator(selector)
                for i in range(min(items.count(),8)):
                    item=items.nth(i)
                    if not item.is_visible():continue
                    box=item.bounding_box()
                    if not box or box['width']<20 or box['height']<20:continue
                    file=f'{name}-{key}-{i}.png'
                    item.screenshot(path=str(OUT/file))
                    records.append({'key':key,'index':i,'file':file,'x':box['x'],'y':box['y'],'w':box['width'],'h':box['height']})
            layout[name]={'pageH':1080,'elements':records}
            (OUT/'layout.json').write_text(json.dumps(layout,indent=2))
            print('Captured '+name,flush=True)
        tokens=page.evaluate("""() => {const e=document.getElementById('nmda-root'),c=getComputedStyle(e); return Object.fromEntries(['--nmda-bg','--nmda-text','--nmda-blue','--nmda-font','--nmda-radius'].map(k=>[k,c.getPropertyValue(k)]));}""")
        (PROJECT/'analysis/product-tokens.json').write_text(json.dumps(tokens,indent=2))
        page.screenshot(path=str(OUT/'prepare-empty.png'))
        page.locator('#nmda-import-file').set_input_files([
          {'name':'Research outreach.csv','mimeType':'text/csv','buffer':fixture.encode()},
          {'name':'Reference contacts.csv','mimeType':'text/csv','buffer':roster_fixture.encode()},
          {'name':'Collaboration overview.pdf','mimeType':'application/pdf','buffer':pdf}])
        page.wait_for_timeout(1800)
        snap('sources',{'file':'.nmda-classify-file-row','field':'.nmda-inspector-mail-fields > div','panel':'.nmda-classify-inspector-pane'})
        page.get_by_role('button',name='Complete Classification',exact=True).click()
        page.wait_for_timeout(1600)
        if page.locator('#nmda-duplicate-decision').is_visible():
            snap('dedupe',{'decision':'#nmda-duplicate-decision','evidence':'#nmda-roster-audit-card'})
            page.locator('#nmda-duplicate-keep-selected').click()
            page.wait_for_timeout(700)
            for _ in range(8):
                if not page.locator('#nmda-duplicate-decision').is_visible():break
                page.locator('#nmda-duplicate-keep-all').click()
                page.wait_for_timeout(300)
        page.locator('#nmda-manage-attachments-strip').click()
        page.wait_for_timeout(500)
        page.locator('[data-attachment-policy]').first.select_option('smart')
        page.wait_for_timeout(500)
        snap('attachments',{'workspace':'.nmda-attachment-manager','asset':'#nmda-attachment-manager-list','hints':'#nmda-attachment-manager-requirements'})
        page.locator('#nmda-attachment-manager-done').click()
        page.wait_for_timeout(600)
        snap('prepare',{'panel':'#nmda-import-card','summary':'#nmda-import-handoff-card'})
        page.locator('[data-tab="review"]').click()
        page.wait_for_timeout(1000)
        snap('review-board',{'card':'.nmda-mail-review-card'})
        if page.locator('[data-review-preview-key]').count():
            page.locator('[data-review-preview-key]').first.click()
            page.wait_for_timeout(800)
        snap('preview',{'page':'.nmda-review-preview-page.is-active','sheet':'.nmda-review-preview-page.is-active .nmda-review-preview-sheet','rail':'#nmda-review-preview-rail','nav':'.nmda-head'})
        if page.locator('[data-preview-edit-key]').count():
            page.locator('[data-preview-edit-key]').first.click()
            page.wait_for_timeout(400)
            snap('edit',{'sheet':'.nmda-review-preview-sheet-edit','formatbar':'.nmda-preview-inline-formatbar'})
            if page.locator('[data-preview-edit-cancel]').count():page.locator('[data-preview-edit-cancel]').first.click()
        page.locator('[data-tab="dispatch"]').click()
        page.wait_for_timeout(900)
        page.locator('#nmda-open-schedule-modal').click()
        page.locator('#nmda-rule-time-zone').select_option('Asia/Singapore')
        page.locator('#nmda-rule-start-date').fill('2030-11-07')
        page.locator('#nmda-rule-local-time').fill('07:30')
        page.locator('#nmda-rule-preserve-existing').uncheck()
        page.wait_for_timeout(500)
        snap('schedule-rules',{'dialog':'.nmda-schedule-dialog','rules':'#nmda-scheduler-card','summary':'#nmda-schedule-rule-preview'})
        page.locator('#nmda-apply-schedule').click()
        page.wait_for_timeout(900)
        snap('schedule',{'board':'#nmda-preview-body','panel':'#nmda-schedule-rule-panel','rows':'[data-task-key]'})
        page.locator('[data-tab="utilities"]').click()
        page.wait_for_timeout(600)
        snap('utilities',{'card':'.nmda-utility-card'})
        page.locator('[data-open-utility="draft-attachments"]').click()
        page.wait_for_timeout(800)
        snap('maintenance',{'workspace':'[data-utility-workspace="draft-attachments"]','groups':'#nmda-draft-attachment-groups','stats':'.nmda-draft-attachment-stats'})
        page.locator('[data-utility-back]').filter(visible=True).first.click()
        page.wait_for_timeout(400)
        page.evaluate('window.__setDemoMailboxHistory()')
        page.locator('[data-open-utility="monitor"]').click()
        page.wait_for_timeout(1000)
        if page.locator('#nmda-monitor-sync').count():
            page.locator('#nmda-monitor-sync').click()
            page.wait_for_timeout(1200)
        snap('monitor',{'summary':'.nmda-monitor-overview','workspace':'[data-utility-workspace="monitor"]','table':'#nmda-monitor-list','contact':'.nmda-contact-card'})
        (PROJECT/'analysis/monitor-text.txt').write_text(page.locator('#nmda-root').inner_text())
        page.locator('[data-utility-back]').filter(visible=True).first.click()
        page.wait_for_timeout(400)
        page.locator('[data-open-performance]').click()
        page.wait_for_timeout(900)
        snap('performance',{'dashboard':'[data-pane="dashboard"]','kpi':'.nmda-dashboard-kpi','signals':'#nmda-dashboard-opportunity-list','field':'#nmda-dashboard-field'})
        (OUT/'layout.json').write_text(json.dumps(layout,indent=2))
        print(json.dumps({'root':page.locator('#nmda-root').inner_text()[:14000],'visible_buttons':page.locator('button:visible').all_text_contents()[:100],'errors':errors},ensure_ascii=False),flush=True)
        page.screenshot(path=str(OUT/'import-inspect.png'))
        (PROJECT/'analysis/product-inspection.html').write_text(page.content())
        browser.close()
finally:
    server.shutdown();server.server_close();thread.join(timeout=5)
