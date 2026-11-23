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

## Gestion des données locales — décision du 21 novembre 2026
- **Option A validée : données locales uniquement dans le MVP**.
- Les sauvegardes des parties, statistiques et préférences restent sur l'appareil ou dans le navigateur utilisé, sans compte utilisateur et sans serveur de synchronisation.
- Aucun export/import manuel ni synchronisation cloud ou multi-appareils dans la V1.
- La fermeture ou la mise en arrière-plan de l'application ne doit pas supprimer volontairement les données persistantes ; la reprise utilise les sauvegardes locales existantes.
- Signaler clairement au joueur qu'une désinstallation, un effacement des données du navigateur ou une réinitialisation de l'appareil peut entraîner une perte définitive des sauvegardes et statistiques.
- Prévoir une structure de stockage versionnée et des migrations locales testées, sans pour autant ajouter de mécanisme d'export.
- La suppression volontaire des données et son périmètre restent à préciser dans les paramètres de l'application.
- La possibilité d'un export/import ultérieur reste une évolution non retenue pour le MVP.

## Paramètres de l'application — décision du 21 novembre 2026
- **Option B validée : paramètres complets mais simples**, disponibles depuis l'icône commune de navigation.
- Langue de l'interface : français et anglais au lancement, avec prise en charge d'autres langues envisageable ultérieurement.
- Réglages sonores distincts : musique et effets sonores activables/désactivables indépendamment. L'existence des pistes musicales reste à confirmer au moment de la production.
- Animations : possibilité de les réduire ou désactiver ; respecter les préférences de réduction des mouvements du système.
- Aides : les indices/contextes et assistances facultatives peuvent être désactivés, sans masquer l'accès aux règles ni au tutoriel.
- Accessibilité : lisibilité des cartes, contraste, libellés accessibles, navigation clavier et alternatives aux signaux uniquement sonores ou colorés. Les options concrètes seront précisées par Sally.
- Gestion des données locales : informer sur la nature des données et proposer leur suppression volontaire avec confirmation explicite ; aucun export/import ni cloud dans le MVP.
- Informations : version de l'application, crédits des créations originales, licences et droits de tiers vérifiés.
- Sauvegarder les préférences localement, sans compte et sans modifier la mécanique des jeux.
- Pas de réglages avancés spécifiques à chaque jeu dans le MVP, sauf nécessité indispensable à son accessibilité.

