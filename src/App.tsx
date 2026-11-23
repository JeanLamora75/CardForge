import { useCallback, useEffect, useRef, useState } from "react";
import { canPlay, games, type GameEntry, type GameId } from "./catalog";
import {
  availableGameActions, EMPTY_PROGRESS, readCatalogGameProgress, victoryRate,
  type CatalogGameProgress,
} from "./application/catalog-navigation";
import {
  backRoute, HOME, parseCatalogRoute, routeHash, type CatalogRoute, type GameSection,
} from "./application/catalog-route";
import { createIndexedDbGameStorage } from "./adapters/indexeddb-game-storage";

const statusLabel = (game: GameEntry) =>
  canPlay(game) ? "Disponible" :
    game.status === "in-development" ? "En développement" : "À venir";

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
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", refresh);
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
  game, section, progress, onNavigate, onBack,
}: {
  game: GameEntry;
  section: GameSection;
  progress: CatalogGameProgress;
  onNavigate: (route: CatalogRoute) => void;
  onBack: () => void;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { titleRef.current?.focus(); }, [section, game.id]);
  const actions = availableGameActions(game, progress);
  const go = (view: GameSection) => onNavigate({ page: "game", gameId: game.id, section: view });
  const subPage = section !== "detail";

  return (
    <section className={`detail ${game.accent}`} aria-labelledby="game-title">
      <div className="detail-navigation">
        <button className="back-link" type="button" onClick={onBack}>
          <span aria-hidden="true">←</span> {subPage ? `Retour à ${game.title}` : "Retour au catalogue"}
        </button>
        <span className="status" data-status={game.status}>{statusLabel(game)}</span>
      </div>
      {section === "detail" ? (
        <div className="detail-layout">
          <div className="detail-art" aria-hidden="true"><span>{game.icon}</span></div>
          <div className="detail-copy">
            <span className="eyebrow">Un univers CardForge</span>
            <h1 id="game-title" ref={titleRef} tabIndex={-1}>{game.title}</h1>
            <p className="setting">{game.setting}</p>
            <p className="detail-description">{game.description}</p>
            {progress.indicator === "active" ? (
              <p className="save-indicator" role="status">● Une partie enregistrée est présente sur cet appareil.</p>
            ) : null}
            <h2>Découvrez les mécanismes</h2>
            <p>{game.mechanics}</p>
            <div className="context-actions" aria-label={`Actions pour ${game.title}`}>
              {actions.resume && game.playableRoute ? (
                <a className="primary-action" href={game.playableRoute}>Reprendre</a>
              ) : null}
              {actions.newGame && game.playableRoute && progress.indicator !== "active" ? (
                <a className="primary-action" href={game.playableRoute}>Jouer</a>
              ) : null}
              {actions.newGame && progress.indicator === "active" ? (
                <span className="availability-note">Nouvelle partie : confirmation de remplacement requise dans le parcours de jeu.</span>
              ) : null}
              <button type="button" className="secondary-action" onClick={() => go("rules")}>Règles</button>
              <button type="button" className="secondary-action" onClick={() => go("statistics")}>Statistiques</button>
            </div>
            <p className="help-note">Tutoriel : disponible lors de l’ouverture d’un jeu jouable. L’accès au plateau et au tutoriel reste fermé tant que l’interface de partie n’est pas livrée.</p>
            <details className="source-credits">
              <summary>Origine du jeu et crédits</summary>
              <dl className="game-facts">
                <div><dt>Mode</dt><dd>Solo</dd></div>
                <div><dt>Règles d’origine</dt><dd>{game.originalGame}</dd></div>
                <div><dt>Crédits</dt><dd>{game.authors}</dd></div>
              </dl>
            </details>
            {!canPlay(game) ? (
              <p className="availability-note" role="status">
                <strong>{statusLabel(game)}</strong> — La partie jouable n’est pas encore disponible.
                Aucun lancement de jeu n’est proposé.
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="context-page">
          <span className="eyebrow">{game.title}</span>
          <h1 id="game-title" ref={titleRef} tabIndex={-1}>
            {section === "rules" ? "Règles et mécanismes" : "Statistiques locales"}
          </h1>
          {section === "rules" ? (
            <>
              <p>{game.mechanics}</p>
              <p className="help-note">Ce résumé présente les mécanismes. Le référentiel des règles détaille les actions et les conditions de victoire et de défaite.</p>
              <a className="secondary-action" href={ruleReference[game.id]} target="_blank" rel="noopener noreferrer">
                Consulter le référentiel des règles <span aria-hidden="true">↗</span>
              </a>
            </>
          ) : (
            <>
              <p>Les compteurs sont lus sur cet appareil, sans modifier les sauvegardes ni les résultats.</p>
              <dl className="game-facts stats-list">
                <div><dt>Parties closes</dt><dd>{progress.statistics?.played ?? "—"}</dd></div>
                <div><dt>Victoires</dt><dd>{progress.statistics?.won ?? "—"}</dd></div>
                <div><dt>Défaites</dt><dd>{progress.statistics?.lost ?? "—"}</dd></div>
                <div><dt>Abandons</dt><dd>{progress.statistics?.abandoned ?? "—"}</dd></div>
                <div><dt>Taux de victoire</dt><dd>{victoryRate(progress.statistics)}</dd></div>
              </dl>
              <p className="help-note">« — » indique qu’aucune donnée statistique n’a été enregistrée localement ou n’est consultable.</p>
            </>
          )}
        </div>
      )}
    </section>
  );
}

function Settings({ onBack }: { onBack: () => void }) {
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => { title.current?.focus(); }, []);
  return (
    <section className="context-page" aria-labelledby="settings-title">
      <button className="back-link" type="button" onClick={onBack}>← Retour au catalogue</button>
      <h1 ref={title} tabIndex={-1} id="settings-title">Paramètres</h1>
      <p>CardForge fonctionne sans compte et enregistre les parties dans le navigateur. La navigation entre les écrans n’abandonne jamais une partie.</p>
      <p className="help-note">Les options de personnalisation et de langue seront proposées dans une version ultérieure. Aucun réglage local n’est modifié ici.</p>
    </section>
  );
}

