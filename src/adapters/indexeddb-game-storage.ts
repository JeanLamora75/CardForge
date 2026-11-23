import type { GameCommit, GameResult, GameStatistics, LocalGameStorage, SavedGame, TerminalGameCommit, TerminalCommitResult } from '../ports/local-storage.ts';
import { LocalStorageError, stableResultId } from '../ports/local-storage.ts';

const VERSION = 1;
const SESSIONS = 'sessions';
const RESULTS = 'results';
const STATISTICS = 'statistics';

type StoreName = typeof SESSIONS | typeof RESULTS | typeof STATISTICS;

/** Aucune référence à indexedDB avant l'appel à la fabrique : compatible SSR/tests. */
export function createIndexedDbGameStorage(options: {
  name?: string;
  factory?: IDBFactory;
} = {}): LocalGameStorage {
  const name = options.name ?? 'cardforge';
  const factory = options.factory ?? globalThis.indexedDB;
  if (!factory) throw new LocalStorageError('unavailable', 'IndexedDB is not available');

  async function open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      let request: IDBOpenDBRequest;
      try {
        request = factory.open(name, VERSION);
      } catch (cause) {
        reject(new LocalStorageError('unavailable', 'Cannot open local database', { cause }));
        return;
      }
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(SESSIONS)) db.createObjectStore(SESSIONS, { keyPath: 'gameId' });
        if (!db.objectStoreNames.contains(RESULTS)) db.createObjectStore(RESULTS, { keyPath: 'id' });
        if (!db.objectStoreNames.contains(STATISTICS)) db.createObjectStore(STATISTICS, { keyPath: 'gameId' });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new LocalStorageError('unavailable', 'Cannot open local database', { cause: request.error }));
      request.onblocked = () => reject(new LocalStorageError('unavailable', 'Local database upgrade is blocked'));
    });
  }

  async function read<T>(store: StoreName, key: string): Promise<T | undefined> {
    const db = await open();
    try {
      return await new Promise<T | undefined>((resolve, reject) => {
        const tx = db.transaction(store, 'readonly');
        let value: T | undefined;
        tx.oncomplete = () => resolve(value);
        tx.onabort = () => reject(new LocalStorageError('read-failed', 'Local read transaction aborted', { cause: tx.error }));
        tx.onerror = () => { /* onabort handles the failed transaction */ };
        try {
          const request = tx.objectStore(store).get(key);
          request.onsuccess = () => { value = request.result as T | undefined; };
        } catch (cause) {
          try { tx.abort(); } catch { /* already aborted */ }
          reject(new LocalStorageError('read-failed', 'Local read request failed', { cause }));
        }
      });
    } catch (cause) {
      if (cause instanceof LocalStorageError) throw cause;
      throw new LocalStorageError('read-failed', 'Local read failed', { cause });
    } finally {
      db.close();
    }
  }

  return {
    readGame: <State>(gameId: string) => read<SavedGame<State>>(SESSIONS, gameId),
    readResult: (id: string) => read<GameResult>(RESULTS, id),
    readStatistics: (gameId: string) => read<GameStatistics>(STATISTICS, gameId),
    async commitTerminal<State>(update: TerminalGameCommit<State>): Promise<TerminalCommitResult> {
      const { save, result } = update;
      if (!save.gameId || !save.sessionId || !save.rulesVersion ||
          !Number.isSafeInteger(save.formatVersion) || save.formatVersion < 1 ||
          result.id !== stableResultId(save.gameId, save.sessionId) ||
          result.gameId !== save.gameId || result.sessionId !== save.sessionId ||
          !['win', 'loss', 'abandoned'].includes(result.outcome)) {
        throw new LocalStorageError('write-failed', 'Invalid terminal event metadata');
      }
      const db = await open();
      try {
        return await new Promise<TerminalCommitResult>((resolve, reject) => {
          let tx: IDBTransaction;
          try {
            tx = db.transaction([SESSIONS, RESULTS, STATISTICS], 'readwrite');
          } catch (cause) {
            reject(new LocalStorageError('write-failed', 'Cannot begin terminal transaction', { cause }));
            return;
          }
          let alreadyRecorded = false;
          let failure: unknown;
          const abort = (cause: unknown) => {
            failure = cause;
            try { tx.abort(); } catch { /* transaction already ended */ }
          };
          tx.oncomplete = () => resolve(alreadyRecorded ? 'already-recorded' : 'recorded');
          tx.onabort = () => reject(new LocalStorageError('write-failed', 'Terminal transaction rolled back', { cause: failure ?? tx.error }));
          tx.onerror = () => { /* handled by transaction abort */ };
          try {
            const sessions = tx.objectStore(SESSIONS);
            const results = tx.objectStore(RESULTS);
            const statistics = tx.objectStore(STATISTICS);
            const existingResult = results.get(result.id);
            existingResult.onsuccess = () => {
              if (existingResult.result !== undefined) {
                const old = existingResult.result as GameResult;
                if (old.gameId !== result.gameId || old.sessionId !== result.sessionId || old.outcome !== result.outcome) {
                  abort(new Error('Conflicting terminal result'));
                  return;
                }
                alreadyRecorded = true;
                return;
              }
              const currentSession = sessions.get(save.gameId);
              currentSession.onsuccess = () => {
                const active = currentSession.result as SavedGame<unknown> | undefined;
                if (!active || active.sessionId !== save.sessionId ||
                    active.rulesVersion !== save.rulesVersion || active.formatVersion !== save.formatVersion) {
                  abort(new Error('Session changed before terminal result'));
                  return;
                }
                const currentStats = statistics.get(save.gameId);
                currentStats.onsuccess = () => {
                  const previous = currentStats.result as GameStatistics | undefined;
                  const next: GameStatistics = previous
                    ? { ...previous }
                    : { gameId: save.gameId, played: 0, won: 0, lost: 0, abandoned: 0 };
                  if (next.gameId !== save.gameId || ![next.played, next.won, next.lost, next.abandoned].every(n => Number.isSafeInteger(n) && n >= 0)) {
                    abort(new Error('Invalid persisted statistics'));
                    return;
                  }
                  next.played += 1;
                  if (result.outcome === 'win') next.won += 1;
                  if (result.outcome === 'loss') next.lost += 1;
                  if (result.outcome === 'abandoned') next.abandoned += 1;
                  try {
                    sessions.put(save);
                    results.add(result);
                    statistics.put(next);
                  } catch (cause) {
                    abort(cause);
                  }
                };
              };
            };
          } catch (cause) {
            abort(cause);
          }
        });
      } finally {
        db.close();
      }
    },
    async commit<State>(update: GameCommit<State>): Promise<void> {
      const { save, result, statistics } = update;
      if (!save.gameId || !save.sessionId || !Number.isInteger(save.formatVersion) || save.formatVersion < 1 || !save.rulesVersion) {
        throw new LocalStorageError('write-failed', 'Invalid saved game envelope');
      }
      if (Boolean(result) !== Boolean(statistics)) {
        throw new LocalStorageError('write-failed', 'Result and statistics must be saved together');
      }
      if (result && (result.gameId !== save.gameId || result.sessionId !== save.sessionId || statistics!.gameId !== save.gameId)) {
        throw new LocalStorageError('write-failed', 'Inconsistent game identifiers');
      }
      const db = await open();
      try {
        await new Promise<void>((resolve, reject) => {
          let tx: IDBTransaction;
          try {
            tx = db.transaction([SESSIONS, RESULTS, STATISTICS], 'readwrite');
          } catch (cause) {
            reject(new LocalStorageError('write-failed', 'Cannot start local transaction', { cause }));
            return;
          }
          tx.oncomplete = () => resolve();
          tx.onabort = () => reject(new LocalStorageError('write-failed', 'Local transaction rolled back', { cause: tx.error }));
          tx.onerror = () => { /* onabort is the settlement point */ };
          try {
            tx.objectStore(SESSIONS).put(save);
            if (result && statistics) {
              tx.objectStore(RESULTS).put(result);
              tx.objectStore(STATISTICS).put(statistics);
            }
          } catch (cause) {
            try { tx.abort(); } catch { /* aborted already */ }
            reject(new LocalStorageError('write-failed', 'Cannot write local transaction', { cause }));
          }
        });
      } finally {
        db.close();
      }
    },
  };
}
