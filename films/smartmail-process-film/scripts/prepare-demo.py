"""Freeze new fictional inputs with real classification and duplicate edge cases."""
from pathlib import Path
import csv,json,collections,shutil,zipfile,openpyxl,html
ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT/'analysis/fixtures'
DEST.mkdir(parents=True,exist_ok=True)
first='Avery Avery Morgan Riley Casey Cameron Jordan Taylor Quinn Rowan Blair Reese Parker Devon Sage Alex Elliot Finley Harper Jamie Logan Charlie Dakota Skyler Robin Drew Emery Hayden Jesse Kendall Lane Marley Noel Payton River Sawyer Spencer Wren Ellis Frankie Greer Hollis Indigo Jules Kit Linden Micah Oakley Phoenix Remy Shiloh Teagan Val Whitney Arden Bellamy Corey Denver Eden Fallon'.split()
last='Lane Lane Reed Hart Brooks Vale Quinn Blake Ellis Stone'.split()
source=list(csv.DictReader((ROOT/'analysis/source-seed.csv').open()))
rows=[];data=[]
for i,r in enumerate(source):
 name=first[i]+' '+last[i%len(last)]
 r['Name']=name
 r['Body']=r['Body'].replace('Supervisor '+str(i+1).zfill(3),name)
 refs=r['Attachment'].split('; ')
 if i==0:refs[0]='attachments/common/Student_001_CV.pdf'
 r['Attachment']='; '.join(refs)
 rows.append(r)
 data.append({'id':r['ID'],'name':name,'email':r['Recipient'],'institution':r['Institution'],'subject':r['Subject'],'body':r['Body'],'attachments':[Path(x).name for x in refs],'attachmentRefs':refs,'direction':r['Tags']})
alt=dict(rows[6]);alt['ID']='TASK-007-ALT';alt['Recipient']=alt['Recipient'].upper();alt['Body']='Dear Jordan Quinn,\n\nI would like to discuss doctoral supervision.\n\nKind regards,\nStudent 001';alt['Attachment']=''
rows.insert(7,alt)
wb=openpyxl.Workbook();s=wb.active;s.title='Supervisors';s.append(['Name','Email','Institution','Research Direction'])
for d in data:s.append([d['name'],d['email'],d['institution'],d['direction']])
wb.save(DEST/'Supervisors.xlsx')
def docx(path,paragraphs):
 with zipfile.ZipFile(path,'w',zipfile.ZIP_DEFLATED) as z:
  z.writestr('[Content_Types].xml','<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
  z.writestr('_rels/.rels','<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
  z.writestr('word/document.xml','<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+''.join('<w:p><w:r><w:t xml:space="preserve">'+html.escape(t)+'</w:t></w:r></w:p>' for t in paragraphs)+'</w:body></w:document>')
letters=DEST/'letters';letters.mkdir(exist_ok=True)
for i,r in enumerate(rows):
 name=r['Name']
 suffix=' (2)' if r['ID'] in ['TASK-002','TASK-007-ALT'] else ''
 docx(letters/(name+suffix+'.docx'),[f"Institution: {r['Institution']}",r['ID'],f"Recipient: {r['Recipient']}",f"Subject: {r['Subject']}"]+r['Body'].split('\n')+([f"Attachments: {r['Attachment']}"] if r['Attachment'] else []))
shutil.copy2(letters/'Jordan Quinn.docx',letters/'Jordan_export_copy.docx')
with zipfile.ZipFile(DEST/'Session_notes.docx','w',zipfile.ZIP_DEFLATED) as z:
 z.writestr('[Content_Types].xml','<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
 z.writestr('_rels/.rels','<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
 z.writestr('word/document.xml','<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Session notes</w:t></w:r></w:p><w:p><w:r><w:t>Blue folder. Thursday workshop. Three tables near the window.</w:t></w:r></w:p></w:body></w:document>')
(ROOT/'src/demo-data.json').write_text(json.dumps(data,indent=2)+'\n')
with zipfile.ZipFile(DEST/'Batch_inputs.zip','w',zipfile.ZIP_DEFLATED) as z:
 for r in rows:
  suffix=' (2)' if r['ID'] in ['TASK-002','TASK-007-ALT'] else ''
  path=letters/(r['Name']+suffix+'.docx');z.write(path,'letters/'+path.name)
 z.write(letters/'Jordan_export_copy.docx','letters/Jordan_export_copy.docx')
 for name in ['Supervisors.xlsx','Student_001_CV.pdf','Student_001_Portfolio.pdf','Student_001_Research_Proposal.pdf','Student_001_Writing_Sample.pdf','Session_notes.docx']:z.write(DEST/name,name)
summary={'language':'English only','fictional_identities':True,'input_files':68,'transport':'Batch_inputs.zip','identical_source_copies':1,'candidate_mails':61,'reference_contacts':60,'attachment_sources':4,'needs_review':1,'final_tasks':60,'attachment_links':sum(len(d['attachments']) for d in data),'institutions':dict(collections.Counter(d['institution'] for d in data)),'dedupe_examples':{'exact_email':['TASK-007','TASK-007-ALT'],'name_school':['TASK-001','TASK-002']},'scope':'Offline provider; prepared input bodies; no AI-writing or live-send claim'}
(ROOT/'analysis/input-summary.json').write_text(json.dumps(summary,indent=2)+'\n')
assert len(data)==60 and summary['attachment_links']==211
print(json.dumps(summary,indent=2))
