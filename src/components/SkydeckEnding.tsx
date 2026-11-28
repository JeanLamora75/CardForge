import {useEffect,useRef,useState} from 'react';
import type {Locale} from '../i18n/language.ts';
import type {SkydeckPublicState} from '../games/card-capture/engine.ts';
const art=(path:string)=>import.meta.env.BASE_URL+'art/'+path+'.webp';
export default function SkydeckEnding({view,language,tutorial,busy,storageError,onReplay}:{view:SkydeckPublicState;language:Locale;tutorial:boolean;busy:boolean;storageError:boolean;onReplay:()=>void}){
 const tr=(fr:string,en:string)=>language==='fr'?fr:en;
 const [details,setDetails]=useState(false);
 const titleRef=useRef<HTMLHeadingElement>(null);
 const win=view.outcome==='win',loss=view.outcome==='loss';
 const title=win?tr('Victoire','Victory'):loss?tr('Défaite','Defeat'):tr('Retrait de la flotte','Fleet withdrawal');
 const reason=win?tr('Tous les ennemis ont été éliminés.','All enemies have been cleared.'):loss?tr('Un navire stratégique a été perdu.','A strategic ship was lost.'):tr('La partie a été abandonnée.','The game was abandoned.');
 const portrait=win?'victory-portrait':loss?'defeat-portrait':'portrait';
 const landscape=win?'victory-landscape':loss?'defeat-landscape':'landscape';
 const remaining=view.counts.enemyDeck+view.enemyLine.filter(Boolean).length;
 const metrics=[[tr('Manches','Rounds'),view.round],[tr('Ennemis restants','Enemies remaining'),remaining],[tr('Captures ennemies','Enemy captures'),view.counts.enemyCapture]];
 useEffect(()=>{titleRef.current?.focus();},[]);
 return <section className="sd-board sd-end-screen" data-outcome={view.outcome} data-i18n-ignore aria-label={title} aria-busy={busy}>
   <picture className="sd-end-backdrop" aria-hidden="true"><source media="(orientation:landscape)" srcSet={art('boards/skydeck/'+landscape)}/><img src={art('boards/skydeck/'+portrait)} alt=""/></picture>
   <div className="sd-end-content">
     <div className="sd-end-title"><img src={art('icons/skydeck/'+(win?'victory':loss?'defeat':'compass'))} alt=""/><h2 ref={titleRef} tabIndex={-1}>{title}</h2>{tutorial?<p>{tr('Entraînement · sans statistiques','Training · no statistics')}</p>:null}<p>{reason}</p></div>
     <section className="sd-end-report" aria-label={tr('Rapport de bataille','Battle report')}>
       <h3><img src={art('banners/skydeck/section-heading')} alt=""/><span>{tr('Rapport de bataille','Battle report')}</span></h3>
       <dl className="sd-end-metrics">{metrics.map(([label,value])=><div key={label}><img src={art('hud/skydeck/counter-blank')} alt=""/><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
       {details?<><dl className="sd-end-details">{[[tr('Pioche personnelle','Player deck'),view.counts.playerDeck],[tr('Défausse','Discard'),view.counts.discard],[tr('Cartes en main','Cards in hand'),view.hand.length],[tr('Ennemis sur le plateau','Enemies on board'),view.enemyLine.filter(Boolean).length],[tr('Pioche ennemie','Enemy deck'),view.counts.enemyDeck]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>{loss?<p className="sd-end-rule">{tr('Une figure ou un As a été perdu.','A face card or an ace was lost.')}</p>:null}</>:null}
     </section>
     {storageError?<p role="alert">{tr('La sauvegarde précédente est conservée.','Previous save preserved.')}</p>:null}
     <div className="sd-end-buttons"><button className="sd-end-button sd-end-primary" disabled={busy} onClick={onReplay}><img src={art('buttons/skydeck/gold')} alt=""/><span>{tutorial?tr('Rejouer l’entraînement','Replay training'):tr('Rejouer','Replay')}</span></button><button className="sd-end-button" aria-expanded={details} disabled={busy} onClick={()=>setDetails(v=>!v)}><img src={art('buttons/skydeck/dark')} alt=""/><span>{details?tr('Résumé','Summary'):tr('Rapport détaillé','Detailed report')}</span></button><a className="sd-end-button" href="#game/card-capture"><img src={art('buttons/skydeck/dark')} alt=""/><span>{tr('Retour à Skydeck','Back to Skydeck')}</span></a></div>
   </div>

 </section>;
}
