import React from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame,interpolate,Easing} from 'remotion';
import {PageCam} from './lib/PageCam';
import layout from '../public/textures/layout.json';

export const TOKENS={paper:'#f4f6f8',ink:'#182230',blue:'#1769e0',navy:'#091a32',muted:'#667085',border:'#dfe5ec'};
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const out=Easing.bezier(.16,1,.3,1);
const ramp=(f:number,a:number,b:number,ease=out)=>interpolate(f,[a,b],[0,1],{...clamp,easing:ease});
const smooth=(x:number)=>{const t=Math.max(0,Math.min(1,x));return t*t*t*(t*(t*6-15)+10);};
export type SceneProps={headline?:string;kicker?:string;accent?:string;titleSize?:number;duration?:number;annotation?:string};
export const FontStyles:React.FC=()=> <style>{`
 @font-face{font-family:Film;src:url('${staticFile('fonts/OpenSans-Regular.ttf')}');font-weight:400}
 @font-face{font-family:Film;src:url('${staticFile('fonts/OpenSans-Bold.ttf')}');font-weight:700}
 @font-face{font-family:Film;src:url('${staticFile('fonts/OpenSans-ExtraBold.ttf')}');font-weight:800}
 *{box-sizing:border-box} 
`}</style>;
const Stage:React.FC<{dark?:boolean;children:React.ReactNode;accent?:string}>=({dark=false,children})=><AbsoluteFill style={{background:dark?'radial-gradient(ellipse at 72% 45%,#164884 0,#0c2343 33%,#091a32 72%)':TOKENS.paper,color:dark?'#fff':TOKENS.ink,fontFamily:'Film,Arial,sans-serif',overflow:'hidden'}}><FontStyles/>{children}</AbsoluteFill>;
const Header:React.FC<{text:string;dark?:boolean;accent?:string}>=({text,dark,accent=TOKENS.blue})=><div style={{position:'absolute',left:96,top:70,fontSize:32,letterSpacing:'.13em',fontWeight:700,color:dark?'#8fbbff':accent,zIndex:10}}>{text.toUpperCase()}</div>;
const Heading:React.FC<{text:string;size?:number;top?:number;left?:number;width?:number;frame?:number}>=({text,size=90,top=255,left=96,width=680,frame=30})=><div style={{position:'absolute',left,top,width,fontSize:size,fontWeight:800,lineHeight:1.13,letterSpacing:'-.05em',whiteSpace:'pre-line',opacity:ramp(frame,4,23),transform:`translateY(${24*(1-ramp(frame,4,28))}px)`,zIndex:10}}>{text}</div>;
type CropProps={file:string;x:number;y:number;w:number;h:number;scale:number;left:number;top:number;radius?:number;shadow?:boolean};
const Crop:React.FC<CropProps>=({file,x,y,w,h,scale,left,top,radius=12,shadow=true})=><div style={{position:'absolute',left,top,width:w*scale,height:h*scale,overflow:'hidden',borderRadius:radius,background:'#fff',boxShadow:shadow?'0 26px 60px #18223020,0 0 0 1px #dfe5ec':undefined}}><Img src={staticFile('textures/'+file)} style={{position:'absolute',width:1920*scale,height:1080*scale,maxWidth:'none',left:-x*scale,top:-y*scale}}/></div>;
const Cutout:React.FC<{file:string;left:number;top:number;width:number;radius?:number;style?:React.CSSProperties}>=({file,left,top,width,radius=12,style})=><Img src={staticFile('textures/'+file)} style={{position:'absolute',left,top,width,borderRadius:radius,boxShadow:'0 22px 60px #18223024',...style}}/>;
// Crop a native element capture without changing its original type or layout.
const ElementCrop:React.FC<{file:string;nativeWidth:number;nativeHeight:number;height:number;left:number;top:number;width:number}>=({file,nativeWidth,nativeHeight,height,left,top,width})=><div style={{position:'absolute',left,top,width,height:height*width/nativeWidth,overflow:'hidden',borderRadius:16,background:'#fff',boxShadow:'0 26px 60px #18223020,0 0 0 1px #dfe5ec'}}><Img src={staticFile('textures/'+file)} style={{width,height:nativeHeight*width/nativeWidth,maxWidth:'none',display:'block'}}/></div>;

