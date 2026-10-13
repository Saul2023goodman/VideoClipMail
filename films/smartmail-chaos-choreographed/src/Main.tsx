import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame,interpolate} from 'remotion';
import {SHOTS,TOTAL,CAPTIONS,SFX,BGM} from './timeline';
import {SCENES,DEFAULTS,FontStyles,TOKENS} from './scenes';
export const Caption:React.FC<{text?:string;duration?:number;color?:string}>=({text='',duration=100,color=TOKENS.ink})=>{
 const f=useCurrentFrame(),opacity=interpolate(f,[0,10,duration-8,duration-1],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return <AbsoluteFill style={{pointerEvents:'none',fontFamily:'Film,Arial,sans-serif'}}><FontStyles/><div style={{position:'absolute',left:96,bottom:100,fontSize:56,lineHeight:1.35,color,opacity,maxWidth:1728,letterSpacing:'-.025em'}}>{text}</div></AbsoluteFill>;
};
export const Route:React.FC=()=>{const f=useCurrentFrame(),progress=f/TOTAL,fade=f>=1440?interpolate(f,[1440,1460],[1,0],{extrapolateRight:'clamp'}):1;return <AbsoluteFill style={{pointerEvents:'none',opacity:fade}}><div style={{position:'absolute',left:96,right:96,bottom:54,height:2,background:'#1769e025'}}><div style={{width:`${100*progress}%`,height:2,background:TOKENS.blue}}/>{SHOTS.slice(0,-1).map(s=><div key={s.id} style={{position:'absolute',top:-4,left:1728*s.from/TOTAL,width:10,height:10,borderRadius:10,background:f>=s.from?TOKENS.blue:'#dfe5ec'}}/>)}</div></AbsoluteFill>;};
export const SmartMailFilm:React.FC<{bgm?:boolean;audioOnly?:boolean;silentPicture?:boolean}>=({bgm=true,audioOnly=false,silentPicture=false})=><AbsoluteFill style={{background:TOKENS.navy}}>
 {!audioOnly?<>
  {SHOTS.map(s=>{const Component=SCENES[s.id];return <Sequence key={s.id} from={s.from} durationInFrames={s.duration}><Component {...DEFAULTS[s.id]} duration={s.duration}/></Sequence>;})}
  {CAPTIONS.map(c=><Sequence key={c.id} from={c.from} durationInFrames={c.duration}><Caption text={c.text} duration={c.duration} color={['signal','maintenance'].includes(c.id)?'#b9cde8':TOKENS.muted}/></Sequence>)}
  <Route/>
 </>:null}
 {!silentPicture?<>
  {SFX.map(s=><Sequence key={s.id} from={s.from} durationInFrames={s.duration}><Audio src={staticFile(s.src)} volume={s.volume}/></Sequence>)}
  {bgm?<Sequence from={BGM.from} durationInFrames={BGM.duration}><Audio src={staticFile(BGM.src)} volume={BGM.volume}/></Sequence>:null}
 </>:null}
</AbsoluteFill>;
