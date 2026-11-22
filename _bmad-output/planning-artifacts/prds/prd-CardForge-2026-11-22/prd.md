---
title: 'PRD — CardForge'
status: draft-for-review
created: '2026-11-22'
updated: '2026-11-22'
owner: 'John — Product Manager BMAD'
project: CardForge
sources:
  - '../../../../docs/cadrage.md'
  - '../../product-brief-cardforge.md'
  - '../../architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md'
  - '../../clear-the-dungeon-rule-test-matrix.md'
  - '../../game-rules/clear-the-dungeon.md'
  - '../../game-rules/gridcannon.md'
---

# PRD — CardForge

**Version : 0.2 — périmètre initial à deux jeux, projet de référence à valider par le porteur du projet.** Ce document exprime le *quoi* et les comportements observables. Les contraintes de réalisation AD-01 à AD-12 sont consignées dans l'architecture Winston, et non redécidées ici.

## 0. Objet et sources

Ce PRD aligne John, Mary, Sally, Winston, Amelia, Murat et Camille sur le périmètre de la collection de jeux de cartes solo et sur les deux premiers jeux jouables. Il sert d'entrée au découpage en Epics et User Stories après validation fonctionnelle. Il ne remplace ni les règles primaires de Clear the Dungeon ou de Gridcannon, ni les autorisations nécessaires à leur diffusion.

**Référentiels de règles par Jeu :** [Clear the Dungeon Classic 1.1.0](../../game-rules/clear-the-dungeon.md) et [Gridcannon, Version 2 validée](../../game-rules/gridcannon.md). Leurs points ouverts et statuts de validation priment sur toute description simplifiée de mécanique ci-dessous.

Sources internes : [cadrage](../../../../docs/cadrage.md), [Product Brief](../../product-brief-cardforge.md), [architecture](../../architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md), [matrice de conformité du jeu](../../clear-the-dungeon-rule-test-matrix.md), [étude des droits](../../clear-the-dungeon-rules-rights-study.md).

## 1. Vision

CardForge propose dans une même application une collection gratuite, sans publicité, de jeux de cartes solo fidèles aux règles originales, tout en remplaçant leur présentation classique par des univers illustrés originaux. Chaque jeu dispose de son identité graphique, mais partage une expérience fluide de découverte, d'apprentissage, de sauvegarde et de consultation des résultats.

L'objectif de la V1 est de **rendre réellement jouables Clear the Dungeon Classic 1.1.0 et Gridcannon**, de manière accessible à un débutant et satisfaisante pour un amateur de stratégie, puis de rendre la plateforme apte à accueillir d'autres jeux sans altérer les précédents. Le Web responsive et la PWA sont prioritaires ; Android et iOS restent des cibles de portage explicites.

La valeur attendue n'est pas un système de progression ou de récompenses : c'est la fidélité des règles, l'immersion graphique et la possibilité de reprendre une partie à tout moment.

## 2. Utilisateurs et parcours

### 2.1 Jobs-to-be-done

- **Débutant :** découvrir rapidement les règles sans bloquer son accès au jeu et obtenir une aide facultative.
- **Joueur expérimenté :** commencer directement, retrouver des règles exactes et désactiver les aides superflues.
- **Joueur mobile :** jouer à une partie solo courte ou fractionnée, hors ligne, puis reprendre exactement là où elle a été laissée.
- **Collectionneur d'expériences :** découvrir différents univers visuels, consulter ses résultats et passer d'un jeu à un autre sans perdre les parties en cours.

**Non-utilisateurs V1 :** joueurs cherchant multijoueur, classement mondial, achat de cartes, skins à débloquer ou synchronisation cloud.

### 2.2 Parcours clés (à affiner par Sally)

- **UJ-1 — Premier lancement :** une joueuse ouvre le catalogue, sélectionne l'un des deux Jeux disponibles, lit sa fiche, choisit « Apprendre à jouer » ou « Jouer directement », puis commence à jouer. Elle peut retrouver les règles à tout moment.
- **UJ-2 — Reprise après interruption :** un joueur ferme l'application après une action sauvegardée ; il la rouvre sans connexion, choisit « Reprendre » et retrouve la même pioche, la même main et les mêmes éléments propres au Jeu.
- **UJ-3 — Résultat et nouvelle partie :** une partie arrive à une victoire ou défaite déterminée par le moteur ; le joueur consulte un bilan immersif, ses statistiques sont mises à jour une seule fois, puis il peut rejouer.
- **UJ-4 — Remplacement volontaire :** avec une partie en cours, le joueur choisit « Nouvelle partie », confirme le remplacement ; la précédente est comptée une seule fois comme abandon et les autres jeux restent inchangés.
- **UJ-5 — Changement de contexte :** un joueur passe aux statistiques, aux règles ou au catalogue puis revient à sa partie ; la navigation n'implique aucun abandon.
- **UJ-6 — Incident de sauvegarde :** une écriture locale échoue ; l'interface ne prétend pas que la progression est enregistrée, explique l'incident et propose un nouvel essai sans supprimer automatiquement les données connues.

## 3. Glossaire partagé

