import test from 'node:test';
import assert from 'node:assert/strict';
import { makeDeckWithJokers } from '../src/core/cards.ts';
import { thunderfighterEngine as engine, THUNDERFIGHTER_GAME_ID, THUNDERFIGHTER_RULES_VERSION,
  availableFigureSlots } from '../src/games/gridcannon/engine.ts';

const canonical = makeDeckWithJokers().map(card => card.id).sort();
const zones = state => [
  ...state.grid.flat(),
  ...state.figureSlots.filter(id => id !== null),
  ...state.pendingFigures,
  ...state.drawPile,
  ...state.specialReserve,
  ...state.spentSpecials,
].sort();
const assertValid = state => {
  assert.deepEqual(engine.validateState(state), { valid: true });
  assert.deepEqual(zones(state), canonical);
  return state;
};
const apply = (state, action) => {
  const before = structuredClone(state);
  const result = engine.transition(state, action);
  assert.equal(result.accepted, true, JSON.stringify({ action, result }));
  assert.deepEqual(state, before);
  return assertValid(result.state);
};
const reject = (state, action) => {
  const before = structuredClone(state);
  const result = engine.transition(state, action);
  assert.equal(result.accepted, false);
  assert.strictEqual(result.state, state);
  assert.deepEqual(state, before);
};
function untilOffer(seed) {
  let state = assertValid(engine.createInitialState({ seed }));
  let placed = 0;
  while (state.phase === 'initial-figures') {
    const actions = engine.getLegalActions(state);
    assert.ok(actions.length);
    assert.ok(actions.every(action => action.type === 'place-figure'));
    state = apply(state, actions[0]);
    placed++;
  }
  assert.equal(state.phase, 'replacement-offer');
  return { state, placed };
}
function reorder(state, ids) {
  const old = state.drawPile;
  for (const id of ids) assert.ok(old.includes(id), id);
  return assertValid({ ...state, drawPile: [...ids, ...old.filter(id => !ids.includes(id))] });
}

