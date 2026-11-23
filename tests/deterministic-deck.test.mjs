import test from 'node:test';
import assert from 'node:assert/strict';
import { createSeededRandom, createSeededDeck, snapshotDeckOrder, restoreDeckOrder, DECK_RANDOM_VERSION } from '../src/core/deterministic-deck.ts';
import { makeDeckWithJokers, shuffle } from '../src/core/cards.ts';
import { createGameSession } from '../src/application/game-session.ts';

const ids = cards => cards.map(card => card.id);

test('a uint32 seed reproducibly produces the same 54-card deck', () => {
  const deck = createSeededDeck(123456);
  assert.equal(DECK_RANDOM_VERSION, 1);
  assert.equal(deck.length, 54);
  assert.equal(new Set(ids(deck)).size, 54);
  assert.deepEqual(ids(deck), ids(createSeededDeck(123456)));
  assert.notDeepEqual(ids(deck), ids(createSeededDeck(123457)));
});

test('a seeded generator is deterministic, independent and validates seeds', () => {
  assert.deepEqual(Array.from({ length: 20 }, createSeededRandom(0)), Array.from({ length: 20 }, createSeededRandom(0)));
  assert.notDeepEqual(Array.from({ length: 5 }, createSeededRandom(0)), Array.from({ length: 5 }, createSeededRandom(1)));
  for (const invalid of [-1, 0x1_0000_0000, NaN, 1.1]) {
    assert.throws(() => createSeededRandom(invalid), RangeError);
  }
});

test('the existing shuffle still accepts an injected random source without mutating input', () => {
  const cards = makeDeckWithJokers();
  const original = ids(cards);
  assert.deepEqual(shuffle(cards, createSeededRandom(7)), shuffle(cards, createSeededRandom(7)));
  assert.deepEqual(ids(cards), original);
});

test('T-17: serialized snapshot restores exact order, without using RNG', () => {
  const deck = createSeededDeck(42);
  const snapshot = JSON.parse(JSON.stringify(snapshotDeckOrder(deck)));
  const priorRandom = Math.random;
  Math.random = () => { throw Error('RNG called during restore'); };
  try {
    const restored = restoreDeckOrder(snapshot);
    assert.deepEqual(ids(restored), ids(deck));
    assert.notStrictEqual(restored, deck);
    assert.equal(new Set(ids(restored)).size, 54);
  } finally {
    Math.random = priorRandom;
  }
});

test('corrupt deck snapshots are rejected instead of being silently reshuffled', () => {
  const order = snapshotDeckOrder(createSeededDeck(30));
  assert.throws(() => restoreDeckOrder(order.slice(1)), RangeError);
  assert.throws(() => restoreDeckOrder([...order.slice(0, -1), order[0]]), RangeError);
  assert.throws(() => restoreDeckOrder([...order.slice(0, -1), 'invented-card']), RangeError);
});

test('T-20: identical state/action sequences give identical outcomes and do not mutate inputs', () => {
  const engine = {
    createInitialState(setup) { return { phase: 'draw', pile: snapshotDeckOrder(createSeededDeck(setup.seed)), hand: [] }; },
    getLegalActions(state) { return state.pile.length ? [{ type: 'draw' }] : []; },
    transition(state, action) {
      if (action.type !== 'draw' || !state.pile.length) return { accepted: false, state, reason: 'illegal' };
      return { accepted: true, state: { ...state, pile: state.pile.slice(1), hand: [...state.hand, state.pile[0]] } };
    },
    getOutcome(state) { return state.pile.length ? 'in-progress' : 'win'; },
    validateState(state) { return state && Array.isArray(state.pile) && Array.isArray(state.hand) ? { valid: true } : { valid: false, errors: ['invalid'] }; },
  };
  const one = createGameSession(engine, { seed: 12 });
  const two = createGameSession(engine, { seed: 12 });
  const before = structuredClone(one.getState());
  const original = one.getState();
  Object.freeze(original.pile);
  Object.freeze(original.hand);
  Object.freeze(original);
  for (const action of [{ type: 'draw' }, { type: 'draw' }, { type: 'draw' }]) {
    assert.deepEqual(one.dispatch(action), two.dispatch(action));
  }
  assert.deepEqual(original, before);
  assert.deepEqual(one.getState(), two.getState());
  assert.equal(one.getOutcome(), two.getOutcome());
  const previous = one.getState();
  assert.equal(one.dispatch({ type: 'illegal' }).accepted, false);
  assert.strictEqual(one.getState(), previous);
});
