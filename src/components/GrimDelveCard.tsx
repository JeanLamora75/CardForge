import {useEffect,useRef} from "react";
import type {PointerEvent} from "react";
export interface GrimDelveCardProps {
 label:string;title:string;value:number;faction:string;symbol:string;monster:boolean;
 selected?:boolean;target?:boolean;ready?:boolean;disabled?:boolean;onClick?:()=>void;
 illustration:string;frame:string;emblem?:string;onInspect:()=>void;inspectLabel:string;
}
export default function GrimDelveCard({label,title,value,faction,symbol,monster,selected=false,target=false,ready=false,disabled=false,onClick,illustration,frame,emblem,onInspect,inspectLabel}:GrimDelveCardProps){
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const origin=useRef<{x:number;y:number}|null>(null);
 const consumed=useRef(false);
 function cancel(){if(timer.current!==null){clearTimeout(timer.current);timer.current=null;}origin.current=null;}
 useEffect(()=>()=>{if(timer.current!==null)clearTimeout(timer.current);},[]);
 function down(e:PointerEvent<HTMLButtonElement>){
   cancel();consumed.current=false;
   if(e.pointerType!=="touch"||!e.isPrimary)return;
   origin.current={x:e.clientX,y:e.clientY};
   timer.current=setTimeout(()=>{consumed.current=true;cancel();onInspect();},550);
 }
 function move(e:PointerEvent<HTMLButtonElement>){if(origin.current&&Math.hypot(e.clientX-origin.current.x,e.clientY-origin.current.y)>10)cancel();}
 return <div className="gd-card-shell">
 <button type="button" className="grim-card" data-i18n-ignore data-monster={monster||undefined} data-faction={faction} data-target={target||undefined} data-ready={ready||undefined}
 aria-pressed={onClick?selected:undefined} aria-label={label} aria-disabled={disabled||!onClick}
 onPointerDown={down} onPointerMove={move} onPointerUp={cancel} onPointerCancel={cancel} onPointerLeave={cancel}
 onContextMenu={e=>{if(consumed.current)e.preventDefault();}}
 onClick={e=>{if(consumed.current&&e.detail!==0){consumed.current=false;return;}if(!disabled&&onClick)onClick();}}>
 <span className="gd-card-art" aria-hidden="true"><img src={illustration} alt="" draggable={false}/></span>
 <span className="gd-card-frame" aria-hidden="true"><img src={frame} alt="" draggable={false}/></span>
 <span className="gd-card-data"><span className="gd-card-value" aria-hidden="true">{value}</span><span className="gd-card-suit" aria-hidden="true">{emblem?<img src={emblem} alt="" draggable={false}/>:<span>{symbol}</span>}</span><strong>{title}</strong></span>
 {selected||target||ready?<span className="gd-state-mark" aria-hidden="true">{selected?"✓":target?"◎":"⚡"}</span>:null}
 </button>
 <button type="button" data-i18n-ignore className="gd-inspect-button" aria-label={inspectLabel} title={inspectLabel} onClick={onInspect}>⌕</button>
 </div>;
}
