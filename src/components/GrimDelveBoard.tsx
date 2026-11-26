import { useEffect, useRef, useState } from "react";
import { makeDeckWithJokers } from "../core/cards.ts";
import { grimDelveEngine, GRIM_DELVE_GAME_ID, GRIM_DELVE_RULES_VERSION, type GrimDelveAction, type GrimDelveState } from "../games/clear-the-dungeon/engine.ts";
import { createIndexedDbGameStorage } from "../adapters/indexeddb-game-storage.ts";
import { startPersistentGame, type PersistentGameSession } from "../application/persistent-game-session.ts";
import { resumeRegisteredGame } from "../application/registered-save-migrations.ts";
import { storageRecoveryMessage } from "../application/storage-recovery-messages.ts";
import { createTutorialSession } from "../application/learning.ts";
import { makeGrimDelveSummary, replayFinishedGame } from "../application/game-results.ts";
import GameResultPanel from "./GameResultPanel.tsx";
import { playGameplayEffect } from "../application/audio.ts";
import { translateUiText } from "../i18n/surface.ts";

type Session = Pick<PersistentGameSession<GrimDelveState, GrimDelveAction>, "getState" | "getLegalActions" | "dispatch">;
const cards = new Map(makeDeckWithJokers().map(card => [card.id, card]));
const factions = { hearts: "Cendres", diamonds: "Cristal", clubs: "Ronces", spades: "Ombres" } as const;
const symbols = { hearts: "♥", diamonds: "♦", clubs: "♣", spades: "♠" } as const;
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
function cardLabel(id: string) {
  const card = cards.get(id);
  if (!card) return id;
  if ("kind" in card) return "Joker · puissance 10 · enseigne libre";
  const title = card.rank === 11 ? "Valet" : card.rank === 12 ? "Dame" : card.rank === 13 ? "Roi" : String(card.rank);
  return `${title} · ${factions[card.suit]} (${symbols[card.suit]})`;
}
function Card({ id, selected = false, onClick, disabled = false, target = false }: {
  id: string; selected?: boolean; onClick?: () => void; disabled?: boolean; target?: boolean;
}) {
  const card = cards.get(id);
  const monster = card && "rank" in card && card.rank >= 11;
  const figure = monster ? ("rank" in card! ? card.rank === 11 ? "♜" : card.rank === 12 ? "♛" : "♚" : "") : "✧";
  return <button type="button" className="grim-card" data-monster={monster || undefined} data-faction={card && "suit" in card ? card.suit : "joker"} data-target={target || undefined}
    aria-pressed={onClick ? selected : undefined} aria-label={cardLabel(id)}
    onClick={onClick} disabled={disabled || !onClick}>
    <span className="gd-card-value" aria-hidden="true">{valueOf(id)}</span><span className="grim-card-crest" aria-hidden="true">{figure}</span>
    <strong>{cardLabel(id)}</strong>
    <small>{monster ? "Résistance" : "Puissance"} : {card && "rank" in card ? card.rank : 10}</small>
    
  </button>;
}
const sameAction = (a: GrimDelveAction, b: GrimDelveAction) =>
  a.type === b.type && ("cardId" in a ? a.cardId : undefined) === ("cardId" in b ? b.cardId : undefined) &&
  ("monsterId" in a ? a.monsterId : undefined) === ("monsterId" in b ? b.monsterId : undefined);

