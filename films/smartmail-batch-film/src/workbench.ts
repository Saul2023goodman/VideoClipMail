import {BatchScene,Header} from './Scenes';
import {Caption,FontStyles} from './motion';
import {SmartMailBatchFilm} from './Main';
import {SHOTS,CAPTIONS,FPS,TOTAL,TOKENS as T} from './timeline';
import CUES from './audio-cues.json';
export const WORKBENCH={
 name:'SmartMail Ops · Sixty enquiries',revision:'batch-v2',fps:FPS,width:1920,height:1080,total:TOTAL,background:T.bg,
 shots:SHOTS.map(s=>({id:s.id,label:s.label,from:s.from,duration:s.duration,component:BatchScene,props:{kind:s.id,startFrame:s.from,duration:s.duration},cardId:s.id,cardName:s.label})),
 captions:CAPTIONS.map(c=>({id:c.id,label:c.text,from:c.from,duration:c.duration,component:Caption,props:{text:c.text,duration:c.duration,accent:T.accent,fontSize:58},durationProp:'duration',cardId:'narration',cardName:'English explanation',schema:[{type:'textarea',key:'text',label:'Caption',default:c.text},{type:'number',key:'fontSize',label:'Type size',default:58,min:32,max:100,step:1},{type:'color',key:'accent',label:'Accent',default:T.accent}]})),
 overlays:[{id:'fonts',label:'Film fonts',from:0,duration:TOTAL,component:FontStyles},{id:'header',label:'Campaign context',from:0,duration:TOTAL,component:Header,props:{campaign:'Student 001',accent:T.accent},schema:[{type:'text',key:'campaign',label:'Campaign label',default:'Student 001'},{type:'color',key:'accent',label:'Label accent',default:T.accent}]}],
 transitions:[],sfx:CUES.map(c=>({from:c.from,duration:c.duration,src:c.src,volume:c.volume,label:c.label})),
 bgm:[{from:0,duration:TOTAL,src:'audio/music-bed.wav',volume:1}],order:['captions','overlays'],original:SmartMailBatchFilm,
};
