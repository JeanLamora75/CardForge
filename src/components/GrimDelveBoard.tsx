import { useEffect, useRef, useState } from "react";
import type { Locale } from "../i18n/language.ts";
import { makeDeckWithJokers } from "../core/cards.ts";
import { grimDelveEngine, GRIM_DELVE_GAME_ID, GRIM_DELVE_RULES_VERSION, type GrimDelveAction, type GrimDelveState } from "../games/clear-the-dungeon/engine.ts";
import { createIndexedDbGameStorage } from "../adapters/indexeddb-game-storage.ts";
import { startPersistentGame, type PersistentGameSession } from "../application/persistent-game-session.ts";
import { resumeRegisteredGame } from "../application/registered-save-migrations.ts";
import { storageRecoveryMessage } from "../application/storage-recovery-messages.ts";
import { createTutorialSession } from "../application/learning.ts";
import { makeGrimDelveSummary, replayFinishedGame } from "../application/game-results.ts";
import GameResultPanel from "./GameResultPanel.tsx";
import GrimDelveCard from "./GrimDelveCard.tsx";
import GrimDelveInspection from "./GrimDelveInspection.tsx";
import { grimCardView, grimCardBack } from "../application/grim-delve-art.ts";
import { grimAttackProgress } from "../application/grim-delve-card-view.ts";
import { playGameplayEffect } from "../application/audio.ts";
import GrimDelveDiscard from "./GrimDelveDiscard.tsx";
import { grimDropAction } from "../application/grim-delve-interaction.ts";

export type GrimHelpStatus = { placements:number; triggers:number; returns:number };
type Session = Pick<PersistentGameSession<GrimDelveState, GrimDelveAction>, "getState" | "getLegalActions" | "dispatch">;
const cards = new Map(makeDeckWithJokers().map(card => [card.id, card]));
const art = (category:string,name:string) => import.meta.env.BASE_URL+`art/${category}/grim-delve/${name}.webp`;
const valueOf = (id:string) => { const c=cards.get(id); return c && "rank" in c ? c.rank : 10; };
const options = { gameId: GRIM_DELVE_GAME_ID, rulesVersion: GRIM_DELVE_RULES_VERSION, formatVersion: 1 };
const actionName: Record<GrimDelveAction["type"], string> = {
  "discard": "Défausser : +1 dégât",
  "discard-remaining": "Défausser toute la main",
  "end-hand": "Terminer la main",
  "place-power": "Poser provisoirement",
  "take-back": "Reprendre la carte",
  "move-power": "Déplacer la carte",
  "trigger-attack": "Déclencher l'attaque",
};
function Card({id,language,selected=false,onClick,disabled=false,target=false,ready=false,triggerable=false,playable=false,onInspect,onDrag}:{
 id:string;language:Locale;selected?:boolean;onClick?:()=>void;disabled?:boolean;target?:boolean;ready?:boolean;triggerable?:boolean;playable?:boolean;onInspect:()=>void;onDrag?:(phase:"start"|"move"|"end"|"cancel",x:number,y:number)=>void;
}){
 const view=grimCardView(id,language);
 const url=(path:string)=>import.meta.env.BASE_URL+"art/"+path;
 return <GrimDelveCard {...view} illustration={url(view.illustration)} frame={url(view.frame)} emblem={view.emblem?url(view.emblem):undefined} selected={selected} target={target} ready={ready} triggerable={triggerable} playable={playable} onDrag={onDrag} onInspect={onInspect} inspectLabel={language==="fr"?"Inspecter : appui long, clic droit ou touche I":"Inspect: long press, right click or I key"} onClick={onClick} disabled={disabled}/>;
}
const sameAction = (a: GrimDelveAction, b: GrimDelveAction) =>
  a.type === b.type && ("cardId" in a ? a.cardId : undefined) === ("cardId" in b ? b.cardId : undefined) &&
  ("monsterId" in a ? a.monsterId : undefined) === ("monsterId" in b ? b.monsterId : undefined);