test('GC-V2: initial setup has nine visible numeric cards, centre included, with 54 unique cards', () => {
  assert.equal(THUNDERFIGHTER_GAME_ID, 'gridcannon');
  assert.equal(THUNDERFIGHTER_RULES_VERSION, 'v2');
  for (const seed of [0, 1, 17, 127, 2026]) {
    const s = assertValid(engine.createInitialState({ seed }));
    assert.equal(s.grid.length, 9);
    assert.ok(s.grid.every(pile => pile.length === 1));
    assert.ok(s.grid.flat().every(id => /^(hearts|diamonds|clubs|spades)-(?:[2-9]|10)$/.test(id)));
    assert.ok(s.grid[4].length === 1);
    assert.equal(s.figureSlots.length, 12);
    assert.equal(s.figureSlots.filter(Boolean).length, 0);
    assert.ok(s.pendingFigures.every(id => /-(?:11|12|13)$/.test(id)));
    assert.ok(s.specialReserve.every(id => id.startsWith('joker-') || id.endsWith('-1')));
    assert.deepEqual(s.spentSpecials, []);
    assert.equal(s.replacementUsed, false);
    assert.equal(s.replacementSlot, null);
  }
});
test('same seed gives exact same ordered piles, queue, specials and draw, independent of artwork', () => {
  const a = engine.createInitialState({ seed: 12345 });
  assert.deepEqual(a, engine.createInitialState({ seed: 12345 }));
  assert.notDeepEqual(a, engine.createInitialState({ seed: 12346 }));
  assert.deepEqual(assertValid(JSON.parse(JSON.stringify(a))), a);
});
test('figures encountered before nine numerics wait for explicit legal placement, never at centre', () => {
  const seed = Array.from({ length: 500 }, (_, i) => i).find(i => engine.createInitialState({ seed: i }).pendingFigures.length > 0);
  assert.notEqual(seed, undefined);
  const initial = engine.createInitialState({ seed });
  assert.equal(initial.phase, 'initial-figures');
  reject(initial, { type: 'skip-replacement' });
  reject(initial, { type: 'start-replacement', cell: 0 });
  reject(initial, { type: 'attack', cell: 2 });
  const { state, placed } = untilOffer(seed);
  assert.equal(placed, initial.pendingFigures.length);
  assert.equal(state.figureSlots.filter(Boolean).length, placed);
  assert.deepEqual(state.pendingFigures, []);
});
test('figure placement offers only deterministic available exterior positions', () => {
  const seed = Array.from({ length: 500 }, (_, i) => i).find(i => engine.createInitialState({ seed: i }).pendingFigures.length > 0);
  const s = engine.createInitialState({ seed });
  const legal = availableFigureSlots(s);
  assert.ok(legal.length);
  assert.ok(legal.every(slot => Number.isInteger(slot) && slot >= 0 && slot < 12));
  const forbidden = Array.from({ length: 12 }, (_, i) => i).find(slot => !legal.includes(slot));
  if (forbidden !== undefined) reject(s, { type: 'place-figure', slot: forbidden });
  const next = apply(s, { type: 'place-figure', slot: legal[0] });
  assert.equal(next.figureSlots[legal[0]], s.pendingFigures[0]);
  assert.deepEqual(next.pendingFigures, s.pendingFigures.slice(1));
});
test('GC-V2-T142: skip leaves all cards and positions untouched and enters gameplay once', () => {
  const { state } = untilOffer(42);
  const next = apply(state, { type: 'skip-replacement' });
  assert.equal(next.phase, 'playing');
  assert.deepEqual(next.grid, state.grid);
  assert.deepEqual(next.drawPile, state.drawPile);
  assert.deepEqual(next.specialReserve, state.specialReserve);
  reject(next, { type: 'skip-replacement' });
  reject(next, { type: 'start-replacement', cell: 1 });
});
test('GC-V2-T143/T147: initial replacement is unique, refills its cell regardless of value', () => {
  let { state } = untilOffer(21);
  const cell = 4;
  const previous = state.grid[cell][0];
  const number = state.drawPile.find(id => /-(?:[2-9]|10)$/.test(id));
  assert.ok(number);
  state = reorder(state, [number]);
  state = apply(state, { type: 'start-replacement', cell });
  assert.equal(state.grid[cell].length, 0);
  assert.equal(state.drawPile.at(-1), previous);
  assert.equal(state.replacementUsed, true);
  reject(state, { type: 'start-replacement', cell });
  state = apply(state, { type: 'draw-replacement' });
  assert.equal(state.grid[cell][0], number);
  assert.equal(state.replacementSlot, null);
  assert.equal(state.phase, 'playing');
  reject(state, { type: 'start-replacement', cell });
});
test('GC-V2-T144/T145/T146/T148: figures wait until numeric replacement, specials reserve immediately', () => {
  let { state } = untilOffer(100);
  const figure = state.drawPile.find(id => /-(?:11|12|13)$/.test(id));
  const ace = state.drawPile.find(id => id.endsWith('-1'));
  const joker = state.drawPile.find(id => id.startsWith('joker-'));
  const number = state.drawPile.find(id => /-(?:[2-9]|10)$/.test(id));
  assert.ok(figure && ace && joker && number);
  state = apply(state, { type: 'start-replacement', cell: 0 });
  state = reorder(state, [figure, ace, joker, number]);
  state = apply(state, { type: 'draw-replacement' });
  assert.equal(state.pendingFigures[0], figure);
  assert.equal(state.grid[0].length, 0);
  state = apply(state, { type: 'draw-replacement' });
  assert.ok(state.specialReserve.includes(ace));
  state = apply(state, { type: 'draw-replacement' });
  assert.ok(state.specialReserve.includes(joker));
  assert.deepEqual(state.spentSpecials, []);
  reject(state, { type: 'use-ace', cardId: ace });
  reject(state, { type: 'use-joker', cardId: joker });
  state = apply(state, { type: 'draw-replacement' });
  assert.equal(state.grid[0][0], number);
  assert.equal(state.phase, 'replacement-figures');
  assert.equal(state.figureSlots.includes(figure), false);
  const choices = engine.getLegalActions(state);
  assert.ok(choices.length && choices.every(x => x.type === 'place-figure'));
  state = apply(state, choices[0]);
  assert.equal(state.phase, 'playing');
  assert.ok(state.figureSlots.includes(figure));
  assert.deepEqual(state.spentSpecials, []);
});
test('GC-15/16: no attacks or special spending during preparation or at phase exit', () => {
  const { state } = untilOffer(15);
  const pending = apply(state, { type: 'start-replacement', cell: 8 });
  for (const a of [{ type: 'attack', cell: 8 }, { type: 'use-ace', cardId: 'hearts-1' },
    { type: 'use-joker', cardId: 'joker-1' }, { type: 'skip-replacement' }]) reject(pending, a);
  const completed = apply(state, { type: 'skip-replacement' });
  assert.equal(completed.figureSlots.filter(Boolean).length, state.figureSlots.filter(Boolean).length);
  assert.deepEqual(completed.spentSpecials, []);
});
test('invalid or duplicate saved physical cards never produce a legal action', () => {
  const { state } = untilOffer(3);
  const wrong = structuredClone(state);
  wrong.drawPile[0] = wrong.grid[0][0];
  assert.equal(engine.validateState(wrong).valid, false);
  assert.deepEqual(engine.getLegalActions(wrong), []);
  reject(wrong, { type: 'skip-replacement' });
});
test('GC-V2-T173: snapshot during replacement resumes without reshuffle or duplicate draws', () => {
  let { state } = untilOffer(33);
  state = apply(state, { type: 'start-replacement', cell: 2 });
  const number = state.drawPile.find(id => /-(?:[2-9]|10)$/.test(id));
  state = reorder(state, [number]);
  const saved = assertValid(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(engine.getLegalActions(saved), engine.getLegalActions(state));
  const a = apply(saved, { type: 'draw-replacement' });
  const b = apply(state, { type: 'draw-replacement' });
  assert.deepEqual(a, b);
  reject(a, { type: 'draw-replacement' });
});
