/** Données durables du jeu : indépendantes des API de stockage. */
export interface SavedGame<State = unknown> {
  gameId: string;
  sessionId: string;
  formatVersion: number;
  rulesVersion: string;
  state: State;
}

export interface GameResult {
  id: string;
  gameId: string;
  sessionId: string;
  outcome: 'win' | 'loss' | 'abandoned';
}

export interface GameStatistics {
  gameId: string;
  played: number;
  won: number;
  lost: number;
  abandoned: number;
}

export interface GameCommit<State = unknown> {
  save: SavedGame<State>;
  /** La modification des statistiques est atomique avec le résultat associé. */
  result?: GameResult;
  statistics?: GameStatistics;
}

export type TerminalCommitResult = 'recorded' | 'already-recorded';

export interface TerminalGameCommit<State = unknown> {
  save: SavedGame<State>;
  result: GameResult;
}

/** Stable collision-free result identity across retries and reloads. */
export function stableResultId(gameId: string, sessionId: string): string {
  return JSON.stringify([gameId, sessionId]);
}

export interface ReplaceGameCommit<State = unknown> {
  expectedSessionId: string;
  replacement: SavedGame<State>;
}

/** The old session is finalized only when no terminal result exists yet. */
export type ReplaceGameResult = 'replaced-abandoned' | 'replaced-finished';

/** Compare-and-swap keeps the previous save until the migration transaction completes. */
export interface GameMigrationCommit<State = unknown> {
  previous: SavedGame<unknown>;
  migrated: SavedGame<State>;
}

export interface LocalGameStorage {
  readGame<State = unknown>(gameId: string): Promise<SavedGame<State> | undefined>;
  readResult(resultId: string): Promise<GameResult | undefined>;
  readStatistics(gameId: string): Promise<GameStatistics | undefined>;
  /** Réussite uniquement après l'événement complete de la transaction. */
  commit<State>(update: GameCommit<State>): Promise<void>;
  /** Atomic deduplication and statistics update owned by the storage adapter. */
  commitTerminal<State>(update: TerminalGameCommit<State>): Promise<TerminalCommitResult>;
  replaceGame<State>(update: ReplaceGameCommit<State>): Promise<ReplaceGameResult>;
  migrateGame<State>(update: GameMigrationCommit<State>): Promise<void>;
}

export type StorageErrorCode = 'unavailable' | 'read-failed' | 'write-failed';
export class LocalStorageError extends Error {
  readonly code: StorageErrorCode;
  constructor(code: StorageErrorCode, message: string, options?: ErrorOptions) {
    super(message, options);
    this.code = code;
    this.name = 'LocalStorageError';
  }
}
