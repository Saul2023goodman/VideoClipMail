import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame} from 'remotion';
import {TOTAL,CAPTIONS,SFX,BGM} from './timeline';
import {ContinuousCampaign,FontStyles,TOKENS,ramp} from './ContinuousScene';

export const Caption:React.FC<{text?:string;duration?:number;color?:string}>=({text='',duration=100,color=TOKENS.ink})=>{
 const f=useCurrentFrame(),opacity=ramp(f,0,7)*(1-ramp(f,duration-7,7));
 return <AbsoluteFill style={{pointerEvents:'none',fontFamily:'Film,Arial,sans-serif'}}><FontStyles/><div style={{position:'absolute',left:82,right:82,top:905,fontSize:56,lineHeight:1.26,color,opacity,letterSpacing:'-.026em',fontWeight:400}}>{text}</div></AbsoluteFill>;
};
export const SmartMailFilm:React.FC<{bgm?:boolean;audioOnly?:boolean;silentPicture?:boolean;proof?:boolean}>=({bgm=true,audioOnly=false,silentPicture=false,proof=false})=> <AbsoluteFill style={{background:TOKENS.bg}}>
 {!audioOnly?<>
  <ContinuousCampaign proof={proof}/>
  {CAPTIONS.map(c=><Sequence key={c.id} from={c.from} durationInFrames={c.duration}><Caption text={c.text} duration={c.duration}/></Sequence>)}
 </>:null}
 {!silentPicture?<>
  {SFX.map(s=><Sequence key={s.id} from={s.from} durationInFrames={s.duration}><Audio src={staticFile(s.src)} volume={s.volume}/></Sequence>)}
  {bgm?<Sequence from={BGM.from} durationInFrames={BGM.duration}><Audio src={staticFile(BGM.src)} volume={BGM.volume}/></Sequence>:null}
 </>:null}
 </AbsoluteFill>;
