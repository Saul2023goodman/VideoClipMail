import attacks from '../public/audio/analysis.json';
import layout from './native-layout.json';

export const FPS=30;
export const TOTAL=2520;
export const AUDIO_OUTPUT_OFFSET=0;
export const SHOTS=[
 {id:'import',from:0,duration:300,label:'Import and match the campaign'},
 {id:'dedupe',from:300,duration:210,label:'Resolve Maya’s two versions'},
 {id:'preview',from:510,duration:210,label:'Review in continuous pages'},
 {id:'edit',from:720,duration:240,label:'Correct the copied greeting'},
 {id:'attachments',from:960,duration:240,label:'Match the shared brief'},
 {id:'schedule',from:1200,duration:330,label:'Separate colleagues’ invitations'},
 {id:'maintenance',from:1530,duration:360,label:'Update three scheduled drafts'},
 {id:'monitor',from:1890,duration:330,label:'Let a reply change the next action'},
 {id:'performance',from:2220,duration:180,label:'Check reach and conversations'},
 {id:'finish',from:2400,duration:120,label:'SmartMail Ops'},
];
const lines:[number,number,string][]=[
 [0,180,'Eight people to invite. One shared project brief.'],
 [180,300,'Match the invitations to the contact roster.'],
 [300,432,'Maya has two drafts. Keep the complete version.'],
 [432,570,'Eight people remain. Review each message in place.'],
 [570,720,'Keep each recipient and their message in view.'],
 [720,815,'Maya’s greeting says “Nora”. Fix it before sending.'],
 [815,960,'Edit, format and confirm in the same preview.'],
 [960,1200,'Match the shared brief to all eight drafts.'],
 [1200,1320,'Four offices. Colleagues should not get the same-day pitch.'],
 [1320,1445,'One person per office. Seven days between colleagues.'],
 [1445,1530,'The schedule separates them into two send dates.'],
 [1530,1710,'The brief changes. Three scheduled drafts need v2.'],
 [1710,1810,'Build a replacement. Verify the message and send time.'],
 [1810,1890,'Replace the original only after verification.'],
 [1890,2055,'Three people reached. Alex has not replied yet.'],
 [2055,2165,'Alex replies. Another automated nudge is unnecessary.'],
 [2165,2250,'Stop new follow-ups. Continue the conversation.'],
 [2250,2400,'Three of eight reached. One human reply to handle.'],
];
export const CAPTIONS=lines.map(([from,to,text],i)=>({id:`line-${i}`,from,duration:to-from,text}));

export type NativeTarget={frame:number;x:number;y:number;width:number;height:number};
export const EVENTS=Object.entries(layout.targets as Record<string,NativeTarget>).map(([id,t])=>({id,...t})).sort((a,b)=>a.frame-b.frame);
export const PROOFS=[30,150,240,300,345,405,438,540,600,650,710,760,805,895,935,1050,1150,1295,1370,1460,1500,1610,1670,1725,1760,1795,1830,1865,1960,2050,2120,2180,2300,2430,2519];

