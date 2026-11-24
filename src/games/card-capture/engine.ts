import { makeDeckWithJokers, isJokerCard, shuffle } from '../../core/cards.ts';
import { createSeededRandom } from '../../core/deterministic-deck.ts';
import type { GameEngine, GameOutcome, TransitionResult, ValidationResult } from '../../core/game-engine.ts';

export const SKYDECK_GAME_ID = 'card-capture' as const;
export const SKYDECK_RULES_VERSION = 'card-capture-2018' as const;
export interface SkydeckSetup { seed: number }
export interface SkydeckState {
  rulesVersion: typeof SKYDECK_RULES_VERSION;
  seed: number;
  recycleCount: number;
  round: number;
  phase: SkydeckPhase;
  outcome: GameOutcome;
  playerDeck: string[];
  enemyDeck: string[];
  /** Index zero represents position 1, at the right edge. */
  enemyLine: (string | null)[];
  hand: string[];
  discard: string[];
  enemyCapture: string[];
}
export type SkydeckPhase = 'enemy' | 'discard' | 'draw' | 'capture' | 'finished';
export type SkydeckAction = Readonly<{ type: 'advance-enemy' | 'discard-none' | 'draw' } | { type: 'discard'; cardIds: readonly string[] } | { type: 'capture-a'; targetPosition: number; cardIds: readonly string[]; jokerCopyId?: string }>;

const canonical = makeDeckWithJokers();
const playerIds = new Set(canonical.filter(c=>isJokerCard(c)||[2,3,4].includes(c.rank)).map(c=>c.id));
const enemyIds = new Set(canonical.filter(c=>!playerIds.has(c.id)).map(c=>c.id));
const protectedIds = new Set(canonical.filter(c=>!isJokerCard(c)&&(c.rank===1||c.rank>=11)).map(c=>c.id));
const validSeed = (seed:unknown): seed is number => typeof seed==='number' && Number.isInteger(seed) && seed>=0 && seed<=0xffff_ffff;
function record(value:unknown): value is Record<string,unknown> {
  return value!==null && typeof value==='object' && !Array.isArray(value);
}
function exactPartition(ids:readonly unknown[], expected:ReadonlySet<string>): boolean {
  return ids.length===expected.size && new Set(ids).size===expected.size &&
    Array.from(ids).every(id=>typeof id==='string' && expected.has(id));
}

