# Thunderfighter — Fluidité et immersion du gameplay

Validation du porteur : 28 novembre 2026. TF-GAME-01 à TF-GAME-22. Statut : spécification validée, implémentation et recette non validées.

## Critères d'acceptation
| ID | Critère |
|---|---|
| TF-GAME-01 | Le placement légal du lieutenant initial est validé directement. |
| TF-GAME-02 | Le placement légal du commandant initial est validé directement. |
| TF-GAME-03 | Enchaîner les figures initiales sans confirmation, quel que soit leur nombre. |
| TF-GAME-04 | Expliquer le remplacement facultatif d'un chasseur et ses conséquences. |
| TF-GAME-05 | Engager le combat sans confirmation de la conservation de grille. |
| TF-GAME-06 | Après préparation, première pioche automatique uniquement si elle est la seule action légale ; aucune automatisation sur reprise. |
| TF-GAME-07 | Préserver toutes les décisions légales, notamment les équipements avant la pioche. |
| TF-GAME-08 | Transmission intégrée à la console, sans modale. |
| TF-GAME-09 | Progression dynamique du déploiement initial. |
| TF-GAME-10 | Effet radar de détection/déploiement, respect du mouvement réduit. |
| TF-GAME-11 | Transition immersive vers le combat sans blocage. |
| TF-GAME-12 | Effets audio via le service existant et les préférences. |
| TF-GAME-13 | Vocabulaire tactique cohérent, sans ambiguïté sur les règles. |
| TF-GAME-14 | Équipements tactiques identifiables, états disponibles/indisponibles. |
| TF-GAME-15 | Ciblage radar accessible, distinction sélection/légalité. |
| TF-GAME-16 | Radar stable entre phases à viewport constant. |
| TF-GAME-17 | Console stable, sans scroll global ni interne. |
| TF-GAME-18 | Confirmation réservée aux décisions sensibles ; préserver prévisualisation tactique utile. |
| TF-GAME-19 | Tactile, souris, clavier et focus vérifiés. |
| TF-GAME-20 | Même interface et automatisations en Jouer et Apprendre (CF-QUAL-11 à 13). |
| TF-GAME-21 | FR/EN, ressources locales et PWA hors ligne. |
| TF-GAME-22 | Tests moteur, interactions et huit résolutions mobiles, preuves CI. |

## Contraintes techniques
Ne pas modifier le moteur pour des raisons de présentation. Utiliser les actions légales du moteur, la session existante et les sauvegardes atomiques. Préserver la confirmation du remplacement irréversible et les prévisualisations de combat sensibles. Réutiliser CSS/SVG et les ressources existantes. Aucun uv. Publication main autorisée. Ne pas annoncer la livraison complète avant vérification réelle.
