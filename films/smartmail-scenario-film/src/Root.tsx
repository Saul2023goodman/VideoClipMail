import {Composition} from 'remotion';
import {SmartMailFilm} from './Main';
import {FPS,TOTAL} from './timeline';
export const Root:React.FC=()=> <Composition id="SmartMailOps" component={SmartMailFilm} defaultProps={{bgm:true}} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080}/>;
