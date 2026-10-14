#!/usr/bin/env python3
"""Exercise the real workbench import, editing, undo, JSON and video export."""
import copy, json, os, time, subprocess, urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
BASE = 'http://localhost:5198'
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True)
    page = browser.new_page(viewport={'width':1440, 'height':1000}, accept_downloads=True)
    page.add_init_script("localStorage.setItem('shotcraft-workbench-locale','en')")
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(BASE+'/?import=project', wait_until='domcontentloaded', timeout=120000)
    page.wait_for_function("() => JSON.parse(localStorage.getItem('shotcraft-workbench-project-v1')||'null')?.source?.endsWith('#batch-v2')", timeout=120000)
    assert page.locator('.project-name').input_value() == 'SmartMail Ops · Sixty enquiries'
    clip = page.locator('.clip').filter(has_text='Campaign context').first
    clip.click()
    campaign = page.locator('.prop-row').filter(has_text='Campaign label').locator('input')
    original = campaign.input_value()
    campaign.fill('A deliberate test edit')
    page.get_by_role('button', name='↩ Undo', exact=True).click()
    clip.click()
    assert campaign.input_value() == original
    caption_clip = page.locator('.clip').filter(has_text='One student. 60 supervision enquiries.').first
    caption_clip.click()
    caption = page.locator('.prop-row').filter(has_text='Caption').locator('textarea')
    original_caption = caption.input_value()
    caption.fill('A deliberate caption edit')
    page.get_by_role('button', name='↩ Undo', exact=True).click()
    caption_clip.click()
    assert caption.input_value() == original_caption
    with page.expect_download() as event:
        page.get_by_role('button', name='Export JSON', exact=True).click()
    event.value.save_as(ROOT/'analysis/workbench-project.json')
    project = json.loads((ROOT/'analysis/workbench-project.json').read_text())
    clips = [c for t in project['tracks'] for c in t['clips']]
    assert len(clips) == 82
    assert max(c['start']+c['duration'] for c in clips) == 3247
    assert project['source'].endswith('#batch-v2')
    assert any(c['props'].get('text') == original_caption for c in clips)
    page.screenshot(path=ROOT/'out/qa/workbench.png')
    assert not errors, errors
    browser.close()

# Exercise the same video-export endpoint with an isolated eight-frame copy.
# The full film remains the automatically imported, unchanged workbench project.
smoke = copy.deepcopy(project)
smoke['name'] = 'SmartMail batch export smoke'
for track in smoke['tracks']:
    track['clips'] = [c for c in track['clips'] if c['start'] < 8]
    for c in track['clips']:
        c['duration'] = min(c['duration'], 8-c['start'])
req = urllib.request.Request(BASE+'/api/export', data=json.dumps({'project':smoke}).encode(), headers={'Content-Type':'application/json'}, method='POST')
job_id = json.load(urllib.request.urlopen(req))['id']
deadline = time.monotonic()+600
while time.monotonic() < deadline:
    job = json.load(urllib.request.urlopen(BASE+'/api/export/'+job_id))
    if job['status'] != 'running':
        break
    print('Workbench export: '+job['lastLine'], flush=True)
    time.sleep(4)
else:
    raise TimeoutError('Workbench export did not finish within ten minutes')
assert job['status'] == 'done', job
export = Path(os.environ.get('SHOTCRAFT_WORKBENCH','/workspace/video-shotcraft/workbench'))/job['output']
probe = json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-of','json',str(export)]))
video = next(s for s in probe['streams'] if s['codec_type']=='video')
assert (int(video['nb_frames']),video['width'],video['height']) == (8,1920,1080)
report = {'imported':project['name'],'revision':'batch-v2','clips':len(clips),'exactFrames':3247,
          'passed':['automatic film import','campaign edit and undo','caption edit and undo','JSON export','browser errors absent','native eight-frame video export'],
          'exportSmoke':{'frames':8,'width':1920,'height':1080,'job':job_id,'output':job['output']}}
(ROOT/'analysis/workbench-qa.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
