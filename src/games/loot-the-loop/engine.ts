import { makeStandardDeck, shuffle } from '../../core/cards.ts';
import { createSeededRandom } from '../../core/deterministic-deck.ts';
import type { GameEngine, GameOutcome, TransitionResult, ValidationResult } from '../../core/game-engine.ts';

export const MIDNIGHT_SYNDICATE_GAME_ID = 'loot-the-loop' as const;
export const MIDNIGHT_SYNDICATE_RULES_VERSION = 'isaludo-beta-1.11' as const;

export interface MidnightSyndicateSetup {
  seed: number;
}
export interface LoopCard {
  id: string;
  faceUp: boolean;
}
export interface MidnightSyndicateState {
  rulesVersion: typeof MIDNIGHT_SYNDICATE_RULES_VERSION;
  phase: 'exploring' | 'finished';
  outcome: GameOutcome;
  /** Top of the circular pile is index zero. A card's visibility follows its physical identity. */
  deck: LoopCard[];
  /** Temporarily removed face-up numeric cards, limited to three. */
  notes: LoopCard[];
  /** Collected aces and numeric cards, in collection order. */
  loot: LoopCard[];
}
export type MidnightSyndicateAction = Readonly<{ type: 'look-around' } | { type: 'explore'; distance: number } | { type: 'mark-path' } | { type: 'return-to-path'; noteIndex: number }>;

const canonical = [...makeStandardDeck().map(card => card.id), 'joker-1'];
const validIds = new Set(canonical);
const aces = new Set(makeStandardDeck().filter(card => card.rank === 1).map(card => card.id));

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function isValidCard(value: unknown): value is LoopCard {
  return isRecord(value) &&
    Object.keys(value).length === 2 &&
    Object.hasOwn(value, 'id') && Object.hasOwn(value, 'faceUp') &&
    typeof value.id === 'string' && validIds.has(value.id) &&
    typeof value.faceUp === 'boolean';
}
function isNumeric(id: string): boolean {
  const card = makeStandardDeck().find(item => item.id === id);
  return !!card && card.rank >= 2 && card.rank <= 10;
}
function validateState(value: unknown): ValidationResult {
  if (!isRecord(value)) return {valid:false,errors:['state must be an object']};
  const errors: string[] = [];
  const allowed = ['rulesVersion','phase','outcome','deck','notes','loot'];
  if (Object.keys(value).length !== allowed.length || Object.keys(value).some(key => !allowed.includes(key)))
    errors.push('unexpected state fields');
  if (value.rulesVersion !== MIDNIGHT_SYNDICATE_RULES_VERSION) errors.push('incorrect rules version');
  if (value.phase !== 'exploring' && value.phase !== 'finished') errors.push('invalid phase');
  if (value.outcome !== 'in-progress' && value.outcome !== 'win' && value.outcome !== 'loss')
    errors.push('invalid outcome');
  if (value.outcome === 'in-progress' && value.phase !== 'exploring' ||
      (value.outcome === 'win' || value.outcome === 'loss') && value.phase !== 'finished')
    errors.push('phase and outcome mismatch');
  const zones: LoopCard[][] = [];
  for (const key of ['deck','notes','loot'] as const) {
    const cards = value[key];
    if (!Array.isArray(cards) || !cards.every(isValidCard)) {
      errors.push('invalid '+key+' cards');
      zones.push([]);
      continue;
    }
    zones.push(cards);
  }
  const [deck,notes,loot] = zones;
  const ids = [...deck,...notes,...loot].map(card => card.id);
  if (ids.length !== canonical.length || new Set(ids).size !== canonical.length ||
      ids.some(id => !validIds.has(id)))
    errors.push('physical cards must be 53 distinct allowed cards');
  if (notes.length > 3 || notes.some(card => !card.faceUp || !isNumeric(card.id)))
    errors.push('notes must contain no more than three face-up numerics');
  if (loot.some(card => !card.faceUp || !(aces.has(card.id) || isNumeric(card.id))))
    errors.push('loot may contain only face-up aces and numerics');
  if (value.outcome === 'win' && (aces.size !== loot.filter(card => aces.has(card.id)).length ||
      deck[0]?.id !== 'joker-1' || !deck[0].faceUp))
    errors.push('invalid win state');
  return errors.length ? {valid:false,errors}:{valid:true};
}

