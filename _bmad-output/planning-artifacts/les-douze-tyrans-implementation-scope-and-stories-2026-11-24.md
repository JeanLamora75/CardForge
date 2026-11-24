---
title: "Les Douze Tyrans — cadrage d'implémentation et proposition de Stories"
date: "2026-11-24"
owner: "John — Product Manager BMAD"
status: "proposition à valider ; aucune Story Jira créée"
gameId_propose: "regicide"
---
# Les Douze Tyrans — cadrage d'implémentation

## 1. Décisions et sources
- Cinquième jeu de la collection CardForge ; **hors MVP de quatre jeux** tant qu'aucune décision produit contraire n'est donnée.
- Nom public validé : **Les Douze Tyrans**. Univers validé : **Wuxia / Chanbara, Asie féodale fantastique** (décision du 23 novembre).
- Règles strictement conformes au **mode solo officiel de Regicide** : pas de changement de probabilités, de cartes, d'actions ou de victoire.
- Produit gratuit, sans publicité ni compte ; Web/PWA d'abord, autres plateformes ultérieurement ; FR/EN et hors ligne après installation.
- Référentiel normatif interne : [Mary — regicide.md](game-rules/regicide.md), REG-R01 à REG-R09 et REG-T01 à REG-T32.
- Conventions produit : [cadrage](../../docs/cadrage.md), [PRD](prds/prd-CardForge-2026-11-22/prd.md), [architecture](architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md).
- Adaptation du workflow BMAD : agent John activé par lecture du skill et des fichiers TOML ; travail documentaire via GitHub ; **pas de commande uv**, pas de test exécuté, pas de recherche Web publique, pas de création Jira.

## 2. Proposition de périmètre
Un joueur peut commencer, jouer, sauvegarder, reprendre et terminer une partie solo fidèle de Regicide dans l'identité artistique des Douze Tyrans. Toutes les valeurs et effets dérivent du référentiel mécanique et non des illustrations. Le catalogue et la navigation réutilisent le socle CardForge.

### Composition
- 54 identités physiques : 12 ennemis J/Q/K, 40 cartes de Taverne A et 2–10, deux Jokers solo séparés.
- Château : quatre Valets puis quatre Dames puis quatre Rois, chacun des niveaux mélangé séparément.
- Taverne mélangée, huit cartes initialement en main (maximum huit), deux Jokers hors pioche.
- Un ennemi actif, valeurs vie/riposte : J=20/10, Q=30/15, K=40/20.

### Tour et actions
- Étapes 1 jouer ; 2 pouvoirs obligatoires hors enseigne immunisée ; 3 dégâts et mort éventuelle ; 4 riposte et défausse défensive si l'ennemi survit.
- Pouvoirs : ♥ réinsertion depuis défausse sous Taverne, ♦ pioche plafonnée à huit, ♣ dégâts doublés, ♠ bouclier cumulatif pour l'ennemi courant. Ordre ♥ puis ♦ si tous deux déclenchés.
- Cartes seules, As seuls ou accompagnés d'exactement une autre carte, combinaisons de 2 à 4 cartes numériques de même rang et de somme ≤10.
- Figures vaincues : dégâts exactement égaux à la vie -> sommet Taverne ; dépassement -> défausse. Cartes de combat transférées à la défausse au moment réglementaire.
- Riposte : seuil à couvrir par défausse de cartes ; dépassement autorisé ; main vide non automatiquement perdante.
- Deux Jokers séparés, chacun utilisable une fois au début de l'étape 1 ou 4 pour remplacer la main par jusqu'à huit cartes réellement disponibles ; aucune suppression d'immunité.
- Victoire après le dernier Roi, sans riposte finale ; médailles Or / Argent / Bronze pour 0 / 1 / 2 Jokers utilisés.

## 3. Epic proposé (non créé Jira)
**[Après MVP] Les Douze Tyrans — jouer au mode solo Regicide sans altération des règles.**

En tant que joueur solo, je veux affronter douze tyrans dans un univers illustré Wuxia/Chanbara, au moyen d'un jeu fidèle et testable, afin de terminer une partie complète, hors ligne, en conservant mes progrès.

**Conditions de sortie :** 32 scénarios de Mary reliés à des assertions exécutées ; REG-R01 clarifié et implémenté conformément à une source confirmée ; intégrité des cartes, absence de fuite de cartes cachées, sauvegarde et reprise, accessibilité FR/EN, CI d'un même commit et revue Murat ; autorisation de diffusion et crédits vérifiés séparément. La préversion interne peut être testée avant le feu vert de publication.

## 4. Découpage recommandé — 12 Stories à valider avant création Jira

