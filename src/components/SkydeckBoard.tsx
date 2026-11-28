import '../skydeck.css';
import { skydeckCardArt } from '../application/skydeck-art.ts';
import { playSkydeckSound, setSkydeckFinished, skydeckActionSounds } from '../application/skydeck-audio.ts';
import { useEffect, useRef, useState } from 'react';
import type { Locale } from '../i18n/language.ts';
import { describeSkydeckCard } from '../games/card-capture/preview.ts';
import type { SkydeckAction, SkydeckPublicState } from '../games/card-capture/engine.ts';

import {createIndexedDbGameStorage} from '../adapters/indexeddb-game-storage.ts';
import {startSkydeck,resumeSkydeck,getSkydeckNewGameChoice,confirmSkydeckNewGame,practiceSkydeck,skydeckSessionView} from '../games/card-capture/persistence.ts';
import type {NewGameChoice} from '../application/new-game-choice.ts';
type Preview=ReturnType<typeof skydeckSessionView>;
type Kind='capture-a'|'capture-b'|'capture-c';
const positions=[4,3,2,1];
export default function SkydeckBoard({language,hintsEnabled=true,tutorial=false}:{language:Locale;hintsEnabled?:boolean;tutorial?:boolean}){
  const tr=(fr:string,en:string)=>language==='fr'?fr:en;
  const session=useRef<Preview|null>(null);
  const [view,setView]=useState<SkydeckPublicState|null>(null);
  const [kind,setKind]=useState<Kind>('capture-a');
  const [selected,setSelected]=useState<string[]>([]);
  const [target,setTarget]=useState<number|null>(null);
  const [copy,setCopy]=useState<string|null>(null);
  const [pending,setPending]=useState<SkydeckAction|null>(null);
  const [error,setError]=useState(false);
  const [restart,setRestart]=useState(false);
  const [abandon,setAbandon]=useState(false);
  const [busy,setBusy]=useState(true);
  const [blocked,setBlocked]=useState(false);
  const [storageError,setStorageError]=useState(false);
  const [resumed,setResumed]=useState(false);
  const choice=useRef<NewGameChoice|null>(null);
  const lock=useRef(false);
  const mounted=useRef(false);
  const setup=()=>({seed:crypto.getRandomValues(new Uint32Array(1))[0]});
  useEffect(()=>{
    let cancelled=false;
    mounted.current=true;
    void(async()=>{
      try{
        const existing=tutorial?practiceSkydeck({seed:54}):await resumeSkydeck(createIndexedDbGameStorage());
        if(cancelled)return;
        session.current=existing?skydeckSessionView(existing):null;
        setView(session.current?.inspect()??null);
        setResumed(!!existing&&!tutorial);
      }catch{if(!cancelled){setBlocked(true);setStorageError(true);}}
      finally{if(!cancelled)setBusy(false);}
    })();
    return()=>{cancelled=true;mounted.current=false;};
  },[tutorial]);
  useEffect(()=>{setSkydeckFinished(!!view&&view.outcome!=='in-progress');},[view?.outcome]);
  const confirmRef=useRef<HTMLButtonElement>(null);
  const heading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{if(pending||restart||abandon)confirmRef.current?.focus();},[pending,restart,abandon]);
  function reset(){setSelected([]);setTarget(null);setCopy(null);setPending(null);setError(false);setRestart(false);setAbandon(false);setKind('capture-a');}
  async function run(work:()=>Promise<void>){
    if(lock.current||busy||blocked)return;
    lock.current=true;setBusy(true);setStorageError(false);
    try{await work();}
    catch{if(mounted.current){playSkydeckSound('notification');setStorageError(true);}}
    finally{lock.current=false;if(mounted.current)setBusy(false);}
  }
  async function start(){
    await run(async()=>{
      const next=tutorial?practiceSkydeck({seed:54}):await startSkydeck(createIndexedDbGameStorage(),crypto.randomUUID(),setup());
      if(!mounted.current)return;
      session.current=skydeckSessionView(next);setView(session.current.inspect());setResumed(false);reset();playSkydeckSound('shuffle');
    });
  }
  async function requestRestart(){
    await run(async()=>{
      if(!tutorial)choice.current=await getSkydeckNewGameChoice(createIndexedDbGameStorage());
      if(mounted.current){playSkydeckSound('open');setRestart(true);}
    });
  }
  async function replace(){
    await run(async()=>{
      const next=tutorial?practiceSkydeck({seed:54}):choice.current?
        await confirmSkydeckNewGame(createIndexedDbGameStorage(),crypto.randomUUID(),setup(),choice.current,true):undefined;
      if(!next||!mounted.current)return;
      session.current=skydeckSessionView(next);setView(session.current.inspect());setResumed(false);reset();playSkydeckSound('shuffle');
    });
  }
  async function confirm(command:SkydeckAction|null=pending){
    if(!command||!session.current)return;
    await run(async()=>{
      const before=session.current!.inspect();
      const accepted=await session.current!.confirm(command);
      if(!mounted.current)return;
      if(!accepted){playSkydeckSound('invalid');setError(true);setPending(null);setAbandon(false);return;}
      const after=session.current!.inspect();
      for(const sound of skydeckActionSounds(command,before,after))playSkydeckSound(sound);
      if(after.outcome==='win'||after.outcome==='loss'){setSkydeckFinished(true);playSkydeckSound(after.outcome==='win'?'victory':'defeat','music');}
      setView(after);setResumed(false);reset();heading.current?.focus();
    });
  }
  const same=(ids:readonly string[])=>ids.length===selected.length&&ids.every(id=>selected.includes(id));
  const matching=view?.actions.filter(a=>{
    if(view.phase==='discard')return a.type==='discard'&&same(a.cardIds);
    if(view.phase==='enemy'||view.phase==='draw')return a.type===(view.phase==='enemy'?'advance-enemy':'draw');
    if(kind==='capture-b')return a.type==='capture-b'&&selected.length===1&&a.cardId===selected[0];
    if(a.type!==kind||a.targetPosition!==target||!same(a.cardIds))return false;
    return true;
  })??[];
  const copyChoices=matching.flatMap(a=>a.type==='capture-a'&&a.jokerCopyId?[a.jokerCopyId]:[]);
  const chosen=matching.find(a=>a.type!=='capture-a'||!a.jokerCopyId||a.jokerCopyId===copy);
  const cardName=(id:string)=>describeSkydeckCard(id,language).name;
  const actionName=(a:SkydeckAction)=>{
    switch(a.type){
      case 'advance-enemy':return tr('Avancer les ennemis','Advance enemies');
      case 'discard-none':return tr('Conserver la main','Keep hand');
      case 'discard':return tr('Défausser','Discard')+' '+a.cardIds.length;
      case 'draw':return tr('Compléter la main','Draw to four');
      case 'capture-a':return tr('A · Capturer','A · Capture');
      case 'capture-b':return tr('B · Laisser capturer','B · Let enemy capture');
      case 'capture-c':return tr('C · Repousser','C · Push back');
    }
  };
  const renderCard=(id:string)=>{
    const c=describeSkydeckCard(id,language);
    const art=skydeckCardArt(id);
    return <span className="sd-face">
      {art?<><img className="sd-illustration" src={import.meta.env.BASE_URL+art.image} alt="" draggable={false}/><img className="sd-frame" src={import.meta.env.BASE_URL+art.frame} alt="" draggable={false}/></>:null}
      <span className="sd-power">{c.power} {c.symbol}</span><small>{c.faction}</small>
    </span>;
  };
  const phaseLabels={enemy:tr('Ennemis','Enemies'),discard:tr('Défausse','Discard'),draw:tr('Pioche','Draw'),capture:tr('Capture','Capture'),finished:tr('Terminée','Finished')};
  return <section className="sd-board" style={{backgroundImage: `linear-gradient(#10202dcc,#152431e8),url("${import.meta.env.BASE_URL}art/worlds/skydeck.webp")`}} data-i18n-ignore aria-busy={busy} aria-label={tr('Plateau Skydeck','Skydeck board')}>
    <p className="sd-kicker">SKYDECK · {tr('Corsaires du ciel','Sky corsairs')}</p>
    <p>{tutorial?tr('Entraînement sans sauvegarde ni statistiques.','Training without saves or statistics.'):tr('Préversion interne · sauvegarde locale automatique.','Internal preview · automatic local save.')}</p>
    {resumed?<p className="sd-resumed">{tr('Partie reprise · sauvegarde locale','Game resumed · local save')}</p>:null}
    {storageError?<p role="alert">{blocked?tr('Sauvegarde incompatible ou inaccessible. Elle est conservée.','Incompatible or inaccessible save. It is preserved.'):tr('Action non enregistrée. La sauvegarde précédente est conservée.','Action not saved. Previous save preserved.')}</p>:null}
    {!view?<button type="button" className="primary-action" disabled={busy||blocked} onClick={()=>void start()}>{tr('Commencer une partie','Start a game')}</button>:<>
      <p role="status" aria-live="polite">{tr('Manche','Round')} {view.round} · {phaseLabels[view.phase]} · {view.outcome==='win'?tr('Victoire','Victory'):view.outcome==='loss'?tr('Défaite','Defeat'):view.outcome==='abandoned'?tr('Abandon','Abandoned'):tr('En cours','In progress')}</p>
      <div className="sd-phases" aria-label={tr('Phases','Phases')}>{(['enemy','discard','draw','capture'] as const).map(p=><span key={p} aria-current={view.phase===p?'step':undefined}>{phaseLabels[p]}</span>)}</div>
      <div className="sd-counts">{[[tr('Pioche personnelle','Player deck'),view.counts.playerDeck],[tr('Pioche ennemie','Enemy deck'),view.counts.enemyDeck],[tr('Défausse personnelle','Personal discard'),view.counts.discard],[tr('Capture ennemie','Enemy capture'),view.counts.enemyCapture]].map(([label,n])=><span key={label}>{label}: <strong>{n}</strong></span>)}</div>
      <h3>{tr('Ligne ennemie','Enemy line')}</h3>
      <p className="sd-direction">{tr('Entrée de la pioche → position 1 à droite','Deck entry → position 1 on the right')}</p>
      <div className="sd-line">{positions.map(position=>{
        const id=view.enemyLine[position-1];
        const active=kind==='capture-b'?position===1:target===position;
        return <button type="button" key={position} className="sd-card" data-position={position} disabled={!id||view.phase!=='capture'||kind==='capture-b'||!!pending||restart||abandon||busy} aria-pressed={active&&!!id} aria-label={tr('Position','Position')+' '+position+' · '+(id?cardName(id):tr('Vide','Empty'))} onClick={()=>{playSkydeckSound('select');setTarget(position);setCopy(null);}}>
          <span className="sd-position">{position}</span>{id?renderCard(id):<span>{tr('Vide','Empty')}</span>}
        </button>;
      })}</div>
      <h3>{tr('Votre main','Your hand')}</h3>
      <div className="sd-line sd-hand">{view.hand.map(id=><button type="button" key={id} className="sd-card" aria-label={cardName(id)} aria-pressed={selected.includes(id)} disabled={!['discard','capture'].includes(view.phase)||!!pending||restart||abandon||busy} onClick={()=>{playSkydeckSound('select');setSelected(old=>old.includes(id)?old.filter(x=>x!==id):kind==='capture-b'&&view.phase==='capture'?[id]:[...old,id]);setCopy(null);}}>{renderCard(id)}</button>)}</div>
      {!view.hand.length?<p>{tr('Main vide','Empty hand')}</p>:null}
      <h3 ref={heading} tabIndex={-1}>{tr('Actions autorisées','Legal actions')}</h3>
      {view.phase==='capture'?<div className="sd-actions">{(['capture-a','capture-b','capture-c'] as const).map(k=><button key={k} type="button" className="secondary-action" aria-pressed={kind===k} disabled={!!pending||restart||abandon||busy||!view.actions.some(a=>a.type===k)} onClick={()=>{playSkydeckSound('button');setKind(k);setSelected([]);setTarget(null);setCopy(null);}}>{k==='capture-a'?tr('A · Capturer','A · Capture'):k==='capture-b'?tr('B · Laisser capturer','B · Let enemy capture'):tr('C · Repousser','C · Push back')}</button>)}</div>:null}
      {hintsEnabled&&view.phase==='capture'?<p>{kind==='capture-a'?tr('Choisissez une cible et des cartes de même enseigne. Le Joker copie une carte engagée.','Choose a target and matching-suit cards. A Joker copies a selected card.'):kind==='capture-b'?tr('Sacrifiez une carte de main avec la position 1. Une figure ou un As perdu entraîne la défaite.','Sacrifice one hand card with position 1. Losing a face card or ace causes defeat.'):tr('Sacrifiez deux cartes pour renvoyer la cible sous la pioche adverse.','Sacrifice two cards to return the target to the bottom of the enemy deck.')}</p>:null}
      {copyChoices.length>0?<fieldset disabled={!!pending||restart||abandon||busy}><legend>{tr('Carte copiée par le Joker','Card copied by the Joker')}</legend>{copyChoices.map(id=><label key={id}><input type="radio" name="sd-copy" checked={copy===id} onChange={()=>{playSkydeckSound('joker');setCopy(id);}}/>{cardName(id)}</label>)}</fieldset>:null}
      {view.blockedReason?<p role="alert">{tr('Cartes personnelles insuffisantes. Règle d’impasse à confirmer ; aucune défaite attribuée.','Not enough personal cards. Deadlock rule pending confirmation; no defeat recorded.')}</p>:null}
      {view.outcome==='in-progress'&&!view.blockedReason?<button type="button" className="primary-action sd-preview" disabled={!chosen||!!pending||restart||abandon||busy||blocked} onClick={()=>{if(chosen){playSkydeckSound('open');setPending(chosen);}}}>{tr('Prévisualiser le coup','Preview move')}</button>:null}
      {pending?<div className="sd-confirm" role="group" aria-label={tr('Confirmation du coup','Confirm move')}>
        <p>{actionName(pending)} {pending.type==='capture-a'||pending.type==='capture-c'?tr('Position','Position')+' '+pending.targetPosition:''}</p>
        <p>{'cardIds' in pending?pending.cardIds.map(cardName).join(' · '):'cardId' in pending?cardName(pending.cardId):''}</p>
        {pending.type==='capture-a'&&pending.jokerCopyId?<p>{tr('Copie :','Copy:')} {cardName(pending.jokerCopyId)}</p>:null}
        <button ref={confirmRef} className="primary-action" disabled={busy} onClick={()=>void confirm()}>{tr('Confirmer','Confirm')}</button>
        <button className="secondary-action" disabled={busy} onClick={()=>{playSkydeckSound('close');setPending(null);heading.current?.focus();}}>{tr('Annuler','Cancel')}</button>
      </div>:null}
      {error?<p role="alert">{tr('Action refusée. L’état précédent est conservé.','Action rejected. Previous state preserved.')}</p>:null}
      <button className="secondary-action" disabled={!!pending||restart||abandon||busy} onClick={()=>void requestRestart()}>{view.outcome==='in-progress'?tr('Nouvelle partie','New game'):tr('Rejouer','Replay')}</button>
      {!tutorial&&view.outcome==='in-progress'?<button className="secondary-action" disabled={busy||!!pending||restart||abandon} onClick={()=>{playSkydeckSound('open');setAbandon(true);}}>{tr('Abandonner','Abandon')}</button>:null}
      {abandon?<div className="sd-confirm"><p>{tr('Abandonner définitivement cette partie ?','Abandon this game permanently?')}</p><button ref={confirmRef} className="primary-action" disabled={busy} onClick={()=>void confirm({type:'abandon'})}>{tr('Confirmer','Confirm')}</button><button className="secondary-action" disabled={busy} onClick={()=>{playSkydeckSound('close');setAbandon(false);}}>{tr('Annuler','Cancel')}</button></div>:null}
      {view.outcome!=='in-progress'?<div className="sd-confirm" role="status"><p>{view.outcome==='win'?tr('Victoire : tous les ennemis ont été éliminés.','Victory: all enemies have been cleared.'):view.outcome==='loss'?tr('Défaite : une figure ou un As a été perdu.','Defeat: a face card or ace was lost.'):tr('Partie abandonnée.','Game abandoned.')}</p><a className="secondary-action" href="#">{tr('Retour au catalogue','Back to catalogue')}</a></div>:null}
      {restart?<div className="sd-confirm"><p>{view.outcome==='in-progress'?tr('Remplacer cette partie ? La partie actuelle sera abandonnée.','Replace this game? The current game will be abandoned.'):tr('Commencer une nouvelle partie ?','Start a new game?')}</p><button ref={confirmRef} className="primary-action" disabled={busy} onClick={()=>void replace()}>{tr('Confirmer','Confirm')}</button><button className="secondary-action" disabled={busy} onClick={()=>{playSkydeckSound('close');setRestart(false);}}>{tr('Annuler','Cancel')}</button></div>:null}
    </>}
    <p className="help-note">{tr('D’après Card Capture, jeu original de Lucas Gentry.','Based on Card Capture, original game by Lucas Gentry.')}</p>
  </section>;
}
