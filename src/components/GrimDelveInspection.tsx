import {useEffect,useRef} from "react";
import type {Locale} from "../i18n/language.ts";
import type {grimCardView} from "../application/grim-delve-art.ts";
export default function GrimDelveInspection({view,language,onClose}:{view:ReturnType<typeof grimCardView>;language:Locale;onClose:()=>void}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const dialog=ref.current;if(!dialog)return;const previous=document.activeElement as HTMLElement|null;dialog.showModal();return()=>{if(dialog.open)dialog.close();previous?.focus();};},[]);
 const url=(path:string)=>import.meta.env.BASE_URL+"art/"+path;
 const fr=language==="fr";
 return <dialog ref={ref} className="gd-inspection" data-i18n-ignore aria-labelledby="gd-inspection-title" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
 <div className="gd-inspection-content">
 <header><h2 id="gd-inspection-title">{view.title}</h2><button type="button" onClick={onClose} aria-label={fr?"Fermer":"Close"} autoFocus>×</button></header>
 <div className="gd-inspection-art"><img src={url(view.illustration)} alt={view.title}/><img src={url(view.frame)} alt="" aria-hidden="true"/></div>
 <div className="gd-inspection-faction">{view.emblem?<img src={url(view.emblem)} alt=""/>:null}<strong>{view.symbol} {view.factionName}</strong></div>
 <p>{view.monster?(fr?"Résistance":"Resistance"):(fr?"Puissance":"Power")} : <strong>{view.value}</strong>{view.faction==="joker"?(fr?" · Enseigne libre":" · Wild suit"):""}</p>
 </div></dialog>;
}
