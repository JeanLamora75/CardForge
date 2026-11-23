/** Contrat métier minimal : chaque jeu définit son état, ses actions et ses règles. */
export type GameOutcome = 'in-progress' | 'win' | 'loss' | 'abandoned';

export type ValidationResult =
  | Readonly<{ valid: true }>
  | Readonly<{ valid: false; errors: readonly string[] }>;

export type TransitionResult<State> =
  | Readonly<{ accepted: true; state: State }>
  | Readonly<{ accepted: false; state: State; reason: string }>;

/** Aucune connaissance des tours, phases, enseignes ou pouvoirs particuliers. */
export interface GameEngine<State, Action, Setup> {
  createInitialState(setup: Setup): State;
  getLegalActions(state: Readonly<State>): readonly Action[];
  transition(state: Readonly<State>, action: Readonly<Action>): TransitionResult<State>;
  getOutcome(state: Readonly<State>): GameOutcome;
  /** Optional official score, defined by the rules of the game (not UI statistics). */
  getVictoryScore?(state: Readonly<State>): number | null;
  validateState(state: unknown): ValidationResult;
}
