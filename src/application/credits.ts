import { games, type GameId } from "../catalog.ts";
import appPackage from "../../package.json" with { type: "json" };

export const APP_VERSION = appPackage.version;

export type Attribution = Readonly<{
  gameId: GameId;
  publicName: string;
  originalTitle: string;
  originalAuthors: string;
  source: string;
  visualUniverseFr: string;
  visualUniverseEn: string;
  licenceFr: string;
  licenceEn: string;
  permissionFr: string;
  permissionEn: string;
}>;

const attributionDetails: Record<GameId, Omit<Attribution, "gameId" | "publicName" | "originalTitle">> = {
  "clear-the-dungeon": {
    originalAuthors: "Mark S. Ball",
    source: "https://giftsforcardplayers.com/clear-the-dungeon-a-solo-card-game/",
    visualUniverseFr: "Donjon et dark fantasy, présentation originale CardForge.",
    visualUniverseEn: "Dungeon and dark fantasy, original CardForge presentation.",
    licenceFr: "Le référentiel de règles mentionne Creative Commons BY-NC-ND 4.0 pour les documents de règles. Cette licence ne constitue pas, à elle seule, une permission de diffuser une adaptation des éléments protégés.",
    licenceEn: "The rules reference identifies Creative Commons BY-NC-ND 4.0 for the rule documents. That licence alone does not permit distribution of an adaptation of protected material.",
    permissionFr: "Accord d’adaptation gratuite déclaré par le porteur du projet, mais document et périmètre non vérifiés indépendamment. Autorisation de diffusion non validée.",
    permissionEn: "Permission for a free adaptation reported by the project owner, but written evidence and scope have not been independently verified. Publication permission is not cleared.",
  },
  gridcannon: {
    originalAuthors: "Tom Francis",
    source: "https://www.pentadact.com/2019-08-20-gridcannon-a-single-player-game-with-regular-playing-cards/",
    visualUniverseFr: "Aventure spatiale pulp rétrofuturiste, présentation originale CardForge.",
    visualUniverseEn: "Retrofuturistic pulp space adventure, original CardForge presentation.",
    licenceFr: "Licence de réutilisation des éléments protégés et conditions d’adaptation non établies dans le référentiel CardForge.",
    licenceEn: "Reuse licence for protected content and adaptation terms are not established in the CardForge reference.",
    permissionFr: "Aucune autorisation de diffusion vérifiée. Le titre Thunderfighter est approuvé comme nom de présentation CardForge, pas juridiquement validé.",
    permissionEn: "No verified publication permission. Thunderfighter is approved as a CardForge presentation name, not legally cleared.",
  },
  "card-capture": {
    originalAuthors: "Lucas Gentry",
    source: "https://boardgamegeek.com/filepage/173125/card-capture-rules-2018-solitaire-print-and-play-c",
    visualUniverseFr: "Corsaires du ciel et îles flottantes, présentation originale CardForge.",
    visualUniverseEn: "Sky pirates and floating islands, original CardForge presentation.",
    licenceFr: "Licence et droits de réutilisation non vérifiés.",
    licenceEn: "Reuse licence and permissions not verified.",
    permissionFr: "À vérifier avant une diffusion ; jeu CardForge à venir.",
    permissionEn: "To be checked before publication; upcoming CardForge game.",
  },
  "loot-the-loop": {
    originalAuthors: "Wil Su (Isaludo)",
    source: "https://boardgamegeek.com/boardgame/358081/loot-the-loop",
    visualUniverseFr: "Métropole des années 1930, Prohibition et dieselpunk, présentation originale CardForge.",
    visualUniverseEn: "1930s metropolis, Prohibition and dieselpunk, original CardForge presentation.",
    licenceFr: "Licence et droits de réutilisation non vérifiés.",
    licenceEn: "Reuse licence and permissions not verified.",
    permissionFr: "À vérifier avant une diffusion ; jeu CardForge à venir.",
    permissionEn: "To be checked before publication; upcoming CardForge game.",
  },
  regicide: {
    originalAuthors: "Paul Abrahams, Luke Badger et Andy Richdale",
    source: "https://www.regicidegame.com/how-to-play/",
    visualUniverseFr: "Univers wuxia / chanbara d’Asie féodale fantastique, présentation originale CardForge.",
    visualUniverseEn: "Fantasy feudal Asia wuxia / chanbara setting, original CardForge presentation.",
    licenceFr: "Licence d’adaptation et de réutilisation non vérifiée.",
    licenceEn: "Adaptation and reuse licence not verified.",
    permissionFr: "À vérifier avant une diffusion ; jeu CardForge à venir.",
    permissionEn: "To be checked before publication; upcoming CardForge game.",
  },
};

export const ATTRIBUTIONS: readonly Attribution[] = games.map(game => ({
  gameId: game.id,
  publicName: game.title,
  originalTitle: game.originalGame,
  ...attributionDetails[game.id],
}));

export const NOTICE_REFERENCES = {
  creativeCommons: "https://creativecommons.org/licenses/by-nc-nd/4.0/deed.fr",
  copyrightStudy: "https://github.com/JeanLamora75/CardForge/blob/main/_bmad-output/planning-artifacts/clear-the-dungeon-rules-rights-study.md",
  releaseGate: "https://lmn24.atlassian.net/browse/CAR-43",
  project: "https://github.com/JeanLamora75/CardForge",
} as const;
