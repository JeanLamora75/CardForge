import type { PublicLoopCard } from "../games/loot-the-loop/engine.ts";
export type MidnightCardArt = Readonly<{file:string;fr:string;en:string;value:number|string;frame:"blue"|"green"|"burgundy"|"neutral"}>;
export const midnightCardArt: Readonly<Record<string,MidnightCardArt>> = {
  "hearts-2": {
    "file": "ms-l01-banque-centrale",
    "fr": "La Banque centrale",
    "en": "Central Bank",
    "value": 2,
    "frame": "blue"
  },
  "hearts-3": {
    "file": "ms-l02-bourse",
    "fr": "La Bourse",
    "en": "Stock Exchange",
    "value": 3,
    "frame": "blue"
  },
  "hearts-4": {
    "file": "ms-l03-grand-hotel",
    "fr": "Le Grand Hôtel",
    "en": "Grand Hotel",
    "value": 4,
    "frame": "blue"
  },
  "hearts-5": {
    "file": "ms-l04-siege-du-journal",
    "fr": "Le Siège du journal",
    "en": "Newspaper Headquarters",
    "value": 5,
    "frame": "blue"
  },
  "hearts-6": {
    "file": "ms-l05-compagnie-assurances",
    "fr": "La Compagnie d’assurances",
    "en": "Insurance Company",
    "value": 6,
    "frame": "blue"
  },
  "hearts-7": {
    "file": "ms-l06-tour-des-affaires",
    "fr": "La Tour des affaires",
    "en": "Business Tower",
    "value": 7,
    "frame": "blue"
  },
  "hearts-8": {
    "file": "ms-l07-casino",
    "fr": "Le Casino",
    "en": "Casino",
    "value": 8,
    "frame": "blue"
  },
  "hearts-9": {
    "file": "ms-l08-speakeasy",
    "fr": "Le Speakeasy",
    "en": "Speakeasy",
    "value": 9,
    "frame": "blue"
  },
  "hearts-10": {
    "file": "ms-l09-cabaret",
    "fr": "Le Cabaret",
    "en": "Cabaret",
    "value": 10,
    "frame": "blue"
  },
  "hearts-1": {
    "file": "ms-p01-photo-pot-de-vin",
    "fr": "Photo compromettante",
    "en": "Incriminating photograph",
    "value": "A",
    "frame": "green"
  },
  "hearts-11": {
    "file": "ms-m01-le-parrain",
    "fr": "Le Parrain",
    "en": "The Godfather",
    "value": "!",
    "frame": "burgundy"
  },
  "hearts-12": {
    "file": "ms-m02-la-veuve-noire",
    "fr": "La Veuve Noire",
    "en": "Black Widow",
    "value": "!",
    "frame": "burgundy"
  },
  "hearts-13": {
    "file": "ms-m03-le-tueur-a-gages",
    "fr": "Le Tueur à gages",
    "en": "Hitman",
    "value": "!",
    "frame": "burgundy"
  },
  "diamonds-2": {
    "file": "ms-l10-club-de-jazz",
    "fr": "Le Club de jazz",
    "en": "Jazz Club",
    "value": 2,
    "frame": "blue"
  },
  "diamonds-3": {
    "file": "ms-l11-cinema",
    "fr": "Le Cinéma",
    "en": "Cinema",
    "value": 3,
    "frame": "blue"
  },
  "diamonds-4": {
    "file": "ms-l12-champ-de-courses",
    "fr": "Le Champ de courses",
    "en": "Racecourse",
    "value": 4,
    "frame": "blue"
  },
  "diamonds-5": {
    "file": "ms-l13-docks",
    "fr": "Les Docks",
    "en": "Docks",
    "value": 5,
    "frame": "blue"
  },
  "diamonds-6": {
    "file": "ms-l14-entrepot-maritime",
    "fr": "L’Entrepôt maritime",
    "en": "Maritime Warehouse",
    "value": 6,
    "frame": "blue"
  },
  "diamonds-7": {
    "file": "ms-l15-chantier-naval",
    "fr": "Le Chantier naval",
    "en": "Shipyard",
    "value": 7,
    "frame": "blue"
  },
  "diamonds-8": {
    "file": "ms-l16-capitainerie",
    "fr": "La Capitainerie",
    "en": "Harbour Office",
    "value": 8,
    "frame": "blue"
  },
  "diamonds-9": {
    "file": "ms-l17-phare",
    "fr": "Le Phare",
    "en": "Lighthouse",
    "value": 9,
    "frame": "blue"
  },
  "diamonds-10": {
    "file": "ms-l18-marche-aux-poissons",
    "fr": "Le Marché aux poissons",
    "en": "Fish Market",
    "value": 10,
    "frame": "blue"
  },
  "diamonds-1": {
    "file": "ms-p02-boite-allumettes",
    "fr": "Boîte d’allumettes",
    "en": "Matchbox",
    "value": "A",
    "frame": "green"
  },
  "diamonds-11": {
    "file": "ms-m04-la-balance",
    "fr": "La Balance",
    "en": "Informant",
    "value": "!",
    "frame": "burgundy"
  },
  "diamonds-12": {
    "file": "ms-m05-l-embuscade",
    "fr": "L’Embuscade",
    "en": "Ambush",
    "value": "!",
    "frame": "burgundy"
  },
  "diamonds-13": {
    "file": "ms-m06-la-voiture-piegee",
    "fr": "La Voiture piégée",
    "en": "Car Bomb",
    "value": "!",
    "frame": "burgundy"
  },
  "clubs-2": {
    "file": "ms-l19-acierie",
    "fr": "L’Aciérie",
    "en": "Steelworks",
    "value": 2,
    "frame": "blue"
  },
  "clubs-3": {
    "file": "ms-l20-garage-automobile",
    "fr": "Le Garage automobile",
    "en": "Garage",
    "value": 3,
    "frame": "blue"
  },
  "clubs-4": {
    "file": "ms-l21-depot-ferroviaire",
    "fr": "Le Dépôt ferroviaire",
    "en": "Rail Depot",
    "value": 4,
    "frame": "blue"
  },
  "clubs-5": {
    "file": "ms-l22-centrale-electrique",
    "fr": "La Centrale électrique",
    "en": "Power Station",
    "value": 5,
    "frame": "blue"
  },
  "clubs-6": {
    "file": "ms-l23-imprimerie",
    "fr": "L’Imprimerie",
    "en": "Printing Works",
    "value": 6,
    "frame": "blue"
  },
  "clubs-7": {
    "file": "ms-l24-distillerie",
    "fr": "La Distillerie",
    "en": "Distillery",
    "value": 7,
    "frame": "blue"
  },
  "clubs-8": {
    "file": "ms-l25-vieille-ville",
    "fr": "La Vieille Ville",
    "en": "Old Town",
    "value": 8,
    "frame": "blue"
  },
  "clubs-9": {
    "file": "ms-l26-marche-couvert",
    "fr": "Le Marché couvert",
    "en": "Covered Market",
    "value": 9,
    "frame": "blue"
  },
  "clubs-10": {
    "file": "ms-l27-preteur-sur-gages",
    "fr": "Le Prêteur sur gages",
    "en": "Pawnshop",
    "value": 10,
    "frame": "blue"
  },
  "clubs-1": {
    "file": "ms-p03-telegramme-code",
    "fr": "Télégramme codé",
    "en": "Coded telegram",
    "value": "A",
    "frame": "green"
  },
  "clubs-11": {
    "file": "ms-m07-le-tireur-de-l-ombre",
    "fr": "Le Tireur de l’ombre",
    "en": "Shadow Gunman",
    "value": "!",
    "frame": "burgundy"
  },
  "clubs-12": {
    "file": "ms-m08-le-guet-apens-des-docks",
    "fr": "Le Guet-apens des docks",
    "en": "Dockside Trap",
    "value": "!",
    "frame": "burgundy"
  },
  "clubs-13": {
    "file": "ms-m09-le-commissaire-corrompu",
    "fr": "Le Commissaire corrompu",
    "en": "Corrupt Commissioner",
    "value": "!",
    "frame": "burgundy"
  },
  "spades-2": {
    "file": "ms-l28-barbier",
    "fr": "Le Barbier",
    "en": "Barber",
    "value": 2,
    "frame": "blue"
  },
  "spades-3": {
    "file": "ms-l29-pension-de-famille",
    "fr": "La Pension de famille",
    "en": "Boarding House",
    "value": 3,
    "frame": "blue"
  },
  "spades-4": {
    "file": "ms-l30-gare-centrale",
    "fr": "La Gare centrale",
    "en": "Central Station",
    "value": 4,
    "frame": "blue"
  },
  "spades-5": {
    "file": "ms-l31-hotel-de-ville",
    "fr": "L’Hôtel de ville",
    "en": "City Hall",
    "value": 5,
    "frame": "blue"
  },
  "spades-6": {
    "file": "ms-l32-commissariat",
    "fr": "Le Commissariat",
    "en": "Police Station",
    "value": 6,
    "frame": "blue"
  },
  "spades-7": {
    "file": "ms-l33-palais-de-justice",
    "fr": "Le Palais de justice",
    "en": "Courthouse",
    "value": 7,
    "frame": "blue"
  },
  "spades-8": {
    "file": "ms-l34-cathedrale",
    "fr": "La Cathédrale",
    "en": "Cathedral",
    "value": 8,
    "frame": "blue"
  },
  "spades-9": {
    "file": "ms-l35-hopital",
    "fr": "L’Hôpital",
    "en": "Hospital",
    "value": 9,
    "frame": "blue"
  },
  "spades-10": {
    "file": "ms-l36-bibliotheque-municipale",
    "fr": "La Bibliothèque municipale",
    "en": "Public Library",
    "value": 10,
    "frame": "blue"
  },
  "spades-1": {
    "file": "ms-p04-ticket-consigne",
    "fr": "Ticket de consigne",
    "en": "Luggage ticket",
    "value": "A",
    "frame": "green"
  },
  "spades-11": {
    "file": "ms-m10-le-barrage-de-police",
    "fr": "Le Barrage de police",
    "en": "Police Roadblock",
    "value": "!",
    "frame": "burgundy"
  },
  "spades-12": {
    "file": "ms-m11-le-juge-vereux",
    "fr": "Le Juge véreux",
    "en": "Crooked Judge",
    "value": "!",
    "frame": "burgundy"
  },
  "spades-13": {
    "file": "ms-m12-l-interrogatoire-clandestin",
    "fr": "L’Interrogatoire clandestin",
    "en": "Secret Interrogation",
    "value": "!",
    "frame": "burgundy"
  },
  "joker-1": {
    "file": "joker-exfiltration",
    "fr": "Voiture d’exfiltration",
    "en": "Getaway car",
    "value": "★",
    "frame": "neutral"
  }
};
export function visibleMidnightArt(card:PublicLoopCard):MidnightCardArt|undefined {
  return card.faceUp ? midnightCardArt[card.id] : undefined;
}
