"""Capture native review sheets and all calendar destinations, without app edits."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
source=(ROOT/'scripts/capture-review-scroll.py').read_text()
prefix=source.split("  queue=page.locator('#nmda-review-queue')")[0]
prefix=prefix.replace("ROOT=Path(__file__).resolve().parents[1]",f"ROOT=Path({str(ROOT)!r})")
prefix=prefix.replace("OUT=ROOT/'out/qa/raw/review-scroll-capture'","OUT=ROOT/'public/native/v7'")
tail=r'''
  import hashlib
  from PIL import Image
  proof={'appUnchanged':True,'offline':True,'viewport':{'width':1920,'height':1080,'dpr':2},'reviews':[],'formatProbes':[]}
  def box(el):
   r=el.bounding_box();assert r is not None
   return {k:round(r[k],4) for k in ['x','y','width','height']}
  page.set_viewport_size({'width':4000,'height':1800});settle(300)
  for index in [0,29,59]:
   row=page.locator('.nmda-review-preview-page').nth(index)
   sheet=row.locator('.nmda-review-preview-sheet').first
   old=row.get_attribute('style') or ''
   row.evaluate("e=>{let p=e.parentElement;while(p&&p!==document.documentElement){p.dataset.v7CaptureStyle=p.getAttribute('style')||'';p.style.overflow='visible';p.style.width='3000px';p.style.maxWidth='none';p=p.parentElement}e.style.width='600px';e.style.maxWidth='600px';e.style.zoom='2.8';e.style.flex='none';e.style.margin='0'}")
   settle(300);sheet.scroll_into_view_if_needed();settle(100)
   name=f'review-{index+1:02d}.png';sheet.screenshot(path=str(OUT/name),animations='disabled')
   outer=box(sheet);regions={}
   for key,selector in [('recipient','.nmda-review-preview-mailhead strong'),('subject','[data-preview-subject]'),('body','.nmda-review-preview-body')]:
    el=sheet.locator(selector).first
    if el.count():
     b=box(el);regions[key]={**b,'x':b['x']-outer['x'],'y':b['y']-outer['y'],'text':el.inner_text()}
   requested=sheet.locator('.nmda-review-preview-body').locator('p,div').filter(has_text='I have attached').last
   if requested.count():
    b=box(requested);regions['requested']={**b,'x':b['x']-outer['x'],'y':b['y']-outer['y'],'text':requested.inner_text()}
   styles=sheet.locator('.nmda-review-preview-body').evaluate('(e)=>({font:getComputedStyle(e).fontFamily,size:getComputedStyle(e).fontSize,line:getComputedStyle(e).lineHeight})')
   proof['reviews'].append({'index':index+1,'nativeFile':name,'task':DATA[index],'box':outer,'regions':regions,'layoutZoom':2.8,'captureViewport':{'width':4000,'height':1800},'styles':styles,'pixels':Image.open(OUT/name).size})
   row.evaluate('(e,s)=>{e.setAttribute("style",s);let p=e.parentElement;while(p&&p!==document.documentElement){p.setAttribute("style",p.dataset.v7CaptureStyle||"");delete p.dataset.v7CaptureStyle;p=p.parentElement}}',old)
  page.set_viewport_size({'width':1920,'height':1080});settle(300)
  # Exercise the real format detector on the frozen source bytes.
  import zipfile
  with zipfile.ZipFile(ROOT/'analysis/fixtures/Batch_inputs.zip') as z:
   members=z.namelist();letter=next(n for n in members if n.endswith('/Avery Lane.docx') or n=='Avery Lane.docx')
   candidates=[(letter,z.read(letter)),('Session_notes.docx',(ROOT/'analysis/fixtures/Session_notes.docx').read_bytes()),('Supervisors.xlsx',(ROOT/'analysis/fixtures/Supervisors.xlsx').read_bytes()),('Student_001_CV.pdf',(ROOT/'analysis/fixtures/Student_001_CV.pdf').read_bytes())]
  for name,data in candidates:
   result=page.evaluate("""async ({name,data})=>{const b=Uint8Array.from(atob(data),c=>c.charCodeAt(0));const f=new File([b],name);const d=await new NMDAImportAdapters.FormatDetector().detect(f);return {format:d.format,container:d.container,extension:d.ext,packageMembers:['word/document.xml','xl/workbook.xml'].filter(k=>d.entries?.has(k))};}""",{'name':name,'data':base64.b64encode(data).decode()})
   proof['formatProbes'].append({'source':name,'sha256':hashlib.sha256(data).hexdigest(),**result})
  click('[data-tab="batch"]');click('#nmda-manage-attachments-strip')
  for el in page.locator('[data-attachment-policy]').all():el.select_option('smart')
  settle();click('#nmda-attachment-manager-done')
  page.evaluate('() => {const f=NMDAScheduler.buildPlan;NMDAScheduler.buildPlan=(...a)=>{const p=f(...a);window.__v7Plan=p;return p}}')
  click('[data-tab="dispatch"]');click('#nmda-open-schedule-modal')
  page.locator('#nmda-rule-time-zone').select_option('Australia/Sydney')
  page.locator('#nmda-rule-start-date').fill('2026-10-23');page.locator('#nmda-rule-local-time').fill('09:00')
  page.locator('#nmda-rule-max-school').fill('1');page.locator('#nmda-rule-school-interval').fill('7');page.locator('#nmda-rule-preserve-existing').set_checked(False,force=True)
  for el in page.locator('[data-schedule-weekday]').all():el.set_checked(True,force=True)
  settle();click('#nmda-apply-schedule');settle(1800)
  plan=page.evaluate('JSON.parse(JSON.stringify(window.__v7Plan))')
  prior=json.loads((ROOT/'analysis/scheduler-plan.json').read_text())
  key=lambda a:(a['task']['id'],a['scheduleAt'],a['groupLabel'])
  assert sorted(map(key,plan['assignments']))==sorted(map(key,prior['assignments']))
  page.set_viewport_size({'width':5400,'height':2200});settle(300)
  matrix=page.locator('.nmda-plan-matrix-wrap').first
  width=matrix.evaluate('e=>e.scrollWidth')
  matrix.evaluate('(e,w)=>{let p=e;while(p){p.style.setProperty("overflow","visible","important");p.style.setProperty("overflow-x","visible","important");p.style.setProperty("overflow-y","visible","important");p.style.setProperty("max-width","none","important");p.style.setProperty("max-height","none","important");p.style.setProperty("height","auto","important");p.style.setProperty("contain","none","important");p.style.setProperty("clip-path","none","important");p=p.parentElement}e.style.width=w+"px";e.scrollTo(0,0)}',width)
  settle(300);matrix.screenshot(path=str(OUT/'calendar-full.png'),animations='disabled');outer=box(matrix)
  slots=matrix.locator('.nmda-plan-matrix-task').evaluate_all('(es)=>es.map((e,i)=>({index:i,...Object.fromEntries(["x","y","width","height"].map(k=>[k,e.getBoundingClientRect()[k]])),text:e.innerText,dataset:{...e.dataset},html:e.outerHTML.slice(0,400)}))')
  assert len(slots)==60,len(slots)
  image=Image.open(OUT/'calendar-full.png')
  for slot in slots:
   slot['x']-=outer['x'];slot['y']-=outer['y']
   name=f'calendar-slot-{slot["index"]:02d}.png';slot['nativeFile']=name
   cut=image.crop((round(slot['x']*2),round(slot['y']*2),round((slot['x']+slot['width'])*2),round((slot['y']+slot['height'])*2)))
   from PIL import ImageStat
   stats=ImageStat.Stat(cut.convert('RGB'));assert max(stats.stddev)>12,(name,stats.stddev)
   slot['pixelStddev']=stats.stddev;cut.save(OUT/name)
  proof['calendar']={'captureViewport':{'width':5400,'height':2200,'dpr':2},'captureTreatment':'Native matrix and ancestor clipping expanded for a genuine full panorama; native task content and all assignment tuples unchanged.','nativeFile':'calendar-full.png','box':outer,'pixels':image.size,'slots':slots,'summary':plan['summary'],'assignments':[{'id':a['task']['id'],'editKey':a['editKey'],'name':next(x['name'] for x in DATA if x['id']==a['task']['id']),'institution':a['groupLabel'],'scheduleAt':a['scheduleAt']} for a in plan['assignments']]}
  proof['errors']=errors;assert not errors,errors
  (ROOT/'analysis/native-journey-v7.json').write_text(json.dumps(proof,indent=2)+'\n')
  (ROOT/'src/journey-layout-v7.json').write_text(json.dumps({'reviews':proof['reviews'],'calendar':proof['calendar'],'formatProbes':proof['formatProbes']},indent=2)+'\n')
  print(json.dumps({'reviews':[{'index':p['index'],'pixels':p['pixels'],'css':p['box'],'font':p['styles']} for p in proof['reviews']],'formatProbes':proof['formatProbes'],'calendar':{'box':outer,'pixels':image.size,'slots':len(slots),'first':slots[0]},'errors':errors},indent=2));browser.close()
finally:server.shutdown()
'''
exec(compile(prefix+tail,str(ROOT/'scripts/capture-journey-v7.py'),'exec'))
