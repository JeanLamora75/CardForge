---
title: "Midnight Syndicate — cadrage d'implémentation et proposition de User Stories"
type: "bmad-product-implementation-scope"
status: "proposition-à-valider"
owner: "John — Product Manager"
date: "2026-11-24"
jira: "aucune création ou modification"
sources:
  - "../game-rules/loot-the-loop.md"
  - "../architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md"
  - "../prds/prd-CardForge-2026-11-22/prd.md"
  - "../epics.md"
---

# Midnight Syndicate — cadrage d'implémentation et User Stories proposées

**Date :** 24 novembre 2026  
**Agent :** John, Product Manager — BMAD 6.12.4  
**Décision du porteur :** développer **Midnight Syndicate** comme **troisième jeu** de CardForge.  
**Statut :** cadrage et découpage soumis à validation ; **aucun Epic ou Story Jira créé ou modifié**, aucun code de jeu développé par ce document, aucune validation juridique prétendue.  
**Méthode :** lecture directe des sources BMAD, de l'architecture et du dépôt via les connecteurs GitHub/Jira ; pas de script `uv` exécuté ni de nouvelle recherche Web publique.

## 1. Décision produit et périmètre

**Jeu original :** *Loot the Loop* de **Wil Su**, collection *Isaludo*, Beta 1.11.  
**Nom public validé :** **Midnight Syndicate**.  
**Identifiant interne existant et immuable :** `loot-the-loop`.  
**Univers graphique :** métropole de la Prohibition des années 1930, dieselpunk / pulp ; présentation narrative et visuelle **sans incidence sur les règles**.  
**Plateforme :** Web responsive/PWA en premier, réutilisant l'application existante ; Android/iOS Capacitor restent hors livraison de ce lot.  
**Modèle économique :** gratuit et sans publicité.  
**Périmètre de livraison :** jeu solo intégralement jouable en préversion de développement interne, moteur indépendant, sauvegarde/reprise exacte, aides/règles FR/EN, statistiques, hors ligne et tests. L'état public reste « À venir » tant que les contrôles **CAR-43** ne sont pas satisfaits.

**Exclus :** deuxième Joker, cartes/pouvoirs additionnels, monnaie ou ressources de fiction affectant les coups, variantes issues de transcriptions secondaires, score inventé, tirage automatique, synchronisation cloud, export/import et publication automatique.

### Contrat de fidélité : faits normatifs Mary

1. **53 cartes physiques uniques** : 52 ordinaires et **un Joker**, et non la composition à 54 cartes des deux premiers jeux. Les cartes cachées sont identifiables par le moteur mais **pas par le joueur**.
2. **Mise en place originale :** 53 cartes mélangées, toutes face cachée, sans révéler six cartes d'avance. Notes de parcours et butin vides. **Observer** normalement seule action initiale.
3. **Observer (Look Around) :** quand la première carte est cachée, révéler les deux premières sans en changer l'ordre, en ne modifiant que les faces encore cachées. Révéler un piège ne fait pas perdre.
4. **Explorer :** choisir pour distance la valeur d'une carte **2–10 visible parmi les deux premières** ; transférer exactement N cartes du sommet vers le dessous sans altérer leur ordre relatif. Résoudre seulement la **nouvelle carte supérieure visible** : piège J/Q/K = défaite ; As ou numérique = carte retirée au butin ; Joker visible = victoire uniquement après collecte des quatre As ; autre arrivée = continuer.
5. **Marquer un chemin :** retirer du dessus une numérique visible 2–10 et la placer dans les **trois** emplacements de notes au maximum ; pas de butin. **Restituer une note :** replacer une carte notée visible au sommet, en **un tour séparé**, sans échange simultané.
6. **Inspection libre (lecture seule) :** ne révéler que les cartes déjà visibles et leur position, jamais le rang/enseigne d'une face cachée. L'inspection n'est ni un coup ni une modification de pioche.
7. **Victoire :** quatre As dans le butin **ET atterrissage sur le Joker face visible par Explorer** ; la simple révélation du Joker ne gagne pas. **Score officiel : nombre de cartes présentes dans le butin**, y compris les quatre As, pas la somme des valeurs.
8. **Défaite :** atterrissage sur piège visible, ou impasse **vraiment inévitable**. Ne pas perdre au simple constat d'une absence de déplacement direct si Observer/Marquer/Restituer peut encore permettre la continuation.
9. **Invariant :** chaque carte physique figure une fois et une seule dans **pioche circulaire + notes + butin** ; conserver l'ordre, la face, les positions et les phases lors de toute transition, sauvegarde et restauration.

