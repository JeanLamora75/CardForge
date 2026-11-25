import {useEffect,useRef} from "react";
import type {ThunderCardView} from "../application/thunderfighter-card-view.ts";
import type {Locale} from "../i18n/language.ts";
import {thunderArt} from "../application/thunderfighter-art.ts";
function Ship({card}:{card:ThunderCardView}){return <img className="tf-ship" src={thunderArt[card.id]} alt="" aria-hidden="true" draggable={false}/>;}
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
