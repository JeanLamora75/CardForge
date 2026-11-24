import { getNewGameChoice, confirmNewGame, type NewGameChoice } from '../../application/new-game-choice.ts';
import { replayFinishedGame } from '../../application/game-results.ts';
import { createTutorialSession } from '../../application/learning.ts';
import { startPersistentGame } from '../../application/persistent-game-session.ts';
import { resumeRegisteredGame } from '../../application/registered-save-migrations.ts';
import type { LocalGameStorage } from '../../ports/local-storage.ts';
import { midnightSyndicateEngine, MIDNIGHT_SYNDICATE_GAME_ID, MIDNIGHT_SYNDICATE_RULES_VERSION,
  type MidnightSyndicateSetup } from './engine.ts';

export const MIDNIGHT_SYNDICATE_SAVE_FORMAT_VERSION = 1;
export const MIDNIGHT_SYNDICATE_SAVE_OPTIONS = Object.freeze({
  gameId: MIDNIGHT_SYNDICATE_GAME_ID,
  rulesVersion: MIDNIGHT_SYNDICATE_RULES_VERSION,
  formatVersion: MIDNIGHT_SYNDICATE_SAVE_FORMAT_VERSION,
});

/** Never replaces an existing save, even if incompatible. */
export function startMidnightSyndicate(storage: LocalGameStorage, sessionId: string, setup: MidnightSyndicateSetup) {
  return startPersistentGame(midnightSyndicateEngine, storage,
    {...MIDNIGHT_SYNDICATE_SAVE_OPTIONS,sessionId}, setup);
}

/** Resume the exact persisted snapshot, without initialization or shuffling. */
export function resumeMidnightSyndicate(storage: LocalGameStorage) {
  return resumeRegisteredGame(midnightSyndicateEngine, storage, MIDNIGHT_SYNDICATE_SAVE_OPTIONS);
}

/** Read the current session before asking for explicit replacement confirmation. */
export async function getMidnightSyndicateNewGameChoice(storage: LocalGameStorage) {
  const choice = await getNewGameChoice(storage, MIDNIGHT_SYNDICATE_GAME_ID);
  if (choice.kind === 'confirmation-required') await resumeMidnightSyndicate(storage);
  return choice;
}

/** Confirmed replacement records abandonment only if no terminal result exists. */
export async function confirmMidnightSyndicateNewGame(
  storage: LocalGameStorage, sessionId: string, setup: MidnightSyndicateSetup,
  choice: NewGameChoice, confirmed: boolean,
) {
  if (!confirmed) return undefined;
  const live = await getMidnightSyndicateNewGameChoice(storage);
  if (live.kind !== choice.kind || live.existingSessionId !== choice.existingSessionId)
    throw new Error('Saved session changed; confirmation required again');
  return confirmNewGame(midnightSyndicateEngine, storage,
    {...MIDNIGHT_SYNDICATE_SAVE_OPTIONS,sessionId},setup,choice,true);
}

export function replayMidnightSyndicate(storage: LocalGameStorage, sessionId: string, setup: MidnightSyndicateSetup) {
  return replayFinishedGame(midnightSyndicateEngine,storage,MIDNIGHT_SYNDICATE_SAVE_OPTIONS,setup,sessionId);
}

/** Practice never has a durable session or result. */
export function practiceMidnightSyndicate(setup: MidnightSyndicateSetup) {
  return createTutorialSession(midnightSyndicateEngine,setup);
}
