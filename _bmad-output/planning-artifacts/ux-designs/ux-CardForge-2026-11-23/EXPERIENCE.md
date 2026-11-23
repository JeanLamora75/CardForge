---
name: CardForge
status: draft-for-ux-validation
updated: '2026-11-23'
sources:
  - '../../../../docs/cadrage.md'
  - '../../prds/prd-CardForge-2026-11-22/prd.md'
  - '../../architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md'
  - '../../epics.md'
  - '../../game-rules/clear-the-dungeon.md'
  - '../../game-rules/gridcannon.md'
design: './DESIGN.md'
---

# CardForge — EXPERIENCE.md

> **Contrat d'expérience UX MVP — Sally, 23 novembre 2026.** Les décisions fonctionnelles et UX déjà validées par le porteur, notamment CTD-ARB-01..14 et GC-22..53, sont **contraignantes**. Les modalités d'agencement complémentaires sont des **[PROPOSITION SALLY]** à valider sur maquettes ; elles ne deviennent pas des règles des jeux. La vérité de l'état, la légalité des actions et leurs résultats appartiennent uniquement aux moteurs (AD-02/03/05). Le DESIGN.md associé définit les tokens visuels, dont les valeurs non encore validées sont signalées.

## Foundation

**Produit :** collection de cinq jeux de cartes solo numériques ; MVP : **Clear the Dungeon Classic 1.1.0** sans réserve facultative et **Gridcannon Version 2** entièrement jouables. Card Capture, Loot the Loop et **Les Douze Tyrans** (adaptation de Regicide en Grèce antique) sont visibles mais « À venir ». « Bastion Stellaire » demeure un nom provisoire pour Gridcannon, ne pas le traiter comme marque approuvée.

**Supports :** Web responsive/PWA mobile-first, tactile, clavier, souris, portrait/paysage ; préparation future Android/iOS mais aucun design natif livré pour le MVP. Toutes les interactions doivent fonctionner **hors ligne après préparation** et dans **les deux langues françaises et anglaises**. Une seule partie active par jeu, sauvegarde après coup confirmé, reprise à l'état exact, aucune donnée de partie stockée dans des animations.

