# Skydeck — pack plateau V1

Ressources de présentation indépendantes, issues de la maquette portrait validée ou reconstruites en SVG. Aucun moteur ni code CardForge modifié.

## Intégration Amelia
- Copier `assets/` dans un répertoire dédié Skydeck du projet après inspection de la structure existante. Garder les noms et les sous-dossiers.
- SVG : appliquer en image de fond ou en `<img>` ; conserver les textes, compteurs, numéros des positions, phases, états et libellés dans React/i18n. Les cadres sont conçus pour leur rapport natif ; utiliser des fonds CSS extensibles si besoin plutôt que de déformer les bordures.
- `backgrounds/sky-panorama.png` : décor de bandeau, non fond plein écran. `wood-detail.png` : détail décoratif non raccordable. Utiliser un fond CSS brun/bois en complément.
- `brand/logo.png` : logo fixe détouré manuellement ; sous-titre à rendre en texte HTML. `cards/card-back-flat.svg` : dos recommandé ; le PNG en perspective est uniquement décoratif. La lanterne est un ornement de bord, non un sprite intégral.
- Les cartes ennemies 4–3–2–1 occupent une rangée à largeur maximale. Les quatre cartes du joueur occupent une seconde rangée. Les piles cachées sont représentées par des compteurs uniquement ; la main révèle ses cartes. Les illustrations des 54 faces ne sont pas incluses.
- Pour la recette portrait 360 × 800 CSS : bandeau compact, ligne ennemie, compteurs compacts, main, phase active, actions contextuelles. Pas de texte inscrit dans les cadres. Les trois actions A/B/C ne sont actives qu'en phase capture selon le moteur. Prévoir les commandes de défausse et de pioche, confirmation et avertissements selon les règles existantes.
- Adapter le layout aux écrans courts, zones sûres et zoom ; objectif sans défilement à la taille de référence, à vérifier sur la vraie application. Ne jamais masquer une commande nécessaire. Clavier, focus, lecteurs d'écran, réduction des animations et FR/EN à préserver.
- Les couleurs rouge/bleu/vert des boutons sont celles de la maquette, indépendantes des quatre familles. Ne pas employer la couleur seule pour identifier une faction ou un état.

## Limites
Ce pack est un premier kit intégrable et non une décomposition pixel-perfect : les panneaux et pictogrammes ont été reconstruits, car les textes et les décors de la maquette sont fusionnés dans une image. Les extraits PNG sont des éléments décoratifs. L'aperçu est un montage statique et ne valide ni la jouabilité ni l'intégration React. Aucun test CI n'a été lancé. Aucun fichier GitHub n'a été écrit.