/** Build the opening state from independently shuffled decks. */
export function prepareSkydeck(player:readonly string[], enemy:readonly string[], seed:number): SkydeckState {
  if(!validSeed(seed)||!exactPartition(player,playerIds)||!exactPartition(enemy,enemyIds))
    throw new RangeError('invalid Skydeck opening decks or seed');
  const drawn=enemy.slice(0,4);
  // Preserve draw order when returning multiple protected cards; the original
  // booklet has not yet established a more specific ordering.
  const returned=drawn.filter(id=>protectedIds.has(id));
  return {
    rulesVersion:SKYDECK_RULES_VERSION,seed,recycleCount:0,round:1,phase:'enemy',outcome:'in-progress',
    playerDeck:[...player],enemyDeck:[...enemy.slice(4),...returned],
    enemyLine:drawn.map(id=>protectedIds.has(id)?null:id),
    hand:[],discard:[],enemyCapture:[],
  };
}
function createInitialState(setup:SkydeckSetup):SkydeckState {
  if(!record(setup)||Object.keys(setup).length!==1||!validSeed(setup.seed))
    throw new TypeError('a uint32 seed is required');
  const random=createSeededRandom(setup.seed);
  return prepareSkydeck(shuffle([...playerIds],random),shuffle([...enemyIds],random),setup.seed);
}
const allIds = new Set(canonical.map(c=>c.id));
const cardsById = new Map(canonical.map(card=>[card.id,card]));
function captureOptions(targetId:string,selected:readonly string[]): (string|undefined)[] {
  const target=cardsById.get(targetId);
  if(!target||isJokerCard(target)||selected.length===0)return [];
  const value=(rank:number)=>rank===1?14:rank;
  let total=0;
  let jokers=0;
  const references:{id:string;value:number}[]=[];
  for(const id of selected){
    const card=cardsById.get(id);
    if(!card)return [];
    if(isJokerCard(card)){jokers++;continue;}
    if(card.suit!==target.suit)return [];
    const strength=value(card.rank);
    total+=strength;
    references.push({id,value:strength});
  }
  if(jokers===0)return total>=value(target.rank)?[undefined]:[];
  // Multiple simultaneous Jokers are withheld until the original rule is confirmed.
  if(jokers!==1)return [];
  return references.filter(card=>total+card.value>=value(target.rank)).map(card=>card.id);
}
function validateState(value:unknown):ValidationResult {
  if(!record(value))return {valid:false,errors:['state must be an object']};
  const errors:string[]=[];
  const fields=['rulesVersion','seed','recycleCount','round','phase','outcome','playerDeck','enemyDeck','enemyLine','hand','discard','enemyCapture'];
  if(Object.keys(value).length!==fields.length||fields.some(key=>!Object.hasOwn(value,key)))errors.push('invalid state fields');
  const phase=value.phase;
  const outcome=value.outcome;
  if(value.rulesVersion!==SKYDECK_RULES_VERSION||!validSeed(value.seed)||
     typeof value.recycleCount!=='number'||!Number.isSafeInteger(value.recycleCount)||value.recycleCount<0||value.recycleCount>0xffff_ffff||
     typeof value.round!=='number'||!Number.isSafeInteger(value.round)||value.round<1||
     !['enemy','discard','draw','capture','finished'].includes(String(phase))||
     !['in-progress','win','loss','abandoned'].includes(String(outcome))||
     (phase==='finished')!==(outcome!=='in-progress'))
    errors.push('invalid phase or metadata');
  const zones: string[][]=[];
  for(const key of ['playerDeck','enemyDeck','hand','discard','enemyCapture']){
    const zone=value[key];
    if(!Array.isArray(zone)||!Array.from(zone).every(id=>typeof id==='string'&&allIds.has(id))){
      errors.push('invalid '+key); zones.push([]);
    }else zones.push(zone);
  }
  const [playerDeck,enemyDeck,hand,discard,enemyCapture]=zones;
  const line=value.enemyLine;
  const lineValid=Array.isArray(line)&&line.length===4&&Array.from(line).every(id=>id===null||
    (typeof id==='string'&&enemyIds.has(id)));
  if(!lineValid)errors.push('invalid enemy line');
  const occupied:string[]=lineValid?Array.from(line).filter((id):id is string=>id!==null):[];
  if(!exactPartition([...zones.flat(),...occupied],allIds))errors.push('invalid physical card partition');
  if(enemyDeck.some(id=>!enemyIds.has(id)))errors.push('invalid enemy deck');
  if(hand.length>4)errors.push('hand exceeds four cards');
  if(phase==='capture'&&hand.length!==4)errors.push('capture requires a full hand');
  if(outcome==='in-progress'&&enemyCapture.some(id=>protectedIds.has(id)))errors.push('protected card in enemy capture');
  if(outcome==='win'&&(enemyDeck.length!==0||occupied.length!==0||enemyCapture.some(id=>protectedIds.has(id))))
    errors.push('invalid win');
  if(value.round===1&&phase!=='finished'){
    if(!exactPartition([...playerDeck,...hand,...discard],playerIds)||
       !exactPartition([...enemyDeck,...occupied],enemyIds)||enemyCapture.length)
      errors.push('invalid first round partition');
    if(phase==='enemy'){
      if(hand.length||discard.length||occupied.some(id=>protectedIds.has(id)))errors.push('invalid opening zones');
      const holes=4-occupied.length;
      if(holes>0&&!enemyDeck.slice(-holes).every(id=>protectedIds.has(id)))errors.push('invalid returned cards');
    }
    if((phase==='discard'||phase==='draw')&&(hand.length||discard.length))errors.push('invalid first discard');
    if(value.recycleCount!==0)errors.push('invalid first round recycle count');
  }
  if(lineValid&&['discard','draw','capture'].includes(String(phase))){
    const compact=Array.from(line).every((id,i)=>i<occupied.length?id!==null:id===null);
    if(!compact||(enemyDeck.length>0&&occupied.length!==4))errors.push('enemy line must be filled before player phases');
  }
  return errors.length?{valid:false,errors}:{valid:true};
}

