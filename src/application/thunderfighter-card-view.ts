import {makeDeckWithJokers} from "../core/cards.ts";
import type {ThunderfighterState} from "../games/gridcannon/engine.ts";
import type {Locale} from "../i18n/language.ts";
const cards=new Map(makeDeckWithJokers().map(c=>[c.id,c]));
const factions={hearts:["♥","Cœur","Hearts"],diamonds:["♦","Carreau","Diamonds"],clubs:["♣","Trèfle","Clubs"],spades:["♠","Pique","Spades"]} as const;
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
 const rankName=rank===1?(en?"Ace":"As"):rank===11?(en?"Jack":"Valet"):rank===12?(en?"Queen":"Dame"):rank===13?(en?"King":"Roi"):String(rank);
 const label=joker?"Joker":rankName+(en?" of ":" de ")+faction![en?2:1];
 const role=figure?(en?"Enemy":"Adversaire"):special?(en?"Special action":"Action spéciale"):(en?"Fighter":"Chasseur");
 const rule=rank===11?(en?"All suits contribute to the attack.":"Toutes les enseignes contribuent au tir."):rank===12?(en?"Only cards of the same colour contribute.":"Seules les cartes de même couleur contribuent.") :rank===13?(en?"Only cards of the same suit contribute.":"Seules les cartes de même enseigne contribuent.") :joker?(en?"Move the top card of a pile to a legal destination.":"Déplacez la carte supérieure d’une pile vers une destination autorisée.") :rank===1?(en?"Return an entire pile to the bottom of the deck.":"Replacez une pile entière sous la pioche.") : (en?"Place on a pile of equal or lower value.":"Posez sur une pile de valeur égale ou inférieure.");
 return {id,rank,suit,symbol:faction?.[0]??"★",label,role,rule,figure,special,defeated,armor,resistance:figure?rank!+armor:null,value:special?null:rank,compact:joker?"★":rank===1?"A":rank===11?"J":rank===12?"Q":rank===13?"K":String(rank)};
}
export type ThunderCardView=NonNullable<ReturnType<typeof thunderCardView>>;
