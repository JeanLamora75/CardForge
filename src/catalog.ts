/** Public names and worlds are presentation-only; engine identifiers never change. */
export type GameId = "clear-the-dungeon" | "gridcannon" | "card-capture" | "loot-the-loop" | "regicide";
export type GameStatus = "in-development" | "coming-soon";
export type GameEntry = Readonly<{
  id: GameId;
  title: string;
  sourceGame: string;
  setting: string;
  description: string;
  icon: string;
  accent: "ember" | "cosmos" | "sky" | "noir" | "wuxia";
  status: GameStatus;
  /** Only these two titles are candidates for release after separate acceptance. */
  mvpCandidate: boolean;
  /** Never claim availability until all launch criteria are actually met. */
  playable: false;
}>;

export const games: readonly GameEntry[] = [
  {
    id: "clear-the-dungeon",
    title: "Grim Delve",
    sourceGame: "Clear the Dungeon Classic 1.1.0",
    setting: "Dark fantasy · Donjons et monstres",
    description: "Descendez dans un donjon obscur et affrontez ses monstres dans un jeu de cartes tactique en solitaire.",
    icon: "⚔️", accent: "ember", status: "in-development", mvpCandidate: true, playable: false,
  },
  {
    id: "gridcannon",
    title: "Thunderfighter",
    sourceGame: "Gridcannon Version 2",
    setting: "Science-fiction pulp · Aventure spatiale rétrofuturiste",
    description: "Défendez votre position dans une aventure spatiale où chaque carte placée peut déclencher un tir.",
    icon: "🚀", accent: "cosmos", status: "in-development", mvpCandidate: true, playable: false,
  },
  {
    id: "card-capture",
    title: "Skydeck",
    sourceGame: "Card Capture",
    setting: "Corsaires du ciel · Îles flottantes",
    description: "Prenez de la hauteur entre flottes aériennes, abordages et îles suspendues dans les nuages.",
    icon: "☁️", accent: "sky", status: "coming-soon", mvpCandidate: false, playable: false,
  },
  {
    id: "loot-the-loop",
    title: "Midnight Syndicate",
    sourceGame: "Loot the Loop",
    setting: "Prohibition · Dieselpunk · Pulp des années 1930",
    description: "Explorez les secrets d'une métropole clandestine, entre speakeasies, artefacts et passages en boucle.",
    icon: "🎩", accent: "noir", status: "coming-soon", mvpCandidate: false, playable: false,
  },
  {
    id: "regicide",
    title: "Les Douze Tyrans",
    sourceGame: "Regicide",
    setting: "Wuxia · Chanbara · Asie féodale fantastique",
    description: "Après la chute de l'Empereur, défiez douze seigneurs et maîtres martiaux dans un empire imaginaire.",
    icon: "⚔", accent: "wuxia", status: "coming-soon", mvpCandidate: false, playable: false,
  },
];

/**
 * Source of truth for UI access. A ready engine is not sufficient to expose Play:
 * integration, UX, conformity and legal release gates remain pending (CAR-30..43).
 */
export function canPlay(game: GameEntry): boolean {
  return game.mvpCandidate && game.playable;
}

export function statusLabel(game: GameEntry): string {
  return canPlay(game) ? "Disponible" :
    game.status === "in-development" ? "En développement" : "À venir";
}
