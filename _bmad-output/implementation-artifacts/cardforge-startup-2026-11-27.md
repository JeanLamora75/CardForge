# Démarrage CardForge — Amelia / Murat

Implémentation CF-LOAD-01 à 15 : lanceur Node natif avant dépendances ; page de chargement sur port loopback distinct ; Edge/Chrome avec profil existant ; onglet de production en arrière-plan, rechargement et contrôle du cache avant activation ; splash Web partagé ; optimisation incrémentale par empreintes. Aucun effacement du stockage de jeu. Pas de modification Jira.

Adaptation BMAD : pas de uv conformément au projet. Workflow local 04/05 utilisé. Tests de jalons, dépendances et cache d'illustrations ajoutés. CI et recette Windows à vérifier sur le commit effectif ; aucune validation d'exécution non réalisée n'est revendiquée.

Limites : pourcentage par jalons et non estimation de durée ; langue du splash de recette issue du navigateur (origine isolée), langue du splash Web issue du réglage CardForge. Edge/Chrome installés requis. La transition entre onglets n'est pas une animation continue garantie. Recette Windows physique, portrait/paysage, hors ligne et préservation d'une sauvegarde existante requise.

## Itération CF-LOAD-16 à 22
Progression IPC par illustration ; concurrence bornée ; migration de cache ; empreintes complètes des entrées et sorties build ; contrôles PWA conservés ; tests de progression, concurrence et invalidation. Le cache est local et ignoré par Git. Le premier lancement ou un changement de source nécessite une compilation. Les lectures et empreintes restent nécessaires, même à chaud. Pas de gain chiffré sans mesure Windows.
 
### Murat — constat CI précédent
Run 46014482975 : tests unitaires, IndexedDB, audits, build et vérification PWA réussis ; E2E échec dans stalePreviewRecovery, update() de la registration obsolète (Not found). Correction : document neutre avant unregister, sortie de l'ancien document puis navigation réelle, suppression de l'update() redondant ; maintien du contrôle de la version exacte et du scénario E2E. Validation du nouveau commit à consulter dans Actions. Aucun uv ni test local revendiqué.