export const Signal:React.FC<SceneProps>=({headline='The next\nconversation\nstarts here.',kicker='SmartMail Ops / Chaos, choreographed',accent=TOKENS.blue,titleSize=102})=>{
 const f=useCurrentFrame(),arrive=ramp(f,0,46),open=ramp(f,30,91),settle=ramp(f,91,116);
 return <Stage dark><Header text={kicker} dark/><Heading text={headline} size={titleSize} top={262} width={855} frame={f}/>
  <div style={{position:'absolute',left:1090,top:310,width:630,height:420,perspective:1500,transform:`translateY(${70*(1-arrive)-20*open+20*settle}px)`}}>
   <div style={{position:'absolute',inset:0,background:'#fff',borderRadius:22,transformStyle:'preserve-3d',transform:`rotateY(${-18+12*arrive}deg) rotateX(${7-4*settle}deg) rotateZ(${-8+5*settle}deg) scale(${.86+.14*arrive})`,boxShadow:'0 70px 90px #0006,inset 0 0 0 2px #ffffff66'}}>
    <div style={{position:'absolute',left:42,right:42,top:-80*open,height:370,background:'#fff',borderRadius:14,boxShadow:'0 -10px 30px #18223018',transform:`translateZ(2px)`,overflow:'hidden'}}><div style={{width:80,height:8,background:accent,margin:'45px 42px 34px'}}/>{[290,385,330,210].map((w,i)=><div key={i} style={{height:9,width:w,background:i===0?'#182230':'#dfe5ec',margin:'20px 42px',borderRadius:5}}/>)}</div>
    <div style={{position:'absolute',inset:0,background:'#eaf2ff',clipPath:'polygon(0 0,100% 0,50% 62%)',transformOrigin:'50% 0',transform:`rotateX(${-40*open+36*settle}deg) translateZ(4px)`}}/>
    <div style={{position:'absolute',inset:0,borderRadius:22,background:'#fff',clipPath:'polygon(0 100%,0 22%,50% 65%,100% 22%,100% 100%)',transform:'translateZ(8px)'}}/>
    <div style={{position:'absolute',left:267,top:215,width:96,height:96,borderRadius:25,background:accent,transform:'translateZ(9px)',display:'grid',placeItems:'center'}}><svg width="54" height="54" viewBox="0 0 54 54"><path d="M12 39L40 12M17 12h23v23" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
   </div>
  </div>
 </Stage>;
};

// row-embed / row-embed: real file rows and real inspector fields; exact cues,
// accelerating 12f descent, 16-degree flattening, press and clipped seam.
export const Sources:React.FC<SceneProps>=({headline='Sources,\nunderstood.',kicker='01 / Prepare mail',accent=TOKENS.blue,titleSize=98})=>{
 const f=useCurrentFrame();
 const rows=[...layout.sources.elements.filter(r=>r.key==='file'),...layout.sources.elements.filter(r=>r.key==='field').slice(0,2)].slice(0,5);
 const cues=[12,22,31,39,46],flyEase=Easing.bezier(.5,0,.8,.75);
 return <Stage><Header text={kicker} accent={accent}/><Heading text={headline} size={titleSize} frame={f}/>
  <div style={{position:'absolute',left:96,top:532,fontSize:32,fontWeight:700,letterSpacing:'.08em',color:accent,opacity:ramp(f,58,70)}}>CONTACT CROSS-CHECK</div>
  <div style={{opacity:ramp(f,58,70)}}><Crop file="focused/dedupe-full.png" x={264} y={501} w={203} h={65} scale={3} left={96} top={588}/></div>
  <div style={{position:'absolute',left:780,top:250,width:1110,height:570,overflow:'visible',transform:`translateY(${-12*ramp(f,0,68)}px)`}}>
   <Crop file="sources-full.png" x={280} y={244} w={1245} h={300} scale={.83} left={0} top={0}/>
   <Crop file="sources-full.png" x={1534} y={480} w={350} h={220} scale={1.5} left={490} top={300}/>
   {rows.map((r,i)=>{
    const sourceField=r.key==='field',scale=sourceField?1.5:.83;
    const left=sourceField?490+(r.x-1534)*scale:(r.x-280)*scale;
    const top=sourceField?300+(r.y-480)*scale:(r.y-244)*scale;
    const cue=cues[i],land=cue+12,air=1-ramp(f,cue,land,flyEase);
    const press=f<land?1.06-.065*(1-air):.995+.005*ramp(f,land,land+4,Easing.out(Easing.quad));
    const seam=ramp(f,land,land+5),seamOpacity=1-ramp(f,land,land+8);
    return <React.Fragment key={i}>
     {f<land+2?<div style={{position:'absolute',left,top,width:r.w*scale,height:r.h*scale,background:'#fff',opacity:1-ramp(f,land,land+2),border:'1px dashed #dfe5ec',borderRadius:8}}/>:null}
     {f>=cue&&f<land+4?<div style={{position:'absolute',left,top,width:r.w*scale,height:r.h*scale,transform:`perspective(900px) translateY(${-120*air}px) rotateX(${16*air}deg) scale(${press})`,opacity:ramp(f,cue,cue+3),boxShadow:`0 ${34*air}px ${64*air}px #18223030`,zIndex:3}}><Crop file="sources-full.png" x={r.x} y={r.y} w={r.w} h={r.h} scale={scale} left={0} top={0} shadow={false}/></div>:null}
     {f>=land&&f<land+8?<div style={{position:'absolute',left,top:top+r.h*scale-2,width:r.w*scale,height:2,background:accent,opacity:seamOpacity,transform:`scaleX(${seam})`}}/>:null}
    </React.Fragment>;
   })}
  </div>
 </Stage>;
};

