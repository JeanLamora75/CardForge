import {useEffect,useRef} from "react";
import type {PointerEvent} from "react";
export interface GrimDelveCardProps {
 label:string;title:string;value:number;faction:string;symbol:string;monster:boolean;
 selected?:boolean;target?:boolean;ready?:boolean;triggerable?:boolean;onDrag?:(phase:"start"|"move"|"end"|"cancel",x:number,y:number)=>void;disabled?:boolean;onClick?:()=>void;
 illustration:string;frame:string;emblem?:string;onInspect:()=>void;inspectLabel:string;
}
export default function GrimDelveCard({label,title,value,faction,symbol,monster,selected=false,target=false,ready=false,triggerable=false,onDrag,disabled=false,onClick,illustration,frame,emblem,onInspect,inspectLabel}:GrimDelveCardProps){
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const origin=useRef<{x:number;y:number}|null>(null);
 const consumed=useRef(false);
 const dragging=useRef(false);
 function cancel(){if(timer.current!==null){clearTimeout(timer.current);timer.current=null;}origin.current=null;}
 useEffect(()=>()=>{if(timer.current!==null)clearTimeout(timer.current);},[]);
 function down(e:PointerEvent<HTMLButtonElement>){
   cancel();consumed.current=false;dragging.current=false;
   if(!e.isPrimary||e.button!==0)return;
   if(onDrag&&!disabled){origin.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId);}
   if(e.pointerType==="touch")timer.current=setTimeout(()=>{consumed.current=true;cancel();onInspect();},550);
 }
 function move(e:PointerEvent<HTMLButtonElement>){
   if(dragging.current){onDrag?.("move",e.clientX,e.clientY);return;}
   if(origin.current&&Math.hypot(e.clientX-origin.current.x,e.clientY-origin.current.y)>10){
      cancel();if(onDrag&&!disabled){dragging.current=true;consumed.current=true;onDrag("start",e.clientX,e.clientY);}
   }
 }
 function up(e:PointerEvent<HTMLButtonElement>){
   cancel();if(dragging.current){dragging.current=false;onDrag?.("end",e.clientX,e.clientY);}
 }
 function abort(e:PointerEvent<HTMLButtonElement>){
   cancel();if(dragging.current){dragging.current=false;onDrag?.("cancel",e.clientX,e.clientY);}
 }
 return <div className="gd-card-shell">
 <button type="button" className="grim-card" data-i18n-ignore data-draggable={!!onDrag&&!disabled} data-monster={monster||undefined} data-faction={faction} data-target={target||undefined} data-ready={ready||undefined}
 aria-pressed={onClick?selected:undefined} aria-label={label} aria-disabled={disabled||!onClick}
 onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={abort} onLostPointerCapture={abort} onPointerLeave={()=>{if(!dragging.current&&!onDrag)cancel();}}
 onContextMenu={e=>{if(consumed.current)e.preventDefault();}}
 onClick={e=>{if(consumed.current&&e.detail!==0){consumed.current=false;return;}if(!disabled&&onClick)onClick();}}>
 <span className="gd-card-art" aria-hidden="true"><img src={illustration} alt="" draggable={false}/></span>
 <span className="gd-card-frame" aria-hidden="true"><img src={frame} alt="" draggable={false}/></span>
 <span className="gd-card-data"><span className="gd-card-value" aria-hidden="true">{value}</span><span className="gd-card-suit" aria-hidden="true">{emblem?<img src={emblem} alt="" draggable={false}/>:<span>{symbol}</span>}</span><strong>{title}</strong></span>
 {selected||target||ready||triggerable?<span className="gd-state-mark" aria-hidden="true">{selected?"✓":target?"◎":triggerable?"⚡":"✓"}</span>:null}
 </button>
 <button type="button" data-i18n-ignore className="gd-inspect-button" aria-label={inspectLabel} title={inspectLabel} onClick={onInspect}>⌕</button>
 </div>;
}
