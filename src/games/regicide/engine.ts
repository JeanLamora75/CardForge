import { makeDeckWithJokers, isJokerCard, shuffle } from '../../core/cards.ts';
import { createSeededRandom } from '../../core/deterministic-deck.ts';
import type { GameEngine, GameOutcome, ValidationResult, TransitionResult } from '../../core/game-engine.ts';

export const REGICIDE_GAME_ID = 'regicide' as const;
export const REGICIDE_RULES_VERSION = 'regicide-solo' as const;
export interface RegicideSetup { seed: number }
export interface RegicideState {
  rulesVersion: typeof REGICIDE_RULES_VERSION;
  seed: number;
  phase: 'play';
  outcome: 'in-progress';
  activeEnemy: string;
  enemyHealth: number;
  enemyAttack: number;
  shield: number;
  castle: string[];
  tavern: string[];
  hand: string[];
  discard: string[];
  combat: string[];
  jokers: { id: string; used: boolean }[];
}
export type RegicideAction = Readonly<{ type: string }>;
const canonical = makeDeckWithJokers();
const allIds = new Set(canonical.map(c => c.id));
const rankIds = (rank: number) => canonical.filter(c => !isJokerCard(c) && c.rank === rank).map(c => c.id);
const tavernIds = canonical.filter(c => !isJokerCard(c) && c.rank <= 10).map(c => c.id);
const tavernSet = new Set(tavernIds);
const validSeed = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 0xffff_ffff;
const record = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v);
const fields = ['rulesVersion','seed','phase','outcome','activeEnemy','enemyHealth','enemyAttack','shield','castle','tavern','hand','discard','combat','jokers'];
const rank = (id: string) => Number(id.split('-')[1]);

function createInitialState(setup: RegicideSetup): RegicideState {
  if (!record(setup) || Object.keys(setup).length !== 1 || !validSeed(setup.seed)) throw new TypeError('a uint32 seed is required');
  const random = createSeededRandom(setup.seed);
  const kings = shuffle(rankIds(13), random);
  const queens = shuffle(rankIds(12), random);
  const jacks = shuffle(rankIds(11), random);
  const tavern = shuffle(tavernIds, random);
  return {
    rulesVersion: REGICIDE_RULES_VERSION, seed: setup.seed, phase: 'play', outcome: 'in-progress',
    activeEnemy: jacks[0], enemyHealth: 20, enemyAttack: 10, shield: 0,
    castle: [...jacks.slice(1), ...queens, ...kings], tavern: tavern.slice(8), hand: tavern.slice(0,8),
    discard: [], combat: [], jokers: [{id:'joker-1',used:false},{id:'joker-2',used:false}],
  };
}

/** Until turn transitions are implemented, only the regulatory opening state is accepted. */
function validateState(value: unknown): ValidationResult {
  const invalid = (reason: string): ValidationResult => ({valid:false, errors:[reason]});
  if (!record(value) || Object.keys(value).length !== fields.length || fields.some(k => !Object.hasOwn(value,k))) return invalid('invalid state fields');
  if (value.rulesVersion !== REGICIDE_RULES_VERSION || !validSeed(value.seed) || value.phase !== 'play' || value.outcome !== 'in-progress' ||
      value.enemyHealth !== 20 || value.enemyAttack !== 10 || value.shield !== 0) return invalid('invalid opening metadata');
  const zones: string[][] = [];
  for (const key of ['castle','tavern','hand','discard','combat']) {
    const zone = value[key];
    if (!Array.isArray(zone) || !Array.from(zone).every(id => typeof id === 'string' && allIds.has(id))) return invalid('invalid '+key);
    zones.push(zone);
  }
  const [castle,tavern,hand,discard,combat] = zones;
  if (castle.length !== 11 || tavern.length !== 32 || hand.length !== 8 || discard.length || combat.length) return invalid('invalid opening zone sizes');
  if (typeof value.activeEnemy !== 'string' || !rankIds(11).includes(value.activeEnemy)) return invalid('invalid active enemy');
  if (!castle.every((id,i) => rank(id) === (i < 3 ? 11 : i < 7 ? 12 : 13))) return invalid('invalid castle order');
  if (![...tavern,...hand].every(id => tavernSet.has(id))) return invalid('invalid tavern card');
  const jokers = value.jokers;
  if (!Array.isArray(jokers) || jokers.length !== 2 || !Array.from(jokers).every((j,i) => record(j) && Object.keys(j).length === 2 && j.id === 'joker-'+(i+1) && j.used === false)) return invalid('invalid opening jokers');
  const physical = [value.activeEnemy,...zones.flat(),...jokers.map(j => j.id)];
  if (physical.length !== 54 || new Set(physical).size !== 54 || !physical.every(id => allIds.has(id))) return invalid('invalid physical partition');
  return {valid:true};
}

export function inspectRegicide(state: Readonly<RegicideState>) {
  if (!validateState(state).valid) throw new TypeError('invalid Regicide state');
  return {
    phase: state.phase, outcome: state.outcome, activeEnemy: state.activeEnemy,
    enemyHealth: state.enemyHealth, enemyAttack: state.enemyAttack, shield: state.shield,
    hand: [...state.hand], jokers: state.jokers.map(j => ({...j})),
    counts: {castle:state.castle.length,tavern:state.tavern.length,discard:state.discard.length},
  };
}

export const regicideEngine: GameEngine<RegicideState,RegicideAction,RegicideSetup> = {
  createInitialState, validateState,
  getLegalActions: () => [],
  getOutcome: (state): GameOutcome => state.outcome,
  transition: (state): TransitionResult<RegicideState> => ({
    accepted:false,state,reason:validateState(state).valid?'turn actions not implemented':'invalid state',
  }),
};
