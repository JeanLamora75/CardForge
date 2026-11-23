import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameSession } from '../src/application/game-session.ts';

function duelEngine() {
  return {
    createInitialState: () => ({ phase: 'attack', health: 2 }),
    getLegalActions: (state) => state.phase === 'attack' ? [{ kind: 'strike' }] : [{ kind: 'defend' }],
    transition: (state, action) => {
      if (state.phase === 'attack' && action.kind === 'strike') {
        return { accepted: true, state: { phase: 'defend', health: state.health - 1 } };
      }
      if (state.phase === 'defend' && action.kind === 'defend') {
        return { accepted: true, state: { ...state, phase: 'attack' } };
      }
      return { accepted: false, state, reason: 'action not legal in this phase' };
    },
    getOutcome: (state) => state.health === 0 ? 'win' : 'in-progress',
    validateState: (state) => state !== null && typeof state === 'object' &&
      ['attack', 'defend'].includes(state.phase) &&
      Number.isInteger(state.health) && state.health >= 0 && state.health <= 2
      ? { valid: true } : { valid: false, errors: ['invalid duel state'] },
  };
}

function expeditionEngine() {
  return {
    createInitialState: () => ({ phase: 'explore', location: 0 }),
    getLegalActions: (state) => state.phase === 'explore' ? [{ kind: 'advance' }] : [{ kind: 'inspect' }],
    transition: (state, action) => {
      if (state.phase === 'explore' && action.kind === 'advance') {
        return { accepted: true, state: { phase: 'inspect', location: state.location + 1 } };
      }
      if (state.phase === 'inspect' && action.kind === 'inspect') {
        return { accepted: true, state: { ...state, phase: 'explore' } };
      }
      return { accepted: false, state, reason: 'action not legal in this phase' };
    },
    getOutcome: (state) => state.location >= 2 ? 'win' : 'in-progress',
    validateState: (state) => state !== null && typeof state === 'object' &&
      ['explore', 'inspect'].includes(state.phase) && Number.isInteger(state.location) && state.location >= 0
      ? { valid: true } : { valid: false, errors: ['invalid expedition state'] },
  };
}

test('two mock engines with different phases use the same game session', () => {
  const duel = createGameSession(duelEngine(), undefined);
  const expedition = createGameSession(expeditionEngine(), undefined);
  assert.deepEqual(duel.getLegalActions(), [{ kind: 'strike' }]);
  assert.deepEqual(expedition.getLegalActions(), [{ kind: 'advance' }]);
  assert.deepEqual(duel.dispatch({ kind: 'strike' }), { accepted: true, state: { phase: 'defend', health: 1 } });
  assert.deepEqual(expedition.dispatch({ kind: 'advance' }), { accepted: true, state: { phase: 'inspect', location: 1 } });
  assert.deepEqual(duel.getLegalActions(), [{ kind: 'defend' }]);
  assert.deepEqual(expedition.getLegalActions(), [{ kind: 'inspect' }]);
  assert.equal(duel.getOutcome(), 'in-progress');
  assert.equal(expedition.getOutcome(), 'in-progress');
  assert.deepEqual(duel.validateState(), { valid: true });
  assert.deepEqual(expedition.validateState(), { valid: true });
  assert.deepEqual(duel.dispatch({ kind: 'defend' }), { accepted: true, state: { phase: 'attack', health: 1 } });
  assert.deepEqual(expedition.dispatch({ kind: 'inspect' }), { accepted: true, state: { phase: 'explore', location: 1 } });
  duel.dispatch({ kind: 'strike' });
  expedition.dispatch({ kind: 'advance' });
  assert.equal(duel.getOutcome(), 'win');
  assert.equal(expedition.getOutcome(), 'win');
});

test('an illegal action preserves the exact previous state instance', () => {
  const session = createGameSession(duelEngine(), undefined);
  const previous = session.getState();
  const result = session.dispatch({ kind: 'defend' });
  assert.deepEqual(result, { accepted: false, state: previous, reason: 'action not legal in this phase' });
  assert.strictEqual(result.state, previous);
  assert.strictEqual(session.getState(), previous);
  assert.equal(session.getOutcome(), 'in-progress');
});

test('the common session rejects a successful transition to an invalid state without committing it', () => {
  const engine = { ...duelEngine(), transition: () => ({ accepted: true, state: { phase: 'bad', health: -1 } }) };
  const session = createGameSession(engine, undefined);
  const before = session.getState();
  assert.throws(() => session.dispatch({ kind: 'strike' }), /invalid state/i);
  assert.strictEqual(session.getState(), before);
});

test('the session refuses an invalid initial state', () => {
  const engine = { ...duelEngine(), createInitialState: () => ({ phase: 'bad', health: -1 }) };
  assert.throws(() => createGameSession(engine, undefined), /invalid state/i);
});

test('the generic orchestrator never alters its engine input state', () => {
  const engine = duelEngine();
  const initial = Object.freeze(engine.createInitialState());
  const session = createGameSession({ ...engine, createInitialState: () => initial }, undefined);
  const r = session.dispatch({ kind: 'strike' });
  assert.equal(r.accepted, true);
  assert.deepEqual(initial, { phase: 'attack', health: 2 });
  assert.notStrictEqual(session.getState(), initial);
});
