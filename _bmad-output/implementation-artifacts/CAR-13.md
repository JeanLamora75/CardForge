# CAR-13 — Sauvegarde après coup et reprise exacte par jeu

**Agent :** Amelia (BMAD) · **Date :** 23 novembre 2026 · **Epic :** CAR-2  
**Statut :** code publié sur `main` ; tests ciblés et TypeScript vérifiés ; régression globale / navigateur / CI distante non attestés.

## Références

- [Jira CAR-13](https://lmn24.atlassian.net/browse/CAR-13)
- [Architecture AD-03/04/09/10/11](../planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md)
- [Port de stockage CAR-12](../../src/ports/local-storage.ts)

## Implémentation

- `src/application/persistent-game-session.ts` : `startPersistentGame()` et `resumePersistentGame()` branchés sur le port `LocalGameStorage` existant ; une partie sauvegardée par `gameId`, avec `sessionId`, `formatVersion`, `rulesVersion` et état complet.
- `dispatch()` sérialise les commandes, valide la transition et attend `storage.commit()` avant de rendre l'état candidat visible comme sauvegardé. Les actions illégales ne déclenchent aucune écriture. En cas d'échec durable, l'ancien état reste affiché, `getSaveStatus()` expose `error`, l'erreur est rejetée et un nouvel essai reste possible.
- La reprise charge `saved.state` et ne rappelle pas `createInitialState` ni le hasard. Les tableaux ordonnés (cartes, zones), phases, réserves et choix temporaires sont conservés par copie structurée.
- Un début de nouvelle partie est refusé si une sauvegarde existe déjà pour le `gameId`. La gestion de remplacement explicite et l'abandon relèvent de CAR-15 ; versionnement et migrations approfondis de CAR-16. Le résultat terminal/statistiques reste pour CAR-14.
- `tests/persistent-game-session.test.mjs` : 8 tests comportementaux avec port mémoire asynchrone, validation de l'ordre des actions, erreurs injectées, indépendance entre deux jeux et reprise sans tirage.

## Critères d'acceptation

| AC | Preuve |
| --- | --- |
| AC1 — Une partie par `gameId`, stockage après action validée | `readGame(gameId)` avant création, `commit` initial et après chaque transition acceptée ; test de non-écrasement et deux jeux distincts |
| AC2 — Même état exact après redémarrage | `resumePersistentGame` ne réinitialise pas le moteur ; test des cartes dans l'ordre, de la phase, de la réserve et d'un choix temporaire |
| AC3 — « Enregistré » après écriture confirmée | `getSaveStatus(): saved/saving/error` ; test différant `commit` et vérifiant `saving` avant confirmation |

## Contrôles exécutés

- `node --experimental-strip-types --test tests/persistent-game-session.test.mjs` : **8/8 PASS**, Node 22.16.0.
- `tsc --noEmit --target ES2022 --module ESNext --moduleResolution bundler --allowImportingTsExtensions --strict src/core/game-engine.ts src/ports/local-storage.ts src/application/persistent-game-session.ts` : **PASS**, TypeScript 5.8.3.
- Sources et tests publiés sur la branche `main`, puis lus via le connecteur GitHub : **vérifiés**.
- **Non exécuté :** suite `npm test` globale du dépôt, build complet, navigateur réel et contrôle vert de la CI GitHub. Les 8 tests emploient un faux port mémoire, pas le navigateur/IndexedDB natif. Aucune exécution du script `uv` : le workflow BMAD est adapté aux outils connecteurs.

## Points à poursuivre

1. Vérifier la concurrence multi-onglets/multi-instances : la lecture préalable n'est pas un verrou atomique entre deux créateurs simultanés. À traiter avec un mécanisme de protection lors de l'intégration IndexedDB réelle.
2. Ajouter la transaction atomique résultats/statistiques à CAR-14, la confirmation d'abandon/remplacement à CAR-15 et les migrations à CAR-16.
3. Exécuter sur un même commit `npm test`, `npm run build` et des tests du véritable IndexedDB dans un navigateur avant clôture définitive.
