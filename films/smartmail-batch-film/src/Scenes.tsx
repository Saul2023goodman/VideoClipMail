import React from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame} from 'remotion';
import DATA from './demo-data.json';
import RECORDED from './recorded-data.json';
import {Native} from './Native';
import {beatF,SHOTS,TOKENS as T} from './timeline';
import {BrandMark,Check,Label,PaperIcon,Path,TaskToken,Text,Texture,clamp,landEase,mix,pointAt,ramp} from './motion';

const bp=(f:number,b:number,n:number)=>ramp(f,beatF(b),Math.max(1,beatF(b+n)-beatF(b)));
const tasks=DATA.map((d,i)=>({...d,index:i,short:d.id.slice(-3)}));
const paperNames=['CV','Portfolio','Research_Proposal','Writing_Sample'];
const fileLabels=['CV','Portfolio','Proposal','Writing sample'];
const fileCounts=[60,60,59,32];
const isFile=(d:typeof tasks[number],j:number)=>d.attachments.some(a=>a===`Student_001_${paperNames[j]}.pdf`);
const enter=(f:number,b0:number)=>bp(f,b0,.8);

const Input:React.FC<{f:number}>=({f})=>{
 const open=bp(f,0,6),spread=bp(f,6,5),gather=bp(f,12,2),paperScale=mix(1,.52,spread)*(1-.76*gather);
 const paperX=mix(640,80,spread)+600*gather,paperY=mix(120,230,spread)-120*gather;
 return <>
  <Native frame={f} opacity={mix(.16,1,gather)} blur={mix(3,0,gather)} cursor={gather>.5}/>
  <div style={{position:'absolute',inset:0,background:T.bg,opacity:(1-gather)*.58}}/>
  <div style={{position:'absolute',left:paperX,top:paperY,width:550,height:650,opacity:open*(1-gather),transform:`perspective(1500px) rotateY(${mix(-13,0,open)}deg) rotateZ(${mix(-3,0,spread)}deg) scale(${paperScale})`,transformOrigin:'0 0'}}>
   <div style={{position:'absolute',left:16,top:20,width:550,height:650,borderRadius:16,background:'#e7edf5',boxShadow:'0 26px 65px #18223022'}}/>
   <Img src={staticFile('native/paper-CV.png')} style={{position:'relative',zIndex:1,width:550,height:650,objectFit:'cover',objectPosition:'top',borderRadius:16,boxShadow:'0 12px 32px #18223025'}}/>
  </div>
  <div style={{position:'absolute',left:130,top:145,width:450,opacity:open*(1-bp(f,5.5,.5))}}>
   <div style={{fontSize:34,color:T.muted,lineHeight:1.4}}>2027 practice-led<br/>PhD outreach</div>
   <div style={{fontSize:70,fontWeight:800,lineHeight:1.25,marginTop:18}}>Student 001</div>
  </div>
  {tasks.map((d,i)=>{
   const cue=beatF(6)+(beatF(8.5)-beatF(6))*(1-Math.pow(1-i/60,2.2));
   const u=ramp(f,cue,20,landEase),to={x:390+(i%10)*141,y:214+Math.floor(i/10)*91};
   const p=pointAt(u,740,400,to.x,to.y,90),end=pointAt(gather,p.x,p.y,960,310,20);
   return <TaskToken key={d.id} id={d.short} x={end.x} y={end.y} w={126} size={32} scale={(.85+.15*u)*(1-.92*gather)} opacity={clamp(u)*(1-gather)} />;
  })}
  <Text x={400} y={145} size={46} opacity={spread*(1-gather)}>60 tasks · 11 universities</Text>
  <Label x={400} y={790}>Prepared demo input · numbered recipients</Label>
 </>;
};

const Classification:React.FC<{f:number}>=({f})=><>
 <Native frame={f}/>
 <div style={{position:'absolute',left:78,top:112,display:'flex',gap:20,opacity:enter(f,16),transform:`translateY(${20*(1-enter(f,16))}px)`}}>
  {[['CSV','60 mail'],['XLSX','60 contacts'],['PDF','4 source files']].map(([format,label],i)=><div key={format} style={{padding:'15px 24px',borderRadius:14,background:'#ffffffed',border:`1px solid ${T.line}`,boxShadow:'0 5px 18px #18223012',color:T.ink,fontSize:34}}><b style={{color:T.accent,marginRight:16}}>{format}</b>{label}</div>)}
 </div>
