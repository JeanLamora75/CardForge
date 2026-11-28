import {useState,useEffect,useRef} from 'react';
import type {Locale} from '../i18n/language.ts';
import {skydeckCardArt} from '../application/skydeck-art.ts';
import {describeSkydeckCard} from '../games/card-capture/preview.ts';
import {skydeckManualPages,type SkydeckManualPage} from '../application/skydeck-manual.ts';
export type {SkydeckManualPage} from '../application/skydeck-manual.ts';
const art=(p:string)=>import.meta.env.BASE_URL+'art/'+p+'.webp';
function Card({id,language}:{id:string;language:Locale}){
 const c=describeSkydeckCard(id,language),a=skydeckCardArt(id);
 if(!a)return null;
 return <figure aria-label={c.name}><div className="sd-manual-card"><img src={import.meta.env.BASE_URL+a.image} alt=""/><img src={import.meta.env.BASE_URL+a.frame} alt=""/><strong>{c.power}</strong><small>{c.faction}</small></div><figcaption>{c.faction}</figcaption></figure>;
}
function Visual({visual,language}:{visual:string;language:Locale}){
 const tr=(fr:string,en:string)=>language==='fr'?fr:en;
 const cards=(ids:string)=> <div className="sd-manual-cards">{ids.split(',').map(id=><Card key={id} id={id} language={language}/>)}</div>;
 if(visual.startsWith('diagram:')){
 const [,kind,units]=visual.split(':');
 if(units){const [own,target]=units.split('|');const invalid=kind==='a-invalid',sacrifice=kind==='b'||kind==='c';return <div className="sd-manual-tactics"><p className="sd-manual-example">{tr('Exemple en cours de campagne','Example during a campaign')}</p><div className="sd-manual-battle"><section><h3>{tr('Votre flotte','Your fleet')}</h3>{cards(own)}</section><span aria-hidden="true">→</span><section><h3>{tr('Cible ennemie','Enemy target')}{kind==='b'?' · '+tr('Position 1 (droite)','Position 1 (right)'):''}</h3>{cards(target)}</section></div><div className={'sd-manual-result '+(invalid?'invalid':sacrifice?'sacrifice':'success')}>{invalid?tr('Action refusée · aucun déplacement · même manche','Rejected · no movement · same round'):kind==='c'?tr('Vos deux unités → captures ennemies ; cible → sous la pioche ennemie','Your two units → enemy captures; target → bottom of enemy deck'):kind==='b'?tr('Les deux unités → captures ennemies définitives','Both units → permanent enemy captures'):tr('Toutes les unités engagées et la cible → vos réserves','All engaged units and target → your reserves')}</div></div>;}
 if(kind==='initial-line'||kind==='enemy-shift')return <div className="sd-manual-diagram"><p>{tr('Flotte ennemie · entrée à droite lors de la mise en place','Enemy fleet · initial entry from right')}</p><div className="sd-manual-slots">{[4,3,2,1].map(n=><div key={n}><img src={art('frames/skydeck/enemy-slot')} alt=""/><b>{n}</b></div>)}</div><p>{kind==='enemy-shift'?tr('Unités présentes → droite ; nouveaux ennemis → places libres','Existing units → right; new enemies → empty slots'):tr('Révélez de droite à gauche · 1, 2, 3, 4','Reveal right to left · 1, 2, 3, 4')}</p>{kind==='enemy-shift'?cards('diamonds-5,hearts-9'):null}</div>;
 const entries=kind==='phases'?[['enemy',tr('Déploiement · automatique','Deployment · automatic')],['discard',tr('Réorganisation · décision si possible','Reorganization · decision if possible')],['draw',tr('Renforts · automatique','Reinforcements · automatic')],['capture',tr('Combat · décision','Combat · decision')]]:kind==='combat-choices'?[['capture',tr('A · Capturer → réserves','A · Capture → reserves')],['sacrifice',tr('B · Sacrifier → captures ennemies','B · Sacrifice → enemy captures')],['repel',tr('C · Repousser → retour de la cible','C · Push back → target returns')]]:[['draw',tr('Renforts · cachés','Reinforcements · hidden')],['discard',tr('Réserves · cachées','Reserves · hidden')],['capture',tr('Captures ennemies · cachées','Enemy captures · hidden')]];
 return <div className="sd-manual-diagram">{entries.map(([icon,label])=><div className="sd-manual-step" key={icon}><img src={art('icons/skydeck/'+icon)} alt=""/><span>{label}</span></div>)}</div>;
 }
 if(visual.startsWith('manual/')||visual.startsWith('boards/'))return <div className="sd-manual-scenes">{visual.split(',').map(p=><img key={p} src={art(p)} alt={p.includes('mission')?tr('Flotte aérienne en mission','Fleet on a mission'):p.includes('assembly')?tr('Rassemblement des flottes','Fleet assembly'):p.includes('victory')?tr('Victoire','Victory'):tr('Défaite','Defeat')}/>)}</div>;
 return cards(visual);
}
export default function SkydeckRulebook({language,initialPage,onBack}:{language:Locale;initialPage?:SkydeckManualPage;onBack?:()=>void}){
 const tr=(fr:string,en:string)=>language==='fr'?fr:en;
 const [page,setPage]=useState<SkydeckManualPage|null>(initialPage??null);
 const heading=useRef<HTMLHeadingElement>(null),paper=useRef<HTMLElement>(null);
 useEffect(()=>{paper.current?.scrollTo(0,0);heading.current?.focus({preventScroll:true});},[page]);
 const chapters=[['enemy',tr('Votre mission','Your mission'),tr('Prenez le commandement de votre flotte.','Take command of your fleet.')],['compass',tr('Les quatre factions','The four factions'),tr('Identifiez les forces et unités stratégiques.','Identify forces and strategic units.')],['draw',tr('Préparation de la flotte','Fleet setup'),tr('Découvrez la composition des forces.','Discover how forces are assembled.')],['discard',tr('Le cycle des affrontements','The battle cycle'),tr('Maîtrisez les quatre phases.','Master the four phases.')],['capture',tr('Stratégies de combat','Combat strategies'),tr('Choisissez la bonne manœuvre.','Choose the right maneuver.')],['compass',tr('Les corsaires libres','Free corsairs'),tr('Exploitez les talents des Jokers.','Use the Jokers’ talents.')],['victory',tr('L’issue de la bataille','Battle outcome'),tr('Comprenez les conditions de fin.','Understand the ending conditions.')]];
 const index=skydeckManualPages.findIndex(p=>p.id===page),current=skydeckManualPages[index],copy=current?.[language];
 const buttonArt=<img className="sd-manual-button-art" src={art('buttons/skydeck/dark')} alt=""/>;
 return <article className="sd-manual sd-manual-v2" data-i18n-ignore aria-label={tr('Manuel de l’Amiral','Admiral’s manual')}>
 <header className="sd-manual-header">{onBack?<button type="button" className="sd-manual-back" onClick={onBack} aria-label={tr('Retour à Skydeck','Back to Skydeck')}>←</button>:null}<img className="sd-manual-logo" src={art('logos/skydeck/board')} alt="Skydeck"/><h1 id="game-title"><img src={art('banners/skydeck/section-heading')} alt=""/><span>{tr('Manuel de l’Amiral','Admiral’s manual')}</span></h1></header>
 <section className="sd-manual-paper" ref={paper}>
 <img className="sd-manual-texture" src={art('manual/skydeck/parchment-texture')} alt=""/>
 <img className="sd-manual-frame" src={art('manual/skydeck/page-frame')} alt=""/>
 <div className="sd-manual-content">
 <h2 ref={heading} tabIndex={-1}>{copy?.title??tr('Table des matières','Contents')}</h2>
 {!current?<><p className="sd-manual-intro">{tr('Traité de stratégie et de combat aérien','Treatise on aerial strategy and combat')}</p><nav className="sd-manual-toc" aria-label={tr('Sommaire','Contents')}>{chapters.map(([icon,title,desc],i)=><button key={title} onClick={()=>setPage(skydeckManualPages.find(p=>p.chapter===i+1)!.id)}><img src={art('icons/skydeck/'+icon)} alt=""/><span><b>{['I','II','III','IV','V','VI','VII'][i]}. {title}</b><small>{desc}</small></span><span aria-hidden="true">›</span></button>)}</nav></>:copy?<><p className="sd-manual-intro">{copy.intro}</p><img className="sd-manual-separator" src={art('ornaments/skydeck/separator')} alt=""/><p className="sd-manual-rule">{copy.body}</p><Visual visual={current.visual} language={language}/><aside className="sd-manual-tip"><b>{tr('Conseil tactique','Tactical advice')}</b><p>{copy.tip}</p></aside><p className="sd-manual-page-number">{tr('Chapitre','Chapter')} {current.chapter}/7 · {tr('Page','Page')} {index+1}/{skydeckManualPages.length}</p></>:null}
 </div></section>
 {current?<nav className="sd-manual-nav" aria-label={tr('Pages','Pages')}><button disabled={index===0} onClick={()=>setPage(skydeckManualPages[index-1].id)}>{buttonArt}<span>{tr('Précédent','Previous')}</span></button><button onClick={()=>setPage(null)}>{buttonArt}<span>{tr('Sommaire','Contents')}</span></button><button disabled={index===skydeckManualPages.length-1} onClick={()=>setPage(skydeckManualPages[index+1].id)}>{buttonArt}<span>{tr('Suivant','Next')}</span></button></nav>:null}
 <footer>{tr('D’après Card Capture · Lucas Gentry, 2018','Based on Card Capture · Lucas Gentry, 2018')}</footer>
 </article>;
}