### LDT-01 — Initialiser le château et la Taverne
**Besoin :** démarrer une partie réglementaire et reproductible.
- AC1 : 12 figures en trois rangs de quatre mélangés distinctement, seul premier Valet exposé ; Taverne 40 cartes, main 8, deux Jokers séparés.
- AC2 : 54 cartes physiques identifiables une seule fois dans toutes zones ; tirage déterministe injectable et sérialisable.
- AC3 : état invalide rejeté sans mutation ; ni fuite de l'ordre des cartes cachées ni cartes artificielles.
Dépendances : socle cartes/moteurs CardForge ; tests REG-T01/02. Impact : moteur autonome et modèle d'état.

### LDT-02 — Orchestrer les étapes du tour
**Besoin :** dérouler les quatre étapes dans le bon ordre.
- AC1 : étapes attaque, pouvoirs, dégâts puis riposte ; défaite d'un tyran saute sa riposte et commence le suivant.
- AC2 : restrictions d'action et de phase vérifiées ; coup illégal sans mutation ni consommation de hasard.
- AC3 : passage solo non inventé ; décision REG-R01 exigée avant validation de la commande éventuelle.
Dépendance LDT-01 ; REG-T02/27/32. Impact : machine d'états.

### LDT-03 — Jouer une carte et des combinaisons légales
**Besoin :** choisir librement les coups permis par les règles.
- AC1 : cartes simples, As seul ou accompagné d'une carte, combinaisons de 2 à 4 cartes numériques de même rang, total ≤10.
- AC2 : figures recrutées jouables à 10/15/20 ; As=1 ; valeurs et identités conservées.
- AC3 : triples de 4, As avec deux cartes, doublons d'identité et autres lots illégaux refusés sans mutation.
Dépendance LDT-02 ; REG-T11/12/13/14. Impact : validateur d'attaque.

### LDT-04 — Appliquer les quatre pouvoirs et immunités
**Besoin :** résoudre exactement les effets du coup joué.
- AC1 : ♥ remélange seulement la défausse existante et réinsère sous pioche ; ♦ pioche seulement les cartes existantes avec plafond huit ; ♥ précède ♦.
- AC2 : ♣ double les dégâts de l'ensemble joué ; ♠ cumule le bouclier du tyran actif ; effets mixtes au total de l'attaque et chaque enseigne une fois.
- AC3 : immunité neutralise seulement le pouvoir de l'enseigne ennemie, pas les dégâts de base ni les autres pouvoirs.
Dépendance LDT-03 ; REG-T03 à 10, 29 à 31. Impact : résolveur d'effets.

### LDT-05 — Résoudre les dégâts, tyrans vaincus et recrutement
**Besoin :** enchaîner les douze combats sans perte de carte ni erreur de timing.
- AC1 : dégâts accumulés par ennemi ; égalité exacte -> figure sous forme de carte recrutable au sommet Taverne ; dépassement -> défausse.
- AC2 : résoudre pouvoirs avant de placer les cartes engagées de ce combat en défausse ; réinitialiser bouclier/dégâts au prochain ennemi.
- AC3 : dernier Roi vaincu -> victoire immédiate, pas de treizième ennemi ni de riposte.
Dépendance LDT-04 ; REG-T15/16/17/18/27. Impact : transitions d'ennemis et zones.

### LDT-06 — Résoudre la riposte et la défaite
**Besoin :** défendre en choisissant les cartes à sacrifier.
- AC1 : riposte nette max(0, base - bouclier), sélection de cartes jusqu'à valeur défensive au moins égale ; dépassement admis.
- AC2 : riposte zéro ne consomme aucune carte ; main vide après paiement n'entraîne pas une fausse défaite.
- AC3 : avant défaite pour ressources insuffisantes, fenêtre légale d'utilisation d'un Joker étape 4 ; aucune défaite prématurée.
Dépendances LDT-04/05 ; REG-T19/20/21/23. Impact : défense et fin de partie.

### LDT-07 — Utiliser les deux Jokers solo
**Besoin :** renouveler sa main au bon moment.
- AC1 : Joker non joué en attaque : accessible seulement au début de l'étape 1 ou de l'étape 4 ; chaque Joker utilisable une fois.
- AC2 : toute la main est défaussée, puis pioche jusqu'à huit cartes effectivement disponibles ; pas de remélange implicite ni d'invention.
- AC3 : l'immunité Carreau n'empêche pas le Joker ; les immunités ennemies ne sont pas supprimées.
Dépendances LDT-02/06 ; REG-T22 à 25. Impact : actions Joker et compteur.

### LDT-08 — Gérer les issues et médailles
**Besoin :** obtenir un résultat exact et non rejouable.
- AC1 : victoire uniquement après douzième tyran ; défaite selon règles et arbitrage REG-R01 ; état terminal immuable.
- AC2 : 0/1/2 Jokers consommés -> Or/Argent/Bronze si victoire, aucune médaille si défaite.
- AC3 : aucun score ou bonus inventé ; anomalies de sauvegarde et violations d'intégrité distinctes d'une défaite.
Dépendances LDT-05/06/07 et résolution REG-R01 ; REG-T20/26/27/32. Impact : résultat.