## Étude Mary — règles et droits de Clear the Dungeon (21 novembre 2026)
- Rapport BMAD : [Étude Clear the Dungeon](../_bmad-output/planning-artifacts/clear-the-dungeon-rules-rights-study.md).
- **Version de travail : Clear the Dungeon Classic 1.1.0** (mise à jour attribuée à l'auteur au 23 octobre 2024). Advanced 1.2.0 est une variante distincte, non retenue automatiquement.
- Correction de règle : les deux premières cartes d'attaque doivent totaliser **au moins** la résistance du monstre ; la troisième correspond à son enseigne. Ne pas coder une égalité stricte.
- Les règles publiées mentionnent un seuil de sept cartes dans la pile de dégâts ; une réserve jouable est facultative. Les interactions de ces règles et les cas limites d'épuisement du paquet nécessitent encore une formalisation.
- **Point juridique non levé :** les documents portent une mention CC BY-NC-ND 4.0 et n'autorisent pas par eux-mêmes la diffusion d'adaptations de leurs éléments protégés ; l'accord accordé à une autre adaptation (PySolFC) n'est pas transférable. Clarifier les autorisations avant toute publication sous le nom du jeu ou réutilisation de contenu protégé.
- Les primitives techniques génériques de CardForge peuvent continuer à évoluer indépendamment de cette clarification.

## Accord de l'auteur pour Clear the Dungeon — déclaré le 22 novembre 2026
- Le porteur du projet indique avoir reçu **l'accord de Mark S. Ball** pour une adaptation de Clear the Dungeon, **à condition que le jeu reste gratuit**.
- **Statut : accord déclaré par le porteur du projet ; justificatif et formulation exacte non consultés.** Ne pas présenter cette information comme une autorisation écrite indépendante vérifiée.
- **Contrainte produit obligatoire pour cette adaptation : gratuité intégrale**. CardForge V1 est déjà défini comme gratuit, sans publicité ni achats intégrés ; tout changement ultérieur du modèle économique du jeu nécessite de réexaminer et clarifier l'accord avant diffusion.
- Les aspects non explicitement rapportés (utilisation du nom, plateformes Web/Android, pays de diffusion, crédits, durée, contenus originaux réutilisés) restent à documenter à partir de la réponse de l'auteur ; ne pas supposer qu'ils sont tous couverts.
- Le travail de cadrage et le développement peuvent avancer sur la base de cet accord déclaré, avec une vérification documentaire avant publication publique.
- Les règles officielles Classic 1.1.0 et leurs cas limites restent à valider avant de déclarer le jeu fidèle et jouable.

## Configuration du jeu Classic — décision du 22 novembre 2026
- **Option A validée : réserve facultative désactivée pour le MVP** de Clear the Dungeon.
- Une seule configuration initiale, basée sur les règles Classic 1.1.0 ; aucune sélection de variante avant la partie en V1.
- Les cartes de dégâts ne sont donc pas rejouables via la mécanique de réserve facultative. Les règles normales de défausse, de dégâts et de défaite continuent de s'appliquer.
- Ne pas confondre la désactivation de cette option avec la suppression de la pile de dégâts, des jokers, ni avec l'utilisation du mode Advanced 1.2.0.
- Étude des cas limites : [matrice de conformité des règles](../_bmad-output/planning-artifacts/clear-the-dungeon-rule-test-matrix.md).

## Contrainte multiplateforme Web, Android et iOS — rappel validé le 22 novembre 2026
- **Cible produit : Web responsive d'abord, puis portages Android ET iOS.** Le développement Web ne doit pas créer de dette architecturale qui imposerait de réécrire les moteurs de jeu pour les plateformes mobiles.
- **Base métier partagée :** moteurs de cartes, règles, état des parties, validations et statistiques en TypeScript sans dépendance à React, au navigateur ou à une API native Android/iOS.
- **Interface réutilisable :** UI responsive au tactile, adaptée aux formats mobiles, zones de sécurité (encoches/barres système), clavier et accessibilité ; éviter les interactions dépendantes uniquement du survol.
- **Accès aux capacités de plateforme :** stockage persistant, cycle de vie de l'application, éventuels sons et notifications via des interfaces/adaptateurs, et non des accès directs dans le moteur.
- **Persistance locale :** contrat commun de sauvegarde versionnée ; implémentations différentes autorisées selon Web et applications mobiles, sans divergence des règles.
- **Préparation au portage :** évaluer Capacitor comme solution d'enveloppe native Web pour Android et iOS, sans considérer son adoption ni ses versions techniques comme validées avant l'étude d'architecture.
- **Livraison :** Web en premier ; calendrier de livraison Android/iOS à définir séparément. La cible iOS ne signifie pas qu'une compilation ou publication App Store est possible depuis Windows : les prérequis Apple devront être étudiés.
- **Qualité :** tests du moteur commun indépendants de la plateforme, puis vérifications spécifiques Web, Android et iOS avant leurs sorties.

## Première livraison — décision de périmètre du 22 novembre 2026 (John)
- **Option B validée : la première version Web/PWA doit inclure DEUX jeux entièrement jouables, Clear the Dungeon ET Gridcannon.**
- Le catalogue affiche les deux comme « Disponibles » uniquement après vérification des règles, tests, tutoriels et ressources ; les autres jeux demeurent « À venir ».
- Chaque jeu possède son propre moteur de règles, ses illustrations, son tutoriel, sa sauvegarde active et ses statistiques ; les services communs sont mutualisés sans transformer leurs règles.
- **Gridcannon : la version de règles primaire, les cas limites et les droits de diffusion ne sont pas encore documentés.** Une analyse métier Mary et une matrice de conformité spécifiques sont bloquantes avant d'affirmer le jeu jouable et autorisé.
- Clear the Dungeon reste Classic 1.1.0 sans réserve facultative, selon les décisions existantes. Son autorisation a été déclarée par le porteur sous condition de gratuité, portée exacte à documenter.
- Le PRD de référence est [PRD CardForge v0.2](../_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md). Les portages Android et iOS restent prévus après la première version Web/PWA.

## Gridcannon — choix définitif de la version (22 novembre 2026)
- **Version 2 validée par le porteur pour CardForge** : publication révisée de Tom Francis, sans importer les règles de l'ancienne Version 1.
- La source primaire a été identifiée et une étude spécifique est publiée dans [les règles Gridcannon](../_bmad-output/planning-artifacts/game-rules/gridcannon.md). L'ancienne mention « version de règles non encore documentée » reflétait un état antérieur.
- Les cas limites G-01 à G-05 demeurent à clarifier ; titre public distinct de « Gridcannon » seul et crédits Tom Francis à valider (G-06).
- Une matrice de conformité dédiée doit être finalisée et exécutée avant déclaration de jeu jouable.

## Nom public validé de Gridcannon — décision du 23 novembre 2026

**Décision du porteur :** l'adaptation de **Gridcannon Version 2** dans CardForge s'appellera désormais **Thunderfighter**. **« Bastion Stellaire » est abandonné** et ne doit pas être utilisé comme titre du jeu dans les nouveaux écrans, maquettes, traductions ou livrables.

**Traçabilité :** `Gridcannon` demeure le nom du jeu original de **Tom Francis** et la référence des règles de Mary ; le nom public **Thunderfighter** est une métadonnée d'affichage. L'identifiant interne stable du jeu, les moteurs, sauvegardes et statistiques ne doivent pas dépendre du libellé. Conserver les crédits et le lien vers l'original ; **la disponibilité du titre et les droits doivent être vérifiés avant publication**, sans présumer qu'ils ont été vérifiés. Aucun changement de mécanique n'est induit par ce renommage.

Les mentions antérieures de titre provisoire, y compris G-06 et GC-17, restent des **notes historiques supplantées par cette décision**.


## Décision produit confirmée — 23 novembre 2026 : Wuxia / Chanbara

**Validé explicitement par le porteur : l'univers officiel des « Les Douze Tyrans » devient l'Asie féodale fantastique, d'inspiration Wuxia / Chanbara, dans un empire fictif fracturé après la chute de l'Empereur.** La **Grèce antique est abandonnée** pour ce jeu : ses mentions anciennes ne sont conservées que comme historique et ne doivent plus guider les nouveaux visuels, spécifications ni textes de catalogue.

Les douze adversaires sont des seigneurs de guerre, maîtres martiaux ou gouverneurs tyranniques ; temples de montagne, bambouseraies, bannières, sabres, calligraphie, armures lamellaires et esprits folkloriques constituent la direction visuelle. Les références culturelles et artistiques citées sont des inspirations, **sans reprise d'éléments protégés**. Le nom public **Les Douze Tyrans** ne change pas. La transposition est **exclusivement esthétique** : le paquet de 54 cartes physiques, les 12 adversaires, les quatre pouvoirs d'enseigne, leurs valeurs et toutes les règles solo originales de Regicide restent inchangés. La disponibilité du nom et les droits d'adaptation demeurent à vérifier avant diffusion.


## Décision de nomenclature produit — 23 novembre 2026 (fait foi pour tous les futurs livrables)

Le porteur de CardForge valide explicitement les titres publics suivants :

| Jeu original et référentiel Mary | **Nom public CardForge** | Univers graphique validé | Statut de livraison |
| --- | --- | --- | --- |
| *Clear the Dungeon* Classic 1.1.0 | **Grim Delve** | Donjon dark fantasy, monstres illustrés | MVP |
| *Gridcannon* Version 2, Tom Francis | **Thunderfighter** | Science-fiction spatiale pulp rétrofuturiste | MVP |
| *Card Capture*, Lucas Gentry | **Skydeck** | Corsaires du ciel, flottes aériennes et îles flottantes | Après MVP |
| *Loot the Loop*, Wil Su (*Isaludo*) | **Midnight Syndicate** | Années 1930, prohibition, dieselpunk et pulp | Après MVP |
| *Regicide* | **Les Douze Tyrans** | Wuxia / Chanbara, Asie féodale fantastique | Après MVP |

**Important :** la formulation « Loop the Loot » employée lors de la validation désigne le jeu original documenté par Mary sous son titre exact ***Loot the Loop***. **Midnight Syndicate** est le titre public voulu, sans changement des règles originales. Les titres antérieurs de travail « Bastion Stellaire », « Corsaires du ciel » ou les autres libellés provisoires ne doivent pas remplacer les noms publics ci-dessus dans les nouveaux écrans et maquettes ; « Corsaires du ciel » reste un **univers**, non le nom du jeu.

Les noms des jeux originaux sont **conservés dans les références aux sources, la traçabilité juridique, les identifiants stables et les noms des documents de règles**. Il ne faut pas renommer les `gameId`, les répertoires internes, les sauvegardes, les statistiques ou les moteurs du seul fait d'un changement de titre public. Tous les jeux reprennent les **règles originales documentées par Mary**, sans nouveau pouvoir associé au thème. Le catalogue, les fiches, les interfaces, l'aide, les traductions et les crédits affichent leurs noms publics respectifs et l'attribution au jeu source. **La disponibilité des nouveaux titres et les droits d'adaptation restent à vérifier avant toute diffusion publique : aucune vérification juridique n'est revendiquée.**
