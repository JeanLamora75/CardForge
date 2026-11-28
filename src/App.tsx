import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { readLanguage, saveLanguage, type Locale } from "./i18n/language.ts";
import { localizeSurface } from "./i18n/surface.ts";
import { readSharedSettings, saveSharedSettings, type SharedSettings } from "./application/shared-settings.ts";
import { resumeAudio, suspendAudio, updateAudioPreferences, setThemedMusic } from "./application/audio.ts";
import { setSkydeckScene, setSkydeckHidden, unlockSkydeckAudio, updateSkydeckAudio, playSkydeckSound } from "./application/skydeck-audio.ts";
import { canPlay, games, type GameEntry, type GameId } from "./catalog";
import {
  EMPTY_PROGRESS, readCatalogGameProgress,
  type CatalogGameProgress,
} from "./application/catalog-navigation";
import {
  backRoute, HOME, parseCatalogRoute, routeHash, type CatalogRoute, type GameSection,
} from "./application/catalog-route";
import { createIndexedDbGameStorage } from "./adapters/indexeddb-game-storage";
import GameLearning, { Rulebook } from "./components/GameLearning";
import { GameStatisticsPanel } from "./components/GameResultPanel";
import Settings from "./components/Settings";
import OfflineReadiness from "./components/OfflineReadiness";
import CreditsPage from "./components/CreditsPage";
import RegicideLearning from "./components/RegicideLearning.tsx";
import RegicideRulebook from "./components/RegicideRulebook.tsx";
import { Gallery, WorldMenu, WorldLogo, WorldBackdrop } from "./components/ImmersiveMenu";

const statusLabel = (game: GameEntry) => canPlay(game) ? "Disponible" : "À venir";

type ProgressByGame = Partial<Record<GameId, CatalogGameProgress>>;

function useCatalogProgress(): {
  progress: ProgressByGame;
  error: string | null;
  refresh: () => void;
} {
  const [progress, setProgress] = useState<ProgressByGame>({});
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision(rev => rev + 1), []);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const storage = createIndexedDbGameStorage();
        const results = await Promise.all(games.map(async game => ({
          id: game.id,
          overview: await readCatalogGameProgress(storage, game.id),
        })));
        if (cancelled) return;
        setProgress(Object.fromEntries(results.map(({ id, overview }) => [id, overview])) as ProgressByGame);
        setError(null);
      } catch {
        if (!cancelled) {
          setProgress({});
          setError("Les sauvegardes et statistiques locales ne peuvent pas être consultées sur cet appareil.");
        }
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [revision]);
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === "visible") refresh(); };
    window.addEventListener("focus", refresh);
    window.addEventListener("hashchange", refresh);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("hashchange", refresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);
  return { progress, error, refresh };
}

const ruleReference: Record<GameId, string> = {
  "clear-the-dungeon": "https://github.com/JeanLamora75/CardForge/blob/main/_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md",
  gridcannon: "https://github.com/JeanLamora75/CardForge/blob/main/_bmad-output/planning-artifacts/game-rules/gridcannon.md",
  "card-capture": "https://github.com/JeanLamora75/CardForge/blob/main/_bmad-output/planning-artifacts/game-rules/card-capture.md",
  "loot-the-loop": "https://github.com/JeanLamora75/CardForge/blob/main/_bmad-output/planning-artifacts/game-rules/loot-the-loop.md",
  regicide: "https://github.com/JeanLamora75/CardForge/blob/main/_bmad-output/planning-artifacts/game-rules/regicide.md",
};

