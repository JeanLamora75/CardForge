# CAR-16 — Sauvegardes versionnées et migrations non destructives

**Agent :** Amelia — Senior Software Engineer (BMAD)  
**Date :** 23 novembre 2026  
**Epic :** CAR-2 · **Story :** CAR-16 / S09  
**Statut :** code et tests publiés sur `main` ; tests locaux et TypeScript exécutés ; CI GitHub / IndexedDB navigateur réel non attestés.

## Sources

- [Jira CAR-16](https://lmn24.atlassian.net/browse/CAR-16)
- [Architecture Winston AD-09 / AD-11](../planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md)
- [CAR-13 — Reprise](CAR-13.md), [CAR-15 — Nouvelle partie](CAR-15.md)

## Solution

- **Enveloppe existante conservée :** `SavedGame` contient `gameId`, `sessionId`, `formatVersion`, `rulesVersion` et l'état ordonné complet ; le modèle des cartes et les moteurs restent indépendants du stockage. Une version des **règles** différente n'est jamais convertie implicitement par une migration de **format**.
- **`src/application/save-migrations.ts` :** `migrateAndResumeGame` valide l'enveloppe, identifie une chaîne **explicitement enregistrée** de migrations `n → n+1`, la calcule **sans écrire**, puis valide l'état final avec le moteur spécifique au jeu. Version inconnue, future, chemin absent, règles incompatibles, état invalide, migration échouée : sauvegarde originale préservée et erreur catégorisée (`SaveMigrationError` : `corrupt`, `incompatible`, `migration-failed`, `storage-failed`). Une sauvegarde déjà conforme est reprise sans nouvelle écriture ni tirage.
- **`src/ports/local-storage.ts` :** port `migrateGame({ previous, migrated })` explicite ; comparaison de version et `sessionId`, aucune mutation directe du domaine.
- **`src/adapters/indexeddb-game-storage.ts` :** compare-and-swap sous transaction IndexedDB `readwrite` sur le magasin `sessions`. Le contenu actuel est relu **dans la transaction**, comparé à l'instantané initial, puis remplacé uniquement si inchangé ; succès à `oncomplete`. Abort, quota, clone impossible et écriture concurrente préservent la version durable précédente. Comparaison JSON de l'instantané : les états persistés doivent rester des données JSON compatibles, documenter cette restriction avant introduction de types de données non JSON.
- Les migrations effectives propres aux jeux seront enregistrées **seulement lorsqu'un changement de format réel sera introduit**. Les tests utilisent deux migrations factices de formats 1→2→3 ; elles ne sont pas appliquées aux sauvegardes de production par défaut. L'UI qui affiche les erreurs localisées reste à raccorder avec les futurs écrans.

## Couverture des critères d'acceptation

| Critère | Couverture |
| --- | --- |
| AC1 — Enveloppe identifiée, versions format/règles, état complet et restauration validée | `SavedGame` existant + `isSaveEnvelope`, `validateState` puis `resumePersistentGame` |
| AC2 — Migration connue atomique ; inconnue/incompatible/corrompue préservée | Chaîne explicite de migrations, validation avant commit, transaction CAS, refus sans écriture |
| AC3 — Stockage plein/échec : signaler l'échec, retenter sans perdre l'original | `SaveMigrationError('storage-failed')`, transaction rollback, tests de quota et retry ; affichage UI non encore raccordé |

## Contrôles réellement exécutés

- Node **22.16.0** : `node --experimental-strip-types --test tests/*.test.mjs` dans une copie locale rassemblant les suites CAR-10 à CAR-16 : **58/58 PASS**. Comprend **7 nouveaux tests de migrations** et **3 nouveaux tests de la transaction IndexedDB simulée**. Cette copie locale n'est **pas la preuve d'une CI exécutée sur le commit GitHub** et diffère du découpage exact des tests présent sur `main`.
- TypeScript **5.8.3** : `tsc --noEmit --target ES2022 --module ESNext --moduleResolution bundler --allowImportingTsExtensions --strict src/core/*.ts src/ports/*.ts src/adapters/*.ts src/application/*.ts` : **PASS** dans la copie locale.
- Un échec initial a été détecté : le **parameter property** d'une classe `Error` ne fonctionnait pas avec `--experimental-strip-types` de Node 22. Correction publiée et retestée.
- Fichiers publiés et relus depuis le dépôt GitHub `main` après écriture.
- **Non attestés :** tests dans le vrai IndexedDB d'un navigateur, build Web complet `npm run build`, statut vert de GitHub Actions et recette UI d'affichage des erreurs. Aucun `uv` exécuté : le workflow BMAD `bmad-build` n'est pas directement exécutable dans ce contexte.

## Limites et suites

- Avant l'acceptation finale, vérifier le rollback sous un authentique IndexedDB Web/PWA et la résistance à des mises à jour concurrentes en plusieurs onglets.
- Au moment de la première évolution concrète du format, fournir les migrations versionnées **spécifiques au jeu** et des jeux de données historiques de référence.
- Les erreurs sont exposées à la couche applicative ; l'interface de migration, de retry et des messages localisés seront branchés aux futurs écrans.
- Ne pas clôturer CAR-16 en Jira tant que la CI distante et la validation navigateur ne sont pas confirmées.