// Camera points are in the native 1440×1000 CSS coordinate system. The video,
// pointer, selections and highlights all share that one plane. No shot resets.
// Each readable passage has a slow continuing move rather than a static exhibit.
export type Cam={frame:number;x:number;y:number;s:number};
export const CAMERA:Cam[]=[
 [0,675,215,1.65],[60,710,195,1.8],[90,715,190,1.85],
 [120,560,375,2.35],[180,610,395,2.5],[210,825,395,2.2],
 [255,1170,495,2.25],[280,1290,930,2.6],[300,1280,930,2.55],
 [330,355,730,2.7],[355,365,710,2.75],[390,1010,725,2.7],
 [415,1000,710,2.72],[432,1170,880,2.3],[465,1220,885,2.2],
 [495,805,510,1.25],[510,335,40,2.25],[540,335,255,2.2],
 [565,805,340,1.45],[595,805,435,1.48],[615,200,280,2.55],
 [635,780,400,1.4],[660,800,290,1.5],[690,605,252,3.15],
 [708,830,285,1.45],[720,870,300,1.45],[750,590,383,3.2],
 [780,592,384,3.25],[810,695,399,2.65],[835,625,348,2.7],
 [860,850,410,2.25],[885,1060,225,1.6],[915,610,274,3.05],
 [935,840,287,1.45],[960,440,140,1.65],[990,228,45,2.3],
 [1020,1165,413,2.0],[1050,315,660,2.55],[1080,1020,660,2.7],
 [1125,1165,688,4.0],[1155,1215,759,4.0],[1170,1260,819,2.25],
 [1200,535,55,1.65],[1230,1300,163,2.05],[1260,720,553,2.3],
 [1290,590,675,2.45],[1320,855,677,2.6],[1350,530,765,2.65],
 [1380,865,766,2.65],[1410,910,893,2.3],[1425,980,940,2.2],
 [1455,560,382,3.15],[1470,563,385,3.2],[1500,1090,383,3.15],
 [1520,1090,385,3.2],
 [1530,595,44,1.65],[1560,720,180,2.15],[1605,325,365,2.65],
 [1630,1030,490,2.15],[1660,1040,613,2.3],[1695,1240,755,2.35],
 [1720,1020,758,2.18],[1760,1021,757,2.3],[1815,1021,757,2.32],
 [1850,1021,727,2.3],[1875,1021,700,2.32],[1890,320,130,1.5],
 [1910,320,200,2.0],[1940,920,252,1.55],[1965,210,345,2.6],
 [2000,250,874,2.7],[2040,285,875,2.85],[2070,285,875,2.9],
 [2100,286,875,2.95],[2135,455,937,2.7],[2180,850,941,3.4],
 [2200,850,940,3.45],[2230,720,510,1.0],[2250,1160,184,2.0],
 [2280,228,172,2.85],[2310,228,173,2.9],[2340,238,345,3.65],
 [2370,240,344,3.7],[2390,530,350,1.7],
 [2400,720,435,1.2],[2445,720,380,.76],[2480,720,375,.78],[2519,720,373,.79],
].map(([frame,x,y,s])=>({frame,x,y,s}));

type AttackName=keyof typeof attacks;
const cue=(id:string,target:number,name:AttackName,volume:number,duration?:number)=>({id,src:`audio/${name}.wav`,from:Math.max(0,Math.round(target-attacks[name].peakFrames-AUDIO_OUTPUT_OFFSET)),target,volume,duration:duration??Math.min(30,Math.ceil(attacks[name].duration*FPS)),label:id});
export const SFX=[
 cue('Files arrive in the import area',95,'paper-slide',.36,22),
 cue('Complete classification',300,'switch-light',.3),
 cue('Keep the revised Maya draft',432,'switch-click-quick',.36),
 cue('Open continuous Preview',540,'paper-page-turn',.29,25),
 cue('Select the next thumbnail',605,'switch-light',.22),
 cue('Return to Maya',650,'switch-click-quick',.2),
 cue('Enable native inline editing',720,'switch-light',.26),
 cue('Type M',762,'typewriter-hit-soft',.22,5),
 cue('Type a',768,'typewriter-hit-single',.2,5),
 cue('Type y',774,'typewriter-hit-soft',.18,5),
 cue('Type a final',780,'typewriter-hit-single',.16,5),
 cue('Apply bold to the selected phrase',835,'switch-click-quick',.22),
 cue('Save the corrected message',885,'switch-click-quick',.32),
 cue('Confirm the reviewed draft',930,'switch-light',.22),
 cue('Match attachment filenames',1090,'switch-light',.31),
 cue('Open institution scheduling',1230,'paper-slide',.25,20),
 cue('Set the recipient region',1265,'switch-click-quick',.2),
 cue('Set seven-day same-office spacing',1375,'switch-light',.22),
 cue('Apply the separated send dates',1425,'switch-click-quick',.34),
 cue('Nora lands in the later send-day slot',1488,'paper-slide',.24,20),
 cue('Choose the new brief',1660,'paper-slide',.27,20),
 cue('Update three scheduled drafts',1710,'switch-click-quick',.32),
 cue('Verify the first replacement',1745,'switch-light',.18),
 cue('Complete the verified batch',1843,'switch-click-quick',.27),
 cue('Read the observed mailbox',1950,'switch-light',.22),
 cue('Sync Alex’s human reply',2070,'switch-click-quick',.29),
 cue('Alex’s human reply arrives',2080,'paper-page-turn',.28,22),
 cue('Open the contact-level outcome',2250,'paper-page-turn',.2,24),
];
export const BGM={id:'original-score',label:'Original campaign score · 120 BPM',src:'audio/original-score.wav',from:0,duration:TOTAL,volume:.54};
