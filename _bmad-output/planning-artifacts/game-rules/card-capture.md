# Card Capture — référentiel de règles fonctionnelles CardForge

**Responsable :** Mary — Business Analyst BMAD  
**Date du cadrage :** 22 novembre 2026  
**Jeu original :** *Card Capture*, Lucas Gentry (2018)  
**Périmètre :** jeu solo standard, 54 cartes ; aucune extension ni variante de difficulté ajoutée  
**Statut :** **cadrage documentaire complet des mécaniques publiées ; quelques cas limites à valider sur le PDF original avant d'affirmer la conformité exécutable**. Aucune décision UX ou technique n'est requise ici.

## 1. Sources et fiabilité

- **Source originale identifiée — PDF de Lucas Gentry, 2018** : https://boardgamegeek.com/filepage/173125/card-capture-rules-2018-solitaire-print-and-play-c ; publication du concepteur, inaccessible directement à l'outil lors de l'étude (403).
- **Réédition du texte anglais mise en page, 2024** : https://boardgamegeek.com/filepage/289340/card-capture-rules-english-updated-layout ; mise en page par un contributeur et commentaires du concepteur, téléchargement également inaccessible directement lors de cette étude.
- **Transcription lisible de quatre pages du livret** : https://www.scribd.com/document/500375276/Card-Capture-Rules ; contenu consulté, auteur original indiqué Lucas Gentry, dépôt tiers non probant pour la licence.
- **Autre transcription de l'édition mise en page** : https://www.scribd.com/document/831361025/Card-Capture-Rules-English-Spreads ; contrôle croisé des valeurs et séquences.
- **Clarification publiée par Lucas Gentry** sur la première manche et l'ordre des phases : commentaire sur https://boardgamegeek.com/filepage/173125/card-capture-rules-2018-solitaire-print-and-play-c .
- **Recoupement non normatif** : https://coffeebreakgaming.com/cardcapture et https://newsgames.co.za/card-capture/ .

**Hiérarchie :** le texte original de Lucas Gentry prévaut sur toute adaptation, implémentation ou résumé tiers. **Les vérifications ci-dessous s'appuient sur les transcriptions consultables, pas sur une extraction directe du PDF d'origine.** Les hypothèses sont identifiées séparément.

## 2. Objectif et matériel

Jeu solo de constitution de pioche (*deckbuilding*) utilisant **52 cartes normales et deux jokers**. L'objectif est d'éliminer **toutes les cartes de la pioche adverse et de la ligne ennemie**, sans jamais laisser une **figure ou un As** (J, Q, K, A) entrer dans la **pile de capture ennemie**. Ces cartes peuvent, au contraire, être **capturées par le joueur** pour renforcer son paquet.

**Valeurs :** cartes 2 à 10 = valeur faciale ; Valet = 11 ; Dame = 12 ; Roi = 13 ; As = 14. Un joker **imite une autre carte jouée avec lui**, en reprenant sa valeur et son enseigne ; il n'est pas traité comme une carte universelle de valeur arbitraire indépendante.

## 3. Préparation

1. Retirer les **quatre 2, quatre 3, quatre 4 et les deux jokers** ; mélanger ces **14 cartes** pour constituer la **pioche personnelle**.
2. Mélanger les **40 cartes restantes** (5 à 10 et J/Q/K/A) pour constituer la **pioche adverse**.
3. Piocher quatre cartes de la pioche adverse, **face visible** : la première en **position 1**, puis les positions 2, 3 et 4.
4. Retirer de la ligne toutes les **figures et tous les As** présents parmi ces quatre cartes et les remettre **sous la pioche adverse**, sans les faire entrer dans la pile de capture adverse. Les places libérées seront complétées lors de la **première phase ennemie**, pas par une manipulation supplémentaire inventée.
5. Main initiale du joueur **vide** avant la première phase Défausse et Pioche. La clarification publique du concepteur indique que, pendant la première manche, il n'y a rien à défausser avant la première pioche.

**État à sérialiser :** ordre et identités des deux pioches, positions 1–4, main, défausse personnelle, pile de capture ennemie, manche et phase active.

## 4. Déroulement d'une manche

Quatre phases **dans cet ordre**, répétées jusqu'à victoire ou défaite.

### 4.1 Phase ennemie

1. Décaler les cartes encore présentes dans la **ligne ennemie vers la droite**, pour combler les emplacements vacants, **en préservant leur ordre relatif** ; la position 1 est l'extrémité droite, la position 4 l'entrée depuis la pioche adverse.
2. Remplir les emplacements vides depuis la pioche adverse, en respectant l'ordre de tirage.
3. Si la pioche adverse ne contient plus de cartes, ne pas créer de cartes pour compléter la ligne.

**Remarque :** le texte interdit de consulter l'ordre caché des pioches ; le traitement des figures qui réapparaissent **après la mise en place** n'est pas celui du filtrage initial. Elles constituent des ennemis capturables normalement.

