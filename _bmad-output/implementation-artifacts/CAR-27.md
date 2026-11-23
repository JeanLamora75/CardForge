# CAR-27 — Thunderfighter : recherche pas-à-pas d'une figure

**Agent :** Amelia — Senior Software Engineer (BMAD)  
**Date :** 23 novembre 2026 · **Story :** CAR-27 / S20  
**Livraison :** moteur et tests publiés sur `main`. CI native réussie sur commit de tests ; UI/navigation et navigateur réel restant à valider.

## Références
- [Jira CAR-27](https://lmn24.atlassian.net/browse/CAR-27)
- [Règles Mary — Gridcannon V2, GC-06/09/10/11/12/18/19](../planning-artifacts/game-rules/gridcannon.md)
- [CAR-25 — recherche et actions spéciales](CAR-25.md)
- [CAR-26 — impasses](CAR-26.md)
- [CI #45251931200](https://github.com/JeanLamora75/CardForge/actions/runs/45251931200), commit `d1c0c10f1a3f9db5a30317d8ca75233c85685e2a`.

## Développement

- Le moteur `src/games/gridcannon/engine.ts` possédait déjà la phase `searching`, la commande explicite `draw-search`, le lot physique ordonné `searchBuffer` et l'action `place-figure`. CAR-27 **réutilise** ces comportements sans les réécrire : une action tire exactement une carte ; une numérique rejoint le lot sans être posée ; un As/Joker rejoint la réserve immédiatement, sans activation ni second tirage ; une figure impose un placement explicite. Les actions spéciales restent disponibles entre les tirages.
- **GC-18** : aucune action `draw-card` ou `place-number` ordinaire n'est autorisée pendant la recherche. `getLegalActions` propose `draw-search` uniquement tant que le dessus du paquet existe et que l'état est valide ; `placing-figure` interrompt le tirage jusqu'à confirmation.
- **GC-19** : nouvel accès en lecture seule `getSearchPresentation(state)` retournant `visible`, `revealedNumerics`, `nextCardAvailable`, `specialActionsAvailable` et `integrityStatus`. La liste visible ne contient que les numériques **déjà révélées**, dans l'ordre premier → dernier. Elle reste affichée pendant la validation de la position de la nouvelle figure. Après ce placement, le moteur remet le lot sous la pioche dans son ordre de rencontre, vide `searchBuffer` et masque cette vue. La fonction **n'expose jamais `drawPile` ni la carte cachée suivante**. Le rendu effectif du composant UX est à raccorder ultérieurement.
- **GC-12** : `diagnoseSearchIntegrity(state)` inspecte sans mutation les 12 identifiants physiques de figures dans les emplacements extérieurs, les figures en attente et la pioche ; retourne `status: ok|pending-placement|invalid`, les erreurs de validation et les listes de figures réellement absentes ou dupliquées, sans divulguer le futur ordre du paquet. Un placement de figure déjà révélé est reconnu comme une **opération en cours**, pas une disparition.
- La validation `validateState` rejette explicitement une phase de recherche après les douze figures vaincues ou sans aucune figure encore présente en pioche. En cas d'état incohérent, `getLegalActions` retourne zéro action et `transition` refuse le tirage sans toucher au snapshot, aux statistiques ou à l'issue de la partie. **Aucune victoire, défaite, abandon ni restauration automatique n'est inventé**.
- **Persistance :** les champs `phase`, `searchBuffer`, `pendingFigures`, `placingFromSearch`, `drawPile`, `specialReserve` et `spentSpecials` existent dans l'état sérialisable. Une reprise depuis JSON conserve exactement les décisions possibles et ne déclenche aucun tirage supplémentaire.
- Les nouveaux helpers ne créent aucune deuxième copie persistée du lot ; le seul inventaire physique reste `searchBuffer`.

## Critères d'acceptation

| AC | Couverture |
| --- | --- |
| AC1 — Carte suivante explicite, une carte par action, reprise GC-06/18 | Tests de tirage unitaire, refus de `draw-card`, reprise JSON et interdiction de second tirage pendant la pose de figure |
| AC2 — Numériques écartées visibles et réinsérées GC-10/19 ; As/Jokers GC-09 | Tests de séquence numérique/As/numérique/Joker/numérique/figure, ordre du lot, réserve, Extraction volontaire, réinsertion seulement après placement, disparition de la vue |
| AC3 — Diagnostic GC-12 sans issue inventée | Tests de figure manquante, doublon physique, phase de recherche après douze figures déjà vaincues, opération de pose en cours et refus de toute mutation |

## Preuves vérifiées

- `tests/thunderfighter-search-cycle.test.mjs` : **10 nouveaux scénarios**.
- Première CI du code (avant nouveaux tests) : [#45251656274](https://github.com/JeanLamora75/CardForge/actions/runs/45251656274) **success**.
- Première CI avec tests [#45251801643](https://github.com/JeanLamora75/CardForge/actions/runs/45251801643) : **192/193 réussis** ; le dernier test attendait un diagnostic « figure future manquante » tout en présentant un état avec douze figures déjà vaincues. Correction de l'assertion pour vérifier le diagnostic correct « recherche après douze figures vaincues », sans affaiblir la validation.
- **CI native finale [#45251931200](https://github.com/JeanLamora75/CardForge/actions/runs/45251931200)** sur `d1c0c10f1a3f9db5a30317d8ca75233c85685e2a` : **193 tests, 193 pass, 0 fail** selon les logs ; job `web`, étapes `Unit tests` et `TypeScript and Web build` **success**, run `completed/success`. Il s'agit bien du commit source + tests corrigés.
- Aucun script BMAD `uv` exécuté ; les étapes compatibles ont été suivies manuellement avec GitHub/Jira et la CI du projet.

## Limites et recommandations

- **Pas de composant d'interface utilisateur livré ici** : `getSearchPresentation` fournit le contrat de visibilité, mais l'affichage du panneau « Cartes temporairement écartées » et l'action clavier/tactile « Carte suivante » restent à développer et tester sur navigateur réel.
- Diagnostic **non mutateur** uniquement : la décision de proposer explicitement une ancienne sauvegarde valide, si elle existe et est vérifiée, appartient au flux de récupération/erreur de la plateforme. Ne jamais prétendre à une sauvegarde de secours garantie.
- Les tests réels de restauration IndexedDB multi-onglets, l'accessibilité mobile et les tests E2E ne sont pas attestés par la seule CI Node.
- Les décisions de progression manuelle GC-18 et d'affichage GC-19 sont des **conventions CardForge validées**, pas des citations attribuées à Tom Francis.
