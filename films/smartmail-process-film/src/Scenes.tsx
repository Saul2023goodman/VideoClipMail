import React from 'react';
import {AbsoluteFill,Img,Html5Video,Sequence,staticFile,useCurrentFrame} from 'remotion';
import {SHOTS,beatF,TOKENS as T,SCENE_PROPS,CARRY} from './timeline';
import DATA from './demo-data.json';
import RECORD from './recorded-data.json';
import NATIVE from './native-layout.json';
import TRACE from './scheduler-trace.json';
import {Bracket,Check,Cursor,FontStyles,Line,Mark,NativeCrop,Paper,Tag,Token,Txt,brake,clamp,fly,inOut,mix,out,ramp,smooth,springAt} from './motion';
export type SceneProps={kind?:string;duration?:number;primaryText?:string;secondaryText?:string;accent?:string;fontSize?:number;labelX?:number;labelY?:number;hideCarry?:boolean};
type ViewProps={f:number;b:(n:number)=>number;note:(text:string,x:number,y:number,opacity?:number,color?:string)=>React.ReactNode;primaryText:string;secondaryText:string;accent:string;hideCarry?:boolean};
const Scope:React.FC<{opacity:number}>=({opacity})=><Txt x={1635} y={28} size={21} color={T.muted} weight={400} opacity={opacity}>OFFLINE DEMO</Txt>;
const FileIcon:React.FC<{kind?:string;size?:number;color?:string}>=({kind='DOCX',size=60,color=T.accent})=><svg width={size} height={size*1.15} viewBox="0 0 60 69"><path d="M7 3h30l16 17v46H7Z" fill="#f0f5ff" stroke={color} strokeWidth={2}/><path d="M37 3v17h16" stroke={color} strokeWidth={2} fill="none"/><text x="30" y="48" textAnchor="middle" fill={color} fontSize={12} fontWeight={700}>{kind}</text></svg>;
const FileStrip:React.FC<{name:string;kind?:string;x:number;y:number;w?:number;opacity?:number;scale?:number;color?:string}>=({name,kind='DOCX',x,y,w=640,opacity=1,scale=1,color=T.accent})=><Paper x={x} y={y} w={w} h={112} style={{opacity,transform:`scale(${scale})`,transformOrigin:'0 0',display:'flex',alignItems:'center',gap:24,padding:'18px 26px'}}><FileIcon kind={kind} size={48} color={color}/><div style={{fontSize:32,fontWeight:700,whiteSpace:'nowrap'}}>{name}</div></Paper>;

const Intro:React.FC<ViewProps>=({f,b,note,primaryText,secondaryText,accent})=>{
 const open=ramp(f,b(1),36,smooth),gather=ramp(f,b(6),26,smooth);
 return <>
  <div style={{position:'absolute',left:140,top:112,display:'flex',gap:18,alignItems:'center'}}><Mark size={54}/><div style={{fontSize:33,fontWeight:700}}>SmartMail Ops</div></div>
  <div style={{position:'absolute',left:155,top:360,width:530,height:335,transform:`translateY(${mix(35,0,open)}px)`}}>
   <div style={{position:'absolute',inset:0,background:'#dbe9ff',border:`2px solid ${accent}`,borderRadius:12,transformOrigin:'50% 100%',transform:`perspective(900px) rotateX(${mix(0,-48,open)}deg)`}}/>
   <div style={{position:'absolute',left:0,top:55,width:530,height:280,background:'#eaf2ff',border:`2px solid ${accent}`,borderRadius:12}}/>
   <Txt x={34} y={108} size={42}>Student 001</Txt><Txt x={34} y={176} size={27} weight={400} color={T.muted}>2027 PhD supervision campaign</Txt>
  </div>
  {DATA.map((d,i)=>{const p=ramp(f,b(1)+i*.48,32,smooth),col=i%10,row=Math.floor(i/10),x=mix(365,770+col*96,p),y=mix(430,274+row*82,p);return <div key={d.id} style={{position:'absolute',left:mix(x,1470,gather),top:mix(y,480,gather),width:78,height:54,border:`1px solid ${accent}`,borderRadius:6,background:'#fff',fontSize:23,fontWeight:700,color:accent,display:'grid',placeItems:'center',opacity:p*(1-gather*.98),transform:`rotate(${mix(-8,0,p)}deg)`}}>{String(i+1).padStart(2,'0')}</div>})}
  <div style={{position:'absolute',left:770,top:835,opacity:ramp(f,b(3),14),transform:`translateY(${mix(15,0,ramp(f,b(3),14))}px)`}}>{note(primaryText,0,0,1,accent)}<Txt y={64} size={31} color={T.muted} weight={400}>{secondaryText}</Txt></div>
  <FileStrip name="Batch_inputs.zip" kind="ZIP" x={mix(1100,1230,gather)} y={mix(1110,440,gather)} w={500} opacity={gather}/>
 </>;
};

