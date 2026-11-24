/** Presentation data only: these stable IDs are also used by saves and statistics. */
export type GameId = "clear-the-dungeon" | "gridcannon" | "card-capture" | "loot-the-loop" | "regicide";
export type GameStatus = "in-development" | "coming-soon" | "available";
export type GameEntry = Readonly<{
  id: GameId;
  title: string;
  originalGame: string;
  authors: string;
  setting: string;
  description: string;
  mechanics: string;
  icon: string;
  accent: string;
  status: GameStatus;
  playableRoute: string | null;
}>;

export const games: readonly GameEntry[] = [
  {
    id: "clear-the-dungeon", title: "Grim Delve",
    originalGame: "Clear the Dungeon", authors: "Jeu original : Clear the Dungeon",
    setting: "Dark fantasy · Donjons et créatures",
    description: "Descendez dans les profondeurs d’un donjon et construisez vos attaques contre les monstres de quatre colonnes.",
    mechanics: "Attaques progressives, gestion de la main, pouvoirs des Jokers.",
    icon: "⚔️", accent: "ember", status: "in-development", playableRoute: null,
  },
  {
    id: "gridcannon", title: "Thunderfighter",
    originalGame: "Gridcannon Version 2", authors: "Jeu original : Tom Francis",
    setting: "Science-fiction pulp · Aventure spatiale",
    description: "Commandez une escadrille rétrofuturiste, déployez votre grille et neutralisez douze adversaires.",
    mechanics: "Placement de cartes, tirs sur deux axes, pouvoirs des As et Jokers.",
    icon: "🚀", accent: "cosmos", status: "in-development", playableRoute: null,
  },
  {
    id: "card-capture", title: "Skydeck",
    originalGame: "Card Capture", authors: "Jeu original : Lucas Gentry",
    setting: "Corsaires du ciel · Îles flottantes",
    description: "À bord d’une flotte aérienne, partez à l’abordage dans un univers de sky-fantasy.",
    mechanics: "Adaptation des règles de Card Capture en préparation.",
    icon: "🛩️", accent: "neon", status: "coming-soon", playableRoute: null,
  },
  {
    id: "loot-the-loop", title: "Midnight Syndicate",
    originalGame: "Loot the Loop", authors: "d’après Loot the Loop, Wil Su (Isaludo)",
    setting: "Années 1930 · Prohibition et dieselpunk",
    description: "Explorez une métropole clandestine entre speakeasies, ruelles et boucles mystérieuses.",
    mechanics: "Adaptation des règles de Loot the Loop en préparation.",
    icon: "🎩", accent: "sand", status: "coming-soon", playableRoute: null,
  },
  {
    id: "regicide", title: "Les Douze Tyrans",
    originalGame: "Regicide", authors: "Jeu original : Paul Abrahams, Luke Badger et Andy Richdale",
    setting: "Asie féodale fantastique · Wuxia / Chanbara",
    description: "Après la chute de l’Empereur, affrontez douze seigneurs et maîtres martiaux dans un empire imaginaire.",
    mechanics: "Adaptation des règles de Regicide en préparation.",
    icon: "⚔️", accent: "royal", status: "coming-soon", playableRoute: null,
  },
];

/** Only a verified working game route may unlock a Play action. */
export function canPlay(game: Pick<GameEntry, "status" | "playableRoute">): boolean {
  return game.status === "available" && typeof game.playableRoute === "string" &&
    game.playableRoute.startsWith("/") && !game.playableRoute.startsWith("//");
}

export function getGame(id: GameId): GameEntry | undefined {
  return games.find(game => game.id === id);
}
