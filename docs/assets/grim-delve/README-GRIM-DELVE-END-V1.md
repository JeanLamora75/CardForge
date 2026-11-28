# Grim Delve — Pack de fin V1 (GD-END-01 à 12)

## Installation
Décompresser à la racine CardForge. Le lot est additif. Les trois PNG sont les seuls nouveaux originaux à intégrer au manifeste principal. Les WebP sont préoptimisés (Pillow qualité 82) et ignorés par Git selon le référentiel ; les régénérer avec le script Sharp officiel. Vérifier les collisions avant copie. Les maquettes de référence restent dans BMAD, jamais utilisées comme écran interactif.

## Ressources neuves
- `banners/grim-delve/end-defeat-damage` : bouclier et épée brisée.
- `banners/grim-delve/end-defeat-exhaustion` : aventurier et lanterne éteinte.
- `banners/grim-delve/end-victory` : héros et trésor.
Chaque scène est un découpage RGB 941 × 338 des maquettes validées, sans texte ni données. Afficher via `import.meta.env.BASE_URL + "art/banners/grim-delve/end-...webp"`. Ratio 941:338, ne pas étirer. La pointe de l'épée de victoire était superposée au HUD original et n'est pas incluse dans le recadrage. Les bordures UI ne sont pas découpées avec leurs textes : elles sont reconstruites à partir des composants existants.

## Réutilisation du manifeste actuel (chemins relatifs sous public/art, extension .webp)
| Élément | Ressource |
|---|---|
| Logo | logos/grim-delve/board |
| Navigation | icons/grim-delve/back, help, settings |
| Fond | boards/grim-delve (déjà utilisé sur le plateau) |
| Fronton facultatif | hud/grim-delve/panel-segmented |
| Cadre du rapport | frames/grim-delve/panel-wide (préserver les coins via border-image ou composition CSS) |
| Cartouches métriques | frames/grim-delve/panel-compact, hud/grim-delve/counter-frame |
| Titres et score | banners/grim-delve/title-wide, title-small |
| Parchemin | banners/grim-delve/parchment |
| Icônes des métriques | hud/grim-delve/skull, heart-filled, deck |
| Boutons | buttons/grim-delve/primary, secondary, danger, disabled |
| Ornements | ornaments/grim-delve/divider, ruby-small, glow |

## Contrat Amelia
- Remplacer le plateau interactif lorsque l'état est terminal. Les maquettes montrent un rappel des compteurs en haut : le conserver seulement s'il n'empêche pas les commandes principales de tenir à l'écran ; sinon garder uniquement le rapport. Aucun plateau actif sous le résultat.
- Choisir la scène par outcome/endReason ; reprendre les valeurs réelles du moteur et les libellés FR/EN. Les chiffres des maquettes sont illustratifs, notamment le score de victoire 12 incompatible avec une pioche affichée à 0 : utiliser exclusivement le score officiel renvoyé par le moteur, sans inventer de score.
- Trois métriques en ligne : monstres vaincus, dégâts, mains jouées. Score officiel seulement en victoire. Message narratif selon le nombre de monstres. Nouvelle expédition, statistiques (dialogue), catalogue, dernier plateau (lecture seule, ne jamais révéler les cartes masquées).
- Boutons HTML accessibles, focus visible, cibles 44 px, pas d'action cachée dans une image. Sur petits écrans, repli défilable plutôt que couper les commandes. Vérifier 390×844 et 590×890, portrait/paysage, FR/EN. Animations CSS facultatives selon préférence de mouvement, sans bloquer la navigation.
- Préserver sauvegardes, règles, statistiques et non-double-comptabilisation. Vérifier les trois issues réelles, reprise terminale et PWA hors ligne. Contrôler les empreintes, fusionner les trois entrées, exécuter assets:optimize, build, test, verify:pwa, test:e2e:production et CI. Aucun uv.

## Statut
Découpage et contrôles locaux uniquement ; aucune modification GitHub ou Jira, aucune validation du rendu dans le jeu. Les éléments décoratifs existants peuvent différer légèrement de la maquette générée ; privilégier la cohérence avec le plateau et la réutilisation.
