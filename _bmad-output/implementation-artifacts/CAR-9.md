# CAR-9 — Contrat TypeScript minimal pour moteurs indépendants

**Agent :** Amelia — Senior Software Engineer (BMAD)  
**Date :** 23 novembre 2026  
**Périmètre :** CAR-9 / S02, Epic CAR-1  
**État :** implémentation publiée sur `main` ; tests locaux passés ; validation CI distante non attestée.

## Références

- [Story Jira CAR-9](https://lmn24.atlassian.net/browse/CAR-9)
- [Architecture Winston AD-02/AD-03](../planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md)
- [Modèle de cartes de CAR-8](https://github.com/JeanLamora75/CardForge/blob/main/src/core/cards.ts)

## Livrables

- `src/core/game-engine.ts` : `GameEngine<State, Action, Setup>`, issue, validation et résultats de transition typés. Moteurs libres de définir leurs propres phases, actions et règles.
- `src/application/game-session.ts` : `createGameSession()`, façade d'orchestration synchrone **en mémoire**, sans interprétation de règles, avec contrôle de l'état initial et de chaque transition acceptée. Aucun stockage n'est prétendu : la persistance sera introduite par CAR-12/CAR-13.
- `tests/game-engine.test.mjs` : deux moteurs factices à phases distinctes utilisent la même façade ; actions illégales sans changement d'état ; rejet de l'état invalide ; état d'entrée non muté.

## Correspondance aux critères d'acceptation

| Critère | Preuve |
| --- | --- |
| AC1 — Contrat initialisation, coups légaux, action, résultat, validation ; types propres à chaque moteur | Interface générique `GameEngine<State, Action, Setup>` |
| AC2 — Deux moteurs à phases différentes, même orchestrateur sans branche métier | Test « two mock engines with different phases use the same game session » |
| AC3 — Action illégale sans altération de l'état précédent | Test « an illegal action preserves the exact previous state instance » |

## Contrôles réellement exécutés

- Test d'échec initial (red) : `node --experimental-strip-types --test tests/game-engine.test.mjs` échoue tant que le module est absent.
- Tests après implémentation (green) : `node --experimental-strip-types --test tests/*.test.mjs` → **11 tests réussis sur 11**, dont 6 précédents de CAR-8 et 5 nouveaux.
- Vérification TypeScript ciblée : `tsc --noEmit --target ES2022 --module ESNext --moduleResolution bundler --allowImportingTsExtensions --strict src/core/cards.ts src/core/game-engine.ts src/application/game-session.ts` → **succès**.
- Vérification des trois fichiers publiés via le connecteur GitHub : **succès**.
- **Non attesté :** `npm run build` complet de l'application, CI GitHub Actions sur le dernier commit, tests navigateurs et persistance. Le conteneur de travail ne peut pas accéder à GitHub par `git clone` (résolution DNS), d'où l'emploi du connecteur GitHub.

## Décisions et limitations

- Aucun système de phases partagé, de pouvoir d'enseigne ou d'effet Joker n'est implémenté par le socle.
- L'orchestrateur en mémoire ne sérialise pas encore des commandes asynchrones et ne persiste rien ; ce sera traité dans les Stories applicatives/IndexedDB.
- Le workflow BMAD `bmad-build` exige un script `uv`, **non exécutable dans cet environnement** ; adaptation manuelle documentée sans prétendre avoir exécuté ce script.
- Aucune nouvelle dépendance npm, aucune modification d'identifiants de jeux ou de règles.
