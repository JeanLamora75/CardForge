# Loot the Loop — référentiel de règles fonctionnelles CardForge

**Responsable :** Mary — Business Analyst BMAD  
**Date du cadrage :** 22 novembre 2026  
**Jeu original :** *Loot the Loop*, Wil Su (collection *Isaludo*, Beta 1.11, 4 septembre 2021)  
**Périmètre :** mode original solo ; **52 cartes standard + un seul joker** ; pas de modification des règles  
**Statut :** **cadrage métier complet des règles publiées dans *Isaludo*, avec quelques précisions de tests**. Aucune décision de design graphique ou d'UX n'est sollicitée.

## 1. Sources, version et différence entre transcriptions

- **Collection originale de Wil Su, *Isaludo*, Beta 1.11** (pages 32–38 pour *Loot the Loop*) : transcription consultable https://fr.scribd.com/document/619490339/Isaludo-Beta ; édition indiquant auteur et date, contenu des règles détaillé directement accessible.
- **Publication de la collection sur BoardGameGeek** : https://boardgamegeek.com/thread/2587399/isaludo-ten-new-solo-card-games-playable-with-a-st ; fichier Isaludo https://boardgamegeek.com/filepage/301674/isaludo-collection (PDF directement indisponible à l'outil lors de la revue).
- **Page du jeu :** https://boardgamegeek.com/boardgame/358081/loot-the-loop .
- **Transcription secondaire :** https://blog.jorisl.nl/gamerules-loot-the-loop-rules.html (JorisL, juillet 2025).

**Divergence observée :** la page secondaire propose une **mise en place alternative en trois paquets, avec révélation préalable de deux cartes par paquet**. Le chapitre *Isaludo* de Wil Su consulté prescrit **simplement de mélanger les 53 cartes et de tenir la pioche face cachée** ; il précise que l'action « Observer » est normalement la seule possible au début. **CardForge retient la mise en place originale d'Isaludo, sans pré-révélation**. Cette différence est une *variante de la transcription secondaire*, pas une question que l'utilisateur doit arbitrer.

## 2. Objectif et contenu

**Objectif :** explorer un temple en boucle, récupérer **les quatre As (joyaux)**, puis **atterrir sur le Joker visible (sortie)** à l'issue d'une action d'exploration.

**Matériel physique :** un paquet mélangé de **53 cartes : 52 cartes ordinaires + un joker**. Le second joker n'est pas utilisé. Les cartes ont une orientation de visibilité (face visible/cachée) qui est **une donnée de règles**, non un effet esthétique.

| Carte | Fonction |
| --- | --- |
| As (4) | Joyau à récupérer |
| 2–10 (36) | Bibelot / pas de déplacement égal à sa valeur lorsqu'elle est visible parmi les deux premières |
| J/Q/K (12) | Pièges, mortels uniquement si le joueur **atterrit sur la carte visible** |
| Joker (1) | Sortie ; victoire si tous les As sont déjà collectés et que l'on y atterrit visible en explorant |

**Score officiel :** nombre **total de cartes** dans la pile de butin (quatre As et éventuels bibelots 2–10). Aucune unité de points basée sur la valeur des cartes, aucun bonus de tour.

## 3. Préparation officielle

1. Constituer le paquet de 53 cartes ; **mélanger et conserver tout le paquet face cachée et dans son ordre**, sans révéler préalablement six cartes.
2. Prévoir une zone de **trois notes de parcours au maximum**, initialement vide.
3. Prévoir une **pile de score/butin** vide.
4. Le haut de la pioche représente la position actuelle dans le temple ; l'ordre circulaire est celui du paquet, sans re-mélange pendant la partie.
5. Au premier tour, la carte supérieure est cachée : **l'action « Observer » est normalement la seule légale**.

## 4. Les quatre actions du joueur

**Exactement une action choisie par tour** parmi les suivantes, lorsqu'elle est légalement disponible. Aucune pioche automatique, attaque, vie, mana ou déplacement libre n'est ajouté.

### 4.1 Observer — Look Around

- **Condition :** la carte supérieure du paquet est face cachée.
- **Effet :** retourner **les deux premières cartes** pour les rendre visibles, **sans changer leur ordre**. Si la seconde est déjà visible, ne retourner que la première.
- Une carte piège révélée par cette action **ne provoque pas à elle seule une défaite** : il faut y **atterrir lors d'une exploration**.

