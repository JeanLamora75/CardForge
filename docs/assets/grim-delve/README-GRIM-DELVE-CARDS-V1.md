# Grim Delve — Cartes V1 — Sally / Amelia

24 ressources : 18 illustrations, un dos universel, cinq cadres transparents. Les illustrations 2 à 10 (36 cartes) et les quatre emblèmes séparés ne sont pas inclus. Les variantes et essais rejetés sont exclus.

## Installation
Décompresser à la racine du dépôt après vérification des collisions. PNG maîtres dans `public/assets/cards/grim-delve/` et `public/assets/frames/grim-delve/`; WebP de prévisualisation dans les chemins miroirs `public/art/`. Les WebP sont des dérivés Pillow qualité 82, maximum 1000 px, à régénérer avec Sharp selon la chaîne officielle; ne pas forcer leur ajout Git si ignorés. Fusionner le fragment `_bmad-output/planning-artifacts/ux-designs/grim-delve-cards-v1/assets-manifest-additions.json` avec le manifeste principal sans supprimer ses entrées. Vérifier les SHA-256 et l’absence de doublons. Aucun fichier historique ni manifeste principal n’est remplacé par ce ZIP.

## Correspondance moteur / UI
- `hearts`: Humains ; `diamonds`: Elfes ; `clubs`: Orcs ; `spades`: Nécromanciens. Conserver les identifiants moteur et sauvegarde.
- `cards/grim-delve/<suit>-<rank>.webp` pour les rangs 1, 11, 12, 13 ; `joker-1`, `joker-2` et `back` (dos commun).
- `frames/grim-delve/card-<suit>.webp` ou `card-joker.webp` : overlay transparent 2:3, exactement superposé à l'illustration. Les deux couches doivent partager leur rectangle et leur ratio ; aucune déformation. Le cartouche inférieur est décoratif, sans texte. Placer les libellés dynamiques dans le cartouche, valeurs et symboles dans les coins intérieurs, vérifier le contraste à petite taille. L'aperçu est un assemblage des fichiers, pas une capture du jeu.
- Utiliser la couche `gd-card-art` pour l'image, `gd-card-frame` pour le cadre, `gd-card-data` pour valeur, enseigne, nom et état. URL via BASE_URL. Préserver la sélection, le focus et les actions légales. Les rangs 2–10 restent provisoires sans requête vers un fichier absent. Ne jamais révéler l'identité des cartes masquées.
- Adapter les traductions FR/EN, règles affichées et noms des factions sans changer la logique.

## Contrôles
24 PNG et 24 WebP décodables, sources 1024×1536, centre des cinq cadres transparent (alpha maximal contrôlé dans le rectangle central 50%×50%), SHA-256 des PNG dans le manifeste. Contrôler la compilation, les tests, le cache PWA des nouveaux chemins, le rendu mobile et la CI après intégration. Aucun uv. Aucun changement GitHub ni test du jeu exécuté pour ce pack.

Référentiel : https://github.com/JeanLamora75/CardForge/blob/main/docs/graphic-assets-standard.md