function getLegalActions(state:Readonly<SkydeckState>):readonly SkydeckAction[]{
  if(!validateState(state).valid||state.outcome!=='in-progress')return [];
  switch(state.phase){
    case 'enemy': return [{type:'advance-enemy'}];
    case 'discard': {
      const choices: SkydeckAction[]=[{type:'discard-none'},{type:'discard',cardIds:[]}];
      for(let mask=1;mask<2**state.hand.length;mask++){
        choices.push({type:'discard',cardIds:state.hand.filter((_,i)=>(mask&(1<<i))!==0)});
      }
      return choices;
    }
    case 'draw': return state.playerDeck.length+state.discard.length>=4-state.hand.length &&
      (state.playerDeck.length>=4-state.hand.length||state.recycleCount<0xffff_ffff)?[{type:'draw'}]:[];
    case 'capture': {
      const choices:SkydeckAction[]=[];
      for(let index=0;index<state.enemyLine.length;index++){
        const target=state.enemyLine[index];
        if(target===null)continue;
        for(let mask=1;mask<2**state.hand.length;mask++){
          const cardIds=state.hand.filter((_,i)=>(mask&(1<<i))!==0);
          for(const jokerCopyId of captureOptions(target,cardIds)){
            choices.push(jokerCopyId===undefined
              ?{type:'capture-a',targetPosition:index+1,cardIds}
              :{type:'capture-a',targetPosition:index+1,cardIds,jokerCopyId});
          }
        }
      }
      return choices;
    }
    default: return [];
  }
}
function transition(state:Readonly<SkydeckState>,action:Readonly<SkydeckAction>):TransitionResult<SkydeckState>{
  const reject=(reason:string):TransitionResult<SkydeckState>=>({accepted:false,state,reason});
  if(!record(action))return reject('invalid action');
  const legal=getLegalActions(state);
  if(action.type==='discard'){
    if(Object.keys(action).length!==2||!Array.isArray(action.cardIds)||
       !Array.from(action.cardIds).every(id=>typeof id==='string')||
       new Set(action.cardIds).size!==action.cardIds.length||
       !legal.some(candidate=>candidate.type==='discard'&&candidate.cardIds.length===action.cardIds.length&&
         candidate.cardIds.every(id=>action.cardIds.includes(id))))return reject('illegal discard selection or phase');
  }else if(action.type==='capture-a'){
    if(Object.keys(action).length!==(Object.hasOwn(action,'jokerCopyId')?4:3)||
       (Object.hasOwn(action,'jokerCopyId')&&typeof action.jokerCopyId!=='string')||
       !Number.isInteger(action.targetPosition)||
       !Array.isArray(action.cardIds)||!Array.from(action.cardIds).every(id=>typeof id==='string')||
       new Set(action.cardIds).size!==action.cardIds.length||
       !legal.some(candidate=>candidate.type==='capture-a'&&candidate.targetPosition===action.targetPosition&&
         candidate.jokerCopyId===action.jokerCopyId&&
         candidate.cardIds.length===action.cardIds.length&&candidate.cardIds.every(id=>action.cardIds.includes(id))))
      return reject('illegal capture selection or phase');
  }else if(Object.keys(action).length!==1||!legal.some(candidate=>candidate.type===action.type)){
    return reject('illegal action or phase');
  }
  let next:SkydeckState;
  switch(action.type){
    case 'advance-enemy': {
      const occupied=state.enemyLine.filter((id):id is string=>id!==null);
      const count=Math.min(4-occupied.length,state.enemyDeck.length);
      const filled=[...occupied,...state.enemyDeck.slice(0,count)];
      next={...state,phase:'discard',enemyDeck:state.enemyDeck.slice(count),
        enemyLine:[...filled,...Array<null>(4-filled.length).fill(null)]};
      break;
    }
    case 'discard-none': next={...state,phase:'draw'};break;
    case 'discard': {
      const selected=new Set(action.cardIds);
      next={...state,phase:'draw',hand:state.hand.filter(id=>!selected.has(id)),
        discard:[...state.discard,...state.hand.filter(id=>selected.has(id))]};
      break;
    }
    case 'draw': {
      const count=4-state.hand.length;
      const drawn=state.playerDeck.slice(0,count);
      let playerDeck=state.playerDeck.slice(count);
      let discard=state.discard;
      let recycleCount=state.recycleCount;
      if(drawn.length<count){
        recycleCount++;
        // Each recycling has an independent reproducible stream; the counter
        // is serialized, so restoration never relies on hidden PRNG state.
        const recycleSeed=(state.seed+Math.imul(recycleCount,0x9e3779b9))>>>0;
        const recycled=shuffle(discard,createSeededRandom(recycleSeed));
        const needed=count-drawn.length;
        drawn.push(...recycled.slice(0,needed));
        playerDeck=recycled.slice(needed);
        discard=[];
      }
      next={...state,phase:'capture',playerDeck,discard,recycleCount,hand:[...state.hand,...drawn]};
      break;
    }
    case 'capture-a': {
      const index=action.targetPosition-1;
      const target=state.enemyLine[index];
      if(target===null||target===undefined)return reject('missing enemy');
      const selected=new Set(action.cardIds);
      const enemyLine=state.enemyLine.map((id,i)=>i===index?null:id);
      const won=state.enemyDeck.length===0&&enemyLine.every(id=>id===null);
      next={...state,enemyLine,hand:state.hand.filter(id=>!selected.has(id)),
        discard:[...state.discard,...state.hand.filter(id=>selected.has(id)),target],
        phase:won?'finished':'enemy',outcome:won?'win':'in-progress',
        round:won?state.round:state.round+1};
      break;
    }
    default:return reject('unknown action');
  }
  return validateState(next).valid?{accepted:true,state:next}:reject('invalid resulting state');
}
export const skydeckEngine:GameEngine<SkydeckState,SkydeckAction,SkydeckSetup>={
  createInitialState,validateState,getLegalActions,transition,getOutcome:state=>state.outcome,
};
