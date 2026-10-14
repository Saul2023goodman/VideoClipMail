import React from 'react';
import {Easing,Img,staticFile,spring} from 'remotion';
import {TOKENS as T,FPS} from './timeline';
export const clamp=(x:number)=>Math.max(0,Math.min(1,x));
export const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
export const out=Easing.bezier(.16,1,.3,1);
export const smooth=Easing.bezier(.55,0,.18,1);
export const fly=Easing.bezier(.5,0,.8,.75);
export const brake=Easing.bezier(.45,0,.06,1);
export const ramp=(f:number,start:number,duration:number,e=out)=>e(clamp((f-start)/duration));
export const inOut=(f:number,start:number,end:number)=>ramp(f,start,12)*(1-ramp(f,end-10,10));
export const springAt=(f:number,start:number)=>spring({frame:Math.max(0,f-start),fps:FPS,config:{damping:15,stiffness:210}});
export const FontStyles:React.FC=()=> <style>{`@font-face{font-family:Film;src:url(${staticFile('fonts/OpenSans-Regular.ttf')})} @font-face{font-family:Film;src:url(${staticFile('fonts/OpenSans-Bold.ttf')});font-weight:700} @font-face{font-family:Film;src:url(${staticFile('fonts/OpenSans-ExtraBold.ttf')});font-weight:800}`}</style>;
export const Mark:React.FC<{size?:number}>=({size=58})=><Img src={staticFile('native/brand.png')} style={{width:size,height:size,borderRadius:size*.23}}/>;
export const Txt:React.FC<{children:React.ReactNode;x?:number;y?:number;size?:number;color?:string;weight?:number;opacity?:number;w?:number;style?:React.CSSProperties}>=({children,x=0,y=0,size=34,color=T.ink,weight=700,opacity=1,w,style})=><div style={{position:'absolute',left:x,top:y,width:w,fontSize:size,lineHeight:1.3,fontWeight:weight,color,opacity,whiteSpace:w?'normal':'nowrap',letterSpacing:'-.018em',...style}}>{children}</div>;
export const Tag:React.FC<{text:string;x:number;y:number;f:number;start:number;color?:string;size?:number;typed?:boolean}>=({text,x,y,f,start,color=T.scan,size=28,typed=true})=>{
 const ft=f-start,p=ramp(ft,0,9),n=typed?Math.max(0,Math.floor((ft-5)*2.2)):text.length;
 if(ft<0||n===0)return null;
 return <div style={{position:'absolute',left:x,top:y,background:color,color:'#fff',padding:'8px 16px',fontSize:size,fontWeight:700,borderRadius:4,whiteSpace:'nowrap',opacity:p,transform:`translateY(${mix(8,0,p)}px)`}}>{text.slice(0,n)}</div>;
};
export const Bracket:React.FC<{x:number;y:number;w:number;h:number;f:number;start:number;color?:string}>=({x,y,w,h,f,start,color=T.scan})=>{
 if(f<start)return null;const s=springAt(f,start),pad=76*(1-s),a=mix(40,26,ramp(f,start+3,12));
 return <svg style={{position:'absolute',left:x-pad,top:y-pad,overflow:'visible'}} width={w+pad*2} height={h+pad*2}><path d={`M0 ${a}V0H${a} M${w+pad*2-a} 0H${w+pad*2}V${a} M${w+pad*2} ${h+pad*2-a}V${h+pad*2}H${w+pad*2-a} M${a} ${h+pad*2}H0V${h+pad*2-a}`} fill="none" stroke={color} strokeWidth={3.5} opacity={ramp(f,start,3)}/></svg>;
};
export const Check:React.FC<{size?:number;color?:string}>=({size=28,color=T.green})=><svg width={size} height={size} viewBox="0 0 24 24"><path d="M4 12l5 5L20 6" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>;
export const Paper:React.FC<{x:number;y:number;w:number;h:number;children?:React.ReactNode;style?:React.CSSProperties}>=({x,y,w,h,children,style})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,borderRadius:9,background:T.surface,border:`1px solid ${T.line}`,boxShadow:'0 20px 60px #18223012',...style}}>{children}</div>;
export const Token:React.FC<{id:string;x:number;y:number;w?:number;opacity?:number;scale?:number;color?:string}>=({id,x,y,w=152,opacity=1,scale=1,color=T.accent})=><div style={{position:'absolute',left:x,top:y,width:w,height:54,display:'flex',alignItems:'center',justifyContent:'center',border:`1.5px solid ${color}`,borderRadius:7,background:'#fff',fontSize:27,fontWeight:700,color,opacity,transform:`scale(${scale})`,transformOrigin:'0 0'}}>{id}</div>;
export const Line:React.FC<{d:string;p?:number;color?:string;width?:number;opacity?:number}>=({d,p=1,color=T.accent,width=3,opacity=1})=><svg width={1920} height={1080} style={{position:'absolute',inset:0,overflow:'visible',opacity,pointerEvents:'none'}}><path d={d} fill="none" stroke={color} strokeWidth={width} pathLength={1} strokeDasharray="1" strokeDashoffset={1-p} strokeLinecap="round"/></svg>;
export const Cursor:React.FC<{x:number;y:number;press?:number}>=({x,y,press=0})=><svg width={38} height={40} viewBox="0 0 24 24" style={{position:'absolute',left:x,top:y,transform:`scale(${1-.16*press})`,transformOrigin:'3px 2px',filter:'drop-shadow(0 2px 2px #18223033)'}}><path d="M4.5 2.5L4.5 19.2 8.9 15 11.9 21.6 14.9 20.3 11.9 13.8 18.2 13.4Z" fill={T.ink} stroke="#fff" strokeWidth={1.5} strokeLinejoin="round"/></svg>;
export const NativeCrop:React.FC<{src:string;x:number;y:number;w:number;h:number;crop:{x:number;y:number;w:number;h:number};opacity?:number;children?:React.ReactNode}>=({src,x,y,w,h,crop,opacity=1,children})=>{
 const scale=w/crop.w;
 return <div style={{position:'absolute',left:x,top:y,width:w,height:h,overflow:'hidden',opacity,borderRadius:6}}><div style={{position:'absolute',width:1440,height:1000,transformOrigin:'0 0',transform:`translate(${-crop.x*scale}px,${-crop.y*scale}px) scale(${scale})`}}><Img src={staticFile(src)} style={{position:'absolute',inset:0,width:1440,height:1000}}/>{children}</div></div>;
};