- **Jeu :** titre jouable du catalogue, avec son moteur et ses règles propres.
- **Catalogue :** accueil commun présentant les jeux et leurs univers.
- **Fiche de jeu :** écran de présentation et d'actions propres à un jeu.
- **Partie :** session ordinaire de jeu identifiable, en cours ou clôturée.
- **Partie active :** unique Partie sauvegardée en cours pour un Jeu.
- **Tutoriel :** scénario pédagogique facultatif distinct d'une Partie ordinaire, exclu des statistiques.
- **Règles du jeu :** règles originales de la version explicitement retenue ; l'illustration ne les modifie jamais.
- **Carte métier :** objet avec identité, valeur et propriété d'enseigne interprétés par le moteur.
- **Carte illustrée :** représentation graphique d'une Carte métier dans l'univers du Jeu.
- **Sauvegarde :** état local complet et ordonné d'une Partie, versionné et validé.
- **Résultat :** issue unique d'une Partie clôturée : victoire, défaite ou abandon.
- **Statistiques :** agrégats locaux des Résultats d'un Jeu.
- **Ressources :** images, polices, sons et textes indispensables au Jeu.
- **MVP :** première version publique jouable, Web/PWA avec Clear the Dungeon ET Gridcannon entièrement jouables ; architecture préparée pour Android/iOS.

## 4. Fonctionnalités et exigences fonctionnelles

### 4.1 Catalogue et navigation

Le Catalogue est l'accueil ; les fiches de Jeux sont immersives mais leurs fonctions restent cohérentes. Réalise UJ-1, UJ-5.

**FR-01 — Afficher le catalogue.** Le joueur peut parcourir tous les Jeux référencés avec titre, univers, présentation, disponibilité et illustration. Un Jeu non disponible est signalé « À venir », sans action de démarrage trompeuse.

**FR-02 — Consulter une fiche de Jeu.** Le joueur peut consulter une présentation narrative courte, les mécaniques principales et la durée indicative seulement lorsqu'elle est connue et vérifiée.

**FR-03 — Actions contextualisées.** Une fiche de Jeu jouable donne accès à Jouer/Nouvelle partie, Reprendre si une Partie active existe, Règles du jeu et Statistiques. Un indicateur non intrusif signale une Partie active.

**FR-04 — Naviguer sans perdre une partie.** Le retour au Catalogue, aux Règles du jeu ou aux Statistiques ne clôture ni n'abandonne la Partie ; l'accès aux paramètres globaux reste disponible. Aucun menu permanent n'est imposé au plateau.

### 4.2 Partie et conformité des règles

**Deux Jeux jouables dès la V1 : Clear the Dungeon Classic 1.1.0 (sans réserve facultative et avec jokers) et Gridcannon (Version 2 validée le 22 novembre 2026).** Chacun doit disposer de son moteur indépendant et satisfaire les mêmes fonctions transversales. Réalise UJ-1, UJ-2, UJ-3.

**FR-05 — Créer une Partie réglementaire.** Pour chacun des deux Jeux, une nouvelle Partie utilise la configuration et les conditions conformes aux règles originales retenues. **[BLOQUANT RÈGLES]** Les matrices de conformité de Clear the Dungeon et Gridcannon doivent être rapprochées de leurs sources primaires avant acceptation de leurs moteurs respectifs.

**FR-06 — Proposer uniquement les actions autorisées.** Le joueur peut sélectionner les cartes et cibles puis soumettre un coup ; la décision de validité relève exclusivement des Règles du jeu. Une action invalide ne modifie pas l'état de la Partie et retourne une explication compréhensible.

**FR-07 — Résoudre les effets déterministes.** Une action acceptée met à jour les cartes, les éléments de plateau, la main, la pioche et les phases pertinents selon les Règles du jeu concerné. Une même Partie et une même suite d'actions produisent la même issue, sans nouveau mélange lors de la reprise.

**FR-08 — Déterminer l'issue.** Le moteur établit seul victoire et défaite selon les Règles du jeu, y compris les cas limites documentés ; aucune mécanique de difficulté ou capacité nouvelle n'est créée par le thème.

**FR-09 — Configurer Clear the Dungeon Classic sans réserve.** Pour Clear the Dungeon uniquement, la variante facultative de réserve est désactivée dans le MVP, sans supprimer la pile de dégâts ni les jokers. Advanced 1.2.0 n'est pas une option V1. Cette contrainte n'est pas appliquée à Gridcannon.

**FR-33 — Garantir Gridcannon entièrement jouable en V1.** Le joueur doit pouvoir démarrer, jouer jusqu'à une issue et recommencer une Partie de Gridcannon, en appliquant ses règles originales sans transposer celles de Clear the Dungeon. La création d'une matrice de règles, la définition des situations limites et des tests exécutables sont des prérequis bloquants ; les mécaniques publiées dans le référentiel Gridcannon Version 2 sont documentées, mais les cas limites restants ne sont pas inventés. L'interface, les graphismes et le Tutoriel propres à Gridcannon suivent les mêmes obligations que Clear the Dungeon.

### 4.3 Cartes illustrées et immersion

**FR-10 — Présenter des Cartes illustrées.** Chaque Carte métier dispose d'une représentation fixe propre au Jeu (personnage, faction, puissance lisible). Valeur et faction doivent être identifiables sans dépendre uniquement de la couleur.

