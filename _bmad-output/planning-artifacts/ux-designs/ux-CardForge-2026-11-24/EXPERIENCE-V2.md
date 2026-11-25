# CardForge — Référentiel UX V2
Date : 24 novembre 2026. Responsable : Sally. Décisions validées par le porteur.
Ce document prévaut sur les dispositions UX antérieures incompatibles, sans modifier les règles des moteurs ni les restrictions de publication.

| ID | Décision validée |
|---|---|
| UX-01 C | Portrait et paysage, compositions adaptées, sans mutation de partie lors de rotation. |
| UX-02 A | Galerie immersive, défilement vertical tactile naturel, jaquettes sélectionnables, position mémorisée. |
| UX-03 D | Fond premium minimaliste charbon, or discret, animation lente désactivable. |
| UX-04 B | Menu principal indépendant pour chacun des cinq jeux. |
| UX-05 | Illustration plein écran, boutons texturés thématiques en bas en portrait et paysage, transition animée au clic avant navigation. |
| UX-06 B | Illustrations vivantes : effets atmosphériques indépendants, lents, hors ligne, réduction des mouvements respectée. |
| UX-07 C | Plateau immersif intégré au décor, 100 % surface disponible, sans scroll ni bandeau global. |
| UX-08 C | Cartes premium illustrées, puissance et faction lisibles, inspection agrandie, aucune nouvelle mécanique. |
| UX-09 C | Drag and drop souris/tactile et alternative sélection puis destination ; seules les actions légales du moteur sont proposées. |
| UX-10 C | Tap sélection, appui long inspection, focus avancé en complément sans conflit avec le drag. |

## Première livraison : six écrans
Accueil : galerie illustrée, paramètres et langue discrets, indicateur de sauvegarde réelle. Deux colonnes en portrait selon cadrage initial, composition responsive ; la planche validée montre des bannières horizontales, à privilégier pour la fidélité visuelle. Pas de défilement dans les menus individuels. Les plateaux restent hors périmètre de cette livraison.
Menu : fond sans texte incrusté, titre et commandes indépendants, accessibles et traduisibles FR/EN. Reprendre seulement si sauvegarde active ; nouvelle partie avec confirmation de remplacement ; apprendre isolé ; règles ; statistiques ; retour galerie. Préserver accès aux préversions internes sans débloquer la diffusion publique. Transition 300–450 ms, immédiate si mouvement réduit ; prévention des doubles clics ; sauvegardes intactes.

| Jeu | Fond et matière | Ambiance |
|---|---|---|
| CardForge | Charbon, motifs cartes, dorures | Lueurs lentes |
| Thunderfighter | Combat spatial pulp, métal bleu | Étoiles, radar |
| Grim Delve | Donjon gothique, pierre et acier | Torches, fumée |
| Midnight Syndicate | Ville 1930 noir, laiton Art déco | Pluie, reflets |
| Skydeck | Navires volants, bois et cuivre | Nuages, vent |
| Les Douze Tyrans | Wuxia/Chanbara, laque et jade | Brume, lanternes |

## Ressources
Six maquettes et six fonds PNG originaux générés dans la conversation et validés visuellement par le porteur pour les maquettes. Les fonds seuls sont des déclinaisons, pas des captures pixel-identiques.
Destination prévue : `public/assets/worlds/{cardforge,thunderfighter,grim-delve,midnight-syndicate,skydeck,les-douze-tyrans}.png`.
Maquettes : `mockups/{cardforge,thunderfighter,grim-delve,midnight-syndicate,skydeck,les-douze-tyrans}.png` dans ce dossier.
**Statut :** 46 PNG présents sur main. Voir ASSETS.md pour le pipeline d’optimisation, les limites et le manifeste.
## Recette
Murat : 320×568, 390×844, 844×390, tablette et desktop ; navigation tactile/souris/clavier, FR/EN, retour position galerie, sauvegardes inchangées, absence de scroll des menus, mouvement réduit, ressources locales et PWA hors ligne. Comparer les captures avec les maquettes approuvées. Aucune validation CI prétendue sans exécution réelle.
