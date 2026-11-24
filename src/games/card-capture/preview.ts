import { createGameSession } from '../../application/game-session.ts';
import { inspectSkydeck, skydeckEngine, type SkydeckAction, type SkydeckPublicState } from './engine.ts';

/** The preview UI never receives the internal snapshot or a transition result. */
export function createSkydeckPreview(seed:number){
  const session=createGameSession(skydeckEngine,{seed});
  return {
    inspect:():SkydeckPublicState=>inspectSkydeck(session.getState()),
    confirm:(action:SkydeckAction):boolean=>session.dispatch(action).accepted,
  };
}
export function describeSkydeckCard(id:string,locale:'fr'|'en'){
  if(id==='joker-1'||id==='joker-2')return {power:'★',symbol:'✧',faction:locale==='fr'?'Corsaire libre':'Free corsair',name:'Joker '+id.slice(-1)};
  const [suit,rank]=id.split('-');
  const factions:Record<string,[string,string,string]>={
    hearts:['♥','Flotte du Soleil','Sun fleet'],diamonds:['♦','Flotte de Cristal','Crystal fleet'],
    clubs:['♣','Flotte de la Brume','Mist fleet'],spades:['♠','Flotte de la Nuit','Night fleet'],
  };
  const [symbol,fr,en]=factions[suit];
  const power=rank==='1'?'14':rank;
  const faction=locale==='fr'?fr:en;
  return {power,symbol,faction,name:power+' · '+faction+' '+symbol};
}
