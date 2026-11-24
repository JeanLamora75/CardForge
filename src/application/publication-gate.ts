import type { GameId } from "../catalog.ts";

/**
 * A technical test run is not an intellectual-property permission.
 * An empty evidence reference means the corresponding release gate is closed.
 * These references must point to reviewed evidence, not a pending Jira task.
 */
export type ReleaseCriterion =
  | "adaptationPermission"
  | "permissionScope"
  | "publicTitle"
  | "attribution"
  | "visualAssets"
  | "ruleConformance"
  | "bilingualExperience"
  | "offlineExperience";

export type ReleaseEvidence = Readonly<{
  reference: string | null;
  verified: boolean;
  note: string;
}>;

export type GameReleaseRecord = Readonly<{
  publicName: string;
  criteria: Readonly<Record<ReleaseCriterion, ReleaseEvidence>>;
}>;

function pending(note: string): ReleaseEvidence {
  return { reference: null, verified: false, note };
}
function verified(reference: string, note: string): ReleaseEvidence {
  return { reference, verified: true, note };
}

const webCi = "https://github.com/JeanLamora75/CardForge/actions/runs/45341981900";
const credits = "https://github.com/JeanLamora75/CardForge/blob/main/src/application/credits.ts";
const unknown = "Aucun justificatif d'autorisation, de licence ou de revue n'a été validé pour ce jeu.";

export const GAME_RELEASE_EVIDENCE: Readonly<Record<GameId, GameReleaseRecord>> = {
  "clear-the-dungeon": {
    publicName: "Grim Delve",
    criteria: {
      adaptationPermission: pending("Accord gratuit de Mark S. Ball déclaré par le porteur de projet ; copie et conditions précises non examinées."),
      permissionScope: pending("Périmètre écrit Grim Delve, adaptation graphique, Web gratuit, territoires, durée et crédits à confirmer."),
      publicTitle: pending("Disponibilité et autorisation d'emploi du titre Grim Delve non vérifiées."),
      attribution: verified(credits,"Auteur Mark S. Ball et jeu original Clear the Dungeon identifiés et crédités."),
      visualAssets: pending("Inventaire et provenance des ressources de production, droits des illustrations, icônes et polices non audités."),
      ruleConformance: verified(webCi,"Matrice CTD 121/121 tracée avec assertions et CI Web verte ; conformité juridique distincte."),
      bilingualExperience: verified(webCi,"Grim Delve joué dans les parcours navigateur FR/EN, clavier et tactile émulé."),
      offlineExperience: verified(webCi,"Reprise exacte de Grim Delve dans une nouvelle page hors connexion, build de production."),
    },
  },
  gridcannon: {
    publicName: "Thunderfighter",
    criteria: {
      adaptationPermission: pending("Aucune autorisation de diffusion des éventuels éléments protégés de Gridcannon V2 établie."),
      permissionScope: pending("Droits d'adaptation et de diffusion Web, univers original, gratuité et attribution non clarifiés."),
      publicTitle: pending("Nom Thunderfighter approuvé pour le produit, mais aucune vérification de disponibilité du titre."),
      attribution: verified(credits,"Auteur Tom Francis et titre source Gridcannon Version 2 identifiés et crédités."),
      visualAssets: pending("Inventaire et provenance des ressources de production non audités."),
      ruleConformance: verified(webCi,"Matrice GC 35/35 tracée avec assertions et CI Web verte ; convention de score à confirmer dans le référentiel Mary."),
      bilingualExperience: verified(webCi,"Thunderfighter joué dans les parcours navigateur FR/EN, clavier et tactile émulé."),
      offlineExperience: verified(webCi,"Reprise exacte de Thunderfighter dans une nouvelle page hors connexion."),
    },
  },
  "card-capture": {
    publicName: "Skydeck",
    criteria: {
      adaptationPermission: pending(unknown),
      permissionScope: pending(unknown),
      publicTitle: pending("Skydeck : disponibilité et droit d'exploitation du nouveau titre non vérifiés."),
      attribution: verified(credits,"Jeu source Card Capture et auteur Lucas Gentry identifiés."),
      visualAssets: pending("Ressources illustrées du jeu futur non livrées ni auditées."),
      ruleConformance: pending("Moteur et tests de jeu futur non livrés."),
      bilingualExperience: pending("Parcours de jeu FR/EN non livré."),
      offlineExperience: pending("Jeu non encore intégré au build PWA hors ligne."),
    },
  },
  "loot-the-loop": {
    publicName: "Midnight Syndicate",
    criteria: {
      adaptationPermission: pending(unknown),
      permissionScope: pending(unknown),
      publicTitle: pending("Midnight Syndicate : disponibilité du titre non vérifiée."),
      attribution: verified(credits,"Jeu source Loot the Loop et auteur Wil Su (Isaludo) identifiés."),
      visualAssets: pending("Ressources illustrées du jeu futur non livrées ni auditées."),
      ruleConformance: pending("Moteur et tests de jeu futur non livrés."),
      bilingualExperience: pending("Parcours de jeu FR/EN non livré."),
      offlineExperience: pending("Jeu non encore intégré au build PWA hors ligne."),
    },
  },
  regicide: {
    publicName: "Les Douze Tyrans",
    criteria: {
      adaptationPermission: pending(unknown),
      permissionScope: pending("Droits nécessaires à l'adaptation de Regicide et au changement d'univers non établis."),
      publicTitle: pending("Titre Les Douze Tyrans non vérifié juridiquement."),
      attribution: verified(credits,"Regicide et auteurs Paul Abrahams, Luke Badger et Andy Richdale identifiés."),
      visualAssets: pending("Ressources illustrées Wuxia / Chanbara non livrées ni auditées."),
      ruleConformance: pending("Moteur et tests de jeu futur non livrés ; règles Regicide à préserver."),
      bilingualExperience: pending("Parcours de jeu FR/EN non livré."),
      offlineExperience: pending("Jeu non encore intégré au build PWA hors ligne."),
    },
  },
};