const WordScan:React.FC<{f:number;start:number;accent:string}>=({f,start,accent})=>{
 const q=f-start,sy=mix(92,786,clamp((q-9)/126));
 const regions=[{y:166,h:46,label:'Recipient address',tagY:156},{y:239,h:70,label:'Subject boundary',tagY:258},{y:371,h:46,label:'Salutation',tagY:362},{y:447,h:156,label:'Recipient-directed request',tagY:510},{y:650,h:130,label:'Closing + file requirements',tagY:700}];
 return <Paper x={126} y={120} w={1090} h={836} style={{overflow:'visible'}}>
  <div style={{position:'absolute',left:28,top:25,display:'flex',alignItems:'center',gap:18}}><FileIcon size={42}/><div style={{fontSize:32,fontWeight:700}}>Jordan Quinn.docx</div><div style={{fontSize:25,color:T.muted}}>input content</div></div>
  <div style={{position:'absolute',left:0,right:0,top:101,height:1,background:T.line}}/>
  <Txt x={36} y={165} size={30} weight={400}>Recipient: <span style={{color:accent}}>supervisor007@example.invalid</span></Txt>
  <Txt x={36} y={239} size={30} w={995} weight={400}>Subject: Prospective PhD supervision enquiry —<br/>material practice, craft &amp; illustration</Txt>
  <Txt x={36} y={371} size={30} weight={400}>Dear Jordan Quinn,</Txt>
  <Txt x={36} y={447} size={30} w={968} weight={400}>I am exploring practice-led doctoral opportunities for 2027.<br/><br/>I would value the chance to discuss whether this direction<br/>could fit your supervision and research environment.</Txt>
  <Txt x={36} y={650} size={29} weight={400}>Kind regards, Student 001</Txt><Txt x={36} y={704} size={24} w={960} weight={400}>Attachments: Student_001_CV.pdf; Student_001_Portfolio.pdf;<br/>Student_001_Research_Proposal.pdf</Txt>
  {regions.map((r,i)=>{const ft=9+(r.y+r.h-92)/694*126;return <React.Fragment key={i}><Bracket x={27} y={r.y-6} w={1030} h={r.h+12} f={q} start={ft}/><div style={{position:'absolute',left:1057,top:r.tagY+27,width:86,height:2,background:T.scan,opacity:ramp(q,ft+5,6)}}/><Tag text={r.label} x={1150} y={r.tagY} f={q} start={ft} size={32}/></React.Fragment>})}
  {q>=9&&q<148?<><div style={{position:'absolute',left:0,right:0,top:sy-60,height:60,background:'linear-gradient(0deg,#2b4fd812,transparent)'}}/><div style={{position:'absolute',left:0,right:0,top:sy,height:3,background:T.scan}}/><div style={{position:'absolute',left:-15,top:sy-8,width:0,height:0,borderTop:'9px solid transparent',borderBottom:'9px solid transparent',borderLeft:`11px solid ${T.scan}`}}/></>:null}
 </Paper>;
};

const Classify:React.FC<ViewProps>=({f,b,note,primaryText,secondaryText,accent})=>{
 const hashEnd=b(14),wordEnd=b(26),rosterEnd=b(34),assetsEnd=b(42),finish=b(52);
 const hashP=ramp(f,b(10),38,smooth),merge=ramp(f,b(12),23,smooth),go=ramp(f,b(13),17,smooth);
 return <>
  {f<hashEnd?<>
   <FileStrip name="Jordan Quinn.docx" x={mix(180,568,merge)} y={340} opacity={1-go}/>
   <FileStrip name="Jordan_export_copy.docx" x={mix(1050,568,merge)} y={340} opacity={(1-merge*.97)*(1-go)}/>
   <Line d="M510 458V615H1410V458" p={hashP} opacity={1-go}/>
   <Tag text={'SHA-256 · '+RECORD.hash.slice(0,18)} x={550} y={586} f={f} start={b(10)} size={30}/>
   <Txt x={640} y={720} size={43} color={T.green} opacity={ramp(f,b(12),10)*(1-go)}>Same bytes → parse once</Txt>
   <Txt x={185} y={228} size={29} color={T.muted} weight={400}>Before content parsing</Txt>
   <Txt x={750} y={870} size={31} weight={400} color={T.muted} opacity={ramp(f,b(12),12)}>68 files → 67 unique sources</Txt>
  </>:null}
  {f>=hashEnd&&f<wordEnd?<>
   <div style={{transform:`translateX(${mix(140,0,ramp(f,hashEnd,16,smooth))}px)`}}><WordScan f={f} start={hashEnd} accent={accent}/></div>
   <div style={{position:'absolute',left:1350,top:900,opacity:ramp(f,b(23),14),transform:`translateX(${mix(38,0,ramp(f,b(23),20))}px)`}}>{note(primaryText,0,0,1,accent)}<Txt x={0} y={65} size={31} color={T.muted} weight={400}>{secondaryText}</Txt><Txt x={320} y={-16} size={85} color={accent}>61</Txt></div>
   <Line d="M1230 880H1300V927H1340" p={ramp(f,b(24),22)} opacity={ramp(f,b(23),10)}/>
  </>:null}
  {f>=wordEnd&&f<rosterEnd?(()=>{const q=f-wordEnd,p=ramp(q,0,18,smooth),scan=mix(130,530,clamp((q-18)/70));return <>
   <Paper x={126} y={mix(970,238,p)} w={1390} h={586}>
    <Txt x={34} y={28} size={37}>Supervisors.xlsx</Txt><Txt x={960} y={35} size={28} weight={400} color={T.muted}>60 reference entries</Txt>
    <div style={{position:'absolute',left:0,right:0,top:110,height:1,background:T.line}}/>
    {['Name','Email','Institution'].map((t,i)=><Txt key={t} x={[35,354,957][i]} y={138} size={30} color={accent}>{t}</Txt>)}
    {DATA.slice(0,4).map((d,i)=><div key={i} style={{position:'absolute',left:28,top:213+i*77,width:1326,height:69,borderBottom:`1px solid ${T.line}`}}><Txt x={7} y={10} size={29} weight={400}>{d.name}</Txt><Txt x={326} y={10} size={28} weight={400}>{d.email}</Txt><Txt x={929} y={10} size={27} weight={400}>{d.institution}</Txt></div>)}
    {q>18&&q<88?<div style={{position:'absolute',left:0,right:0,top:scan,height:3,background:T.scan,boxShadow:'0 -25px 40px #2b4fd818'}}/>:null}
    <Bracket x={24} y={130} w={1342} h={428} f={q} start={88}/><Tag text="Identity row pattern" x={390} y={550} f={q} start={88} size={32}/>
   </Paper>
   <Txt x={1565} y={460} size={44} color={T.green} opacity={ramp(q,96,12)}>Roster</Txt><Txt x={1570} y={530} size={92} color={T.green} opacity={ramp(q,100,12)}>60</Txt>
   <Line d="M1516 570H1560" p={ramp(q,94,18)} color={T.green}/>
  </>})():null}
  {f>=rosterEnd&&f<assetsEnd?(()=>{const q=f-rosterEnd,route=ramp(q,28,36,smooth),uncertain=ramp(q,62,25,smooth);return <>
   <Txt x={120} y={153} size={33} color={T.muted} weight={400}>Embedded files bypass mail parsing</Txt>
   {['CV','Portfolio','Research_Proposal','Writing_Sample'].map((name,i)=>{const p=ramp(q,8+i*6,30,smooth);return <FileStrip key={name} name={name+'.pdf'} kind="PDF" x={mix(120,1230,route)} y={mix(335+i*125,340+i*98,route)} w={570} scale={mix(1,.83,route)} opacity={p} color={T.green}/>})}
   <div style={{position:'absolute',left:852,top:290,opacity:ramp(q,10,14)}}><div style={{height:450,width:4,background:T.line}}><div style={{position:'absolute',left:-75,top:155,background:T.bg,padding:20,fontSize:38,fontWeight:700,color:T.green}}>.pdf</div></div></div>
   <Tag text="Direct attachment pool" x={1160} y={226} f={q} start={44} color={T.green} size={31}/>
   <FileStrip name="Session_notes.docx" x={120} y={mix(1010,260,uncertain)} w={650} opacity={uncertain} color={T.amber}/>
   <Tag text="Insufficient evidence → review" x={1160} y={876} f={q} start={83} color={T.amber} size={27}/>
  </>})():null}
  {f>=assetsEnd?<>
   <NativeCrop src={f<b(48)?'native/02-notes.png':'native/03-classified.png'} x={840} y={154} w={966} h={808} crop={{x:740,y:225,w:680,h:570}}/>
   <FileStrip name="Session_notes.docx" x={120} y={260} w={650} color={T.amber}/>
   <Txt x={150} y={420} size={36} color={T.amber}>Needs review</Txt>
   <Txt x={150} y={477} size={29} w={560} color={T.muted} weight={400}>No reliable mail or roster structure.<br/>The operator chooses its purpose.</Txt>
   <Line d="M740 380H814" p={ramp(f,assetsEnd+8,22)} color={T.amber}/>
   <Tag text="Ignore in this batch" x={1250} y={506} f={f} start={b(48)} color={T.muted} size={28}/>
   <Line d="M1660 459V486H1500" p={ramp(f,b(48),14)} color={T.muted}/>
   <Cursor x={mix(1100,1661,ramp(f,b(46),20,smooth))} y={mix(780,434,ramp(f,b(46),20,smooth))} press={f>=b(48)?1-ramp(f,b(48),6):0}/>
   <Txt x={145} y={745} size={44} color={T.green} opacity={ramp(f,b(49),10)}>61 candidates ready for contact checks</Txt>
  </>:null}
 </>;
};

