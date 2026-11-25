import { makeDeckWithJokers, shuffle } from '../../core/cards.ts';
import { createSeededRandom } from '../../core/deterministic-deck.ts';
import type { GameEngine, GameOutcome, TransitionResult, ValidationResult } from '../../core/game-engine.ts';

export const THUNDERFIGHTER_GAME_ID = 'gridcannon' as const;
export const THUNDERFIGHTER_RULES_VERSION = 'v2' as const;

export type ThunderfighterPhase =
  | 'initial-figures' | 'replacement-offer'
  | 'replacement-draw' | 'replacement-figures' | 'placing-figure' | 'playing' | 'searching';

export interface ThunderfighterState {
  rulesVersion: typeof THUNDERFIGHTER_RULES_VERSION;
  phase: ThunderfighterPhase;
  outcome: GameOutcome;
  /** Numeric card drawn for this turn but not yet placed on a grid pile. */
  pendingNumeric?: string | null;
  /** Numerics skipped while finding the next living figure, in encounter order. */
  searchBuffer?: string[];
  /** A figure placed during search returns its held numerics under the remaining draw pile. */
  placingFromSearch?: boolean;
  /** Armor cards stay linked to their physical target, never copied. */
  armorCards?: { figureId: string; cardId: string }[];
  /** Last successful targets from one simultaneous attack event. */
  lastShot?: string[];
  victoryScore?: number | null;
  /** Loss cause is set only once, after a verified terminal transition. */
  lossReason?: 'armor' | 'stalemate' | null;
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
  | Readonly<{ type: 'draw-replacement' }>
  | Readonly<{ type: 'draw-card' }>
  | Readonly<{ type: 'place-number'; cell: number }>
  | Readonly<{ type: 'extract'; cardId: string; cell: number }>
  | Readonly<{ type: 'reassign'; cardId: string; from: number; to: number }>
  | Readonly<{ type: 'draw-search' }>
  | Readonly<{ type: 'assign-armor'; figureId: string }>;

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
const gridRows = [[0,1,2],[3,4,5],[6,7,8]] as const;
const gridColumns = [[0,3,6],[1,4,7],[2,5,8]] as const;
function value(id: string): number {
  const card = byId.get(id);
  return card && 'rank' in card ? card.rank : 0;
}
const rankOf = value;
function suitOf(id: string): string {
  const card = byId.get(id);
  return card && 'suit' in card ? card.suit : '';
}
function isRed(suit: string): boolean {
  return suit === 'hearts' || suit === 'diamonds';
}
function resistance(state: Readonly<ThunderfighterState>, figureId: string): number {
  return value(figureId) + (state.armorCards ?? [])
    .filter(armor => armor.figureId === figureId).reduce((sum, armor) => sum + value(armor.cardId), 0);
}
export interface ThunderShot {
  trigger: number;
  slot: number;
  figureId: string;
  contributors: {cell:number;cardId:string|null;power:number}[];
  power: number;
  resistance: number;
  success: boolean;
}
function shotContribution(state: Readonly<ThunderfighterState>, figureId: string, cell:number) {
  const cardId=state.grid[cell].at(-1)??null;
  const rank=value(figureId), suit=suitOf(figureId);
  const sourceSuit=cardId?suitOf(cardId):"";
  const power=cardId && (rank!==12||isRed(sourceSuit)===isRed(suit)) && (rank!==13||sourceSuit===suit) ? value(cardId):0;
  return {cell,cardId,power};
}
/** The trigger card is never part of the two intermediate cards. */
export function getShotAnalysis(state: Readonly<ThunderfighterState>, cell: number): ThunderShot[] {
  if (state.phase !== 'playing' || !Number.isInteger(cell) || cell < 0 || cell > 8) return [];
  const axes = [...gridRows, ...gridColumns];
  const defeated = new Set(state.defeatedFigures ?? []);
  const targets:ThunderShot[] = [];
  for (const axis of axes) {
    if (axis[0] !== cell && axis[2] !== cell) continue;
    const slot = axis === gridRows[0] ? cell === 0 ? 3 : 9
      : axis === gridRows[1] ? cell === 3 ? 4 : 10
      : axis === gridRows[2] ? cell === 6 ? 5 : 11
      : axis === gridColumns[0] ? cell === 0 ? 6 : 0
      : axis === gridColumns[1] ? cell === 1 ? 7 : 1
      : cell === 2 ? 8 : 2;
    const figureId = state.figureSlots[slot];
    if (!figureId || defeated.has(figureId)) continue;
    const middle = axis[0] === cell ? [axis[1],axis[2]] : [axis[1],axis[0]];
    // All endpoints and intermediate values are read from the same post-placement state.
    const contributors=middle.map(i=>shotContribution(state,figureId,i));
    const power=contributors.reduce((sum,c)=>sum+c.power,0), required=resistance(state,figureId);
    targets.push({trigger:cell,slot,figureId,contributors,power,resistance:required,success:power>=required});
  }
  return targets;
}

export function getShotTargets(state: Readonly<ThunderfighterState>, cell:number):string[] {
  return [...new Set(getShotAnalysis(state,cell).filter(shot=>shot.success).map(shot=>shot.figureId))];
}
/** Read-only projection of the exact board used for an accepted shot-producing action. */
export function getActionShotAnalysis(state:Readonly<ThunderfighterState>, action:ThunderfighterAction):ThunderShot[]{
  if(state.phase!=="playing"||!getLegalActions(state).some(a=>JSON.stringify(a)===JSON.stringify(action)))return [];
  if(action.type!=="place-number"&&action.type!=="reassign")return [];
  const grid=state.grid.map(p=>[...p]);
  const cell=action.type==="place-number"?action.cell:action.to;
  if(action.type==="place-number")grid[cell].push(state.pendingNumeric!);
  else grid[cell].push(grid[action.from].pop()!);
  return getShotAnalysis({...state,grid},cell);
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
export interface SearchIntegrityDiagnostic {
  status: 'ok' | 'pending-placement' | 'invalid';
  issues: string[];
  /** Only identifiers implicated in corruption, not the hidden future deck. */
  missingFigures: string[];
  duplicatedFigures: string[];
}
/**
 * GC-12 is an integrity error, not a game outcome.
 * Do not change the saved state or declare a synthetic win/loss.
 */
export function diagnoseSearchIntegrity(state: unknown): SearchIntegrityDiagnostic {
  if (!record(state)) return {
    status:'invalid', issues:['state is not an object'],missingFigures:[],duplicatedFigures:[],
  };
  const s=state as Partial<ThunderfighterState>;
  const valid=validate(state);
  const zones=[
    ...(Array.isArray(s.figureSlots)?s.figureSlots:[]),
    ...(Array.isArray(s.pendingFigures)?s.pendingFigures:[]),
    ...(Array.isArray(s.drawPile)?s.drawPile:[]),
  ];
  const figureIds=cards.filter(c=>isFigure(c.id)).map(c=>c.id);
  const missingFigures=figureIds.filter(id=>!zones.includes(id));
  const duplicatedFigures=figureIds.filter(id=>zones.filter(x=>x===id).length>1);
  const issues=valid.valid?[]:[...valid.errors];
  if (missingFigures.length) issues.push('missing physical figure identifiers');
  if (duplicatedFigures.length) issues.push('duplicated physical figure identifiers');
  const pending= s.phase==='placing-figure' && Array.isArray(s.pendingFigures) &&
    s.pendingFigures.length>0 && !!s.placingFromSearch;
  if (s.phase==='searching' && !pending && Array.isArray(s.drawPile) &&
      !s.drawPile.some(id=>typeof id==='string'&&isFigure(id)) &&
      Array.isArray(s.defeatedFigures) && s.defeatedFigures.length<12) {
    issues.push('search cannot reveal any remaining figure');
  }
  return { status:issues.length?'invalid':pending?'pending-placement':'ok',
    issues:[...new Set(issues)],missingFigures,duplicatedFigures };
}
export interface SearchPresentation {
  visible: boolean;
  revealedNumerics: string[];
  nextCardAvailable: boolean;
  specialActionsAvailable: boolean;
  integrityStatus: SearchIntegrityDiagnostic['status'];
}
/** GC-18/19: expose only already revealed cards, never the hidden draw order. */
export function getSearchPresentation(state: Readonly<ThunderfighterState>): SearchPresentation {
  const visible=state.phase==='searching'||state.phase==='placing-figure'&&!!state.placingFromSearch;
  const integrity=diagnoseSearchIntegrity(state);
  const legal=integrity.status==='invalid'?[]:getLegalActions(state);
  return {
    visible, revealedNumerics:visible?[...(state.searchBuffer??[])]:[],
    nextCardAvailable:visible&&state.phase==='searching'&&legal.some(a=>a.type==='draw-search'),
    specialActionsAvailable:visible&&legal.some(a=>a.type==='extract'||a.type==='reassign'),
    integrityStatus:integrity.status,
  };
}
function validate(value: unknown): ValidationResult {
  const errors: string[] = [];
  if (!record(value)) return { valid: false, errors: ['state must be an object'] };
  const s = value;
  if (s.rulesVersion !== THUNDERFIGHTER_RULES_VERSION) errors.push('incorrect rules version');
  if (!['initial-figures','replacement-offer','replacement-draw','replacement-figures','placing-figure','playing','searching'].includes(String(s.phase)))
    errors.push('invalid preparation phase');
  if (!['in-progress','win','loss'].includes(String(s.outcome))) errors.push('invalid outcome');
  if (s.outcome === 'loss' && !['armor','stalemate'].includes(String(s.lossReason))) errors.push('loss without a cause');
  if (s.outcome !== 'loss' && s.lossReason != null) errors.push('invalid loss cause');
  if (s.outcome === 'loss' && s.victoryScore != null) errors.push('loss with victory score');
  if (s.outcome === 'win' && s.phase !== 'playing') errors.push('invalid victory phase');
  if (!Array.isArray(s.grid) || s.grid.length !== 9 || !s.grid.every(p => Array.isArray(p))) errors.push('invalid grid');
  if (!Array.isArray(s.figureSlots) || s.figureSlots.length !== 12) errors.push('invalid exterior positions');
  if (!Array.isArray(s.drawPile) || !Array.isArray(s.pendingFigures) ||
      !Array.isArray(s.specialReserve) || !Array.isArray(s.spentSpecials) ||
      (s.searchBuffer !== undefined && !Array.isArray(s.searchBuffer)) ||
      (s.armorCards !== undefined && !Array.isArray(s.armorCards)) ||
      (s.lastShot !== undefined && !Array.isArray(s.lastShot))) errors.push('invalid card zones');
  if (errors.length) return { valid: false, errors };
  const state = s as unknown as ThunderfighterState;
  const empty = state.grid.flatMap((pile, cell) => pile.length ? [] : [cell]);
  if (state.grid.some(p => p.some(id => typeof id !== 'string' || !isNumber(id)))) errors.push('non-numeric grid card');
  if (state.pendingNumeric !== undefined && state.pendingNumeric !== null &&
      (!isNumber(state.pendingNumeric) || state.phase !== 'playing' || state.outcome !== 'in-progress'))
    errors.push('invalid pending numeric');
  if ((state.phase !== 'playing' && state.pendingNumeric != null)) errors.push('numeric drawn during preparation');
  if ((state.searchBuffer ?? []).some(id => typeof id !== 'string' || !isNumber(id)))
    errors.push('invalid search buffer');
  if (state.phase === 'searching' && (
      state.pendingNumeric != null || state.pendingFigures.length || state.outcome !== 'in-progress' ||
      state.figureSlots.some(id => id !== null && !(state.defeatedFigures ?? []).includes(id))))
    errors.push('invalid search phase');
  if (state.phase === 'searching' && (state.defeatedFigures??[]).length===12)
    errors.push('search after all figures defeated');
  if (state.phase === 'searching' && state.drawPile.every(id=>!isFigure(id)))
    errors.push('search lacks a remaining figure');
  if ((state.searchBuffer?.length ?? 0) > 0 && state.phase !== 'searching' &&
      !(state.phase === 'placing-figure' && state.placingFromSearch))
    errors.push('orphaned search buffer');
  if (state.placingFromSearch && state.phase !== 'placing-figure') errors.push('orphaned search placement');
  const armor = state.armorCards ?? [];
  if (armor.some(item => !record(item) || !isFigure(item.figureId) || !isNumber(item.cardId) ||
      !state.figureSlots.includes(item.figureId))) errors.push('invalid figure armor');
  if (state.lastShot && (state.lastShot.some(id => !isFigure(id) ||
      !(state.defeatedFigures ?? []).includes(id)) ||
      new Set(state.lastShot).size !== state.lastShot.length)) errors.push('invalid shot history');
  if (state.outcome === 'win' && ((state.defeatedFigures ?? []).length !== 12 ||
      state.victoryScore !== state.specialReserve.length)) errors.push('invalid victory');
  if (state.outcome !== 'win' && (state.defeatedFigures ?? []).length === 12)
    errors.push('twelfth defeated figure requires immediate victory');
  if (state.outcome === 'win' && (state.pendingNumeric != null || state.pendingFigures.length))
    errors.push('victory with unresolved draw or figure');
  if (state.outcome === 'loss' && state.lossReason === 'armor' &&
      !(state.armorCards ?? []).some(armor =>
        state.figureSlots.includes(armor.figureId) &&
        resistance(state, armor.figureId) >= (rankOf(armor.figureId) === 13 ? 19 : 20)))
    errors.push('armor loss without excessive resistance');

  if (state.outcome === 'in-progress' && state.victoryScore != null) errors.push('premature score');
  const emptyIsAllowed = state.phase === 'replacement-draw' ? empty.length === 1
    : state.phase === 'playing' || state.phase === 'placing-figure' || state.phase === 'searching' ? true : empty.length === 0;
  if (!emptyIsAllowed || !['playing','placing-figure','searching'].includes(state.phase) && state.grid.some(p => p.length > 1))
    errors.push('invalid preparation grid occupancy');
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
  if (state.spentSpecials.some(id => state.specialReserve.includes(id))) errors.push('special simultaneously spent and available');
  if (state.spentSpecials.length && !['playing','searching','placing-figure'].includes(state.phase))
    errors.push('special actions forbidden in preparation');
  if (typeof state.replacementUsed !== 'boolean' ||
      (state.replacementSlot !== null &&
       (!Number.isInteger(state.replacementSlot) || state.replacementSlot < 0 || state.replacementSlot > 8)))
    errors.push('invalid replacement metadata');
  if ((state.phase === 'replacement-draw' || state.phase === 'replacement-figures') !==
      (state.replacementUsed && state.replacementSlot !== null)) {
    if (!['playing','searching','replacement-offer','initial-figures'].includes(state.phase))
      errors.push('replacement phase mismatch');
  }
  if (state.phase === 'replacement-draw' && empty[0] !== state.replacementSlot) errors.push('wrong empty replacement cell');
  if ((state.phase === 'initial-figures' || state.phase === 'replacement-figures' || state.phase === 'placing-figure') && !state.pendingFigures.length)
    errors.push('figure phase without pending figure');
  if ((state.phase === 'replacement-offer' || state.phase === 'playing') && state.pendingFigures.length)
    errors.push('unplaced figures outside placement phase');
  if (state.phase === 'replacement-offer' && state.replacementUsed) errors.push('replacement already used');
  if (state.phase === 'initial-figures' && state.replacementUsed) errors.push('replacement too early');
  if ((state.phase === 'playing' || state.phase === 'placing-figure' || state.phase === 'searching') && state.replacementSlot !== null) errors.push('replacement not finished');
  const used = [
    ...state.grid.flat(), ...state.figureSlots.filter((id): id is string => typeof id === 'string'),
    ...state.pendingFigures, ...state.drawPile, ...state.specialReserve, ...state.spentSpecials,
    ...(state.pendingNumeric ? [state.pendingNumeric] : []), ...armor.map(a => a.cardId),
    ...(state.searchBuffer ?? []),
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
    pendingNumeric: null, searchBuffer: [], placingFromSearch: false,
    armorCards: [], lastShot: [], victoryScore: null, lossReason: null,
    replacementSlot: null, replacementUsed: false,
  };
  if (!validate(state).valid) throw new Error('Invalid initial Gridcannon V2 state');
  return state;
}
/** In a reallocation, the moved card is tested against the destination's actual current top. */
function legalReassignments(s: Readonly<ThunderfighterState>, cardId: string): ThunderfighterAction[] {
  if (!s.specialReserve.includes(cardId) || !cardId.startsWith('joker-')) return [];
  const moves: ThunderfighterAction[] = [];
  for (let from = 0; from < 9; from++) {
    const moving = s.grid[from].at(-1);
    if (!moving) continue;
    for (let to = 0; to < 9; to++) {
      if (to === from) continue;
      const destinationTop = s.grid[to].at(-1);
      if (!destinationTop || value(destinationTop) <= value(moving))
        moves.push({ type: 'reassign', cardId, from, to });
    }
  }
  return moves;
}
function specialActions(s: Readonly<ThunderfighterState>): ThunderfighterAction[] {
  const actions: ThunderfighterAction[] = [];
  for (const cardId of s.specialReserve) {
    if (cardId.startsWith('joker-')) actions.push(...legalReassignments(s,cardId));
    else if (isSpecial(cardId))
      for (let cell = 0; cell < 9; cell++)
        if (s.grid[cell].length) actions.push({type:'extract',cardId,cell});
  }
  return actions;
}
function applyShots(s: ThunderfighterState, cell: number): ThunderfighterState {
  // Both axes are computed from the same post-placement state, then merged atomically.
  const targets = getShotTargets(s,cell);
  const defeatedFigures = [...(s.defeatedFigures ?? []), ...targets];
  const won = defeatedFigures.length === 12;
  const livingRemain = s.figureSlots.some(id => id !== null && !defeatedFigures.includes(id));
  const phase = !won && !livingRemain && s.phase === 'playing' ? 'searching' : s.phase;
  // If the final living figure is beaten by a special while a numeric is pending,
  // that card becomes a held search numeric instead of orphaning an invalid turn.
  const enterSearch=phase==='searching'&&s.pendingNumeric!=null;
  return {...s, phase, defeatedFigures,lastShot:targets,
    pendingNumeric:enterSearch?null:s.pendingNumeric,
    searchBuffer:enterSearch?[...(s.searchBuffer??[]),s.pendingNumeric!]:s.searchBuffer,
    outcome:won?'win':'in-progress',victoryScore:won?s.specialReserve.length:null};
}
/** GC-21: rank by same suit, then same colour, then lowest FIGURE value. */
export function armorCandidates(s: Readonly<ThunderfighterState>): string[] {
  if (!s.pendingNumeric) return [];
  const pendingSuit=suitOf(s.pendingNumeric);
  const alive=s.figureSlots.filter((id): id is string =>
    id!==null && !(s.defeatedFigures??[]).includes(id));
  if (!alive.length) return [];
  const score=(id:string):number => {
    const suit=suitOf(id);
    return (suit===pendingSuit?0:isRed(suit)===isRed(pendingSuit)?1:2)*100+value(id);
  };
  const best=Math.min(...alive.map(score));
  return alive.filter(id=>score(id)===best);
}
function numericCanPlace(s:Readonly<ThunderfighterState>):boolean {
  return !!s.pendingNumeric && s.grid.some(p=>!p.length||value(p.at(-1)!)<=value(s.pendingNumeric!));
}
function hasLivingFigure(s:Readonly<ThunderfighterState>):boolean {
  return s.figureSlots.some(id=>id!==null&&!(s.defeatedFigures??[]).includes(id));
}
/** 
 * Explore every finite sequence of unspent specials. At most six cards can be spent,
 * so even Joker cycles terminate. Do not mutate the game or reveal the draw pile.
 */
function hasUsefulContinuation(s:Readonly<ThunderfighterState>, goal:'place'|'progress'):boolean {
  const seen=new Set<string>();
  function visit(grid:readonly (readonly string[])[], reserve:readonly string[]):boolean {
    const key=JSON.stringify([grid,reserve]);
    if(seen.has(key))return false;
    seen.add(key);
    const current:ThunderfighterState={...s,grid:grid.map(p=>[...p]),specialReserve:[...reserve]};
    if(goal==='place'&&numericCanPlace(current))return true;
    for(const cardId of reserve) {
      if(!cardId.startsWith('joker-')) {
        // Extraction refills the deck and always creates an empty playable cell.
        if(grid.some(p=>p.length))return true;
        continue;
      }
      const nextReserve=reserve.filter(id=>id!==cardId);
      for(const action of legalReassignments(current,cardId)) {
        if(action.type!=='reassign')continue;
        const moved=grid.map(p=>[...p]);
        moved[action.to].push(moved[action.from].pop()!);
        const post:ThunderfighterState={...current,grid:moved,specialReserve:[...nextReserve]};
        if(goal==='progress'&&getShotTargets(post,action.to).length)return true;
        if(visit(moved,nextReserve))return true;
      }
    }
    return false;
  }
  return visit(s.grid,s.specialReserve);
}
/** In a blocked numeric turn, offer only special actions leading to an actual solution. */
function usefulArmorRecourses(s:Readonly<ThunderfighterState>, specials:readonly ThunderfighterAction[]):ThunderfighterAction[] {
  return specials.filter(action=>{
    if(action.type==='extract')return true; // The extracted pile always creates a usable empty cell.
    if(action.type!=='reassign')return false;
    const grid=s.grid.map(p=>[...p]);
    const card=grid[action.from].pop();
    if(!card)return false;
    grid[action.to].push(card);
    const after:ThunderfighterState={...s,grid,
      specialReserve:s.specialReserve.filter(id=>id!==action.cardId)};
    return numericCanPlace(after) || hasUsefulContinuation(after,'place');
  });
}
function isDeadlock(s:Readonly<ThunderfighterState>):boolean {
  return s.phase==='playing'&&s.outcome==='in-progress'&&!s.pendingNumeric&&
    s.drawPile.length===0&&hasLivingFigure(s)&&!hasUsefulContinuation(s,'progress');
}
function finishIfDeadlocked(s:ThunderfighterState):ThunderfighterState {
  return isDeadlock(s)?{...s,outcome:'loss',lossReason:'stalemate',lastShot:[]}:s;
}
function getLegalActions(s: Readonly<ThunderfighterState>): readonly ThunderfighterAction[] {
  if (!validate(s).valid || s.outcome !== 'in-progress') return [];
  if (s.phase === 'initial-figures' || s.phase === 'replacement-figures' || s.phase === 'placing-figure')
    return availableFigureSlots(s).map(slot => ({ type: 'place-figure', slot }));
  if (s.phase === 'replacement-offer')
    return [{ type: 'skip-replacement' }, ...s.grid.map((_, cell) => ({ type: 'start-replacement' as const, cell }))];
  if (s.phase === 'replacement-draw' && s.drawPile.length) return [{ type: 'draw-replacement' }];
  if (s.phase === 'searching') return [...specialActions(s), ...(s.drawPile.length ? [{ type: 'draw-search' as const }] : [])];
  if (s.phase === 'playing') {
    const specials = specialActions(s);
    if (s.pendingNumeric) {
      const numeric = value(s.pendingNumeric);
      const placements=s.grid.flatMap((pile, cell) =>
        !pile.length || value(pile.at(-1)!) <= numeric ? [{ type: 'place-number' as const, cell }] : []);
      if(placements.length)return [...specials,...placements];
      // A usable sequence of As/Joker actions takes precedence over armor.
      const useful=usefulArmorRecourses(s,specials);
      if(useful.length)return useful;
      return armorCandidates(s).map(figureId=>({type:'assign-armor' as const,figureId}));
    }
    return [...specials, ...(s.drawPile.length ? [{ type: 'draw-card' as const }] : [])];
  }
  return [];
}
function transition(s: Readonly<ThunderfighterState>, action: Readonly<ThunderfighterAction>): TransitionResult<ThunderfighterState> {
  const reject = (reason: string): TransitionResult<ThunderfighterState> => ({ accepted: false, state: s as ThunderfighterState, reason });
  if (!record(action) || !getLegalActions(s).some(a =>
    a.type === action.type && Object.keys(a).length === Object.keys(action).length &&
    Object.entries(a).every(([key, value]) => (action as unknown as Record<string, unknown>)[key] === value)))
    return reject('illegal action or incomplete preparation');
  if (action.type === 'assign-armor') {
    const armorCards=[...(s.armorCards??[]),{figureId:action.figureId,cardId:s.pendingNumeric!}];
    const after:ThunderfighterState={...s,armorCards,pendingNumeric:null,lastShot:[]};
    const rank=value(action.figureId);
    const max=rank===13?19:20;
    if(resistance(after,action.figureId)>=max)
      return {accepted:true,state:{...after,outcome:'loss',lossReason:'armor'}};
    return {accepted:true,state:finishIfDeadlocked(after)};
  }
  if (action.type === 'extract') {
    const grid=s.grid.map(p=>[...p]);
    const removed=grid[action.cell];
    grid[action.cell]=[];
    const reserve=s.specialReserve.filter(id=>id!==action.cardId);
    return {accepted:true,state:finishIfDeadlocked({...s,grid,drawPile:[...s.drawPile,...removed.slice().reverse()],
      specialReserve:reserve,spentSpecials:[...s.spentSpecials,action.cardId],lastShot:[]})};
  }
  if (action.type === 'reassign') {
    const grid=s.grid.map(p=>[...p]);
    const card=grid[action.from].pop()!;
    grid[action.to].push(card);
    const reserve=s.specialReserve.filter(id=>id!==action.cardId);
    const moved:ThunderfighterState={...s,grid,specialReserve:reserve,
      spentSpecials:[...s.spentSpecials,action.cardId],lastShot:[]};
    return {accepted:true,state: s.phase==='playing' ?
      finishIfDeadlocked(applyShots(moved,action.to)) : moved};
  }
  if (action.type === 'draw-search') {
    const [id,...drawPile]=s.drawPile;
    if (isSpecial(id)) return {accepted:true,state:{...s,drawPile,specialReserve:[...s.specialReserve,id]}};
    if (isFigure(id)) return {accepted:true,state:{...s,drawPile,pendingFigures:[id],
      phase:'placing-figure',placingFromSearch:true}};
    return {accepted:true,state:{...s,drawPile,searchBuffer:[...(s.searchBuffer??[]),id]}};
  }
  if (action.type === 'draw-card') {
    const id = s.drawPile[0], drawPile = s.drawPile.slice(1);
    if (isFigure(id)) return { accepted: true, state: { ...s, drawPile,
      pendingFigures: [id], phase: 'placing-figure', lastShot: [] } };
    if (isSpecial(id)) return { accepted: true, state: finishIfDeadlocked({ ...s, drawPile,
      specialReserve: [...s.specialReserve,id], lastShot: [] }) };
    return { accepted: true, state: { ...s, drawPile, pendingNumeric: id, lastShot: [] } };
  }
  if (action.type === 'place-number') {
    const grid = s.grid.map(p => [...p]);
    grid[action.cell].push(s.pendingNumeric!);
    const postPlacement: ThunderfighterState = { ...s, grid, pendingNumeric: null };
    return {accepted:true,state:finishIfDeadlocked(applyShots(postPlacement,action.cell))};
  }
  if (action.type === 'place-figure') {
    const figureSlots = [...s.figureSlots]; figureSlots[action.slot] = s.pendingFigures[0];
    const pendingFigures = s.pendingFigures.slice(1);
    const phase = pendingFigures.length ? s.phase : s.phase === 'initial-figures' ? 'replacement-offer' : 'playing';
    const searchCompleted = phase === 'playing' && s.placingFromSearch;
    const next = { ...s, figureSlots, pendingFigures, phase,
      drawPile: searchCompleted ? [...s.drawPile,...(s.searchBuffer??[])] : s.drawPile,
      searchBuffer: searchCompleted ? [] : (s.searchBuffer??[]),
      placingFromSearch: searchCompleted ? false : (s.placingFromSearch??false),
      replacementSlot: phase === 'playing' ? null : s.replacementSlot };
    return { accepted: true, state: finishIfDeadlocked(next) };
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
/** Read-only official outcome: only undepended As/Jokers in reserve score. */
export interface ThunderfighterResult {
  outcome: GameOutcome;
  reason: 'victory' | 'armor' | 'stalemate' | null;
  officialScore: number | null;
  defeatedCount: number;
  physicalCardCount: number;
}
export function getThunderfighterResult(state: Readonly<ThunderfighterState>): ThunderfighterResult {
  const checked=validate(state);
  if (!checked.valid) throw new TypeError('Cannot report an invalid Thunderfighter state');
  const count=(state.defeatedFigures ?? []).length;
  const physical=state.grid.flat().length + state.figureSlots.filter(Boolean).length +
    state.pendingFigures.length + state.drawPile.length + state.specialReserve.length +
    state.spentSpecials.length + (state.pendingNumeric ? 1 : 0) +
    (state.searchBuffer ?? []).length + (state.armorCards ?? []).length;
  return {
    outcome:state.outcome,reason:state.outcome === 'win' ? 'victory' :
      state.outcome === 'loss' ? (state.lossReason ?? null) : null,
    officialScore:state.outcome === 'win' ? state.victoryScore ?? null : null,
    defeatedCount:count,physicalCardCount:physical,
  };
}
export const thunderfighterEngine: GameEngine<ThunderfighterState, ThunderfighterAction, ThunderfighterSetup> = {
  createInitialState, getLegalActions, transition,
  getOutcome: state => state.outcome,
  getVictoryScore: state => state.outcome === 'win' ? state.victoryScore ?? null : null,
  validateState: validate,
};
