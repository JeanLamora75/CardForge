import { makeDeckWithJokers, shuffle } from './cards.ts';
import type { PhysicalCard, RandomSource } from './cards.ts';

/** Version indépendante de l'implémentation PRNG pour rejouer les tests historiques. */
export const DECK_RANDOM_VERSION = 1 as const;

/** Seed uint32 ; fonction déterministe Mulberry32, sans accès au hasard global. */
export function createSeededRandom(seed: number): RandomSource {
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffff_ffff) {
    throw new RangeError('seed must be a uint32');
  }
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** La graine sert uniquement à créer une partie, jamais à la reprendre. */
export function createSeededDeck(seed: number): PhysicalCard[] {
  return shuffle(makeDeckWithJokers(), createSeededRandom(seed));
}

/** L'ordre des identifiants est le snapshot canonique de la pioche. */
export function snapshotDeckOrder(cards: readonly PhysicalCard[]): string[] {
  return cards.map((card) => card.id);
}

/** Restaure l'ordre sérialisé sans appel à shuffle ou à une source aléatoire. */
export function restoreDeckOrder(ids: readonly string[]): PhysicalCard[] {
  const canonical = makeDeckWithJokers();
  const byId = new Map(canonical.map((card) => [card.id, card]));
  if (ids.length !== canonical.length || new Set(ids).size !== canonical.length || ids.some((id) => !byId.has(id))) {
    throw new RangeError('invalid physical deck order');
  }
  return ids.map((id) => byId.get(id)!);
}
