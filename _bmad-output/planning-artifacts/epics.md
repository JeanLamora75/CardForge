---
status: published-to-jira
stepsCompleted: ['requirements-extracted','epics-designed','stories-created','jira-verified']
created: '2026-11-23'
updated: '2026-11-23'
project: CardForge
jiraProject: CAR
inputDocuments:
  - 'prds/prd-CardForge-2026-11-22/prd.md'
  - 'architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md'
  - 'game-rules/clear-the-dungeon.md'
  - 'game-rules/gridcannon.md'
  - 'game-rules/card-capture.md'
  - 'game-rules/loot-the-loop.md'
  - 'game-rules/regicide.md'
---

# CardForge — Epics & User Stories du MVP

**Agent :** John (Product Manager) — BMAD v6.12.4  
**Périmètre :** Web responsive/PWA, Clear the Dungeon Classic 1.1.0 et Gridcannon Version 2 entièrement jouables.  
**Statut Jira :** 7 Epics et 36 Stories créées dans le projet CAR le 23 novembre 2026. Les fiches Jira sont la référence opérationnelle ; ce document conserve une copie de traçabilité BMAD.  
**Adaptation de workflow :** les scripts `uv` BMAD et sous-agents autonomes n'ont pas été exécutés. L'utilisateur a expressément demandé le découpage **et sa publication Jira dans la même intervention** ; les étapes de confirmation intermédiaires du workflow interactif ont donc été regroupées, sans prétendre avoir exécuté le runner BMAD. L'UX complète doit encore être affinée avec Sally.

## Inventaire des exigences

### Fonctionnelles (33)

- **FR-01 — Afficher le catalogue.** Le joueur peut parcourir tous les Jeux référencés avec titre, univers, présentation, disponibilité et illustration. Un Jeu non disponible est signalé « À venir », sans action de démarrage trompeuse.
- **FR-02 — Consulter une fiche de Jeu.** Le joueur peut consulter une présentation narrative courte, les mécaniques principales et la durée indicative seulement lorsqu'elle est connue et vérifiée.
- **FR-03 — Actions contextualisées.** Une fiche de Jeu jouable donne accès à Jouer/Nouvelle partie, Reprendre si une Partie active existe, Règles du jeu et Statistiques. Un indicateur non intrusif signale une Partie active.
- **FR-04 — Naviguer sans perdre une partie.** Le retour au Catalogue, aux Règles du jeu ou aux Statistiques ne clôture ni n'abandonne la Partie ; l'accès aux paramètres globaux reste disponible. Aucun menu permanent n'est imposé au plateau.
- **FR-05 — Créer une Partie réglementaire.** Pour chacun des deux Jeux, une nouvelle Partie utilise la configuration et les conditions conformes aux règles originales retenues. **[GATE CONFORMITÉ]** Le cadrage CardForge des deux jeux est clos ; l'acceptation des moteurs exige l'exécution des scénarios et la vérification de fidélité avec les sources primaires. Les conventions CardForge ne sont pas attribuées aux auteurs.
- **FR-06 — Proposer uniquement les actions autorisées.** Le joueur peut sélectionner les cartes et cibles puis soumettre un coup ; la décision de validité relève exclusivement des Règles du jeu. Une action invalide ne modifie pas l'état de la Partie et retourne une explication compréhensible. Une simple sélection/prévisualisation n'est pas une commande métier confirmée : aucune carte, ressource, victoire/défaite ou sauvegarde de coup ne change avant la validation de l'action (Gridcannon GC-23/30/47/52 ; AD-02/10).
- **FR-07 — Résoudre les effets déterministes.** Une action acceptée met à jour les cartes, les éléments de plateau, la main, la pioche et les phases pertinents selon les Règles du jeu concerné. Une même Partie et une même suite d'actions produisent la même issue, sans nouveau mélange lors de la reprise. Chaque carte physique conserve son identifiant unique et stable dans toutes les zones autorisées, Jokers distincts inclus. Leur rôle contextuel relève du moteur spécifique au jeu, jamais du visuel (AD-02/05).
- **FR-08 — Déterminer l'issue.** Le moteur établit seul victoire et défaite selon les Règles du jeu, y compris les cas limites documentés ; aucune mécanique de difficulté ou capacité nouvelle n'est créée par le thème.
- **FR-09 — Configurer Clear the Dungeon Classic sans réserve.** Pour Clear the Dungeon uniquement, la variante facultative de réserve est désactivée dans le MVP, sans supprimer la pile de dégâts ni les jokers. Advanced 1.2.0 n'est pas une option V1. Cette contrainte n'est pas appliquée à Gridcannon.
- **FR-33 — Garantir Gridcannon entièrement jouable en V1.** Le joueur doit pouvoir démarrer, jouer jusqu'à une issue et recommencer une Partie de Gridcannon, en appliquant ses règles originales sans transposer celles de Clear the Dungeon. La création d'une matrice de règles, la définition des situations limites et des tests exécutables sont des prérequis bloquants ; les mécaniques publiées dans le référentiel Gridcannon Version 2 sont documentées, mais les cas limites restants ne sont pas inventés. L'interface, les graphismes et le Tutoriel propres à Gridcannon suivent les mêmes obligations que Clear the Dungeon.
- **FR-10 — Présenter des Cartes illustrées.** Chaque Carte métier dispose d'une représentation fixe propre au Jeu (personnage, faction, puissance lisible). Valeur et faction doivent être identifiables sans dépendre uniquement de la couleur.
- **FR-11 — Préserver la mécanique.** Le remplacement d'illustration, de texte localisé ou d'effet audio ne change ni la validité des actions ni la composition de la Partie.
- **FR-12 — Animations de jeu facultatives.** Les animations et sons n'empêchent pas l'achèvement d'une action ; le joueur peut réduire les animations et désactiver les sons sans impact sur les Règles du jeu.
- **FR-13 — Choisir au premier lancement.** Au premier démarrage de chaque Jeu, le joueur voit « Apprendre à jouer » ou « Jouer directement » ; le choix est conservé localement et ne bloque jamais l'accès direct.
- **FR-14 — Tutoriel réutilisable.** Le Tutoriel expose des situations pédagogiques conformes aux Règles du jeu ; il peut être relancé depuis l'aide et n'alimente ni sauvegarde de Partie ordinaire ni Statistiques.
- **FR-15 — Règles accessibles.** Les Règles du jeu et les aides contextuelles restent consultables pendant l'utilisation ; les aides facultatives peuvent être désactivées indépendamment des règles.
- **FR-16 — Enregistrer automatiquement.** Après chaque action valide, l'application enregistre localement la Sauvegarde de la Partie, sans bouton de sauvegarde manuel. Les actions sont traitées dans un ordre contrôlé ; le statut « Enregistré » n'est affiché qu'après confirmation effective de persistance. Les modifications de partie, de résultat et de statistiques associées forment une opération atomique dans la persistance transactionnelle Web/PWA (AD-04).
- **FR-17 — Une Partie active par Jeu.** Il existe au plus une Sauvegarde de Partie active pour chaque Jeu, indépendamment des autres Jeux.
- **FR-18 — Reprendre exactement.** Le joueur peut restaurer une Sauvegarde compatible et valide, avec ordre exact des cartes, position du plateau, main, phase et état des mécanismes propres au Jeu. L'identité des cartes, les états provisoires légalement reprenables, les réserves de ressources et les zones ordonnées doivent aussi être restitués, après vérification des invariants (AD-05/09).
- **FR-19 — Confirmer avant remplacement.** Si une Partie active existe, Nouvelle partie déclenche une demande de confirmation ; Annuler conserve l'état initial, Confirmer crée une nouvelle Partie et clôt l'ancienne comme abandon une seule fois, sans toucher aux autres Jeux.
- **FR-20 — Préserver les Sauvegardes incompatibles.** À l'ouverture d'une Sauvegarde, le système valide son schéma, sa version et ses invariants ; une migration de format connue est appliquée sans transformation des Règles du jeu, et sans destruction de la Sauvegarde originale en cas d'échec.
- **FR-21 — Gérer les erreurs de stockage.** En cas d'échec d'écriture, l'application signale que la progression n'est pas durablement enregistrée, conserve l'état en mémoire lorsque possible et permet de réessayer. Aucune suppression ni réinitialisation automatique à l'échec.
- **FR-22 — Présenter le résultat final.** À une victoire/défaite, l'application affiche une scène thématique avec animation courte ou réduite, un bilan factuel et les actions Rejouer et Catalogue ; aucune analyse exhaustive des coups n'est exigée.
- **FR-23 — Distinguer abandon et défaite.** Un abandon est uniquement le résultat d'une action volontaire confirmée, y compris un remplacement de Partie active ; fermer ou quitter l'écran ne compte jamais comme abandon.
- **FR-24 — Comptabiliser une seule fois.** Chaque Résultat est enregistré une seule fois, même après rafraîchissement, reprise ou répétition d'une commande. Les Tutoriels ne comptent pas. Une double commande ou un échec de transaction ne doivent produire ni double résultat ni compteur partiellement écrit (AD-04/10).
- **FR-25 — Présenter les Statistiques par Jeu.** Afficher victoires, défaites, abandons, total des Parties closes, taux de victoire = victoires/(victoires+défaites) et « — » quand le dénominateur vaut zéro. Une meilleure performance n'est affichée que si la règle officielle du Jeu définit une mesure pertinente.
- **FR-26 — Régler l'expérience.** Paramètres globaux : langue français/anglais, musique et effets sonores séparés, niveau d'animations, aides facultatives et options d'accessibilité. Les préférences persistent localement.
- **FR-27 — Informer sur les données.** Le joueur peut comprendre quelles données locales sont conservées et qu'une désinstallation ou un effacement des données du navigateur peut les faire disparaître.
- **FR-28 — Effacer volontairement les données.** Une action explicite, avec présentation du périmètre et confirmation, permet de supprimer les données locales concernées ; l'annulation ne supprime rien. **[ASSUMPTION A-01]** La suppression peut porter sur toutes les données CardForge, sans granularité par Jeu en V1.
- **FR-29 — Afficher informations et crédits.** Présenter version de l'application, crédits et informations de licence ou d'autorisation nécessaires au Jeu.
- **FR-30 — Jouer hors connexion après installation.** Une fois la PWA correctement préparée, toutes les Ressources nécessaires au(x) Jeu(x) disponibles sont accessibles sans réseau. L'application indique si l'installation hors ligne est incomplète ; les données de Partie ne sont pas supprimées par une mise à jour du cache.
- **FR-31 — Préserver les mêmes règles sur plateformes.** La version Web et les futurs portages Android/iOS doivent utiliser la même définition fonctionnelle des actions, Résultats et Sauvegardes ; les adaptations de présentation ou de stockage ne changent pas les Règles du jeu.
- **FR-32 — Distinguer les états de disponibilité.** Le Catalogue distingue clairement « À venir », « Disponible » et, si nécessaire, « Préparation hors ligne en cours » sans présenter un Jeu indisponible comme jouable.

