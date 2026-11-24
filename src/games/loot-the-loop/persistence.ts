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
