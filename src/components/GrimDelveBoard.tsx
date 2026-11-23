import { useEffect, useRef, useState } from "react";
import { makeDeckWithJokers } from "../core/cards.ts";
import { grimDelveEngine, GRIM_DELVE_GAME_ID, GRIM_DELVE_RULES_VERSION, type GrimDelveAction, type GrimDelveState } from "../games/clear-the-dungeon/engine.ts";
import { createIndexedDbGameStorage } from "../adapters/indexeddb-game-storage.ts";
import { resumePersistentGame, startPersistentGame, type PersistentGameSession } from "../application/persistent-game-session.ts";

type Session = PersistentGameSession<GrimDelveState, GrimDelveAction>;
const cards = new Map(makeDeckWithJokers().map(card => [card.id, card]));
const factions = { hearts: "Cendres", diamonds: "Cristal", clubs: "Ronces", spades: "Ombres" } as const;
const symbols = { hearts: "♥", diamonds: "♦", clubs: "♣", spades: "♠" } as const;
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
function cardLabel(id: string) {
  const card = cards.get(id);
  if (!card) return id;
  if ("kind" in card) return "Joker · puissance 10 · enseigne libre";
  const title = card.rank === 11 ? "Valet" : card.rank === 12 ? "Dame" : card.rank === 13 ? "Roi" : String(card.rank);
  return `${title} · ${factions[card.suit]} (${symbols[card.suit]})`;
}
function Card({ id, selected = false, onClick, disabled = false }: {
  id: string; selected?: boolean; onClick?: () => void; disabled?: boolean;
}) {
  const card = cards.get(id);
  const monster = card && "rank" in card && card.rank >= 11;
  const figure = monster ? ("rank" in card! ? card.rank === 11 ? "♜" : card.rank === 12 ? "♛" : "♚" : "") : "✧";
  return <button type="button" className="grim-card" data-monster={monster || undefined}
    aria-pressed={onClick ? selected : undefined} aria-label={cardLabel(id)}
    onClick={onClick} disabled={disabled || !onClick}>
    <span className="grim-card-crest" aria-hidden="true">{figure}</span>
    <strong>{cardLabel(id)}</strong>
    <small>{monster ? "Résistance" : "Puissance"} : {card && "rank" in card ? card.rank : 10}</small>
    <small className="grim-card-id">{id}</small>
  </button>;
}
const sameAction = (a: GrimDelveAction, b: GrimDelveAction) =>
  a.type === b.type && ("cardId" in a ? a.cardId : undefined) === ("cardId" in b ? b.cardId : undefined) &&
  ("monsterId" in a ? a.monsterId : undefined) === ("monsterId" in b ? b.monsterId : undefined);

