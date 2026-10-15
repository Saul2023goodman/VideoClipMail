import React from 'react';
import {Composition} from 'remotion';
import {SmartMailLifecycleFilm,HeroStudy,BatchStudy} from './Main';
import {SHOTS,TOTAL} from './timeline';
export const Root:React.FC=()=> <>
 <Composition id="SmartMailLifecycle" component={SmartMailLifecycleFilm} durationInFrames={TOTAL} fps={30} width={1920} height={1080}/>
 <Composition id="HeroStudy" component={HeroStudy} durationInFrames={SHOTS[0].duration} fps={30} width={1920} height={1080}/>
 <Composition id="BatchStudy" component={BatchStudy} durationInFrames={SHOTS[3].duration} fps={30} width={1920} height={1080}/>
</>;
