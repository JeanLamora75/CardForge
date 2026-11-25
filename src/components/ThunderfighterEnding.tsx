import {useEffect,useRef,useState} from "react";
import {WorldLogo} from "./ImmersiveMenu";
import {createIndexedDbGameStorage} from "../adapters/indexeddb-game-storage.ts";
import {presentGameStatistics} from "../application/game-results.ts";
import type {GameStatistics} from "../ports/local-storage.ts";
import type {ThunderfighterState} from "../games/gridcannon/engine.ts";
import type {Locale} from "../i18n/language.ts";
export default function ThunderfighterEnding({state,tutorial,language,busy,notice,onReplay,onExitTutorial}:{state:ThunderfighterState;tutorial:boolean;language:Locale;busy:boolean;notice:string;onReplay:()=>void;onExitTutorial?:()=>void}){
 const en=language==="en",win=state.outcome==="win";
 const heading=useRef<HTMLHeadingElement>(null),dialog=useRef<HTMLDialogElement>(null),detailsButton=useRef<HTMLButtonElement>(null);
 const [stats,setStats]=useState<GameStatistics|null>(null),[statsError,setStatsError]=useState(false);
 useEffect(()=>{heading.current?.focus({preventScroll:true});},[]);
 useEffect(()=>{if(tutorial)return;let active=true;void createIndexedDbGameStorage().readStatistics("gridcannon").then(value=>{if(active)setStats(value??null);}).catch(()=>{if(active)setStatsError(true);});return()=>{active=false;};},[tutorial]);
 const explanation=win?(en?"All enemy ships have been neutralized.":"Tous les adversaires ont été neutralisés.") :state.lossReason==="armor"?(en?"Enemy armor reached an impenetrable resistance.":"Une armure ennemie est devenue infranchissable."):(en?"No legal move can save the mission.":"Aucune action ne permet de sauver la mission.");
 const metrics=[{label:en?"Enemies neutralized":"Adversaires neutralisés",value:(state.defeatedFigures?.length??0)+" / 12"},{label:en?"Special actions used":"Réserve utilisée",value:state.spentSpecials.length+" / 6"},{label:win?(en?"Official score":"Score officiel"):(en?"Cards remaining":"Pioche restante"),value:win?(state.victoryScore??0):state.drawPile.length}];
 const statistics=presentGameStatistics(stats);
 return <section className="tf-ending game-final-screen" data-result={state.outcome} data-training={tutorial} data-i18n-ignore aria-labelledby="game-final-title">
  <div className="tf-ending-main">
   <WorldLogo slug="thunderfighter" title="Thunderfighter"/>
   <div className="tf-ending-hero"><svg viewBox="0 0 100 80" aria-hidden="true">{tutorial?<path d="M4 27L50 5 96 27 50 49Z M22 39V64Q50 80 78 64V39" fill="none" stroke="currentColor" strokeWidth="5"/>:win?<><path d="M50 3L62 30 92 33 69 53 75 78 50 63 25 78 31 53 8 33 38 30Z" fill="currentColor"/><path d="M8 45Q3 69 33 76M92 45Q97 69 67 76" fill="none" stroke="currentColor" strokeWidth="5"/></>:<><path d="M50 4L95 76H5Z" fill="none" stroke="currentColor" strokeWidth="5"/><path d="M50 27V49M50 59V64" stroke="currentColor" strokeWidth="8"/></>}</svg>
   <h2 id="game-final-title" ref={heading} tabIndex={-1}>{tutorial?(en?"TRAINING COMPLETE":"ENTRAÎNEMENT TERMINÉ"):win?(en?"VICTORY":"VICTOIRE"):(en?"DEFEAT":"DÉFAITE")}</h2>
   <p className="tf-ending-subtitle">{tutorial?(en?"Practice · no save":"Entraînement · sans sauvegarde"):win?(en?"MISSION ACCOMPLISHED":"MISSION ACCOMPLIE"):(en?"MISSION FAILED":"FIN DE MISSION")}</p></div>
   <p className="tf-ending-explanation">{explanation}</p>
   {!tutorial?<div className="tf-ending-metrics">{metrics.map((metric,i)=><div key={metric.label}><span aria-hidden="true">{["◎","◇","▱"][i]}</span><strong>{metric.value}</strong><small>{metric.label}</small></div>)}</div>:null}
   <nav className="game-final-actions tf-ending-actions" aria-label={en?"After the mission":"Après la mission"}><button type="button" className="primary-action" disabled={busy} onClick={onReplay}>{tutorial?(en?"Restart training":"Recommencer"):(en?"Play again":"Rejouer")}</button>{tutorial&&onExitTutorial?<button type="button" className="secondary-action" onClick={onExitTutorial}>{en?"Return to game":"Retour au jeu"}</button>:<a href="#" className="secondary-action">{en?"Back to catalogue":"Retour au catalogue"}</a>}</nav>
   {tutorial?<a className="tf-ending-details-link" href="#">{en?"Back to catalogue":"Retour au catalogue"}</a>:<button className="tf-ending-details-link" type="button" ref={detailsButton} onClick={()=>dialog.current?.showModal()}>{en?"View details":"Voir les détails"} ⌄</button>}
   {busy?<p role="status">{en?"Loading…":"Chargement…"}</p>:null}
   {notice&&/Impossible|indisponible|erreur/i.test(notice)?<p role="alert">{notice}</p>:null}
  </div>
  {!tutorial?<dialog ref={dialog} className="tf-ending-dialog" aria-label={en?"Mission details":"Détails de la mission"} onClose={()=>detailsButton.current?.focus()}><header><h3>{en?"Mission details":"Détails de la mission"}</h3><button type="button" onClick={()=>dialog.current?.close()}>{en?"Close":"Fermer"}</button></header><div className="tf-ending-dialog-content"><dl>{metrics.map(metric=><div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}{win?<div><dt>{en?"Unused aces and jokers (official score)":"As et Jokers inutilisés (score officiel)"}</dt><dd>{state.victoryScore??0}</dd></div>:null}<div><dt>{en?"Cards remaining":"Cartes restantes"}</dt><dd>{state.drawPile.length}</dd></div></dl><h3>{en?"My statistics":"Mes statistiques"}</h3>{statsError?<p role="alert">{en?"Statistics unavailable.":"Statistiques indisponibles."}</p>:<dl>{[[en?"Played":"Parties terminées ou abandonnées",statistics.played],[en?"Wins":"Victoires",statistics.won],[en?"Losses":"Défaites",statistics.lost],[en?"Abandoned":"Abandons",statistics.abandoned],[en?"Win rate":"Taux de victoire",statistics.victoryRate]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}</div></dialog>:null}
 </section>;
}
