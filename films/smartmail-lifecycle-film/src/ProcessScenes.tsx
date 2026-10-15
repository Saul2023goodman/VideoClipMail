// Native browse and calendar; technical object animation lives in MotionScenes.
import React from 'react';
import {Html5Video,Img,staticFile,useCurrentFrame} from 'remotion';
import {EASE,mix,ramp,velocity} from './lib/Polish';
import {Capture,Label,Surface} from './ui';
import {COLORS as C,SHOTS,beatF} from './timeline';
import NATIVE from './native-layout.json';
import {MOTION_VIEWS,MotionViewProps} from './MotionScenes';
export type ProcessProps={kind?:string;duration?:number;primaryText?:string;secondaryText?:string;accent?:string};
type V=MotionViewProps;
const Review:React.FC<V>=({f,primaryText,secondaryText})=>{
 const positions=NATIVE.reviewScroll.positions;
 const positionAt=(t:number)=>{const q=Math.max(0,Math.min(positions.length-1,t)),lo=Math.floor(q),hi=Math.min(positions.length-1,lo+1);return mix(positions[lo],positions[hi],q-lo);};
 const v=velocity(positionAt,f),blur=Math.min(23,Math.abs(v)*.04);
 return <Surface dark>
  <div style={{position:'absolute',left:0,top:0,width:1920,height:1080,overflow:'hidden',boxShadow:'0 0 90px #0008'}}><Html5Video src={staticFile('native/overview-scroll.mp4')} muted style={{width:1920,height:1080,objectFit:'cover'}}/>{blur>.7?<div style={{position:'absolute',left:0,top:120,width:1920,height:930,overflow:'hidden'}}><Html5Video src={staticFile('native/overview-scroll.mp4')} muted style={{position:'absolute',left:0,top:-120,width:1920,height:1080,objectFit:'cover',filter:`blur(0px) url(#review-blur)`}}/></div>:null}</div>
  <svg width={0} height={0}><filter id="review-blur" x="0" y="-10%" width="100%" height="120%"><feGaussianBlur stdDeviation={`0 ${blur.toFixed(2)}`}/></filter></svg>
  {f>139?<div style={{position:'absolute',left:24,top:650,width:480,padding:'20px 24px',background:'#fff',borderLeft:`5px solid ${C.blue}`,boxShadow:'0 18px 60px #08142222',opacity:ramp(f,140,12)}}><div style={{fontSize:56,fontWeight:700,lineHeight:1.15}}>{primaryText}</div><div style={{fontSize:36,color:C.muted,marginTop:12}}>{secondaryText}</div></div>:null}
 </Surface>;
};

const Schedule:React.FC<V>=({f,b,primaryText,secondaryText})=>{
 const apply=ramp(f,b(4),38,EASE.swift),settle=ramp(f,b(8),20);
 return <Surface dark>
  <div style={{position:'absolute',left:mix(145,-750,apply),top:260,width:1500,transform:`perspective(1800px) rotateY(${mix(0,-8,apply)}deg)`,opacity:1-apply}}><Capture name="11-rules.png" x={0} y={0} w={1500} h={810}/></div>
  <div style={{position:'absolute',left:115,top:45,opacity:ramp(f,0,18)}}><Label size={72} color="#fff">{primaryText}</Label><Label y={100} size={40} color="#a8bdd3" weight={400}>{secondaryText}</Label></div>
  <div style={{position:'absolute',left:mix(1780,80,apply),top:230,opacity:apply}}><Capture name="12-calendar.png" x={0} y={0} w={1760} h={760} crop={{x:8,y:103,w:1904,h:822}}/></div>
  <div style={{position:'absolute',left:130,top:mix(850,870,apply),opacity:ramp(f,b(1),15)*(1-apply),background:'#fff',padding:'20px 28px',borderRadius:9,fontSize:36,color:C.blue,boxShadow:'0 10px 45px #08142224'}}>1 / institution / day · ≥7 days apart · skip weekends &amp; AU holidays</div>
  <div style={{position:'absolute',left:1140,top:130,opacity:settle,background:C.green,padding:'14px 24px',borderRadius:8,fontSize:46,color:'#fff',fontWeight:700}}>60 scheduled · 15 dates</div>
 </Surface>;
};

const views:Record<string,React.FC<V>>={...MOTION_VIEWS,review:Review,schedule:Schedule};
export const ProcessScene:React.FC<ProcessProps>=({kind='intake',duration=180,primaryText='',secondaryText='',accent=C.blue})=>{
 const f=Math.min(useCurrentFrame(),duration-1),shot=SHOTS.find(s=>s.id===kind)!,b=(n:number)=>beatF(shot.b0+n)-shot.from;
 const View=views[kind];return View?<View f={f} duration={duration} b={b} primaryText={primaryText} secondaryText={secondaryText} accent={accent}/>:null;
};
