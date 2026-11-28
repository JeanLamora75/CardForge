import type { SkydeckAction, SkydeckPublicState } from '../games/card-capture/engine.ts';
export type SkydeckMotion = { id:string; zone:'enemy'|'hand'; index:number; effect:'advance'|'arrive'|'deal'|'capture'|'sacrifice'|'repel'|'discard'; from?:number };
export function skydeckMotionPlan(action:SkydeckAction,before:SkydeckPublicState,after:SkydeckPublicState):SkydeckMotion[]{
 const result:SkydeckMotion[]=[];
 if(action.type==='advance-enemy')after.enemyLine.forEach((id,index)=>{if(!id)return;const from=before.enemyLine.indexOf(id);if(from!==index)result.push({id,zone:'enemy',index,effect:from<0?'arrive':'advance',from});});
 if(action.type==='draw')after.hand.forEach((id,index)=>{if(!before.hand.includes(id))result.push({id,zone:'hand',index,effect:'deal'});});
 if(action.type==='capture-a'||action.type==='capture-b'||action.type==='capture-c'||action.type==='discard'){
  const effect=action.type==='capture-a'?'capture':action.type==='capture-b'?'sacrifice':action.type==='capture-c'?'repel':'discard';
  before.enemyLine.forEach((id,index)=>{if(id&&!after.enemyLine.includes(id))result.push({id,zone:'enemy',index,effect});});
  before.hand.forEach((id,index)=>{if(!after.hand.includes(id))result.push({id,zone:'hand',index,effect:effect==='capture'?'discard':effect==='repel'?'sacrifice':effect});});
 }
 return result;
}