**FR-11 — Préserver la mécanique.** Le remplacement d'illustration, de texte localisé ou d'effet audio ne change ni la validité des actions ni la composition de la Partie.

**FR-12 — Animations de jeu facultatives.** Les animations et sons n'empêchent pas l'achèvement d'une action ; le joueur peut réduire les animations et désactiver les sons sans impact sur les Règles du jeu.

### 4.4 Tutoriel et aide

**FR-13 — Choisir au premier lancement.** Au premier démarrage de chaque Jeu, le joueur voit « Apprendre à jouer » ou « Jouer directement » ; le choix est conservé localement et ne bloque jamais l'accès direct.

**FR-14 — Tutoriel réutilisable.** Le Tutoriel expose des situations pédagogiques conformes aux Règles du jeu ; il peut être relancé depuis l'aide et n'alimente ni sauvegarde de Partie ordinaire ni Statistiques.

**FR-15 — Règles accessibles.** Les Règles du jeu et les aides contextuelles restent consultables pendant l'utilisation ; les aides facultatives peuvent être désactivées indépendamment des règles.

### 4.5 Sauvegarde, reprise et résilience

**FR-16 — Enregistrer automatiquement.** Après chaque action valide, l'application enregistre localement la Sauvegarde de la Partie, sans bouton de sauvegarde manuel. Les actions sont traitées dans un ordre contrôlé ; le statut « Enregistré » n'est affiché qu'après confirmation effective de persistance.

**FR-17 — Une Partie active par Jeu.** Il existe au plus une Sauvegarde de Partie active pour chaque Jeu, indépendamment des autres Jeux.

**FR-18 — Reprendre exactement.** Le joueur peut restaurer une Sauvegarde compatible et valide, avec ordre exact des cartes, position du plateau, main, phase et état des mécanismes propres au Jeu.

**FR-19 — Confirmer avant remplacement.** Si une Partie active existe, Nouvelle partie déclenche une demande de confirmation ; Annuler conserve l'état initial, Confirmer crée une nouvelle Partie et clôt l'ancienne comme abandon une seule fois, sans toucher aux autres Jeux.

**FR-20 — Préserver les Sauvegardes incompatibles.** À l'ouverture d'une Sauvegarde, le système valide son schéma, sa version et ses invariants ; une migration de format connue est appliquée sans transformation des Règles du jeu, et sans destruction de la Sauvegarde originale en cas d'échec.

**FR-21 — Gérer les erreurs de stockage.** En cas d'échec d'écriture, l'application signale que la progression n'est pas durablement enregistrée, conserve l'état en mémoire lorsque possible et permet de réessayer. Aucune suppression ni réinitialisation automatique à l'échec.

### 4.6 Résultats et statistiques

**FR-22 — Présenter le résultat final.** À une victoire/défaite, l'application affiche une scène thématique avec animation courte ou réduite, un bilan factuel et les actions Rejouer et Catalogue ; aucune analyse exhaustive des coups n'est exigée.

**FR-23 — Distinguer abandon et défaite.** Un abandon est uniquement le résultat d'une action volontaire confirmée, y compris un remplacement de Partie active ; fermer ou quitter l'écran ne compte jamais comme abandon.

**FR-24 — Comptabiliser une seule fois.** Chaque Résultat est enregistré une seule fois, même après rafraîchissement, reprise ou répétition d'une commande. Les Tutoriels ne comptent pas.

**FR-25 — Présenter les Statistiques par Jeu.** Afficher victoires, défaites, abandons, total des Parties closes, taux de victoire = victoires/(victoires+défaites) et « — » quand le dénominateur vaut zéro. Une meilleure performance n'est affichée que si la règle officielle du Jeu définit une mesure pertinente.

### 4.7 Paramètres, données et langues

**FR-26 — Régler l'expérience.** Paramètres globaux : langue français/anglais, musique et effets sonores séparés, niveau d'animations, aides facultatives et options d'accessibilité. Les préférences persistent localement.

**FR-27 — Informer sur les données.** Le joueur peut comprendre quelles données locales sont conservées et qu'une désinstallation ou un effacement des données du navigateur peut les faire disparaître.

**FR-28 — Effacer volontairement les données.** Une action explicite, avec présentation du périmètre et confirmation, permet de supprimer les données locales concernées ; l'annulation ne supprime rien. **[ASSUMPTION A-01]** La suppression peut porter sur toutes les données CardForge, sans granularité par Jeu en V1.

**FR-29 — Afficher informations et crédits.** Présenter version de l'application, crédits et informations de licence ou d'autorisation nécessaires au Jeu.

### 4.8 Disponibilité hors ligne et plateformes

**FR-30 — Jouer hors connexion après installation.** Une fois la PWA correctement préparée, toutes les Ressources nécessaires au(x) Jeu(x) disponibles sont accessibles sans réseau. L'application indique si l'installation hors ligne est incomplète ; les données de Partie ne sont pas supprimées par une mise à jour du cache.

**FR-31 — Préserver les mêmes règles sur plateformes.** La version Web et les futurs portages Android/iOS doivent utiliser la même définition fonctionnelle des actions, Résultats et Sauvegardes ; les adaptations de présentation ou de stockage ne changent pas les Règles du jeu.

