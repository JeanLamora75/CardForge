import {makeDeckWithJokers} from "../core/cards.ts";
import type {ThunderfighterState} from "../games/gridcannon/engine.ts";
import type {Locale} from "../i18n/language.ts";
const cards=new Map(makeDeckWithJokers().map(c=>[c.id,c]));
const factions={hearts:["Nova","phoenix"],diamonds:["Vector","phoenix"],clubs:["Solaris","orion"],spades:["Aegis","orion"]} as const;
export function thunderCardLabel(id:string,locale:Locale="fr"){
 const card=cards.get(id),en=locale==="en";
 if(!card)return id;
 if("kind" in card)return (en?"Singularity ":"Singularité ")+id.slice(-1);
 const rank=card.rank;
 const name=rank===1?"Alpha":rank===11?"Lieutenant":rank===12?(en?"Commander":"Commandant"):rank===13?(en?"Admiral":"Amiral"):String(rank);
 return name+" · "+factions[card.suit][0];
}
export function visibleThunderCards(state:ThunderfighterState, revealed:readonly string[]=[]):Set<string>{
 return new Set([...state.grid.flatMap(p=>p.length?[p[p.length-1]]:[]),...state.figureSlots.filter((id):id is string=>id!==null),...state.specialReserve,...state.pendingFigures.slice(0,1),...(state.pendingNumeric?[state.pendingNumeric]:[]),...revealed]);
}
export function thunderCardView(state:ThunderfighterState,id:string,locale:Locale,revealed:readonly string[]=[]){
 if(!visibleThunderCards(state,revealed).has(id))return null;
 const card=cards.get(id);if(!card)return null;
 const en=locale==="en",joker="kind" in card,rank=joker?null:card.rank;
 const suit=joker?null:card.suit,figure=rank!==null&&rank>=11, special=joker||rank===1;
 const faction=suit?factions[suit]:null;
 const defeated=figure&&(state.defeatedFigures??[]).includes(id);
 const armor=figure?(state.armorCards??[]).filter(a=>a.figureId===id).reduce((sum,a)=>{const c=cards.get(a.cardId);return sum+(c&&"rank" in c?c.rank:10)},0):0;
 const label=thunderCardLabel(id,locale);
 const role=figure?(en?"Enemy":"Adversaire"):special?(en?"Special action":"Action spéciale"):(en?"Fighter":"Chasseur");
 const rule=rank===11?(en?"All factions contribute to the attack.":"Toutes les factions contribuent au tir."):rank===12?(en?"Only cards of the same alliance contribute.":"Seules les cartes de la même alliance contribuent.") :rank===13?(en?"Only cards of the same faction contribute.":"Seules les cartes de la même faction contribuent.") :joker?(en?"Move the top card of a pile to a legal destination.":"Déplacez la carte supérieure d’une pile vers une destination autorisée.") :rank===1?(en?"Return an entire pile to the bottom of the deck.":"Replacez une pile entière sous la pioche.") : (en?"Place on a pile of equal or lower value.":"Posez sur une pile de valeur égale ou inférieure.");
 return {id,rank,suit,faction:faction?.[0]??null,alliance:faction?.[1]??null,label,role,rule,figure,special,defeated,armor,resistance:figure?rank!+armor:null,value:special?null:rank,compact:joker?"S":rank===1?"α":rank===11?"L":rank===12?"C":rank===13?"A":String(rank)};
}
export type ThunderCardView=NonNullable<ReturnType<typeof thunderCardView>>;