export default function App() {
  const [route, setRoute] = useState<CatalogRoute>(() => parseCatalogRoute(window.location.hash));
  const { progress, error } = useCatalogProgress();
  const lastTrigger = useRef<HTMLElement | null>(null);
  const brandRef = useRef<HTMLButtonElement>(null);

  const navigate = (next: CatalogRoute) => {
    const hash = routeHash(next);
    if (window.location.hash === hash || (!hash && !window.location.hash)) {
      setRoute(next);
    } else {
      window.location.hash = hash || "#";
    }
  };
  const back = () => navigate(backRoute(route));

  useEffect(() => {
    const onHashChange = () => setRoute(parseCatalogRoute(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  useEffect(() => {
    if (route.page === "catalog") {
      const trigger = lastTrigger.current;
      if (trigger?.isConnected) trigger.focus();
      else brandRef.current?.focus();
    }
  }, [route]);
  useEffect(() => {
    if (route.page === "catalog") return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        back();
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [route]);

  const openGame = (game: GameEntry, trigger: HTMLButtonElement) => {
    lastTrigger.current = trigger;
    navigate({ page: "game", gameId: game.id, section: "detail" });
  };
  const currentGame = route.page === "game" ? games.find(game => game.id === route.gameId) : undefined;

  return (
    <main className="shell">
      <header className="topbar">
        <button ref={brandRef} className="brand" type="button" onClick={() => navigate(HOME)}
          aria-label="CardForge, retour au catalogue">
          <span className="brand-icon" aria-hidden="true">♠</span> CardForge
        </button>
        <div className="topbar-actions">
          <span className="pill">Collection solo · En création</span>
          <button className="settings-button" type="button" onClick={() => navigate({ page: "settings" })}
            aria-label="Paramètres">⚙ Paramètres</button>
        </div>
      </header>
      {error ? <p className="storage-warning" role="alert">{error}</p> : null}
      {route.page === "settings" ? <Settings onBack={back} /> :
      currentGame && route.page === "game" ? (
        <GameDetail game={currentGame} section={route.section}
          progress={progress[currentGame.id] ?? EMPTY_PROGRESS} onNavigate={navigate} onBack={back} />
      ) : (
        <>
          <section className="hero" aria-labelledby="heading">
            <span className="eyebrow">Cinq mondes · Une collection</span>
            <h1 id="heading">Un paquet de cartes.<br/><em>Des mondes à explorer.</em></h1>
            <p>Retrouvez le plaisir des règles originales dans cinq univers de cartes illustrées.
              Une collection gratuite, sans publicité, imaginée pour le jeu en solo.</p>
          </section>
          <section className="catalog" aria-labelledby="catalog-title">
            <div className="section-head">
              <h2 id="catalog-title">Choisissez votre univers</h2>
              <span>{games.length} jeux dans la collection</span>
            </div>
            <p className="catalog-notice">Les moteurs de Grim Delve et Thunderfighter sont en développement.
              Les interfaces de partie ne sont pas encore ouvertes au public.</p>
            <div className="game-grid">
              {games.map(game => (
                <article className={`game-card ${game.accent}`} key={game.id} aria-labelledby={`name-${game.id}`}>
                  <div className="game-art" aria-hidden="true"><span>{game.icon}</span></div>
                  <div className="game-body">
                    <div className="game-meta">
                      <span className="world-label">{game.setting}</span>
                      <span className="status" data-status={game.status}>{statusLabel(game)}</span>
                    </div>
                    <h3 id={`name-${game.id}`}>{game.title}</h3>
                    <p>{game.description}</p>
                    {(progress[game.id]?.indicator === "active") ?
                      <p className="save-indicator">● Partie en cours sur cet appareil</p> : null}
                    <div className="card-actions">
                      <button className="secondary-action" type="button"
                        onClick={event => openGame(game, event.currentTarget)}
                        aria-label={`Découvrir ${game.title}`}>
                        Découvrir <span aria-hidden="true">↗</span>
                      </button>
                      {canPlay(game) && game.playableRoute ? (
                        <a className="primary-action" href={game.playableRoute}>Jouer</a>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
      <footer>CardForge · Collection en construction · Les jeux ne sont pas encore accessibles en partie</footer>
    </main>
  );
}
