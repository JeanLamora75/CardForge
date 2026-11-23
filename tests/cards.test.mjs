import test from "node:test";
import assert from "node:assert/strict";
import {
  suits,
  makeStandardDeck,
  makeDeckWithJokers,
  isJokerCard,
  shuffle,
} from "../src/core/cards.ts";

const ids = (cards) => cards.map((card) => card.id);
const sortedIds = (cards) => ids(cards).sort();

test("le paquet classique contient 52 cartes uniques : quatre enseignes et treize rangs", () => {
  assert.deepEqual(suits, ["hearts", "diamonds", "clubs", "spades"]);
  const cards = makeStandardDeck();
  assert.equal(cards.length, 52);
  assert.equal(new Set(ids(cards)).size, 52);
  for (const suit of suits) {
    assert.deepEqual(
      cards.filter((card) => card.suit === suit).map((card) => card.rank),
      Array.from({ length: 13 }, (_, i) => i + 1),
    );
  }
});

test("le paquet MVP contient 54 cartes physiques, dont deux Jokers distinguables", () => {
  const cards = makeDeckWithJokers();
  assert.equal(cards.length, 54);
  assert.equal(new Set(ids(cards)).size, 54);
  assert.deepEqual(cards.filter(isJokerCard).map((card) => card.id), ["joker-1", "joker-2"]);
  assert.deepEqual(sortedIds(cards.filter((card) => !isJokerCard(card))), sortedIds(makeStandardDeck()));
});

test("les Jokers n'ont ni rang, ni enseigne, ni puissance générique", () => {
  for (const joker of makeDeckWithJokers().filter(isJokerCard)) {
    assert.deepEqual(Object.keys(joker).sort(), ["id", "kind"]);
    assert.equal(joker.kind, "joker");
    assert.equal("rank" in joker, false);
    assert.equal("suit" in joker, false);
    assert.equal("power" in joker, false);
    assert.equal("value" in joker, false);
  }
});

test("les identités restent intactes entre pioche, main et défausse", () => {
  const deck = makeDeckWithJokers();
  const expectedIds = sortedIds(deck);
  const draw = [...deck];
  const hand = [draw.shift(), draw.shift(), draw.pop()];
  const discard = [hand.shift()];
  assert.deepEqual([...draw, ...hand, ...discard].map((card) => card.id).sort(), expectedIds);
  assert.equal(new Set([...draw, ...hand, ...discard].map((card) => card.id)).size, 54);
  assert.equal([...draw, ...hand, ...discard].find((card) => card.id === "joker-2"), deck.find((card) => card.id === "joker-2"));
});

test("le mélange conserve toutes les cartes sans modifier l'entrée", () => {
  const deck = makeDeckWithJokers();
  const initial = ids(deck);
  const shuffled = shuffle(deck, () => 0);
  assert.deepEqual(ids(deck), initial);
  assert.deepEqual(sortedIds(shuffled), sortedIds(deck));
  assert.equal(new Set(ids(shuffled)).size, 54);
  assert.notDeepEqual(ids(shuffled), initial);
});

test("le mélange refuse une source aléatoire invalide", () => {
  for (const invalid of [-1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => shuffle(makeDeckWithJokers(), () => invalid), RangeError);
  }
});