export const Dedupe:React.FC<SceneProps>=({headline='One recipient.\nYour decision.',kicker='02 / Duplicate checks',accent=TOKENS.blue,titleSize=87})=>{
 const f=useCurrentFrame(),t=ramp(f,0,27);
 return <Stage><Header text={kicker} accent={accent}/><Heading text={headline.replace(/\n/g,'\u2002')} size={titleSize} top={205} width={1728} frame={f}/>
  <div style={{position:'absolute',left:96,top:375,width:1728,height:510,transform:`perspective(1500px) rotateY(${5*(1-t)}deg) translateY(${45*(1-t)}px)`,opacity:t}}>
   <ElementCrop file="focused/dedupe-mobile-candidate-0.png" nativeWidth={250} nativeHeight={322} height={116} width={830} left={0} top={0}/>
   <ElementCrop file="focused/dedupe-mobile-candidate-1.png" nativeWidth={250} nativeHeight={322} height={99} width={830} left={898} top={0}/>
   <Cutout file="focused/dedupe-mobile-controls-0.png" left={913} top={395} width={800}/>
   <div style={{position:'absolute',left:0,top:0,width:830,height:116*830/250,borderRadius:16,border:`3px solid ${accent}`,opacity:.65*ramp(f,27,38),pointerEvents:'none'}}/>
  </div>
 </Stage>;
};

export const Preview:React.FC<SceneProps>=({headline='See the\nwhole message.',kicker='03 / Review mail',accent=TOKENS.blue,titleSize=88})=>{
 const f=useCurrentFrame();
 return <Stage><Header text={kicker} accent={accent}/><Heading text={headline} size={titleSize} width={580} top={260} frame={f}/>
  <div style={{position:'absolute',left:690,top:219,width:1128,height:637,borderRadius:20,overflow:'hidden',boxShadow:'0 36px 80px #18223026',border:'2px solid #dfe5ec'}}>
   <div style={{width:1920,height:1080,zoom:1128/1920}}><PageCam src="textures/preview-full.png" pageH={1080} keys={[{frame:0,cx:960,cy:540,zoom:1,rotY:-7},{frame:78,cx:960,cy:510,zoom:1.03,rotY:0},{frame:149,cx:960,cy:510,zoom:1.03,rotY:0}]}/></div>
  </div>
 </Stage>;
};

