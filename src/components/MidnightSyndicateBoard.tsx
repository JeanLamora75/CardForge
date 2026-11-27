import { visibleMidnightArt } from "../application/midnight-card-art.ts";
import type { Locale } from "../i18n/language.ts";
import "./../midnight-syndicate.css";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createIndexedDbGameStorage } from "../adapters/indexeddb-game-storage.ts";
import type { PersistentGameSession } from "../application/persistent-game-session.ts";
import type { NewGameChoice } from "../application/new-game-choice.ts";
import { makeMidnightSyndicateSummary } from "../application/game-results.ts";
import { inspectMidnightSyndicate, type MidnightSyndicateState, type MidnightSyndicateAction, type PublicLoopCard } from "../games/loot-the-loop/engine.ts";
import { startMidnightSyndicate, resumeMidnightSyndicate, getMidnightSyndicateNewGameChoice, confirmMidnightSyndicateNewGame, practiceMidnightSyndicate } from "../games/loot-the-loop/persistence.ts";
import GameResultPanel from "./GameResultPanel";
import { midnightEnding } from "../application/midnight-ending.ts";
type Session = Pick<PersistentGameSession<MidnightSyndicateState, MidnightSyndicateAction>, 'getState' | 'dispatch'>;
const setup = () => ({seed:crypto.getRandomValues(new Uint32Array(1))[0]});
const art=(category:string,name:string)=>import.meta.env.BASE_URL+"art/"+category+"/midnight-syndicate/"+name+".webp";
function cardLabel(card:PublicLoopCard,language:Locale="fr") {
  const item=visibleMidnightArt(card);
  return item ? item[language] : language==="en"?"Hidden card":"Carte cachée";
}
function Card({card,language,compact=false}:{card:PublicLoopCard;language:Locale;compact?:boolean}) {
  const item=visibleMidnightArt(card);
  return <div className={"ms-card "+(item?"ms-visible":"ms-hidden")+(compact?" ms-mini":"")} aria-label={cardLabel(card,language)} data-i18n-ignore>
    <img className="ms-card-frame" src={art("cards",item?"front-"+item.frame:"back")} alt="" draggable={false}/>
    {item?<><strong className="ms-card-value">{item.value}</strong><img className="ms-card-art" src={art("cards",item.file)} alt="" draggable={false}/><span className="ms-card-name">{item[language]}</span></>:null}
  </div>;
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
  const [inspection,setInspection]=useState<"route"|"loot"|null>(null);
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
  const destination=selected?.type==="explore"&&view?.deck.length?selected.distance%view.deck.length:-1;
  return <section className="ms-board ms-immersive" aria-label="Plateau Midnight Syndicate" aria-busy={busy}
    style={{"--ms-portrait":"url("+art("boards","portrait")+")","--ms-landscape":"url("+art("boards","landscape")+")"} as CSSProperties}>
    <div className="ms-status" role="status" aria-live="polite">{busy?(tutorial?"Chargement de l’entraînement…":"Chargement ou enregistrement…"):notice}</div>
    {error?<p role="alert" className="ms-error">{error}</p>:null}
    {!state&&!tutorial?<button className="primary-action ms-start" disabled={busy||blocked} onClick={()=>void start()}>Commencer une partie</button>:null}
    {view?<><div className="ms-counters" data-i18n-ignore>
      {[[tr("Preuves","Evidence"),view.loot.filter(c=>c.faceUp&&c.id.endsWith("-1")&&c.id!=="joker-1").length+"/4","aces"],[tr("Butin","Loot"),view.loot.length,"loot"],[tr("Parcours","Route"),view.deck.length,"route"],[tr("Notes","Notes"),view.notes.length+"/3","notes"]].map(([label,value,icon])=><div key={icon} className="ms-counter"><img src={art("hud","counter-"+icon)} alt=""/><span>{label}<b>{value}</b></span></div>)}
    </div>
    {summary&&ending?<div className="ms-ending" data-outcome={summary.outcome}><div className="ms-ending-hero" data-i18n-ignore>{ending.file?<img src={art("cards",ending.file)} alt=""/>:null}<div className="ms-ending-story"><p>{summary.outcome==="win"?tr("MISSION ACCOMPLIE","MISSION ACCOMPLISHED"):tr("MISSION COMPROMISE","MISSION COMPROMISED")}</p><h3>{ending.title}</h3><p>{ending.text}</p></div></div><div className="ms-ending-report"><GameResultPanel summary={summary} tutorial={tutorial} disabled={busy} onReplay={()=>tutorial?onReplayTutorial?.():void chooseReplacement()}/></div></div>:<div className="ms-live-layout">
      <aside ref={routeRef} className="ms-route" aria-label={tr("Parcours","Route")} tabIndex={0}>
        {view.deck.map(card=><div key={card.position} className={"ms-route-stop"+(card.position===0?" ms-current":"")+(card.position===destination?" ms-destination":"")}><Card card={card} language={language} compact/><small data-i18n-ignore>{card.position===0?tr("Position actuelle","Current position"):card.position===destination?tr("Destination","Destination"):"#"+(card.position+1)}</small></div>)}
      </aside>
      <section className="ms-exploration">
        <h3 data-i18n-ignore>{tr("Exploration","Exploration")}</h3>
        <div className="ms-top" key={movement} data-moved={movement>0}>{view.deck.slice(0,2).map(card=><Card key={card.position} card={card} language={language}/>)}</div>
        {hintsEnabled?<p className="ms-hint" data-i18n-ignore>{view.actions.some(a=>a.type==="look-around")?tr("Observez les deux premières cartes.","Observe the first two cards."):tr("Choisissez une action autorisée.","Choose an available action.")}</p>:null}
      </section>
      <section className="ms-controls">
        <h3 data-i18n-ignore>{tr("Notes d’enquête","Investigation notes")}</h3>
        <div className="ms-notes">{Array.from({length:3},(_,i)=>view.notes[i]?<Card key={i} card={view.notes[i]} language={language}/>:<div key={i} className="ms-card ms-empty" aria-label={tr("Note libre","Empty note")}><img className="ms-card-frame" src={art("frames","note-slot-empty")} alt=""/></div>)}</div>
        <h3 ref={actionsHeading} tabIndex={-1}>Actions autorisées</h3>
        <div className="ms-actions">{view.actions.map(action=><button type="button" className="secondary-action"
          key={actionLabel(action)} disabled={busy||!!replacement||!!selected}
          aria-pressed={JSON.stringify(selected)===JSON.stringify(action)}
          onClick={()=>setSelected(action)}>{actionLabel(action)}</button>)}</div>
      </section>
    </div>}
    <footer className="ms-footer" data-i18n-ignore>
      <button type="button" onClick={()=>setInspection("route")}>{tr("Voir le parcours","View route")} ({view.deck.length})</button>
      <button type="button" onClick={()=>setInspection("loot")}>{tr("Voir le butin","View loot")} ({view.loot.length})</button>
      {!tutorial&&view.outcome==="in-progress"?<button type="button" disabled={busy||!!selected||!!replacement} onClick={()=>void chooseReplacement()}>{tr("Nouvelle partie","New game")}</button>:null}
    </footer>
    {selected||replacement?<div className="ms-confirm-overlay"><div className="ms-confirm" role="group" aria-label={selected?"Confirmation du coup":"Confirmation de nouvelle partie"}>
      <p>{selected?actionLabel(selected):view.outcome==="in-progress"?"Abandonner la partie actuelle et recommencer ?":"Commencer une nouvelle partie ?"}</p>
      {destination>=0?<p data-i18n-ignore>{tr("Destination","Destination")} : {cardLabel(view.deck[destination],language)}</p>:null}
      <button ref={confirmation} className="primary-action" disabled={busy} onClick={()=>void (selected?apply():replace())}>Confirmer</button>
      <button className="secondary-action" disabled={busy} onClick={()=>{setSelected(null);setReplacement(null);actionsHeading.current?.focus();}}>Annuler</button>
    </div></div>:null}
    <dialog ref={dialog} className="ms-inspect-dialog" onClose={()=>setInspection(null)} onCancel={()=>setInspection(null)} aria-label={inspection==="loot"?tr("Butin","Loot"):tr("Parcours","Route")}>
      <button type="button" onClick={()=>setInspection(null)} data-i18n-ignore>{tr("Fermer","Close")}</button>
      <div className="ms-inspection">{(inspection==="loot"?view.loot:view.deck).map(card=><Card key={card.position} card={card} language={language}/>)}</div>
    </dialog></>:null}
  </section>;
}
