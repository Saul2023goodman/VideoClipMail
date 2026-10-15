"""Targeted native review recapture with measured, deterministic scroll positions."""
from pathlib import Path
from datetime import datetime,timezone
import base64,functools,http.server,json,subprocess,threading
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1];APP=ROOT.parents[1]
OUT=ROOT/'out/qa/raw/review-scroll-capture';OUT.mkdir(parents=True,exist_ok=True)
DATA=json.loads((ROOT/'src/demo-data.json').read_text())
mock=(ROOT/'scripts/offline-provider.js').read_text().replace('__DATA__',json.dumps(DATA)).replace('__MAILBOX__',(ROOT/'analysis/mailbox-fixture.json').read_text())
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(APP)))
threading.Thread(target=server.serve_forever,daemon=True).start();origin=f'http://127.0.0.1:{server.server_port}'
errors=[];trace=[]
def brake(x):
 lo,hi=0.,1.
 for _ in range(30):
  t=(lo+hi)/2;v=3*(1-t)**2*t*.45+3*(1-t)*t*t*.06+t**3
  if v<x:lo=t
  else:hi=t
 return 3*(1-t)*t*t+t**3
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  context=browser.new_context(viewport={'width':1920,'height':1080},device_scale_factor=2,timezone_id='Australia/Sydney')
  context.route('**/*',lambda r:r.continue_() if r.request.url.startswith(origin+'/') else r.abort())
  context.add_init_script(mock);page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  page.clock.install(time=datetime(2026,10,14,1,0,tzinfo=timezone.utc));page.clock.pause_at(datetime(2026,10,14,1,0,1,tzinfo=timezone.utc))
  page.goto(origin+'/app.html',wait_until='domcontentloaded');page.clock.run_for(2400)
  page.locator('#nmda-root').wait_for(state='visible');page.evaluate('document.fonts.ready')
  def settle(ms=700):page.clock.run_for(ms);page.wait_for_timeout(80)
  def click(sel):page.locator(sel).filter(visible=True).first.dispatch_event('click');settle()
  page.locator('#nmda-import-file').set_input_files([str(ROOT/'analysis/fixtures/Batch_inputs.zip')])
  for _ in range(200):
   settle(200)
   if page.locator('.nmda-classify-file-row').filter(has_text='Session_notes').count():break
  assert page.locator('.nmda-classify-file-row').filter(has_text='Session_notes').count(), 'Native import did not finish'
  page.locator('.nmda-classify-file-row').filter(has_text='Session_notes').first.dispatch_event('click');settle()
  choice=page.locator('[data-inspector-purpose-select]').filter(visible=True).first
  if choice.count() and choice.locator('option[value="ignored"]').count():choice.select_option('ignored');settle()
  else:click('[data-drop-purpose="ignored"]')
  click('button:has-text("Complete Classification")')
  for _ in range(5):
   gate=page.locator('#nmda-duplicate-decision')
   if not gate.is_visible():break
   text=gate.inner_text().lower();click('#nmda-duplicate-keep-selected' if ('same recipient' in text or 'same email' in text) else '#nmda-duplicate-keep-all')
  click('[data-tab="review"]')
  if page.locator('[data-review-load-more]').count():click('[data-review-load-more]')
  click('[data-review-preview-key]')
  if page.locator('[data-review-load-more]').count():click('[data-review-load-more]')
  queue=page.locator('#nmda-review-queue')
  info=queue.evaluate('(e)=>({height:e.clientHeight,scrollHeight:e.scrollHeight,overflow:getComputedStyle(e).overflowY,count:e.querySelectorAll("[data-review-row]").length,priorScrollBehavior:getComputedStyle(e).scrollBehavior})')
  assert info['count']==60,info
  queue.evaluate('(e)=>{e.style.setProperty("scroll-behavior","auto","important");e.scrollTo({top:0,behavior:"instant"})}');settle(150)
  cdp=context.new_cdp_session(page)
  codec=subprocess.Popen(['ffmpeg','-y','-v','error','-f','image2pipe','-framerate','30','-vcodec','mjpeg','-i','pipe:0','-vf','scale=1920:1080','-c:v','libx264','-threads','2','-preset','fast','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'overview-scroll.mp4')],stdin=subprocess.PIPE)
  for f in range(176):
   top=brake(min(1,max(0,(f-12)/136)))*(info['scrollHeight']-info['height'])
   queue.evaluate('(e,v)=>e.scrollTo({top:v,behavior:"instant"})',top);page.clock.run_for(34)
   actual=queue.evaluate('(e)=>e.scrollTop');assert abs(actual-top)<1,(f,top,actual)
   raw=base64.b64decode(cdp.send('Page.captureScreenshot',{'format':'jpeg','quality':94,'fromSurface':True,'clip':{'x':0,'y':0,'width':1920,'height':1080,'scale':1}})['data'])
   codec.stdin.write(raw)
   after=queue.evaluate('(e)=>e.scrollTop');assert abs(after-top)<1,(f,top,after)
   trace.append({'frame':f,'requested':top,'actual':actual,'after_capture':after})
   if f in [0,60,110,128,140,148,150,175]:(OUT/f'f{f:03}.jpg').write_bytes(raw)
  codec.stdin.close();assert codec.wait()==0
  proof={'method':'Genuine unchanged native UI, instant DOM scroll to precomputed cubic-bezier(.45,0,.06,1) coordinates; perframe actual positions measured before and after capture','frames':176,'motion_frames':136,'lead_frames':12,'brake_frame':148,'scroll':info,'trace':trace,'terminal_hold_frames':28,'maximum_scroll_error_px':max(abs(s['requested']-s['actual']) for s in trace),'errors':errors,'candidate':'out/qa/raw/review-scroll-capture/overview-scroll.mp4'}
  (ROOT/'analysis/review-scroll-capture.json').write_text(json.dumps(proof,indent=2)+'\n')
  assert not errors,errors
  print(json.dumps({k:v for k,v in proof.items() if k!='trace'},indent=2));browser.close()
finally:server.shutdown()
