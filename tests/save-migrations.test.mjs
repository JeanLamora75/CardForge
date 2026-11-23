import test from 'node:test';
import assert from 'node:assert/strict';
import { migrateAndResumeGame, SaveMigrationError } from '../src/application/save-migrations.ts';

const opts = { gameId: 'grim', rulesVersion: 'rules-1', formatVersion: 3 };
const original = () => ({ gameId: 'grim', sessionId: 's-7', rulesVersion: 'rules-1', formatVersion: 1, state: { cards: ['joker-2', 'ace', 'joker-1'], phase: 'pending' } });
const steps = [
  { fromVersion: 1, toVersion: 2, migrate: input => ({ ...input, reserve: [] }) },
  { fromVersion: 2, toVersion: 3, migrate: input => ({ ...input, pending: { cardId: input.cards[0] } }) },
];
const engine = {
  createInitialState() { throw Error('unexpected shuffle or initialization'); },
  getLegalActions: () => [],
  transition: state => ({ accepted: false, state, reason: 'illegal' }),
  getOutcome: () => 'in-progress',
  validateState: x => x && Array.isArray(x.cards) && Array.isArray(x.reserve) && typeof x.pending?.cardId === 'string'
    ? { valid: true } : { valid: false, errors: ['invalid'] },
};
function store(record = original()) {
  let saved = structuredClone(record);
  let fail = false;
  let concurrent = false;
  let calls = 0;
  return {
    get calls() { return calls; },
    get saved() { return structuredClone(saved); },
    fail: x => { fail = x; },
    concurrent: () => { concurrent = true; },
    set: x => { saved = structuredClone(x); },
    async readGame() { return structuredClone(saved); },
    async migrateGame({ previous, migrated }) {
      calls++;
      if (concurrent) { saved.state.cards[0] = 'changed-by-other-tab'; concurrent = false; }
      if (JSON.stringify(saved) !== JSON.stringify(previous)) throw Error('stale');
      if (fail) throw Error('QuotaExceededError');
      saved = structuredClone(migrated);
    },
  };
}
const assertFailure = code => error => error instanceof SaveMigrationError && error.code === code;

test('known contiguous migrations preserve ordered cards, session and interim phase', async () => {
  const storage = store();
  const session = await migrateAndResumeGame(engine, storage, opts, steps);
  assert.equal(session.getSaveStatus(), 'saved');
  assert.deepEqual(session.getState(), { cards: ['joker-2', 'ace', 'joker-1'], phase: 'pending', reserve: [], pending: { cardId: 'joker-2' } });
  assert.equal(storage.saved.sessionId, 's-7');
  assert.equal(storage.saved.formatVersion, 3);
  assert.equal(storage.calls, 1);
});

test('already-current save can be resumed without a migration write', async () => {
  const storage = store({ ...original(), formatVersion: 3, state: { ...original().state, reserve: [], pending: { cardId: 'joker-2' } } });
  assert.ok(await migrateAndResumeGame(engine, storage, opts, []));
  assert.equal(storage.calls, 0);
});

test('unknown format, newer format and incompatible rules are retained byte-for-byte', async () => {
  for (const [record, options] of [[original(), opts], [{ ...original(), formatVersion: 20 }, opts], [original(), { ...opts, rulesVersion: 'rules-2' }]]) {
    const storage = store(record), before = JSON.stringify(storage.saved);
    await assert.rejects(() => migrateAndResumeGame(engine, storage, options, []), assertFailure('incompatible'));
    assert.equal(JSON.stringify(storage.saved), before);
    assert.equal(storage.calls, 0);
  }
});

test('invalid envelope and corrupt up-to-date state are never overwritten', async () => {
  const bad = store({ ...original(), sessionId: null });
  await assert.rejects(() => migrateAndResumeGame(engine, bad, opts, steps), assertFailure('corrupt'));
  assert.equal(bad.calls, 0);
  const current = store({ ...original(), formatVersion: 3 });
  await assert.rejects(() => migrateAndResumeGame(engine, current, opts, steps), assertFailure('corrupt'));
  assert.equal(current.calls, 0);
});

test('migration throw or invalid migrated state leaves original data untouched', async () => {
  for (const migration of [[{ fromVersion: 1, toVersion: 2, migrate: () => { throw Error('bad'); } }],
    [{ fromVersion: 1, toVersion: 2, migrate: () => ({ invalid: true }) }, steps[1]]]) {
    const storage = store();
    await assert.rejects(() => migrateAndResumeGame(engine, storage, opts, migration), e => e instanceof SaveMigrationError);
    assert.deepEqual(storage.saved, original());
    assert.equal(storage.calls, 0);
  }
});

test('quota failure reports storage error, preserves old save, and retry succeeds', async () => {
  const storage = store();
  storage.fail(true);
  await assert.rejects(() => migrateAndResumeGame(engine, storage, opts, steps), assertFailure('storage-failed'));
  assert.deepEqual(storage.saved, original());
  storage.fail(false);
  await migrateAndResumeGame(engine, storage, opts, steps);
  assert.equal(storage.saved.formatVersion, 3);
});

test('concurrent modification aborts migration without destroying latest save', async () => {
  const storage = store();
  storage.concurrent();
  await assert.rejects(() => migrateAndResumeGame(engine, storage, opts, steps), assertFailure('storage-failed'));
  assert.equal(storage.saved.state.cards[0], 'changed-by-other-tab');
  assert.equal(storage.saved.formatVersion, 1);
});
