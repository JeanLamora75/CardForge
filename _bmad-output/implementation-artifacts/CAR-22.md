# CAR-22 — Thunderfighter : préparer la grille et la pioche de 54 cartes

**Agent :** Amelia — Senior Software Engineer (BMAD)  
**Date :** 23 novembre 2026 · **Epic :** Thunderfighter / Gridcannon V2 · **Story :** CAR-22 (S15)  
**État :** moteur de préparation et tests publiés sur `main`, contrôles fonctionnels en JavaScript exécutés. Compilation TypeScript, `npm test`, build et CI non attestés.

## Références

- [Story Jira CAR-22](https://lmn24.atlassian.net/browse/CAR-22)
- [Mary — règles Gridcannon Version 2, GC-01/02/13/14/15/16 et audit §68](../planning-artifacts/game-rules/gridcannon.md)
- [Matrice de tests GC](../planning-artifacts/gridcannon-rule-test-matrix.md)
- [Modèle du paquet physique](../../src/core/cards.ts)
- [Paquet déterministe](../../src/core/deterministic-deck.ts)

## Livraison

- `src/games/gridcannon/engine.ts` : nouveau moteur `thunderfighterEngine`, respectant le port `GameEngine<State,Action,Setup>`, identifiant technique stable **`gridcannon`**, version de règles **`v2`**, titre public Thunderfighter, graine uint32 contrôlée par le noyau.
- Préparation : mélange des **54 cartes physiques** ; distribution de **neuf numériques 2–10** en **grille 3 × 3 entièrement remplie (centre compris)**. Les figures J/Q/K rencontrées avant la neuvième numérique sont retenues dans une file chronologique ; les As et Jokers rencontrés rejoignent immédiatement `specialReserve` face visible, sans être dépensés. Le reste garde l'ordre de pioche d'origine. Douze positions extérieures distinctes restent réservées aux figures.
- Les figures en attente sont placées **une par une par action explicite** `place-figure` ; `availableFigureSlots` propose les destinations libres adjacentes aux meilleures cartes **périphériques** (même enseigne > même couleur > rang le plus élevé), avec choix possible en cas d'égalité ; dernier recours GC-13 uniquement s'il n'existe aucun candidat périphérique admissible. Aucune carte centrale n'attire une figure.
- Après placement des figures initiales, phase `replacement-offer` : action `skip-replacement` ou `start-replacement(cell)`. L'ancienne numérique rejoint **le bas** de `drawPile`; la case devient vide. `draw-replacement` traite chronologiquement les tirages : As/Joker immédiatement en réserve, figure retenue dans `pendingFigures`, première numérique sur la case vidée **sans contrôle d'empilement ordinaire**, puis placement différé des figures jusqu'à entrée en `playing`. Le droit de remplacement est **unique**.
- Aucune attaque n'est exécutée pendant la préparation, et aucun calcul rétroactif au passage en `playing` (GC-15). Aucune activation d'As ou de Joker n'existe avant cette transition (GC-16) ; ces cartes sont néanmoins présentes dans `specialReserve`.
- État sérialisable : `phase`, `grid`, `figureSlots`, `pendingFigures`, `drawPile`, `specialReserve`, `spentSpecials`, `replacementSlot`, `replacementUsed`. Validation : neuf cases numériques sauf case temporairement vide au remplacement, catégories de cartes par zone, **54 identifiants distincts** et phases cohérentes. Les commandes inconnues, supplémentaires ou répétées sont refusées sans mutation.
- `tests/thunderfighter-start.test.mjs` : **10 scénarios exécutables** couvrant identité du paquet et centre rempli, distribution reproductible, figures mises en attente, placement extérieur, refus du remplacement, remplacement unique, tirages de figure/As/Joker/numérique, interdiction de tir/action spéciale, duplication illégale et reprise d'une sauvegarde pendant le remplacement.

## Traçabilité des critères d'acceptation

| AC | Comportement |
| --- | --- |
| AC1 — Grille initiale 3×3, piles numériques et 54 cartes uniques dans leurs zones | **Implémenté** : 9 numériques 2–10 ; 12 emplacements de figure ; conservation et unicité vérifiées en phases intermédiaires |
| AC2 — Remplacement facultatif et tirages non numériques GC-14 ; pas d'attaque GC-15 | **Implémenté** : choix explicite unique, figures en attente, As/Jokers en réserve et poses sans tir |
| AC3 — Actions spéciales bloquées jusqu'à fin préparation GC-16 ; aucune règle V1 | **Implémenté** : ni Extraction ni Réaffectation en phase de préparation, centre rempli, aucune `shame pile` ni remise à zéro V1 |

## Contrôles réellement exécutés et limites

1. **10/10 scénarios CAR-22 passés** : corps des tests publiés chargés et exécutés dans un moteur JavaScript isolé après **suppression mécanique des annotations TypeScript** du fichier source GitHub ; les fonctions communes de génération des 54 cartes et du PRNG Mulberry32 ont été réimplémentées à l'identique dans cet outil de vérification. Les assertions de `node:assert` et `structuredClone` ont été remplacées par des équivalents JavaScript adaptés aux objets sérialisables. **Ce contrôle n'est pas une exécution Node de `tests/thunderfighter-start.test.mjs`, ni une compilation TypeScript.**
2. **200/200 séquences de préparation complète** avec graines distinctes (0–199) dans le même outil de vérification : génération initiale, placement légal de toutes les figures initiales, remplacement facultatif, parcours jusqu'à la première numérique, placement différé de toutes les figures puis validation complète des zones en phase `playing`. Ces 200 scénarios ne remplacent pas les tests de CI.
3. Le moteur et le fichier de tests ont été publiés sur GitHub `main` via connecteur.
4. **Non exécutés et non attestés :** `tsc` ou `npm run build` sur le commit, `npm test` Node natif du dépôt, GitHub Actions verte, navigateur réel/IndexedDB, intégration UI et tests de gameplay après préparation. Un environnement conteneur sans accès réseau ne permet pas de télécharger le code GitHub pour la vérification Node native.
5. Aucun script `uv` exécuté (non exécutable via GitHub) ; adaptation manuelle du skill BMAD.

## Suite et points d'attention

- **CAR-23 et suivantes** : compléter le jeu normal (pose des numériques sur piles, actions spéciales autorisées, armure, attaques, victoire/défaite et score) ; la phase `playing` est volontairement **sans actions jouables** à ce stade et ne doit pas être présentée comme un moteur complet.
- Les placements extérieurs utilisent les conventions **CardForge** GC-01/02/13 lorsque la Version 2 originale reste muette ; ce sont des décisions utilisateur, non des citations de Tom Francis.
- Avant clôture définitive de CAR-22, exécuter le **build TypeScript et la CI sur un même commit**, les tests Node natifs et les scénarios de reprise IndexedDB dans un navigateur. Garder Jira non clôturé jusqu'à ces preuves.
