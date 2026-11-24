import { useEffect, useRef, useState } from 'react';
import type { Locale } from '../i18n/language.ts';
import { createSkydeckPreview, describeSkydeckCard } from '../games/card-capture/preview.ts';
import type { SkydeckAction, SkydeckPublicState } from '../games/card-capture/engine.ts';

type Preview=ReturnType<typeof createSkydeckPreview>;
type Kind='capture-a'|'capture-b'|'capture-c';
const positions=[4,3,2,1];
export default function SkydeckBoard({language,hintsEnabled=true}:{language:Locale;hintsEnabled?:boolean}){
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
  const confirmRef=useRef<HTMLButtonElement>(null);
  const heading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{if(pending||restart)confirmRef.current?.focus();},[pending,restart]);
  function reset(){setSelected([]);setTarget(null);setCopy(null);setPending(null);setError(false);setRestart(false);setKind('capture-a');}
  function start(){
    session.current=createSkydeckPreview(crypto.getRandomValues(new Uint32Array(1))[0]);
    setView(session.current.inspect());reset();
  }
  function confirm(){
    if(!pending||!session.current)return;
    if(!session.current.confirm(pending)){setError(true);setPending(null);return;}
    setView(session.current.inspect());reset();heading.current?.focus();
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
    return <><span className="sd-power">{c.power} {c.symbol}</span><span className="sd-art" aria-hidden="true"><svg viewBox="0 0 80 52"><path d="M4 40 Q20 25 38 32 T76 28 M7 46 Q26 35 44 42 T76 38" fill="none" stroke="currentColor" opacity=".35"/><path d="M9 25 L34 17 L42 3 L49 17 L71 25 L49 32 L42 46 L34 32 Z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M30 25 H53 M42 10 V39" stroke="currentColor"/><circle cx="42" cy="25" r="5" fill="currentColor"/></svg></span><small>{c.faction}</small></>;
  };
  const phaseLabels={enemy:tr('Ennemis','Enemies'),discard:tr('Défausse','Discard'),draw:tr('Pioche','Draw'),capture:tr('Capture','Capture'),finished:tr('Terminée','Finished')};
  return <section className="sd-board" data-i18n-ignore aria-label={tr('Plateau Skydeck','Skydeck board')}>
    <p className="sd-kicker">SKYDECK · {tr('Corsaires du ciel','Sky corsairs')}</p>
    <p>{tr('Préversion interne · partie en mémoire, sans sauvegarde ni statistiques.','Internal preview · in-memory game, no saves or statistics.')}</p>
    {!view?<button type="button" className="primary-action" onClick={start}>{tr('Commencer une partie','Start a game')}</button>:<>
      <p role="status" aria-live="polite">{tr('Manche','Round')} {view.round} · {phaseLabels[view.phase]} · {view.outcome==='win'?tr('Victoire','Victory'):view.outcome==='loss'?tr('Défaite','Defeat'):tr('En cours','In progress')}</p>
      <div className="sd-phases" aria-label={tr('Phases','Phases')}>{(['enemy','discard','draw','capture'] as const).map(p=><span key={p} aria-current={view.phase===p?'step':undefined}>{phaseLabels[p]}</span>)}</div>
      <div className="sd-counts">{[[tr('Pioche personnelle','Player deck'),view.counts.playerDeck],[tr('Pioche ennemie','Enemy deck'),view.counts.enemyDeck],[tr('Défausse personnelle','Personal discard'),view.counts.discard],[tr('Capture ennemie','Enemy capture'),view.counts.enemyCapture]].map(([label,n])=><span key={label}>{label}: <strong>{n}</strong></span>)}</div>
      <h3>{tr('Ligne ennemie','Enemy line')}</h3>
      <p className="sd-direction">{tr('Entrée de la pioche → position 1 à droite','Deck entry → position 1 on the right')}</p>
      <div className="sd-line">{positions.map(position=>{
        const id=view.enemyLine[position-1];
        const active=kind==='capture-b'?position===1:target===position;
        return <button type="button" key={position} className="sd-card" data-position={position} disabled={!id||view.phase!=='capture'||kind==='capture-b'||!!pending||restart} aria-pressed={active&&!!id} aria-label={tr('Position','Position')+' '+position+' · '+(id?cardName(id):tr('Vide','Empty'))} onClick={()=>{setTarget(position);setCopy(null);}}>
          <span className="sd-position">{position}</span>{id?renderCard(id):<span>{tr('Vide','Empty')}</span>}
        </button>;
      })}</div>
      <h3>{tr('Votre main','Your hand')}</h3>
      <div className="sd-line sd-hand">{view.hand.map(id=><button type="button" key={id} className="sd-card" aria-label={cardName(id)} aria-pressed={selected.includes(id)} disabled={!['discard','capture'].includes(view.phase)||!!pending||restart} onClick={()=>{setSelected(old=>old.includes(id)?old.filter(x=>x!==id):kind==='capture-b'&&view.phase==='capture'?[id]:[...old,id]);setCopy(null);}}>{renderCard(id)}</button>)}</div>
      {!view.hand.length?<p>{tr('Main vide','Empty hand')}</p>:null}
      <h3 ref={heading} tabIndex={-1}>{tr('Actions autorisées','Legal actions')}</h3>
      {view.phase==='capture'?<div className="sd-actions">{(['capture-a','capture-b','capture-c'] as const).map(k=><button key={k} type="button" className="secondary-action" aria-pressed={kind===k} disabled={!!pending||restart||!view.actions.some(a=>a.type===k)} onClick={()=>{setKind(k);setSelected([]);setTarget(null);setCopy(null);}}>{k==='capture-a'?tr('A · Capturer','A · Capture'):k==='capture-b'?tr('B · Laisser capturer','B · Let enemy capture'):tr('C · Repousser','C · Push back')}</button>)}</div>:null}
      {hintsEnabled&&view.phase==='capture'?<p>{kind==='capture-a'?tr('Choisissez une cible et des cartes de même enseigne. Le Joker copie une carte engagée.','Choose a target and matching-suit cards. A Joker copies a selected card.'):kind==='capture-b'?tr('Sacrifiez une carte de main avec la position 1. Une figure ou un As perdu entraîne la défaite.','Sacrifice one hand card with position 1. Losing a face card or ace causes defeat.'):tr('Sacrifiez deux cartes pour renvoyer la cible sous la pioche adverse.','Sacrifice two cards to return the target to the bottom of the enemy deck.')}</p>:null}
      {copyChoices.length>0?<fieldset disabled={!!pending||restart}><legend>{tr('Carte copiée par le Joker','Card copied by the Joker')}</legend>{copyChoices.map(id=><label key={id}><input type="radio" name="sd-copy" checked={copy===id} onChange={()=>setCopy(id)}/>{cardName(id)}</label>)}</fieldset>:null}
      {view.blockedReason?<p role="alert">{tr('Cartes personnelles insuffisantes. Règle d’impasse à confirmer ; aucune défaite attribuée.','Not enough personal cards. Deadlock rule pending confirmation; no defeat recorded.')}</p>:null}
      {view.outcome==='in-progress'&&!view.blockedReason?<button type="button" className="primary-action sd-preview" disabled={!chosen||!!pending||restart} onClick={()=>{if(chosen)setPending(chosen);}}>{tr('Prévisualiser le coup','Preview move')}</button>:null}
      {pending?<div className="sd-confirm" role="group" aria-label={tr('Confirmation du coup','Confirm move')}>
        <p>{actionName(pending)} {pending.type==='capture-a'||pending.type==='capture-c'?tr('Position','Position')+' '+pending.targetPosition:''}</p>
        <p>{'cardIds' in pending?pending.cardIds.map(cardName).join(' · '):'cardId' in pending?cardName(pending.cardId):''}</p>
        {pending.type==='capture-a'&&pending.jokerCopyId?<p>{tr('Copie :','Copy:')} {cardName(pending.jokerCopyId)}</p>:null}
        <button ref={confirmRef} className="primary-action" onClick={confirm}>{tr('Confirmer','Confirm')}</button>
        <button className="secondary-action" onClick={()=>{setPending(null);heading.current?.focus();}}>{tr('Annuler','Cancel')}</button>
      </div>:null}
      {error?<p role="alert">{tr('Action refusée. L’état précédent est conservé.','Action rejected. Previous state preserved.')}</p>:null}
      <button className="secondary-action" disabled={!!pending||restart} onClick={()=>setRestart(true)}>{tr('Nouvelle partie','New game')}</button>
      {restart?<div className="sd-confirm"><p>{tr('Remplacer cette partie de recette ?','Replace this preview game?')}</p><button ref={confirmRef} className="primary-action" onClick={start}>{tr('Confirmer','Confirm')}</button><button className="secondary-action" onClick={()=>setRestart(false)}>{tr('Annuler','Cancel')}</button></div>:null}
    </>}
    <p className="help-note">{tr('D’après Card Capture, jeu original de Lucas Gentry.','Based on Card Capture, original game by Lucas Gentry.')}</p>
  </section>;
}
