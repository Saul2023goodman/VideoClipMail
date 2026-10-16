import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS as C,SHOTS,beatF} from './timeline';
import {MOTION_VIEWS} from './MotionScenes';
import {JOURNEY_VIEWS} from './JourneyScenes';
export type ProcessProps={kind?:string;duration?:number;primaryText?:string;secondaryText?:string;accent?:string};
const views={...MOTION_VIEWS,...JOURNEY_VIEWS};
export const ProcessScene:React.FC<ProcessProps>=({kind='intake',duration=180,primaryText='',secondaryText='',accent=C.blue})=>{
 const f=Math.min(useCurrentFrame(),duration-1),shot=SHOTS.find(s=>s.id===kind)!,b=(n:number)=>beatF(shot.b0+n)-shot.from;
 const View=views[kind];return View?<View f={f} duration={duration} b={b} primaryText={primaryText} secondaryText={secondaryText} accent={accent}/>:null;
};
