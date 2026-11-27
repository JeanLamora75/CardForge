import type { PublicLoopCard } from '../games/loot-the-loop/engine.ts';
import type { Locale } from '../i18n/language.ts';
export const midnightNarratives: Readonly<Record<string,Readonly<{fr:string;en:string}>>> = {
  "hearts-2": {
    "fr": "Des registres bancaires attirent votre attention.",
    "en": "Bank ledgers catch your eye."
  },
  "hearts-3": {
    "fr": "Les cours s’affolent derrière les vitres.",
    "en": "Prices fluctuate behind the glass."
  },
  "hearts-4": {
    "fr": "Le hall feutré bruisse de conversations.",
    "en": "Muted conversations fill the lobby."
  },
  "hearts-5": {
    "fr": "Les presses racontent la ville nocturne.",
    "en": "The presses tell the story of the city at night."
  },
  "hearts-6": {
    "fr": "Des dossiers s’empilent derrière les guichets.",
    "en": "Files pile up behind the counters."
  },
  "hearts-7": {
    "fr": "Une lumière veille au dernier étage.",
    "en": "A light burns on the top floor."
  },
  "hearts-8": {
    "fr": "Les jetons tintent sous les lustres.",
    "en": "Chips clink beneath the chandeliers."
  },
  "hearts-9": {
    "fr": "Une porte discrète étouffe le bruit de la rue.",
    "en": "A discreet door muffles the street."
  },
  "hearts-10": {
    "fr": "Les projecteurs masquent les regards.",
    "en": "Spotlights conceal watchful eyes."
  },
  "hearts-1": {
    "fr": "Un cliché compromettant mérite votre attention.",
    "en": "An incriminating photograph catches your eye."
  },
  "hearts-11": {
    "fr": "Le patron du syndicat surveille son empire.",
    "en": "The syndicate boss watches his empire."
  },
  "hearts-12": {
    "fr": "Un sourire énigmatique cache ses intentions.",
    "en": "An enigmatic smile conceals her intentions."
  },
  "hearts-13": {
    "fr": "Une silhouette menaçante attend dans l’ombre.",
    "en": "A threatening figure waits in the shadows."
  },
  "diamonds-2": {
    "fr": "Le saxophone couvre les conversations.",
    "en": "A saxophone drowns out conversations."
  },
  "diamonds-3": {
    "fr": "Le dernier film éclaire les visages.",
    "en": "The last screening lights up faces."
  },
  "diamonds-4": {
    "fr": "Les tribunes se vident dans la brume.",
    "en": "The stands empty into the mist."
  },
  "diamonds-5": {
    "fr": "Les grues dominent les quais silencieux.",
    "en": "Cranes tower over silent docks."
  },
  "diamonds-6": {
    "fr": "Des caisses anonymes occupent le hangar.",
    "en": "Unmarked crates fill the warehouse."
  },
  "diamonds-7": {
    "fr": "Le métal résonne dans les ateliers.",
    "en": "Metal echoes through the workshops."
  },
  "diamonds-8": {
    "fr": "Des cartes marines couvrent le bureau.",
    "en": "Sea charts cover the desk."
  },
  "diamonds-9": {
    "fr": "Un faisceau balaie la mer noire.",
    "en": "A beam sweeps the dark sea."
  },
  "diamonds-10": {
    "fr": "Les étals luisent sous les lanternes.",
    "en": "Stalls gleam beneath lanterns."
  },
  "diamonds-1": {
    "fr": "Un numéro griffonné intrigue.",
    "en": "A scribbled number raises questions."
  },
  "diamonds-11": {
    "fr": "Un visage familier inspire la méfiance.",
    "en": "A familiar face inspires distrust."
  },
  "diamonds-12": {
    "fr": "La ruelle paraît trop silencieuse.",
    "en": "The alley seems too quiet."
  },
  "diamonds-13": {
    "fr": "Une automobile abandonnée inspire la prudence.",
    "en": "An abandoned car calls for caution."
  },
  "clubs-2": {
    "fr": "Les fours illuminent le ciel de la ville.",
    "en": "Furnaces light the city sky."
  },
  "clubs-3": {
    "fr": "Des traces de pneus traversent le garage.",
    "en": "Tyre marks cross the garage floor."
  },
  "clubs-4": {
    "fr": "Les wagons attendent leur prochain départ.",
    "en": "Railcars await their next departure."
  },
  "clubs-5": {
    "fr": "Les turbines grondent dans la nuit.",
    "en": "Turbines rumble through the night."
  },
  "clubs-6": {
    "fr": "L’encre fraîche parfume les ateliers.",
    "en": "Fresh ink scents the workshop."
  },
  "clubs-7": {
    "fr": "Les alambics brillent dans la pénombre.",
    "en": "Stills gleam in the gloom."
  },
  "clubs-8": {
    "fr": "Les pavés humides reflètent les réverbères.",
    "en": "Wet cobblestones reflect streetlights."
  },
  "clubs-9": {
    "fr": "Les marchands replient leurs étals.",
    "en": "Merchants pack away their stalls."
  },
  "clubs-10": {
    "fr": "Des montres oubliées peuplent la vitrine.",
    "en": "Forgotten watches fill the display."
  },
  "clubs-1": {
    "fr": "Des signes codés couvrent le télégramme.",
    "en": "Coded symbols cover the telegram."
  },
  "clubs-11": {
    "fr": "Un regard guette depuis l’obscurité.",
    "en": "Watchful eyes peer from the darkness."
  },
  "clubs-12": {
    "fr": "Le quai désert devient inquiétant.",
    "en": "The deserted quay grows ominous."
  },
  "clubs-13": {
    "fr": "Un uniforme ne garantit pas la loyauté.",
    "en": "A uniform is no guarantee of loyalty."
  },
  "spades-2": {
    "fr": "Le miroir reflète une rue déserte.",
    "en": "The mirror reflects an empty street."
  },
  "spades-3": {
    "fr": "Une lampe éclaire le registre des visiteurs.",
    "en": "A lamp illuminates the guestbook."
  },
  "spades-4": {
    "fr": "Le dernier train s’annonce au loin.",
    "en": "The last train is heard in the distance."
  },
  "spades-5": {
    "fr": "Les bureaux municipaux restent éclairés.",
    "en": "Municipal offices remain lit."
  },
  "spades-6": {
    "fr": "Des dossiers attendent derrière les portes.",
    "en": "Files wait behind closed doors."
  },
  "spades-7": {
    "fr": "Les colonnes du tribunal dominent la place.",
    "en": "Courthouse columns dominate the square."
  },
  "spades-8": {
    "fr": "Les vitraux veillent sur la nuit.",
    "en": "Stained glass watches over the night."
  },
  "spades-9": {
    "fr": "Des pas résonnent dans les couloirs.",
    "en": "Footsteps echo through the corridors."
  },
  "spades-10": {
    "fr": "Les rayonnages gardent le silence.",
    "en": "The bookshelves keep their silence."
  },
  "spades-1": {
    "fr": "Un numéro de consigne figure sur le ticket.",
    "en": "A locker number appears on the ticket."
  },
  "spades-11": {
    "fr": "La route est fermée par les autorités.",
    "en": "Authorities have closed the road."
  },
  "spades-12": {
    "fr": "La justice semble avoir perdu son impartialité.",
    "en": "Justice seems to have lost its impartiality."
  },
  "spades-13": {
    "fr": "Une pièce fermée inspire l’inquiétude.",
    "en": "A locked room inspires unease."
  },
  "joker-1": {
    "fr": "Votre contact attend près de la voiture.",
    "en": "Your contact waits beside the car."
  }
};
export function visibleMidnightNarrative(card:PublicLoopCard,language:Locale){return card.faceUp?midnightNarratives[card.id]?.[language]:undefined;}
