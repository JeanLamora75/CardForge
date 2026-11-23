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
export const DELETION_POLICY = "approved-option-b" as const;
export const PRIVACY_GAME_IDS = [
  "clear-the-dungeon", "gridcannon", "card-capture", "loot-the-loop", "regicide",
] as const;
export type PrivacyGameId = typeof PRIVACY_GAME_IDS[number];
export type PrivacyDeletionScope =
  | { kind: "game"; gameId: PrivacyGameId }
  | { kind: "preferences" }
  | { kind: "all" };
export const OWNED_PREFERENCE_KEYS = [
  "cardforge.language.v1", "cardforge.settings.v1",
  ...PRIVACY_GAME_IDS.map(gameId => "cardforge.learning.v1." + gameId),
] as const;

export interface PreferenceRemover {
  removeItem(key: string): void;
}
export function clearCardForgePreferences(storage: PreferenceRemover): void {
  for (const key of OWNED_PREFERENCE_KEYS) storage.removeItem(key);
}
export function validateDeletionScope(scope: PrivacyDeletionScope): void {
  if (scope.kind === "game" && PRIVACY_GAME_IDS.includes(scope.gameId)) return;
  if (scope.kind === "preferences" || scope.kind === "all") return;
  throw new TypeError("Unknown deletion scope");
}
/** Destructive actions require an explicit, one-time user confirmation. */
export async function executePrivacyDeletion(
  scope: PrivacyDeletionScope,
  confirmed: boolean,
  gameStorage: { deleteGame(gameId: string): Promise<void>; deleteAllGames(): Promise<void> },
  preferenceStorage: PreferenceRemover | null,
): Promise<boolean> {
  if (!confirmed) return false;
  validateDeletionScope(scope);
  if (scope.kind === "game") {
    await gameStorage.deleteGame(scope.gameId);
    return true;
  }
  if (!preferenceStorage) throw new Error("Local preferences are not accessible");
  if (scope.kind === "all") await gameStorage.deleteAllGames();
  clearCardForgePreferences(preferenceStorage);
  return true;
}