</>;

const Schema:React.FC<{f:number}>=({f})=>{
 const fields=[['Recipient','recipients'],['Subject','subject'],['Body','body'],['Attachment','attachments'],['Institution','school']];
 const disappear=1-bp(f,46,2);
 return <>
  <Native frame={f} opacity={.17} blur={2} cursor={false}/>
  <div style={{position:'absolute',inset:'100px 60px 165px',background:'#f4f6f8',borderRadius:24,opacity:disappear}}>
   <Label x={80} y={22}>SOURCE HEADERS</Label><Label x={660} y={22}>NORMALIZED FIELDS</Label>
   {fields.map(([raw,norm],i)=>{
    const u=bp(f,33+i*.65,1.4);return <React.Fragment key={raw}>
     <Text x={80} y={105+i*108} size={42} opacity={enter(f,32)}>{raw}</Text>
     <Path d={`M400 ${134+i*108} C510 ${134+i*108},510 ${134+i*108},610 ${134+i*108}`} progress={u} opacity={.6}/>
     <div style={{position:'absolute',left:mix(990,650,u),top:95+i*108,padding:'10px 28px',borderRadius:12,border:`2px solid ${T.accent}30`,background:'#fff',fontFamily:'monospace',fontSize:38,color:T.accent,opacity:u}}>{norm}</div>
    </React.Fragment>;
   })}
   <Text x={1090} y={54} size={104} opacity={bp(f,38,2)}>60</Text>
   <Label x={1090} y={190}>task records</Label>
   {tasks.map((d,i)=>{
    const u=bp(f,39+i/15,1.2),x=1070+(i%5)*105,y=280+Math.floor(i/5)*29;
    return <div key={d.id} style={{position:'absolute',left:mix(840,x,u),top:mix(425,y,u),width:86,height:18,borderRadius:5,background:T.accent,opacity:.1+.65*clamp(u),transform:`scaleX(${u})`,transformOrigin:'0 0'}}/>;
   })}
  </div>
 </>;
};

const Matching:React.FC<{f:number}>=({f})=>{
 const p=enter(f,48),resolve=bp(f,55,5),fade=1-bp(f,62,2);
 return <>
  <Native frame={f} opacity={mix(1,.40,p*.8)}/>
  <div style={{position:'absolute',left:210,top:240,width:1510,height:490,background:'#ffffff',border:`1px solid ${T.line}`,borderRadius:22,boxShadow:'0 20px 60px #18223018',opacity:p*fade,transform:`translateY(${(1-p)*60}px)`}}>
   <Label x={54} y={26}>MAIL RECIPIENT</Label><Label x={970} y={26}>REFERENCE ROSTER</Label>
   {[0,1,6,7].map((n,i)=>{
    const d=tasks[n],u=bp(f,49+i*1.1,1.2),y=108+i*81;
    return <React.Fragment key={d.id}>
     <Text x={54} y={y} size={36}>{d.email}</Text>
     <Path d={`M625 ${y+30} C750 ${y+30},750 ${y+30},880 ${y+30}`} progress={u}/>
     <div style={{position:'absolute',left:860,top:y+10,opacity:u}}><Check/></div>
     <Text x={970} y={y} size={38} opacity={u}>{d.name}</Text>
    </React.Fragment>;
   })}
  </div>
  <div style={{position:'absolute',left:1220,top:115,display:'flex',alignItems:'baseline',gap:20,opacity:p*fade}}><b style={{fontSize:86,color:T.green}}>{Math.round(60*bp(f,49,5))}/60</b><span style={{fontSize:34,color:T.muted}}>matched</span></div>
  <div style={{position:'absolute',left:250,top:770,fontSize:36,color:T.ink,opacity:resolve*fade}}>Different recipient identities → keep each enquiry</div>
 </>;
};

const Review:React.FC<{f:number}>=({f})=>{
 const n=f<beatF(69)?1:f<beatF(73)?7:24,p=enter(f,64);
 return <>
  <Native frame={f}/>
  <div style={{position:'absolute',left:84,top:116,display:'flex',alignItems:'center',gap:18,padding:'12px 24px',borderRadius:16,background:'#ffffffef',border:`1px solid ${T.line}`,opacity:p}}><span style={{fontSize:34,color:T.muted}}>Inspecting</span><b style={{fontSize:48,color:T.accent}}>{String(n).padStart(2,'0')} / 60</b></div>
  <div style={{position:'absolute',left:94,top:824,display:'flex',gap:4,opacity:1-bp(f,77,2)}}>{tasks.map((d,i)=><div key={d.id} style={{width:25,height:i===n-1?24:10,background:i===n-1?T.accent:'#b8cdeb',borderRadius:4,transform:`translateY(${i===n-1?-7:0}px)`}}/>)}</div>
 </>;
};

