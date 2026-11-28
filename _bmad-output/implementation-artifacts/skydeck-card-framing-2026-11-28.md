# Skydeck — cadrage des cartes SD-CARD-FRAME-01 à 10

28 novembre 2026. Validé par le porteur. Capture : visages partiellement masqués par les écussons du haut ; certains navires trop serrés. Le cadre Marine original a été consulté visuellement ; les portraits et navires sources n'ont pas pu être décodés via le connecteur (contenu binaire vide). Les réglages sont donc une première calibration d'affichage, pas une validation artistique carte par carte.

- 01 : métadonnées typées partagées CardArtworkFraming, valeurs par type et surcharges par identifiant physique.
- 02/03/08 : portraits abaissés, navires légèrement réduits ; priorité diamonds-13, spades-11, joker-1/2, hearts-5/6/8. Fond continu flouté sous l'illustration pour éviter une bande vide.
- 04–07 : même renderCard main/ennemis, cadre, valeur et faction inchangés, aspect préservé via object-fit, aucune modification des ressources originales.
- 09 : tests des 54 identifiants, contrôles E2E de géométrie en Jouer/Apprendre et matrices existantes FR/EN portrait/paysage ; rendu et CI à confirmer.
- 10 : type et fonction CSS réutilisables par les autres jeux ; déploiement dans ces jeux uniquement après validation de Skydeck, sans modification de leurs plateaux à ce stade.

Aucun changement moteur, sauvegarde, statistiques ou Jira. Aucun uv. Validation visuelle nécessaire pour affiner les surcharges de cadrage.