### Points Mary à sécuriser sans changer les règles

- **LTL-R01/R02 — impasses :** stratégie de détection conservatrice, démontrée sur états atteignables ; pas d'heuristique « aucune exploration sûre immédiatement = défaite ». Confirmer avec Mary les cas de défaite sans continuation si une interprétation normative reste ambiguë. Ne jamais inventer une règle pour supprimer l'ambiguïté.
- **LTL-R03 — 0 ou 1 carte restante :** validation des états atteignables, gestion de lecture de seconde carte inexistante ; cas mal défini à qualifier avant d'implémenter un résultat non sourcé.
- **LTL-R04 — mise en place :** décision source déjà établie par Mary, **pas de trois paquets pré-révélés**.
- **LTL-R05 — droits :** jamais d'autorisation présumée. Conserver le blocage CAR-43 (droits d'adaptation, nouveau nom, crédits, licences et provenance des illustrations/sons).

Le référentiel original comporte **19 scénarios LTL-T01 à LTL-T19** : ce sont les oracles initiaux à rendre exécutables, en complétant les tests de propriétés, l'interface et la persistance sans transformer un identifiant de titre en preuve sémantique.

## 2. Réutilisation de l'architecture et impacts

| Zone | Existant confirmé | Adaptation visée pour Midnight Syndicate |
| --- | --- | --- |
| Identifiant et catalogue | `src/catalog.ts` contient déjà `loot-the-loop`, nom Midnight Syndicate et statut `coming-soon` | Conserver le gameId, titre public, univers et **statut non publiable** ; ajouter un accès **technique de préversion** dans les parcours internes, sans le déclarer disponible au public. |
| Moteur | `src/core/game-engine.ts` expose le contrat `createInitialState / getLegalActions / transition / getOutcome / validateState / getVictoryScore?` | Nouveau module **`src/games/loot-the-loop/engine.ts`** ; transitions pures/immuables, contrôles par état, résultat et score officiels. Aucun changement à CTD/GC. |
| Cartes | `src/core/cards.ts` sait produire 52 cartes + deux jokers distincts, et mélanger avec hasard injecté | Sélectionner exactement **un seul Joker physique** (par exemple `joker-1`) à l'initialisation ; l'autre doit être **absent** du paquet et des invariants de ce jeu, sans changer le socle générique. |
| Persistance | `src/application/persistent-game-session.ts`, `registered-save-migrations.ts` et adaptateur IndexedDB | Ajouter une politique versionnée `loot-the-loop` **sans migration fictive** ; sauvegarder les 53 identités, faces, ordre, notes, butin, phase, outcome et seed/état utile ; ne pas réordonner au chargement ; résultat idempotent. |
| Résultats | Statistiques et résultat durable partagés | Réutiliser partie gagnée/perdue/abandonnée ; score officiel **taille du butin**, sans classement inventé. |
| UI | `src/components/GameLearning.tsx`, plateaux indépendants, fiches, règles et crédits | Nouveau plateau responsive, navigation de la pioche et actions légales ; aides/règles FR/EN, visuel art-déco original. Inspection **sans divulgation** de cartes cachées. |
| QA | Node, intégration IndexedDB, Playwright Chromium production FR/EN clavier/tactile/offline, CI | Matrice LTL complète, invariants 53 cartes et non-divulgation, scénarios de reprise, E2E deux langues / deux modalités / offline ; CI bloque les régressions. |
| Gate publication | `src/application/publication-gate.ts` liste Midnight Syndicate avec droits/titre/ressources/tests non vérifiés | Mise à jour **uniquement avec de vraies preuves** ; **ne pas afficher Disponible** en fin de développement tant que CAR-43 reste bloqué. |

**Préconditions d'intégration :** revoir avec Winston le modèle des cartes visibles/cachées et la manière d'inspecter sans exposition des champs cachés à la vue ; avec Sally la navigation par segments d'un cercle ordonné et la sélection d'une distance. Il s'agit d'implémentations UX, pas de nouveaux arbitrages sur les règles.

