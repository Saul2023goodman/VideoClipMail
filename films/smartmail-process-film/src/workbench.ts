import {CarryTransition,ProcessScene} from './Scenes';
import {SmartMailProcessFilm} from './Main';
import {CARRY,SCENE_PROPS,SHOTS,FPS,TOTAL,TOKENS} from './timeline';
import CUES from './audio-cues.json';
const textSchema=[
 {type:'textarea',key:'primaryText',label:'Object annotation',default:''},
 {type:'textarea',key:'secondaryText',label:'Supporting annotation',default:''},
 {type:'color',key:'accent',label:'Accent color',default:TOKENS.accent},
];
const noteSchema=[...textSchema,
 {type:'number',key:'fontSize',label:'Annotation size',default:42,min:28,max:80,step:1,unit:'px'},
 {type:'number',key:'labelX',label:'Annotation X offset',default:0,min:-200,max:200,step:1,unit:'px'},
 {type:'number',key:'labelY',label:'Annotation Y offset',default:0,min:-150,max:150,step:1,unit:'px'},
];
export const WORKBENCH={
 name:'SmartMail Ops · Show the decisions',revision:'process-v4.1',fps:FPS,width:1920,height:1080,total:TOTAL,background:TOKENS.bg,
 shots:SHOTS.map(s=>({id:s.id,label:s.label,from:s.from,duration:s.duration,component:ProcessScene,props:{kind:s.id,duration:s.duration,hideCarry:s.id==='schedule',...SCENE_PROPS[s.id],accent:TOKENS.accent,fontSize:42,labelX:0,labelY:0},schema:s.id==='outro'?textSchema:noteSchema,durationProp:'duration',cardId:s.id,cardName:s.label})),
 transitions:[{id:CARRY.id,label:'Ready line → native schedule',from:CARRY.from,duration:CARRY.duration,component:CarryTransition,props:{...CARRY,accent:TOKENS.accent,fontSize:42,labelX:0,labelY:0},schema:textSchema,durationProp:'duration',cardId:'line-carry',cardName:'Ready line carries into schedule'}],
 captions:[],overlays:[],
 sfx:CUES.map((c,i)=>({id:'sfx-'+i,label:c.label,from:c.from,duration:c.duration,src:c.src,volume:c.volume})),
 bgm:[{from:0,duration:TOTAL,src:'audio/music-bed.wav',volume:1}],
 order:['transitions'],original:SmartMailProcessFilm,
};
