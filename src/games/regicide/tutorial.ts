import {createTutorialSession} from '../../application/learning.ts';
import {regicideEngine,type RegicideState,type RegicideAction} from './engine.ts';
export const REGICIDE_LESSONS=['combat','recruitment','joker','defence'] as const;
export type RegicideLesson=typeof REGICIDE_LESSONS[number];
/** Deterministic isolated fixtures: the ordinary engine still owns every transition. */
export function regicideLessonState(lesson:RegicideLesson):RegicideState {
 const base=regicideEngine.createInitialState({seed:23});
 const all=[...base.hand,...base.tavern];
 const enemy='spades-11';
 const castle=[base.activeEnemy!,...base.castle].filter(id=>id!==enemy).sort((a,b)=>Number(a.split('-')[1])-Number(b.split('-')[1]));
 const hand=lesson==='recruitment'?['clubs-10']:lesson==='defence'?['hearts-6','diamonds-5']:lesson==='joker'?['hearts-1']:['clubs-8','diamonds-5','hearts-6'];
 const state:RegicideState={...base,turn:2,activeEnemy:enemy,castle,hand,tavern:all.filter(id=>!hand.includes(id)),enemyHealth:lesson==='defence'?12:20,phase:lesson==='defence'?'retaliation':'play'};
 if(!regicideEngine.validateState(state).valid)throw Error('Invalid tutorial fixture');
 return state;
}
export function practiceRegicide(lesson:RegicideLesson){
 return createTutorialSession<RegicideState,RegicideAction,RegicideLesson>({...regicideEngine,createInitialState:regicideLessonState},lesson);
}
