import {Scene,Scope,SmartMailLifecycleFilm} from './Main';
import {SHOTS,DEFAULTS,FPS,TOTAL,COLORS} from './timeline';
import RAW_CUES from './audio-cues.json';
const CUES: {from:number;duration:number;src:string;volume:number;label?:string}[]=RAW_CUES;
const schema=[
 {type:'textarea',key:'primaryText',label:'Object annotation',default:''},
 {type:'textarea',key:'secondaryText',label:'Supporting annotation',default:''},
 {type:'color',key:'accent',label:'Accent color',default:COLORS.blue},
];
export const WORKBENCH={
 name:'SmartMail Ops · Import to follow-up',revision:'lifecycle-v5.2',fps:FPS,width:1920,height:1080,total:TOTAL,background:COLORS.bg,
 shots:SHOTS.map(s=>({id:s.id,label:s.label,from:s.from,duration:s.duration,component:Scene,props:{kind:s.id,duration:s.duration,...DEFAULTS[s.id],accent:s.id==='hero'?COLORS.edge:COLORS.blue},schema,durationProp:'duration',cardId:s.id,cardName:s.label})),
 transitions:[],captions:[],overlays:[{id:'scope',label:'Fictional data / offline boundary',from:0,duration:TOTAL,component:Scope}],
 sfx:CUES.map((c,i)=>({id:'sfx-'+i,label:c.label||'Physical sound',from:c.from,duration:c.duration,src:c.src,volume:c.volume})),
 bgm:[{from:0,duration:TOTAL,src:'audio/music-bed.wav',volume:1}],order:['overlays'],original:SmartMailLifecycleFilm,
};
