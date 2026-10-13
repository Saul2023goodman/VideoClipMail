import {SmartMailFilm,Caption,Route} from './Main';
import {SHOTS,TOTAL,FPS,CAPTIONS,SFX,BGM} from './timeline';
import {SCENES,DEFAULTS,TOKENS} from './scenes';
export const WORKBENCH={
 name:'SmartMail Ops — Chaos, choreographed',revision:'3',fps:FPS,width:1920,height:1080,total:TOTAL,background:TOKENS.navy,
 shots:SHOTS.map(s=>({...s,label:s.id,component:SCENES[s.id],props:{...DEFAULTS[s.id],accent:TOKENS.blue},durationProp:s.id==='launch'?'duration':undefined,schema:[
  {type:'textarea',key:'headline',label:'Headline',default:DEFAULTS[s.id].headline},
  {type:'text',key:'kicker',label:'Section label / Closing line',default:DEFAULTS[s.id].kicker},
  {type:'color',key:'accent',label:'Accent color',default:TOKENS.blue},
  {type:'slider',key:'titleSize',label:'Headline size',default:DEFAULTS[s.id].titleSize,min:56,max:145,step:1,unit:'px'},
  ...(s.id==='detail'?[{type:'text',key:'annotation',label:'Review annotation',default:DEFAULTS.detail.annotation}]:[]),
 ]})),
 captions:CAPTIONS.map(c=>({...c,id:`caption-${c.id}`,label:c.text,component:Caption,props:{text:c.text,color:['signal','maintenance'].includes(c.id)?'#b9cde8':TOKENS.muted},durationProp:'duration',schema:[{type:'textarea',key:'text',label:'Caption',default:c.text},{type:'color',key:'color',label:'Text color',default:TOKENS.muted}]})),
 overlays:[{id:'route',label:'Workflow continuity line',from:0,duration:TOTAL,component:Route}],
 transitions:[],sfx:SFX,bgm:[BGM],order:['overlays','captions','transitions'],original:SmartMailFilm,
};