function createInitialState(setup: MidnightSyndicateSetup): MidnightSyndicateState {
  if (!isRecord(setup) || Object.keys(setup).length !== 1 || !Object.hasOwn(setup,'seed'))
    throw new TypeError('Exactly one seed is required');
  const random = createSeededRandom(setup.seed);
  const deck = shuffle(canonical, random).map(id => ({id,faceUp:false}));
  const state: MidnightSyndicateState = {
    rulesVersion: MIDNIGHT_SYNDICATE_RULES_VERSION,
    phase:'exploring',
    outcome:'in-progress',
    deck,
    notes:[],
    loot:[],
  };
  if (!validateState(state).valid) throw new Error('Invalid initial game');
  return state;
}

function getLegalActions(state: Readonly<MidnightSyndicateState>): readonly MidnightSyndicateAction[] {
  if (!validateState(state).valid || state.outcome !== 'in-progress') return [];
  const actions: MidnightSyndicateAction[] = [];
  if (state.deck[0] && !state.deck[0].faceUp) actions.push({type:'look-around'});
  const distances = new Set<number>();
  for (const card of state.deck.slice(0,2)) {
    if (!card.faceUp) continue;
    const rank = makeStandardDeck().find(item => item.id === card.id)?.rank;
    if (rank !== undefined && rank >= 2 && rank <= 10) distances.add(rank);
  }
  for (const distance of distances) actions.push({type:'explore',distance});
  const top = state.deck[0];
  if (top?.faceUp && isNumeric(top.id) && state.notes.length < 3) actions.push({type:'mark-path'});
  for (let noteIndex=0; noteIndex<state.notes.length; noteIndex++) actions.push({type:'return-to-path',noteIndex});
  return actions;
}
function transition(
  state: Readonly<MidnightSyndicateState>,
  action: Readonly<MidnightSyndicateAction>,
): TransitionResult<MidnightSyndicateState> {
  if (!validateState(state).valid || state.outcome !== 'in-progress') {
    return {accepted:false,state:state as MidnightSyndicateState,reason:'invalid or finished game'};
  }
  if (action?.type === 'mark-path') {
    if (Object.keys(action).length !== 1 || !getLegalActions(state).some(legal => legal.type === 'mark-path'))
      return {accepted:false,state:state as MidnightSyndicateState,reason:'mark-path is not legal'};
    return {accepted:true,state:{...state,deck:state.deck.slice(1),notes:[...state.notes,state.deck[0]]}};
  }
  if (action?.type === 'return-to-path') {
    if (Object.keys(action).length !== 2 || !getLegalActions(state).some(
      legal => legal.type === 'return-to-path' && legal.noteIndex === action.noteIndex,
    )) return {accepted:false,state:state as MidnightSyndicateState,reason:'return-to-path is not legal'};
    const note = state.notes[action.noteIndex];
    return {accepted:true,state:{...state,deck:[note,...state.deck],notes:state.notes.filter((_,index)=>index!==action.noteIndex)}};
  }
  if (action?.type === 'explore') {
    if (Object.keys(action).length !== 2 || !getLegalActions(state).some(
      legal => legal.type === 'explore' && legal.distance === action.distance,
    )) return {accepted:false,state:state as MidnightSyndicateState,reason:'explore is not legal'};
    const offset = action.distance % state.deck.length;
    const deck = [...state.deck.slice(offset), ...state.deck.slice(0,offset)];
    // CAR-49 will resolve visible destinations; hidden destinations have no effect.
    return {accepted:true,state:{...state,deck}};
  }
  if (!action || action.type !== 'look-around' || Object.keys(action).length !== 1 ||
      !state.deck[0] || state.deck[0].faceUp) {
    return {accepted:false,state:state as MidnightSyndicateState,reason:'look-around is not legal'};
  }
  const deck = state.deck.map((card,index) =>
    index < 2 && !card.faceUp ? {...card,faceUp:true} : card,
  );
  return {accepted:true,state:{...state,deck}};
}

export const midnightSyndicateEngine: GameEngine<
  MidnightSyndicateState,MidnightSyndicateAction,MidnightSyndicateSetup
> = {
  createInitialState,
  getLegalActions,
  transition,
  getOutcome:state=>state.outcome,
  getVictoryScore:state=>state.outcome==='win' ? state.loot.length : null,
  validateState,
};
