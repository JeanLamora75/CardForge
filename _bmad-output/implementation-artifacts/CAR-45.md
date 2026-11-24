# CAR-45 — Midnight Syndicate : initialisation et validation d'état

**Story Jira :** [CAR-45](https://lmn24.atlassian.net/browse/CAR-45) — Epic [CAR-44](https://lmn24.atlassian.net/browse/CAR-44)  
**Implémentation :** Amelia — 24 novembre 2026  
**Référentiel normatif :** [Mary — Loot the Loop](../planning-artifacts/game-rules/loot-the-loop.md), LTL-T01, LTL-T02, LTL-T19  
**Architecture :** AD-02/03/05/06 — moteur indépendant, actions typées, hasard injecté et identités uniques.

## Réalisation

- `src/games/loot-the-loop/engine.ts` : moteur autonome `midnightSyndicateEngine`, identifiant stable `loot-the-loop`, version de règles `isaludo-beta-1.11`, interface `GameEngine` commune.
- `createInitialState({seed})` mélange via `createSeededRandom` et `shuffle` exactement **52 cartes standards + le seul `joker-1`**. Aucune carte n'est initialement révélée ; `notes` et `loot` sont vides ; état `in-progress`.
- Modélisation de chaque carte par `{id,faceUp}`, préservant un identifiant stable et une orientation liée à la carte lors de la future rotation du paquet.
- `getLegalActions` retourne **`[{type:'look-around'}]` dans l'état initial**. Le traitement d'Observer est **explicitement réservé à CAR-46**, de même que les explorations, chemins, résultats et impasses des Stories suivantes. `transition` refuse pour l'instant une action sans modifier l'état ; **CAR-45 ne prétend pas rendre le jeu jouable**.
- `validateState` vérifie version, phase, issue, structure stricte des zones, identifiants du jeu, cartes uniques, total **53/53**, absence du deuxième Joker, visibilité booléenne, notes numériques visibles limitées à trois, butin d'As/numériques visibles, et cohérence d'une victoire.
- `tests/midnight-syndicate-start.test.mjs` : six tests dédiés à l'initialisation, à la seule action initiale, au déterminisme du mélange, aux refus immuables, aux doublons/omissions/second Joker et aux états ou paramètres invalides.

## Critères d'acceptation

| Critère | Réalisation | Preuve |
| --- | --- | --- |
| AC1 — 53 cartes 52+1, toutes cachées, notes/butin vides, seed déterministe | Code ajouté | LTL-T01, test de reproductibilité |
| AC2 — seule action initiale Observer, sans révélation préalable | Code ajouté | LTL-T02, actions légales |
| AC3 — validateur contre pertes, doublons, mauvais Joker/face/zones | Code ajouté | LTL-T19, batteries de cas négatifs |

## Limites et suite

CAR-46 implémentera l'effet **Observer** ; CAR-47 à CAR-50 couvriront Explorer, les notes, les issues et l'inspection. Ne pas confondre une action **offerte au départ** et une transition déjà opérationnelle. L'interface, les sauvegardes et le catalogue sont volontairement inchangés sur CAR-45.

La confidentialité des cartes cachées à l'affichage relève de CAR-50 et CAR-53 ; l'intégrité des cartes est ici vérifiée uniquement dans l'état métier interne. La publication reste bloquée par [CAR-43](https://lmn24.atlassian.net/browse/CAR-43).

## Validation technique

Les tests ont été **publiés avant l'implémentation** (CI rouge attendue), puis le moteur a été publié et une CI complète a été déclenchée. **CI complète vérifiée : [GitHub Actions #45346496676](https://github.com/JeanLamora75/CardForge/actions/runs/45346496676), commit de code `1ff977409f915a8033cdd14d872c49ced5079e7b` : 325 tests Node réussis sur 325, aucun échec ; audits des matrices Mary, build Web/Vite, contrôle PWA de 8 ressources, recette Chromium IndexedDB, quatre parcours E2E de production FR/EN clavier/tactile avec reprise hors ligne, et les deux jobs `web` et `Web MVP quality gate (no publication)` réussis. Les six tests CAR-45 sont inclus dans cette exécution.** Aucun script `uv` exécuté ; aucune validation locale ou navigateur supplémentaire revendiquée.

