#!/usr/bin/env python3
"""Record real native UI actions against a frozen, isolated fictional mailbox.

The app's import, dedupe, review, scheduling, maintenance, and reply logic run
unchanged. Only the Chrome/provider boundary is replaced. Nothing is sent.
"""
import ast
import base64
import csv
from datetime import datetime, timezone
import functools
import http.server
import io
import json
from pathlib import Path
import subprocess
import sys
import threading
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
APP = Path(sys.argv[sys.argv.index('--app') + 1]).resolve() if '--app' in sys.argv else Path('/workspace/VideoClipMail')
PROOF = '--proof' in sys.argv
HIRES = '--hires' in sys.argv
PROOF = PROOF or HIRES
SEGMENT = tuple(map(int,sys.argv[sys.argv.index('--segment')+1:sys.argv.index('--segment')+3])) if '--segment' in sys.argv else None
OUT = ROOT / 'public/native'
OUT.mkdir(parents=True, exist_ok=True)
FPS, TOTAL, W, H, DSF = 30, 2520, 1440, 1000, 2

names = ['Maya Chen','Alex Morgan','Nora Reed','Jamie Park','Sam Rivera','Avery Lane','Riley Stone','Taylor Brooks']
orgs = ['Atlas Studio','Cedar Research','Atlas Studio','Northstar Lab','Cedar Research','Meridian Works','Northstar Lab','Meridian Works']
emails = [n.split()[0].lower()+'@'+o.split()[0].lower()+'.example.org' for n,o in zip(names,orgs)]
rows = []
for i,(name,org,email) in enumerate(zip(names,orgs,emails)):
    greeting = 'Nora' if i == 0 else name.split()[0]
    body = f'Hi {greeting},\n\nYour work on accessible tools caught our attention. We would like to explore a research collaboration with {org}.\n\nThe project brief is attached. Would you be open to a short conversation next week?\n\nBest,\nThe SmartMail demo team'
    rows.append([i+1,email,org,'A collaboration idea for '+org,body,'Project brief v1.pdf','2030-11-07T09:00:00+08:00','Collaboration'])
# The shorter draft is the older export; the revised copy still has a copied greeting.
old = list(rows[0]); old[4] = 'Hi Maya,\n\nCould we arrange a meeting?\n\nBest,\nThe SmartMail demo team'; old[0] = 'Maya-old'
new = list(rows[0]); new[0] = 'Maya-revised'
buf=io.StringIO(); writer=csv.writer(buf)
writer.writerow(['ID','Name','Recipient','Institution','Subject','Body','Attachment','ScheduledTime','Tags'])
writer.writerows([[row[0],names[emails.index(row[1])],*row[1:]] for row in [old,new]+rows[1:]]); campaign=buf.getvalue()
buf=io.StringIO(); writer=csv.writer(buf); writer.writerow(['Name','Email','Institution']); writer.writerows(zip(names,emails,orgs)); roster=buf.getvalue()
(ROOT/'analysis/fictional-campaign.csv').write_text(campaign)
(ROOT/'analysis/fictional-roster.csv').write_text(roster)
pdf = b'%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 0/Kids[]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF'
fixtures=[{'name':'Partner invitations.csv','mimeType':'text/csv','buffer':campaign.encode()},{'name':'Partner contacts.csv','mimeType':'text/csv','buffer':roster.encode()},{'name':'Project brief v1.pdf','mimeType':'application/pdf','buffer':pdf}]

