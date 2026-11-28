# CardForge

Collection de jeux de cartes solo illustrés : Thunderfighter, Grim Delve, Midnight Syndicate, Skydeck et Les Douze Tyrans.

## Recette locale Windows

Récupérer `main` avec GitHub Desktop, puis lancer `Test-CardForge.bat`. Les dépendances, caches et fichiers de compilation sont générés localement.

## Organisation

- `src/` : application et moteurs indépendants.
- `public/assets/` : ressources graphiques originales et sons.
- `docs/assets/` : documentation, manifestes de livraison et aperçus par jeu.
- `assets/` : ancien kit Skydeck, conservé provisoirement avec ses chemins historiques.
- `_bmad/`, `_bmad-output/`, `.agents/` : méthode et livrables BMAD.
- `scripts/`, `tests/` : construction et vérifications.

Voir [cadrage](docs/cadrage.md), [règles de rangement](docs/repository-layout.md) et [ancien kit Skydeck](docs/assets/skydeck/legacy-board-v1/README.md).
