# CAR-92 — Fin de mission

TF-END-01–09 : écran exclusif, fond victoire et défaite local, trois métriques, actions visibles, statistiques secondaires, tutoriel isolé, animation globale existante et mouvement réduit, FR/EN et offline. Le score officiel reste la valeur moteur. Fond vectoriel original ; la maquette cinématique est une référence artistique, pas un asset directement utilisé. CI et captures des six résolutions restent nécessaires. Correction concomitante du test de combat : secteur sud-est index 8, Dame de Cœur dans ce secteur, sans modification moteur. Aucun uv.

## Intégration des illustrations définitives
Les trois WebP fournis par le porteur du projet sont présents sur main (commit 8999d54) : défaite 140722 octets, victoire 118546 octets, entraînement 216882 octets. Références CSS remplacées ; anciens fonds de fin SVG supprimés, fond thunderfighter-space.svg conservé pour le plateau. Vérification PWA enrichie pour les trois nouvelles ressources. Pas de modification du moteur, du stockage ni de la disposition. CI à vérifier.

## Finition V2 TF-END-20–30
Composant Command exporté sans modification de l'accueil ; trois emblèmes SVG décoratifs, typographie Rajdhani, boutons illustrés partagés, rapport compact avec fermeture haut/bas et focus restauré. Aucun changement moteur ou stockage. Les emblèmes sont des ressources vectorielles, non des peintures cinématiques. CI précédente 45673995541 réussie ; nouvelle CI et captures des trois états sur six résolutions à vérifier. Workflow manuel sans uv.
