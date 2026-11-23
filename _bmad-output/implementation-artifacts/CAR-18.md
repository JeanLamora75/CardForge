# CAR-18 — Grim Delve : attaques partielles, repositionnement et verrouillage

**Agent :** Amelia — Senior Software Engineer (BMAD)  
**Date :** 23 novembre 2026 · **Epic :** CAR-3 · **Story :** CAR-18 / S11  
**Livraison :** moteur et tests publiés sur `main`. Tests locaux passés ; qualification CI/navigateur à confirmer.

## Références

- [CAR-18 dans Jira](https://lmn24.atlassian.net/browse/CAR-18)
- [Règles Mary — Classic 1.1.0, CTD-ARB-01/02/06/07/08/09/10/14](../planning-artifacts/game-rules/clear-the-dungeon.md)
- [Matrice de conformité CTD](../planning-artifacts/clear-the-dungeon-rule-test-matrix.md)
- [CAR-17 — démarrage Classic](CAR-17.md)

## Développement

- `src/games/clear-the-dungeon/engine.ts` : extension de l'état avec des **attaques partielles distinctes par monstre visible**, chaque carte de puissance conservant son `cardId` physique et son `handNumber` d'engagement.
- `place-power` : pose d'une première ou deuxième puissance sur une cible actuellement visible, avec refus de première puissance impossible à compléter (`P1 + 10 < résistance`) et refus d'une deuxième insuffisante (`P1 + P2 < résistance`). Joker de puissance fixe 10 ; aucune capacité visuelle n'affecte la règle.
- `take-back` et `move-power` : uniquement pour les cartes posées **dans la main courante**. Contrôle de validité de l'attaque source après retrait et de la cible après repositionnement. Les cartes des mains précédentes restent engagées.
- `end-hand` : action **explicite** uniquement lorsque la main est vide. La main suivante reçoit au maximum trois cartes de la pioche ; l'incrément de `handNumber` transforme les placements de l'ancienne main en placements verrouillés. Une main devenue vide n'est pas clôturée implicitement.
- `trigger-attack` : disponible uniquement après **deux puissances suffisantes**, avec carte de déclenchement de l'enseigne du monstre ou Joker pouvant adopter son enseigne. Les trois cartes et le monstre vaincu sont retirés une seule fois, le monstre suivant de la colonne est révélé immédiatement (CTD-ARB-06). Les attaques partielles sur les autres monstres sont conservées. La victoire au douzième monstre est immédiate.
- `validateState` : contrôle de conservation et unicité des **54 cartes** en incluant les cartes engagées, la cible visible, les méta-données d'engagement et les seuils de puissance. Une sauvegarde JSON du placement provisoire restitue les mêmes actions légales.
- `tests/grim-delve-start.test.mjs` : ajustement de l'assertion de CAR-17 pour contrôler les défausses parmi les actions maintenant plus nombreuses.
- `tests/grim-delve-partial-attacks.test.mjs` : **10 nouveaux scénarios** de positionnement, verrouillage, résolution, Jokers et restauration.

## Critères d'acceptation

| Critère | Preuve |
| --- | --- |
| AC1 — Plusieurs attaques partielles distinctes conservent leurs placements entre mains | `attacks[]`, métadonnées `handNumber`, tests multi-cibles et `end-hand` |
| AC2 — Placement courant récupérable/déplaçable, anciens placements verrouillés | `take-back`, `move-power`, vérification `handNumber === state.handNumber`, tests CTD-T35/T36/T37/T38/T131 |
| AC3 — Attaque résolue non annulable ; reprise identique | `trigger-attack` retire trois cartes et un monstre, révèle la suite ; tests de refus de reprise, déclenchement répété et sérialisation JSON des attaques provisoires |

## Contrôles réellement exécutés

- Dans la copie de travail locale `/mnt/data/cardforge-car17` : `node --experimental-strip-types --test tests/grim-delve*.test.mjs` : **20/20 PASS** (10 tests CAR-17 adaptés + 10 nouveaux tests CAR-18).
- Même environnement : `node --experimental-strip-types --test tests/*.test.mjs` : **78/78 PASS**.
- `tsc --noEmit --target ES2022 --module ESNext --moduleResolution bundler --allowImportingTsExtensions --strict src/core/*.ts src/ports/*.ts src/adapters/*.ts src/application/*.ts src/games/clear-the-dungeon/*.ts` : **PASS** sous TypeScript 5.8.3.
- Code et deux fichiers de tests lus sur GitHub après publication sur `main` : **vérifié**.
- **Réserves :** les sources de test publiées correspondent aux mêmes scénarios, mais la suite sur le **commit publié** n'a pas été exécutée dans la CI ; `npm run build` et tests dans un vrai navigateur **non attestés**. Les autres parcours du jeu, l'UI et la qualification exhaustive de toutes les règles CTD restent à faire.
- BMAD : le skill de développement exige `uv`, non exécutable dans le présent contexte ; aucun script `uv` n'a été prétendu exécuté.

## Suite

- **CAR-19** : poursuivre les règles restantes de Grim Delve et les cas de fin de partie selon le découpage Jira.
- Avant clôture définitive de CAR-18 : exécuter la suite complète et le build sur le commit publié, contrôler les nouveaux tests en CI et les parcours de jeu avec IndexedDB réel.
