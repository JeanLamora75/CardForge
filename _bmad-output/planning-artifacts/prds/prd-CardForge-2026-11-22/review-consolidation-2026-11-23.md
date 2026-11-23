# Revue documentaire — Consolidation du PRD CardForge v0.3

**John — Product Manager BMAD**  
**Date :** 23 novembre 2026  
**Statut :** revue manuelle, non équivalente à un Reviewer Gate automatisé.

## Sources confrontées

- [PRD v0.3](./prd.md) et [journal des décisions](./.memlog.md) ;
- [Relais Winston](../../architecture/architecture-CardForge-2026-11-22/HANDOFF-JOHN-2026-11-23.md) et [architecture AD-01 à AD-12](../../architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md) ;
- [Clear the Dungeon](../../game-rules/clear-the-dungeon.md) : décisions CTD-ARB-01 à 14, joker 10 ;
- [Gridcannon V2](../../game-rules/gridcannon.md) : audit final de Mary §68, GC-01 à GC-53, GC-54 reporté ;
- [Card Capture](../../game-rules/card-capture.md), [Loot the Loop](../../game-rules/loot-the-loop.md), [Regicide / Les Douze Tyrans](../../game-rules/regicide.md) : présence documentaire et limites hors MVP.

## Contrôles et résultats

| Critère | Résultat |
| --- | --- |
| MVP conservé à deux moteurs jouables Web/PWA | Conforme au périmètre validé |
| Les arbitrages CTD/GC clos ne sont pas redemandés | État de référence corrigé ; compléments historiques préservés explicitement |
| Contrat commun, moteurs indépendants (AD-02 option B) | Ratification reprise dans PRD et addendum ; détails TypeScript non imposés |
| Identité physique de chaque carte, Jokers compris (AD-05 option B) | Contrat observable et intégrité/reprise explicités |
| IndexedDB transactionnel Web/PWA (AD-04 option B) | Atomicité et idempotence dans les exigences ; compatibilité Android/iOS à tester |
| Règles versus conventions de CardForge | Séparées ; aucune conformité exécutable présumée |
| Autres jeux hors MVP | Documentés, Les Douze Tyrans/Grèce antique validés pour l'identité produit ; Bastion Stellaire provisoire |
| FR/EN, hors ligne, dix langues à terme | Maintenus, sans surcharge du MVP |
| Création de tickets Jira | Non effectuée, validation préalable requise |

## Réserves

- Le PRD comporte volontairement des compléments historiques longs : **ne pas utiliser les mentions anciennes « ouvert » et « prochaine décision » comme état courant**. La synthèse en tête et les documents Mary actualisés font foi.
- Les documents présentent des décisions de comportement CardForge parfois distinctes de formulations explicites des auteurs. Vérification de fidélité, droits et tests réels sont nécessaires avant publication.
- Les cibles de performance mesurables, la granularité de suppression des données et le détail d'implémentation des contrats restent à préciser sans rouvrir le cadrage des règles.
- Aucun script `uv`, build, test moteur, essai IndexedDB WebView, reviewer indépendant ou vérification externe des versions n'a été exécuté.

## Verdict

**PRD consolidé pour revue produit et préparation du découpage BMAD en Epics/User Stories.** Ce statut ne signifie ni approbation finale du porteur sur l'ensemble du PRD, ni conformité des moteurs, ni autorisation de créer des tickets Jira. La prochaine étape proposée à John est de préparer des Stories fines, indépendantes et testables, puis de solliciter une validation avant toute publication dans Jira CAR.