export default function GrimDelveBoard({ tutorial = false, hintsEnabled = true, onReplayTutorial, language="fr", onHelpStatus }: { tutorial?: boolean; hintsEnabled?: boolean; onReplayTutorial?: () => void; language?:Locale; onHelpStatus?:(status:GrimHelpStatus)=>void }) {
  const session = useRef<Session | null>(null);
  const [state, setState] = useState<GrimDelveState | null>(null);
  const [legal, setLegal] = useState<readonly GrimDelveAction[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [inspected,setInspected]=useState<string|null>(null);
  const [busy, setBusy] = useState(true);
  const lock=useRef(false);
  const [pendingDiscard,setPendingDiscard]=useState<GrimDelveAction|null>(null);
  const [drag,setDrag]=useState<{id:string;x:number;y:number}|null>(null);
  const [notice, setNotice] = useState("Chargement du plateau…");
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        if (tutorial) {
          const practice = createTutorialSession(grimDelveEngine, { seed: 3301 });
          if (cancelled) return;
          session.current = practice;
          setState(practice.getState());
          setLegal(practice.getLegalActions());
          setNotice("Exercice guidé · les actions ne sont jamais enregistrées.");
          return;
        }
        const restored = await resumeRegisteredGame(grimDelveEngine, createIndexedDbGameStorage(), options);
        if (cancelled) return;
        session.current = restored ?? null;
        setState(restored?.getState() ?? null);
        setLegal(restored?.getLegalActions() ?? []);
        setNotice(restored ? "Partie locale restaurée, sans remélanger les cartes." : "Aucune partie enregistrée. Lancez une partie pour ouvrir le plateau.");
      } catch (error) {
        if (!cancelled) setNotice(storageRecoveryMessage(error, "read"));
      } finally { if (!cancelled) setBusy(false); }
    })();
    return () => { cancelled = true; };
  }, [tutorial]);
  async function start() {
    if (busy || session.current) return;
    setBusy(true);
    try {
      const created = await startPersistentGame(grimDelveEngine, createIndexedDbGameStorage(),
        { ...options, sessionId: crypto.randomUUID() }, { seed: Math.floor(Math.random() * 0x100000000) });
      session.current = created;
      setState(created.getState());
      setLegal(created.getLegalActions());
      setNotice("Nouvelle partie enregistrée sur cet appareil.");
    } catch (error) { setNotice(storageRecoveryMessage(error, "start")); }
    finally { setBusy(false); }
  }
  async function replay() {
    if (busy || !state || state.outcome === "in-progress") return;
    if (tutorial) { onReplayTutorial?.(); return; }
    setBusy(true);
    try {
      const restored = await replayFinishedGame(
        grimDelveEngine, createIndexedDbGameStorage(), options,
        { seed: Math.floor(Math.random() * 0x100000000) }, crypto.randomUUID(),
      );
      session.current = restored;
      setState(restored.getState());
      setLegal(restored.getLegalActions());
      setSelected(null);
      setNotice("Nouvelle expédition enregistrée. Bonne chance !");
    } catch {
      setNotice("Impossible de rejouer : la sauvegarde a peut-être changé. Aucune partie active n'a été abandonnée.");
    } finally { setBusy(false); }
  }
  function request(action:GrimDelveAction){
    if(busy||lock.current||!legal.some(candidate=>sameAction(candidate,action)))return;
    if(action.type==="discard"||action.type==="discard-remaining"){setPendingDiscard(action);return;}
    void dispatch(action);
  }
  async function dispatch(action: GrimDelveAction) {
    if (busy || lock.current || !session.current || !session.current.getLegalActions().some(candidate => sameAction(candidate, action))) {
      setNotice(language==="fr"?"Action indisponible. Sélectionnez une autre carte.":"Action unavailable. Choose another card.");return;
    }
    lock.current=true;
    setBusy(true);
    try {
      const result = await session.current.dispatch(action);
      if (!result.accepted) {
        setNotice("Coup refusé par le moteur : " + result.reason);
      } else {
        setState(result.state);
        setLegal(session.current.getLegalActions());
        setSelected(null);
        playGameplayEffect(result.state.outcome === "win" ? "victory" : result.state.outcome === "loss" ? "defeat" : "place");
        setNotice(result.state.outcome === "win" ? "Victoire ! Les 12 monstres sont vaincus." :
          result.state.outcome === "loss" ? "Défaite : " + (result.state.endReason === "damage" ? "7 dégâts." : "pioche épuisée.") :
          `${tutorial ? "Coup d’entraînement" : "Action enregistrée"} : ${actionName[action.type]}.`);
      }
    } catch (error) { setNotice(storageRecoveryMessage(error, "write")); }
    finally { lock.current=false;setBusy(false); }
  }
  useEffect(()=>{
    onHelpStatus?.({placements:legal.filter(a=>a.type==="place-power").length,triggers:legal.filter(a=>a.type==="trigger-attack").length,returns:legal.filter(a=>a.type==="take-back").length});
  },[legal,onHelpStatus]);
  const temporaryNotice= /^(Partie locale restaurée|Nouvelle partie enregistrée|Nouvelle expédition enregistrée|Action enregistrée|Coup d’entraînement|Exercice guidé)/.test(notice);
  useEffect(()=>{
    if(!temporaryNotice)return;
    const timer=window.setTimeout(()=>setNotice(current=>current===notice?"":current),2400);
    return ()=>window.clearTimeout(timer);
  },[notice,temporaryNotice]);
  const visibleIds=new Set(state?[...state.hand,...state.columns.flatMap(column=>column.slice(0,1)),...state.attacks.flatMap(attack=>attack.powers.map(power=>power.cardId))]:[]);
  const inspection=inspected&&visibleIds.has(inspected)?grimCardView(inspected,language):null;
  const active=drag?.id??selected;
  const actions = active ? legal.filter(action => "cardId" in action && action.cardId === active) : [];
  const canReturn=actions.some(a=>a.type==="take-back");
  function gesture(id:string,phase:"start"|"move"|"end"|"cancel",x:number,y:number){
    if(phase==="cancel"){setDrag(null);return;}
    if(phase==="start"||phase==="move"){setDrag({id,x,y});return;}
    setDrag(null);
    const zone=document.elementFromPoint(x,y)?.closest<HTMLElement>("[data-gd-drop]");
    const action=grimDropAction(legal,id,zone?.dataset.gdDrop??"",zone?.dataset.monsterId);
    if(action)request(action);else setNotice(language==="fr"?"Dépôt interdit : carte conservée.":"Invalid drop: card kept.");
  }
  const instruction = state?.outcome!=="in-progress"||!hintsEnabled ? "" : active
    ? (()=>{const fr=language==="fr";const types=new Set(actions.map(a=>a.type));const choices:string[]=[];
      if(types.has("trigger-attack"))choices.push(fr?"Attaquer":"Attack");
      if(types.has("place-power"))choices.push(fr?"Poser":"Place");
      if(types.has("move-power"))choices.push(fr?"Déplacer":"Move");
      if(types.has("take-back"))choices.push(fr?"Reprendre":"Take back");
      if(choices.length)return choices.join(" · ")+(types.has("discard")?(fr?" · ou défausser":" · or discard"):"");
      return types.has("discard")?(fr?"Aucune attaque : défausser ou annuler.":"No attack: discard or cancel."):(fr?"Aucune manipulation autorisée.":"No legal move.");
    })()
    : state.hand.length ? (language==="fr"?"Glissez ou sélectionnez une carte.":"Drag or select a card.") : (language==="fr"?"Terminez la main pour continuer.":"End the hand to continue.");
  const showNotice=(active&&temporaryNotice?instruction:notice)||instruction;
  const contextual=actions.filter(action=>action.type==="discard"||action.type==="take-back");
  const contextAction=contextual[0];
  return <section className="grim-board" data-compact={!!state&&state.outcome==="in-progress"&&!tutorial} aria-labelledby="grim-heading">
    <h2 id="grim-heading" className="gd-sr-only">Grim Delve · Plateau de jeu</h2>
    <p className="gd-sr-only">Dark Fantasy · Classic 1.1.0. Les seules commandes proposées sont celles autorisées par le moteur. Les cartes posées restent provisoires jusqu'au déclenchement d'une attaque.</p>
    
    {!state ? <p role="status" aria-live="polite" className="grim-notice">{notice}</p> : null}
    {tutorial && state ? <section className="learning-lesson gd-tutorial" aria-label="Étape d'entraînement Grim Delve">
      <h3>Mission d'entraînement · main {state.handNumber}</h3>
      <p>{state.outcome !== "in-progress" ? "L'exercice est terminé. Vous pouvez recommencer ou jouer librement." :
        state.hand.length === 0 ? "Toutes les cartes sont utilisées ou défaussées : activez « Terminer la main » pour continuer." :
        state.attacks.length ? "Vous avez commencé une attaque. Sélectionnez une carte pour renforcer, déclencher ou reprendre une pose lorsque le moteur le permet." :
        "Observez les résistances des monstres, choisissez une carte de la main, puis essayez une pose provisoire légale. La défausse crée un dégât irréversible."}</p>
      <p>Objectif : préparer une attaque de deux puissances suffisantes, puis la déclencher avec l'enseigne du monstre. Sept dégâts entraînent une défaite.</p>
    </section> : null}
    {!state ? <button type="button" className="primary-action" disabled={busy} onClick={() => void start()}>Commencer une partie</button> : <>
      <div className="grim-counters" aria-label="Progression">
        <div className="gd-counter gd-damage"><small>Dégâts</small><div className="gd-hearts" aria-hidden="true">{Array.from({length:7},(_,i)=><img key={i} src={art("hud",i<state.damages.length?"heart-filled":"heart-empty")} alt=""/>)}</div><strong>{state.damages.length} / 7</strong></div>
        <div className="gd-counter"><small>Pioche</small><img className="gd-counter-icon" src={art("hud","deck")} alt=""/><strong>{state.drawPile.length}</strong></div>
        <div className="gd-counter"><small>Monstres vaincus</small><img className="gd-counter-icon" src={art("hud","skull")} alt=""/><strong>{state.defeated.length} / 12</strong></div>
        <div className="gd-counter"><small>Main</small><strong>n° {state.handNumber}</strong></div>
      </div>
      {state.outcome !== "in-progress" ? <GameResultPanel summary={makeGrimDelveSummary(state)!} tutorial={tutorial} onReplay={() => void replay()} disabled={busy} /> : null}
      <h3 className="gd-banner">Monstres et attaques en préparation</h3>
      <div className="grim-columns">
        {state.columns.map((column, index) => {
          const monster = column[0];
          const attack = state.attacks.find(a => a.monsterId === monster);
          const target = monster?grimDropAction(legal,active??"","monster",monster):undefined;
          const slotTarget=monster?grimDropAction(legal,active??"","slot",monster):undefined;
          const triggerable=legal.some(a=>a.type==="trigger-attack"&&a.monsterId===monster);
          const powers = attack?.powers.map(p=>valueOf(p.cardId)) ?? [];
          const progress = monster ? grimAttackProgress(powers,valueOf(monster)) : null;
          return <div className="grim-column" key={index}>
            <h4 className="gd-sr-only">Colonne {index + 1}</h4>
            {monster ? <div className="gd-monster-stack" data-gd-drop="monster" data-monster-id={monster} data-hidden={column.length-1}><Card language={language} id={monster} onInspect={()=>setInspected(monster)} ready={!!progress?.ready} triggerable={triggerable} target={!!target} onClick={target ? ()=>request(target) : undefined} disabled={busy}/></div> : <span className="gd-empty">Colonne libérée</span>}
            <div className="gd-attack-slots" data-gd-drop="slot" data-monster-id={monster} data-valid={!!slotTarget}>
            {attack?.powers.map(power => <div key={power.cardId} className="grim-placed">
              <Card language={language} id={power.cardId} onDrag={legal.some(a=>"cardId" in a&&a.cardId===power.cardId&&(a.type==="move-power"||a.type==="take-back"))?(p,x,y)=>gesture(power.cardId,p,x,y):undefined} onInspect={()=>setInspected(power.cardId)} onClick={() => setSelected(power.cardId)} disabled={busy} selected={selected === power.cardId} />
              <small className="gd-sr-only">{power.handNumber === state.handNumber ? "Reprise possible selon le moteur" : "Pose antérieure"}</small>
            </div>)}
            {monster ? Array.from({length:2-(attack?.powers.length??0)},(_,i)=><button type="button" className="gd-empty-slot" key={i} disabled={busy||!slotTarget} aria-label={language==="fr"?"Emplacement de puissance libre":"Free power slot"} onClick={()=>{if(slotTarget)request(slotTarget);}}><span aria-hidden="true">✧</span></button>) : null}
            </div>
            {progress ? <div className="gd-attack-progress" data-ready={progress.ready} data-triggerable={triggerable}>
              <div className="gd-power-track" role="progressbar" aria-label={language==="fr"?"Puissance en préparation":"Prepared power"} aria-valuemin={0} aria-valuemax={progress.resistance} aria-valuenow={Math.min(progress.power,progress.resistance)} aria-valuetext={`${progress.power} / ${progress.resistance}${progress.ready?(language==="fr"?" · résistance atteinte":" · resistance reached"):""}`}>
                <span style={{width:`${progress.percent}%`}}/>
              </div><small className="gd-power-total">{progress.ready?<span className="gd-ready-mark" title={language==="fr"?"Puissance suffisante":"Sufficient power"} aria-label={language==="fr"?"Puissance suffisante":"Sufficient power"}>✓ </span>:null}{progress.power} / {progress.resistance}</small>
            </div>:null}
            {column.length > 1 ? <small className="gd-hidden-count"><span className="gd-hidden-cards" aria-hidden="true">{Array.from({length:column.length-1},(_,i)=><img key={i} src={import.meta.env.BASE_URL+"art/"+grimCardBack} alt=""/>)}</span><span>{column.length-1} <span className="gd-hidden-word">{language==="fr"?"masqué(s)":"hidden"}</span></span><span className="gd-sr-only">{language==="fr"?" monstre(s)":" monster(s)"}</span></small> : <small className="gd-hidden-count" aria-hidden="true"> </small>}
          </div>;
        })}
      </div>
      <p role="status" aria-live="polite" className={`grim-notice gd-play-notice${showNotice?"":" gd-no-notice"}`}>{showNotice}</p>
      <h3 className="gd-banner gd-hand-banner">Votre main</h3>
      <div className="grim-hand" data-gd-drop="hand" data-valid={canReturn}>{state.hand.length ? state.hand.map(id =>
        <Card language={language} key={id} id={id} playable={legal.some(a=>"cardId" in a&&a.cardId===id&&(a.type==="place-power"||a.type==="trigger-attack"))} onDrag={(p,x,y)=>gesture(id,p,x,y)} onInspect={()=>setInspected(id)} onClick={() => setSelected(current=>current===id?null:id)} disabled={busy} selected={selected === id} />
      ) : <p>La main est vide.</p>}</div>
      {state.outcome === "in-progress" ? <div className="grim-actions gd-footer" data-contextual={!!selected}>
        {selected ? <>
          <button type="button" className="secondary-action" disabled={busy||!contextAction} onClick={()=>{if(contextAction)request(contextAction);}}>
            {contextAction?actionName[contextAction.type]:(language==="fr"?"Aucune action directe":"No direct action")}
          </button>
          <button type="button" className="primary-action" onClick={()=>setSelected(null)}>{language==="fr"?"Annuler la sélection":"Cancel selection"}</button>
        </> : <>
          <button type="button" className="secondary-action" disabled={busy||!legal.some(action=>action.type==="discard-remaining")} onClick={()=>request({type:"discard-remaining"})}>Défausser la main</button>
          <button type="button" className="primary-action" disabled={busy||!legal.some(action=>action.type==="end-hand")} onClick={()=>request({type:"end-hand"})}>Terminer la main</button>
        </>}
      </div>:null}
    </>}
    {drag?<div className="gd-drag-ghost" style={{left:drag.x,top:drag.y}} aria-hidden="true"><img src={import.meta.env.BASE_URL+"art/"+grimCardView(drag.id,language).illustration} alt=""/></div>:null}
    {pendingDiscard&&state?<GrimDelveDiscard language={language} count={Math.min(pendingDiscard.type==="discard"?1:state.hand.length,7-state.damages.length)} damage={state.damages.length} onCancel={()=>setPendingDiscard(null)} onConfirm={()=>{const action=pendingDiscard;setPendingDiscard(null);void dispatch(action);}}/>:null}
    {inspection?<GrimDelveInspection view={inspection} language={language} onClose={()=>setInspected(null)}/>:null}
  </section>;
}
