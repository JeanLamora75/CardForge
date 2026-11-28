import type { SharedSettings } from './shared-settings.ts';
import type { SkydeckAction, SkydeckPublicState } from '../games/card-capture/engine.ts';

export const skydeckAudioFiles = {
  menu:'music/menu', gameplay:'music/gameplay', victory:'music/victory', defeat:'music/defeat',
  wind:'ambience/celestial-wind', wood:'ambience/wood-and-rigging', steam:'ambience/steam-machinery', sails:'ambience/sails-and-flags',
  shuffle:'sfx/cards/shuffle', deal:'sfx/cards/deal', select:'sfx/cards/select', move:'sfx/cards/move', flip:'sfx/cards/flip',
  cannon:'sfx/combat/cannon', capture:'sfx/combat/capture', enemyCapture:'sfx/combat/enemy-capture', sacrifice:'sfx/combat/sacrifice', repel:'sfx/combat/repel', joker:'sfx/combat/joker', legendary:'sfx/combat/legendary-ship', invalid:'sfx/combat/invalid-action',
  button:'sfx/interface/button', open:'sfx/interface/panel-open', close:'sfx/interface/panel-close', notification:'sfx/interface/notification'
} as const;
export type SkydeckSound = keyof typeof skydeckAudioFiles;
type Scene = 'off'|'menu'|'gameplay';
type Channel = 'music'|'ambience'|'sounds';
const ambience = ['wind','wood','steam','sails'] as const;
let scene:Scene='off', unlocked=false, hidden=false, finished=false;
let volumes={music:0,ambience:0,sounds:0};
const loops=new Map<SkydeckSound,HTMLAudioElement>();
const effects=new Map<HTMLAudioElement,{channel:Channel;factor:number}>();
function create(key:SkydeckSound,loop:boolean):HTMLAudioElement|null {
  try { if(typeof Audio==='undefined')return null;const a=new Audio(new URL('assets/audio/skydeck/'+skydeckAudioFiles[key]+'.wav',document.baseURI).href);a.loop=loop;a.preload='auto';return a; } catch{return null;}
}
function stop(a:HTMLAudioElement){a.pause();try{a.currentTime=0;}catch{/* Metadata may not be available. */}}
function clearEffects(){for(const a of effects.keys())stop(a);effects.clear();}
function sync(){
  const wanted=new Map<SkydeckSound,number>();
  if(unlocked&&!hidden&&scene!=='off'&&!finished){
    if(volumes.music)wanted.set(scene,volumes.music/100);
    if(scene==='gameplay'&&volumes.ambience)for(const key of ambience)wanted.set(key,volumes.ambience/100*.22);
  }
  for(const [key,a] of loops)if(!wanted.has(key)){stop(a);loops.delete(key);}
  for(const [key,volume] of wanted){let a=loops.get(key);if(!a){const created=create(key,true);if(!created)continue;a=created;loops.set(key,a);}a.volume=volume;if(a.paused)void a.play().catch(()=>{});}
}
export function setSkydeckScene(next:Scene){if(next!==scene){clearEffects();scene=next;finished=false;}sync();}
export function unlockSkydeckAudio(){unlocked=true;sync();}
export function setSkydeckHidden(value:boolean){hidden=value;if(value)clearEffects();sync();}
export function updateSkydeckAudio(settings:SharedSettings){volumes={music:settings.musicVolume,ambience:settings.ambienceVolume,sounds:settings.soundsVolume};for(const [a,e] of effects){a.volume=volumes[e.channel]/100*e.factor;if(!volumes[e.channel]){stop(a);effects.delete(a);}}sync();}
export function setSkydeckFinished(value:boolean){finished=value;sync();}
export function playSkydeckSound(key:SkydeckSound,channel:Channel='sounds',factor=1){
  if(!unlocked||hidden||scene==='off'||!volumes[channel])return;
  if(effects.size>=12){const oldest=effects.keys().next().value;if(oldest){stop(oldest);effects.delete(oldest);}}
  const a=create(key,false);if(!a)return;a.volume=Math.min(1,volumes[channel]/100*factor);
  effects.set(a,{channel,factor});const remove=()=>effects.delete(a);
  a.addEventListener('ended',remove,{once:true});a.addEventListener('error',remove,{once:true});void a.play().catch(remove);
}
export function skydeckActionSounds(action:SkydeckAction,before:SkydeckPublicState,after:SkydeckPublicState):SkydeckSound[]{
  const sounds:SkydeckSound[]=[];
  switch(action.type){
    case 'advance-enemy': sounds.push('move','flip');break;
    case 'draw': if(after.hand.length>before.hand.length)sounds.push('deal');if(after.counts.playerDeck>before.counts.playerDeck)sounds.push('shuffle');break;
    case 'discard': sounds.push('move');break;
    case 'discard-none': sounds.push('button');break;
    case 'capture-a': sounds.push('cannon','capture');if(action.jokerCopyId)sounds.push('joker');break;
    case 'capture-b': sounds.push('enemyCapture','sacrifice');break;
    case 'capture-c': sounds.push('repel');break;
    case 'abandon': sounds.push('close');break;
  }
  if(after.enemyLine.some(id=>id&&/-1$/.test(id)&&!before.enemyLine.includes(id)))sounds.push('legendary');
  return sounds;
}
