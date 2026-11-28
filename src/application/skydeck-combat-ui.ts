import type {SkydeckAction} from '../games/card-capture/engine.ts';
import {describeSkydeckCard} from '../games/card-capture/preview.ts';
export function resolveSkydeckCopy(actions:readonly SkydeckAction[],copy:string|null){
 const choices=[...new Set(actions.flatMap(a=>a.type==='capture-a'&&a.jokerCopyId?[a.jokerCopyId]:[]))];
 const effective=choices.length===1?choices[0]:choices.includes(copy??'')?copy:null;
 return {choices,effective,chosen:actions.find(a=>a.type!=='capture-a'||!a.jokerCopyId||a.jokerCopyId===effective)};
}
export function skydeckAttackSummary(action:SkydeckAction|undefined,enemyLine:readonly (string|null)[]){
 if(action?.type!=='capture-a')return undefined;
 const target=enemyLine[action.targetPosition-1];if(!target)return undefined;
 const power=(id:string)=>Number(describeSkydeckCard(id,'fr').power);
 const values=action.cardIds.map(id=>id.startsWith('joker-')?power(action.jokerCopyId??id):power(id));
 const total=values.reduce((a,b)=>a+b,0),enemy=power(target);
 if(!Number.isFinite(total)||!Number.isFinite(enemy))return undefined;
 return {values,total,enemy};
}
