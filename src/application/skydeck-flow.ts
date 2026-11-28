import type {SkydeckPublicState,SkydeckAction} from '../games/card-capture/engine.ts';
export function automaticSkydeckAction(view:SkydeckPublicState|null,tutorial=false):SkydeckAction|undefined{
 if(tutorial||!view||view.outcome!=='in-progress'||view.blockedReason)return;
 if(view.phase==='enemy'&&view.actions.length===1&&view.actions[0].type==='advance-enemy')return view.actions[0];
 if(view.phase==='draw'&&view.actions.length===1&&view.actions[0].type==='draw')return view.actions[0];
 if(view.phase==='discard'&&!view.actions.some(a=>a.type==='discard'&&a.cardIds.length>0))return view.actions.find(a=>a.type==='discard-none');
}
const power=(id:string)=>{const n=Number(id.split('-')[1]);return n===1?14:n;};
const joker=(id:string)=>id.startsWith('joker-');
export function skydeckAttackFeedback(view:SkydeckPublicState|null,selected:readonly string[],target:number|null,copy:string|null){
 const enemyId=target&&view?.enemyLine[target-1];if(!enemyId||!selected.length)return;
 const normal=selected.filter(id=>!joker(id)),jokers=selected.length-normal.length;
 if(!normal.length)return {reason:'joker' as const};
 if(normal.some(id=>id.split('-')[0]!==enemyId.split('-')[0]))return {reason:'faction' as const};
 const reference=copy&&normal.includes(copy)?copy:normal.reduce((a,b)=>power(a)>=power(b)?a:b);
 const total=normal.reduce((sum,id)=>sum+power(id),0)+jokers*power(reference),enemy=power(enemyId);
 return {reason:total<enemy?'power' as const:'selection' as const,total,enemy};
}
export function skydeckCompatibleTargets(view:SkydeckPublicState|null,kind:string,selected:readonly string[]){
 if(!view||!selected.length)return [];
 return [...new Set(view.actions.flatMap(a=>(a.type==='capture-a'||a.type==='capture-c')&&a.type===kind&&a.cardIds.length===selected.length&&a.cardIds.every(id=>selected.includes(id))?[a.targetPosition]:[]))];
}
export function skydeckProtected(id:string){return !joker(id)&&power(id)>=11;}
