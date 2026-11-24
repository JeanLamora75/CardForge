import { getNewGameChoice, confirmNewGame, type NewGameChoice } from '../../application/new-game-choice.ts';
import { createTutorialSession } from '../../application/learning.ts';
import { startPersistentGame } from '../../application/persistent-game-session.ts';
import { resumeRegisteredGame } from '../../application/registered-save-migrations.ts';
import type { LocalGameStorage } from '../../ports/local-storage.ts';
import { skydeckEngine, SKYDECK_GAME_ID, SKYDECK_RULES_VERSION,
  inspectSkydeck, type SkydeckState, type SkydeckAction, type SkydeckSetup } from './engine.ts';

export const SKYDECK_SAVE_FORMAT_VERSION = 1;
export const SKYDECK_SAVE_OPTIONS = Object.freeze({
  gameId: SKYDECK_GAME_ID,
  rulesVersion: SKYDECK_RULES_VERSION,
  formatVersion: SKYDECK_SAVE_FORMAT_VERSION,
});

/** Never replaces an existing save, even if incompatible. */
export function startSkydeck(storage: LocalGameStorage, sessionId: string, setup: SkydeckSetup) {
  return startPersistentGame(skydeckEngine, storage,
    {...SKYDECK_SAVE_OPTIONS,sessionId}, setup);
}

/** Resume the exact persisted snapshot, without initialization or shuffling. */
export function resumeSkydeck(storage: LocalGameStorage) {
  return resumeRegisteredGame(skydeckEngine, storage, SKYDECK_SAVE_OPTIONS);
}

/** Read the current session before asking for explicit replacement confirmation. */
export async function getSkydeckNewGameChoice(storage: LocalGameStorage) {
  const choice = await getNewGameChoice(storage, SKYDECK_GAME_ID);
  if (choice.kind === 'confirmation-required') await resumeSkydeck(storage);
  return choice;
}

/** Confirmed replacement records abandonment only if no terminal result exists. */
export async function confirmSkydeckNewGame(
  storage: LocalGameStorage, sessionId: string, setup: SkydeckSetup,
  choice: NewGameChoice, confirmed: boolean,
) {
  if (!confirmed) return undefined;
  const live = await getSkydeckNewGameChoice(storage);
  if (live.kind !== choice.kind || live.existingSessionId !== choice.existingSessionId)
    throw new Error('Saved session changed; confirmation required again');
  return confirmNewGame(skydeckEngine, storage,
    {...SKYDECK_SAVE_OPTIONS,sessionId},setup,choice,true);
}

/** Practice never has a durable session or result. */
export function practiceSkydeck(setup: SkydeckSetup) {
  return createTutorialSession(skydeckEngine,setup);
}

/** UI facade never returns internal state or hidden transition payloads. */
export function skydeckSessionView(session: {
  getState(): Readonly<SkydeckState>;
  dispatch(action:Readonly<SkydeckAction>):Promise<{accepted:boolean}>;
}){
  return {inspect:()=>inspectSkydeck(session.getState()),
    confirm:async(action:SkydeckAction)=>(await session.dispatch(action)).accepted};
}
