import {SmartMailFilm,Caption} from './Main';
import {ContinuousCampaign,TOKENS} from './ContinuousScene';
import {SHOTS,CAPTIONS,SFX,BGM,TOTAL,FPS} from './timeline';

export const WORKBENCH={
 name:'SmartMail Ops — One campaign, from import to reply',revision:'scenario-1',fps:FPS,width:1920,height:1080,total:TOTAL,background:TOKENS.bg,
 shots:SHOTS.map(s=>({...s,component:ContinuousCampaign,props:{sourceFrom:s.from,campaignName:'Partner invitations',accent:TOKENS.accent,closingLine:'Plan the campaign. Follow the conversation.'},schema:[
  {type:'text',key:'campaignName',label:'Campaign name',default:'Partner invitations'},
  {type:'color',key:'accent',label:'Accent color',default:TOKENS.accent},
  {type:'text',key:'closingLine',label:'Closing line',default:'Plan the campaign. Follow the conversation.'},
 ]})),
 captions:CAPTIONS.map(c=>({...c,label:c.text,component:Caption,props:{text:c.text,color:TOKENS.ink},durationProp:'duration',schema:[{type:'textarea',key:'text',label:'Narration caption',default:c.text},{type:'color',key:'color',label:'Caption color',default:TOKENS.ink}]})),
 overlays:[],transitions:[],sfx:SFX,bgm:[BGM],order:['captions'],original:SmartMailFilm,
};