const Files:React.FC<{f:number}>=({f})=>{
 const open=bp(f,88,1.2),fade=1-bp(f,94.5,1.5);
 let linked=0;
 tasks.forEach((d,i)=>paperNames.forEach((_,j)=>{if(isFile(d,j)&&f>=beatF(89+j*.55+i/36))linked++;}));
 return <>
  <Native frame={f}/>
  <div style={{position:'absolute',left:64,top:118,width:1790,height:717,borderRadius:22,background:'#f4f6f8',boxShadow:'0 20px 70px #18223018',border:`1px solid ${T.line}`,opacity:open*fade,transform:`translateX(${(1-open)*240}px)`}}>
   <Label x={55} y={30}>PER-MAIL FILE REQUIREMENTS</Label>
   <Text x={1260} y={16} size={90} color={T.accent}>{linked}</Text><Label x={1450} y={62}>/ 211 links</Label>
   {paperNames.map((name,j)=><React.Fragment key={name}>
    <div style={{position:'absolute',left:65,top:155+j*127,display:'flex',alignItems:'center',gap:22}}><PaperIcon/><div><div style={{fontSize:40,fontWeight:700}}>{fileLabels[j]}</div><div style={{fontSize:32,color:T.muted}}>{fileCounts[j]} mail</div></div></div>
    {tasks.map((d,i)=>{
     const valid=isFile(d,j),u=valid?bp(f,89+j*.55+i/36,.55):0,x=420+i*21.5;
     return <div key={d.id} style={{position:'absolute',left:x,top:181+j*127,width:15,height:46,borderRadius:4,background:valid?T.accent:'#e1e6ed',opacity:valid?.17+.83*u:.48,transform:`translateY(${valid?-95*(1-u):0}px) scaleY(${valid?.75+.25*u:1})`}}/>;
    })}
   </React.Fragment>)}
   <Label x={420} y={651}>TASK-001</Label><Label x={1550} y={651}>TASK-060</Label>
  </div>
 </>;
};

const institutionNames=[...new Set(tasks.map(t=>t.institution))].sort((a,b)=>tasks.filter(t=>t.institution===b).length-tasks.filter(t=>t.institution===a).length);
const shortSchool=(n:string)=>n.replace('University of Melbourne','Melbourne').replace('Australian National University','ANU').replace('Western Sydney University','Western Sydney').replace('University of Tasmania','Tasmania').replace(' University','');
const calendarTargets=tasks.map(d=>{
 const same=tasks.filter(v=>v.institution===d.institution),col=same.findIndex(v=>v.id===d.id),row=institutionNames.indexOf(d.institution);
 return {...d,col,row,x:435+col*88,y:242+row*52};
});
const Schedule:React.FC<{f:number}>=({f})=>{
 const open=bp(f,118,1.2),close=1-bp(f,126,2);
 return <>
  <Native frame={f}/>
  {f<beatF(117)?<div style={{position:'absolute',right:90,top:130,padding:'15px 26px',background:'#ffffffef',border:`1px solid ${T.line}`,borderRadius:16,fontSize:40,color:T.accent,opacity:enter(f,96)}}>{f<beatF(104)?'09:00 · Australia / Sydney':f<beatF(112)?'1 enquiry / institution / day':'≥ 7 days between colleagues'}</div>:null}
  <div style={{position:'absolute',left:66,top:118,width:1785,height:704,borderRadius:20,background:'#ffffff',border:`1px solid ${T.line}`,boxShadow:'0 20px 55px #18223016',opacity:open*close,transform:`translateY(${90*(1-open)}px)`}}>
   <Label x={42} y={28}>11 INSTITUTION LANES</Label><Label x={995} y={28}>15 WEEKLY DATES · 22 OCT → 28 JAN</Label>
   {Array.from({length:15},(_,i)=><Text key={i} x={436+i*88} y={72} size={32} color={i===0?T.accent:T.muted}>{'W'+String(i+1)}</Text>)}
   {institutionNames.map((name,i)=><React.Fragment key={name}><Text x={42} y={245+i*52-118} size={32}>{shortSchool(name)}</Text><div style={{position:'absolute',left:400,top:282+i*52-118,width:1320,height:1,background:T.line}}/></React.Fragment>)}
   {calendarTargets.map((d,i)=>{
    const u=bp(f,119+Math.pow(i/60,.6)*4,1),x=mix(435+(i%11)*110,d.x,u),y=mix(470,d.y,u);
    return <div key={d.id} style={{position:'absolute',left:x,top:y-118,width:72,height:38,background:T.accent,borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,fontWeight:700,color:'#fff',opacity:clamp(u),transform:`scale(${mix(.88,1,u)})`}}>{d.short}</div>;
   })}
  </div>
 </>;
};