## 3. Epic et 12 User Stories proposés — non créés dans Jira

**Epic à créer seulement après accord :** `[Post-MVP] Midnight Syndicate — jeu solo Loot the Loop fidèle et jouable Web/PWA`.

Les références **MS-01...MS-12 sont des identifiants de proposition dans ce document**, pas des clés Jira. Chaque Story a un incrément visible, une preuve d'acceptation mesurable et une dépendance explicite.

### MS-01 — Initialiser une partie de 53 cartes et valider l'état

**Besoin :** En tant que joueur, je veux commencer une partie conforme à *Loot the Loop* pour que la première décision soit réglementaire.

**Critères d'acceptation :**
- Exactement 52 cartes ordinaires + **un Joker**, identités physiques distinctes, pioche circulaire mélangée de façon déterministe pour un seed donné, **toutes les faces cachées** ; aucune carte dans notes/butin.
- `getLegalActions` propose **Observer uniquement** dans l'état initial conforme ; aucune pré-révélation de cartes.
- `validateState` refuse toute duplication, omission, deuxième Joker, face invalide ou incohérence de zone ; test d'invariant **53/53**.

**Dépendances :** contrat CAR-9, cartes CAR-8 et Mary LTL-T01/02/19. **Impact :** nouveau moteur / types, tests Node.

### MS-02 — Observer sans modifier l'ordre ni déclencher un piège

**Besoin :** En tant que joueur, je veux révéler les deux cartes en tête pour choisir mon mouvement sans effet de bord.

**Critères :**
- Autoriser Observer seulement si la carte supérieure est cachée, révéler la première et la seconde si elles existent, en préservant strictement les identités et l'ordre ; ne pas retourner deux fois une carte déjà visible.
- Observer un J/Q/K ne déclenche **aucune** défaite et ne crédite aucun butin ; action illégale refusée sans mutation.
- Tests déterministes **LTL-T03, T04 et T05** et états limites d'observation.

**Dépendances :** MS-01. **Impact :** transitions moteur, actions légales, tests.

### MS-03 — Explorer avec distances légales et ordre circulaire conservé

**Besoin :** En tant que joueur, je veux choisir une distance parmi les numériques visibles pour me déplacer exactement comme le jeu original.

**Critères :**
- Distances uniquement celles d'une carte visible **2–10 parmi les deux premières**, deux valeurs distinctes si deux cartes admissibles ; toute autre distance interdite.
- Rotation de **N** cartes de la tête vers le dessous sans re-mélange, sans perte/duplication, y compris la conservation de leur statut face visible/cachée ; résolution de la **nouvelle tête**, pas de la carte utilisée comme distance.
- Arrivée cachée = aucun effet ; **LTL-T05 à T08** exécutés.

**Dépendances :** MS-02. **Impact :** moteur de boucle et tests de propriétés.

### MS-04 — Marquer et restituer jusqu'à trois chemins

**Besoin :** En tant que joueur, je veux placer des cartes numériques visibles en notes et les reprendre pour préparer mes parcours.

**Critères :**
- Marquer uniquement la **première** carte visible 2–10 lorsque **moins de trois** notes sont occupées ; retirer du sommet, conserver visible et sans butin.
- Restituer la note choisie au **sommet** en une action distincte, sans échange, sans bonus de déplacement ; refuser la quatrième note et les indices invalides.
- Zones et nombre physique invariants ; **LTL-T14/T15** exécutés.

**Dépendances :** MS-03 (mécaniques de plateau), peut être développée dès MS-02 pour le noyau. **Impact :** états notes, actions, tests.

### MS-05 — Résoudre destinations, victoire et score officiel

**Besoin :** En tant que joueur, je veux que chaque exploration produise son résultat exact et que les fins de partie soient fiables.

**Critères :**
- **As visible** ou **numérique visible** à l'arrivée : retirer du paquet et ajouter au butin ; score +1 **par carte**, quel que soit son rang.
- **J/Q/K visible** à l'arrivée = défaite ; Joker visible avec moins de quatre As = continuer ; Joker visible avec quatre As déjà collectés = victoire **seulement à l'arrivée en explorant**.
- Score de victoire `butin.length` ; aucune victoire à la simple observation du Joker. Tests **LTL-T09 à T13** ; résultat terminal immuable.

