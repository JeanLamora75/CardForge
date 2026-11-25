# CAR-89 — Plateau compact V2

Bandeau dédié et aide repliée, carte courante avant le plateau en portrait et latérale en paysage, géométrie constante, marqueurs compacts, réserve vide sur une ligne, valeur numérique unique. Illustrations inchangées (CAR-90). Contrôle E2E du focus rendu déterministe et assertions structurelles ajoutées. CI initiale 45642693283 : unitaires/build/PWA réussis, E2E focus en échec. Nouvelle CI requise ; recette visuelle et couverture complète TF-UX-20 non attestées. Workflow manuel sans uv.

## V3
Publication après revue utilisateur : fond spatial local, console permanente, dimensionnement selon dvh, dialogue natif d'aide, suppression du panneau armure redondant. CI V2 en échec sur notification de reprise Midnight Syndicate : test aligné sur le message de reprise et contrôle exact du snapshot. Nouveaux contrôles géométriques à exécuter. Validation non acquise.

## V4
CI précédente 45655483334 : compilation et unitaires réussis, parcours FR clavier réussi, échec E2E visibilité simultanée sur mobile. Grille unique et budget viewport remplacent les règles de hauteur conflictuelles. Gestes Pointer Events, aperçu et tests ajoutés. Pas de modification moteur/stockage. Validation CI V4 non acquise. Workflow manuel sans uv.

## V5
CI V4 45656684281 : unitaires, build, PWA réussis ; E2E square board en échec, 26 captures archivées. Suppression des contraintes V4 et de la zone console défilable ; hauteur intrinsèque, plateau largeur et hauteur explicites ; réserve compacte et historique recherche superposé. Tests de matrice ajoutés ; couverture effective et captures V5 à vérifier. Aucun uv ni modification moteur/stockage.

## Correctif tactile V5.1
CI 45658106464 : 465 tests unitaires réussis, 78 mesures géométriques sans débordement ni commandes hors viewport, parcours FR clavier/souris complet ; échec du dépôt tactile. Hypothèse : transfert de capture implicite tactile du descendant vers le conteneur déclenche lostpointercapture et annule le geste. Capture explicite sur la carte dès pointerdown, propriétaire conservé jusqu'à la fin ; événements de perte filtrés, suppression de l'annulation pointerleave. Test tactile conservé, capture d'échec et absence de dialogue parasite ajoutées. CSS, moteur et stockage inchangés. Validation CI requise.
