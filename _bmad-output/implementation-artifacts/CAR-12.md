# CAR-12 — Adaptateur IndexedDB et transactions locales

**Agent :** Amelia (BMAD) · **Date :** 23 novembre 2026 · **Epic :** CAR-2  
**État :** code publié sur `main`, tests locaux exécutés, **CI et test navigateur réel non attestés**.

## Références

- [Jira CAR-12](https://lmn24.atlassian.net/browse/CAR-12)
- [Architecture Winston (AD-04/10/11)](../planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md)

## Implémentation

- `src/ports/local-storage.ts` : port `LocalGameStorage` indépendant du navigateur, types `SavedGame`, `GameResult`, `GameStatistics` et `GameCommit`, erreurs `LocalStorageError` classées en indisponibilité, erreur de lecture et erreur d'écriture.
- `src/adapters/indexeddb-game-storage.ts` : base IndexedDB `cardforge` (version 1), trois object stores `sessions`, `results`, `statistics` et méthodes de lecture. L'appel `commit` ouvre **une seule transaction `readwrite` couvrant les trois magasins** et ne signale le succès qu'à l'événement `transaction.oncomplete`. Une erreur de clonage, d'écriture ou un abort rejette la promesse ; aucun accusé de succès anticipé.
- `tests/indexeddb-game-storage.test.mjs` : simulateur IndexedDB avec transactions asynchrones et écriture différée, permettant de tester commit, lecture, indépendance des parties, rollback et erreurs.
- L'orchestrateur `GameSession` en mémoire n'est pas encore câblé directement au stockage : liaison métier, commandes sérialisées et autosave relèvent de **CAR-13** ; versionnement/migrations approfondis relèvent de CAR-16. Aucune modification des moteurs de règles.

## Critères d'acceptation

| AC | Vérification |
| --- | --- |
| AC1 — Port et adaptateur IndexedDB | Contrat agnostique `LocalGameStorage` et adaptation native Web, sans accès stockage par le moteur |
| AC2 — Une transaction pour état, résultat et statistiques | `db.transaction(['sessions','results','statistics'],'readwrite')` ; résolution à `oncomplete` |
| AC3 — Échec forcé : rollback et erreur sans faux succès | Test avec `DataCloneError` simulée lors du **troisième put**, après staging des premières écritures : erreur `write-failed`, état initial et statistiques inchangés, aucun nouveau résultat |

## Preuves réellement exécutées

- Vérification TypeScript `tsc -p tsconfig.json` dans une copie de travail contenant le socle antérieur et les nouveaux modules : **PASS**. Compiler TypeScript disponible dans l'environnement (5.8.3), différent du `~5.7.3` déclaré par le dépôt.
- `node --experimental-strip-types --test tests/indexeddb-game-storage.test.mjs` : **7/7 PASS** sous Node 22.16.0.
- Régression locale des suites disponibles CAR-10, CAR-11 et CAR-12 : `node --experimental-strip-types --test tests/*.test.mjs` : **26/26 PASS**. **Ce n'est pas la suite globale du dépôt**, car les tests CAR-8/CAR-9 n'étaient pas tous disponibles dans la copie locale.
- Les trois fichiers ont été lus sur `main` via GitHub après publication.
- Tentative d'exécution d'un scénario dans Chromium headless : **échec par dépassement de délai**. Les tests d'atomicité attestés sont **sur un simulateur transactionnel**, non sur IndexedDB réel dans un navigateur.
- **Non exécuté/attesté :** `npm run build` Web complet, vérification navigateur réelle, GitHub Actions verte. Aucun script `uv` exécuté conformément à la contrainte du projet. Le skill `bmad-build` nécessitant `uv`, ses étapes ont été adaptées manuellement.

## Prochaines vérifications et suite

1. Exécuter la suite globale et le build sur la CI GitHub du commit publié ; vérifier les journaux.
2. Confirmer l'atomicité, le rollback et la durabilité sur un véritable IndexedDB Web/PWA avant validation finale de CAR-12.
3. Poursuivre par **CAR-13** pour l'orchestration des sauvegardes après action confirmée et la reprise exacte par `gameId`.
