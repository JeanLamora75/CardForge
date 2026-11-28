import { useEffect, useRef } from "react";
import type { Locale } from "../i18n/language.ts";
import type { GameStatistics } from "../ports/local-storage.ts";
import { statisticsOverview } from "../application/statistics-overview.ts";
import "./SkydeckStatistics.css";

const art = (path: string) => import.meta.env.BASE_URL + "art/" + path + ".webp";

function CompassMedallion() {
  return <svg viewBox="0 0 64 64" className="sd-log-compass" aria-hidden="true">
    <defs>
      <linearGradient id="sd-compass-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#715020"/><stop offset=".32" stopColor="#f9dfa0"/><stop offset=".65" stopColor="#aa7432"/><stop offset="1" stopColor="#60401e"/></linearGradient>
      <radialGradient id="sd-compass-face"><stop offset="0" stopColor="#fff1ce"/><stop offset="1" stopColor="#b99255"/></radialGradient>
    </defs>
    <circle cx="32" cy="32" r="29" fill="url(#sd-compass-gold)" stroke="#67441e" strokeWidth="1.5"/>
    <circle cx="32" cy="32" r="24" fill="url(#sd-compass-face)" stroke="#785222" strokeWidth="1.5"/>
    {Array.from({length:16},(_,i)=> <path key={i} d="M32 10v3" stroke="#795527" strokeWidth={i%4===0?2:1} transform={"rotate("+i*22.5+" 32 32)"}/>)}
    <path d="M32 8 37 27 56 32 37 37 32 56 27 37 8 32 27 27Z" fill="url(#sd-compass-gold)" stroke="#67441e" strokeWidth="1"/>
    <path d="M32 8 32 32 37 27ZM56 32 32 32 37 37ZM32 56 32 32 27 37ZM8 32 32 32 27 27Z" fill="#725025"/>
    <circle cx="32" cy="32" r="4" fill="#e9c881" stroke="#67441e"/>
  </svg>;
}

function AbandonMedallion() {
  return <svg viewBox="0 0 64 64" className="sd-log-abandon-medallion" aria-hidden="true">
    <defs>
      <linearGradient id="sd-abandon-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#77501e"/><stop offset=".35" stopColor="#f5d99b"/><stop offset=".7" stopColor="#b17e3d"/><stop offset="1" stopColor="#5d3c1b"/></linearGradient>
      <radialGradient id="sd-abandon-face"><stop offset="0" stopColor="#f8e7b9"/><stop offset="1" stopColor="#bf9351"/></radialGradient>
    </defs>
    <path d="M32 2 39 12 51 10 50 23 62 32 50 41 51 54 39 52 32 62 25 52 13 54 14 41 2 32 14 23 13 10 25 12Z" fill="url(#sd-abandon-gold)" stroke="#61401e" strokeWidth="1.5"/>
    <circle cx="32" cy="32" r="23" fill="url(#sd-abandon-gold)" stroke="#60401f" strokeWidth="1.5"/>
    <circle cx="32" cy="32" r="18" fill="url(#sd-abandon-face)" stroke="#67441e" strokeWidth="1.5"/>
    <path d="M24 45V18m1 2c6-5 10 5 18 0v13c-8 5-12-5-18 0" fill="#fff0ca" stroke="#5b3a1a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    {[[32,12],[52,32],[32,52],[12,32]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="1.5" fill="#f7dc98" stroke="#745027"/>)}
  </svg>;
}

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
          <CompassMedallion/>
          <span>{tr("Campagnes clôturées", "Closed campaigns")}</span>
          <small>{tr("Terminées ou abandonnées", "Finished or abandoned")}</small>
          <strong data-stat="total">{format(s.total)}</strong>
          {s.total === 0 && <p>{tr("Votre légende reste à écrire.", "Your legend is yet to be written.")}</p>}
        </div>
        <dl className="sd-log-results">
          {results.map(r => <div key={r.key} className={"sd-log-result " + r.key}>
            <dt>{r.key === "abandoned" ? <AbandonMedallion/> : <img src={art("icons/skydeck/" + r.icon)} alt=""/>}{r.label}</dt>
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
              {[16,244].map(x=><g key={x} className="sd-log-rivet"><circle cx={x} cy="125" r="3.4" fill="url(#sd-log-brass)" stroke="#5a3c1a" strokeWidth="1"/><path d={"M"+(x-1.5)+" 126.5l3 -3"} stroke="#67441e" strokeWidth=".8"/></g>)}
              <circle cx="130" cy="127" r="7" fill="url(#sd-log-brass)" stroke="#594022" strokeWidth="2"/>
            </svg>
            <strong data-stat="rate">{s.rateLabel}</strong>
          </div>
          <p className="sd-log-ratio" data-stat="ratio">{s.completed ? tr(format(s.won)+(s.won===1?" victoire sur ":" victoires sur ")+format(s.completed),format(s.won)+(s.won===1?" victory out of ":" victories out of ")+format(s.completed)) : tr("Aucune campagne achevée","No completed campaigns")}</p>
          <p className="sd-log-exclusion">{tr("Hors abandons", "Excluding abandoned campaigns")}</p>
          <h3 className="sd-log-distribution-title">{tr("Répartition des campagnes","Campaign distribution")}</h3>
          <div className="sd-log-distribution" aria-hidden="true">{s.shares.map((share, i) => <span key={i} className={results[i].key} style={{width: (share * 100) + "%"}}/>)}</div>
          <ul className="sd-log-legend" aria-label={tr("Répartition des campagnes clôturées", "Closed campaign distribution")}>{results.map((r, i) => <li key={r.key} className={r.key}><span>{r.label}</span> <b>{s.total ? format(Math.round(s.shares[i] * 100)) + " %" : "—"}</b></li>)}</ul>
        </section>
      </div>}
  </article>;
}