**Frontières :**
- Le moteur par jeu énonce les actions légales et l'état public ; l'UI n'interprète jamais une règle via la couleur, la silhouette, un nom de carte ou une animation.
- Une **intention** (carte sélectionnée, survol, cible provisoire, aperçu d'attaque, inspection, modale ouverte) n'est **pas une action métier**. Elle ne modifie pas pioche, figures, dégâts, ressources, score, état terminal ni statistiques.
- Une **commande confirmée**, revalidée par le moteur, produit une seule transition et une persistance atomique AD-04/10.
- Aucune inspection ne révèle une carte face cachée ou une ressource spéciale non découverte, y compris par accessibilité/DOM.
- Le référentiel Mary prévaut en cas de conflit sur la mécanique ; les composants transversaux peuvent unifier la présentation, jamais les règles.

## Information Architecture

| Surface / code | Entrée | But et éléments indispensables | Story Jira |
| --- | --- | --- | --- |
| UX-01 Catalogue | Ouverture de l'application, retour depuis un jeu | Galerie des 5 jeux, image d'univers, titre, pitch, disponibilité, discrète partie active ; entrée paramètres/crédits | [CAR-29](https://lmn24.atlassian.net/browse/CAR-29) |
| UX-02 Fiche de jeu | Carte de catalogue | Univers, version de règles, présentation, règles, statistiques, Jouer/Reprendre/Nouvelle partie, tutoriel | [CAR-30](https://lmn24.atlassian.net/browse/CAR-30) |
| UX-03 Plateau Clear the Dungeon | Jouer, Reprendre, tutoriel distinct | Monstres, quatre colonnes d'attaque, main, pioche, pile de dégâts, joker, actions et sauvegarde | [CAR-31](https://lmn24.atlassian.net/browse/CAR-31) |
| UX-04 Plateau Gridcannon | Jouer, Reprendre, tutoriel distinct | Grille 3×3, figures périphériques, piles, compteur de pioche, As/Jokers découverts, armures, actions, sauvegarde | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| UX-05 Inspection carte/figure/pile | Activation volontaire au plateau | Identité publique, rang, enseigne/faction, résistance, armures ou cartes connues selon le contexte | [CAR-31](https://lmn24.atlassian.net/browse/CAR-31), [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| UX-06 Aperçu / confirmation | Destination légale ou action à confirmer | Prévisualiser tirs et effets sans mutation ; Annuler et Confirmer, **une** confirmation pertinente | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| UX-07 Règles et aide | Fiche et barre discrète du plateau | Règles complètes, aide facultative et compréhension des actions ; tutoriels réutilisables | [CAR-33](https://lmn24.atlassian.net/browse/CAR-33) |
| UX-08 Tutoriel par jeu | Premier accès proposé, aide | Scénario déterministe séparé, gestes guidés, quitter/sauter, jamais statistique | [CAR-33](https://lmn24.atlassian.net/browse/CAR-33) |
| UX-09 Résultat | Victoire/défaite par moteur | Bilan, score seulement si applicable, Rejouer, Retour au catalogue | [CAR-34](https://lmn24.atlassian.net/browse/CAR-34) |
| UX-10 Statistiques | Fiche ou après résultat | Victoires, défaites, abandons, total, taux, meilleur score si réglementaire ; réinitialisation contrôlée | [CAR-34](https://lmn24.atlassian.net/browse/CAR-34) |
| UX-11 Paramètres | Icône commune (hors du plateau ou en action discrète) | Langue, sons, musique, mouvements, aides, lisibilité, confirmations GC ordinaires, confidentialité | [CAR-35](https://lmn24.atlassian.net/browse/CAR-35) à [CAR-37](https://lmn24.atlassian.net/browse/CAR-37) |
| UX-12 Données et crédits | Paramètres, catalogue | Données locales, effacement confirmé, version, auteurs, crédits et droits vérifiés | [CAR-37](https://lmn24.atlassian.net/browse/CAR-37), [CAR-39](https://lmn24.atlassian.net/browse/CAR-39) |
| UX-13 Statut installation hors ligne | Catalogue/fiches et état PWA | Préparation, prêt hors ligne, incomplet/erreur ; ne pas montrer un jeu non prêt comme disponible offline | [CAR-38](https://lmn24.atlassian.net/browse/CAR-38) |

**Navigation :** catalogue → fiche → plateau ; fiches ↔ règles/statistiques ; plateau → catalogue sans abandon ; paramètres accessibles depuis une commande commune. La seule fermeture d'onglet ou mise en arrière-plan n'est jamais une demande d'abandon. **[PROPOSITION SALLY]** utiliser un en-tête compact avec « Retour », « Règles », « Paramètres » et un statut d'enregistrement ; pas de menu permanent massif au plateau. L'aide/inspection peut ouvrir un panneau ou une modale selon place, sans perdre le focus ni déclencher de coup.

## Voice and Tone

Voix de jeu immersive dans les titres et narrations ; **microcopy fonctionnelle précise**, sans confusion entre résultat de calcul et ambiance fantasy. Les textes sont localisables sans inclusion dans l'image.

| Situation | FR | EN | Comportement |
| --- | --- | --- | --- |
| Pioche Gridcannon | « Cartes restantes : {count} » | “Cards remaining: {count}” | Quantité réelle, jamais identité d'une carte cachée |
| Coup impossible | « Cette destination n'est pas autorisée. » | “This destination is not allowed.” | Raison précise du moteur en complément |
| Aperçu | « Aperçu — aucune carte n'a été jouée. » | “Preview — no card has been played.” | Ne sauvegarde aucun coup |
| Sauvegarde en cours | « Enregistrement… » | “Saving…” | Sans annoncer un succès |
| Sauvegarde réussie | « Enregistré sur cet appareil. » | “Saved on this device.” | Afficher **après** transaction |
| Sauvegarde échouée | « Impossible d'enregistrer. Votre progression actuelle n'est pas sécurisée. Réessayer. » | “Could not save. Your current progress is not secured. Retry.” | Ne jamais prétendre récupération garantie |
| Choix nouvelle partie | « Remplacer cette partie ? Elle sera comptée comme abandonnée. » | “Replace this game? It will count as abandoned.” | Annuler par défaut sans modifier l'état |
| Tutoriel | « Apprendre à jouer » / « Jouer directement » | “Learn to play” / “Play now” | Le second choix est toujours disponible |
| Disponibilité | « À venir » | “Coming soon” | Aucun bouton Jouer si non disponible |
| Lecture seule | « Cette partie est ouverte dans un autre onglet. » | “This game is open in another tab.” | L'onglet secondaire ne valide rien |

Les expressions des règles originales, résistances, scores et avertissements définitifs doivent provenir d'une terminologie contrôlée par Mary/Camille ; les formulations ci-dessus sont des **[PROPOSITIONS DE MICROCOPY]** à relire en traduction. Ne pas appeler « victoire » une situation seulement prévisualisée.

## Component Patterns

| Composant / UX-DR | Contrat comportemental | Événements et états | Références |
| --- | --- | --- | --- |
| `GameWorldCard` / UX-DR01 | Une carte de catalogue ouvre la fiche ; « À venir » n'expose pas de Jouer ; état d'une partie active non intrusif | available/coming-soon/loading/offline-not-ready | FR-01/32 ; CAR-29 |
| `GameEntryActions` / UX-DR02 | Affiche Jouer, Reprendre, Nouvelle partie selon existence d'une partie ; remplacement confirmé | new/resume/confirm-replace | FR-03/19 ; GC-32 |
| `InteractivePlayingCard` / UX-DR03 | Sélection puis destination = parcours primaire ; glisser-déposer facultatif équivalent ; identité accessible | idle/selected/inspectable/disabled/dragging | GC-36/37 ; AD-05 |
| `LegalTargetsOverlay` / UX-DR04 | Met en évidence les seules destinations données par moteur ; explicite refus, sans conseil de meilleur coup | legal/illegal/none | GC-38/50 |
| `CardInspection` / UX-DR05 | Agrandit une carte publique, détails sans action, fermeture rend le focus au déclencheur | open/closed | GC-36 ; FR-15 |
| `GridStackInspector` / UX-DR06 | Sommet visible et compteur hauteur ; inspection seulement des cartes **déjà connues** sous la pile | closed/open/empty | GC-42/43 |
| `FigureResistanceDetails` / UX-DR07 | Résistance totale et armure +n permanentes ; détail des cartes d'armure et seuil sur demande | living/defeated/inspection | GC-22 |
| `AttackPreview` / UX-DR08 | Calcule visuellement conséquences d'une destination légale depuis les seules données publiques ; double tir indépendant et statique | idle/preview/stale/confirm/cancel | GC-23/04 |
| `SpecialResourceBar` / UX-DR09 | Mini-cartes As/Joker **révélées** ; disponibles et utilisées distinguables ; sélection avant consommation | available/used/selected | GC-30 |
| `ActionConfirm` / UX-DR10 | Confirmation imposée par le flux ou option GC-52, jamais deux fois ; revalidation à confirmation | pending/confirmed/cancelled/stale | GC-30/32/52 |
| `GamePhaseActions` / UX-DR11 | Actions propres à chaque jeu ; CTD « Défausser », « Terminer la main » si main vide ; GC « Carte suivante » si phase recherche | phase-dependent | CTD-ARB-03/04/13/14 ; GC-18 |
| `SaveStatus` / UX-DR12 | Affiche état réellement durable ; erreur avec Réessayer, lecture seule en multi-onglets | saving/saved/error/read-only | GC-46/47 ; AD-04 |
| `LastActionSummary` / UX-DR13 | Résumé **facultatif** d'une action déjà confirmée, jamais un pronostic | hidden/visible | GC-39 |
| `GuidanceMessage` / UX-DR14 | Conseil pédagogique désactivable, jamais meilleur coup ni révélation de cartes cachées ; refus métier toujours explicité | help-on/help-off | GC-26/50 |
| `ConfirmDataRemoval` / UX-DR15 | Confirmation destructrice avec périmètre explicite, Annuler neutre, pas de suppression par navigation | open/confirmed/cancelled/error | FR-28 ; GC-35 |
| `GameResult` / UX-DR16 | Résultat moteur, bref résumé, Rejouer/Catalogue, pas d'attente d'animation | win/loss/abandoned | GC-33/34 ; FR-22 |
| `OfflineReady` / UX-DR17 | Indique prêt uniquement lorsque ressources nécessaires réellement présentes | pending/ready/incomplete/error | FR-30/32 |

**Règles communes aux composants :** aucune interaction purement informative ne produit une transition métier ; aucun composant UI ne calcule de résultat officiel. Les modales à choix moteur requièrent une commande explicitement confirmée et revalidée. Les actions d'aide, d'inspection et de zoom restent accessibles en lecture seule.

## State Patterns

| État | Traitement attendu | Persistance / règles |
| --- | --- | --- |
| Premier lancement | Catalogue et deux fiches MVP ; jeux indisponibles « À venir » ; tutoriel proposé lors de première ouverture du jeu | Préférence tutoriel locale distincte d'une partie |
| Partie absente | Jouer directement sans confirmation destructrice | Création d'état moteur, sauvegarde à la première action pertinente |
| Partie en cours | Reprendre explicite, phase et cartes identiques | Une active par jeu ; sortie sans abandon |
| Choix carte/position | Indiquer sélection et cibles légales ; annulation possible | Pas de mutation ; afficher uniquement information publique |
| Aperçu d'attaque | Montrer source, destination, axes, résistance, effet prévisionnel ; annuler/reconfirmer | Non sauvegardé comme coup ; GC-23 |
| Validation ordinaire GC | Confirmation supplémentaire **désactivée par défaut** ; si activée, une seule et non redondante avec les obligations GC-23/30 | GC-52 |
| Action spéciale GC | Réserves découvertes, mini-cartes disponibles/utilisées, coût uniquement lors d'une action confirmée | GC-30 |
| Attribution armure à égalité | Présenter les figures admissibles et l'effet supposé ; choix joueur explicite | GC-21/22, aucune attribution anticipée |
| Recherche figure GC | « Carte suivante » une fois, compteur de pioche actualisé, cartes numériques écartées montrées dans l'ordre autorisé | GC-06/18/19 ; pas de révélation de la prochaine carte avant action |
| Pioche GC vide | « Pioche vide » mais **pas défaite immédiate** si des suites spéciales réellement utiles existent | GC-20 |
| Main CTD vide mais ouverte | Actions de repositionnement encore possibles ; bouton « Terminer la main » explicite | CTD-ARB-02/14 |
| Septième dégât CTD | Défaite **immédiate**, action suivante interdite | CTD-ARB-03/13 |
| Victoire/défaite | Résultat unique et bilan non bloquant, disponibilité Rejouer/Catalogue | CTD/GC, FR-22/24 ; sauvegarde atomique |
| Enregistrement en cours | État d'attente discret et explicite ; empêcher double validation concurrente | GC-46/47, AD-10 |
| Stockage échoué | Message explicite, progression courante possiblement non durable ; Réessayer, ancien état préservé | AD-04/09/11 |
| Sauvegarde incompatible | Aucune restauration trompeuse, erreur lisible et conservation de la donnée | FR-20/21 |
| Multi-onglets | **Un seul onglet écrivain**, autre en lecture seule avec possibilité de récupérer un contrôle de manière sûre | GC-47, sans double résultat |
| Tutoriel | Bac à sable déterministe, indépendant de statistiques et sauvegardes ordinaires | GC-49, FR-14 |
| Statistiques vides | « — » pour taux/meilleur score sans dénominateur ou score pertinent | FR-25, GC-34 |
| Effacer statistiques GC | Demande de confirmation, efface **uniquement** résultats du jeu, pas sa partie active ni préférences | GC-35 |
| Réglage animation | Suivre l'appareil (défaut), activer ou désactiver ; choix manuel prioritaire | GC-53 |
| Contraste renforcé | Option lisibilité renforcée indépendante de jeu, traduction et motion | GC-48 |
| Hors ligne incomplet | Explication des ressources manquantes et impossibilité de promettre le hors ligne | GC-46, FR-30/32 |

## Interaction Primitives

### Commandes communes

1. **Sélection puis action** : toucher/clic/Entrée sélectionne une carte connue ; la zone de jeu affiche les seules destinations légales ; activation d'une destination ouvre au besoin un aperçu puis une confirmation. Le drag-and-drop reste un **raccourci optionnel**, identique sur le plan du résultat et jamais obligatoire (GC-37).
2. **Annulation** : Échap, Annuler ou bouton Retour contextuel abandonnent seulement les **intentions non confirmées** ; impossible de « défaire » une défausse CTD déjà actée ou une action GC confirmée. Respecter les modales destructrices.
3. **Inspection** : action spécifique et sans effet mécanique pour cartes, figures et piles ; fermeture restitue focus et sélection. Une carte cachée n'est pas inspectable.
4. **Confirmation** : une intention peut nécessiter GC-23, GC-30 ou GC-52. Ne jamais empiler deux confirmations pour un même acte. Revalider la légalité et la révision avant écriture.
5. **Aide** : ouverture facultative, règles toujours consultables ; conseils de découverte non modaux et non prescriptifs (GC-50).
6. **Sauvegarde** : statut dérivé de l'accusé de la couche applicative ; ne pas confondre « action affichée en mémoire » et « action durablement enregistrée ».

### Clear the Dungeon — contrat spécifique d'interface

- Les **quatre colonnes** de monstres restent explicitement associées à leurs emplacements d'attaque ; la main et les cartes posées pendant la main courante sont distinguées des cartes définitivement engagées les mains précédentes. Voir **CTD-ARB-01/02**.
- La pose d'une première/deuxième carte de puissance puis d'une déclencheuse est montrée dans **l'ordre des positions** ; le UI explique les refus sans calcul inventé. Joker : valeur 10 fixe, enseigne selon son rôle et l'emplacement CTD-ARB-10/11. La première puissance mathématiquement impossible et la seconde insuffisante sont rejetées par le moteur CTD-ARB-08/09.
- **Défausser** une carte non engagée est une action immédiatement irréversible ; « Défausser les cartes restantes » applique les dégâts carte par carte, avec arrêt au septième. Après défausse, reprise d'attaques permise pendant la même main CTD-ARB-13.
- Quand la main atteint zéro carte, **ne pas clôturer automatiquement** : afficher **Terminer la main** ; si pioche disponible, **Terminer la main et piocher** verrouille les poses et tire jusqu'à trois cartes **en une seule commande**. Si pioche vide, l'avertissement de défaite doit être clair avant confirmation CTD-ARB-04/05/14.
- Après défaite du douzième monstre, victoire immédiate et score = cartes dans pioche **main exclue** CTD-ARB-12. En cas de septième dégât, la fin est immédiate. Aucune animation ne retarde ni ne requalifie les issues.

### Gridcannon V2 — contrat spécifique d'interface

- **Grille et figures** : grille 3×3 entière, piles ordonnées, emplacements périphériques de figures ; figures vaincues gardent leur place, emplacements futurs non révélés sous silhouettes neutres (GC-40/41/42/44).
- **Résistance/armure** : valeur totale et bonus d'armure sur chaque figure vivante **en permanence** ; détail cartes d'armure sur activation (GC-22). Seuils de défaite J/Q 20+ et K 19+ visibles sans dramatiser à tort.
- **Pioche** : dos fermé et compteur réel « Cartes restantes : n » GC-29, actualisé après toute transition ; jamais liste des cartes futures.
- **Réserve** : As Extraction et Jokers Réaffectation en mini-cartes, seuls ceux révélés ; ressources dépensées visibles comme utilisées, non activables (GC-30).
- **Prévisualisation** : pour toute pose déclenchant les conditions GC-23, afficher deux cartes contributrices, somme de dégâts, contrainte d'enseigne/couleur, résistance totale et résultat prédit ; en coin, les **deux axes sont évalués et affichés** simultanément d'après le même état. Annuler sans effet.
- **Placement de figure** : égalité de destination et armure GC-21 doivent rester un **choix joueur**, non arbitré par priorité graphique. Les destinations et les figures candidates sont celles calculées par moteur GC-01/02/13/21.
- **Recherche de figure** : action « Carte suivante » (GC-18), zone des numériques écartées visible sans réordonner les cartes ni inspecter le dos, retour sous pioche selon GC-10/19.
- **Zoom et inspection** : zoom/panoramique facultatifs (GC-40), portrait/paysage GC-41, piles compactes à décalage et hauteur GC-42, inspection des cartes connues GC-43, plein écran facultatif avec repli si navigateur non compatible GC-45 ; aucune fonction obligatoire masquée derrière un geste.
- **Retour de coup** : animation courte optionnelle GC-24, son discret facultatif GC-25, compteur compact des figures vaincues GC-31 et résumé de la dernière action **réellement confirmée** GC-39.
- **Écriture** : sauvegarde visible fiable GC-46, onglet principal écrivain GC-47, aides et raccourcis disponibles dans l'autre onglet en lecture seule.
- **Accessibilité et confort** : lisibilité renforcée GC-48, tutoriel court GC-49, conseils facultatifs GC-50, raccourcis optionnels GC-51, confirmation des coups ordinaires **désactivée par défaut** GC-52, motion « Suivre l'appareil » par défaut GC-53.

## Accessibility Floor

**Obligations pour Sally / Amelia / Murat :**
- Tout coup possible au tactile l'est aussi via **Tab → Entrée/Espace → sélection de cible → confirmation**. Les combinaisons clavier rapides ne sont jamais une capacité exclusive.
- Cibles tactiles : **[PROPOSITION SALLY]** minimum de 44 px CSS, à valider sur devices réels ; espacement suffisant et alternative liste de cibles si case trop petite.
- Repère de focus visible `{components.focus-ring.color}` et restitution après fermeture des modales/inspections ; ne pas piéger le focus sauf à l'intérieur d'une boîte modale ouverte.
- Pour les figures et cartes : nom accessible contenant **identité publique, enseigne ou faction réglementaire, rang/puissance, état, sélection, destination légale ou interdite**. Décrire les informations publiques uniquement.
- États d'erreur, victoire, défaite, sauvegarde et lecture seule annoncés aux lecteurs d'écran par régions appropriées sans lire plusieurs fois le même message ; ne pas forcer le focus en permanence.
- Contraste texte et éléments de règle à éprouver **sur les illustrations réelles** ; mode de lisibilité renforcée GC-48 sans perte d'information, et texte adaptable sans troncation des valeurs.
- Aucun résultat n'exige animation, vibration ou son ; réduction du mouvement en mode automatique GC-53. Les signaux acoustiques GC-25 restent optionnels.
- Zoom/panoramique, drag/drop, plein écran et raccourcis sont facultatifs. Inspection via clic/toucher/clavier, pas uniquement survol.
- Les modales de destruction ont Annuler et action explicitement nommée ; les actions sont réévaluées lors de la confirmation. L'absence de réseau ne doit pas désactiver la lecture des règles installées.
- Langues FR/EN complètes et repli anglais, aucune traduction incorporée en dur aux images (GC-26/27/28).

## Responsive & Platform

| Profil | Hiérarchie | Contrat |
| --- | --- | --- |
| Smartphone portrait | État compact → plateau intégral accessible → actions/main/réserve → aide contextualisée | Plateaux lisibles avec zoom, panoramique facultatifs ; aucun défilement masque une confirmation indispensable |
| Smartphone paysage | Grille/monstres au centre, réserve et actions compactes sur le côté si place | L'orientation ne change pas l'ordre des zones ni la légalité des coups |
| Tablette | Plateau central, panneaux d'inspection/dernière action latéraux | Les aides ne recouvrent pas la destination sélectionnée pendant confirmation |
| Desktop | Disposition large sans réarranger les cartes physiques ; clavier/souris/drag optionnel | L'UI reste utilisable sans survol ni raccourci |

**[PROPOSITION SALLY]** test responsive à 320, 375, 768, 1024 et 1440 px, sous zoom navigateur jusqu'à 200 % : à **valider par essais**, et non présenté comme seuil normatif déjà approuvé. Aucun objectif chiffré de performance UX n'est inventé avant prototype mesuré.

## Key Flows

### UJ-1 — Camille découvre Clear the Dungeon en déplacement

1. Camille ouvre CardForge sur un smartphone. Le catalogue présente cinq mondes ; seuls les jeux prêts ont un bouton Jouer.
2. Elle ouvre la fiche Clear the Dungeon, lit une brève introduction et choisit **Apprendre à jouer**.
3. Le tutoriel court s'ouvre avec un plateau distinct des parties réelles ; elle le ferme sans perdre ni créer de résultat.
4. Camille démarre une vraie partie et place une carte sur un monstre ; elle voit si la pose est encore provisoire.
5. Elle défausse une carte, revient aux attaques pendant la même main, termine par une main vide.
6. **Moment clé :** elle choisit explicitement **Terminer la main et piocher** ; l'interface verrouille ses poses et affiche la nouvelle main sans double activation ni surprise. Une fermeture et reprise ramènent exactement le même état.
7. Échec : sauvegarde impossible → signal clair, possibilité de réessayer ; ne jamais annoncer « Enregistré » tant que la transaction échoue.

Références : CTD-ARB-01/02/03/13/14, FR-13/16/18 ; CAR-31/33/13.

### UJ-2 — Alex planifie un double tir sur Gridcannon

1. Alex ouvre Gridcannon V2 et voit la grille 3×3, les figures périphériques et un compteur de pioche **face cachée**.
2. Il sélectionne une carte numérique ; les destinations légales s'illuminent discrètement, toutes accessibles au clavier.
3. Il choisit une case de coin ; l'aperçu calcule deux lignes de tir indépendantes, avec somme, restrictions, résistance et armure.
4. **Moment clé :** Alex voit qu'une figure serait vaincue et l'autre résisterait, puis choisit **Confirmer** ; les deux résultats sont résolus depuis le même état, la carte posée une fois.
5. Il consulte le résumé de l'action confirmée et le statut « Enregistré » ; une inspection ultérieure ne consomme aucun coup.
6. Échec : la partie a changé dans un autre onglet → l'aperçu est invalidé, aucune ressource dépensée, explication et recalcul.

Références : GC-04/22/23/29/37/38/39/46/47/52 ; CAR-32.

### UJ-3 — Léa retrouve sa partie après une interruption

1. Léa ferme CardForge pendant une partie sans choisir « Abandonner ».
2. Elle rouvre hors ligne : le catalogue signale une partie active et le bouton **Reprendre** apparaît dans la fiche du jeu.
3. Elle reprend avec mêmes cartes, piles, phases et ressources, même lorsque la main CTD est vide mais encore ouverte ou lorsqu'une recherche GC est en cours.
4. **Moment clé :** le statut de sauvegarde confirme l'état durable après son prochain coup, et ses statistiques n'ont pas changé à cause de la fermeture.
5. Si une sauvegarde est incompatible, CardForge la préserve et indique qu'elle ne peut pas être reprise automatiquement.

Références : FR-16 à 21 ; GC-32/46/47 ; CAR-13/16.

### UJ-4 — Noor veut remplacer sa partie sans la perdre par erreur

1. Noor choisit **Nouvelle partie** alors qu'une partie est active.
2. Une confirmation explicite indique que la précédente sera enregistrée comme **abandonnée**, et non comme défaite.
3. Elle choisit **Annuler** : la partie n'a pas bougé.
4. Elle relance l'action et confirme.
5. **Moment clé :** une seule nouvelle partie apparaît, l'ancienne n'est comptée qu'une fois comme abandon ; les autres jeux restent inchangés.

Références : GC-32, FR-19/23/24 ; CAR-15.

### UJ-5 — Sami choisit une expérience accessible en anglais

1. Le navigateur de Sami demande une langue non disponible ; CardForge utilise l'anglais.
2. Dans Settings, Sami active « Enhanced readability », désactive les sons et choisit « Follow device settings » pour le mouvement.
3. Il entre dans Gridcannon et peut sélectionner une carte par clavier, inspecter une armure et lire un refus de coup sans son ni animation.
4. **Moment clé :** la valeur, l'enseigne et le résultat restent compréhensibles sans couleur ; aucun paramètre d'interface n'affecte le moteur.
5. Il change la langue manuellement en français, revient au jeu et retrouve ses cartes au même endroit.

Références : GC-26/27/28/48/51/53 ; CAR-35/36/34.

## Handoff et couverture Jira

| Ensemble Jira | Surfaces et contrats couverts | Risque de réalisation |
| --- | --- | --- |
| [CAR-5](https://lmn24.atlassian.net/browse/CAR-5), CAR-29..34 | Catalogue, fiche, plateaux, aides, tutoriels, résultats et accessibilité | Confusion prévisualisation/action et ergonomie des cartes compactes |
| [CAR-6](https://lmn24.atlassian.net/browse/CAR-6), CAR-35..39 | FR/EN, préférences, suppression des données, PWA, crédits | Ressources hors ligne incomplètes et microcopy destructrice |
| [CAR-2](https://lmn24.atlassian.net/browse/CAR-2), CAR-12..16 | Statut de sauvegarde, reprise, abandon, écriture unique | Double clic, second onglet, erreur de transaction |
| [CAR-3](https://lmn24.atlassian.net/browse/CAR-3), CAR-17..21 | Phases/attaques CTD | Main vide mais ouverte et carte provisoire |
| [CAR-4](https://lmn24.atlassian.net/browse/CAR-4), CAR-22..28 | Phases/coups GC, recherche, ressources, armure | Double tir, choix GC-21, ressource non révélée |
| [CAR-7](https://lmn24.atlassian.net/browse/CAR-7), CAR-40..43 | Tests, vérification accessibilité/hors ligne et droits | Déclarer « disponible » sans preuve |

**Critères supplémentaires à proposer à John, sans modifier Jira sans nouvel accord :**
- CAR-32 : valider séparément GC-22/23/29/30/37/38/40/42/43/46/47/48/52 sur mobile, clavier et lecteur d'écran.
- CAR-31 : scénario de retour de carte provisoire CTD lorsque main vide, sans clôture automatique ; avertissement fin de pioche.
- CAR-34 : rendre disponible la remise à zéro des **statistiques du seul jeu** Gridcannon avec confirmation, sans supprimer partie active ni préférences (GC-35). La Story actuelle porte surtout le bilan et la consultation.
- CAR-35/36 : choix de langue global avec repli anglais ; modes de mouvement « suivre / activer / désactiver » et lisibilité renforcée.
- CAR-37 : hypothèse A-01 sur la granularité de suppression à faire confirmer avant implémentation ; ne pas confondre avec GC-35.
- CAR-40..43 : recette de focus, tests de refus/lecture seule, vérification des secrets et droits, ressources hors ligne.


## Matrice de traçabilité des décisions Mary

Les décisions ci-dessous sont **déjà validées**, leur [référentiel Mary Gridcannon](../../game-rules/gridcannon.md) reste normatif ; cette table décrit uniquement leur traduction UX.

| Décision | Comportement UX | Story Jira principale |
| --- | --- | --- |
| GC-22 | Résistance/armure permanentes et détail | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| GC-23 | Prévisualisation complète de tirs | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| GC-24 | Animation courte facultative | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| GC-25 | Son facultatif | [CAR-36](https://lmn24.atlassian.net/browse/CAR-36) |
| GC-26 | Règles et aide | [CAR-33](https://lmn24.atlassian.net/browse/CAR-33) |
| GC-27 | Préférence linguistique et repli anglais | [CAR-35](https://lmn24.atlassian.net/browse/CAR-35) |
| GC-28 | FR/EN MVP, dix langues à terme | [CAR-35](https://lmn24.atlassian.net/browse/CAR-35) |
| GC-29 | Pioche masquée et compteur | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| GC-30 | Mini-cartes As/Jokers découverts | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| GC-31 | Figures vaincues comptées | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| GC-32 | Reprise et abandon confirmé | [CAR-30](https://lmn24.atlassian.net/browse/CAR-30) |
| GC-33 | Résultat et résumé | [CAR-34](https://lmn24.atlassian.net/browse/CAR-34) |
| GC-34 | Statistiques cumulées | [CAR-34](https://lmn24.atlassian.net/browse/CAR-34) |
| GC-35 | Réinitialisation des statistiques de ce jeu avec confirmation | [CAR-34](https://lmn24.atlassian.net/browse/CAR-34) |
| GC-36 | Inspection agrandie des cartes | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| GC-37 | Drag-and-drop facultatif et sélection simple | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| GC-38 | Cibles légales surlignées | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| GC-39 | Dernière action confirmée | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| GC-40 | Zoom/panoramique facultatifs | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| GC-41 | Portrait/paysage | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| GC-42 | Piles compactes avec nombre | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| GC-43 | Inspection des cartes connues | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| GC-44 | Silhouettes des figures non révélées | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| GC-45 | Plein écran facultatif | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| GC-46 | Statut réel de sauvegarde | [CAR-13](https://lmn24.atlassian.net/browse/CAR-13) |
| GC-47 | Un seul onglet écrivain | [CAR-13](https://lmn24.atlassian.net/browse/CAR-13) |
| GC-48 | Lisibilité renforcée | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| GC-49 | Tutoriel court facultatif | [CAR-33](https://lmn24.atlassian.net/browse/CAR-33) |
| GC-50 | Conseils contextuels facultatifs | [CAR-33](https://lmn24.atlassian.net/browse/CAR-33) |
| GC-51 | Raccourcis clavier facultatifs | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| GC-52 | Confirmation des coups ordinaires désactivée par défaut, sauf besoins du flux | [CAR-32](https://lmn24.atlassian.net/browse/CAR-32) |
| GC-53 | Suivre mouvement réduit appareil par défaut | [CAR-36](https://lmn24.atlassian.net/browse/CAR-36) |

**Clear the Dungeon :** les décisions CTD-ARB-01, CTD-ARB-02, CTD-ARB-03, CTD-ARB-04, CTD-ARB-05, CTD-ARB-06, CTD-ARB-07, CTD-ARB-08, CTD-ARB-09, CTD-ARB-10, CTD-ARB-11, CTD-ARB-12, CTD-ARB-13, CTD-ARB-14 restent normatives pour la mécanique. L'interface de [CAR-31](https://lmn24.atlassian.net/browse/CAR-31) présente poses provisoires, verrouillage, défausses, main vide ouverte, séquence d'attaque et issues, sans créer de nouvelles règles. Source : [Mary Clear the Dungeon](../../game-rules/clear-the-dungeon.md).

## Décisions et points encore ouverts

**Décisions déjà obtenues, non à redemander :** galerie immersive et fiches ; illustrations fixes des cartes ; univers graphiques par jeu ; tutoriels facultatifs ; une partie active par jeu ; sauvegarde automatique ; Gridcannon GC-22 à GC-53 ; langues FR/EN MVP et dix à terme ; AD-02/04/05 ; Les Douze Tyrans/Grèce antique.

**[PROPOSITION SALLY — validation visuelle requise]** composition exacte des plateaux et de leurs panneaux sur chaque largeur, anatomie finale de la carte, parcours de focus détaillé dans les maquettes, valeurs des tokens du DESIGN.md, illustration finale de chaque univers et validation réelle des contrastes. Les affectations de raccourcis GC-51 restent indicatives ; ne pas les imposer sans essai.

**Question produit préexistante :** suppression de toutes les données ou granularité par jeu (PRD A-01). **Question technique préexistante :** compatibilité et format de sauvegarde GC-54 sous Winston/Amelia, sans redéfinir les règles de Mary.

**Limitations de réalisation :** aucune maquette ou test utilisateur n'a été rendu/exécuté, pas de test WCAG ni de build, pas de vérification technique des WebViews et aucun code ou ticket Jira modifié. Le présent document et [DESIGN.md](./DESIGN.md) sont des **spécifications documentaires** publiées pour préparer les maquettes et l'implémentation, sans se présenter comme interfaces développées.

## Revue des maquettes V1 — retour du porteur et préparation V2 (23 novembre 2026)

**Retour explicite, applicable aux deux maquettes :** « disposition intéressante, à améliorer » ; **aucun commentaire complémentaire**. Les maquettes sont des prototypes de travail, **non validés comme référence finale**. Les pistes ci-dessous sont des **propositions de Sally** issues des risques déjà recensés ; elles ne doivent pas être attribuées au porteur comme de nouveaux arbitrages UX.

| Maquette | Évaluation | Travail ciblé pour la V2 | Critère de revue |
| --- | --- | --- | --- |
| Clear the Dungeon | À améliorer | Tester en priorité un affichage plus lisible des **quatre colonnes**, de la main, des cartes provisoires/verrouillées et des actions de défausse/clôture, surtout sur smartphone portrait | Les quatre monstres et le statut d'engagement sont identifiables ; les commandes nécessaires restent accessibles sans ambiguïté |
| Gridcannon | À améliorer | Améliorer la place accordée aux **douze figures périphériques**, à leurs **résistance/armure**, à la grille 3×3 complète et à la réserve ; rendre l'aperçu de tir consultable sans couvrir la cible ou le bouton de confirmation | Les valeurs et les deux axes d'un éventuel double tir sont lisibles ; la sélection et la confirmation restent non destructives jusqu'à validation |

**Plan de conception V2 :**
1. Comparer deux variantes de composition **mobile portrait** pour chaque plateau, en gardant la même information et les décisions Mary. Vérifier ensuite paysage et bureau.
2. Distinguer dans les écrans les **valeurs toujours visibles** (résistance/armure, pioche, dégâts, phase) des **détails consultables à la demande** (inspection des cartes et piles, rappel des règles, historique immédiat).
3. Vérifier les étapes « sélectionner → prévisualiser → confirmer/annuler → sauvegarder », incluant la **main vide encore ouverte** pour CTD et le **double tir de coin** pour Gridcannon.
4. Contrôler le clavier, le tactile, le zoom, les libellés FR/EN et la réduction des animations sur les nouvelles variantes. Ne pas tester des mécaniques inventées.
5. Soumettre les deux variantes V2 à une nouvelle revue utilisateur avant de promouvoir une disposition en référence définitive.

**Périmètre de cette mise à jour :** documentation du retour et préparation de V2 uniquement. Les prototypes HTML V1 déjà livrés ne sont pas renommés « V2 », et aucun nouveau rendu visuel ni test de jouabilité n'est revendiqué.
