import {useEffect,useRef} from "react";
import type {ThunderCardView} from "../application/thunderfighter-card-view.ts";
import type {Locale} from "../i18n/language.ts";
function Ship({card}:{card:ThunderCardView}){
 const hull=card.figure?"M10 64L35 36 45 12 55 36 90 64 65 62 50 86 35 62Z":card.special?"M50 8L83 50 50 92 17 50Z":card.suit==="hearts"?"M50 8L66 46 92 76 61 65 50 90 39 65 8 76 34 46Z":card.suit==="diamonds"?"M50 8L85 65 62 58 50 90 38 58 15 65Z":card.suit==="clubs"?"M50 8L64 30 84 25 92 75 59 64 50 90 41 64 8 75 16 25 36 30Z":"M50 8L62 42 90 48 75 78 58 63 50 92 42 63 25 78 10 48 38 42Z";
 return <svg className="tf-ship" viewBox="0 0 100 100" aria-hidden="true"><path d={hull} fill="currentColor" stroke="#d2e0e5" strokeWidth="1.5"/><path d="M50 20L56 49 50 60 44 49Z" fill="#152f42" stroke="#e9c18c"/><path d="M44 69L50 91 56 69" fill="#f0a761"/><path d="M25 55L39 50M61 50L75 55" stroke="#132638" strokeWidth="3"/></svg>;
}
export function ThunderTacticalCard({card,locale,onInspect}:{card:ThunderCardView;locale:Locale;onInspect:()=>void}){
 const en=locale==="en";
 return <button type="button" className="thunder-card tf-tactical" data-i18n-ignore data-card-id={card.id} data-figure={card.figure||undefined} data-defeated={card.defeated||undefined} data-suit={card.suit??"joker"} onClick={onInspect} aria-haspopup="dialog" aria-label={card.label+", "+(card.defeated?(en?"neutralized":"neutralisé"):card.figure?(en?"resistance ":"résistance ")+card.resistance:card.role)+", "+(en?"view card":"voir la carte")}>
 <span className="tf-card-corner"><strong>{card.compact}</strong><span>{card.symbol}</span></span><Ship card={card}/><span className="tf-card-bottom">{card.defeated?"✓":card.figure?<>{card.resistance}{card.armor>0?<small> +{card.armor}</small>:null}</>:card.special?(card.rank===1?"↧":"↔"):card.value}</span>
 </button>;
}
export function ThunderCardDetail({card,locale,onClose}:{card:ThunderCardView;locale:Locale;onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null),close=useRef<HTMLButtonElement>(null),en=locale==="en";
 useEffect(()=>{const node=dialog.current;if(!node)return;node.showModal();close.current?.focus();return()=>{if(node.open)node.close();};},[]);
 return <dialog ref={dialog} className="tf-card-detail" data-i18n-ignore data-card-id={card.id} aria-labelledby="tf-detail-title" onCancel={event=>{event.preventDefault();event.stopPropagation();onClose();}} onKeyDown={event=>{if(event.key==="Escape"){event.stopPropagation();event.preventDefault();onClose();}}}>
 <header><h2 id="tf-detail-title">{card.label}</h2><button ref={close} type="button" aria-label={en?"Close card":"Fermer la carte"} onClick={onClose}>×</button></header>
 <div className="tf-detail-art" data-figure={card.figure||undefined} data-suit={card.suit??"joker"}><span>{card.compact} {card.symbol}</span><Ship card={card}/><strong>{card.role}</strong></div>
 <dl>{card.figure?<><div><dt>{en?"Base resistance":"Résistance initiale"}</dt><dd>{card.rank}</dd></div><div><dt>{en?"Armor":"Armure"}</dt><dd>{card.armor}</dd></div><div><dt>{en?"Current resistance":"Résistance actuelle"}</dt><dd>{card.resistance}</dd></div><div><dt>{en?"Status":"État"}</dt><dd>{card.defeated?(en?"Neutralized":"Neutralisé"):(en?"Active":"Actif")}</dd></div></>:card.special?<div><dt>{en?"Action":"Action"}</dt><dd>{card.rank===1?(en?"Extraction":"Extraction"):(en?"Reassignment":"Réaffectation")}</dd></div>:<div><dt>{en?"Value":"Valeur"}</dt><dd>{card.value}</dd></div>}</dl>
 <p>{card.rule}</p></dialog>;
}