**FR-32 — Distinguer les états de disponibilité.** Le Catalogue distingue clairement « À venir », « Disponible » et, si nécessaire, « Préparation hors ligne en cours » sans présenter un Jeu indisponible comme jouable.

## 5. Exigences non fonctionnelles (NFR)

- **NFR-01 — Fidélité :** chaque règle officialisée doit être associée à au moins un test métier, et chaque cas limite du référentiel reçoit un statut explicite avant la déclaration « Jeu jouable ».
- **NFR-02 — Déterminisme :** après reprise d'une Sauvegarde, les mêmes actions produisent le même état et la même issue, y compris l'ordre de la pioche.
- **NFR-03 — Intégrité :** les transitions de Partie et le Résultat associé sont persistés de manière cohérente ; aucune double comptabilisation après interruption ou nouvelle exécution.
- **NFR-04 — Résilience :** migration/écriture échouée ne détruit pas silencieusement la Sauvegarde existante ; toute erreur durable est explicitement signalée.
- **NFR-05 — Accessibilité :** usage sur smartphone en portrait et au clavier ; cartes lisibles avec un contraste suffisant, valeurs non codées par couleur seule, respect de la préférence système de mouvement réduit.
- **NFR-06 — Internationalisation :** l'interface et les aides du MVP sont disponibles en français et anglais ; aucune chaîne de règles originale n'est traduite au point d'en modifier le sens.
- **NFR-07 — Vie privée :** aucune inscription, synchronisation ou collecte distante n'est nécessaire pour jouer au MVP.
- **NFR-08 — Hors ligne :** après préparation complète, la Partie ordinaire reste utilisable sans réseau ; tester fermeture, redémarrage et mise à jour du cache.
- **NFR-09 — Portabilité :** tests de compatibilité dédiés Android/iOS (notamment persistance WebView et suspension) avant publication sur ces plateformes, non présumée par un build réussi.
- **NFR-10 — Gratuité :** aucune fonction payante ni publicité ; Clear the Dungeon demeure gratuit conformément à la condition de l'accord déclaré de l'auteur.
- **NFR-11 — Performances :** [ASSUMPTION A-02] la cible chiffrée de fluidité et de temps de démarrage sera fixée après un prototype mesuré sur les appareils et navigateurs retenus ; aucun seuil arbitraire n'est imposé aujourd'hui.

## 6. Périmètre et séquencement

### 6.1 MVP Web/PWA — inclus

Catalogue immersif, **fiches et Parties complètes pour Clear the Dungeon et Gridcannon**, moteurs distincts, Classic 1.1.0 sans réserve pour Clear the Dungeon, **Gridcannon Version 2 retenue ; ses cas limites à confirmer avant le développement complet**, illustrations fixes propres aux deux univers, tutoriels facultatifs propres à chacun, règles, aide, Sauvegardes et Statistiques indépendantes par Jeu, préférences FR/EN, Ressources embarquées et hors ligne PWA, gestion des incidents et tests de conformité des deux moteurs.

### 6.2 Exclusions V1

Pas de compte, cloud, export/import de Sauvegarde, publicité, achats intégrés, trophées, défis, progression mécanique, skins, classements en ligne, multijoueur, moteur Advanced, historique détaillé des coups ni packs de Ressources à télécharger.

### 6.3 Après le Web

Portages Android et iOS via Capacitor, CI native sur GitHub Actions, tests matériels, signatures et distribution des applications : cibles explicites, calendrier non encore validé. Card Capture, Loot the Loop et les autres Jeux envisagés restent « À venir » tant qu'ils ne sont pas conformes, testés et autorisés.

## 7. Critères de succès et contre-mesures

Les critères suivants sont des **critères de réussite du MVP**, et non des mesures actuellement observées :

- **SM-01 — Deux Jeux réellement jouables :** 100 % des scénarios obligatoires des **deux** matrices de règles validées passent sur leurs moteurs respectifs (FR-05 à FR-09, FR-33 ; NFR-01). La V1 ne peut être déclarée complète si un seul des deux Jeux est jouable.
- **SM-02 — Sauvegarde fiable :** aucune perte ou modification de la séquence d'état dans les scénarios de reprise, de fermeture et de migration testés (FR-16 à FR-21).
- **SM-03 — Disponibilité hors ligne :** les scénarios de jeu hors connexion après installation réussissent sur les environnements Web ciblés (FR-30).
- **SM-04 — Accessibilité à l'entrée :** un nouveau joueur peut accéder à une Partie sans compte ni Tutoriel imposé, et consulter les règles (FR-01, FR-13, FR-15).
- **SM-05 — Statistiques exactes :** aucun double Résultat dans les scénarios de reprise, abandon et rafraîchissement (FR-22 à FR-25).
- **Contre-mesure :** ne pas mesurer ou optimiser la durée des sessions comme proxy de succès si cela conduit à modifier les règles, à forcer la rétention ou à rendre le Tutoriel obligatoire.

Les cibles de performance chiffrées et le dispositif d'évaluation de l'utilisabilité restent à décider après les premières maquettes et prototypes.

