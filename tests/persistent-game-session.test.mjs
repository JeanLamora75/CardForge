import test from 'node:test';
import assert from 'node:assert/strict';
import { startPersistentGame, resumePersistentGame, GameRestoreError } from '../src/application/persistent-game-session.ts';

const opts = gameId => ({ gameId, sessionId: `session-${gameId}`, rulesVersion: '1.0', formatVersion: 1 });
function memoryStorage() {
  const saves = new Map();
  const commits = [];
  let fail = false;
  let release = null;
  return {
    commits,
    saves,
    setFail: value => { fail = value; },
    hold: () => new Promise(resolve => { release = resolve; }),
    release: () => { release?.(); release = null; },
    readGame: async id => structuredClone(saves.get(id)),
    readResult: async () => undefined,
    readStatistics: async () => undefined,
    async commit({ save }) {
      commits.push(structuredClone(save));
      if (release) await new Promise(resolve => { const previous = release; release = () => { previous(); resolve(); }; });
      if (fail) throw new Error('storage failed');
      saves.set(save.gameId, structuredClone(save));
    },
  };
}
function engine() {
  let created = 0;
  return {
    created: () => created,
    createInitialState({ seed }) {
      created++;
      return { phase: 'choose', draw: [`card-${seed}`, 'joker-1', 'joker-2'], hand: [], reserve: ['ace-1'], pending: { selected: null } };
    },
    getLegalActions: state => state.draw.length ? [{ type: 'draw' }] : [],
    transition(state, action) {
      if (action.type !== 'draw' || !state.draw.length) return { accepted: false, state, reason: 'invalid' };
      return { accepted: true, state: { ...state, draw: state.draw.slice(1), hand: [...state.hand, state.draw[0]], phase: 'resolve', pending: { selected: state.draw[0] } } };
    },
    getOutcome: () => 'in-progress',
    validateState: value => value && Array.isArray(value.draw) && Array.isArray(value.hand) && Array.isArray(value.reserve) && typeof value.phase === 'string' ? { valid: true } : { valid: false, errors: ['corrupt'] },
  };
}

test('a newly started game is committed before it is usable and cannot be silently overwritten', async () => {
  const storage = memoryStorage();
  const game = engine();
  const session = await startPersistentGame(game, storage, opts('grim'), { seed: 20 });
  assert.equal(session.getSaveStatus(), 'saved');
  assert.deepEqual((await storage.readGame('grim')).state, session.getState());
  await assert.rejects(() => startPersistentGame(game, storage, opts('grim'), { seed: 21 }), GameRestoreError);
  assert.equal(storage.commits.length, 1);
});

test('a confirmed legal action is stored, illegal actions never write', async () => {
  const storage = memoryStorage();
  const session = await startPersistentGame(engine(), storage, opts('grim'), { seed: 2 });
  assert.equal((await session.dispatch({ type: 'illegal' })).accepted, false);
  assert.equal(storage.commits.length, 1);
  assert.equal((await session.dispatch({ type: 'draw' })).accepted, true);
  assert.equal(storage.commits.length, 2);
  assert.deepEqual((await storage.readGame('grim')).state, session.getState());
});

test('two game IDs preserve independent state after reload and never redraw', async () => {
  const storage = memoryStorage();
  const grim = engine(), thunder = engine();
  const a = await startPersistentGame(grim, storage, opts('grim'), { seed: 11 });
  const b = await startPersistentGame(thunder, storage, opts('thunder'), { seed: 72 });
  await a.dispatch({ type: 'draw' });
  const snapshot = a.getState();
  const freshEngine = engine();
  const restored = await resumePersistentGame(freshEngine, storage, opts('grim'));
  assert.equal(freshEngine.created(), 0);
  assert.deepEqual(restored.getState(), snapshot);
  assert.deepEqual((await resumePersistentGame(engine(), storage, opts('thunder'))).getState(), b.getState());
  assert.deepEqual(restored.getState().reserve, ['ace-1']);
  assert.deepEqual(restored.getState().pending, { selected: 'card-11' });
  assert.deepEqual(restored.getState().hand, ['card-11']);
});

test('saving is never announced until the durable commit completes', async () => {
  const storage = memoryStorage();
  const session = await startPersistentGame(engine(), storage, opts('grim'), { seed: 1 });
  let release;
  const oldCommit = storage.commit;
  storage.commit = async update => {
    await new Promise(resolve => { release = resolve; });
    return oldCommit(update);
  };
  const previous = session.getState();
  const pending = session.dispatch({ type: 'draw' });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(session.getSaveStatus(), 'saving');
  assert.deepEqual(session.getState(), previous);
  release();
  await pending;
  assert.equal(session.getSaveStatus(), 'saved');
  assert.notDeepEqual(session.getState(), previous);
});

test('failed commit preserves prior durable state and reports error; retry succeeds', async () => {
  const storage = memoryStorage();
  const session = await startPersistentGame(engine(), storage, opts('grim'), { seed: 12 });
  const before = session.getState();
  storage.setFail(true);
  await assert.rejects(() => session.dispatch({ type: 'draw' }), /storage failed/);
  assert.equal(session.getSaveStatus(), 'error');
  assert.deepEqual(session.getState(), before);
  assert.deepEqual((await storage.readGame('grim')).state, before);
  storage.setFail(false);
  await session.dispatch({ type: 'draw' });
  assert.equal(session.getSaveStatus(), 'saved');
});

test('concurrent rapid actions are serialized and cannot overwrite each other', async () => {
  const storage = memoryStorage();
  const session = await startPersistentGame(engine(), storage, opts('grim'), { seed: 6 });
  await Promise.all([session.dispatch({ type: 'draw' }), session.dispatch({ type: 'draw' })]);
  assert.deepEqual(session.getState().hand, ['card-6', 'joker-1']);
  assert.deepEqual((await storage.readGame('grim')).state.hand, ['card-6', 'joker-1']);
  assert.equal(storage.commits.length, 3);
});

test('invalid or incompatible saved state is rejected without modifying storage', async () => {
  const storage = memoryStorage();
  const session = await startPersistentGame(engine(), storage, opts('grim'), { seed: 5 });
  const original = await storage.readGame('grim');
  await assert.rejects(() => resumePersistentGame(engine(), storage, { ...opts('grim'), rulesVersion: '2.0' }), GameRestoreError);
  storage.saves.set('grim', { ...original, state: { unexpected: 'broken' } });
  const corrupt = await storage.readGame('grim');
  await assert.rejects(() => resumePersistentGame(engine(), storage, opts('grim')), GameRestoreError);
  assert.deepEqual(await storage.readGame('grim'), corrupt);
  assert.equal(session.getSaveStatus(), 'saved');
});

test('opening a nonexistent game returns undefined without a write', async () => {
  const storage = memoryStorage();
  assert.equal(await resumePersistentGame(engine(), storage, opts('none')), undefined);
  assert.equal(storage.commits.length, 0);
});
