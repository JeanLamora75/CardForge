import type { GameCommit, GameResult, GameStatistics, LocalGameStorage, SavedGame } from '../ports/local-storage.ts';
import { LocalStorageError } from '../ports/local-storage.ts';

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