## 8. Risques, dépendances et critères de passage

| Sujet | Dépendance / contrôle |
| --- | --- |
| Règles Classic 1.1.0 | Mary doit confirmer ordre des phases, jokers, épuisement de pioche et cas limites ; sans cela, pas d'acceptation du moteur complet |
| Règles Gridcannon | Source primaire de Tom Francis identifiée et Version 2 documentée dans le référentiel Mary ; **cas limites G-01 à G-05 et titre/crédits publics G-06 restent bloquants ; Version 2 validée** avant d'affirmer la conformité et la diffusion |
| Livraison à deux jeux | Deux moteurs, deux tutoriels et deux univers d'illustrations augmentent le périmètre ; les composants communs doivent être utilisables par les deux sans rapprocher artificiellement leurs règles |
| Autorisation | Accord de l'auteur annoncé par le porteur du projet, sous condition de gratuité ; conserver/clarifier sa portée exacte et l'attribution avant diffusion |
| Créations | Vérifier droits des illustrations, sons, polices et autres Ressources avant distribution |
| Sauvegardes | Winston/Amelia définissent contrat de version et migrations ; Murat vérifie intégrité et reprise |
| Web/PWA | Mettre en place et tester les Ressources offline, la gestion des mises à jour et le stockage |
| Android/iOS | Valider IndexedDB dans les WebViews, chaîne GitHub Actions, signature, appareils cibles et exigences éditeurs avant sorties |
| UX | Sally précise interactions de cartes, tutoriels, écran final et parcours accessibles |
| Mesures | Définir un petit jeu d'appareils de référence et les cibles de performances après prototype |

## 9. Questions ouvertes

- **Q-01 [bloquante pour le moteur] :** texte primaire intégral et résolution des cas limites de Clear the Dungeon Classic 1.1.0.
- **Q-02 [bloquante pour publication] :** formulation conservable de l'accord de Mark S. Ball et périmètre précis (nom, Web, Android, iOS, crédits, territoires).
- **Q-08 [bloquante pour Gridcannon] :** les règles originales **Version 2** ont été retrouvées dans la publication primaire de Tom Francis et étudiées par Mary ; adoption de la Version 2 validée le 22 novembre 2026 ; arbitrer les cas limites G-01 à G-05 documentés, ainsi que le **nom public distinct** et les crédits de l'adaptation avant diffusion.
- **Q-09 :** préciser le périmètre minimum des deux tutoriels et de leurs ressources illustrées pour une V1 à deux Jeux, sans supprimer les fonctions validées.
- **Q-03 :** valeurs cibles concrètes de fluidité, démarrage et tailles d'écran à tester.
- **Q-04 :** granularité souhaitée de suppression des données locales.
- **Q-05 :** appareils/navigateurs et versions minimales Android/iOS retenus lors du portage.
- **Q-06 :** modalités de distribution publique Web et, ultérieurement, Android/iOS.
- **Q-07 :** aide contextuelle exacte et interactions tactiles à définir par Sally.

## 10. Hypothèses à confirmer

- **A-01 :** en V1, la suppression volontaire porte sur toutes les données CardForge et non sur un Jeu particulier (FR-28). À valider.
- **A-02 :** les budgets chiffrés de performance seront fixés avec des mesures de prototype (NFR-11), pas arbitrairement.
- **A-03 :** une seule Partie active par Jeu suffit pour les deux publics cibles ; décision antérieure validée, à tester en UX.

## 11. Statut du document et prochain relais

- **Validé :** orientation produit et décisions architecturales AD-01 à AD-12.
- **Rédigé, à approuver :** ce PRD comme périmètre de référence.
- **Non validé :** règles complètes de Clear the Dungeon, cas limites de Gridcannon et conditions de son nom public/crédits, portée documentée de la permission de Clear the Dungeon, performance et appareils cibles.
- **Prochaine étape :** validation fonctionnelle du PRD, puis découpage BMAD en Epics et User Stories petites et testables ; aucune création Jira sans autorisation explicite.

## Complément Mary — revue approfondie des règles (22 novembre 2026)

Les [sources et contradictions documentées](../../game-rules/recherche-approfondie-2026-11-22.md) renforcent les critères de passage avant livraison :
- **Clear the Dungeon :** règle du joker CTD-J01 incompatible entre le résumé Web et le livret Classic 1.1.0 reproduit ; à clarifier auprès d'une source faisant autorité. Les attaques partielles et l'épuisement avec main en cours restent ouverts.
- **Gridcannon V2 :** cas nouveaux G-01a (meilleure carte au centre), G-07 (ploy restant mais inutile) et G-08 (score après réapprovisionnement) ; les lacunes G-01b, G-02, G-03 et G-04 demeurent.
- Les matrices de conformité ont été enrichies, mais **aucune exécution de moteur, validation automatique BMAD ou contact des auteurs** n'a eu lieu.
- Le périmètre à deux jeux jouables reste validé ; les points ouverts sont des dépendances de conformité, non des options de gameplay que CardForge peut inventer silencieusement.

## Arbitrage de règle — Clear the Dungeon (22 novembre 2026)

