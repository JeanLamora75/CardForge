import test from 'node:test';
import assert from 'node:assert/strict';
import { createIndexedDbGameStorage } from '../src/adapters/indexeddb-game-storage.ts';
import { createPrivacyGameStorage } from '../src/adapters/indexeddb-privacy-storage.ts';
import { LocalStorageError, stableResultId } from '../src/ports/local-storage.ts';
import { startPersistentGame, resumePersistentGame } from '../src/application/persistent-game-session.ts';
import { getNewGameChoice, confirmNewGame } from '../src/application/new-game-choice.ts';

// In-memory IDB-compatible transaction harness: requests are asynchronous,
// writes are staged and only made visible by the transaction complete event.
function makeFactory() {
  const databases = new Map();
  let failStatisticsPut = false;
  let failResultsDelete = false;
  return {
    failStats: value => { failStatisticsPut = value; },
    failDelete: value => { failResultsDelete = value; },
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
                    add(value) {
                      if (store.rows.has(value[store.keyPath])) throw Error('duplicate result');
                      return this.put(value);
                    },
                    put(value) {
                      if (mode !== 'readwrite') throw Error('readonly');
                      if (key === 'statistics' && failStatisticsPut) throw Error('failed statistics put');
                      const copy = structuredClone(value);
                      staged.push(['put', store, copy[store.keyPath], copy]);
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
                    getAll() {
                      const req = {};
                      pending++;
                      setTimeout(() => {
                        req.result = [...store.rows.values()].map(row => structuredClone(row));
                        req.onsuccess?.();
                        pending--;
                        schedule();
                      }, 0);
                      return req;
                    },
                    delete(id) {
                      if (mode !== 'readwrite') throw Error('readonly');
                      if (key === 'results' && failResultsDelete) throw Error('failed results delete');
                      staged.push(['delete', store, id]);
                      schedule();
                    },
                    clear() {
                      if (mode !== 'readwrite') throw Error('readonly');
                      staged.push(['clear', store]);
                      schedule();
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
                  for (const [operation, store, key, value] of staged) {
                    if (operation === 'put') store.rows.set(key, value);
                    if (operation === 'delete') store.rows.delete(key);
                    if (operation === 'clear') store.rows.clear();
                  }
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


const terminalOptions = gameId => ({ gameId, sessionId: `s-${gameId}`, formatVersion: 1, rulesVersion: '1' });
function terminalEngine(outcome = 'win') {
  return {
    createInitialState: () => ({ step: 0, hand: ['joker-1'], reserve: [] }),
    getLegalActions: state => state.step === 0 ? [{ type: 'finish' }] : [],
    transition(state, action) {
      if (action.type !== 'finish' || state.step !== 0) return { accepted: false, state, reason: 'illegal' };
      return { accepted: true, state: { ...state, step: 1 } };
    },
    getOutcome: state => state.step ? outcome : 'in-progress',
    validateState: state => state && [0, 1].includes(state.step) && Array.isArray(state.hand)
      ? { valid: true } : { valid: false, errors: ['invalid'] },
  };
}
const terminalEnvironment = () => {
  const factory = makeFactory();
  return { factory, storage: createIndexedDbGameStorage({ factory, name: 'terminal-test' }) };
};
const expectedStats = (gameId, played, won, lost, abandoned) => ({ gameId, played, won, lost, abandoned });

test('terminal victory saves game state, result and statistics atomically', async () => {
  const { storage } = terminalEnvironment();
  const session = await startPersistentGame(terminalEngine(), storage, terminalOptions('grim'), undefined);
  await session.dispatch({ type: 'finish' });
  assert.equal(session.getSaveStatus(), 'saved');
  assert.deepEqual(await storage.readStatistics('grim'), expectedStats('grim', 1, 1, 0, 0));
  assert.deepEqual(await storage.readResult(stableResultId('grim', 's-grim')), {
    id: stableResultId('grim', 's-grim'), gameId: 'grim', sessionId: 's-grim', outcome: 'win',
  });
  assert.equal((await storage.readGame('grim')).state.step, 1);
});

test('double-click and reload do not increase terminal counters', async () => {
  const { storage } = terminalEnvironment();
  const session = await startPersistentGame(terminalEngine(), storage, terminalOptions('grim'), undefined);
  const results = await Promise.all([session.dispatch({ type: 'finish' }), session.dispatch({ type: 'finish' })]);
  assert.deepEqual(results.map(x => x.accepted), [true, false]);
  const resumed = await resumePersistentGame(terminalEngine(), storage, terminalOptions('grim'));
  assert.equal((await resumed.dispatch({ type: 'finish' })).accepted, false);
  assert.deepEqual(await storage.readStatistics('grim'), expectedStats('grim', 1, 1, 0, 0));
});

test('same terminal event is idempotent and conflicting outcome is rejected', async () => {
  const { storage } = terminalEnvironment();
  await startPersistentGame(terminalEngine(), storage, terminalOptions('grim'), undefined);
  const final = { save: { ...await storage.readGame('grim'), state: { step: 1, hand: ['joker-1'], reserve: [] } }, result: {
    id: stableResultId('grim', 's-grim'), gameId: 'grim', sessionId: 's-grim', outcome: 'win',
  } };
  assert.equal(await storage.commitTerminal(final), 'recorded');
  assert.equal(await storage.commitTerminal(final), 'already-recorded');
  assert.deepEqual(await storage.readStatistics('grim'), expectedStats('grim', 1, 1, 0, 0));
  await assert.rejects(() => storage.commitTerminal({ ...final, result: { ...final.result, outcome: 'loss' } }), e => e.code === 'write-failed');
});

test('loss and abandonment affect only their own game counters', async () => {
  const { storage } = terminalEnvironment();
  await (await startPersistentGame(terminalEngine('loss'), storage, terminalOptions('grim'), undefined)).dispatch({ type: 'finish' });
  await (await startPersistentGame(terminalEngine('abandoned'), storage, terminalOptions('thunder'), undefined)).dispatch({ type: 'finish' });
  assert.deepEqual(await storage.readStatistics('grim'), expectedStats('grim', 1, 0, 1, 0));
  assert.deepEqual(await storage.readStatistics('thunder'), expectedStats('thunder', 1, 0, 0, 1));
});

test('failed statistics write rolls back all terminal data and supports retry', async () => {
  const { factory, storage } = terminalEnvironment();
  const session = await startPersistentGame(terminalEngine(), storage, terminalOptions('grim'), undefined);
  factory.failStats(true);
  await assert.rejects(() => session.dispatch({ type: 'finish' }), e => e.code === 'write-failed');
  assert.equal(session.getSaveStatus(), 'error');
  assert.equal((await storage.readGame('grim')).state.step, 0);
  assert.equal(await storage.readResult(stableResultId('grim', 's-grim')), undefined);
  assert.equal(await storage.readStatistics('grim'), undefined);
  factory.failStats(false);
  await session.dispatch({ type: 'finish' });
  assert.deepEqual(await storage.readStatistics('grim'), expectedStats('grim', 1, 1, 0, 0));
});

test('terminal result from a stale session cannot corrupt the current game', async () => {
  const { storage } = terminalEnvironment();
  await startPersistentGame(terminalEngine(), storage, terminalOptions('grim'), undefined);
  const save = { ...await storage.readGame('grim'), sessionId: 'stale', state: { step: 1, hand: [], reserve: [] } };
  const result = { id: stableResultId('grim', 'stale'), gameId: 'grim', sessionId: 'stale', outcome: 'win' };
  await assert.rejects(() => storage.commitTerminal({ save, result }), e => e.code === 'write-failed');
  assert.equal(await storage.readResult(result.id), undefined);
});


test('new game cancellation preserves both the old save and its counters', async () => {
  const { storage } = terminalEnvironment();
  await startPersistentGame(terminalEngine(), storage, terminalOptions('grim'), undefined);
  const choice = await getNewGameChoice(storage, 'grim');
  assert.deepEqual(choice, { kind: 'confirmation-required', existingSessionId: 's-grim' });
  assert.equal(await confirmNewGame(terminalEngine(), storage, { ...terminalOptions('grim'), sessionId: 'next' }, undefined, choice, false), undefined);
  assert.equal((await storage.readGame('grim')).sessionId, 's-grim');
  assert.equal(await storage.readStatistics('grim'), undefined);
  assert.equal(await storage.readResult(stableResultId('grim', 's-grim')), undefined);
});

test('confirmation replaces an active game atomically and records abandonment, not loss', async () => {
  const { storage } = terminalEnvironment();
  await startPersistentGame(terminalEngine(), storage, terminalOptions('grim'), undefined);
  const choice = await getNewGameChoice(storage, 'grim');
  const session = await confirmNewGame(terminalEngine(), storage, { ...terminalOptions('grim'), sessionId: 'next' }, undefined, choice, true);
  assert.equal(session.getSaveStatus(), 'saved');
  assert.equal((await storage.readGame('grim')).sessionId, 'next');
  assert.equal((await storage.readResult(stableResultId('grim', 's-grim'))).outcome, 'abandoned');
  assert.deepEqual(await storage.readStatistics('grim'), expectedStats('grim', 1, 0, 0, 1));
});

test('double confirmation cannot replace a newer game or count abandonment twice', async () => {
  const { storage } = terminalEnvironment();
  await startPersistentGame(terminalEngine(), storage, terminalOptions('grim'), undefined);
  const choice = await getNewGameChoice(storage, 'grim');
  await confirmNewGame(terminalEngine(), storage, { ...terminalOptions('grim'), sessionId: 'next' }, undefined, choice, true);
  await assert.rejects(() => confirmNewGame(terminalEngine(), storage, { ...terminalOptions('grim'), sessionId: 'different' }, undefined, choice, true));
  assert.equal((await storage.readGame('grim')).sessionId, 'next');
  assert.deepEqual(await storage.readStatistics('grim'), expectedStats('grim', 1, 0, 0, 1));
});

test('rollback on statistics write failure keeps old save and allows retry', async () => {
  const { factory, storage } = terminalEnvironment();
  await startPersistentGame(terminalEngine(), storage, terminalOptions('grim'), undefined);
  const choice = await getNewGameChoice(storage, 'grim');
  const next = { ...terminalOptions('grim'), sessionId: 'next' };
  factory.failStats(true);
  await assert.rejects(() => confirmNewGame(terminalEngine(), storage, next, undefined, choice, true));
  assert.equal((await storage.readGame('grim')).sessionId, 's-grim');
  assert.equal(await storage.readResult(stableResultId('grim', 's-grim')), undefined);
  assert.equal(await storage.readStatistics('grim'), undefined);
  factory.failStats(false);
  await confirmNewGame(terminalEngine(), storage, next, undefined, choice, true);
  assert.equal((await storage.readStatistics('grim')).abandoned, 1);
});

test('replacing one game does not affect the other game', async () => {
  const { storage } = terminalEnvironment();
  await startPersistentGame(terminalEngine(), storage, terminalOptions('grim'), undefined);
  await startPersistentGame(terminalEngine(), storage, terminalOptions('thunder'), undefined);
  const choice = await getNewGameChoice(storage, 'grim');
  await confirmNewGame(terminalEngine(), storage, { ...terminalOptions('grim'), sessionId: 'next' }, undefined, choice, true);
  assert.equal((await storage.readGame('thunder')).sessionId, 's-thunder');
  assert.equal(await storage.readStatistics('thunder'), undefined);
});

test('an old in-memory session cannot overwrite the newly confirmed game', async () => {
  const { storage } = terminalEnvironment();
  const old = await startPersistentGame(terminalEngine(), storage, terminalOptions('grim'), undefined);
  const choice = await getNewGameChoice(storage, 'grim');
  await confirmNewGame(terminalEngine(), storage, { ...terminalOptions('grim'), sessionId: 'next' }, undefined, choice, true);
  await assert.rejects(() => old.dispatch({ type: 'finish' }));
  assert.equal((await storage.readGame('grim')).sessionId, 'next');
  assert.equal((await storage.readStatistics('grim')).abandoned, 1);
});

test('restarting a previously finished game does not falsely record abandonment', async () => {
  const { storage } = terminalEnvironment();
  const old = await startPersistentGame(terminalEngine(), storage, terminalOptions('grim'), undefined);
  await old.dispatch({ type: 'finish' });
  const choice = await getNewGameChoice(storage, 'grim');
  await confirmNewGame(terminalEngine(), storage, { ...terminalOptions('grim'), sessionId: 'next' }, undefined, choice, true);
  assert.deepEqual(await storage.readStatistics('grim'), expectedStats('grim', 1, 1, 0, 0));
});

test('first game starts without abandonment or confirmation dialog', async () => {
  const { storage } = terminalEnvironment();
  const choice = await getNewGameChoice(storage, 'grim');
  assert.deepEqual(choice, { kind: 'start' });
  const session = await confirmNewGame(terminalEngine(), storage, terminalOptions('grim'), undefined, choice, true);
  assert.equal(session.getSaveStatus(), 'saved');
  assert.equal(await storage.readStatistics('grim'), undefined);
});


test('migration adapter replaces only matching snapshot and preserves the other game', async () => {
  const s = setup();
  const old = game();
  await s.commit({ save: old });
  await s.commit({ save: game('gridcannon', { cards: ['other'] }) });
  const migrated = { ...old, formatVersion: 2, state: { cards: ['a', 'b'], phase: 'pending' } };
  await s.migrateGame({ previous: old, migrated });
  assert.deepEqual(await s.readGame('clear-the-dungeon'), migrated);
  assert.deepEqual(await s.readGame('gridcannon'), game('gridcannon', { cards: ['other'] }));
});

test('migration adapter rejects stale snapshot without changing durable save', async () => {
  const s = setup();
  const old = game();
  await s.commit({ save: old });
  const newer = game('clear-the-dungeon', { cards: ['changed'] });
  await s.commit({ save: newer });
  await assert.rejects(() => s.migrateGame({ previous: old, migrated: { ...old, formatVersion: 2 } }), e => e.code === 'write-failed');
  assert.deepEqual(await s.readGame('clear-the-dungeon'), newer);
});

test('migration adapter rolls back failed write then permits retry', async () => {
  const s = setup();
  const old = game();
  await s.commit({ save: old });
  await assert.rejects(() => s.migrateGame({ previous: old, migrated: { ...old, formatVersion: 2, state: { bad: () => 3 } } }), e => e.code === 'write-failed');
  assert.deepEqual(await s.readGame('clear-the-dungeon'), old);
  const migrated = { ...old, formatVersion: 2, state: { cards: ['a', 'b'], extra: 1 } };
  await s.migrateGame({ previous: old, migrated });
  assert.deepEqual(await s.readGame('clear-the-dungeon'), migrated);
});

test('privacy deleteGame atomically removes only selected game saves, statistics and all historical results', async () => {
  const factory = makeFactory();
  const storage = createIndexedDbGameStorage({ factory, name: 'privacy-scoped' });
  const privacy = createPrivacyGameStorage({ factory, name: 'privacy-scoped' });
  await storage.commit({ save: game(), result, statistics: stats });
  await storage.commit({ save: game('gridcannon', { turn: 4 }), result: {
    id:'g1',gameId:'gridcannon',sessionId:'s1',outcome:'loss',
  }, statistics: {gameId:'gridcannon',played:1,won:0,lost:1,abandoned:0} });
  await storage.replaceGame({
    expectedSessionId:'s1',
    replacement:{...game(),sessionId:'s2',state:{ cards: ['c'] }},
  });
  assert.equal((await storage.readStatistics('clear-the-dungeon')).abandoned,1);
  await storage.commitTerminal({
    save: { ...game(), sessionId: 's2', state: { cards: ['c'], outcome: 'loss' } },
    result: { id: stableResultId('clear-the-dungeon', 's2'),
      gameId: 'clear-the-dungeon', sessionId: 's2', outcome: 'loss' },
  });
  assert.equal((await storage.readStatistics('clear-the-dungeon')).played,3);
  await privacy.deleteGame('clear-the-dungeon');
  assert.equal(await storage.readGame('clear-the-dungeon'),undefined);
  assert.equal(await storage.readStatistics('clear-the-dungeon'),undefined);
  assert.equal(await storage.readResult('r1'),undefined);
  assert.equal(await storage.readResult(stableResultId('clear-the-dungeon','s1')),undefined);
  assert.equal(await storage.readResult(stableResultId('clear-the-dungeon','s2')),undefined);
  assert.deepEqual(await storage.readGame('gridcannon'),game('gridcannon',{turn:4}));
  assert.equal((await storage.readStatistics('gridcannon')).lost,1);
  assert.equal((await storage.readResult('g1')).gameId,'gridcannon');
});
test('privacy failed deletion rolls back all three stores, then permits retry', async () => {
  const factory=makeFactory();
  const storage=createIndexedDbGameStorage({factory,name:'privacy-rollback'});
  const privacy=createPrivacyGameStorage({factory,name:'privacy-rollback'});
  await storage.commit({save:game(),result,statistics:stats});
  factory.failDelete(true);
  await assert.rejects(()=>privacy.deleteGame('clear-the-dungeon'),error=>error.code==='write-failed');
  assert.deepEqual(await storage.readGame('clear-the-dungeon'),game());
  assert.deepEqual(await storage.readResult('r1'),result);
  assert.deepEqual(await storage.readStatistics('clear-the-dungeon'),stats);
  factory.failDelete(false);
  await privacy.deleteGame('clear-the-dungeon');
  assert.equal(await storage.readGame('clear-the-dungeon'),undefined);
});
test('privacy full erase clears only application game database records', async () => {
  const factory=makeFactory();
  const storage=createIndexedDbGameStorage({factory,name:'privacy-total'});
  const unrelated=createIndexedDbGameStorage({factory,name:'unrelated'});
  await storage.commit({save:game(),result,statistics:stats});
  await storage.commit({save:game('gridcannon')});
  await unrelated.commit({save:game('independent')});
  const privacy=createPrivacyGameStorage({factory,name:'privacy-total'});
  await privacy.deleteAllGames();
  assert.equal(await storage.readGame('gridcannon'),undefined);
  assert.equal(await storage.readResult('r1'),undefined);
  assert.equal(await storage.readStatistics('clear-the-dungeon'),undefined);
  assert.deepEqual(await unrelated.readGame('independent'),game('independent'));
});
