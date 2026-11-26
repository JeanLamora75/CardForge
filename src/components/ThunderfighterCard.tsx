import {useEffect,useRef} from "react";
import type {ThunderCardView} from "../application/thunderfighter-card-view.ts";
import type {Locale} from "../i18n/language.ts";
import {thunderArt} from "../application/thunderfighter-art.ts";
export function ThunderAlliance({alliance}:{alliance:ThunderCardView["alliance"]}){
 if(!alliance)return null;
 return <svg className="tf-alliance" viewBox="0 0 100 100" aria-hidden="true" fill="currentColor">{alliance==="phoenix"?<path d="M50 5 59 35 50 86 41 35Z M39 34 0 12 12 41 39 54Z M61 34 100 12 88 41 61 54Z M39 60 12 46 27 72 45 84Z M61 60 88 46 73 72 55 84Z"/>:<path d="M38 4H62L50 22Z M5 20 50 47 95 20V37L50 65 5 37Z M5 48 50 75 95 48V65L50 93 5 65Z"/>}</svg>;
}
export function ThunderCardFace({card}:{card:ThunderCardView}){
 return <><Ship card={card}/><span className="tf-card-corner"><strong>{card.compact}</strong><ThunderAlliance alliance={card.alliance}/></span>{(card.figure||card.special)?<span className="tf-card-bottom">{card.defeated?"✓":card.figure?<>{card.resistance}{card.armor>0?<small> ◇</small>:null}</>:card.rank===1?"↧":"↔"}</span>:null}</>;
}
function Ship({card}:{card:ThunderCardView}){return <img className="tf-ship" src={thunderArt[card.id]} alt="" aria-hidden="true" draggable={false}/>;}
export function ThunderTacticalCard({card,locale,onInspect}:{card:ThunderCardView;locale:Locale;onInspect:()=>void}){
 const en=locale==="en";
 return <button type="button" className="thunder-card tf-tactical" data-i18n-ignore data-card-id={card.id} data-figure={card.figure||undefined} data-defeated={card.defeated||undefined} data-suit={card.suit??"joker"} onClick={onInspect} aria-haspopup="dialog" aria-label={card.label+", "+(card.defeated?(en?"neutralized":"neutralisé"):card.figure?(en?"resistance ":"résistance ")+card.resistance:card.role)+", "+(en?"view card":"voir la carte")}>
 <ThunderCardFace card={card}/>
 </button>;
}
export function ThunderCardDetail({card,locale,onClose}:{card:ThunderCardView;locale:Locale;onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null),close=useRef<HTMLButtonElement>(null),en=locale==="en";
 useEffect(()=>{const node=dialog.current;if(!node)return;node.showModal();close.current?.focus();return()=>{if(node.open)node.close();};},[]);
 return <dialog ref={dialog} className="tf-card-detail" data-i18n-ignore data-card-id={card.id} aria-labelledby="tf-detail-title" onCancel={event=>{event.preventDefault();event.stopPropagation();onClose();}} onKeyDown={event=>{if(event.key==="Escape"){event.stopPropagation();event.preventDefault();onClose();}}}>
 <header><h2 id="tf-detail-title">{card.label}</h2><button ref={close} type="button" aria-label={en?"Close card":"Fermer la carte"} onClick={onClose}>×</button></header>
 <div className="tf-detail-art" data-defeated={card.defeated||undefined} data-figure={card.figure||undefined} data-suit={card.suit??"joker"}><ThunderCardFace card={card}/></div>
 <dl>{card.faction?<><div><dt>Faction</dt><dd>{card.faction}</dd></div><div><dt>Alliance</dt><dd>{card.alliance==="phoenix"?"Phoenix":"Orion"}</dd></div></>:null}{card.figure?<><div><dt>{en?"Base resistance":"Résistance initiale"}</dt><dd>{card.rank}</dd></div><div><dt>{en?"Armor":"Armure"}</dt><dd>{card.armor}</dd></div><div><dt>{en?"Current resistance":"Résistance actuelle"}</dt><dd>{card.resistance}</dd></div><div><dt>{en?"Status":"État"}</dt><dd>{card.defeated?(en?"Neutralized":"Neutralisé"):(en?"Active":"Actif")}</dd></div></>:card.special?<div><dt>{en?"Action":"Action"}</dt><dd>{card.rank===1?(en?"Extraction":"Extraction"):(en?"Reassignment":"Réaffectation")}</dd></div>:<div><dt>{en?"Value":"Valeur"}</dt><dd>{card.value}</dd></div>}</dl>
 <p>{card.rule}</p></dialog>;
}
