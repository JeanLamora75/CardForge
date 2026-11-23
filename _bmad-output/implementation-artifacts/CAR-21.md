# CAR-21 — Grim Delve : victoire, défaite, révélation et score

**Agent :** Amelia — Senior Software Engineer (BMAD)  
**Date :** 23 novembre 2026 · **Epic :** CAR-3 · **Story :** CAR-21 / S14  
**État :** code et tests publiés sur `main`, contrôles locaux exécutés ; CI GitHub, build complet et navigateur non attestés.

## Référentiels
- [Jira CAR-21](https://lmn24.atlassian.net/browse/CAR-21)
- [Règles Mary — CTD-ARB-05, CTD-ARB-06, CTD-ARB-12, CTD-ARB-13/14](../planning-artifacts/game-rules/clear-the-dungeon.md)
- [Matrice de conformité CTD](../planning-artifacts/clear-the-dungeon-rule-test-matrix.md)
- [CAR-20 — défausse et clôture](CAR-20.md)
- [CAR-14 — terminal idempotent](CAR-14.md)

## Livrables

- `src/games/clear-the-dungeon/engine.ts` : l'état `GrimDelveState` expose deux métadonnées sérialisables et facultatives pour préserver la compatibilité des sauvegardes précédentes : `endReason?: 'victory' | 'damage' | 'exhaustion' | null` et `victoryScore?: number | null`. Les nouvelles parties renseignent initialement `null`.
- Lorsque le **douzième monstre** est éliminé, `trigger-attack` produit immédiatement `outcome='win'`, `endReason='victory'` et **`victoryScore=state.drawPile.length`**, sans ajouter la main ou les attaques provisoires, sans clôture supplémentaire. Un score de **0** est valide.
- La défaite au **septième dégât** (individuel ou groupé) fixe `endReason='damage'` et `victoryScore=null`. La clôture explicite de la dernière main lorsque la pioche est vide fixe `endReason='exhaustion'`, sans score. Les issues terminales interdisent les nouvelles actions.
- Révélation du prochain monstre de la colonne immédiatement après élimination (déjà implémentée en CAR-18), avec conservation des attaques partielles sur les autres colonnes.
- `validateState` refuse un score qui ne correspond pas à la pioche d'une victoire, toute cause terminale incohérente et un score sur une partie en cours/perdue ; les sauvegardes historiques dont les champs étaient absents restent acceptables si les invariants précédents sont respectés. **Aucune migration forcée ni réécriture des anciennes sauvegardes**.
- `tests/grim-delve-endings.test.mjs` : **7 nouveaux scénarios exécutables**, incluant victoire au douzième monstre avec 5 cartes encore dans la pioche et une en main, victoire avec pioche vide et score 0, révélation, défaite à sept dégâts, défaite à clôture sur épuisement, rejet des métadonnées invalides, et reprise via `PersistentGameSession` avec une seule écriture terminale sous port mémoire.

## Couverture Jira

| Critère | Vérification |
| --- | --- |
| AC1 — 12e monstre = victoire immédiate, révélation après autres victoires locales | CTD-T114/T115/T56 et CTD-T62/T64, refus des actions après victoire |
| AC2 — 7e dégât immédiat, épuisement après clôture | CTD-T118/T119 et refus de double clôture |
| AC3 — Score = pioche seulement, enregistré une fois | CTD-T114/T115/T120, `victoryScore` figé dans l'état final et repris à l'identique ; persistance terminale idempotente CAR-14 sollicitée via CAR-13 |

## Preuves effectivement exécutées

- Copie locale `/mnt/data/cardforge-car21` avec le socle et moteur à jour : `node --experimental-strip-types --test tests/grim-delve-endings.test.mjs` → **7/7 PASS** (Node 22.16.0).
- `node --experimental-strip-types --test tests/*.test.mjs` → **109/109 PASS** sur **les suites disponibles dans la copie locale**, et non une preuve d'exécution de toute la CI GitHub.
- `tsc --noEmit --target ES2022 --module ESNext --moduleResolution bundler --allowImportingTsExtensions --strict src/core/*.ts src/ports/*.ts src/adapters/*.ts src/application/*.ts src/games/clear-the-dungeon/*.ts` → **PASS** (TypeScript 5.8.3).
- Les deux fichiers de code/test ont été publiés puis relus sur le dépôt `main` via GitHub.
- **Non attestés :** build Web complet, exécution de la suite sur le commit publié dans GitHub Actions, test navigateur IndexedDB réel, rendu UI du bilan, éventuelles migrations futures.
- Le scénario d'idempotence couvre l'orchestrateur persistant avec **un port mémoire**, pas une validation transactionnelle navigateur ; CAR-14 possède les tests séparés de l'adaptateur.
- `uv` du workflow BMAD `bmad-build` n'a pas été exécuté ; seules les étapes manuelles applicables ont été suivies.

## Suite et réserves

- **La cohérence du score repose sur les nouvelles métadonnées de fin de partie**. Les anciennes sauvegardes dépourvues de score restent lisibles par compatibilité ; si elles portent déjà une victoire, le score n'est pas reconstruit arbitrairement.
- Les écrans de bilan devront afficher le score officiel uniquement en cas de victoire, distinguer les causes de défaite et ne jamais confondre score officiel et statistiques CardForge.
- Avant clôture Jira : valider le build, la CI, les tests sur vrai navigateur et la présentation UI. Le ticket reste `À faire` en attendant la qualification.
