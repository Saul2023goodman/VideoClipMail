import React from 'react';
import {Img,staticFile,spring} from 'remotion';
import {bezier,EASE,mix,ramp,softShadow} from './Polish';
import {COLORS as C} from '../timeline';

export const clamp=(v:number)=>Math.max(0,Math.min(1,v));
export const outCubic=(v:number)=>1-Math.pow(1-clamp(v),3);
export const inCubic=(v:number)=>Math.pow(clamp(v),3);
export const inOutCubic=(v:number)=>v<.5?4*v*v*v:1-Math.pow(-2*v+2,3)/2;
export const outQuad=(v:number)=>1-Math.pow(1-clamp(v),2);
export const outBack=bezier(.34,1.45,.64,1);
export const pop=(f:number,start:number,damping=15,stiffness=190)=>f<start?0:spring({frame:f-start,fps:30,config:{damping,stiffness}});
export const place=(x:number,y:number,w?:number,h?:number):React.CSSProperties=>({position:'absolute',left:x,top:y,width:w,height:h});
export const words=(text:string,f:number,start:number,per=2.2)=>text.slice(0,Math.max(0,Math.floor((f-start)*per)));

export const Sheet:React.FC<{x:number;y:number;w:number;h:number;children?:React.ReactNode;style?:React.CSSProperties;shadow?:boolean}>=({x,y,w,h,children,style,shadow=true})=><div style={{...place(x,y,w,h),boxSizing:'border-box',background:'linear-gradient(155deg,#fff,#fcfdff)',border:'1px solid #dfe5ec',borderRadius:10,boxShadow:shadow?softShadow(24,{color:C.night,strength:.85}):undefined,...style}}>{children}</div>;
export const Type:React.FC<{x?:number;y?:number;w?:number;size?:number;color?:string;weight?:number;children?:React.ReactNode;style?:React.CSSProperties}>=({x=0,y=0,w,size=56,color=C.ink,weight=700,children,style})=><div style={{...place(x,y,w),fontSize:size,lineHeight:1.18,fontWeight:weight,color,letterSpacing:'-.025em',whiteSpace:w?'pre-line':'nowrap',...style}}>{children}</div>;
export const Kicker:React.FC<{x?:number;y?:number;children:React.ReactNode;style?:React.CSSProperties}>=({x=110,y=92,children,style})=><Type x={x} y={y} size={32} color={C.muted} weight={400} style={{letterSpacing:'.025em',...style}}>{children}</Type>;
export const Line:React.FC<{d:string;p?:number;color?:string;width?:number;opacity?:number}>=({d,p=1,color=C.blue,width=3,opacity=1})=><svg width={1920} height={1080} style={{...place(0,0),pointerEvents:'none',overflow:'visible',opacity}}><path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1-clamp(p)}/></svg>;
export const Tick:React.FC<{p?:number;size?:number;color?:string}>=({p=1,size=36,color=C.green})=><svg width={size} height={size} viewBox="0 0 30 30"><path d="m4 15 8 8L27 4" fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1-clamp(p)}/></svg>;
export const Cursor:React.FC<{x:number;y:number;press?:number}>=({x,y,press=0})=><svg width={42} height={48} viewBox="0 0 24 28" style={{...place(x,y),transform:'scale('+(1-.14*press)+')',filter:'drop-shadow(0 3px 3px #08142244)'}}><path d="M2 2v21l5-5 5 9 4-2-5-9h8Z" fill={C.ink} stroke="white" strokeWidth={1.6}/></svg>;
export const FileIcon:React.FC<{kind?:string;color?:string;size?:number}>=({kind='PDF',color=C.blue,size=70})=><svg width={size} height={size*1.16} viewBox="0 0 70 82"><path d="M9 2h35l17 17v57a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4Z" fill="#f6f9ff" stroke={color} strokeWidth={2}/><path d="M44 2v17h17" fill="#e6efff" stroke={color} strokeWidth={2}/><text x="33" y="55" fill={color} textAnchor="middle" style={{fontSize:18,fontWeight:700,fontFamily:'OpenFilm'}}>{kind}</text></svg>;
export const NativeImage:React.FC<{name:string;style?:React.CSSProperties}>=({name,style})=><Img src={staticFile('native/'+name)} style={style}/>;

