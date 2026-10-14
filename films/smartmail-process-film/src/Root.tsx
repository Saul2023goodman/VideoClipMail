import React from 'react';
import {Composition} from 'remotion';
import {SmartMailProcessFilm} from './Main';
import {FPS,TOTAL} from './timeline';
export const Root:React.FC=()=> <Composition id="SmartMailProcess" component={SmartMailProcessFilm} defaultProps={{bgm:true}} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080}/>;
