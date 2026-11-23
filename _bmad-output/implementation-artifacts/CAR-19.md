# CAR-19 — Grim Delve : validation des attaques et rôles des Jokers

**Agent :** Amelia — Senior Software Engineer (BMAD)  
**Date :** 23 novembre 2026  
**Epic :** CAR-3 · **Story :** CAR-19 / S12  
**État :** correction du moteur et tests publiés sur `main`. Tests locaux exécutés ; build et GitHub Actions non attestés.

## Références

- [Jira CAR-19](https://lmn24.atlassian.net/browse/CAR-19)
- [Règles Clear the Dungeon Classic v1.1.0 — arbitrages CTD-ARB-07/08/09/10/11](../planning-artifacts/game-rules/clear-the-dungeon.md)
- [Matrice CTD](../planning-artifacts/clear-the-dungeon-rule-test-matrix.md)
- [CAR-18 — attaques partielles et verrouillage](CAR-18.md)

## Livraison

- `src/games/clear-the-dungeon/engine.ts` : conservation du moteur de puissance/déclenchement de CAR-18, avec **rejet strict des attributs de commandes non prévus**. Le moteur n'accepte plus un champ `value` (puissance choisie) ni une option de sélection d'enseigne : les Jokers conservent une puissance **fixe de 10** et un rôle déterminé par leur placement.
- `tests/grim-delve-attack-rules.test.mjs` : 14 tests déterministes de conformité. Scénarios : attaque 6+5=11 contre un Valet ; 8+6>11 ; interdiction du déclencheur de mauvaise enseigne ou avant deux puissances ; refus de deuxième puissance insuffisante ; première puissance complétable ; Joker en puissance 10 ; Joker A + 3 et Joker B déclencheur sur Roi ; deux Jokers en puissances, puis déclencheur numérique de bonne/mauvaise enseigne ; impossibilité d'utiliser deux fois un même Joker ; restauration de Jokers verrouillés ; Jokers affectés à deux monstres ; refus des paramètres de puissance/enseigne supplémentaires.
- L'identité des 54 cartes physiques, la pureté des transitions et le refus sans consommation de carte sont vérifiés à chaque transition testée.

## Couverture des critères Jira

| Critère | Preuve |
| --- | --- |
| AC1 — Deux puissances puis déclencheur, seuil ≥ résistance, enseigne conforme | CTD-T69/70/71/73/78/80/82/85/86, tests d'attaque complète et de rejet sans mutation |
| AC2 — Deux Jokers indépendants, puissance 10 fixe, rôle par position | CTD-T94/95/98/104/105/106/107/109/110/111 ; même attaque autorisée pour deux Jokers, sans partage d'identité |
| AC3 — Refus des attaques impossibles sans mutation/consommation | Tests des seuils, des mauvaises enseignes, d'actions précoces et du rejet de paramètres `value` non autorisés |

## Contrôles effectivement exécutés

- Première exécution des 14 scénarios : **12/14 PASS**. Deux échecs analysés : (1) scénario de test présentant quatre cartes dans une main de maximum trois, corrigé ; (2) vrai défaut de validation permettant `place-power` avec champ additionnel `value`, corrigé dans le moteur.
- Après corrections : `node --experimental-strip-types --test tests/grim-delve-attack-rules.test.mjs` → **14/14 PASS**.
- Régression de la copie de travail locale `/mnt/data/cardforge-car17` : `node --experimental-strip-types --test tests/*.test.mjs` → **92/92 PASS**.
- TypeScript strict ciblé (`tsc --noEmit --target ES2022 --module ESNext --moduleResolution bundler --allowImportingTsExtensions --strict src/core/*.ts src/ports/*.ts src/adapters/*.ts src/application/*.ts src/games/clear-the-dungeon/*.ts`) → **PASS**.
- Moteur et 14 tests **publiés puis relus** via le connecteur GitHub sur `main`. Le fichier de tests publié reprend les mêmes 14 scénarios fonctionnels que la copie testée.
- **Non attestés :** `npm run build` complet, exécution de la suite de tests sur le commit GitHub, CI GitHub Actions verte, navigateur/IndexedDB réel et parcours UI. Pas de script `uv` exécuté.
- Les règles de rôle des Jokers et de pose évoquées comme arbitrages sont les **décisions CardForge**, pas des citations inventées de l'auteur du jeu.

## Suite

Effectuer les prochaines Stories de fin de main/score/conformité selon Jira, et vérifier les tests en CI sur le commit GitHub avant de déclarer cette Story entièrement clôturée.
