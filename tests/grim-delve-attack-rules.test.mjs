import test from 'node:test';
import assert from 'node:assert/strict';
import { grimDelveEngine as engine } from '../src/games/clear-the-dungeon/engine.ts';
import { makeDeckWithJokers } from '../src/core/cards.ts';

const allIds = makeDeckWithJokers().map(card => card.id).sort();
function prepare(rank, cards) {
  const start = engine.createInitialState({ seed: 42 });
  const monsterId = start.visibleMonsters.find(id => id.endsWith(`-${rank}`));
  assert.ok(monsterId);
  assert.equal(new Set(cards).size, cards.length);
  const pool = [...start.hand, ...start.drawPile];
  assert.ok(cards.every(card => pool.includes(card)));
  const state = { ...start, hand: [...cards], drawPile: pool.filter(id => !cards.includes(id)) };
  assert.equal(engine.validateState(state).valid, true);
  return { state, monsterId, suit: monsterId.split('-')[0] };
}
function play(state, action) {
  const before = structuredClone(state);
  const result = engine.transition(state, action);
  assert.equal(result.accepted, true, JSON.stringify(action) + ': ' + result.reason);
  assert.deepEqual(state, before);
  const s = result.state;
  assert.equal(engine.validateState(s).valid, true);
  const ids = [...s.columns.flat(), ...s.hand, ...s.drawPile, ...s.damages, ...s.defeated, ...s.removed,
    ...s.attacks.flatMap(a => a.powers.map(p => p.cardId))].sort();
  assert.deepEqual(ids, allIds);
  return s;
}
function refuse(s, action) {
  const before = structuredClone(s);
  const r = engine.transition(s, action);
  assert.equal(r.accepted, false, JSON.stringify(action));
  assert.strictEqual(r.state, s);
  assert.deepEqual(s, before);
}
test('CTD-T25 / CTD-T71: exact threshold 6+5=11 defeats Jack with Joker trigger', () => {
  const { state, monsterId } = prepare(11, ['clubs-6', 'diamonds-5', 'joker-1']);
  let s = play(state, { type: 'place-power', cardId: 'clubs-6', monsterId });
  s = play(s, { type: 'place-power', cardId: 'diamonds-5', monsterId });
  s = play(s, { type: 'trigger-attack', cardId: 'joker-1', monsterId });
  assert.deepEqual(s.defeated, [monsterId]);
});
test('CTD-T80: above-threshold 8+6=14 defeats Jack without strict equality', () => {
  const { state, monsterId } = prepare(11, ['clubs-8', 'diamonds-6', 'joker-2']);
  let s = play(state, { type: 'place-power', cardId: 'clubs-8', monsterId });
  s = play(s, { type: 'place-power', cardId: 'diamonds-6', monsterId });
  s = play(s, { type: 'trigger-attack', cardId: 'joker-2', monsterId });
  assert.equal(s.defeated.length, 1);
});
test('CTD-T73: incorrect suit cannot trigger even with enough strength', () => {
  const { state, monsterId, suit } = prepare(12, ['clubs-8', 'diamonds-5', 'spades-2']);
  let s = play(state, { type: 'place-power', cardId: 'clubs-8', monsterId });
  s = play(s, { type: 'place-power', cardId: 'diamonds-5', monsterId });
  if (suit === 'spades') {
    s = { ...s, hand: ['hearts-2'], drawPile: s.drawPile.filter(x => x !== 'hearts-2').concat('spades-2') };
    assert.equal(engine.validateState(s).valid, true);
  }
  refuse(s, { type: 'trigger-attack', cardId: suit === 'spades' ? 'hearts-2' : 'spades-2', monsterId });
  assert.equal(s.attacks[0].powers.length, 2);
});
test('CTD-T69/T70: trigger requires two previously placed powers', () => {
  const { state, monsterId } = prepare(11, ['clubs-8', 'diamonds-5', 'joker-1']);
  refuse(state, { type: 'trigger-attack', cardId: 'joker-1', monsterId });
  const s = play(state, { type: 'place-power', cardId: 'clubs-8', monsterId });
  refuse(s, { type: 'trigger-attack', cardId: 'joker-1', monsterId });
});
test('CTD-T77 / CTD-T78/T82 / CTD-T93: inadequate second power is refused without consumption', () => {
  const { state, monsterId } = prepare(13, ['clubs-5', 'diamonds-7', 'joker-1']);
  const s = play(state, { type: 'place-power', cardId: 'clubs-5', monsterId });
  refuse(s, { type: 'place-power', cardId: 'diamonds-7', monsterId });
  assert.deepEqual(s.attacks[0].powers.map(p => p.cardId), ['clubs-5']);
  assert.ok(s.hand.includes('diamonds-7'));
});
test('CTD-T85/T86: first 2 cannot reach K13 but first 3 can', () => {
  const { state, monsterId } = prepare(13, ['clubs-2', 'diamonds-3', 'joker-1']);
  refuse(state, { type: 'place-power', cardId: 'clubs-2', monsterId });
  const s = play(state, { type: 'place-power', cardId: 'diamonds-3', monsterId });
  assert.equal(s.attacks[0].powers[0].cardId, 'diamonds-3');
});
test('CTD-T28 / CTD-T94/T95: first Joker counts exactly 10 and numeric 3 reaches K13', () => {
  const { state, monsterId } = prepare(13, ['joker-1', 'diamonds-3', 'clubs-2']);
  let s = play(state, { type: 'place-power', cardId: 'joker-1', monsterId });
  s = play(s, { type: 'place-power', cardId: 'diamonds-3', monsterId });
  assert.equal(s.attacks[0].powers.length, 2);
  assert.equal(s.defeated.length, 0);
});
test('CTD-T30 / CTD-T74 / CTD-T102 / CTD-T104: Joker A + numeric 3 power, Joker B trigger defeats King', () => {
  const { state, monsterId } = prepare(13, ['joker-1', 'diamonds-3', 'joker-2']);
  let s = play(state, { type: 'place-power', cardId: 'joker-1', monsterId });
  s = play(s, { type: 'place-power', cardId: 'diamonds-3', monsterId });
  s = play(s, { type: 'trigger-attack', cardId: 'joker-2', monsterId });
  assert.deepEqual(s.removed, ['joker-1', 'diamonds-3', 'joker-2']);
});
test('CTD-T29 / CTD-T105: two Jokers in power slots do not finish attack without third card', () => {
  const { state, monsterId } = prepare(13, ['joker-1', 'joker-2', 'clubs-2']);
  let s = play(state, { type: 'place-power', cardId: 'joker-1', monsterId });
  s = play(s, { type: 'place-power', cardId: 'joker-2', monsterId });
  assert.equal(s.attacks[0].powers.length, 2);
  assert.equal(s.defeated.length, 0);
});
test('CTD-T106/T107: two Jokers in power plus correct suit trigger; wrong suit rejected', () => {
  const { state, monsterId, suit } = prepare(13, ['joker-1', 'joker-2', 'clubs-2']);
  let s = play(state, { type: 'place-power', cardId: 'joker-1', monsterId });
  s = play(s, { type: 'place-power', cardId: 'joker-2', monsterId });
  if (suit !== 'clubs') {
    refuse(s, { type: 'trigger-attack', cardId: 'clubs-2', monsterId });
    s = { ...s, hand: [`${suit}-2`], drawPile: s.drawPile.filter(id => id !== `${suit}-2`).concat('clubs-2') };
    assert.equal(engine.validateState(s).valid, true);
  }
  s = play(s, { type: 'trigger-attack', cardId: `${suit}-2`, monsterId });
  assert.equal(s.defeated.length, 1);
});
test('CTD-T98/T110: same Joker cannot be used twice as power and trigger', () => {
  const { state, monsterId } = prepare(13, ['joker-1', 'diamonds-5', 'clubs-6']);
  let s = play(state, { type: 'place-power', cardId: 'joker-1', monsterId });
  s = play(s, { type: 'place-power', cardId: 'diamonds-5', monsterId });
  refuse(s, { type: 'trigger-attack', cardId: 'joker-1', monsterId });
});
test('CTD-T111: two Jokers in earlier hand stay individually locked after resume', () => {
  const { state, monsterId } = prepare(13, ['joker-1', 'joker-2', 'clubs-6']);
  let s = play(state, { type: 'place-power', cardId: 'joker-1', monsterId });
  s = play(s, { type: 'place-power', cardId: 'joker-2', monsterId });
  s = play(s, { type: 'discard', cardId: 'clubs-6' });
  s = play(s, { type: 'end-hand' });
  const saved = JSON.parse(JSON.stringify(s));
  assert.deepEqual(saved.attacks[0].powers.map(p => p.cardId), ['joker-1', 'joker-2']);
  refuse(saved, { type: 'take-back', cardId: 'joker-1' });
  refuse(saved, { type: 'take-back', cardId: 'joker-2' });
});
test('CTD-T109: both Jokers can be assigned to two different targets', () => {
  const start = engine.createInitialState({ seed: 47 });
  const pool = [...start.hand, ...start.drawPile];
  const s = { ...start, hand: ['joker-1', 'joker-2'],
    drawPile: pool.filter(id => id !== 'joker-1' && id !== 'joker-2') };
  let next = play(s, { type: 'place-power', cardId: 'joker-1', monsterId: s.visibleMonsters[0] });
  next = play(next, { type: 'place-power', cardId: 'joker-2', monsterId: s.visibleMonsters[1] });
  assert.equal(next.attacks.length, 2);
});
test('joker power/suit cannot be overridden by unrecognized action arguments', () => {
  const { state, monsterId } = prepare(13, ['joker-1', 'joker-2', 'diamonds-3']);
  refuse(state, { type: 'set-joker-value', cardId: 'joker-1', value: 1 });
  refuse(state, { type: 'set-joker-suit', cardId: 'joker-1', suit: 'hearts' });
  refuse(state, { type: 'place-power', cardId: 'joker-1', monsterId, value: 1 });
});
