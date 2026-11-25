import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
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
export function Gallery({language,progress,open,openSettings,scrollTop,onScroll}:{language:Locale;progress:Partial<Record<GameId,CatalogGameProgress>>;open:(id:GameId,button:HTMLButtonElement)=>void;openSettings:(button:HTMLButtonElement)=>void;scrollTop:number;onScroll:(v:number)=>void}){
 const scroller=useRef<HTMLElement>(null);
 useLayoutEffect(()=>{window.scrollTo({top:scrollTop,behavior:"instant"});const handle=()=>onScroll(window.scrollY);window.addEventListener("scroll",handle,{passive:true});return ()=>window.removeEventListener("scroll",handle);},[]);
 const fr=language==="fr";
 const order:GameId[]=["gridcannon","clear-the-dungeon","loot-the-loop","card-capture","regicide"];
 return <section className="forge-gallery" ref={scroller} aria-label={fr?"Galerie des jeux":"Game gallery"} data-i18n-ignore>
 <div className="forge-grid">{order.map(id=>{const game=games.find(g=>g.id===id)!;const slug=slugs[id];return <article key={id} data-game-id={id} className="game-card forge-cover"><h3 className="forge-sr">{game.title}</h3><button type="button" aria-label={(fr?"Découvrir ":"Discover ")+game.title} onClick={e=>open(id,e.currentTarget)}><img className="forge-tile-scene" src={art("worlds-landscape",slug)} alt="" draggable={false}/><img className="forge-tile-logo" src={art("logos",slug)} alt="" draggable={false}/>{progress[id]?.indicator==="active"?<span className="forge-save"><span aria-hidden="true">◆</span> {fr?"Partie en cours":"Game in progress"}</span>:null}</button></article>;})}<article className="forge-settings-card"><button type="button" className="forge-settings-tile" onClick={e=>openSettings(e.currentTarget)}><img className="forge-settings-art" src={art("worlds","cardforge")} alt="" draggable={false}/><span className="forge-settings-emblem" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M26 5h12l2 8 7 4 8-2 6 10-6 6v8l6 6-6 10-8-2-7 4-2 8H26l-2-8-7-4-8 2-6-10 6-6v-8l-6-6 6-10 8 2 7-4z" transform="translate(0 -3) scale(1 .98)"/><circle cx="32" cy="32" r="12"/><circle cx="32" cy="32" r="5"/></svg></span><span className="forge-settings-caption"><strong>{fr?"Paramètres":"Settings"}</strong><small>{fr?"Langue · Son · Accessibilité":"Language · Sound · Accessibility"}</small></span></button></article></div>
 </section>;
}
export function WorldMenu({id,title,language,active,onBack,onBoard,onLearn,onRules,onStats}:{id:GameId;title:string;language:Locale;active:boolean;onBack:()=>void;onBoard:()=>void;onLearn:()=>void;onRules:()=>void;onStats:()=>void}){
 const menuRef=useRef<HTMLElement>(null);
 useLayoutEffect(()=>{
   const menu=menuRef.current;
   if(!menu)return;
   function fit(){
     if(!menu)return;
     const vv=window.visualViewport;
     const height=Math.min(window.innerHeight,document.documentElement.clientHeight,vv?.height??window.innerHeight);
     const width=Math.min(window.innerWidth,document.documentElement.clientWidth,vv?.width??window.innerWidth);
     menu.style.setProperty("--visible-menu-height",height+"px");
     menu.style.setProperty("--visible-menu-width",width+"px");
     const count=5;
     const margin=Math.min(32,Math.max(16,height*.04));
     const rowHeight=44;
     const gap=6;
     const rows=Math.floor((height/2-margin+gap)/(rowHeight+gap));
     const columns=Math.max(1,Math.ceil(count/Math.max(1,rows)));
     menu.style.setProperty("--menu-columns",String(columns));
     menu.style.setProperty("--menu-gutter",margin+"px");
   }
   fit();
   const observer=new ResizeObserver(fit);observer.observe(menu);
   window.addEventListener("resize",fit);window.visualViewport?.addEventListener("resize",fit);
   return ()=>{observer.disconnect();window.removeEventListener("resize",fit);window.visualViewport?.removeEventListener("resize",fit);};
 },[]);
 const fr=language==="fr";const slug=slugs[id];const [transition,setTransition]=useState(false);const timer=useRef<number|undefined>(undefined);const locked=useRef(false);
 useEffect(()=>()=>window.clearTimeout(timer.current),[]);
 function go(action:()=>void){if(locked.current)return;locked.current=true;const motion=document.documentElement.dataset.motion;const reduce=motion==="off"||(motion!=="on"&&matchMedia("(prefers-reduced-motion: reduce)").matches);if(reduce){action();return;}setTransition(true);timer.current=window.setTimeout(action,320);}
 return <section ref={menuRef} className={"forge-menu"+(transition?" forge-transition":"")} data-world={slug} data-saved={active?"yes":"no"} data-i18n-ignore aria-labelledby="game-title">
 <WorldBackdrop slug={slug}/>{transition?<img className="forge-exit-art" src={art("effects",slug)} alt="" aria-hidden="true"/>:null}
 <h1 id="game-title" className="forge-title" tabIndex={-1}><WorldLogo slug={slug} title={title}/></h1>
 <div className="forge-menu-actions context-actions">
 <Command slug={slug} primary onClick={()=>go(onBoard)} disabled={transition}>{active?(fr?"Reprendre":"Resume"):(fr?"Nouvelle partie":"New game")}</Command>
 <Command slug={slug} onClick={()=>go(onLearn)} disabled={transition}>{fr?"Apprendre":"Learn"}</Command>
 <Command slug={slug} onClick={()=>go(onRules)} disabled={transition}>{fr?"Règles":"Rules"}</Command>
 <Command slug={slug} onClick={()=>go(onStats)} disabled={transition}>{fr?"Statistiques":"Statistics"}</Command>
 <Command slug={slug} back onClick={()=>go(onBack)} disabled={transition}>{fr?"Retour":"Back"}</Command>
 </div>
 </section>;
}
