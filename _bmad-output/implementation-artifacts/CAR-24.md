# CAR-24 — Thunderfighter : poser une numérique et résoudre les tirs

**Agent :** Amelia — Senior Software Engineer (BMAD)  
**Date :** 23 novembre 2026 · **Epic :** CAR-4 · **Story :** CAR-24 (S17)  
**État :** code et tests publiés sur `main` ; **GitHub Actions natif : 158/158 tests réussis et build TypeScript/Web réussi sur le commit vérifié**.

## Sources
- [Jira CAR-24](https://lmn24.atlassian.net/browse/CAR-24)
- [Mary — Gridcannon Version 2, §4–5, GC-03, GC-04, audit §68](../planning-artifacts/game-rules/gridcannon.md)
- [CAR-23 — figures et cases extérieures](CAR-23.md)
- [Exécution CI GitHub #45247928018](https://github.com/JeanLamora75/CardForge/actions/runs/45247928018), commit `662ecbe2bf202ea78cd0fb207a6c383c8ea4c8ed`

## Implémentation

- `src/games/gridcannon/engine.ts` : nouvelle `pendingNumeric` sérialisable et séquence explicite `draw-card` / `place-number(cell)`. `draw-card` retire réellement la carte supérieure de la pioche : une figure est placée en file puis sa destination est choisie, un As ou Joker entre dans la réserve, une numérique devient la carte à poser. Une deuxième pioche est interdite tant que la numérique est en attente.
- Les actions `place-number` sont proposées **uniquement** sur des piles dont le sommet est de valeur **inférieure ou égale** à la carte tirée, ou sur une pile réellement vide. La couleur ou l'enseigne n'est **pas** une contrainte de pose : elle intervient lors du calcul des tirs. La règle CardForge GC-03 autorise une pile vide sans enregistrer de carte fictive 0 ; aucune priorité obligatoire des cases vides.
- Les piles numériques peuvent désormais contenir plusieurs cartes en phase `playing`, avec leurs identifiants physiques et leur ordre conservés. Les phases préparatoires initiales continuent à refuser l'empilement prématuré.
- `getShotTargets(state,cell)` : pour une pose légale à une extrémité de ligne ou de colonne, calcule les tirs à partir des **deux sommets intermédiaires** ; **la carte déclencheuse est exclue**. Un Valet admet toutes les enseignes, une Dame ne compte que la **même couleur**, un Roi ne compte que la **même enseigne**. La puissance est comparée à la résistance courante (rang de la figure + somme des cartes d'armure physiques affectées).
- Au **coin**, les deux axes sont calculés sur **le même instantané après pose** ; leurs cibles réussies, distinctes et encore vivantes, sont ajoutées ensemble à `defeatedFigures`. Les figures vaincues **restent dans leur emplacement** ; aucune priorité horizontale, aucune deuxième action de tir. Si la résolution atteint 12 figures vaincues, une seule victoire est figée avec `victoryScore = specialReserve.length`.
- L'état accepte `armorCards?: {figureId,cardId}[]`, `lastShot?: string[]`, `pendingNumeric?: string|null` et `victoryScore?:number|null` : toutes ces zones sont sérialisables, les cartes d'armure sont incluses dans l'invariant de **54 cartes**, les identités sont contrôlées et les anciennes sauvegardes sans ces propriétés restent compatibles. **L'action attribuant une armure et les seuils de défaite correspondants relèvent des Stories suivantes** ; ici seule la résistance d'une armure déjà affectée est prise en compte.
- Seules les phases de préparation contrôlées par CAR-22/23 et la phase de jeu proposent les actions correspondantes. Les tirs sont **interdits pendant la préparation** et une pose déclenchée au centre n'attaque pas.

## Critères d'acceptation

| AC | Réalisation / preuves |
| --- | --- |
| AC1 — Pose selon valeur du sommet, case vide GC-03 sans carte fantôme | Action `place-number(cell)`, validation des vrais sommets et de toutes les cartes, tests égalité/refus/centre vide |
| AC2 — Lignes/colonnes indépendantes, doubles tirs simultanés GC-04 | `getShotTargets` puis une transition atomique, tests de deux victoires au coin, victoire après deux éliminations, axes insuffisants, figure déjà vaincue, tirs d'autres bords |
| AC3 — Résistance/armure, couleur et rang sans logique UI, tests déterministes | Fonctions calculant 11/12/13 + armure, restriction de Dame/Roi, tests Valet/Dame/Roi, armure +3 et carte déclencheuse exclue |

## Vérifications réellement exécutées

- **Première CI sur le moteur seul** : [run #45247396848](https://github.com/JeanLamora75/CardForge/actions/runs/45247396848) — **succès**.
- **Première CI avec les 11 nouveaux tests** : [run #45247560367](https://github.com/JeanLamora75/CardForge/actions/runs/45247560367) — **échec**, quatre erreurs de fixtures : doublons d'identifiants, cases extérieures incomplètes, carte perdue de la pioche. **Aucun de ces échecs n'était une règle de tir défaillante** ; chaque fixture a été corrigée et relancée.
- **CI après correction** : [run #45247750418](https://github.com/JeanLamora75/CardForge/actions/runs/45247750418) — tests unitaires et build TypeScript/Web **success**.
- **CI finale sur le commit `662ecbe2bf202ea78cd0fb207a6c383c8ea4c8ed`** : [run #45247928018](https://github.com/JeanLamora75/CardForge/actions/runs/45247928018) — **158 tests exécutés, 158 réussis, aucun échec** ; jobs `Unit tests` et `TypeScript and Web build` **success**, selon les logs et étapes GitHub Actions directement consultés. Inclut **16 nouveaux tests CAR-24** (11 initiaux + 5 complémentaires).
- Pas de simulation manuelle sur un vrai navigateur, de tests multi-onglets IndexedDB ni de revue visuelle d'un écran de plateau. Le moteur Thunderfighter n'est pas entièrement jouable tant que les actions spéciales et l'armure ne sont pas implémentées.
- Le script `uv` du workflow BMAD n'a pas été exécuté ; la démarche est adaptée aux connecteurs GitHub/Jira et aux tests CI réels.

## Limites et suite

- **CAR-25** : As Extraction et Joker Réaffectation ; l'Extraction créera des piles vides réellement persistées, et le Joker pourra appeler la même résolution de tirs après un déplacement légal.
- **CAR-26 et suites** : attribution d'armure, seuils de défaite, pioche/impasses, qualification d'une partie complète.
- **Front-end ultérieur** : raccorder la séquence piocher / poser, mettre en évidence les destinations légales, animer les deux tirs issus du même événement sans altérer la logique de domaine. Tests navigateur E2E à exécuter avant clôture complète de l'épic.
