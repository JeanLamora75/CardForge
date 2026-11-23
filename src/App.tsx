import { useEffect, useRef, useState } from "react";
import { canPlay, games, type GameEntry } from "./catalog";

const statusLabel = (game: GameEntry) =>
  canPlay(game) ? "Disponible" :
    game.status === "in-development" ? "En développement" : "À venir";

function GameDetail({ game, onClose }: { game: GameEntry; onClose: () => void }) {
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeButton.current?.focus();
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [onClose]);
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
          <h1 id="game-title">{game.title}</h1>
          <p className="setting">{game.setting}</p>
          <p className="detail-description">{game.description}</p>
          <h2>Comment se joue cet univers ?</h2>
          <p>{game.mechanics}</p>
          <dl className="game-facts">
            <div><dt>Mode</dt><dd>Solo</dd></div>
            <div><dt>Règles d’origine</dt><dd>{game.originalGame}</dd></div>
            <div><dt>Crédits</dt><dd>{game.authors}</dd></div>
          </dl>
          {canPlay(game) ? (
            <a className="primary-action" href={game.playableRoute!}>Jouer à {game.title}</a>
          ) : (
            <p className="availability-note" role="status">
              <strong>{statusLabel(game)}</strong> — La partie jouable n’est pas encore disponible.
              Aucun démarrage de partie n’est proposé à ce stade.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [selected, setSelected] = useState<GameEntry | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  const openGame = (game: GameEntry, trigger: HTMLButtonElement) => {
    lastTrigger.current = trigger;
    setSelected(game);
  };
  const closeGame = () => {
    setSelected(null);
    requestAnimationFrame(() => lastTrigger.current?.focus());
  };

  return (
    <main className="shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={closeGame} aria-label="CardForge, retour au catalogue">
          <span className="brand-icon" aria-hidden="true">♠</span> CardForge
        </button>
        <span className="pill">Collection solo · En création</span>
      </header>

      {selected ? <GameDetail game={selected} onClose={closeGame} /> : (
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
                    <div className="card-actions">
                      <button className="secondary-action" type="button"
                        onClick={event => openGame(game, event.currentTarget)}
                        aria-label={`Découvrir ${game.title}`}>
                        Découvrir <span aria-hidden="true">↗</span>
                      </button>
                      {canPlay(game) ? (
                        <a className="primary-action" href={game.playableRoute!}>Jouer</a>
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
