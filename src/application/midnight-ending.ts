import type { MidnightSyndicateAction, MidnightSyndicateState } from "../games/loot-the-loop/engine.ts";
import { midnightCardArt } from "./midnight-card-art.ts";

export function confirmedMidnightThreat(before:Readonly<MidnightSyndicateState>, action:MidnightSyndicateAction, after:Readonly<MidnightSyndicateState>):string|null {
  if(before.outcome!=="in-progress"||action.type!=="explore"||after.outcome!=="loss"||!before.deck.length)return null;
  const target=before.deck[action.distance%before.deck.length];
  return target?.faceUp&&after.deck[0]?.faceUp&&after.deck[0].id===target.id&&midnightCardArt[target.id]?.frame==="burgundy"?target.id:null;
}

const narratives:Readonly<Record<string,readonly [string,string]>>={
"ms-m01-le-parrain":["Votre couverture est compromise. Le syndicat connaît votre identité.","Your cover is blown. The syndicate knows who you are."],
"ms-m02-la-veuve-noire":["Le rendez-vous était un piège. Il est trop tard pour repartir.","The meeting was a trap. It is too late to leave."],
"ms-m03-le-tueur-a-gages":["Le syndicat a retrouvé votre trace. Votre enquête s’arrête ici.","The syndicate has found you. Your investigation ends here."],
"ms-m04-la-balance":["Un informateur a livré votre identité au syndicat.","An informant has exposed your identity to the syndicate."],
"ms-m05-l-embuscade":["Les hommes du syndicat vous attendaient. Cette ruelle sera votre dernière destination.","The syndicate was waiting. This alley is your final destination."],
"ms-m06-la-voiture-piegee":["Le véhicule abandonné dissimulait un piège. Votre mission est compromise.","The abandoned car concealed a trap. Your mission is compromised."],
"ms-m07-le-tireur-de-l-ombre":["Une silhouette surveillait votre passage. Vous avez été repéré.","A shadow was watching your route. You have been spotted."],
"ms-m08-le-guet-apens-des-docks":["Les contrebandiers vous attendaient dans l’entrepôt.","The smugglers were waiting inside the warehouse."],
"ms-m09-le-commissaire-corrompu":["Le commissaire travaille pour le syndicat. Votre couverture est tombée.","The commissioner works for the syndicate. Your cover is blown."],
"ms-m10-le-barrage-de-police":["Le contrôle était organisé pour vous intercepter.","The roadblock was set up to intercept you."],
"ms-m11-le-juge-vereux":["Le magistrat protège le syndicat. Votre enquête est interrompue.","The judge protects the syndicate. Your investigation is halted."],
"ms-m12-l-interrogatoire-clandestin":["Vous êtes conduit dans une salle secrète. La mission est compromise.","You are taken to a secret room. The mission is compromised."]
};
export function midnightEnding(outcome:"win"|"loss",threatId:string|null,language:"fr"|"en"){
 const index=language==="en"?1:0;
 const item=threatId?midnightCardArt[threatId]:undefined;
 if(outcome==="win")return {file:"joker-exfiltration",title:["Exfiltration réussie","Extraction successful"][index],text:["Les quatre preuves sont en sécurité. Votre complice vous attend : quittez la ville.","All four pieces of evidence are safe. Your accomplice is waiting: leave the city."][index]};
 const narrative=item?.frame==="burgundy"?narratives[item.file]:undefined;
 if(item&&narrative)return {file:item.file,title:item[language],text:narrative[index]};
 return {file:null,title:["Mission compromise","Mission compromised"][index],text:["L’enquête est terminée. La mission ne peut plus se poursuivre.","The investigation is over. The mission cannot continue."][index]};
}
