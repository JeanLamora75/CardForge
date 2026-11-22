# Clear the Dungeon — référentiel de règles CardForge

**Responsable :** Mary — Business Analyst BMAD  
**Étude :** 22 novembre 2026  
**Version de jeu retenue :** Classic 1.1.0 (23 octobre 2024), **sans règle facultative de réserve**, avec deux jokers  
**Statut :** étude sourcée, **cas limites à confirmer** avant d'implémenter ou déclarer un moteur conforme  
**Usage :** source de spécification propre à Clear the Dungeon, distincte de l'interface Fantasy de CardForge

## 1. Références et hiérarchie

- [Publication des règles Classic par Mark S. Ball (Gifts for Card Players)](https://giftsforcardplayers.com/clear-the-dungeon-a-solo-card-game/) — référence accessible expliquant les règles, version Classic v1.1.0.
- [Annonce du livre complet de règles Classic 1.1 et Advanced 1.2 par l'auteur](https://boardgamegeek.com/thread/3392258/clear-the-dungeon-complete-rule-book) — annonce datée du 23 octobre 2024, page dont l'accès direct peut être restreint.
- [Règles Classic au format Google Docs liées depuis la publication](https://docs.google.com/document/d/1BBPusx0Q_UM7vo8i5Yzuk7UyrWBf3PvjdDsx_h-qHwQ/edit) — référence primaire identifiée, **texte intégral non extrait pendant cette revue**.
- [Étude initiale des règles et des droits](../clear-the-dungeon-rules-rights-study.md) et [matrice de conformité](../clear-the-dungeon-rule-test-matrix.md) — documentation BMAD préalable, à maintenir synchronisée.

**Niveau de preuve :** la page publiée sous le nom de l'auteur a été consultée en ligne ; le PDF/livre complet et le Google Doc ne sont pas considérés comme lus intégralement. Toute question d'ordre d'exécution ou de cas limite non explicitement tranchée par la source est ouverte, pas inventée.

## 2. Objectif, matériel et préparation

**But :** vaincre les 12 monstres.

1. Utiliser 54 cartes : les 52 cartes ordinaires et deux jokers.
2. Isoler les 12 figures (4 valets, 4 dames, 4 rois), qui sont les monstres.
3. Mélanger ces 12 figures, les disposer face cachée en **quatre colonnes de trois cartes**, et retourner la première carte accessible de chaque colonne.
4. Mélanger les **42 cartes de puissance** restantes : les cartes As à 10 des quatre enseignes (40) plus deux jokers.
5. La pioche de puissance et les positions réelles des cartes doivent être conservées exactement dans les sauvegardes.

Aucun élément d'illustration Fantasy (faction, personnage, animation) n'entre dans ces calculs.

## 3. Cycle de jeu documenté

### 3.1 Main et pioche

- Le joueur pioche **trois cartes de puissance** pour constituer sa main.
- Le lot de trois cartes doit être joué ou défaussé avant une nouvelle pioche.
- L'ordre détaillé de placement d'une attaque partielle et le cas d'une pioche de moins de trois cartes sont à rapprocher du livre primaire complet (**O-CTD-01, O-CTD-02**).

### 3.2 Attaquer un monstre

- Les **deux premières cartes** doivent fournir une puissance dont la **somme est supérieure ou égale** à la résistance du monstre. Leurs enseignes sont libres.
- La **troisième carte** est le déclencheur : elle doit correspondre à **l'enseigne exacte** du monstre, quelle que soit sa valeur.
- Lorsque les conditions sont réunies, les trois cartes d'attaque et le monstre vaincu sont retirés vers la défausse hors-jeu ; le monstre suivant de la colonne concernée est révélé lorsqu'il devient accessible.
- Une attaque incomplète ou insuffisante ne doit pas vaincre le monstre.

| Monstre | Résistance |
| --- | ---: |
| Valet (J) | 11 |
| Dame (Q) | 12 |
| Roi (K) | 13 |

**Exemples déterministes :** 5 + 6 contre un valet = seuil atteint, si troisième carte de l'enseigne requise ; 5 + 5 = insuffisant ; 8 + 6 = suffisant, ce n'est **pas** une égalité stricte.

### 3.3 Jokers

- La publication consultée indique : **la valeur d'un joker est choisie, au maximum 10**, et son enseigne peut être celle requise.
- Le joker peut participer à la puissance ou jouer le rôle de déclencheur selon les restrictions officielles à préciser.
- **Correction documentaire :** la formulation ancienne « joker vaut 10 » est trop restrictive pour restituer fidèlement la source ; pour CardForge, **valeur variable jusqu'à 10** est la règle documentée, mais le minimum possible, l'instant du choix et la disponibilité lors d'attaques partielles nécessitent validation du texte complet.
- Aucun joker ne reçoit de capacité Fantasy supplémentaire.

### 3.4 Défausse et dégâts

- Les cartes inutilisées sont versées à la **pile de dégâts**.
- La partie est perdue lorsque la pile de dégâts atteint **sept cartes**, selon la publication consultée.
- La **réserve facultative est désactivée dans CardForge** : le joueur ne peut pas rejouer le sommet de la pile de dégâts. **Cette désactivation ne supprime ni la pile de dégâts ni le seuil de défaite.**
- Le moment précis des vérifications et les conséquences d'une attaque incomplète sont encore ouverts.

## 4. Fin de partie, score et variantes

- **Victoire :** les 12 monstres sont vaincus.
- **Défaite :** seuil de dégâts ou épuisement du pouvoir de jeu selon les conditions précises à clarifier à la lecture des règles complètes.
- **Score officiel mentionné :** nombre de cartes **restant dans la pioche de puissance** en cas de victoire ; les cartes encore en main ne s'ajoutent pas à ce score.
- **Exclu du MVP :** Advanced 1.2.0, autres variantes et utilisation de la réserve facultative. Les jokers sont conservés.
- Une **Partie abandonnée** par choix confirmé est un état CardForge de suivi statistique, pas une nouvelle défaite inventée dans les règles originales.

## 5. Contrat métier et tests de conformité

| ID | Vérification attendue | Statut |
| --- | --- | --- |
| CTD-01 | Composition initiale 12 figures + 42 cartes de puissance | Documenté |
| CTD-02 | Quatre colonnes de trois et révélation initiale | Documenté |
| CTD-03 | Main de trois et séquence d'utilisation | Partiellement documenté |
| CTD-04 | Résistances 11/12/13, somme ≥ résistance | Documenté |
| CTD-05 | Déclencheur = enseigne identique au monstre | Documenté |
| CTD-06 | Joker : choix de valeur jusqu'à 10 et enseigne libre | Documenté ; bornes/cas à préciser |
| CTD-07 | Après victoire : retrait des cartes et révélation | Documenté ; séquence fine à préciser |
| CTD-08 | Pile de dégâts : sept entraîne une défaite | Documenté ; ordre à confirmer |
| CTD-09 | Réserve facultative interdite dans la V1 | Décision utilisateur |
| CTD-10 | Douzième monstre vaincu = victoire | Documenté |
| CTD-11 | Score de victoire = cartes restant dans pioche | Documenté |
| CTD-12 | Sauvegarde/reprise : aucun remélange ni effet visuel | Invariant CardForge AD-03/05/09 |
| CTD-13 | Finalisation : un seul résultat statistique | Invariant CardForge AD-10 |

Les cas déterministes existants restent dans [la matrice BMAD de conformité](../clear-the-dungeon-rule-test-matrix.md), qui doit être étendue pour couvrir le joker à valeur choisie et les clarifications.

## 6. Questions en suspens avant développement du moteur complet

1. **O-CTD-01 :** ordre complet des phases, coups partiels, gestion d'attaques sur plusieurs monstres.
2. **O-CTD-02 :** fin du paquet, moins de trois cartes disponibles, et situation sans action jouable.
3. **O-CTD-03 :** statut d'une carte déjà posée, défausse exacte et révélation entre deux étapes.
4. **O-CTD-04 :** plage précise des valeurs du joker et règles de choix/emploi avec deux jokers.
5. **O-CTD-05 :** instant de résolution de la défaite à sept dégâts et éventuelle priorité face à une victoire simultanée.
6. **O-CTD-06 :** formulation officielle du calcul de score dans les cas particuliers.

Ces questions doivent être tranchées par le texte complet officiel ou par clarification de Mark S. Ball. Aucune solution ne doit être déduite de l'habillage Fantasy ou d'un autre jeu.

## 7. Droits, crédits et restrictions de distribution

- Le concepteur identifié est **Mark S. Ball** ; ses règles sont annoncées sous licence **CC BY-NC-ND 4.0**. Cette licence ne suffit pas en elle-même à autoriser la redistribution de contenu dérivé protégé.
- **Information déclarée par le porteur de CardForge :** Mark S. Ball a personnellement autorisé une adaptation à condition qu'elle soit gratuite. La conversation de permission et sa portée n'ont pas été consultées durant cette étude.
- Avant publication, vérifier et conserver : portée exacte du nom, univers graphique, textes, Web, Android, iOS, territoires et attribution.
- CardForge reste gratuit et sans publicité selon les décisions validées ; une monétisation ultérieure impose une nouvelle analyse des permissions.

## 8. Statut de préparation

**Documentation des règles principales : avancée ; feu vert pour moteur complet : NON tant que les points O-CTD ne sont pas arbitrés.** Les matrices de tests sont des spécifications ; aucun test de moteur n'a été exécuté pendant cette étude.
