# CAR-41 — Correctifs Amelia : intégration sauvegardes, migrations, résultats

**Date :** 24 novembre 2026. **Story :** [CAR-41](https://lmn24.atlassian.net/browse/CAR-41).  
**Déclencheur :** [première revue de Murat](../test-artifacts/test-review/test-review-story-CAR-41.md).  
**Branche de code :** `main` — tests et application publiés par connecteur GitHub, aucun script `uv`.

## Livraisons techniques

### QA-41-01 — Transactions IndexedDB réalistes

- `fake-indexeddb` ajouté **aux dépendances de développement uniquement**.
- `tests/indexeddb-real-integration.test.mjs` exerce un `IDBFactory` conforme à l'API IndexedDB et l'**adaptateur réel** `createIndexedDbGameStorage`, sur deux connexions, sauvegardes distinctes, reprise exacte, succès terminal, résultat/score, statistiques, déduplication, abandon et migration.
- Test de rollback via une **vraie erreur asynchrone IndexedDB `ConstraintError`** sur `objectStore.add` : les modifications préalablement mises en file dans `sessions` et `statistics` sont annulées avec le résultat en conflit. Une erreur de clonage `DataCloneError` de migration conserve l'ancienne sauvegarde et permet la reprise.
- En complément, `scripts/test-indexeddb-browser.mjs` utilise **Chromium lancé par Playwright** sur le serveur Vite local, donc le moteur IndexedDB réel du navigateur et non son simulateur. Il teste la fermeture puis réouverture de l'onglet, la reprise exacte des deux jeux, l'exécution concurrente du même résultat terminal depuis **deux onglets**, le résultat/statistique enregistré une seule fois et l'isolement de l'autre jeu.

### QA-41-02 — Reprise et migrations explicites reliées aux écrans

- `src/application/registered-save-migrations.ts` centralise les chaînes de migrations de format **autorisées par jeu**, actuellement vides car les deux formats publics restent à `formatVersion: 1`. **Aucune migration implicite n'est inventée** et les règles du jeu ne sont pas converties.
- `GrimDelveBoard` et `ThunderfighterBoard` utilisent `resumeRegisteredGame`, qui passe par `migrateAndResumeGame`. Une incompatibilité ou une chaîne de format absente bloque la reprise sans effacement de l'enregistrement.
- Test de vraie migration 1→2 **déclarée uniquement dans les tests**, sur un état de Grim Delve valide et l'IndexedDB de test ; l'autre jeu n'est pas modifié. Il ne s'agit **pas** d'une promesse de migration 1→2 publiée dans l'application.

### QA-41-03 — Erreurs de quota et récupération responsable

- `src/application/storage-recovery-messages.ts` identifie les causes racines `QuotaExceededError`, les sauvegardes incompatibles, la corruption, l'impossibilité de migrer et le stockage indisponible. Messages distincts FR/EN et sans promesse de restauration non prouvée.
- Les deux plateaux affichent la raison diagnostiquée lors du chargement, de la création et de la sauvegarde de mouvements au lieu d'un unique message générique.
- `tests/storage-recovery-messages.test.mjs` vérifie les causes imbriquées de quota, les messages et la politique de migration par jeu.
- **Correctif additionnel du vrai adaptateur :** lors d’une exception synchrone `QuotaExceededError` pendant un `put`, `src/adapters/indexeddb-game-storage.ts` conserve désormais la `cause` de l’annulation de transaction. `tests/indexeddb-game-storage.test.mjs` confirme l’annulation, l’intégrité des trois collections, le diagnostic `quota` et un nouvel essai réussi.
- La recette Chromium étend le contrôle à l'**interface utilisateur visible** pour une sauvegarde incompatible avec les règles courantes : message affiché, ancien enregistrement conservé.
- **Limite :** l'épuisement réel du quota disque du navigateur n'a pas été provoqué : la classification des erreurs de quota est couverte par des exceptions simulées et des causes imbriquées, non par une saturation physique.

### QA-41-04 — Deux vrais moteurs, résultat et concurrence

- Les tests relancent les modules réels `grimDelveEngine` et `thunderfighterEngine`, conservent leurs états complets de 54 cartes et testent la fin de partie et le score via l'adaptateur IndexedDB.
- **Correctif détecté par les tests :** `grimDelveEngine` expose maintenant `getVictoryScore`, déjà calculé dans son état terminal. Sans cet accès, l'événement durable de victoire ne contenait pas le score. **Les règles et valeurs du jeu restent identiques.**
- Les tests en navigateur couvrent une concurrence réelle entre onglets ; la recette ne prétend pas couvrir toutes les courses possibles en cas de fermeture forcée pendant une écriture.

## Critères d'acceptation

| AC | Évaluation technique |
| --- | --- |
| AC1 — deux jeux / fermeture et reprise / rollback / migration incompatible | **Couvert sur l'API IndexedDB de test et en Chromium réel** ; la migration incompatible est aussi contrôlée sur l'état durable ; la migration de format explicitement enregistrée reste un scénario de test et non un format publié. |
| AC2 — concurrence / abandon / résultats statistiques uniques | **Couvert** en simulateur asynchrone, IndexedDB de test et test multi-onglets Chromium. |
| AC3 — erreur de migration et stockage plein préservent les données et informent le joueur | **Couvert pour les erreurs simulées et la migration incompatible rendue visible en Chromium**, avec réserve sur le quota physique non saturé. |

## Vérification CI et limites

Workflow `.github/workflows/cardforge-tests.yml` : `npm test`, installation de Chromium via Playwright, `npm run test:browser`, audit strict des matrices Mary, build TypeScript/Vite, contrôle des ressources hors ligne.

CI de référence **à remplacer après vérification du dernier commit de code**. La revue de Murat doit se prononcer **après** vérification de toutes les étapes sur un même commit.

**Limites de recette :** essais réels sur Chrome/Firefox/Edge utilisateur et vrai disque plein restent une validation complémentaire. L'exécution GitHub Actions utilise un navigateur Chromium réel dans son runner, **pas** une session sur l'ordinateur Windows de l'utilisateur.

**Jira :** aucune modification du statut sans validation explicite de l'utilisateur.