// Exact scanline-annotate-focus: uniform sweep; bbox-bottom causes the bracket,
// then its arm shortens 3f later, then type follows 5f later. No cue by list order.
export const ScanBracket:React.FC<{f:number;at:number;x:number;y:number;w:number;h:number;color?:string}>=({f,at,x,y,w,h,color=C.blue})=>{
 const s=pop(f,at,15,210),arm=mix(40,26,pop(f,at+3,15,210)),off=76*(1-s),flash=.075*ramp(f,at+3,3,EASE.out)*(1-ramp(f,at+12,6));
 if(f<at)return null;
 const cs=arm;return <div style={{...place(x-off,y-off,w+off*2,h+off*2),opacity:clamp(s),background:'rgba(23,105,224,'+flash+')'}}>
  {[0,1,2,3].map(i=><svg key={i} width={cs} height={cs} viewBox={'0 0 '+cs+' '+cs} style={{position:'absolute',left:i%2?undefined:0,right:i%2?0:undefined,top:i<2?0:undefined,bottom:i>=2?0:undefined,transform:'rotate('+([0,90,270,180][i])+'deg)'}}><path d={'M'+cs+' 1H1V'+cs} stroke={color} strokeWidth={2.5} fill="none"/></svg>)}
 </div>;
};

export type Pt={x:number;y:number};
export const quad=(a:Pt,c:Pt,z:Pt,t:number)=>({x:(1-t)*(1-t)*a.x+2*(1-t)*t*c.x+t*t*z.x,y:(1-t)*(1-t)*a.y+2*(1-t)*t*c.y+t*t*z.y});
// Exact deterministic 1600-sample arc-length lookup from BezierSourceConvergeMerge.
// Reparameterize geometry to document-sized ports rather than generic logo nodes.
export const makeCurve=(start:Pt,end:Pt)=>{
 const lead=150,p0={x:start.x+lead,y:start.y},p1={x:start.x+lead+270,y:start.y},p2={x:end.x-280,y:end.y};
 const cubic=(u:number):Pt=>{const v=1-u;return{x:v*v*v*p0.x+3*v*v*u*p1.x+3*v*u*u*p2.x+u*u*u*end.x,y:v*v*v*p0.y+3*v*v*u*p1.y+3*v*u*u*p2.y+u*u*u*end.y};};
 const cum=[0];let prev=p0,acc=0;for(let k=1;k<=1600;k++){const p=cubic(k/1600);acc+=Math.hypot(p.x-prev.x,p.y-prev.y);cum.push(acc);prev=p;}
 const len=lead+acc;
 const pointAt=(s:number):Pt=>{s=Math.max(0,Math.min(len,s));if(s<=lead)return{x:start.x+s,y:start.y};const target=s-lead;let lo=0,hi=1600;while(lo<hi){const mid=(lo+hi)>>1;if(cum[mid]<target)lo=mid+1;else hi=mid;}const i=Math.max(1,lo),u=(i-1+(target-cum[i-1])/(cum[i]-cum[i-1]))/1600;return cubic(u);};
 return{len,pointAt,f0:lead/len,d:'M'+start.x+' '+start.y+'L'+p0.x+' '+p0.y+'C'+p1.x+' '+p1.y+' '+p2.x+' '+p2.y+' '+end.x+' '+end.y};
};

export const GroundShadows:React.FC<{x:number;y:number;w:number;h:number;lift:number}>=({x,y,w,h,lift})=><>
 <div style={{...place(x+10+40*lift,y+16+60*lift,w,h),borderRadius:10,background:C.night,opacity:.09+.13*lift,filter:'blur('+(14+40*lift)+'px)',transform:'scale('+(1+.05*lift)+')'}}/>
 <div style={{...place(x+2+18*lift,y+4+36*lift,w,h),borderRadius:10,background:C.night,opacity:.32-.18*lift,filter:'blur('+(3+22*lift)+'px)',transform:'scale('+(1+.01*lift)+')'}}/>
</>;
