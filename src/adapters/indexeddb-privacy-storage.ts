import { LocalStorageError } from "../ports/local-storage.ts";

const STORES = ["sessions", "results", "statistics"] as const;
export const CARD_FORGE_DATABASE = "cardforge";

export interface PrivacyGameStorage {
  /** All three families are removed in one IndexedDB transaction. */
  deleteGame(gameId: string): Promise<void>;
  /** Deletes only CardForge-owned records in its own database. */
  deleteAllGames(): Promise<void>;
}

export function createPrivacyGameStorage(options: { name?: string; factory?: IDBFactory } = {}): PrivacyGameStorage {
  const factory = options.factory ?? globalThis.indexedDB;
  if (!factory) throw new LocalStorageError("unavailable", "IndexedDB is not available");
  const name = options.name ?? CARD_FORGE_DATABASE;

  function execute(gameId: string | null): Promise<void> {
    return new Promise((resolve, reject) => {
      let request: IDBOpenDBRequest;
      try { request = factory.open(name, 1); }
      catch (cause) { reject(new LocalStorageError("unavailable", "Cannot open local database", { cause })); return; }
      request.onupgradeneeded = () => {
        // Same initialization as the application storage adapter.
        const db = request.result;
        for (const store of STORES)
          if (!db.objectStoreNames.contains(store)) db.createObjectStore(store, { keyPath: store === "results" ? "id" : "gameId" });
      };
      request.onerror = () => reject(new LocalStorageError("unavailable", "Cannot open local database", { cause: request.error }));
      request.onblocked = () => reject(new LocalStorageError("unavailable", "Local database is blocked by another tab"));
      request.onsuccess = () => {
        const db = request.result;
        let tx: IDBTransaction;
        try { tx = db.transaction([...STORES], "readwrite"); }
        catch (cause) { db.close(); reject(new LocalStorageError("write-failed", "Cannot start deletion transaction", { cause })); return; }
        let failure: unknown;
        const abort = (cause: unknown) => {
          failure = cause;
          try { tx.abort(); } catch { /* already aborted */ }
        };
        tx.oncomplete = () => { db.close(); resolve(); };
        tx.onabort = () => {
          db.close();
          reject(new LocalStorageError("write-failed", "Deletion rolled back", { cause: failure ?? tx.error }));
        };
        tx.onerror = () => { /* reported via abort */ };
        try {
          if (gameId === null) {
            for (const store of STORES) tx.objectStore(store).clear();
          } else {
            tx.objectStore("sessions").delete(gameId);
            tx.objectStore("statistics").delete(gameId);
            // Historical results have a session-scoped key and must be filtered by gameId.
            // Reading and deleting in the same transaction prevents partial histories.
            const results = tx.objectStore("results");
            const list = results.getAll();
            list.onsuccess = () => {
              try {
                for (const value of list.result as Array<{ id: string; gameId: string }>) {
                  if (value.gameId === gameId) results.delete(value.id);
                }
              } catch (cause) { abort(cause); }
            };
            list.onerror = () => abort(list.error);
          }
        } catch (cause) { abort(cause); }
      };
    });
  }

  return {
    deleteGame(gameId: string): Promise<void> {
      if (!gameId || typeof gameId !== "string") return Promise.reject(new TypeError("A game ID is required"));
      return execute(gameId);
    },
    deleteAllGames: () => execute(null),
  };
}
