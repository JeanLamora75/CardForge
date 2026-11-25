import { useEffect, useRef, useState } from "react";
import { makeDeckWithJokers } from "../core/cards.ts";
import {
  thunderfighterEngine, THUNDERFIGHTER_GAME_ID, THUNDERFIGHTER_RULES_VERSION,
  getThunderfighterResult, getSearchPresentation, getFigurePlacementOptions,
  type ThunderfighterState, type ThunderfighterAction,
} from "../games/gridcannon/engine.ts";
import { createIndexedDbGameStorage } from "../adapters/indexeddb-game-storage.ts";
import { startPersistentGame, type PersistentGameSession } from "../application/persistent-game-session.ts";
import { resumeRegisteredGame } from "../application/registered-save-migrations.ts";
import { storageRecoveryMessage } from "../application/storage-recovery-messages.ts";
import { createTutorialSession } from "../application/learning.ts";
import { makeThunderfighterSummary, replayFinishedGame } from "../application/game-results.ts";
import GameResultPanel from "./GameResultPanel.tsx";
import { playGameplayEffect } from "../application/audio.ts";
import type {Locale} from "../i18n/language.ts";
import {thunderCardView} from "../application/thunderfighter-card-view.ts";
import {ThunderTacticalCard,ThunderCardDetail} from "./ThunderfighterCard.tsx";
import {directThunderTarget,thunderTargetActions,isThunderActionLegal,type BoardTarget} from "../application/thunderfighter-targets.ts";

