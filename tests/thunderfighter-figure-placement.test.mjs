import test from 'node:test';
import assert from 'node:assert/strict';
import { makeDeckWithJokers } from '../src/core/cards.ts';
import {
  thunderfighterEngine as engine,
  getFigurePlacementOptions,
  getFigureSlotStatus,
  availableFigureSlots,
} from '../src/games/gridcannon/engine.ts';

const physical = makeDeckWithJokers().map(card => card.id);
const figures = makeDeckWithJokers().filter(card => 'rank' in card && card.rank >= 11).map(card => card.id);
const defaultGrid = [
  'clubs-2', 'diamonds-3', 'spades-4',
  'clubs-5', 'diamonds-6', 'spades-7',
  'clubs-8', 'diamonds-9', 'spades-10',
];

function fixture({ figure = 'hearts-11', grid = defaultGrid, occupied = {},
  emptyCells = [], phase = 'initial-figures', defeated = [] } = {}) {
  const cards = grid.map((id, index) => emptyCells.includes(index) ? [] : [id]);
  const figureSlots = Array.from({ length: 12 }, (_, i) => occupied[i] ?? null);
  const used = new Set([...cards.flat(), figure, ...figureSlots.filter(Boolean)]);
  assert.equal(used.size, cards.flat().length + figureSlots.filter(Boolean).length + 1);
  const state = {
    ...engine.createInitialState({ seed: 24 }),
    phase, grid: cards, figureSlots, pendingFigures: [figure],
    drawPile: physical.filter(id => !used.has(id)),
    specialReserve: [], spentSpecials: [],
    replacementSlot: null, replacementUsed: false,
    defeatedFigures: [...defeated],
  };
  assert.deepEqual(engine.validateState(state), { valid: true });
  assert.equal(state.drawPile.length + used.size, 54);
  return state;
}
function place(state, slot) {
  const previous = structuredClone(state);
  const result = engine.transition(state, { type: 'place-figure', slot });
  assert.equal(result.accepted, true, JSON.stringify(result));
  assert.deepEqual(state, previous);
  assert.deepEqual(engine.validateState(result.state), { valid: true });
  assert.equal(result.state.figureSlots[slot], previous.pendingFigures[0]);
  return result.state;
}
function refuse(state, slot) {
  const previous = structuredClone(state);
  const result = engine.transition(state, { type: 'place-figure', slot });
  assert.equal(result.accepted, false);
  assert.strictEqual(result.state, state);
  assert.deepEqual(state, previous);
}

