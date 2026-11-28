import { useEffect, useRef, useState } from "react";
import type { Locale } from "../i18n/language.ts";
import type { SharedSettings } from "../application/shared-settings.ts";
import { APP_VERSION } from "../application/credits.ts";
import settingsArt from "../assets/settings-forge.svg";
import PrivacyPanel from "./PrivacyPanel";
import { playGameplayEffect } from "../application/audio.ts";
import { SettingIcon } from "./SettingIcon";
import { WorldLogo } from "./ImmersiveMenu";

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
  const motionLabel=preferences.animations==="system"?t("Système","System"):preferences.animations==="on"?t("Activées","Enabled"):t("Désactivées","Disabled");
  const categories=[
    {id:"language",icon:"language",name:t("Langue","Language"),desc:fr?"Français":"English"},
    {id:"audio",icon:"audio",name:t("Audio","Audio"),desc:t("Musique","Music")+" "+preferences.musicVolume+" % · "+t("Ambiance","Ambience")+" "+preferences.ambienceVolume+" % · "+t("Effets","Effects")+" "+preferences.soundsVolume+" %"},
    {id:"comfort",icon:"comfort",name:t("Confort et accessibilité","Comfort and accessibility"),desc:t("Aides","Hints")+" "+(preferences.hints?t("activées","on"):t("désactivées","off"))+" · "+t("Animations","Animations")+" : "+motionLabel},
    {id:"privacy",icon:"privacy",name:t("Confidentialité et données","Privacy and data"),desc:t("Vos données sur cet appareil","Your data on this device")},
    {id:"about",icon:"about",name:t("À propos","About"),desc:t("Version","Version")+" "+APP_VERSION},
  ] as const;
  useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});title.current?.focus({preventScroll:true});},[category]);
  function back(){if(document.querySelector(".privacy-confirm"))return;if(category==="home")onBack();else setCategory("home");}
  function toggle(key:"hints",name:string,description:string){
    return <label className="forge-setting-toggle"><span><strong>{name}</strong><small>{description}</small></span><input type="checkbox" role="switch" checked={preferences[key]} onChange={e=>onPreferencesChange({...preferences,[key]:e.target.checked})}/></label>;
  }
  function volume(key:"musicVolume"|"soundsVolume"|"ambienceVolume",name:string){
    const value=preferences[key]; const change=(v:number)=>onPreferencesChange({...preferences,[key]:v,...(key==="ambienceVolume"?{}:{[key==="musicVolume"?"music":"sounds"]:v>0})});
    return <div className="forge-volume"><div className="forge-volume-title"><label htmlFor={key}>{name}</label><output htmlFor={key}>{value} %</output></div><div className="forge-volume-controls"><button type="button" aria-label={t("Diminuer","Decrease")+" "+name} onClick={()=>change(Math.max(0,value-5))}>−</button><input id={key} type="range" min="0" max="100" step="1" value={value} onChange={e=>change(Number(e.target.value))}/><button type="button" aria-label={t("Augmenter","Increase")+" "+name} onClick={()=>change(Math.min(100,value+5))}>+</button></div>{value===0?<small className="volume-muted">{t("Désactivé","Muted")}</small>:null}</div>;
  }
  return <section className={"context-page forge-settings-page "+(category==="home"?"settings-home":"settings-subpage")} data-i18n-ignore aria-labelledby="settings-title" onKeyDown={e=>{if(e.key==="Escape"&&category!=="home"&&!e.defaultPrevented){e.preventDefault();e.stopPropagation();setCategory("home");}}}>
    <header className="forge-settings-heading">{category==="home"?<img src={settingsArt} alt="" aria-hidden="true"/>:null}<button type="button" className="settings-top-back" aria-label={category==="home"?t("Retour à l’écran précédent","Back to previous screen"):t("Retour aux paramètres","Back to settings")} onClick={back}>←</button><h1 ref={title} tabIndex={-1} id="settings-title">{category==="home"?t("Paramètres","Settings"):categories.find(c=>c.id===category)?.name}</h1></header>
    {category==="home"?<nav className="forge-settings-categories" aria-label={t("Catégories de paramètres","Settings categories")}>{categories.map(c=><button type="button" key={c.id} data-settings-category={c.id} onClick={()=>setCategory(c.id)}><span className="forge-setting-icon" aria-hidden="true"><SettingIcon kind={c.icon}/></span><span><strong>{c.name}</strong><small>{c.desc}</small></span><span aria-hidden="true">›</span></button>)}</nav>:null}
    {category==="language"?<div className="forge-settings-panel"><label htmlFor="settings-language">{t("Langue de l’interface","Interface language")}</label><select id="settings-language" value={language} onChange={e=>onLanguageChange(e.target.value as Locale)}><option value="fr">Français</option><option value="en">English</option></select><p>{t("Votre choix est mémorisé sans modifier les parties, cartes ou statistiques.","Your choice is saved without changing games, cards or statistics.")}</p></div>:null}
    {category==="audio"?<div className="forge-settings-panel">{volume("musicVolume",t("Musique","Music"))}{volume("ambienceVolume",t("Ambiance","Ambience"))}{volume("soundsVolume",t("Effets sonores","Sound effects"))}<button type="button" className="secondary-action audio-preview" disabled={preferences.soundsVolume===0} onClick={()=>playGameplayEffect("place")}><span aria-hidden="true">▷ </span>{t("Tester les effets sonores","Test sound effects")}</button><details className="settings-help"><summary>{t("Aide audio","Audio help")}</summary><p>{t("Si vous n’entendez rien, vérifiez le volume de votre appareil et autorisez le son dans votre navigateur.","If you hear nothing, check your device volume and allow sound in your browser.")}</p></details></div>:null}
    {category==="comfort"?<div className="forge-settings-panel">{toggle("hints",t("Aides contextuelles","Contextual hints"),t("Affiche des conseils pendant la partie. Les règles et les actions possibles restent accessibles.","Show helpful tips during play. Rules and available actions remain accessible."))}<label htmlFor="settings-animations">{t("Animations","Animations")}</label><select id="settings-animations" value={preferences.animations} onChange={e=>onPreferencesChange({...preferences,animations:e.target.value as SharedSettings["animations"]})}><option value="system">{t("Suivre le système","Follow system")}</option><option value="on">{t("Activées","Enabled")}</option><option value="off">{t("Désactivées","Disabled")}</option></select><details className="settings-help"><summary>{t("À propos des animations","About animations")}</summary><p>{t("Le mode système respecte la réduction des mouvements de votre appareil. Les résultats restent lisibles sans animation ni son.","System mode respects your device’s reduced-motion preference. Results remain readable without animation or sound.")}</p></details></div>:null}
    {category==="privacy"?<PrivacyPanel language={language}/>:null}
    {category==="about"?<div className="forge-settings-panel settings-about"><WorldLogo slug="cardforge" title="CardForge"/><p className="about-version">{t("Version","Version")} {APP_VERSION}</p><p>{t("Une collection de jeux de cartes solo, cinq univers à explorer.","A collection of solo card games, five worlds to explore.")}</p><p className="about-values">{t("✓ Gratuit · ✓ Sans publicité","✓ Free · ✓ No ads")}</p><button type="button" className="secondary-action settings-credits" onClick={onCredits}>{t("Crédits et licences","Credits and licences")} <span aria-hidden="true">›</span></button><p className="about-warning">{t("Version d’essai · ne pas redistribuer","Preview version · do not redistribute")}</p></div>:null}
    {["language","audio","comfort"].includes(category)?<details className="settings-help settings-common-help"><summary>{t("Enregistrement automatique","Automatic saving")}</summary><p className="forge-settings-note">{t("Réglages appliqués immédiatement à tous les jeux, sans modifier les sauvegardes ni les règles.","Settings apply immediately to all games without changing saves or rules.")}</p></details>:null}
  </section>;
}
