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
