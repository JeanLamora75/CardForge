# Murat — Contre-revue QA CAR-40 après corrections Amelia et avis Mary

**Date :** 24 novembre 2026  
**Story :** [CAR-40](https://lmn24.atlassian.net/browse/CAR-40)  
**Rôle :** Murat / Quality Engineer ; examen indépendant des corrections publiées sur `main`  
**Version de code contrôlée :** `67474547b00baf6903901155fe2027913f6fca48`, [CI #45336289565](https://github.com/JeanLamora75/CardForge/actions/runs/45336289565)  
**Résultat réellement observé :** **303 tests / 303 réussis**, audit strict des références **121/121 CTD-T, 35/35 GC-T, 21/21 T- historiques**, build TypeScript/Vite et 8 ressources PWA vérifiés. Le commit ultérieur de documentation n'est pas un nouveau code testé.

## Décision de la contre-revue : **CONCERNS — corrections techniques acceptées, clôture QA conditionnelle**

Le précédent avis `FAIL` est partiellement levé : les lacunes techniques précises GC-T35, CTD-T50, le garde d'audit et T-20 ont été corrigées avec preuves exécutées. **La conformité métier exhaustive et l'exception CTD-T116 ne sont pas encore validées par le Product Owner** ; de plus, le référentiel Mary GC-T35 notait une convention de score à vérifier. CAR-40 **ne doit pas encore être déclarée acceptée fonctionnellement**.

| Critère Jira | Verdict révisé | Motif |
| --- | --- | --- |
| **AC1 — modules TS exécutables** | **PASS** | Les vrais moteurs et le socle sont importés, transitions et assertions réellement exécutées en CI. |
| **AC2 — chaque scénario Mary testé ou exception validée** | **CONCERNS** | Les cinq écarts initiaux ont une réponse technique/analytique. L'exception CTD-T116 est étayée et approuvée **en analyse par Mary**, mais pas confirmée par le PO ; des arbitrages sources, notamment le score GC-T35, restent à valider. L'audit nominal d'AST n'établit toujours pas l'équivalence sémantique de chacun des 177 scénarios. |
| **AC3 — CI rouge en cas d'erreur** | **PASS sur les assertions exécutées, réserve méthodologique** | Les tests émettent bien un échec sur assertions invalides ; le garde strict refuse désormais les tests commentés, ignorés ou sans assertion. Il ne vérifie pas qu'une assertion corresponde au bon oracle fonctionnel. |

## Contre-vérification des cinq anomalies de la première revue

### QA-40-01 — Corrigé pour les faux positifs structurels ; réserve de pertinence

- [`scripts/audit-rule-coverage.mjs`](https://github.com/JeanLamora75/CardForge/blob/main/scripts/audit-rule-coverage.mjs) analyse l'AST JavaScript avec TypeScript, recherche les **appels réels** `test()`, y compris les titres paramétrés, et exige une assertion dans le callback ou un helper d'assertion accessible.
- [`tests/rule-coverage-gate.test.mjs`](https://github.com/JeanLamora75/CardForge/blob/main/tests/rule-coverage-gate.test.mjs) éprouve un titre présent dans un commentaire, `test.skip`, un test vide et un test sans assertion : les références ne deviennent pas une fausse preuve.
- **Réserve :** `assert.ok(true)` suffirait encore à satisfaire structurellement une référence Mary sans tester la règle. Seule une revue d'oracle et d'assertions peut le déceler. Le score 121/121 reste à nommer *traçabilité avec assertion*, pas conformité exhaustive.

### QA-40-02 — Corrigé en exécution GC-T35 ; réserve d'origine du score

- [`tests/thunderfighter-results.test.mjs`](https://github.com/JeanLamora75/CardForge/blob/main/tests/thunderfighter-results.test.mjs) vérifie explicitement `drawPile.length === 0` **avant** utilisation de l'As.
- La fixture utilise les 54 cartes réparties entre piles, figures, carte numérique en attente et actions spéciales consommées/conservées ; `validateState` est vrai.
- L'extraction crée une pioche non vide, puis le placement terminal défait les deux dernières figures et conclut à une victoire avec score `1` ; les assertions sont exécutées.
- **Réserve Mary :** [matrice Gridcannon GC-T35/G-08](https://github.com/JeanLamora75/CardForge/blob/main/_bmad-output/planning-artifacts/gridcannon-rule-test-matrix.md) indiquait que la *convention officielle de score* restait à vérifier. Le test prouve le comportement du moteur, **pas encore l'accord avec une source primaire sur cette convention**. La fixture est un état artificiellement construit et validé, non une reconstitution intégrale des tirages historiques.

### QA-40-03 — Corrigé CTD-T50

- [`tests/grim-delve-endings.test.mjs`](https://github.com/JeanLamora75/CardForge/blob/main/tests/grim-delve-endings.test.mjs) utilise maintenant **exactement deux cartes** en dernière main, une puissance d'une main antérieure déjà engagée et une pioche initialement vide.
- Le test pose la seconde puissance, vérifie qu'aucune perte prématurée ne survient, vérifie que le déclencheur est légal et résout l'attaque sur le monstre. Les actions réelles du moteur sont exécutées.
- **Avis : correction conforme au cas de la matrice CTD-T50.**

### QA-40-04 — Avis Mary obtenu, mais signature PO encore attendue

- [`ctd-t116-mary-validation-2026-11-24.md`](https://github.com/JeanLamora75/CardForge/blob/main/_bmad-output/planning-artifacts/game-rules/ctd-t116-mary-validation-2026-11-24.md) conclut que la victoire sur le douzième monstre est **incompatible** avec des attaques partielles ciblant d'autres monstres vivants.
- Le score **8** est désormais testé indépendamment en créant un état légal avec huit cartes encore en pioche et en résolvant la dernière attaque ; l'état impossible est testé comme **invalide**.
- **Verdict QA : argumentation Mary cohérente et techniquement prouvée. La validation de l'exception relève néanmoins encore du Product Owner**, car l'AC2 demande une non-applicabilité *validée*. La matrice d'origine n'a pas été modifiée en décision définitive.

### QA-40-05 — Corrigé T-20

- [`tests/visual-rule-independence.test.mjs`](https://github.com/JeanLamora75/CardForge/blob/main/tests/visual-rule-independence.test.mjs) utilise les **vrais moteurs** de Grim Delve et Thunderfighter, avec des métadonnées de présentation opposées, puis vérifie l'égalité des actions légales, transitions, cartes et résultats sur plusieurs décisions.
- **Réserve de niveau :** ce test prouve la séparation des attributs purement décoratifs au niveau moteur, pas un rendu graphique navigateur complet (hors CAR-40).

## Points supplémentaires de méthode

Les états « proches de victoire » sont volontairement artificiels, sous contrôle du validateur. Pour des campagnes E2E et une preuve d'atteignabilité complète, il faudrait rejouer des suites de mouvements depuis un début de partie, sans manipulation directe des zones. Ceci ne remet pas en cause le résultat des tests unitaires ciblés mais en limite la portée.

Le nouveau garde AST est utile, et surtout supérieur au rapprochement textuel initial ; **il ne faut toujours pas renommer une trace syntaxique en preuve de conformité comportementale intégrale**.

## Actions restantes avant clôture

1. **Product Owner :** approuver explicitement la requalification Mary de CTD-T116 (partie à score 8 applicable ; « trois cartes sur d'autres attaques partielles après douzième victoire » non applicable).
2. **Mary / PO :** confirmer ou clarifier la convention de score spéciale GC-T35 / G-08 contre les règles déjà cadrées, sans inventer d'autorisation ni changer la règle du moteur pour satisfaire un test.
3. **Murat :** refaire un *gate* final de conformité des tests à partir de ces deux décisions documentées ; conserver en attendant le statut **CONCERNS**.

## Provenance et limites de l'exécution

Cette contre-revue est une **analyse de code et de preuves CI existantes via GitHub**, pas une session de test supplémentaire lancée depuis ChatGPT, ni un agent QA séparé s'exécutant de façon autonome. Les tests cités ont réellement été exécutés par **GitHub Actions #45336289565**. Aucun `uv` lancé ; aucune modification du statut Jira et aucun nouveau commit de moteur.

**Confiance : élevée (95 %) dans la correction des écarts précis et le statut de la CI ; modérée dans la couverture sémantique exhaustive non auditée individuellement.**
