import type { GameEngine, GameOutcome, TransitionResult, ValidationResult } from '../core/game-engine.ts';
import type { LocalGameStorage, SavedGame } from '../ports/local-storage.ts';
import { stableResultId } from '../ports/local-storage.ts';

export type SaveStatus = 'saved' | 'saving' | 'error';

export interface PersistentGameSession<State, Action> {
  getState(): Readonly<State>;
  getOutcome(): GameOutcome;
  getLegalActions(): readonly Action[];
  validateState(): ValidationResult;
  getSaveStatus(): SaveStatus;
  /** A rejected action does not cause a database write. */
  dispatch(action: Readonly<Action>): Promise<TransitionResult<State>>;
}

export interface PersistentSessionOptions {
  gameId: string;
  rulesVersion: string;
  formatVersion: number;
}

export interface NewPersistentSessionOptions extends PersistentSessionOptions {
  sessionId: string;
}

/** Invalid or unknown save formats remain durable and are never overwritten. */
export class GameRestoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GameRestoreError';
  }
}

function assertOptions(options: PersistentSessionOptions): void {
  if (!options.gameId || !options.rulesVersion || !Number.isSafeInteger(options.formatVersion) || options.formatVersion < 1) {
    throw new TypeError('Invalid game session metadata');
  }
}

function assertValid<State, Action, Setup>(engine: GameEngine<State, Action, Setup>, state: unknown): void {
  const validation = engine.validateState(state);
  if (!validation.valid) throw new GameRestoreError(`Invalid game state: ${validation.errors.join('; ')}`);
}

/** Starts and commits a new game only when no persisted game already exists. */
export async function startPersistentGame<State, Action, Setup>(
  engine: GameEngine<State, Action, Setup>,
  storage: LocalGameStorage,
  options: NewPersistentSessionOptions,
  setup: Setup,
): Promise<PersistentGameSession<State, Action>> {
  assertOptions(options);
  if (!options.sessionId) throw new TypeError('sessionId required');
  const existing = await storage.readGame(options.gameId);
  if (existing) throw new GameRestoreError('Existing game must be resumed or explicitly replaced');
  const state = engine.createInitialState(setup);
  assertValid(engine, state);
  const envelope: SavedGame<State> = {
    gameId: options.gameId, sessionId: options.sessionId,
    rulesVersion: options.rulesVersion, formatVersion: options.formatVersion,
    state: structuredClone(state),
  };
  await storage.commit({ save: envelope });
  return createPersistentSession(engine, storage, envelope);
}

/** Never calls createInitialState, draw, or shuffle when resuming a game. */
export async function resumePersistentGame<State, Action, Setup>(
  engine: GameEngine<State, Action, Setup>,
  storage: LocalGameStorage,
  options: PersistentSessionOptions,
): Promise<PersistentGameSession<State, Action> | undefined> {
  assertOptions(options);
  const save = await storage.readGame<unknown>(options.gameId);
  if (!save) return undefined;
  if (
    save.gameId !== options.gameId || !save.sessionId ||
    save.formatVersion !== options.formatVersion || save.rulesVersion !== options.rulesVersion
  ) throw new GameRestoreError('Incompatible game save metadata');
  assertValid(engine, save.state);
  return createPersistentSession(engine, storage, save as SavedGame<State>);
}

function createPersistentSession<State, Action, Setup>(
  engine: GameEngine<State, Action, Setup>,
  storage: LocalGameStorage,
  saved: SavedGame<State>,
): PersistentGameSession<State, Action> {
  let current: State = structuredClone(saved.state);
  let status: SaveStatus = 'saved';
  let queue: Promise<void> = Promise.resolve();

  const session: PersistentGameSession<State, Action> = {
    getState: () => structuredClone(current),
    getOutcome: () => engine.getOutcome(current),
    getLegalActions: () => engine.getLegalActions(current),
    validateState: () => engine.validateState(current),
    getSaveStatus: () => status,
    dispatch(action) {
      // Copy caller-controlled inputs before the queued operation is evaluated.
      const command = structuredClone(action);
      const run = async (): Promise<TransitionResult<State>> => {
        const before = current;
        if (engine.getOutcome(before) !== 'in-progress') {
          return { accepted: false, state: structuredClone(before), reason: 'Game already finished' };
        }
        const result = engine.transition(structuredClone(before), command);
        if (!result.accepted) return { accepted: false, state: structuredClone(before), reason: result.reason };
        assertValid(engine, result.state);
        const candidate = structuredClone(result.state);
        status = 'saving';
        try {
          const outcome = engine.getOutcome(candidate);
          if (outcome === 'in-progress') {
            await storage.commit({ save: { ...saved, state: candidate } });
          } else {
            const resultId = stableResultId(saved.gameId, saved.sessionId);
            const decision = await storage.commitTerminal({
              save: { ...saved, state: candidate },
              result: { id: resultId, gameId: saved.gameId, sessionId: saved.sessionId, outcome,
                ...(outcome === 'win' && engine.getVictoryScore
                  ? { score: engine.getVictoryScore(candidate) ?? undefined } : {}),
              },
            });
            if (decision === 'already-recorded') {
              const persisted = await storage.readGame<State>(saved.gameId);
              if (!persisted || persisted.sessionId !== saved.sessionId) {
                throw new GameRestoreError('Terminal state could not be restored');
              }
              assertValid(engine, persisted.state);
              current = structuredClone(persisted.state);
              status = 'saved';
              return { accepted: true, state: structuredClone(current) };
            }
          }
        } catch (error) {
          status = 'error';
          throw error;
        }
        current = candidate;
        status = 'saved';
        return { accepted: true, state: structuredClone(current) };
      };
      const result = queue.then(run);
      queue = result.then(() => undefined, () => undefined);
      return result;
    },
  };
  return session;
}