const Execute:React.FC<{f:number}>=({f})=>{
 const open=bp(f,132,.9),fade=1-bp(f,150,2),done=RECORDED.saved.filter(v=>v.frame<=f).length;
 const stage=clamp((f-beatF(134))/(beatF(143)-beatF(134)))*3;
 const stations=[280,720,1150,1600],x=stations[Math.floor(stage)]+(stations[Math.min(3,Math.floor(stage)+1)]-stations[Math.floor(stage)])*(stage%1),y=625-35*Math.sin(Math.PI*(stage%1));
 return <>
  <Native frame={f}/>
  <div style={{position:'absolute',inset:'108px 60px 164px',background:'#f4f6f8',borderRadius:24,border:`1px solid ${T.line}`,opacity:open*fade,transform:`translateY(${(1-open)*65}px)`}}>
   <Label x={48} y={22}>FROZEN QUEUE · ONE TRANSACTION AT A TIME</Label>
   <Text x={1460} y={10} size={85} color={T.green}>{done}/60</Text>
   {tasks.map((d,i)=>{
    const saved=RECORDED.saved.find(v=>v.id===d.id),u=saved?clamp((f-saved.frame)/9):0;
    return <div key={d.id} style={{position:'absolute',left:65+(i%15)*113,top:147+Math.floor(i/15)*69,width:93,height:49,borderRadius:10,border:`1.5px solid ${u>.5?T.green:T.line}`,background:u>.5?'#eaf6f1':'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,color:u>.5?T.green:T.ink,fontWeight:700,transform:`scale(${1+.03*Math.sin(Math.PI*u)})`}}>{d.short}{u>.5?<Check size={20}/>:null}</div>;
   })}
   <Path d="M280 541 C520 541,520 541,720 541 S940 541,1150 541 S1380 541,1600 541" progress={bp(f,133,2)} width={5} color="#abc4e9"/>
   {['APP','CHROME RUNTIME','MAIL EXECUTOR','DRAFT SAVED'].map((n,i)=><React.Fragment key={n}>
    <div style={{position:'absolute',left:stations[i]-35,top:506,width:70,height:70,background:i===3?'#e6f5ee':'#eaf2ff',border:`2px solid ${i===3?T.green:T.accent}55`,borderRadius:20,display:'flex',alignItems:'center',justifyContent:'center'}}>{i===3?<Check size={34}/>:<div style={{width:18,height:18,borderRadius:6,background:T.accent}}/>}</div>
    <Text x={stations[i]-(i===1?146:110)} y={605} size={34}>{n}</Text>
   </React.Fragment>)}
   <TaskToken id="TASK-007" x={x-90} y={y-108} w={180} size={32} state={stage>=3?'done':'ready'}/>
   <Label x={45} y={666}>Provider responses simulated · timing compressed</Label>
  </div>
 </>;
};

const Replace:React.FC<{f:number}>=({f})=>{
 const open=bp(f,161,.8),fade=1-bp(f,177,2),phase=clamp((f-beatF(162))/(beatF(168)-beatF(162)))*4;
 const nodes=[170,520,870,1220,1570];
 return <>
  <Native frame={f}/>
  <div style={{position:'absolute',left:70,top:128,width:1780,height:690,borderRadius:22,background:'#ffffff',border:`1px solid ${T.line}`,boxShadow:'0 20px 70px #18223018',opacity:open*fade,transform:`translateY(${50*(1-open)}px)`}}>
   <Label x={42} y={24}>59 DRAFTS SHARE THIS PROPOSAL</Label>
   <div style={{position:'absolute',left:42,top:105,display:'flex',gap:25,alignItems:'center'}}><PaperIcon/><Text x={72} y={5} size={38}>Proposal.pdf → Proposal_v2.pdf</Text></div>
   <Path d="M170 341H1570" progress={bp(f,162,6)} width={6} color="#abc4e9"/>
   {['READ ORIGINAL','CLONE DRAFT','REPLACE FILE','VERIFY','SWAP'].map((n,i)=><React.Fragment key={n}>
    <div style={{position:'absolute',left:nodes[i]-50,top:291,width:100,height:100,borderRadius:24,border:`2px solid ${phase>=i?T.accent:T.line}`,background:phase>=i?'#eaf2ff':'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:44,fontWeight:800,color:T.accent}}>{phase>i+.7?<Check size={44}/>:i+1}</div>
    <Text x={nodes[i]-130} y={420} size={32}>{n}</Text>
   </React.Fragment>)}
   <div style={{position:'absolute',left:mix(nodes[Math.floor(phase)],nodes[Math.min(4,Math.floor(phase)+1)],phase%1)-18,top:323,width:36,height:36,background:T.accent,border:'7px solid #fff',boxShadow:'0 0 0 2px #1769e030',borderRadius:12}}/>
   <div style={{position:'absolute',left:90,top:551,display:'flex',gap:55}}>{['Recipients','Subject','Body','Scheduled time'].map((n,i)=><div key={n} style={{display:'flex',gap:16,alignItems:'center',fontSize:36,opacity:bp(f,168+i*1.25,1)}}><Check/>{n}</div>)}</div>
   <Label x={90} y={620}>Compare the replacement before retiring the original</Label>
  </div>
 </>;
};

const Monitor:React.FC<{f:number}>=({f})=>{
 const open=bp(f,188,1),fade=1-bp(f,198,2),split=bp(f,190,5);
 return <>
  <Native frame={f}/>
  <div style={{position:'absolute',left:66,top:125,width:1788,height:698,borderRadius:22,background:'#f4f6f8',border:`1px solid ${T.line}`,boxShadow:'0 20px 55px #18223018',opacity:open*fade,transform:`translateX(${120*(1-open)}px)`}}>
   <Label x={44} y={22}>LATER · DEMO MAILBOX HISTORY</Label>
   <Text x={85} y={115} size={90}>60</Text><Label x={88} y={225}>contacts reached</Label>
   <Path d="M300 360C600 360 740 240 1180 225" progress={split} color={T.green} width={4}/>
   <Path d="M300 360C600 360 740 545 1180 545" progress={split} color={T.accent} width={4}/>
   <Text x={1240} y={80} size={100} color={T.green}>8</Text><Text x={1370} y={117} size={40}>Human replies</Text><Label x={1242} y={228}>Manual handling</Label>
   <Text x={1240} y={430} size={100} color={T.accent}>52</Text><Text x={1400} y={469} size={40}>No valid reply</Text><Label x={1242} y={578}>Due for follow-up</Label>
   {tasks.map((d,i)=>{
    const u=bp(f,190+Math.pow(i/60,.65)*4,1.0),replied=i<8;
    const start={x:370+(i%10)*39,y:205+Math.floor(i/10)*58},end=replied?{x:930+(i%4)*61,y:178+Math.floor(i/4)*55}:{x:845+((i-8)%8)*39,y:442+Math.floor((i-8)/8)*24};
    const p=pointAt(u,start.x,start.y,end.x,end.y,replied?80:-30);
    return <div key={d.id} style={{position:'absolute',left:p.x,top:p.y,width:replied?44:25,height:replied?35:14,borderRadius:5,background:replied?T.green:T.accent,opacity:.9}}/>;
   })}
  </div>
 </>;
};

const Outro:React.FC<{f:number;start:number;duration:number}>=({f,start,duration})=>{
 const q=f-start,recede=ramp(q,42,8),crane=ramp(q,0,40),push=ramp(q,36,duration-36),brand=SHOTS[10].from;
 const pieces=[
  ['native/outro-import.png',960,160,680,134,0,-180,0],['native/outro-roster.png',265,325,430,128,-440,-190,-4],
  ['native/outro-review.png',1640,325,430,188,480,-140,4],['native/outro-files.png',300,745,460,214,-420,260,3],
  ['native/outro-schedule.png',1620,750,430,228,440,220,-3],['native/outro-replace.png',940,826,320,112,0,340,0],
  ['native/outro-monitor.png',910,290,620,172,0,-250,-2],['native/outro-execute.png',970,970,680,74,100,260,2],
 ] as const;
 return <>
  <Native frame={f} opacity={.4} blur={ramp(q,0,24)*12} cursor={false}/>
  <div style={{position:'absolute',inset:0,background:'radial-gradient(1000px 600px at 50% 45%,#f4f6f8ec,#f4f6f8a8)',opacity:ramp(q,0,24)}}/>
  <div style={{position:'absolute',inset:0,transform:`perspective(1400px) rotateX(${4*(1-crane)}deg) scale(${1.06-.06*crane+.035*push})`,transformOrigin:'50% 45%'}}>
   {pieces.map(([src,cx,cy,w,h,dx,dy,rot],i)=>{
    const cue=4+i*3,u=ramp(q,cue,12,landEase),air=Math.max(0,1-u),press=q>=cue+9&&q<cue+16?Math.sin(Math.PI*clamp((q-cue-9)/7)):0;
    return <div key={src} style={{position:'absolute',left:cx-w/2+dx*(1-u),top:cy-h/2+dy*(1-u),width:w,height:h,borderRadius:14,overflow:'hidden',background:'#fff',border:`1px solid ${T.line}`,boxShadow:`0 ${10+26*air-5*press}px ${24+46*air-12*press}px #18223025`,opacity:clamp(u)*(1-.12*recede),transform:`rotate(${rot*(2-u)}deg) scale(${(1.12-.12*u)*(1-.015*press)})`,filter:air>.01?`blur(${Math.min(3,air*4)}px)`:undefined}}><Img src={staticFile(src)} style={{width:w,height:h,objectFit:'contain',objectPosition:'left top'}}/></div>;
   })}
  </div>
  <div style={{position:'absolute',left:350,top:375,right:350,textAlign:'center',padding:'35px 30px',background:'#f4f6f8e8',borderRadius:26,boxShadow:'0 0 70px 30px #f4f6f8db',opacity:ramp(q,38,8)}}>
   <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:28}}><BrandMark size={108}/><div style={{fontSize:113,fontWeight:800,letterSpacing:'-.045em',display:'flex'}}>{'SmartMail Ops'.split('').map((c,i)=>{
    const u=ramp(q,42+i*1.8,8);return <span key={i} style={{display:'inline-block',whiteSpace:'pre',opacity:u,transform:`translateY(${28*(1-u)}px) scale(${1.35-.35*u})`,filter:`blur(${8*(1-u)}px)`}}>{c}</span>;
   })}</div></div>
   <div style={{margin:'28px auto',width:260,height:5,borderRadius:3,background:T.accent,transform:`scaleX(${ramp(q,58,12)})`}}/>
   <div style={{fontSize:40,color:T.muted,opacity:ramp(q,72,12)}}>Batch preparation. Individual control.</div>
  </div>
 </>;
};

export type SceneProps={kind?:string;startFrame?:number;duration?:number;accent?:string;campaign?:string};
export const BatchScene:React.FC<SceneProps>=({kind='input',startFrame=0,duration=240,campaign='Student 001'})=>{
 const f=useCurrentFrame()+startFrame;
 const scenes:Record<string,React.ReactNode>={input:<Input f={f}/>,classify:<Classification f={f}/>,schema:<Schema f={f}/>,match:<Matching f={f}/>,review:<Review f={f}/>,files:<Files f={f}/>,schedule:<Schedule f={f}/>,execute:<Execute f={f}/>,replace:<Replace f={f}/>,monitor:<Monitor f={f}/>,outro:<Outro f={f} start={startFrame} duration={duration}/>};
 return <AbsoluteFill style={{background:T.bg,fontFamily:'Film',color:T.ink}}>{scenes[kind]||scenes.input}</AbsoluteFill>;
};
export const Header:React.FC<{campaign?:string;accent?:string}>=({campaign='Student 001',accent=T.accent})=><>
 <div style={{position:'absolute',fontFamily:'Film',left:0,right:0,top:0,height:94,background:'#f4f6f8',borderBottom:`1px solid ${T.line}`,display:'flex',alignItems:'center',padding:'0 64px',boxSizing:'border-box',gap:18}}>
  <BrandMark size={48}/><b style={{fontSize:36}}>SmartMail Ops</b><div style={{width:1,height:38,background:T.line,margin:'0 16px'}}/><span style={{fontSize:32,color:T.muted}}>{campaign} · 60 tasks · 11 institutions</span><span style={{marginLeft:'auto',fontSize:32,color:accent}}>OFFLINE DEMO</span>
 </div>
</>;
