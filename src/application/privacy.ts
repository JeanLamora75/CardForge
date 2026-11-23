/** Inventory for explaining local storage, not an instruction to delete it. */
export type PrivacyStorageArea = "indexeddb" | "localStorage" | "memory";
export type PrivacyDataCategory = Readonly<{
  id: "sessions" | "results" | "statistics" | "language" | "settings" | "learning" | "tutorial";
  area: PrivacyStorageArea;
  descriptionFr: string;
  descriptionEn: string;
  effectFr: string;
  effectEn: string;
}>;
export const PRIVACY_INVENTORY: readonly PrivacyDataCategory[] = Object.freeze([
  { id: "sessions", area: "indexeddb", descriptionFr: "Partie en cours ou dernière partie de chaque jeu", descriptionEn: "Current or most recent game for each title",
    effectFr: "Contient les cartes, leur ordre et l’état nécessaire à une reprise fidèle.", effectEn: "Contains cards, draw order and the state needed to resume exactly." },
  { id: "results", area: "indexeddb", descriptionFr: "Résultats des parties terminées ou abandonnées", descriptionEn: "Results of completed or abandoned games",
    effectFr: "Conserve les issues historiques, distinctes des parties actives.", effectEn: "Keeps historical outcomes separate from current games." },
  { id: "statistics", area: "indexeddb", descriptionFr: "Statistiques de chaque jeu", descriptionEn: "Statistics for each game",
    effectFr: "Compteurs de victoires, défaites et abandons.", effectEn: "Counts wins, losses and abandoned games." },
  { id: "language", area: "localStorage", descriptionFr: "Langue choisie", descriptionEn: "Chosen language",
    effectFr: "Préférence FR/EN utilisée au prochain lancement.", effectEn: "FR/EN preference for the next launch." },
  { id: "settings", area: "localStorage", descriptionFr: "Réglages communs", descriptionEn: "Shared settings",
    effectFr: "Musique, sons, animations et aides.", effectEn: "Music, sound effects, animations and hints." },
  { id: "learning", area: "localStorage", descriptionFr: "Choix d’apprentissage propres aux jeux", descriptionEn: "Per-game learning choices",
    effectFr: "Choix tutoriel ou partie normale et anciennes préférences d’aide.", effectEn: "Tutorial or normal play choice and legacy hint preferences." },
  { id: "tutorial", area: "memory", descriptionFr: "Parties d'entraînement", descriptionEn: "Practice games",
    effectFr: "En mémoire temporaire : sans résultat ni statistique.", effectEn: "Temporary memory only, without results or statistics." },
]);
export const DELETION_POLICY = "pending-product-owner-approval" as const;
export function canDeletePrivacyData(): boolean { return false; }
