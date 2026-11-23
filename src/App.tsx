import { canPlay, games, statusLabel } from "./catalog";

export default function App() {
  return (
    <main className="shell" id="top">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="CardForge, retour en haut du catalogue">
          <span className="brand-icon" aria-hidden="true">♠</span> CardForge
        </a>
        <span className="pill">Collection en préparation</span>
      </header>

      <section className="hero" aria-labelledby="heading">
        <span className="eyebrow">Collection de jeux de cartes solo</span>
        <h1 id="heading">Un paquet de cartes.<br /><em>Cinq mondes à explorer.</em></h1>
        <p>Les règles des jeux originaux rencontrent cinq univers illustrés. Une collection gratuite,
          sans publicité et pensée pour le mobile.</p>
        <a className="explore-link" href="#catalog-title">Découvrir les univers <span aria-hidden="true">↓</span></a>
      </section>

      <section className="catalog" aria-labelledby="catalog-title">
        <div className="section-head">
          <div>
            <p className="section-kicker">La collection</p>
            <h2 id="catalog-title">Choisissez votre univers</h2>
          </div>
          <span>{games.length} jeux · 2 en développement pour le MVP</span>
        </div>
        <p className="catalog-hint" id="catalog-note">
          Le développement des moteurs ne signifie pas que les jeux sont déjà accessibles.
          Le lancement sera proposé après validation de l'expérience de jeu, des tests et des droits.
        </p>
        <div className="game-grid">
          {games.map((game) => {
            const playable = canPlay(game);
            return (
              <article
                className={`game-card ${game.accent}`}
                key={game.id}
                aria-labelledby={`game-${game.id}`}
                aria-describedby={`desc-${game.id}`}
              >
                <div className="game-art" aria-hidden="true">
                  <span className="art-ring" />
                  <span className="world-icon">{game.icon}</span>
                  <span className="art-caption">{game.sourceGame}</span>
                </div>
                <div className="game-body">
                  <div className="game-meta">
                    <span className="world-label">{game.setting}</span>
                    <span className={`availability ${playable ? "available" : game.status}`}>
                      {statusLabel(game)}
                    </span>
                  </div>
                  <h3 id={`game-${game.id}`}>{game.title}</h3>
                  <p id={`desc-${game.id}`}>{game.description}</p>
                  <div className="game-bottom">
                    <span className="source">Jeu original : {game.sourceGame}</span>
                    {playable ? (
                      <span className="release-note">Accès au jeu en préparation</span>
                    ) : (
                      <span className="not-ready" aria-label={`${game.title} : jeu non disponible pour le moment`}>
                        {game.mvpCandidate ? "Partie non accessible actuellement" : "À venir"}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <footer>
        <p>CardForge · Collection gratuite, sans publicité · Projet en cours de développement</p>
        <p>Les jeux et titres sources sont crédités dans leurs futures fiches.
          Aucun lancement de partie n'est actuellement proposé.</p>
      </footer>
    </main>
  );
}
