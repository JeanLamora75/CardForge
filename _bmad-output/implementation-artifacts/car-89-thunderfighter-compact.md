# CAR-89 — Plateau compact V2

Bandeau dédié et aide repliée, carte courante avant le plateau en portrait et latérale en paysage, géométrie constante, marqueurs compacts, réserve vide sur une ligne, valeur numérique unique. Illustrations inchangées (CAR-90). Contrôle E2E du focus rendu déterministe et assertions structurelles ajoutées. CI initiale 45642693283 : unitaires/build/PWA réussis, E2E focus en échec. Nouvelle CI requise ; recette visuelle et couverture complète TF-UX-20 non attestées. Workflow manuel sans uv.

## V3
Publication après revue utilisateur : fond spatial local, console permanente, dimensionnement selon dvh, dialogue natif d'aide, suppression du panneau armure redondant. CI V2 en échec sur notification de reprise Midnight Syndicate : test aligné sur le message de reprise et contrôle exact du snapshot. Nouveaux contrôles géométriques à exécuter. Validation non acquise.

## V4
CI précédente 45655483334 : compilation et unitaires réussis, parcours FR clavier réussi, échec E2E visibilité simultanée sur mobile. Grille unique et budget viewport remplacent les règles de hauteur conflictuelles. Gestes Pointer Events, aperçu et tests ajoutés. Pas de modification moteur/stockage. Validation CI V4 non acquise. Workflow manuel sans uv.