### 4.2 Explorer — Explore

- **Condition :** au moins une des **deux premières cartes** du paquet est une **carte numérique 2–10 face visible**.
- Choisir pour la distance **la valeur d'une des cartes numériques visibles** de ces deux premières positions. Si une seule est admissible, il n'existe qu'une distance légale.
- Déplacer exactement **N cartes du haut vers le bas** du paquet, **en préservant leur ordre relatif**, les deux premières étant incluses dans le nombre N.
- La **nouvelle carte supérieure** est la destination d'arrivée ; appliquer le résultat suivant :

| Destination | Conséquence |
| --- | --- |
| Carte face cachée (quel que soit son rang réel) | Aucun effet immédiat ; la carte reste cachée |
| J/Q/K face visible | **Défaite immédiate** |
| As face visible | Retirer cet As du paquet et l'ajouter au butin |
| 2–10 face visible | Retirer cette numérique du paquet et l'ajouter au butin |
| Joker face visible, quatre As déjà collectés | **Victoire immédiate** |
| Joker face visible, moins de quatre As collectés | Aucun effet ; continuer la partie |

- Un résultat à l'arrivée n'autorise **pas** de nouvelle action gratuite : l'observation ou l'exploration suivante survient sur le prochain tour, selon la nouvelle carte supérieure.

### 4.3 Marquer un chemin — Mark a Path

- **Conditions :** première carte du paquet = **numérique face visible 2–10** et moins de **trois** cartes déjà présentes dans les notes.
- Retirer **cette première carte** du paquet, la conserver **face visible** dans une des places de notes. Aucune autre carte n'est déplacée, aucun butin n'est gagné.
- Les notes peuvent contenir jusqu'à **trois cartes** ; une quatrième est interdite jusqu'à restitution d'une note.

### 4.4 Reprendre un chemin marqué — Return to a Marked Path

- **Condition :** au moins une carte se trouve dans les notes.
- Choisir une carte des notes, la retirer de cette zone et la remettre **face visible au sommet du paquet**, sans réarranger les autres cartes. La restitution est une action **distincte** du marquage.
- Interdiction de « remplacer » simultanément une note par une carte supérieure lorsque les trois places sont occupées : restituer lors d'un tour puis marquer lors d'un autre.

## 5. Inspection, fin de partie et cas particuliers

**Inspection autorisée :** le joueur peut **parcourir le paquet pour consulter les cartes déjà face visible**, les positions et compter les distances. Il **ne doit jamais consulter l'identité d'une carte face cachée**. Cette consultation ne modifie ni l'ordre des cartes ni l'état de face des cartes et ne constitue pas une action de tour.

**Victoire :** avoir les quatre As dans le butin puis **atterrir sur le joker face visible par l'action Explorer**. Il n'est **pas** permis de gagner en retournant simplement le Joker, en le regardant lors d'une inspection ou en le découvrant après avoir récupéré le quatrième As.

**Défaite :** atterrir en explorant sur un piège J/Q/K visible, ou être bloqué sans chemin viable ; le texte original évoque également la défaite si toutes les options de déplacement mènent à un piège. La distinction entre « aucun déplacement légal », « plusieurs déplacements mortels » et « possibilité de marquer/restituer une note » doit être testée pour ne pas conclure à une défaite prématurée. **Ne pas déclarer une défaite s'il reste une séquence d'actions légales de notes permettant d'éviter le piège.**

**Cas du paquet qui rétrécit :** les As/bibelots gagnés sont retirés définitivement du temple ; les notes sont temporairement hors paquet et leur restitution en change la taille et le sommet. Conserver le nombre exact de cartes, l'orientation de chaque carte et l'ordre circulaire.

**Conventions d'intégrité :** aucune carte créée/dupliquée ; somme des cartes dans le temple, les notes et le butin = 53 tant que le jeu est actif (en incluant les éventuelles cartes transitant dans une opération atomique). Les J/Q/K et Joker ne partent jamais au butin selon les règles normales.

## 6. Points à faire confirmer par les tests/source, sans micro-arbitrages

