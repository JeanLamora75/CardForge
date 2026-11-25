import { useEffect, useRef, useState, type ReactNode } from "react";
import { games, type GameId } from "../catalog";
import type { Locale } from "../i18n/language";
import type { CatalogGameProgress } from "../application/catalog-navigation";
const slugs: Record<GameId,string> = {"clear-the-dungeon":"grim-delve",gridcannon:"thunderfighter","card-capture":"skydeck","loot-the-loop":"midnight-syndicate",regicide:"les-douze-tyrans"};
const root=import.meta.env.BASE_URL;
export function art(kind:string, slug:string){return new URL(root+"assets/"+kind+"/"+slug+".png",document.baseURI).href;}
export function WorldBackdrop({slug}:{slug:string}){return <>
 <picture className="forge-world-bg" aria-hidden="true"><source media="(orientation: landscape)" srcSet={art("worlds-landscape",slug)}/><img src={art("worlds",slug)} alt="" draggable={false}/></picture>
 <img className="forge-effect" src={art("effects",slug)} alt="" aria-hidden="true" draggable={false}/>
 </>;}
function Command({slug,primary=false,back=false,disabled,onClick,children}:{slug:string;primary?:boolean;back?:boolean;disabled:boolean;onClick:()=>void;children:ReactNode}){
 return <button type="button" className={"forge-command"+(primary?" primary-action":"")+(back?" forge-command-back":"")} disabled={disabled} onClick={onClick}><img className="forge-button-art" src={art("buttons",slug)} alt="" aria-hidden="true" draggable={false}/><span>{children}</span></button>;
}
export function WorldLogo({slug,title}:{slug:string;title:string}){return <img className="world-logo" src={art("logos",slug)} alt={title} draggable={false}/>;}
export function Gallery({language,progress,open,scrollTop,onScroll}:{language:Locale;progress:Partial<Record<GameId,CatalogGameProgress>>;open:(id:GameId,button:HTMLButtonElement)=>void;scrollTop:number;onScroll:(v:number)=>void}){
 const scroller=useRef<HTMLElement>(null);
 useEffect(()=>{if(scroller.current)scroller.current.scrollTop=scrollTop;},[]);
 const fr=language==="fr";
 const order:GameId[]=["gridcannon","clear-the-dungeon","loot-the-loop","card-capture","regicide"];
 return <section className="forge-gallery" ref={scroller} onScroll={e=>onScroll(e.currentTarget.scrollTop)} aria-labelledby="catalog-title" data-i18n-ignore>
 <h2 id="catalog-title">{fr?"Choisissez votre univers":"Choose your universe"}</h2>
 <div className="forge-grid">{order.map(id=>{const game=games.find(g=>g.id===id)!;const slug=slugs[id];return <article key={id} className="game-card forge-cover"><h3 className="forge-sr">{game.title}</h3><button type="button" aria-label={(fr?"Découvrir ":"Discover ")+game.title} onClick={e=>open(id,e.currentTarget)}><img src={art("covers",slug)} alt="" draggable={false}/>{progress[id]?.indicator==="active"?<span className="forge-save">{fr?"Partie en cours":"Game in progress"}</span>:null}</button></article>;})}</div>
 </section>;
}
export function WorldMenu({id,title,language,active,onBack,onBoard,onLearn,onRules,onStats,credits}:{id:GameId;title:string;language:Locale;active:boolean;onBack:()=>void;onBoard:()=>void;onLearn:()=>void;onRules:()=>void;onStats:()=>void;credits:ReactNode}){
 const fr=language==="fr";const slug=slugs[id];const [transition,setTransition]=useState(false);const timer=useRef<number|undefined>(undefined);const locked=useRef(false);
 useEffect(()=>()=>window.clearTimeout(timer.current),[]);
 function go(action:()=>void){if(locked.current)return;locked.current=true;const motion=document.documentElement.dataset.motion;const reduce=motion==="off"||(motion!=="on"&&matchMedia("(prefers-reduced-motion: reduce)").matches);if(reduce){action();return;}setTransition(true);timer.current=window.setTimeout(action,320);}
 return <section className={"forge-menu"+(transition?" forge-transition":"")} data-world={slug} data-i18n-ignore aria-labelledby="game-title">
 <WorldBackdrop slug={slug}/>{transition?<img className="forge-exit-art" src={art("effects",slug)} alt="" aria-hidden="true"/>:null}
 <h1 id="game-title" className="forge-title" tabIndex={-1}><WorldLogo slug={slug} title={title}/></h1>
 <div className="forge-menu-actions context-actions">
 {active?<Command slug={slug} primary onClick={()=>go(onBoard)} disabled={transition}>{fr?"Reprendre":"Resume"}</Command>:null}
 <Command slug={slug} primary={!active} onClick={()=>go(onBoard)} disabled={transition}>{active?(fr?"Ouvrir le plateau":"Open board"):(fr?"Nouvelle partie":"New game")}</Command>
 <Command slug={slug} onClick={()=>go(onLearn)} disabled={transition}>{fr?"Apprendre":"Learn"}</Command>
 <Command slug={slug} onClick={()=>go(onRules)} disabled={transition}>{fr?"Règles":"Rules"}</Command>
 <Command slug={slug} onClick={()=>go(onStats)} disabled={transition}>{fr?"Statistiques":"Statistics"}</Command>
 <Command slug={slug} back onClick={()=>go(onBack)} disabled={transition}>{fr?"Retour":"Back"}</Command>
 </div><div className="forge-menu-foot">{credits}<span>{fr?"Préversion interne · diffusion non autorisée":"Internal preview · public release not authorized"}</span></div>
 </section>;
}
