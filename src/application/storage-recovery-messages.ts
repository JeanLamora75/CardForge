import { SaveMigrationError } from './save-migrations.ts';
import { GameRestoreError } from './persistent-game-session.ts';
import { LocalStorageError } from '../ports/local-storage.ts';

export type RecoveryProblem = 'quota' | 'incompatible' | 'corrupt' | 'migration' | 'unavailable' | 'storage';

function hasQuotaCause(cause: unknown): boolean {
  const visited = new Set<unknown>();
  while (cause && !visited.has(cause)) {
    visited.add(cause);
    if (typeof cause === 'object') {
      const obj = cause as { name?: string; code?: string; cause?: unknown; message?: string };
      if (obj.name === 'QuotaExceededError' || obj.code === 'quota-exceeded') return true;
      cause = obj.cause;
    } else break;
  }
  return false;
}
export function classifyRecoveryProblem(error: unknown): RecoveryProblem {
  if (hasQuotaCause(error)) return 'quota';
  if (error instanceof SaveMigrationError) {
    if (error.code === 'incompatible') return 'incompatible';
    if (error.code === 'corrupt') return 'corrupt';
    if (error.code === 'migration-failed') return 'migration';
    return 'storage';
  }
  if (error instanceof GameRestoreError) return 'incompatible';
  if (error instanceof LocalStorageError && error.code === 'unavailable') return 'unavailable';
  return 'storage';
}
/** Specific messages; no promise of restoration unless a prior snapshot was verifiably preserved. */
export function storageRecoveryMessage(error: unknown, context: 'read' | 'write' | 'start', english = false): string {
  const problem = classifyRecoveryProblem(error);
  if (problem === 'quota') return english
    ? 'Local storage is full. The change was not confirmed; free up browser storage, then retry. Do not delete your CardForge data.'
    : 'Le stockage local est plein. La modification n’a pas été confirmée ; libérez de l’espace dans le navigateur, puis réessayez. Ne supprimez pas les données CardForge.';
  if (problem === 'incompatible') return english
    ? 'This save uses incompatible rules or an unknown format. It was not replaced; an explicitly supported migration is required.'
    : 'Cette sauvegarde utilise des règles incompatibles ou un format inconnu. Elle n’a pas été remplacée ; une migration explicitement prise en charge est nécessaire.';
  if (problem === 'corrupt' || problem === 'migration') return english
    ? 'This saved game cannot safely be restored or migrated. No replacement was attempted. Keep this browser’s data for diagnosis.'
    : 'Cette partie ne peut pas être restaurée ou migrée sans risque. Aucun remplacement n’a été tenté. Conservez les données de ce navigateur pour diagnostic.';
  if (problem === 'unavailable') return english
    ? 'Local storage is unavailable. No save was confirmed; check browser permissions before retrying.'
    : 'Le stockage local est indisponible. Aucune sauvegarde n’a été confirmée ; vérifiez les autorisations du navigateur avant de réessayer.';
  if (context === 'read') return english
    ? 'The saved game could not be read. Do not start over before checking local storage.'
    : 'La partie enregistrée est illisible. Ne recommencez pas avant de vérifier le stockage local.';
  if (context === 'start') return english
    ? 'The game could not be created and no new save was confirmed. Check local storage before retrying.'
    : 'La partie n’a pas pu être créée et aucune nouvelle sauvegarde n’a été confirmée. Vérifiez le stockage local avant de réessayer.';
  return english
    ? 'Saving failed: this move was not confirmed. Check local storage, then retry.'
    : 'Échec de la sauvegarde : ce coup n’a pas été confirmé. Vérifiez le stockage local, puis réessayez.';
}
