import '../skydeck.css';
import { skydeckCardArt } from '../application/skydeck-art.ts';
import { playSkydeckSound, setSkydeckFinished, skydeckActionSounds } from '../application/skydeck-audio.ts';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Locale } from '../i18n/language.ts';
import { describeSkydeckCard } from '../games/card-capture/preview.ts';
import type { SkydeckAction, SkydeckPublicState } from '../games/card-capture/engine.ts';

import {createIndexedDbGameStorage} from '../adapters/indexeddb-game-storage.ts';
import {startSkydeck,resumeSkydeck,getSkydeckNewGameChoice,confirmSkydeckNewGame,practiceSkydeck,skydeckSessionView} from '../games/card-capture/persistence.ts';
import type {NewGameChoice} from '../application/new-game-choice.ts';
type Preview=ReturnType<typeof skydeckSessionView>;
type Kind='capture-a'|'capture-b'|'capture-c';
const positions=[4,3,2,1];
const ui=(category:string,name:string)=>import.meta.env.BASE_URL+`art/${category}/skydeck/${name}.webp`;
const phaseIcons={enemy:'enemy',discard:'discard',draw:'draw',capture:'capture'} as const;
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
  const [menu,setMenu]=useState(false);
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
        const storage=createIndexedDbGameStorage();
        const existing=tutorial?practiceSkydeck({seed:54}):await resumeSkydeck(storage);
        if(cancelled)return;
        const next=existing??await startSkydeck(storage,crypto.randomUUID(),setup());
        if(cancelled)return;
        session.current=skydeckSessionView(next);
        setView(session.current.inspect());
        setResumed(!!existing&&!tutorial);
        if(!existing)playSkydeckSound("shuffle");
      }catch{if(!cancelled){setBlocked(true);setStorageError(true);}}
      finally{if(!cancelled)setBusy(false);}
    })();
    return()=>{cancelled=true;mounted.current=false;};
  },[tutorial]);
  useEffect(()=>{setSkydeckFinished(!!view&&view.outcome!=='in-progress');},[view?.outcome]);
  const confirmRef=useRef<HTMLButtonElement>(null);
  const heading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{if(pending||restart||abandon)confirmRef.current?.focus();},[pending,restart,abandon]);
  function reset(){setMenu(false);setSelected([]);setTarget(null);setCopy(null);setPending(null);setError(false);setRestart(false);setAbandon(false);setKind('capture-a');}
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
    if(view.phase==='discard')return selected.length===0?a.type==='discard-none':a.type==='discard'&&same(a.cardIds);
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
  return <section className="sd-board" style={{'--sd-phase-panel': 'url("'+import.meta.env.BASE_URL+'art/frames/skydeck/phase-panel.webp")','--sd-counter': 'url("'+import.meta.env.BASE_URL+'art/hud/skydeck/counter-blank.webp")','--sd-section': 'url("'+import.meta.env.BASE_URL+'art/banners/skydeck/section-heading.webp")','--sd-enemy-slot': 'url("'+import.meta.env.BASE_URL+'art/frames/skydeck/enemy-slot.webp")','--sd-hand-slot': 'url("'+import.meta.env.BASE_URL+'art/frames/skydeck/hand-slot.webp")','--sd-wood': 'url("'+import.meta.env.BASE_URL+'art/boards/skydeck/wood-deck.webp")','--sd-dark': 'url("'+import.meta.env.BASE_URL+'art/buttons/skydeck/dark.webp")','--sd-gold': 'url("'+import.meta.env.BASE_URL+'art/buttons/skydeck/gold.webp")','--sd-neutral': 'url("'+import.meta.env.BASE_URL+'art/buttons/skydeck/neutral.webp")','--sd-victory': 'url("'+import.meta.env.BASE_URL+'art/boards/skydeck/victory-portrait.webp")','--sd-defeat': 'url("'+import.meta.env.BASE_URL+'art/boards/skydeck/defeat-portrait.webp")'} as CSSProperties} data-i18n-ignore aria-busy={busy} aria-label={tr('Plateau Skydeck','Skydeck board')}>
    {tutorial?<p className="sd-training">{tr("Entraînement sans sauvegarde ni statistiques.","Training without saves or statistics.")}</p>:null}
    {resumed?<p className="sd-resumed">{tr('✓ Partie reprise','✓ Game resumed')}</p>:null}
    {storageError?<p role="alert">{blocked?tr('Sauvegarde incompatible ou inaccessible. Elle est conservée.','Incompatible or inaccessible save. It is preserved.'):tr('Action non enregistrée. La sauvegarde précédente est conservée.','Action not saved. Previous save preserved.')}</p>:null}
    {!view?<>{busy?<p role="status">{tr("Préparation de la flotte…","Preparing the fleet…")}</p>:!blocked?<button type="button" className="primary-action" onClick={()=>void start()}>{tr("Réessayer","Retry")}</button>:null}</>:<>
      <p className="sd-round" role="status" aria-live="polite">{tr('Manche','Round')} {view.round} · {phaseLabels[view.phase]} · {view.outcome==='win'?tr('Victoire','Victory'):view.outcome==='loss'?tr('Défaite','Defeat'):view.outcome==='abandoned'?tr('Abandon','Abandoned'):tr('En cours','In progress')}</p>
      <div className="sd-phases" aria-label={tr('Phases','Phases')}>{(['enemy','discard','draw','capture'] as const).map(p=><span key={p} aria-current={view.phase===p?'step':undefined}><img src={ui('icons',phaseIcons[p])} alt=""/>{phaseLabels[p]}</span>)}</div>
      <div className="sd-counts">{[[tr('Pioche','Player deck'),view.counts.playerDeck,'draw'],[tr('Ennemis','Enemy deck'),view.counts.enemyDeck,'enemy'],[tr('Défausse','Discard'),view.counts.discard,'discard'],[tr('Pertes','Enemy capture'),view.counts.enemyCapture,'capture']].map(([label,n,icon])=><span key={label}><img src={ui('icons',String(icon))} alt=""/><strong>{n}</strong><small>{label}</small></span>)}</div>
      <div className="sd-fleets"><section className="sd-fleet sd-enemy-fleet"><h3>{tr('Flotte ennemie','Enemy fleet')}</h3>
      <p className="sd-direction">{tr("Entrée à droite → 1","Entry on right → 1")}</p>
      <div className="sd-line">{positions.map(position=>{
        const id=view.enemyLine[position-1];
        const active=kind==='capture-b'?position===1:target===position;
        return <button type="button" key={position} className={'sd-card'+(!id?' sd-empty sd-enemy-slot':'')} data-position={position} disabled={!id||view.phase!=='capture'||kind==='capture-b'||!!pending||restart||abandon||busy} aria-pressed={active&&!!id} aria-label={tr('Position','Position')+' '+position+' · '+(id?cardName(id):tr('Vide','Empty'))} onClick={()=>{playSkydeckSound('select');setTarget(position);setCopy(null);}}>
          <span className="sd-position">{position}</span>{id?renderCard(id):<span className="sd-slot-label">{tr('Libre','Empty')}</span>}
        </button>;
      })}</div>
      </section><section className="sd-fleet sd-player-fleet"><h3>{tr('Votre flotte','Your fleet')}</h3>
      <div className="sd-line sd-hand">{view.hand.map(id=><button type="button" key={id} className="sd-card" aria-label={cardName(id)} aria-pressed={selected.includes(id)} disabled={!['discard','capture'].includes(view.phase)||!!pending||restart||abandon||busy} onClick={()=>{playSkydeckSound('select');setSelected(old=>old.includes(id)?old.filter(x=>x!==id):kind==='capture-b'&&view.phase==='capture'?[id]:[...old,id]);setCopy(null);}}>{renderCard(id)}</button>)}{Array.from({length:Math.max(0,4-view.hand.length)},(_,i)=><span key={'empty-'+i} className="sd-card sd-empty sd-hand-slot" aria-hidden="true"/>)}</div>
      </section></div><section className="sd-console"><h3 ref={heading} tabIndex={-1}>{tr('Commandement','Command')}</h3>
      {view.phase==='capture'?<div className="sd-actions">{(['capture-a','capture-b','capture-c'] as const).map(k=><button key={k} type="button" className="secondary-action" aria-pressed={kind===k} disabled={!!pending||restart||abandon||busy||!view.actions.some(a=>a.type===k)} onClick={()=>{playSkydeckSound('button');setKind(k);setSelected([]);setTarget(null);setCopy(null);}}>{k==='capture-a'?tr('A · Capturer','A · Capture'):k==='capture-b'?tr('B · Laisser capturer','B · Let enemy capture'):tr('C · Repousser','C · Push back')}</button>)}</div>:null}
      {hintsEnabled&&view.phase==='capture'?<p>{kind==='capture-a'?tr('Choisissez une cible et des cartes de même enseigne. Le Joker copie une carte engagée.','Choose a target and matching-suit cards. A Joker copies a selected card.'):kind==='capture-b'?tr('Sacrifiez une carte de main avec la position 1. Une figure ou un As perdu entraîne la défaite.','Sacrifice one hand card with position 1. Losing a face card or ace causes defeat.'):tr('Sacrifiez deux cartes pour renvoyer la cible sous la pioche adverse.','Sacrifice two cards to return the target to the bottom of the enemy deck.')}</p>:null}
      {copyChoices.length>0?<fieldset disabled={!!pending||restart||abandon||busy}><legend>{tr('Carte copiée par le Joker','Card copied by the Joker')}</legend>{copyChoices.map(id=><label key={id}><input type="radio" name="sd-copy" checked={copy===id} onChange={()=>{playSkydeckSound('joker');setCopy(id);}}/>{cardName(id)}</label>)}</fieldset>:null}
      {view.blockedReason?<p role="alert">{tr('Cartes personnelles insuffisantes. Règle d’impasse à confirmer ; aucune défaite attribuée.','Not enough personal cards. Deadlock rule pending confirmation; no defeat recorded.')}</p>:null}
      {view.outcome==='in-progress'&&!view.blockedReason?<button type="button" className="primary-action sd-preview" disabled={!chosen||!!pending||restart||abandon||busy||blocked} onClick={()=>{if(chosen){playSkydeckSound('open');setPending(chosen);}}}>{chosen?actionName(chosen):view.phase==='capture'?tr('Choisir les cartes','Select cards'):phaseLabels[view.phase]}</button>:null}
      {pending?<div className="sd-confirm" role="group" aria-label={tr('Confirmation du coup','Confirm move')}>
        <p>{actionName(pending)} {pending.type==='capture-a'||pending.type==='capture-c'?tr('Position','Position')+' '+pending.targetPosition:''}</p>
        <p>{'cardIds' in pending?pending.cardIds.map(cardName).join(' · '):'cardId' in pending?cardName(pending.cardId):''}</p>
        {pending.type==='capture-a'&&pending.jokerCopyId?<p>{tr('Copie :','Copy:')} {cardName(pending.jokerCopyId)}</p>:null}
        <button ref={confirmRef} className="primary-action" disabled={busy} onClick={()=>void confirm()}>{tr('Confirmer','Confirm')}</button>
        <button className="secondary-action" disabled={busy} onClick={()=>{playSkydeckSound('close');setPending(null);heading.current?.focus();}}>{tr('Annuler','Cancel')}</button>
      </div>:null}
      {error?<p role="alert">{tr('Action refusée. L’état précédent est conservé.','Action rejected. Previous state preserved.')}</p>:null}
      <button className="sd-menu-toggle secondary-action" type="button" aria-expanded={menu} onClick={()=>setMenu(x=>!x)}>{tr('Options de partie','Game options')}</button>
      {menu||view.outcome!=='in-progress'?<div className="sd-game-options"><button className="secondary-action" disabled={!!pending||restart||abandon||busy} onClick={()=>void requestRestart()}>{view.outcome==='in-progress'?tr('Nouvelle partie','New game'):tr('Rejouer','Replay')}</button>
      {!tutorial&&view.outcome==='in-progress'?<button className="secondary-action" disabled={busy||!!pending||restart||abandon} onClick={()=>{playSkydeckSound('open');setAbandon(true);}}>{tr('Abandonner','Abandon')}</button>:null}</div>:null}
      {abandon?<div className="sd-confirm"><p>{tr('Abandonner définitivement cette partie ?','Abandon this game permanently?')}</p><button ref={confirmRef} className="primary-action" disabled={busy} onClick={()=>void confirm({type:'abandon'})}>{tr('Confirmer','Confirm')}</button><button className="secondary-action" disabled={busy} onClick={()=>{playSkydeckSound('close');setAbandon(false);}}>{tr('Annuler','Cancel')}</button></div>:null}
      {view.outcome!=='in-progress'?<div className={'sd-confirm sd-ending '+(view.outcome==='win'?'sd-win':view.outcome==='loss'?'sd-loss':'')} role="status">{view.outcome==='win'||view.outcome==='loss'?<img className="sd-end-icon" src={ui('icons',view.outcome==='win'?'victory':'defeat')} alt=""/>:null}<p>{view.outcome==='win'?tr('Victoire : tous les ennemis ont été éliminés.','Victory: all enemies have been cleared.'):view.outcome==='loss'?tr('Défaite : une figure ou un As a été perdu.','Defeat: a face card or ace was lost.'):tr('Partie abandonnée.','Game abandoned.')}</p><a className="secondary-action" href="#">{tr('Retour au catalogue','Back to catalogue')}</a></div>:null}
      {restart?<div className="sd-confirm"><p>{view.outcome==='in-progress'?tr('Remplacer cette partie ? La partie actuelle sera abandonnée.','Replace this game? The current game will be abandoned.'):tr('Commencer une nouvelle partie ?','Start a new game?')}</p><button ref={confirmRef} className="primary-action" disabled={busy} onClick={()=>void replace()}>{tr('Confirmer','Confirm')}</button><button className="secondary-action" disabled={busy} onClick={()=>{playSkydeckSound('close');setRestart(false);}}>{tr('Annuler','Cancel')}</button></div>:null}
    </section></>}
  </section>;
}