### 4.2 Phase Défausse

Le joueur peut placer **de zéro à toutes ses cartes en main** dans sa **défausse personnelle**. Cette pile n'est **pas consultable librement** pendant la partie, et reste distincte de la pile de capture ennemie. Aucun effet direct de perte n'est associé à la défausse personnelle.

### 4.3 Phase Pioche

Piocher depuis la **pioche personnelle** jusqu'à posséder **quatre cartes** en main. Si la pioche personnelle se vide et qu'il faut encore piocher, **mélanger la défausse personnelle pour former une nouvelle pioche personnelle**, puis continuer. Les cartes conquises précédemment peuvent ainsi revenir dans la main du joueur.

### 4.4 Phase Capture — une action par manche

Choisir **une seule** des trois actions alternatives :

**A. Capturer une carte ennemie**
- Cibler **une** carte de la ligne ennemie, parmi les positions occupées.
- Dépenser depuis la main une ou plusieurs cartes d'une **même enseigne que la cible**, dont la **somme des valeurs atteint ou dépasse** la valeur de la cible.
- Le joker ne peut compter que comme **copie d'une autre carte effectivement engagée dans cette capture** ; conserver la correspondance valeur/enseigne. Deux jokers peuvent être employés avec une carte de référence si le PDF original confirme l'absence d'autre restriction ; ne pas imposer de joker autonome sans carte copiée.
- Mettre **la carte ennemie capturée et les cartes de la main dépensées** dans la **défausse personnelle** : elles rejoignent ainsi le circuit du paquet du joueur.
- Une capture enlève **exactement une** carte ennemie de la ligne.

**B. Laisser l'ennemi capturer une carte du joueur**
- Choisir une carte de sa main.
- Retirer la carte adverse en **position 1** et la carte de main choisie ; les placer **toutes deux** dans la **pile de capture ennemie**, définitivement hors du circuit de jeu.
- Si un **As, Valet, Dame ou Roi** est ajouté à cette pile, **défaite immédiate**. L'opération est donc dangereuse si la carte adverse en position 1 est une figure ou un As, ou si le joueur sacrifie lui-même une de ces cartes.

**C. Sacrifier deux cartes pour repousser un ennemi**
- Placer **deux cartes de la main** dans la **pile de capture ennemie**.
- Choisir **une** carte ennemie de la ligne et la remettre **sous la pioche adverse** ; elle pourra réapparaître.
- Ne pas sacrifier d'As ni de J/Q/K : leur entrée dans la pile de capture ennemie entraînerait une défaite immédiate. Les jokers appartiennent au paquet personnel et ne sont pas ajoutés aux cartes protégées par cette condition.
- L'action libère une position de la ligne et **ne capture pas** la carte renvoyée pour le joueur.

**Invariants communs :** toutes les cartes sont physiquement uniques ; les trois voies A/B/C sont exclusives dans une même phase Capture. Les cartes de la défausse personnelle pourront être remélangées ; celles de la pile de capture ennemie ne reviennent plus en jeu.

## 5. Victoire, défaite et confidentialité

- **Victoire :** à l'issue de la phase Capture, la **pioche adverse est vide** et les **quatre positions ennemies sont vides**, **sans avoir jamais placé d'As/J/Q/K dans la pile de capture ennemie**.
- **Défaite immédiate :** un As, Valet, Dame ou Roi entre dans la pile de capture ennemie.
- **Impasse :** le livret dit qu'une situation ne permettant plus de continuer légalement conduit à la perte ; l'algorithme exact de détection de l'impasse reste à confirmer avant intégration.
- **Information cachée :** ne pas consulter librement les pioches cachées, la défausse personnelle ni la pile de capture ennemie. La ligne ennemie et la main courante sont publiques.
- **Aucun score de victoire officiel identifié** dans les sources utilisées ; ne pas inventer de points, de bonus ou de classement officiel.

## 6. Cas limites à vérifier — sans arbitrage de confort

| Code | Sujet | État documentaire |
| --- | --- | --- |
| CC-R01 | Ordre interne de réinsertion des plusieurs figures/As retirés de la ligne lors de la préparation ; impact exact du filtrage initial | Document original à relire / conserver ordre stable sans inventer une règle officielle |
| CC-R02 | Traitement lorsque la pioche personnelle et la défausse ne suffisent pas pour atteindre quatre cartes ; capture impossible ou carte en main absente | Défaite par impasse citée, critère exécutable exact à confirmer |
| CC-R03 | Deux jokers sans carte non-joker de référence dans une capture ; possibilité de les utiliser comme seule source de puissance | Source « joker copie une autre carte jouée » ; ce sous-cas n'est pas explicitement détaillé |
| CC-R04 | Cas où la position 1 est vide, mais une autre position reste occupée et où le joueur veut choisir l'action B | Rotation normale prévue en phase ennemie ; disponibilité exacte de B à vérifier |
| CC-R05 | Capture de la dernière carte ennemie alors que le joueur garde une main ou une défausse personnelle | Victoire dépend exclusivement de l'absence d'ennemis ; pas de remise à zéro du paquet joueur requise |
| CC-R06 | Restrictions juridiques, nom dérivé et droits sur les textes/graphismes | Autorisation de diffusion de l'adaptation à vérifier, indépendamment du cadrage des mécaniques |

