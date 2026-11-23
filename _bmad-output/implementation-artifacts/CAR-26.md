# CAR-26 — Thunderfighter : armures, égalités et impasses

**Agent :** Amelia — Senior Software Engineer (BMAD)  
**Date :** 23 novembre 2026 · **Story :** CAR-26 / S19 · **Epic :** Thunderfighter / Gridcannon Version 2  
**État :** moteur et tests publiés sur `main`, CI GitHub Actions sur commit vérifié **183/183 tests réussis + build TypeScript/Web réussi**. Recette navigateur/UI non exécutée.

## Références normatives et traçabilité
- [Story Jira CAR-26](https://lmn24.atlassian.net/browse/CAR-26)
- [Mary — Gridcannon V2 : GC-07, GC-20, GC-21 et §68](../planning-artifacts/game-rules/gridcannon.md)
- [CAR-25 — actions spéciales](CAR-25.md)
- [CI native GitHub Actions #45250954216](https://github.com/JeanLamora75/CardForge/actions/runs/45250954216), commit `91ff581037f90b16d7b785443430593ad8da895e`

## Fonctionnalités implémentées

- **`src/games/gridcannon/engine.ts`** : action explicite `assign-armor(figureId)` ; aucune affectation silencieuse. La carte physique en attente quitte `pendingNumeric` pour `armorCards` uniquement après une transition légale, conservant l'unicité des 54 cartes.
- **GC-07 — priorité de traitement** : si la carte est posable sur une pile de sommet inférieur/égal ou une vraie case vide, la pose normale reste possible et aucune attribution d'armure n'est proposée. Sinon, vérifier les recours As/Joker capables de **rendre la numérique posable**, sans consommer de ressource durant l'évaluation. Les As extractibles créent immédiatement une case vide ; pour les Jokers, une recherche déterministe des suites finies de déplacements légaux prend en compte les Jokers encore disponibles. Chaque étape dépense au plus un Joker physique : les parcours explorés sont finis et les états déjà visités sont mémorisés ; une série de mouvements stériles ne bloque pas l'armure.
- **Choix des recours** : lorsque la numérique est bloquée, `usefulArmorRecourses` ne propose que les actions spéciales menant à une destination posable (immédiatement ou via d'autres Jokers), plutôt qu'une simple liste de toutes les actions légalement réalisables. Aucun recours n'est exécuté automatiquement. Si aucun recours utile n'existe, proposer l'attribution d'armure.
- **GC-21 — priorité des cibles** : `armorCandidates(state)` filtre les figures vivantes par catégorie (même enseigne d'abord, sinon même couleur, sinon toutes), puis retient la **plus faible valeur de figure**. Une égalité stricte produit plusieurs actions `assign-armor` ; le joueur choisit explicitement **une seule figure**. Les figures déjà vaincues sont exclues. Une reprise JSON donne les mêmes candidates et une deuxième confirmation n'attribue pas deux fois la carte.
- **Défaite par armure excessive** : immédiatement après l'attribution, résistance actuelle = rang de la figure + somme des armures physiques. Si **Valet ou Dame ≥ 20** ou **Roi ≥ 19**, la partie passe à `outcome='loss'`, `lossReason='armor'` ; aucune autre action n'est permise, aucun score de victoire n'est enregistré.
- **GC-20 — pioche vide** : le moteur n'utilise pas la longueur de la pioche seule comme défaite. Il considère les Extractions réapprovisionnant la pioche et les séquences de Réaffectations produisant des tirs effectifs vers des figures vivantes. Une recherche finie des recours existants refuse les cycles de déplacements stériles. Lorsque **aucune continuation utile** n'est possible, la transition terminale attribue `outcome='loss'` et `lossReason='stalemate'`, sans score. Une Extraction réapprovisionnante ou un Joker pouvant vaincre la dernière figure empêche cette défaite.
- **Fin d'un placement de figure tirée en dernier** : après achèvement de `placing-figure`, l'impasse est réévaluée pour éviter un état sans action et sans issue. Lors d'un tir spécial vainquant la dernière figure vivante alors qu'une numérique était bloquée, cette numérique est conservée dans le lot de recherche ordonné, sans disparition ni duplication.
- **Persistance** : le champ optionnel `lossReason?: 'armor'|'stalemate'|null` et les armures sont sérialisables. `validateState` distingue victoire, défaite par armure et impasse ; les sauvegardes historiques sans cause de perte restent compatibles si elles ne sont pas terminales.

## Critères d'acceptation

| Critère | Preuves |
| --- | --- |
| AC1 — pose, recours utile, puis armure dans cet ordre | `numericCanPlace`, `usefulArmorRecourses`, recherche de suites Joker, `armorCandidates` ; tests de pile vide, As utile, Joker utile/stérile et combinaison de deux Jokers |
| AC2 — égalité GC-21 = choix explicite | plusieurs `assign-armor(figureId)` uniquement pour les meilleures cibles vivantes ; tests de priorité, égalité, choix de la seconde, restauration et double confirmation |
| AC3 — pioche vide et GC-20, seuils et impasse | recherche de continuité utile, tests de fin de pioche avec As, Joker stérile, Joker gagnant, dernier monstre placé, seuils J/Q/K et absence de score sur défaite |

## Tests et preuve CI

- **14 nouveaux scénarios CAR-26** dans `tests/thunderfighter-armor-deadlocks.test.mjs`.
- **GitHub Actions [#45250954216](https://github.com/JeanLamora75/CardForge/actions/runs/45250954216)** sur le commit `91ff581037f90b16d7b785443430593ad8da895e` : **183 tests, 183 succès, 0 échec** d'après les logs du job ; étapes **Unit tests** et **TypeScript and Web build** réussies, job `web` completed/success. Il s'agit de la **véritable CI Node / TypeScript** du dépôt publié, et non d'un simulateur isolé.
- Première exécution des nouveaux tests [#45250197451](https://github.com/JeanLamora75/CardForge/actions/runs/45250197451) : trois fixtures d'impasse échouaient parce qu'un filtre de cartes numériques retenait `joker-2`. Correction de la fixture ; CI [#45250410285](https://github.com/JeanLamora75/CardForge/actions/runs/45250410285) réussie.
- Renforcement de la sélection **uniquement des recours utiles**, correction d'une interprétation trop large des Jokers, puis CI [#45250714110](https://github.com/JeanLamora75/CardForge/actions/runs/45250714110) réussie après correction. Ajout de deux tests ciblés Joker gagnant et dernier placement de figure ; CI finale **183/183 PASS**.
- Aucun script BMAD `uv` exécuté. Le processus BMAD a été adapté aux connecteurs GitHub/Jira et à GitHub Actions.

## Réserves et suites

- Le modèle possède une unique sauvegarde par jeu, à tester sur **IndexedDB réel et double clic UI** ; la CI actuelle ne constitue pas une recette de navigateur.
- Le choix de figure ex æquo doit être intégré à une modale ou interface accessible clavier/tactile et afficher les résistances avant confirmation. Cette UI n'est pas développée dans CAR-26.
- Les parcours complets, la couverture combinatoire exhaustive des ressources sur des plateaux complexes et les seuils de performance restent des vérifications complémentaires pour la qualité de l'epic, même si les tests CI actuels passent.
- Les conventions GC-07/20/21 sont des **arbitrages CardForge** du référentiel Mary. Elles ne doivent pas être présentées comme des citations textuelles de l'auteur Tom Francis.
