import { makeDeckWithJokers, isJokerCard, shuffle } from '../../core/cards.ts';
import { createSeededRandom } from '../../core/deterministic-deck.ts';
import type { GameEngine, ValidationResult } from '../../core/game-engine.ts';

export const SKYDECK_GAME_ID = 'card-capture' as const;
export const SKYDECK_RULES_VERSION = 'card-capture-2018' as const;
export interface SkydeckSetup { seed: number }
export interface SkydeckState {
  rulesVersion: typeof SKYDECK_RULES_VERSION;
  seed: number;
  round: 1;
  phase: 'enemy';
  outcome: 'in-progress';
  playerDeck: string[];
  enemyDeck: string[];
  /** Index zero represents position 1, at the right edge. */
  enemyLine: (string | null)[];
  hand: string[];
  discard: string[];
  enemyCapture: string[];
}
export type SkydeckAction = Readonly<{ type: string }>;

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
    rulesVersion:SKYDECK_RULES_VERSION,seed,round:1,phase:'enemy',outcome:'in-progress',
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
function validateState(value:unknown):ValidationResult {
  if(!record(value))return {valid:false,errors:['state must be an object']};
  const errors:string[]=[];
  const fields=['rulesVersion','seed','round','phase','outcome','playerDeck','enemyDeck','enemyLine','hand','discard','enemyCapture'];
  if(Object.keys(value).length!==fields.length||fields.some(key=>!Object.hasOwn(value,key)))errors.push('invalid state fields');
  if(value.rulesVersion!==SKYDECK_RULES_VERSION||!validSeed(value.seed)||value.round!==1||value.phase!=='enemy'||value.outcome!=='in-progress')
    errors.push('invalid opening metadata');
  if(!Array.isArray(value.playerDeck)||!exactPartition(value.playerDeck,playerIds))errors.push('invalid player deck');
  const line=value.enemyLine;
  const deck=value.enemyDeck;
  if(!Array.isArray(line)||line.length!==4||!Array.from(line).every(id=>id===null||
     (typeof id==='string'&&enemyIds.has(id)&&!protectedIds.has(id))))errors.push('invalid opening enemy line');
  if(!Array.isArray(deck)||!Array.isArray(line)||!exactPartition([...deck,...Array.from(line).filter(id=>id!==null)],enemyIds))
    errors.push('invalid enemy partition');
  if(Array.isArray(deck)&&Array.isArray(line)){
    const holes=line.filter(id=>id===null).length;
    if(holes>0&&!deck.slice(-holes).every(id=>typeof id==='string'&&protectedIds.has(id)))errors.push('invalid returned cards');
  }
  for(const key of ['hand','discard','enemyCapture']){
    const zone=value[key];
    if(!Array.isArray(zone)||zone.length!==0)errors.push('invalid opening '+key);
  }
  return errors.length?{valid:false,errors}:{valid:true};
}

export const skydeckEngine:GameEngine<SkydeckState,SkydeckAction,SkydeckSetup>={
  createInitialState,
  validateState,
  getLegalActions:()=>[],
  transition:state=>({accepted:false,state,reason:'enemy phase transition not implemented'}),
  getOutcome:state=>state.outcome,
};
