# CAR-17 — Grim Delve : démarrer une partie Classic 1.1.0

**Agent :** Amelia — Senior Software Engineer (BMAD)  
**Date :** 23 novembre 2026  
**Story :** CAR-17 / S10, Epic CAR-3  
**État :** moteur initial et tests publiés sur `main` ; tests locaux vérifiés, CI distante non attestée ; jeu non encore jouable intégralement.

## Références faisant foi
- [Jira CAR-17](https://lmn24.atlassian.net/browse/CAR-17)
- [Règles Mary — Clear the Dungeon Classic 1.1.0](../planning-artifacts/game-rules/clear-the-dungeon.md)
- [Matrice CTD](../planning-artifacts/clear-the-dungeon-rule-test-matrix.md)
- [Architecture Winston](../planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md)

## Livraison
- `src/games/clear-the-dungeon/engine.ts` : `grimDelveEngine` conforme à `GameEngine<State, Action, Setup>` ; `gameId` technique inchangé `clear-the-dungeon` ; règles identifiées `classic-1.1.0`.
- Composition : les 12 figures J/Q/K sont séparées puis mélangées en **quatre colonnes ordonnées de trois monstres**, le premier de chaque colonne est visible. Les 40 cartes A–10 et **deux Jokers physiques distincts** constituent une pioche de 42 cartes, dont trois sont distribuées dans la main initiale (39 restent en pioche).
- Même graine `seed` ⇒ même distribution et même ordre. Un état sérialisable conserve les colonnes, cartes visibles, pioche, main, dégâts, cartes retirées et vaincues, numéro de main, phase et issue.
- Aucun choix Advanced ni réserve facultative ; les options supplémentaires sont rejetées au démarrage.
- Actions de début de jeu : défausse **explicite** depuis la main vers les dégâts, refus de nouvelle pioche avec main non vide, clôture explicite de main vide, pioche ordonnée de trois cartes maximum et défaite immédiate au septième dégât. Transition pure et validation des 54 identifiants.
- **Important : les actions de pose, attaque partielle et résolution ne sont pas encore implémentées dans CAR-17** ; elles relèvent de CAR-18 et des Stories de moteur suivantes. Le moteur peut initialiser, sauvegarder et valider une partie, mais **pas encore permettre une victoire jouable**. Cette restriction est explicite ; aucun substitut inventé n'est exposé comme une règle de jeu complète.
- `tests/grim-delve-start.test.mjs` : dix tests comportementaux de la mise en place et des actions initiales.

## Couverture Jira
| Critère | Preuve |
| --- | --- |
| AC1 — 54 cartes, deux Jokers, monstres et pioche ordonnée sans doublon | 12 figures / 42 cartes de puissance ; 4 × 3 ; main 3 / pioche 39 ; identifiants contrôlés |
| AC2 — Classic 1.1.0 sans réserve et sans Advanced | Constante `GRIM_DELVE_RULES_VERSION` ; configuration réduite à `seed` ; refus des options supplémentaires |
| AC3 — Premières phases et actions légales issues du moteur | `phase: attack`, `getLegalActions`, `transition` sans règle UI ; seules défausse et clôture sont actives avant CAR-18 |

## Preuves exécutées
- Démarche test-first : première exécution des tests ciblés échoue, module absent ; création du moteur ; correction d'un contrôle de type TypeScript sur `visibleMonsters`.
- `node --experimental-strip-types --test tests/grim-delve-start.test.mjs` : **10/10 PASS**.
- `node --experimental-strip-types --test tests/*.test.mjs` dans `/mnt/data/cardforge-car17` : **68/68 PASS** (copie de travail reprenant les suites disponibles depuis CAR-10 à CAR-16 + 10 nouvelles). Ce n'est **pas** une exécution de tous les tests distants de GitHub ni de la CI.
- TypeScript strict (Node 22.16.0, tsc 5.8.3 disponible) : `tsc --noEmit --target ES2022 --module ESNext --moduleResolution bundler --allowImportingTsExtensions --strict src/core/*.ts src/ports/*.ts src/adapters/*.ts src/application/*.ts src/games/clear-the-dungeon/*.ts` → **PASS**.
- Source et tests **publiés puis lus sur `main`** par connecteur GitHub.
- **Non attestés :** build Vite complet, CI GitHub Actions sur le commit, navigateur réel, gameplay complet de Grim Delve, tests de toutes les décisions CTD. Le connecteur n'a pas donné accès à la liste des runs CI ; ne pas en inférer de succès.
- Workflow BMAD `bmad-build` exige `uv` indisponible sur GitHub ; les contrôles ont été exécutés manuellement sans prétendre lancer ce script.

## Suite
**CAR-18** — attaques partielles, repositionnements et verrouillage. Étendre l'état avec affectations par monstre et gérer les cartes engagées de plusieurs mains ; compléter les tests des cas CTD correspondants avant de revendiquer le jeu entièrement jouable.
