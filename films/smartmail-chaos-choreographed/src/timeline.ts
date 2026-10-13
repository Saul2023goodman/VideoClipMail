import attacks from '../public/audio/analysis.json';
export const FPS = 30;
const durations = [150,150,120,150,180,120,180,120,150,120,180];
const ids = ['signal','sources','dedupe','preview','detail','attachments','schedule','maintenance','monitor','performance','launch'] as const;
export type ShotId = typeof ids[number];
export const SHOTS = ids.map((id,i) => ({id,from:durations.slice(0,i).reduce((a,b)=>a+b,0),duration:durations[i]}));
export const TOTAL = durations.reduce((a,b)=>a+b,0);
export const shot = (id:ShotId) => SHOTS.find(s=>s.id===id)!;
export const at = (id:ShotId,frame:number) => shot(id).from+frame;
export const CAPTIONS = [
 {id:'signal',text:'One message. A deliberate workflow.',start:38},
 {id:'sources',text:'Mail, rosters and attachments. Classified together.',start:70},
 {id:'dedupe',text:'Compare versions. Keep the message you mean.',start:26},
 {id:'preview',text:'Thumbnail navigation. Continuous pages. Full context.',start:42},
 {id:'detail',text:'Native highlights. Editing in place.',start:50},
 {id:'attachments',text:'Match filenames. Choose exactly which mail.',start:30},
 {id:'schedule',text:'Local time. Institution limits. Room between sends.',start:40},
 {id:'maintenance',text:'Replace attachments. Keep content and send times.',start:24},
 {id:'monitor',text:'A human reply changes the next step.',start:34},
 {id:'performance',text:'Reach. Follow-up depth. Human conversations.',start:24},
].map(c=>({ ...c,from:at(c.id as ShotId,c.start),duration:shot(c.id as ShotId).duration-c.start-8 }));

// Peak timings are relative to the same SHOTS table. Audio preparation measures
// each source attack; final render QA measures the common output offset separately.
export const SFX_EVENTS = [
 {shot:'signal',peak:20,file:'paper-slide',volume:.45,length:60},
 {shot:'signal',peak:92,file:'switch-click-quick',volume:.65,length:18},
 ...[12,22,31,39,46].map((f,i)=>({shot:'sources',peak:f+12,file:i%2?'switch-light':'switch-click-quick',volume:.44-.03*i,length:12})),
 {shot:'dedupe',peak:27,file:'switch-click-quick',volume:.75,length:18},
 {shot:'preview',peak:22,file:'paper-page-turn',volume:.32,length:52},
 {shot:'detail',peak:45,file:'switch-light',volume:.6,length:15},
 {shot:'detail',peak:62,file:'marker-pen-line',volume:.45,length:28},
 {shot:'detail',peak:124,file:'paper-slide',volume:.26,length:28},
 {shot:'attachments',peak:32,file:'switch-click-quick',volume:.66,length:20},
 {shot:'schedule',peak:42,file:'switch-light',volume:.6,length:16},
 {shot:'schedule',peak:90,file:'paper-slide',volume:.25,length:30},
 {shot:'maintenance',peak:30,file:'paper-slide',volume:.35,length:35},
 {shot:'monitor',peak:35,file:'switch-click-quick',volume:.5,length:18},
 {shot:'performance',peak:30,file:'switch-light',volume:.5,length:18},
 {shot:'launch',peak:40,file:'original-riser',volume:.7,length:34},
 {shot:'launch',peak:42,file:'impact-deep-whoosh',volume:.9,length:100},
 {shot:'launch',peak:68,file:'shimmer-sparkle-sweep',volume:.24,length:85},
] as const;
export const AUDIO_OUTPUT_OFFSET = 0; // Replaced only after this pipeline is measured.
export const SFX = SFX_EVENTS.map((e,i)=>({
 id:`sfx-${i}`,from:Math.max(0,at(e.shot as ShotId,e.peak)-Math.round(attacks[e.file as keyof typeof attacks].peakFrames)-AUDIO_OUTPUT_OFFSET),
 duration:e.length,src:`audio/${e.file}.wav`,volume:e.volume,
 target:at(e.shot as ShotId,e.peak),
}));
export const BGM = {from:0,duration:TOTAL,src:'audio/original-score.wav',volume:0.72};
