import { makeDeckWithJokers, isJokerCard, shuffle } from '../../core/cards.ts';
import { createSeededRandom } from '../../core/deterministic-deck.ts';
import type { GameEngine, GameOutcome, ValidationResult, TransitionResult } from '../../core/game-engine.ts';

export const REGICIDE_GAME_ID = 'regicide' as const;
export const REGICIDE_RULES_VERSION = 'regicide-solo' as const;
export interface RegicideSetup { seed: number }
export type RegicidePhase = 'play' | 'powers' | 'damage' | 'retaliation' | 'finished';
export interface RegicideState {
  rulesVersion: typeof REGICIDE_RULES_VERSION;
  seed: number;
  phase: RegicidePhase;
  outcome: GameOutcome;
  activeEnemy: string | null;
  pending: string[];
  turn: number;
  recycleCount: number;
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
export type RegicideAction = Readonly<{ type: 'play'; cardIds: readonly string[] } | { type: 'resolve-powers' | 'resolve-damage' } | { type: 'retaliate'; cardIds: readonly string[] } | { type: 'use-joker'; jokerId: string } | { type: 'accept-defeat' }>;
const canonical = makeDeckWithJokers();
const allIds = new Set(canonical.map(c => c.id));
const rankIds = (rank: number) => canonical.filter(c => !isJokerCard(c) && c.rank === rank).map(c => c.id);
const tavernIds = canonical.filter(c => !isJokerCard(c) && c.rank <= 10).map(c => c.id);
const tavernSet = new Set(tavernIds);
const validSeed = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 0xffff_ffff;
const record = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v);
const fields = ['rulesVersion','seed','phase','outcome','activeEnemy','enemyHealth','enemyAttack','shield','castle','tavern','hand','discard','combat','jokers','pending','turn','recycleCount'];
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
    activeEnemy: jacks[0], pending: [], turn: 1, recycleCount: 0, enemyHealth: 20, enemyAttack: 10, shield: 0,
    castle: [...jacks.slice(1), ...queens, ...kings], tavern: tavern.slice(8), hand: tavern.slice(0,8),
    discard: [], combat: [], jokers: [{id:'joker-1',used:false},{id:'joker-2',used:false}],
  };
}