export default function GrimDelveBoard() {
  const session = useRef<Session | null>(null);
  const [state, setState] = useState<GrimDelveState | null>(null);
  const [legal, setLegal] = useState<readonly GrimDelveAction[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [notice, setNotice] = useState("Chargement du plateau…");
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const restored = await resumePersistentGame(grimDelveEngine, createIndexedDbGameStorage(), options);
        if (cancelled) return;
        session.current = restored ?? null;
        setState(restored?.getState() ?? null);
        setLegal(restored?.getLegalActions() ?? []);
        setNotice(restored ? "Partie locale restaurée, sans remélanger les cartes." : "Aucune partie enregistrée. Lancez une partie pour ouvrir le plateau.");
      } catch {
        if (!cancelled) setNotice("Impossible de lire cette partie. Aucune sauvegarde n'a été écrasée.");
      } finally { if (!cancelled) setBusy(false); }
    })();
    return () => { cancelled = true; };
  }, []);
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
    } catch { setNotice("Impossible de démarrer une partie. Vérifiez le stockage local ; aucune partie existante n'a été remplacée."); }
    finally { setBusy(false); }
  }
  async function dispatch(action: GrimDelveAction) {
    if (busy || !session.current || !legal.some(candidate => sameAction(candidate, action))) return;
    if (action.type === "discard-remaining" && !window.confirm("Défausser toutes les cartes restantes ? Les dégâts sont irréversibles.")) return;
    if (action.type === "discard" && !window.confirm("Défausser cette carte ? Cela ajoute un dégât irréversible.")) return;
    setBusy(true);
    try {
      const result = await session.current.dispatch(action);
      if (!result.accepted) {
        setNotice("Coup refusé par le moteur : " + result.reason);
      } else {
        setState(result.state);
        setLegal(session.current.getLegalActions());
        setSelected(null);
        setNotice(result.state.outcome === "win" ? "Victoire ! Les 12 monstres sont vaincus." :
          result.state.outcome === "loss" ? "Défaite : " + (result.state.endReason === "damage" ? "7 dégâts." : "pioche épuisée.") :
          `Action enregistrée : ${actionName[action.type]}.`);
      }
    } catch { setNotice("Sauvegarde impossible. Le coup n'a pas été appliqué ; réessayez."); }
    finally { setBusy(false); }
  }
  const actions = selected ? legal.filter(action => "cardId" in action && action.cardId === selected) : [];
  return <section className="grim-board" aria-labelledby="grim-heading">
    <h2 id="grim-heading">Grim Delve · Plateau de jeu</h2>
    <p className="help-note">Dark Fantasy · Classic 1.1.0. Les seules commandes proposées sont celles autorisées par le moteur. Les cartes posées restent provisoires jusqu'au déclenchement d'une attaque.</p>
    <p role="status" aria-live="polite" className="grim-notice">{notice}</p>
    {!state ? <button type="button" className="primary-action" disabled={busy} onClick={() => void start()}>Commencer une partie</button> : <>
      <div className="grim-counters" aria-label="Progression">
        <span>Main n° {state.handNumber}</span><span>Pioche : {state.drawPile.length}</span>
        <span>Dégâts : {state.damages.length} / 7</span><span>Monstres vaincus : {state.defeated.length} / 12</span>
      </div>
      {state.outcome !== "in-progress" ? <p className="grim-ending" role="status"><strong>{state.outcome === "win" ? "Victoire" : "Défaite"}</strong> — {state.outcome === "win" ? `Score : ${state.victoryScore ?? state.drawPile.length} cartes dans la pioche.` : state.endReason === "damage" ? "Sept dégâts reçus." : "Pioche épuisée."}</p> : null}
      <h3>Monstres et attaques en préparation</h3>
      <div className="grim-columns">
        {state.columns.map((column, index) => {
          const monster = column[0];
          const attack = state.attacks.find(a => a.monsterId === monster);
          return <div className="grim-column" key={index}>
            <h4>Colonne {index + 1} · {column.length} monstre(s)</h4>
            {monster ? <Card id={monster} /> : <span>Colonne libérée</span>}
            {attack?.powers.map(power => <div key={power.cardId} className="grim-placed">
              <Card id={power.cardId} onClick={() => setSelected(power.cardId)} disabled={busy} selected={selected === power.cardId} />
              <small>{power.handNumber === state.handNumber ? "Reprise possible selon le moteur" : "Pose antérieure"}</small>
            </div>)}
            {column.length > 1 ? <small>{column.length - 1} monstre(s) masqué(s)</small> : null}
          </div>;
        })}
      </div>
      <h3>Cartes en main</h3>
      <div className="grim-hand">{state.hand.length ? state.hand.map(id =>
        <Card key={id} id={id} onClick={() => setSelected(id)} disabled={busy} selected={selected === id} />
      ) : <p>La main est vide.</p>}</div>
      {selected ? <div className="grim-actions" aria-label="Actions légales pour la carte sélectionnée">
        <h3>{cardLabel(selected)}</h3>
        {actions.length ? actions.map((action, index) => <button key={index} type="button" className="secondary-action"
          disabled={busy} onClick={() => void dispatch(action)}>
          {actionName[action.type]}{"monsterId" in action ? ` → ${cardLabel(action.monsterId)}` : ""}
        </button>) : <p>Aucune action autorisée pour cette carte actuellement.</p>}
        <button type="button" className="back-link" onClick={() => setSelected(null)}>Annuler la sélection</button>
      </div> : null}
      {state.outcome === "in-progress" ? <div className="grim-actions">
        {legal.some(action => action.type === "discard-remaining") ? <button type="button" className="secondary-action" disabled={busy}
          onClick={() => void dispatch({ type: "discard-remaining" })}>Défausser toute la main · dégâts irréversibles</button> : null}
        <button type="button" className="primary-action" disabled={busy || !legal.some(action => action.type === "end-hand")}
          onClick={() => void dispatch({ type: "end-hand" })}>Terminer la main</button>
      </div> : null}
    </>}
  </section>;
}
