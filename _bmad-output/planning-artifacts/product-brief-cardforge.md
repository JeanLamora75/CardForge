# Product Brief — CardForge

**Statut :** cadrage produit consolidé, version 0.1 — 21 novembre 2026  
**Responsable BMAD :** Mary (Business Analyst)  
**Source des décisions :** [docs/cadrage.md](../../docs/cadrage.md)  
**Périmètre :** collection web de jeux de cartes solo, premier candidat Clear the Dungeon

## Synthèse exécutive

CardForge est une collection numérique de jeux de cartes solo reposant sur des mécaniques de jeux existants, présentées dans des univers artistiques originaux. Chaque jeu garde ses règles, ses probabilités et ses conditions de victoire et de défaite ; l'habillage visuel transforme les cartes traditionnelles en cartes illustrées présentant personnage, faction et puissance. Une application commune réunit le catalogue, les tutoriels, les sauvegardes, les statistiques et les paramètres.

Le positionnement est volontairement simple : application gratuite et sans publicité, accessible aux débutants sans sacrifier la profondeur des décisions stratégiques attendue par les amateurs de jeux de cartes. La première plateforme est le Web responsive ; une PWA puis une adaptation Android via Capacitor sont envisagées. La priorité est le jeu solo hors ligne sans compte utilisateur.

**Attention :** le prototype technique existant est un catalogue, pas encore un jeu fonctionnel. La publication des adaptations dépend de la vérification des règles primaires et des droits associés à chaque titre.

## Problème et opportunité

Les jeux solo à paquet classique sont souvent compacts et stratégiques, mais leurs règles ou leur présentation traditionnelle peuvent rendre leur découverte difficile. Une interface bien conçue peut rendre visibles les options valides, expliquer les interactions et mémoriser une partie interrompue, sans modifier la difficulté intrinsèque.

Ce besoin est une hypothèse de produit à valider auprès de joueurs ; aucune étude utilisateur ou mesure de marché n'est présentée comme acquise.

## Publics prioritaires

1. **Joueur débutant :** souhaite découvrir un jeu rapidement, comprendre les actions autorisées, apprendre par un tutoriel facultatif.
2. **Joueur tactique :** souhaite retrouver fidèlement les mécaniques, jouer directement, réduire les aides et suivre ses résultats.

Le même jeu sert ces deux publics. La progression se fait par l'accompagnement et la maîtrise, non par un changement des règles.

## Proposition de valeur

- Catalogue immersif ; chaque jeu possède un univers distinct et une fiche détaillée.
- Cartes illustrées originales avec familles de personnages par faction et variations visuelles de puissance, sans skins configurables en V1.
- Tutoriel facultatif au premier lancement **de chaque jeu**, rejouable depuis l'aide.
- Parties solo autonomes, sauvegardées automatiquement et reprenables exactement, une partie active par jeu.
- Victoires, défaites et abandons suivis séparément, localement.
- Écran final immersif et bilan factuel propres à chaque univers.
- Application sans publicité, achat intégré, compte ou synchronisation.

## Périmètre MVP

### Inclus

- Catalogue immersif d'univers et fiches des jeux disponibles ou à venir.
- Navigation contextuelle : le catalogue est l'accueil, sans barre permanente.
- Premier jeu candidat **Clear the Dungeon**, thème Dark Fantasy, sous réserve de la vérification préalable des droits et des règles.
- Cartes à illustrations fixes originales, faction et puissance lisibles sur smartphone, moteurs de règles isolés de l'interface.
- Tutoriel optionnel par jeu, règles consultables et aides désactivables.
- Sauvegarde locale automatique après action validée, restauration fidèle de la pioche, du plateau et de la phase de jeu.
- Une partie active par jeu, confirmation de remplacement ou d'abandon.
- Statistiques locales : victoires, défaites, abandons, taux de victoire, performances propres au jeu si elles existent réellement.
- Écran de victoire/défaite avec animation courte pouvant être réduite, résumé pertinent et boutons Rejouer / Catalogue.
- Paramètres globaux : langue FR/EN (proposition initiale déjà formulée), musique, effets sonores, animations, aides, accessibilité, données locales, version/crédits.
- Web responsive et conception hors ligne ; la livraison PWA peut être planifiée comme incrément technique à confirmer.

### Exclus du MVP

- Export/import des données, compte, cloud et synchronisation multi-appareils.
- Publicités, achats intégrés et monétisation.
- Skins, personnalisation des cartes, récompenses, trophées, défis quotidiens et classements.
- Historique exhaustif des coups et analyse automatique des choix.
- Multijoueur.
- Déploiement Android dans le tout premier incrément Web (cible ultérieure).

## Règles de gestion transversales

