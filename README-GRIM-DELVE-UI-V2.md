# Grim Delve — UI V2

Extraire à la racine du dépôt CardForge après contrôle des collisions. Aucun fichier historique du manifeste connu n'est remplacé. Le nouveau logo est `public/assets/logos/grim-delve/board.png` ; conserver le logo des menus. Le fond `public/assets/boards/grim-delve.png` déjà publié n'est pas fourni. Les cartes sont exclues.

Amelia : fusionner les 34 entrées de `assets-manifest-additions.json` dans le manifeste actif (ne pas le remplacer), ajouter le fond existant après calcul de son empreinte, puis régénérer les WebP via le script du projet. Le fragment n'est pas lu automatiquement. Utiliser les WebP de public/art pour les nouveaux composants. Contrôler le cache et la CI comme indiqué dans docs/graphic-assets-standard.md.

Correspondance : logo board pour l'en-tête ; icons pour retour/aide/paramètres/info ; hud pour compteurs ; frames/panel-wide et hud/divider-1 pour le HUD responsive ; banners pour titres et aide ; buttons/primary pour fin de main, danger pour défausse, secondary pour actions annexes ; ornaments pour décoration. Les cœurs pleins représentent les dégâts subis sous réserve de confirmation du moteur. Aucun texte fonctionnel intégré. Les icônes poubelle et chevrons peuvent provenir des composants existants.

Dérivés WebP préoptimisés avec Pillow, à régénérer avec Sharp. Pas de modification du code ni de validation CI dans cette livraison. Aucun fichier publié automatiquement.
