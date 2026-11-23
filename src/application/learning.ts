import type { GameId } from "../catalog.ts";

export type PlayableLearningGame = Extract<GameId, "clear-the-dungeon" | "gridcannon">;
export type LearningChoice = "learn" | "play";
export interface LearningPreferences {
  choice: LearningChoice | null;
  hintsEnabled: boolean;
}
export interface PreferenceStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
const prefix = "cardforge.learning.v1.";
const defaults: LearningPreferences = { choice: null, hintsEnabled: true };

export function readLearningPreferences(storage: PreferenceStorage | null, game: PlayableLearningGame): LearningPreferences {
  if (!storage) return { ...defaults };
  try {
    const raw = storage.getItem(prefix + game);
    if (!raw) return { ...defaults };
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return { ...defaults };
    const record = value as Record<string, unknown>;
    return {
      choice: record.choice === "learn" || record.choice === "play" ? record.choice : null,
      hintsEnabled: typeof record.hintsEnabled === "boolean" ? record.hintsEnabled : true,
    };
  } catch { return { ...defaults }; }
}

export function saveLearningPreferences(
  storage: PreferenceStorage | null, game: PlayableLearningGame, preferences: LearningPreferences,
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(prefix + game, JSON.stringify(preferences));
    return true;
  } catch { return false; }
}

/** Guided sessions never use LocalGameStorage or result/statistics commits. */
export function createTutorialSession<State, Action, Setup>(
  engine: {
    createInitialState(setup: Setup): State;
    validateState(state: unknown): { valid: boolean };
    getLegalActions(state: Readonly<State>): readonly Action[];
    transition(state: Readonly<State>, action: Readonly<Action>): { accepted: boolean; state: State; reason?: string };
  },
  setup: Setup,
) {
  let state = engine.createInitialState(setup);
  if (!engine.validateState(state).valid) throw new Error("Invalid tutorial setup");
  return {
    getState: (): State => structuredClone(state),
    getLegalActions: (): readonly Action[] => engine.getLegalActions(state),
    dispatch: async (action: Readonly<Action>) => {
      const next = engine.transition(structuredClone(state), structuredClone(action));
      if (next.accepted) state = structuredClone(next.state);
      return { ...next, state: structuredClone(state) };
    },
  };
}
