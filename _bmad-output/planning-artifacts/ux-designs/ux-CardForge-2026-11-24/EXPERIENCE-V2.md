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

## Affinage visuel des menus — 25 novembre 2026
Suite à la recette visuelle du menu Thunderfighter : conserver les illustrations originales, les commandes larges et Retour en dernière position. Donner la priorité visuelle à Reprendre (si sauvegarde active) ou Nouvelle partie ; atténuer les autres textures sans sacrifier les libellés ; conserver des espacements réguliers et des cibles de 44 px minimum. Pas de modification des actions ou des sauvegardes. Ces choix de finition sont proposés par Sally et implémentés pour recette, non encore validés visuellement par le porteur.

## Accueil — affinage validé le 25 novembre 2026
Portrait : une jaquette par ligne, largeur maximale 420 px, galerie défilante tactile. Paysage mobile/tablette : deux colonnes ; desktop trois. Logo centré, état hors ligne discret, aucun sélecteur de langue ni bouton Paramètres en haut de la galerie. Dernière carte Paramètres, de même format, avec emblème mécanique doré et fond CardForge réutilisé, ouvre les réglages existants (langue, son, accessibilité, confidentialité). La langue ne se règle que dans cet écran. Badge Partie en cours sous forme de cartouche sombre doré. Les paramètres restent accessibles depuis les écrans de jeu non immersifs pour préserver le parcours existant. Aucun changement des données de jeu. Captures et CI à vérifier.

## Galerie panoramique — 25 novembre 2026
Demande validée : cartes deux fois plus larges que hautes (2:1), une par ligne en portrait, Paramètres en dernière position au même ratio. Réutiliser les illustrations paysage et les logos séparés pour éviter de couper les titres des anciennes jaquettes verticales. Retirer le titre de galerie et les messages de réussite hors ligne/connexion de l'accueil ; conserver le service worker, les alertes d'installation et le nom accessible de la galerie. Cartouche de sauvegarde compact. Menus et moteurs inchangés.

## Menus immersifs — composition simplifiée (25 novembre 2026)
Brief Sally : logo centré, illustration dominante, zone de commandes en bas avec voile propre à chaque univers, commandes compactes et Retour entièrement visible. Supprimer crédits et mentions du menu et du pied de page ; accès Paramètres > Crédits et licences > Retour aux paramètres. Les droits et verrous de publication restent inchangés.
Implémentation Amelia : remplacer les règles CSS accumulées par une seule composition flex, dimensionnée sur visualViewport, sans coordonnées calculées par multiplication CSS ; conserver 44 px minimum et une marge basse de 48 px en taille standard. Les tests vérifient le centrage, l'accès aux crédits et les commandes. Validation CI et visuelle à constater.

## Contrainte de composition des menus — 25 novembre 2026
La moitié supérieure est réservée à l’illustration : aucune commande au-dessus du milieu de la surface visible. Marge basse dynamique de 16 à 32 px hors zone sûre. Cinq commandes au maximum : fusion de Reprendre et Ouvrir le plateau, qui déclenchaient exactement la même action. Nouvelle partie reste disponible via le plateau existant. Disposition en plusieurs colonnes si cinq cibles de 44 px avec espacement de 6 px ne tiennent pas dans la moitié basse. Les tests contrôlent les limites géométriques, avec ou sans sauvegarde. Validation CI à constater.

## Recette Windows — surface réelle
Hypothèse principale après captures répétées : le lanceur impose un viewport Pixel 7 de hauteur fixe, qui peut dépasser la zone cliente réellement visible dans la fenêtre Windows. Le lanceur conserve le profil, le port et les données, mais ne force plus de viewport émulé : la fenêtre étroite est redimensionnable et le layout s’adapte à sa surface réelle. Les tests de géométrie sont exécutés avant le scénario de cache historique, qui bloquait jusqu’ici leur exécution. Validation Windows à confirmer.

## Recette — échelle du lanceur
Captures : galerie et menus réduits à environ un quart de la largeur ; décor plein écran. Hypothèse zoom navigateur persistant ou métriques forcées. Réinitialiser uniquement les préférences de zoom du profil de test, supprimer le facteur de pixels forcé et l’émulation tactile du lanceur Windows ; journaliser dimensions CSS, fenêtre, DPR et échelle. En portrait étroit : jaquettes 2:1 et zone de commandes au moins 85 % de la largeur, logo catalogue au moins 50 %. Maintenir commandes dans la moitié inférieure, marge basse et cibles de 44 px. Validation réelle Windows encore nécessaire.