**Dépendances :** MS-03, MS-04 pour la cohérence des zones. **Impact :** résultat et score du moteur.

### MS-06 — Inspection sans révélation des cartes cachées et détection prudente d'impasse

**Besoin :** En tant que joueur, je veux consulter les indices autorisés et ne jamais perdre à cause d'une impasse annoncée à tort.

**Critères :**
- API de **projection publique** : positions, faces visibles, notes et butin ; pour une carte cachée, **aucun identifiant/rang/enseigne exposé dans les données rendues** et aucune révélation par inspection.
- L'inspection n'est pas une transition ni une action de tour ; interdit d'émettre un événement de sauvegarde ou statistique pour elle. **LTL-T16**.
- La défaite d'impasse est prononcée seulement avec une **preuve testée d'absence de continuation légale**, y compris actions Observer/Marquer/Restituer ; sinon conserver « en cours ». **LTL-R01/R02 et LTL-T17** testés, avec revue Mary pour les situations réellement ambiguës ; **LTL-R03** protégé contre dépassement d'index pour 0–1 carte.

**Dépendances :** MS-01 à MS-05 ; revue de source Mary sur R01/R02/R03 si un comportement non prouvé est requis. **Impact :** projection de visibilité et fin de partie.

### MS-07 — Sauvegarde/reprise transactionnelle du troisième jeu

**Besoin :** En tant que joueur, je veux retrouver sans remélange les cartes cachées et visibles, le paquet, les notes et le butin après interruption.

**Critères :**
- Utiliser le `gameId: loot-the-loop` stable, une seule partie active et version de format explicite ; intégrer sa politique `registered-save-migrations`, **aucune conversion inventée**.
- Reprise strictement identique : ordre circulaire, identités, faces, notes, butin, résultat et état de tour ; ancien format incompatible conservé et signalé, transaction échouée non destructive.
- Tests de redémarrage avec **IndexedDB réel de navigateur / adaptateur**, isolation des deux autres jeux et **LTL-T18**.

**Dépendances :** MS-06, ports CAR-12/13/16/41. **Impact :** application, stockage, intégration.

### MS-08 — Clôture et statistiques sans doublons

**Besoin :** En tant que joueur, je veux consulter le résultat officiel de Midnight Syndicate sans perdre ni compter deux fois mes parties.

**Critères :**
- Victoire/défaite/abandon distincts, résultats idempotents et atomiques avec sauvegarde/statistiques ; le score `butin.length` est publié **uniquement quand les règles le définissent**, pas d'autre bonus.
- Relance, double clic ou deux onglets ne dupliquent pas résultat ni compteur ; les tutoriels ne comptent pas.
- Les statistiques existantes des autres jeux restent inchangées ; tests de transaction et d'idempotence.

**Dépendances :** MS-05, MS-07 ; CAR-14/15/41. **Impact :** résultat et interface statistiques.

### MS-09 — Plateau responsive et interactions de jeu accessibles

**Besoin :** En tant que joueur, je veux explorer les cartes, choisir mes actions et consulter mes notes clairement au clavier ou au tactile.

**Critères :**
- Afficher ordre du paquet et cartes visibles sans révéler les faces cachées ; proposer **Observer, Explorer (distance sélectionnée), Marquer, Restituer** seulement si légales ; inspection consultative distincte d'un tour.
- Prévisualisation/sélection sans mutation durable ; action confirmée → moteur puis sauvegarde ; statut enregistré uniquement après commit, refus explicite des coups illégaux.
- Vue 390px et desktop, navigation clavier, états focus, confirmation et retour catalogue sans abandon. Aucun nouveau pouvoir créé par les illustrations années 1930.

**Dépendances :** MS-06/07 ; atelier court Sally + Winston. **Impact :** nouveau plateau React, navigation interne.

### MS-10 — Règles et apprentissage FR/EN

**Besoin :** En tant que nouveau joueur, je veux apprendre les règles ou jouer directement dans ma langue, hors connexion.

