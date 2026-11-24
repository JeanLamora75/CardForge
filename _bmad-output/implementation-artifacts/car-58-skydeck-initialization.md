# CAR-58 — Skydeck : initialisation
Date : 24 novembre 2026. Amelia — développement sur main, sans uv.
## Portée
Moteur autonome card-capture, préparation déterministe de 14 cartes personnelles et 40 adverses, quatre positions, retour des figures/As sous pioche, validation stricte des zones initiales. Le moteur est volontairement limité à la préparation : les phases et actions relèvent de CAR-59 et suivantes. Aucun accès catalogue, sauvegarde ou publication ajouté.
## Traçabilité
AC1 / CC-T01 : répartition, mélange injecté via createSeededRandom, 128 graines et conservation.
AC2 / CC-T02 : positions, trous, retour des cartes protégées ; cas zéro, deux et quatre figures/As.
AC3 / CC-T03 : main vide, phase ennemie, état initial valide, refus de transitions et états malformés.
CC-R01 reste ouvert : l'ordre de tirage est conservé lors du retour multiple, convention technique provisoire conformément au référentiel Mary. Pas de confirmation de la source primaire, donc pas de clôture de conformité intégrale. CC-T03 couvre seulement l'état initial ; la phase de défausse effective sera testée en CAR-59/60.
## Vérification
Tests Node intégrés à npm test. Résultats CI à constater sur le commit publié ; ne pas interpréter ce document comme un test exécuté.
