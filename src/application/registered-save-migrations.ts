import type { GameEngine } from '../core/game-engine.ts';
import type { LocalGameStorage } from '../ports/local-storage.ts';
import { migrateAndResumeGame, type SaveMigration, SaveMigrationError } from './save-migrations.ts';
import type { PersistentSessionOptions } from './persistent-game-session.ts';

/**
 * Versioned FORMAT migrations only. No rule changes and no speculative migration.
 * Add a reviewed step to the matching game list before increasing its formatVersion.
 */
export const REGISTERED_SAVE_MIGRATIONS: Readonly<Record<string, readonly SaveMigration[]>> = Object.freeze({
  'clear-the-dungeon': Object.freeze([]),
  gridcannon: Object.freeze([]),
  'loot-the-loop': Object.freeze([]),
});

export function registeredGameMigrations(gameId: string): readonly SaveMigration[] {
  if (!Object.prototype.hasOwnProperty.call(REGISTERED_SAVE_MIGRATIONS, gameId))
    throw new SaveMigrationError('incompatible', 'Unknown game format policy');
  return REGISTERED_SAVE_MIGRATIONS[gameId];
}

export function resumeRegisteredGame<State, Action, Setup>(
  engine: GameEngine<State, Action, Setup>,
  storage: LocalGameStorage,
  options: PersistentSessionOptions,
) {
  return migrateAndResumeGame(engine, storage, options, registeredGameMigrations(options.gameId));
}
