import {getNewGameChoice,confirmNewGame,type NewGameChoice} from '../../application/new-game-choice.ts';
import {startPersistentGame} from '../../application/persistent-game-session.ts';
import {resumeRegisteredGame} from '../../application/registered-save-migrations.ts';
import type {LocalGameStorage} from '../../ports/local-storage.ts';
import {regicideEngine,REGICIDE_GAME_ID,REGICIDE_RULES_VERSION,type RegicideSetup} from './engine.ts';
export const REGICIDE_SAVE_OPTIONS=Object.freeze({gameId:REGICIDE_GAME_ID,rulesVersion:REGICIDE_RULES_VERSION,formatVersion:1});
export function startRegicide(storage:LocalGameStorage,sessionId:string,setup:RegicideSetup){
 return startPersistentGame(regicideEngine,storage,{...REGICIDE_SAVE_OPTIONS,sessionId},setup);
}
export function resumeRegicide(storage:LocalGameStorage){return resumeRegisteredGame(regicideEngine,storage,REGICIDE_SAVE_OPTIONS);}
export async function getRegicideNewGameChoice(storage:LocalGameStorage){
 const choice=await getNewGameChoice(storage,REGICIDE_GAME_ID);
 if(choice.kind==='confirmation-required')await resumeRegicide(storage);
 return choice;
}
export async function confirmRegicideNewGame(storage:LocalGameStorage,sessionId:string,setup:RegicideSetup,choice:NewGameChoice,confirmed:boolean){
 if(!confirmed)return undefined;
 const live=await getRegicideNewGameChoice(storage);
 if(live.kind!==choice.kind||live.existingSessionId!==choice.existingSessionId)throw Error('Saved session changed; confirmation required again');
 return confirmNewGame(regicideEngine,storage,{...REGICIDE_SAVE_OPTIONS,sessionId},setup,choice,true);
}

export {practiceRegicide,REGICIDE_LESSONS} from './tutorial.ts';