export const RELEASE_CRITERIA: readonly ReleaseCriterion[] = [
  "adaptationPermission","permissionScope","publicTitle","attribution",
  "visualAssets","ruleConformance","bilingualExperience","offlineExperience",
] as const;

/** Every green criterion must have its own non-placeholder review reference. */
export function checkGamePublication(record: GameReleaseRecord): Readonly<{
  allowed: boolean;
  missing: readonly ReleaseCriterion[];
  invalidEvidence: readonly ReleaseCriterion[];
}> {
  const invalidEvidence = RELEASE_CRITERIA.filter(key=>{
    const entry=record.criteria[key];
    return entry.verified && (!entry.reference || !/^https:\/\//.test(entry.reference) || !entry.note.trim());
  });
  const missing = RELEASE_CRITERIA.filter(key=>!record.criteria[key].verified);
  return { allowed: missing.length===0 && invalidEvidence.length===0, missing, invalidEvidence };
}

export function assertCatalogueReleaseSafety(
  catalogue: readonly { id: GameId; title: string; status: string; playableRoute: string | null }[],
  evidence: Readonly<Record<GameId, GameReleaseRecord>> = GAME_RELEASE_EVIDENCE,
): void {
  const unique=new Set<GameId>();
  for(const game of catalogue){
    if(unique.has(game.id))throw new Error("Duplicate game ID in release catalogue: "+game.id);
    unique.add(game.id);
    const record=evidence[game.id];
    if(!record || record.publicName!==game.title) throw new Error("Unreviewed game name: "+game.id);
    const check=checkGamePublication(record);
    if(game.status==="available" && (!check.allowed || !game.playableRoute))
      throw new Error("Publication blocked for "+game.title+": "+
        [...check.missing,...check.invalidEvidence].join(", "));
  }
  for(const id of Object.keys(evidence))if(!unique.has(id as GameId))
    throw new Error("Orphan release evidence entry: "+id);
}

export function publicationReadyCount(): number {
  return Object.values(GAME_RELEASE_EVIDENCE).filter(record=>checkGamePublication(record).allowed).length;
}
