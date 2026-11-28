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


## SD-BOARD-28 à 42 — finition du rendu
CSS Skydeck chargé après les styles génériques, couches images explicites pour compteurs, emplacements, bandeaux et bouton principal, contraste renforcé, navigation harmonisée. Plateau actif contraint à la hauteur disponible, cartes dimensionnées par la taille réelle de leur rangée (2:3), console fixe dans le flux, confirmations superposées. Tests E2E sur huit tailles, décodage et géométrie des ressources ; validation effective CI et recette requises. Aucun nouveau graphisme, moteur et sauvegardes inchangés. Adaptation manuelle sans uv.


## SD-BOARD-43 à 58 — finitions et animations
Texte sans cartouche sur bouton doré, état désactivé contrasté, rose des vents existante, marges/espacements et options centrées, phase harmonisée. Animations issues du différentiel des états réellement confirmés : avancée, arrivée, distribution, départs de combat, Joker et phase. Sons déclenchés au même événement confirmé, pas de synchronisation audio à l’échantillon. Réglage commun et préférence système pris en compte ; aucune attente d’animation imposée au moteur. Tests unitaires de planification et contrôles navigateur des phases ajoutés ; huit résolutions déjà couvertes en capture. CI et recette non validées au moment du commit. Adaptation manuelle sans uv.


## SD-BOARD-59 à 62
Suppression des numéros visibles et du texte de sens de déplacement. Cible imposée B mise en évidence et annoncée pour l’accessibilité ; aide contextuelle évoquant l’ennemi le plus à droite. Attributs de position, ordre 4-3-2-1 et moteur inchangés. Contrôles E2E ajoutés. CI à constater ; aucun uv.


## SD-BOARD-63 à 76
Sélection et cible différenciées, boutons de combat illustrés, choix unique Joker automatique, choix multiples par boutons compacts correspondant aux cartes compatibles et indication sur la carte copiée (pas de clic direct sur la carte pour éviter l’ambiguïté avec la désélection). Bilan des seules captures légales, masqué sans aide. Exécution directe des actions ordinaires via validation du moteur ; abandon et remplacement toujours confirmés. Tests adaptés ; validation CI et recette requises. Aucun uv.


## SD-CARD-01 à 18 — puissance intégrée
Valeur seule, sans fond ni bordure, police Alegreya SC, ivoire doré et ombre légère. Taille relative à la carte, variante deux chiffres et Joker. Emblèmes, noms, libellés accessibles, sélection et moteur inchangés. Position initiale commune estimée à partir de la capture de recette (connecteur ne permet pas de décoder les PNG originaux) : gauche 5 %, haut 5 %, largeur 29 %, hauteur 18 %. Centrage exact sur chacun des cinq blasons à confirmer visuellement. Tests navigateur de géométrie, contraste CSS et texte ajoutés à la matrice existante, qui ne couvre pas exhaustivement les 54 cartes dans chaque résolution. CI à constater. Aucun uv, aucune modification des images.


## SD-BOARD-77 à 84 — finition HUD et aide
Compteurs sans fonds rapportés, relief typographique, consignes FR/EN adaptées à la sélection, bilan de capture légale remplaçant la consigne lorsque disponible. Indicateur de reprise contrasté et superposé, disparition après 3,5 secondes (ou action), sans réserver d’espace. Contrôles E2E de transparence et exclusivité de l’aide ajoutés ; matrice existante conservée. Validation des dimensions et rendu en CI/recette requise. Moteur, sauvegardes et graphismes inchangés. Adaptation manuelle sans uv.


## SD-END-01 à 20 — écrans de résultat
Composant terminal dédié, plateau démonté et viewport contraint, fonds portrait/paysage de victoire/défaite, retrait neutre avec décor existant, icônes et boutons du pack. Rapport résumé et détaillé fondés sur l’état public (manche, ennemis restants, cartes capturées par l’ennemi, réserves) ; aucun total historique de captures inventé. Raison de défaite conforme au moteur, sans identification de carte précise non exposée. Entraînement distingué, sauvegardes inchangées, retour au menu Skydeck, rejeu via confirmation existante. Musiques de résultat déjà déclenchées à la transition confirmée, animation d’apparition respectant le réglage. Tests de trois issues × huit tailles et décodage hors connexion ajoutés ; exécution CI et recette à constater. Aucun uv, adaptation manuelle.


## SD-END-21 à 35 — finition des résultats
Rejeu immédiat après vérification de la sauvegarde terminale et du résultat durable ; remplacement protégé par identifiant de session et confirmation conservée en cours de partie. Dialogue actif thématisé, composition recentrée, emblème et titre agrandis, bandeau et compteurs existants, gradient allégé, marges adaptées. Motif exact de défaite dans le détail. Libellé « Captures ennemies » conservé plutôt que « Cartes perdues » : ce compteur inclut également des adversaires selon la règle B. Tests E2E de rejeu sans confirmation et nouvelle session ajoutés aux contrôles des trois issues et huit tailles ; CI/recette à constater. Aucun uv ni nouvelle ressource.


## SD-END-36 à 41 — narration et finition
Option A validée pour la défaite, message narratif en deux phrases, taille responsive et relief, espaces équilibrés, détails plus compacts. Suppression complète de la phrase technique « Une figure ou un As a été perdu. » conformément à la demande explicite, règle inchangée dans le moteur. Victoire et retrait reçoivent des messages narratifs cohérents en FR/EN. Deux lignes visées sur les écrans suffisamment larges ; retour à la ligne permis sur très petits écrans pour éviter de tronquer le texte. Tests E2E de contenu et géométrie ajoutés, validation effective CI et recette requises. Aucun uv ni modification graphique binaire.


## SD-BOARD-85 à 106 — HUD et options
Suppression du texte Libre, rose des vents et libellé accessible conservés. Bandeau limité à la manche ; phase active dorée et phases inactives bois/laiton via ressources existantes. Menu porté dans le bandeau par portail React, ancré, fermeture extérieure/Échap, actions graphiques et confirmations conservées. Console libérée. Tests E2E adaptés au changement de phase et au menu. Animations et sons existants conservés, vérification perceptive et synchronisation effective encore à réaliser en recette (SD-BOARD-91/92). Matrice huit tailles conservée, CI à constater. Aucun uv.