**Décision produit validée : pour CardForge, la puissance du joker est fixée à 10.** Pas de choix de puissance inférieure. L'enseigne est polyvalente dans les conditions officielles ; un joker peut servir de déclencheur selon les règles documentées. **CTD-J01 est fermé pour l'implémentation**, sans prétendre avoir levé la divergence entre les publications de l'auteur et le livret Classic reproduit. Références : [règles du jeu](../../game-rules/clear-the-dungeon.md) et [matrice mise à jour](../../clear-the-dungeon-rule-test-matrix.md).


## Décision fonctionnelle CTD-ARB-01 — attaques partielles (22 novembre 2026)

**Le porteur a validé l'option B pour Clear the Dungeon : plusieurs attaques partielles contre différents monstres peuvent rester sur le plateau entre les tours et les mains.** Cette règle complète FR-06/FR-07 et impose à FR-16/FR-18 de conserver et restaurer l'affectation des cartes à chaque monstre. Le résultat n'est déterminé qu'après une attaque complète valide. Décision de comportement CardForge ; la documentation historique reste prudente sur la formulation originale exacte. Le déplacement/rappel de cartes posées demeure **CTD-02 ouvert**.

Sources internes : [référentiel du jeu](../../game-rules/clear-the-dungeon.md) et [matrice de tests](../../clear-the-dungeon-rule-test-matrix.md).


## Décision fonctionnelle CTD-ARB-02 — réaffectation pendant la main actuelle (22 novembre 2026)

**Option B validée pour Clear the Dungeon :** toute carte posée pendant la main actuelle peut être récupérée dans cette main ou déplacée sur un autre monstre jusqu'à la clôture de la main, tant que l'attaque concernée n'est pas résolue. Les cartes déposées au cours des mains précédentes sont irréversiblement engagées ; les attaques déjà résolues restent définitives. Les FR-06, FR-07, FR-16 et FR-18 doivent respecter cette distinction, y compris après sauvegarde et reprise.

**Statut :** CTD-02 / CTD-ARB-02 **validé**. La prochaine décision est CTD-03 (clôture de main et cartes non utilisées). [Règles Clear the Dungeon](../../game-rules/clear-the-dungeon.md).


## Décision fonctionnelle CTD-ARB-03 — défausse en fin de main (22 novembre 2026)

**Option B validée :** dans Clear the Dungeon, les cartes inutilisées de la main sont défaussées explicitement, individuellement ou via « Défausser les cartes restantes ». Elles alimentent la pile de dégâts une par une ; le 7e dégât entraîne immédiatement la défaite. Le joueur ne peut pas piocher une nouvelle main tant qu'il conserve des cartes dans la main actuelle ; les cartes posées sur des monstres restent engagées suivant CTD-ARB-01 et CTD-ARB-02. La clôture de la main verrouille les placements provisoires. Cela précise FR-06/07/16/18 sans introduire de conservation gratuite de cartes inutilisées.

**Statut :** CTD-03 / CTD-ARB-03 clos ; CTD-04 (fin de pioche) à valider. [Règles](../../game-rules/clear-the-dungeon.md) · [Scénarios](../../clear-the-dungeon-rule-test-matrix.md).


## Décision fonctionnelle CTD-ARB-04 — dernier tirage incomplet (22 novembre 2026)

**Option A validée pour Clear the Dungeon :** une pioche autorisée prélève jusqu'à trois cartes, ou toutes les cartes restantes s'il en reste moins. Une dernière main à une ou deux cartes est jouable, notamment pour achever des attaques partielles. L'épuisement du paquet pendant le tirage ne termine pas prématurément cette main. Aucune carte n'est ajoutée depuis la pile de dégâts, aucune carte n'est inventée ou remélangée. Ce choix précise FR-05/FR-07/FR-16/FR-18 et est documenté dans les [règles](../../game-rules/clear-the-dungeon.md) et [tests](../../clear-the-dungeon-rule-test-matrix.md).

**Statut : CTD-04 / CTD-ARB-04 clos.** La question CTD-05 (moment exact de la défaite lorsque la pioche est épuisée) reste à valider séparément.


## Décision fonctionnelle CTD-ARB-05 — défaite à la clôture de la dernière main (22 novembre 2026)

**Option A explicitement approuvée :** dans Clear the Dungeon, l'épuisement de la pioche n'entraîne pas de défaite tant que le joueur n'a pas terminé sa dernière main, même si celle-ci contient seulement une ou deux cartes. Dès qu'il clôture cette main, si la pioche est vide et qu'un monstre reste vivant, la **défaite par épuisement est automatique**. Si le douzième monstre est vaincu avant cela : **victoire immédiate**. Si le septième dégât survient avant la clôture : **défaite immédiate**. Le joueur n'a pas à demander inutilement une nouvelle pioche vide.

**Traçabilité :** CTD-05 / CTD-ARB-05 fermé, FR-07/FR-08/FR-16/FR-22/FR-24 précisés ; le résultat de fin de partie n'est inscrit qu'une fois et doit supporter la sauvegarde/reprise. Voir [règles](../../game-rules/clear-the-dungeon.md) et [matrice](../../clear-the-dungeon-rule-test-matrix.md). **CTD-06** (séquence attaque/révélation) reste à valider.


