import { makeDeckWithJokers, shuffle } from '../../core/cards.ts';
import { createSeededRandom } from '../../core/deterministic-deck.ts';
import type { GameEngine, GameOutcome, TransitionResult, ValidationResult } from '../../core/game-engine.ts';

export const GRIM_DELVE_RULES_VERSION = 'classic-1.1.0' as const;
export const GRIM_DELVE_GAME_ID = 'clear-the-dungeon' as const;

export interface GrimDelveSetup { seed: number }
export type GrimDelvePhase = 'attack' | 'finished';
export interface GrimDelveState {
  rulesVersion: typeof GRIM_DELVE_RULES_VERSION;
  phase: GrimDelvePhase;
  outcome: GameOutcome;
  /** First card of a column is its currently revealed monster. */
  columns: string[][];
  visibleMonsters: (string | null)[];
  drawPile: string[];
  hand: string[];
  damages: string[];
  defeated: string[];
  removed: string[];
  handNumber: number;
}
export type GrimDelveAction =
  | Readonly<{ type: 'discard'; cardId: string }>
  | Readonly<{ type: 'end-hand' }>;

const canonical = makeDeckWithJokers();
const validIds = new Set(canonical.map(card=>card.id));
const monsterIds = new Set(canonical.filter(card=>'rank' in card && card.rank>=11).map(card=>card.id));
const powerIds = new Set(canonical.filter(card=>!monsterIds.has(card.id)).map(card=>card.id));

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function validate(value: unknown): ValidationResult {
  const errors: string[] = [];
  if (!record(value)) return {valid:false,errors:['state must be an object']};
  const state=value;
  if(state.rulesVersion!==GRIM_DELVE_RULES_VERSION) errors.push('rules version mismatch');
  if(state.phase!=='attack' && state.phase!=='finished') errors.push('invalid phase');
  if(!['in-progress','win','loss'].includes(String(state.outcome))) errors.push('invalid outcome');
  if((state.phase==='finished') !== (state.outcome!=='in-progress')) errors.push('phase/outcome mismatch');
  if(!Number.isSafeInteger(state.handNumber) || (state.handNumber as number)<1) errors.push('invalid hand number');
  if(!Array.isArray(state.columns) || state.columns.length!==4 || !state.columns.every(c=>Array.isArray(c)&&c.length<=3)) errors.push('invalid monster columns');
  const zones=['drawPile','hand','damages','defeated','removed'] as const;
  if(zones.some(name=>!Array.isArray(state[name]))) errors.push('invalid power zones');
  if(errors.length) return {valid:false,errors};
  const columns = state.columns as string[][];
  const draws = state.drawPile as string[];
  const hand = state.hand as string[];
  const damages = state.damages as string[];
  const defeated = state.defeated as string[];
  const removed = state.removed as string[];
  const monsterCards=[...columns.flat(),...defeated];
  const powerCards=[...draws,...hand,...damages,...removed];
  const all=[...monsterCards,...powerCards];
  if(all.length!==54 || new Set(all).size!==54 || all.some(id=>typeof id!=='string'||!validIds.has(id))) errors.push('duplicate, missing or unknown card');
  if(monsterCards.some(id=>!monsterIds.has(id)) || powerCards.some(id=>!powerIds.has(id))) errors.push('card in incorrect zone');
  if(!Array.isArray(state.visibleMonsters) || state.visibleMonsters.length!==4 ||
     columns.some((column,index)=>(state.visibleMonsters as unknown[])[index] !== (column[0]??null))) errors.push('revealed monster mismatch');
  if(hand.length>3 || damages.length>7) errors.push('invalid zone size');
  if(state.outcome==='in-progress' && (damages.length>=7 || defeated.length===12)) errors.push('terminal condition not applied');
  if(state.outcome==='win' && defeated.length!==12) errors.push('invalid victory');
  if(state.outcome==='loss' && damages.length!==7 && draws.length>0) errors.push('invalid loss');
  return errors.length?{valid:false,errors}:{valid:true};
}

function createInitialState(setup: GrimDelveSetup): GrimDelveState {
  if(!record(setup) || Object.keys(setup).some(key=>key!=='seed')) throw new TypeError('Only seed is supported by Classic 1.1.0');
  const rng=createSeededRandom(setup.seed);
  const monsters=shuffle(canonical.filter(card=>monsterIds.has(card.id)),rng).map(card=>card.id);
  const power=shuffle(canonical.filter(card=>powerIds.has(card.id)),rng).map(card=>card.id);
  const columns=Array.from({length:4},(_,index)=>monsters.slice(index*3,index*3+3));
  const state: GrimDelveState={
    rulesVersion: GRIM_DELVE_RULES_VERSION,
    phase:'attack', outcome:'in-progress', columns,
    visibleMonsters:columns.map(column=>column[0]),
    hand:power.slice(0,3),drawPile:power.slice(3),
    damages:[],defeated:[],removed:[],handNumber:1,
  };
  if(!validate(state).valid) throw new Error('Invalid initial Classic game');
  return state;
}

function getLegalActions(state: Readonly<GrimDelveState>): readonly GrimDelveAction[] {
  if(!validate(state).valid || state.outcome!=='in-progress') return [];
  if(state.hand.length) return state.hand.map(cardId=>({type:'discard' as const,cardId}));
  return [{type:'end-hand'}];
}
function transition(state: Readonly<GrimDelveState>, action: Readonly<GrimDelveAction>): TransitionResult<GrimDelveState> {
  const refused=(reason:string): TransitionResult<GrimDelveState>=>({accepted:false,state:state as GrimDelveState,reason});
  if(!validate(state).valid) return refused('invalid game state');
  if(state.outcome!=='in-progress') return refused('game finished');
  if(action.type==='discard') {
    if(!state.hand.includes(action.cardId)) return refused('card not in hand');
    const damages=[...state.damages,action.cardId];
    const outcome=damages.length===7?'loss':'in-progress';
    return {accepted:true,state:{...state,hand:state.hand.filter(id=>id!==action.cardId),damages,
      outcome,phase:outcome==='loss'?'finished':'attack'}};
  }
  if(action.type==='end-hand') {
    if(state.hand.length) return refused('hand must be empty before next draw');
    if(state.drawPile.length===0) return {accepted:true,state:{...state,phase:'finished',outcome:'loss'}};
    const next=state.drawPile.slice(0,3);
    return {accepted:true,state:{...state,hand:next,drawPile:state.drawPile.slice(next.length),handNumber:state.handNumber+1}};
  }
  return refused('unknown action');
}

/** Only initial draw/discard/hand-closure are exposed here; attacks belong to the next story. */
export const grimDelveEngine: GameEngine<GrimDelveState,GrimDelveAction,GrimDelveSetup>={
  createInitialState,getLegalActions,transition,getOutcome:state=>state.outcome,validateState:validate,
};
