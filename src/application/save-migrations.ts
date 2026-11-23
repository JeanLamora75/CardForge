import type { GameEngine } from '../core/game-engine.ts';
import type { LocalGameStorage, SavedGame } from '../ports/local-storage.ts';
import { resumePersistentGame } from './persistent-game-session.ts';
import type { PersistentGameSession, PersistentSessionOptions } from './persistent-game-session.ts';

export type SaveMigration = Readonly<{
  fromVersion: number;
  toVersion: number;
  migrate(state: unknown): unknown;
}>;

export type MigrationFailureCode = 'corrupt' | 'incompatible' | 'migration-failed' | 'storage-failed';

export class SaveMigrationError extends Error {
  readonly code: MigrationFailureCode;
  constructor(code: MigrationFailureCode, message: string, options?: ErrorOptions) {
    super(message, options);
    this.code = code;
    this.name = 'SaveMigrationError';
  }
}

function isSaveEnvelope(input: unknown): input is SavedGame<unknown> {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return false;
  const value = input as Partial<SavedGame>;
  return typeof value.gameId === 'string' && value.gameId.length > 0 &&
    typeof value.sessionId === 'string' && value.sessionId.length > 0 &&
    Number.isSafeInteger(value.formatVersion) && value.formatVersion! > 0 &&
    typeof value.rulesVersion === 'string' && value.rulesVersion.length > 0 &&
    Object.prototype.hasOwnProperty.call(value, 'state');
}

/** No silent rules migration: only the save *format* may evolve here. */
export async function migrateAndResumeGame<State, Action, Setup>(
  engine: GameEngine<State, Action, Setup>,
  storage: LocalGameStorage,
  options: PersistentSessionOptions,
  migrations: readonly SaveMigration[],
): Promise<PersistentGameSession<State, Action> | undefined> {
  const raw: unknown = await storage.readGame(options.gameId);
  if (raw === undefined) return undefined;
  if (!isSaveEnvelope(raw)) throw new SaveMigrationError('corrupt', 'Unreadable saved game envelope');
  if (raw.gameId !== options.gameId || raw.rulesVersion !== options.rulesVersion ||
      raw.formatVersion > options.formatVersion || !Number.isSafeInteger(options.formatVersion)) {
    throw new SaveMigrationError('incompatible', 'Unknown or incompatible save version');
  }
  if (raw.formatVersion === options.formatVersion) {
    if (!engine.validateState(raw.state).valid) throw new SaveMigrationError('corrupt', 'Invalid saved game state');
    return resumePersistentGame(engine, storage, options);
  }

  // Migrations must be an explicitly registered, contiguous forward-only chain.
  let version = raw.formatVersion;
  let state: unknown;
  try { state = structuredClone(raw.state); }
  catch (cause) { throw new SaveMigrationError('corrupt', 'Unclonable saved state', { cause }); }
  const visited = new Set<number>();
  while (version < options.formatVersion) {
    if (visited.has(version)) throw new SaveMigrationError('incompatible', 'Cyclic migration');
    visited.add(version);
    const step = migrations.find(item => item.fromVersion === version && item.toVersion === version + 1);
    if (!step) throw new SaveMigrationError('incompatible', `Missing migration from version ${version}`);
    try { state = structuredClone(step.migrate(structuredClone(state))); }
    catch (cause) { throw new SaveMigrationError('migration-failed', `Migration ${version} failed`, { cause }); }
    version = step.toVersion;
  }
  if (!engine.validateState(state).valid) {
    throw new SaveMigrationError('migration-failed', 'Migrated state failed game validation');
  }
  const migrated: SavedGame<unknown> = { ...raw, formatVersion: version, state };
  try { await storage.migrateGame({ previous: raw, migrated }); }
  catch (cause) { throw new SaveMigrationError('storage-failed', 'Migration could not be committed', { cause }); }
  return resumePersistentGame(engine, storage, options);
}
