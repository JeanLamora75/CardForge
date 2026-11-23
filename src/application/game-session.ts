import type { GameEngine, GameOutcome, TransitionResult, ValidationResult } from '../core/game-engine.ts';

/** Orchestration synchrone en mémoire ; la persistance est introduite par CAR-12/13. */
export interface GameSession<State, Action> {
  getState(): Readonly<State>;
  getLegalActions(): readonly Action[];
  getOutcome(): GameOutcome;
  validateState(): ValidationResult;
  dispatch(action: Readonly<Action>): TransitionResult<State>;
}

/** Le point d'entrée reste indépendant des phases et de toute règle particulière. */
export function createGameSession<State, Action, Setup>(
  engine: GameEngine<State, Action, Setup>,
  setup: Setup,
): GameSession<State, Action> {
  return createSessionFromState(engine, engine.createInitialState(setup));
}

/** A saved state is validated before use; invalid input is never repaired or overwritten. */
export function restoreGameSession<State, Action, Setup>(
  engine: GameEngine<State, Action, Setup>,
  savedState: unknown,
): GameSession<State, Action> {
  assertValidState(engine, savedState);
  return createSessionFromState(engine, structuredClone(savedState) as State);
}

function createSessionFromState<State, Action, Setup>(
  engine: GameEngine<State, Action, Setup>,
  initial: State,
): GameSession<State, Action> {
  let current = initial;
  assertValidState(engine, current);

  return {
    getState: () => current,
    getLegalActions: () => engine.getLegalActions(current),
    getOutcome: () => engine.getOutcome(current),
    validateState: () => engine.validateState(current),
    dispatch(action) {
      const result = engine.transition(current, action);
      if (!result.accepted) {
        return { accepted: false, state: current, reason: result.reason };
      }
      assertValidState(engine, result.state);
      current = result.state;
      return { accepted: true, state: current };
    },
  };
}

function assertValidState<State, Action, Setup>(
  engine: GameEngine<State, Action, Setup>,
  state: unknown,
): void {
  const result = engine.validateState(state);
  if (!result.valid) {
    throw new Error(`Invalid state: ${result.errors.join('; ')}`);
  }
}