const Dedupe:React.FC<ViewProps>=({f,b,note,primaryText,secondaryText,accent})=>{
 const exactEnd=b(64),probableEnd=b(78),normalize=ramp(f,b(55),25,smooth),select=ramp(f,b(61),24,smooth),keys=ramp(f,b(57),44,smooth);
 return <>
  {f<exactEnd?<>
   <Txt x={150} y={135} size={30} color={T.muted} weight={400}>Contact versions · compare the extracted address</Txt>
   {['TASK-007','TASK-007-ALT'].map((id,i)=>{const p=.75+.25*ramp(f,i*6,20,smooth),x=i?1090:150,y=mix(270,190,select);return <Paper key={id} x={mix(x,i?1730:1430,select)} y={y} w={680} h={246} style={{opacity:p*(i?1-select:1),transform:`scale(${mix(1,.42,select)})`,transformOrigin:'0 0'}}><Txt x={28} y={21} size={28} color={T.muted} weight={400}>{id} · Jordan Quinn</Txt><Txt x={28} y={88} size={29} color={accent} weight={700} style={{fontFamily:'monospace'}}>{'supervisor007@example.invalid'.split('').map((c,j)=>{const fc=f-b(55)-j*.4,letter=c.toUpperCase()!==c,angle=i&&letter?(fc<4?90*ramp(fc,0,4,smooth):-90*(1-ramp(fc,4,4,smooth))):0;return <span key={j} style={{display:'inline-block',width:'.6em',transform:`perspective(300px) rotateX(${angle}deg)`}}>{i&&fc<4?c.toUpperCase():c}</span>})}</Txt><Txt x={28} y={165} size={28} weight={400}>{i?'92 body characters':'Complete body + attachment requirements'}</Txt></Paper>})}
   <Line d="M600 508Q960 695 1320 508" p={normalize} opacity={1-select}/>
   <div style={{opacity:1-select}}><Tag text="extract address → lowercase" x={700} y={568} f={f} start={b(55)} size={32}/></div>
   {keys>0?['left','right'].map((v,i)=><div key={v} style={{position:'absolute',left:mix(i?1118:178,550,keys),top:mix(358,716,keys),fontFamily:'monospace',fontSize:mix(29,39,keys),fontWeight:700,color:accent,whiteSpace:'nowrap',opacity:ramp(f,b(57),5)*(1-select)*(i?1-ramp(keys,.8,.2):1)}}>supervisor007@example.invalid</div>):null}
   <div style={{position:'absolute',left:530,top:773,width:780,height:4,background:accent,opacity:ramp(f,b(59),12)*(1-select)}}/><div style={{opacity:1-select}}><Tag text="Exact email match" x={815} y={800} f={f} start={b(59)} color={T.amber} size={32}/></div>
   {f>=b(61)?<>
    <NativeCrop src="native/05-dedupe-1.png" x={118} y={470} w={1684} h={506} crop={{x:50,y:532,w:1330,h:400}} opacity={ramp(f,b(61),12)}/>
    {note(primaryText,170,355,ramp(f,b(61),14),T.green)}
    <Cursor x={1548} y={933} press={f>=b(62)?1-ramp(f,b(62),6):0}/>
   </>:null}
  </>:null}
  {f>=exactEnd&&f<probableEnd?(()=>{const q=f-exactEnd,join=ramp(f,b(67),28,smooth),choice=ramp(f,b(74),26,smooth);return <>
   <div style={{position:'absolute',left:150,top:184,transform:`translateY(${24*(1-ramp(q,0,18))}px)`}}><Txt size={47}>Avery Lane</Txt><Txt y={68} size={29} color={T.muted} weight={400}>TASK-001 · supervisor001@example.invalid</Txt><Txt y={118} size={29} color={accent}>RMIT University</Txt></div>
   <div style={{position:'absolute',left:1060,top:184,transform:`translateY(${24*(1-ramp(q,6,18))}px)`}}><Txt size={47}>Avery Lane</Txt><Txt y={68} size={29} color={T.muted} weight={400}>TASK-002 · supervisor002@example.invalid</Txt><Txt y={118} size={29} color={accent}>RMIT University</Txt></div>
   <Line d="M335 357Q335 436 700 436H1220Q1450 436 1450 357" p={join} color={T.amber}/>
   <Tag text="Possible same contact" x={732} y={410} f={f} start={b(68)} color={T.amber} size={31}/>
   {note(secondaryText,470,495,ramp(f,b(69),12),T.amber)}
   <NativeCrop src="native/04-dedupe.png" x={118} y={560} w={1684} h={506} crop={{x:50,y:532,w:1330,h:400}} opacity={ramp(f,b(70),15)}/>
   <Cursor x={1664} y={1019} press={f>=b(74)?1-ramp(f,b(74),6):0}/>
   {choice>0?<div style={{position:'absolute',left:1410,top:412,opacity:choice,background:T.bg,padding:12,display:'flex',alignItems:'center',gap:14,fontSize:34,color:T.green,fontWeight:700}}><Check/>Keep both</div>:null}
  </>})():null}
  {f>=probableEnd?(()=>{const q=f-probableEnd,match=ramp(q,12,52,smooth),history=ramp(f,b(83),30,smooth);return <>
   <Txt x={120} y={115} size={31} color={T.muted} weight={400}>Sixty selected records pass through two reference checks</Txt>
   <div style={{position:'absolute',left:696,top:224,width:4,height:600,background:T.line}}/><div style={{position:'absolute',left:1300,top:224,width:4,height:600,background:T.line}}/>
   <Txt x={515} y={174} size={34}>Reference roster</Txt><Txt x={1170} y={174} size={34}>Mailbox history</Txt>
   {DATA.map((d,i)=>{const p=ramp(q,14+i*.56,25,smooth),col=i%5,row=Math.floor(i/5);return <div key={d.id} style={{position:'absolute',left:mix(120+col*103,748+col*102,p),top:279+row*42,width:87,height:30,borderRadius:4,background:p>.98?'#e7f4ef':'#eaf2ff',color:p>.98?T.green:accent,border:`1px solid ${p>.98?T.green:accent}`,fontSize:20,fontWeight:700,textAlign:'center',lineHeight:'28px'}}>{String(i+1).padStart(2,'0')}</div>})}
   <Tag text="Match by email" x={488} y={855} f={q} start={57} color={T.green} size={30}/>
   <div style={{position:'absolute',left:1415,top:405,opacity:history,transform:`translateX(${mix(40,0,history)}px)`}}><Txt size={58} color={T.green}>0 prior matches</Txt><Txt y={90} size={30} weight={400} color={T.muted}>Sent 0 · Drafts 0</Txt><Txt y={154} size={28} weight={400} color={T.muted}>Existing records checked before<br/>new initial mail proceeds.</Txt></div>
   <Line d="M1310 483H1395" p={history}/>
   <Txt x={130} y={932} size={43} color={T.green} opacity={ramp(f,b(86),12)}>60 selected · contact checks complete</Txt>
  </>})():null}
 </>;
};

