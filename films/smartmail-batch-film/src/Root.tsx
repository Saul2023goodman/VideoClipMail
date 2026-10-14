import React from 'react';
import {Composition} from 'remotion';
import {SmartMailBatchFilm} from './Main';
import {FPS,TOTAL} from './timeline';
export const Root:React.FC=()=> <Composition id="SmartMailBatch" component={SmartMailBatchFilm} defaultProps={{bgm:true}} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080}/>;
