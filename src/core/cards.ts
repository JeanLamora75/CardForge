/** Modèle technique neutre. Les factions visibles restent propres à chaque jeu. */
export const suits = ["hearts", "diamonds", "clubs", "spades"] as const;
export type Suit = (typeof suits)[number];
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type PlayingCard = Readonly<{ id: string; suit: Suit; rank: Rank }>;
export type JokerCard = Readonly<{ id: "joker-1" | "joker-2"; kind: "joker" }>;
export type PhysicalCard = PlayingCard | JokerCard;
export type RandomSource = () => number;

/** Les cartes de rang sont sans valeur d'attaque universelle. */
export function makeStandardDeck(): PlayingCard[] {
  return suits.flatMap((suit) =>
    Array.from({ length: 13 }, (_, index) => {
      const rank = (index + 1) as Rank;
      return { id: `${suit}-${rank}`, suit, rank };
    })
  );
}

/** Paquet physique partagé des jeux à 54 cartes ; le moteur définit l'effet des Jokers. */
export function makeDeckWithJokers(): PhysicalCard[] {
  return [...makeStandardDeck(), { id: "joker-1", kind: "joker" }, { id: "joker-2", kind: "joker" }];
}

export function isJokerCard(card: PhysicalCard): card is JokerCard {
  return "kind" in card && card.kind === "joker";
}

/** Fisher-Yates ; injecter la source aléatoire permet des tests reproductibles. */
export function shuffle<T>(cards: readonly T[], random: RandomSource = Math.random): T[] {
  const output = [...cards];
  for (let index = output.length - 1; index > 0; index--) {
    const value = random();
    if (!Number.isFinite(value) || value < 0 || value >= 1) {
      throw new RangeError("random must return a number in [0, 1)");
    }
    const pick = Math.floor(value * (index + 1));
    [output[index], output[pick]] = [output[pick], output[index]];
  }
  return output;
}
