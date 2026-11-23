import { useCallback, useEffect, useRef, useState } from "react";
import { canPlay, games, type GameEntry, type GameId } from "./catalog";
import { createIndexedDbGameStorage } from "./adapters/indexeddb-game-storage";
import {
  availableGameActions, EMPTY_PROGRESS, readCatalogGameProgress, victoryRate,
  type CatalogGameProgress,
} from "./application/catalog-navigation";

type DetailView = "overview" | "rules" | "statistics" | "credits";
type ProgressMap = Partial<Record<GameId, CatalogGameProgress>>;
const statusLabel = (game: GameEntry) =>
  canPlay(game) ? "Disponible" :
    game.status === "in-development" ? "En développement" : "À venir";

const views: readonly { id: DetailView; label: string }[] = [
  { id: "overview", label: "Présentation" },
  { id: "rules", label: "Règles" },
  { id: "statistics", label: "Statistiques" },
  { id: "credits", label: "Crédits" },
];

function GameDetail({
  game, progress, loading, error, onClose,
}: {
  game: GameEntry;
  progress: CatalogGameProgress;
  loading: boolean;
  error: boolean;
  onClose: () => void;
}) {
  const [view, setView] = useState<DetailView>("overview");
  const closeButton = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    closeButton.current?.focus();
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [onClose]);

  const actions = availableGameActions(game, progress);
  const stats = progress.statistics;
  const active = progress.indicator === "active";
  return (
    <section className={`detail ${game.accent}`} aria-labelledby="game-title">
      <div className="detail-navigation">
        <button ref={closeButton} className="back-link" onClick={onClose} type="button">
          <span aria-hidden="true">←</span> Retour au catalogue
        </button>
        <span className="status" data-status={game.status}>{statusLabel(game)}</span>
      </div>
      <div className="detail-layout">
        <div className="detail-art" aria-hidden="true"><span>{game.icon}</span></div>
        <div className="detail-copy">
          <span className="eyebrow">Un univers CardForge</span>
          <h1 id="game-title" ref={heading} tabIndex={-1}>{game.title}</h1>
          <p className="setting">{game.setting}</p>
          {active && <p className="session-indicator"><span aria-hidden="true">● </span>Partie sauvegardée en cours</p>}
          <nav aria-label={`Sections de ${game.title}`} className="detail-tabs">
            {views.map(item => (
              <button key={item.id} type="button" className="detail-tab"
                aria-current={view === item.id ? "page" : undefined}
                onClick={() => setView(item.id)}>
                {item.label}
              </button>
            ))}
          </nav>
          {view === "overview" && (
            <div className="detail-section">
              <p className="detail-description">{game.description}</p>
              <h2>Comment se joue cet univers ?</h2>
              <p>{game.mechanics}</p>
              <p className="availability-note" role="status">
                <strong>{statusLabel(game)}</strong> — L’interface de partie n’est pas encore disponible.
                Les moteurs existants restent en développement et aucune commande de jeu n’est ouverte.
              </p>
              {actions.play && (
                <p className="action-row">
                  <a className="primary-action" href={game.playableRoute!}>Jouer</a>
                  {actions.resume && <a className="secondary-action" href={game.playableRoute!}>Reprendre</a>}
                  {actions.newGame && <span className="action-hint">Nouvelle partie : confirmation requise avant remplacement.</span>}
                </p>
              )}
              <p className="feature-pending">Tutoriel interactif : en préparation. Aucun tutoriel fictif n’est lancé.</p>
            </div>
          )}
          {view === "rules" && (
            <div className="detail-section">
              <h2>Aperçu des règles</h2>
              <p>{game.mechanics}</p>
              <p>Les règles proviennent de <strong>{game.originalGame}</strong>. Leur adaptation conserve les mécaniques originales.</p>
              <p className="feature-pending">La consultation détaillée et le tutoriel interactif seront ajoutés avec les écrans de jeu.</p>
            </div>
          )}
          {view === "statistics" && (
            <div className="detail-section" aria-live="polite">
              <h2>Statistiques personnelles</h2>
              {loading ? <p>Lecture des données locales…</p> : error ? (
                <p role="alert">Les données locales sont indisponibles. Aucune sauvegarde n’a été modifiée.</p>
              ) : (
                <>
                  <dl className="game-facts">
                    <div><dt>Parties closes</dt><dd>{stats?.played ?? 0}</dd></div>
                    <div><dt>Victoires</dt><dd>{stats?.won ?? 0}</dd></div>
                    <div><dt>Défaites</dt><dd>{stats?.lost ?? 0}</dd></div>
                    <div><dt>Abandons</dt><dd>{stats?.abandoned ?? 0}</dd></div>
                    <div><dt>Taux de victoire</dt><dd>{victoryRate(stats)}</dd></div>
                  </dl>
                  <p className="feature-pending">Ces données sont enregistrées uniquement sur cet appareil et ce navigateur.</p>
                </>
              )}
            </div>
          )}
          {view === "credits" && (
            <div className="detail-section">
              <h2>Origine et crédits</h2>
              <dl className="game-facts">
                <div><dt>Mode</dt><dd>Solo</dd></div>
                <div><dt>Jeu source</dt><dd>{game.originalGame}</dd></div>
                <div><dt>Auteurs</dt><dd>{game.authors}</dd></div>
              </dl>
              <p className="feature-pending">Les univers visuels sont des adaptations originales CardForge.</p>
            </div>
          )}
          {loading && <p className="progress-hint" role="status">Vérification de la sauvegarde locale…</p>}
          {!loading && error && view !== "statistics" && (
            <p className="progress-hint" role="alert">État de sauvegarde indisponible. La navigation ne supprime aucune donnée.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [selected, setSelected] = useState<GameEntry | null>(null);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    let canceled = false;
    try {
      const storage = createIndexedDbGameStorage();
      Promise.all(games.map(async game => [game.id, await readCatalogGameProgress(storage, game.id)] as const))
        .then(rows => {
          if (!canceled) {
            setProgress(Object.fromEntries(rows) as ProgressMap);
            setLoading(false);
          }
        }).catch(() => {
          if (!canceled) { setError(true); setLoading(false); }
        });
    } catch {
      if (!canceled) { setError(true); setLoading(false); }
    }
    return () => { canceled = true; };
  }, []);

  const openGame = (game: GameEntry, trigger: HTMLButtonElement) => {
    lastTrigger.current = trigger;
    setSelected(game);
  };
  const closeGame = useCallback(() => {
    setSelected(null);
    requestAnimationFrame(() => lastTrigger.current?.focus());
  }, []);

  return (
    <main className="shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={closeGame} aria-label="CardForge, retour au catalogue">
          <span className="brand-icon" aria-hidden="true">♠</span> CardForge
        </button>
        <span className="pill">Collection solo · En création</span>
      </header>
      {selected ? (
        <GameDetail key={selected.id} game={selected} progress={progress[selected.id] ?? EMPTY_PROGRESS}
          loading={loading} error={error} onClose={closeGame} />
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
                    {progress[game.id]?.indicator === "active" && (
                      <p className="session-indicator"><span aria-hidden="true">● </span>Partie en cours</p>
                    )}
                    <p>{game.description}</p>
                    <div className="card-actions">
                      <button className="secondary-action" type="button"
                        onClick={event => openGame(game, event.currentTarget)}
                        aria-label={`Découvrir ${game.title}`}>
                        Découvrir <span aria-hidden="true">↗</span>
                      </button>
                      {canPlay(game) && <a className="primary-action" href={game.playableRoute!}>Jouer</a>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {!loading && error && <p className="progress-hint" role="alert">
              Les sauvegardes locales ne peuvent pas être consultées actuellement ; aucun jeu n’a été modifié.
            </p>}
          </section>
        </>
      )}
      <footer>CardForge · Collection en construction · Les jeux ne sont pas encore accessibles en partie</footer>
    </main>
  );
}