const Overview:React.FC<ViewProps>=({f,b,note,primaryText,secondaryText,accent})=>{
 const u=brake(clamp((f-16)/185)),v=brake(clamp((f+0.5-16)/185))-brake(clamp((f-0.5-16)/185)),blur=Math.min(30,Math.abs(v)*(NATIVE.scroll.scrollHeight-NATIVE.scroll.height)*1.08*.32),queueY=118;
 return <>
  <svg width={0} height={0}><filter id="overview-motion" x="0" y="-5%" width="100%" height="110%"><feGaussianBlur stdDeviation={`0 ${blur.toFixed(3)}`}/></filter></svg>
  <div style={{position:'absolute',left:182,top:0,width:1555,height:1080,overflow:'hidden'}}><Html5Video src={staticFile('native/overview-scroll.mp4')} muted style={{width:1555,height:1080}}/>{blur>.5?<div style={{position:'absolute',left:0,top:queueY,width:1555,height:951,overflow:'hidden'}}><Html5Video src={staticFile('native/overview-scroll.mp4')} muted style={{position:'absolute',left:0,top:-queueY,width:1555,height:1080,filter:'url(#overview-motion)'}}/></div>:null}</div>
  <div style={{position:'absolute',left:1795,top:220,width:4,height:610,background:T.line}}/><div style={{position:'absolute',left:1782,top:220+u*580,width:29,height:29,borderRadius:16,background:accent}}/>
  <Txt x={1780} y={151} size={34} color={accent}>01</Txt><Txt x={1777} y={865} size={34} color={accent}>60</Txt>
  {f>202?<><Line d="M1782 813H1668V900H1620" p={ramp(f,202,12)}/><div style={{position:'absolute',left:1042,top:876,width:650,height:112,background:T.bg,padding:'18px 22px',borderLeft:`4px solid ${accent}`,opacity:ramp(f,202,10)}}>{note(primaryText,22,13,1,accent)}<Txt x={22} y={67} size={28} color={T.muted} weight={400}>{secondaryText}</Txt></div></>:null}
 </>;
};

