import { useEffect, useRef, useState } from "react";
import { createIndexedDbGameStorage } from "../adapters/indexeddb-game-storage.ts";
import { presentGameStatistics, type GameSummary } from "../application/game-results.ts";
import type { GameStatistics } from "../ports/local-storage.ts";

export function GameStatisticsPanel({ statistics }: { statistics: GameStatistics | null }) {
  const stats = presentGameStatistics(statistics);
  return <dl className="game-facts stats-list result-statistics" aria-label="Statistiques des parties normales">
    <div><dt>Parties terminées ou abandonnées</dt><dd>{stats.played}</dd></div>
    <div><dt>Victoires</dt><dd>{stats.won}</dd></div>
    <div><dt>Défaites</dt><dd>{stats.lost}</dd></div>
    <div><dt>Abandons</dt><dd>{stats.abandoned}</dd></div>
    <div><dt>Taux de victoire</dt><dd>{stats.victoryRate}</dd></div>
  </dl>;
}

export default function GameResultPanel({ summary, tutorial, onReplay, disabled = false }: {
  summary: GameSummary;
  tutorial: boolean;
  onReplay: () => void;
  disabled?: boolean;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [statistics, setStatistics] = useState<GameStatistics | null>(null);
  const [statsError, setStatsError] = useState(false);
  useEffect(() => { heading.current?.focus(); }, [summary.outcome, summary.gameId]);
  useEffect(() => {
    if (tutorial) return;
    let cancelled = false;
    void (async () => {
      try {
        const data = await createIndexedDbGameStorage().readStatistics(summary.gameId);
        if (!cancelled) { setStatistics(data ?? null); setStatsError(false); }
      } catch {
        if (!cancelled) setStatsError(true);
      }
    })();
    return () => { cancelled = true; };
  }, [summary.gameId, tutorial]);
  return <section className="game-final-screen" data-result={summary.outcome} aria-labelledby="game-final-title">
    <p className="game-final-eyebrow">{tutorial ? "Entraînement terminé · Aucun résultat enregistré" : "Bilan de la partie"}</p>
    <h2 ref={heading} tabIndex={-1} id="game-final-title">{summary.title}</h2>
    <p className="game-final-explanation">{summary.explanation}</p>
    <ul className="game-final-facts">{summary.details.map((detail, index) => <li key={index}>{detail}</li>)}</ul>
    {summary.scoreLabel && summary.score !== null ? <p className="game-final-score"><strong>{summary.score}</strong><span>{summary.scoreLabel}</span></p> : null}
    {tutorial ? <p>Cette mission n'a modifié aucune partie normale ni aucune statistique.</p> : <>
      <h3>Mes statistiques · parties normales uniquement</h3>
      {statsError ? <p role="alert">Statistiques locales indisponibles ; la partie terminée est conservée.</p> :
        <GameStatisticsPanel statistics={statistics} />}
      <p className="help-note">Taux = victoires / (victoires + défaites). Les abandons et entraînements ne comptent pas dans ce calcul. « — » signifie qu'aucune partie normale n'a encore été conclue.</p>
    </>}
    <nav className="game-final-actions" aria-label="Après la partie">
      <button type="button" className="primary-action" disabled={disabled} onClick={onReplay}>{tutorial ? "Recommencer l'entraînement" : "Rejouer"}</button>
      <a href="#" className="secondary-action">Retour au catalogue</a>
    </nav>
  </section>;
}
