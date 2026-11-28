# Skydeck — cartes 2 à 10 et cadres

36 illustrations RGB et 5 cadres RGBA, 768 × 1152, 41 fichiers distincts.
Les sources sont classées sous public/assets/cards/skydeck/ships/<faction>/<rang>.png ; cette sous-arborescence est nouvelle, inspirée de public/art/thunderfighter/ships/<faction>/02.webp. Les cadres suivent public/assets/frames/skydeck/.
Les rangs sont attribués selon la progression visuelle, pas selon le nombre exact de canons. Le petit navire doré initialement 03 devient 02. Les silhouettes de certains rangs voisins restent proches. Les identifiants de faction sont des noms graphiques, pas les identifiants du moteur : Amelia doit les associer aux enseignes existantes sans changer les règles.
Fusionner les entrées du manifeste fourni (tableau compatible avec optimize-art.mjs) dans le manifeste BMAD existant, sans écraser celui-ci. Ne pas copier dans public/art : le pipeline produit les WebP. Aucun test en jeu ni build exécuté.
