# CAR-66 — Plateau Skydeck
Amelia avec revue de conception selon le skill Sally et DESIGN.md existant, sans uv.
AC1 : quatre positions en ordre 4–1, main, phase, compteurs, sélection, aperçu annulable, confirmation par createGameSession derrière une façade ne retournant que inspectSkydeck. AC2 : A/B/C distinctes, référence Joker explicite, erreurs FR/EN ; aucune donnée de pile ni graine rendue. AC3 : commandes natives clavier/tactile, focus, symboles et noms de factions, motif aéronef SVG original fixe et provisoire (pas d'illustrations finales individuelles), grille responsive, réduction de mouvements. Les noms de factions Soleil/Cristal/Brume/Nuit sont des choix provisoires de présentation, aucune incidence métier. AC4 : accès depuis fiche et hash interne, catalogue et gate publics inchangés. Session en mémoire uniquement, perdue en quittant la route ; sauvegarde, tutoriel et statistiques CAR-67. Tests unitaires façade, route et présentation ; parcours navigateur production FR/EN clavier/tactile jusqu'à phase capture, annulation et absence d'écriture. CI précédente verte, nouvelle CI à constater. CC-R01–04 restent ouverts.

## Intégration graphique
54 illustrations et 5 cadres reliés aux identifiants physiques ; correspondance visuelle choisie : cœurs Pirates, carreaux Marine, trèfles Guilde, piques Chevaliers. Fond issu du décor Skydeck existant, pas de nouveau cockpit dédié. Moteur et sauvegarde inchangés. Tests de correspondance et assertions PWA ajoutés ; exécution CI à constater. Adaptation manuelle sans uv ; workflow BMAD build officiel non exécuté.


## Refonte immersive SD-BOARD-01 à 13
Fond pleine page et logo existants, navigation par icônes, suppression de l’en-tête générique et du statut sur le plateau, démarrage automatique uniquement sans sauvegarde, aide/tutoriel/règles dans la modale, préférence d’aide dans les paramètres, compteurs laiton, cartes optimisées portrait/paysage. Le moteur et le statut catalogue restent inchangés. Correction du choix discard-none dans l’interface. Tests E2E actualisés pour trois volumes et démarrage automatique. Workflow BMAD adapté sans uv ; CI et recette à constater.


## SD-BOARD-20 — correction de rendu
La face est ancrée directement aux quatre bords du bouton carte, indépendamment du dimensionnement de la grille. Empilement explicite illustration/cadre/valeurs/position/sélection. Test navigateur ajouté : quatre illustrations en main, décodage des deux images par carte, dimensions de la face et des valeurs, ouverture/fermeture de l’aide. Cause CSS probable, à confirmer par CI et recette. Dernière CI b50c647 en échec sur stalePreviewRecovery (ERR_INTERNET_DISCONNECTED), défaut distinct non masqué. Aucun changement moteur ni nouvelle illustration.


## Intégration du pack plateau original — SD-BOARD-14 à 27
Fusion de 59 entrées dans le manifeste commun sans remplacement. Fonds dédiés portrait/paysage, logo et icônes, compteurs, phases, emplacements, console bois, boutons, quatre places de main, libellés d’action contextuels, menu de partie, indicateur de reprise compact, attribution conservée dans les règles, résultat illustré. Les ornements et autres variantes non indispensables sont disponibles hors ligne mais non imposés à l’écran. Adaptation CSS et ergonomique à valider en recette, pas de garantie de zéro défilement sur tous les écrans. Moteur, sauvegarde et sons inchangés. Tests E2E et pré-cache adaptés ; CI à constater. Workflow uv non exécuté.
