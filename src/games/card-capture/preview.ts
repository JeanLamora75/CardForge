import { skydeckFactions } from '../../application/skydeck-art.ts';
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
  if(id==='joker-1'||id==='joker-2')return {power:'★',symbol:'✧',faction:locale==='fr'?'Corsaire libre':'Free corsair',name:(locale==='fr'?'Corsaire libre ':'Free corsair ')+id.slice(-1)};
  const [suit,rank]=id.split('-');
  const {symbol,fr,en}=skydeckFactions[suit as keyof typeof skydeckFactions];
  const power=rank==='1'?'14':rank;
  const faction=locale==='fr'?fr:en;
  return {power,symbol,faction,name:power+' · '+faction+' '+symbol};
}