const valueOf = (id: string) => rank(id) >= 11 ? (rank(id)-9)*5 : rank(id);
const suit = (id: string) => id.split('-')[0];
const sum = (ids: readonly string[]) => ids.reduce((n,id)=>n+valueOf(id),0);
/** A suit triggers once per attack; enemy immunity affects powers, not card value. */
function attackEffects(ids: readonly string[], enemy: string) {
  const power=sum(ids);
  const suits=new Set(ids.map(suit).filter(s=>s!==suit(enemy)));
  return {power, recycle:suits.has('hearts'), draw:suits.has('diamonds'),
    shield:suits.has('spades')?power:0, damage:power*(suits.has('clubs')?2:1)};
}
const uint = (v: unknown): v is number => typeof v==='number' && Number.isSafeInteger(v) && v>=0;
const same = (a: readonly string[], b: readonly string[]) => a.length===b.length && a.every(id=>b.includes(id));
function validPlay(ids: readonly string[]): boolean {
  if(new Set(ids).size!==ids.length||!ids.every(id=>allIds.has(id)&&!id.startsWith('joker')))return false;
  if(ids.length===1)return true;
  if(ids.length===2 && ids.some(id=>rank(id)===1))return true;
  return ids.length>=2 && ids.length<=4 && rank(ids[0])>=2 && rank(ids[0])<=10 &&
    ids.every(id=>rank(id)===rank(ids[0])) && sum(ids)<=10;
}
function validateState(value: unknown): ValidationResult {
  const invalid = (reason: string): ValidationResult => ({valid:false,errors:[reason]});
  if(!record(value)||Object.keys(value).length!==fields.length||fields.some(k=>!Object.hasOwn(value,k)))return invalid('invalid state fields');
  if(value.rulesVersion!==REGICIDE_RULES_VERSION||!validSeed(value.seed)||!uint(value.turn)||value.turn===0||
    !uint(value.recycleCount)||value.recycleCount>0xffffffff||!uint(value.shield)||!uint(value.enemyHealth)||!uint(value.enemyAttack)||
    !['play','powers','damage','retaliation','finished'].includes(String(value.phase))||
    !['in-progress','win','loss'].includes(String(value.outcome))||
    (value.phase==='finished')!==(value.outcome!=='in-progress'))return invalid('invalid metadata');
  const zones: string[][]=[];
  for(const key of ['castle','tavern','hand','discard','combat','pending']){
    const zone=value[key];
    if(!Array.isArray(zone)||!Array.from(zone).every(id=>typeof id==='string'&&allIds.has(id)&&!id.startsWith('joker')))return invalid('invalid '+key);
    zones.push(zone);
  }
  const [castle,tavern,hand,discard,combat,pending]=zones;
  const active=value.activeEnemy;
  if(hand.length>8||castle.length>11||castle.some((id,i)=>rank(id)<11||(i>0&&rank(id)<rank(castle[i-1]))))return invalid('invalid zones');
  if(value.outcome==='win'){
    if(active!==null||castle.length||combat.length||value.enemyHealth||value.enemyAttack||value.shield)return invalid('invalid win');
  }else{
    if(typeof active!=='string'||!allIds.has(active)||rank(active)<11||rank(active)>13||
      castle.some(id=>rank(id)<rank(active))||value.enemyAttack!==valueOf(active)||
      value.enemyHealth<1||value.enemyHealth>valueOf(active)*2)return invalid('invalid enemy');
    const remaining=castle.length+1;
    if(rank(active)!== (remaining>8?11:remaining>4?12:13)||
      castle.some((id,i)=>rank(id)!==(remaining-i-1>8?11:remaining-i-1>4?12:13)))return invalid('invalid castle order');
  }
  if((value.phase==='powers'||value.phase==='damage')!== (pending.length>0)||!(!pending.length||validPlay(pending)))return invalid('invalid pending play');
  const jokers=value.jokers;
  if(!Array.isArray(jokers)||jokers.length!==2||!Array.from(jokers).every((j,i)=>record(j)&&Object.keys(j).length===2&&j.id==='joker-'+(i+1)&&typeof j.used==='boolean'))return invalid('invalid jokers');
  if(value.outcome==='loss'&&(sum(hand)>=Math.max(0,value.enemyAttack-value.shield)))return invalid('defeat requires insufficient defence');
  const physical=[...(active===null?[]:[active]),...zones.flat(),...jokers.map(j=>j.id)];
  if(physical.length!==54||new Set(physical).size!==54||!physical.every(id=>typeof id==='string'&&allIds.has(id)))return invalid('invalid physical partition');
  if(value.turn===1&&value.phase==='play'&&!jokers.some(j=>j.used)&&(castle.length!==11||hand.length!==8||tavern.length!==32||discard.length||combat.length||
    value.enemyHealth!==20||value.shield!==0||value.recycleCount!==0||![...tavern,...hand].every(id=>tavernSet.has(id))))return invalid('invalid opening');
  return {valid:true};
}
function subsets(hand: readonly string[]): string[][] {
  return Array.from({length:2**hand.length},(_,mask)=>hand.filter((_,i)=>(mask&(1<<i))!==0));
}
function jokerActions(s: Readonly<RegicideState>): RegicideAction[] {
  return s.jokers.filter(j=>!j.used).map(j=>({type:'use-joker',jokerId:j.id}));
}
function getLegalActions(s: Readonly<RegicideState>): readonly RegicideAction[] {
  if(!validateState(s).valid||s.outcome!=='in-progress')return [];
  switch(s.phase){
    case 'play': return [...subsets(s.hand).filter(validPlay).map((cardIds):RegicideAction=>({type:'play',cardIds})),...jokerActions(s)];
    case 'powers': return [{type:'resolve-powers'}];
    case 'damage': return [{type:'resolve-damage'}];
    case 'retaliation': {
      const cost=Math.max(0,s.enemyAttack-s.shield);
      if(cost===0)return [{type:'retaliate',cardIds:[]},...jokerActions(s)];
      const choices:RegicideAction[]=subsets(s.hand).filter(ids=>sum(ids)>=cost&&ids.some(id=>sum(ids)-valueOf(id)<cost)).map(cardIds=>({type:'retaliate',cardIds}));
      choices.push(...jokerActions(s));
      if(sum(s.hand)<cost)choices.push({type:'accept-defeat'});
      return choices;
    }
    default:return [];
  }
}
/** Powers have already resolved; only now may combat cards enter the discard. */
function resolveDamage(n: RegicideState): void {
  const enemy=n.activeEnemy!;
  const damage=attackEffects(n.pending,enemy).damage;
  n.combat.push(...n.pending);
  n.pending=[];
  if(damage<n.enemyHealth){
    n.enemyHealth-=damage;
    n.phase='retaliation';
    return;
  }
  if(damage===n.enemyHealth)n.tavern.unshift(enemy);
  else n.discard.push(enemy);
  n.discard.push(...n.combat);
  n.combat=[];
  n.shield=0;
  n.activeEnemy=n.castle.shift()??null;
  n.turn++;
  if(n.activeEnemy===null){
    n.phase='finished';
    n.outcome='win';
    n.enemyHealth=0;
    n.enemyAttack=0;
    return;
  }
  n.phase='play';
  n.enemyAttack=valueOf(n.activeEnemy);
  n.enemyHealth=2*n.enemyAttack;
}

