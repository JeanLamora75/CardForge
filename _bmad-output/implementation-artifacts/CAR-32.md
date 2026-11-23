# CAR-32 — Plateau Thunderfighter : prévisualisation et confirmation des actions

**Agent :** Amelia (BMAD)  
**Date :** 23 novembre 2026  
**Story :** [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) — S25  
**Statut :** code publié sur `main` ; qualification navigateur/tactile à compléter.

## Implémentation

- `src/components/ThunderfighterBoard.tsx` : plateau 3 × 3 avec sommet et hauteur de chaque pile, douze secteurs périphériques fixes avec statut textuel actif/neutralisé, pioche et cartes visibles uniquement, réserve spéciale, cartes recherchées déjà révélées, résistances et armures.
- Une action n'est proposée que si elle figure dans `thunderfighterEngine.getLegalActions(state)`. Les destinations de figures proviennent du moteur, y compris le mode de secours ; aucune légalité n'est calculée depuis l'apparence des cartes.
- La sélection d'une action invoque `thunderfighterEngine.transition(structuredClone(state), action)` pour **simuler uniquement**, sans appeler le service de sauvegarde. Le rendu annonce les cibles neutralisées (dont double tir), l'armure et le résultat éventuel.
- **Confirmer et enregistrer** fait exactement un appel `session.dispatch(action)` au service `PersistentGameSession`, qui prend en charge transaction, score et sauvegarde. Bouton Annuler sans mutation, verrouillage pendant les écritures et message d'échec.
- Présentation responsive, cartes avec valeurs et enseignes écrites, distinction visible des figures neutralisées, actions en vrais boutons clavier/tactile. Aucun effet animé nécessaire pour comprendre le résultat.
- `src/App.tsx` : ouverture depuis la fiche Thunderfighter, sans changement de `gameId = gridcannon`, de format de sauvegarde ou des règles.
- `src/styles.css` : thème spatial rétrofuturiste, dispositions 3 × 3 et 12 secteurs, tailles réduites sur mobile.

## Vérification

- `tests/thunderfighter-board-preview.test.mjs` : simulation non mutante, conséquences de double tir cohérentes avec la transition réelle, conservation des 54 cartes, refus illégal, absence de divulgation des cartes futures dans les actions.
- À contrôler sur la CI du dernier commit : `npm test` et `npm run build` (GitHub Actions).
- Une recette navigateur réelle reste requise pour tactile/clavier, lisibilité à petite largeur, focus, affichage des armures et prévisualisation sur des parties représentatives ; ne pas déclarer cette recette exécutée.

## Limites connues

- Pas d'illustrations finales produites : le plateau utilise des cartes originales **stylisées en CSS**, avec icônes et informations textuelles.
- La présentation des lignes de tir est textuelle (destinations et double tir), sans surlignage géométrique complet des deux axes.
- Préversion : la disponibilité publique des jeux dans `src/catalog.ts` reste volontairement désactivée.
- Les règles du moteur sont la référence de validité ; aucune mécanique nouvelle n'a été introduite.
- Le protocole BMAD `bmad-build` exige `uv` puis un workflow généré. Conformément à la contrainte CardForge, aucun script `uv` n'a été exécuté ; adaptation par lecture directe de la Story, de l'agent, du code et validation GitHub Actions.

## Sources

- [Moteur Gridcannon V2](../../src/games/gridcannon/engine.ts)
- [Règles BMAD Gridcannon](../planning-artifacts/game-rules/gridcannon.md)
- [Jira CAR-32](https://lmn24.atlassian.net/browse/CAR-32)