base_mock = r"""
(() => {
 const key='__film_offline_chrome_storage__', read=()=>JSON.parse(localStorage.getItem(key)||'{}');
 const listeners=new Set();
 window.chrome={...window.chrome,runtime:{getURL:p=>new URL(p,location.origin).href,onMessage:{addListener:f=>listeners.add(f),removeListener:f=>listeners.delete(f)},connect:options=>{if(options.name!=='NMDA_RUNTIME_FILE_SOURCE')throw new Error('Blocked port');return {onMessage:{addListener(){}},onDisconnect:{addListener(){}},postMessage(){},disconnect(){}};}},storage:{local:{
 get:async keys=>{const d=read();if(keys==null)return d;return Object.fromEntries((typeof keys==='string'?[keys]:Array.isArray(keys)?keys:Object.keys(keys)).filter(k=>k in d).map(k=>[k,d[k]]));},
 set:async entries=>localStorage.setItem(key,JSON.stringify({...read(),...entries})),remove:async keys=>{const d=read();for(const k of typeof keys==='string'?[keys]:keys)delete d[k];localStorage.setItem(key,JSON.stringify(d));}
 }}};
 const account='demo@example.org',empty={messages:[],complete:true,total:0,pages:1};
 let history=false,reply=false;
 window.__requests=[];window.__phases=[];window.__filmFrame=0;window.__demoHistory=()=>history=true;window.__demoReply=()=>reply=true;
 const sent={...empty,total:3,messages:[
 {id:'demo-sent-maya',recipients:[{name:'Maya Chen',email:'maya@atlas.example.org'}],subject:'A collaboration idea for Atlas Studio',body:'Hi Maya,\n\nYour work on accessible tools caught our attention.\n\nBest,\nThe SmartMail demo team',sentAt:'2030-11-07T01:00:00Z'},
 {id:'demo-sent-alex',recipients:[{name:'Alex Morgan',email:'alex@cedar.example.org'}],subject:'A collaboration idea for Cedar Research',body:'Hi Alex,\n\nYour work on accessible tools caught our attention.\n\nBest,\nThe SmartMail demo team',sentAt:'2030-11-07T01:00:00Z'},
 {id:'demo-sent-jamie',recipients:[{name:'Jamie Park',email:'jamie@northstar.example.org'}],subject:'A collaboration idea for Northstar Lab',body:'Hi Jamie,\n\nYour work on accessible tools caught our attention.\n\nBest,\nThe SmartMail demo team',sentAt:'2030-11-07T01:00:00Z'}]};
 const inbox={...empty,total:1,messages:[{id:'demo-alex-reply',sender:{name:'Alex Morgan',email:'alex@cedar.example.org'},subject:'Re: A collaboration idea for Cedar Research',receivedAt:'2030-11-10T09:00:00Z',inReplyTo:'demo-sent-alex',preview:'Thanks for the note. Let us find a time to talk.',body:'Thanks for the note. Let us find a time to talk.'}]};
 const drafts=['nora@atlas.example.org','sam@cedar.example.org','riley@northstar.example.org'].map((email,i)=>({id:'demo-draft-'+i,ok:true,subject:'A collaboration idea for '+['Atlas Studio','Cedar Research','Northstar Lab'][i],recipients:email,bodyHtml:'<p>Hi '+['Nora','Sam','Riley'][i]+',</p><p>The project brief is attached.</p>',cc:'',bcc:'',scheduleAt:'2030-11-14T09:00:00+08:00',scheduledDraft:true,attachments:[{id:'old-file-'+i,kind:'attachment',name:'Project brief v1.pdf',size:139}]}));
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 const broadcast=m=>{window.__phases.push({phase:m.phase,current:m.current,frame:window.__filmFrame});listeners.forEach(f=>f(m));};
 chrome.runtime.sendMessage=async m=>{
  window.__requests.push({type:m.type,time:performance.now()});
  if(m.type==='NMDA_CONNECTION_STATUS')return {connected:true,authenticated:true,account,tabId:1};
  if(m.type==='NMDA_ACCOUNT_INFO')return {ok:true,account};
  if(['NMDA_READ_MAILBOX_STATE','NMDA_READ_DEDUPE_HISTORY'].includes(m.type))return {ok:true,complete:true,account,sent:history?sent:empty,drafts:empty,inbox:history&&reply?inbox:empty,historyMonths:0};
  if(m.type==='NMDA_READ_SCHEDULED_DRAFTS')return {ok:true,drafts:[],scheduled:[],complete:true};
  if(m.type==='NMDA_SCAN_DRAFT_ATTACHMENTS')return {ok:true,complete:true,drafts:JSON.parse(JSON.stringify(drafts))};
  if(m.type==='NMDA_DRAFT_ATTACHMENT_MONITOR')return {ok:true};
  if(m.type==='NMDA_DRAFT_ATTACHMENT_SEED'){await wait(300);return {ok:true,source:{id:'demo-new-source',name:'Project brief v2.pdf'},seedDraftId:'demo-seed'};}
  if(m.type==='NMDA_DRAFT_ATTACHMENT_SEED_CLEANUP')return {ok:true,verified:true};
  if(m.type==='NMDA_DRAFT_ATTACHMENT_MUTATE'){
    for(const phase of ['read','clone','attachments','verify','swap']){
      broadcast({type:'NMDA_DRAFT_ATTACHMENT_PROGRESS_BROADCAST',executionId:m.executionId,phase,current:m.current,total:m.total,subject:m.summary.subject,message:({read:'Reading original recipients, body and time',clone:'Building a new draft before replacing the original',attachments:'Replacing Project brief v1.pdf with Project brief v2.pdf',verify:'Verifying recipient, body, subject and scheduled time',swap:'Verified. Completing replacement.'})[phase]});
      await wait(260);
    }
    const d=drafts.find(d=>d.id===m.draftId);d.attachments=[{id:'new-file-'+m.current,kind:'attachment',name:m.source.name,size:m.source.size}];
    return {ok:true,verified:true,draftId:d.id};
  }
  throw new Error('Blocked external/send operation in offline film: '+m.type);
 };
})();
"""

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(APP)))
thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
origin=f'http://127.0.0.1:{server.server_port}'
records={}; errors=[]; snapshots={}; codec=None; hires=[]
proof_frames={30,150,240,300,345,405,438,540,600,650,710,760,805,895,935,1050,1150,1295,1370,1460,1500,1610,1670,1725,1760,1795,1830,1865,1960,2050,2120,2180,2300,2430,2519}
selectors={
 'nav':'.nmda-head','import':'#nmda-import-card','files':'.nmda-classify-file-row','roster':'#nmda-roster-audit-card',
 'dedupe':'#nmda-duplicate-decision','candidates':'.nmda-duplicate-candidate',
 'preview':'.nmda-review-preview-page.is-active','sheet':'.nmda-review-preview-page.is-active .nmda-review-preview-sheet',
 'rail':'#nmda-review-preview-rail','editor':'[data-preview-edit-body]',
 'attachments':'#nmda-attachment-manager-list','requirements':'#nmda-attachment-manager-requirements',
 'rules':'#nmda-scheduler-card','rule-summary':'#nmda-schedule-rule-preview','schedule':'.nmda-dispatch-mail-card, .nmda-dispatch-card, .nmda-plan-matrix',
 'old-file':'#nmda-draft-attachment-groups','targets':'#nmda-draft-attachment-targets','maintenance':'#nmda-draft-attachment-motion',
 'monitor':'.nmda-monitor-overview','contacts':'.nmda-contact-card','metrics':'.nmda-dashboard-kpi','field':'#nmda-dashboard-field'}