type Session = Pick<PersistentGameSession<ThunderfighterState, ThunderfighterAction>, "getState" | "getLegalActions" | "dispatch">;
const inventory = new Map(makeDeckWithJokers().map(card => [card.id, card]));
const suits = { hearts: ["♥", "Cœur"], diamonds: ["♦", "Carreau"], clubs: ["♣", "Trèfle"], spades: ["♠", "Pique"] } as const;
const options = { gameId: THUNDERFIGHTER_GAME_ID, rulesVersion: THUNDERFIGHTER_RULES_VERSION, formatVersion: 1 };
const phaseLabels: Record<ThunderfighterState["phase"], string> = {
  "initial-figures": "Positionnement initial des adversaires", "replacement-offer": "Remplacement facultatif",
  "replacement-draw": "Pioche de remplacement", "replacement-figures": "Placement des adversaires révélés",
  "placing-figure": "Placement d'un adversaire", playing: "Tour de jeu", searching: "Recherche d'un adversaire",
};
function valueOf(id: string): number {
  const card = inventory.get(id);
  return card && "rank" in card ? card.rank : 10;
}
function labelOf(id: string): string {
  const card = inventory.get(id);
  if (!card) return id;
  if ("kind" in card) return `Joker ${id.slice(-1)} · Réaffectation`;
  const rank = ({ 1: "As", 11: "Valet", 12: "Dame", 13: "Roi" } as Record<number, string>)[card.rank] ?? String(card.rank);
  return `${rank} de ${suits[card.suit][1]} (${suits[card.suit][0]})`;
}
function actionLabel(action: ThunderfighterAction): string {
  switch (action.type) {
    case "place-figure": return `Positionner en secteur ${action.slot + 1}`;
    case "skip-replacement": return "Conserver la grille initiale";
    case "start-replacement": return `Remplacer la pile ${action.cell + 1}`;
    case "draw-replacement": return "Piocher le remplacement";
    case "draw-card": return "Piocher une carte";
    case "place-number": return `Poser sur la pile ${action.cell + 1}`;
    case "extract": return `Extraction avec ${labelOf(action.cardId)} : pile ${action.cell + 1}`;
    case "reassign": return `Réaffectation avec ${labelOf(action.cardId)} : pile ${action.from + 1} → ${action.to + 1}`;
    case "draw-search": return "Révéler la prochaine carte de recherche";
    case "assign-armor": return `Attribuer l'armure à ${labelOf(action.figureId)}`;
  }
}
function resistance(state: ThunderfighterState, id: string): number {
  return valueOf(id) + (state.armorCards ?? []).filter(a => a.figureId === id)
    .reduce((sum, armor) => sum + valueOf(armor.cardId), 0);
}
export function previewThunderfighterAction(state: ThunderfighterState, action: ThunderfighterAction) {
  const snapshot = structuredClone(state);
  const next = thunderfighterEngine.transition(snapshot, action);
  if (!next.accepted) return { accepted: false as const, message: "Action refusée par le moteur." };
  const before = getThunderfighterResult(state);
  const after = getThunderfighterResult(next.state);
  const shots = (next.state.defeatedFigures ?? []).filter(id => !(state.defeatedFigures ?? []).includes(id));
  const armor = action.type === "assign-armor" ? `Armure : ${labelOf(action.figureId)}, résistance ${resistance(state, action.figureId)} → ${resistance(next.state, action.figureId)}.` : "";
  const removal = action.type === "extract" ? `Pile ${action.cell + 1} retirée et placée sous la pioche (${state.grid[action.cell].length} carte(s)).` : "";
  const relocated = action.type === "reassign" ? `Carte supérieure déplacée de ${action.from + 1} vers ${action.to + 1}.` : "";
  const replacement = action.type === "start-replacement" ? "La carte supérieure sera mise sous la pioche ; ce choix est définitif." : "";
  const hasDouble = shots.length > 1;
  const outcome = after.outcome === "win" ? `Victoire, score officiel : ${after.officialScore}.` :
    after.outcome === "loss" ? `Défaite : ${after.reason === "armor" ? "armure excessive" : "impasse"}.` : "";
  return {
    accepted: true as const,
    message: [actionLabel(action), replacement, removal, relocated, armor,
      shots.length ? `${hasDouble ? "Double tir" : "Tir"} : ${shots.map(labelOf).join(" et ")} neutralisé(s).` : "",
      outcome, `Adversaires neutralisés : ${before.defeatedCount} → ${after.defeatedCount}.`]
      .filter(Boolean).join(" "),
    resultingShots: shots, resultingOutcome: after.outcome,
    changingCards: after.physicalCardCount === 54,
  };
}
export default function ThunderfighterBoard({ tutorial = false, hintsEnabled = true, onReplayTutorial, language="fr" }: { tutorial?: boolean; hintsEnabled?: boolean; onReplayTutorial?: () => void; language?:Locale }) {
  const session = useRef<Session | null>(null);
  const [state, setState] = useState<ThunderfighterState | null>(null);
  const [legal, setLegal] = useState<readonly ThunderfighterAction[]>([]);
  const [selection, setSelection] = useState<ThunderfighterAction | null>(null);
  const [busy, setBusy] = useState(true);
  const committing=useRef(false);
  const actionTrigger=useRef<HTMLElement|null>(null);
  const confirmButton=useRef<HTMLButtonElement>(null);
  const [targetChoice,setTargetChoice]=useState<BoardTarget|null>(null);
  const en=language==="en";
  useEffect(()=>{if(selection)confirmButton.current?.focus();},[selection]);
  function cancelSelection(){setSelection(null);setTargetChoice(null);requestAnimationFrame(()=>actionTrigger.current?.focus());}
  const [inspected,setInspected]=useState<string|null>(null);
  const inspectTrigger=useRef<HTMLElement|null>(null);
  function closeInspect(){setInspected(null);requestAnimationFrame(()=>inspectTrigger.current?.focus());}
  const [notice, setNotice] = useState("Chargement de Thunderfighter…");
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        if (tutorial) {
          const practice = createTutorialSession(thunderfighterEngine, { seed: 3201 });
          if (cancelled) return;
          session.current = practice;
          setState(practice.getState());
          setLegal(practice.getLegalActions());
          setNotice("Mission guidée · vos coups ne sont pas sauvegardés.");
          return;
        }
        const restored = await resumeRegisteredGame(thunderfighterEngine, createIndexedDbGameStorage(), options);
        if (cancelled) return;
        session.current = restored ?? null;
        setState(restored?.getState() ?? null);
        setLegal(restored?.getLegalActions() ?? []);
        setNotice(restored ? "" : "Commencez une partie.");
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
      const created = await startPersistentGame(thunderfighterEngine, createIndexedDbGameStorage(),
        { ...options, sessionId: crypto.randomUUID() }, { seed: Math.floor(Math.random() * 0x100000000) });
      session.current = created;
      setState(created.getState());
      setLegal(created.getLegalActions());
      setNotice("");
    } catch (error) { setNotice(storageRecoveryMessage(error, "start")); }
    finally { setBusy(false); }
  }
  async function replay() {
    if (busy || !state || state.outcome === "in-progress") return;
    if (tutorial) { onReplayTutorial?.(); return; }
    setBusy(true);
    try {
      const restored = await replayFinishedGame(
        thunderfighterEngine, createIndexedDbGameStorage(), options,
        { seed: Math.floor(Math.random() * 0x100000000) }, crypto.randomUUID(),
      );
      session.current = restored;
      setState(restored.getState());
      setLegal(restored.getLegalActions());
      setSelection(null);
      setNotice("Nouvelle mission enregistrée. Bonne chance !");
    } catch {
      setNotice("Impossible de rejouer : la sauvegarde a peut-être changé. Aucune partie active n'a été abandonnée.");
    } finally { setBusy(false); }
  }
  function choose(action: ThunderfighterAction) {
    if (busy || committing.current || !isThunderActionLegal(legal,action)) return;
    if(!targetChoice)actionTrigger.current=document.activeElement as HTMLElement;
    setTargetChoice(null);
    setSelection(action);
  }
  async function confirm() {
    if (busy || committing.current || !selection || !session.current || !state) return;
    if (!isThunderActionLegal(session.current.getLegalActions(),selection)) {
      setSelection(null);
      setNotice("Cette action n'est plus autorisée.");
      return;
    }
    committing.current=true;
    setBusy(true);
    try {
      const result = await session.current.dispatch(selection);
      if (!result.accepted) setNotice("Action refusée : " + result.reason);
      else {
        const nextResult = getThunderfighterResult(result.state);
        const shots = result.state.lastShot ?? [];
        setState(result.state);
        setLegal(session.current.getLegalActions());
        playGameplayEffect(nextResult.outcome === "win" ? "victory" : nextResult.outcome === "loss" ? "defeat" : "place");
        setNotice(nextResult.outcome === "win" ? `Victoire ! Score : ${nextResult.officialScore}.` :
          nextResult.outcome === "loss" ? `Défaite : ${nextResult.reason === "armor" ? "armure excessive" : "impasse"}.` :
          shots.length ? `${shots.length > 1 ? "Double tir" : "Tir"} : ${shots.map(labelOf).join(" et ")}.` :
          `${tutorial ? "Coup d’entraînement" : "Coup enregistré"} : ${actionLabel(selection)}.`);
      }
      setSelection(null);
    } catch (error) { setNotice(storageRecoveryMessage(error, "write")); }
    finally { committing.current=false;setBusy(false); }
  }
  const preview = state && selection ? previewThunderfighterAction(state, selection) : null;
  const figures = state?.figureSlots ?? [];
  const selectedTarget=selection?directThunderTarget(selection):targetChoice;
  const fallbackActions=legal.filter(action=>!directThunderTarget(action));
  const ambiguousActions=targetChoice?thunderTargetActions(legal,targetChoice.kind,targetChoice.index):[];
  function renderTarget(kind:BoardTarget["kind"],index:number){
    const actions=thunderTargetActions(legal,kind,index);
    if(!actions.length)return null;
    const selected=selectedTarget?.kind===kind&&selectedTarget.index===index;
    const label=(en?(kind==="pile"?"Select pile ":"Select sector "):(kind==="pile"?"Sélectionner la pile ":"Sélectionner le secteur "))+(index+1);
    return <button type="button" data-i18n-ignore className="tf-target" data-target-kind={kind} data-target-index={index} aria-label={label} aria-pressed={selected} disabled={busy} onClick={event=>{if(actions.length===1){choose(actions[0]);actionTrigger.current=event.currentTarget;}else{actionTrigger.current=event.currentTarget;setSelection(null);setTargetChoice({kind,index});}}}><span aria-hidden="true">{selected?"✓":"+"}</span></button>;
  }
  function targetState(kind:BoardTarget["kind"],index:number){return selectedTarget?.kind===kind&&selectedTarget.index===index?"selected":thunderTargetActions(legal,kind,index).length?"legal":undefined;}
  const result = state ? getThunderfighterResult(state) : null;
  const search = state ? getSearchPresentation(state) : null;
  const placement = state && state.pendingFigures.length ? getFigurePlacementOptions(state) : null;
  const revealed=search?.visible?search.revealedNumerics:[];
  const detail=state&&inspected?thunderCardView(state,inspected,language,revealed):null;
  function renderCard(id:string){const view=state?thunderCardView(state,id,language,revealed):null;return view?<ThunderTacticalCard key={id} card={view} locale={language} onInspect={()=>{inspectTrigger.current=document.activeElement as HTMLElement;setInspected(id);}}/>:null;}
  return <section className="thunder-board" aria-labelledby="thunder-title" onKeyDown={event=>{if(event.key==="Escape"&&!event.defaultPrevented&&(selection||targetChoice)&&!inspected){event.preventDefault();event.stopPropagation();if(!busy)cancelSelection();}}}>
    <h2 id="thunder-title" className="thunder-sr-only">Poste de commandement</h2>
    {!state?<p className="thunder-notice" role="status" aria-live="polite">{notice}</p>:null}
    {tutorial && state ? <section className="learning-lesson" aria-label="Mission Thunderfighter">
      <h3>Mission d'entraînement · {phaseLabels[state.phase]}</h3>
      <p>{state.outcome !== "in-progress" ? "Mission terminée : vous pouvez recommencer l'entraînement ou jouer librement." :
        state.pendingFigures.length ? "Placez la figure dans un des secteurs proposés. Les emplacements sont déterminés par la ressemblance avec les cartes visibles." :
        state.phase === "replacement-offer" ? "Vous pouvez garder les neuf piles initiales ou remplacer une carte : testez les deux options en recommençant l'exercice." :
        state.phase === "replacement-draw" ? "La carte initiale est sous la pioche. Révélez le remplacement puis placez les figures éventuellement rencontrées." :
        state.phase === "searching" ? "Toutes les figures actuellement en jeu ont été vaincues : cherchez la prochaine figure, sans dévoiler les cartes suivantes." :
        state.pendingNumeric ? "Examinez les neuf piles : votre carte doit être au moins aussi forte que le sommet. Prévisualisez un tir avant de confirmer." :
        "Piochez une carte ; observez les éventuelles figures et cartes spéciales. Un As extrait une pile ; un Joker réaffecte une carte supérieure."}</p>
      <p>Objectif : comprendre les placements, les résistances, les tirs sur deux axes et la réserve spéciale. Toutes les décisions suivent Gridcannon V2.</p>
    </section> : null}
    {hintsEnabled && state ? <details className="learning-context" open={tutorial}>
      <summary>Aide sur les actions autorisées ({legal.length})</summary>
      <p>{legal.filter(a => a.type === "place-number").length} destination(s) numériques, {legal.filter(a => a.type === "place-figure").length} secteur(s) pour figure, {legal.filter(a => a.type === "extract" || a.type === "reassign").length} action(s) spéciale(s).</p>
      <p>Les Valets demandent 11 points, les Dames 12 avec la même couleur, les Rois 13 avec la même enseigne. Le score officiel ne dépend que de la réserve inutilisée en cas de victoire.</p>
    </details> : null}
    {!state ? <button type="button" className="primary-action" onClick={() => void start()} disabled={busy}>Commencer une partie</button> : <>
      <div className="thunder-metrics">
        <span><small>Pioche</small><strong>{state.drawPile.length}</strong></span>
        <span><small>Ennemis neutralisés</small><strong>{result?.defeatedCount} / 12</strong></span>
        <span><small>Réserve</small><strong>{state.specialReserve.length}</strong></span>
      </div>
      {state.outcome !== "in-progress" ? <GameResultPanel summary={makeThunderfighterSummary(state)!} tutorial={tutorial} onReplay={() => void replay()} disabled={busy} /> : null}
      <h3>Champ de bataille · 3 × 3</h3>
      <div className="thunder-battlefield">
        <div className="thunder-top-slots">{figures.slice(0, 3).map((id, i) => <div key={i} className="thunder-slot" data-target-state={targetState("sector",i)}><small>Nord {i + 1}</small>{id ? renderCard(id) : <span>Libre</span>}{renderTarget("sector",i)}</div>)}</div>
        <div className="thunder-middle">
          <div className="thunder-side-slots">{[11, 10, 9].map(i => <div className="thunder-slot" key={i} data-target-state={targetState("sector",i)}><small>Ouest {i - 8}</small>{figures[i] ? renderCard(figures[i]!) : <span>Libre</span>}{renderTarget("sector",i)}</div>)}</div>
          <div className="thunder-grid">{state.grid.map((pile, i) => <div className="thunder-pile" key={i} data-target-state={targetState("pile",i)}>
            <strong aria-label={`Pile ${i + 1} · ${pile.length} carte(s)`}>{i + 1} · {pile.length}</strong>
            {pile.length ? renderCard(pile[pile.length - 1]) : <span aria-label="Emplacement vide">—</span>}{renderTarget("pile",i)}
          </div>)}</div>
          <div className="thunder-side-slots">{[3, 4, 5].map(i => <div className="thunder-slot" key={i} data-target-state={targetState("sector",i)}><small>Est {i - 2}</small>{figures[i] ? renderCard(figures[i]!) : <span>Libre</span>}{renderTarget("sector",i)}</div>)}</div>
        </div>
        <div className="thunder-bottom-slots">{[8, 7, 6].map(i => <div className="thunder-slot" key={i} data-target-state={targetState("sector",i)}><small>Sud {i - 5}</small>{figures[i] ? renderCard(figures[i]!) : <span>Libre</span>}{renderTarget("sector",i)}</div>)}</div>
      </div>
      <div className="thunder-action-zone">
      {state.pendingFigures[0] ? <div className="tf-pending-card">{renderCard(state.pendingFigures[0])}<p className="thunder-pending">Figure à positionner : <strong>{labelOf(state.pendingFigures[0])}</strong>. {placement?.mode === "rescue" ? "Choisissez un secteur disponible." : ""}</p></div> : null}
      {state.pendingNumeric ? <div className="tf-pending-card">{renderCard(state.pendingNumeric)}<p className="thunder-pending">Carte piochée : <strong>{labelOf(state.pendingNumeric)}</strong>. Choisissez une destination autorisée ou une action spéciale.</p></div> : null}
      {search?.visible ? <section className="thunder-search" aria-label="Recherche">
        <h3>Recherche d'un adversaire</h3>
        <p>Cartes numériques traversées : {search.revealedNumerics.length}. Elles seront replacées sous la pioche.</p>
        <div className="thunder-reserve">{search.revealedNumerics.map(id => renderCard(id))}</div>
        {search.integrityStatus === "invalid" ? <p role="alert">La partie ne peut pas continuer normalement.</p> : null}
      </section> : null}
      <h3>Actions autorisées</h3>
      {state.outcome === "in-progress" && !selection ? <div className="thunder-actions">
        {legal.some(action=>directThunderTarget(action))?<p data-i18n-ignore className="tf-target-hint">{en?"Choose a highlighted destination on the board.":"Choisissez une destination en surbrillance sur le plateau."}</p>:null}
        {targetChoice?<div className="tf-target-choices"><p data-i18n-ignore>{en?"Choose an action":"Choisissez une action"}</p>{ambiguousActions.map((action,index)=><button type="button" className="secondary-action" key={index} disabled={busy} onClick={()=>choose(action)}>{actionLabel(action)}</button>)}<button type="button" className="back-link" onClick={cancelSelection}>{en?"Cancel":"Annuler"}</button></div>:null}
        {legal.length ? fallbackActions.map((action, index) =>
          <button type="button" className="secondary-action" key={index} disabled={busy} onClick={() => choose(action)}>{actionLabel(action)}</button>
        ) : <p>Aucune action disponible.</p>}
      </div> : null}
      {selection && preview ? <div className="thunder-confirm" role="group" aria-label="Prévisualisation">
        <h3>Prévisualisation</h3>
        <p>{preview.message}</p>

        <button ref={confirmButton} type="button" className="primary-action" disabled={busy || !preview.accepted} onClick={() => void confirm()}>{tutorial ? "Confirmer le coup d’entraînement" : "Confirmer et enregistrer ce coup"}</button>
        <button type="button" className="back-link" disabled={busy} onClick={cancelSelection}>Annuler sans modifier</button>
      </div> : null}
      </div>
      <p className="thunder-notice" role="status" aria-live="polite">{notice}</p>
      <details className="thunder-extra"><summary>Résistance et armure</summary>
      <div className="thunder-armor">{figures.filter((id): id is string => id !== null).map(id =>
        <p key={id}>{labelOf(id)} · Résistance {resistance(state, id)} ({valueOf(id)} + {(state.armorCards ?? []).filter(a => a.figureId === id).reduce((sum, a) => sum + valueOf(a.cardId), 0)} armure) · {state.defeatedFigures?.includes(id) ? "Neutralisé" : "Actif"}</p>
      )}</div>
      </details><details className="thunder-extra"><summary>Réserve spéciale · {state.specialReserve.length}</summary>
      <div className="thunder-reserve">{state.specialReserve.map(id => renderCard(id))}</div>
      <p className="help-note">Actions spéciales consommées : {state.spentSpecials.length}. </p>
</details>
    </>}
    {detail?<ThunderCardDetail card={detail} locale={language} onClose={closeInspect}/>:null}
  </section>;
}
