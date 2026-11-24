# Murat — Revue QA de CAR-41 : sauvegardes, migrations et résultats

**Date :** 24 novembre 2026  
**Story Jira :** [CAR-41 — Tests d'intégration des sauvegardes, migrations et résultats](https://lmn24.atlassian.net/browse/CAR-41)  
**Rôle BMAD :** Murat / Quality Engineer, conformément au skill `.agents/skills/bmad-agent-qa/SKILL.md`  
**Périmètre de l'audit :** code et tests de `main`, critères CAR-41, preuves CI disponibles. **Aucun nouveau test navigateur ni script `uv` exécuté**.

## Verdict QA : CONCERNS — revue réalisée, CAR-41 non validée pour clôture

Le socle possède des protections transactionnelles testées et des scénarios de reprise. Néanmoins, les critères de CAR-41 visent explicitement des **tests d'intégration IndexedDB**, des scénarios de **stockage plein / migration incompatible** et une information correcte au joueur. La suite utilise essentiellement un simulateur IndexedDB en mémoire ; les tests de migration s'appuient sur un stockage `Map` factice ; les écrans n'utilisent pas le mécanisme de migration. Ces écarts empêchent de conclure à une couverture intégrée de bout en bout.

**Preuve CI de référence :** [GitHub Actions #45336289565](https://github.com/JeanLamora75/CardForge/actions/runs/45336289565) — **303 tests réussis, 0 échec**, build et contrôle PWA. Cette CI est celle du dernier commit de **code** testé lors du travail CAR-40 ; **aucun test supplémentaire CAR-41 n'a été exécuté dans la présente revue**. Elle atteste les scénarios existants, pas leur exécution sur IndexedDB d'un vrai navigateur ni sur panne réelle.

## Évaluation des critères

| Critère Jira | Résultat | Preuve et limite |
| --- | --- | --- |
| AC1 — Deux jeux, fermeture/reprise, échec transactionnel, migration incompatible | **PARTIEL** | `tests/indexeddb-game-storage.test.mjs` teste deux identifiants de jeu et des transactions simulées ; `tests/persistent-game-session.test.mjs` teste une reprise avec stockage mémoire ; `tests/save-migrations.test.mjs` teste une incompatibilité, mais **pas à travers l'IndexedDB effectif et les vrais moteurs joués dans les écrans**. |
| AC2 — Double action terminale, abandon, résultats et statistiques une seule fois | **PARTIEL, fondations solides** | Des tests concurrents dans une même session, idempotence des événements, conflits et remplacements sont présents et verts. L'isolation réelle entre deux onglets, une coupure en cours de transaction et une actualisation de page entre deux opérations ne sont pas démontrées dans un navigateur réel. |
| AC3 — Migration/stockage plein : ancienne donnée conservée, bonne information utilisateur | **PARTIEL / BLOQUANT** | Tests de conservation et erreur `storage-failed` sur stub ; le stockage plein est émulé par une exception nommée `QuotaExceededError`. Les composants affichent un message générique de lecture/sauvegarde, mais **ne branchent pas le parcours de migration** et ne prouvent pas un message spécifique adapté à un stockage plein ni le chemin de récupération d'une sauvegarde incompatible. |

## Constats détaillés

### QA-41-01 — P1 : preuve IndexedDB insuffisamment réaliste

**Fichiers :** [`tests/indexeddb-game-storage.test.mjs`](https://github.com/JeanLamora75/CardForge/blob/main/tests/indexeddb-game-storage.test.mjs#L11-L104) et [`src/adapters/indexeddb-game-storage.ts`](https://github.com/JeanLamora75/CardForge/blob/main/src/adapters/indexeddb-game-storage.ts).

Le constructeur `makeFactory()` produit un simulateur qui stocke des `Map`, échelonne les requêtes au moyen de `setTimeout` et publie les écritures à `tx.oncomplete`. Il rend possible de bons tests du contrat applicatif, mais il **ne prouve pas** le comportement réel des transactions IndexedDB (auto-commit, événements d'échec, stockage bloqué, versions, quotas et concurrences). Aucune dépendance `fake-indexeddb` ni test navigateur réel ne figure dans cette suite, d'après les fichiers consultés.

**Demandé à Amelia :** ajouter des tests d'intégration sur IndexedDB standards (par ex. environnement IndexedDB conforme de test et, pour les cas impossibles à simuler fidèlement, test navigateur Playwright/Chromium sur une origine stable) ; conserver le simulateur pour les tests unitaires rapides. Vérifier également un rollback asynchrone causé par une requête réelle, pas seulement une exception JavaScript simulée.

### QA-41-02 — P1 : migration testée indépendamment, non câblée aux écrans

**Fichiers :** [`src/application/save-migrations.ts`](https://github.com/JeanLamora75/CardForge/blob/main/src/application/save-migrations.ts) ; [`src/components/GrimDelveBoard.tsx`](https://github.com/JeanLamora75/CardForge/blob/main/src/components/GrimDelveBoard.tsx#L59-L80) ; [`src/components/ThunderfighterBoard.tsx`](https://github.com/JeanLamora75/CardForge/blob/main/src/components/ThunderfighterBoard.tsx#L96-L118).

`migrateAndResumeGame()` propose une chaîne explicite de migration de **format** et refuse les évolutions non enregistrées. Pourtant les deux écrans appellent `resumePersistentGame()` directement. Une sauvegarde avec format évolué et migration connue échoue donc dans l'interface plutôt que de déclencher la migration, tandis que le mécanisme migratoire ne peut être validé en parcours intégré. **Ne pas créer de migrations implicites ou de changement de règles pour masquer ce défaut.**

**Demandé à Amelia :** définir, pour chaque jeu, une politique versionnée de migrations *explicites* et l'intégrer au chemin de reprise, ou exposer un blocage contrôlé tant qu'aucune migration enregistrée n'est disponible ; tester le chemin réel UI → migration → reprise.

### QA-41-03 — P1 : quota et erreur de restauration non différenciés auprès du joueur

**Fichiers :** [`tests/save-migrations.test.mjs#L86-L96`](https://github.com/JeanLamora75/CardForge/blob/main/tests/save-migrations.test.mjs#L86-L96) ; interfaces des deux plateaux ; [`src/ports/local-storage.ts`](https://github.com/JeanLamora75/CardForge/blob/main/src/ports/local-storage.ts).

Le cas « stockage plein » est provoqué par `throw Error('QuotaExceededError')` dans une implémentation factice. Le code de migration transforme l'exception en code générique `storage-failed`, tandis que les composants attrapent les erreurs sans différencier leur cause et affichent des messages génériques. La conservation de la sauvegarde est testée au niveau du stub mais **ni l'origine réelle du quota ni l'affichage du message approprié** ne sont prouvés.

**Demandé à Amelia :** assurer un typage et une propagation des erreurs préservant le diagnostic de quota / migration incompatible / corruption, et des messages compréhensibles indiquant que la sauvegarde précédente reste récupérable. Tester UI et transaction réelles en échec, sans prétendre qu'une récupération est possible lorsqu'elle n'est pas démontrée.

### QA-41-04 — P2 : vérification des vrais moteurs et concurrence multi-onglets

**Fichiers :** [`tests/persistent-game-session.test.mjs`](https://github.com/JeanLamora75/CardForge/blob/main/tests/persistent-game-session.test.mjs), [`tests/indexeddb-game-storage.test.mjs`](https://github.com/JeanLamora75/CardForge/blob/main/tests/indexeddb-game-storage.test.mjs).

Les scénarios d'abandon et de double action terminale sont utiles ; une partie des tests emploie toutefois `terminalEngine()` (moteur synthétique) et un simulateur IndexedDB. Le test d'actions simultanées dans **une session** montre que la queue sérialise les commandes, mais ce n'est pas une preuve de compétition de **deux instances de l'application ou deux onglets**. La protection contre les sessions périmées est partiellement testée et mérite une campagne d'intégration sur les identifiants `clear-the-dungeon` et `gridcannon`.

**Demandé à Amelia :** compléter au moins un parcours de sauvegarde/reprise et un terminal pour chacun des deux moteurs réels, avec résultats/statistiques persistés, et un test de concurrence sur deux instances du stockage.

## Points positifs vérifiés

- Transaction sur les objets `sessions`, `results` et `statistics` pour les opérations terminales.
- Identifiant de résultat déterministe `stableResultId(gameId,sessionId)` ; test d'idempotence et de conflit.
- Comparaison de la session active avant commit terminal ; prévention des écritures d'une ancienne session après remplacement.
- Test de rollback, reprise après échec et statistiques d'abandon.
- `migrateAndResumeGame` refuse les chaînes incomplètes, incompatibles ou destructrices et conserve les données dans ses tests unitaires.

## Recommandations de contre-recette Murat

1. **Amelia :** bâtir des tests d'intégration IndexedDB plus proches du comportement du navigateur, avec vrais moteurs et preuves de fermeture/reprise et d'échec transactionnel.
2. **Amelia :** raccorder l'entrée des écrans au service de migration (sans migration implicite) et couvrir les erreurs de quota et sauvegarde incompatible avec des messages testés.
3. **Murat :** contrôler la suite sur un même commit GitHub Actions, puis réaliser/revoir une recette multi-onglets et stockage inaccessible sur navigateur réel lorsque l'outillage le permet.
4. **PO :** ne pas clore CAR-41 avant résolution des constats P1. Aucune création/modification Jira entreprise pendant cette revue.

## Décision QA

**CAR-41 = CONCERNS / NON VALIDÉE fonctionnellement.**  
Niveau de confiance : **élevé** pour l'existence et les limites des tests examinés ; **modéré** pour l'exhaustivité des écarts, faute de nouvelle exécution E2E en navigateur. La réussite de la CI existante ne vaut pas preuve de conformité de tous les critères de CAR-41.

**Adaptation BMAD :** revue séquentielle sur les connecteurs Jira/GitHub suivant le rôle Murat. Aucun lancement d'agent distant distinct ni de script `uv` ; ce rapport consigne la revue réellement effectuée.
