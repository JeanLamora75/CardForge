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
    effectFr: "Permet de reprendre votre partie là où vous l’avez laissée.", effectEn: "Lets you resume your game where you left off." },
  { id: "results", area: "indexeddb", descriptionFr: "Résultats des parties terminées ou abandonnées", descriptionEn: "Results of completed or abandoned games",
    effectFr: "Conserve votre historique de parties.", effectEn: "Keeps your game history." },
  { id: "statistics", area: "indexeddb", descriptionFr: "Statistiques de chaque jeu", descriptionEn: "Statistics for each game",
    effectFr: "Compteurs de victoires, défaites et abandons.", effectEn: "Counts wins, losses and abandoned games." },
  { id: "language", area: "localStorage", descriptionFr: "Langue choisie", descriptionEn: "Chosen language",
    effectFr: "Langue utilisée au prochain lancement.", effectEn: "Language used the next time you play." },
  { id: "settings", area: "localStorage", descriptionFr: "Réglages communs", descriptionEn: "Shared settings",
    effectFr: "Musique, sons, animations et aides.", effectEn: "Music, sound effects, animations and hints." },
  { id: "learning", area: "localStorage", descriptionFr: "Choix d’apprentissage propres aux jeux", descriptionEn: "Per-game learning choices",
    effectFr: "Vos choix de tutoriel et d’aide.", effectEn: "Your tutorial and hint choices." },
  { id: "tutorial", area: "memory", descriptionFr: "Parties d'entraînement", descriptionEn: "Practice games",
    effectFr: "Non sauvegardées et exclues des statistiques.", effectEn: "Not saved or included in statistics." },
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