const Files:React.FC<ViewProps>=({f,b,note,primaryText,secondaryText,accent})=>{
 const names=['CV','Portfolio','Research proposal','Writing sample'];
 const exact=ramp(f,b(107),21,smooth),base=ramp(f,b(110),26,smooth),matched=ramp(f,b(112),17);
 const matrixStart=b(114);
 return <>
  {f<matrixStart?<>
   <Paper x={130} y={188} w={1630} h={198} style={{overflow:'hidden'}}><Txt x={30} y={25} size={28} weight={400} color={T.muted}>TASK-001 · requested file</Txt><Txt x={30} y={93} size={38} color={accent}><span style={{opacity:1-base*.65}}>attachments/common/</span>Student_001_CV.pdf</Txt></Paper>
   <Line d="M550 393V550H850" p={exact} color={T.muted}/>
   <Txt x={865} y={508} size={39} color={T.muted} opacity={exact}>Exact path</Txt><Tag text="No exact entry" x={1200} y={504} f={f} start={b(108)} color={T.amber} size={30}/>
   <Line d="M550 570V730H850" p={base}/>
   <Txt x={864} y={692} size={39} color={accent} opacity={base}>Unique basename</Txt>
   <FileStrip name="Student_001_CV.pdf" kind="PDF" x={mix(1340,1210,base)} y={650} w={575} opacity={base} color={T.green}/>
   <Tag text="Matched" x={1380} y={804} f={f} start={b(112)} color={T.green} size={31}/>
   <Txt x={150} y={893} size={30} color={T.muted} weight={400} opacity={matched}>Missing or ambiguous candidates stay unresolved.</Txt>
  </>:null}
  {f>=matrixStart?(()=>{const q=f-matrixStart,build=ramp(f,b(116),94,smooth),counts=[60,60,59,32];return <>
   <div style={{position:'absolute',left:126,top:151,opacity:ramp(q,0,15)}}><div style={{fontSize:35,fontWeight:700}}>Match mail hints</div><div style={{marginTop:12,fontSize:27,color:T.muted}}>Four files, individual scopes</div></div>
   {names.map((name,j)=>{const p=ramp(q,j*5,18);return <div key={name} style={{position:'absolute',left:125,top:320+j*135,display:'flex',alignItems:'center',gap:24,opacity:p}}><FileIcon kind="PDF" size={52} color={T.green}/><div style={{width:315,fontSize:32,fontWeight:700}}>{name}</div><div style={{fontSize:51,fontWeight:700,color:T.green}}>{Math.round(counts[j]*build)}</div></div>})}
   {DATA.map((d,i)=>{const p=ramp(f,b(116)+i*.92,28,smooth),col=i%8,row=Math.floor(i/8),x=766+col*125,y=182+row*98;return <div key={d.id} style={{position:'absolute',left:x,top:mix(y+22,y,p),opacity:ramp(q,i*.28,15)}}><div style={{fontSize:27,fontWeight:700,color:accent}}>{String(i+1).padStart(2,'0')}</div><div style={{display:'flex',gap:5,marginTop:13}}>{names.map((n,j)=>{const required=d.attachments.some(a=>a.includes(['CV','Portfolio','Research_Proposal','Writing_Sample'][j]));return <div key={n} style={{width:20,height:20,borderRadius:3,border:`1px solid ${required?T.green:T.line}`,background:required&&p>.85?T.green:'#fff',opacity:required?1:.35}}/>})}</div></div>})}
   {names.map((name,j)=><Line key={name} d={`M615 ${352+j*135}C710 ${352+j*135} 670 ${262+j*185} 746 ${262+j*185}`} p={build} color={T.green} width={2}/>) }
   <div style={{position:'absolute',left:757,top:950,width:1020,height:5,background:T.line}}><div style={{width:1020*build,height:5,background:accent}}/></div>
   {note(primaryText,756,981,ramp(f,b(124),12),T.green)}
   <Txt x={125} y={930} size={26} w={565} color={T.muted} weight={400}>{secondaryText}</Txt>
  </>})():null}
 </>;
};

