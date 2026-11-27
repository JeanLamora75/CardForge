import { visibleMidnightNarrative } from "../application/midnight-narratives.ts";
import { visibleMidnightArt } from "../application/midnight-card-art.ts";
import type { Locale } from "../i18n/language.ts";
import "./../midnight-syndicate.css";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent } from "react";
import { createIndexedDbGameStorage } from "../adapters/indexeddb-game-storage.ts";
import type { PersistentGameSession } from "../application/persistent-game-session.ts";
import type { NewGameChoice } from "../application/new-game-choice.ts";
import { makeMidnightSyndicateSummary } from "../application/game-results.ts";
import { inspectMidnightSyndicate, type MidnightSyndicateState, type MidnightSyndicateAction, type PublicLoopCard } from "../games/loot-the-loop/engine.ts";
import { startMidnightSyndicate, resumeMidnightSyndicate, getMidnightSyndicateNewGameChoice, confirmMidnightSyndicateNewGame, practiceMidnightSyndicate } from "../games/loot-the-loop/persistence.ts";
import { GameStatisticsPanel } from "./GameResultPanel";
import type { GameStatistics } from "../ports/local-storage.ts";
import { midnightEnding } from "../application/midnight-ending.ts";
type Session = Pick<PersistentGameSession<MidnightSyndicateState, MidnightSyndicateAction>, 'getState' | 'dispatch'>;
const setup = () => ({seed:crypto.getRandomValues(new Uint32Array(1))[0]});
const art=(category:string,name:string)=>import.meta.env.BASE_URL+"art/"+category+"/midnight-syndicate/"+name+".webp";
function cardLabel(card:PublicLoopCard,language:Locale="fr") {
  const item=visibleMidnightArt(card);
  return item ? item[language] : language==="en"?"Hidden card":"Carte cachée";
}
function Card({card,language,compact=false,onInspect,onPointerDown,onTransfer,transferLabel}:{card:PublicLoopCard;language:Locale;compact?:boolean;onInspect?:(card:PublicLoopCard)=>void;onPointerDown?:(event:ReactPointerEvent<HTMLElement>)=>void;onTransfer?:()=>void;transferLabel?:string}) {
  const item=visibleMidnightArt(card);
  const Tag=item&&onInspect?"button":"div";
  return <Tag className={"ms-card "+(item?"ms-visible":"ms-hidden")+(compact?" ms-mini":"")+(onPointerDown?" ms-draggable":"")} onPointerDown={onPointerDown} aria-keyshortcuts={onTransfer?"Shift+Enter":undefined} title={transferLabel} onKeyDown={event=>{if(onTransfer&&event.shiftKey&&event.key==="Enter"){event.preventDefault();event.stopPropagation();if(!event.repeat)onTransfer();}}} aria-label={transferLabel?cardLabel(card,language)+" · "+transferLabel:cardLabel(card,language)} data-i18n-ignore {...(item&&onInspect?{type:"button" as const,onClick:()=>onInspect(card)}:{})}>
    <img className="ms-card-frame" src={art("cards",item?"front-"+item.frame:"back")} alt="" draggable={false}/>
    {onTransfer?<span className="ms-transfer-indicator" aria-hidden="true">↕</span>:null}
    {item?<><strong className="ms-card-value">{item.value}</strong><img className="ms-card-art" src={art("cards",item.file)} alt="" draggable={false}/><span className="ms-card-name">{item[language]}</span></>:null}
  </Tag>;
}
export default function MidnightSyndicateBoard({tutorial=false,hintsEnabled=true,onReplayTutorial,language="fr"}:{tutorial?:boolean;hintsEnabled?:boolean;onReplayTutorial?:()=>void;language?:Locale}) {
  const session = useRef<Session|null>(null);
  const lock = useRef(false);
  const [state,setState] = useState<Readonly<MidnightSyndicateState>|null>(null);
  const [busy,setBusy] = useState(true);
  const [blocked,setBlocked] = useState(false);
  const [notice,setNotice] = useState("");
  const [error,setError] = useState("");
  const [preview,setPreview]=useState<number|null>(null);
  const gesture=useRef<{pointer:number;card:PublicLoopCard;action:MidnightSyndicateAction;x:number;y:number;width:number;height:number;left:number;top:number;active:boolean}|null>(null);
  const [drag,setDrag]=useState<{card:PublicLoopCard;action:MidnightSyndicateAction;x:number;y:number;width:number;height:number;returning?:boolean;valid?:boolean}|null>(null);
  const suppressClick=useRef(false);
  const clickReset=useRef<ReturnType<typeof setTimeout>|null>(null);
  const lastActionAt=useRef(-Infinity);
  const returnTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>()=>{if(returnTimer.current)clearTimeout(returnTimer.current);if(clickReset.current)clearTimeout(clickReset.current);},[]);
  const [replacement,setReplacement] = useState<NewGameChoice|null>(null);
  const confirmation = useRef<HTMLButtonElement>(null);
  const actionsHeading = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);
  const [movement,setMovement]=useState(0);
  const routeRef=useRef<HTMLElement>(null);
  useEffect(()=>{if(movement&&routeRef.current)routeRef.current.scrollTop=0;},[movement]);
  const [inspection,setInspection]=useState<"route"|"loot"|"menu"|"stats"|null>(null);
  const [detailCard,setDetailCard]=useState<PublicLoopCard|null>(null);
  const cardDialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{const d=cardDialog.current;if(detailCard&&d&&!d.open)d.showModal();else if(!detailCard&&d?.open)d.close();},[detailCard]);
  function inspectCard(card:PublicLoopCard){if(card.faceUp)setDetailCard(card);}
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{const d=dialog.current;if(inspection&&d&&!d.open)d.showModal();else if(!inspection&&d?.open)d.close();},[inspection]);
  useEffect(()=>{
    let cancelled=false;
    mounted.current=true;
    void (async()=>{
      try {
        const existing=tutorial ? practiceMidnightSyndicate({seed:54}) : await resumeMidnightSyndicate(createIndexedDbGameStorage());
        if(cancelled)return;
        session.current=existing??null;
        setState(existing?.getState()??null);
        setNotice(tutorial?"Entraînement sans sauvegarde":existing?"Partie reprise · sauvegarde locale":"");
      } catch {
        if(!cancelled){setBlocked(true);setError("Sauvegarde incompatible ou inaccessible. Elle est conservée.");}
      } finally {if(!cancelled)setBusy(false);}
    })();
    return ()=>{cancelled=true;mounted.current=false;};
  },[tutorial]);
  useEffect(()=>{if(replacement)confirmation.current?.focus();},[replacement]);
  async function run(work:()=>Promise<void>) {
    if(lock.current||busy||blocked)return;
    lock.current=true;setBusy(true);setError("");
    try{await work();}
    catch{if(mounted.current)setError(tutorial?"Action d’entraînement impossible.":"Action non enregistrée. La sauvegarde précédente est conservée. Rechargez si nécessaire.");}
    finally{lock.current=false;if(mounted.current)setBusy(false);}
  }
  function adopt(next:Session) {
    session.current=next;
    if(mounted.current){setState(next.getState());setPreview(null);setReplacement(null);setNotice("Partie enregistrée");}
  }
  async function start() {
    await run(async()=>adopt(await startMidnightSyndicate(createIndexedDbGameStorage(),crypto.randomUUID(),setup())));
  }
  async function chooseReplacement() {
    await run(async()=>{
      const choice=await getMidnightSyndicateNewGameChoice(createIndexedDbGameStorage());
      if(mounted.current){setPreview(null);setReplacement(choice);}
    });
  }
  async function replace() {
    if(!replacement)return;
    await run(async()=>{
      const next=await confirmMidnightSyndicateNewGame(createIndexedDbGameStorage(),crypto.randomUUID(),setup(),replacement,true);
      if(next)adopt(next);
    });
  }
  async function apply(command:MidnightSyndicateAction) {
    if(!session.current||lock.current||busy||blocked||replacement||performance.now()-lastActionAt.current<300)return;
    const legal=inspectMidnightSyndicate(session.current.getState()).actions;
    if(!legal.some(a=>JSON.stringify(a)===JSON.stringify(command)))return;
    lastActionAt.current=performance.now();
    await run(async()=>{
      const result=await session.current!.dispatch(command);
      if(!mounted.current)return;
      setPreview(null);
      if(!result.accepted){setError("Action refusée : ce coup n’est plus autorisé.");return;}
      setState(session.current!.getState());
      setMovement(n=>n+1);
      setNotice(tutorial?"Action d’entraînement":"Action enregistrée");
      actionsHeading.current?.focus();
    });
  }
  const view=state?inspectMidnightSyndicate(state):null;
  const summary=state?makeMidnightSyndicateSummary(state):null;
  const tr=(fr:string,en:string)=>language==="en"?en:fr;
  const ending=summary&&state?midnightEnding(summary.outcome,state.lossCause??null,language):null;
  const scene=ending?(summary?.outcome==="win"?"victory":ending.file??"dead-end"):null;
  const [statistics,setStatistics]=useState<GameStatistics|null>(null);
  const [statsError,setStatsError]=useState(false);
  useEffect(()=>{if(inspection!=="stats"||tutorial)return;let live=true;setStatsError(false);void createIndexedDbGameStorage().readStatistics("loot-the-loop").then(s=>{if(live)setStatistics(s??null);}).catch(()=>{if(live)setStatsError(true);});return()=>{live=false;};},[inspection,tutorial]);
  const destination=preview!==null&&view?.deck.length?preview%view.deck.length:-1;
  const canMark=!busy&&!blocked&&!replacement&&!!view?.actions.some(a=>a.type==="mark-path");
  useEffect(()=>{if(destination>=0){const target=routeRef.current?.querySelector(".ms-destination");if(target&&routeRef.current){const route=routeRef.current;const a=target.getBoundingClientRect(),z=route.getBoundingClientRect();if(a.bottom>z.bottom||a.top<z.top)route.scrollTop+=a.top-z.top;}}},[destination]);
  const explorationActions=view?.actions.filter(a=>a.type==="look-around"||a.type==="explore")??[];
  const markLabel=tr("Marquer le chemin (Maj+Entrée)","Mark path (Shift+Enter)");
  const returnLabel=tr("Restituer la note (Maj+Entrée)","Return note (Shift+Enter)");
  const canReturn=(i:number)=>!busy&&!blocked&&!replacement&&!!view?.actions.some(a=>a.type==="return-to-path"&&a.noteIndex===i);
  function beginDrag(event:ReactPointerEvent<HTMLElement>,card:PublicLoopCard,action:MidnightSyndicateAction){
    if(!event.isPrimary||event.button!==0||gesture.current||drag||lock.current||!card.faceUp)return;
    suppressClick.current=false;
    const rect=event.currentTarget.getBoundingClientRect();
    gesture.current={pointer:event.pointerId,card,action,x:event.clientX,y:event.clientY,width:rect.width,height:rect.height,left:rect.left,top:rect.top,active:false};
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function validDrop(action:MidnightSyndicateAction,x:number,y:number){
    const target=document.elementFromPoint(x,y);
    return action.type==="mark-path"?!!target?.closest(".ms-notes .ms-empty"):action.type==="return-to-path"&&!!target?.closest(".ms-exploration");
  }
  function moveDrag(event:ReactPointerEvent<HTMLElement>){
    const current=gesture.current;if(!current||current.pointer!==event.pointerId)return;
    if(!current.active&&Math.hypot(event.clientX-current.x,event.clientY-current.y)<8)return;
    current.active=true;suppressClick.current=true;
    setDrag({card:current.card,action:current.action,width:current.width,height:current.height,x:event.clientX-current.width/2,y:event.clientY-current.height/2,valid:validDrop(current.action,event.clientX,event.clientY)});
  }
  function endDrag(event:ReactPointerEvent<HTMLElement>,cancel=false){
    const current=gesture.current;if(!current||current.pointer!==event.pointerId)return;
    gesture.current=null;
    if(clickReset.current)clearTimeout(clickReset.current);
    clickReset.current=setTimeout(()=>{suppressClick.current=false;},0);
    if(!current.active){setDrag(null);return;}
    if(!cancel&&validDrop(current.action,event.clientX,event.clientY)){setDrag(null);void apply(current.action);}
    else{setDrag({card:current.card,action:current.action,width:current.width,height:current.height,x:current.left,y:current.top,returning:true});returnTimer.current=setTimeout(()=>setDrag(null),180);}
  }
  function preventDragClick(event:ReactMouseEvent<HTMLElement>){
    if(suppressClick.current){suppressClick.current=false;event.preventDefault();event.stopPropagation();}
  }
  return <section className="ms-board ms-immersive" aria-label="Plateau Midnight Syndicate" aria-busy={busy}
    data-phase={summary?"finished":"live"} data-drag={drag&&!drag.returning?drag.action.type:undefined} data-drop-valid={drag?.valid?"true":undefined} onPointerMove={moveDrag} onPointerUp={endDragEvent=>endDrag(endDragEvent)} onPointerCancel={event=>endDrag(event,true)} onLostPointerCapture={event=>endDrag(event,true)} onClickCapture={preventDragClick}>
    {!summary?<picture className="ms-board-picture" aria-hidden="true"><source media="(orientation: landscape)" srcSet={art("boards","landscape")}/><img src={art("boards","portrait")} alt=""/></picture>:null}

    <div className="ms-status" role="status" aria-live="polite">{busy?(tutorial?"Chargement de l’entraînement…":"Chargement ou enregistrement…"):notice}</div>
    {error?<p role="alert" className="ms-error">{error}</p>:null}
    {!state&&!tutorial?<button className="primary-action ms-start" disabled={busy||blocked} onClick={()=>void start()}>Commencer une partie</button>:null}
    {view?<>{!summary?<div className="ms-counters" data-i18n-ignore>
      {[[tr("Preuves","Evidence"),view.loot.filter(c=>c.faceUp&&c.id.endsWith("-1")&&c.id!=="joker-1").length+"/4","aces"],[tr("Butin","Loot"),view.loot.length,"loot"],[tr("Parcours","Route"),view.deck.length,"route"],[tr("Notes","Notes"),view.notes.length+"/3","notes"]].map(([label,value,icon])=><div key={icon} className="ms-counter"><img src={art("hud","counter-"+icon)} alt=""/><span>{label}<b>{value}</b></span></div>)}
    </div>:null}
    {summary&&ending?<div className="ms-ending" data-outcome={summary.outcome} data-scene={scene} data-i18n-ignore>
      <picture className="ms-ending-picture"><source media="(orientation: landscape)" srcSet={art("boards",scene+"-landscape")}/><img className="ms-ending-scene" src={art("boards",scene+"-portrait")} alt=""/></picture>
      <div className="ms-ending-story"><p>{summary.outcome==="win"?tr("MISSION ACCOMPLIE","MISSION ACCOMPLISHED"):tr("MISSION COMPROMISE","MISSION COMPROMISED")}</p>{ending.file?<h2>{ending.title}</h2>:null}<p>{ending.text}</p></div>
      <div className="ms-mission-report"><h3>{tr("Rapport de mission","Mission report")}</h3><div><span>{tr("Preuves","Evidence")}: {view.loot.filter(c=>c.faceUp&&c.id.endsWith("-1")&&c.id!=="joker-1").length}/4</span><span>{tr("Butin","Loot")}: {view.loot.length}</span><span>{tr("Parcours","Route")}: {view.deck.length}</span></div>{summary.outcome==="win"?<p>{tr("Score","Score")}: {summary.score}</p>:null}{tutorial?<p>{tr("Entraînement sans statistiques","Practice without statistics")}</p>:null}</div>
      <nav className="ms-ending-actions"><button type="button" disabled={busy} onClick={()=>tutorial?onReplayTutorial?.():void chooseReplacement()}><img className="ms-button-skin" src={art("buttons","primary")} alt=""/><span>{tr("Rejouer","Play again")}</span></button>{!tutorial?<button type="button" onClick={()=>setInspection("stats")}><img className="ms-button-skin" src={art("buttons","secondary")} alt=""/><span>{tr("Statistiques","Statistics")}</span></button>:null}<a href="#"><img className="ms-button-skin" src={art("buttons","secondary")} alt=""/><span>{tr("Retour au catalogue","Back to catalogue")}</span></a></nav>
    </div>:<div className="ms-live-layout">
      <aside ref={routeRef} className="ms-route" aria-label={tr("Parcours","Route")} tabIndex={0}>
        {view.deck.map(card=><div key={card.position} className={"ms-route-stop"+(card.position===0?" ms-current":"")+(card.position===destination?" ms-destination":"")+(destination>=0&&card.position<destination?" ms-traversed":"")}><img className="ms-route-node" src={art("effects",card.position===0?"route-node-current":card.position===destination?"route-node-destination":"route-node-neutral")} alt=""/><Card card={card} language={language} compact onInspect={inspectCard} onPointerDown={card.position===0&&canMark?event=>beginDrag(event,card,{type:"mark-path"}):undefined} onTransfer={card.position===0&&canMark?()=>void apply({type:"mark-path"}):undefined} transferLabel={card.position===0&&canMark?markLabel:undefined}/><small data-i18n-ignore>{card.position===0?tr("Position actuelle","Current position"):card.position===destination?tr("Destination","Destination"):"#"+(card.position+1)}</small></div>)}
      </aside>
      <section className="ms-exploration">
        <h3 ref={actionsHeading} tabIndex={-1} data-i18n-ignore><img className="ms-heading-skin" src={art("banners","exploration")} alt=""/><span>{tr("Exploration","Exploration")}</span></h3>
        <div className="ms-top ms-decisions" key={movement} data-moved={movement>0}>{view.deck.slice(0,2).map(card=>{
          const item=visibleMidnightArt(card);
          const distance=typeof item?.value==="number"?item.value:null;
          const action=explorationActions.find(a=>a.type==="explore"&&a.distance===distance);
          const kind=item?.frame??"hidden";
          const movable=card.position===0&&canMark;
          const effect=kind==="green"?tr("Revenez ici par exploration.","Return here by exploring."):kind==="burgundy"?tr("Atterrir ici : défaite.","Landing here: defeat."):kind==="neutral"?tr("Arrivez ici avec 4 preuves.","Land here with 4 clues."):kind==="hidden"?tr("À découvrir","Unknown"):tr("Piste","Lead");
          return <article key={card.position} className="ms-decision" data-kind={kind} data-i18n-ignore>
            <p className="ms-decision-position">{card.position===0?tr("Position actuelle","Current position"):tr("Piste suivante","Next lead")}</p>
            {item?<button type="button" className={"ms-decision-identity ms-visible"+(movable?" ms-draggable":"")} aria-label={item[language]+(movable?" · "+markLabel:"")} aria-keyshortcuts={movable?"Shift+Enter":undefined} title={movable?markLabel:undefined} onClick={()=>inspectCard(card)} onPointerDown={movable?event=>beginDrag(event,card,{type:"mark-path"}):undefined} onKeyDown={event=>{if(movable&&event.shiftKey&&event.key==="Enter"){event.preventDefault();event.stopPropagation();if(!event.repeat)void apply({type:"mark-path"});}}}>
              <strong className="ms-decision-medallion">{item.value}</strong>{movable?<span className="ms-transfer-indicator" aria-hidden="true">↕</span>:null}
              <img className="ms-decision-art" src={art("cards",item.file)} alt="" draggable={false}/>
            </button>:<div className="ms-decision-identity ms-hidden" aria-label={tr("Carte cachée","Hidden card")}><strong className="ms-decision-medallion">?</strong><img className="ms-decision-art ms-decision-back" src={art("cards","back")} alt="" draggable={false}/></div>}
            <div className="ms-decision-copy"><strong>{item?item[language]:tr("Lieu inconnu","Unknown location")}</strong>{item?<p className="ms-narrative">{visibleMidnightNarrative(card,language)}</p>:null}</div>
            {action&&distance!==null?<button type="button" className="ms-decision-action" data-action="explore" data-distance={distance} disabled={busy||blocked||!!replacement||!!drag} onPointerEnter={()=>setPreview(distance)} onPointerLeave={()=>setPreview(null)} onFocus={()=>setPreview(distance)} onBlur={()=>setPreview(null)} onClick={()=>void apply(action)}><img className="ms-button-skin" src={art("buttons","primary")} alt=""/>{tr("Avancer +","Advance +")}{distance}</button>:<div className="ms-decision-effect"><strong>{kind==="green"?tr("Preuve repérée","Evidence spotted"):kind==="burgundy"?tr("Danger","Danger"):kind==="neutral"?tr("Exfiltration","Extraction"):null}</strong><span>{effect}</span></div>}
          </article>;
        })}</div>
        {explorationActions.some(a=>a.type==="look-around")?<div className="ms-actions"><button type="button" data-action="look-around" className="secondary-action" disabled={busy||blocked||!!replacement||!!drag} onClick={()=>void apply({type:"look-around"})}><img className="ms-button-skin" src={art("buttons","primary")} alt=""/>{tr("Observer","Observe")}</button></div>:null}
        {!explorationActions.length?<p className="ms-hint" data-i18n-ignore>{tr("Utilisez les notes pour poursuivre.","Use the notes to continue.")}</p>:null}
      </section>
      <section className="ms-controls">
        <h3 data-i18n-ignore><img className="ms-heading-skin" src={art("banners","notes-heading")} alt=""/><span>{tr("Notes d’enquête","Investigation notes")}</span></h3>
        <div className="ms-notes">{Array.from({length:3},(_,i)=>view.notes[i]?<Card key={i} card={view.notes[i]} language={language} onInspect={inspectCard} onPointerDown={canReturn(i)?event=>beginDrag(event,view.notes[i],{type:"return-to-path",noteIndex:i}):undefined} onTransfer={canReturn(i)?()=>void apply({type:"return-to-path",noteIndex:i}):undefined} transferLabel={canReturn(i)?returnLabel:undefined}/>:<div key={i} className="ms-card ms-empty" aria-label={tr("Note libre","Empty note")}><img className="ms-card-frame" src={art("frames","note-slot-empty")} alt=""/></div>)}</div>
      </section>
    </div>}
    {!summary?<nav className="ms-footer" aria-label={tr("Commandes du plateau","Board controls")} data-i18n-ignore>
      <button type="button" onClick={()=>setInspection("route")}><img className="ms-button-skin" src={art("buttons","utility")} alt=""/><img className="ms-action-icon" src={art("icons","route")} alt=""/>{tr("Parcours","Route")} ({view.deck.length})</button>
      <button type="button" onClick={()=>setInspection("loot")}><img className="ms-button-skin" src={art("buttons","utility")} alt=""/><img className="ms-action-icon" src={art("icons","loot")} alt=""/>{tr("Butin","Loot")} ({view.loot.length})</button>
      {!tutorial&&view.outcome==="in-progress"?<button type="button" disabled={busy||!!replacement||!!drag} onClick={()=>setInspection("menu")}><img className="ms-button-skin" src={art("buttons","utility")} alt=""/><img className="ms-action-icon" src={art("icons","menu")} alt=""/>{tr("Menu","Menu")}</button>:null}
    </nav>:null}
    {replacement?<div className="ms-confirm-overlay"><div className="ms-confirm" role="group" aria-label="Confirmation de nouvelle partie">
      <p>{view.outcome==="in-progress"?"Abandonner la partie actuelle et recommencer ?":"Commencer une nouvelle partie ?"}</p>
      <button ref={confirmation} className="primary-action" disabled={busy} onClick={()=>void replace()}>Confirmer</button>
      <button className="secondary-action" disabled={busy} onClick={()=>{setPreview(null);setReplacement(null);actionsHeading.current?.focus();}}>Annuler</button>
    </div></div>:null}
    {drag?<div className={"ms-drag-ghost"+(drag.returning?" ms-drag-return":"")} aria-hidden="true" style={{left:drag.x,top:drag.y,width:drag.width,height:drag.height}}><Card card={drag.card} language={language}/></div>:null}
    <dialog ref={dialog} className="ms-inspect-dialog" onClose={()=>setInspection(null)} onCancel={()=>setInspection(null)} aria-label={inspection==="menu"?tr("Menu du jeu","Game menu"):inspection==="loot"?tr("Butin","Loot"):tr("Parcours","Route")}>
      <button type="button" onClick={()=>setInspection(null)} data-i18n-ignore>{tr("Fermer","Close")}</button>
      {inspection==="stats"?<div><h2>{tr("Statistiques","Statistics")}</h2>{statsError?<p role="alert">{tr("Statistiques indisponibles","Statistics unavailable")}</p>:<GameStatisticsPanel statistics={statistics}/>}</div>:inspection==="menu"?<button type="button" disabled={busy} onClick={()=>{setInspection(null);void chooseReplacement();}}>{tr("Nouvelle partie","New game")}</button>:<div className="ms-inspection">{(inspection==="loot"?view.loot:view.deck).map(card=><Card key={card.position} card={card} language={language} onInspect={inspectCard}/>)}</div>}
    </dialog>
    <dialog ref={cardDialog} className="ms-card-dialog" onClose={()=>setDetailCard(null)} aria-label={detailCard?cardLabel(detailCard,language):tr("Carte","Card")}><button type="button" onClick={()=>setDetailCard(null)} data-i18n-ignore>{tr("Fermer","Close")}</button>{detailCard?<><Card card={detailCard} language={language}/><p className="ms-inspect-narrative" data-i18n-ignore>{visibleMidnightNarrative(detailCard,language)}</p></>:null}</dialog></>:null}
  </section>;
}
