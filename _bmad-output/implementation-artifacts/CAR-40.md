# CAR-40 — Tests unitaires exécutables du socle et des deux moteurs

**Amelia (BMAD) · 23 novembre 2026**  
Story : https://lmn24.atlassian.net/browse/CAR-40  
Statut : **code et garde de CI livrés ; recette sémantique finale des scénarios toujours recommandée avant déclaration de conformité réglementaire ou publication**.

## Critères d’acceptation et preuves

| Critère | Réalisation |
| --- | --- |
| AC1 — exécuter TypeScript au lieu de tester le texte source | La commande `npm test` exécute réellement les modules TypeScript de `src/core`, `src/games/clear-the-dungeon/engine.ts`, `src/games/gridcannon/engine.ts` par `node --experimental-strip-types --test`. `tests/matrix-engine-invariants.test.mjs` exécute **16 graines × jusqu’à 75 transitions légales par moteur** avec validation d’état, vérification de la conservation et unicité des 54 identifiants physiques, déterminisme et immutabilité. Les états corrompus et actions refusées sont également vérifiés par code. |
| AC2 — correspondance des matrices Mary, cas non applicable explicites | La CI exécute `npm run audit:rules`. L’auditeur `scripts/audit-rule-coverage.mjs` extrait les identifiants des matrices Mary et vérifie leur présence dans les **intitulés de tests exécutables**. Le mode strict `--require-complete` provoque une CI rouge si un identifiant n’est plus relié à un test. Matrices reconnues : **121 scénarios CTD-T** (dont l’historique et l’arbitrage de fin de partie), **35 scénarios GC-T** et **21 anciens scénarios T-** du premier tableau Mary. Des tests supplémentaires vérifient les cas détaillés et la non-applicabilité du scénario incohérent CTD-T116. Cette correspondance est une preuve de traçabilité syntaxique vers des tests effectivement exécutés, **pas une certification automatique de l’équivalence sémantique de chaque cas**. |
| AC3 — CI rouge si erreur | Toute assertion des scénarios, conservation des 54 identités, issue terminale, scores, invariants et sorties incorrectes provoque un code retour non nul à `npm test`. Un identifiant Mary non couvert provoque un code retour non nul à `npm run audit:rules`. `tests/rule-coverage-gate.test.mjs` démontre explicitement ce comportement avec une matrice synthétique dont un scénario supplémentaire provoque un échec. |

## Tests exécutables renforcés

- `tests/matrix-engine-invariants.test.mjs` : parcours déterministes multi-graines des deux jeux, sans mutation, contrôle du paquet de 54 cartes, actions illégales et états corrompus.
- `tests/thunderfighter-shots.test.mjs` : cas GC-T09/T10/T12 (11 contre Valet, 11 contre Dame 12, 13 contre Roi), autres tirs, double axe, couleurs et enseignes.
- `tests/thunderfighter-*.test.mjs` : liens de traçabilité aux 35 scénarios GC-T sur mise en place, attraction, tir, extraction As, réaffectation Joker, armure, recherche, impasse, score et résultat terminal.
- `tests/grim-delve-attack-rules.test.mjs` : seuils, joker fixe 10, choix de la puissance, interdiction de troisième puissance, joker d’une main antérieure avec joker déclencheur de la suivante, attaque en trois mains, tests numériques initiaux T-03, T-06, T-07.
- `tests/grim-delve-partial-attacks.test.mjs` : attaques simultanées, placement provisoire, modification avant clôture, verrouillage, persistance JSON, conservation des dégâts, révélation, colonne vide.
- `tests/grim-delve-endings.test.mjs` : dernière main à une carte, perte par épuisement, victoire après dégâts, score fondé sur les cartes restant dans la pioche, non-duplication terminale.
- `tests/grim-delve-start.test.mjs`, `tests/game-results.test.mjs`, `tests/deterministic-deck.test.mjs`, `tests/indexeddb-game-storage.test.mjs` : traçabilité des règles historiques et des invariants.

## Cas Mary historiquement incohérent : CTD-T116

La rédaction historique « douzième monstre vaincu, trois cartes affectées à d'autres attaques partielles » est incompatible avec les invariants du moteur : une attaque partielle ne peut cibler qu’un monstre **vivant et visible**. Après la victoire sur le douzième monstre, il ne subsiste aucun autre monstre vivant.

Un **test de non-applicabilité exécutable** rejette un état final dans lequel les cartes des attaques partielles sont réaffectées à des monstres déjà vaincus. Il démontre que les actions légales deviennent vides et que l’état est invalide, **sans adapter les règles pour rendre la situation artificiellement possible**.

Le constat technique est vérifié par test ; la requalification documentaire/PO du libellé de Mary peut encore être confirmée à l’occasion de la recette métier. Aucune suppression ou réécriture de la matrice Mary n’a été effectuée.

## Traçabilité et limites

Le script d’audit réalise un **rapprochement explicite d’identifiants dans les intitulés de tests** et prend en charge la notation groupée `CTD-T48/T49/T55`. La liste des identifiants non reconnus entraîne désormais un **échec de CI**. Cependant, un intitulé contenant un identifiant ne prouve pas, à lui seul, la validité de chaque assertion. La **revue sémantique de conformité aux règles originales** et l’E2E relèvent de la recette Murat/QA ; les cas historiques réinterprétés doivent être relus contre la version finale des décisions Mary.

Les fichiers de moteurs et règles n’ont pas été modifiés pour cette Story. Les suites exécutent les modules TS du dépôt, pas des scripts `uv` (non exécutables sur GitHub). Les scénarios de sauvegarde/migration plus approfondis restent également au périmètre de CAR-41.

## CI et publication

CI de référence : à renseigner après exécution du commit final incluant le mode strict et son test négatif. Commandes exécutées en CI : `npm test` ; `npm run audit:rules` (**strict**) ; `npm run build` ; `npm run verify:pwa`.

Aucune mise à jour du statut Jira effectuée sans autorisation.