const CarryToRules:React.FC<ViewProps>=({f,b,note,primaryText,secondaryText,accent})=>{
 const cam=1920*ramp(f,10,56,smooth),lead=1040,bar=1020,X0=757,Y=955,FX0=2825,FX1=3650,FY=122;
 const camAt=(t:number)=>1920*ramp(t,10,56,smooth),motionBlur=Math.min(16,Math.abs(camAt(f+.5)-camAt(f-.5))*.28);
 const segs=[[X0,Y,FX0,Y],[FX0,Y,FX0,FY],[FX0,FY,FX1,FY],[FX1,FY,FX1,Y],[FX1,Y,FX0,Y]],lens=segs.map(s=>Math.hypot(s[2]-s[0],s[3]-s[1])),total=lens.reduce((a,v)=>a+v,0);
 const drawn=f<10?mix(bar,lead,ramp(f,0,10,smooth)):f<66?lead+cam:mix(lead+1920,total,ramp(f,66,24,smooth));
 let remaining=drawn,tx=FX0,ty=Y;
 for(let i=0;i<segs.length;i++){if(remaining<=lens[i]){const s=segs[i],u=remaining/lens[i];tx=mix(s[0],s[2],u);ty=mix(s[1],s[3],u);break;}remaining-=lens[i];}
 const old=SHOTS.find(s=>s.id==='files')!,prevB=(n:number)=>beatF(n)-old.from;
 const world:React.CSSProperties={position:'absolute',left:0,top:0,width:3840,height:1080,transform:`translateX(${-cam}px)`};
 return <>
  <svg width={0} height={0}><filter id="carry-motion" x="-5%" y="0" width="110%" height="100%"><feGaussianBlur stdDeviation={`${motionBlur.toFixed(3)} 0`}/></filter></svg>
  <div style={{...world,filter:motionBlur>.25?'url(#carry-motion)':undefined}}><div style={{position:'absolute',left:0,top:0,width:1920,height:1080}}><Files f={old.duration-1} b={prevB} note={note} primaryText={SCENE_PROPS.files.primaryText} secondaryText={SCENE_PROPS.files.secondaryText} accent={accent}/></div>
   <div style={{position:'absolute',left:2070,top:276,opacity:ramp(f,54,18),transform:`translateY(${mix(20,0,ramp(f,54,18))}px)`}}><Txt size={51} color={accent}>{primaryText}</Txt><Txt y={91} size={32} color={T.muted} weight={400}>{secondaryText}</Txt><Txt y={172} size={37}>Australia / Sydney</Txt><Txt y={230} size={37}>09:00 · Monday–Friday</Txt><Txt y={327} size={34} color={T.green}>1 per institution / day</Txt><Txt y={387} size={34} color={T.green}>At least 7 days apart</Txt></div>
   {f>=90?<NativeCrop src="native/11-rules.png" x={2850} y={144} w={758} h={801} crop={{x:341,y:126,w:758,h:801}} opacity={ramp(f,90,12)}/>:null}
  </div>
  <div style={world}><svg width={3840} height={1080} style={{position:'absolute',inset:0,overflow:'visible'}}><path d={`M${X0} ${Y}H${FX0}V${FY}H${FX1}V${Y}H${FX0}`} fill="none" stroke={accent} strokeWidth={5} strokeDasharray={`${drawn} ${total+20}`}/>{f<98?<><circle cx={tx} cy={ty} r={24} fill={accent} opacity={.1*(1-ramp(f,90,8))}/><circle cx={tx} cy={ty} r={8} fill={accent} opacity={1-ramp(f,90,8)}/></>:null}</svg></div>
 </>;
};

const CalendarEmbed:React.FC<ViewProps>=({f,b,note,primaryText,accent})=>{
 const q=f-b(174),slots=NATIVE.calendar_slots.filter(r=>r.y<827),cues=slots.map((_,i)=>i<5?[12,22,31,39,46][i]:46+(i-4)*3),src=staticFile('native/12-calendar.png');
 return <>
  <NativeCrop src="native/12-calendar.png" x={65} y={148} w={1790} h={848} crop={{x:17,y:115,w:1375,h:651}}>
   {slots.map((r,i)=>{const cue=cues[i],land=cue+12,airAt=(t:number)=>1-ramp(t,cue,12,fly),air=airAt(q),patch=1-ramp(q,land,2),appear=ramp(q,cue,3),settle=q<land?1.06-.065*(1-air):mix(.995,1,ramp(q,land,4)),seam=ramp(q,land,5)*(1-ramp(q,land+2,6)),mb=q<land?Math.min(3.2,120*(airAt(q-.5)-airAt(q+.5))*.22):0,near=1-clamp(air/.5);return <React.Fragment key={r.index}>
    {patch>0?<div style={{position:'absolute',left:r.x-3,top:r.y-3,width:r.width+6,height:r.height+6,background:'#fff',opacity:patch}}><div style={{position:'absolute',left:3,top:4,width:r.width,height:r.height-8,border:`1px dashed ${T.line}`,borderRadius:8}}/></div>:null}
    {q>=cue&&q<land+4?<><div style={{position:'absolute',left:r.x+10,top:r.y+6,width:r.width-20,height:r.height-6,borderRadius:8,zIndex:2,opacity:near*(1-ramp(q,land,3)),boxShadow:`0 ${2+6*air}px ${6+18*air}px rgba(24,34,48,.12)`}}/><div style={{position:'absolute',left:r.x,top:r.y,width:r.width,height:r.height,opacity:appear,transform:`perspective(900px) translateY(${-120*air}px) rotateX(${16*air}deg) scale(${settle})`,transformOrigin:'50% 50%',zIndex:3,filter:mb>.25?`url(#row-motion-${i})`:undefined,boxShadow:`0 ${34*air}px ${64*air}px -${10*air}px rgba(24,34,48,${.24*air})`}}>{mb>.25?<svg width={0} height={0}><filter id={`row-motion-${i}`} x="-5%" y="-30%" width="110%" height="160%"><feGaussianBlur stdDeviation={`0 ${mb.toFixed(3)}`}/></filter></svg>:null}<Img src={staticFile(`native/slot-${String(r.index).padStart(2,'0')}.png`)} style={{width:r.width,height:r.height,borderRadius:8}}/></div></>:null}
    {seam>0?<div style={{position:'absolute',left:r.x+r.width*(1-ramp(q,land,5))*.5,top:r.y+r.height-2,width:r.width*ramp(q,land,5),height:2,background:accent,opacity:seam,zIndex:4}}/>:null}
   </React.Fragment>})}
  </NativeCrop>
  <div style={{position:'absolute',left:1110,top:57,opacity:ramp(q,75,12)}}>{note(primaryText,0,0,1,T.green)}</div>
 </>;
};

