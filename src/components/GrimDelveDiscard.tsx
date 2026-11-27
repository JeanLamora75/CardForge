import {useEffect,useRef} from "react";
import type {Locale} from "../i18n/language.ts";
export default function GrimDelveDiscard({language,count,damage,onCancel,onConfirm}:{language:Locale;count:number;damage:number;onCancel:()=>void;onConfirm:()=>void}){
 const ref=useRef<HTMLDialogElement>(null);const fr=language==="fr";
 useEffect(()=>{const d=ref.current;if(!d)return;const prior=document.activeElement as HTMLElement|null;d.showModal();return()=>{if(d.open)d.close();prior?.focus();};},[]);
 return <dialog ref={ref} className="gd-inspection gd-discard-dialog" data-i18n-ignore aria-labelledby="gd-discard-title" onCancel={e=>{e.preventDefault();onCancel();}}>
 <div className="gd-inspection-content"><h2 id="gd-discard-title">{fr?"Confirmer la défausse":"Confirm discard"}</h2>
 <p>{fr?"Dégâts irréversibles":"Irreversible damage"} : {damage} → {damage+count} / 7</p>
 <div className="gd-discard-actions"><button type="button" className="secondary-action" onClick={onConfirm}>{fr?"Confirmer":"Confirm"}</button><button type="button" className="primary-action" autoFocus onClick={onCancel}>{fr?"Annuler":"Cancel"}</button></div></div></dialog>;
}
