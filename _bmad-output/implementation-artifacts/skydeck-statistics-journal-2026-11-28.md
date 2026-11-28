# Skydeck — Journal de bord (CAR-67 / CAR-68)

Date : 2026-11-28. Option A et SD-STAT-01 à 20 validées par le porteur. SD-STAT-R01 à 10 : compteurs en lecture seule, abandons exclus du taux, tutoriels et parties en cours exclus, aucun score inventé, conservation des données.

## Réalisation
Route statistiques Skydeck dédiée, logo et fond existants, parchemin du manuel, Alegreya SC, pictogrammes existants et drapeau SVG, compteurs et cadran dynamique, barre de distribution, état vide, chargement et erreur distincts, retour et paramètres intégrés, FR/EN, grille paysage. Aucun asset raster nouveau, aucun changement de stockage ni moteur. Composant de calcul réutilisable. Statut public du catalogue inchangé.

## Recette Murat
Les huit scénarios STAT-T01–08 sont ajoutés aux tests unitaires et E2E. Matrice existante : 320×568, 360×640, 390×844, 412×915, 768×1024, 844×390, 1024×768, 1920×1080. Tests E2E FR/EN, chargement des images, géométrie, navigation, rechargement hors ligne, absence de changement de sauvegarde. Les tests de régression existants restent en place.

Statut : implémentation proposée à la CI ; aucune réussite de CI présumée. Contrôle visuel et conformité CF-QUAL à confirmer sur preuves. Adaptation manuelle de BMAD sans uv ; le workflow rendu officiel n'a pas été exécuté. Jira CAR-67 et CAR-68 consultés sans modification.
