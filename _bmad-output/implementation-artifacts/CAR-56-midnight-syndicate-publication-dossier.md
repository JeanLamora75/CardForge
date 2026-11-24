# CAR-56 — Dossier de publication Midnight Syndicate

Date : 24 novembre 2026
Responsable : Amelia — développement (adaptation du workflow BMAD 6.12.4 dans ChatGPT).
Jira : CAR-56, dépendances CAR-43, CAR-54, CAR-55.
Décision : préversion interne uniquement ; diffusion publique interdite.

## Identité et périmètre

- Midnight Syndicate, d’après Loot the Loop, Wil Su (Isaludo), Beta 1.11.
- Identifiant stable : loot-the-loop.
- Web responsive / PWA, gratuit et sans publicité ; Android/iOS hors périmètre.
- Catalogue : coming-soon ; playableRoute null. Le plateau interne n'est pas une autorisation de mise en production.
- Référentiel : [Mary](../planning-artifacts/game-rules/loot-the-loop.md).

## Registre des preuves et réserves

| Critère CAR-43 | État | Preuve disponible ou action restante |
| --- | --- | --- |
| adaptationPermission | Bloqué | Aucun accord vérifié ; ne pas inférer une licence de la disponibilité des règles. |
| permissionScope | Bloqué | Vérifier portée Web/PWA, gratuité, territoire, durée, adaptation et crédits. |
| publicTitle | Bloqué | Nom produit approuvé ; disponibilité juridique non examinée. |
| attribution | Implémenté | Catalogue et crédits FR/EN : d’après Loot the Loop, Wil Su (Isaludo). |
| visualAssets | Bloqué | Habillage provisoire ; inventaire de provenance et licences des illustrations, icônes, sons et polices à examiner. |
| ruleConformance | En attente de validation complète | Tests métier LTL et propriétés présents ; revue sémantique et E2E terminal/statistiques à compléter. |
| bilingualExperience | En attente de preuve détaillée | Ressources FR/EN et parcours clavier/tactile intégrés. |
| offlineExperience | En attente de preuve détaillée | Reprise hors ligne intégrée au script E2E ; journaux à examiner. |

## Preuve CI historique

Capture fournie par le porteur du projet : CardForge Web tests #308, succès, main, 58 secondes, commit [ee2e4b4](https://github.com/JeanLamora75/CardForge/commit/ee2e4b44b4c320d327a4432c1a1bc766a7423005). Cette observation porte uniquement sur ce commit CAR-55 ; aucun identifiant de run numérique ni journal détaillé récupéré via le connecteur. Murat a émis un GO conditionnel pour préparer CAR-56, pas une autorisation de diffusion. Les changements CAR-56 exigent une nouvelle CI ; aucune exécution revendiquée dans ce dossier.

## Contrôles automatiques

- src/application/publication-gate.ts : critères indépendants, pièces non vérifiées bloquantes.
- scripts/audit-publication-gate.mjs : audit interne non bloquant si catalogue sûr ; --require-midnight-publication refuse le jeu sans preuves complètes.
- tests/publication-gate.test.mjs : refus de promotion et de publication explicite du troisième jeu.
- npm run release:check : garde MVP existante et contrôle de sûreté du catalogue.
- Vérifier les résultats GitHub Actions sur un seul commit final avant clôture technique.

## Conditions de sortie

1. Murat : obtenir les résultats détaillés de la CI et lever les réserves CAR-55, notamment partie terminée et statistiques uniques sur build de production.
2. Mary : examiner la fidélité des cas limites et des oracles métier.
3. Porteur de projet : faire vérifier les droits nécessaires, le nom, les licences et le périmètre de diffusion. Ne conserver publiquement que des références non sensibles vers des preuves effectivement examinées.
4. Mettre à jour le registre uniquement avec des preuves vérifiées.
5. Obtenir une validation humaine explicite et un déploiement contrôlé avant de changer le statut public.

Aucun justificatif juridique inventé, aucun déploiement public, aucun changement Jira. Skill BMAD dev-story inaccessible au chemin interrogé ; configuration BMM 6.12.4 lue, aucun script uv exécuté. Aucune recherche Web externe réalisée.
