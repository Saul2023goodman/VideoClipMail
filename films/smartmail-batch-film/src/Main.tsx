import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile} from 'remotion';
import {BatchScene,Header} from './Scenes';
import {Caption,FontStyles} from './motion';
import {CAPTIONS,SHOTS,TOTAL,TOKENS as T} from './timeline';
import CUES from './audio-cues.json';
export type FilmProps={bgm?:boolean;silentPicture?:boolean;audioOnly?:boolean};
export const SmartMailBatchFilm:React.FC<FilmProps>=({bgm=true,silentPicture=false,audioOnly=false})=><AbsoluteFill style={{background:T.bg,fontFamily:'Film'}}>
 <FontStyles/>
 {!audioOnly?<>
  {SHOTS.map(s=><Sequence key={s.id} from={s.from} durationInFrames={s.duration}><BatchScene kind={s.id} startFrame={s.from} duration={s.duration}/></Sequence>)}
  <Header/>
  {CAPTIONS.map(c=><Sequence key={c.id} from={c.from} durationInFrames={c.duration}><Caption text={c.text} duration={c.duration}/></Sequence>)}
 </>:null}
 {!silentPicture?<>
  {bgm?<Audio src={staticFile('audio/music-bed.wav')}/>:null}
  {CUES.map((c,i)=><Sequence key={i} from={c.from} durationInFrames={c.duration}><Audio src={staticFile(c.src)} volume={c.volume}/></Sequence>)}
 </>:null}
</AbsoluteFill>;