test('GC-T32 / GC-01: the centre is excluded even if it exactly matches the figure suit and has the highest rank', () => {
  const grid = [...defaultGrid]; grid[4] = 'hearts-10';
  const state = fixture({ grid });
  assert.deepEqual(getFigurePlacementOptions(state), { mode: 'normal', slots: [7] });
  refuse(state, 0);
});
test('GC-T02: same-suit numeric card outranks higher-ranked same-colour and other-colour cards', () => {
  const grid = [...defaultGrid]; grid[0] = 'hearts-8'; grid[1] = 'diamonds-10';
  const state = fixture({ grid });
  assert.deepEqual(getFigurePlacementOptions(state), { mode: 'normal', slots: [0, 11] });
});
test('GC-T03: without same suit, highest same-colour value wins over a larger opposite-colour card', () => {
  const grid = [...defaultGrid]; grid[0] = 'clubs-10'; grid[7] = 'diamonds-9';
  const state = fixture({ grid });
  assert.deepEqual(getFigurePlacementOptions(state), { mode: 'normal', slots: [7] });
});
test('GC-01: within the same suit the higher number is preferred', () => {
  const grid = [...defaultGrid]; grid[0] = 'hearts-8'; grid[2] = 'hearts-10';
  const state = fixture({ grid });
  assert.deepEqual(getFigurePlacementOptions(state), { mode: 'normal', slots: [2, 3] });
});
test('GC-T04 / GC-01: tied candidates and a corner offer all adjacent legal slots for explicit choice', () => {
  // A real deck contains only one card per suit and value. A corner provides the two legal ties.
  const grid = [...defaultGrid]; grid[0] = 'hearts-8'; grid[2] = 'clubs-10';
  const state = fixture({ grid });
  assert.deepEqual(getFigurePlacementOptions(state), { mode: 'normal', slots: [0, 11] });
  assert.deepEqual(availableFigureSlots(state), [0, 11]);
  const chosen = place(state, 11);
  assert.equal(getFigureSlotStatus(chosen, 11), 'alive');
  assert.equal(chosen.figureSlots[0], null);
});
test('GC-T05 / GC-T33 / GC-02: if the best suit-matched number has no adjacent slot, next available suit candidate wins', () => {
  const grid = [...defaultGrid]; grid[0] = 'hearts-10'; grid[2] = 'hearts-8';
  const occupied = { 0: 'clubs-11', 11: 'spades-12' };
  const state = fixture({ grid, occupied });
  assert.deepEqual(getFigurePlacementOptions(state), { mode: 'normal', slots: [2, 3] });
  refuse(state, 0);refuse(state, 1);
  const next = place(state, 3);
  assert.equal(next.figureSlots[0], 'clubs-11');
  assert.equal(next.figureSlots[11], 'spades-12');
});
test('GC-02/13: a lower-ranked normal candidate prevents unrestricted rescue', () => {
  const grid = [...defaultGrid]; grid[0] = 'hearts-10';
  const state = fixture({ grid, occupied: { 0: 'clubs-11', 11: 'spades-12' } });
  assert.deepEqual(getFigurePlacementOptions(state), { mode: 'normal', slots: [7] });
  refuse(state, 2);
});
test('GC-13: when no peripheral numeric card has a free adjacent slot, rescue offers all free slots', () => {
  const state = fixture({ phase: 'placing-figure', emptyCells: [0,1,2,3,5,6,7,8] });
  assert.deepEqual(getFigurePlacementOptions(state), { mode: 'rescue', slots: Array.from({ length: 12 }, (_, i) => i) });
  const saved = JSON.parse(JSON.stringify(state));
  assert.deepEqual(getFigurePlacementOptions(saved), getFigurePlacementOptions(state));
  const next = place(saved, 8);
  assert.equal(next.phase, 'playing');
  assert.equal(next.figureSlots[8], 'hearts-11');
});
test('GC-V2-T130/135: last free slot beside empty perimeter uses rescue, even if a defeated figure occupies its neighbour', () => {
  const others = figures.filter(id => id !== 'hearts-11');
  const occupied = Object.fromEntries(Array.from({ length: 12 }, (_, i) => i).filter(i => i !== 1).map((slot, index) => [slot, others[index]]));
  const defeated = [occupied[0]];
  const state = fixture({ phase: 'placing-figure', emptyCells: [1], occupied, defeated });
  assert.deepEqual(getFigurePlacementOptions(state), { mode: 'rescue', slots: [1] });
  assert.equal(getFigureSlotStatus(state, 0), 'defeated');
  refuse(state, 0);
  const next = place(state, 1);
  assert.equal(next.figureSlots.filter(Boolean).length, 12);
  assert.equal(new Set(next.figureSlots).size, 12);
  assert.equal(getFigureSlotStatus(next, 0), 'defeated');
  assert.deepEqual(next.defeatedFigures, defeated);
  refuse(next, 1);
});
test('GC-13: a complete perimeter cannot accept a thirteenth figure or fabricate a loss', () => {
  const allOccupied = Object.fromEntries(figures.map((id, slot) => [slot, id]));
  const initial = fixture();
  const corrupt = { ...initial, figureSlots: Array.from({ length: 12 }, (_, i) => allOccupied[i]) };
  assert.equal(engine.validateState(corrupt).valid, false);
  assert.deepEqual(getFigurePlacementOptions(corrupt), { mode: 'blocked', slots: [] });
  assert.deepEqual(engine.getLegalActions(corrupt), []);
  refuse(corrupt, 0);
  assert.equal(corrupt.outcome, 'in-progress');
});
test('figure status is persisted without freeing occupied slots; bad status metadata is refused', () => {
  const state = fixture({ occupied: { 0: 'clubs-11', 11: 'spades-12' }, defeated: ['clubs-11'] });
  const restored = JSON.parse(JSON.stringify(state));
  assert.equal(getFigureSlotStatus(restored, 0), 'defeated');
  assert.equal(getFigureSlotStatus(restored, 9), 'alive');
  assert.equal(getFigureSlotStatus(restored, 1), 'empty');
  assert.deepEqual(getFigurePlacementOptions(restored), getFigurePlacementOptions(state));
  assert.equal(engine.validateState({ ...state, defeatedFigures: ['hearts-13'] }).valid, false);
  assert.equal(engine.validateState({ ...state, defeatedFigures: ['clubs-11', 'clubs-11'] }).valid, false);
});
test('GC-T06: a repeated placement is rejected and never duplicates a figure or a slot', () => {
  const state = fixture({ occupied: { 0: 'clubs-11' } });
  const options = getFigurePlacementOptions(state);
  const chosen = options.slots[0];
  const next = place(state, chosen);
  refuse(next, chosen);
  const id = state.pendingFigures[0];
  assert.equal(next.figureSlots.filter(card => card === id).length, 1);
});
