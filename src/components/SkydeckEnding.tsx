import {useEffect,useRef,useState} from 'react';
import type {Locale} from '../i18n/language.ts';
import type {SkydeckPublicState} from '../games/card-capture/engine.ts';
const art=(path:string)=>import.meta.env.BASE_URL+'art/'+path+'.webp';
export default function SkydeckEnding({view,language,tutorial,busy,restart,storageError,onReplay,onConfirm,onCancel}:{view:SkydeckPublicState;language:Locale;tutorial:boolean;busy:boolean;restart:boolean;storageError:boolean;onReplay:()=>void;onConfirm:()=>void;onCancel:()=>void}){
 const tr=(fr:string,en:string)=>language==='fr'?fr:en;
 const [details,setDetails]=useState(false);
 const titleRef=useRef<HTMLHeadingElement>(null);
 const confirmRef=useRef<HTMLButtonElement>(null);
 const win=view.outcome==='win',loss=view.outcome==='loss';
 const title=win?tr('Victoire','Victory'):loss?tr('Défaite','Defeat'):tr('Retrait de la flotte','Fleet withdrawal');
 const reason=win?tr('Tous les ennemis ont été éliminés.','All enemies have been cleared.'):loss?tr('Une figure ou un As a été perdu.','A face card or an ace was lost.'):tr('La partie a été abandonnée.','The game was abandoned.');
 const portrait=win?'victory-portrait':loss?'defeat-portrait':'portrait';
 const landscape=win?'victory-landscape':loss?'defeat-landscape':'landscape';
 const remaining=view.counts.enemyDeck+view.enemyLine.filter(Boolean).length;
 const metrics=[[tr('Manche','Round'),view.round],[tr('Ennemis restants','Enemies remaining'),remaining],[tr('Cartes capturées par l’ennemi','Cards captured by enemy'),view.counts.enemyCapture]];
 useEffect(()=>{titleRef.current?.focus();},[]);
 useEffect(()=>{if(restart)confirmRef.current?.focus();},[restart]);
 return <section className="sd-board sd-end-screen" data-outcome={view.outcome} data-i18n-ignore aria-label={title} aria-busy={busy}>
   <picture className="sd-end-backdrop" aria-hidden="true"><source media="(orientation:landscape)" srcSet={art('boards/skydeck/'+landscape)}/><img src={art('boards/skydeck/'+portrait)} alt=""/></picture>
   <div className="sd-end-content">
     <div className="sd-end-title"><img src={art('icons/skydeck/'+(win?'victory':loss?'defeat':'compass'))} alt=""/><h2 ref={titleRef} tabIndex={-1}>{title}</h2>{tutorial?<p>{tr('Entraînement · sans statistiques','Training · no statistics')}</p>:null}<p>{reason}</p></div>
     <section className="sd-end-report" aria-label={tr('Rapport de bataille','Battle report')}>
       <h3>{tr('Rapport de bataille','Battle report')}</h3>
       <dl className="sd-end-metrics">{metrics.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
       {details?<dl className="sd-end-details">{[[tr('Pioche personnelle','Player deck'),view.counts.playerDeck],[tr('Défausse','Discard'),view.counts.discard],[tr('Cartes en main','Cards in hand'),view.hand.length],[tr('Ennemis sur le plateau','Enemies on board'),view.enemyLine.filter(Boolean).length],[tr('Pioche ennemie','Enemy deck'),view.counts.enemyDeck]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>:null}
     </section>
     {storageError?<p role="alert">{tr('La sauvegarde précédente est conservée.','Previous save preserved.')}</p>:null}
     <div className="sd-end-buttons"><button className="sd-end-button sd-end-primary" disabled={busy||restart} onClick={onReplay}><img src={art('buttons/skydeck/gold')} alt=""/><span>{tutorial?tr('Rejouer l’entraînement','Replay training'):tr('Rejouer','Replay')}</span></button><button className="sd-end-button" aria-expanded={details} disabled={restart} onClick={()=>setDetails(v=>!v)}><img src={art('buttons/skydeck/dark')} alt=""/><span>{details?tr('Résumé','Summary'):tr('Rapport détaillé','Detailed report')}</span></button><a className="sd-end-button" href="#game/card-capture"><img src={art('buttons/skydeck/dark')} alt=""/><span>{tr('Retour à Skydeck','Back to Skydeck')}</span></a></div>
   </div>
   {restart?<div className="sd-end-dialog" role="group" aria-label={tr('Nouvelle partie','New game')}><p>{tr('Commencer une nouvelle partie ?','Start a new game?')}</p><button ref={confirmRef} disabled={busy} onClick={onConfirm}>{tr('Confirmer','Confirm')}</button><button disabled={busy} onClick={onCancel}>{tr('Annuler','Cancel')}</button></div>:null}
 </section>;
}
