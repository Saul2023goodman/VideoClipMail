#!/usr/bin/env python3
"""Check the film's real workbench import, editing, undo and JSON export."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True)
    page = browser.new_page(viewport={'width':1440, 'height':1000}, accept_downloads=True)
    page.add_init_script("localStorage.setItem('shotcraft-workbench-locale','en')")
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto('http://127.0.0.1:5198/?import=project', wait_until='domcontentloaded')
    page.wait_for_function("""() => {
      const p = JSON.parse(localStorage.getItem('shotcraft-workbench-project-v1') || 'null');
      return p && p.source && p.source.endsWith('#3');
    }""")
    assert page.locator('.project-name').input_value() == 'SmartMail Ops — Chaos, choreographed'
    clip = page.locator('.clip').filter(has_text='signal').first
    clip.click()
    headline = page.locator('.prop-row').filter(has_text='Headline').locator('textarea')
    original = headline.input_value()
    headline.fill('A deliberate test edit.')
    page.get_by_role('button', name='↩ Undo', exact=True).click()
    clip.click()
    assert headline.input_value() == original
    with page.expect_download() as event:
        page.get_by_role('button', name='Export JSON', exact=True).click()
    event.value.save_as(ROOT / 'analysis/workbench-project.json')
    project = json.loads((ROOT / 'analysis/workbench-project.json').read_text())
    clips = [clip for track in project['tracks'] for clip in track['clips']]
    assert len(clips) == 44
    assert max(clip['start'] + clip['duration'] for clip in clips) == 1620
    assert project['source'].endswith('#3')
    assert any(c['props'].get('text') == 'Native highlights. Editing in place.' for c in clips)
    page.screenshot(path=ROOT / 'out/qa/workbench.png')
    assert not errors, errors
    report = {'imported':project['name'], 'revision':3, 'clips':len(clips), 'exactFrames':1620,
              'passed':['automatic film import','headline editing','undo restore','JSON export','browser errors absent']}
    (ROOT / 'analysis/workbench-qa.json').write_text(json.dumps(report, indent=2))
    browser.close()
print(json.dumps(report))
