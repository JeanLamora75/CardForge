import { resolveSkydeckCopy, skydeckAttackSummary } from '../application/skydeck-combat-ui.ts';
import { skydeckMotionPlan } from '../application/skydeck-motion.ts';
import { motionAllowed } from '../application/shared-settings.ts';
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
  const boardRef=useRef<HTMLElement>(null);
  const activeAnimations=useRef<Animation[]>([]);
  useEffect(()=>()=>{for(const a of activeAnimations.current)a.cancel();},[]);
  const session=useRef<Preview|null>(null);
  const [view,setView]=useState<SkydeckPublicState|null>(null);
  const [kind,setKind]=useState<Kind>('capture-a');
  const [selected,setSelected]=useState<string[]>([]);
  const [target,setTarget]=useState<number|null>(null);
  const [copy,setCopy]=useState<string|null>(null);
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
  useEffect(()=>{if(restart||abandon)confirmRef.current?.focus();},[restart,abandon]);
  function reset(){setMenu(false);setSelected([]);setTarget(null);setCopy(null);setError(false);setRestart(false);setAbandon(false);setKind('capture-a');}
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
  async function confirm(command:SkydeckAction){
    if(!command||!session.current)return;
    await run(async()=>{
      const before=session.current!.inspect();
      const accepted=await session.current!.confirm(command);
      if(!mounted.current)return;
      if(!accepted){playSkydeckSound('invalid');setError(true);setAbandon(false);return;}
      const after=session.current!.inspect();
      const preference=document.documentElement.dataset.motion;
      const animate=motionAllowed(preference==='on'||preference==='off'?preference:'system',window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      const plan=skydeckMotionPlan(command,before,after);
      const root=boardRef.current;
      for(const animation of activeAnimations.current)animation.cancel();
      activeAnimations.current=[];
      const departed:HTMLElement[]=[];
      if(animate&&root){
        for(const item of plan.filter(x=>['capture','sacrifice','repel','discard'].includes(x.effect))){
          const original=Array.from(root.querySelectorAll<HTMLElement>('[data-card-id]')).find(n=>n.dataset.cardId===item.id);
          if(!original)continue;
          const rect=original.getBoundingClientRect();
          const ghost=original.cloneNode(true) as HTMLElement;
          ghost.removeAttribute('data-card-id');ghost.removeAttribute('aria-label');ghost.setAttribute('aria-hidden','true');ghost.setAttribute('tabindex','-1');
          ghost.classList.add('sd-motion-ghost');
          Object.assign(ghost.style,{position:'fixed',left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px',pointerEvents:'none',margin:'0',zIndex:'22'});
          root.appendChild(ghost);departed.push(ghost);
          const frames=item.effect==='capture'?[{filter:'brightness(1.7)',transform:'scale(1.03)',opacity:1},{filter:'brightness(.7)',transform:'scale(.65)',opacity:0}]:item.effect==='repel'?[{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(70px) scale(.5)'}]:[{filter:'brightness(.65)',opacity:1},{filter:'brightness(.2)',opacity:0,transform:'translateY(24px) scale(.8)'}];
          const animation=ghost.animate(frames,{duration:360,easing:'ease-out',fill:'forwards'});
          activeAnimations.current.push(animation);
          void animation.finished.catch(()=>{}).finally(()=>ghost.remove());
        }
      }
      for(const sound of skydeckActionSounds(command,before,after))playSkydeckSound(sound);
      if(after.outcome==='win'||after.outcome==='loss'){setSkydeckFinished(true);playSkydeckSound(after.outcome==='win'?'victory':'defeat','music');}
      setView(after);setResumed(false);reset();heading.current?.focus();
      if(animate&&root){
        requestAnimationFrame(()=>requestAnimationFrame(()=>{
          if(!mounted.current||!root.isConnected){departed.forEach(n=>n.remove());return;}
          for(const item of plan.filter(x=>['advance','arrive','deal'].includes(x.effect))){
            const node=Array.from(root.querySelectorAll<HTMLElement>('[data-card-id]')).find(n=>n.dataset.cardId===item.id);
            if(!node)continue;
            const distance=item.effect==='advance'?((item.index-(item.from??item.index))*(node.offsetWidth+5)):item.effect==='arrive'?node.offsetWidth:0;
            const animation=node.animate([{transform:item.effect==='deal'?'translateY(-32px) scale(.8)':`translateX(${distance}px)`,opacity:item.effect==='advance'?1:.15},{transform:'none',opacity:1}],{duration:300,delay:item.effect==='deal'?item.index*65:0,easing:'ease-out',fill:'backwards'});
            activeAnimations.current.push(animation);
          }
          if(command.type==='capture-a'&&command.jokerCopyId)activeAnimations.current.push(root.animate([{boxShadow:'inset 0 0 32px #c98aff'},{boxShadow:'inset 0 0 0 transparent'}],{duration:500}));
          const phase=root.querySelector<HTMLElement>('.sd-phases [aria-current]');
          if(phase&&before.phase!==after.phase)activeAnimations.current.push(phase.animate([{filter:'brightness(1.65)'},{filter:'brightness(1)'}],{duration:320}));
        }));
      }
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
  const {choices:copyChoices,effective:effectiveCopy,chosen}=resolveSkydeckCopy(matching,copy);
  const attack=skydeckAttackSummary(chosen,view?.enemyLine??[]);
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
  return <section ref={boardRef} className={"sd-board"+(view?.outcome==="in-progress"?" sd-live":"")} style={{'--sd-phase-panel': 'url("'+import.meta.env.BASE_URL+'art/frames/skydeck/phase-panel.webp")','--sd-counter': 'url("'+import.meta.env.BASE_URL+'art/hud/skydeck/counter-blank.webp")','--sd-section': 'url("'+import.meta.env.BASE_URL+'art/banners/skydeck/section-heading.webp")','--sd-enemy-slot': 'url("'+import.meta.env.BASE_URL+'art/frames/skydeck/enemy-slot.webp")','--sd-hand-slot': 'url("'+import.meta.env.BASE_URL+'art/frames/skydeck/hand-slot.webp")','--sd-wood': 'url("'+import.meta.env.BASE_URL+'art/boards/skydeck/wood-deck.webp")','--sd-dark': 'url("'+import.meta.env.BASE_URL+'art/buttons/skydeck/dark.webp")','--sd-gold': 'url("'+import.meta.env.BASE_URL+'art/buttons/skydeck/gold.webp")','--sd-neutral': 'url("'+import.meta.env.BASE_URL+'art/buttons/skydeck/neutral.webp")','--sd-victory': 'url("'+import.meta.env.BASE_URL+'art/boards/skydeck/victory-portrait.webp")','--sd-defeat': 'url("'+import.meta.env.BASE_URL+'art/boards/skydeck/defeat-portrait.webp")'} as CSSProperties} data-i18n-ignore aria-busy={busy} aria-label={tr('Plateau Skydeck','Skydeck board')}>
    {tutorial?<p className="sd-training">{tr("Entraînement sans sauvegarde ni statistiques.","Training without saves or statistics.")}</p>:null}
    {resumed?<p className="sd-resumed">{tr('✓ Partie reprise','✓ Game resumed')}</p>:null}
    {storageError?<p role="alert">{blocked?tr('Sauvegarde incompatible ou inaccessible. Elle est conservée.','Incompatible or inaccessible save. It is preserved.'):tr('Action non enregistrée. La sauvegarde précédente est conservée.','Action not saved. Previous save preserved.')}</p>:null}
    {!view?<>{busy?<p role="status">{tr("Préparation de la flotte…","Preparing the fleet…")}</p>:!blocked?<button type="button" className="primary-action" onClick={()=>void start()}>{tr("Réessayer","Retry")}</button>:null}</>:<>
      <p className="sd-round" role="status" aria-live="polite">{tr('Manche','Round')} {view.round} · {phaseLabels[view.phase]} · {view.outcome==='win'?tr('Victoire','Victory'):view.outcome==='loss'?tr('Défaite','Defeat'):view.outcome==='abandoned'?tr('Abandon','Abandoned'):tr('En cours','In progress')}</p>
      <div className="sd-phases" aria-label={tr('Phases','Phases')}>{(['enemy','discard','draw','capture'] as const).map(p=><span key={p} aria-current={view.phase===p?'step':undefined}><img src={ui('icons',phaseIcons[p])} alt=""/>{phaseLabels[p]}</span>)}</div>
      <div className="sd-counts">{[[tr('Pioche','Player deck'),view.counts.playerDeck,'draw'],[tr('Ennemis','Enemy deck'),view.counts.enemyDeck,'enemy'],[tr('Défausse','Discard'),view.counts.discard,'discard'],[tr('Pertes','Enemy capture'),view.counts.enemyCapture,'capture']].map(([label,n,icon])=><span key={label} className="sd-counter"><img className="sd-counter-art" src={ui("hud","counter-blank")} alt=""/><img src={ui('icons',String(icon))} alt=""/><strong>{n}</strong><small>{label}</small></span>)}</div>
      <div className="sd-fleets"><section className="sd-fleet sd-enemy-fleet"><h3><img className="sd-heading-art" src={ui('banners','section-heading')} alt=""/><span>{tr('Flotte ennemie','Enemy fleet')}</span></h3>
      <div className="sd-line">{positions.map(position=>{
        const id=view.enemyLine[position-1];
        const forcedTarget=view.phase==='capture'&&kind==='capture-b'&&position===1&&!!id;
        const active=view.phase==='capture'&&(kind==='capture-b'?forcedTarget:target===position);
        return <button type="button" key={position} className={'sd-card'+(!id?' sd-empty sd-enemy-slot':'')+(forcedTarget?' sd-forced-target':'')} data-position={position} data-card-id={id??undefined} disabled={!id||view.phase!=='capture'||kind==='capture-b'||restart||abandon||busy} aria-pressed={active&&!!id} aria-label={tr('Position','Position')+' '+position+ ' · '+(id?cardName(id):tr('Vide','Empty'))+(forcedTarget?tr(' · Cible imposée',' · Required target'):'')} onClick={()=>{playSkydeckSound('select');setTarget(position);setCopy(null);}}>
          {id?renderCard(id):<><img className="sd-slot-art" src={ui('frames','enemy-slot')} alt=""/><img className="sd-slot-emblem" src={ui("icons","compass")} alt=""/><span className="sd-slot-label">{tr('Libre','Empty')}</span></>}
        </button>;
      })}</div>
      </section><section className="sd-fleet sd-player-fleet"><h3><img className="sd-heading-art" src={ui('banners','section-heading')} alt=""/><span>{tr('Votre flotte','Your fleet')}</span></h3>
      <div className="sd-line sd-hand">{view.hand.map(id=><button type="button" key={id} data-card-id={id} className={"sd-card"+(effectiveCopy===id?" sd-copy-source":"")+(copyChoices.length>1&&copyChoices.includes(id)?" sd-copy-choice":"")} aria-label={cardName(id)+(effectiveCopy===id?tr(" · Copié par le Joker"," · Copied by Joker"):"")} aria-pressed={selected.includes(id)} disabled={!['discard','capture'].includes(view.phase)||restart||abandon||busy} onClick={()=>{playSkydeckSound('select');setSelected(old=>old.includes(id)?old.filter(x=>x!==id):kind==='capture-b'&&view.phase==='capture'?[id]:[...old,id]);setCopy(null);}}>{renderCard(id)}</button>)}{Array.from({length:Math.max(0,4-view.hand.length)},(_,i)=><span key={'empty-'+i} className="sd-card sd-empty sd-hand-slot" aria-hidden="true"><img className="sd-slot-art" src={ui("frames","hand-slot")} alt=""/><img className="sd-slot-emblem" src={ui("icons","compass")} alt=""/></span>)}</div>
      </section></div><section className="sd-console"><h3 ref={heading} tabIndex={-1}>{tr('Commandement','Command')}</h3>
      {view.phase==='capture'?<div className="sd-actions">{(['capture-a','capture-b','capture-c'] as const).map(k=><button key={k} type="button" className="secondary-action" aria-pressed={kind===k} disabled={restart||abandon||busy||!view.actions.some(a=>a.type===k)} onClick={()=>{playSkydeckSound('button');setKind(k);setSelected([]);setTarget(null);setCopy(null);}}><img className="sd-action-art" src={ui('buttons',k==='capture-a'?'green':k==='capture-b'?'red':'blue')} alt=""/><img className="sd-action-icon" src={ui('icons',k==='capture-a'?'capture':k==='capture-b'?'sacrifice':'repel')} alt=""/><span>{k==='capture-a'?tr('A · Capturer','A · Capture'):k==='capture-b'?tr('B · Laisser capturer','B · Let enemy capture'):tr('C · Repousser','C · Push back')}</span></button>)}</div>:null}
      {hintsEnabled&&view.phase==='capture'?<p className="sd-hint">{kind==='capture-a'?tr('Choisissez une cible et des cartes de même enseigne. Le Joker copie une carte engagée.','Choose a target and matching-suit cards. A Joker copies a selected card.'):kind==='capture-b'?tr('Sacrifiez une carte de main face à l’ennemi le plus à droite. Une figure ou un As perdu entraîne la défaite.','Sacrifice one hand card against the rightmost enemy. Losing a face card or ace causes defeat.'):tr('Sacrifiez deux cartes pour renvoyer la cible sous la pioche adverse.','Sacrifice two cards to return the target to the bottom of the enemy deck.')}</p>:null}
      {copyChoices.length>1?<div className="sd-copy-picker" role="group" aria-label={tr('Carte copiée par le Joker','Card copied by Joker')}><span>{tr('Copie du Joker :','Joker copy:')}</span>{copyChoices.map(id=><button key={id} type="button" aria-pressed={effectiveCopy===id} disabled={busy||restart||abandon} onClick={()=>{playSkydeckSound('joker');setCopy(id);}}>{describeSkydeckCard(id,language).power} {describeSkydeckCard(id,language).symbol}</button>)}</div>:null}
      {hintsEnabled&&attack?<p className="sd-tactical" aria-live="polite">{attack.values.join(' + ')} = {attack.total} · {tr('Ennemi','Enemy')} {attack.enemy} · {tr('Capture possible','Capture possible')}</p>:null}
      {view.blockedReason?<p role="alert">{tr('Cartes personnelles insuffisantes. Règle d’impasse à confirmer ; aucune défaite attribuée.','Not enough personal cards. Deadlock rule pending confirmation; no defeat recorded.')}</p>:null}
      {view.outcome==='in-progress'&&!view.blockedReason?<button type="button" className="primary-action sd-preview" disabled={!chosen||restart||abandon||busy||blocked} onClick={()=>{if(chosen)void confirm(chosen);}}><img className="sd-button-art" src={ui('buttons',chosen&&!busy&&!restart&&!abandon&&!blocked?'gold':'neutral')} alt=""/><span>{chosen?actionName(chosen):view.phase==='capture'?tr('Choisir les cartes','Select cards'):phaseLabels[view.phase]}</span></button>:null}
      {error?<p role="alert">{tr('Action refusée. L’état précédent est conservé.','Action rejected. Previous state preserved.')}</p>:null}
      <button className="sd-menu-toggle secondary-action" type="button" aria-expanded={menu} onClick={()=>setMenu(x=>!x)}><img className="sd-action-art" src={ui('buttons','dark')} alt=""/><span>{tr('Options de partie','Game options')}</span></button>
      {menu||view.outcome!=='in-progress'?<div className="sd-game-options"><button className="secondary-action" disabled={restart||abandon||busy} onClick={()=>void requestRestart()}>{view.outcome==='in-progress'?tr('Nouvelle partie','New game'):tr('Rejouer','Replay')}</button>
      {!tutorial&&view.outcome==='in-progress'?<button className="secondary-action" disabled={busy||restart||abandon} onClick={()=>{playSkydeckSound('open');setAbandon(true);}}>{tr('Abandonner','Abandon')}</button>:null}</div>:null}
      {abandon?<div className="sd-confirm"><p>{tr('Abandonner définitivement cette partie ?','Abandon this game permanently?')}</p><button ref={confirmRef} className="primary-action" disabled={busy} onClick={()=>void confirm({type:'abandon'})}>{tr('Confirmer','Confirm')}</button><button className="secondary-action" disabled={busy} onClick={()=>{playSkydeckSound('close');setAbandon(false);}}>{tr('Annuler','Cancel')}</button></div>:null}
      {view.outcome!=='in-progress'?<div className={'sd-confirm sd-ending '+(view.outcome==='win'?'sd-win':view.outcome==='loss'?'sd-loss':'')} role="status">{view.outcome==='win'||view.outcome==='loss'?<img className="sd-end-icon" src={ui('icons',view.outcome==='win'?'victory':'defeat')} alt=""/>:null}<p>{view.outcome==='win'?tr('Victoire : tous les ennemis ont été éliminés.','Victory: all enemies have been cleared.'):view.outcome==='loss'?tr('Défaite : une figure ou un As a été perdu.','Defeat: a face card or ace was lost.'):tr('Partie abandonnée.','Game abandoned.')}</p><a className="secondary-action" href="#">{tr('Retour au catalogue','Back to catalogue')}</a></div>:null}
      {restart?<div className="sd-confirm"><p>{view.outcome==='in-progress'?tr('Remplacer cette partie ? La partie actuelle sera abandonnée.','Replace this game? The current game will be abandoned.'):tr('Commencer une nouvelle partie ?','Start a new game?')}</p><button ref={confirmRef} className="primary-action" disabled={busy} onClick={()=>void replace()}>{tr('Confirmer','Confirm')}</button><button className="secondary-action" disabled={busy} onClick={()=>{playSkydeckSound('close');setRestart(false);}}>{tr('Annuler','Cancel')}</button></div>:null}
    </section></>}
  </section>;
}
