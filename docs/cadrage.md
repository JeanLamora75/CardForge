# Cadrage initial de CardForge

## Décisions validées
1. Une collection de jeux solo sous une application commune.
2. Une identité graphique distincte par jeu (option B).
3. Cartes fantasy illustrées (personnage, faction, puissance) et absence de symboles traditionnels visibles lorsque cela reste lisible.
4. Les transformations sont **cosmétiques** : règles et possibilités stratégiques inchangées.
5. Web responsive en premier, PWA puis Android via Capacitor.
6. Gratuit et sans publicité en version initiale ; aucune monétisation intégrée.
7. Solo local en priorité, sans compte ni serveur nécessaire aux parties.
8. Modèle commun de paquet, moteur de règles indépendant par jeu.
9. Publication directement sur `main` pour les travaux validés.

## Premier jeu candidat
Clear the Dungeon, style Dark Fantasy. Maquette de référence : ambiance de donjon, quatre colonnes de créatures, main de héros, factions illustrées. La maquette n'est **pas** un document de règles.

## Points bloquants avant le premier jeu jouable
- Vérifier les règles originales auprès d'une source primaire et établir une matrice de cas limites.
- Confirmer le droit de publier une adaptation de Clear the Dungeon et le nom employé.
- Créer des assets originaux dont les droits d'utilisation sont maîtrisés.
- Préciser les actions tactiles, l'accessibilité, les états victoire/défaite et la sauvegarde.
- Écrire des tests automatiques du moteur de règles avant de déclarer le jeu jouable.

## Factions visuelles provisoires
Flammes, Givre, Nature, Lumière. La correspondance avec les quatre enseignes logiques est une convention visuelle, pas une nouvelle mécanique.

## Périmètre du socle initial
Catalogue responsive + modèle de paquet standard + mélange déterministe testable. Aucun jeu n'est simulé ni présenté comme jouable.

## Public cible — décision du 21 novembre 2026
- **Option C validée :** grand public et amateurs de stratégie, avec une prise en main accessible et une profondeur tactique préservée.
- La progression concerne l'apprentissage : tutoriel interactif, explications contextuelles, visibilité des actions autorisées et aides facultatives.
- **Aucune simplification automatique des règles originales :** un mode d'apprentissage ne change ni les cartes, ni les probabilités, ni les conditions de victoire/défaite.
- Les défis additionnels et variantes de difficulté ne font pas partie du périmètre initial ; ils nécessiteraient un cadrage distinct et un étiquetage explicite comme variantes.
- Les aides doivent pouvoir être désactivées pour les joueurs expérimentés.

## Direction artistique des cartes — décision du 21 novembre 2026
- **Option B validée : une famille de personnages par faction**, avec variantes visuelles selon les puissances.
- Chaque faction doit être reconnaissable par sa silhouette, son emblème, sa palette et ses conventions d'illustration, et non par la couleur seule.
- Les valeurs numériques et les symboles de faction restent lisibles à taille mobile, en dehors des illustrations.
- Une carte conserve un identifiant logique stable ; le nom du personnage, l'illustration, la faction affichée et la puissance affichée sont une couche de présentation.
- Aucune capacité additionnelle ou modification des mécanismes n'est déduite des illustrations.
- Les quatre factions proposées (Flammes, Givre, Nature, Lumière) restent provisoires, en attente d'une validation artistique détaillée.
- Prévoir des gabarits de cartes, états interactifs et variantes d'actifs réutilisables pour limiter les coûts de production graphique.

