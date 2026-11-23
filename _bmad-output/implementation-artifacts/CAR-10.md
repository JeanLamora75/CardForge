# CAR-10 — Transitions pures et mélange reproductible

**Agent :** Amelia — Senior Software Engineer (BMAD)  
**Date :** 23 novembre 2026  
**Epic :** CAR-1 · Story CAR-10 / S03  
**État :** implémentation publiée sur `main`, tests ciblés exécutés et passés ; CI distante non attestée.

## Références

- [Jira CAR-10](https://lmn24.atlassian.net/browse/CAR-10)
- [Architecture Winston AD-03](../planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md)
- [Contrat de moteur CAR-9](../../src/core/game-engine.ts)

## Conception

Le socle reste indépendant des règles des jeux :
- `src/core/deterministic-deck.ts` : `createSeededRandom(seed)` (Mulberry32, seed entier uint32), `createSeededDeck(seed)` (54 cartes physiques), `snapshotDeckOrder(cards)` (ordre d'identifiants sérialisable), `restoreDeckOrder(ids)` (restauration sans RNG).
- `DECK_RANDOM_VERSION = 1` fige la version de l'algorithme déterministe afin de ne pas prétendre que toutes les générations futures de hasard seront rétrocompatibles.
- La **graine ne sert qu'à créer une nouvelle pioche** ; lors d'une reprise, l'ordre réellement sauvegardé est prioritaire. La sérialisation complète des parties relève des Stories CAR-13/16 ; l'intégrité générale des zones relève de CAR-11.
- Aucun changement aux identifiants de cartes de CAR-8, à `shuffle()` existant ni au contrat `GameEngine` de CAR-9.
- Les transitions métier demeurent spécifiques à chaque moteur et pures (AD-03) ; un moteur factice vérifie la même suite d'actions sur deux états identiques.

## Critères d'acceptation

| Critère | Couverture |
| --- | --- |
| AC1 — Source de hasard injectée et graine/ordre sérialisable | `shuffle(cards, random)` conservé ; `createSeededRandom` et `snapshotDeckOrder` ajoutés |
| AC2 — État/actions identiques → résultat identique, sans mutation de l'entrée | Test sur deux sessions et moteur factice ; état initial gelé |
| AC3 — Reprise sans remélange | `restoreDeckOrder`, test JSON et `Math.random` remplacé par une fonction levant une erreur lors de la restauration |

## Preuves exécutées dans le conteneur

- `node --experimental-strip-types --test tests/deterministic-deck.test.mjs` → **6 tests passés / 6**.
- `tsc --noEmit --target ES2022 --module ESNext --moduleResolution bundler --allowImportingTsExtensions --strict src/core/cards.ts src/core/deterministic-deck.ts src/core/game-engine.ts src/application/game-session.ts` → **succès**.
- Vérification de lecture des nouveaux fichiers sur `main` via le connecteur GitHub → **succès**.

**Non attestés :** `npm test` de tous les tests historiques dans le même dépôt local, `npm run build` complet, statut vert GitHub Actions, éventuels tests Web/PWA. Aucun script `uv` exécuté : le workflow BMAD a été adapté manuellement aux outils disponibles.

## Suite

- **CAR-11** : validation de schéma, des zones et conservation de toutes les identités.
- **CAR-13/16** : sauvegarde et migration de l'état complet des parties, y compris l'ordre de pioche.
