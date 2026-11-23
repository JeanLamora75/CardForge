import type { GameEngine } from '../core/game-engine.ts';
import type { LocalGameStorage, SavedGame } from '../ports/local-storage.ts';
import { GameRestoreError, resumePersistentGame, startPersistentGame } from './persistent-game-session.ts';
import type { NewPersistentSessionOptions, PersistentGameSession } from './persistent-game-session.ts';

/** Merely navigating or closing the app never triggers abandonment. */
export type NewGameChoice = Readonly<
  | { kind: 'start'; existingSessionId?: never }
  | { kind: 'confirmation-required'; existingSessionId: string }
>;

export async function getNewGameChoice(storage: LocalGameStorage, gameId: string): Promise<NewGameChoice> {
  if (!gameId) throw new TypeError('gameId required');
  const existing = await storage.readGame(gameId);
  return existing
    ? { kind: 'confirmation-required', existingSessionId: existing.sessionId }
    : { kind: 'start' };
}

/** Called only from the explicit Confirm action; cancellation requires no write. */
export async function confirmNewGame<State, Action, Setup>(
  engine: GameEngine<State, Action, Setup>,
  storage: LocalGameStorage,
  options: NewPersistentSessionOptions,
  setup: Setup,
  choice: NewGameChoice,
  confirmed: boolean,
): Promise<PersistentGameSession<State, Action> | undefined> {
  if (!confirmed) return undefined;
  if (choice.kind === 'start') {
    return startPersistentGame(engine, storage, options, setup);
  }
  if (choice.existingSessionId === options.sessionId) {
    throw new GameRestoreError('A new session ID is required');
  }
  const state = engine.createInitialState(setup);
  const validation = engine.validateState(state);
  if (!validation.valid) throw new GameRestoreError(`Invalid new game: ${validation.errors.join('; ')}`);
  const replacement: SavedGame<State> = {
    gameId: options.gameId,
    sessionId: options.sessionId,
    formatVersion: options.formatVersion,
    rulesVersion: options.rulesVersion,
    state: structuredClone(state),
  };
  await storage.replaceGame({ expectedSessionId: choice.existingSessionId, replacement });
  const session = await resumePersistentGame(engine, storage, options);
  if (!session) throw new GameRestoreError('Replacement was not readable');
  return session;
}
