# CAR-11 — Validation des états et conservation des cartes

**Agent :** Amelia — Senior Software Engineer (BMAD)  
**Date :** 23 novembre 2026  
**Statut :** implémentation publiée sur `main` ; tests ciblés exécutés ; build global et CI distante non attestés.

## Sources et contraintes

- [Jira CAR-11](https://lmn24.atlassian.net/browse/CAR-11)
- [Architecture AD-05/09/11](../planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md)
- [CAR-8 : cartes physiques](../../src/core/cards.ts)
- [CAR-9 : contrat moteur](../../src/core/game-engine.ts)

## Livrables

- `src/core/card-state-validation.ts` : validation des 54 identifiants physiques répartis dans les zones ; distinction des anomalies par codes `schema`, `duplicate`, `missing`, `unknown-card`, `zone`, `phase`. Les zones et phases acceptées sont **fournies par le jeu**, jamais figées dans un moteur commun.
- `src/application/game-session.ts` : fonction `restoreGameSession(engine, savedState)` validant l'état avant copie et utilisation. Une entrée rejetée n'est ni réparée ni effacée ; cette fonction ne réalise aucune écriture IndexedDB (réservée à CAR-12/CAR-13).
- `tests/card-state-validation.test.mjs` : deux modèles factices (Grim Delve et Thunderfighter), conservant les 54 cartes dans des zones et phases distinctes ; rejets schéma/duplicate/missing/unknown-card/zone/phase, transitions illégales et chargement refusé pour sauvegarde corrompue.

## Critères d'acceptation

| Critère | Éléments de preuve |
| --- | --- |
| AC1 — Schéma, doublons, absences, zone impossible selon le jeu | `validateCardZones(state, rules)` et tests paramétrés avec deux jeux |
| AC2 — État invalide non chargé, données existantes non effacées | `restoreGameSession` rejette l'entrée avant installation ; vérification de non-mutation de l'objet source. L'absence d'effacement durable doit encore être testée avec IndexedDB lors de CAR-12/13. |
| AC3 — 54 identités et transitions illégales pour les deux modèles | 13 tests ciblés exécutés, dont scénarios spécifiques à chacun des deux modèles factices |

## Exécution et limites

- `node --experimental-strip-types --test tests/card-state-validation.test.mjs` : **13/13 PASS**.
- `tsc --noEmit --target ES2022 --module ESNext --moduleResolution bundler --allowImportingTsExtensions --strict src/core/cards.ts src/core/card-state-validation.ts src/core/game-engine.ts src/application/game-session.ts` : **PASS**.
- Les trois fichiers publiés ont été relus sur `main` à l'aide du connecteur GitHub.
- **Non exécutés dans cette livraison :** `npm test` global, `npm run build` complet, CI GitHub Actions, tests IndexedDB, vrais moteurs de Grim Delve et Thunderfighter. Les zones/phases des deux tests sont représentatives, et **ne prétendent pas implémenter les vraies règles**.
- **BMAD :** le skill `bmad-build` appelle `uv`, non exécutable dans cet environnement GitHub ; lecture et adaptation manuelles des exigences sans prétendre avoir lancé le script.

## Suite

La prochaine Story est **CAR-12 — Adaptateur IndexedDB et transactions locales**. Les validations avancées du contenu d'état des vrais moteurs s'ajouteront avec leurs Stories et la reprise réelle avec CAR-13.
