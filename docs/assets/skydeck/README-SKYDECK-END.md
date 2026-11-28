# Skydeck — écrans de fin

Extraire à la racine de CardForge. Classement vérifié sur main : public/assets/boards/<jeu>/ pour les fonds (exemple Midnight Syndicate), public/assets/icons/<jeu>/ pour les emblèmes (exemple victory.png). Le nom defeat est un nouveau choix explicite, adapté à Skydeck. Aucun fichier existant remplacé selon la consultation GitHub.

Amelia : fusionner les six entrées du manifeste fourni dans _bmad-output/planning-artifacts/ux-designs/ux-CardForge-2026-11-24/assets-manifest.json sans écraser le manifeste existant, puis utiliser le pipeline optimize-art.mjs. Réutiliser les composants, boutons et logo du plateau ; textes, causes de défaite et statistiques issus des données réellement disponibles, dynamiques FR/EN. Ne pas inventer de score. Recette portrait/paysage, clavier/tactile, contraste et CI à effectuer. Aucun changement de moteur ni publication GitHub réalisé. Les fonds ont été légèrement recadrés aux ratios exacts, sans étirement.
