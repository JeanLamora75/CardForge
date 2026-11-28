# Skydeck — Journal de bord (CAR-67 / CAR-68)

Date : 2026-11-28. Option A et SD-STAT-01 à 20 validées par le porteur. SD-STAT-R01 à 10 : compteurs en lecture seule, abandons exclus du taux, tutoriels et parties en cours exclus, aucun score inventé, conservation des données.

## Réalisation
Route statistiques Skydeck dédiée, logo et fond existants, parchemin du manuel, Alegreya SC, pictogrammes existants et drapeau SVG, compteurs et cadran dynamique, barre de distribution, état vide, chargement et erreur distincts, retour et paramètres intégrés, FR/EN, grille paysage. Aucun asset raster nouveau, aucun changement de stockage ni moteur. Composant de calcul réutilisable. Statut public du catalogue inchangé.

## Recette Murat
Les huit scénarios STAT-T01–08 sont ajoutés aux tests unitaires et E2E. Matrice existante : 320×568, 360×640, 390×844, 412×915, 768×1024, 844×390, 1024×768, 1920×1080. Tests E2E FR/EN, chargement des images, géométrie, navigation, rechargement hors ligne, absence de changement de sauvegarde. Les tests de régression existants restent en place.

Statut : implémentation proposée à la CI ; aucune réussite de CI présumée. Contrôle visuel et conformité CF-QUAL à confirmer sur preuves. Adaptation manuelle de BMAD sans uv ; le workflow rendu officiel n'a pas été exécuté. Jira CAR-67 et CAR-68 consultés sans modification.

## Finitions SD-STAT-21 à 38
Validées par le porteur après recette visuelle du premier écran. 21–23 : bandeau du manuel, contraste, navigation avec flèche existante et boutons laiton. 24–26 : compteur compact, valeur agrandie, boussole contrastée. 27–30 : pictogrammes agrandis, médaillon SVG abandon, encadrements et chiffres renforcés. 31–34 : cadran SVG laiton, aiguille exacte (aucune si taux indéfini), graduations 0/50/100, victoires sur parties achevées et exclusion explicite. 35–36 : titre répartition et espacements. 37–38 : règles CSS compactes portrait/paysage et tests E2E FR/EN étendus (aiguille, libellés, bandeau et géométrie). Aucun asset raster supplémentaire, aucun changement de modèle ni de persistance. Recette navigateur et CI à confirmer ; aucune réussite présumée.

## Finitions SD-STAT-39 à 43
Validées par le porteur : boussole dorée détaillée et médaillon abandon enrichi (SVG intégrés, sans nouveaux fichiers raster), deux rivets latéraux au cadran, libellé « Campagnes clôturées » avec précision « Terminées ou abandonnées » (réserve de Mary), pourcentages de répartition agrandis. FR/EN, dimensions compactes conservées sur petites surfaces. Tests E2E étendus aux libellés, médaillons, rivets et géométrie ; exécution complète et contrôle visuel à confirmer. Aucun changement des moteurs, données, sauvegardes ni règles de calcul. Aucun script uv.