### Non fonctionnelles (11)

- **NFR-01 — Fidélité :** chaque règle officialisée doit être associée à au moins un test métier, et chaque cas limite du référentiel reçoit un statut explicite avant la déclaration « Jeu jouable ».
- **NFR-02 — Déterminisme :** après reprise d'une Sauvegarde, les mêmes actions produisent le même état et la même issue, y compris l'ordre de la pioche.
- **NFR-03 — Intégrité :** les cartes physiques sont uniques et conservées ; transitions de partie, résultats et statistiques correspondantes sont persistés atomiquement, sans perte ni double comptabilisation après interruption, reprise ou double commande (AD-04/05).
- **NFR-04 — Résilience :** migration/écriture échouée ne détruit pas silencieusement la Sauvegarde existante ; toute erreur durable est explicitement signalée.
- **NFR-05 — Accessibilité :** usage sur smartphone en portrait et au clavier ; cartes lisibles avec un contraste suffisant, valeurs non codées par couleur seule, respect de la préférence système de mouvement réduit.
- **NFR-06 — Internationalisation :** l'interface et les aides du MVP sont disponibles en français et anglais ; aucune chaîne de règles originale n'est traduite au point d'en modifier le sens.
- **NFR-07 — Vie privée :** aucune inscription, synchronisation ou collecte distante n'est nécessaire pour jouer au MVP.
- **NFR-08 — Hors ligne :** après préparation complète, la Partie ordinaire reste utilisable sans réseau ; tester fermeture, redémarrage et mise à jour du cache.
- **NFR-09 — Portabilité :** tests de compatibilité dédiés Android/iOS (notamment persistance WebView et suspension) avant publication sur ces plateformes, non présumée par un build réussi.
- **NFR-10 — Gratuité :** aucune fonction payante ni publicité ; Clear the Dungeon demeure gratuit conformément à la condition de l'accord déclaré de l'auteur.
- **NFR-11 — Performances :** [ASSUMPTION A-02] la cible chiffrée de fluidité et de temps de démarrage sera fixée après un prototype mesuré sur les appareils et navigateurs retenus ; aucun seuil arbitraire n'est imposé aujourd'hui.

### Exigences complémentaires d'architecture

- **AD-02 ratifié, option B :** contrats moteurs communs minimaux, moteurs indépendants par jeu.
- **AD-05 ratifié, option B :** cardId physique unique et stable par partie pour 52 cartes + 2 Jokers ; aucune capacité déduite des illustrations.
- **AD-04 ratifié, option B :** IndexedDB transactionnel pour le Web/PWA, résultat et statistiques associés atomiques/idempotents.
- **AD-03/09/10/11 :** transitions pures, état ordonné et versionné, erreurs non destructives, orchestration des commandes hors React.
- **AD-06/07/08 :** tests métier réels, ressources embarquées et PWA hors ligne.
- **AD-01/12 :** portages Android/iOS ultérieurs, sans prétendre qu'un test Web valide les WebViews natives.
- **Mary CTD :** 14 arbitrages CTD-ARB-01..14 clos et Joker 10 fixe, Classic 1.1.0 sans réserve.
- **Mary Gridcannon V2 :** §68 conclut le cadrage métier, décisions GC-01..21 et dispositions UX GC-22..53 ; conventions CardForge non nécessairement confirmées par l'auteur.
- **Droits :** publication publique conditionnée aux vérifications de source, noms, crédits, licences et permissions ; aucun test déclaré exécuté à ce stade.

### Exigences UX

Pas de paire `DESIGN.md`/`EXPERIENCE.md` de Sally trouvée dans les livrables BMAD consultés ; les Stories UI reposent sur le PRD, le cadrage et les dispositions GC. La revue UX détaillée reste un **travail à faire**, sans bloquer la présence des tickets Jira. À couvrir : plateaux tactile/clavier, focus, contrastes, lisibilité des cartes, tutoriels, états d'erreur, confirmation d'action, animations réduites, rotation/zoom et retours au catalogue.

## Matrice de couverture des exigences fonctionnelles

