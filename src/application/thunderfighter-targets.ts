import type {ThunderfighterAction} from "../games/gridcannon/engine.ts";
export type BoardTarget={kind:"pile"|"sector";index:number};
export function directThunderTarget(action:ThunderfighterAction):BoardTarget|null{
 switch(action.type){
 case "place-figure":return {kind:"sector",index:action.slot};
 case "place-number":case "start-replacement":return {kind:"pile",index:action.cell};
 default:return null;
 }
}
export function thunderTargetActions(legal:readonly ThunderfighterAction[],kind:BoardTarget["kind"],index:number){
 return legal.filter(action=>{const target=directThunderTarget(action);return target?.kind===kind&&target.index===index;});
}
export function isThunderActionLegal(legal:readonly ThunderfighterAction[],action:ThunderfighterAction){
 return legal.some(candidate=>JSON.stringify(candidate)===JSON.stringify(action));
}
