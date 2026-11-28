# Skydeck — pack plateau CardForge

Extraire à la racine du dépôt. Les fichiers sont classés sous public/assets/<fonction>/skydeck/ selon les conventions observées dans Midnight Syndicate. Les noms Skydeck nouveaux sont proposés, non des références déjà utilisées dans le code. Aucun fichier accueil existant (skydeck.png) n’est remplacé.

Amelia : fusionner les entrées de skydeck-assets-manifest.json dans le manifeste BMAD existant `_bmad-output/planning-artifacts/ux-designs/ux-CardForge-2026-11-24/assets-manifest.json` (ne pas le remplacer). Le script optimize-art.mjs produit ensuite les WebP sous public/art. Les SVG V1 utiles ont été convertis en PNG pour ce pipeline. Les anciens cadres et décors remplacés par les versions premium ne sont pas dupliqués. Le lot 5 est prévu en CSS, sans bitmap. Les 54 faces de cartes sont hors périmètre. Ne pas utiliser le séparateur double comme indication de sens : déplacement vers la droite. Textes et compteurs dynamiques FR/EN.

Les fonds portrait et paysage sont exacts 9:20 et 16:9, sans agrandissement. Aucun test React/CI effectué. Les emblèmes et cadres sont à vérifier en situation réelle sur mobile.