## Décision fonctionnelle CTD-ARB-06 — révélation immédiate d'un nouveau monstre (22 novembre 2026)

**Option A validée :** lorsque trois cartes forment une attaque valide contre un monstre visible dans Clear the Dungeon, les trois cartes d'attaque et le monstre sont retirés du jeu immédiatement ; le suivant de sa colonne est révélé immédiatement s'il existe, **sans attendre la fin de main et sans bouton de révélation**. Les attaques partielles des autres monstres restent intactes, les cartes restantes en main sont toujours jouables, et l'élimination du douzième monstre déclenche instantanément la victoire. Aucune de ces cartes ne rejoint la pile de dégâts. FR-06/FR-07/FR-08/FR-16/FR-18/FR-24 sont précisés.

**CTD-06 / CTD-ARB-06 clos** ; **CTD-07** à examiner : ordre de placement des cartes de puissance et du déclencheur. Références : [règles du jeu](../../game-rules/clear-the-dungeon.md) et [matrice](../../clear-the-dungeon-rule-test-matrix.md).


## Décision CTD-ARB-07 — ordre des trois cartes d'une attaque (22 novembre 2026)

**Option A validée :** Clear the Dungeon exige deux cartes de puissance posées avant la carte déclencheuse, laquelle doit correspondre à l'enseigne du monstre (ou être un joker valide). Une carte déclencheuse ne peut pas être posée/réservée à l'avance, et le moteur ne reconstruit pas automatiquement une combinaison de trois cartes placées sans ordre. Les deux puissances peuvent être placées sur des mains différentes selon CTD-ARB-01 ; la modification des cartes de la main courante est permise selon CTD-ARB-02. La troisième carte valide résout immédiatement la victoire locale selon CTD-ARB-06. Traçabilité : FR-06/FR-07, [référentiel](../../game-rules/clear-the-dungeon.md), [matrice CTD-T69 à CTD-T77](../../clear-the-dungeon-rule-test-matrix.md).

**CTD-07 / CTD-ARB-07 est clos pour CardForge.** CTD-08 reste ouvert concernant le placement d'une seconde carte de puissance **insuffisante**. Aucun changement de règle Gridcannon ni de portée de la V1.


## Décision produit CTD-ARB-08 — seconde carte de puissance insuffisante (22 novembre 2026)

**Option A approuvée :** Clear the Dungeon refuse de placer une deuxième carte de puissance si la somme avec la première reste strictement inférieure à la résistance du monstre. La carte refusée reste en main ; aucune mutation de la partie, aucun dégât ni pose irréversible ne survient. Le moteur accepte au contraire toute somme **supérieure ou égale** au seuil et conserve la nécessité d'une troisième carte déclencheuse distincte. Cette décision précise FR-06 et FR-07, avec tests de non-régression de sauvegarde FR-16/18.

**CTD-08 / CTD-ARB-08 clos** ; CTD-09 ouvert : doit-on également empêcher une première carte de puissance qui est mathématiquement impossible à compléter ? Sources internes : [règles CTD](../../game-rules/clear-the-dungeon.md), [matrice CTD-T78 à CTD-T84](../../clear-the-dungeon-rule-test-matrix.md).


## Décision produit CTD-ARB-09 — première puissance mathématiquement possible (22 novembre 2026)

**Option A validée pour Clear the Dungeon :** une première carte de puissance `P1` est admissible contre un monstre de résistance `R` seulement si `P1 + 10 >= R`. Première puissance minimale : Valet 1, Dame 2, Roi 3. Une pose impossible est refusée avant toute mutation ; la carte reste en main sans dégât. Le moteur ne vérifie **que la possibilité mathématique**, sans consulter les cartes cachées de la pioche. Le contrôle de la seconde puissance et de la troisième carte déclencheuse reste distinct. Ce choix complète FR-06/07, sauvegardes FR-16/18 et tests de non-mutation.

**CTD-09 / CTD-ARB-09 clos**, CTD-10 restant à cadrer sur l'utilisation contextuelle du joker comme carte de puissance ou déclencheur. Références : [règles du jeu](../../game-rules/clear-the-dungeon.md), [scénarios CTD-T85 à CTD-T93](../../clear-the-dungeon-rule-test-matrix.md).


## Décision fonctionnelle CTD-ARB-10 — rôle du joker par emplacement (22 novembre 2026)

**Option A approuvée :** dans Clear the Dungeon, le joueur affecte son joker à un emplacement « puissance 1 », « puissance 2 » ou « déclencheur ». Le moteur déduit automatiquement le rôle depuis l'emplacement, sans menu supplémentaire. En puissance : valeur fixe 10 ; en déclencheur : enseigne automatiquement adaptée à celle du monstre ciblé, autorisé uniquement après deux puissances suffisantes. Le moteur ne décide pas automatiquement du rôle à la place du joueur. Chacun des deux jokers conserve un identifiant distinct ; un même joker n'est jamais utilisable simultanément sur deux emplacements. Les droits de modification de la main courante (CTD-ARB-02) et la sauvegarde/reprise doivent préserver ces informations.