const Schedule:React.FC<ViewProps>=props=>{
 const {f,b,note,primaryText,secondaryText,accent}=props;
 const candidate0=b(146),endCandidates=b(162),accept0=b(142);
 const index=Math.max(0,Math.min(7,TRACE.filter((_,i)=>f>=b(146+i*2)).length-1));
 const move=ramp(f,b(146+index*2),15,smooth),previousIndex=Math.max(0,index-1),candidateX=mix(112+previousIndex*209,112+index*209,move);
 return <>
  {f<b(140)&&!props.hideCarry?<CarryToRules {...props} primaryText={CARRY.primaryText}/>:null}
  {f>=b(140)&&f<b(168)?<>
   <Txt x={115} y={123} size={38}>RMIT University</Txt><Txt x={1100} y={126} size={32} color={T.green}>1 / day · ≥7 days apart</Txt><Txt x={115} y={188} size={31} color={T.muted} weight={400}>23–30 October 2026 · 09:00 Australia/Sydney</Txt>
   <div style={{position:'absolute',left:115,top:315,width:1665,height:3,background:T.line}}/>
   {TRACE.map((t,i)=>{const tested=f>=b(147+i*2),reason=i===0?'Full 1/1':i<=2?'Weekend':i===7?'Accepted':`${i} < 7d`,active=f>=candidate0&&index===i;return <div key={t.date} style={{position:'absolute',left:112+i*209,top:281,width:180,height:322}}>
    <div style={{width:180,height:172,background:active?'#eaf2ff':'#fff',border:`1px solid ${active?accent:T.line}`,borderRadius:8,position:'relative'}}><Txt x={15} y={14} size={28} weight={400} color={T.muted}>{['Fri','Sat','Sun','Mon','Tue','Wed','Thu','Fri'][i]}</Txt><Txt x={15} y={56} size={60} color={tested&&i<7?T.muted:accent}>{23+i}</Txt></div>
    {tested?<div style={{position:'absolute',left:0,top:239,color:i===7?T.green:T.amber,fontSize:32,fontWeight:700,whiteSpace:'nowrap'}}>{i===7?'✓':'×'} {reason}</div>:null}
   </div>})}
   <Token id="TASK-001" x={112} y={440} color={T.green} opacity={ramp(f,b(140),18)}/>
   <div style={{opacity:1-ramp(f,candidate0-6,6)}}><Tag text="First slot accepted" x={112} y={520} f={f} start={accept0} color={T.green} size={32} typed={false}/></div>
   {f>=candidate0?<Token id="TASK-002" x={candidateX} y={610} color={index===7?T.green:accent}/>:null}
   {f>=endCandidates?<>
    <Line d="M188 678V704H1664V678" color={T.green} p={ramp(f,endCandidates,20)}/>
    <Tag text="7 days apart" x={827} y={692} f={f} start={endCandidates} color={T.green} size={29}/>
    <Txt x={116} y={820} size={33} color={accent} opacity={ramp(f,b(164),12)}>UNSW Sydney</Txt><Token id="TASK-007" x={482} y={819} opacity={ramp(f,b(164),12)}/><Txt x={678} y={827} size={32} weight={400} opacity={ramp(f,b(164),12)}>23 Oct · 09:00</Txt>
    <Tag text="Different institution → same minute allowed" x={880} y={916} f={f} start={b(165)} color={accent} size={28}/>
   </>:null}
  </>:null}
  {f>=b(168)&&f<b(174)?(()=>{const q=f-b(168),p=ramp(q,13,28,smooth);return <>
   <Txt x={130} y={192} size={38}>UNSW Sydney · continuing the same rules</Txt>
   <Token id="TASK-016" x={mix(196,1380,p)} y={565} color={p>.98?T.green:accent}/>
   <Paper x={155} y={338} w={450} h={168}><Txt x={27} y={27} size={42}>25 Dec</Txt><Txt x={27} y={92} size={29} color={T.amber}>× Christmas Day</Txt></Paper>
   <Paper x={730} y={338} w={475} h={168}><Txt x={27} y={27} size={42}>28 Dec</Txt><Txt x={27} y={92} size={27} color={T.amber}>× Boxing Day observed</Txt></Paper>
   <Paper x={1340} y={338} w={400} h={168}><Txt x={27} y={27} size={42} color={T.green}>29 Dec</Txt><Txt x={27} y={92} size={29} color={T.green}>✓ Valid send date</Txt></Paper>
   <Line d="M400 647H1550" p={p} color={T.green}/>
   <Txt x={160} y={761} size={30} color={T.muted} weight={400}>Weekends, holidays and the institution gap are checked before assignment.</Txt>
  </>})():null}
  {f>=b(174)?<CalendarEmbed {...props}/>:null}
 </>;
};