## Personnalisation des cartes — décision du 21 novembre 2026
- **Option A validée : illustrations fixes** pour les cartes de chaque jeu dans le MVP.
- Une carte logique présente une illustration, un nom, une faction (ou son équivalent propre à l'univers du jeu) et une puissance stable.
- Aucun choix de skin, déblocage cosmétique, collection de variantes ou personnalisation avancée n'est prévu en V1.
- Les illustrations sont des ressources de présentation, séparées du moteur de règles pour permettre de futures évolutions sans changement de mécanique.
- Les illustrations fixes ne doivent pas introduire de capacités nouvelles ou changer les règles originales.
- Les éventuelles variantes d'apparence sont reportées à une étude ultérieure.

## Apprentissage par jeu — décision du 21 novembre 2026
- **Option B validée : tutoriel proposé mais facultatif** au premier lancement de chaque jeu.
- Au premier démarrage, proposer clairement « Apprendre à jouer » et « Jouer directement » ; aucun blocage de l'accès à une partie libre.
- Le tutoriel reste accessible à tout moment depuis l'aide du jeu et peut être rejoué.
- Chaque jeu dispose d'un scénario pédagogique propre à ses règles, avec des composants d'interface réutilisables au niveau CardForge.
- La préférence de premier lancement est enregistrée localement par jeu et ne nécessite ni compte ni connexion.
- Les scénarios pédagogiques expliquent les règles officielles sans les altérer ; une situation préparée pour enseigner est clairement identifiée comme tutoriel et non comme une partie ordinaire.
- Les deux parcours restent accessibles aux personnes utilisant le tactile, le clavier ou des technologies d'assistance.

## Sauvegarde et reprise des parties — décision du 21 novembre 2026
- **Option B validée : sauvegarde automatique et reprise** pour chaque jeu.
- Enregistrer automatiquement et localement une partie après chaque action de jeu validée, sans bouton de sauvegarde manuel.
- Conserver **une partie en cours par jeu** : interrompre Clear the Dungeon puis jouer à Gridcannon ne doit pas effacer la progression de Clear the Dungeon.
- À la réouverture du jeu, proposer la reprise de la partie exactement dans l'état où elle était (plateau, main, pioche dans son ordre exact, défausse, phase de jeu, états et effets éventuels).
- Aucune recomposition aléatoire lors de la reprise : les règles et probabilités restent inchangées.
- Les sauvegardes sont versionnées et leurs données doivent être vérifiées avant restauration ; prévoir une gestion explicite d'une sauvegarde corrompue ou devenue incompatible.
- Tout abandon ou remplacement de la partie en cours nécessite une confirmation claire du joueur ; le comportement précis de « Nouvelle partie » reste à cadrer.
- Pas de compte ni de synchronisation cloud en MVP ; les sauvegardes sont locales à l'appareil/navigateur et peuvent disparaître si ses données sont effacées.

## Création d'une nouvelle partie — décision du 21 novembre 2026
- **Option B validée : confirmation avant remplacement** si une partie non terminée est déjà sauvegardée pour le jeu.
- Proposer explicitement les choix « Reprendre la partie » et « Nouvelle partie » lors du retour sur un jeu avec une partie active.
- Une demande de nouvelle partie affiche une confirmation indiquant que l'ancienne progression de ce jeu sera perdue ; « Annuler » préserve intégralement la sauvegarde.
- Le remplacement n'est effectué **qu'après confirmation**, de manière atomique : la nouvelle partie est créée puis sauvegardée sans laisser un état partiellement initialisé.
- Le remplacement ne touche jamais aux parties sauvegardées des autres jeux de CardForge.
- Une partie terminée ne déclenche pas cette confirmation de perte d'une partie en cours ; ses résultats/statistiques éventuels sont gérés indépendamment.
- Une seule sauvegarde active par jeu dans le MVP ; aucune sauvegarde secondaire implicite.

## Statistiques et progression — décision du 21 novembre 2026
- **Option B validée : statistiques simples par jeu**, stockées localement, sans compte ni service distant.
- Indicateurs communs : nombre de parties terminées, victoires, défaites et taux de victoire (sur les seules parties terminées).
- Indicateur de meilleure performance uniquement si la règle du jeu permet une mesure pertinente et reproductible ; sinon, ne pas en inventer.
- Une partie reprise n'est pas comptée une seconde fois ; les parties en cours ne sont pas incluses dans les victoires/défaites.
- Le tutoriel ne doit pas fausser les statistiques de parties ordinaires.
- Les abandons doivent être distingués explicitement ; leur traitement statistique précis est à spécifier avant implémentation.
- Les statistiques survivent à la création d'une nouvelle partie et ne sont pas effacées avec la sauvegarde de la partie active.
- Pas de trophées, série de récompenses, défis quotidiens, classement en ligne ni progression influençant les règles dans le MVP.
- Les données restent sur le navigateur/appareil ; une suppression des données locales peut les effacer.

## Écrans de fin de partie — décision du 21 novembre 2026
- **Option B validée : résultat immersif avec bilan synthétique**, propre à l'univers graphique de chaque jeu.
- À la fin d'une partie ordinaire, présenter distinctement victoire ou défaite avec une animation thématique courte, respectueuse des préférences de réduction des animations.
- Afficher un bilan simple et factuel : résultat, indicateurs pertinents au jeu (par exemple ennemis vaincus si cette mesure existe dans les règles), et mise à jour des statistiques personnelles.
- Offrir immédiatement les actions « Rejouer » et « Retour au catalogue », sans enfermer le joueur dans une animation ou un écran intermédiaire.
- Les animations et illustrations ne modifient ni les règles, ni le résultat établi par le moteur.
- Ne pas inventer de score, classement ou performance absents du jeu original ; les indicateurs de bilan doivent être explicitement définis pour chaque jeu.
- Exclure du MVP l'historique exhaustif des coups, l'analyse stratégique automatisée et les recommandations tactiques détaillées.
- Garantir un retour lisible en français et en anglais, accessible au clavier et sur smartphone.
- Enregistrer le résultat une seule fois pour éviter les doublons statistiques après fermeture, reprise ou rafraîchissement de l'écran final.

## Comptabilisation des abandons — décision du 21 novembre 2026
- **Option B validée : l'abandon volontaire est comptabilisé séparément** des victoires et des défaites définies par les règles.
- Indicateurs par jeu : victoires, défaites, abandons, et total des parties closes ; distinguer les parties achevées normalement des parties abandonnées.
- Le taux de victoire est calculé sur les parties ayant abouti normalement à une victoire ou une défaite : victoires / (victoires + défaites). Afficher « — » lorsqu'aucune partie n'a abouti normalement.
- Une demande volontaire d'abandon exige une confirmation ; une interruption involontaire, un simple retour au catalogue ou la fermeture de l'application ne constituent **pas** un abandon.
- Lorsqu'une nouvelle partie remplace une partie active après confirmation, l'ancienne est enregistrée comme abandon, une seule fois. En revanche, une partie de tutoriel n'alimente aucune statistique ordinaire.
- Les compteurs sont indépendants des sauvegardes actives et persistent après remplacement. Les mises à jour doivent être atomiques et idempotentes pour éviter un double comptage.
- L'écran de bilan immersif de victoire/défaite n'est pas déclenché par un abandon ; une confirmation d'abandon suivie d'un retour adapté suffit.

## Catalogue de jeux — décision du 21 novembre 2026
- **Option B validée : catalogue immersif avec fiches de jeux**.
- L'accueil présente une galerie d'univers illustrés, chacun avec une identité visuelle propre, mais une structure de navigation cohérente.
- Chaque jeu possède une fiche détaillée : titre, univers, courte présentation narrative, mécanismes principaux, nombre de joueurs, durée indicative si elle est sourcée, statut de disponibilité.
- Actions sur la fiche : « Jouer » / « Nouvelle partie », « Reprendre » si une sauvegarde existe, « Règles » et « Statistiques ». La première visite propose le tutoriel facultatif selon la décision déjà validée.
- Un indicateur discret signale les jeux ayant une partie en cours ; aucune sauvegarde n'est supprimée lors de la navigation.
- Les jeux non encore disponibles peuvent être présentés comme « À venir », sans bouton Jouer trompeur ni promesse de date non validée.
- La présentation est mobile-first, accessible au clavier, compatible avec les préférences de réduction des animations, et ne repose pas exclusivement sur des illustrations.
- Les illustrations et les textes narratifs enrichissent l'immersion sans modifier les règles d'origine.
- Aucune fonction de suivi publicitaire, de personnalisation commerciale ou d'achat n'est intégrée au MVP.

## Navigation générale — décision du 21 novembre 2026
- **Option B validée : navigation contextuelle**, sans barre de navigation permanente.
- Le catalogue immersif est l'accueil principal de CardForge.
- Chaque fiche de jeu centralise les actions de ce jeu : Jouer / Nouvelle partie, Reprendre (si sauvegarde), Règles, Statistiques et tutoriel facultatif.
- Pendant une partie, conserver le maximum d'espace pour le plateau et les cartes ; les actions de navigation et d'aide sont discrètes, accessibles et cohérentes entre jeux.
- Un retour au catalogue n'abandonne ni ne supprime la partie : la sauvegarde automatique demeure disponible.
- Les paramètres globaux sont accessibles depuis une icône commune ; les options propres au jeu sont regroupées dans son contexte.
- Un retour explicite et prévisible (mobile et clavier) est disponible sur les fiches, écrans de règles, statistiques et plateaux.
- L'interface reste accessible sans reposer exclusivement sur des icônes non libellées ; les éléments interactifs sont utilisables au tactile et au clavier.
- Les actions destructives (abandon, remplacement de partie) conservent les confirmations déjà validées.