**Statut : CTD-10 / CTD-ARB-10 CLOS.** Cas CTD-T94 à CTD-T103 spécifiés mais non exécutés. **CTD-11** à traiter : usage éventuel des **deux jokers différents** au cours de la même attaque. Références : [règles CTD](../../game-rules/clear-the-dungeon.md), [matrice](../../clear-the-dungeon-rule-test-matrix.md).


## Décision fonctionnelle CTD-ARB-11 — deux jokers dans la même attaque (22 novembre 2026)

**Option A validée :** dans Clear the Dungeon, les deux jokers physiques peuvent être utilisés **dans une même attaque**, chacun avec son emplacement indépendant (deux puissances de 10, ou une puissance de 10 et un déclencheur à l'enseigne du monstre). Aucune limitation d'un seul joker par attaque ou par main. La séquence de trois cartes distinctes et les conditions de seuil sont inchangées. Identifiants, rôle, cible et état des deux jokers doivent survivre sans duplication à la sauvegarde/reprise. **CTD-11 / CTD-ARB-11 CLOS.**

**Prochain arbitrage : CTD-12**, calcul de score quand la victoire survient avec des cartes encore en main. [Règles CTD](../../game-rules/clear-the-dungeon.md) · [matrice CTD-T104 à CTD-T113](../../clear-the-dungeon-rule-test-matrix.md).


## Décision CTD-ARB-12 — score officiel de victoire (22 novembre 2026)

**Option A validée par le porteur :** le score officiel de Clear the Dungeon est uniquement le nombre de cartes **encore présentes dans la pioche de puissance au moment de la victoire**. Les cartes non utilisées de la main, les cartes engagées dans d'autres attaques et les dégâts en sont exclus. Une victoire avec pioche vide obtient un score **0** ; une défaite ou un abandon n'a pas de score officiel de victoire. La victoire et son score sont enregistrés **une seule fois** à l'élimination du douzième monstre, sans clôture artificielle de main ni bonus maison ; les statistiques communes CardForge sont présentées séparément.

**Statut : CTD-12 / CTD-ARB-12 CLOS**, conformément au calcul du score original documenté. Tests CTD-T114 à CTD-T121 spécifiés, non exécutés. **CTD-13 à examiner :** ordre et permissions des phases Attaque / Défausse (défausse explicite CTD-03 déjà validée). [Référentiel du jeu](../../game-rules/clear-the-dungeon.md) · [matrice](../../clear-the-dungeon-rule-test-matrix.md).


## Décision fonctionnelle CTD-ARB-13 — alternance d'attaques et défausses (22 novembre 2026)

**Option B validée par le porteur :** dans Clear the Dungeon, un joueur peut défausser explicitement une ou plusieurs cartes au milieu de sa main puis continuer à attaquer avec les cartes restantes. Il n'existe pas de phase de défausse interdisant définitivement de reprendre les attaques pendant cette main. Chaque défausse est irréversible et ajoute immédiatement un dégât ; défaite instantanée au septième dégât. La défausse ne verrouille pas les placements provisoires de la main courante (CTD-ARB-02) et n'autorise pas une nouvelle pioche tant que la main n'est pas vide/clôturée. Une victoire au douzième monstre arrête immédiatement la partie, sans défausse supplémentaire, conformément au score CTD-ARB-12.

**CTD-13 / CTD-ARB-13 est CLOS** ; tests CTD-T122 à CTD-T130 ajoutés, non exécutés. **CTD-14 est à trancher :** clôture automatique de la main vide ou demande de confirmation explicite, avec conséquences sur les cartes provisoires et la fin de pioche. Traçabilité FR-06/07, FR-16/18, [règles](../../game-rules/clear-the-dungeon.md) et [matrice](../../clear-the-dungeon-rule-test-matrix.md).


## Décision CTD-ARB-14 — clôture de main sur action explicite (22 novembre 2026)

**Option B validée :** dans Clear the Dungeon, le fait que la main devienne vide ne provoque pas automatiquement sa clôture. Jusqu'à la validation de « Terminer la main », le joueur peut reprendre ou réaffecter les cartes posées durant cette main, selon CTD-ARB-02. Cette récupération rend la main à nouveau non vide et empêche la clôture. Lorsque la pioche contient encore des cartes, l'interface peut proposer **une unique action explicite « Terminer la main et piocher »** ; le moteur verrouille les poses restantes puis distribue jusqu'à trois cartes. Si la pioche est vide, la confirmation finale déclenche la défaite par épuisement si au moins un monstre vit encore, conformément à CTD-ARB-05. Victoire au 12e monstre et défaite au 7e dégât restent immédiates, sans confirmation de fin de main. La sauvegarde conserve l'état « main vide, mais ouverte » et empêche toute double clôture/pioche.

**Statut : CTD-14 / CTD-ARB-14 CLOS**, ce qui porte à **14** le nombre d'arbitrages CTD-01 à CTD-14 approuvés par le porteur (plus le joker CTD-J01 fixé à 10). Des scénarios CTD-T131 à CTD-T140 sont spécifiés, **sans exécution**. **Prochaine décision de règle proposée : Gridcannon Version 2 — G-01a (carte de similitude au centre de la grille)**. Cette transition n'affirme pas la conformité du moteur Clear the Dungeon, qui requiert revue de cohérence et tests.