const FREEZE=45,THAW=112,LAND=134,PITCH=652,PX=26;
const sourceAt=(f:number)=>f<=FREEZE?f:f<=THAW?FREEZE:FREEZE+PITCH/PX*smooth((f-THAW)/(LAND-THAW));
// speed-ramp-freeze / freeze-annotate: moving real message rail, 45f freeze,
// 112f thaw, 134f landing; page-space ink annotations and focus lift.
export const Detail:React.FC<SceneProps>=({headline='Read clearly.\nEdit in place.',kicker='04 / Details that matter',accent=TOKENS.blue,titleSize=88,annotation='A person behind every address.'})=>{
 const f=useCurrentFrame(),src=sourceAt(f),focus=ramp(f,45,54)*(1-ramp(f,112,126)),ink=ramp(f,54,64)*(1-ramp(f,104,112));
 const shift=-(src-FREEZE)*PX;
 return <Stage><Header text={kicker} accent={accent}/><Heading text={headline} size={titleSize} width={655} top={260} frame={f}/>
  <div style={{position:'absolute',left:780,top:220,width:1070,height:640,overflow:'hidden',borderRadius:18}}>
   <div style={{position:'absolute',left:0,top:90,width:601,height:340,zoom:1.78}}>
   <div style={{position:'absolute',left:11,top:0,transform:`translateX(${shift}px)`,display:'flex',gap:52,width:2050}}>
    {[0,1,2].map(i=><div key={i} style={{position:'relative',flex:'0 0 600px',height:310,opacity:i===0?1:1-.5*focus,filter:i===0?'none':`saturate(${1-.6*focus}) blur(${2*focus}px)`,transform:i===0?`translateY(${-16*focus}px) scale(${1+.03*focus})`:'none'}}>
     {i===0?<Crop file="focused/preview-full.png" x={635} y={197} w={290} h={108} scale={2} left={0} top={0}/>:i===1?<>
      <Crop file="focused/edit-full.png" x={636} y={199} w={300} h={50} scale={2} left={0} top={0}/>
      <Crop file="focused/edit-full.png" x={639} y={318.5} w={103} h={42} scale={2} left={0} top={116}/>
      <Crop file="focused/edit-full.png" x={639} y={379} w={120} h={24} scale={2} left={0} top={216}/>
     </>:<Cutout file="review-board-card-2.png" left={0} top={0} width={600} style={{filter:'blur(2px)',opacity:.55}}/>}
     {i===0?<svg width="600" height="310" style={{position:'absolute',inset:0,opacity:ink}}><path d="M24 190Q68 196 110 190" stroke={accent} fill="none" strokeWidth="3" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-ramp(f,54,64)}/><path d="M520 205Q586 175 564 34Q528 -3 191 17M206 15L191 17l12 11" stroke={accent} fill="none" strokeWidth="3" strokeLinecap="round" opacity={ramp(f,64,73)}/></svg>:null}
    </div>)}
   </div></div>
   <div style={{position:'absolute',left:28,top:20,fontSize:32,fontWeight:700,letterSpacing:'.08em',color:accent}}>{f>=45&&f<112?'PAUSED / PAY ATTENTION':'LIVE / KEEP CONTEXT'}</div>
   <div style={{position:'absolute',left:12,top:530,opacity:ink,fontSize:56,fontWeight:700,color:accent,letterSpacing:'-.025em'}}>{annotation}</div>
   <div style={{position:'absolute',inset:0,background:'#fff',opacity:f>=45&&f<48?.18*(1-(f-45)/3):0,pointerEvents:'none'}}/>
  </div>
 </Stage>;
};

export const Attachments:React.FC<SceneProps>=({headline='The right file.\nThe right mail.',kicker='05 / Attachment matching',accent=TOKENS.blue,titleSize=89})=>{
 const f=useCurrentFrame();return <Stage><Header text={kicker} accent={accent}/><Heading text={headline} size={titleSize} frame={f}/>
  <div style={{position:'absolute',left:820,top:280,width:995,height:535,opacity:ramp(f,0,26),transform:`translateY(${35*(1-ramp(f,0,32))}px)`}}>
   <Crop file="attachments-full.png" x={42} y={702.6} w={620} h={69} scale={1.55} left={0} top={0}/>
   <Crop file="attachments-full.png" x={1516} y={702} w={280} h={71} scale={2.1} left={315} top={170}/>
   <Crop file="attachments-full.png" x={42} y={830.4} w={580} h={46} scale={1.55} left={0} top={415}/>
   <svg width="995" height="510" style={{position:'absolute',inset:0,pointerEvents:'none'}}><path d="M100 128v105q0 38 38 38h125" fill="none" stroke={accent} strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-ramp(f,24,44)}/></svg>
  </div>
 </Stage>;
};

export const Schedule:React.FC<SceneProps>=({headline='Good timing\nis thoughtful.',kicker='06 / Schedule send',accent=TOKENS.blue,titleSize=90})=>{
 const f=useCurrentFrame(),move=ramp(f,74,102);
 return <Stage><Header text={kicker} accent={accent}/><Heading text={headline} size={titleSize} top={260} frame={f}/>
  <div style={{position:'absolute',left:790,top:234,width:1010,height:625,overflow:'hidden',borderRadius:18,boxShadow:'0 30px 70px #18223020'}}>
   <div style={{position:'absolute',inset:0,transform:`translateX(${-1020*move}px)`}}><Crop file="schedule-rules-full.png" x={594} y={185} w={724} h={440} scale={1.4} left={0} top={0} shadow={false}/></div>
   <div style={{position:'absolute',inset:0,transform:`translateX(${1020*(1-move)}px)`}}><Crop file="schedule-full.png" x={18} y={240} w={940} h={590} scale={1.075} left={0} top={0} shadow={false}/></div>
  </div>
 </Stage>;
};

