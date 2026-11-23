# CAR-35 — Localisation FR/EN et repli anglais

**Agent :** Amelia — Senior Software Engineer (BMAD)  
**Date :** 23 novembre 2026  
**Jira :** [CAR-35](https://lmn24.atlassian.net/browse/CAR-35) — S28  
**Statut technique :** code publié sur `main`, compilation et tests CI réussis. **Qualification exhaustive en navigateur et accessibilité encore à réaliser.**

## Critères d'acceptation

| AC | Livraison / preuve |
| --- | --- |
| **AC1 — interface, deux jeux, règles, messages, aides, tutoriels, erreurs et bilans FR/EN** | `src/i18n/language.ts` embarque le catalogue anglais des messages d'interface et des états de jeu ; `src/i18n/rulebook.ts` fournit les douze paragraphes métier complets des deux livrets ; `src/i18n/surface.ts` localise les nœuds de présentation, les textes dynamiques et attributs accessibles sans relancer ni perturber les moteurs. Les confirmations irréversibles de Grim Delve utilisent une traduction explicite avant `window.confirm`. |
| **AC2 — initialisation, choix manuel persistant, repli anglais** | `readLanguage` consulte d'abord le choix explicite `cardforge.language.v1` dans le navigateur ; sinon sélectionne la première langue prise en charge parmi `navigator.languages` ; si aucune ne correspond, repli `en`. `saveLanguage` garde le choix de l'utilisateur. Sélecteur FR/EN disponible dans l'en-tête permanent et dans les paramètres. Le stockage indisponible n'interdit pas un changement temporaire. |
| **AC3 — aucune mutation du jeu, langues disponibles sans requête externe** | La préférence de langue n'est présente dans aucun `gameId`, état de moteur, paquet de cartes, sauvegarde ou statistique. La localisation est effectuée sur les libellés du rendu et sur les messages confirmés, sans appel de transition du moteur. Les ressources sont embarquées par Vite : **aucune récupération réseau de traduction**. L'exécution hors ligne de toute l'application dépend encore de la PWA prévue en CAR-38. |
| **AC4 — noms publics et crédits stables** | `Grim Delve`, `Thunderfighter`, `Skydeck`, `Midnight Syndicate`, `Les Douze Tyrans` restent les titres publics dans les deux langues. Les identifiants internes ne changent pas ; les noms originaux `Clear the Dungeon`, `Gridcannon Version 2`, `Card Capture`, `Loot the Loop`, `Regicide` et crédits d'auteurs sont conservés. Les descriptions d'univers et statuts à venir sont traduits ; aucune mise en disponibilité des jeux futurs. |

## Architecture

- **`src/i18n/language.ts`** : langues supportées, identification de variante régionale, lecture et écriture de préférence, dictionnaire de libellés.
- **`src/i18n/rulebook.ts`** : traduction anglaise locale des règles complètes affichées par la fiche et le panneau d'aide.
- **`src/i18n/surface.ts`** : traducteur purement visuel `translateUiText` et adaptateur `localizeSurface`. Le DOM React est conservé ; les nœuds originaux sont mémorisés pour assurer le retour en français lors du changement de langue. Les attributs `aria-label`, `title`, `alt` et `placeholder` sont traités. Ne traduit ni données physiques, ni clés de stockage, ni champs de saisie.
- **`src/App.tsx`** : sélection FR/EN depuis la barre du haut et les paramètres, repli navigateur, mise à jour de `<html lang>`, aucun appel de gestion des parties lors du changement de langue.
- **`src/components/GrimDelveBoard.tsx`** : confirmation de défausse traduite, en dehors du DOM et avant toute transition.
- **`src/styles.css`** : contrôles de langue accessibles au clavier et adaptés aux petits écrans.

## Contrôles exécutés

- **GitHub Actions [#45266384533](https://github.com/JeanLamora75/CardForge/actions/runs/45266384533)** au commit `4c9c2c8cf8637f2ababc4eaaaab7cf3d39bdcda5` : **246 tests réussis, 0 échec** et **build TypeScript/Vite réussi**.
- **`tests/i18n.test.mjs`** : variantes régionales, priorité du choix manuel, repli anglais, stockage inaccessible, noms publics inchangés, textes et messages de confirmation, traduction des noms composés, présence des douze paragraphes bilingues, invariance des états déterministes des deux moteurs.
- Le **retour réel en français / anglais avec React en cours de partie**, la navigation au clavier/lecteur d'écran et un audit exhaustif de tous les messages dans les parcours atypiques nécessitent **une recette navigateur non attestée**. Une CI TypeScript/Node ne valide pas à elle seule l'intégralité du rendu ni le comportement hors ligne de la future PWA.
- **Aucun script `uv` BMAD exécuté** : adaptation aux connecteurs GitHub/Jira et au pipeline existant, conformément aux contraintes du projet.

## Vérifications produit encore nécessaires

1. Parcourir les écrans catalogue, fiche, règles, statistiques, tutoriels, deux plateaux, bilans, confirmation et erreurs en FR puis EN ; relever toute chaîne restante pour garantir l'AC1 au sens strict.
2. Vérifier le changement de langue au milieu d'une partie et après redémarrage de l'application, ainsi que les préférences non persistées lorsque le stockage navigateur est refusé.
3. Vérifier les annonces accessibles et les libellés des boutons avec lecteur d'écran et petite largeur.
4. Vérifier les ressources et le lancement réellement hors ligne lorsque la PWA installable de CAR-38 sera livrée.

## Références

- [Jira CAR-35](https://lmn24.atlassian.net/browse/CAR-35)
- [Source des règles Grim Delve](../planning-artifacts/game-rules/clear-the-dungeon.md)
- [Source des règles Thunderfighter](../planning-artifacts/game-rules/gridcannon.md)
- [Direction artistique](../planning-artifacts/ux-designs/ux-CardForge-2026-11-23/DESIGN.md)