| Exigence | Stories Jira responsables |
| --- | --- |
| FR-01 | [CAR-29](https://lmn24.atlassian.net/browse/CAR-29) |
| FR-02 | [CAR-29](https://lmn24.atlassian.net/browse/CAR-29), [CAR-30](https://lmn24.atlassian.net/browse/CAR-30) |
| FR-03 | [CAR-30](https://lmn24.atlassian.net/browse/CAR-30) |
| FR-04 | [CAR-30](https://lmn24.atlassian.net/browse/CAR-30) |
| FR-05 | [CAR-17](https://lmn24.atlassian.net/browse/CAR-17), [CAR-22](https://lmn24.atlassian.net/browse/CAR-22) |
| FR-06 | [CAR-9](https://lmn24.atlassian.net/browse/CAR-9), [CAR-18](https://lmn24.atlassian.net/browse/CAR-18), [CAR-19](https://lmn24.atlassian.net/browse/CAR-19), [CAR-24](https://lmn24.atlassian.net/browse/CAR-24), [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| FR-07 | [CAR-10](https://lmn24.atlassian.net/browse/CAR-10), [CAR-18](https://lmn24.atlassian.net/browse/CAR-18), [CAR-19](https://lmn24.atlassian.net/browse/CAR-19), [CAR-24](https://lmn24.atlassian.net/browse/CAR-24) |
| FR-08 | [CAR-21](https://lmn24.atlassian.net/browse/CAR-21), [CAR-26](https://lmn24.atlassian.net/browse/CAR-26), [CAR-28](https://lmn24.atlassian.net/browse/CAR-28) |
| FR-09 | [CAR-17](https://lmn24.atlassian.net/browse/CAR-17) |
| FR-10 | [CAR-31](https://lmn24.atlassian.net/browse/CAR-31), [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| FR-11 | [CAR-8](https://lmn24.atlassian.net/browse/CAR-8), [CAR-31](https://lmn24.atlassian.net/browse/CAR-31), [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| FR-12 | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32), [CAR-36](https://lmn24.atlassian.net/browse/CAR-36) |
| FR-13 | [CAR-33](https://lmn24.atlassian.net/browse/CAR-33) |
| FR-14 | [CAR-33](https://lmn24.atlassian.net/browse/CAR-33) |
| FR-15 | [CAR-33](https://lmn24.atlassian.net/browse/CAR-33) |
| FR-16 | [CAR-12](https://lmn24.atlassian.net/browse/CAR-12), [CAR-13](https://lmn24.atlassian.net/browse/CAR-13) |
| FR-17 | [CAR-13](https://lmn24.atlassian.net/browse/CAR-13) |
| FR-18 | [CAR-13](https://lmn24.atlassian.net/browse/CAR-13), [CAR-16](https://lmn24.atlassian.net/browse/CAR-16) |
| FR-19 | [CAR-15](https://lmn24.atlassian.net/browse/CAR-15) |
| FR-20 | [CAR-16](https://lmn24.atlassian.net/browse/CAR-16) |
| FR-21 | [CAR-12](https://lmn24.atlassian.net/browse/CAR-12), [CAR-16](https://lmn24.atlassian.net/browse/CAR-16) |
| FR-22 | [CAR-34](https://lmn24.atlassian.net/browse/CAR-34) |
| FR-23 | [CAR-15](https://lmn24.atlassian.net/browse/CAR-15) |
| FR-24 | [CAR-14](https://lmn24.atlassian.net/browse/CAR-14) |
| FR-25 | [CAR-14](https://lmn24.atlassian.net/browse/CAR-14), [CAR-34](https://lmn24.atlassian.net/browse/CAR-34) |
| FR-26 | [CAR-35](https://lmn24.atlassian.net/browse/CAR-35), [CAR-36](https://lmn24.atlassian.net/browse/CAR-36) |
| FR-27 | [CAR-37](https://lmn24.atlassian.net/browse/CAR-37) |
| FR-28 | [CAR-37](https://lmn24.atlassian.net/browse/CAR-37) |
| FR-29 | [CAR-39](https://lmn24.atlassian.net/browse/CAR-39) |
| FR-30 | [CAR-38](https://lmn24.atlassian.net/browse/CAR-38) |
| FR-31 | [CAR-9](https://lmn24.atlassian.net/browse/CAR-9), [CAR-12](https://lmn24.atlassian.net/browse/CAR-12), [CAR-42](https://lmn24.atlassian.net/browse/CAR-42) |
| FR-32 | [CAR-29](https://lmn24.atlassian.net/browse/CAR-29), [CAR-38](https://lmn24.atlassian.net/browse/CAR-38), [CAR-43](https://lmn24.atlassian.net/browse/CAR-43) |
| FR-33 | [CAR-22](https://lmn24.atlassian.net/browse/CAR-22), [CAR-23](https://lmn24.atlassian.net/browse/CAR-23), [CAR-24](https://lmn24.atlassian.net/browse/CAR-24), [CAR-25](https://lmn24.atlassian.net/browse/CAR-25), [CAR-26](https://lmn24.atlassian.net/browse/CAR-26), [CAR-27](https://lmn24.atlassian.net/browse/CAR-27), [CAR-28](https://lmn24.atlassian.net/browse/CAR-28) |

## Liste des Epics et Stories

| Epic | Objectif | Stories |
| --- | --- | ---: |
| [CAR-1](https://lmn24.atlassian.net/browse/CAR-1) | [MVP] Socle de cartes et contrats des moteurs | 4 |
| [CAR-2](https://lmn24.atlassian.net/browse/CAR-2) | [MVP] Parties locales, sauvegardes et statistiques | 5 |
| [CAR-3](https://lmn24.atlassian.net/browse/CAR-3) | [MVP] Clear the Dungeon Classic 1.1.0 jouable | 5 |
| [CAR-4](https://lmn24.atlassian.net/browse/CAR-4) | [MVP] Gridcannon Version 2 jouable | 7 |
| [CAR-5](https://lmn24.atlassian.net/browse/CAR-5) | [MVP] Catalogue, plateaux, tutoriels et accessibilité | 6 |
| [CAR-6](https://lmn24.atlassian.net/browse/CAR-6) | [MVP] Préférences, langues et expérience hors ligne | 5 |
| [CAR-7](https://lmn24.atlassian.net/browse/CAR-7) | [MVP] Validation de conformité, CI et publication Web | 4 |


## CAR-1 — [MVP] Socle de cartes et contrats des moteurs

## Objectif

Partager les primitives de cartes et un contrat stable entre jeux, sans mutualiser les règles de Clear the Dungeon et Gridcannon.

## Critères de sortie

* Les Stories enfants portent des critères d'acceptation exécutables, leurs dépendances et sources vérifiables.
* Les travaux livrés ont des preuves de tests ; une spécification documentaire ne vaut pas validation du code.
* Aucune modification des règles originales par la couche graphique.

## Références

AD-02/03/05 ; PRD FR-05/06/07/08, NFR-01/02/03 ; Mary CTD, Gridcannon V2  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md

### [CAR-8 — [S01] Modèle de 54 cartes physiques à identifiants uniques](https://lmn24.atlassian.net/browse/CAR-8)

## Besoin

En tant que joueur, je souhaite disposer d'un paquet correct dans chacun des deux jeux, afin de qu'aucune carte ni Joker ne puisse être perdu, dupliqué ou confondu.

## Critères d'acceptation

1. Étant donné un nouveau paquet du MVP, quand il est généré, alors 52 cartes usuelles et 2 Jokers physiques distincts sont présents, chacun avec un identifiant unique.
2. Lors d'un déplacement entre zones, le cardId reste stable et la conservation des 54 identités est vérifiable.
3. Aucun effet du Joker n'est déduit d'une valeur universelle ou d'un visuel ; les tests exécutent réellement le code.

## Dépendances

Aucune, base pour S02/S05 et deux moteurs

## Impacts et références

FR-05/07/11 ; AD-05 ; règles CTD et GC  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md

## Vérification

Tests automatisés exigés ; ne pas confondre spécification et exécution.

**Dépendances Jira natives reçues :** aucun prédécesseur déclaré par lien natif à ce stade.

### [CAR-9 — [S02] Contrat TypeScript minimal pour moteurs indépendants](https://lmn24.atlassian.net/browse/CAR-9)

## Besoin

En tant que développeur CardForge, je souhaite brancher chaque jeu derrière une interface de moteur commune, afin de réutiliser application et UI sans mêler les règles.

## Critères d'acceptation

1. Les interfaces communes couvrent création d'état, coups légaux, action, résultat et validation d'intégrité ; états/actions spécifiques sont typés par jeu.
2. Deux moteurs factices avec phases différentes fonctionnent sous le même orchestrateur sans branchement de règles dans le socle.
3. Une action illégale laisse intégralement l'état précédent inchangé.

## Dépendances

S01

## Impacts et références

FR-05 à FR-08, FR-33 ; AD-02/03  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md

## Vérification

Tests automatisés exigés ; ne pas confondre spécification et exécution.

**Dépendances Jira natives reçues :** [CAR-8](https://lmn24.atlassian.net/browse/CAR-8).

### [CAR-10 — [S03] Transitions pures et mélange reproductible](https://lmn24.atlassian.net/browse/CAR-10)

## Besoin

En tant que joueur, je souhaite obtenir les mêmes effets pour une même suite de coups, afin de pouvoir faire confiance au hasard initial et à la reprise.

## Critères d'acceptation

1. Le générateur de pioche accepte une source de hasard injectée et une graine/ordre sérialisé selon le contrat retenu.
2. Même état initial et mêmes actions donnent les mêmes états/résultats sans mutation des objets d'entrée.
3. Une reprise ne remélange jamais la pioche ; tests de comportement reproductibles.

## Dépendances

S01, S02

## Impacts et références

FR-07/18 ; NFR-02 ; AD-03  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md

## Vérification

Tests automatisés exigés ; ne pas confondre spécification et exécution.

**Dépendances Jira natives reçues :** [CAR-9](https://lmn24.atlassian.net/browse/CAR-9).

### [CAR-11 — [S04] Validation des états et invariant de conservation des cartes](https://lmn24.atlassian.net/browse/CAR-11)

## Besoin

En tant que joueur, je souhaite que les parties invalides soient détectées, afin de éviter triche accidentelle et corruptions silencieuses.

## Critères d'acceptation

1. Les validateurs distinguent schéma illisible, duplicata de cardId, carte absente et zone impossible selon le jeu.
2. Un état erroné ne peut être chargé comme partie valide, et n'efface pas les données existantes.
3. Des scénarios de 54 identités et de transitions illégales sont testés pour les deux modèles de jeu.

## Dépendances

S01, S02

## Impacts et références

FR-06/18/20 ; NFR-03/04 ; AD-05/09/11  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md

## Vérification

Tests automatisés exigés ; ne pas confondre spécification et exécution.

**Dépendances Jira natives reçues :** [CAR-8](https://lmn24.atlassian.net/browse/CAR-8).


## CAR-2 — [MVP] Parties locales, sauvegardes et statistiques

## Objectif

Reprendre une partie par jeu, garantir les données et les résultats sans compte ni serveur.

## Critères de sortie

* Les Stories enfants portent des critères d'acceptation exécutables, leurs dépendances et sources vérifiables.
* Les travaux livrés ont des preuves de tests ; une spécification documentaire ne vaut pas validation du code.
* Aucune modification des règles originales par la couche graphique.

## Références

AD-04/09/10/11 ; FR-16 à 25 ; NFR-02/03/04/07  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md

### [CAR-12 — [S05] Adaptateur IndexedDB et transactions locales](https://lmn24.atlassian.net/browse/CAR-12)

## Besoin

En tant que joueur, je souhaite des sauvegardes automatiques locales fiables, afin de ne pas dépendre de compte ni de connexion.

## Critères d'acceptation

1. L'application lit et écrit via un port, pas directement depuis les moteurs ; IndexedDB Web/PWA est l'adaptateur implémenté.
2. Une transaction atomique peut écrire ensemble état de partie, résultat et statistiques dans les magasins concernés.
3. Un échec forcé annule toutes les écritures liées et remonte un statut d'erreur sans faux succès.

## Dépendances

S02, S04

## Impacts et références

FR-16/21/31 ; AD-04/10/11 ; NFR-03/07  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md

## Vérification

Tests automatisés exigés ; ne pas confondre spécification et exécution.

**Dépendances Jira natives reçues :** [CAR-9](https://lmn24.atlassian.net/browse/CAR-9), [CAR-11](https://lmn24.atlassian.net/browse/CAR-11).

### [CAR-13 — [S06] Sauvegarde après coup et reprise exacte par jeu](https://lmn24.atlassian.net/browse/CAR-13)

## Besoin

En tant que joueur, je souhaite retrouver exactement ma partie après interruption, afin de jouer à mon rythme, même hors ligne.

## Critères d'acceptation

1. Une partie active au plus par gameId, deux jeux conservés indépendamment ; sauvegarde après toute action confirmée validée.
2. Après redémarrage/rechargement, mêmes cardIds, zones ordonnées, phases provisoires et réserves spéciales sont restaurés sans nouveau tirage.
3. L'interface annonce « Enregistré » seulement après l'achèvement confirmé de l'écriture.

## Dépendances

S03, S04, S05

## Impacts et références

FR-16/17/18 ; AD-09/10  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md

## Vérification

Tests automatisés exigés ; ne pas confondre spécification et exécution.

**Dépendances Jira natives reçues :** [CAR-12](https://lmn24.atlassian.net/browse/CAR-12).

### [CAR-14 — [S07] Issue de partie et statistiques transactionnelles idempotentes](https://lmn24.atlassian.net/browse/CAR-14)

## Besoin

En tant que joueur, je souhaite que ma victoire ou ma défaite soit enregistrée exactement une fois, afin de disposer de statistiques fiables.

## Critères d'acceptation

1. Une issue terminale utilise un identifiant stable et met à jour état, résultat et compteurs en une transaction unique.
2. Double activation, reprise ou rafraîchissement ne créent aucun résultat ou compteur supplémentaire.
3. Un échec de stockage laisse l'ancien état durable cohérent ; un nouvel essai contrôlé est possible.

## Dépendances

S05, S06

## Impacts et références

FR-22/24/25 ; NFR-03 ; AD-04/10  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md

## Vérification

Tests automatisés exigés ; ne pas confondre spécification et exécution.

**Dépendances Jira natives reçues :** [CAR-13](https://lmn24.atlassian.net/browse/CAR-13).

### [CAR-15 — [S08] Nouvelle partie confirmée, abandon distinct de défaite](https://lmn24.atlassian.net/browse/CAR-15)

## Besoin

En tant que joueur, je souhaite choisir entre reprendre et remplacer une partie active, afin de ne pas effacer ma progression par erreur.

## Critères d'acceptation

1. Avec partie active, Nouvelle partie offre Annuler ou Confirmer ; Annuler préserve intégralement la partie.
2. Confirmer remplace atomiquement la partie du jeu concerné et comptabilise un seul abandon, pas une défaite.
3. Quitter l'écran, fermer l'application ou jouer à l'autre jeu ne compte jamais comme abandon.

## Dépendances

S05, S07

## Impacts et références

FR-17/19/23/24 ; AD-10  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md

## Vérification

Tests automatisés exigés ; ne pas confondre spécification et exécution.

**Dépendances Jira natives reçues :** [CAR-14](https://lmn24.atlassian.net/browse/CAR-14).

### [CAR-16 — [S09] Sauvegardes versionnées, migration sûre et incident de stockage](https://lmn24.atlassian.net/browse/CAR-16)

## Besoin

En tant que joueur, je souhaite conserver mes données lorsque l'application évolue ou rencontre une erreur, afin de éviter une perte silencieuse de mes parties.

## Critères d'acceptation

1. Enveloppe avec identifiants gameId/sessionId, versions de format/règles et état complet ; restauration validée.
2. Migration connue transactionnelle ; une sauvegarde inconnue, incompatible ou corrompue est conservée et non rejouée comme valide.
3. Stockage plein ou migration échouée affiche l'échec, permet un essai contrôlé et n'efface pas les anciennes données.

## Dépendances

S04, S05, S06

## Impacts et références

FR-20/21 ; NFR-04 ; AD-09/11 ; GC-54 reporté  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md

## Vérification

Tests automatisés exigés ; ne pas confondre spécification et exécution.

**Dépendances Jira natives reçues :** [CAR-13](https://lmn24.atlassian.net/browse/CAR-13).


## CAR-3 — [MVP] Clear the Dungeon Classic 1.1.0 jouable

## Objectif

Permettre une partie complète fidèle au référentiel Mary, avec ses phases, joker 10 et 14 arbitrages validés, sans réserve facultative.

## Critères de sortie

* Les Stories enfants portent des critères d'acceptation exécutables, leurs dépendances et sources vérifiables.
* Les travaux livrés ont des preuves de tests ; une spécification documentaire ne vaut pas validation du code.
* Aucune modification des règles originales par la couche graphique.

## Références

Mary game-rules/clear-the-dungeon.md §11–25, CTD-ARB-01..14 ; FR-05..09  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md

### [CAR-17 — [S10] Clear the Dungeon — démarrer une partie Classic réglementaire](https://lmn24.atlassian.net/browse/CAR-17)

## Besoin utilisateur

En tant que joueur solo, je souhaite commencer une partie selon la configuration retenue, afin de avoir une partie fidèle à Classic 1.1.0.

## Critères d'acceptation

1. Initialisation avec cartes physiques attendues, deux Jokers distincts, monstres et pioche ordonnée ; aucune carte dupliquée.
2. Classic 1.1.0 activé, réserve facultative désactivée et mode Advanced absent des options MVP.
3. Les premières phases et coups légaux sont dérivés exclusivement du moteur Clear the Dungeon.

## Dépendances

S01 à S04.

## Sources et impacts

§1–5, §11; FR-05/09  
Mary : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md  
Matrice CTD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/clear-the-dungeon-rule-test-matrix.md  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : AD-02/03/05/06/10.

## Preuve requise

Tests exécutables couvrant les scénarios déterministes concernés ; conventions CardForge distinguées des règles explicites de l'auteur.

**Dépendances Jira natives reçues :** [CAR-9](https://lmn24.atlassian.net/browse/CAR-9).

### [CAR-18 — [S11] Clear the Dungeon — attaques partielles, repositionnement et verrouillage](https://lmn24.atlassian.net/browse/CAR-18)

## Besoin utilisateur

En tant que joueur solo, je souhaite préparer plusieurs attaques et corriger les cartes provisoires, afin de exercer les choix tactiques validés.

## Critères d'acceptation

1. Plusieurs attaques partielles distinctes restent sur les monstres entre les mains (CTD-ARB-01).
2. Cartes de la main actuelle récupérables/déplaçables avant clôture ; celles des mains précédentes sont verrouillées (CTD-ARB-02).
3. Une attaque résolue n'est pas annulable, et l'état provisoire est sauvegardable/reprenable sans divergence.

## Dépendances

S10, S06.

## Sources et impacts

CTD-ARB-01/02/06 ; FR-06/07/18  
Mary : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md  
Matrice CTD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/clear-the-dungeon-rule-test-matrix.md  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : AD-02/03/05/06/10.

## Preuve requise

Tests exécutables couvrant les scénarios déterministes concernés ; conventions CardForge distinguées des règles explicites de l'auteur.

**Dépendances Jira natives reçues :** [CAR-17](https://lmn24.atlassian.net/browse/CAR-17).

### [CAR-19 — [S12] Clear the Dungeon — validation des attaques et rôles des Jokers](https://lmn24.atlassian.net/browse/CAR-19)

## Besoin utilisateur

En tant que joueur solo, je souhaite jouer des combinaisons d'attaque réglementaires, afin de connaître les coups licites et leurs effets.

## Critères d'acceptation

1. Deux cartes de puissance précèdent une troisième déclencheuse ; somme au moins égale à la résistance et enseigne finale conforme.
2. Joker physique à puissance 10 fixe, rôle déterminé par position et possibilité des deux Jokers dans une même attaque selon CTD-ARB-10/11.
3. Combinaisons impossibles refusées sans consommer de carte ni modifier l'état ; scénarios de seuil exécutables.

## Dépendances

S10, S11.

## Sources et impacts

CTD-ARB-07/08/09/10/11, CTD-J01 ; FR-06/07  
Mary : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md  
Matrice CTD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/clear-the-dungeon-rule-test-matrix.md  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : AD-02/03/05/06/10.

## Preuve requise

Tests exécutables couvrant les scénarios déterministes concernés ; conventions CardForge distinguées des règles explicites de l'auteur.

**Dépendances Jira natives reçues :** [CAR-18](https://lmn24.atlassian.net/browse/CAR-18).

### [CAR-20 — [S13] Clear the Dungeon — défausses, dégâts et clôture explicite de main](https://lmn24.atlassian.net/browse/CAR-20)

## Besoin utilisateur

En tant que joueur solo, je souhaite défausser et terminer une main en connaissance des conséquences, afin de maîtriser les risques de la pile de dégâts.

## Critères d'acceptation

1. Attaques et défausses alternables pendant la main ; défausse explicite irréversible, septième dégât = défaite immédiate.
2. Main vide reste ouverte pour récupérer des cartes provisoires ; Terminer la main valide les placements seulement si main vide.
3. Si pioche restante, Terminer la main et piocher distribue jusqu'à trois cartes, y compris 1 ou 2 restantes ; jamais deux mains sur double validation.

## Dépendances

S11, S12, S05.

## Sources et impacts

CTD-ARB-03/04/13/14 ; FR-07/16  
Mary : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md  
Matrice CTD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/clear-the-dungeon-rule-test-matrix.md  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : AD-02/03/05/06/10.

## Preuve requise

Tests exécutables couvrant les scénarios déterministes concernés ; conventions CardForge distinguées des règles explicites de l'auteur.

**Dépendances Jira natives reçues :** [CAR-19](https://lmn24.atlassian.net/browse/CAR-19).

### [CAR-21 — [S14] Clear the Dungeon — victoire, défaite, révélation et score](https://lmn24.atlassian.net/browse/CAR-21)

## Besoin utilisateur

En tant que joueur solo, je souhaite terminer une partie avec un résultat exact, afin de comprendre ma victoire, ma défaite et ma performance.

## Critères d'acceptation

1. Douzième monstre vaincu = victoire immédiate, révélation de nouveau monstre selon CTD-ARB-06 tant que la partie continue.
2. Septième dégât = défaite immédiate ; épuisement après clôture explicite de la dernière main = défaite si monstre restant.
3. Score de victoire calculé sur les cartes restantes dans la pioche, main exclue, enregistré une fois ; cas terminaux testés.

## Dépendances

S12, S13, S07.

## Sources et impacts

CTD-ARB-05/06/12/13/14 ; FR-08/22/24  
Mary : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md  
Matrice CTD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/clear-the-dungeon-rule-test-matrix.md  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : AD-02/03/05/06/10.

## Preuve requise

Tests exécutables couvrant les scénarios déterministes concernés ; conventions CardForge distinguées des règles explicites de l'auteur.

**Dépendances Jira natives reçues :** [CAR-20](https://lmn24.atlassian.net/browse/CAR-20).


## CAR-4 — [MVP] Gridcannon Version 2 jouable

## Objectif

Permettre une partie complète de Gridcannon V2 selon le référentiel Mary, ses piles, tirs, armures, actions spéciales, phases et issues.

## Critères de sortie

* Les Stories enfants portent des critères d'acceptation exécutables, leurs dépendances et sources vérifiables.
* Les travaux livrés ont des preuves de tests ; une spécification documentaire ne vaut pas validation du code.
* Aucune modification des règles originales par la couche graphique.

## Références

Mary game-rules/gridcannon.md §15–68, GC-01..53 ; FR-33  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md

### [CAR-22 — [S15] Gridcannon V2 — préparer la grille et la pioche de 54 cartes](https://lmn24.atlassian.net/browse/CAR-22)

## Besoin utilisateur

En tant que joueur solo, je souhaite démarrer Gridcannon selon sa Version 2, afin de jouer avec le plateau et les ressources corrects.

## Critères d'acceptation

1. Grille initiale 3×3 conforme avec piles numériques et 54 cartes uniques réparties selon phases/zones légales.
2. Remplacement initial facultatif et tirages non numériques gérés selon GC-14 ; aucune attaque durant préparation GC-15.
3. Actions spéciales bloquées avant fin de préparation GC-16 ; pas de règles de la Version 1 introduites.

## Dépendances

S01 à S04.

## Sources et impacts

§2/9 ; GC-14/15/16 ; FR-33  
Mary : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md  
Audit Gridcannon : §68 du référentiel  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : AD-02/03/05/06/10.

## Preuve requise

Tests exécutables couvrant les scénarios déterministes concernés ; conventions CardForge distinguées des règles explicites de l'auteur.

**Dépendances Jira natives reçues :** [CAR-9](https://lmn24.atlassian.net/browse/CAR-9).

### [CAR-23 — [S16] Gridcannon V2 — placement des figures et cas de secours](https://lmn24.atlassian.net/browse/CAR-23)

## Besoin utilisateur

En tant que joueur solo, je souhaite voir les adversaires se placer selon le plateau, afin de obtenir un défi reproductible.

## Critères d'acceptation

1. Seules périphériques sont candidates à l'attraction ; centre exclu selon GC-01.
2. Si meilleur candidat sans place, chercher suivant disponible ; placement de secours GC-13 quand aucune carte périphérique adéquate ne permet la pose.
3. Douze figures identifiables, vivantes/vaincues et places libres gérées sans duplication ; cas limites testés.

## Dépendances

S15.

## Sources et impacts

§3 ; GC-01/02/13 ; FR-07  
Mary : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md  
Audit Gridcannon : §68 du référentiel  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : AD-02/03/05/06/10.

## Preuve requise

Tests exécutables couvrant les scénarios déterministes concernés ; conventions CardForge distinguées des règles explicites de l'auteur.

**Dépendances Jira natives reçues :** [CAR-22](https://lmn24.atlassian.net/browse/CAR-22).

### [CAR-24 — [S17] Gridcannon V2 — poser une numérique et résoudre les tirs](https://lmn24.atlassian.net/browse/CAR-24)

## Besoin utilisateur

En tant que joueur solo, je souhaite placer une carte puis voir les tirs réglementaires, afin de appliquer le calcul tactique réel.

## Critères d'acceptation

1. Pose numérique validée selon sommets, valeur/enseigne, sans carte fictive dans une case vide d'Extraction (GC-03).
2. Tirs horizontaux/verticaux calculés sur mêmes états et un tir de coin double résolu simultanément GC-04.
3. Résistance/armure, couleurs, rangs et tirs non permis appliqués par le moteur sans logique UI ; tests déterministes.

## Dépendances

S15, S16.

## Sources et impacts

§4/5 ; GC-03/04 ; FR-07/33  
Mary : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md  
Audit Gridcannon : §68 du référentiel  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : AD-02/03/05/06/10.

## Preuve requise

Tests exécutables couvrant les scénarios déterministes concernés ; conventions CardForge distinguées des règles explicites de l'auteur.

**Dépendances Jira natives reçues :** [CAR-23](https://lmn24.atlassian.net/browse/CAR-23).

### [CAR-25 — [S18] Gridcannon V2 — As Extraction et Joker Réaffectation](https://lmn24.atlassian.net/browse/CAR-25)

## Besoin utilisateur

En tant que joueur solo, je souhaite utiliser les actions spéciales lorsqu'elles sont légales, afin de débloquer un plateau sans altérer les règles.

## Critères d'acceptation

1. Extraction retire pile entière et la réinsère sous pioche dans l'ordre GC-05 sans perte de carte.
2. Joker Réaffectation n'autorise que mouvements licites et éventuels tirs ; les coûts As/Joker sont consommés une fois.
3. Réserves et activation durant recherche de figure conformes GC-09/11 ; une action impossible n'est pas exécutée automatiquement.

## Dépendances

S17.

## Sources et impacts

§6 ; GC-05/07/09/11/16 ; FR-06/33  
Mary : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md  
Audit Gridcannon : §68 du référentiel  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : AD-02/03/05/06/10.

## Preuve requise

Tests exécutables couvrant les scénarios déterministes concernés ; conventions CardForge distinguées des règles explicites de l'auteur.

**Dépendances Jira natives reçues :** [CAR-24](https://lmn24.atlassian.net/browse/CAR-24).

### [CAR-26 — [S19] Gridcannon V2 — armures, égalités et impasses](https://lmn24.atlassian.net/browse/CAR-26)

## Besoin utilisateur

En tant que joueur solo, je souhaite connaître les pénalités et fins de partie, afin de éviter une issue prématurée ou arbitraire.

## Critères d'acceptation

1. Sans pose licite, recours à une action spéciale utile puis attribution d'armure dans le bon ordre.
2. Égalité entre figures admissibles selon GC-21 = décision explicite du joueur, pas départage automatique.
3. Pioche vide avec figure vivante et ressources encore utiles ne cause pas de défaite prématurée GC-20 ; seuils d'armure et impasse évalués.

## Dépendances

S16, S17, S18.

## Sources et impacts

§7/8 ; GC-07/08/20/21 ; FR-08/33  
Mary : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md  
Audit Gridcannon : §68 du référentiel  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : AD-02/03/05/06/10.

## Preuve requise

Tests exécutables couvrant les scénarios déterministes concernés ; conventions CardForge distinguées des règles explicites de l'auteur.

**Dépendances Jira natives reçues :** [CAR-25](https://lmn24.atlassian.net/browse/CAR-25).

### [CAR-27 — [S20] Gridcannon V2 — recherche pas-à-pas d'une figure](https://lmn24.atlassian.net/browse/CAR-27)

## Besoin utilisateur

En tant que joueur solo, je souhaite progresser dans la pioche lorsque plus aucune figure n'est vivante, afin de garder le contrôle de mes actions spéciales.

## Critères d'acceptation

1. Recherche par action explicite Carte suivante, une carte à la fois, et état reprenable (GC-06/18).
2. Numériques temporairement écartées visibles dans leur ordre, puis réinsérées selon GC-10/19 ; As/Jokers révélés réservés selon GC-09.
3. Absence incohérente de figure déclenche un diagnostic d'intégrité GC-12 et non une victoire/défaite inventée.

## Dépendances

S16, S18, S06.

## Sources et impacts

§8 ; GC-06/09/10/11/12/18/19  
Mary : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md  
Audit Gridcannon : §68 du référentiel  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : AD-02/03/05/06/10.

## Preuve requise

Tests exécutables couvrant les scénarios déterministes concernés ; conventions CardForge distinguées des règles explicites de l'auteur.

**Dépendances Jira natives reçues :** [CAR-25](https://lmn24.atlassian.net/browse/CAR-25).

### [CAR-28 — [S21] Gridcannon V2 — résultat, score et conservation de 54 cartes](https://lmn24.atlassian.net/browse/CAR-28)

## Besoin utilisateur

En tant que joueur solo, je souhaite achever une partie avec un bilan exact, afin de vérifier le succès de mes décisions.

## Critères d'acceptation

1. La victoire intervient uniquement lorsque les 12 figures sont vaincues ; terminales défaites évaluées selon règles et décisions GC.
2. Score de victoire fondé sur As/Jokers non dépensés, même après réapprovisionnement GC-08 ; pas de score victoire pour une défaite.
3. Avant et après chaque phase y compris réinsertion, les 54 identités physiques se trouvent dans une zone autorisée, sans doublon ; résultat unique.

## Dépendances

S17, S18, S19, S20, S07.

## Sources et impacts

§8/68 ; GC-08/12/20 ; FR-08/33  
Mary : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md  
Audit Gridcannon : §68 du référentiel  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : AD-02/03/05/06/10.

## Preuve requise

Tests exécutables couvrant les scénarios déterministes concernés ; conventions CardForge distinguées des règles explicites de l'auteur.

**Dépendances Jira natives reçues :** [CAR-26](https://lmn24.atlassian.net/browse/CAR-26), [CAR-27](https://lmn24.atlassian.net/browse/CAR-27).


## CAR-5 — [MVP] Catalogue, plateaux, tutoriels et accessibilité

## Objectif

Permettre au joueur de choisir un jeu, comprendre et utiliser son plateau et ses aides, et naviguer sans perdre sa partie.

## Critères de sortie

* Les Stories enfants portent des critères d'acceptation exécutables, leurs dépendances et sources vérifiables.
* Les travaux livrés ont des preuves de tests ; une spécification documentaire ne vaut pas validation du code.
* Aucune modification des règles originales par la couche graphique.

## Références

FR-01..04, FR-10..15, FR-22, FR-32 ; NFR-05 ; GC-22..25, GC-29..53  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md

### [CAR-29 — [S22] Catalogue immersif et disponibilité honnête des cinq jeux](https://lmn24.atlassian.net/browse/CAR-29)

## Besoin utilisateur

En tant que joueur solo, je souhaite découvrir les univers et l'état de chaque jeu, afin de choisir un titre jouable sans fausse promesse.

## Critères d'acceptation

1. Les cinq jeux sont présentés avec titre, univers, courte description et statut ; seuls CTD et GC peuvent devenir Disponibles après validation.
2. Card Capture, Loot the Loop et Les Douze Tyrans sont À venir ; Les Douze Tyrans apparaît dans l'univers Grèce antique, avec traçabilité Regicide en référentiel interne.
3. Aucun jeu indisponible n'expose d'action Jouer active ; le titre Bastion Stellaire reste provisoire tant que non validé.

## Dépendances

CAR-8 (socle de cartes). La vérification de disponibilité avant publication relève de CAR-43 ; elle ne bloque pas la création du catalogue.

## Références fonctionnelles et impacts

FR-01/02/32 ; docs/cadrage.md ; Mary Regicide §13    
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md    
Règles CTD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md    
Règles Gridcannon : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md    
Architecture : AD-02/05/10 selon capacité.

## Recette

Contrôles UX et accessibilité à détailler avec Sally, sans rouvrir les décisions fonctionnelles déjà prises.

**Dépendances Jira natives reçues :** [CAR-8](https://lmn24.atlassian.net/browse/CAR-8).

### [CAR-30 — [S23] Fiches et navigation contextualisée sans abandon](https://lmn24.atlassian.net/browse/CAR-30)

## Besoin utilisateur

En tant que joueur solo, je souhaite accéder à jouer, reprendre, règles et statistiques, afin de retrouver chaque jeu et sa progression.

## Critères d'acceptation

1. Chaque fiche jouable présente Jouer, Reprendre selon sauvegarde, Nouvelle partie, Règles, Statistiques et accès au tutoriel.
2. Retour catalogue/règles/statistiques/paramètres ne clôture pas la partie ni ne change les statistiques.
3. Navigation tactile et clavier, sans barre permanente occupant le plateau ; présence d'une partie active visible.

## Dépendances

S22, S06, S08.

## Références fonctionnelles et impacts

FR-02/03/04/13/15  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Règles CTD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md  
Règles Gridcannon : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md  
Architecture : AD-02/05/10 selon capacité.

## Recette

Contrôles UX et accessibilité à détailler avec Sally, sans rouvrir les décisions fonctionnelles déjà prises.

**Dépendances Jira natives reçues :** [CAR-29](https://lmn24.atlassian.net/browse/CAR-29), [CAR-13](https://lmn24.atlassian.net/browse/CAR-13).

### [CAR-31 — [S24] Plateau interactif Clear the Dungeon avec cartes illustrées](https://lmn24.atlassian.net/browse/CAR-31)

## Besoin utilisateur

En tant que joueur solo, je souhaite voir et manipuler les cartes/monstres de CTD, afin de jouer ses attaques et défausses sans ambiguïté.

## Critères d'acceptation

1. Cartes graphiques propres à l'univers Dark Fantasy, identifiants métier et valeurs/enseigne lisibles sans dépendance à la couleur.
2. Poses provisoires, reprises, défausses irréversibles, dégâts et bouton explicite Terminer la main suivent seulement les coups légaux du moteur.
3. Actions destructives et issues affichées clairement ; présentation ne décide jamais de la validité ni du résultat.

## Dépendances

S11 à S14, S23.

## Références fonctionnelles et impacts

FR-06/10/11 ; CTD-ARB-01/02/13/14  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Règles CTD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md  
Règles Gridcannon : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md  
Architecture : AD-02/05/10 selon capacité.

## Recette

Contrôles UX et accessibilité à détailler avec Sally, sans rouvrir les décisions fonctionnelles déjà prises.

**Dépendances Jira natives reçues :** [CAR-21](https://lmn24.atlassian.net/browse/CAR-21), [CAR-30](https://lmn24.atlassian.net/browse/CAR-30).

### [CAR-32 — [S25] Plateau Gridcannon avec prévisualisation et confirmation des actions](https://lmn24.atlassian.net/browse/CAR-32)

## Besoin utilisateur

En tant que joueur solo, je souhaite voir les piles, lignes de tir, armures et effets avant validation, afin de comprendre les conséquences des coups.

## Critères d'acceptation

1. Grille 3×3, piles, figures, réserve, séquence de recherche et valeurs de résistance/armure lisibles selon GC-22/36/43.
2. Prévisualisation GC-23 et confirmations GC-30/47/52 non mutantes ; validation unique déclenche transition et persistance.
3. Résultats de double tir et dommages restitués sans animations indispensables, compatibilité tactile/clavier/écran réduit.

## Dépendances

S16 à S21, S23.

## Références fonctionnelles et impacts

FR-06/10/12 ; Mary GC-22/23/24/30/36/43/47/52  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Règles CTD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md  
Règles Gridcannon : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md  
Architecture : AD-02/05/10 selon capacité.

## Recette

Contrôles UX et accessibilité à détailler avec Sally, sans rouvrir les décisions fonctionnelles déjà prises.

**Dépendances Jira natives reçues :** [CAR-28](https://lmn24.atlassian.net/browse/CAR-28), [CAR-30](https://lmn24.atlassian.net/browse/CAR-30).

### [CAR-33 — [S26] Tutoriels facultatifs et règles consultables pour les deux jeux](https://lmn24.atlassian.net/browse/CAR-33)

## Besoin utilisateur

En tant que joueur solo, je souhaite choisir d'apprendre ou jouer librement, afin de découvrir les règles sans barrière ni changement mécanique.

## Critères d'acceptation

1. Premier accès par jeu : Apprendre à jouer / Jouer directement, choix mémorisé localement, jeu libre jamais bloqué.
2. Un tutoriel propre à CTD et un à GC sont relançables ; leurs parties scénarisées n'affectent ni sauvegardes ordinaires ni statistiques.
3. Règles complètes, aide contextuelle facultative et actions permises consultables ; aides désactivables indépendamment des règles.

## Dépendances

S24, S25, S28.

## Références fonctionnelles et impacts

FR-13/14/15 ; CTD, GC GC-26/49  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Règles CTD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md  
Règles Gridcannon : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md  
Architecture : AD-02/05/10 selon capacité.

## Recette

Contrôles UX et accessibilité à détailler avec Sally, sans rouvrir les décisions fonctionnelles déjà prises.

**Dépendances Jira natives reçues :** [CAR-31](https://lmn24.atlassian.net/browse/CAR-31), [CAR-32](https://lmn24.atlassian.net/browse/CAR-32).

### [CAR-34 — [S27] Bilan immersif, statistiques visibles et accessibilité](https://lmn24.atlassian.net/browse/CAR-34)

## Besoin utilisateur

En tant que joueur solo, je souhaite comprendre les résultats et jouer sans obstacle d'interface, afin de pouvoir rejouer et mesurer mes parties.

## Critères d'acceptation

1. Victoire/défaite avec bilan propre au jeu, score uniquement lorsqu'il est défini, boutons Rejouer et Catalogue accessibles immédiatement.
2. Statistiques par jeu : victoire/défaite/abandon et taux victoires/(victoires+défaites), — si aucun résultat normal ; tutoriels exclus.
3. Navigation clavier et tactile, alternative aux couleurs/sons, animations réduites et focus préservé sur écrans mobiles.

## Dépendances

S07, S14, S21, S24, S25.

## Références fonctionnelles et impacts

FR-22/24/25 ; NFR-05 ; GC-39/40/41/48/53  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Règles CTD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md  
Règles Gridcannon : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md  
Architecture : AD-02/05/10 selon capacité.

## Recette

Contrôles UX et accessibilité à détailler avec Sally, sans rouvrir les décisions fonctionnelles déjà prises.

**Dépendances Jira natives reçues :** [CAR-14](https://lmn24.atlassian.net/browse/CAR-14).


## CAR-6 — [MVP] Préférences, langues et expérience hors ligne

## Objectif

Jouer localement, en français/anglais et hors connexion, avec réglages, suppression volontaire et crédits.

## Critères de sortie

* Les Stories enfants portent des critères d'acceptation exécutables, leurs dépendances et sources vérifiables.
* Les travaux livrés ont des preuves de tests ; une spécification documentaire ne vaut pas validation du code.
* Aucune modification des règles originales par la couche graphique.

## Références

FR-26..31 ; NFR-06/07/08/09/10 ; GC-26..28 ; AD-07/08  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md

### [CAR-35 — [S28] Localisation intégrale FR/EN et repli anglais](https://lmn24.atlassian.net/browse/CAR-35)

## Besoin utilisateur

En tant que joueur solo de CardForge, je souhaite utiliser CardForge dans la langue choisie, afin de comprendre tous les écrans et règles.

## Critères d'acceptation

1. L'app et les deux jeux ont messages, règles, aides, tutoriels, erreurs et bilans FR/EN complets.
2. Langue initiale issue des préférences parmi langues livrées ; choix manuel persistant et prioritaire ; repli anglais si indisponible.
3. Changer de langue ne change jamais carte, sauvegarde, probabilité ou état de partie ; ressources linguistiques disponibles hors ligne.

## Dépendances

S22 et moteurs ; intégration continue.

## Références et impacts

FR-26 ; NFR-06 ; GC-26/27/28 ; AD-05/07  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md  
Règles Mary : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md et https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md

## Preuve attendue

Tests ou vérifications explicitement attestés ; pas de conformité déduite d'une simple documentation.

**Dépendances Jira natives reçues :** [CAR-29](https://lmn24.atlassian.net/browse/CAR-29).

### [CAR-36 — [S29] Réglages partagés musique, sons, animations et aides](https://lmn24.atlassian.net/browse/CAR-36)

## Besoin utilisateur

En tant que joueur solo de CardForge, je souhaite adapter les effets et assistances à mes préférences, afin de jouer confortablement.

## Critères d'acceptation

1. Musique et effets sonores contrôlables séparément, préférences sauvegardées localement.
2. Animations en modes suivre système, activer, désactiver ; mode système respecte réduction des mouvements, résultats toujours lisibles sans animation.
3. Aides facultatives activables/désactivables ; aucun paramètre ne modifie la mécanique des jeux.

## Dépendances

S28, S24/S25.

## Références et impacts

FR-12/26 ; NFR-05 ; GC-53  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md  
Règles Mary : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md et https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md

## Preuve attendue

Tests ou vérifications explicitement attestés ; pas de conformité déduite d'une simple documentation.

**Dépendances Jira natives reçues :** [CAR-35](https://lmn24.atlassian.net/browse/CAR-35).

### [CAR-37 — [S30] Confidentialité, gestion et suppression volontaire des données](https://lmn24.atlassian.net/browse/CAR-37)

## Besoin utilisateur

En tant que joueur solo de CardForge, je souhaite comprendre et effacer mes données locales, afin de garder le contrôle de la progression.

## Critères d'acceptation

1. Information claire : parties, résultats et préférences restent sur l'appareil, sans compte, publicité ni synchronisation.
2. Effacement uniquement sur action explicite avec description du périmètre et confirmation ; Annuler ne modifie rien.
3. Granularité définitive de suppression à valider avec Product Owner avant codage (hypothèse A-01), sans disparition silencieuse des autres données.

## Dépendances

S05/S07.

## Références et impacts

FR-27/28 ; NFR-07/10 ; hypothèse A-01  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md  
Règles Mary : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md et https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md

## Preuve attendue

Tests ou vérifications explicitement attestés ; pas de conformité déduite d'une simple documentation.

**Dépendances Jira natives reçues :** [CAR-12](https://lmn24.atlassian.net/browse/CAR-12).

### [CAR-38 — [S31] PWA installable avec ressources des deux jeux hors ligne](https://lmn24.atlassian.net/browse/CAR-38)

## Besoin utilisateur

En tant que joueur solo de CardForge, je souhaite ouvrir et jouer sans connexion après préparation, afin de jouer partout sur mon appareil.

## Critères d'acceptation

1. Manifeste et cache versionné couvrent l'application, deux jeux, illustrations, sons nécessaires et textes FR/EN ; aucun CDN requis pour jouer.
2. Jeu marqué prêt hors ligne seulement après installation complète de ses ressources ; accès hors connexion et redémarrage réussis.
3. Mise à jour de cache ne purge ni sauvegardes IndexedDB ni statistiques ; état de préparation clairement affiché.

## Dépendances

S22/S24/S25/S28/S05.

## Références et impacts

FR-30/32 ; NFR-08 ; AD-07/08  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md  
Règles Mary : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md et https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md

## Preuve attendue

Tests ou vérifications explicitement attestés ; pas de conformité déduite d'une simple documentation.

**Dépendances Jira natives reçues :** [CAR-35](https://lmn24.atlassian.net/browse/CAR-35), [CAR-31](https://lmn24.atlassian.net/browse/CAR-31), [CAR-32](https://lmn24.atlassian.net/browse/CAR-32).

### [CAR-39 — [S32] Écran d'informations, crédits et notices de licence](https://lmn24.atlassian.net/browse/CAR-39)

## Besoin utilisateur

En tant que joueur solo de CardForge, je souhaite connaître les auteurs et les droits des œuvres, afin de comprendre les crédits et conditions d'utilisation.

## Critères d'acceptation

1. Version application, crédits de créations originales, auteurs des jeux sources et notices de licence accessibles.
2. Crédits CTD, Tom Francis et autres sources affichés selon périmètre vérifié, sans afficher une autorisation non documentée comme acquise.
3. Le titre public provisoire Bastion Stellaire n'est pas présenté comme juridiquement validé ; aucune publication ne contourne le contrôle S36.

## Dépendances

CAR-29 (catalogue). La vérification juridique finale est effectuée après cette Story par CAR-43 ; aucune dépendance circulaire.

## Références et impacts

FR-29 ; NFR-10 ; CTD droits, GC-17    
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md    
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md    
Règles Mary : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md et https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md

## Preuve attendue

Tests ou vérifications explicitement attestés ; pas de conformité déduite d'une simple documentation.

**Dépendances Jira natives reçues :** [CAR-29](https://lmn24.atlassian.net/browse/CAR-29).


## CAR-7 — [MVP] Validation de conformité, CI et publication Web

## Objectif

Bloquer toute publication trompeuse tant que les règles, transactions, parcours, ressources et droits des deux jeux ne sont pas vérifiés.

## Critères de sortie

* Les Stories enfants portent des critères d'acceptation exécutables, leurs dépendances et sources vérifiables.
* Les travaux livrés ont des preuves de tests ; une spécification documentaire ne vaut pas validation du code.
* Aucune modification des règles originales par la couche graphique.

## Références

SM-01..05 ; NFR-01..11 ; AD-06/12 ; Mary matrices CTD et Gridcannon §68  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md

### [CAR-40 — [S33] Tests unitaires exécutables du socle et des moteurs](https://lmn24.atlassian.net/browse/CAR-40)

## Besoin utilisateur

En tant que joueur solo de CardForge, je souhaite des preuves de conformité au lieu de tests textuels, afin de avoir deux jeux fiables.

## Critères d'acceptation

1. Les tests exécutent le code TypeScript des cartes, mélange, états et moteur au lieu de lire seulement le texte source.
2. Chaque scénario CTD et GC retenu dans les matrices Mary a un test exécutable ou une justification explicite de non-applicabilité validée.
3. CI rouge si résultat incorrect, identité dupliquée ou issue erronée ; aucun test déclaré réussi sans exécution.

## Dépendances

S01–S04, S10–S21.

## Références et impacts

AD-06 ; NFR-01/02/03 ; matrices Mary CTD et GC  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md  
Règles Mary : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md et https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md

## Preuve attendue

Tests ou vérifications explicitement attestés ; pas de conformité déduite d'une simple documentation.

**Dépendances Jira natives reçues :** [CAR-21](https://lmn24.atlassian.net/browse/CAR-21), [CAR-28](https://lmn24.atlassian.net/browse/CAR-28).

### [CAR-41 — [S34] Tests d'intégration des sauvegardes, migrations et résultats](https://lmn24.atlassian.net/browse/CAR-41)

## Besoin utilisateur

En tant que joueur solo de CardForge, je souhaite que fermeture, panne et reprise soient réellement testées, afin de ne jamais perdre une partie ou doubler un score.

## Critères d'acceptation

1. Tests d'intégration IndexedDB pour deux jeux indépendants, fermeture/reprise, échec transactionnel et migration incompatible.
2. Concurrence/double action terminale, abandon et statistiques ne produisent qu'un résultat ni compteur une fois.
3. Échec de migration ou stockage plein conserve les données récupérables et informe correctement le joueur.

## Dépendances

S05–S09, S33.

## Références et impacts

AD-04/06/09/10/11 ; NFR-03/04  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md  
Règles Mary : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md et https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md

## Preuve attendue

Tests ou vérifications explicitement attestés ; pas de conformité déduite d'une simple documentation.

**Dépendances Jira natives reçues :** [CAR-14](https://lmn24.atlassian.net/browse/CAR-14), [CAR-40](https://lmn24.atlassian.net/browse/CAR-40).

### [CAR-42 — [S35] CI Web et recette E2E FR/EN, mobile et hors ligne](https://lmn24.atlassian.net/browse/CAR-42)

## Besoin utilisateur

En tant que joueur solo de CardForge, je souhaite qu'une version déployée soit réellement vérifiée, afin de jouer sur un Web/PWA stable.

## Critères d'acceptation

1. GitHub Actions exécute build TypeScript, tests métier, intégration et scénarios E2E Web ; échec bloque publication.
2. Parcours de bout en bout CTD/GC en FR/EN, clavier/tactile, reprise et mode hors connexion vérifiés sur environnements cibles.
3. Séparation explicite build Web MVP et travaux ultérieurs Capacitor Android/iOS ; aucun statut mobile accepté sur simple build Web.

## Dépendances

S24–S31, S33/S34.

## Références et impacts

AD-06/08/12 ; NFR-05/06/08/09  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md  
Règles Mary : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md et https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md

## Preuve attendue

Tests ou vérifications explicitement attestés ; pas de conformité déduite d'une simple documentation.

**Dépendances Jira natives reçues :** [CAR-38](https://lmn24.atlassian.net/browse/CAR-38), [CAR-41](https://lmn24.atlassian.net/browse/CAR-41).

### [CAR-43 — [S36] Gate de publication : droits, conformité et disponibilité](https://lmn24.atlassian.net/browse/CAR-43)

## Besoin utilisateur

En tant que joueur solo de CardForge, je souhaite accéder uniquement aux jeux prêts et autorisés, afin de éviter des versions trompeuses ou non conformes.

## Critères d'acceptation

1. Clear the Dungeon n'est publiable que si l'accord auteur gratuit est conservé et son périmètre (nom, Web, crédit) clarifié.
2. Gridcannon V2 n'est publiable qu'après conformité de tests, vérification des conventions CardForge, crédits Tom Francis et vérification du titre public.
3. Jeux affichés Disponibles seulement lorsque matrice tests réussie, ressources/licences contrôlées, FR/EN et offline validés ; sinon À venir.

## Dépendances

S14, S21, S22, S32, S33–S35.

## Références et impacts

FR-05/29/32/33 ; SM-01..05 ; Mary CTD droits et Gridcannon §68  
PRD : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/prds/prd-CardForge-2026-11-22/prd.md  
Architecture : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md  
Règles Mary : https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/clear-the-dungeon.md et https://github.com/JeanLamora75/CardForge/blob/main/\_bmad-output/planning-artifacts/game-rules/gridcannon.md

## Preuve attendue

Tests ou vérifications explicitement attestés ; pas de conformité déduite d'une simple documentation.

**Dépendances Jira natives reçues :** [CAR-39](https://lmn24.atlassian.net/browse/CAR-39), [CAR-42](https://lmn24.atlassian.net/browse/CAR-42).


## Validation du découpage et limites

- **7 Epics et 36 Stories** créées et rattachées à leur parent dans Jira CAR ; leurs critères d'acceptation figurent dans chaque ticket.
- Les liens « Blocks » entre tickets matérialisent les dépendances de réalisation. Certaines dépendances secondaires mentionnées dans le texte ne sont pas nécessairement des liens bloquants, notamment lorsqu'une implémentation incrémentale est possible.
- La matrice ci-dessus couvre les **33 FR** et l'inventaire couvre les **11 NFR** du PRD consolidé.
- Le découpage n'établit pas que les moteurs sont implémentés, ni que les tests ou droits sont validés.
- Hypothèse A-01 (granularité de suppression des données) : à valider avant implémentation de CAR-37. « Bastion Stellaire » reste provisoire ; Les Douze Tyrans est la dénomination produit validée pour le jeu futur.
- Les Epics sont des lots de valeur et leurs dépendances peuvent être affinées lors des revues techniques/UX, sans rouvrir les décisions de règles closes.

## Décision postérieure au découpage Jira — nom public Gridcannon (23 novembre 2026)

**Identité produit approuvée : Thunderfighter** pour l'adaptation de **Gridcannon Version 2**, avec attribution du jeu original à **Tom Francis**. **« Bastion Stellaire » est abandonné.** Ce changement modifie le libellé public uniquement, **pas** l'identifiant interne, les parties, statistiques ni les règles Mary.

**Conséquence pour le backlog :** les tickets **CAR-4, CAR-22 à CAR-28, CAR-32, CAR-39 et CAR-43** doivent être interprétés avec le titre public **Thunderfighter**. Les descriptions d'origine comportant « Bastion Stellaire reste provisoire » sont **des instantanés historiques non normatifs** dans cette copie du backlog ; les remplacer par Thunderfighter lors de la prochaine révision approuvée dans Jira. La vérification des droits et de la disponibilité du nom **reste un gate avant diffusion**.

Aucune Story ni Epic Jira n'a été modifiée dans le cadre de cette **mise à jour documentaire BMAD**.