**Important :** CC-R01 à CC-R04 ne sont **pas** de nouvelles règles adoptées par CardForge et ne doivent pas déclencher une série de micro-arbitrages utilisateur. Une vérification ciblée des règles de Lucas Gentry suffit si le moteur rencontre ces cas.

## 7. Matrice de tests métier à réaliser

| ID | Cas | Résultat attendu |
| --- | --- | --- |
| CC-T01 | Distribution initiale | 14 cartes personnelles, 40 cartes ennemies avant constitution de ligne |
| CC-T02 | Figures/As dans les quatre cartes initiales | Retirés vers le bas de la pioche ennemie, positions libres |
| CC-T03 | Première phase Défausse | Main initialement vide, aucune fausse défausse |
| CC-T04 | Phase ennemie avec trous | Décalage à droite préservant ordre, remplissage à gauche |
| CC-T05 | Pioche personnelle insuffisante | Mélange de la défausse personnelle si disponible |
| CC-T06 | Défausse manuelle | Carte ajoutée à la défausse personnelle, non à la pile ennemie |
| CC-T07 | Capture d'un 9♥ avec 4♥+5♥ | Réussite, toutes trois vont dans la défausse personnelle |
| CC-T08 | Capture d'un 9♥ avec 4♠+5♥ | Refus malgré la somme, enseignes incompatibles |
| CC-T09 | Capture d'un Roi | Résistance 13, besoin d'enseigne correcte et total ≥13 |
| CC-T10 | Joker avec une carte de référence | Copie de valeur et d'enseigne ; total exact |
| CC-T11 | Action B sur position 1 | Carte position 1 et une carte de main vers pile ennemie |
| CC-T12 | Figure/As transféré vers pile ennemie | Défaite immédiate |
| CC-T13 | Action C | Deux cartes sacrifiées, une ennemie renvoyée sous la pioche adverse |
| CC-T14 | Deux actions Capture dans une même manche | Deuxième action refusée |
| CC-T15 | Toutes cartes ennemies éliminées | Victoire seulement si pioche ET positions vides |
| CC-T16 | Sauvegarde puis reprise | Identités, ordres, phases et défausses préservés |

**Statut des tests : spécifiés, non exécutés.**

## 8. Droits, crédits et décision de passage

- **Crédit :** « D'après Card Capture, jeu original de Lucas Gentry » et lien vers la source à prévoir dans le produit.
- **Droits :** la disponibilité publique gratuite du PDF ne vaut **pas** licence automatique de redistribution du livret ou de publication d'une adaptation numérique. Vérifier les conditions et autorisations directement auprès du titulaire avant diffusion.
- Les personnages, factions et illustrations CardForge ne modifient jamais les couleurs, enseignes, valeurs et identités nécessaires à ce moteur.

**Conclusion Mary :** cadrage des règles publiées suffisamment complet pour **préparer l'architecture et les tests**, mais **ne pas annoncer la fidélité intégrale du moteur ni un feu vert de diffusion** avant vérification du PDF primaire sur CC-R01–R04 et des droits. Pas de questions UX ni de choix esthétiques requis. **Confiance : élevée pour les quatre phases et les trois actions ; modérée pour les cas limites non détaillés.**


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

## Addendum Mary — vérification ciblée CAR-68
Source primaire : https://boardgamegeek.com/thread/2011639/wip-card-capture-an-entry-into-the-2018-solitaire/page/3 ; Lucas Gentry confirme explicitement que les deux Jokers peuvent représenter la même carte. CC-R03 : cette combinaison est autorisée, sans copie autonome. La question des références distinctes n'est pas explicitement tranchée. Source officielle de résumé : https://boardgamegeek.com/filepage/173125/card-capture-rules-2018-solitaire-print-and-play-c . Transcription secondaire https://www.scribd.com/document/500375276/Card-Capture-Rules : retour sous pioche sans ordre précisé (R01), pioche à quatre obligatoire et perte si continuation impossible sans précision de pénurie (R02), mention de sauter la phase ennemie quand pioche vide, en tension avec résumé compactage (R04). Ces trois cas restent ouverts ; ne pas prétendre à une certification. Le PDF primaire complet n'a pas été consulté. MVP : Skydeck et Midnight Syndicate inclus selon PRD consolidé, nomenclature historique ci-dessus remplacée pour le périmètre.