1. **Fidélité aux règles :** le thème ne change ni la composition de la partie, ni la validité des coups, ni l'issue.
2. **Données locales :** une sauvegarde active par jeu, distincte des statistiques ; versionnement et détection d'incompatibilités.
3. **Reprise :** aucune réinitialisation de hasard après fermeture ou navigation vers le catalogue.
4. **Nouvelle partie :** si une sauvegarde active existe, proposer Reprendre / Nouvelle partie puis demander confirmation avant remplacement. Le remplacement confirmé compte comme abandon de l'ancienne partie une seule fois.
5. **Statistiques :** une victoire ou défaite est enregistrée une fois à l'achèvement normal ; un abandon volontaire est un événement distinct ; tutoriels exclus.
6. **Taux de victoire :** victoires / (victoires + défaites), jamais sur les abandons. Afficher « — » si le dénominateur est nul.
7. **Résultat final :** animations cosmétiques, bilan fidèle aux mesures propres au jeu, aucun score inventé.
8. **Accessibilité :** contraste, informations non dépendantes uniquement de la couleur, clavier, aides accessibles et réduction des animations.
9. **Transparence des données :** prévenir de la perte possible de données locales après désinstallation ou effacement navigateur ; suppression volontaire avec confirmation.

## Architecture et identité artistique — principes

- Socle TypeScript commun pour manipuler paquet, cartes et états persistants.
- Moteur de règles autonome par jeu, indépendant des composants React et des illustrations.
- Métadonnées graphiques séparées : une correspondance interne peut rester liée aux cartes traditionnelles, alors que les symboles affichés sont propres à l'univers.
- Quatre factions artistiques provisoires pour Clear the Dungeon : Flammes, Givre, Nature et Lumière ; aucune propriété mécanique implicite.
- Illustrations finales originales dont les droits d'utilisation sont maîtrisés.

## Jeux envisagés

| Jeu | Univers envisagé | Statut |
| --- | --- | --- |
| Clear the Dungeon | Dark Fantasy | Premier candidat, cadrage des règles et droits requis |
| Gridcannon | Guerre spatiale | Envisagé |
| Card Capture | Cyberpunk | Envisagé |
| Loot the Loop | Égypte ancienne | Envisagé |
| Regicide | Fantasy héroïque | Éventuel, contraintes de droits et multijoueur à étudier |

Les titres de tiers dans le catalogue sont provisoires ; une éventuelle distribution publique peut nécessiter d'autres noms ou autorisations.

## Critères de succès proposés (à valider par John)

- Un nouveau joueur peut commencer une partie sans inscription.
- Un joueur expérimenté peut ignorer le tutoriel et jouer avec les aides facultatives désactivées.
- Une partie interrompue se reprend exactement (y compris l'ordre de la pioche), sans résultat différent causé par la sauvegarde.
- Les compteurs de résultats restent cohérents après rechargement, abandon et remplacement.
- Le plateau reste jouable sur un écran de smartphone en portrait et au clavier.
- Les tests de conformité des règles couvrent les cas normaux et limites issus des règles officielles.
- Aucune connexion n'est requise pour une partie après installation des ressources nécessaires.

Ce sont des critères d'acceptation qualitatifs : les objectifs de performance chiffrés et les tests utilisateurs devront être définis dans le PRD.

## Risques et inconnues bloquantes

| Sujet | Décision / action avant développement du jeu |
| --- | --- |
| Droits d'adaptation | Obtenir une base juridique vérifiable pour exploiter le jeu et son nom ; gratuit ne signifie pas libre d'adaptation |
| Source des règles | Retrouver la version primaire, produire une matrice des règles et cas limites |
| Maquettes | Ne pas assimiler une illustration conceptuelle à une capture de gameplay conforme |
| Illustrations | Définir une charte et garantir les droits sur les assets |
| Compatibilité sauvegardes | Spécifier format, versionnement, stratégie de migration et comportement sur corruption |
| Mesure des performances | Définir uniquement des indicateurs pertinents pour chaque moteur |
| Hors ligne | Tester le fonctionnement offline et distinguer PWA web et paquet Android |

## Recommandation de séquencement BMAD

1. **Mary :** finaliser l'étude des règles et droits du premier jeu (recherche web soumise à accord si nécessaire).
2. **John :** transformer le présent brief en PRD et épics/stories avec critères vérifiables.
3. **Sally :** spécifier les parcours de catalogue, partie, tutoriel, statistiques et paramètres en portrait.
4. **Winston :** définir le contrat commun des moteurs et le stockage local versionné.
5. **Amelia et Murat :** développer et tester la conformité avant toute annonce de jeu « jouable ».
6. **Camille :** préparer règles et aide pédagogique FR/EN.

## Vision d'évolution

Une collection de jeux solo aux identités visuelles marquées, dotée d'un moteur et d'une expérience cohérents, pourra accueillir de nouveaux univers sans multiplier les bases techniques. Android et de nouveaux jeux seront ajoutés après stabilisation de la version web. Les fonctions communautaires ou économiques ne sont pas décidées à ce stade.
