# Midnight Syndicate — preuves, menaces et évasion V1

17 PNG maîtres RGB 850 × 850, sans cadre de carte ni titre fonctionnel. Les inscriptions sur les objets sont diégétiques. Les quatre preuves ont été recadrées depuis leurs illustrations validées ; les douze menaces et le Joker sont repris sans modification des ZIP précédents.

Décompresser à la racine du dépôt CardForge. Vérifier les collisions avec GitHub avant copie ; ne pas écraser de fichier différent. Fusionner les 17 entrées du fragment dans le manifeste historique `_bmad-output/planning-artifacts/ux-designs/ux-CardForge-2026-11-24/assets-manifest.json`, sans remplacer les entrées existantes. Générer les WebP via `npm run assets:optimize`.

Gabarits existants : vert émeraude pour MS-P01–04, bordeaux pour MS-M01–12, anthracite pour joker-exfiltration. Noms et symboles fonctionnels dynamiques FR/EN. Conserver les identifiants physiques du moteur ; la correspondance des preuves et menaces avec les cartes techniques reste à définir. Ne jamais révéler une carte cachée. Réutiliser les menaces pour la défaite et le Joker pour la victoire.

Contrôles effectués : décodage, taille, mode, unicité des chemins et empreintes, intégrité ZIP. Contrôles à effectuer dans le dépôt : collisions, fusion du manifeste, optimisation, build, tests, PWA et E2E portrait/paysage. Aucun uv. Les 36 lieux et les fonds du plateau ne font pas partie de ce pack.
