import type {GrimDelveAction} from "../games/clear-the-dungeon/engine.ts";
export function grimDropAction(legal:readonly GrimDelveAction[],cardId:string,zone:string,monsterId?:string):GrimDelveAction|undefined{
 return legal.find(a=>{
 if(!("cardId" in a)||a.cardId!==cardId)return false;
 if(zone==="hand")return a.type==="take-back";
 if(!monsterId||!("monsterId" in a)||a.monsterId!==monsterId)return false;
 return zone==="slot"?(a.type==="place-power"||a.type==="move-power"):zone==="monster"&&(a.type==="place-power"||a.type==="move-power"||a.type==="trigger-attack");
 });
}
