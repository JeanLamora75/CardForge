import {useEffect,useRef,useState} from "react";
import {WorldLogo,Command} from "./ImmersiveMenu";
import victoryEmblem from "../assets/thunderfighter-medal-win.svg";
import defeatEmblem from "../assets/thunderfighter-medal-loss.svg";
import trainingEmblem from "../assets/thunderfighter-medal-training.svg";
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
 const rate=statistics.victoryRate==="—"?null:Number.parseInt(statistics.victoryRate,10);
 return <section className="tf-ending game-final-screen" data-result={state.outcome} data-training={tutorial} data-i18n-ignore aria-labelledby="game-final-title">
  <div className="tf-ending-ambience" aria-hidden="true">{Array.from({length:8},(_,i)=><i key={i} style={{left:`${8+i*12}%`,animationDelay:`${-i*.7}s`}}/>)}</div>
  <div className="tf-ending-main">
   <WorldLogo slug="thunderfighter" title="Thunderfighter"/>
   <div className="tf-ending-hero"><img className="tf-ending-emblem" src={tutorial?trainingEmblem:win?victoryEmblem:defeatEmblem} alt="" aria-hidden="true"/>
   <div className="tf-ending-banner"><h2 id="game-final-title" ref={heading} tabIndex={-1}>{tutorial?(en?"TRAINING COMPLETE":"ENTRAÎNEMENT TERMINÉ"):win?(en?"VICTORY":"VICTOIRE"):(en?"DEFEAT":"DÉFAITE")}</h2>
   <p className="tf-ending-subtitle">{tutorial?(en?"Practice · no save":"Entraînement · sans sauvegarde"):win?(en?"MISSION ACCOMPLISHED":"MISSION ACCOMPLIE"):(en?"MISSION FAILED":"FIN DE MISSION")}</p></div></div>
   <p className="tf-ending-explanation">{explanation}</p>
   {!tutorial?<div className="tf-ending-metrics">{metrics.map((metric,i)=><div key={metric.label}><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">{i===0?<><circle cx="12" cy="12" r="7"/><path d="M12 1v7m0 8v7M1 12h7m8 0h7"/></>:i===1?<><path d="M12 2l8 4v7c0 4-5 8-8 9-3-1-8-5-8-9V6z"/><path d="M12 6v10m-5-5h10"/></>:win?<path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>:<><rect x="6" y="3" width="13" height="17" rx="2"/><path d="M3 7v15h12"/></>}</svg><strong>{metric.value}</strong><small>{metric.label}</small></div>)}</div>:null}
   <nav className="game-final-actions tf-ending-actions" aria-label={en?"After the mission":"Après la mission"}><Command slug="thunderfighter" primary disabled={busy} onClick={onReplay}>{tutorial?(en?"Restart training":"Recommencer"):(en?"Play again":"Rejouer")}</Command><Command slug="thunderfighter" disabled={busy} onClick={tutorial&&onExitTutorial?onExitTutorial:()=>{window.location.hash="";}}>{tutorial&&onExitTutorial?(en?"Return to game":"Retour au jeu"):(en?"Back to catalogue":"Retour au catalogue")}</Command></nav>
   {tutorial?<a className="tf-ending-details-link" href="#">{en?"Back to catalogue":"Retour au catalogue"}</a>:<button className="tf-ending-details-link" type="button" ref={detailsButton} onClick={()=>dialog.current?.showModal()}><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 3h12v18H6zM9 8h6M9 12h6M9 16h4"/></svg>{en?"Mission report":"Rapport de mission"}</button>}
   {busy?<p role="status">{en?"Loading…":"Chargement…"}</p>:null}
   {notice&&/Impossible|indisponible|erreur/i.test(notice)?<p role="alert">{notice}</p>:null}
  </div>
  {!tutorial?<dialog ref={dialog} className="tf-ending-dialog" aria-label={en?"Mission details":"Détails de la mission"} onClose={()=>detailsButton.current?.focus()}><header><div><small>THUNDERFIGHTER</small><h3>{en?"Mission report":"Rapport de mission"}</h3></div><button className="tf-report-close" type="button" aria-label={en?"Close":"Fermer"} onClick={()=>dialog.current?.close()}>×</button></header><div className="tf-ending-dialog-content"><dl className="tf-report-metrics">{metrics.map(metric=><div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}</dl>{win?<p className="tf-report-extra">{en?"Cards remaining":"Pioche restante"} : {state.drawPile.length}</p>:null}<h3>{en?"Pilot history":"Historique du pilote"}</h3>{statsError?<p role="alert">{en?"Statistics unavailable.":"Statistiques indisponibles."}</p>:<dl className="tf-report-history">{[[en?"Played":"Parties terminées ou abandonnées",statistics.played],[en?"Wins":"Victoires",statistics.won],[en?"Losses":"Défaites",statistics.lost],[en?"Abandoned":"Abandons",statistics.abandoned]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}<div className="tf-report-rate"><dt>{en?"Win rate":"Taux de victoire"}</dt><dd>{statistics.victoryRate}</dd>{rate!==null?<meter min={0} max={100} value={rate} aria-label={en?"Win rate":"Taux de victoire"}/>:null}</div></dl>}</div><footer><Command slug="thunderfighter" disabled={false} onClick={()=>dialog.current?.close()}>{en?"Back to results":"Retour au bilan"}</Command></footer></dialog>:null}
 </section>;
}
