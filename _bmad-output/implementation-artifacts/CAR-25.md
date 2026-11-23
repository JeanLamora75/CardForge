# CAR-25 — Thunderfighter : As Extraction et Joker Réaffectation

**Agent :** Amelia — Senior Software Engineer (BMAD)  
**Date :** 23 novembre 2026 · **Epic :** CAR-4 · **Story :** CAR-25 / S18  
**État :** code et tests publiés sur `main` ; **CI GitHub Actions native verte, 169/169 tests unitaires et build TypeScript/Web réussi**.

## Sources et références

- [Jira CAR-25](https://lmn24.atlassian.net/browse/CAR-25)
- [Règles Mary — Gridcannon V2, §6, GC-03/05/09/10/11/16](../planning-artifacts/game-rules/gridcannon.md)
- [CAR-24 — poses numériques et tirs simultanés](CAR-24.md)
- [CI native #45249055113](https://github.com/JeanLamora75/CardForge/actions/runs/45249055113) — commit `605fc4ddf52430037feabb0536fe74fd0a6ff3ac`

## Réalisation

- `src/games/gridcannon/engine.ts` : actions de jeu `extract(cardId,cell)`, `reassign(cardId,from,to)` et, pour le séquencement de recherche GC-09/10/11, `draw-search`. Toutes ces actions sont dérivées de `getLegalActions` puis revalidées à l'exécution. Elles ne sont jamais déclenchées automatiquement.
- **Extraction :** disponible uniquement avec un As physique non dépensé et une pile non vide en phase de jeu ou de recherche. Retire **toute la pile** (et non son sommet), remet les cartes **sommet → fond** à la fin de l'ordre de tirage actuel (`[...drawPile,...pile.slice().reverse()]` car l'ordre interne d'une pile stockée est fond→sommet), et laisse une grille réellement vide. Une seconde Extraction ajoute son groupe après le premier. L'As passe atomiquement de `specialReserve` à `spentSpecials`, sans pouvoir être rejoué.
- **Réaffectation :** disponible uniquement avec un Joker non dépensé, une **source non vide**, une **destination différente**, et une pose du sommet source légalement admissible selon la valeur réelle de la destination (ou case réellement vide GC-03). Seul le sommet est déplacé ; le reste de la pile source reste dans son ordre. Le Joker est dépensé une seule fois. En phase `playing`, les tirs sont évalués par la fonction commune `applyShots`, sur **un même instantané après déplacement** (GC-04) ; en phase `searching`, aucune figure vivante n'est inventée ou vaincue.
- **Recherche de figure :** lorsque le dernier adversaire vivant est vaincu avant le douzième, entrée dans `phase='searching'`. Le moteur permet la décision explicite `draw-search` et les actions spéciales encore disponibles. Toute numérique tirée est conservée dans `searchBuffer` (ordre de rencontre) ; les As/Jokers rencontrés rejoignent immédiatement la réserve **non dépensés** (GC-09). Une nouvelle figure déclenche `placing-figure` ; après son placement légal, la liste numérique provisoire est ajoutée **en bloc sous la pioche** et vidée (GC-10). As/Jokers ne sont ni mélangés au lot provisoire ni crédités deux fois. Les actions spéciales utilisées pendant la recherche modifient la pioche ou la grille **sans réinitialiser** cette liste (GC-11).
- **Préparation GC-16 :** aucune action spéciale offerte pendant `initial-figures`, `replacement-offer`, `replacement-draw`, `replacement-figures`. Les actions ne deviennent disponibles qu'en phase de jeu ou de recherche.
- **Persistance et intégrité :** nouveaux champs facultatifs et sérialisables `searchBuffer`, `placingFromSearch` ; les anciennes sauvegardes restent lisibles. Les cartes en recherche, réserve, cartes dépensées, pioche, grille et armures restent incluses dans la validation des **54 identités physiques**. Les commandes invalides ou répétées n'entraînent aucune mutation ni consommation ; les états restent déterministes.
- `tests/thunderfighter-special-actions.test.mjs` : **11 nouveaux tests** sur l'ordre des extractions, les piles vides, la légalité et le coût des Jokers, les attaques après déplacement, l'interdiction préparatoire, la combinaison pose/recours, la recherche GC-09/10/11, la reprise JSON et la détection d'une même carte disponible et dépensée.

## Couverture des critères Jira

| Critère | Preuve |
| --- | --- |
| AC1 — Extraction de la pile complète, remise en dessous selon GC-05, aucune perte | Tests extraction à plusieurs cartes et extraction successive, validation physique du paquet complet après chaque transition |
| AC2 — Joker ne déplace que les sommets légaux, tirs possibles ; dépense unique | Tests mouvement légal avec double tir, rejets source vide/identique/destination trop forte et nouvelle tentative avec Joker dépensé |
| AC3 — Réserve et activation pendant recherche GC-09/11 ; pas d'automatisme | Tests du mode `searching`, lot numérique ordonné, As/Jokers découverts en réserve et Extract/Joker joués volontairement, refus en préparation |

## Contrôles réellement exécutés

- **GitHub Actions natif sur le commit `605fc4ddf52430037feabb0536fe74fd0a6ff3ac`** : [run #45249055113](https://github.com/JeanLamora75/CardForge/actions/runs/45249055113), statut **completed / success** ; dans le job `web`, étapes **Unit tests = success** et **TypeScript and Web build = success**, vérifiées via les données de GitHub Actions. Les logs attestent **169 tests, 169 pass, 0 fail**.
- Avant ajout des nouveaux tests, une CI de compilation [#45248819037](https://github.com/JeanLamora75/CardForge/actions/runs/45248819037) a échoué sur une méthode de tableau non disponible dans la cible TypeScript ; correction `toReversed()` → `slice().reverse()` et CI [#45248875713](https://github.com/JeanLamora75/CardForge/actions/runs/45248875713) réussie.
- L'implémentation du moteur et le fichier de tests ont été publiés sur `main`, puis la compilation et la suite ont tourné **sur le commit de tests**. Aucun script `uv` exécuté ni prétendu exécuté.
- **Non attestés :** recette sur vrai navigateur/PWA et IndexedDB multi-onglets, parcours UI et contrôles d'accessibilité des boutons spéciaux.
- Le cas de **pioche vide sans nouvelle figure** en cours de recherche reste non terminal (aucune défaite inventée) ; les modalités globales de diagnostic/impasse seront finalisées dans les Stories de fin de partie.

## Précisions sur la fidélité

La mise sous pioche et les pouvoirs As/Joker sont décrits dans la Version 2 de Tom Francis. Les conventions précises d'ordre **sommet → fond**, l'attribution immédiate des As/Jokers pendant la recherche et l'activation volontaire à ce moment sont des **arbitrages CardForge** GC-05/09/11, pas des citations textuelles de Tom Francis.

## Suite

- **CAR-26** : attribution d'armure, impasses, seuils réglementaires et choix des figures ex æquo selon le découpage Jira effectif.
- Intégrer ensuite les commandes volontaires à l'interface de jeu et vérifier le rendu et la reprise en navigateur réel.
