import test from 'node:test';
import assert from 'node:assert/strict';
import { makeDeckWithJokers } from '../src/core/cards.ts';
import { validateCardZones, toEngineValidation } from '../src/core/card-state-validation.ts';
import { createGameSession, restoreGameSession } from '../src/application/game-session.ts';

const cardIds = makeDeckWithJokers().map(c => c.id);
const delveRules = { allowedZones: ['draw', 'hand', 'monsters', 'discard', 'wounds'], allowedPhases: ['attack', 'resolve'] };
const thunderRules = { allowedZones: ['deck', 'grid', 'reserve', 'discard'], allowedPhases: ['place', 'fire'] };
function delve() { return { phase: 'attack', zones: { draw: cardIds.slice(5), hand: cardIds.slice(0, 5), monsters: [], discard: [], wounds: [] } }; }
function thunder() { return { phase: 'place', zones: { deck: cardIds.slice(8), grid: cardIds.slice(0, 8), reserve: [], discard: [] } }; }
const codes = (s, r) => validateCardZones(s, r).issues.map(i => i.code);

for (const [name, rules, make] of [['Grim Delve', delveRules, delve], ['Thunderfighter', thunderRules, thunder]]) {
  test(`${name}: 54 physical cards across game-specific zones are valid`, () => {
    assert.deepEqual(validateCardZones(make(), rules), { valid: true, issues: [] });
    assert.deepEqual(toEngineValidation(validateCardZones(make(), rules)), { valid: true });
  });
  test(`${name}: duplicate and missing card identities are independently reported`, () => {
    const state = make();
    const firstZone = Object.keys(state.zones)[0];
    state.zones[firstZone][0] = state.zones[firstZone][1];
    assert.ok(codes(state, rules).includes('duplicate'));
    assert.ok(codes(state, rules).includes('missing'));
  });
  test(`${name}: impossible zones and phases are rejected`, () => {
    const state = make();
    state.phase = 'not-a-game-phase';
    state.zones.elsewhere = [];
    assert.ok(codes(state, rules).includes('phase'));
    assert.ok(codes(state, rules).includes('zone'));
  });
  test(`${name}: malformed state and unknown physical IDs are rejected`, () => {
    assert.ok(codes(null, rules).includes('schema'));
    assert.ok(codes({ zones: [] }, rules).includes('schema'));
    const state = make();
    state.zones[Object.keys(state.zones)[0]].push('not-in-deck');
    assert.ok(codes(state, rules).includes('unknown-card'));
  });
}

function demoEngine(rules, make) {
  return {
    createInitialState: make,
    getLegalActions: () => [{ kind: 'move' }],
    transition(state, action) {
      if (action.kind !== 'move') return { accepted: false, state, reason: 'illegal action' };
      const next = structuredClone(state);
      const from = Object.keys(next.zones)[0], to = Object.keys(next.zones)[1];
      next.zones[to].push(next.zones[from].shift());
      return { accepted: true, state: next };
    },
    getOutcome: () => 'in-progress',
    validateState: value => toEngineValidation(validateCardZones(value, rules)),
  };
}
for (const [name, rules, make] of [['Grim Delve', delveRules, delve], ['Thunderfighter', thunderRules, thunder]]) {
  test(`${name}: illegal transition preserves the previous state`, () => {
    const session = createGameSession(demoEngine(rules, make), undefined);
    const state = session.getState();
    assert.equal(session.dispatch({ kind: 'forbidden' }).accepted, false);
    assert.strictEqual(session.getState(), state);
    const accepted = session.dispatch({ kind: 'move' });
    assert.equal(accepted.accepted, true);
    assert.equal(validateCardZones(session.getState(), rules).valid, true);
    assert.notStrictEqual(session.getState(), state);
  });
  test(`${name}: invalid saved state cannot be loaded and stays unchanged`, () => {
    const engine = demoEngine(rules, make);
    const state = make();
    const original = structuredClone(state);
    const first = Object.keys(state.zones)[0];
    state.zones[first].pop();
    const damaged = structuredClone(state);
    assert.throws(() => restoreGameSession(engine, state), /missing/i);
    assert.deepEqual(state, damaged);
    const restored = restoreGameSession(engine, original);
    assert.deepEqual(restored.getState(), original);
    assert.notStrictEqual(restored.getState(), original);
    assert.equal(restored.dispatch({ kind: 'move' }).accepted, true);
    assert.deepEqual(original, make());
  });
}

test('malformed card arrays and invalid configuration fail distinctly', () => {
  const state = delve();
  state.zones.hand = ['not-in-deck', 42];
  assert.ok(codes(state, delveRules).includes('schema'));
  assert.ok(codes(state, delveRules).includes('unknown-card'));
  assert.throws(() => validateCardZones(state, { allowedZones: [] }), /allowedZones/);
});
