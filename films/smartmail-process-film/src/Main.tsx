import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile} from 'remotion';
import {CarryTransition,ProcessScene} from './Scenes';
import {CARRY,SCENE_PROPS,SHOTS,TOKENS as T} from './timeline';
import CUES from './audio-cues.json';
export type FilmProps={bgm?:boolean;silentPicture?:boolean;audioOnly?:boolean};
export const SmartMailProcessFilm:React.FC<FilmProps>=({bgm=true,silentPicture=false,audioOnly=false})=><AbsoluteFill style={{background:T.bg}}>
 {!audioOnly?<>{SHOTS.map(s=><Sequence key={s.id} from={s.from} durationInFrames={s.duration}><ProcessScene kind={s.id} duration={s.duration} hideCarry={s.id==='schedule'} {...SCENE_PROPS[s.id]}/></Sequence>)}<Sequence from={CARRY.from} durationInFrames={CARRY.duration}><CarryTransition {...CARRY}/></Sequence></>:null}
 {!silentPicture?<>
  {bgm?<Audio src={staticFile('audio/music-bed.wav')}/>:null}
  {CUES.map((c,i)=><Sequence key={i} from={c.from} durationInFrames={c.duration}><Audio src={staticFile(c.src)} volume={c.volume}/></Sequence>)}
 </>:null}
</AbsoluteFill>;
