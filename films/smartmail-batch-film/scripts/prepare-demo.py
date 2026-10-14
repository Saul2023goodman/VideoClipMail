"""Prepare anonymized film inputs. Email bodies are input, not plugin output."""
from pathlib import Path
import csv,json,collections,shutil,openpyxl,sys
ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path(sys.argv[sys.argv.index('--bundle')+1]).resolve() if '--bundle' in sys.argv else Path('/workspace/scratch/smartmail-input/SmartMail_Student001_60_bundle_v2')
DEST=ROOT/'analysis/fixtures';DEST.mkdir(parents=True,exist_ok=True)
rows=list(csv.DictReader((SOURCE/'MASTER_LIST.csv').open(encoding='utf-8-sig')))
drafts=[]
for row in rows:
 direction=row['Subject'].split(' — ')[-1]
 files=[Path(x.strip()).name for x in row['Attachments'].split('|')]
 body=f"Dear {row['Supervisor']},\n\nI am Student 001, an MA Illustration graduate from the University for the Creative Arts. I am exploring practice-led doctoral opportunities for 2027 at {row['University']}.\n\nMy proposed research connects illustration with {direction}. I would value the chance to discuss whether this direction could fit your supervision and the university's research environment.\n\nI have attached my CV and portfolio"
 if len(files)>2: body+=', together with a research proposal'
 if len(files)>3: body+=' and a writing sample'
 body+='. Would you be available for a brief conversation about research fit and the next application steps?\n\nKind regards,\nStudent 001'
 # Some source contact cells contain profile URLs rather than mail addresses.
 # Freeze all 60 display identities using the task's anonymized numeric index.
 email='supervisor'+row['Task ID'].split('-')[-1]+'@example.invalid'
 drafts.append({'ID':row['Task ID'],'Name':row['Supervisor'],'Recipient':email,'Institution':row['University'],
 'Subject':row['Subject'],'Body':body,'Attachment':'; '.join(files),'Tags':direction})
with (DEST/'Enquiries_60.csv').open('w',newline='',encoding='utf-8') as f:
 w=csv.DictWriter(f,fieldnames=list(drafts[0]));w.writeheader();w.writerows(drafts)
wb=openpyxl.Workbook();s=wb.active;s.title='Supervisors';s.append(['Name','Email','Institution','Research Direction'])
for r,d in zip(rows,drafts):s.append([r['Supervisor'],d['Recipient'],r['University'],r['Subject'].split(' — ')[-1]])
wb.save(DEST/'supervisors_60.xlsx')
for p in (SOURCE/'attachments/common').glob('*.pdf'):shutil.copy2(p,DEST/p.name)
summary={'student':'Student 001','tasks':len(rows),'institutions':dict(collections.Counter(r['University'] for r in rows)),
 'attachment_usage':dict(collections.Counter(f for d in drafts for f in d['Attachment'].split('; '))),
 'attachment_links':sum(len(d['Attachment'].split('; ')) for d in drafts),'body_origin':'Prepared English demo input, before the plugin imports it',
 'supporting_samples':'Transcript and MOI are not uploaded or automatically attached','data_policy':'Numbered people, example.invalid addresses; no profile URLs or personal role text in capture'}
(ROOT/'analysis/input-summary.json').write_text(json.dumps(summary,indent=2))
(ROOT/'src/demo-data.json').write_text(json.dumps([{'id':d['ID'],'name':d['Name'],'email':d['Recipient'],'institution':d['Institution'],'subject':d['Subject'],'attachments':d['Attachment'].split('; '),'direction':d['Tags']} for d in drafts],indent=2))
print(json.dumps(summary,indent=2))
