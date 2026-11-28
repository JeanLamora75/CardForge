# Skydeck — Manuel de l’Amiral — ressources V1

Extraire à la racine du dépôt CardForge, en conservant les chemins. Nouveau dossier `public/assets/manual/skydeck/`, suivant la convention catégorie/jeu existante. Aucun fichier de jeu existant remplacé.

- parchment-texture.png : fond de lecture opaque.
- page-frame.png : cadre RGBA, centre transparent ; superposer au parchemin. Zone utile conservatrice : x=120–904, y=160–1376 sur 1024×1536. Adapter sans déformer les ornements sur les autres ratios.
- admiral-mission.png : introduction narrative.
- fleet-assembly.png : préparation de la flotte.

Amelia : fusionner les quatre entrées du manifeste fourni dans `_bmad-output/planning-artifacts/ux-designs/ux-CardForge-2026-11-24/assets-manifest.json` sans écraser les entrées existantes, puis utiliser le pipeline optimize-art.mjs (WebP). Aucun WebP dérivé livré. Aucun texte incrusté. Les scènes sont narratives, pas des schémas normatifs de factions.

Contrôles : décodage PNG, dimensions, mode, transparence centrale du cadre (alpha <=2 nettoyé), composition sur parchemin, SHA-256, intégrité ZIP. Intégration et rendu responsive non testés.
