# CAR-20 — Grim Delve : défausses, dégâts et clôture explicite

**Agent :** Amelia — Senior Software Engineer (BMAD)  
**Date :** 23 novembre 2026 · **Epic :** CAR-3 · **Story :** CAR-20 / S13  
**État :** code et tests publiés sur `main` ; contrôles locaux validés ; CI GitHub et navigateur non attestés.

## Références
- [Jira CAR-20](https://lmn24.atlassian.net/browse/CAR-20)
- [Mary — règles Classic 1.1.0, arbitrages CTD-ARB-03/04/05/13/14](../planning-artifacts/game-rules/clear-the-dungeon.md)
- [Matrice CTD](../planning-artifacts/clear-the-dungeon-rule-test-matrix.md)
- [CAR-19](CAR-19.md)

## Développement
- `src/games/clear-the-dungeon/engine.ts` : ajout d'une action explicite `discard-remaining` disponible lorsque la main contient au moins une carte, sans paramètre additionnel autorisé. L'action défausse les cartes dans l'ordre **jusqu'au septième dégât inclus**, puis s'arrête immédiatement. Les cartes non consommées restent dans leur zone, y compris si la partie est désormais perdue. Les attaques partielles ne sont jamais défaussées automatiquement.
- Les actions existantes `discard`, `place-power`, `take-back`, `move-power`, `trigger-attack` restent alternables au cours de la main, sans imposer de phase irréversible de défausse.
- L'action existante `end-hand` reste **explicite**, uniquement si la main est vide ; elle verrouille les cartes provisoires en avançant `handNumber`, distribue les 1 à 3 dernières cartes dans l'ordre si la pioche en contient, ou applique la défaite d'épuisement si la pioche est vide et aucun monstre n'a été vaincu en dernier pour conclure la partie.
- Une main devenue vide sans confirmation reste ouverte : `take-back` reste possible avant `end-hand`, auquel cas la clôture redevient interdite tant que la main contient la carte récupérée.
- Une double validation `end-hand` sur un état déjà passé au tour suivant est rejetée : il n'existe pas de seconde distribution automatique. La sérialisation et l'orchestrateur persistant de CAR-13 restent inchangés.
- `tests/grim-delve-hand-closure.test.mjs` : **10 nouveaux tests** couvrant la défausse groupée, l'arrêt au septième dégât, l'alternance attaques/défausses, la récupération, la dernière main de une/deux cartes, l'épuisement à clôture et la non-duplication au double clic.

## Critères d'acceptation
| AC | Preuve |
| --- | --- |
| AC1 — Attaques et défausses alternables, défausse irréversible, 7e dégât = défaite | Tests CTD-T42/T44/T122/T123/T124/T125/T129, actions `discard` et `discard-remaining` |
| AC2 — Main vide toujours ouverte, reprise provisoire possible, clôture conditionnée à main vide | Test CTD-T131/T132, vérification des coups légaux et refus de `end-hand` après récupération |
| AC3 — Tirage 1–3 cartes après clôture, aucune double distribution | Tests CTD-T48/T49/T55/T57/T134/T136/T137/T140 ; reprise ordonnée et rejet du deuxième `end-hand` |

## Contrôles réellement exécutés
- Node.js 22.16.0 : `node --experimental-strip-types --test tests/*.test.mjs` dans la copie de travail locale `/mnt/data/cardforge-car17` → **102 tests réussis sur 102**, dont 10 nouveaux scénarios CAR-20.
- TypeScript 5.8.3 strict ciblé : `tsc --noEmit --target ES2022 --module ESNext --moduleResolution bundler --allowImportingTsExtensions --strict src/core/*.ts src/ports/*.ts src/adapters/*.ts src/application/*.ts src/games/clear-the-dungeon/*.ts` → **succès**.
- Un échec initial d'un test `finalHand(0)` provenait d'une erreur de préparation dans le test (sémantique JavaScript `slice(-0)`). La fixture a été corrigée et **la suite complète a été réexécutée en succès**. Ce n'était pas un défaut du moteur.
- Les deux fichiers publiés ont ensuite été **relus sur `main`** par le connecteur GitHub.
- **Non attestés :** tests exécutés directement sur le commit GitHub, `npm run build` complet, statut vert GitHub Actions, IndexedDB dans un vrai navigateur, intégration UI.
- Le script `uv` de `bmad-build` n'a pas été exécuté (non disponible dans l'environnement GitHub) ; adaptation manuelle des étapes.

## Limites et suite
- L'action moteur `discard-remaining` est prête à être reliée au bouton « Défausser les cartes restantes » lorsque l'UI de jeu existera. L'affichage préalable des conséquences de la défausse et de l'épuisement n'est **pas encore validé en UI**.
- Le mécanisme de journalisation de la **cause exacte de fin de partie** et du score officiel doit être vérifié dans les Stories ultérieures.
- Avant clôture Jira : valider build complet, CI du commit et parcours UI/navigateur réel.