**Critères :**
- Choix tutoriel facultatif / jeu direct ; règles fidèles à Mary expliquant **53 cartes et un Joker**, observation, déplacement, notes, pièges, quatre As/Joker et score ; pas de prétendu score par valeur.
- FR/EN complets sur actions, aides, tutoriel, erreurs, règles et résultat ; langue mémorisée sans incidence sur état mécanique.
- Tutoriel n'incrémente pas les statistiques ; ressources de règles accessibles hors ligne et changement de langue testé.

**Dépendances :** MS-09, CAR-30 à CAR-38 (socle). **Impact :** GameLearning/Rulebook/i18n, UX Sally et doc Camille.

### MS-11 — Matrice de conformité et tests d'intégration / E2E

**Besoin :** En tant que responsable qualité, je veux une preuve exécutable de la fidélité du troisième jeu, de sa reprise et de son fonctionnement Web/PWA.

**Critères :**
- **LTL-T01 à LTL-T19** chacun associés à un ou plusieurs tests métier avec assertions vérifiant réellement leur Given/When/Then, pas seulement un titre correspondant ; anomalies d'oracle documentées et validées par Mary.
- Tests de propriétés sur graines déterministes : 53 cartes uniques, somme des zones égale à 53, ordre et orientation invariants, refus sans mutation, déterminisme ; faux positifs de couverture détectés.
- Tests IndexedDB + Playwright **build de production** : parcours FR/EN × clavier/tactile, modification d'état, fermeture/reprise hors ligne, jeu terminé, statistiques une fois ; CI complète verte sur un même commit.

**Dépendances :** MS-01 à MS-10 ; QA Murat, infrastructure CAR-40/41/42. **Impact :** nouvelle suite, audit Mary et workflow.

### MS-12 — Dossier de publication bloqué jusqu'aux preuves réelles

**Besoin :** En tant que joueur, je veux que Midnight Syndicate ne soit annoncé « Disponible » que lorsqu'il est conforme et autorisé.

**Critères :**
- Attribution exacte « **d'après Loot the Loop, Wil Su (Isaludo)** » ; registre CAR-43 vérifie les droits d'adaptation, la portée Web, le nom **Midnight Syndicate**, l'origine des visuels/sons/polices, tests de règles, FR/EN et offline.
- Sans pièces réellement vérifiées, statut **À venir**, aucun `available` / déploiement public, et `release:check` échoue en cas de promotion illicite. **Ne pas ajouter de faux justificatifs ni publier de document privé sensible sur GitHub.**
- Une CI verte autorise seulement les **tests internes** ; une publication ultérieure dépend de validation humaine et d'un déploiement contrôlé.

**Dépendances :** MS-10/11 ; CAR-39/43 et confirmation juridique externe distincte. **Impact :** registre de preuves, crédits et gate de publication.

## 4. Ordre de réalisation et critères de passage

| Lot | Stories | Preuve de sortie |
| --- | --- | --- |
| **A — Moteur jouable** | MS-01 → MS-02 → MS-03 → MS-04 → MS-05, puis MS-06 | Au moins une partie déterministe, actions exactes, contrôle des cartes visibles, règles et score, pas de faux résultat |
| **B — Intégration** | MS-07 et MS-08 | Sauvegarde/restauration complète du troisième jeu, score et statistique unique, aucune régression CTD/GC |
| **C — Expérience** | MS-09 et MS-10 | Plateau accessible, règles et tutoriel FR/EN, fonctionnement hors connexion |
| **D — Qualification** | MS-11 | Matrice Mary réellement exécutée, E2E et CI verte sur un même commit |
| **E — Autorisations** | MS-12 (dossier possible en parallèle, clôture conditionnelle) | Justificatifs vérifiés ; **aucun feu vert de diffusion préemptif** |

**MVP CardForge original :** les deux premiers jeux restent le MVP historique. Ce troisième jeu est un **lot d'extension post-MVP**, malgré sa réalisation possible dès maintenant en préversion interne.

### Principaux risques et mesures

- **Impasse et révélation de secrets — élevé :** non-divulgation en projection UI, tests d'états atteignables, Mary tranche uniquement les ambiguïtés fondées sur les sources ; pas de défaite arbitraire.
- **Invariants et circularité — élevé :** paquet physique ordonné avec état de face associé à chaque carte, 53 IDs contrôlés à chaque transition.
- **Régression multi-jeux — moyen :** aucun changement de `gameId` historique, moteur isolé et conservation des tests CTD/GC et de l'adaptateur partagé.
- **Portée du travail UI — moyen :** réutilisation du shell et des composants existants, mais **nouveau plateau spécifique** ; éviter de transformer le troisième jeu en refonte globale.
- **Droits et nouveau titre — bloquant pour diffusion** : développement interne permis selon politique du projet ; aucune autorisation présumée. Analyse juridique spécialisée si nécessaire.

