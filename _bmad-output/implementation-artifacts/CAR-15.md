# CAR-15 — Nouvelle partie confirmée, abandon distinct de défaite

**Agent :** Amelia · **Date :** 23 novembre 2026 · **Epic :** CAR-2  
**État :** contrat applicatif, transaction de remplacement et tests publiés sur `main`. Contrôles locaux exécutés ; intégration à un écran de jeu et CI GitHub non attestées.

## Références

- [Story Jira CAR-15](https://lmn24.atlassian.net/browse/CAR-15)
- [Architecture Winston AD-04/10/11](../planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md)
- [CAR-14 : résultats et comptage idempotent](CAR-14.md)

## Choix techniques et livrables

- `src/application/new-game-choice.ts` : `getNewGameChoice(storage, gameId)` retourne soit `start`, soit `confirmation-required` avec l'identifiant de session actuellement sauvegardée. `confirmNewGame(..., choice, confirmed)` ne réalise **aucune écriture** si `confirmed=false`. Aucune fermeture d'écran, déconnexion ou changement de jeu n'appelle ce service.
- `src/ports/local-storage.ts` : ajout de `replaceGame({ expectedSessionId, replacement })` et retour typé `replaced-abandoned | replaced-finished`. L'identité du résultat de l'ancienne partie utilise `stableResultId(gameId, sessionId)`.
- `src/adapters/indexeddb-game-storage.ts` : remplacement **atomique** de la sauvegarde du jeu, enregistrement de l'abandon et incrément des compteurs dans **une transaction `readwrite`** couvrant `sessions`, `results`, `statistics`. Elle compare l'identifiant de la session actuellement stockée avec `expectedSessionId` avant tout remplacement ; une confirmation répétée ou périmée est refusée. Si l'ancienne session a déjà un résultat terminal, la nouvelle partie remplace la sauvegarde **sans nouvel abandon**. Un échec de transaction laisse les trois magasins inchangés.
- La méthode historique `commit` est renforcée pour rejeter les écritures d'une session dont le `sessionId` n'est plus celui de la session durable : une ancienne instance ne peut pas écraser la nouvelle partie.
- `tests/indexeddb-game-storage.test.mjs` : **8 scénarios de CAR-15** ajoutés, couvrant annulation, confirmation, idempotence, rollback/retry, conservation de l'autre jeu, écriture obsolète, partie déjà terminée et première partie sans abandon.

## Critères d'acceptation et couverture

| AC | État |
| --- | --- |
| AC1 — Si une partie existe, Nouvelle partie propose Annuler ou Confirmer ; Annuler ne modifie rien | **Service prêt** : `confirmation-required`, `confirmed=false` sans effet ; **liaison à la modale React non encore réalisée** (écran de jeu à venir) |
| AC2 — Confirmer remplace atomiquement la partie du jeu et compte un abandon, non une défaite | Implémenté dans `replaceGame` avec comparaison de session, transaction unique, résultat `abandoned`, statistiques et rollback |
| AC3 — Quitter, fermer ou jouer à l'autre jeu ne compte jamais un abandon | Aucune action automatique sur navigation/fermeture ; tests annulation et indépendance des jeux. Parcours UI à vérifier lorsque les écrans existeront |

## Tests et preuves

- Dans le conteneur local `/mnt/data/cardforge-car15` : `node --experimental-strip-types --test tests/*.test.mjs` → **48/48 PASS**, dont 8 scénarios CAR-15. Cela regroupe les suites localement disponibles (certaines réparties différemment dans le dépôt) et **ne constitue pas une exécution de la CI sur le commit publié**.
- `tsc --noEmit --target ES2022 --module ESNext --moduleResolution bundler --allowImportingTsExtensions --strict src/core/*.ts src/ports/*.ts src/adapters/*.ts src/application/*.ts` → **PASS**, TypeScript présent dans le conteneur.
- Quatre fichiers publiés sur `main` et relus via connecteur GitHub : port, adaptateur, service et tests.
- **Non attestés :** `npm run build` intégral, CI GitHub Actions, tests de vrais navigateurs IndexedDB, intégration UI, usage à deux onglets sous authentique ordonnanceur IndexedDB.
- Script BMAD `uv` **non exécuté** ; les étapes ont été adaptées manuellement selon les contraintes du projet.

## Suite

- **CAR-16** : sauvegardes versionnées et migrations ; conserver les anciennes données en cas de version incompatible.
- **Intégration UI ultérieure** : lors du développement du plateau et de l'écran Nouvelle partie, brancher la modale `Annuler / Confirmer` sur `getNewGameChoice` et `confirmNewGame`, ajouter la recette E2E ; ne pas présenter CAR-15 comme intégralement validée tant que l'AC1 UI ne l'est pas.