const Execute:React.FC<ViewProps>=({f,b,note,primaryText,secondaryText,accent})=>{
 const handoff=ramp(f,b(187),44,smooth),phases=['Open compose','Fill mail fields','Verify attachments','Confirm draft save'];
 const nativeFrom=b(200),nativeEnd=nativeFrom+170,selected=ramp(f,b(185),24,smooth),shown=Math.min(60,Math.floor(ramp(f,b(196),135,smooth)*60));
 return <>
  {f<nativeFrom?<>
   <Txt x={124} y={120} size={30} color={T.muted} weight={400}>Freeze the selected queue before execution</Txt>
   {DATA.slice(0,15).map((d,i)=>{const col=i%5,row=Math.floor(i/5);return <Token key={d.id} id={d.id} x={mix(130+col*154,170,selected)} y={mix(259+row*76,355+row*10,selected)} scale={mix(1,.82,selected)} opacity={1-selected*.94}/>})}
   <Paper x={mix(144,746,handoff)} y={326} w={620} h={296} style={{transform:`scale(${mix(1,.86,handoff)})`,transformOrigin:'0 0',borderColor:accent,zIndex:2}}>
    <Txt x={29} y={23} size={35} color={accent}>Frozen task packet · 60</Txt><Txt x={29} y={91} size={29} weight={400}>recipient · subject · body</Txt><Txt x={29} y={140} size={29} weight={400}>resolved file references · scheduleAt</Txt><Txt x={29} y={222} size={27} weight={400} color={T.muted}>NMDA_EXECUTE_DRAFT</Txt>
   </Paper>
   <Line d="M796 407H1560" p={handoff}/><Txt x={835} y={200} size={35} opacity={handoff}>Chrome runtime</Txt><Txt x={1400} y={290} size={35} opacity={handoff}>NetEase executor</Txt><Tag text="Provider simulated" x={1400} y={348} f={f} start={b(191)} color={T.muted} size={25}/>
   <div style={{position:'absolute',left:125,top:780,width:1650,height:3,background:T.line}}/>
   {phases.map((t,i)=>{const start=b(193+i*2),p=ramp(f,start,18,smooth);return <div key={t} style={{position:'absolute',left:128+i*424,top:715,opacity:ramp(f,b(192)+i*6,14)}}><div style={{position:'absolute',left:0,top:60,width:25,height:25,borderRadius:14,background:p>.98?T.green:'#fff',border:`2px solid ${p>.98?T.green:accent}`}}/><Txt x={0} y={0} size={30} color={p>.98?T.green:T.ink}>{t}</Txt><div style={{position:'absolute',left:0,top:108,color:T.green,opacity:p}}><Check size={34}/></div></div>})}
   {DATA.slice(0,6).map((d,i)=>{const u=ramp(f,b(193)+i*7,70,smooth);return <div key={d.id} style={{position:'absolute',left:mix(130,1735,u),top:755,width:36,height:49,background:u>.88?T.green:accent,borderRadius:4,opacity:inOut(f,b(193)+i*7,b(200)),transform:`rotate(${mix(-12,0,u)}deg)`}}/>})}
   <Txt x={910} y={613} size={27} weight={400} color={T.muted} opacity={ramp(f,b(194),12)}>Content → files → save acknowledgement</Txt>
  </>:null}
  {f>=nativeFrom?<>
   <div style={{position:'absolute',left:65,top:200,width:1790,height:735,overflow:'hidden',borderRadius:6}}><div style={{position:'absolute',width:1440,height:1000,transform:'translate(-22px,-560px) scale(1.3018)',transformOrigin:'0 0'}}>
    {f<nativeEnd?<Sequence from={nativeFrom} durationInFrames={170}><Html5Video src={staticFile('native/execution-progress.mp4')} muted style={{width:1440,height:1000}}/></Sequence>:<Img src={staticFile('native/14-complete.png')} style={{width:1440,height:1000}}/>}
   </div></div>
   <div style={{position:'absolute',left:106,top:33,display:'flex',gap:16,alignItems:'center'}}><Check size={38}/>{note(primaryText,52,0,ramp(f,b(206),15),T.green)}</div>
   <Txt x={105} y={972} size={28} color={T.muted} weight={400}>{secondaryText}</Txt><Txt x={1376} y={973} size={25} color={T.muted} weight={400}>Offline provider · timing compressed</Txt>
  </>:null}
 </>;
};

const Outro:React.FC<ViewProps>=({f,b,note,primaryText,secondaryText,accent})=>{
 const p=ramp(f,0,24,smooth),land=springAt(f,21),stats=ramp(f,48,15);
 return <>
  <div style={{position:'absolute',left:mix(140,488,p),top:mix(70,382,p),display:'flex',alignItems:'center',gap:38,transform:`scale(${mix(.82,1,p)})`,transformOrigin:'0 0'}}><Mark size={128}/><div style={{fontSize:91,fontWeight:800,letterSpacing:'-.03em',color:T.ink,transform:`translateY(${(1-land)*10}px)`}}>{primaryText}</div></div>
  <div style={{position:'absolute',left:650,top:584,width:790,height:4,background:accent,transformOrigin:'0 0',transform:`scaleX(${ramp(f,31,18)})`}}/>
  <Txt x={650} y={627} size={34} color={T.muted} weight={400} opacity={stats}>{secondaryText}</Txt>
  <Txt x={653} y={747} size={30} color={T.green} weight={700} opacity={stats}>60 verified draft saves · 211 file links · 15 send dates</Txt>
 </>;
};

const VIEWS:Record<string,React.FC<ViewProps>>={intro:Intro,classify:Classify,dedupe:Dedupe,overview:Overview,files:Files,schedule:Schedule,execute:Execute,outro:Outro};
export const ProcessScene:React.FC<SceneProps>=({kind='intro',duration=120,primaryText='',secondaryText='',accent=T.accent,fontSize=42,labelX=0,labelY=0,hideCarry=false})=>{
 const f=useCurrentFrame(),shot=SHOTS.find(s=>s.id===kind)!,b=(n:number)=>beatF(n)-shot.from,View=VIEWS[kind]||Intro;
 const note=(text:string,x:number,y:number,opacity=1,color=accent)=><Txt x={x+labelX} y={y+labelY} size={fontSize} color={color} opacity={opacity}>{text}</Txt>;
 return <AbsoluteFill style={{background:T.bg,fontFamily:'Film',color:T.ink,overflow:'hidden'}}><FontStyles/><View f={f} b={b} note={note} primaryText={primaryText} secondaryText={secondaryText} accent={accent} hideCarry={hideCarry}/><Scope opacity={1-ramp(f,duration-5,5)}/></AbsoluteFill>;
};
export const CarryTransition:React.FC<SceneProps>=({duration=CARRY.duration,primaryText=CARRY.primaryText,secondaryText=CARRY.secondaryText,accent=T.accent,fontSize=42,labelX=0,labelY=0})=>{
 const f=useCurrentFrame(),b=(n:number)=>beatF(n)-CARRY.from;
 const note=(text:string,x:number,y:number,opacity=1,color=accent)=><Txt x={x+labelX} y={y+labelY} size={fontSize} color={color} opacity={opacity}>{text}</Txt>;
 return <AbsoluteFill style={{background:T.bg,fontFamily:'Film',overflow:'hidden'}}><FontStyles/><CarryToRules f={Math.min(f,duration-1)} b={b} note={note} primaryText={primaryText} secondaryText={secondaryText} accent={accent}/><Scope opacity={1}/></AbsoluteFill>;
};
