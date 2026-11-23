# CAR-14 — Issue de partie et statistiques transactionnelles idempotentes

**Agent :** Amelia (BMAD) · **Date :** 23 novembre 2026 · **Epic :** CAR-2  
**Statut :** implémentation publiée sur `main`, tests locaux ciblés validés ; CI distante et test IndexedDB réel en navigateur encore non attestés.

## Références

- [Jira CAR-14](https://lmn24.atlassian.net/browse/CAR-14)
- [Architecture Winston AD-04/10/11](../planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md)
- [CAR-12, port et adaptateur IndexedDB](../../src/adapters/indexeddb-game-storage.ts)
- [CAR-13, session persistante](../../src/application/persistent-game-session.ts)

## Solution implémentée

- `src/ports/local-storage.ts` : `stableResultId(gameId, sessionId)`, basé sur un tuple sérialisé sans collisions de séparateurs ; contrat `commitTerminal` atomique avec résultat `recorded | already-recorded`.
- `src/adapters/indexeddb-game-storage.ts` : `commitTerminal` ouvre **une transaction `readwrite` sur `sessions`, `results`, `statistics`**. Il vérifie dans cette même transaction l'identifiant du résultat, l'existence d'un doublon et l'identité de session active. Pour un nouveau résultat, il lit les statistiques courantes et en déduit les nouveaux compteurs, puis écrit la sauvegarde, le résultat via `add` et les statistiques. Une erreur fait échouer l'ensemble ; aucun succès avant `tx.oncomplete`. Un doublon identique ne réécrit aucun compteur ; un doublon contradictoire est rejeté.
- `src/application/persistent-game-session.ts` : une transition passant de `in-progress` à `win`, `loss` ou `abandoned` appelle `commitTerminal`. Une partie déjà terminée refuse de nouvelles actions. En cas de résultat déjà enregistré depuis une autre instance, la session relit l'état durable plutôt que présenter l'état candidat comme sauvegardé.
- `tests/indexeddb-game-storage.test.mjs` : six tests ajoutés au simulateur existant : victoire atomique, double clic et reprise, doublon explicite, défaite/abandon et séparation des jeux, rollback et nouvel essai, rejet d'une session périmée.

## Critères d'acceptation

| Critère | Réalisation |
| --- | --- |
| AC1 — Identifiant stable, résultat et compteurs transactionnels | `stableResultId`, transaction IndexedDB `sessions/results/statistics` unique ; calcul des compteurs dans la transaction |
| AC2 — Double action, reprise et rechargement sans double compteur | Garde `in-progress` dans la session, déduplication transactionnelle et récupération sur `already-recorded` ; tests ciblés |
| AC3 — Échec de stockage sans corruption et nouvel essai | Abort explicite, statut `error`, état durable inchangé, tests de rollback sur troisième écriture et retry |

## Vérifications réellement exécutées

- **Tests ciblés CAR-14 : 6/6 PASS**, sous Node.js 22.16.0, avec un **simulateur asynchrone IndexedDB**, pas un navigateur réel.
- **Régression locale sur cinq fichiers de tests disponibles dans le conteneur : 40/40 PASS** (`node --experimental-strip-types --test tests/*.test.mjs`) ; cela ne constitue **pas la preuve de la suite globale GitHub**, certains fichiers antérieurs n'étant pas présents dans cette copie de travail.
- **Compilation ciblée TypeScript : PASS**, commande `tsc --noEmit --target ES2022 --module ESNext --moduleResolution bundler --allowImportingTsExtensions --strict` sur les modules `src/core/*.ts`, le port, l'adaptateur et les services concernés (TypeScript disponible localement 5.8.3).
- Les quatre fichiers source/tests modifiés ont été relus via le connecteur GitHub sur `main`.
- **Non attestés :** `npm run build` Web complet, CI GitHub Actions verte (aucun statut fourni par le contrôle de commit), véritable navigateur IndexedDB, concurrence de deux onglets réels et conformité des moteurs de règles réels.
- Les scripts `uv` du workflow BMAD ne sont pas exécutables dans cet environnement ; travail adapté directement aux outils GitHub et au conteneur de tests.

## Limites et suite

Le contrat historique `commit({ save, result, statistics })` issu de CAR-12 subsiste pour compatibilité ; **les clôtures de parties utilisent exclusivement `commitTerminal`** afin que l'idempotence soit vérifiée dans la transaction. L'intégration et les tests sur un vrai navigateur restent obligatoires avant clôture définitive.

**Prochaine Story : CAR-15**, nouvelle partie confirmée et abandon distinct d'une défaite.
