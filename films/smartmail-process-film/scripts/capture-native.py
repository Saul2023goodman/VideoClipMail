"""Real native UI capture; only external transport is simulated."""
import base64,functools,http.server,json,subprocess,sys,threading,math
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];APP=ROOT.parents[1]
OUT=ROOT/'public/native';OUT.mkdir(parents=True,exist_ok=True)
DATA=json.loads((ROOT/'src/demo-data.json').read_text())
mock=(ROOT/'scripts/offline-provider.js').read_text().replace('__DATA__',json.dumps(DATA))
W,H,DSF=1440,1000,2
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(APP)))
thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start();origin=f'http://127.0.0.1:{server.server_port}'
report={'errors':[],'states':{},'offline':True,'native_app_unchanged':True,'viewport':{'width':W,'height':H,'dsf':DSF}}
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  context=browser.new_context(viewport={'width':W,'height':H},device_scale_factor=DSF,timezone_id='Australia/Sydney')
  context.route('**/*',lambda r:r.continue_() if r.request.url.startswith(origin+'/') else r.abort())
  context.add_init_script(mock);page=context.new_page();page.on('pageerror',lambda e:report['errors'].append(str(e)))
  page.clock.install(time=datetime(2026,10,14,1,0,tzinfo=timezone.utc));page.clock.pause_at(datetime(2026,10,14,1,0,1,tzinfo=timezone.utc))
  page.goto(origin+'/app.html',wait_until='domcontentloaded');page.clock.run_for(2400)
  page.locator('#nmda-root').wait_for(state='visible');page.evaluate('document.fonts.ready')
  page.evaluate('''() => { const audit=NMDARoster.auditTaskDuplicates; NMDARoster.auditTaskDuplicates=(tasks)=>{const r=audit(tasks); window.__auditProof={tasks:tasks.map(t=>({id:t.id,name:t.name,derivedName:NMDARoster.taskName(t),school:t.school,recipients:t.recipients,sourceFile:t.sourceFile})),groups:r.groups.map(g=>({type:g.type,label:g.label,ids:g.tasks.map(t=>t.id)}))};return r;}; }''')
  page.evaluate('''() => { const build=NMDAScheduler.buildPlan; NMDAScheduler.buildPlan=(tasks,rules,now,context)=>{const r=build(tasks,rules,now,context);window.__planProof=r;return r;}; }''')
  def settle(ms=700):page.clock.run_for(ms);page.wait_for_timeout(80)
  def click(sel):page.locator(sel).filter(visible=True).first.dispatch_event('click');settle()
  sels={'classification':'#nmda-import-card','fileRows':'.nmda-classify-file-row','dedupe':'#nmda-duplicate-decision','keepSelected':'#nmda-duplicate-keep-selected','keepAll':'#nmda-duplicate-keep-all','purposeChoice':'[data-inspector-purpose-select]','review':'#nmda-review-queue','reviewRows':'[data-review-row]','attachments':'#nmda-attachment-manager-list','requirements':'#nmda-attachment-manager-requirements','rules':'#nmda-scheduler-card','calendar':'.nmda-plan-matrix-wrap','calendarRows':'.nmda-plan-matrix-task','batch':'#nmda-batch-status','root':'#nmda-root'}
  def snap(name):
   boxes={}
   for k,sel in sels.items():
    boxes[k]=[{'index':i,**e.bounding_box(),'text':e.inner_text()[:500]} for i,e in enumerate(page.locator(sel).all()) if e.is_visible() and e.bounding_box()]
   report['states'][name]={'boxes':boxes,'text':page.locator('#nmda-root').inner_text()}
   page.screenshot(path=str(OUT/(name+'.png')))
   for k in ['classification','dedupe','review','attachments','requirements','rules','calendar','batch']:
    loc=page.locator(sels[k]).filter(visible=True).first
    if loc.count() and loc.bounding_box():
     try:loc.screenshot(path=str(OUT/(name+'-'+k+'.png')),timeout=2000)
     except Exception:pass
   (ROOT/'analysis/native-layout.json').write_text(json.dumps(report,indent=2))
   print('Captured '+name,flush=True)
  snap('00-start')
  fixtures=[str(ROOT/'analysis/fixtures/Batch_inputs.zip')]
  page.locator('#nmda-import-file').set_input_files(fixtures)
  for _ in range(200):
   settle(200)
   if page.evaluate('window.__auditProof?.tasks?.length||0')>=61:break
  snap('01-classification')
  (ROOT/'analysis/import-audit-proof.json').write_text(json.dumps(page.evaluate('window.__auditProof'),indent=2))
  print(page.locator('#nmda-import-card').inner_text(),flush=True)
  if '--probe' in sys.argv:browser.close();sys.exit(0)
  notes=page.locator('.nmda-classify-file-row').filter(has_text='Session_notes')
  if notes.count():
   notes.first.dispatch_event('click');settle();snap('02-notes')
   print('Notes controls',page.locator('#nmda-import-card select').evaluate_all('(els)=>els.map(e=>({html:e.outerHTML,value:e.value}))'),flush=True)
   choice=page.locator('[data-inspector-purpose-select]').filter(visible=True).first
   if choice.count() and choice.locator('option[value="ignored"]').count():choice.select_option('ignored');settle()
   else:click('[data-drop-purpose="ignored"]')
  snap('03-classified');click('button:has-text("Complete Classification")');snap('04-dedupe')
  decisions=[]
  for i in range(5):
   gate=page.locator('#nmda-duplicate-decision')
   if not gate.is_visible():break
   text=gate.inner_text();decisions.append(text)
   if 'same recipient' in text.lower() or 'same email' in text.lower():
    click('#nmda-duplicate-keep-selected')
   else:click('#nmda-duplicate-keep-all')
   snap('05-dedupe-'+str(i+1))
  report['duplicate_decisions']=decisions
  click('[data-tab="review"]')
  if page.locator('[data-review-load-more]').count():click('[data-review-load-more]')
  click('[data-review-preview-key]')
  if page.locator('[data-review-load-more]').count():click('[data-review-load-more]')
  page.locator('#nmda-review-queue').evaluate('(e)=>{e.scrollTop=0}');settle(150);snap('06-review-top')
  # Capture the actual scroll, from first row through all sixty to last row.
  queue=page.locator('#nmda-review-queue')
  info=queue.evaluate('(e)=>({height:e.clientHeight,scrollHeight:e.scrollHeight,overflow:getComputedStyle(e).overflowY,count:e.querySelectorAll("[data-review-row]").length})')
  report['scroll']=info
  if '--no-scroll' not in sys.argv:
   cdp=context.new_cdp_session(page)
   codec=subprocess.Popen(['ffmpeg','-y','-v','error','-f','image2pipe','-framerate','30','-vcodec','mjpeg','-i','pipe:0','-c:v','libx264','-threads','2','-preset','fast','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'overview-scroll.mp4')],stdin=subprocess.PIPE)
   # Solve cubic-bezier(.45,0,.06,1) by bisection. 236f total / 185f scroll / 30f hold.
   def brake(x):
    lo,hi=0,1
    for _ in range(24):
     t=(lo+hi)/2;v=3*(1-t)**2*t*.45+3*(1-t)*t*t*.06+t**3
     if v<x:lo=t
     else:hi=t
    return 3*(1-t)*t*t+t**3
   for f in range(236):
    u=brake(min(1,max(0,(f-16)/185)));queue.evaluate('(e,v)=>{e.scrollTop=v}',u*(info['scrollHeight']-info['height']))
    page.clock.run_for(34)
    raw=cdp.send('Page.captureScreenshot',{'format':'jpeg','quality':94,'fromSurface':True,'clip':{'x':0,'y':0,'width':W,'height':H,'scale':1}})
    codec.stdin.write(base64.b64decode(raw['data']))
   codec.stdin.close();assert codec.wait()==0
  else:queue.evaluate('(e)=>{e.scrollTop=e.scrollHeight}')
  snap('07-review-bottom')
  click('[data-tab="batch"]');click('#nmda-manage-attachments-strip');snap('08-attachments-before')
  for el in page.locator('[data-attachment-policy]').all():el.select_option('smart')
  settle();snap('09-attachments-linked');click('#nmda-attachment-manager-done')
  click('[data-tab="dispatch"]');snap('10-unscheduled');click('#nmda-open-schedule-modal')
  page.locator('#nmda-rule-time-zone').select_option('Australia/Sydney');page.locator('#nmda-rule-start-date').fill('2026-10-23');page.locator('#nmda-rule-local-time').fill('09:00')
  page.locator('#nmda-rule-max-school').fill('1');page.locator('#nmda-rule-school-interval').fill('7');page.locator('#nmda-rule-preserve-existing').set_checked(False,force=True)
  for el in page.locator('[data-schedule-weekday]').all():el.set_checked(True,force=True)
  settle();snap('11-rules');click('#nmda-apply-schedule');settle(1800);snap('12-calendar')
  plan=page.evaluate('JSON.parse(JSON.stringify(window.__planProof))');report['plan']=plan
  (ROOT/'analysis/scheduler-plan.json').write_text(json.dumps(plan,indent=2))
  trace=page.evaluate('''() => {
   const p=window.__planProof,S=NMDAScheduler,all=p.assignments,first=all.find(a=>a.task.recipients==='supervisor001@example.invalid'),second=all.find(a=>a.task.recipients==='supervisor002@example.invalid');
   const prior={...first.task,status:'ready',enabled:true,scheduleAt:first.scheduleAt};const out=[];
   for(let offset=0;offset<10;offset++){
    const d=new Date(Date.UTC(2026,9,23+offset));const key=d.toISOString().slice(0,10);const when=S.formatLocalDateTime(S.zonedLocalToDate(key,'09:00','Australia/Sydney'));
    const candidate={...second.task,status:'ready',enabled:true,scheduleAt:when};const audit=S.audit([prior,candidate],p.rules);
    const why=audit.holidayConflicts.length?'Outside selected weekdays':audit.conflicts.length?'Institution capacity 1 / day':audit.intervalConflicts.length?'Same-institution gap <7 days':'Accepted';out.push({date:key,why,audit});if(why==='Accepted')break;
   }
   return out;
  }''');(ROOT/'analysis/scheduler-trace.json').write_text(json.dumps(trace,indent=2,default=str));(ROOT/'src/scheduler-trace.json').write_text(json.dumps([{'date':t['date'],'why':t['why']} for t in trace],indent=2))
  # Original native calendar element textures and page-coordinate table for row-embed.
  slots=[];frozen=Image.open(OUT/'12-calendar.png')
  for r in report['states']['12-calendar']['boxes']['calendarRows']:
   if r['x']>=0 and r['x']+r['width']<=W and r['y']>=0 and r['y']+r['height']<=830:
    box=(round(r['x']*DSF),round(r['y']*DSF),round((r['x']+r['width'])*DSF),round((r['y']+r['height'])*DSF))
    frozen.crop(box).save(OUT/f"slot-{r['index']:02d}.png");slots.append(r)
  report['calendar_slots']=slots
  click('#nmda-batch-start');snap('13-running')
  if '--no-scroll' not in sys.argv:
   cdp=context.new_cdp_session(page)
   codec=subprocess.Popen(['ffmpeg','-y','-v','error','-f','image2pipe','-framerate','30','-vcodec','mjpeg','-i','pipe:0','-c:v','libx264','-threads','2','-preset','fast','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'execution-progress.mp4')],stdin=subprocess.PIPE)
   for f in range(170):
    page.evaluate('(f)=>window.__filmFrame=f',f);settle(90)
    raw=cdp.send('Page.captureScreenshot',{'format':'jpeg','quality':94,'fromSurface':True,'clip':{'x':0,'y':0,'width':W,'height':H,'scale':1}})
    codec.stdin.write(base64.b64decode(raw['data']))
   codec.stdin.close();assert codec.wait()==0
  settle(15000);snap('14-complete')
  report['saved']=page.evaluate('window.__saved');report['requests']=page.evaluate('window.__requests');report['phases']=page.evaluate('window.__phases')
  assert len(report['saved'])==60,f"Expected 60 verified draft saves, got {len(report['saved'])}"
  assert sum(len(d['attachments']) for d in report['saved'])==211
  assert not report['errors'],report['errors']
  (ROOT/'analysis/native-capture.json').write_text(json.dumps(report,indent=2))
  (ROOT/'src/native-layout.json').write_text(json.dumps(report,indent=2))
  print(json.dumps({'saved':len(report['saved']),'attachment_links':211,'errors':report['errors'],'scroll':info,'slots':len(slots)}),flush=True)
  browser.close()
finally:server.shutdown();server.server_close();thread.join(timeout=5)
