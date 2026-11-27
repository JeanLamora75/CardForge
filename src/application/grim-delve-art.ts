import {makeDeckWithJokers, type Suit} from "../core/cards.ts";
import type {Locale} from "../i18n/language.ts";
const names:Record<Suit,readonly (readonly [string,string])[]> = {
  "hearts": [
    [
      "Dague",
      "Dagger"
    ],
    [
      "Épée courte",
      "Short sword"
    ],
    [
      "Lance",
      "Spear"
    ],
    [
      "Masse",
      "Mace"
    ],
    [
      "Arbalète",
      "Crossbow"
    ],
    [
      "Marteau",
      "Hammer"
    ],
    [
      "Hallebarde",
      "Halberd"
    ],
    [
      "Espadon",
      "Greatsword"
    ],
    [
      "Épée sacrée",
      "Holy sword"
    ],
    [
      "Excalibur",
      "Excalibur"
    ],
    [
      "Le Chevalier",
      "The Knight"
    ],
    [
      "La Paladine",
      "The Paladin"
    ],
    [
      "Le Souverain",
      "The Sovereign"
    ]
  ],
  "diamonds": [
    [
      "Cristal magique",
      "Magic crystal"
    ],
    [
      "Dague elfique",
      "Elven dagger"
    ],
    [
      "Flèche enchantée",
      "Enchanted arrow"
    ],
    [
      "Arc elfique",
      "Elven bow"
    ],
    [
      "Lame lunaire",
      "Moonblade"
    ],
    [
      "Lance runique",
      "Runic spear"
    ],
    [
      "Sceptre arcanique",
      "Arcane sceptre"
    ],
    [
      "Arc ancestral",
      "Ancestral bow"
    ],
    [
      "Lame astrale",
      "Astral blade"
    ],
    [
      "Fureur des arcanes",
      "Arcane fury"
    ],
    [
      "Le Gardien",
      "The Guardian"
    ],
    [
      "L’Archimage",
      "The Archmage"
    ],
    [
      "Le Roi ancestral",
      "The Ancient King"
    ]
  ],
  "clubs": [
    [
      "Croc",
      "Fang"
    ],
    [
      "Gourdin",
      "Club"
    ],
    [
      "Hachette",
      "Hatchet"
    ],
    [
      "Hache de guerre",
      "Battle axe"
    ],
    [
      "Masse tribale",
      "Tribal mace"
    ],
    [
      "Marteau de guerre",
      "War hammer"
    ],
    [
      "Totem chamanique",
      "Shamanic totem"
    ],
    [
      "Hache double",
      "Double axe"
    ],
    [
      "Arme du titan",
      "Titan weapon"
    ],
    [
      "Rage ancestrale",
      "Ancestral rage"
    ],
    [
      "Le Berserker",
      "The Berserker"
    ],
    [
      "La Chamane",
      "The Shaman"
    ],
    [
      "Le Seigneur de guerre",
      "The Warlord"
    ]
  ],
  "spades": [
    [
      "Os maudit",
      "Cursed bone"
    ],
    [
      "Dague rituelle",
      "Ritual dagger"
    ],
    [
      "Crâne ensorcelé",
      "Enchanted skull"
    ],
    [
      "Grimoire",
      "Grimoire"
    ],
    [
      "Chaînes spectrales",
      "Spectral chains"
    ],
    [
      "Faux maudite",
      "Cursed scythe"
    ],
    [
      "Orbe des âmes",
      "Soul orb"
    ],
    [
      "Sceptre de la mort",
      "Death sceptre"
    ],
    [
      "Invocation spectrale",
      "Spectral invocation"
    ],
    [
      "Tempête des âmes",
      "Soul storm"
    ],
    [
      "Le Revenant",
      "The Revenant"
    ],
    [
      "La Nécromancienne",
      "The Necromancer"
    ],
    [
      "Le Roi-Liche",
      "The Lich King"
    ]
  ]
};
const factions:Record<Suit,readonly [string,string]>={hearts:["Humains","Humans"],diamonds:["Elfes","Elves"],clubs:["Orcs","Orcs"],spades:["Nécromanciens","Necromancers"]};
const symbols:Record<Suit,string>={hearts:"♥",diamonds:"♦",clubs:"♣",spades:"♠"};
const deck=new Map(makeDeckWithJokers().map(c=>[c.id,c]));
export function grimCardView(id:string,locale:Locale){
 const c=deck.get(id); if(!c)throw new Error("Unknown Grim Delve card");
 const i=locale==="fr"?0:1;
 const numbered="rank" in c?c:null;
 const faction=numbered?numbered.suit:"joker";
 const title=numbered?names[numbered.suit][numbered.rank-1][i]:id==="joker-1"?["Le Voyageur astral","The Astral Wanderer"][i]:["Le Dragon primordial","The Primordial Dragon"][i];
 const value=numbered?numbered.rank:10;
 const monster=!!numbered&&numbered.rank>=11;
 const factionName=numbered?factions[numbered.suit][i]:"Joker";
 const symbol=numbered?symbols[numbered.suit]:"★";
 const label=title+" · "+factionName+" ("+symbol+") · "+(monster?(i?"Resistance":"Résistance"):(i?"Power":"Puissance"))+" : "+value+(numbered?"":i?" · wild suit":" · enseigne libre");
 return {title,value,monster,faction,factionName,symbol,label,illustration:"cards/grim-delve/"+id+".webp",frame:"frames/grim-delve/card-"+faction+".webp",emblem:numbered?"icons/grim-delve/faction-"+faction+".webp":undefined};
}
export const grimCardBack="cards/grim-delve/back.webp";
