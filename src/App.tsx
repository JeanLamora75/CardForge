import { games } from "./catalog";

export default function App() {
  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="CardForge, accueil"><span className="brand-icon">♠</span> CardForge</a>
        <span className="pill">Prototype initial</span>
      </header>
      <section className="hero" aria-labelledby="heading">
        <span className="eyebrow">Collection de jeux de cartes solo</span>
        <h1 id="heading">Un paquet de cartes.<br/><em>Des mondes à explorer.</em></h1>
        <p>Des mécaniques classiques dans des univers illustrés originaux. Gratuit, sans publicité, conçu pour le mobile.</p>
      </section>
      <section className="catalog" aria-labelledby="catalog-title">
        <div className="section-head"><h2 id="catalog-title">Les univers</h2><span>{games.length} jeux envisagés</span></div>
        <div className="game-grid">
          {games.map((game) => (
            <article className={`game-card ${game.accent}`} key={game.id}>
              <div className="game-art" aria-hidden="true"><span>{game.icon}</span></div>
              <div className="game-body">
                <div className="game-meta"><span>{game.setting}</span><span>{game.status === "in-design" ? "En conception" : "Prévu"}</span></div>
                <h3>{game.title}</h3>
                <p>{game.description}</p>
                <span className="not-ready" aria-label="Jeu non disponible pour le moment">À venir</span>
              </div>
            </article>
          ))}
        </div>
      </section>
      <footer>CardForge · Projet en construction · Aucun jeu jouable à ce stade</footer>
    </main>
  );
}
