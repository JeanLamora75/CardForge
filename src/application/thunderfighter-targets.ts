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

export type SpecialSelection={cardId:string;from?:number};
export function specialThunderActions(legal:readonly ThunderfighterAction[],cardId:string){
 return legal.filter((a):a is Extract<ThunderfighterAction,{type:"extract"|"reassign"}> => (a.type==="extract"||a.type==="reassign")&&a.cardId===cardId);
}
export function contextualThunderTarget(action:ThunderfighterAction,figures:readonly (string|null)[],special:SpecialSelection|null):BoardTarget|null{
 if(special){
  if(action.type==="extract"&&action.cardId===special.cardId)return {kind:"pile",index:action.cell};
  if(action.type==="reassign"&&action.cardId===special.cardId&&(special.from===undefined||action.from===special.from))return {kind:"pile",index:special.from===undefined?action.from:action.to};
  return null;
 }
 if(action.type==="assign-armor"){const index=figures.indexOf(action.figureId);return index<0?null:{kind:"sector",index};}
 return directThunderTarget(action);
}
export function contextualThunderActions(legal:readonly ThunderfighterAction[],figures:readonly (string|null)[],special:SpecialSelection|null,kind:BoardTarget["kind"],index:number){
 return legal.filter(action=>{const target=contextualThunderTarget(action,figures,special);return target?.kind===kind&&target.index===index;});
}
