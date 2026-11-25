import { useEffect, useRef, useState } from "react";
import type { Locale } from "../i18n/language.ts";
import type { SharedSettings } from "../application/shared-settings.ts";
import { APP_VERSION } from "../application/credits.ts";
import settingsArt from "../assets/settings-forge.svg";
import PrivacyPanel from "./PrivacyPanel";

type Category = "home" | "language" | "audio" | "comfort" | "privacy" | "about";
type Props = {
  onBack:()=>void; onCredits:()=>void; language:Locale;
  onLanguageChange:(locale:Locale)=>void; preferences:SharedSettings;
  onPreferencesChange:(next:SharedSettings)=>void;
};
export default function Settings({onBack,onCredits,language,onLanguageChange,preferences,onPreferencesChange}:Props){
  const [category,setCategory]=useState<Category>("home");
  const title=useRef<HTMLHeadingElement>(null);
  const fr=language==="fr";
  const t=(f:string,e:string)=>fr?f:e;
  const categories=[
    {id:"language",icon:"文",name:t("Langue","Language"),desc:fr?"Français":"English"},
    {id:"audio",icon:"♫",name:t("Audio","Audio"),desc:t("Musique et effets sonores","Music and sound effects")},
    {id:"comfort",icon:"✧",name:t("Confort et accessibilité","Comfort and accessibility"),desc:t("Animations et aides contextuelles","Animations and contextual hints")},
    {id:"privacy",icon:"◇",name:t("Confidentialité et données","Privacy and data"),desc:t("Vos données sur cet appareil","Your data on this device")},
    {id:"about",icon:"ⓘ",name:t("À propos","About"),desc:t("Version, crédits et licences","Version, credits and licences")},
  ] as const;
  useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});title.current?.focus({preventScroll:true});},[category]);
  function back(){if(category==="home")onBack();else setCategory("home");}
  function toggle(key:"music"|"sounds"|"hints",name:string,description:string){
    return <label className="forge-setting-toggle"><span><strong>{name}</strong><small>{description}</small></span><input type="checkbox" role="switch" checked={preferences[key]} onChange={e=>onPreferencesChange({...preferences,[key]:e.target.checked})}/></label>;
  }
  return <section className="context-page forge-settings-page" data-i18n-ignore aria-labelledby="settings-title" onKeyDown={e=>{if(e.key==="Escape"&&category!=="home"&&!e.defaultPrevented){e.preventDefault();e.stopPropagation();setCategory("home");}}}>
    <header className="forge-settings-heading"><img src={settingsArt} alt="" aria-hidden="true"/><h1 ref={title} tabIndex={-1} id="settings-title">{category==="home"?t("Paramètres","Settings"):categories.find(c=>c.id===category)?.name}</h1></header>
    {category==="home"?<nav className="forge-settings-categories" aria-label={t("Catégories de paramètres","Settings categories")}>{categories.map(c=><button type="button" key={c.id} data-settings-category={c.id} onClick={()=>setCategory(c.id)}><span className="forge-setting-icon" aria-hidden="true">{c.icon}</span><span><strong>{c.name}</strong><small>{c.desc}</small></span><span aria-hidden="true">›</span></button>)}</nav>:null}
    {category==="language"?<div className="forge-settings-panel"><label htmlFor="settings-language">{t("Langue de l’interface","Interface language")}</label><select id="settings-language" value={language} onChange={e=>onLanguageChange(e.target.value as Locale)}><option value="fr">Français</option><option value="en">English</option></select><p>{t("Votre choix est mémorisé sans modifier les parties, cartes ou statistiques.","Your choice is saved without changing games, cards or statistics.")}</p></div>:null}
    {category==="audio"?<div className="forge-settings-panel">{toggle("music",t("Musique d’ambiance","Background music"),t("Fond musical facultatif.","Optional background music."))}{toggle("sounds",t("Effets sonores","Sound effects"),t("Sons des actions et résultats.","Sounds for moves and results."))}<p>{t("La lecture audio dépend des autorisations du navigateur.","Audio playback depends on browser permissions.")}</p></div>:null}
    {category==="comfort"?<div className="forge-settings-panel">{toggle("hints",t("Aides contextuelles","Contextual hints"),t("Les actions autorisées et les règles restent accessibles.","Legal actions and rules remain available."))}<label htmlFor="settings-animations">{t("Animations","Animations")}</label><select id="settings-animations" value={preferences.animations} onChange={e=>onPreferencesChange({...preferences,animations:e.target.value as SharedSettings["animations"]})}><option value="system">{t("Suivre le système","Follow system")}</option><option value="on">{t("Activées","Enabled")}</option><option value="off">{t("Désactivées","Disabled")}</option></select><p>{t("Le mode système respecte la réduction des mouvements de votre appareil. Les résultats restent lisibles sans animation ni son.","System mode respects your device’s reduced-motion preference. Results remain readable without animation or sound.")}</p></div>:null}
    {category==="privacy"?<PrivacyPanel language={language}/>:null}
    {category==="about"?<div className="forge-settings-panel"><h2>CardForge · v{APP_VERSION}</h2><p>{t("Collection de jeux de cartes solo, gratuite et sans publicité.","A free, ad-free collection of solo card games.")}</p><button type="button" className="secondary-action settings-credits" onClick={onCredits}>{t("Crédits et licences","Credits and licences")}</button><p>{t("Préversion interne · diffusion non autorisée","Internal preview · public release not authorized")}</p></div>:null}
    {["language","audio","comfort"].includes(category)?<p className="forge-settings-note">{t("Réglages appliqués immédiatement à tous les jeux, sans modifier les sauvegardes ni les règles.","Settings apply immediately to all games without changing saves or rules.")}</p>:null}
    <footer className="forge-settings-footer"><button type="button" className="back-link" onClick={back}>{category==="home"?t("← Retour","← Back"):t("← Retour aux paramètres","← Back to settings")}</button><small>CardForge · v{APP_VERSION}</small></footer>
  </section>;
}
