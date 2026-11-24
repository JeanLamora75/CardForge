import { useEffect, useRef, useState } from "react";
import { createIndexedDbGameStorage } from "../adapters/indexeddb-game-storage.ts";
import type { PersistentGameSession } from "../application/persistent-game-session.ts";
import type { NewGameChoice } from "../application/new-game-choice.ts";
import { makeMidnightSyndicateSummary } from "../application/game-results.ts";
import { inspectMidnightSyndicate, type MidnightSyndicateState, type MidnightSyndicateAction, type PublicLoopCard } from "../games/loot-the-loop/engine.ts";
import { startMidnightSyndicate, resumeMidnightSyndicate, getMidnightSyndicateNewGameChoice, confirmMidnightSyndicateNewGame } from "../games/loot-the-loop/persistence.ts";
import GameResultPanel from "./GameResultPanel";
type Session = PersistentGameSession<MidnightSyndicateState, MidnightSyndicateAction>;
const setup = () => ({seed:crypto.getRandomValues(new Uint32Array(1))[0]});
function cardLabel(card: PublicLoopCard) {
  if (!card.faceUp) return "Carte cachée";
  if (card.id === "joker-1") return "Joker";
  const [suit,rank] = card.id.split("-");
  const ranks: Record<string,string> = {"1":"As","11":"Valet","12":"Dame","13":"Roi"};
  const suits: Record<string,string> = {hearts:"♥",diamonds:"♦",clubs:"♣",spades:"♠"};
  return (ranks[rank] ?? rank) + " " + (suits[suit] ?? "");
}
function Card({card}:{card:PublicLoopCard}) {
  return <div className={"ms-card "+(card.faceUp?"ms-visible":"ms-hidden")} aria-label={cardLabel(card)}>
    <small>#{card.position+1}</small><strong>{card.faceUp?cardLabel(card):"◆"}</strong>
    <span>{card.faceUp?"Visible":"Cachée"}</span>
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
export default function MidnightSyndicateBoard() {
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
  useEffect(()=>{
    let cancelled=false;
    mounted.current=true;
    void (async()=>{
      try {
        const existing=await resumeMidnightSyndicate(createIndexedDbGameStorage());
        if(cancelled)return;
        session.current=existing??null;
        setState(existing?.getState()??null);
        setNotice(existing?"Partie reprise · sauvegarde locale":"");
      } catch {
        if(!cancelled){setBlocked(true);setError("Sauvegarde incompatible ou inaccessible. Elle est conservée.");}
      } finally {if(!cancelled)setBusy(false);}
    })();
    return ()=>{cancelled=true;mounted.current=false;};
  },[]);
  useEffect(()=>{if(selected||replacement)confirmation.current?.focus();},[selected,replacement]);
  async function run(work:()=>Promise<void>) {
    if(lock.current||busy||blocked)return;
    lock.current=true;setBusy(true);setError("");
    try{await work();}
    catch{if(mounted.current)setError("Action non enregistrée. La sauvegarde précédente est conservée. Rechargez si nécessaire.");}
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
      setNotice("Action enregistrée");
      actionsHeading.current?.focus();
    });
  }
  const view=state?inspectMidnightSyndicate(state):null;
  const summary=state?makeMidnightSyndicateSummary(state):null;
  return <section className="ms-board" aria-label="Plateau Midnight Syndicate" aria-busy={busy}>
    <p className="ms-kicker">MIDNIGHT SYNDICATE · 1930</p>
    <p role="status" aria-live="polite">{busy?"Chargement ou enregistrement…":notice}</p>
    {error?<p role="alert" className="ms-error">{error}</p>:null}
    {!state?<button className="primary-action" disabled={busy||blocked} onClick={()=>void start()}>Commencer une partie</button>:null}
    {view?<><div className="ms-counters">
      <span>As : {view.loot.filter(c=>c.faceUp&&c.id.endsWith("-1")&&c.id!=="joker-1").length} / 4</span>
      <span>Butin : {view.loot.length}</span><span>Parcours : {view.deck.length}</span>
      <span>Notes : {view.notes.length} / 3</span>
    </div>
    {summary?<GameResultPanel summary={summary} tutorial={false} disabled={busy} onReplay={()=>void chooseReplacement()}/>:null}
    <h3>Position actuelle</h3>
    <div className="ms-top">{view.deck.slice(0,2).map(card=><Card key={card.position} card={card}/>)}</div>
    {view.outcome==="in-progress"?<>
      <h3 ref={actionsHeading} tabIndex={-1}>Actions autorisées</h3>
      <div className="ms-actions">{view.actions.map(action=><button type="button" className="secondary-action"
        key={actionLabel(action)} disabled={busy||!!replacement}
        aria-pressed={JSON.stringify(selected)===JSON.stringify(action)}
        onClick={()=>setSelected(action)}>{actionLabel(action)}</button>)}</div>
      {selected?<div className="ms-confirm" role="group" aria-label="Confirmation du coup">
        <p>{actionLabel(selected)}</p>
        {selected.type==="explore"&&view.deck.length>0?<p>Destination : {cardLabel(view.deck[selected.distance%view.deck.length])}</p>:null}
        <button ref={confirmation} className="primary-action" disabled={busy} onClick={()=>void apply()}>Confirmer</button>
        <button className="secondary-action" disabled={busy} onClick={()=>{setSelected(null);actionsHeading.current?.focus();}}>Annuler</button>
      </div>:null}
      <button className="secondary-action" disabled={busy||!!selected||!!replacement} onClick={()=>void chooseReplacement()}>Nouvelle partie</button>
    </>:null}
    {replacement?<div className="ms-confirm" role="group" aria-label="Confirmation de nouvelle partie">
      <p>{view.outcome==="in-progress"?"Abandonner la partie actuelle et recommencer ?":"Commencer une nouvelle partie ?"}</p>
      <button ref={confirmation} className="primary-action" disabled={busy} onClick={()=>void replace()}>Confirmer</button>
      <button className="secondary-action" disabled={busy} onClick={()=>setReplacement(null)}>Annuler</button>
    </div>:null}
    <h3>Notes de parcours</h3>
    <div className="ms-notes">{Array.from({length:3},(_,i)=>view.notes[i]?<Card key={i} card={view.notes[i]}/>:<div key={i} className="ms-card ms-empty">Note {i+1}<small>Libre</small></div>)}</div>
    <details><summary>Inspecter le parcours ({view.deck.length} cartes)</summary>
      <p>Les cartes cachées restent secrètes. Cette consultation ne consomme aucun tour.</p>
      <div className="ms-inspection">{view.deck.map(card=><Card key={card.position} card={card}/>)}</div>
    </details>
    <details><summary>Consulter le butin ({view.loot.length} cartes)</summary>
      <div className="ms-inspection">{view.loot.map(card=><Card key={card.position} card={card}/>)}</div>
    </details></>:null}
    <p className="help-note">Le retour au catalogue conserve la partie enregistrée.</p>
  </section>;
}
