import { useEffect, useRef, useState } from "react";
import { makeDeckWithJokers } from "../core/cards.ts";
import {
  thunderfighterEngine, THUNDERFIGHTER_GAME_ID, THUNDERFIGHTER_RULES_VERSION,
  getThunderfighterResult, getSearchPresentation, getFigurePlacementOptions,
  type ThunderfighterState, type ThunderfighterAction,
} from "../games/gridcannon/engine.ts";
import { createIndexedDbGameStorage } from "../adapters/indexeddb-game-storage.ts";
import { resumePersistentGame, startPersistentGame, type PersistentGameSession } from "../application/persistent-game-session.ts";

type Session = PersistentGameSession<ThunderfighterState, ThunderfighterAction>;
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
function Card({ id, defeated = false }: { id: string; defeated?: boolean }) {
  const card = inventory.get(id);
  const figure = card && "rank" in card && card.rank >= 11;
  return <span className="thunder-card" data-figure={figure || undefined} data-defeated={defeated || undefined}
    aria-label={`${labelOf(id)}${defeated ? ", neutralisé" : ""}`}>
    <span className="thunder-emblem" aria-hidden="true">{figure ? "✦" : "◈"}</span>
    <strong>{labelOf(id)}</strong>
    <small>{figure ? "Résistance initiale" : "Valeur"} : {valueOf(id)}</small>
    <small className="thunder-id">{id}</small>
    {defeated ? <b>Neutralisé</b> : null}
  </span>;
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
export default function ThunderfighterBoard() {
  const session = useRef<Session | null>(null);
  const [state, setState] = useState<ThunderfighterState | null>(null);
  const [legal, setLegal] = useState<readonly ThunderfighterAction[]>([]);
  const [selection, setSelection] = useState<ThunderfighterAction | null>(null);
  const [busy, setBusy] = useState(true);
  const [notice, setNotice] = useState("Chargement de Thunderfighter…");
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const restored = await resumePersistentGame(thunderfighterEngine, createIndexedDbGameStorage(), options);
        if (cancelled) return;
        session.current = restored ?? null;
        setState(restored?.getState() ?? null);
        setLegal(restored?.getLegalActions() ?? []);
        setNotice(restored ? "Partie restaurée sans remélange." : "Aucune sauvegarde. Commencez une partie.");
      } catch {
        if (!cancelled) setNotice("Lecture impossible. Aucune sauvegarde existante n'a été modifiée.");
      } finally { if (!cancelled) setBusy(false); }
    })();
    return () => { cancelled = true; };
  }, []);
  async function start() {
    if (busy || session.current) return;
    setBusy(true);
    try {
      const created = await startPersistentGame(thunderfighterEngine, createIndexedDbGameStorage(),
        { ...options, sessionId: crypto.randomUUID() }, { seed: Math.floor(Math.random() * 0x100000000) });
      session.current = created;
      setState(created.getState());
      setLegal(created.getLegalActions());
      setNotice("Nouvelle partie créée et sauvegardée.");
    } catch { setNotice("Impossible de commencer ; aucune partie enregistrée n'a été remplacée."); }
    finally { setBusy(false); }
  }
  function choose(action: ThunderfighterAction) {
    if (busy || !legal.some(a => JSON.stringify(a) === JSON.stringify(action))) return;
    setSelection(action);
  }
  async function confirm() {
    if (busy || !selection || !session.current || !state) return;
    if (!legal.some(a => JSON.stringify(a) === JSON.stringify(selection))) {
      setSelection(null);
      setNotice("Cette action n'est plus autorisée.");
      return;
    }
    setBusy(true);
    try {
      const result = await session.current.dispatch(selection);
      if (!result.accepted) setNotice("Action refusée : " + result.reason);
      else {
        const nextResult = getThunderfighterResult(result.state);
        const shots = result.state.lastShot ?? [];
        setState(result.state);
        setLegal(session.current.getLegalActions());
        setNotice(nextResult.outcome === "win" ? `Victoire ! Score : ${nextResult.officialScore}.` :
          nextResult.outcome === "loss" ? `Défaite : ${nextResult.reason === "armor" ? "armure excessive" : "impasse"}.` :
          shots.length ? `${shots.length > 1 ? "Double tir" : "Tir"} : ${shots.map(labelOf).join(" et ")}.` :
          `Coup enregistré : ${actionLabel(selection)}.`);
      }
      setSelection(null);
    } catch { setNotice("Enregistrement impossible. L'action n'a pas été validée."); }
    finally { setBusy(false); }
  }
  const preview = state && selection ? previewThunderfighterAction(state, selection) : null;
  const figures = state?.figureSlots ?? [];
  const result = state ? getThunderfighterResult(state) : null;
  const search = state ? getSearchPresentation(state) : null;
  const placement = state && state.pendingFigures.length ? getFigurePlacementOptions(state) : null;
  return <section className="thunder-board" aria-labelledby="thunder-title">
    <h2 id="thunder-title">Thunderfighter · Poste de commandement</h2>
    <p className="help-note">Aventure spatiale rétrofuturiste · Gridcannon V2. Chaque action est prévisualisée sans modifier la partie, puis confirmée et sauvegardée une seule fois.</p>
    <p className="thunder-notice" role="status" aria-live="polite">{notice}</p>
    {!state ? <button type="button" className="primary-action" onClick={() => void start()} disabled={busy}>Commencer une partie</button> : <>
      <div className="thunder-metrics">
        <span>Phase : {phaseLabels[state.phase]}</span><span>Pioche : {state.drawPile.length}</span>
        <span>Figures neutralisées : {result?.defeatedCount} / 12</span>
        <span>Cartes physiques : {result?.physicalCardCount} / 54</span>
      </div>
      {state.outcome !== "in-progress" ? <p className="thunder-result" role="status">
        <strong>{state.outcome === "win" ? "Victoire" : "Défaite"}</strong>
        {state.outcome === "win" ? ` · Score officiel : ${result?.officialScore}` :
          ` · ${state.lossReason === "armor" ? "Résistance d'armure impossible à franchir" : "Impasse"}`}
      </p> : null}
      {state.pendingFigures[0] ? <p className="thunder-pending">Figure à positionner : <strong>{labelOf(state.pendingFigures[0])}</strong>. {placement?.mode === "rescue" ? "Placement de secours du moteur." : ""}</p> : null}
      {state.pendingNumeric ? <p className="thunder-pending">Carte piochée : <strong>{labelOf(state.pendingNumeric)}</strong>. Choisissez une destination autorisée ou une action spéciale.</p> : null}
      {search?.visible ? <section className="thunder-search" aria-label="Recherche">
        <h3>Recherche d'un adversaire</h3>
        <p>Cartes numériques traversées : {search.revealedNumerics.length}. Elles seront replacées sous la pioche selon le moteur.</p>
        <div className="thunder-reserve">{search.revealedNumerics.map(id => <Card key={id} id={id} />)}</div>
        {search.integrityStatus === "invalid" ? <p role="alert">Anomalie d'intégrité détectée. Aucune correction automatique.</p> : null}
      </section> : null}
      <h3>Champ de bataille · 3 × 3</h3>
      <div className="thunder-battlefield">
        <div className="thunder-top-slots">{figures.slice(0, 3).map((id, i) => <div key={i} className="thunder-slot"><small>Nord {i + 1}</small>{id ? <Card id={id} defeated={state.defeatedFigures?.includes(id)} /> : <span>Libre</span>}</div>)}</div>
        <div className="thunder-middle">
          <div className="thunder-side-slots">{[11, 10, 9].map(i => <div className="thunder-slot" key={i}><small>Ouest {i - 8}</small>{figures[i] ? <Card id={figures[i]!} defeated={state.defeatedFigures?.includes(figures[i]!)} /> : <span>Libre</span>}</div>)}</div>
          <div className="thunder-grid">{state.grid.map((pile, i) => <div className="thunder-pile" key={i}>
            <strong>Pile {i + 1} · {pile.length} carte(s)</strong>
            {pile.length ? <Card id={pile[pile.length - 1]} /> : <span>Emplacement vide</span>}
          </div>)}</div>
          <div className="thunder-side-slots">{[3, 4, 5].map(i => <div className="thunder-slot" key={i}><small>Est {i - 2}</small>{figures[i] ? <Card id={figures[i]!} defeated={state.defeatedFigures?.includes(figures[i]!)} /> : <span>Libre</span>}</div>)}</div>
        </div>
        <div className="thunder-bottom-slots">{[8, 7, 6].map(i => <div key={i} className="thunder-slot"><small>Sud {i - 5}</small>{figures[i] ? <Card id={figures[i]!} defeated={state.defeatedFigures?.includes(figures[i]!)} /> : <span>Libre</span>}</div>)}</div>
      </div>
      <h3>Résistance et armure</h3>
      <div className="thunder-armor">{figures.filter((id): id is string => id !== null).map(id =>
        <p key={id}>{labelOf(id)} · Résistance {resistance(state, id)} ({valueOf(id)} + {(state.armorCards ?? []).filter(a => a.figureId === id).reduce((sum, a) => sum + valueOf(a.cardId), 0)} armure) · {state.defeatedFigures?.includes(id) ? "Neutralisé" : "Actif"}</p>
      )}</div>
      <h3>Réserve spéciale · {state.specialReserve.length} disponible(s)</h3>
      <div className="thunder-reserve">{state.specialReserve.map(id => <Card key={id} id={id} />)}</div>
      <p className="help-note">Actions spéciales consommées : {state.spentSpecials.length}. La réserve ne sert pas de score tant que la victoire n'est pas obtenue.</p>
      <h3>Actions autorisées</h3>
      {state.outcome === "in-progress" && !selection ? <div className="thunder-actions">
        {legal.length ? legal.map((action, index) =>
          <button type="button" className="secondary-action" key={index} disabled={busy} onClick={() => choose(action)}>{actionLabel(action)}</button>
        ) : <p>Aucune action légale. Le moteur conserve l'état actuel.</p>}
      </div> : null}
      {selection && preview ? <div className="thunder-confirm" role="group" aria-label="Prévisualisation sans mutation">
        <h3>Prévisualisation — aucune modification enregistrée</h3>
        <p>{preview.message}</p>
        <p>Intégrité physique prévue : {preview.accepted && preview.changingCards ? "54 / 54 cartes" : "À vérifier"}</p>
        <button type="button" className="primary-action" disabled={busy || !preview.accepted} onClick={() => void confirm()}>Confirmer et enregistrer ce coup</button>
        <button type="button" className="back-link" disabled={busy} onClick={() => setSelection(null)}>Annuler sans modifier</button>
      </div> : null}
    </>}
  </section>;
}
