import { makeDeckWithJokers, shuffle } from '../../core/cards.ts';
import { createSeededRandom } from '../../core/deterministic-deck.ts';
import type { GameEngine, GameOutcome, TransitionResult, ValidationResult } from '../../core/game-engine.ts';

export const THUNDERFIGHTER_GAME_ID = 'gridcannon' as const;
export const THUNDERFIGHTER_RULES_VERSION = 'v2' as const;

export type ThunderfighterPhase =
  | 'initial-figures' | 'replacement-offer'
  | 'replacement-draw' | 'replacement-figures' | 'playing';

export interface ThunderfighterState {
  rulesVersion: typeof THUNDERFIGHTER_RULES_VERSION;
  phase: ThunderfighterPhase;
  outcome: GameOutcome;
  /** Nine piles in reading order, index 4 being the centre; top card is last. */
  grid: string[][];
  /** Fixed twelve outer positions, three on each side, including defeated figures later. */
  figureSlots: (string | null)[];
  /** Defeated figures still occupy their original exterior slots. */
  defeatedFigures?: string[];
  pendingFigures: string[];
  drawPile: string[];
  specialReserve: string[];
  spentSpecials: string[];
  replacementSlot: number | null;
  replacementUsed: boolean;
}
export interface ThunderfighterSetup { seed: number }
export type ThunderfighterAction =
  | Readonly<{ type: 'place-figure'; slot: number }>
  | Readonly<{ type: 'skip-replacement' }>
  | Readonly<{ type: 'start-replacement'; cell: number }>
  | Readonly<{ type: 'draw-replacement' }>;

const cards = makeDeckWithJokers();
const byId = new Map(cards.map(card => [card.id, card]));
const allIds = new Set(byId.keys());
const isNumber = (id: string) => {
  const card = byId.get(id);
  return !!card && 'rank' in card && card.rank >= 2 && card.rank <= 10;
};
const isFigure = (id: string) => {
  const card = byId.get(id);
  return !!card && 'rank' in card && card.rank >= 11 && card.rank <= 13;
};
const isSpecial = (id: string) => {
  const card = byId.get(id);
  return !!card && ('kind' in card || 'rank' in card && card.rank === 1);
};
const peripheral = [0, 1, 2, 3, 5, 6, 7, 8] as const;
/** top 0-2; right 3-5; bottom 6-8; left 9-11. */
const adjacent: readonly (readonly number[])[] = [
  [0, 9], [1], [2, 3], [10], [], [4], [8, 11], [7], [5, 6],
];
function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function similar(figureId: string, numberId: string): number {
  const f = byId.get(figureId), n = byId.get(numberId);
  if (!f || !n || !('suit' in f) || !('suit' in n) || !('rank' in n)) return -1;
  const fRed = f.suit === 'hearts' || f.suit === 'diamonds';
  const nRed = n.suit === 'hearts' || n.suit === 'diamonds';
  const category = f.suit === n.suit ? 2 : fRed === nRed ? 1 : 0;
  return category * 100 + n.rank;
}

export type FigurePlacementMode = 'normal' | 'rescue' | 'blocked' | 'none';
export interface FigurePlacementOptions {
  mode: FigurePlacementMode;
  slots: number[];
}

/** Occupancy is independent of whether a figure is alive or defeated. */
export function getFigureSlotStatus(
  state: Readonly<ThunderfighterState>,
  slot: number,
): 'empty' | 'alive' | 'defeated' {
  if (!Number.isInteger(slot) || slot < 0 || slot >= 12) throw new RangeError('Invalid figure slot');
  const id = state.figureSlots[slot];
  if (id === null) return 'empty';
  return state.defeatedFigures?.includes(id) ? 'defeated' : 'alive';
}

/** Normal similarity excludes the centre; rescue is used only if no normal destination exists. */
export function getFigurePlacementOptions(state: Readonly<ThunderfighterState>): FigurePlacementOptions {
  if (!state.pendingFigures.length) return { mode: 'none', slots: [] };
  const figure = state.pendingFigures[0];
  let best = -1;
  const results = new Set<number>();
  for (const cell of peripheral) {
    const top = state.grid[cell]?.at(-1);
    const available = adjacent[cell].filter(slot => getFigureSlotStatus(state, slot) === 'empty');
    if (!top || !available.length) continue;
    const score = similar(figure, top);
    if (score < best) continue;
    if (score > best) { best = score; results.clear(); }
    for (const slot of available) results.add(slot);
  }
  if (results.size) return { mode: 'normal', slots: [...results].sort((a, b) => a - b) };
  const free = state.figureSlots.flatMap((id, index) => id === null ? [index] : []);
  return free.length ? { mode: 'rescue', slots: free } : { mode: 'blocked', slots: [] };
}

