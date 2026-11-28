# Organisation du dépôt CardForge

Règle validée le 28 novembre 2026. Sally, Camille, Amelia, Winston et Murat respectent le classement par jeu. Les lots graphiques placent les documents et inventaires dans `docs/assets/<jeu>/`, les originaux dans `public/assets/`. Les chemins de manifestes restent relatifs à la racine du dépôt sauf mention explicite. Le manifeste principal BMAD conserve son emplacement. Le kit historique `assets/` reste provisoirement à son emplacement pour éviter une rupture de références non exhaustivement vérifiées. Son manifeste et sa notice sont archivés dans `docs/assets/skydeck/legacy-board-v1/`.

Fichiers versionnés autorisés à la racine :
- `.gitignore`
- `AGENTS.md`
- `README.md`
- `Test-CardForge.bat`
- `index.html`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.ts`

Les ajouts techniquement nécessaires exigent une mise à jour explicite de cette liste et du contrôle CI. Les caches, dépendances et compilations restent ignorés. Ne jamais supprimer une ressource de production pour ranger un document. Les archives binaires ont été déplacées à SHA Git identique.