### LDT-09 — Créer le plateau et l'identité graphique
**Besoin :** lire et jouer le combat au tactile ou au clavier.
- AC1 : tyran actif, points de vie, riposte, bouclier, main, Taverne, défausse, Jokers et étapes lisibles sans dévoiler de cartes cachées.
- AC2 : représentation Wuxia/Chanbara originale ; quatre domaines de pouvoirs correspondent un pour un aux enseignes du moteur ; aucun nouveau pouvoir.
- AC3 : sélection, aperçu des coups et de la défense, erreurs non destructives, navigation mobile/desktop, focus clavier et réduction des animations.
- AC4 : route interne de recette si autorisations de diffusion non encore acquises ; pas de mise à disposition publique trompeuse.
Dépendance LDT-08 ; revue Sally ; impact catalogue, i18n, UI et ressources.

### LDT-10 — Sauvegarder, reprendre et clôturer une partie
**Besoin :** conserver exactement les combats interrompus.
- AC1 : persistance IndexedDB transactionnelle, versionnée, après action validée ; ordres cachés, identités, ennemis, cartes jouées, bouclier, vie, étapes, Jokers et hasard restaurés exactement.
- AC2 : une sauvegarde active par jeu ; remplacement/abandon confirmés, isolés des autres jeux ; erreurs de stockage traitées sans fausse réussite.
- AC3 : victoire/défaite/abandon comptabilisés une fois, médaille historisable si prévue, aucune double statistique au rafraîchissement.
Dépendances LDT-08/09 et socle partagé ; REG-T28. Impact : application/persistance.

### LDT-11 — Expliquer les règles et accompagner le joueur
**Besoin :** maîtriser les mécanismes sans modifier leur difficulté.
- AC1 : règle complète et aide FR/EN, accessibles à tout moment, terminologie artistique reliée clairement aux quatre effets réels.
- AC2 : tutoriel facultatif, rejouable et sans statistiques ordinaires ; scénarios combat, recrutement, Joker et défense.
- AC3 : fiche catalogue, aide contextuelle, accessibilité et crédits factuels sans présentation trompeuse de licence.
Dépendances LDT-09/10 ; revue Sally et Mary ; impact contenus/i18n.

### LDT-12 — Vérifier conformité, CI et droits avant publication
**Besoin :** distinguer jeu techniquement fonctionnel et publication autorisée.
- AC1 : REG-T01 à REG-T32 chacun relié à un test réel ; REG-R01 résolu à partir de preuve ; invariants 54 cartes, phases, reproductibilité, absence de fuite et rejets immuables.
- AC2 : tests d'intégration sauvegarde/reprise et idempotence ; E2E build de production FR/EN, hors ligne, tactile, clavier, victoire, défaite, Joker, abandon.
- AC3 : typecheck, tests, build, E2E et régressions des quatre autres jeux verts sur un même commit ; Murat analyse les preuves effectives et journalise le SHA.
- AC4 : permissions d'adaptation numérique, changements de nom/univers, droits des visuels, crédits et statut de publication validés ; accès public bloqué sinon.
Dépendances LDT-01 à LDT-11 ; REG-R09 ; impact CI/gate documentaire.

## 5. Dépendances et séquencement
LDT-01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07 -> 08 -> 09 -> 10 -> 11 -> 12, avec travail de Sally sur la conception visuelle et de Murat sur les tests dès les premières Stories. Les cas REG-R01 et REG-R09 sont des points de sortie bloquants ciblés, non des prétextes pour modifier la mécanique.

## 6. Questions ouvertes, sans remise en cause des arbitrages antérieurs
1. **REG-R01 :** le passage de tour est-il effectivement autorisé en solo ? Une confirmation issue d'un complément officiel est indispensable avant que la règle soit codée.
2. **REG-R09 :** droits d'adaptation numérique et de transposition thématique : aucune autorisation n'a été vérifiée ici. Préversion interne possible, publication suspendue tant que la preuve manque.
3. **MVP :** par défaut Les Douze Tyrans reste après MVP. Une décision explicite suffit pour changer sa priorité.

## 7. Statut et validations
- Les décisions sur le nom, l'univers et la fidélité des règles sont **déjà validées**.
- Ce **découpage LDT-01 à LDT-12 est proposé**, non validé ; les identifiants LDT sont locaux, **pas des clés Jira**.
- **Aucune Epic ni Story Jira créée**, aucun code écrit ni test/CI exécuté.
- Étape suivante sous validation : confirmer découpage et priorité ; puis créer Epic et Stories détaillées dans Jira CAR avec dépendances et critères d'acceptation.
