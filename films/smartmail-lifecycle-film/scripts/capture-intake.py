"""Real native UI capture; only external transport is simulated."""
import base64,functools,http.server,json,subprocess,sys,threading,math
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];APP=ROOT.parents[1]
OUT=ROOT/'public/native';OUT.mkdir(parents=True,exist_ok=True)
DATA=json.loads((ROOT/'src/demo-data.json').read_text())
mock=(ROOT/'scripts/offline-provider.js').read_text().replace('__DATA__',json.dumps(DATA)).replace('__MAILBOX__',(ROOT/'analysis/mailbox-fixture.json').read_text())
W,H,DSF=1920,1080,2
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
  page.evaluate("""() => {const f=NMDAOperations.monitoringRoots;NMDAOperations.monitoringRoots=(store)=>{const r=f(store);window.__monitorProof=JSON.parse(JSON.stringify(r));return r;};const c=NMDAOperations.createFollowUpTasks;NMDAOperations.createFollowUpTasks=(...args)=>{const r=c(...args);window.__createdProof=JSON.parse(JSON.stringify(r));return r;};}""")
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
   (ROOT/'analysis/intake-capture.json').write_text(json.dumps(report,indent=2))
   print('Captured '+name,flush=True)
  snap('00-start')
  fixtures=[str(ROOT/'analysis/fixtures/Batch_inputs.zip')]
  page.locator('#nmda-import-file').set_input_files(fixtures)
  for _ in range(200):
   settle(200)
   if page.evaluate('window.__auditProof?.tasks?.length||0')>=61:break
  snap('01-classification')
  (ROOT/'analysis/import-audit-proof.json').write_text(json.dumps(page.evaluate('window.__auditProof'),indent=2))
  for name,needle in [('01-mail-detail','Avery Lane.docx'),('01-roster-detail','Supervisors.xlsx'),('01-uncertain-detail','Session_notes')]:
   page.locator('.nmda-classify-file-row').filter(has_text=needle).first.dispatch_event('click');settle();snap(name)
  browser.close()
finally:server.shutdown()