export default function GrimDelveBoard({ tutorial = false, hintsEnabled = true, onReplayTutorial }: { tutorial?: boolean; hintsEnabled?: boolean; onReplayTutorial?: () => void }) {
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
  async function dispatch(action: GrimDelveAction) {
    if (busy || !session.current || !legal.some(candidate => sameAction(candidate, action))) return;
    if (action.type === "discard-remaining" && !window.confirm(translateUiText("Défausser toutes les cartes restantes ? Les dégâts sont irréversibles.", document.documentElement.lang === "fr" ? "fr" : "en"))) return;
    if (action.type === "discard" && !window.confirm(translateUiText("Défausser cette carte ? Cela ajoute un dégât irréversible.", document.documentElement.lang === "fr" ? "fr" : "en"))) return;
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
    finally { setBusy(false); }
  }
  const actions = selected ? legal.filter(action => "cardId" in action && action.cardId === selected) : [];
  return <section className="grim-board" aria-labelledby="grim-heading">
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
    {hintsEnabled && state ? <details className="learning-context gd-context">
      <summary>Aide sur les actions autorisées ({legal.length})</summary>
      <p>Le moteur propose {legal.filter(a => a.type === "place-power").length} pose(s), {legal.filter(a => a.type === "trigger-attack").length} déclenchement(s) et {legal.filter(a => a.type === "take-back").length} reprise(s). Sélectionnez une carte pour voir exactement où agir.</p>
      <p>Une attaque exige deux cartes de puissance atteignant la résistance, puis une troisième carte de l'enseigne du monstre. Les Jokers valent 10 et remplacent une enseigne.</p>
    </details> : null}
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
          const target = actions.find(a => "monsterId" in a && a.monsterId === monster);
          const power = attack?.powers.reduce((sum,p)=>sum+valueOf(p.cardId),0) ?? 0;
          return <div className="grim-column" key={index}>
            <h4>Colonne {index + 1}</h4>
            {monster ? <div className="gd-monster-stack" data-hidden={column.length-1}><Card id={monster} target={!!target} onClick={target ? ()=>void dispatch(target) : undefined} disabled={busy}/></div> : <span className="gd-empty">Colonne libérée</span>}
            <div className="gd-attack-slots">
            {attack?.powers.map(power => <div key={power.cardId} className="grim-placed">
              <Card id={power.cardId} onClick={() => setSelected(power.cardId)} disabled={busy} selected={selected === power.cardId} />
              <small>{power.handNumber === state.handNumber ? "Reprise possible selon le moteur" : "Pose antérieure"}</small>
            </div>)}
            {monster ? Array.from({length:2-(attack?.powers.length??0)},(_,i)=><span className="gd-empty-slot" key={i} aria-label="Emplacement de puissance libre">+</span>) : null}
            </div>
            {monster ? <small className="gd-power-total">{power} / {valueOf(monster)}</small> : null}
            {column.length > 1 ? <small>{column.length - 1} monstre(s) masqué(s)</small> : null}
          </div>;
        })}
      </div>
      <p role="status" aria-live="polite" className="grim-notice">{notice}</p>
      <h3 className="gd-banner">Cartes en main</h3>
      <div className="grim-hand">{state.hand.length ? state.hand.map(id =>
        <Card key={id} id={id} onClick={() => setSelected(current=>current===id?null:id)} disabled={busy} selected={selected === id} />
      ) : <p>La main est vide.</p>}</div>
      {selected ? <div className="grim-actions" aria-label="Actions légales pour la carte sélectionnée">
        <h3>{cardLabel(selected)}</h3>
        {actions.length ? actions.map((action, index) => <button key={index} type="button" className="secondary-action"
          disabled={busy} onClick={() => void dispatch(action)}>
          {actionName[action.type]}{"monsterId" in action ? ` → ${cardLabel(action.monsterId)}` : ""}
        </button>) : <p>Aucune action autorisée pour cette carte actuellement.</p>}
        <button type="button" className="back-link" onClick={() => setSelected(null)}>Annuler la sélection</button>
      </div> : null}
      {state.outcome === "in-progress" ? <div className="grim-actions gd-footer">
        {legal.some(action => action.type === "discard-remaining") ? <button type="button" className="secondary-action" disabled={busy}
          onClick={() => void dispatch({ type: "discard-remaining" })}>Défausser toute la main · dégâts irréversibles</button> : null}
        <button type="button" className="primary-action" disabled={busy || !legal.some(action => action.type === "end-hand")}
          onClick={() => void dispatch({ type: "end-hand" })}>Terminer la main</button>
      </div> : null}
    </>}
  </section>;
}