try:
 with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True)
    context=browser.new_context(viewport={'width':W,'height':H},device_scale_factor=DSF,timezone_id='Asia/Singapore')
    context.route('**/*',lambda r:r.continue_() if r.request.url.startswith(origin+'/') else r.abort())
    context.add_init_script(base_mock)
    page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)));cdp=context.new_cdp_session(page)
    page.clock.install(time=datetime(2030,11,1,1,0,tzinfo=timezone.utc))
    page.clock.pause_at(datetime(2030,11,1,1,0,tzinfo=timezone.utc))
    page.goto(origin+'/app.html',wait_until='domcontentloaded')
    page.clock.run_for(2200)
    page.locator('#nmda-root').wait_for(state='visible')
    font=base64.b64encode(Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf').read_bytes()).decode()
    page.add_style_tag(content='@font-face{font-family:Inter;src:url(data:font/ttf;base64,'+font+');unicode-range:U+2197,U+21E7;}')
    page.evaluate('document.fonts.ready')
    def mark(frame,name,selector,click=False):
      loc=page.locator(selector).filter(visible=True).first
      if not loc.count():raise RuntimeError(f'{frame}: missing visible target {name}: {selector}')
      box=loc.bounding_box();records[name]={'frame':frame,'selector':selector,**box}
      if click:loc.dispatch_event('click')
      return loc
    def snap(frame):
      boxes={}
      for key,sel in selectors.items():
        boxes[key]=[{'index':i,**e.bounding_box(),'text':e.inner_text()[:700]} for i,e in enumerate(page.locator(sel).all()[:8]) if e.is_visible() and e.bounding_box()]
      snapshots[str(frame)]=boxes
      page.screenshot(path=str(OUT/f'f{frame:04d}.png'),animations='allow')
      (ROOT/'analysis/native-layout.json').write_text(json.dumps({'viewport':{'width':W,'height':H,'dsf':DSF},'targets':records,'snapshots':snapshots,'errors':errors},indent=2))
      hero_regions={710:(675,720,343.390625,168.546875,978,246.703125),1150:(1110,1166,1040,621,333,176),1500:(1428,1496,842,369,531,98),2180:(2165,2205,650,910,340,76)}
      if HIRES and frame in hero_regions:
        start,end,x,y,w,h=hero_regions[frame]
        data=cdp.send('Page.captureScreenshot',{'format':'png','fromSurface':True,'captureBeyondViewport':True,'clip':{'x':x,'y':y,'width':w,'height':h,'scale':4}})
        name=f'hires-{frame:04d}.png';(OUT/name).write_bytes(base64.b64decode(data['data']))
        hires.append({'captureFrame':frame,'from':start,'to':end,'x':x,'y':y,'w':w,'h':h,'src':'native/'+name})
    def evt(frame):
      if frame==65:page.locator('#nmda-import-drop-zone').dispatch_event('dragover')
      if frame==95:
        mark(frame,'upload','#nmda-import-drop-zone');page.locator('#nmda-import-drop-zone').dispatch_event('dragleave');page.locator('#nmda-import-file').set_input_files(fixtures)
      if frame==210:mark(frame,'inspect-roster','.nmda-classify-file-row:nth-child(2)',True)
      if frame==255:mark(frame,'inspect-mail','.nmda-classify-file-row:first-child',True)
      if frame==300:mark(frame,'complete-classification','button:has-text("Complete Classification")',True)
      if frame==380:
        picks=page.locator('[data-duplicate-pick]');
        if picks.count()!=2:raise RuntimeError('Expected Maya two-version comparison')
        for item in picks.all():item.set_checked(False,force=True)
        mark(frame,'choose-revised','[data-duplicate-pick]:last-child') if False else None
        picks.last.set_checked(True,force=True)
        box=picks.last.bounding_box();records['choose-revised']={'frame':frame,'selector':'[data-duplicate-pick] (last)',**box}
      if frame==432:mark(frame,'keep-revised','#nmda-duplicate-keep-selected',True)
      if frame in [450,465,480,495] and page.locator('#nmda-duplicate-decision').is_visible():mark(frame,'keep-colleagues-'+str(frame),'#nmda-duplicate-keep-all',True)
      if frame==510:mark(frame,'review-tab','[data-tab="review"]',True)
      if frame==540:mark(frame,'open-preview','[data-review-preview-key]',True)
      if frame==605:mark(frame,'next-thumbnail','[data-review-rail-key]:nth-child(2)',True)
      if frame==650:mark(frame,'maya-thumbnail','[data-review-rail-key]:first-child',True)
      if frame==720:mark(frame,'edit','[data-preview-edit-key]',True)
      if frame==753:
        mark(frame,'greeting','[data-preview-edit-body]')
        page.evaluate("""() => {const e=document.querySelector('[data-preview-edit-body]');e.focus();const w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const i=n.textContent.indexOf('Hi Nora');if(i>=0){const r=document.createRange();r.setStart(n,i+3);r.setEnd(n,i+7);const s=getSelection();s.removeAllRanges();s.addRange(r);return;}}throw new Error('Wrong greeting was not found');}""")
      if frame in [762,768,774,780]:page.keyboard.insert_text('Maya'[[762,768,774,780].index(frame)])
      if frame==815:
        page.evaluate("""() => {const e=document.querySelector('[data-preview-edit-body]');const w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const i=n.textContent.indexOf('research collaboration');if(i>=0){const r=document.createRange();r.setStart(n,i);r.setEnd(n,i+22);const s=getSelection();s.removeAllRanges();s.addRange(r);return;}}}""")
      if frame==835:mark(frame,'bold','[data-preview-rich-command="bold"]',True)
      if frame==885:mark(frame,'save-edit','[data-preview-edit-save]',True)
      if frame==930:mark(frame,'confirm-maya','[data-preview-confirm-key]',True)
      if frame==975:mark(frame,'back-review','#nmda-review-preview-back',True)
      if frame==990:mark(frame,'prepare-tab','[data-tab="batch"]',True)
      if frame==1020:mark(frame,'open-attachments','#nmda-manage-attachments-strip',True)
      if frame==1090:
        mark(frame,'match-brief','[data-attachment-policy]');page.locator('[data-attachment-policy]').first.select_option('smart')
      if frame==1170:mark(frame,'finish-attachments','#nmda-attachment-manager-done',True)
      if frame==1205:mark(frame,'dispatch-tab','[data-tab="dispatch"]',True)
      if frame==1230:mark(frame,'open-schedule','#nmda-open-schedule-modal',True)
      if frame==1265:mark(frame,'timezone','#nmda-rule-time-zone');page.locator('#nmda-rule-time-zone').select_option('Asia/Singapore')
      if frame==1290:mark(frame,'start-date','.nmda-smart-temporal:has(#nmda-rule-start-date)');page.locator('#nmda-rule-start-date').fill('2030-11-07')
      if frame==1320:mark(frame,'local-time','.nmda-smart-temporal:has(#nmda-rule-local-time)');page.locator('#nmda-rule-local-time').fill('09:00')
      if frame==1345:mark(frame,'one-per-office','#nmda-rule-max-school');page.locator('#nmda-rule-max-school').fill('1')
      if frame==1375:
        mark(frame,'seven-day-gap','#nmda-rule-school-interval');page.locator('#nmda-rule-school-interval').fill('7');page.locator('#nmda-rule-preserve-existing').uncheck(force=True)
      if frame==1425:mark(frame,'apply-schedule','#nmda-apply-schedule',True)
      if frame==1530:
        page.clock.set_system_time(datetime(2030,11,10,10,0,tzinfo=timezone.utc));mark(frame,'utilities-tab','[data-tab="utilities"]',True)
      if frame==1560:mark(frame,'open-maintenance','[data-open-utility="draft-attachments"]',True)
      if frame==1610:mark(frame,'choose-old-brief','[data-draft-attachment-group]',True)
      if frame==1660:
        mark(frame,'new-brief','#nmda-draft-attachment-drop');page.locator('#nmda-draft-attachment-file').set_input_files({'name':'Project brief v2.pdf','mimeType':'application/pdf','buffer':pdf+b'\n% Revised project scope\n'})
      if frame==1710:mark(frame,'update-three','#nmda-draft-attachment-run',True)
      if frame==1890:mark(frame,'back-utilities','[data-utility-back]',True)
      if frame==1910:page.evaluate('window.__demoHistory()');mark(frame,'open-monitor','[data-open-utility="monitor"]',True)
      if frame==1950:mark(frame,'sync-before-reply','#nmda-monitor-sync',True)
      if frame==2055:page.evaluate('window.__demoReply()')
      if frame==2070:mark(frame,'sync-human-reply','#nmda-monitor-sync',True)
      if frame==2220:mark(frame,'back-from-monitor','[data-utility-back]',True)
      if frame==2250:mark(frame,'performance','[data-open-performance]',True)
    if not PROOF and not SEGMENT:
      codec=subprocess.Popen(['ffmpeg','-y','-v','error','-probesize','32','-analyzeduration','0','-threads','2','-f','image2pipe','-framerate',str(FPS),'-vcodec','mjpeg','-i','pipe:0','-c:v','libx264','-threads','2','-preset','fast','-crf','12','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'campaign-native.mp4')],stdin=subprocess.PIPE)
    previous=0
    event_frames={65,95,210,255,300,380,432,450,465,480,495,510,540,605,650,720,753,762,768,774,780,815,835,885,930,975,990,1020,1090,1170,1205,1230,1265,1290,1320,1345,1375,1425,1530,1560,1610,1660,1710,1890,1910,1950,2055,2070,2220,2250}
    frames=sorted(event_frames|proof_frames|{0,TOTAL-1}) if PROOF else sorted(event_frames|proof_frames|set(range(0,TOTAL,3))|set(range(570,676))|set(range(1710,1866))|{TOTAL-1})
    if SEGMENT:
      a,b=SEGMENT
      frames=sorted({f for f in event_frames|proof_frames if f<a}|set(range(a,b)))
    last_native=None
    for frame in frames:
      page.evaluate('(f)=>window.__filmFrame=f',frame)
      if frame>previous:
        delta=round(frame*1000/FPS)-round(previous*1000/FPS)
        if PROOF or (SEGMENT and frame<SEGMENT[0]):page.clock.run_for(delta)
        else:page.clock.fast_forward(delta)
      evt(frame)
      if SEGMENT and frame>=1710:
        # Advance actual native CSS animations by film time. Frame capture must
        # not consume their duration while the browser waits for PNG/JPEG I/O.
        page.evaluate('''(f)=>{window.__filmAnimationStarts??=new WeakMap();const root=document.querySelector('#nmda-draft-attachment-motion');for(const a of root?.getAnimations({subtree:true})||[]){let s=window.__filmAnimationStarts.get(a);if(s===undefined){s=f;window.__filmAnimationStarts.set(a,s);}a.pause();a.currentTime=Math.max(0,(f-s)*1000/30);}}''',frame)
      if SEGMENT and frame==SEGMENT[0]:
        codec=subprocess.Popen(['ffmpeg','-y','-v','error','-probesize','32','-analyzeduration','0','-threads','2','-f','image2pipe','-framerate',str(FPS),'-vcodec','mjpeg','-i','pipe:0','-c:v','libx264','-threads','2','-preset','fast','-crf','12','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'maintenance-native.mp4')],stdin=subprocess.PIPE)
        last_native=None
      # Native continuous-page scroll: inspect the second sheet, then return.
      if 570<=frame<=600:
        u=(frame-570)/30;amount=(u*u*(3-2*u))*160
        page.evaluate('(y)=>{const e=document.querySelector("#nmda-review-queue");if(e)e.scrollTop=y;}',amount)
      if 1718<=frame<=1748:
        u=(frame-1718)/30;amount=(u*u*(3-2*u))*250
        page.evaluate('''(y)=>{let e=document.querySelector('#nmda-draft-attachment-motion')?.parentElement;while(e){if(e.scrollHeight>e.clientHeight+20&&['auto','scroll'].includes(getComputedStyle(e).overflowY)){e.scrollTop=y;return;}e=e.parentElement;}}''',amount)
      if frame in proof_frames:snap(frame)
      if frame==1865:
        result=page.locator('#nmda-draft-attachment-result').inner_text()
        if 'Error' in page.locator('#nmda-draft-attachment-motion').inner_text() or 'Updated 3 drafts' not in result:
          raise RuntimeError('Native attachment replacement did not complete: '+result)
      if codec:
        native=cdp.send('Page.captureScreenshot',{'format':'jpeg','quality':98,'fromSurface':True,'captureBeyondViewport':True,'clip':{'x':0,'y':0,'width':W,'height':H,'scale':DSF}})
        native_bytes=base64.b64decode(native['data'])
        if last_native:
          for _ in range(max(0,frame-previous-1)):codec.stdin.write(last_native)
        codec.stdin.write(native_bytes);last_native=native_bytes
        if frame%90==0:print(f'Native frame {frame}/{TOTAL}',flush=True)
      previous=frame
    requests=page.evaluate('window.__requests');text=page.locator('#nmda-root').inner_text()
    phases=page.evaluate('window.__phases')
    if HIRES:(ROOT/'src/native-hires.json').write_text(json.dumps(hires,indent=2))
    report_name='native-maintenance' if SEGMENT else 'native-capture'
    (ROOT/f'analysis/{report_name}.json').write_text(json.dumps({'frames':SEGMENT[1]-SEGMENT[0] if SEGMENT else TOTAL,'sourceRange':SEGMENT,'fps':FPS,'width':W*DSF,'height':H*DSF,'errors':errors,'runtimeRequests':requests,'nativePhases':phases,'finalText':text,'offline':True,'provider':'Isolated in-memory fictional mailbox; real application business logic','sampling':'Native UI 10 fps; continuous-page scroll and attachment validation captured at 30 fps. Camera, cursor, and final composition at 30 fps.'},indent=2))
    (ROOT/f'analysis/{"native-maintenance-layout" if SEGMENT else "native-layout"}.json').write_text(json.dumps({'viewport':{'width':W,'height':H,'dsf':DSF},'targets':records,'snapshots':snapshots,'errors':errors},indent=2))
    if codec:codec.stdin.close();assert codec.wait()==0
    browser.close()
    print(json.dumps({'mode':'proof' if PROOF else 'record','frames':TOTAL,'targets':len(records),'proofs':len(snapshots),'errors':errors,'requestTypes':sorted(set(x['type'] for x in requests))}),flush=True)
    assert not errors, errors
finally:
 if codec and codec.poll() is None:codec.terminate()
 server.shutdown();server.server_close();thread.join(timeout=5)