export const Maintenance:React.FC<SceneProps>=({headline='New attachment.\nSame intention.',kicker='07 / Fast attachments',accent=TOKENS.blue,titleSize=82})=>{
 const f=useCurrentFrame();return <Stage dark><Header text={kicker} dark/><Heading text={headline} size={titleSize} width={785} frame={f}/>
  <div style={{position:'absolute',left:915,top:310,width:825,transform:`perspective(1300px) rotateY(${-10*(1-ramp(f,0,30))}deg)`}}><Cutout file="utilities-card-1.png" left={0} top={0} width={825}/><Crop file="maintenance-full.png" x={15} y={262} w={805} h={160} scale={1.025} left={0} top={235}/></div>
 </Stage>;
};

export const Monitor:React.FC<SceneProps>=({headline='Know what\nhappens next.',kicker='08 / Mail monitoring',accent=TOKENS.blue,titleSize=92})=>{
 const f=useCurrentFrame();return <Stage><Header text={kicker} accent={accent}/><Heading text={headline} size={titleSize} frame={f}/>
  <div style={{position:'absolute',left:790,top:285,width:1050,height:570,opacity:ramp(f,0,25)}}>
   <Crop file="monitor-full.png" x={35} y={287} w={455} h={125} scale={2.2} left={0} top={20}/>
   <Crop file="monitor-full.png" x={650} y={955} w={380} h={82} scale={2.45} left={60} top={355}/>
   <div style={{position:'absolute',left:359,top:36,width:634,height:219,borderRadius:16,border:`3px solid ${accent}`,opacity:.75*ramp(f,28,43)}}/>
  </div>
 </Stage>;
};

export const Performance:React.FC<SceneProps>=({headline='Measure effort.\nNotice people.',kicker='09 / Performance',accent=TOKENS.blue,titleSize=87})=>{
 const f=useCurrentFrame();return <Stage><Header text={kicker} accent={accent}/><Heading text={headline.replace(/\n/g,' ')} size={titleSize} top={205} width={1728} frame={f}/>
  <div style={{position:'absolute',left:96,top:415,width:1728,height:455,transform:`translateY(${28*(1-ramp(f,0,30))}px)`}}>
   <Cutout file="performance-kpi-0.png" left={0} top={0} width={760}/>
   <Cutout file="performance-kpi-2.png" left={0} top={190} width={760}/>
   <Crop file="performance-full.png" x={12} y={243} w={600} h={285} scale={1.416} left={875} top={0}/>
  </div>
 </Stage>;
};

