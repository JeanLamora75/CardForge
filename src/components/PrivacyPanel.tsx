import { useEffect, useRef, useState } from "react";
import { createPrivacyGameStorage } from "../adapters/indexeddb-privacy-storage.ts";
import {
  PRIVACY_INVENTORY, DELETION_POLICY, executePrivacyDeletion,
  PRIVACY_GAME_IDS, type PrivacyDeletionScope, type PrivacyGameId,
} from "../application/privacy.ts";
import type { Locale } from "../i18n/language.ts";

const names: Record<PrivacyGameId,string> = {
  "clear-the-dungeon": "Grim Delve", gridcannon: "Thunderfighter",
  "card-capture": "Skydeck", "loot-the-loop": "Midnight Syndicate",
  regicide: "Les Douze Tyrans",
};
const explanation = (scope: PrivacyDeletionScope, english: boolean): string =>
  scope.kind === "game" ?
    english ? `Delete the saved game, ALL historical results and statistics for ${names[scope.gameId]}? Other games and all preferences will be preserved. This cannot be undone.`
            : `Supprimer la sauvegarde, TOUS les résultats historiques et les statistiques de ${names[scope.gameId]} ? Les autres jeux et toutes les préférences seront conservés. Cette action est irréversible.`
  : scope.kind === "preferences" ?
    english ? "Delete only CardForge language, audio, animation, hint and per-game learning preferences? All game saves, results and statistics will remain. This cannot be undone."
            : "Supprimer uniquement la langue, les réglages audio, animations et aides, ainsi que les choix d'apprentissage par jeu ? Toutes les sauvegardes, les résultats et les statistiques seront conservés. Cette action est irréversible."
  : english ? "Delete ALL CardForge saves for every game, historical results, statistics and preferences? Your games will be lost. This cannot be undone. Other websites' data is not affected."
            : "Supprimer TOUTES les sauvegardes de chaque jeu CardForge, les résultats historiques, les statistiques et les préférences ? Toutes les parties seront perdues. Cette action est irréversible. Les données des autres sites ne sont pas concernées.";