export function availableFigureSlots(state: Readonly<ThunderfighterState>): number[] {
  return getFigurePlacementOptions(state).slots;
}
function validate(value: unknown): ValidationResult {
  const errors: string[] = [];
  if (!record(value)) return { valid: false, errors: ['state must be an object'] };
  const s = value;
  if (s.rulesVersion !== THUNDERFIGHTER_RULES_VERSION) errors.push('incorrect rules version');
  if (!['initial-figures','replacement-offer','replacement-draw','replacement-figures','playing'].includes(String(s.phase)))
    errors.push('invalid preparation phase');
  if (s.outcome !== 'in-progress') errors.push('unexpected terminal outcome');
  if (!Array.isArray(s.grid) || s.grid.length !== 9 || !s.grid.every(p => Array.isArray(p))) errors.push('invalid grid');
  if (!Array.isArray(s.figureSlots) || s.figureSlots.length !== 12) errors.push('invalid exterior positions');
  if (!Array.isArray(s.drawPile) || !Array.isArray(s.pendingFigures) ||
      !Array.isArray(s.specialReserve) || !Array.isArray(s.spentSpecials)) errors.push('invalid card zones');
  if (errors.length) return { valid: false, errors };
  const state = s as unknown as ThunderfighterState;
  const empty = state.grid.flatMap((pile, cell) => pile.length ? [] : [cell]);
  if (state.grid.some(p => p.some(id => typeof id !== 'string' || !isNumber(id)))) errors.push('non-numeric grid card');
  if (empty.length !== (state.phase === 'replacement-draw' ? 1 : 0) ||
      state.grid.some(p => p.length > 1)) errors.push('invalid preparation grid occupancy');
  if (state.pendingFigures.some(id => typeof id !== 'string' || !isFigure(id)) ||
      state.figureSlots.some(id => id !== null && (typeof id !== 'string' || !isFigure(id)))) errors.push('invalid figure zone');
  if (state.defeatedFigures !== undefined &&
      (!Array.isArray(state.defeatedFigures) ||
       state.defeatedFigures.some(id => typeof id !== 'string' || !isFigure(id)) ||
       new Set(state.defeatedFigures).size !== state.defeatedFigures.length ||
       state.defeatedFigures.some(id => !state.figureSlots.includes(id))))
    errors.push('invalid defeated figure status');
  if ([...state.specialReserve, ...state.spentSpecials].some(id => typeof id !== 'string' || !isSpecial(id)))
    errors.push('invalid special zone');
  if (state.spentSpecials.length) errors.push('special actions forbidden in preparation');
  if (typeof state.replacementUsed !== 'boolean' ||
      (state.replacementSlot !== null &&
       (!Number.isInteger(state.replacementSlot) || state.replacementSlot < 0 || state.replacementSlot > 8)))
    errors.push('invalid replacement metadata');
  if ((state.phase === 'replacement-draw' || state.phase === 'replacement-figures') !==
      (state.replacementUsed && state.replacementSlot !== null)) {
    if (state.phase !== 'playing' && state.phase !== 'replacement-offer' && state.phase !== 'initial-figures')
      errors.push('replacement phase mismatch');
  }
  if (state.phase === 'replacement-draw' && empty[0] !== state.replacementSlot) errors.push('wrong empty replacement cell');
  if ((state.phase === 'initial-figures' || state.phase === 'replacement-figures') && !state.pendingFigures.length)
    errors.push('figure phase without pending figure');
  if ((state.phase === 'replacement-offer' || state.phase === 'playing') && state.pendingFigures.length)
    errors.push('unplaced figures outside placement phase');
  if (state.phase === 'replacement-offer' && state.replacementUsed) errors.push('replacement already used');
  if (state.phase === 'initial-figures' && state.replacementUsed) errors.push('replacement too early');
  if (state.phase === 'playing' && state.replacementSlot !== null) errors.push('replacement not finished');
  const used = [
    ...state.grid.flat(), ...state.figureSlots.filter((id): id is string => typeof id === 'string'),
    ...state.pendingFigures, ...state.drawPile, ...state.specialReserve, ...state.spentSpecials,
  ];
  if (used.length !== 54 || new Set(used).size !== 54 || used.some(id => !allIds.has(id)))
    errors.push('missing, duplicate or unknown card');
  return errors.length ? { valid: false, errors } : { valid: true };
}
function createInitialState(setup: ThunderfighterSetup): ThunderfighterState {
  if (!record(setup) || Object.keys(setup).some(k => k !== 'seed')) throw new TypeError('Only a seed is accepted');
  const shuffled = shuffle(cards, createSeededRandom(setup.seed)).map(card => card.id);
  const grid: string[][] = Array.from({ length: 9 }, () => []);
  const pendingFigures: string[] = [];
  const specialReserve: string[] = [];
  let position = 0;
  let cursor = 0;
  while (position < 9) {
    const id = shuffled[cursor++];
    if (isNumber(id)) grid[position++].push(id);
    else if (isFigure(id)) pendingFigures.push(id);
    else specialReserve.push(id);
  }
  const state: ThunderfighterState = {
    rulesVersion: THUNDERFIGHTER_RULES_VERSION, phase: pendingFigures.length ? 'initial-figures' : 'replacement-offer',
    outcome: 'in-progress', grid, figureSlots: Array(12).fill(null), defeatedFigures: [], pendingFigures,
    drawPile: shuffled.slice(cursor), specialReserve, spentSpecials: [],
    replacementSlot: null, replacementUsed: false,
  };
  if (!validate(state).valid) throw new Error('Invalid initial Gridcannon V2 state');
  return state;
}
function getLegalActions(s: Readonly<ThunderfighterState>): readonly ThunderfighterAction[] {
  if (!validate(s).valid) return [];
  if (s.phase === 'initial-figures' || s.phase === 'replacement-figures')
    return availableFigureSlots(s).map(slot => ({ type: 'place-figure', slot }));
  if (s.phase === 'replacement-offer')
    return [{ type: 'skip-replacement' }, ...s.grid.map((_, cell) => ({ type: 'start-replacement' as const, cell }))];
  if (s.phase === 'replacement-draw' && s.drawPile.length) return [{ type: 'draw-replacement' }];
  return [];
}
function transition(s: Readonly<ThunderfighterState>, action: Readonly<ThunderfighterAction>): TransitionResult<ThunderfighterState> {
  const reject = (reason: string): TransitionResult<ThunderfighterState> => ({ accepted: false, state: s as ThunderfighterState, reason });
  if (!record(action) || !getLegalActions(s).some(a =>
    a.type === action.type && Object.keys(a).length === Object.keys(action).length &&
    Object.entries(a).every(([key, value]) => (action as unknown as Record<string, unknown>)[key] === value)))
    return reject('illegal action or incomplete preparation');
  if (action.type === 'place-figure') {
    const figureSlots = [...s.figureSlots]; figureSlots[action.slot] = s.pendingFigures[0];
    const pendingFigures = s.pendingFigures.slice(1);
    const phase = pendingFigures.length ? s.phase : s.phase === 'initial-figures' ? 'replacement-offer' : 'playing';
    const next = { ...s, figureSlots, pendingFigures, phase, replacementSlot: phase === 'playing' ? null : s.replacementSlot };
    return { accepted: true, state: next };
  }
  if (action.type === 'skip-replacement') return { accepted: true, state: { ...s, phase: 'playing' } };
  if (action.type === 'start-replacement') {
    const grid = s.grid.map(p => [...p]);
    const removed = grid[action.cell].pop()!;
    return { accepted: true, state: { ...s, grid,
      drawPile: [...s.drawPile, removed], replacementUsed: true,
      replacementSlot: action.cell, phase: 'replacement-draw' } };
  }
  if (action.type === 'draw-replacement') {
    const id = s.drawPile[0], drawPile = s.drawPile.slice(1);
    if (isSpecial(id)) return { accepted: true, state: { ...s, drawPile, specialReserve: [...s.specialReserve, id] } };
    if (isFigure(id)) return { accepted: true, state: { ...s, drawPile, pendingFigures: [...s.pendingFigures, id] } };
    const grid = s.grid.map(p => [...p]);
    grid[s.replacementSlot!].push(id);
    return { accepted: true, state: { ...s, grid, drawPile,
      phase: s.pendingFigures.length ? 'replacement-figures' : 'playing',
      replacementSlot: s.pendingFigures.length ? s.replacementSlot : null } };
  }
  return reject('unknown action');
}
export const thunderfighterEngine: GameEngine<ThunderfighterState, ThunderfighterAction, ThunderfighterSetup> = {
  createInitialState, getLegalActions, transition,
  getOutcome: state => state.outcome, validateState: validate,
};
