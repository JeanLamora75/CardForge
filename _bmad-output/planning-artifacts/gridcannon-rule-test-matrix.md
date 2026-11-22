# Gridcannon Version 2 — matrice BMAD de conformité aux règles

**Responsable :** Mary (Business Analyst)  
**Date :** 22 novembre 2026  
**Version officiellement retenue :** **Version 2**, validée par le porteur de CardForge le 22 novembre 2026  
**Statut :** spécification documentaire préparatoire aux tests ; **aucun scénario exécuté**  
**Référentiel détaillé :** [règles Gridcannon](./game-rules/gridcannon.md)

## Politique de preuve et de décision

La source primaire identifiée est [Tom Francis — Gridcannon](https://www.pentadact.com/2019-08-20-gridcannon-a-single-player-game-with-regular-playing-cards/), qui distingue Version 2 et Version 1. Ce tableau synthétise le référentiel documentaire établi à partir des sources consultées précédemment, **sans nouvelle recherche Web lors de cette mise à jour**. Les étiquettes « Documenté » ne signifient pas qu'un moteur a été exécuté. Les cas non confirmés doivent rester ouverts, jamais recevoir une règle inventée pour faciliter la programmation.

## Règles retenues pour tests

| ID | Comportement attendu | État documentaire |
| --- | --- | --- |
| GC-R01 | Le paquet initial contient 52 cartes ordinaires + 2 jokers | Documenté |
| GC-R02 | La grille initiale comporte neuf cartes numériques visibles (2 à 10) | Documenté |
| GC-R03 | Figures = adversaires ; As/Jokers = actions spéciales, pas des cartes numériques de grille | Documenté |
| GC-R04 | Douze emplacements adversaires répartis sur les quatre côtés | Documenté |
| GC-R05 | Figures attirées par la meilleure carte supérieure selon priorité enseigne, couleur, valeur | Documenté ; cas d'emplacement occupé ouvert |
| GC-R06 | Figure vaincue retourne face cachée et conserve sa place | Documenté |
| GC-R07 | Carte numérique sur une pile dont la valeur supérieure est <= à la valeur jouée | Documenté ; emplacement vide ouvert |
| GC-R08 | Tir depuis une extrémité ; les deux cartes intermédiaires comptent, jamais la carte déclencheuse | Documenté |
| GC-R09 | Valet : toute enseigne ; Dame : même couleur ; Roi : même enseigne | Documenté |
| GC-R10 | Résistances initiales Valet 11 / Dame 12 / Roi 13 ; armure cumulable | Documenté |
| GC-R11 | As : retirer une pile entière et la remettre sous pioche | Documenté ; ordre exact ouvert |
| GC-R12 | Joker : déplacer une carte supérieure vers une position légale ; une attaque peut en résulter | Documenté |
| GC-R13 | Une carte impossible à poser devient de l'armure d'une figure selon priorité inverse | Documenté ; cas atypiques ouverts |
| GC-R14 | Défaite si résistance atteint 20 pour J/Q ou 19 pour K | Documenté ; priorité terminale à vérifier |
| GC-R15 | Victoire quand douze figures vaincues ; score par actions spéciales non dépensées (maximum six) | Documenté |
| GC-R16 | Version 2 sans centre volontairement vide ni mécanisme de reset / shame pile issus de la version 1 | **Décision utilisateur validée** |

## Scénarios déterministes à implémenter

| Test | Précondition / action | Résultat attendu | Niveau de preuve |
| --- | --- | --- | --- |
| GC-T01 | Mise en place sur paquet contrôlé avec figures, As, jokers et 2–10 | Neuf nombres visibles ; adversaires/actions séparés, aucune carte perdue | Spécifié, non exécuté |
| GC-T02 | Figure révélée ; un sommet de même enseigne admissible est disponible | Placement selon priorité d'enseigne et valeur la plus élevée | Spécifié, non exécuté |
| GC-T03 | Aucun sommet de même enseigne mais sommet de même couleur disponible | Priorité à même couleur, valeur la plus élevée | Spécifié, non exécuté |
| GC-T04 | Sommet le plus semblable situé dans un coin | Choix parmi côtés autorisés si emplacements libres | Spécifié, non exécuté |
| GC-T05 | Tous les emplacements adjacents au sommet candidat sont occupés | **RÉSULTAT INCONNU** : arbitrer G-01 avant développement | Bloquant |
| GC-T06 | Figure vaincue puis nouveau placement de figure | Figure vaincue demeure en place et n'offre pas un emplacement vide | Spécifié, non exécuté |
| GC-T07 | Jouer un 6 sur pile 6 puis un 5 sur pile 6 | 6 admissible ; 5 refusée pour cette pile | Spécifié, non exécuté |
| GC-T08 | Emplacement de grille vide à la suite d'un As | **RÉSULTAT INCONNU** : valeur de référence du vide à confirmer (G-02) | Bloquant |
| GC-T09 | Carte de valeur 8 déclenche un tir ; deux intermédiaires 6 et 5 vers un Valet sans armure | Tir de puissance 11, Valet vaincu ; déclencheur exclu de la somme | Spécifié, non exécuté |
| GC-T10 | Même tir de puissance 11 vers une Dame de résistance 12 | Dame non vaincue | Spécifié, non exécuté |
| GC-T11 | Deux intermédiaires 6/6, seule une carte de même couleur que la Dame | Seule la carte compatible contribue ; puissance insuffisante | Spécifié, non exécuté |
| GC-T12 | Deux intermédiaires 6/7 de même enseigne qu'un Roi | Puissance 13, Roi vaincu | Spécifié, non exécuté |
| GC-T13 | Deux intermédiaires 6/7, l'un d'une autre enseigne que le Roi | La carte d'une autre enseigne ne contribue pas | Spécifié, non exécuté |
| GC-T14 | Tir déclenché depuis le centre de la grille | Pas de tir direct vers les adversaires sur les bords | Spécifié, non exécuté |
| GC-T15 | Tir depuis un coin vers deux figures simultanément vulnérables | **ORDRE À ARBITRER** : deux directions/issue terminale (G-03) | Bloquant |
| GC-T16 | Activer un As sur une pile de plusieurs cartes | Pile entière retirée, As consommé, cartes au bas de la pioche ; ordre à confirmer G-04 | Partiel |
| GC-T17 | Activer Joker pour déplacer carte supérieure vers pile légale | Joker consommé, action légale ; tir éventuel résolu | Spécifié, non exécuté |
| GC-T18 | Carte numérique impossible à poser sans alternative | Carte affectée comme armure selon enseigne/couleur/valeur de figure la plus basse | Spécifié, non exécuté |
| GC-T19 | Valet passe de résistance 19 à 20 par armure | Défaite selon seuil publié, même si pioche non vide | Spécifié, non exécuté |
| GC-T20 | Roi passe de résistance 18 à 19 par armure | Défaite selon seuil publié | Spécifié, non exécuté |
| GC-T21 | Aucun adversaire vivant révélé mais moins de douze apparus | Avancer jusqu'à révéler nouvelle figure, ordre des cartes écartées à préserver | Spécifié ; ordre détaillé à revoir |
| GC-T22 | Douzième et dernière figure vaincue | Une victoire définitive, score = actions spéciales inutilisées | Spécifié, non exécuté |
| GC-T23 | Partie sans actions possibles, paquet épuisé | **PRÉCISER** l'issue officielle et l'ordre des vérifications (G-05) | Bloquant |
| GC-T24 | Sauvegarder puis reprendre après extraction/armure | Ordre de pioche, piles, armures, figures et actions consommées identiques | Invariant CardForge |
| GC-T25 | Rafraîchir après victoire | Aucun double comptage du résultat | Invariant CardForge |
| GC-T26 | Changer uniquement illustrations/son de guerre spatiale | Mêmes décisions métier et même résultat | Invariant CardForge |

## Questions bloquantes à arbitrer

| ID | Question | État | Mode de résolution autorisé |
| --- | --- | --- | --- |
| G-00 | Quelle version du jeu ? | **CLOSE — Version 2 validée** | Décision du porteur |
| G-01 | Emplacement figure si meilleure attraction occupée | Ouvert | Source primaire détaillée, auteur ou validation métier argumentée |
| G-02 | Pile vide créée par un As : règles de placement | Ouvert | Source primaire détaillée / auteur |
| G-03 | Double tir depuis un coin, priorité de résolution | Ouvert | Source primaire détaillée / auteur |
| G-04 | Ordre/orientation d'une pile réinjectée sous la pioche | Ouvert | Source primaire détaillée / démonstration auteur |
| G-05 | Épuisement, impasse, action spéciale et armure : ordre des événements | Ouvert | Source primaire détaillée / auteur |
| G-06 | Nom public de l'adaptation et crédit de l'auteur | Ouvert, préalable à publication | Validation du porteur après lecture de la consigne publique de Tom Francis |

## Critères de sortie — Mary, John, Amelia, Murat

1. Confirmer toutes les règles ci-dessus contre la Version 2 de Tom Francis et, quand nécessaire, la démonstration primaire.
2. Arbitrer G-01 à G-05 avant de coder les comportements correspondants ; ne pas extrapoler depuis la Version 1.
3. Définir un titre public d'adaptation différent de « Gridcannon » seul et une attribution à Tom Francis.
4. Convertir GC-T01 à GC-T26 en tests déterministes exécutables, conserver les preuves CI.
5. Vérifier l'invariant des sauvegardes et de la fidélité des règles sur les trois plateformes avant toute publication mobile.

**Conclusion :** la Version 2 est fixée pour CardForge, mais un référentiel de tests non exécutés et plusieurs questions ouvertes ne constituent pas encore une preuve de conformité du moteur.

## Contrôle documentaire complémentaire du 22 novembre 2026
- **GC-T27 :** As disponible joué après pioche et avant placement : légal selon [Tom Francis V2](https://www.pentadact.com/2019-08-20-gridcannon-a-single-player-game-with-regular-playing-cards/).
- **GC-T28 :** deux armures cumulées et arrivée au seuil de 20 (J/Q) ou 19 (K) : défaite documentée par Tom Francis.
- **GC-T29 :** dernière carte de pioche consommée mais As utilisable : **ne pas déclarer automatiquement la défaite** ; laisser le recours se résoudre.
- **GC-T30 :** aucun adversaire vivant, douze non encore vaincus : traverser la pioche jusqu'à la figure suivante, puis remettre les autres cartes sous la pioche ; ordre exact à confirmer.
- **GC-T31 :** carte au coin : tirs possibles sur les deux axes ; si deux cibles sont vaincues ensemble, l'ordre terminal reste à arbitrer (G-03).
- **G-01/G-02 restent ouverts :** [Howto.cards](https://howto.cards/en/gridcannon/) reconnaît explicitement que V2 ne tranche pas l'emplacement de figure occupé ni la valeur d'une pile vide ; ses solutions de repli sont **des propositions secondaires**.
- **G-04 :** l'extraction remet une pile entière face cachée sous la pioche, mais l'ordre interne exact n'est pas spécifié.
- Ces nouvelles entrées sont des **spécifications de tests**, non des tests exécutés. [Règles actualisées](./game-rules/gridcannon.md).
