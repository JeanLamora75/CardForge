# CardForge — CF-OPT-01 à CF-OPT-12

28 novembre 2026. Baseline issue du journal utilisateur : démarrage 19,72 s, build 12,13 s, Vite 6,01 s, JS initial 602,34 kB (gzip 189,45 kB), CSS 216,84 kB, 974 ressources hors ligne. Avertissement startup.css et chunk > 500 kB.

## Réalisation
- 01–02 : public/startup.css existe ; référence publique Vite /startup.css, base ./ conservée ; vérification du href émis et précache.
- 03–06 : App importait GameLearning et les écrans spécifiques de manière statique ; GameLearning importait quatre plateaux et deux manuels. Imports React.lazy par plateau et écran, frontières Suspense localisées, indicateur FR/EN. Les styles partagés et la navigation restent disponibles dès l'ouverture. Regicide est chargé via son module Learning dédié. Pas de hausse du seuil Vite.
- 07 : le worker précache tous les fichiers générés, y compris les imports dynamiques et leurs CSS ; contrôle exhaustif des chunks émis et des cinq plateaux absents du graphe initial.
- 08/11 : rapport de build relatif, tailles brutes, dépendances statiques initiales et total JS ; comparaison automatique à 602340 octets, plafond 500000 par chunk ; mesures DOMContentLoaded et ouverture hors ligne dans Playwright (mesures de diagnostic, pas de seuil temporel arbitraire).
- 09 : aucun changement de stockage, profil navigateur, moteur, launcher ni format des sauvegardes.
- 10 : tests existants conservés, ajout d'une recette hors ligne à froid des cinq plateaux et test unitaire du précache dynamique.
- 12 : CI et nouvelles mesures à confirmer sur un build réel ; aucune réussite présumée.

Adaptation manuelle BMAD sans uv. Aucun changement Jira. Les gains de temps ne sont pas déductibles de la seule taille du JS ; le précache intégral demeure requis.