export default function PrivacyPanel({ language }: { language: Locale }) {
  const english = language === "en";
  const [selectedGame, setSelectedGame] = useState<PrivacyGameId>("clear-the-dungeon");
  const [pending, setPending] = useState<PrivacyDeletionScope | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (pending) cancelRef.current?.focus();
    else if (!busy) lastTrigger.current?.focus();
  }, [pending, busy]);

  function request(scope: PrivacyDeletionScope, trigger: HTMLButtonElement) {
    if (busy) return;
    lastTrigger.current = trigger;
    setFeedback(null);
    setPending(scope);
  }
  async function confirm() {
    if (!pending || busy) return;
    setBusy(true);
    const scope = pending;
    try {
      let prefs: Storage | null = null;
      try { prefs = window.localStorage; } catch { /* storage unavailable */ }
      await executePrivacyDeletion(scope, true, createPrivacyGameStorage(), prefs);
      setPending(null);
      // React's in-memory game sessions must be recreated after a successful erasure.
      // Also resets removed language/appearance settings without restoring defaults to storage.
      window.location.reload();
    } catch {
      setFeedback(english
        ? "Some data could not be deleted. Check your data before trying again."
        : "Certaines données n’ont pas pu être supprimées. Vérifiez vos données avant de réessayer.");
      setPending(null);
    } finally { setBusy(false); }
  }

  return <section className="privacy-panel" aria-labelledby="privacy-title" data-i18n-ignore>
    <h2 id="privacy-title">{english ? "Privacy and my data" : "Confidentialité et mes données"}</h2>
    <p className="privacy-summary"><strong>{english?"Your data stays on this device":"Vos données restent sur votre appareil"}</strong></p><details className="forge-privacy-details"><summary>{english?"Privacy information":"Informations de confidentialité"}</summary><p>{english
      ? "CardForge runs without an account, advertising or game-data synchronization. Saved games, results, statistics and preferences are stored in this browser, on this device. Closing or navigating away does not delete them."
      : "CardForge fonctionne sans compte, sans publicité et sans synchronisation des données de jeu. Les parties, résultats, statistiques et préférences sont stockés dans ce navigateur, sur cet appareil. Quitter l’application ou changer d’écran ne les efface pas."}</p>
    <p>{english
      ? "Your data may be lost if you clear your browser’s app data. Links to external websites open only when you select them."
      : "Vos données peuvent être perdues si vous effacez les données de l’application dans votre navigateur. Les sites externes ne s’ouvrent que si vous choisissez un lien."}</p></details>
    <details className="forge-privacy-details inventory-details"><summary>{english ? "What is stored?" : "Quelles données sont conservées ?"}</summary>
    <ul className="privacy-inventory">{PRIVACY_INVENTORY.map(item =>
      <li key={item.id}>
        <strong>{english ? item.descriptionEn : item.descriptionFr}</strong>
        <span>{english ? item.effectEn : item.effectFr}</span>
        <small>{item.area === "indexeddb" ? (english ? "Saved on this device" : "Sauvegardé sur cet appareil") : item.area === "localStorage" ? (english ? "Saved preference" : "Préférence mémorisée") : english ? "Not saved after the session" : "Non conservé après la session"}</small>
      </li>
    )}</ul></details>
    <h3>{english ? "Manage my data" : "Gérer mes données"}</h3>
    <p>{english ? "Choose what to delete. You will be asked to confirm." :
      "Choisissez les données à supprimer. Une confirmation vous sera demandée."}</p>
    <div className="privacy-actions" data-policy={DELETION_POLICY} inert={!!pending}>
      <details className="privacy-action"><summary>{english?"Manage a game’s data":"Gérer les données d’un jeu"}</summary>
        <label htmlFor="privacy-game">{english ? "Game" : "Jeu"}</label>
        <select id="privacy-game" disabled={busy || !!pending} value={selectedGame}
          onChange={event => setSelectedGame(event.target.value as PrivacyGameId)}>
          {PRIVACY_GAME_IDS.map(id => <option key={id} value={id}>{names[id]}</option>)}
        </select>
        <p>{english ? "Deletes this game's save, ALL its past results and its statistics. Preserves all other games and your preferences." :
          "Supprime la sauvegarde de ce jeu, TOUS ses résultats passés et ses statistiques. Conserve les autres jeux et les préférences."}</p>
        <button className="secondary-action privacy-danger" type="button" disabled={busy || !!pending}
          onClick={event => request({ kind: "game", gameId: selectedGame }, event.currentTarget)}>
          {english ? "Delete this game's data" : "Supprimer les données de ce jeu"}
        </button>
      </details>
      <details className="privacy-action"><summary>{english ? "Preferences only" : "Préférences uniquement"}</summary>
        <p>{english ? "Clears CardForge language, shared settings and learning choices. Preserves ALL game saves, results and statistics." :
          "Efface la langue, les réglages et les choix d’apprentissage CardForge. Conserve TOUTES les parties, résultats et statistiques."}</p>
        <button className="secondary-action privacy-danger" type="button" disabled={busy || !!pending}
          onClick={event => request({ kind: "preferences" }, event.currentTarget)}>
          {english ? "Delete preferences" : "Supprimer les préférences"}
        </button>
      </details>
      <div className="privacy-action privacy-sensitive-zone">
        <p className="privacy-zone-label"><span aria-hidden="true">⚠ </span>{english?"Danger zone":"Zone sensible"}</p>
        <h4>{english ? "All CardForge data" : "Toutes les données CardForge"}</h4>
        <p>{english ? "Irreversibly erases every game's saves, results and statistics, plus all CardForge preferences." :
          "Efface irréversiblement les sauvegardes, résultats et statistiques de tous les jeux ainsi que toutes les préférences CardForge."}</p>
        <button className="secondary-action privacy-danger" type="button" disabled={busy || !!pending}
          onClick={event => request({ kind: "all" }, event.currentTarget)}>
          {english ? "Delete all CardForge data" : "Supprimer toutes les données CardForge"}
        </button>
      </div>
    </div>
    {pending ? <div className="privacy-confirm" role="alertdialog" aria-modal="true"
      aria-labelledby="privacy-confirm-title" aria-describedby="privacy-confirm-description"
      onKeyDown={event => {
        if (event.key === "Escape" && !busy) {
          event.preventDefault();
          event.stopPropagation();
          setPending(null);
        }
        if (event.key === "Tab") {
          if (event.shiftKey && document.activeElement === cancelRef.current) {
            event.preventDefault();
            confirmRef.current?.focus();
          } else if (!event.shiftKey && document.activeElement === confirmRef.current) {
            event.preventDefault();
            cancelRef.current?.focus();
          }
        }
      }}>
      <h4 id="privacy-confirm-title">{english ? "Confirm permanent deletion" : "Confirmer la suppression définitive"}</h4>
      <p id="privacy-confirm-description">{explanation(pending, english)}</p>
      <div className="privacy-confirm-actions">
        <button ref={cancelRef} type="button" className="secondary-action" disabled={busy} onClick={() => setPending(null)}>
          {english ? "Cancel — keep my data" : "Annuler — conserver mes données"}
        </button>
        <button ref={confirmRef} type="button" className="primary-action" disabled={busy} onClick={() => void confirm()}>
          {busy ? (english ? "Deleting…" : "Suppression…") : (english ? "Yes, delete permanently" : "Oui, supprimer définitivement")}
        </button>
      </div>
    </div> : null}
    {feedback ? <p className="storage-warning" role="alert">{feedback}</p> : null}
  </section>;
}
