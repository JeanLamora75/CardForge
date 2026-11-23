import { makeDeckWithJokers, shuffle } from '../../core/cards.ts';
import { createSeededRandom } from '../../core/deterministic-deck.ts';
import type { GameEngine, GameOutcome, TransitionResult, ValidationResult } from '../../core/game-engine.ts';

export const GRIM_DELVE_RULES_VERSION = 'classic-1.1.0' as const;
export const GRIM_DELVE_GAME_ID = 'clear-the-dungeon' as const;

export interface GrimDelveSetup { seed: number }
export type GrimDelvePhase = 'attack' | 'finished';
export interface PlacedPower { cardId: string; handNumber: number }
export interface PartialAttack { monsterId: string; powers: PlacedPower[] }
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
  attacks: PartialAttack[];
  handNumber: number;
}
export type GrimDelveAction =
  | Readonly<{ type: 'discard'; cardId: string }>
  | Readonly<{ type: 'discard-remaining' }>
  | Readonly<{ type: 'end-hand' }>
  | Readonly<{ type: 'place-power'; cardId: string; monsterId: string }>
  | Readonly<{ type: 'take-back'; cardId: string }>
  | Readonly<{ type: 'move-power'; cardId: string; monsterId: string }>
  | Readonly<{ type: 'trigger-attack'; cardId: string; monsterId: string }>;

const canonical = makeDeckWithJokers();
const byId = new Map(canonical.map(card=>[card.id,card]));
const validIds = new Set(byId.keys());
const monsterIds = new Set(canonical.filter(card=>'rank' in card && card.rank>=11).map(card=>card.id));
const powerIds = new Set(canonical.filter(card=>!monsterIds.has(card.id)).map(card=>card.id));

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
const maxPower = 10;
function strength(id: string): number {
  const card=byId.get(id);
  return !card ? 0 : 'kind' in card ? 10 : card.rank;
}
function matchesSuit(cardId: string, monsterId: string): boolean {
  const card=byId.get(cardId), monster=byId.get(monsterId);
  return !!card && !!monster && ('kind' in card || !('kind' in monster) && card.suit===monster.suit);
}
function powersValid(cards: readonly PlacedPower[], monsterId: string): boolean {
  if(cards.length>2 || !monsterIds.has(monsterId)) return false;
  if(cards.length>=1 && strength(cards[0].cardId)+maxPower<strength(monsterId)) return false;
  if(cards.length===2 && strength(cards[0].cardId)+strength(cards[1].cardId)<strength(monsterId)) return false;
  return true;
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
  if(zones.some(name=>!Array.isArray(state[name])) || !Array.isArray(state.attacks)) errors.push('invalid power zones');
  if(errors.length) return {valid:false,errors};
  const columns = state.columns as string[][];
  const draws = state.drawPile as string[];
  const hand = state.hand as string[];
  const damages = state.damages as string[];
  const defeated = state.defeated as string[];
  const removed = state.removed as string[];
  const attacks=state.attacks as unknown[];
  const placed: string[]=[];
  const activeMonsters=new Set(columns.map(col=>col[0]).filter((id):id is string=>typeof id==='string'));
  const targeted=new Set<string>();
  for(const entry of attacks) {
    if(!record(entry)||typeof entry.monsterId!=='string'||!Array.isArray(entry.powers)) {errors.push('invalid attack entry');continue;}
    if(!activeMonsters.has(entry.monsterId)||targeted.has(entry.monsterId)) errors.push('attack on hidden, absent or duplicate monster');
    targeted.add(entry.monsterId);
    if(entry.powers.length===0||entry.powers.length>2) errors.push('invalid partial attack size');
    const powers:PlacedPower[]=[];
    for(const power of entry.powers) {
      if(!record(power)||typeof power.cardId!=='string'||!Number.isSafeInteger(power.handNumber)||
         (power.handNumber as number)<1 || (power.handNumber as number)>(state.handNumber as number)) {
        errors.push('invalid placed card metadata');continue;
      }
      powers.push({cardId:power.cardId,handNumber:power.handNumber as number});
      placed.push(power.cardId);
    }
    if(!powersValid(powers,entry.monsterId)) errors.push('invalid partial attack strength');
  }
  const monsterCards=[...columns.flat(),...defeated];
  const powerCards=[...draws,...hand,...damages,...removed,...placed];
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
    damages:[],defeated:[],removed:[],attacks:[],handNumber:1,
  };
  if(!validate(state).valid) throw new Error('Invalid initial Classic game');
  return state;
}