function GameDetail({
  game, section, progress, onNavigate, onBack, hintsEnabled, onHintsChange, language, onSettings,
}: {
  game: GameEntry;
  language: Locale;
  section: GameSection;
  progress: CatalogGameProgress;
  onNavigate: (route: CatalogRoute) => void;
  onBack: () => void;
  onSettings: () => void;
  hintsEnabled: boolean;
  onHintsChange: (enabled: boolean) => void;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { titleRef.current?.focus(); }, [section, game.id]);
  const [learn, setLearn] = useState(false);
  const [thunderHelp,setThunderHelp]=useState(false);
  const go = (view: GameSection) => onNavigate({ page: "game", gameId: game.id, section: view });
  const subPage = section !== "detail";
  const thunderCommand = game.id === "gridcannon" && section === "board";
  const grimCommand = game.id === "clear-the-dungeon" && section === "board";
  const msCommand = game.id === "loot-the-loop" && section === "board";
  const skyCommand = game.id === "card-capture" && section === "board";
  const immersiveCommand = thunderCommand || grimCommand || msCommand || skyCommand;

  if (section === "detail") return <WorldMenu key={game.id} id={game.id} title={game.title} language={language} active={progress.indicator==="active"} onBack={onBack} onBoard={()=>{setLearn(false);go("board");}} onLearn={()=>{setLearn(true);go("board");}} onRules={()=>go("rules")} onStats={()=>go("statistics")}/>;
  return (
    <section className={`detail ${game.accent}${thunderCommand?" thunder-command-page":grimCommand?" grim-command-page":msCommand?" ms-command-page":skyCommand?" sd-command-page":""}`} aria-labelledby="game-title">
      {skyCommand?<header className="sd-command-header" data-i18n-ignore><button type="button" aria-label={language==="en"?"Back to Skydeck":"Retour à Skydeck"} onClick={onBack}>←</button><h1 id="game-title" ref={titleRef} tabIndex={-1}><WorldLogo slug="skydeck" title="Skydeck"/></h1><button type="button" aria-label={language==="en"?"Help":"Aide"} aria-expanded={thunderHelp} onClick={()=>{playSkydeckSound(thunderHelp?"close":"open");setThunderHelp(v=>!v);}}>?</button><button type="button" className="settings-button" aria-label={language==="en"?"Settings":"Paramètres"} onClick={onSettings}>⚙</button></header>:msCommand?<header className="ms-header" data-i18n-ignore><button type="button" aria-label={language==="en"?"Back":"Retour"} onClick={onBack}><img src={import.meta.env.BASE_URL+"art/icons/midnight-syndicate/back.webp"} alt=""/></button><h1 id="game-title" ref={titleRef} tabIndex={-1}><img src={import.meta.env.BASE_URL+"art/logos/midnight-syndicate/board.webp"} alt="Midnight Syndicate"/></h1><button type="button" aria-label={language==="en"?"Help":"Aide"} aria-expanded={thunderHelp} onClick={()=>setThunderHelp(v=>!v)}><img src={import.meta.env.BASE_URL+"art/icons/midnight-syndicate/help.webp"} alt=""/></button><button type="button" className="settings-button" aria-label={language==="en"?"Settings":"Paramètres"} onClick={onSettings}><img src={import.meta.env.BASE_URL+"art/icons/midnight-syndicate/settings.webp"} alt=""/></button></header>:grimCommand?<header className="gd-command-header" data-i18n-ignore><button type="button" className="gd-nav gd-back" aria-label={language==="en"?"Back to Grim Delve":"Retour à Grim Delve"} onClick={onBack}>←</button><h1 id="game-title" ref={titleRef} tabIndex={-1}><img src={import.meta.env.BASE_URL+"art/logos/grim-delve/board.webp"} alt="Grim Delve"/></h1><button type="button" className="gd-nav gd-help" aria-label={language==="en"?"Help":"Aide"} aria-expanded={thunderHelp} onClick={()=>setThunderHelp(v=>!v)}>?</button><button type="button" className="gd-nav gd-settings" aria-label={language==="en"?"Settings":"Paramètres"} onClick={onSettings}>⚙</button></header>:thunderCommand?<header className="tf-command-header" data-i18n-ignore><button type="button" className="back-link tf-header-back" aria-label={language==="en"?"Back to Thunderfighter":"Retour à Thunderfighter"} onClick={onBack}>←</button><h1 id="game-title" ref={titleRef} tabIndex={-1}><WorldLogo slug="thunderfighter" title="Thunderfighter"/></h1><button type="button" className="tf-help-toggle" aria-label={language==="en"?"Help":"Aide"} aria-expanded={thunderHelp} onClick={()=>setThunderHelp(v=>!v)}>?</button><button type="button" className="settings-button" aria-label={language==="en"?"Settings":"Paramètres"} onClick={onSettings}>⚙</button></header>:<div className="detail-navigation">
        <button className="back-link" type="button" onClick={onBack}>
          <span aria-hidden="true">←</span> {subPage ? `Retour à ${game.title}` : "Retour au catalogue"}
        </button>
        {!immersiveCommand?<span className="status" data-status={game.status}>{statusLabel(game)}</span>:null}
      </div>}
      {(
        <div className={section === "board" ? "board-page" : "context-page"}>
          {!immersiveCommand?<span className="eyebrow">{game.title}</span>:null}
          {!immersiveCommand?<h1 id="game-title" ref={titleRef} tabIndex={-1}>
            {thunderCommand ? "Thunderfighter" : section === "rules" ? "Règles et mécanismes" : section === "board" ? "Plateau interactif" : "Statistiques locales"}
          </h1>:null}
          {section === "board" && game.id === "regicide" ? <RegicideLearning language={language} hintsEnabled={hintsEnabled} onHintsChange={onHintsChange} initialLearn={learn} /> : section === "board" && (game.id === "clear-the-dungeon" || game.id === "gridcannon" || game.id === "loot-the-loop" || game.id === "card-capture") ? <GameLearning key={game.id} gameId={game.id} language={language} hintsEnabled={hintsEnabled} onHintsChange={onHintsChange} initialLearn={learn} thunderHelp={thunderHelp} onCloseThunderHelp={()=>setThunderHelp(false)} /> : section === "rules" ? (
            <>
              <p>{game.mechanics}</p>
              {game.id === "regicide" ? <RegicideRulebook language={language} /> : (game.id === "clear-the-dungeon" || game.id === "gridcannon" || game.id === "loot-the-loop" || game.id === "card-capture") ? <Rulebook gameId={game.id} language={language} /> : <p className="help-note">Les règles détaillées de ce jeu à venir ne sont pas encore intégrées.</p>}
              <a className="secondary-action" href={ruleReference[game.id]} target="_blank" rel="noopener noreferrer">
                Consulter le référentiel des règles <span aria-hidden="true">↗</span>
              </a>
            </>
          ) : (
            <>
              <p>Les compteurs sont lus sur cet appareil, sans modifier les sauvegardes ni les résultats.</p>
              <GameStatisticsPanel statistics={progress.statistics} />
              <p className="help-note">Taux = victoires / (victoires + défaites). Les abandons et tutoriels sont exclus du taux. « — » indique qu’aucune victoire ou défaite n’est enregistrée.</p>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default function App() {
  const [preferences, setPreferences] = useState<SharedSettings>(() => {
    try { return readSharedSettings(window.localStorage); }
    catch { return readSharedSettings(null); }
  });
  const [settingsSaveFailed, setSettingsSaveFailed] = useState(false);
  const changePreferences = (next: SharedSettings) => {
    setPreferences(next);
    updateAudioPreferences(next);
    updateSkydeckAudio(next);
    let store: Storage | null = null;
    try { store = window.localStorage; } catch { /* Storage can be blocked. */ }
    setSettingsSaveFailed(!saveSharedSettings(store, next));
  };
  useEffect(() => {
    updateAudioPreferences(preferences);
    updateSkydeckAudio(preferences);
    const onVisibility = () => {setSkydeckHidden(document.hidden);if(document.hidden)suspendAudio();else resumeAudio();};
    onVisibility();
    const unlock=()=>unlockSkydeckAudio();
    window.addEventListener("pointerdown",unlock);
    window.addEventListener("keydown",unlock);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointerdown",unlock);
      window.removeEventListener("keydown",unlock);
      setSkydeckScene("off");
      suspendAudio();
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = preferences.animations;
  }, [preferences.animations]);
  const [language, setLanguage] = useState<Locale>(() => {
    let store: Storage | null = null;
    try { store = window.localStorage; } catch { /* Browser storage unavailable. */ }
    return readLanguage(store, navigator.languages);
  });
  const surfaceRef = useRef<HTMLElement>(null);
  const [languageSaveFailed, setLanguageSaveFailed] = useState(false);
  const selectLanguage = (next: Locale) => {
    setLanguage(next);
    let store: Storage | null = null;
    try { store = window.localStorage; } catch { /* Browser storage unavailable. */ }
    setLanguageSaveFailed(!saveLanguage(store, next));
  };
  useLayoutEffect(() => {
    document.documentElement.lang = language;
    return surfaceRef.current ? localizeSurface(surfaceRef.current, language) : undefined;
  }, [language]);
  const [route, setRoute] = useState<CatalogRoute>(() => parseCatalogRoute(window.location.hash));
  useEffect(()=>{
    const scene=route.page==="game"&&route.gameId==="card-capture"?(route.section==="board"?"gameplay":"menu"):"off";
    setThemedMusic(scene!=="off");
    setSkydeckScene(scene);
  },[route]);
  const { progress, error } = useCatalogProgress();
  const lastTrigger = useRef<HTMLElement | null>(null);
  const lastGalleryControl = useRef<string | null>(null);
  const brandRef = useRef<HTMLButtonElement>(null);
  const settingsOrigin = useRef<CatalogRoute>(HOME);

  const navigate = (next: CatalogRoute) => {
    if(route.page==="game"&&route.gameId==="card-capture")playSkydeckSound("button");
    const hash = routeHash(next);
    if (window.location.hash === hash || (!hash && !window.location.hash)) {
      setRoute(next);
    } else {
      window.location.hash = hash || "#";
    }
  };
  const back = () => navigate(backRoute(route, settingsOrigin.current));

  useEffect(() => {
    const onHashChange = () => setRoute(parseCatalogRoute(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  useEffect(() => {
    if (route.page !== "catalog") window.scrollTo({top:0,behavior:"instant"});
    if (route.page === "catalog") {
      const trigger = lastTrigger.current;
      if (trigger?.isConnected) trigger.focus();
      else if(lastGalleryControl.current) surfaceRef.current?.querySelector<HTMLElement>(lastGalleryControl.current)?.focus({preventScroll:true});
    }
  }, [route]);
  useEffect(() => {
    if (route.page === "catalog") return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) {
        event.preventDefault();
        if(route.page==="about")navigate({page:"settings"});else back();
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [route]);

  const openGame = (game: GameEntry, trigger: HTMLButtonElement) => {
    lastTrigger.current = trigger;
    lastGalleryControl.current = `[data-game-id="${game.id}"] button`;
    navigate({ page: "game", gameId: game.id, section: "detail" });
  };
  const galleryScroll=useRef(0);
  const immersive=route.page==="game" && route.section==="detail";
  const settingsSurface=route.page==="settings"||route.page==="about";
  const thunderSurface=route.page==="game"&&route.gameId==="gridcannon"&&route.section==="board";
  const msSurface=route.page==="game"&&route.gameId==="loot-the-loop"&&route.section==="board";
  const grimSurface=route.page==="game"&&route.gameId==="clear-the-dungeon"&&route.section==="board";
  const skySurface=route.page==="game"&&route.gameId==="card-capture"&&route.section==="board";
  const currentGame = route.page === "game" ? games.find(game => game.id === route.gameId) : undefined;

  return (
    <main ref={surfaceRef} className={`shell ${immersive?"forge-full":route.page==="catalog"?"forge-home":settingsSurface?"forge-settings-surface":thunderSurface?"thunder-command-surface":grimSurface?"grim-command-surface":msSurface?"ms-command-surface":skySurface?"sd-command-surface":""}`}>
      {route.page==="catalog"||settingsSurface?<WorldBackdrop slug="cardforge"/>:null}
      {skySurface?<WorldBackdrop slug="skydeck"/>:null}
      {!immersive&&!thunderSurface&&!grimSurface&&!msSurface&&!skySurface?<header className={route.page==="catalog"?"topbar forge-gallery-header":settingsSurface?"topbar forge-settings-header":"topbar"}>
        <button ref={brandRef} className="brand" type="button" onClick={() => navigate(HOME)}
          aria-label="CardForge, retour au catalogue">
          {route.page==="catalog"||settingsSurface?<WorldLogo slug="cardforge" title="CardForge"/>:<><span className="brand-icon" aria-hidden="true">♠</span> CardForge</>}
        </button>
        {route.page!=="catalog"&&!settingsSurface?<div className="topbar-actions"><button className="settings-button" type="button" onClick={()=>{settingsOrigin.current=route;navigate({page:"settings"});}} aria-label="Paramètres">⚙ Paramètres</button></div>:null}
      </header>:null}
      {settingsSaveFailed ? <p className="storage-warning" role="status" data-i18n-ignore>{language==="en"?"Your settings work for this session but could not be saved.":"Vos réglages s’appliquent pour cette session, mais n’ont pas pu être enregistrés."}</p> : null}
      {languageSaveFailed ? <p className="storage-warning" role="status" data-i18n-ignore>{language==="en"?"Your chosen language could not be saved for next time.":"Votre langue n’a pas pu être mémorisée pour la prochaine session."}</p> : null}
      {error ? <p className="storage-warning" role="alert">{error}</p> : null}
      <OfflineReadiness language={language} />
      {route.page === "about" ? <CreditsPage language={language} onBack={()=>navigate({page:"settings"})} /> :
      route.page === "settings" ? <Settings onBack={back} onCredits={()=>navigate({page:"about"})} language={language} onLanguageChange={selectLanguage} preferences={preferences} onPreferencesChange={changePreferences} /> :
      currentGame && route.page === "game" ? (
        <GameDetail game={currentGame} section={route.section}
          progress={progress[currentGame.id] ?? EMPTY_PROGRESS} onNavigate={navigate} onBack={back} onSettings={()=>{settingsOrigin.current=route;navigate({page:"settings"});}} language={language}
          hintsEnabled={preferences.hints} onHintsChange={value => changePreferences({ ...preferences, hints: value })} />
      ) : (
        <Gallery language={language} progress={progress} openSettings={button=>{lastTrigger.current=button;lastGalleryControl.current=".forge-settings-tile";settingsOrigin.current=HOME;navigate({page:"settings"});}} scrollTop={galleryScroll.current} onScroll={v=>{galleryScroll.current=v;}} open={(id,button)=>{const game=games.find(g=>g.id===id);if(game)openGame(game,button);}}/>
      )}
    </main>
  );
}
