import { useEffect, useRef } from "react";
import type { Locale } from "../i18n/language.ts";
import type { GameStatistics } from "../ports/local-storage.ts";
import { statisticsOverview } from "../application/statistics-overview.ts";
import "./SkydeckStatistics.css";

const art = (path: string) => import.meta.env.BASE_URL + "art/" + path + ".webp";

export default function SkydeckStatistics({ language, statistics, pending, error, onBack, onSettings }: {
  language: Locale;
  statistics: GameStatistics | null;
  pending: boolean;
  error: boolean;
  onBack: () => void;
  onSettings: () => void;
}) {
  const tr = (fr: string, en: string) => language === "fr" ? fr : en;
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);
  const s = statisticsOverview(statistics);
  const format = (n: number) => new Intl.NumberFormat(language).format(n);
  const results = [
    { key: "won", label: tr("Victoires", "Victories"), value: s.won, icon: "victory" },
    { key: "lost", label: tr("Défaites", "Defeats"), value: s.lost, icon: "defeat" },
    { key: "abandoned", label: tr("Abandons", "Abandoned"), value: s.abandoned, icon: "flag" },
  ];
  return <article className="sd-log" data-i18n-ignore aria-labelledby="game-title">
    <header className="sd-log-header">
      <button type="button" onClick={onBack} aria-label={tr("Retour à Skydeck", "Back to Skydeck")}>←</button>
      <img src={art("logos/skydeck/board")} alt="Skydeck"/>
      <button type="button" onClick={onSettings} aria-label={tr("Paramètres", "Settings")}><img src={art("icons/skydeck/settings")} alt=""/></button>
    </header>
    <h1 id="game-title" ref={heading} tabIndex={-1}>{tr("Journal de bord", "Captain’s Log")}</h1>
    {pending || error ? <p className="sd-log-message" role={error ? "alert" : "status"}>{error ? tr("Statistiques indisponibles.", "Statistics unavailable.") : tr("Chargement du journal…", "Loading the log…")}</p> :
      <div className="sd-log-paper" data-ready="true" style={{backgroundImage: "url(" + art("manual/skydeck/parchment-texture") + ")"}}>
        <div className="sd-log-total">
          <img src={art("icons/skydeck/compass")} alt=""/>
          <span>{tr("Campagnes closes", "Closed campaigns")}</span>
          <strong data-stat="total">{format(s.total)}</strong>
          {s.total === 0 && <p>{tr("Votre légende reste à écrire.", "Your legend is yet to be written.")}</p>}
        </div>
        <dl className="sd-log-results">
          {results.map(r => <div key={r.key} className={"sd-log-result " + r.key}>
            <dt>{r.key === "abandoned" ? <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 28V4m1 1c6-5 10 5 17 0v14c-7 5-11-5-17 0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg> : <img src={art("icons/skydeck/" + r.icon)} alt=""/>}{r.label}</dt>
            <dd data-stat={r.key}>{format(r.value)}</dd>
          </div>)}
        </dl>
        <section className="sd-log-performance" aria-label={tr("Performance", "Performance")}>
          <h2>{tr("Taux de victoire", "Victory rate")}</h2>
          <div className="sd-log-gauge">
            <svg viewBox="0 0 220 116" aria-hidden="true">
              <path d="M18 104 A92 92 0 0 1 202 104" fill="none" stroke="#d0b98d" strokeWidth="12" pathLength="100"/>
              {s.rate !== null && <path d="M18 104 A92 92 0 0 1 202 104" fill="none" stroke="#79501f" strokeWidth="12" pathLength="100" strokeDasharray={String(s.rate * 100) + " 100"}/>}
              {Array.from({length: 11}, (_, i) => { const angle = Math.PI + i * Math.PI / 10; return <line key={i} x1={110 + 78 * Math.cos(angle)} y1={104 + 78 * Math.sin(angle)} x2={110 + 70 * Math.cos(angle)} y2={104 + 70 * Math.sin(angle)} stroke="#79501f" strokeWidth="1.5"/>; })}
            </svg>
            <strong data-stat="rate">{s.rateLabel}</strong>
          </div>
          <p>{tr("Hors abandons", "Excluding abandoned campaigns")}</p>
          <div className="sd-log-distribution" aria-hidden="true">{s.shares.map((share, i) => <span key={i} className={results[i].key} style={{width: (share * 100) + "%"}}/>)}</div>
          <ul className="sd-log-legend" aria-label={tr("Répartition des campagnes closes", "Closed campaign distribution")}>{results.map((r, i) => <li key={r.key} className={r.key}><span>{r.label}</span> <b>{s.total ? format(Math.round(s.shares[i] * 100)) + " %" : "—"}</b></li>)}</ul>
        </section>
      </div>}
  </article>;
}
