# CAR-28 — Thunderfighter : résultat, score et conservation des 54 cartes

**Agent :** Amelia — Senior Software Engineer (BMAD)  
**Date :** 23 novembre 2026 · **Story :** CAR-28 / S21  
**État :** code et tests publiés sur `main` ; tests unitaires et build TypeScript/Web vérifiés dans GitHub Actions sur le commit final.

## Sources

- [Jira CAR-28](https://lmn24.atlassian.net/browse/CAR-28)
- [Règles Mary — Gridcannon V2, GC-08/12/20 et audit §68](../planning-artifacts/game-rules/gridcannon.md)
- [CAR-27 — recherche et diagnostic](CAR-27.md)
- [GitHub Actions #45255450951](https://github.com/JeanLamora75/CardForge/actions/runs/45255450951), commit `56d00088229f52867da7831615be142d102e6a3e`

## Développement

- `src/games/gridcannon/engine.ts` : `getThunderfighterResult(state)` renvoie une projection **en lecture seule**, validée par `validateState` : `outcome`, `reason` (`victory`, `armor`, `stalemate` ou `null`), `officialScore`, nombre de figures vaincues et nombre de cartes physiques dans toutes les zones. Une projection d'état corrompu est refusée. Une défaite et une partie en cours n'ont jamais de score de victoire.
- **AC1 — issue réglementaire** : la victoire ne peut être validée que si les **12 figures physiques** sont vaincues ; un état en cours ou perdu comportant déjà 12 figures vaincues est rejeté. La victoire immédiate issue d'un tir simultané demeure celle de CAR-24, sans nouvelle transition manuelle. Les défaites `armor` et `stalemate` sont distinctes ; un résultat `armor` doit être étayé par au moins une résistance au seuil de J/D ≥ 20 ou Roi ≥ 19. Les parties terminées n'offrent aucune action.
- **AC2 — score GC-08** : le score officiel est `specialReserve.length` **au moment de la victoire**, uniquement les As et Jokers encore disponibles. Un réapprovisionnement du paquet par Extraction ne donne aucun bonus ; l'As dépensé ne compte plus, même si sa pile de numériques revient en pioche. Score 0 accepté.
- **Persistance du score officiel** : `GameEngine.getVictoryScore?` est ajouté au contrat commun comme point d'extension facultatif, `GameResult.score?` au résultat durable. `PersistentGameSession` inclut le score lorsqu'un moteur en fournit un pour une **victoire**. Le stockage IndexedDB conserve naturellement ce champ dans le résultat terminal créé atomiquement avec la sauvegarde et les statistiques ; aucun changement de schéma ni migration n'est nécessaire. Les jeux qui ne fournissent pas ce point d'extension gardent leurs résultats historiques compatibles. Le moteur Thunderfighter expose `getVictoryScore`.
- **AC3 — conservation** : la validation déjà présente porte sur les **54 identifiants physiques distincts et connus** dans la grille, la pioche, la carte en attente, la file de figures, le lot numérique de recherche, les 12 cases extérieures, les armures, la réserve et les As/Jokers dépensés. Les tests renforcent les contrôles à chaque transition, sur les victoires, après Extraction, sur les états terminaux et sur une reprise. Duplications et disparitions sont refusées ; la validation ne déplace aucune carte.
- **Résultat unique** : l'ID terminal `stableResultId(gameId,sessionId)` et le mécanisme transactionnel/idempotent déjà livrés dans CAR-14 sont réutilisés. Un second `dispatch` après la victoire est rejeté et ne crée pas de résultat ni de score supplémentaire. Le test CAR-28 le vérifie avec un port mémoire et une restauration.

## Tests CAR-28

`tests/thunderfighter-results.test.mjs` — **8 nouveaux tests** :

1. Douzième figure vaincue et résultat score 2.
2. Extraction préalable puis victoire score 1 malgré le réapprovisionnement.
3. Victoire score 0 sans As/Joker restant.
4. Refus de victoire prématurée et de 12 figures vaincues en cours.
5. Refus de score modifié, d'identifiant perdu, dupliqué ou d'armure physique dupliquée.
6. Absence de score officiel sur une défaite, y compris état incohérent.
7. Conservation des 54 cartes à travers une séquence réelle de préparation et de jeu.
8. Persistance du score dans `GameResult`, une seule création de résultat terminal, reprise JSON et refus de seconde confirmation.

## Exécution et preuves

- Première CI des tests [#45255247052](https://github.com/JeanLamora75/CardForge/actions/runs/45255247052) : **200/201 tests réussis** ; un défaut de code a été trouvé dans la nouvelle validation d'armure, où le paramètre `value` masquait la fonction de rang. Corrigé en utilisant l'alias `rankOf` pour le contrôle.
- **CI finale [#45255450951](https://github.com/JeanLamora75/CardForge/actions/runs/45255450951)**, commit `56d00088229f52867da7831615be142d102e6a3e` : **201 tests, 201 PASS, 0 FAIL** ; `Unit tests` et `TypeScript and Web build` réussis, run `completed/success`. Les logs et étapes ont été consultés directement via GitHub Actions.
- Pas de script `uv` exécuté ; workflow BMAD appliqué manuellement avec les connecteurs GitHub/Jira et la CI réelle.

## Limites et suite

- **Rendu UI de résultat non développé ici** : la projection métier et le stockage sont prêts, mais l'écran de fin de partie et le score affiché doivent être raccordés et testés.
- Un test d'idempotence utilise un **stockage mémoire**. L'adaptateur IndexedDB réutilise sa transaction atomique existante ; ce changement n'a pas fait l'objet d'une nouvelle recette dans un navigateur réel ni de tests de concurrence multi-onglets.
- La qualification complète doit aussi couvrir les parcours tactiles/clavier, reprise de sauvegarde, corruption simulée côté navigateur et vérification des limites de performance de recherche d'impasse.
- Les décisions précisant la recherche, l'ordre et le diagnostic GC-08/12/20 relèvent des arbitrages CardForge. Elles ne doivent pas être présentées comme des citations littérales de Tom Francis.