function transition(s: Readonly<RegicideState>, a: Readonly<RegicideAction>): TransitionResult<RegicideState> {
  const reject=(reason:string):TransitionResult<RegicideState>=>({accepted:false,state:s,reason});
  if(!validateState(s).valid||!record(a))return reject('invalid state or action');
  const legal=getLegalActions(s);
  if(a.type==='play'||a.type==='retaliate'){
    if(Object.keys(a).length!==2||!Array.isArray(a.cardIds)||!Array.from(a.cardIds).every(id=>typeof id==='string')||
      new Set(a.cardIds).size!==a.cardIds.length||!legal.some(b=>b.type===a.type&&'cardIds' in b&&same(b.cardIds,a.cardIds)))return reject('illegal card selection or phase');
  }else if(a.type==='use-joker'){
    if(Object.keys(a).length!==2||!legal.some(b=>b.type==='use-joker'&&b.jokerId===a.jokerId))return reject('illegal joker');
  }else if(Object.keys(a).length!==1||!legal.some(b=>b.type===a.type))return reject('illegal phase');
  const n:RegicideState={...s,castle:[...s.castle],tavern:[...s.tavern],hand:[...s.hand],discard:[...s.discard],combat:[...s.combat],pending:[...s.pending],jokers:s.jokers.map(j=>({...j}))};
  if(a.type==='play'){
    n.pending=n.hand.filter(id=>a.cardIds.includes(id));n.hand=n.hand.filter(id=>!a.cardIds.includes(id));n.phase='powers';
  }else if(a.type==='resolve-powers'){
    const effects=attackEffects(n.pending,n.activeEnemy!);
    if(effects.recycle&&n.discard.length){
      if(n.recycleCount===0xffffffff)return reject('random sequence exhausted');
      n.recycleCount++;
      const shuffled=shuffle(n.discard,createSeededRandom((n.seed+Math.imul(n.recycleCount,0x9e3779b9))>>>0));
      const recovered=shuffled.slice(0,effects.power);
      n.tavern.push(...recovered); n.discard=shuffled.slice(recovered.length);
    }
    if(effects.draw)n.hand.push(...n.tavern.splice(0,Math.min(effects.power,8-n.hand.length)));
    n.shield+=effects.shield;
    n.phase='damage';
  }else if(a.type==='resolve-damage'){
    resolveDamage(n);
  }else if(a.type==='use-joker'){
    n.jokers=n.jokers.map(j=>j.id===a.jokerId?{...j,used:true}:j);
    n.discard.push(...n.hand);
    n.hand=n.tavern.splice(0,8);
  }else if(a.type==='accept-defeat'){
    n.phase='finished';n.outcome='loss';
  }else if(a.type==='retaliate'){
    n.discard.push(...n.hand.filter(id=>a.cardIds.includes(id)));n.hand=n.hand.filter(id=>!a.cardIds.includes(id));n.phase='play';n.turn++;
  }
  return validateState(n).valid?{accepted:true,state:n}:reject('invalid resulting state');
}

export type RegicideMedal = 'gold' | 'silver' | 'bronze';
/** Official solo distinction, not a numerical score. Invalid saves are not losses. */
export function getRegicideResult(state: Readonly<RegicideState>) {
  if(!validateState(state).valid)throw new TypeError('invalid Regicide state');
  const jokersUsed=state.jokers.filter(j=>j.used).length;
  const medal:RegicideMedal|null=state.outcome==='win'?(['gold','silver','bronze'] as const)[jokersUsed]:null;
  return {outcome:state.outcome,medal,jokersUsed};
}

export function inspectRegicide(state: Readonly<RegicideState>) {
  if (!validateState(state).valid) throw new TypeError('invalid Regicide state');
  return {
    phase: state.phase, outcome: state.outcome, activeEnemy: state.activeEnemy,
    result: getRegicideResult(state),
    blockedReason: state.outcome==='in-progress'&&state.phase==='play'&&state.hand.length===0&&state.jokers.every(j=>j.used)?'unconfirmed-solo-pass':null,
    enemyHealth: state.enemyHealth, enemyAttack: state.enemyAttack, shield: state.shield,
    hand: [...state.hand], jokers: state.jokers.map(j => ({...j})),
    counts: {castle:state.castle.length,tavern:state.tavern.length,discard:state.discard.length},
  };
}

export const regicideEngine: GameEngine<RegicideState,RegicideAction,RegicideSetup> = {
  createInitialState, validateState,
  getLegalActions,
  getOutcome: (state): GameOutcome => getRegicideResult(state).outcome,
  transition,
};
