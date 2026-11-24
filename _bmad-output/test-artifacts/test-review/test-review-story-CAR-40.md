# Murat — Revue QA indépendante de CAR-40

**Story :** [CAR-40](https://lmn24.atlassian.net/browse/CAR-40) — [S33] Tests unitaires exécutables du socle et des moteurs  
**Agent :** Murat — Quality Engineer (skill `.agents/skills/bmad-agent-qa/SKILL.md`, lecture des référentiels TEA `test-review` et `trace`)  
**Date de revue :** 24 novembre 2026  
**Branche et commit de référence :** `main`, `297d958334feee4c4ce45ba441aca66b5003aa49`  
**Exécution CI effectivement vérifiée :** [GitHub Actions #45276707360](https://github.com/JeanLamora75/CardForge/actions/runs/45276707360) sur `60bd074d4067c7b73a67c9611fdbe42c49cf30f5` : **298 tests réussis / 298, 0 échec**, audit nominal 121/121 CTD, 35/35 GC, 21/21 T- historiques, compilation et vérification du bundle PWA réussies.

## Verdict QA : **FAIL (validation fonctionnelle CAR-40 refusée à ce stade)**

Il ne s'agit pas d'un échec de CI. Les tests s'exécutent réellement et la CI est verte, mais **le critère AC2 demande un scénario exécutable fidèle pour chaque cas ou une justification de non-applicabilité validée**. Le seul rapprochement des identifiants Mary avec les titres ne satisfait pas cette obligation. Des écarts concrets entre scénarios attendus et données des tests ont été retrouvés.

**Portée de la revue :** analyse statique indépendante du code connecté à GitHub, des matrices Mary, de la Story et des logs CI existants ; aucune nouvelle exécution locale des tests, aucun test navigateur, aucune modification des moteurs ni des tests dans cette revue. L'examen n'est pas une certification exhaustive ligne par ligne des 177 références d'origine.

## Évaluation par critère

| Critère Jira | Avis QA | Preuves / réserve |
| --- | --- | --- |
| **AC1 — vrai code TypeScript exécuté** | **PASS** | `package.json` lance `node --experimental-strip-types --test tests/*.test.mjs`. Les suites importent réellement les deux moteurs, `cards.ts` et le mélange. Les tests multi-graines valident 54 cartes, déterminisme, absence de mutation et transitions. La CI atteste leur exécution. |
| **AC2 — chaque scénario Mary testé ou exception validée** | **FAIL** | Le rapport de couverture nominale est exact comme **inventaire des intitulés**, mais ne garantit pas une correspondance Given/When/Then. Cas GC-T35 et CTD-T50 non fidèles ; justification CTD-T116 encore non validée au niveau métier. |
| **AC3 — CI rouge pour résultat incorrect, duplications, mauvaises issues** | **CONCERNS** | Des assertions pertinentes font échouer la CI si elles détectent ces anomalies, et le test du garde reconnaît un identifiant totalement absent. Mais le garde d'exhaustivité peut être satisfait par une déclaration vide, non exécutée ou sans rapport avec le scénario : il ne démontre pas que chaque erreur métier d'un scénario serait détectée. |

## Constats triés par priorité

### QA-40-01 — P1 / Bloquant : le garde de couverture accepte une assertion sans lien avec la règle

**Preuve :** [`scripts/audit-rule-coverage.mjs`, lignes 11–30](https://github.com/JeanLamora75/CardForge/blob/main/scripts/audit-rule-coverage.mjs#L11-L30) extrait les références `CTD-T*` et `GC-T*` de la chaîne du titre, au moyen d'une expression régulière sur le code source, et calcule `covered` avec `test.ids.has(id)`. Le garde du [test de contrôle](https://github.com/JeanLamora75/CardForge/blob/main/tests/rule-coverage-gate.test.mjs#L13-L24) ne teste que le cas « identifiant absent ».

**Conséquence vérifiable par inspection :** un `test('GC-T35', () => {})` serait compté comme couvert bien qu'il n'ait aucune assertion ; une chaîne imitant `test('GC-T35', ...)` dans un commentaire pourrait également être reconnue. Le rapport 35/35 ne justifie donc pas un **PASS AC2**.

**Correction demandée :** adopter une traçabilité structurée scénario → test(s) → assertions attendues, avec contrôle des cas vides/ignorés et validation sémantique indépendante ; ajouter des tests négatifs démontrant le refus de faux liens. Conserver une CI qui exécute effectivement les tests et échoue sur assertions fausses.

### QA-40-02 — P1 / Bloquant : GC-T35 n'est pas joué en condition de pioche épuisée

**Oracle Mary :** [matrice Gridcannon, GC-T35](https://github.com/JeanLamora75/CardForge/blob/main/_bmad-output/planning-artifacts/gridcannon-rule-test-matrix.md) demande une **fin de pioche**, une extraction As qui réinjecte une pile, puis une victoire ; la convention de score est elle-même à vérifier.

**Test déclaré :** [`tests/thunderfighter-results.test.mjs`, lignes 14–33 et 64–75](https://github.com/JeanLamora75/CardForge/blob/main/tests/thunderfighter-results.test.mjs#L14-L75). La fixture `nearVictory()` conserve les cartes restantes dans `drawPile` : avec neuf cartes de grille, douze figures, deux actions spéciales et une carte numérique en attente, la pioche contient **30 cartes avant extraction**, pas zéro. Le test prouve un changement de score après utilisation d'un As, mais pas la transition *épuisement → extraction → continuation → victoire*.

**Correction demandée :** fixture à pioche initialement vide, répartition cohérente de toutes les 54 cartes, extraction vérifiée, continuation et issue/score confirmés contre les décisions Mary actuelles. Si la convention de score reste réellement ouverte, ne pas prétendre couvrir son résultat officiel sans arbitrage.

### QA-40-03 — P1 / Bloquant : CTD-T50 ne reproduit pas la dernière main de deux cartes

**Oracle Mary :** [CTD-T50](https://github.com/JeanLamora75/CardForge/blob/main/_bmad-output/planning-artifacts/clear-the-dungeon-rule-test-matrix.md) : dernière main de **deux cartes**, attaque partielle antérieure, utilisation d'une carte pour la compléter légalement.

**Test déclaré :** [`tests/grim-delve-endings.test.mjs`, lignes 10–31 et 40–47](https://github.com/JeanLamora75/CardForge/blob/main/tests/grim-delve-endings.test.mjs#L10-L47). `nearVictory(0)` construit la main `['joker-2', ...others.slice(0,2)]` soit **trois cartes**. Le test de victoire avec pioche vide vérifie un autre cas mais ne reproduit pas la précondition de CTD-T50.

**Correction demandée :** construire un état valide avec deux cartes en main sur la dernière main et une attaque partielle issue d'une main précédente, terminer l'attaque, vérifier l'absence de défaite prématurée, le déclenchement et le nombre de cartes.

### QA-40-04 — P1 / Validation produit requise : CTD-T116 est requalifié sans décision Mary/PO attestée

**Oracle Mary :** [CTD-T116](https://github.com/JeanLamora75/CardForge/blob/main/_bmad-output/planning-artifacts/clear-the-dungeon-rule-test-matrix.md) prévoit un score de **8** avec trois cartes affectées à d'autres attaques partielles lors du douzième monstre vaincu.

**Code examiné :** [`tests/grim-delve-endings.test.mjs`, à partir de la ligne 153](https://github.com/JeanLamora75/CardForge/blob/main/tests/grim-delve-endings.test.mjs#L153-L169) fabrique un état *après* victoire qui place les attaques sur des cibles déjà vaincues, et démontre correctement son invalidité **selon le validateur actuel**. Cela ne constitue pas une décision métier validée de remplacer le scénario de Mary par « non applicable », ni un test du score attendu dans sa formulation originelle.

**Correction demandée :** soumettre explicitement à Mary/PO l'incompatibilité relevée. Après validation, rectifier la matrice ou rédiger une exception de non-applicabilité approuvée, avec un test comportemental cohérent ; ne pas imposer silencieusement le validateur comme unique oracle des règles.

### QA-40-05 — P2 / À renforcer : la variation cosmétique initiale T-20 n'est testée que sur un moteur factice

**Oracle Mary :** l'ancien T-20 demande de prouver qu'un changement d'habillage fantasy ne modifie pas les attaques.

**Test déclaré :** [`tests/deterministic-deck.test.mjs`, lignes 55–85](https://github.com/JeanLamora75/CardForge/blob/main/tests/deterministic-deck.test.mjs#L55-L85) utilise un moteur synthétique avec une action `draw` et un paquet, **sans couche d'illustrations** et sans le moteur réel de Grim Delve.

**Correction demandée :** comparaison sur un même état de Grim Delve et des actions de jeu identiques, avec deux présentations visuelles différentes, ou démonstration architecturale testable qu'aucun attribut de présentation n'est consommé par la transition métier. La déterminisme du moteur factice ne suffit pas à couvrir T-20.

## Points positifs confirmés

- Les modules TypeScript des moteurs sont réellement importés et exécutés dans les tests Node.
- Les jeux disposent de tests déterministes, de validations d'identités de cartes physiques, de refus des actions illégales, et de tests ciblés des scores et conditions terminales.
- Les suites `matrix-engine-invariants` utilisent seize graines par moteur, jusqu'à 75 transitions, et vérifient de multiples invariants après chaque état ; c'est une **protection de régression**, pas un remplacement des oracles Mary.
- La CI enregistre des assertions exécutées et le build ; aucun nouveau script `uv` n'est nécessaire.
- Les données de traçabilité nominale (121/121, 35/35, 21/21) sont utiles comme **index de recherche de preuves** tant qu'elles sont correctement étiquetées.

## Décision et actions recommandées

**Décision Murat : CAR-40 non approuvée pour clôture QA à ce stade (FAIL AC2, CONCERNS AC3), malgré CI verte.**

1. **Amelia :** corriger les fixtures et assertions GC-T35 et CTD-T50, ajouter un test d'échec sur fausse couverture nominale et renforcer les contrôles d'oracle.
2. **Mary / Product Owner :** trancher explicitement CTD-T116 ; réexaminer la convention GC-T35 si nécessaire.
3. **Murat :** rejouer la suite CI sur un unique commit et inspecter les tests corrigés, puis effectuer la revue sémantique finale des autres mappings Mary → assertions (pas seulement leurs noms), en priorisant gains/pertes et cartes uniques.
4. **Jira :** conserver CAR-40 sans clôture fonctionnelle tant que ces écarts ne sont pas levés. Aucune modification Jira effectuée.

**Confiance du rapport : élevée (95 %) sur les écarts statiques concrets et l'exécution CI citée ; modérée sur l'exhaustivité des écarts**, car cette revue n'est pas une vérification exhaustive des 177 scénarios.

**Adaptations d'environnement :** instructions Murat et référentiels TEA lus depuis GitHub ; méthode de revue séquentielle via les connecteurs disponibles, sans exécution de `uv` ni lancement de sous-agent indépendant réel. Aucun nouveau test exécuté localement, aucune publication de code métier.
