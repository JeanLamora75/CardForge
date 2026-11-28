import {automaticSkydeckAction,skydeckAttackFeedback,skydeckCompatibleTargets,skydeckProtected} from '../application/skydeck-flow.ts';
import SkydeckEnding from './SkydeckEnding.tsx';
import type {SkydeckManualPage} from './SkydeckRulebook.tsx';
import { resolveSkydeckCopy, skydeckAttackSummary } from '../application/skydeck-combat-ui.ts';
import { skydeckMotionPlan } from '../application/skydeck-motion.ts';
import { motionAllowed } from '../application/shared-settings.ts';
import { skydeckCardArt } from '../application/skydeck-art.ts';
import { playSkydeckSound, setSkydeckFinished, skydeckActionSounds } from '../application/skydeck-audio.ts';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
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
export default function SkydeckBoard({language,hintsEnabled=true,tutorial=false,paused=false,onManualPage}:{language:Locale;hintsEnabled?:boolean;tutorial?:boolean;paused?:boolean;onManualPage?:(page:SkydeckManualPage)=>void}){
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
  const [notice,setNotice]=useState('');
  const [dragPosition,setDragPosition]=useState<number|null>(null);
  const drag=useRef<{id:string;x:number;y:number;active:boolean;pointer:number}|null>(null);
  const suppressClick=useRef(false);
  useEffect(()=>{if(!notice)return;const t=window.setTimeout(()=>setNotice(''),900);return()=>window.clearTimeout(t);},[notice,view?.round]);

  const [menu,setMenu]=useState(false);
  const menuRef=useRef<HTMLDivElement>(null);
  const menuButtonRef=useRef<HTMLButtonElement>(null);
  useEffect(()=>{
    if(!menu)return;
    const outside=(event:PointerEvent)=>{if(!menuRef.current?.contains(event.target as Node))setMenu(false);};
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();setMenu(false);menuButtonRef.current?.focus();}};
    document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);
    return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);};
  },[menu]);
  const [restart,setRestart]=useState(false);
  const [abandon,setAbandon]=useState(false);
  const [busy,setBusy]=useState(true);
  const [blocked,setBlocked]=useState(false);
  const [storageError,setStorageError]=useState(false);
  const [resumed,setResumed]=useState(false);
  useEffect(()=>{if(!resumed)return;const timer=window.setTimeout(()=>setResumed(false),3500);return()=>window.clearTimeout(timer);},[resumed]);
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
  async function replayFinished(){
    await run(async()=>{
      if(!view||view.outcome==='in-progress')return;
      const storage=createIndexedDbGameStorage();
      let next;
      if(tutorial)next=practiceSkydeck({seed:54});
      else {
        const saved=await storage.readGame('card-capture');
        const live=await resumeSkydeck(storage);
        if(!saved||!live||live.getOutcome()!==view.outcome)throw new Error('Terminal save changed');
        const result=await storage.readResult(JSON.stringify(['card-capture',saved.sessionId]));
        if(!result||result.outcome!==view.outcome)throw new Error('Terminal result not recorded');
        next=await confirmSkydeckNewGame(storage,crypto.randomUUID(),setup(),{kind:'confirmation-required',existingSessionId:saved.sessionId},true);
      }
      if(!next||!mounted.current)return;
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
      if(animate&&root&&after.outcome==='in-progress'){
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
      if(command.type==='capture-a'||command.type==='capture-b'||command.type==='capture-c')setNotice(command.type);
      else if(command.type==='advance-enemy')setNotice('round');

      if(animate&&root&&after.outcome==='in-progress'){
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
  useEffect(()=>{if(!paused&&view)onManualPage?.(view.phase==='capture'?(kind==='capture-a'?'a':kind==='capture-b'?'b':'c'):view.phase==='finished'?'ending':view.phase);},[view,kind,paused,onManualPage]);
  const automatic=automaticSkydeckAction(view,tutorial);
  const autoConfirm=useRef(confirm);autoConfirm.current=confirm;
  useEffect(()=>{
    if(paused||!automatic||busy||blocked||error||storageError||menu||restart||abandon)return;
    const motion=motionAllowed(document.documentElement.dataset.motion==='on'?'on':document.documentElement.dataset.motion==='off'?'off':'system',window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const timer=window.setTimeout(()=>{void autoConfirm.current(automatic);},motion?(notice.startsWith('capture-')?950:570):notice.startsWith('capture-')?900:30);
    return()=>window.clearTimeout(timer);
  },[view,busy,blocked,error,storageError,menu,restart,abandon,tutorial,notice,paused]);
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
  const feedback=kind==='capture-a'&&!attack?skydeckAttackFeedback(view,selected,target,copy):undefined;
  const compatible=hintsEnabled?skydeckCompatibleTargets(view,kind,selected):[];
  const dragStart=(event:ReactPointerEvent<HTMLButtonElement>,id:string)=>{
    if(busy||automatic||restart||abandon||event.button!==0)return;
    suppressClick.current=false;drag.current={id,x:event.clientX,y:event.clientY,active:false,pointer:event.pointerId};
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const dragMove=(event:ReactPointerEvent<HTMLButtonElement>)=>{
    const d=drag.current;if(!d||d.pointer!==event.pointerId)return;
    if(Math.hypot(event.clientX-d.x,event.clientY-d.y)>9)d.active=true;
    if(d.active){const hit=document.elementFromPoint(event.clientX,event.clientY)?.closest<HTMLElement>('[data-position]');setDragPosition(hit?Number(hit.dataset.position):null);}
  };
  const dragEnd=(event:ReactPointerEvent<HTMLButtonElement>,cancel=false)=>{
    const d=drag.current;drag.current=null;setDragPosition(null);
    if(!d?.active)return;
    suppressClick.current=true;
    if(cancel||busy||automatic||restart||abandon)return;
    const hit=document.elementFromPoint(event.clientX,event.clientY);
    const enemy=hit?.closest<HTMLElement>('[data-position]');
    if(view?.phase==='capture'&&enemy?.dataset.cardId&&(kind!=='capture-b'||enemy.dataset.position==='1')){
      setSelected(old=>kind==='capture-b'?[d.id]:old.includes(d.id)?old:[...old,d.id]);setTarget(Number(enemy.dataset.position));setCopy(null);playSkydeckSound('select');
    }else if(view?.phase==='discard'&&hit?.closest('[data-sd-discard]')){
      setSelected(old=>old.includes(d.id)?old:[...old,d.id]);playSkydeckSound('select');
    }
  };

  const cardName=(id:string)=>describeSkydeckCard(id,language).name;
  const actionName=(a:SkydeckAction)=>{
    switch(a.type){
      case 'advance-enemy':return tr('Déployer les ennemis','Deploy enemies');
      case 'discard-none':return tr('Maintenir la formation','Maintain formation');
      case 'discard':return tr('Rappeler','Recall')+' '+a.cardIds.length+' '+(a.cardIds.length===1?tr('unité','unit'):tr('unités','units'));
      case 'draw':return tr('Déployer les renforts','Deploy reinforcements');
      case 'capture-a':return tr('A · Capturer','A · Capture');
      case 'capture-b':return tr('B · Sacrifier','B · Sacrifice');
      case 'capture-c':return tr('C · Repousser','C · Push back');
    }
  };
  const renderCard=(id:string)=>{
    const c=describeSkydeckCard(id,language);
    const art=skydeckCardArt(id);
    return <span className="sd-face">
      {art?<><img className="sd-illustration" src={import.meta.env.BASE_URL+art.image} alt="" draggable={false}/><img className="sd-frame" src={import.meta.env.BASE_URL+art.frame} alt="" draggable={false}/></>:null}
      <span className={"sd-power"+(c.power.length>1?" sd-power-double":"")+(c.power==="★"?" sd-power-joker":"")}>{c.power}</span><small>{c.faction}</small>
    </span>;
  };
  const phaseLabels={enemy:tr('Déploiement','Deployment'),discard:tr('Réorganisation','Reorganization'),draw:tr('Renforts','Reinforcements'),capture:tr('Combat','Combat'),finished:tr('Terminée','Finished')};
  const consoleTitles={enemy:tr('Vigie','Lookout'),discard:tr('Conseil tactique','Tactical council'),draw:tr('Mobilisation','Mobilization'),capture:tr('Commandement','Command'),finished:tr('Rapport','Report')};
  const menuHost=typeof document==='undefined'?null:document.getElementById('sd-header-options');
  const headerMenu=menuHost&&view?.outcome==='in-progress'?createPortal(<div className="sd-header-menu" ref={menuRef}>
    <button ref={menuButtonRef} className="sd-menu-toggle" type="button" aria-label={tr('Options de partie','Game options')} aria-expanded={menu} aria-controls={menu?'sd-game-options':undefined} disabled={busy||restart||abandon} onClick={()=>{playSkydeckSound(menu?'close':'open');setMenu(v=>!v);}}><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 6h14M5 12h14M5 18h14"/></svg></button>
    {menu?<div id="sd-game-options" className="sd-game-options" role="group" aria-label={tr('Options de partie','Game options')}>
      <button type="button" disabled={busy} onClick={()=>{setMenu(false);void requestRestart();}}><img src={ui('buttons','gold')} alt=""/><span>{tr('Nouvelle partie','New game')}</span></button>
      {!tutorial?<button type="button" disabled={busy} onClick={()=>{setMenu(false);playSkydeckSound('open');setAbandon(true);}}><img src={ui('buttons','red')} alt=""/><span>{tr('Abandonner','Abandon')}</span></button>:null}
    </div>:null}
  </div>,menuHost):null;
  if(view&&view.outcome!=='in-progress')return <SkydeckEnding view={view} language={language} tutorial={tutorial} busy={busy} storageError={storageError} onReplay={()=>void replayFinished()}/>;
  return <section ref={boardRef} className={"sd-board"+(view?.outcome==="in-progress"?" sd-live":"")} style={{'--sd-phase-panel': 'url("'+import.meta.env.BASE_URL+'art/frames/skydeck/phase-panel.webp")','--sd-counter': 'url("'+import.meta.env.BASE_URL+'art/hud/skydeck/counter-blank.webp")','--sd-section': 'url("'+import.meta.env.BASE_URL+'art/banners/skydeck/section-heading.webp")','--sd-enemy-slot': 'url("'+import.meta.env.BASE_URL+'art/frames/skydeck/enemy-slot.webp")','--sd-hand-slot': 'url("'+import.meta.env.BASE_URL+'art/frames/skydeck/hand-slot.webp")','--sd-wood': 'url("'+import.meta.env.BASE_URL+'art/boards/skydeck/wood-deck.webp")','--sd-dark': 'url("'+import.meta.env.BASE_URL+'art/buttons/skydeck/dark.webp")','--sd-gold': 'url("'+import.meta.env.BASE_URL+'art/buttons/skydeck/gold.webp")','--sd-neutral': 'url("'+import.meta.env.BASE_URL+'art/buttons/skydeck/neutral.webp")','--sd-victory': 'url("'+import.meta.env.BASE_URL+'art/boards/skydeck/victory-portrait.webp")','--sd-defeat': 'url("'+import.meta.env.BASE_URL+'art/boards/skydeck/defeat-portrait.webp")'} as CSSProperties} data-i18n-ignore aria-busy={busy} aria-label={tr('Plateau Skydeck','Skydeck board')}>
    {headerMenu}
    {tutorial?<p className="sd-training">{tr("Entraînement sans sauvegarde ni statistiques.","Training without saves or statistics.")}</p>:null}
    {resumed?<p className="sd-resumed" aria-live="polite">{tr('✓ Partie reprise','✓ Game resumed')}</p>:null}
    {storageError?<p role="alert">{blocked?tr('Sauvegarde incompatible ou inaccessible. Elle est conservée.','Incompatible or inaccessible save. It is preserved.'):tr('Action non enregistrée. La sauvegarde précédente est conservée.','Action not saved. Previous save preserved.')}</p>:null}
    {!view?<>{busy?<p role="status">{tr("Préparation de la flotte…","Preparing the fleet…")}</p>:!blocked?<button type="button" className="primary-action" onClick={()=>void start()}>{tr("Réessayer","Retry")}</button>:null}</>:<>
      {notice?<div className="sd-feedback" role="status">{notice==='capture-a'?tr('Navire ennemi capturé !','Enemy ship captured!'):notice==='capture-b'?tr('Capture ennemie','Enemy capture'):notice==='capture-c'?tr('L’ennemi bat en retraite !','The enemy retreats!'):tr('Nouvelle manche','New round')}</div>:null}
      <p className="sd-round" role="status" aria-live="polite">{tr('Manche','Round')} {view.round}</p>
      <div className="sd-phases" aria-label={tr('Phases','Phases')} aria-live="polite">{(['enemy','discard','draw','capture'] as const).map(p=><span key={p} aria-current={view.phase===p?'step':undefined}><img className="sd-phase-art" src={ui('buttons',view.phase===p?'gold':'dark')} alt=""/><img className="sd-phase-icon" src={ui('icons',phaseIcons[p])} alt=""/><span className="sd-phase-label">{phaseLabels[p]}</span></span>)}</div>
      <div className="sd-counts">{[[tr('Renforts','Reinforcements'),view.counts.playerDeck,'draw'],[tr('Ennemis','Enemy deck'),view.counts.enemyDeck,'enemy'],[tr('Réserves','Reserves'),view.counts.discard,'discard'],[tr('Captures ennemies','Enemy captures'),view.counts.enemyCapture,'capture']].map(([label,n,icon])=><span key={label} className="sd-counter" data-sd-discard={icon==='discard'?true:undefined}><img className="sd-counter-art" src={ui("hud","counter-blank")} alt=""/><img src={ui('icons',String(icon))} alt=""/><strong>{n}</strong><small>{label}</small></span>)}</div>
      <div className="sd-fleets"><section className="sd-fleet sd-enemy-fleet"><h3><img className="sd-heading-art" src={ui('banners','section-heading')} alt=""/><span>{tr('Flotte ennemie','Enemy fleet')}</span></h3>
      <div className="sd-line">{positions.map(position=>{
        const id=view.enemyLine[position-1];
        const forcedTarget=view.phase==='capture'&&kind==='capture-b'&&position===1&&!!id;
        const active=view.phase==='capture'&&(kind==='capture-b'?forcedTarget:target===position);
        return <button type="button" key={position} className={'sd-card'+(!id?' sd-empty sd-enemy-slot':'')+(forcedTarget?' sd-forced-target':'')+(compatible.includes(position)?' sd-compatible':'')+(dragPosition===position?' sd-drag-target':'')} data-position={position} data-card-id={id??undefined} disabled={!id||view.phase!=='capture'||kind==='capture-b'||restart||abandon||busy} aria-pressed={active&&!!id} aria-label={tr('Position','Position')+' '+position+ ' · '+(id?cardName(id):tr('Vide','Empty'))+(forcedTarget?tr(' · Cible imposée',' · Required target'):'')} onClick={()=>{playSkydeckSound('select');setTarget(position);setCopy(null);}}>
          {id?renderCard(id):<><img className="sd-slot-art" src={ui('frames','enemy-slot')} alt=""/><img className="sd-slot-emblem" src={ui("icons","compass")} alt=""/></>}
        </button>;
      })}</div>
      </section><section className="sd-fleet sd-player-fleet"><h3><img className="sd-heading-art" src={ui('banners','section-heading')} alt=""/><span>{tr('Votre flotte','Your fleet')}</span></h3>
      <div className="sd-line sd-hand">{view.hand.map(id=><button type="button" key={id} data-card-id={id} className={"sd-card"+(view.phase==='discard'&&selected.includes(id)?" sd-recall-selected":"")+(effectiveCopy===id?" sd-copy-source":"")+(copyChoices.length>1&&copyChoices.includes(id)?" sd-copy-choice":"")} aria-label={cardName(id)+(effectiveCopy===id?tr(" · Copié par le corsaire libre"," · Copied by free corsair"):"")} aria-pressed={selected.includes(id)} disabled={!['discard','capture'].includes(view.phase)||restart||abandon||busy} onPointerDown={event=>dragStart(event,id)} onPointerMove={dragMove} onPointerUp={event=>dragEnd(event)} onPointerCancel={event=>dragEnd(event,true)} onClick={()=>{if(suppressClick.current){suppressClick.current=false;return;}playSkydeckSound('select');setSelected(old=>old.includes(id)?old.filter(x=>x!==id):kind==='capture-b'&&view.phase==='capture'?[id]:[...old,id]);setCopy(null);}}>{renderCard(id)}</button>)}{Array.from({length:Math.max(0,4-view.hand.length)},(_,i)=><span key={'empty-'+i} className="sd-card sd-empty sd-hand-slot" aria-hidden="true"><img className="sd-slot-art" src={ui("frames","hand-slot")} alt=""/><img className="sd-slot-emblem" src={ui("icons","compass")} alt=""/></span>)}</div>
      </section></div><section className="sd-console" data-phase={view.phase}><h3 ref={heading} tabIndex={-1}>{consoleTitles[view.phase]}</h3>
      {view.phase==='capture'?<div className="sd-actions">{(['capture-a','capture-b','capture-c'] as const).map(k=><button key={k} type="button" className="secondary-action" aria-pressed={kind===k} disabled={restart||abandon||busy||!view.actions.some(a=>a.type===k)} onClick={()=>{playSkydeckSound('button');setKind(k);setSelected([]);setTarget(null);setCopy(null);}}><img className="sd-action-art" src={ui('buttons',k==='capture-a'?'green':k==='capture-b'?'red':'blue')} alt=""/><img className="sd-action-icon" src={ui('icons',k==='capture-a'?'capture':k==='capture-b'?'sacrifice':'repel')} alt=""/><span>{k==='capture-a'?tr('A · Capturer','A · Capture'):k==='capture-b'?tr('B · Sacrifier','B · Sacrifice'):tr('C · Repousser','C · Push back')}</span></button>)}</div>:null}
      {hintsEnabled&&view.phase==='discard'&&!automatic?<p className="sd-hint sd-recall-hint" aria-live="polite">{selected.length?tr('Les unités rappelées rejoindront vos réserves et pourront revenir en renfort.','Recalled units join your reserves and may return as reinforcements.'):tr('Amiral, sélectionnez les unités à rappeler ou maintenez votre formation.','Admiral, select units to recall or maintain your formation.')}</p>:null}
      {hintsEnabled&&view.phase==='capture'&&!attack?<p className="sd-hint" aria-live="polite">{kind==='capture-a'?(target===null?tr('Amiral, désignez votre cible.','Admiral, designate your target.'):selected.length===0?tr('Engagez vos unités de la même faction que la cible.','Engage units of the target’s faction.'):copyChoices.length>1&&!effectiveCopy?tr('Choisissez l’unité à imiter.','Choose the unit to copy.'):feedback?.reason==='faction'?tr('Factions incompatibles : coordonnez des unités de la faction ciblée.','Incompatible factions: engage units of the target’s faction.'):feedback?.reason==='joker'?tr('Engagez une unité que votre corsaire libre pourra imiter.','Engage a unit your free corsair can copy.'):feedback?.reason==='power'?tr('Attaque','Attack')+' '+feedback.total+' / '+feedback.enemy+' · '+tr('Puissance manquante : ','Missing power: ')+(feedback.enemy!-feedback.total!):tr('Ajustez les unités engagées.','Adjust the selected units.')):kind==='capture-b'?(selected.length===0?tr('Sacrifiez un navire face à la cible imposée.','Select a ship to sacrifice against the required target.'):(selected.some(skydeckProtected)||(view.enemyLine[0]&&skydeckProtected(view.enemyLine[0]))?tr('Attention : cette action entraîne la défaite.','Warning: this action causes defeat.'):tr('Les deux navires seront définitivement perdus.','Both ships will be permanently lost.'))):target===null?tr('Choisissez le navire à repousser.','Choose the ship to push back.'):selected.length<2?tr('Engagez deux unités à sacrifier.','Select two units to sacrifice.'):(selected.some(skydeckProtected)?tr('Attention : cette action entraîne la défaite.','Warning: this action causes defeat.'):tr('Deux unités perdues ; ennemi renvoyé sous sa pioche.','Two units lost; enemy returned to the bottom of its deck.'))}</p>:null}
      {copyChoices.length>1?<div className="sd-copy-picker" role="group" aria-label={tr('Unité imitée par le corsaire libre','Unit copied by free corsair')}><span>{tr('Unité à imiter :','Unit to copy:')}</span>{copyChoices.map(id=><button key={id} type="button" aria-pressed={effectiveCopy===id} disabled={busy||restart||abandon} onClick={()=>{playSkydeckSound('joker');setCopy(id);}}>{describeSkydeckCard(id,language).power} {describeSkydeckCard(id,language).symbol}</button>)}</div>:null}
      {hintsEnabled&&attack?<div className="sd-tactical" aria-live="polite"><span className="sd-tactical-player">{tr('Attaque','Attack')} <strong>{attack.values.length>1?attack.values.join(' + ')+' = ':''}{attack.total}</strong></span><img src={ui('icons','capture')} alt=""/><span className="sd-tactical-enemy">{tr('Ennemi','Enemy')} <strong>{attack.enemy}</strong></span><span className="sd-tactical-result">{tr('✓ Cible à portée','✓ Target within reach')}</span></div>:null}
      {view.blockedReason?<p role="alert">{tr('Renforts et réserves insuffisants. La bataille est suspendue sans défaite enregistrée.','Insufficient reinforcements and reserves. The battle is suspended without a recorded defeat.')}</p>:null}
      {!view.blockedReason?<button type="button" className="primary-action sd-preview" disabled={!chosen||restart||abandon||busy||blocked||!!automatic&&!error&&!storageError} onClick={()=>{if(chosen)void confirm(chosen);}}><img className="sd-button-art" src={ui('buttons',chosen&&!busy&&!restart&&!abandon&&!blocked?'gold':'neutral')} alt=""/><span>{automatic&&!error&&!storageError?(view.phase==='enemy'?tr('Les forces ennemies prennent position…','Enemy forces are taking position…'):view.phase==='draw'?tr('Vos renforts arrivent…','Your reinforcements are arriving…'):tr('Préparation de la flotte…','Preparing fleet…')):chosen?actionName(chosen):view.phase==='capture'?tr('Préparer l’attaque','Prepare attack'):phaseLabels[view.phase]}</span></button>:null}
      {error?<p role="alert">{tr('Action refusée. L’état précédent est conservé.','Action rejected. Previous state preserved.')}</p>:null}
      {abandon?<div className="sd-confirm"><p>{tr('Abandonner définitivement cette partie ?','Abandon this game permanently?')}</p><button ref={confirmRef} className="primary-action" disabled={busy} onClick={()=>void confirm({type:'abandon'})}><img className="sd-dialog-art" src={ui('buttons','gold')} alt=""/><span>{tr('Confirmer','Confirm')}</span></button><button className="secondary-action" disabled={busy} onClick={()=>{playSkydeckSound('close');setAbandon(false);}}><img className="sd-dialog-art" src={ui('buttons','dark')} alt=""/><span>{tr('Annuler','Cancel')}</span></button></div>:null}

      {restart?<div className="sd-confirm"><p>{tr('Remplacer cette partie ? La partie actuelle sera abandonnée.','Replace this game? The current game will be abandoned.')}</p><button ref={confirmRef} className="primary-action" disabled={busy} onClick={()=>void replace()}><img className="sd-dialog-art" src={ui('buttons','gold')} alt=""/><span>{tr('Confirmer','Confirm')}</span></button><button className="secondary-action" disabled={busy} onClick={()=>{playSkydeckSound('close');setRestart(false);}}><img className="sd-dialog-art" src={ui('buttons','dark')} alt=""/><span>{tr('Annuler','Cancel')}</span></button></div>:null}
    </section></>}
  </section>;
}