// outro-group-photo-launch / same style key: cue 4 + 3i, 12f overshoot,
// contact press, crane 4deg->0, elements recede at 42, letterpress and long hold.
export const Launch:React.FC<SceneProps>=({headline='SmartMail Ops',kicker='Scale the preparation. Keep the intention.',accent=TOKENS.blue,titleSize=128,duration=180})=>{
 const f=useCurrentFrame(),crane=ramp(f,0,40,Easing.bezier(.3,0,.2,1)),recede=ramp(f,42,50),flyEase=Easing.bezier(.34,1.4,.44,1),rule=ramp(f,58,70),tag=ramp(f,68,80);
 const camScale=1.06-.06*crane+.02*smooth((f-36)/144);
 const els=[
  ['sources-file-0.png',140,160,590,-6,-500,-220],['focused/dedupe-header-0.png',1370,160,375,5,500,-200],
  ['preview-page-0.png',140,707,530,-4,-420,330],['schedule-rules-summary-0.png',1280,790,525,3,420,300],
  ['utilities-card-1.png',590,125,560,-1,0,-280],['attachments-asset-0.png',975,906,730,2,480,300],
  ['performance-kpi-0.png',1470,448,330,4,550,0],['focused/editor-recipient-0.png',102,448,330,-3,-550,0],
  ['focused/monitor-summary-0.png',586,867,420,-2,0,400],
 ] as const;
 return <Stage dark>
  <div style={{position:'absolute',inset:0,perspective:1700,opacity:1-ramp(f,duration-12,duration-1)}}>
   <div style={{position:'absolute',width:1920,height:1080,zoom:camScale,transformOrigin:'960px 540px',transform:`translate(${960/camScale-960}px,${540/camScale-540}px) rotateX(${4*(1-crane)}deg)`}}>
    {els.map(([file,x,y,w,rot,dx,dy],i)=>{const cue=4+3*i,p=ramp(f,cue,cue+12,flyEase),press=interpolate(f,[cue+9,cue+12,cue+16],[1,.985,1],clamp);return <Cutout key={file} file={file} left={x} top={y} width={w} style={{opacity:ramp(f,cue,cue+3)*(1-.12*recede),filter:`saturate(${1-.08*recede})`,transform:`translate(${dx*(1-p)}px,${dy*(1-p)}px) rotate(${rot+12*(1-p)}deg) scale(${press})`,boxShadow:'0 22px 70px #0006'}}/>;})}
    <div style={{position:'absolute',left:350,top:320,width:1220,height:400,background:'radial-gradient(ellipse,#164884ee,#091a32de 65%,#091a3200 75%)',opacity:ramp(f,38,58)}}/>
    <div style={{position:'absolute',left:0,right:0,top:367,textAlign:'center',fontSize:titleSize,fontWeight:800,letterSpacing:'-.05em',whiteSpace:'nowrap'}}>{headline.split('').map((c,i)=><span key={i} style={{display:'inline-block',minWidth:c===' '?.3*titleSize:undefined,opacity:ramp(f,42+i*1.8,50+i*1.8),transform:`translateY(${22*(1-ramp(f,42+i*1.8,50+i*1.8))}px)`}}>{c}</span>)}</div>
    <div style={{position:'absolute',left:730,top:546,width:460,height:3,background:accent,transform:`scaleX(${rule})`}}/>
    <div style={{position:'absolute',left:260,right:260,top:590,textAlign:'center',fontSize:56,lineHeight:1.35,color:'#cfe1ff',opacity:tag,letterSpacing:'-.025em',transform:`translateY(${12*(1-tag)}px)`}}>{kicker}</div>
    <div style={{position:'absolute',left:600,right:600,top:686,textAlign:'center',fontSize:32,lineHeight:1.35,color:'#9dbce8',opacity:tag}}>A Chrome extension for NetEase Mail.</div>
    {Array.from({length:20},(_,i)=><div key={i} style={{position:'absolute',left:(i*439+137)%1920+9*Math.sin(f*.022+i*.83),top:(i*613+271)%1080-f*(.3+(i%5)*.11),width:2.4+i%3,height:2.4+i%3,background:'#8fbbff',borderRadius:'50%',opacity:.25*ramp(f,42,70)}}/>)}
   </div>
  </div>
 </Stage>;
};

export const SCENES={signal:Signal,sources:Sources,dedupe:Dedupe,preview:Preview,detail:Detail,attachments:Attachments,schedule:Schedule,maintenance:Maintenance,monitor:Monitor,performance:Performance,launch:Launch};
export const DEFAULTS:Record<keyof typeof SCENES,SceneProps>={
 signal:{headline:'The next\nconversation\nstarts here.',kicker:'SmartMail Ops / Chaos, choreographed',titleSize:102},
 sources:{headline:'Sources,\nunderstood.',kicker:'01 / Prepare mail',titleSize:98},
 dedupe:{headline:'One recipient.\nYour decision.',kicker:'02 / Duplicate checks',titleSize:87},
 preview:{headline:'See the\nwhole message.',kicker:'03 / Review mail',titleSize:88},
 detail:{headline:'Read clearly.\nEdit in place.',kicker:'04 / Details that matter',titleSize:88,annotation:'A person behind every address.'},
 attachments:{headline:'The right file.\nThe right mail.',kicker:'05 / Attachment matching',titleSize:89},
 schedule:{headline:'Good timing\nis thoughtful.',kicker:'06 / Schedule send',titleSize:90},
 maintenance:{headline:'New attachment.\nSame intention.',kicker:'07 / Fast attachments',titleSize:82},
 monitor:{headline:'Know what\nhappens next.',kicker:'08 / Mail monitoring',titleSize:92},
 performance:{headline:'Measure effort.\nNotice people.',kicker:'09 / Performance',titleSize:87},
 launch:{headline:'SmartMail Ops',kicker:'Scale the preparation. Keep the intention.',titleSize:128},
};
