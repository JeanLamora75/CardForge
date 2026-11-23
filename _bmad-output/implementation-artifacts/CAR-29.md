# CAR-29 — Catalogue immersif et disponibilité honnête des cinq jeux

**Agent :** Amelia — Senior Software Engineer (BMAD)  
**Date :** 23 novembre 2026 · **Story :** CAR-29 / S22  
**État :** catalogue et fiches publiés sur `main`, CI GitHub Actions native vérifiée sur le commit comprenant également la réconciliation des styles `aeecdb718121a4051156197d0f05e27b776cd679`.

## Références
- [Jira CAR-29](https://lmn24.atlassian.net/browse/CAR-29)
- [Décisions de cadrage](../../docs/cadrage.md) — nommage, navigation contextuelle, catalogue immersif, gratuité, accessibilité
- [Sally — Direction UX](../planning-artifacts/ux-designs/ux-CardForge-2026-11-23/DESIGN.md)
- [Règles d'origine](../planning-artifacts/game-rules/gridcannon.md), [Clear the Dungeon](../planning-artifacts/game-rules/clear-the-dungeon.md)
- [CI native #45256876896](https://github.com/JeanLamora75/CardForge/actions/runs/45256876896), `main` commit `aeecdb718121a4051156197d0f05e27b776cd679`.

## AC1 — Cinq jeux, intitulés validés et état honnête

`src/catalog.ts` contient une seule source de métadonnées de présentation, indépendante des moteurs et sauvegardes. Les décisions les plus récentes de Jira supplantent les noms de travail mentionnés dans d'anciennes sections :

| ID technique inchangé | Nom affiché | Univers | Statut rendu |
| --- | --- | --- | --- |
| `clear-the-dungeon` | **Grim Delve** | Donjon et dark fantasy | **En développement** |
| `gridcannon` | **Thunderfighter** | SF spatiale pulp rétrofuturiste | **En développement** |
| `card-capture` | **Skydeck** | Corsaires du ciel / îles flottantes | **À venir** |
| `loot-the-loop` | **Midnight Syndicate** | Prohibition des années 1930 / dieselpunk | **À venir** |
| `regicide` | **Les Douze Tyrans** | Wuxia/Chanbara, Asie féodale fantastique | **À venir** |

Chaque entrée précise les règles source, l'attribution disponible, le contexte narratif, une courte présentation et les mécanismes généraux, sans modifier les cartes, le gameplay, les statistiques ni le `gameId`.

## AC2 — Univers corrects et traçabilité

- Suppression des univers erronés de l'ancien prototype (Card Capture cyberpunk, Loot the Loop Égypte ancienne, Regicide fantasy héroïque).
- Le nom de travail **Bastion Stellaire** ne figure plus dans le catalogue. **Thunderfighter** demeure lié au moteur `gridcannon` et aux règles **Gridcannon Version 2** de Tom Francis.
- **Les Douze Tyrans** reste identifié techniquement comme `regicide`, et ses crédits attribuent Regicide à Paul Abrahams, Luke Badger et Andy Richdale. Aucune Grèce antique ni adaptation grecque n'est présentée.
- **Skydeck** et **Midnight Syndicate** sont les dernières dénominations publiques explicitement validées, au-delà des noms source figurant dans les paragraphes historiques plus anciens de Jira.

## AC3 — Aucune action de partie prématurée

- Deux moteurs existent mais **pas d'écran de partie exploitable**, donc aucun jeu ne prétend être `available` aujourd'hui. Les deux candidats MVP sont étiquetés **En développement**, les autres **À venir**.
- `GameEntry.status` distingue `in-development`, `coming-soon`, `available`; `playableRoute` reste `null` pour les cinq jeux. La fonction `canPlay` exige *simultanément* `status==='available'` et une route applicative locale explicite commençant par `/`, sans `//` externe. Aucun lien « Jouer » n'est rendu aujourd'hui.
- Le bouton **Découvrir** ouvre une fiche contextuelle contenant titre, univers, texte de présentation, type solo, mécanismes, jeu original et crédits. Une mention explicite indique que le jeu n'est pas accessible en partie. Retour au catalogue sans abandon ni changement d'état d'une sauvegarde.
- Le catalogue ne promet aucune date, aucun jeu de démonstration ou lancement fictif. La vérification juridique des titres et droits (CAR-43) reste à conduire avant publication publique.

## Implémentation UX

- `src/App.tsx` : navigation contextuelle sans barre permanente, galerie de cinq cartes et vues de détail. Boutons sémantiques et libellés explicites, restauration du focus sur le déclencheur après fermeture, prise en charge de `Escape`, présentation lisible sans dépendre de la couleur seule.
- `src/styles.css` : grille responsive mobile-first, contraste/focus visibles, cibles tactiles d'au moins 44 px, atmosphères décoratives distinctes par univers, respect de `prefers-reduced-motion`. **Illustrations originales définitives non produites à ce stade** ; les fonds dégradés et pictogrammes sont des marqueurs visuels temporaires, pas des assets de jeu définitifs.
- **Périmètre exact :** les fiches et descriptions sont livrées ; les vues « Règles », « Statistiques », tutoriels interactifs et parties réelles relèvent des Stories suivantes. Ne pas prétendre disposer des boutons correspondants ni de l'état des sauvegardes en UI.

## Preuves et tests

- `tests/catalog.test.mjs` — **6 nouveaux tests** : liste exacte des cinq IDs et cinq noms, attribution des règles source, univers, trois projets futurs, état des deux MVP, aucune action active et garde stricte sur routes jouables.
- Première CI avec tests [#45256544274](https://github.com/JeanLamora75/CardForge/actions/runs/45256544274) : 206/207 succès, test trop strict exigeant un nom de plus de 8 caractères (Skydeck). Première correction insuffisante pour Regicide (nom source de 8 caractères) ; après adaptation du test, nouvelle CI complètement verte. Aucune modification des noms validés n'a été faite pour satisfaire ces tests.
- **CI de référence [#45256746054](https://github.com/JeanLamora75/CardForge/actions/runs/45256746054)** sur `b8841af6cc43a4242b5a9b785b4a51ff7e0ce195` : **207/207 tests pass** et build Web/TypeScript réussi. **CI après réconciliation UI/CSS [#45256876896](https://github.com/JeanLamora75/CardForge/actions/runs/45256876896)** sur `aeecdb718121a4051156197d0f05e27b776cd679` : **207/207 tests pass**, étapes `Unit tests` et `TypeScript and Web build` **success**, run `completed/success`. La correction additionnelle adapte les styles aux classes réelles de la fiche et des boutons `Découvrir` / `Retour au catalogue`, sans écraser le fonctionnement déjà livré.
- Aucun script BMAD `uv` exécuté ; adaptation manuelle aux connecteurs GitHub et Jira.

## Réserves et suite

- **Recette visuelle réelle et accessibilité complète non attestées** : pas de session Chromium/Playwright avec capture de la page mobile et desktop, ni de validation lecteur d'écran.
- Les images finales de chaque univers restent à produire/valider artistiquement ; les gradients sont temporaires.
- Les fiches n'offrent volontairement aucune partie active, aucun écran de règles détaillées ni statistiques tant que les parcours correspondants n'existent pas.
- Vérification juridique des noms, licences et crédits avant toute diffusion publique : **CAR-43**.
- Les changements portent uniquement sur la couche de catalogue ; les identifiants de moteurs, le stockage IndexedDB et les statistiques sont inchangés.
