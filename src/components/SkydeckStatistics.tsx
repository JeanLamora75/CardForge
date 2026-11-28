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
      <button type="button" onClick={onBack} aria-label={tr("Retour à Skydeck", "Back to Skydeck")}><img className="sd-log-back-icon" src={art("icons/skydeck/arrow-right")} alt=""/></button>
      <img src={art("logos/skydeck/board")} alt="Skydeck"/>
      <button type="button" onClick={onSettings} aria-label={tr("Paramètres", "Settings")}><img src={art("icons/skydeck/settings")} alt=""/></button>
    </header>
    <h1 id="game-title" ref={heading} tabIndex={-1}><img src={art("banners/skydeck/section-heading")} alt=""/><span>{tr("Journal de bord", "Captain’s Log")}</span></h1>
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
            <dt>{r.key === "abandoned" ? <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 3 39 13 51 11 50 24 61 32 50 40 51 53 39 51 32 61 25 51 13 53 14 40 3 32 14 24 13 11 25 13Z" fill="#ab8246" stroke="#60421d" strokeWidth="2"/><circle cx="32" cy="32" r="21" fill="#6c4b2a" stroke="#f4d391" strokeWidth="2"/><circle cx="32" cy="32" r="17" fill="#e8ca8b" stroke="#382619"/><path d="M24 46V17m1 2c7-5 11 5 18 0v14c-7 5-11-5-18 0" fill="#fff0cc" stroke="#53371e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg> : <img src={art("icons/skydeck/" + r.icon)} alt=""/>}{r.label}</dt>
            <dd data-stat={r.key}>{format(r.value)}</dd>
          </div>)}
        </dl>
        <section className="sd-log-performance" aria-label={tr("Performance", "Performance")}>
          <h2>{tr("Taux de victoire", "Victory rate")}</h2>
          <div className="sd-log-gauge">
            <svg viewBox="0 0 260 142" aria-hidden="true">
              <defs>
                <linearGradient id="sd-log-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#75501f"/><stop offset=".35" stopColor="#e8c682"/><stop offset=".7" stopColor="#aa7837"/><stop offset="1" stopColor="#614019"/></linearGradient>
                <radialGradient id="sd-log-dial"><stop offset="0" stopColor="#fff0cc"/><stop offset="1" stopColor="#d4b77c"/></radialGradient>
              </defs>
              <path d="M10 130 A120 120 0 0 1 250 130 Z" fill="url(#sd-log-brass)" stroke="#65421e" strokeWidth="2"/>
              <path d="M20 127 A110 110 0 0 1 240 127 Z" fill="url(#sd-log-dial)" stroke="#79552e" strokeWidth="2"/>
              <path d="M30 127 A100 100 0 0 1 230 127" fill="none" stroke="#b49a69" strokeWidth="5"/>
              {Array.from({length:21},(_,i)=>{const angle=Math.PI+i*Math.PI/20;const inner=i%5===0?81:89;return <line key={i} x1={130+97*Math.cos(angle)} y1={127+97*Math.sin(angle)} x2={130+inner*Math.cos(angle)} y2={127+inner*Math.sin(angle)} stroke="#654725" strokeWidth={i%5===0?2:1}/>;})}
              <g fill="#53391e" fontSize="11" textAnchor="middle"><text x="57" y="121">0</text><text x="130" y="57">50</text><text x="203" y="121">100</text></g>
              {s.rate!==null && <g className="sd-log-needle" data-rate={s.rate} transform={"rotate("+ (s.rate*180) +" 130 127)"}><path d="M131 122 L42 127 L131 132 Z" fill="#923d2c" stroke="#58301b" strokeWidth="1.2"/></g>}
              <circle cx="130" cy="127" r="7" fill="url(#sd-log-brass)" stroke="#594022" strokeWidth="2"/>
            </svg>
            <strong data-stat="rate">{s.rateLabel}</strong>
          </div>
          <p className="sd-log-ratio" data-stat="ratio">{s.completed ? tr(format(s.won)+(s.won===1?" victoire sur ":" victoires sur ")+format(s.completed),format(s.won)+(s.won===1?" victory out of ":" victories out of ")+format(s.completed)) : tr("Aucune campagne achevée","No completed campaigns")}</p>
          <p className="sd-log-exclusion">{tr("Hors abandons", "Excluding abandoned campaigns")}</p>
          <h3 className="sd-log-distribution-title">{tr("Répartition des campagnes","Campaign distribution")}</h3>
          <div className="sd-log-distribution" aria-hidden="true">{s.shares.map((share, i) => <span key={i} className={results[i].key} style={{width: (share * 100) + "%"}}/>)}</div>
          <ul className="sd-log-legend" aria-label={tr("Répartition des campagnes closes", "Closed campaign distribution")}>{results.map((r, i) => <li key={r.key} className={r.key}><span>{r.label}</span> <b>{s.total ? format(Math.round(s.shares[i] * 100)) + " %" : "—"}</b></li>)}</ul>
        </section>
      </div>}
  </article>;
}
