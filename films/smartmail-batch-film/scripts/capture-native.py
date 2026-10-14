"""Capture unchanged SmartMail native UI with frozen offline film data."""
import base64,functools,http.server,json,subprocess,sys,threading
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1];APP=Path(sys.argv[sys.argv.index('--app')+1]).resolve() if '--app' in sys.argv else ROOT.parents[1]
BEAT=json.loads((ROOT/'analysis/beat_data.json').read_text())
FPS=30;W,H,DSF=1440,1000,2
bf=lambda b:round((BEAT['t0']+b*BEAT['T'])*FPS)
TOTAL=bf(220);PROOF='--proof' in sys.argv;PROBE='--probe' in sys.argv
OUT=ROOT/'public/native';OUT.mkdir(parents=True,exist_ok=True)
DATA=json.loads((ROOT/'src/demo-data.json').read_text());mock=(ROOT/'scripts/offline-provider.js').read_text().replace('__DATA__',json.dumps(DATA))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(APP)))
thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start();origin=f'http://127.0.0.1:{server.server_port}'
targets={};snapshots={};errors=[];codec=None
selectors={'drop':'#nmda-import-drop-zone','classify':'#nmda-import-card','files':'.nmda-classify-file-row','roster':'#nmda-roster-audit-card',
 'dedupe':'#nmda-duplicate-decision','review':'#nmda-review-queue','preview':'.nmda-review-preview-page.is-active',
 'rail':'#nmda-review-preview-rail','requirements':'#nmda-attachment-manager-requirements','attachments':'#nmda-attachment-manager-list',
 'rules':'#nmda-scheduler-card','schedule':'.nmda-plan-matrix','progress':'#nmda-batch-status',
 'maintenance':'#nmda-draft-attachment-motion','result':'#nmda-draft-attachment-result','monitor':'.nmda-monitor-overview','contacts':'.nmda-contact-card'}
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  context=browser.new_context(viewport={'width':W,'height':H},device_scale_factor=DSF,timezone_id='Australia/Sydney')
  context.route('**/*',lambda r:r.continue_() if r.request.url.startswith(origin+'/') else r.abort())
  context.add_init_script(mock);page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  cdp=context.new_cdp_session(page);page.clock.install(time=datetime(2026,10,14,1,0,tzinfo=timezone.utc));page.clock.pause_at(datetime(2026,10,14,1,0,tzinfo=timezone.utc))
  page.goto(origin+'/app.html',wait_until='domcontentloaded');page.clock.run_for(2400)
  page.locator('#nmda-root').wait_for(state='visible');page.evaluate('document.fonts.ready')
  def action(b,name,sel,operation='click',value=None):
   loc=(page.locator(sel) if operation=='files' else page.locator(sel).filter(visible=True)).first
   if not loc.count():raise RuntimeError(f'b{b}: missing target {name}: {sel}')
   if operation=='click' and 'data-review-rail-key' in sel:loc.scroll_into_view_if_needed()
   box=loc.bounding_box() or page.locator('#nmda-import-drop-zone').bounding_box() or {'x':600,'y':300,'width':200,'height':100};targets[name]={'frame':bf(b),'beat':b,'selector':sel,**box}
   if operation=='click':loc.dispatch_event('click')
   elif operation=='fill':loc.fill(value)
   elif operation=='select':loc.select_option(value)
   elif operation=='check':loc.set_checked(bool(value),force=True)
   elif operation=='files':loc.set_input_files(value)
   return loc
  def snapshot(b):
   frame=bf(b);boxes={}
   for k,sel in selectors.items():
    boxes[k]=[{'index':i,**e.bounding_box(),'text':e.inner_text()[:800]} for i,e in enumerate(page.locator(sel).all()[:8]) if e.is_visible() and e.bounding_box()]
   snapshots[str(frame)]=boxes;page.screenshot(path=str(OUT/f'b{b:03d}.png'))
   (ROOT/'analysis/native-layout.json').write_text(json.dumps({'viewport':{'width':W,'height':H,'dsf':DSF},'targets':targets,'snapshots':snapshots,'errors':errors},indent=2))
   for k,sel in selectors.items():
    loc=page.locator(sel).filter(visible=True).first
    if loc.count() and loc.bounding_box():
     try:loc.screenshot(path=str(OUT/f'{k}-b{b:03d}.png'),timeout=2000)
     except Exception:pass
  fixtures=[str(ROOT/'analysis/fixtures'/n) for n in ['Enquiries_60.csv','supervisors_60.xlsx','Student_001_CV.pdf','Student_001_Portfolio.pdf','Student_001_Research_Proposal.pdf','Student_001_Writing_Sample.pdf']]
  events={}
  def at(b,fn):events[bf(b)]=lambda:fn(b)
  at(14,lambda b:action(b,'upload','#nmda-import-file','files',fixtures))
  at(20,lambda b:action(b,'inspect-mail','.nmda-classify-file-row:first-child'))
  at(24,lambda b:action(b,'inspect-roster','.nmda-classify-file-row:nth-child(2)'))
  at(28,lambda b:action(b,'complete-classification','button:has-text("Complete Classification")'))
  def distinct(b):
   if page.locator('#nmda-duplicate-decision').is_visible():action(b,'keep-distinct-'+str(b),'#nmda-duplicate-keep-all')
  for b in range(30,51,2):at(b,distinct)
  at(56,lambda b:action(b,'review-tab','[data-tab="review"]'))
  at(65,lambda b:action(b,'open-preview','[data-review-preview-key]'))
  at(69,lambda b:action(b,'preview-second','[data-review-rail-key]:nth-child(7)'))
  at(73,lambda b:action(b,'preview-third','[data-review-rail-key]:nth-child(24)'))
  at(77,lambda b:action(b,'back-review','#nmda-review-preview-back'))
  at(79,lambda b:action(b,'prepare-tab','[data-tab="batch"]'))
  at(81,lambda b:action(b,'open-attachments','#nmda-manage-attachments-strip'))
  for i,b in enumerate([84,85,86,87]):
   at(b,lambda b,i=i:action(b,'file-policy-'+str(i),':nth-match([data-attachment-policy], '+str(i+1)+')','select','smart'))
  at(95,lambda b:action(b,'finish-attachments','#nmda-attachment-manager-done'))
  at(96,lambda b:action(b,'dispatch-tab','[data-tab="dispatch"]'))
  at(99,lambda b:action(b,'open-schedule','#nmda-open-schedule-modal'))
  at(101,lambda b:action(b,'timezone','#nmda-rule-time-zone','select','Australia/Sydney'))
  at(103,lambda b:action(b,'start-date','#nmda-rule-start-date','fill','2026-10-22'))
  at(105,lambda b:action(b,'local-time','#nmda-rule-local-time','fill','09:00'))
  at(108,lambda b:action(b,'one-per-school','#nmda-rule-max-school','fill','1'))
  at(111,lambda b:action(b,'school-gap','#nmda-rule-school-interval','fill','7'))
  at(113,lambda b:action(b,'preserve-times','#nmda-rule-preserve-existing','check',False))
  at(115,lambda b:action(b,'apply-schedule','#nmda-apply-schedule'))
  at(130,lambda b:action(b,'create-batch','#nmda-batch-start'))
  at(153,lambda b:action(b,'utilities-tab','[data-tab="utilities"]'))
  at(155,lambda b:action(b,'open-maintenance','[data-open-utility="draft-attachments"]'))
  at(157,lambda b:action(b,'select-proposal','[data-draft-attachment-group]:has-text("Research_Proposal")'))
  at(159,lambda b:action(b,'replacement-file','#nmda-draft-attachment-file','files',{'name':'Student_001_Research_Proposal_v2.pdf','mimeType':'application/pdf','buffer':(ROOT/'analysis/fixtures/Student_001_Research_Proposal.pdf').read_bytes()+b'\n% DEMO revision v2\n'}))
  at(161,lambda b:action(b,'replace-59','#nmda-draft-attachment-run'))
  at(180,lambda b:action(b,'back-utilities','[data-utility-back]'))
  def later(b):
   page.evaluate('window.__later=true');page.clock.set_system_time(datetime(2027,2,15,10,0,tzinfo=timezone.utc));action(b,'open-monitor','[data-open-utility="monitor"]')
  at(182,later)
  at(186,lambda b:action(b,'sync-history','#nmda-monitor-sync'))
  at(196,lambda b:action(b,'attention-view','[data-monitor-filter="attention"]'))
  at(200,lambda b:action(b,'due-view','[data-monitor-subfilter="due"]'))
  at(204,lambda b:action(b,'select-due','#nmda-monitor-select-visible','check',True))
  proof_beats=[0,13,18,23,27,31,36,43,47,53,61,67,71,75,78,83,89,94,98,104,112,117,122,127,133,140,149,154,158,164,171,179,184,191,200,207,219]
  proof_frames={bf(b):b for b in proof_beats}
  if PROBE:
   action(14,'upload','#nmda-import-file','files',fixtures);page.clock.run_for(2400);snapshot(18)
   print(page.locator('#nmda-root').inner_text()[:14000]);browser.close();sys.exit(0)
  smooth_ranges=set(range(bf(67),bf(76)))|set(range(bf(164),bf(167)))
  frames=sorted(set(events)|set(proof_frames)|({0,TOTAL-1} if PROOF else set(range(0,TOTAL,3))|smooth_ranges|{TOTAL-1}))
  if not PROOF:
   codec=subprocess.Popen(['ffmpeg','-y','-v','error','-threads','2','-f','image2pipe','-framerate',str(FPS),'-vcodec','mjpeg','-i','pipe:0','-c:v','libx264','-threads','2','-preset','fast','-crf','14','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'batch-native.mp4')],stdin=subprocess.PIPE)
  previous=0;last_image=None
  for f in frames:
   page.evaluate('(f)=>window.__filmFrame=f',f)
   if f>previous:page.clock.run_for(round(f*1000/FPS)-round(previous*1000/FPS))
   if f in events:events[f]()
   if f in proof_frames:snapshot(proof_frames[f]);print('Native proof b'+str(proof_frames[f]),flush=True)
   if codec:
    raw=cdp.send('Page.captureScreenshot',{'format':'jpeg','quality':96,'fromSurface':True,'clip':{'x':0,'y':0,'width':W,'height':H,'scale':DSF}})
    raw=base64.b64decode(raw['data'])
    if last_image:
     for _ in range(max(0,f-previous-1)):codec.stdin.write(last_image)
    codec.stdin.write(raw);last_image=raw
    if f%300==0:print(f'Captured {f}/{TOTAL}',flush=True)
   previous=f
  assert len(page.evaluate('window.__saved'))==60,'Expected 60 validated draft saves'
  assert 'Updated 59 drafts' in page.locator('#nmda-draft-attachment-result').inner_text(),'Attachment integrity verification did not pass'
  report={'offline':True,'native_app_unchanged':True,'errors':errors,'saved':page.evaluate('window.__saved'),'requests':page.evaluate('window.__requests'),
   'phases':page.evaluate('window.__phases'),'final_text':page.locator('#nmda-root').inner_text(),'sampling_fps':10,'output_fps':30}
  (ROOT/'analysis/native-capture.json').write_text(json.dumps(report,indent=2));
  if codec:codec.stdin.close();assert codec.wait()==0
  print(json.dumps({'saved':len(report['saved']),'errors':errors,'requests':sorted(set(x['type'] for x in report['requests']))}),flush=True)
  browser.close()
finally:
 if codec and codec.poll() is None:codec.terminate()
 server.shutdown();server.server_close();thread.join(timeout=5)
