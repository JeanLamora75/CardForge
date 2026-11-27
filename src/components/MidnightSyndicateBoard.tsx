import { visibleMidnightArt } from "../application/midnight-card-art.ts";
import type { Locale } from "../i18n/language.ts";
import "./../midnight-syndicate.css";
import { useEffect, useRef, useState } from "react";
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
function Card({card,language,compact=false,onInspect}:{card:PublicLoopCard;language:Locale;compact?:boolean;onInspect?:(card:PublicLoopCard)=>void}) {
  const item=visibleMidnightArt(card);
  const Tag=item&&onInspect?"button":"div";
  return <Tag className={"ms-card "+(item?"ms-visible":"ms-hidden")+(compact?" ms-mini":"")} aria-label={cardLabel(card,language)} data-i18n-ignore {...(item&&onInspect?{type:"button" as const,onClick:()=>onInspect(card)}:{})}>
    <img className="ms-card-frame" src={art("cards",item?"front-"+item.frame:"back")} alt="" draggable={false}/>
    {item?<><strong className="ms-card-value">{item.value}</strong><img className="ms-card-art" src={art("cards",item.file)} alt="" draggable={false}/><span className="ms-card-name">{item[language]}</span></>:null}
  </Tag>;
}
function actionLabel(action:MidnightSyndicateAction) {
  switch(action.type) {
    case "look-around": return "Observer";
    case "explore": return "Explorer · "+action.distance+" cartes";
    case "mark-path": return "Marquer le chemin";
    case "return-to-path": return "Restituer la note "+(action.noteIndex+1);
  }
}
export default function MidnightSyndicateBoard({tutorial=false,hintsEnabled=true,onReplayTutorial,language="fr"}:{tutorial?:boolean;hintsEnabled?:boolean;onReplayTutorial?:()=>void;language?:Locale}) {
  const session = useRef<Session|null>(null);
  const lock = useRef(false);
  const [state,setState] = useState<Readonly<MidnightSyndicateState>|null>(null);
  const [busy,setBusy] = useState(true);
  const [blocked,setBlocked] = useState(false);
  const [notice,setNotice] = useState("");
  const [error,setError] = useState("");
  const [selected,setSelected] = useState<MidnightSyndicateAction|null>(null);
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
  useEffect(()=>{if(selected||replacement)confirmation.current?.focus();},[selected,replacement]);
  async function run(work:()=>Promise<void>) {
    if(lock.current||busy||blocked)return;
    lock.current=true;setBusy(true);setError("");
    try{await work();}
    catch{if(mounted.current)setError(tutorial?"Action d’entraînement impossible.":"Action non enregistrée. La sauvegarde précédente est conservée. Rechargez si nécessaire.");}
    finally{lock.current=false;if(mounted.current)setBusy(false);}
  }
  function adopt(next:Session) {
    session.current=next;
    if(mounted.current){setState(next.getState());setSelected(null);setReplacement(null);setNotice("Partie enregistrée");}
  }
  async function start() {
    await run(async()=>adopt(await startMidnightSyndicate(createIndexedDbGameStorage(),crypto.randomUUID(),setup())));
  }
  async function chooseReplacement() {
    await run(async()=>{
      const choice=await getMidnightSyndicateNewGameChoice(createIndexedDbGameStorage());
      if(mounted.current){setSelected(null);setReplacement(choice);}
    });
  }
  async function replace() {
    if(!replacement)return;
    await run(async()=>{
      const next=await confirmMidnightSyndicateNewGame(createIndexedDbGameStorage(),crypto.randomUUID(),setup(),replacement,true);
      if(next)adopt(next);
    });
  }
  async function apply() {
    if(!selected||!session.current)return;
    const command=selected;
    await run(async()=>{
      const result=await session.current!.dispatch(command);
      if(!mounted.current)return;
      setSelected(null);
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
  const destination=selected?.type==="explore"&&view?.deck.length?selected.distance%view.deck.length:-1;
  return <section className="ms-board ms-immersive" aria-label="Plateau Midnight Syndicate" aria-busy={busy}
    data-phase={summary?"finished":"live"}>
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
        {view.deck.map(card=><div key={card.position} className={"ms-route-stop"+(card.position===0?" ms-current":"")+(card.position===destination?" ms-destination":"")}><img className="ms-route-node" src={art("effects",card.position===0?"route-node-current":card.position===destination?"route-node-destination":"route-node-neutral")} alt=""/><Card card={card} language={language} compact onInspect={inspectCard}/><small data-i18n-ignore>{card.position===0?tr("Position actuelle","Current position"):card.position===destination?tr("Destination","Destination"):"#"+(card.position+1)}</small></div>)}
      </aside>
      <section className="ms-exploration">
        <h3 data-i18n-ignore><img className="ms-heading-skin" src={art("banners","exploration")} alt=""/><span>{tr("Exploration","Exploration")}</span></h3>
        <div className="ms-top" key={movement} data-moved={movement>0}>{view.deck.slice(0,2).map(card=><Card key={card.position} card={card} language={language} onInspect={inspectCard}/>)}</div>
        {hintsEnabled?<p className="ms-hint" data-i18n-ignore>{view.actions.some(a=>a.type==="look-around")?tr("Observez les deux premières cartes.","Observe the first two cards."):tr("Choisissez une action autorisée.","Choose an available action.")}</p>:null}
      </section>
      <section className="ms-controls">
        <h3 data-i18n-ignore><img className="ms-heading-skin" src={art("banners","notes-heading")} alt=""/><span>{tr("Notes d’enquête","Investigation notes")}</span></h3>
        <div className="ms-notes">{Array.from({length:3},(_,i)=>view.notes[i]?<Card key={i} card={view.notes[i]} language={language} onInspect={inspectCard}/>:<div key={i} className="ms-card ms-empty" aria-label={tr("Note libre","Empty note")}><img className="ms-card-frame" src={art("frames","note-slot-empty")} alt=""/></div>)}</div>
        <h3 ref={actionsHeading} tabIndex={-1}><img className="ms-heading-skin" src={art("banners","movement")} alt=""/><span>Actions autorisées</span></h3>
        <div className="ms-actions">{view.actions.map(action=><button type="button" className="secondary-action"
          key={actionLabel(action)} disabled={busy||!!replacement||!!selected}
          aria-pressed={JSON.stringify(selected)===JSON.stringify(action)}
          onClick={()=>setSelected(action)}><img className="ms-button-skin" src={art("buttons",view.actions.length===1?"primary":"secondary")} alt=""/><img className="ms-action-icon" src={art("icons",({"look-around":"observe",explore:"explore","mark-path":"mark","return-to-path":"return-note"})[action.type])} alt=""/><span>{actionLabel(action)}</span></button>)}</div>
      </section>
    </div>}
    {!summary?<footer className="ms-footer" data-i18n-ignore>
      <button type="button" onClick={()=>setInspection("route")}><img className="ms-button-skin" src={art("buttons","utility")} alt=""/><img className="ms-action-icon" src={art("icons","route")} alt=""/>{tr("Parcours","Route")} ({view.deck.length})</button>
      <button type="button" onClick={()=>setInspection("loot")}><img className="ms-button-skin" src={art("buttons","utility")} alt=""/><img className="ms-action-icon" src={art("icons","loot")} alt=""/>{tr("Butin","Loot")} ({view.loot.length})</button>
      {!tutorial&&view.outcome==="in-progress"?<button type="button" disabled={busy||!!selected||!!replacement} onClick={()=>setInspection("menu")}><img className="ms-button-skin" src={art("buttons","utility")} alt=""/><img className="ms-action-icon" src={art("icons","menu")} alt=""/>{tr("Menu","Menu")}</button>:null}
    </footer>:null}
    {selected||replacement?<div className="ms-confirm-overlay"><div className="ms-confirm" role="group" aria-label={selected?"Confirmation du coup":"Confirmation de nouvelle partie"}>
      <p>{selected?actionLabel(selected):view.outcome==="in-progress"?"Abandonner la partie actuelle et recommencer ?":"Commencer une nouvelle partie ?"}</p>
      {destination>=0?<p data-i18n-ignore>{tr("Destination","Destination")} : {cardLabel(view.deck[destination],language)}</p>:null}
      <button ref={confirmation} className="primary-action" disabled={busy} onClick={()=>void (selected?apply():replace())}>Confirmer</button>
      <button className="secondary-action" disabled={busy} onClick={()=>{setSelected(null);setReplacement(null);actionsHeading.current?.focus();}}>Annuler</button>
    </div></div>:null}
    <dialog ref={dialog} className="ms-inspect-dialog" onClose={()=>setInspection(null)} onCancel={()=>setInspection(null)} aria-label={inspection==="menu"?tr("Menu du jeu","Game menu"):inspection==="loot"?tr("Butin","Loot"):tr("Parcours","Route")}>
      <button type="button" onClick={()=>setInspection(null)} data-i18n-ignore>{tr("Fermer","Close")}</button>
      {inspection==="stats"?<div><h2>{tr("Statistiques","Statistics")}</h2>{statsError?<p role="alert">{tr("Statistiques indisponibles","Statistics unavailable")}</p>:<GameStatisticsPanel statistics={statistics}/>}</div>:inspection==="menu"?<button type="button" disabled={busy} onClick={()=>{setInspection(null);void chooseReplacement();}}>{tr("Nouvelle partie","New game")}</button>:<div className="ms-inspection">{(inspection==="loot"?view.loot:view.deck).map(card=><Card key={card.position} card={card} language={language} onInspect={inspectCard}/>)}</div>}
    </dialog>
    <dialog ref={cardDialog} className="ms-card-dialog" onClose={()=>setDetailCard(null)} aria-label={detailCard?cardLabel(detailCard,language):tr("Carte","Card")}><button type="button" onClick={()=>setDetailCard(null)} data-i18n-ignore>{tr("Fermer","Close")}</button>{detailCard?<Card card={detailCard} language={language}/>:null}</dialog></>:null}
  </section>;
}