| Code | Sujet | Consigne |
| --- | --- | --- |
| LTL-R01 | État terminal si aucun mouvement n'est actuellement accessible mais qu'une action Observer / Marquer / Restituer reste disponible | Tester la recherche d'une continuation légale avant une défaite d'impasse |
| LTL-R02 | Définition précise d'une situation où **tous les déplacements disponibles** sont fatals, mais où les notes permettent un détour ultérieur | Ne pas confondre issue perdante et simple mauvaise option momentanée ; examiner les exemples Isaludo |
| LTL-R03 | Taille exceptionnellement faible du paquet en fin de partie : une ou aucune carte | Préserver l'intégrité, éviter de lire une seconde carte inexistante ; demander clarification si scénario atteignable |
| LTL-R04 | Écart entre mise en place d'Isaludo et variante secondaire | **Tranché par la hiérarchie des sources : préparation Isaludo sans six cartes révélées** |
| LTL-R05 | Droits de publication de l'adaptation, crédits, éventuelle utilisation du personnage original | Vérifier les droits de l'œuvre avant diffusion ; le cadrage des mécaniques ne confère pas une licence |

**Aucun de ces points n'appelle une nouvelle décision d'interface.**

## 7. Matrice de tests métier à réaliser

| ID | Cas | Résultat attendu |
| --- | --- | --- |
| LTL-T01 | Préparation | 53 cartes, exactement un Joker, toutes cachées, notes et butin vides |
| LTL-T02 | Début du jeu | Seule action Observer admissible |
| LTL-T03 | Observer | Deux premières visibles, ordre inchangé |
| LTL-T04 | Observer avec deuxième déjà visible | Ne retourner que la première |
| LTL-T05 | Explorer sans 2–10 visible parmi les deux premières | Action refusée |
| LTL-T06 | Explorer avec 4 visible en première et 6 en deuxième | Distances possibles 4 ou 6 |
| LTL-T07 | Explorer de N cartes | Exactement N cartes transférées à la fin dans le même ordre |
| LTL-T08 | Arrivée sur carte cachée | Aucun piège, butin ou révélation automatique |
| LTL-T09 | Arrivée sur Valet visible | Défaite immédiate |
| LTL-T10 | Arrivée sur As visible | Retrait au butin, paquet réduit d'une carte |
| LTL-T11 | Arrivée sur 7 visible | Retrait au butin, score +1 |
| LTL-T12 | Arrivée sur Joker visible avant 4 As | Pas de victoire |
| LTL-T13 | Arrivée sur Joker visible après 4 As | Victoire, score = nombre de cartes au butin |
| LTL-T14 | Marquer avec 3 notes déjà occupées | Action refusée |
| LTL-T15 | Marquer puis restituer | Deux tours distincts, carte face visible, ordre exact |
| LTL-T16 | Inspection du paquet | Visibles accessibles, identités cachées non révélées |
| LTL-T17 | Mauvaise branche, note permettant de sauver la partie | Pas de défaite prématurée |
| LTL-T18 | Sauvegarde/reprise | Visibilité, ordre, notes, butin, résultat préservés |
| LTL-T19 | Contrôle d'intégrité | 53 cartes uniques dans zones légales |

**Statut des tests : spécifiés, non exécutés.**

## 8. Attribution, droits et passage à la réalisation

- Jeu conçu par **Wil Su**, dans *Isaludo* ; attribution du jeu original et source à préserver.
- Une règle consultable gratuitement n'est **pas automatiquement librement redistribuable**, et l'utilisation de la fiction ou du texte original requiert une vérification des autorisations nécessaires avant publication.
- L'habillage thématique CardForge conserve obligatoirement le sens des rangs, As, figures, Joker, faces visibles/cachées, déplacements et score.

**Conclusion Mary :** le référentiel reprend toutes les actions, conditions et résultats de la version *Isaludo* documentée, avec une différence de mise en place secondaire explicitement écartée. **Prêt pour conception du moteur et des tests**, sous réserve de la vérification d'intégrité, des cas de blocage et des droits ; **aucun nouvel arbitrage utilisateur de règle n'est identifié**. **Confiance élevée** pour le noyau des règles d'après la transcription *Isaludo* ; **modérée** pour la détection algorithmique exhaustive des impasses.
