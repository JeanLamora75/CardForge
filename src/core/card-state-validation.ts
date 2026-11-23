import { makeDeckWithJokers } from './cards.ts';
import type { ValidationResult } from './game-engine.ts';

export type CardStateIssueCode = 'schema' | 'duplicate' | 'missing' | 'unknown-card' | 'zone' | 'phase';
export type CardStateIssue = Readonly<{ code: CardStateIssueCode; detail: string }>;
export type CardStateValidation =
  | Readonly<{ valid: true; issues: readonly [] }>
  | Readonly<{ valid: false; issues: readonly CardStateIssue[] }>;

export type CardZoneRules = Readonly<{
  allowedZones: readonly string[];
  allowedPhases?: readonly string[];
  /** Each game owns its own zone/phase rules; the 54 physical IDs are shared. */
  expectedCardIds?: readonly string[];
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Checks all physical identities, without assuming how a particular game uses them. */
export function validateCardZones(state: unknown, rules: CardZoneRules): CardStateValidation {
  const issues: CardStateIssue[] = [];
  const expected = rules.expectedCardIds ?? makeDeckWithJokers().map((card) => card.id);
  if (new Set(expected).size !== expected.length) {
    throw new Error('expectedCardIds must be unique');
  }
  if (new Set(rules.allowedZones).size !== rules.allowedZones.length || rules.allowedZones.length === 0) {
    throw new Error('allowedZones must be nonempty and unique');
  }
  if (!isRecord(state) || !isRecord(state.zones)) {
    return { valid: false, issues: [{ code: 'schema', detail: 'state.zones must be an object' }] };
  }
  if (rules.allowedPhases) {
    if (typeof state.phase !== 'string') {
      issues.push({ code: 'schema', detail: 'state.phase must be a string' });
    } else if (!rules.allowedPhases.includes(state.phase)) {
      issues.push({ code: 'phase', detail: `invalid phase: ${state.phase}` });
    }
  }
  const seen = new Set<string>();
  const allowed = new Set(rules.allowedZones);
  const known = new Set(expected);
  for (const [zone, cards] of Object.entries(state.zones)) {
    if (!allowed.has(zone)) {
      issues.push({ code: 'zone', detail: `invalid zone: ${zone}` });
    }
    if (!Array.isArray(cards)) {
      issues.push({ code: 'schema', detail: `zone ${zone} must be an array` });
      continue;
    }
    for (const id of cards) {
      if (typeof id !== 'string') {
        issues.push({ code: 'schema', detail: `card in zone ${zone} must have a string id` });
        continue;
      }
      if (seen.has(id)) {
        issues.push({ code: 'duplicate', detail: `duplicate card: ${id}` });
      }
      seen.add(id);
      if (!known.has(id)) {
        issues.push({ code: 'unknown-card', detail: `unknown card: ${id}` });
      }
    }
  }
  for (const id of expected) {
    if (!seen.has(id)) issues.push({ code: 'missing', detail: `missing card: ${id}` });
  }
  return issues.length ? { valid: false, issues } : { valid: true, issues: [] };
}

/** Bridges diagnostic categories to the existing GameEngine validation contract. */
export function toEngineValidation(result: CardStateValidation): ValidationResult {
  return result.valid
    ? { valid: true }
    : { valid: false, errors: result.issues.map((issue) => `${issue.code}: ${issue.detail}`) };
}
