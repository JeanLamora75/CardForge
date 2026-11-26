# CardForge — Référentiel commun des ressources graphiques

Version 1.0 — 26 novembre 2026 — Sally / Amelia (proposition de standardisation validée pour la préparation du lot V2).

## Périmètre et conventions
Les cinq slugs stables sont `grim-delve`, `thunderfighter`, `skydeck`, `midnight-syndicate`, `les-douze-tyrans`. `cardforge` désigne les ressources communes. Les identifiants des moteurs et des sauvegardes ne changent pas.

| Catégorie | Usage | Statut |
|---|---|---|
| worlds | Fonds de menus portrait | Existant |
| worlds-landscape | Fonds de menus paysage | Existant |
| covers | Couvertures | Existant |
| logos | Logos | Existant |
| buttons | Boutons | Existant |
| banners | Bandeaux | Existant dans le manifeste |
| effects | Effets visuels | Existant |
| boards | Fonds de plateau | Grim Delve déjà publié |
| hud | Indicateurs et compteurs | Extension proposée |
| icons | Icônes et navigation | Extension proposée |
| frames | Encadrements | Extension proposée |
| ornaments | Décorations | Extension proposée |
| cards | Illustrations et dos de cartes | Extension proposée ; vérifier les chemins historiques avant migration |

Sources : `public/assets/<categorie>/.../*.png`. Dérivés : `public/art/<categorie>/.../*.webp`, exactement le même chemin relatif et nom de base. Les fichiers historiques `categorie/<slug>.png` restent inchangés. Pour les nouveaux ensembles, utiliser `categorie/<slug>/<nom-fonctionnel>.png`, par exemple `logos/grim-delve/board.png`. Le fond déjà publié `boards/grim-delve.png` reste en place. Noms ASCII minuscules en kebab-case ; états suffixés `-active`, `-disabled`, etc. Pas de nouveau dossier racine par jeu, ni de WebP dans assets. Aucun déplacement massif des fichiers existants sans inventaire des références et tests.

## Production graphique
PNG maître RGB pour fonds opaques, RGBA pour éléments détourés. Pas de textes fonctionnels ni de valeurs figées dans les images ; exception : logotypes. Les chiffres, règles, libellés et états proviennent du moteur et de la traduction FR/EN. Préserver le ratio, les zones de sécurité, le contraste et les cibles tactiles ; gérer focus, désactivation et réduction des animations en CSS/HTML. Préférer des composants extensibles pour les bandeaux et cadres. Les cartes seront traitées séparément ; leurs illustrations ne doivent pas révéler de données cachées.

## Manifeste et optimisation
Le manifeste historique `_bmad-output/planning-artifacts/ux-designs/ux-CardForge-2026-11-24/assets-manifest.json` est actuellement lu par `scripts/optimize-art.mjs`. Chaque entrée comporte `path`, `width`, `height`, `mode`, `sha256` (empreinte du PNG). Ajouter les nouvelles entrées sans remplacer le tableau existant ; vérifier absence de doublon de chemin et correspondance des empreintes. Le lot fournit un fragment compatible. Pour le fond déjà présent, calculer son empreinte à partir du vrai fichier du dépôt et l'ajouter s'il manque. Ne pas inventer son empreinte SHA-256 à partir du SHA Git.

Le script actuel génère WebP avec Sharp, qualité 82, alphaQuality 90, sans agrandissement, dimensions maximales 1600 pour worlds, 760 pour covers, 1000 pour les autres catégories. Le V2 contient des dérivés préoptimisés (Pillow, qualité 82), à régénérer via `npm run assets:optimize` pour obtenir les dérivés canoniques. Les PNG maîtres restent inchangés. Ne jamais modifier un dérivé seul. Une éventuelle évolution des tailles devra être documentée et testée.

## PWA et intégration
`vite.config.ts` inclut récursivement les WebP de public/art ; sa liste de PNG précachés est actuellement limitée à worlds, worlds-landscape, logos, covers, buttons, effects. Amelia doit faire référencer les nouveaux éléments via leurs WebP (URL compatible avec base relative Vite), ou adapter explicitement le précache si un PNG est utilisé à l'exécution. Intégrer le fond de plateau au manifeste et utiliser son dérivé. Ne pas supposer que la présence d'un fichier dans public garantit son cache. Vérifier versionnement, invalidation, accès hors ligne après premier chargement et absence de doublons de cache inutiles.

## Contrôle de livraison
Comparer chaque chemin cible à GitHub avant copie ; ne jamais écraser un fichier différent sans validation. Conserver les menus existants et les moteurs. Vérifier dimensions, transparence, empreintes, chemins et décodage, puis `npm run assets:optimize`, `npm run build`, `npm run test`, `npm run verify:pwa`, `npm run test:e2e:production` et CI. Contrôler mobile portrait/paysage, tablette, ordinateur, FR/EN, clavier/tactile et hors ligne. Aucun uv. Les tests doivent être réellement exécutés avant validation. Les changements de référentiel et de code doivent être tracés dans BMAD/GitHub ; ce document ne prétend pas que la migration des cinq jeux est effectuée.

## Références
- https://github.com/JeanLamora75/CardForge/blob/main/scripts/optimize-art.mjs
- https://github.com/JeanLamora75/CardForge/blob/main/vite.config.ts
- https://github.com/JeanLamora75/CardForge/blob/main/_bmad-output/planning-artifacts/ux-designs/ux-CardForge-2026-11-24/assets-manifest.json
- https://github.com/JeanLamora75/CardForge/blob/main/src/components/ImmersiveMenu.tsx

## Intégration du lot Grim Delve V2
Les 34 entrées du fragment sont intégrées au manifeste historique (80 entrées statiques). Le fond de plateau est ajouté à la liste effective par le script après vérification de son empreinte Git SHA-1 et lecture de ses métadonnées réelles ; son SHA-256 est calculé sur les octets locaux. Cela évite de déclarer une empreinte non vérifiée via le connecteur. Les fonds de plateau sont optimisés à 1600 px maximum. Le précache couvre les catégories du référentiel, y compris les PNG utilisés directement. Les WebP restent des produits de compilation ignorés par Git, sauf exceptions historiques. La validation CI reste requise.