## 5. Décisions requises avant création Jira

**Déjà validé par le porteur :** titre **Midnight Syndicate**, univers Prohibition/dieselpunk/pulp, règles source de *Loot the Loop* inchangées, troisième jeu à développer.

**À valider maintenant :**
1. Créer **un nouvel Epic post-MVP** dans Jira CAR pour Midnight Syndicate (plutôt que de réouvrir les Epics du MVP existant).
2. Adopter les **12 Stories MS-01...MS-12** et leur ordre, avec conservation du statut **À venir** jusqu'au passage CAR-43.
3. Autoriser **ensuite** John à créer l'Epic et ces Stories dans Jira — **aucune création actuelle**.

Les détails de conformité **LTL-R01/R02/R03** sont des vérifications de source et de tests, non une invitation à inventer un nouveau choix de règles ou à complexifier la consultation produit.

## 6. Références vérifiables et limites

- **Mary / oracles :** [référentiel original Loot the Loop](../game-rules/loot-the-loop.md), notamment §3–8 et LTL-T01...T19.
- **PRD :** [CardForge — PRD](../prds/prd-CardForge-2026-11-22/prd.md).
- **Architecture :** [Winston — Architecture Spine](../architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md), AD-01 à AD-12.
- **Stories déjà créées du MVP :** [`epics.md`](../epics.md) ; requête Jira CAR sans Story explicitement nommée Midnight/Loot au moment de cette consultation.
- **Code partagé :** `src/core/cards.ts`, `src/core/game-engine.ts`, `src/application/persistent-game-session.ts`, `src/application/registered-save-migrations.ts`, `src/application/publication-gate.ts`.
- **Gate juridique :** [CAR-43](https://lmn24.atlassian.net/browse/CAR-43).

**Aucune recherche Web externe nouvelle, aucun script `uv`, aucune création Jira et aucun développement du troisième moteur exécutés dans cette étape.** Les estimations de complexité restent qualitatives ; un effort chiffré en points est à estimer par l'équipe après revue Winston/Sally.

## 7. Publication Jira — validation et création le 24 novembre 2026

**Décision utilisateur :** validation explicite de l'Epic Midnight Syndicate et des douze Stories puis autorisation de création dans Jira CAR. **Statut : créé et vérifié dans Jira** (la proposition des sections 3 et 5 reste conservée pour la traçabilité historique).

**Epic :** [CAR-44 — Midnight Syndicate post-MVP](https://lmn24.atlassian.net/browse/CAR-44).

| Référence BMAD | Jira | Résumé |
| --- | --- | --- |
| MS-01 | [CAR-45](https://lmn24.atlassian.net/browse/CAR-45) | Initialisation 53 cartes |
| MS-02 | [CAR-46](https://lmn24.atlassian.net/browse/CAR-46) | Observer |
| MS-03 | [CAR-47](https://lmn24.atlassian.net/browse/CAR-47) | Explorer et pioche circulaire |
| MS-04 | [CAR-48](https://lmn24.atlassian.net/browse/CAR-48) | Marquer et restituer |
| MS-05 | [CAR-49](https://lmn24.atlassian.net/browse/CAR-49) | Destination, victoire, score |
| MS-06 | [CAR-50](https://lmn24.atlassian.net/browse/CAR-50) | Inspection sécurisée et impasses |
| MS-07 | [CAR-51](https://lmn24.atlassian.net/browse/CAR-51) | Sauvegarde/reprise |
| MS-08 | [CAR-52](https://lmn24.atlassian.net/browse/CAR-52) | Clôture et statistiques |
| MS-09 | [CAR-53](https://lmn24.atlassian.net/browse/CAR-53) | Plateau accessible |
| MS-10 | [CAR-54](https://lmn24.atlassian.net/browse/CAR-54) | Règles et apprentissage FR/EN |
| MS-11 | [CAR-55](https://lmn24.atlassian.net/browse/CAR-55) | Matrice Mary et E2E |
| MS-12 | [CAR-56](https://lmn24.atlassian.net/browse/CAR-56) | Dossier de publication |

**Vérifications effectuées :** requête Jira `project = CAR AND parent = CAR-44` renvoyant exactement **12 Stories**, toutes de type Story et dont `parent.key = CAR-44` ; chaque description contient ses critères d'acceptation, dépendances, impacts et références BMAD. **17 liens de dépendance « Blocks »** créés au total entre Stories et avec le blocage **CAR-43 → CAR-56**, et vérifiés dans les liens des tickets, notamment CAR-45, CAR-52 et CAR-56.

**Important :** aucune Story n'est terminée par sa seule création et aucune diffusion publique n'est autorisée. Les autres tickets MVP n'ont pas été modifiés (sauf le lien de dépendance sortant de CAR-43 vers CAR-56). Les scripts BMAD `uv` et les tests de code n'ont pas été exécutés dans cette opération documentaire et Jira.

## 8. Décision artistique validée — les quatre preuves (26 novembre 2026)

**Responsable UX : Sally — décision du porteur validée.** Les quatre As de Midnight Syndicate sont représentés par les quatre pièces d'enquête suivantes, dans l'univers film noir / Art déco des années 1930. Cette décision remplace toute proposition graphique antérieure concernant les preuves.

| Référence UX | Preuve validée | Intention visuelle |
| --- | --- | --- |
| MS-P01 | Photo compromettante de versement de pot-de-vin | Photographie d'époque montrant une remise d'argent compromettante. |
| MS-P02 | Boîte d'allumettes d'un hôtel de luxe avec un numéro de téléphone griffonné | Boîte raffinée d'époque, enseigne d'hôtel fictive et numéro manuscrit fictif. |
| MS-P03 | Télégramme codé avec son carnet de décodage | Télégramme et carnet associés, constituant ensemble une seule preuve et une seule carte. |
| MS-P04 | Ticket de consigne de gare | Ticket de consigne ferroviaire d'époque, reconnaissable et distinct des autres objets. |

### Contraintes fonctionnelles et techniques

- Une preuve correspond à un As physique distinct ; quatre preuves au total, collectables dans n'importe quel ordre. Aucun pouvoir spécifique ni condition supplémentaire.
- Chaque preuve collectée vaut un point dans le butin. La victoire exige toujours les quatre As collectés puis une arrivée sur le Joker visible par l'action Explorer.
- Conserver les identifiants internes des As, le paquet de 53 cartes, les règles, les probabilités, la sauvegarde et le score. La correspondance précise entre MS-P01 à MS-P04 et les quatre identifiants d'As reste à définir lors de l'intégration ; elle n'a aucun effet mécanique.
- Direction UX proposée : gabarit vert émeraude et or, objets immédiatement reconnaissables à taille mobile, compteur Preuves X/4 et indication des preuves collectées. Ne jamais divulguer l'identité d'une carte cachée ; dos commun.
- Fournir à Amelia des illustrations indépendantes, selon [le référentiel graphique](../../docs/graphic-assets-standard.md) : PNG maîtres, noms ASCII minuscules en kebab-case, manifeste et empreintes SHA-256. Aucun texte fonctionnel ni valeur de jeu figés dans les illustrations ; les inscriptions diégétiques fictives sur les objets sont permises.
- Traçabilité : MS-09 / [CAR-53](https://lmn24.atlassian.net/browse/CAR-53), MS-10 / [CAR-54](https://lmn24.atlassian.net/browse/CAR-54). Cette décision documentaire ne vaut ni production des illustrations ni validation de l'intégration.

## 9. Décision artistique validée — les douze menaces et les écrans de défaite (26 novembre 2026)

**Responsable UX : Sally — décision du porteur validée.** Les douze figures (quatre Valets, quatre Dames, quatre Rois) deviennent douze menaces distinctes. Les regroupements ci-dessous sont exclusivement narratifs, sans incidence sur les règles.

| Référence | Catégorie narrative | Menace validée | Illustration / contexte |
| --- | --- | --- | --- |
| MS-M01 | Rencontres dangereuses | Le Parrain | Dirigeant du syndicat dans son luxueux bureau ; couverture compromise. |
| MS-M02 | Rencontres dangereuses | La Veuve Noire | Mystérieuse femme fatale attirant l'enquêteur dans un piège. |
| MS-M03 | Rencontres dangereuses | Le Tueur à gages | Homme de main ayant retrouvé la trace de l'enquêteur. |
| MS-M04 | Rencontres dangereuses | La Balance | Informateur révélant l'identité de l'enquêteur au syndicat. |
| MS-M05 | Guets-apens | L'Embuscade | Ruelle sombre dont les issues sont bloquées par le syndicat. |
| MS-M06 | Guets-apens | La Voiture piégée | Véhicule abandonné dissimulant un danger mortel. |
| MS-M07 | Guets-apens | Le Tireur de l'ombre | Silhouette menaçante surveillant la rue depuis les hauteurs. |
| MS-M08 | Guets-apens | Le Guet-apens des docks | Entrepôt clandestin où les contrebandiers attendent l'enquêteur. |
| MS-M09 | Autorités corrompues | Le Commissaire corrompu | Responsable de la police travaillant secrètement pour le syndicat. |
| MS-M10 | Autorités corrompues | Le Barrage de police | Contrôle organisé pour intercepter l'enquêteur. |
| MS-M11 | Autorités corrompues | Le Juge véreux | Magistrat à la solde du syndicat faisant disparaître preuves et témoins. |
| MS-M12 | Autorités corrompues | L'Interrogatoire clandestin | Salle secrète où l'enquêteur capturé est conduit. |

### Identité graphique et invariants

- Gabarit commun bordeaux et or, symbole de danger commun, illustration dominante et nom dynamique traduisible FR/EN ; ni rang J/Q/K ni enseigne traditionnelle affichés sur ces cartes.
- Douze identifiants physiques distincts conservés dans le moteur ; correspondance exacte entre MS-M01 à MS-M12 et les figures techniques à définir à l'intégration, sans effet mécanique.
- Toutes les menaces sont équivalentes : défaite immédiate uniquement en arrivant sur une menace déjà visible via Explorer. Observer une menace, la dépasser, l'inspecter ou arriver sur elle encore cachée ne déclenche pas en soi une défaite. Les règles d'impasse existantes restent applicables.
- Aucun combat, pouvoir, niveau de danger ou changement de probabilité ajouté. Dos commun et aucune divulgation des cartes cachées.
- Illustrations indépendantes, sans texte fonctionnel figé, conformément au [référentiel graphique CardForge](../../docs/graphic-assets-standard.md).

### Écrans de défaite immersifs — décision validée

- En cas de défaite provoquée par une menace, réutiliser son illustration, afficher le titre de fin de mission, le nom de la menace réellement responsable et un court texte narratif spécifique à celle-ci. Les douze variantes partagent un composant et une direction artistique film noir / Art déco.
- Exemple validant le principe : **MISSION COMPROMISE — L'Embuscade**. « Les hommes du syndicat vous attendaient. Cette ruelle sera votre dernière destination. »
- Pour Amelia : conserver le résultat mécanique et les statistiques existants ; adapter uniquement la présentation et, si nécessaire, transporter la cause réelle de défaite jusqu'à l'interface sans révéler de données cachées. En cas d'impasse sans menace responsable identifiée, prévoir un écran générique cohérent plutôt que d'attribuer arbitrairement la défaite à une carte.
- Textes FR/EN dynamiques, affichage mobile portrait et paysage sans scroll global, fonctionnement hors ligne et contrôles accessibles ; conserver les actions de fin de partie existantes.
- Les textes narratifs définitifs des onze autres variantes et le visuel générique d'impasse restent à produire. Aucune illustration ni implémentation n'est déclarée terminée par cette décision documentaire.
- Traçabilité : [CAR-49](https://lmn24.atlassian.net/browse/CAR-49) (résultat), [CAR-50](https://lmn24.atlassian.net/browse/CAR-50) (impasse), [CAR-52](https://lmn24.atlassian.net/browse/CAR-52) (clôture), [CAR-53](https://lmn24.atlassian.net/browse/CAR-53) (UX), [CAR-54](https://lmn24.atlassian.net/browse/CAR-54) (FR/EN), [CAR-55](https://lmn24.atlassian.net/browse/CAR-55) (qualification). Aucun ticket Jira modifié à cette étape.