function getLegalActions(state: Readonly<GrimDelveState>): readonly GrimDelveAction[] {
  if(!validate(state).valid||state.outcome!=='in-progress') return [];
  const actions:GrimDelveAction[]=state.hand.map(cardId=>({type:'discard',cardId}));
  if(state.hand.length) actions.push({type:'discard-remaining'});
  for(const monsterId of state.visibleMonsters) {
    if(!monsterId) continue;
    const attack=state.attacks.find(item=>item.monsterId===monsterId);
    const powers=attack?.powers??[];
    for(const cardId of state.hand) {
      if(powers.length<2 && powersValid([...powers,{cardId,handNumber:state.handNumber}],monsterId))
        actions.push({type:'place-power',cardId,monsterId});
      if(powers.length===2 && matchesSuit(cardId,monsterId))
        actions.push({type:'trigger-attack',cardId,monsterId});
    }
  }
  for(const attack of state.attacks) for(const power of attack.powers) {
    if(power.handNumber!==state.handNumber) continue;
    const remaining=attack.powers.filter(item=>item.cardId!==power.cardId);
    if(powersValid(remaining,attack.monsterId)) actions.push({type:'take-back',cardId:power.cardId});
    for(const monsterId of state.visibleMonsters) {
      if(!monsterId||monsterId===attack.monsterId||!powersValid(remaining,attack.monsterId)) continue;
      const target=state.attacks.find(item=>item.monsterId===monsterId)?.powers??[];
      if(powersValid([...target,power],monsterId)) actions.push({type:'move-power',cardId:power.cardId,monsterId});
    }
  }
  if(state.hand.length===0) actions.push({type:'end-hand'});
  return actions;
}
function transition(state:Readonly<GrimDelveState>,action:Readonly<GrimDelveAction>):TransitionResult<GrimDelveState> {
  const refused=(reason:string):TransitionResult<GrimDelveState>=>({accepted:false,state:state as GrimDelveState,reason});
  if(!validate(state).valid) return refused('invalid game state');
  if(state.outcome!=='in-progress') return refused('game finished');
  if(!record(action) ||
     Object.keys(action).some(key=>!['type','cardId','monsterId'].includes(key)) ||
     (['end-hand','discard-remaining'].includes(String(action.type)) && Object.keys(action).length!==1) ||
     (['discard','take-back'].includes(String(action.type)) && Object.keys(action).length!==2) ||
     (['place-power','move-power','trigger-attack'].includes(String(action.type)) && Object.keys(action).length!==3) ||
     !getLegalActions(state).some(legal=>legal.type===action.type &&
      (('cardId' in legal ? legal.cardId : undefined)===('cardId' in action ? action.cardId : undefined)) &&
      (('monsterId' in legal ? legal.monsterId : undefined)===('monsterId' in action ? action.monsterId : undefined)))) return refused('illegal action');
  if(action.type==='discard-remaining') {
    const count=Math.min(state.hand.length,7-state.damages.length);
    const damages=[...state.damages,...state.hand.slice(0,count)];
    const outcome=damages.length===7?'loss':'in-progress';
    return {accepted:true,state:{...state,hand:state.hand.slice(count),damages,
      phase:outcome==='loss'?'finished':'attack',outcome}};
  }
  if(action.type==='discard') {
    const damages=[...state.damages,action.cardId];
    const outcome=damages.length===7?'loss':'in-progress';
    return {accepted:true,state:{...state,hand:state.hand.filter(id=>id!==action.cardId),damages,
      outcome,phase:outcome==='loss'?'finished':'attack'}};
  }
  if(action.type==='end-hand') {
    const attacks=state.attacks.map(a=>({monsterId:a.monsterId,powers:a.powers.map(p=>({...p}))}));
    if(state.drawPile.length===0) return {accepted:true,state:{...state,attacks,phase:'finished',outcome:'loss'}};
    const next=state.drawPile.slice(0,3);
    return {accepted:true,state:{...state,attacks,hand:next,drawPile:state.drawPile.slice(next.length),handNumber:state.handNumber+1}};
  }
  if(action.type==='place-power') {
    const attacks=state.attacks.map(a=>({monsterId:a.monsterId,powers:[...a.powers]}));
    const target=attacks.find(a=>a.monsterId===action.monsterId);
    const power={cardId:action.cardId,handNumber:state.handNumber};
    if(target) target.powers.push(power); else attacks.push({monsterId:action.monsterId,powers:[power]});
    return {accepted:true,state:{...state,attacks,hand:state.hand.filter(id=>id!==action.cardId)}};
  }
  if(action.type==='take-back'||action.type==='move-power') {
    const attacks=state.attacks.map(a=>({monsterId:a.monsterId,powers:a.powers.filter(p=>p.cardId!==action.cardId)})).filter(a=>a.powers.length);
    if(action.type==='move-power') {
      const entry=attacks.find(a=>a.monsterId===action.monsterId);
      const power={cardId:action.cardId,handNumber:state.handNumber};
      if(entry) entry.powers.push(power); else attacks.push({monsterId:action.monsterId,powers:[power]});
      return {accepted:true,state:{...state,attacks}};
    }
    return {accepted:true,state:{...state,attacks,hand:[...state.hand,action.cardId]}};
  }
  if(action.type==='trigger-attack') {
    const target=state.attacks.find(a=>a.monsterId===action.monsterId)!;
    const columnIndex=state.columns.findIndex(column=>column[0]===action.monsterId);
    const columns=state.columns.map(column=>[...column]);
    columns[columnIndex].shift();
    const defeated=[...state.defeated,action.monsterId];
    const outcome=defeated.length===12?'win':'in-progress';
    return {accepted:true,state:{...state,columns,visibleMonsters:columns.map(column=>column[0]??null),
      hand:state.hand.filter(id=>id!==action.cardId),
      attacks:state.attacks.filter(a=>a.monsterId!==action.monsterId).map(a=>({monsterId:a.monsterId,powers:[...a.powers]})),
      defeated,removed:[...state.removed,...target.powers.map(p=>p.cardId),action.cardId],
      outcome,phase:outcome==='win'?'finished':'attack'}};
  }
  return refused('unknown action');
}

/** Each step is derived from legal actions; no UI-specific rule is used. */
export const grimDelveEngine: GameEngine<GrimDelveState,GrimDelveAction,GrimDelveSetup>={
  createInitialState,getLegalActions,transition,getOutcome:state=>state.outcome,validateState:validate,
};
