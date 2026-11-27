import {useEffect,useRef,useState} from "react";
import type {ReactNode} from "react";
import type {GrimDelveState} from "../games/clear-the-dungeon/engine.ts";
import type {Locale} from "../i18n/language.ts";
import {createIndexedDbGameStorage} from "../adapters/indexeddb-game-storage.ts";
import {presentGameStatistics} from "../application/game-results.ts";
import {grimEnding} from "../application/grim-delve-ending.ts";
import {grimCardView,grimCardBack} from "../application/grim-delve-art.ts";
const art=(path:string)=>import.meta.env.BASE_URL+"art/"+path+".webp";
function Dialog({title,close,children}:{title:string;close:()=>void;children:ReactNode}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const d=ref.current;if(!d)return;const previous=document.activeElement as HTMLElement|null;d.showModal();return()=>{if(d.open)d.close();previous?.focus();};},[]);
 return <dialog ref={ref} className="gd-inspection gd-end-dialog" aria-labelledby="gd-end-dialog-title" onCancel={e=>{e.preventDefault();close();}}><div className="gd-inspection-content"><header><h2 id="gd-end-dialog-title">{title}</h2><button type="button" autoFocus onClick={close} aria-label="×">×</button></header>{children}</div></dialog>;
}
function LastCard({id,language}:{id:string;language:Locale}){
 const v=grimCardView(id,language),url=(p:string)=>import.meta.env.BASE_URL+"art/"+p;
 return <div className="gd-last-card" aria-label={v.label}><img src={url(v.illustration)} alt=""/><img src={url(v.frame)} alt=""/><span>{v.value} · {v.title}</span></div>;
}
export default function GrimDelveResult({state,language,tutorial,busy,onReplay}:{state:GrimDelveState;language:Locale;tutorial:boolean;busy:boolean;onReplay:()=>void}){
 const fr=language==="fr",end=grimEnding(state,language);
 const [modal,setModal]=useState<"stats"|"board"|null>(null);
 const [stats,setStats]=useState<ReturnType<typeof presentGameStatistics>|null>(null);
 const [error,setError]=useState(false);
 const heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{heading.current?.focus();},[]);
 useEffect(()=>{if(modal!=="stats"||tutorial)return;let live=true;setError(false);setStats(null);void createIndexedDbGameStorage().readStatistics("clear-the-dungeon").then(s=>{if(live)setStats(presentGameStatistics(s??null));}).catch(()=>{if(live)setError(true);});return()=>{live=false;};},[modal,tutorial]);
 const metrics=[["skull",fr?"Monstres vaincus":"Monsters defeated",state.defeated.length+" / 12"],["heart-filled",fr?"Dégâts":"Damage",state.damages.length+" / 7"],["deck",fr?"Mains jouées":"Hands played",String(state.handNumber)]];
 return <section className="gd-ending" data-i18n-ignore data-result={state.outcome} data-ending={end.scene} aria-labelledby="game-final-title">
 <div className="gd-end-scene"><img src={art("banners/grim-delve/end-"+end.scene)} alt=""/></div>
 <div className="gd-end-report">
 <p className="gd-end-eyebrow">{fr?"Bilan de la partie":"Expedition report"}</p>
 <h2 id="game-final-title" ref={heading} tabIndex={-1}>{end.title}</h2>
 <p className="gd-end-explanation">{end.explanation}</p>
 <div className="gd-end-metrics">{metrics.map(([icon,label,value])=><div key={icon}><img src={art("hud/grim-delve/"+icon)} alt=""/><span>{label}</span><strong>{value}</strong></div>)}</div>
 {end.score!==null?<p className="gd-end-score"><span>{fr?"Score officiel":"Official score"}</span><strong>{end.score}</strong></p>:null}
 <p className="gd-end-parchment">{end.narrative}</p>
 {tutorial?<p>{fr?"Entraînement : aucune statistique enregistrée.":"Practice: no statistics recorded."}</p>:null}
 <nav className="gd-end-actions" aria-label={fr?"Après la partie":"After the game"}>
 <button type="button" className="gd-end-primary" disabled={busy} onClick={onReplay}>{tutorial?(fr?"Recommencer l’entraînement":"Restart practice"):(fr?"Nouvelle expédition":"New expedition")}</button>
 {!tutorial?<button type="button" onClick={()=>setModal("stats")}>{fr?"Mes statistiques":"My statistics"}</button>:null}
 <a href="#">{fr?"Retour au catalogue":"Back to catalogue"}</a>
 <button type="button" className="gd-end-last" onClick={()=>setModal("board")}>{fr?"Voir le dernier plateau":"View final board"}</button>
 </nav>
 </div>
 {modal==="stats"?<Dialog title={fr?"Mes statistiques":"My statistics"} close={()=>setModal(null)}>
 {error?<p role="alert">{fr?"Statistiques indisponibles.":"Statistics unavailable."}</p>:stats?<><dl className="gd-end-stats">{[[fr?"Parties":"Games",stats.played],[fr?"Victoires":"Wins",stats.won],[fr?"Défaites":"Losses",stats.lost],[fr?"Abandons":"Abandoned",stats.abandoned],[fr?"Taux de victoire":"Win rate",stats.victoryRate]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p>{fr?"Parties normales uniquement. Taux = victoires / (victoires + défaites).":"Normal games only. Rate = wins / (wins + losses)."}</p></>:<p role="status">{fr?"Chargement…":"Loading…"}</p>}
 </Dialog>:null}
 {modal==="board"?<Dialog title={fr?"Dernier plateau · lecture seule":"Final board · read only"} close={()=>setModal(null)}>
 <div className="gd-last-columns">{state.columns.map((column,i)=><div key={i}>{column[0]?<><LastCard id={column[0]} language={language}/><div className="gd-last-powers">{state.attacks.find(a=>a.monsterId===column[0])?.powers.map(p=><LastCard key={p.cardId} id={p.cardId} language={language}/>)}</div><div className="gd-last-hidden">{column.slice(1).map((_,j)=><img key={j} src={import.meta.env.BASE_URL+"art/"+grimCardBack} alt={fr?"Monstre masqué":"Hidden monster"}/>)}</div></>:<small>{fr?"Libérée":"Cleared"}</small>}</div>)}</div>
 <h3>{fr?"Dernière main":"Final hand"}</h3><div className="gd-last-hand">{state.hand.map(id=><LastCard key={id} id={id} language={language}/>)}</div>
 </Dialog>:null}
 </section>;
}
