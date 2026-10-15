import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame} from 'remotion';
import {SpotlightHero} from './Spotlight';
import {BatchDeal} from './BatchDeal';
import {ProcessScene} from './ProcessScenes';
import {Outro} from './Outro';
import {FontFaces} from './ui';
import {SHOTS,DEFAULTS,COLORS,TOTAL} from './timeline';
import RAW_CUES from './audio-cues.json';
const CUES:{from:number;duration:number;src:string;volume:number}[]=RAW_CUES;
export type FilmProps={bgm?:boolean;audioOnly?:boolean;silentPicture?:boolean};
export const Scene:React.FC<{kind?:string;duration?:number;primaryText?:string;secondaryText?:string;accent?:string}>=({kind='hero',...props})=><AbsoluteFill style={{fontFamily:'OpenFilm','--process-accent':props.accent||COLORS.blue} as React.CSSProperties}><FontFaces/>{kind==='hero'?<SpotlightHero {...props}/>:kind==='batch'?<BatchDeal {...props}/>:kind==='outro'?<Outro {...props}/>:<ProcessScene kind={kind} {...props}/>}</AbsoluteFill>;
export const Scope:React.FC=()=> <div style={{opacity:Math.max(0,Math.min(1,(TOTAL-1-useCurrentFrame())/14)),position:'absolute',right:26,top:24,fontFamily:'OpenFilm',fontSize:22,fontWeight:700,color:'#7b8da3',letterSpacing:'.06em',background:'#f4f6f8ed',borderRadius:5,padding:'5px 10px'}}>FICTIONAL DATA · OFFLINE DEMO</div>;
export const SmartMailLifecycleFilm:React.FC<FilmProps>=({bgm=true,audioOnly=false,silentPicture=false})=><AbsoluteFill style={{background:COLORS.bg,fontFamily:'OpenFilm'}}><FontFaces/>
 {!audioOnly?SHOTS.map(s=><Sequence key={s.id} from={s.from} durationInFrames={s.duration}><Scene kind={s.id} duration={s.duration} {...DEFAULTS[s.id]} accent={s.id==='hero'?COLORS.edge:COLORS.blue}/></Sequence>):null}
 {!audioOnly?<Scope/>:null}
 {!silentPicture?<>{bgm?<Audio src={staticFile('audio/music-bed.wav')}/>:null}{CUES.map((c,i)=><Sequence key={i} from={c.from} durationInFrames={c.duration}><Audio src={staticFile(c.src)} volume={c.volume}/></Sequence>)}</>:null}
</AbsoluteFill>;
export const HeroStudy:React.FC=()=> <AbsoluteFill><FontFaces/><SpotlightHero/></AbsoluteFill>;
export const BatchStudy:React.FC=()=> <AbsoluteFill><FontFaces/><BatchDeal/></AbsoluteFill>;
