import test from 'node:test';
import assert from 'node:assert/strict';
import { createIndexedDbGameStorage } from '../src/adapters/indexeddb-game-storage.ts';
import { LocalStorageError } from '../src/ports/local-storage.ts';

// In-memory IDB-compatible transaction harness: requests are asynchronous,
// writes are staged and only made visible by the transaction complete event.
function makeFactory() {
  const databases = new Map();
  return {
    open(name) {
      const request = {};
      setTimeout(() => {
        let db = databases.get(name);
        const first = !db;
        if (!db) {
          db = {
            stores: new Map(),
            objectStoreNames: { contains: key => db.stores.has(key) },
            createObjectStore(key, { keyPath }) { db.stores.set(key, { keyPath, rows: new Map() }); },
            close() {},
            transaction(names, mode) {
              const namesArray = Array.isArray(names) ? names : [names];
              if (namesArray.some(n => !db.stores.has(n))) throw new Error('store missing');
              const staged = [];
              let pending = 0, canceled = false, finished = false;
              const tx = {
                error: null,
                objectStore(key) {
                  if (!namesArray.includes(key)) throw Error('unscoped store');
                  const store = db.stores.get(key);
                  return {
                    put(value) {
                      if (mode !== 'readwrite') throw Error('readonly');
                      const copy = structuredClone(value);
                      staged.push([store, copy[store.keyPath], copy]);
                      schedule();
                    },
                    get(key) {
                      const req = {};
                      pending++;
                      setTimeout(() => {
                        req.result = structuredClone(store.rows.get(key));
                        req.onsuccess?.();
                        pending--;
                        schedule();
                      }, 0);
                      return req;
                    },
                  };
                },
                abort() {
                  if (finished || canceled) throw Error('transaction finished');
                  canceled = true;
                  setTimeout(() => tx.onabort?.(), 0);
                },
              };
              let scheduled = false;
              function schedule() {
                if (scheduled || canceled || finished) return;
                scheduled = true;
                setTimeout(() => {
                  scheduled = false;
                  if (pending || canceled || finished) return;
                  finished = true;
                  for (const [store, key, value] of staged) store.rows.set(key, value);
                  tx.oncomplete?.();
                }, 0);
              }
              return tx;
            },
          };
          databases.set(name, db);
        }
        request.result = db;
        if (first) request.onupgradeneeded?.();
        request.onsuccess?.();
      }, 0);
      return request;
    },
  };
}

const game = (gameId = 'clear-the-dungeon', state = { cards: ['a', 'b'] }) =>
  ({ gameId, sessionId: 's1', formatVersion: 1, rulesVersion: '1.1', state });
const result = { id: 'r1', gameId: 'clear-the-dungeon', sessionId: 's1', outcome: 'win' };
const stats = { gameId: 'clear-the-dungeon', played: 1, won: 1, lost: 0, abandoned: 0 };
const setup = () => createIndexedDbGameStorage({ factory: makeFactory(), name: 'cardforge-test' });

test('returns undefined for absent game, result, and statistics', async () => {
  const s = setup();
  assert.equal(await s.readGame('clear-the-dungeon'), undefined);
  assert.equal(await s.readResult('r1'), undefined);
  assert.equal(await s.readStatistics('clear-the-dungeon'), undefined);
});

test('atomically stores and reads game, result, and statistics', async () => {
  const s = setup();
  await s.commit({ save: game(), result, statistics: stats });
  assert.deepEqual(await s.readGame('clear-the-dungeon'), game());
  assert.deepEqual(await s.readResult('r1'), result);
  assert.deepEqual(await s.readStatistics('clear-the-dungeon'), stats);
});

test('different games retain independent active sessions', async () => {
  const s = setup();
  await s.commit({ save: game() });
  await s.commit({ save: game('gridcannon', { turn: 2 }) });
  assert.deepEqual(await s.readGame('clear-the-dungeon'), game());
  assert.deepEqual(await s.readGame('gridcannon'), game('gridcannon', { turn: 2 }));
});

test('a failed third put aborts earlier writes without false success', async () => {
  const s = setup();
  await s.commit({ save: game(), result, statistics: stats });
  const broken = { ...stats, extra: () => 42 };
  await assert.rejects(() => s.commit({ save: game(undefined, { cards: ['bad'] }), result: { ...result, id: 'r2' }, statistics: broken }),
    e => e instanceof LocalStorageError && e.code === 'write-failed');
  assert.deepEqual(await s.readGame('clear-the-dungeon'), game());
  assert.equal(await s.readResult('r2'), undefined);
  assert.deepEqual(await s.readStatistics('clear-the-dungeon'), stats);
});

test('rejects result without statistics before beginning transaction', async () => {
  const s = setup();
  await assert.rejects(() => s.commit({ save: game(), result }), e => e.code === 'write-failed');
  assert.equal(await s.readGame('clear-the-dungeon'), undefined);
});

test('rejects inconsistent game IDs and invalid envelope', async () => {
  const s = setup();
  await assert.rejects(() => s.commit({ save: game(), result: { ...result, gameId: 'gridcannon' }, statistics: stats }), e => e.code === 'write-failed');
  await assert.rejects(() => s.commit({ save: { ...game(), formatVersion: 0 } }), e => e.code === 'write-failed');
});

test('a save-only update preserves prior result and statistics', async () => {
  const s = setup();
  await s.commit({ save: game(), result, statistics: stats });
  await s.commit({ save: game('clear-the-dungeon', { cards: ['b', 'a'] }) });
  assert.deepEqual((await s.readGame('clear-the-dungeon')).state, { cards: ['b', 'a'] });
  assert.deepEqual(await s.readResult('r1'), result);
  assert.deepEqual(await s.readStatistics('clear-the-dungeon'), stats);
});
