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
