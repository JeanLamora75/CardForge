# Gridcannon — référentiel de règles CardForge

**Responsable :** Mary — Business Analyst BMAD  
**Étude :** 22 novembre 2026  
**Version de référence validée par le porteur :** **Version 2 révisée** publiée par Tom Francis (et non la v1 historique), décision du 22 novembre 2026  
**Statut :** choix de Version 2 **validé** ; règles principales documentées d'après la source primaire précédemment étudiée ; cas limites et choix de nom à valider avant publication  
**Usage :** documentation fonctionnelle propre à Gridcannon, indépendante de la direction artistique « guerre spatiale » de CardForge.

## 1. Source primaire, version et provenance

- **Source officielle directe :** [Tom Francis — « Gridcannon: A Single Player Game With Regular Playing Cards »](https://www.pentadact.com/2019-08-20-gridcannon-a-single-player-game-with-regular-playing-cards/), publication du 20 août 2019, contenant **Version 2** et, séparément, l'ancienne **Version 1**.
- Corroboration secondaire : [Howto.cards — Gridcannon, règles de la version révisée](https://howto.cards/en/gridcannon/).
- [BoardGameGeek — Gridcannon](https://boardgamegeek.com/boardgame/288454/gridcannon).
- L'auteur indique avoir conçu le jeu et crédite **Chris Thursten** pour la mécanique d'armure.
- Dans la première livraison CardForge, **Version 2 est la référence officiellement retenue par CardForge, validée par le porteur le 22 novembre 2026.** Ce choix ferme G-00 ; les cas limites G-01 à G-05 restent indépendamment ouverts.
- **Ne pas fusionner** les deux versions : l'ancienne v1 avait un centre vide, des remises à zéro différentes et une « shame pile ». Ces mécanismes ne font pas partie de la Version 2.

## 2. Objectif, matériel et mise en place

**Objectif :** éliminer les **12 figures J, Q, K** apparaissant autour d'une grille de neuf piles de cartes.

**Matériel :** paquet de **54 cartes** : 52 cartes ordinaires et deux jokers.

1. Mélanger le paquet complet.
2. Distribuer face visible une **grille 3 × 3 de neuf cartes numériques 2 à 10** ; mettre temporairement de côté toute figure (J/Q/K), tout as et tout joker révélé pendant cette préparation, puis continuer jusqu'à remplir les neuf emplacements.
3. Placer les figures mises de côté autour de la grille selon la règle de similitude de la section 3. Les **12 emplacements de figures** entourent les quatre côtés : trois par côté, les figures vaincues continuant d'occuper leur emplacement.
4. Garder les as et jokers révélés face visible dans une réserve d'**actions spéciales**.
5. Après cette mise en place, il est **facultativement permis de remplacer une carte de la grille**, en plaçant cette carte sous la pioche et en piochant pour remplacer l'emplacement, selon les règles normales de traitement des figures/as/jokers (détails du cycle à confirmer si besoin).

### Sens des valeurs et cartes

| Carte | Rôle en version 2 |
| --- | --- |
| 2 à 10 | Cartes numériques empilées sur la grille ; valeur indiquée |
| J | Figure adverse, résistance initiale 11 |
| Q | Figure adverse, résistance initiale 12 |
| K | Figure adverse, résistance initiale 13 |
| As (4) | Action spéciale **Extraction** (retirer une pile de la grille pour la placer sous la pioche) |
| Joker (2) | Action spéciale **Réaffectation** (déplacer une carte supérieure de pile) |

## 3. Placement des figures

Lorsqu'une figure est révélée, elle est placée **à l'extérieur de la grille** dans un emplacement encore disponible adjacent à la carte numérique dont elle est « la plus semblable ». La comparaison utilise seulement la **carte visible supérieure** de chaque pile.

Priorité d'attraction :
1. Carte **de même enseigne** avec la **valeur la plus élevée** ;
2. à défaut, carte **de même couleur** avec la **valeur la plus élevée** ;
3. à défaut, carte **de valeur la plus élevée** quelle que soit l'enseigne.

En cas de choix à égalité ou si la carte la plus semblable est dans un coin (deux côtés possibles), le joueur choisit parmi les emplacements autorisés.

Une figure vaincue est **retournée face cachée mais conserve son emplacement** ; celui-ci ne redevient pas libre.

**Question G-01 :** la source primaire ne définit pas explicitement le cas où tous les emplacements adjacents à la carte la plus semblable sont déjà occupés. Une source secondaire suggère d'essayer la carte suivante, mais cette interprétation ne doit pas devenir une règle CardForge sans validation.

## 4. Pioche et placement d'une carte numérique

À chaque tirage :
- **Figure :** l'installer selon la règle de placement.
- **Carte 2 à 10 :** la placer sur l'une des neuf piles de grille dont la **carte supérieure a une valeur inférieure ou égale** à celle tirée ; l'enseigne ne restreint pas ce placement.
- **As ou joker :** l'ajouter face visible à la réserve d'actions spéciales ; ne pas le placer comme carte numérique.

En l'absence d'emplacement compatible pour une carte numérique, consulter la section 7 sur l'armure et l'emploi des actions spéciales.

La règle de placement sur **un emplacement vide créé par Extraction** n'est pas expliquée complètement dans la Version 2 ; l'ancienne version utilisait une valeur de zéro. L'appliquer automatiquement à la v2 serait une **hypothèse**, pas une règle vérifiée (G-02).

## 5. Déclenchement des attaques

Lorsqu'une carte numérique est **posée** à l'extrémité d'une ligne ou colonne dirigée vers une figure adverse vivante située à l'autre extrémité, les **deux cartes supérieures de grille situées entre les extrémités** sont les cartes d'attaque.

- La **nouvelle carte posée ne compte pas** dans la puissance d'attaque.
- La somme des cartes d'attaque qui satisfont à la restriction de la figure doit atteindre ou dépasser la **résistance actuelle**, armure comprise.
- Si la condition n'est pas remplie, la figure survit et la carte jouée reste en place.
- Si elle est remplie, la figure est retournée face cachée et **ne quitte pas** sa position.

| Figure | Résistance de base | Restrictions sur les deux cartes d'attaque |
| --- | ---: | --- |
| Valet | 11 | Toutes les enseignes comptent |
| Dame | 12 | Seules les cartes de **même couleur** que la dame contribuent |
| Roi | 13 | Seules les cartes de **même enseigne** que le roi contribuent |

**Point de lecture important :** les cartes de couleur/enseigne non compatible **ne comptent pas** dans la puissance de l'attaque sur une dame/un roi ; cela ne transforme pas nécessairement tout le placement en action illégale.

Une carte posée dans un **coin** peut déclencher deux attaques (ligne et colonne). Une carte posée au **centre** n'a pas de figure à deux cartes d'écart et ne déclenche pas directement de tir.

**Question G-03 :** si une carte posée dans un coin remplit les conditions contre deux figures simultanément, l'ordre et la simultanéité exacts des résolutions devront être définis sans inventer de capacité.

## 6. Actions spéciales — As et jokers

**As / Extraction :** à tout moment, y compris après un tirage mais avant de placer la carte tirée, consommer un as non utilisé pour prendre **toute une pile** de grille et la placer **face cachée au bas de la pioche**. L'emplacement devient vide. L'as est retourné face cachée comme marqueur utilisé.

**Joker / Réaffectation :** consommer un joker non utilisé pour déplacer **uniquement la carte supérieure** d'une pile vers une autre position dans laquelle son placement est légal. Cette pose peut déclencher une attaque normale. Le joker est retourné face cachée.

Le nombre maximal d'actions spéciales est **six** : quatre as et deux jokers ; une action dépensée ne revient pas à la réserve.

**Question G-04 :** lorsque l'Extraction dépose une pile au-dessous de la pioche, il faudra préserver exactement le comportement d'ordre et d'orientation des cartes selon le jeu original, notamment avec les piles de plusieurs cartes ; l'invariant de sauvegarde CardForge impose de sérialiser cet ordre sans mélanger.

## 7. Carte impossible à poser et armure

Si une carte numérique ne peut être placée, et qu'aucune action spéciale ne permet de résoudre le problème, elle devient une **armure** attribuée à une figure encore vivante selon la règle de « ressemblance inverse » :
1. Figure de **même enseigne** de valeur **la plus basse** ;
2. sinon figure de **même couleur** de valeur **la plus basse** ;
3. sinon figure de **valeur la plus basse**.

La valeur de la carte est ajoutée à la résistance actuelle de la figure. Plusieurs armures s'additionnent.

**Défaite selon la Version 2 :** une figure atteint une résistance considérée comme impossible à vaincre, soit **20 ou plus pour un valet ou une dame, 19 ou plus pour un roi**. Ce seuil est directement formulé dans la publication de l'auteur.

**G-05 :** préciser le comportement si aucun adversaire vivant n'est présent lorsqu'une carte ne peut être posée, et les modalités d'utilisation prioritaire des actions spéciales ; ne pas offrir une action illégale au nom de la facilité d'interface.

## 8. Cas sans figure vivante, victoire, défaite et score

- **Toutes les figures apparues sont vaincues, mais moins de douze en tout :** faire défiler des cartes jusqu'à trouver une nouvelle figure, garder les cartes traversées temporairement, puis les replacer au-dessous de la pioche selon l'ordre applicable.
- **Victoire :** les **12 figures ont été vaincues** et occupent chacune leur emplacement autour de la grille.
- **Défaite :** condition d'armure impossible (§7) ou absence de cartes/possibilités d'actions spéciales empêchant d'éliminer les dernières figures ; préciser les situations d'impasse et le moment exact d'évaluation dans les tests.
- **Score officiel de victoire :** nombre d'actions spéciales (as/jokers) **non dépensées**. Maximum théorique = **6**.
- Ce score officiel est distinct des compteurs CardForge de victoires, défaites et abandons. Ne pas inventer de score officiel pour une défaite.

## 9. Variantes historiques à ne pas introduire par erreur

**Version 1 ancienne** (présente plus bas dans l'article de l'auteur) : centre laissé vide à la mise en place, As et joker utilisés pour « reset », pile de honte comme score/recours. **Non retenue dans le présent dossier**.

**Version 2 révisée** : centre rempli (3 × 3), actions spéciales stockées, armure, score en actions spéciales non utilisées, remplacement facultatif d'une carte initiale. **Version retenue pour CardForge** (G-00 validé).

Les versions numériques réalisées par des tiers ne prévalent pas sur la publication originale de Tom Francis.

## 10. Points de conformité à automatiser

| ID | Scénario contrôlable |
| --- | --- |
| GC-01 | Mise en place : neuf 2–10 visibles, figures mises à part, as et jokers en actions spéciales |
| GC-02 | Placement de figure : même enseigne > même couleur > meilleure valeur, égalités et coins |
| GC-03 | Une figure vaincue occupe encore son emplacement |
| GC-04 | Carte 2–10 sur pile de valeur supérieure : action invalide ; même valeur : valide |
| GC-05 | Carte posée non comprise dans la somme des deux cartes d'attaque |
| GC-06 | Valet 11 ; dame 12 limitée à sa couleur ; roi 13 limité à son enseigne |
| GC-07 | Sum ≥ résistance : victoire locale ; sum < résistance : figure toujours vivante |
| GC-08 | Coin : évaluer les deux directions ; centre : aucun tir direct |
| GC-09 | Extraction consomme un As, retire une pile entière et alimente le bas de pioche |
| GC-10 | Réaffectation consomme un joker et peut déclencher un tir |
| GC-11 | Armure selon figure la moins élevée compatible, cumuls et seuils de défaite |
| GC-12 | Pas de figure vivante : cycle des cartes jusqu'à prochaine figure |
| GC-13 | Victoire après les douze figures, score = actions spéciales restantes (0 à 6) |
| GC-14 | Pioche épuisée : évaluer les actions restantes avant défaite |
| GC-15 | Sauvegarde/reprise exacte, actions déterministes et résultat unique |
| GC-16 | Habillage de guerre spatiale totalement cosmétique |

Les scénarios portent sur **des exigences de tests**, pas sur des tests exécutés ni sur une validation mécanique du moteur.

## 11. Droit d'adaptation, nom et crédits

**Point favorable important :** dans la publication primaire, Tom Francis **invite explicitement à créer ou publier des jeux dérivés**, et recommande :
- d'ajouter un crédit à **Gridcannon par Tom Francis**, idéalement avec un lien vers sa publication ;
- de **ne pas appeler simplement l'œuvre dérivée « Gridcannon »**, bien que le mot puisse figurer dans un titre plus long.

Cette déclaration publique est une autorisation exprimée en langage naturel ; elle ne constitue pas un contrat exhaustif couvrant toutes les marques, illustrations tierces et boutiques. La gratuité de CardForge est cohérente avec cette invitation, mais il faut conserver la source et vérifier l'identité publique finale.

**GC-17 / G-06 — Décision validée le 22 novembre 2026 :** le titre public **de travail** est « **Bastion Stellaire** », avec crédit explicite à **Gridcannon** et **Tom Francis**. Le porteur conserve expressément **la possibilité de changer le nom ultérieurement** sans modifier l'identifiant interne du jeu ni ses sauvegardes et statistiques. Voir §31 pour la formule, les emplacements du crédit et les vérifications à faire avant diffusion.

Les illustrations originales de CardForge ne réutiliseront pas celles d'applications tierces.

## 12. Questions bloquantes ou à valider

| Code | Sujet | Décision attendue |
| --- | --- | --- |
| G-00 | Version du jeu | **VALIDÉ le 22 novembre 2026 : Version 2** pour le MVP, sans mécanismes de Version 1 |
| G-01 | Placement figure quand meilleure position occupée | Clarification par source primaire/auteur ou décision explicite documentée |
| G-02 | Emplacement de pile vide après Extraction | Comportement exact dans Version 2 |
| G-03 | Double attaque depuis un coin | Ordre de résolution, notamment impacts terminaux |
| G-04 | Ordre des cartes remises sous pioche | Rapprochement avec règle / démonstration originale |
| G-05 | Armure, cas sans figure vivante et impasse | Clarification de séquencement |
| G-06 | Nom de l'adaptation CardForge | Titre distinct et crédit attribuant Tom Francis |

**Statut de l'étude après décision :** Version 2 validée par le porteur ; mécaniques générales documentées à partir de la source primaire précédemment étudiée. **Les cas limites G-01 à G-05 et le nom/crédit G-06 restent à préciser** avant de considérer le moteur et la publication conformes. Aucune nouvelle consultation Web, exécution de code ou validation de moteur lors de cette mise à jour. Aucun code ni test n'a été exécuté ici.

## 13. Recherche complémentaire du 22 novembre 2026 — contrôle direct de la source Version 2

**Source primaire relue :** [Tom Francis, article du 20 août 2019, section « Version 2 »](https://www.pentadact.com/2019-08-20-gridcannon-a-single-player-game-with-regular-playing-cards/). **Source secondaire de recoupement :** [Howto.cards, règles V2](https://howto.cards/en/gridcannon/).

### Points explicitement confirmés par Tom Francis

1. Les as/jokers sont des actions spéciales **disponibles à tout moment**, y compris une fois une nouvelle carte piochée et avant son placement.
2. Le joker déplace seulement la **carte supérieure** vers une position légale, ce qui peut déclencher un tir normal.
3. L'as retire une **pile entière** de grille et la remet **face cachée sous la pioche**, tout en libérant sa position.
4. Une carte impossible à poser devient une **armure** quand les actions spéciales ne peuvent aider. Des armures multiples s'additionnent ; **défaite à 20+ J/Q ou 19+ K**.
5. Sans figure vivante en jeu mais avec moins de douze figures vaincues, les cartes traversées sont placées temporairement face visible et réinjectées sous la pioche quand une figure arrive.
6. Si la pioche s'épuise, les actions spéciales restantes peuvent encore permettre de continuer ; la défaite s'applique lorsque les cartes et recours utilisables sont épuisés sans victoire.
7. Le tir depuis un coin peut affecter la ligne **et** la colonne (source secondaire explicite ; conséquence géométrique de la règle primaire). Le traitement d'une résolution simultanée très particulière demeure ouvert.

### Questions réévaluées

| ID | Résultat | Statut après recherche |
| --- | --- | --- |
| G-00 | Version 2 exclusivement | **VALIDÉ, fermé** |
| G-01 | Similarité de figure et égalités : confirmées ; **cas où tous les emplacements adjacents sont occupés : non défini par Tom Francis**. Howto.cards propose la carte suivante la plus semblable, à titre d'interprétation | **Ouvert ; ne pas adopter l'interprétation secondaire sans décision** |
| G-02 | L'as rend un emplacement **vide**, confirmé ; sa valeur au placement suivant **non définie en V2**. Howto.cards suggère 0 par analogie avec V1 | **Ouvert ; ne pas importer la V1 automatiquement** |
| G-03 | **Deux tirs potentiels depuis un coin sont attestés** ; ordre terminal et interactions simultanées non précisées | **Partiellement confirmé** |
| G-04 | La pile extraite est déposée **face cachée au bas de la pioche** ; ordre interne de la pile et orientation des cartes non explicités | **Partiellement confirmé** |
| G-05 | Conditions d'armure, seuils et possibilité d'utiliser les actions spéciales après fin de pioche confirmées ; cas limites d'absence de cible / recours utile à préciser | **Partiellement confirmé** |
| G-06 | Invitation publique à créer des adaptations, crédit à Tom Francis recommandé et nom public différent de « Gridcannon » seul recommandé | **GC-17 validé : Bastion Stellaire (titre provisoire et révisable), attribution Gridcannon / Tom Francis ; vérification du titre avant diffusion** |

### Suites obligatoires

Ne pas fermer G-01, G-02, G-03 (ordre), G-04 (ordre interne) ou G-05 (impasses atypiques) par simple intuition. Préparer pour ces cas une demande concise de clarification à Tom Francis si les règles publiées n'en parlent pas. Aucun contact auteur n'a été envoyé. Toute réponse ou validation produit ultérieure doit être rattachée à son identifiant.

## 14. Approfondissement : défauts de spécification propres à Version 2

Dossier source détaillé : [recherche approfondie Mary](./recherche-approfondie-2026-11-22.md). Source normative : [article Version 2 de Tom Francis](https://www.pentadact.com/2019-08-20-gridcannon-a-single-player-game-with-regular-playing-cards/), non sa démonstration vidéo antérieure aux révisions.

- **G-01a — NOUVEAU, bloquant :** la grille 3 × 3 inclut le centre ; la règle de la carte « la plus semblable » ne dit pas si l'on doit **exclure la case centrale** (qui ne possède pas de place extérieure adjacente). Le placement n'est pas défini si cette carte centrale serait la meilleure candidate.
- **G-01b — bloquant :** si les emplacements périphériques adjacents à la meilleure carte sont déjà occupés, l'auteur ne donne pas de repli explicite. « Chercher la suivante » est une suggestion secondaire, pas une règle officielle.
- **G-07 — NOUVEAU :** « aucune action spéciale à utiliser » dans la source primaire vs « aucune action spéciale qui aide » en source secondaire : que faire si un As/Joker reste disponible mais ne permet pas de rendre la carte posable ?
- **G-08 — NOUVEAU, faible priorité :** préciser la convention de score si la pioche est d'abord épuisée, puis réapprovisionnée par une Extraction, et qu'une victoire suit.
- **G-03 :** l'existence possible d'un **double tir depuis un coin** est étayée ; l'ordre de résolution en situation limite demeure à formaliser.
- **G-04/G-05 :** pile complète extraite sous la pioche et actions spéciales après épuisement de pioche confirmées ; ordre de pile et impasses sans solution restent ouverts.
- **G-06 :** l'auteur **recommande**, sans imposer comme condition juridique formelle dans le billet, un crédit « Based on Gridcannon by Tom Francis » et un titre d'adaptation distinct de « Gridcannon » seul.

**État :** référence Version 2 définitivement validée ; pas de changement de mécanique décidé par CardForge pendant cette recherche. Questions G-01a/b, G-02, G-03, G-04, G-05, G-07, G-08 encore ouvertes.


## 15. Décision fonctionnelle Gridcannon V2 — GC-01 / G-01a : exclure le centre de l'attraction des figures

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Pour déterminer la carte de grille qui attire une nouvelle figure (J, Q ou K), le moteur considère **uniquement les huit emplacements périphériques** de la grille 3 × 3. La **case centrale ne participe jamais à la sélection de la carte attractive**, même si elle porte la meilleure correspondance d'enseigne, couleur ou valeur. Cette restriction s'applique à la mise en place et à toutes les apparitions ultérieures de figures.

**Contrat métier CardForge :**
- Les candidats éligibles sont les huit cartes supérieures des piles périphériques, selon la géométrie du plateau ; la carte visible au centre est exclue **avant** d'appliquer les priorités de similitude existantes (même enseigne puis valeur la plus élevée ; sinon même couleur puis valeur la plus élevée ; sinon valeur la plus élevée).
- La figure est placée à l'extérieur de la grille dans un emplacement **adjacent à la carte périphérique sélectionnée**, suivant les règles de choix existantes en cas de coin ou d'égalité. La décision ne permet pas de choisir arbitrairement un côté à partir de la carte centrale.
- La carte du centre **reste pleinement utilisable** pour recevoir des cartes numériques, participer au calcul des tirs et subir les actions spéciales légales ; seule son influence sur le **choix de la carte attractive** est supprimée.
- Après Extraction d'une pile périphérique, les règles de comparabilité des cases vides demeurent **à trancher en G-02** ; ne pas inventer une valeur ou une attraction d'emplacement vide sous couvert de GC-01.
- **Non tranché ici : G-01b / GC-02** — le choix d'une nouvelle carte attractive si les cases extérieures adjacentes à la meilleure carte périphérique sont déjà occupées, y compris par des figures vaincues restées en place. Ne jamais réutiliser automatiquement une case extérieure occupée.
- Sauvegarde et reprise doivent restaurer mêmes cartes visibles/positions et mener à la même liste de candidats et aux mêmes possibilités de choix.

**Exemple :** un roi de cœur apparaît ; le centre porte 10 cœur, une position périphérique porte 9 cœur et aucune autre périphérique de cœur n'est de valeur supérieure. **Le 9 cœur périphérique attire le roi** ; le 10 cœur central est ignoré pour cette opération.

**Statut : GC-01 / G-01a CLOS pour CardForge.** L'exclusion du centre est un arbitrage fonctionnel du porteur fondé sur la géométrie d'adjacence, **pas** une règle explicitement précisée dans la source primaire Version 2 de Tom Francis. Aucun test du moteur n'a été exécuté lors de cet arbitrage. La Version 2 demeure l'unique version ciblée.

**Prochain arbitrage GC-02 / G-01b :** comment traiter une figure dont la meilleure carte périphérique est entourée d'emplacements extérieurs déjà occupés ?


### 15.1. Cas de test de conformité — GC-01 / G-01a

Ces cas sont des **spécifications de tests à implémenter**, pas des tests exécutés.

| ID | Précondition / action | Résultat attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T01 | Roi cœur à placer, 10 cœur au centre et 9 cœur en périphérie, pas de meilleur cœur périphérique | La figure est attirée par **9 cœur périphérique** ; 10 cœur central ignoré | Spécifié, non exécuté |
| GC-V2-T02 | Meilleure correspondance absolue au centre, correspondances périphériques d'une autre enseigne mais même couleur | Le calcul ignore le centre et applique la priorité de couleur aux seuls candidats périphériques | Spécifié, non exécuté |
| GC-V2-T03 | Aucune périphérique de la même enseigne/couleur ; carte centrale de même enseigne | Le calcul retient la **plus forte valeur périphérique**, sans utiliser le centre | Spécifié, non exécuté |
| GC-V2-T04 | Deux périphériques de même enseigne et valeur maximale à égalité | Choix du joueur limité aux emplacements extérieurs adjacents admissibles selon l'égalité existante | Spécifié, non exécuté |
| GC-V2-T05 | Carte périphérique sélectionnée dans un coin, deux emplacements extérieurs adjacents libres | Choix parmi ces deux côtés, jamais une case sélectionnée à partir du centre | Spécifié, non exécuté |
| GC-V2-T06 | Carte centrale remplacée par une carte plus forte/de meilleure enseigne avant apparition d'une figure | Aucun changement de candidat attractif si les huit périphériques restent identiques | Spécifié, non exécuté |
| GC-V2-T07 | Sauvegarde avant apparition d'une figure ; restauration avec centre et périphérie identiques | Même classement des huit candidats périphériques ; aucune attraction du centre | Spécifié, non exécuté |

**Limite explicite :** si tous les emplacements extérieurs adjacents à la meilleure carte périphérique sont occupés, le résultat reste **en attente de GC-02 / G-01b**. Si une pile périphérique est vide après Extraction, son traitement reste **G-02**. Ne pas considérer ces cas comme décidés par GC-01.


## 16. Décision fonctionnelle Gridcannon V2 — GC-02 / G-01b : repli vers la meilleure carte périphérique disponible

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Lorsqu'une figure doit apparaître à l'extérieur de la grille et que **tous** les emplacements extérieurs adjacents à sa carte périphérique la plus semblable sont déjà occupés, le moteur **cherche la meilleure candidate périphérique suivante disposant d'au moins un emplacement extérieur libre**. Une figure déjà vaincue, retournée face cachée, **continue d'occuper sa place** : cet emplacement n'est jamais libéré.

**Contrat déterministe pour CardForge :**
1. Considérer exclusivement les **huit positions périphériques** de la grille, conformément à **GC-01 / G-01a** ; ne jamais prendre le centre comme carte attractive.
2. Classer les cartes supérieures de ces positions selon la priorité de similitude de la Version 2 : **même enseigne**, puis **même couleur**, puis **toute autre enseigne** ; à l'intérieur de chaque catégorie, **valeur la plus élevée d'abord**.
3. Pour chaque rang de similitude, déterminer les cases extérieures **géométriquement adjacentes et libres**. Une carte de coin peut offrir deux côtés ; une case déjà occupée par une figure **vivante ou vaincue** est indisponible.
4. Retenir le **meilleur rang ayant au moins une possibilité libre**. En cas d'égalité entre plusieurs cartes périphériques de ce rang, ou entre deux places admissibles autour d'un coin, **laisser le joueur choisir parmi ces possibilités légales**. Ne pas retenir une carte moins semblable tant qu'une possibilité existe au meilleur rang disponible.
5. Placer la figure **dans une seule case extérieure libre** du choix admissible, puis conserver sa position pour toute la partie, y compris après sa défaite.
6. **Ne pas déclarer automatiquement une défaite** parce que le premier candidat est bloqué ; **ne jamais permettre un placement arbitraire** dans une case sans adjacency au candidat retenu.
7. Ce choix vaut pendant la **mise en place** et lors de **chaque apparition ultérieure** d'une figure. Après sauvegarde/reprise, la même grille, le même tableau d'occupation et la même figure produisent le même ensemble d'options légales.
8. **Hors portée du présent arbitrage :** le traitement des positions périphériques devenues **vides à la suite d'une Extraction** reste ouvert en **G-02 / GC-03**. Si aucun candidat ne possède de place admissible, le moteur ne doit **ni inventer une défaite ni déplacer une figure** sans nouvelle décision de règle ; ce cas d'impasse est à documenter dans l'étude générale **G-05**.

**Exemple :** roi de cœur à placer ; 9 cœur périphérique est la meilleure correspondance mais sa place extérieure est occupée ; 8 cœur périphérique possède une place libre. Le roi est dirigé vers le **8 cœur**, et non vers la place déjà occupée du 9 cœur ni vers une place choisie sans critère.

**Statut : GC-02 / G-01b CLOS pour CardForge.** Le repli sur la meilleure autre carte disponible est un arbitrage fonctionnel approuvé ; il est compatible avec une interprétation secondaire identifiée, mais ne constitue **pas** une précision explicitement vérifiée dans les règles primaires de Tom Francis. Aucun test moteur n'a été exécuté.

### 16.1. Scénarios de conformité — GC-02 / G-01b

Ces cas sont **spécifiés, non exécutés**.

| Test | Situation | Résultat attendu | Statut |
| --- | --- | --- | --- |
| GC-V2-T08 | Roi cœur ; 9 cœur périphérique meilleur candidat, place adjacente occupée ; 8 cœur avec place libre | Sélectionner **8 cœur** et sa place libre | Spécifié, non exécuté |
| GC-V2-T09 | Meilleure carte périphérique située dans un coin : l'un de ses deux emplacements libres, l'autre occupé | Retenir le coin, proposer **seulement la place libre** | Spécifié, non exécuté |
| GC-V2-T10 | Une carte de coin a ses deux emplacements extérieurs occupés | Ignorer cette candidate et chercher la suivante | Spécifié, non exécuté |
| GC-V2-T11 | L'emplacement adjacent à la meilleure carte est occupé par une figure **vaincue face cachée** | Emplacement indisponible ; repli identique à une figure vivante | Spécifié, non exécuté |
| GC-V2-T12 | Toutes les cartes de même enseigne ont leurs cases adjacentes occupées ; une carte de même couleur dispose d'une place | Choisir la meilleure candidate **de même couleur** avec place libre avant les autres couleurs | Spécifié, non exécuté |
| GC-V2-T13 | Toutes les cartes de même enseigne et couleur sont bloquées ; d'autres cartes ont des places | Choisir la plus haute valeur restante avec place libre | Spécifié, non exécuté |
| GC-V2-T14 | Deux candidates à égalité dans le meilleur rang disponible disposent de places différentes | Offrir au joueur le choix parmi les emplacements admissibles des deux candidates | Spécifié, non exécuté |
| GC-V2-T15 | Une meilleure carte périphérique dispose d'une place ; une moins semblable dispose de plusieurs places | Ne **pas** privilégier le nombre de places libres : meilleure candidate choisie | Spécifié, non exécuté |
| GC-V2-T16 | Sauvegarde/reprise avant placement avec plusieurs emplacements occupés et repli nécessaire | Même classement, mêmes occupés et mêmes choix disponibles après reprise | Spécifié, non exécuté |
| GC-V2-T17 | Meilleur candidat bloqué, mais au moins un repli admissible | Aucune défaite déclenchée par ce seul blocage ; placement légal possible | Spécifié, non exécuté |

**Prochaine décision GC-03 / G-02 :** règle de placement d'une carte numérique sur une **case de grille vide après Extraction** : la case vide vaut-elle 0 pour le placement, faut-il la remplir prioritairement, ou est-elle inaccessible par pose normale ? Ce point demeure ouvert.


## 17. Décision fonctionnelle Gridcannon V2 — GC-03 / G-02 : case de grille vide après Extraction

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Lorsqu'une Extraction (As) retire une pile entière, sa case devient **vide**. Pour **la seule validation de placement d'une carte numérique de 2 à 10**, la case vide se comporte comme si sa valeur supérieure était **0** : **toute carte numérique 2 à 10 peut y être posée**, sans obligation d'utiliser cette case en priorité.

**Contrat métier pour CardForge :**
- Après consommation d'un As selon la mécanique Version 2, la pile complète est retirée de son emplacement et réinsérée au-dessous de la pioche selon les règles de l'Extraction ; le **détail de son ordre interne** reste ouvert sous **G-04**. La case n'a **aucune carte visible**.
- En vérification des destinations d'une nouvelle carte numérique `C` (2 ≤ valeur(C) ≤ 10), une case occupée est admissible si `valeur(C) ≥ valeur(carte supérieure)`, tandis qu'une **case vide est toujours admissible**, de façon équivalente à `valeur(C) ≥ 0`.
- Le joueur peut **choisir n'importe quelle destination légale**, vide ou déjà occupée ; une case vide n'impose ni priorité ni obligation de remplissage au prochain tirage.
- Une pose réussie sur la case vide crée une **nouvelle pile** avec la carte réellement posée comme **première et seule carte**, puis cette carte devient la carte supérieure de référence pour les poses suivantes. Aucune carte artificielle de valeur 0 n'est créée, stockée, mélangée ou comptée.
- **Une case vide n'est pas une carte d'attaque :** elle ne fournit aucune puissance de tir et ne peut à elle seule servir de carte visible dans une vérification de similitude de figure. La valeur technique « 0 » n'est utilisée **que pour autoriser une pose** et ne modifie pas les autres calculs ; les éventuels tirs d'une nouvelle carte se résolvent avec les **cartes réellement visibles** selon le contrat du tir.
- Plusieurs cases vides sont possibles si plusieurs Extractions légales ont lieu ; elles sont toutes des destinations numériques admissibles selon cette règle.
- Le moteur persiste la **pile réellement vide** (aucune carte) et non une carte fantôme 0 ; sauvegarde/reprise conserve le nombre de cartes, la pioche, les actions spéciales consommées et les emplacements.
- Cette décision ne change pas les règles **GC-01 / GC-02** d'attraction des figures ; le centre reste exclu des candidates et les cases vides ne possèdent pas de carte visible attirante.
- Les cas impossibles ou atypiques sur l'usage d'actions spéciales et la fin de pioche demeurent ouverts sous **G-05/G-07**.

**Exemple :** après extraction de la pile centrale, le joueur pioche 4 cœur. Il peut placer ce 4 sur la case centrale vide, **ou** sur une autre pile dont la carte supérieure vaut au plus 4. Après pose au centre, la nouvelle pile centrale comporte **exactement le 4 cœur**, pas un « 0 » sous-jacent.

**Statut : GC-03 / G-02 CLOS pour CardForge.** La valeur conventionnelle 0 pour une case vide est un **arbitrage produit** compatible avec une analogie de la version historique et une source secondaire ; elle **n'est pas déclarée officiellement confirmée pour la Version 2 par Tom Francis**. Aucun test moteur n'a été exécuté.

### 17.1. Scénarios de conformité — GC-03 / G-02

| Test | Précondition / action | Attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T18 | Extraction d'une pile centrale complète par As | Centre réellement vide, As consommé, cartes extraites placées sous la pioche sans apparition d'une carte 0 | Spécifié, non exécuté |
| GC-V2-T19 | Case centrale vide, carte 2 piochée | Placement possible sur la case vide, même valeur minimale 2 | Spécifié, non exécuté |
| GC-V2-T20 | Case périphérique vide, carte 10 piochée | Placement possible ; nouvelle pile constituée du seul 10 | Spécifié, non exécuté |
| GC-V2-T21 | Case vide et autre pile de valeur supérieure autorisant la carte piochée | Le joueur choisit librement l'une des destinations légales ; la case vide n'est pas prioritaire | Spécifié, non exécuté |
| GC-V2-T22 | Case vide et pile non vide dont le sommet est plus fort que la carte piochée | Case vide autorisée ; pile trop forte interdite par comparaison normale | Spécifié, non exécuté |
| GC-V2-T23 | Après pose du 4 sur la case vide, tentative d'ajouter un 3 puis un 5 | 3 refusé ; 5 accepté, selon le sommet réel 4 | Spécifié, non exécuté |
| GC-V2-T24 | Trois cases vides après plusieurs Extractions, carte 6 piochée | Les trois cases vides sont des destinations admissibles, sans obligation de prioriser l'une d'elles | Spécifié, non exécuté |
| GC-V2-T25 | Case vide située sur le trajet d'un tir | Aucune puissance 0 fictive ajoutée, uniquement les cartes réellement visibles peuvent contribuer | Spécifié, non exécuté |
| GC-V2-T26 | Case périphérique vide au moment de chercher une carte attirant une figure | Aucune carte 0 fictive prise en compte dans le classement de similitude GC-01/02 | Spécifié, non exécuté |
| GC-V2-T27 | Sauvegarde/reprise après Extraction puis après réoccupation de la case | Même case vide ou pile réellement recréée ; aucune duplication de carte ni de pioche | Spécifié, non exécuté |

**Prochain arbitrage GC-04 / G-03 :** lorsqu'une carte est posée dans un coin et permet deux tirs (horizontal et vertical), faut-il résoudre les deux tirs à partir d'un même état, les traiter séquentiellement, ou demander au joueur de choisir leur ordre ? La possibilité d'un double tir est documentée ; l'ordre précis reste à arbitrer.


## 18. Décision fonctionnelle Gridcannon V2 — GC-04 / G-03 : double tir depuis une case de coin

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Une pose légale de carte numérique **dans un coin** peut déclencher un tir **horizontal** et un tir **vertical**. Le moteur **évalue les deux directions indépendamment à partir du même instantané du plateau juste après la pose**, puis **applique ensemble** les résultats obtenus. **Aucune direction prioritaire et aucun choix d'ordre** n'est introduit.

**Comportement exécutable pour CardForge :**
1. Valider et réaliser la pose d'une **seule carte physique** au coin (ou la pose légale résultant d'une **Réaffectation** par joker, si elle déclenche normalement un tir). La nouvelle carte est présente dans l'instantané, mais **ne contribue pas** à la somme de puissance des tirs, conformément aux règles existantes.
2. Calculer **pour chaque axe** (ligne et colonne) la cible vivante admissible à l'extrémité opposée, les **deux cartes intermédiaires réellement visibles**, la résistance actuelle (armure incluse) et les restrictions propres à la cible (valet : toute enseigne ; dame : même couleur ; roi : même enseigne). Les cartes intermédiaires d'une mauvaise couleur/enseigne contribuent pour zéro. Une case intermédiaire vide n'est **pas** une carte fictive de valeur zéro (GC-03).
3. Les deux calculs lisent **le même instantané immuable** après la pose : aucune figure éliminée dans la première direction ne peut modifier le calcul de la seconde. Une figure absente ou déjà vaincue ne constitue pas une cible vivante.
4. Former l'**ensemble des cibles distinctes effectivement vaincues** : zéro, une ou deux figures. Retourner les cibles gagnées **ensemble**, chacune une seule fois ; leur place reste occupée après élimination.
5. Appliquer **une seule transition de jeu** pour la pose et les tirs dérivés : aucun tir ou résultat n'est « perdu » à cause du traitement prioritaire d'un autre axe. Si la résolution fait passer de 10 à **12 figures vaincues**, déclarer **une victoire unique** seulement après avoir comptabilisé les deux réussites et figer le score officiel (actions spéciales non utilisées). Si la victoire est obtenue par le seul premier ou seul second tir, aucun tir légal réussi ne doit être omis dans le résultat.
6. Aucun écran ne demande au joueur de choisir l'ordre ; les éventuelles animations peuvent être simultanées ou séquencées pour la lisibilité, **sans changer le résultat de la résolution atomique**.
7. Sauvegarde/reprise : préserver la pose, les deux évaluations et l'ensemble des cibles vaincues comme **un événement déterministe**, sans pouvoir rejouer une direction après interruption ou double action.
8. L'évaluation d'autres effets **non documentés** (par exemple hypothétiques interactions nouvelles avec l'armure) n'est pas ajoutée ; GC-04 ne change ni les seuils de défaite ni les restrictions de couleur/enseigne.

**Exemple :** une pose au coin satisfait indépendamment les seuils et restrictions contre une dame à l'extrémité de la ligne et un valet à l'extrémité de la colonne. **Les deux sont vaincus** à l'issue de la même action, quelle que soit la direction qu'une animation présente en premier.

**Statut : GC-04 / G-03 CLOS pour CardForge.** La possibilité de deux tirs est étayée par les règles et leur géométrie ; **leur résolution simultanée sur un instantané commun est l'arbitrage CardForge approuvé**, non une précision explicite confirmée dans la Version 2 publiée par Tom Francis. Aucun test moteur n'a été exécuté.

### 18.1. Scénarios de conformité — GC-04 / G-03

| Test | Précondition / action | Attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T28 | Pose légale dans un coin ; une figure vivante attaquable dans chaque axe ; deux tirs suffisants | Deux figures vaincues dans la **même résolution** | Spécifié, non exécuté |
| GC-V2-T29 | Pose de coin, horizontal suffisant et vertical insuffisant | Seule la figure horizontale est vaincue ; figure verticale conservée | Spécifié, non exécuté |
| GC-V2-T30 | Pose de coin, vertical suffisant et horizontal insuffisant | Seule la figure verticale est vaincue, sans priorité horizontale | Spécifié, non exécuté |
| GC-V2-T31 | Pose de coin, deux tirs insuffisants | Aucune figure vaincue ; carte posée reste en place | Spécifié, non exécuté |
| GC-V2-T32 | Pose de coin, cible horizontale déjà vaincue ou absente, verticale vivante et attaquable | Seule la cible verticale est évaluée comme vivante | Spécifié, non exécuté |
| GC-V2-T33 | Dame et roi aux deux extrémités ; couleurs/enseignes intermédiaires différentes | Contrôles **indépendants** avec restriction de chaque cible, armure incluse | Spécifié, non exécuté |
| GC-V2-T34 | Pose de coin avec une case intermédiaire vidée par Extraction | Aucune carte fictive zéro ; seuls les sommets réellement présents contribuent | Spécifié, non exécuté |
| GC-V2-T35 | 10 figures déjà vaincues, double tir suffisant contre les deux dernières | Passage à 12 figures vaincues et **une seule victoire**, aucun tir omis | Spécifié, non exécuté |
| GC-V2-T36 | 11 figures déjà vaincues, une dernière figure vivante vaincue par un axe | Victoire immédiate avec résultat unique après résolution ; autre axe sans cible vivante | Spécifié, non exécuté |
| GC-V2-T37 | Réaffectation légale de carte supérieure vers un coin ; deux tirs valides | Même règle de double évaluation ; joker consommé une seule fois | Spécifié, non exécuté |
| GC-V2-T38 | Sauvegarder/reprendre ou répéter une action après le double tir | Deux évaluations et résultats conservés sans double élimination ni double statistique | Spécifié, non exécuté |

**Prochain arbitrage GC-05 / G-04 :** ordre exact des cartes **d'une pile complète** placée **face cachée sous la pioche** à la suite d'une Extraction. La règle de dépôt sous pioche est documentée, mais l'ordre interne et l'orientation lors de la réinsertion ne sont pas explicités dans la source primaire accessible.


## 19. Décision fonctionnelle Gridcannon V2 — GC-05 / G-04 : ordre de la pile extraite sous la pioche

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Lorsqu'un As déclenche une Extraction, le moteur retire **toute la pile d'une case de la grille** et replace le groupe **face cachée sous la pioche**, **sans mélanger, inverser ni réordonner les cartes de la pile**. L'ordre relatif **sommet → fond** de la pile extraite devient l'ordre dans lequel ses cartes seront piochées à leur prochain passage. Aucune option de réorganisation n'est proposée au joueur.

**Contrat métier et invariants CardForge :**
1. Soit une pile extraite visible du sommet vers le fond `[9♥, 5♠, 2♦]`. Son ordre futur de tirage, après les cartes déjà présentes dans la pioche, reste **`9♥ → 5♠ → 2♦`**. La conversion à l'état face cachée ne renverse **pas** cet ordre.
2. Pour définir sans ambiguïté le modèle de pioche, si son ordre de tirage actuel est `[A, B]`, après Extraction du groupe précédent l'ordre de tirage global devient **`[A, B, 9♥, 5♠, 2♦]`**. Le premier groupe ajouté est donc repioché avant un second groupe extrait plus tard.
3. Lors d'**Extractions successives**, chaque pile est ajoutée **en bloc** à la fin de l'ordre de tirage déjà constitué, sans insertion au milieu, mélange, inversion ou fusion des groupes : `[A,B] + [G1 sommet→fond] + [G2 sommet→fond]`.
4. Une Extraction d'une **pile à une carte** remet cette seule carte sous la pioche ; aucune autre carte n'est créée. L'Extraction d'une **case vide** n'est pas autorisée comme Extraction de pile : aucun As ne doit être consommé par une opération sans pile à retirer.
5. L'As d'Extraction est dépensé **une seule fois** ; les cartes extraites ne deviennent pas des actions spéciales et conservent leur **identité physique** (valeur, enseigne, identifiant). La case vidée reste jouable selon **GC-03 / G-02**.
6. Le moteur **ne révèle pas au joueur l'ordre futur de la pioche** au-delà des informations visibles qu'il connaissait déjà lors de l'Extraction ; la convention d'implémentation ne doit pas devenir un aperçu gratuit du deck. Les animations de retournement ne modifient pas l'ordre.
7. Sauvegarde/reprise conserve **l'ordre global exact de pioche** et l'état des piles, y compris après plusieurs Extractions. La même séquence d'actions produit la même succession de cartes, sans remélange ni double restitution.
8. Cette décision porte exclusivement sur l'**ordre interne et le point d'insertion** de la pile remise sous la pioche. Elle ne modifie pas les autres règles d'Extraction, de placement, de tirs, de scoring ou de fin de partie. La gestion des **impasses** et des **actions spéciales inefficaces** reste ouverte en **G-05 / G-07**.

**Exemple :** avant l'Extraction, la pioche doit encore distribuer `[6♣, 8♦]`. La pile visée porte `9♥` au sommet, `5♠` au milieu et `2♦` au fond. Après l'Extraction, le moteur distribuera **6♣, 8♦, 9♥, 5♠, 2♦**, en respectant les règles normales du tirage ; la pile retirée de la grille a disparu et l'As est consommé.

**Statut : GC-05 / G-04 CLOS pour CardForge.** La remise face cachée **sous la pioche** est documentée par la Version 2 ; **la conservation exacte de l'ordre sommet → fond, sans retournement interne, est une décision produit** et non une précision du livret de Tom Francis établie par lecture intégrale. Aucune exécution de tests du moteur n'a été réalisée.

### 19.1. Scénarios de conformité — GC-05 / G-04

| Test | Situation | Attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T39 | Extraction d'une pile [9♥, 5♠, 2♦] affichée du sommet au fond ; pioche vide | Ordre de tirage reconstitué **9♥, 5♠, 2♦** ; cartes remises face cachée | Spécifié, non exécuté |
| GC-V2-T40 | Pioche de tirage [6♣, 8♦] et pile extraite [9♥, 5♠, 2♦] | Pioche devient **[6♣, 8♦, 9♥, 5♠, 2♦]** | Spécifié, non exécuté |
| GC-V2-T41 | Une Extraction de G1 puis une Extraction de G2, pioche initiale non vide | Ordre de tirage = pioche initiale, **G1 sommet→fond**, puis **G2 sommet→fond** | Spécifié, non exécuté |
| GC-V2-T42 | Extraction d'une pile d'une seule carte | Une carte physique ajoutée au bas du paquet, sans double ajout | Spécifié, non exécuté |
| GC-V2-T43 | Tentative d'Extraction sur une case déjà vide | Action non autorisée, As non consommé et pioche inchangée | Spécifié, non exécuté |
| GC-V2-T44 | Extraction d'une pile avec valeurs croissantes du fond vers le sommet | Aucune inversion lors du passage face cachée ; le sommet ancien reste le premier de ce groupe repioché | Spécifié, non exécuté |
| GC-V2-T45 | Extraction suivie d'une pose dans la case redevenue vide | Pose autorisée selon GC-03 ; les cartes de l'ancienne pile ne sont pas restaurées dans la grille | Spécifié, non exécuté |
| GC-V2-T46 | Après Extraction, pioche épuisée jusqu'au groupe extrait | Les identités des cartes sont conservées et retournent dans l'ordre initial sommet→fond | Spécifié, non exécuté |
| GC-V2-T47 | Sauvegarde après deux Extractions puis reprise juste avant une pioche | Même ordre, même nombre de cartes, mêmes As consommés ; pas de remélange | Spécifié, non exécuté |
| GC-V2-T48 | Double clic ou reprise de l'action Extraction | Action effectuée une seule fois, aucune duplication de cartes ni consommation double d'As | Spécifié, non exécuté |
| GC-V2-T49 | Animation de retournement d'un groupe extrait face cachée | L'animation ne modifie jamais l'ordre de tirage prévu | Spécifié, non exécuté |

**Prochain arbitrage GC-06 / G-05 :** lorsqu'aucune figure vivante n'est actuellement présente (moins de douze vaincues), comment traiter une carte numérique qui ne peut être posée pendant la recherche d'une nouvelle figure, alors qu'aucune cible vivante ne pourrait recevoir l'armure ? L'existence du cycle d'attente des figures est documentée ; ses détails en situation d'impasse sont à préciser.


## 20. Décision fonctionnelle Gridcannon V2 — GC-06 / G-05 : recherche d'une nouvelle figure en l'absence de cible vivante

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Lorsqu'**aucune figure vivante n'est présente** et que **moins de douze figures sont vaincues**, le jeu entre dans la **recherche de la prochaine figure**. Les **cartes numériques 2 à 10 rencontrées** pendant cette recherche sont **temporairement écartées**, qu'elles soient normalement posables sur une pile ou non. Elles ne sont ni posées sur la grille, ni attribuées comme armure, ni consommées. Lorsqu'une nouvelle figure apparaît, les cartes numériques écartées sont réintroduites **sous la pioche**, sans mélange, conformément au mécanisme de recherche de figure décrit par la Version 2.

**Contrat métier CardForge :**
1. **Déclencheur :** nombre de figures **vivantes = 0** et nombre de figures **vaincues < 12**. Si les douze figures sont vaincues, la **victoire immédiate** prévaut ; aucune recherche supplémentaire.
2. Tant que la recherche est active, une carte numérique révélée est **mise en attente temporaire** sans consulter la règle normale de pose `carte tirée ≥ sommet de pile` ni la convertir en armure. Le fait qu'une carte soit posable ou impossible à poser est **sans effet** sur cette décision.
3. Au premier tirage d'une **nouvelle figure (J, Q, K)**, le moteur traite cette apparition avec les règles de placement de figures **GC-01 et GC-02**, puis remet les cartes numériques mises de côté **sous la pioche sans remélange** ; le moteur reprend le cycle ordinaire une fois la figure apparue. Les cartes temporairement retenues ne sont pas comptées deux fois et conservent leur identité. Les détails d'ordre fin du lot de cartes traversées seront consignés dans le contrat de pioche, sans réutiliser à tort la décision spécifique **GC-05** à l'Extraction des piles.
4. **Aucune armure ne peut être attribuée** lorsqu'il n'y a aucune figure vivante. Cela ne crée aucune nouvelle condition de défaite ; le joueur n'est pas contraint de dépenser une action spéciale uniquement parce qu'une carte numérique rencontrerait une grille non compatible.
5. **As et jokers rencontrés durant cette phase :** leur traitement précis (mise en réserve d'action spéciale ou autre disposition), ainsi que l'usage volontaire d'actions déjà disponibles, **ne sont pas déterminés par GC-06**. Ne pas généraliser sans validation le mécanisme d'attente des cartes numériques à ces cartes spéciales.
6. **Pioche épuisée avant l'apparition d'une nouvelle figure :** état limite **non clos** ; ne pas inventer une défaite automatique, un remélange ou une nouvelle carte. À examiner dans l'analyse des impasses **G-05**.
7. Une sauvegarde pendant la recherche doit conserver **le mode de recherche, la pioche restante et la zone temporaire de cartes numériques** sans duplication, perte, classement nouveau ou attribution d'armure au rechargement.
8. Le comportement ne modifie **pas** GC-01/02 (attraction et cases occupées), GC-03 (case vide après Extraction), GC-04 (double tir), GC-05 (ordre de piles extraites) ni les règles normales d'armure **lorsqu'une figure vivante est présente**.

**Exemple :** sept figures déjà vaincues sur douze, aucune vivante, grille dont tous les sommets valent au moins 5. Le joueur traverse successivement `4♠`, `8♦`, puis `Q♥`. Les cartes `4♠` et `8♦` sont **retenues temporairement sans pose ni armure**, même si `8♦` aurait pu être placée ; `Q♥` est placée légalement autour de la grille et les deux numériques sont réinsérées sous la pioche sans être jouées.

**Statut : GC-06 / G-05 (sous-cas sans figure vivante) CLOS pour CardForge.** Le parcours de pioche en l'absence de figure vivante est documenté dans la Version 2 ; sa formalisation explicite sur les cartes numériques est approuvée. **Les autres situations d'impasse G-05 restent ouvertes.** Aucun test logiciel n'a été exécuté.

### 20.1. Scénarios de conformité — GC-06 / G-05

| Test | Situation | Attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T50 | 7 figures vaincues, 0 vivante, pioche 4♠ non posable sur une grille de sommets ≥ 5 | 4♠ retenue temporairement ; **aucune armure, aucune défaite** | Spécifié, non exécuté |
| GC-V2-T51 | Même situation, pioche une carte 8♦ qui serait normalement posable | Carte 8♦ **également retenue**, pas de pose tactique durant la recherche | Spécifié, non exécuté |
| GC-V2-T52 | Deux cartes numériques tirées avant la prochaine figure | Deux cartes identifiées dans la zone temporaire, sans double consommation | Spécifié, non exécuté |
| GC-V2-T53 | Après des numériques écartées, apparition d'une Dame de cœur | Figure placée suivant GC-01/02, numériques réintroduites sous la pioche sans mélange | Spécifié, non exécuté |
| GC-V2-T54 | Aucun ennemi vivant et une carte numérique non posable alors qu'une action spéciale est disponible | La carte suit **la recherche de figure**, sans obligation de dépenser l'action ni recevoir l'armure | Spécifié, non exécuté |
| GC-V2-T55 | 12 figures déjà vaincues, aucune figure vivante | **Victoire**, aucune recherche de figure ni carte supplémentaire tirée | Spécifié, non exécuté |
| GC-V2-T56 | Sauvegarde avec 2 cartes numériques temporairement écartées puis reprise | Même phase et mêmes identités de cartes ; aucun tirage, dégât ou armure fantôme | Spécifié, non exécuté |
| GC-V2-T57 | Aucune figure vivante, pioche numérique traversée puis apparition normale d'une figure, retour au cycle de jeu | Cycle normal repris après placement de la figure et réintroduction des cartes numériques | Spécifié, non exécuté |
| GC-V2-T58 | Dernière carte numérique tirée alors qu'aucune figure n'est vivante, moins de 12 vaincues | **Cas explicitement non tranché** : aucun remélange ni verdict de défaite inventé sous GC-06 ; à arbitrer avec G-05 | En attente d'arbitrage G-05 |
| GC-V2-T59 | Tirage d'un As ou Joker pendant la recherche | **Résolu par GC-09** : carte spéciale transférée face visible et non dépensée vers la réserve ; recherche poursuivie | Spécifié, non exécuté |
| GC-V2-T60 | Fin de phase après passage de plusieurs numériques | Le total physique de cartes est conservé ; aucune carte numérique traversée ne devient une armure | Spécifié, non exécuté |

**Prochain arbitrage GC-07 / G-07 :** lorsqu'une carte numérique est **impossible à poser alors qu'une figure vivante existe**, une **action spéciale encore disponible mais incapable de rendre la carte posable** bloque-t-elle l'attribution d'armure ? Ce cas est distinct de la recherche de figure GC-06 et des règles d'Extraction d'As (GC-03/05).


## 21. Décision fonctionnelle Gridcannon V2 — GC-07 / G-07 : action spéciale disponible mais inutile pour la pose

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Lorsqu'**au moins une figure vivante** est présente et qu'une carte numérique (2 à 10) en cours de traitement ne peut être posée **sur aucune des neuf cases** de la grille, la simple existence d'un **As ou d'un Joker non dépensé** ne bloque pas automatiquement l'attribution d'une **armure**. Le moteur doit vérifier si les **actions spéciales légalement réalisables** sont **effectivement capables de rendre la carte numérique en attente posable**. Si aucune action utile n'existe, cette carte peut devenir une armure conformément à la règle normale de Gridcannon Version 2.

**Contrat d'acceptation :**
1. **Périmètre :** appliquer ce contrôle seulement en présence d'au moins **une figure vivante**. En l'absence de cible vivante, le comportement de recherche **GC-06** reste prioritaire.
2. **Pose directe d'abord :** si la carte est déjà posable sur une pile de sommet inférieur/égal ou sur une case vide (**GC-03**), le joueur la joue normalement : il n'y a **aucun motif de l'envoyer en armure**.
3. En cas d'impossibilité de pose, évaluer les **recours effectifs** des As (Extraction) et Jokers (Réaffectation), selon leur légalité et l'état réel visible du plateau. Un recours est « utile » uniquement s'il **permet concrètement de débloquer une destination pour la carte en attente**, sans tirage additionnel ni information cachée. Si plusieurs opérations légales successives sont nécessaires, ne pas les présumer impossibles au seul motif qu'une action isolée ne débloque pas directement ; les règles d'évaluation exhaustive/optimisation appartiennent au moteur et doivent être testées sur des scénarios bornés.
4. **As :** une Extraction légale d'une pile **non vide** libère sa case ; selon **GC-03**, cette case devient admissible à toute carte numérique 2–10. Un As ainsi jouable est donc un **recours utile**. Il n'est pas permis de consommer un As sur une case déjà vide (**GC-05**).
5. **Joker :** une Réaffectation doit déplacer une carte supérieure vers une destination **légale**, conformément à la mécanique de la Version 2. Le Joker n'est utile au blocage que si une **suite d'actions effectivement légales** crée une destination compatible pour la carte en attente ; un Joker restant sans solution utile **ne bloque pas** l'armure.
6. **Recours utile présent :** le joueur peut choisir parmi les **actions spéciales réellement utiles**, sans gaspillage imposé d'une autre action. La carte en attente n'est **pas convertie en armure** tant qu'une solution utile effectivement réalisable existe ; l'application ne choisit pas automatiquement une action à la place du joueur.
7. **Aucun recours utile :** la carte devient une **armure attribuée à une figure vivante** par les priorités inverses documentées : même enseigne puis valeur de figure la plus basse ; sinon même couleur puis valeur la plus basse ; sinon figure de valeur la plus basse. La **valeur numérique de la carte** augmente la résistance actuelle ; vérifier immédiatement les seuils de défaite **J/Q ≥ 20, K ≥ 19**.
8. **Une action spéciale inutilisée reste disponible** et continue de compter dans le score officiel éventuel de victoire. Ne pas la marquer consommée, ne pas l'obliger à être jouée et ne pas modifier artificiellement les probabilités.
9. **Déterminisme et persistance :** sauvegarder l'état de la carte en attente, les actions consommées, la figure armurée et les nouveaux seuils. Les refus d'action illégale et la vérification de recours n'ajoutent **aucune mutation de cartes** ; éviter les consommations en double à la reprise.

**Exemple :** une carte 2♠ est en attente ; toutes les cases portent des sommets supérieurs à 2 et **aucun Joker disponible ne peut réaliser une séquence légale libérant une destination** ; il n'y a pas d'As utile. Même si un Joker non consommé subsiste, le 2♠ devient une armure sur une figure vivante selon les critères inversés. En revanche, si un As peut extraire une pile, la case vide permet de jouer 2♠ : l'armure est bloquée tant que cette solution existe.

**Statut : GC-07 / G-07 CLOS pour CardForge.** L'utilité **réelle**, et non la simple disponibilité, est un arbitrage explicite du porteur : la formulation de la Version 2 par Tom Francis ne résout pas sans ambiguïté ce cas, et une source secondaire le présente différemment. Aucun test du moteur ou calcul d'accessibilité des séquences n'a été exécuté.

### 21.1. Scénarios de conformité — GC-07 / G-07

| Test | Situation | Attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T61 | Figure vivante, carte numérique non posable, aucun As/Joker disponible | Conversion en armure selon sélection inverse et contrôle de seuil | Spécifié, non exécuté |
| GC-V2-T62 | Figure vivante, carte non posable, Joker restant mais aucune Réaffectation légale utile | Conversion en armure **autorisée**, Joker non consommé | Spécifié, non exécuté |
| GC-V2-T63 | Figure vivante, carte non posable, As disponible et pile non vide | Extraction utile créant une case vide ; armure non autorisée tant que ce recours reste possible | Spécifié, non exécuté |
| GC-V2-T64 | Figure vivante, carte numérique déjà posable sur case vide après Extraction | Pose ordinaire ; aucun passage en armure | Spécifié, non exécuté |
| GC-V2-T65 | Figure vivante, carte non posable, Joker légal permettant de déplacer une carte puis de libérer une case à faible sommet | Recours utile ; permettre l'action avant la pose, sans armure forcée | Spécifié, non exécuté |
| GC-V2-T66 | Plusieurs Jokers/As disponibles, un seul recours utile | Présenter les actions utiles, ne pas imposer de dépenser une action inutile | Spécifié, non exécuté |
| GC-V2-T67 | Plusieurs actions spéciales légalement enchaînables, chacune isolément sans solution immédiate, mais combinaison débloquant la carte | Recours global utile ; ne pas conclure trop tôt à l'armure | Spécifié, non exécuté |
| GC-V2-T68 | Figure vivante, aucune action utile, carte convertie en armure faisant atteindre seuil J/Q 20 ou K 19 | Défaite immédiate selon résistance actuelle | Spécifié, non exécuté |
| GC-V2-T69 | Deux figures vivantes compatibles pour l'armure, une de même enseigne et une de même couleur | Même enseigne et valeur minimale prioritaires selon la règle inverse | Spécifié, non exécuté |
| GC-V2-T70 | Joker restant inutilisé après attribution d'armure, puis victoire ultérieure | Joker conserve son statut disponible et contribue au score final | Spécifié, non exécuté |
| GC-V2-T71 | Aucune figure vivante, carte numérique non posable avec Joker inutilisable | **GC-06** prioritaire : numérique mise de côté, pas d'armure | Spécifié, non exécuté |
| GC-V2-T72 | Sauvegarde/reprise au moment de choisir le recours ou après une attribution d'armure | Carte en attente, ressources, armures et seuils conservés sans double effet | Spécifié, non exécuté |

**Prochain arbitrage GC-08 / G-08 :** si la pioche a été vide puis réapprovisionnée par une Extraction et qu'une victoire survient, **le score doit-il rester le nombre d'actions spéciales non dépensées à la victoire**, ou faut-il distinguer/majorer/pénaliser ce cas ? La règle générale Version 2 fixe le score sur les actions spéciales restantes ; aucune exception explicite en cas d'épuisement temporaire n'a été documentée.


## 22. Décision fonctionnelle Gridcannon V2 — GC-08 / G-08 : score après épuisement puis réapprovisionnement de la pioche

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Une victoire obtenue après que la pioche a été **temporairement vide** puis **réapprovisionnée par une Extraction** se calcule **exactement comme toute autre victoire de Gridcannon Version 2** : le score officiel est le **nombre d'actions spéciales (As et Jokers) non dépensées au moment où les douze figures sont vaincues**. Aucune pénalité, majoration, catégorie de victoire différente ni suppression du score n'est appliquée en raison d'un épuisement antérieur de la pioche.

**Contrat fonctionnel CardForge :**
1. Au moment exact où la douzième figure est vaincue, capturer un état terminal **victoire** et calculer **une seule fois** `scoreOfficiel = nombre d'As non dépensés + nombre de Jokers non dépensés`, selon l'état réel des cartes de la partie, avec **0 ≤ scoreOfficiel ≤ 6** (quatre As et deux Jokers).
2. Toute action spéciale **déjà utilisée**, notamment l'As d'Extraction ayant réapprovisionné la pioche, **ne compte plus** ; une action non dépensée conserve son statut et est comptée conformément à la règle normale de score.
3. Le fait que la pioche ait atteint zéro **n'est pas en soi une condition de défaite permanente** et ne modifie pas l'issue d'une victoire légale rendue possible par des actions spéciales. Cette décision n'autorise pas à contourner une défaite déjà prononcée pour une autre cause selon les règles existantes.
4. **Exemple :** la pioche devient vide ; un As est consommé pour extraire une pile, puis le joueur élimine les douze figures avec **trois actions spéciales non dépensées** : **victoire, score officiel 3**, ni 0, ni un score augmenté d'un bonus de reprise.
5. Une **victoire avec zéro action spéciale restante** a bien un score officiel de **0** ; en revanche **une défaite ou un abandon n'a pas de score officiel de victoire** (ne pas créer artificiellement une victoire de score zéro pour une défaite).
6. Des indicateurs de suivi CardForge tels que « nombre de réapprovisionnements » ou « pioche déjà épuisée » peuvent, s'ils sont décidés ultérieurement, être conservés **séparément** du score officiel et ne jamais l'altérer.
7. La sauvegarde/reprise et l'historique de partie conservent l'état des As et des Jokers, le résultat et le score **figés** ; un double événement de victoire, un double clic ou une reprise ne doit ni recomputer un autre score ni enregistrer deux résultats.
8. Cette décision ne tranche **pas** les impasses G-05 lorsque la pioche s'épuise sans figure trouvée, ni la manière de traiter les As/Jokers rencontrés pendant la recherche d'une nouvelle figure (point ouvert annoncé en **GC-09**).

**Statut : GC-08 / G-08 CLOS pour CardForge.** La règle de score fondée sur les actions spéciales restantes est documentée dans la Version 2. Le traitement **sans exception liée à un épuisement temporaire** est un arbitrage de précision approuvé, sans revendiquer une formulation spécifique de ce cas limite par Tom Francis. Aucun test de moteur n'a été exécuté.

### 22.1. Scénarios de conformité — GC-08 / G-08

| Test | Précondition / action | Résultat attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T73 | Pioche épuisée une fois, un As utilisé pour la reconstituer ; 3 actions spéciales non dépensées à la victoire | Victoire, **score officiel 3** | Spécifié, non exécuté |
| GC-V2-T74 | Victoire sans épuisement de pioche ; 3 actions spéciales non dépensées | Même score officiel **3** que T73 | Spécifié, non exécuté |
| GC-V2-T75 | Plusieurs épuisements puis Extractions, victoire avec une action spéciale non dépensée | Score officiel **1**, aucun malus supplémentaire | Spécifié, non exécuté |
| GC-V2-T76 | Victoire après reprise, aucune action spéciale non dépensée | Victoire valide avec score **0** | Spécifié, non exécuté |
| GC-V2-T77 | Pioche épuisée puis défaite selon une condition de défaite existante | Défaite, **aucun score officiel de victoire**, même si des actions restent | Spécifié, non exécuté |
| GC-V2-T78 | Victoire puis affichage des statistiques de réapprovisionnement | Indicateurs complémentaires éventuels séparés, score officiel inchangé | Spécifié, non exécuté |
| GC-V2-T79 | Sauvegarde juste avant le dernier tir après une Extraction et reprise | Même comptage des As/Jokers non dépensés et même score de victoire | Spécifié, non exécuté |
| GC-V2-T80 | Double résolution de victoire ou rechargement après une victoire | Un seul résultat et un seul score figé | Spécifié, non exécuté |
| GC-V2-T81 | Victoire avec toutes les six actions spéciales non dépensées | Score maximum **6** sans bonus de pioche | Spécifié, non exécuté |
| GC-V2-T82 | Tentative d'ajouter l'As utilisé pour réapprovisionner au compteur des actions non dépensées | As **exclu**, sans remboursement ni bonus | Spécifié, non exécuté |

**Prochain arbitrage GC-09 / sous-cas G-05 :** pendant la recherche de la prochaine figure, lorsqu'aucune figure n'est vivante (GC-06), comment traiter **un As ou un Joker pioché** ? Les cartes numériques de cette phase sont déjà traitées par GC-06 ; les cartes spéciales demeurent un cas explicitement ouvert (GC-V2-T59).


## 23. Décision fonctionnelle Gridcannon V2 — GC-09 / sous-cas G-05 : As et Jokers rencontrés pendant la recherche d'une figure

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Quand le joueur a vaincu toutes les figures actuellement présentes mais pas encore les douze figures du jeu, la recherche de la **prochaine figure** engagée selon **GC-06** se poursuit. Tout **As** ou **Joker** pioché pendant cette recherche rejoint **immédiatement, face visible, la réserve des actions spéciales**, exactement comme lors d'un tirage ordinaire. Il **n'est pas mis de côté avec les cartes numériques** ni réintroduit dans la pioche ; il **n'est pas consommé automatiquement**. Le moteur poursuit la recherche de la figure suivante après son attribution à la réserve.

**Règles déterministes et séparation des cas :**
1. Si **aucune figure n'est vivante** et que **moins de douze figures sont vaincues**, maintenir le mode de recherche **GC-06**. Le traitement de chaque carte tirée dépend de sa catégorie, **sans intervention tactique forcée**.
2. **Cartes numériques 2–10 :** les mettre **temporairement de côté** pour réinsertion ultérieure sous la pioche, sans les poser ni les convertir en armure (GC-06).
3. **As :** retirer l'As physique de la pioche, le placer **face visible dans la réserve** comme **action Extraction disponible**, **non dépensée**. Aucune pile n'est extraite par ce seul tirage.
4. **Joker :** retirer le Joker physique de la pioche, le placer **face visible dans la réserve** comme **action Réaffectation disponible**, **non dépensée**. Aucune carte de la grille n'est déplacée par ce seul tirage.
5. **Figure J/Q/K :** traiter son placement autour de la grille selon **GC-01 / GC-02**, puis achever le cycle de recherche et réinjecter les cartes numériques traversées sous la pioche selon GC-06, sans y inclure les As/Jokers désormais dans la réserve.
6. Les **identifiants physiques** des quatre As et deux Jokers et leurs états `disponible` / `dépensé` restent uniques : il n'y a **ni duplication, ni disparition, ni pioche supplémentaire, ni nouvelle carte spéciale** inventée. Un As/Joker nouvellement trouvé est compté comme **non dépensé** pour un éventuel score de victoire, **s'il n'est pas utilisé ultérieurement** (GC-08).
7. Révéler un As/Joker **ne met pas fin à la recherche**, ne déclenche pas de pose sur la grille, d'armure ou de défaite. En l'absence d'ennemi vivant, la règle de recherche **GC-06** prévaut sur les mécanismes habituels d'armure **GC-07**.
8. L'usage volontaire d'une action spéciale **pendant** la recherche, avant l'apparition d'une nouvelle figure, **n'est pas décidé par GC-09** ; seule sa **mise en réserve immédiate** est validée. Le point pourra être arbitré indépendamment (sans attribuer à l'auteur une restriction ou permission nouvelle). Le comportement lorsque la pioche se vide sans nouvelle figure demeure ouvert (**G-05**).
9. Une sauvegarde/reprise au milieu de la recherche conserve **la pioche restante**, les cartes numériques temporairement écartées, **les actions spéciales découvertes et disponibles**, l'état des figures et l'étape exacte de recherche. Le moteur ne redécouvre ni ne crédite deux fois un As/Joker après rechargement.

**Exemple :** aucune figure vivante, 7 figures vaincues ; on rencontre successivement `4♣`, `A♠`, `Joker`, `Q♦`. Le `4♣` est temporairement écarté, `A♠` et `Joker` rejoignent **immédiatement la réserve sans être dépensés**, puis `Q♦` est placée suivant les règles de figures ; le `4♣` seul rejoint ensuite le dessous de la pioche. La réserve ne retourne pas dans la pioche lors de cette opération.

**Statut : GC-09 / sous-cas G-05 CLOS pour CardForge.** L'application de la mécanique de réserve des As/Jokers durant cette recherche est un **arbitrage de précision** du porteur ; la Version 2 décrite dans les références expose ces actions comme une réserve mais ne confirme pas explicitement ce détail du cas limite. **GC-V2-T59 (état historique « en attente » de GC-06) est maintenant résolu par la présente décision.** Aucun test logiciel n'a été exécuté.

### 23.1. Scénarios de conformité — GC-09

| Test | Situation | Résultat attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T83 | Sans figure vivante, recherche 4♣, A♠, Joker, Q♦ | 4♣ écartée temporairement ; As et Joker disponibles dans la réserve ; Dame placée ; seul 4♣ sous la pioche | Spécifié, non exécuté |
| GC-V2-T84 | As révélé alors que le mode recherche est actif | As déplacé en réserve, face visible et non dépensé ; recherche continue | Spécifié, non exécuté |
| GC-V2-T85 | Joker révélé pendant la recherche | Joker déplacé en réserve, face visible et non dépensé ; aucun déplacement de carte de grille | Spécifié, non exécuté |
| GC-V2-T86 | Trois actions spéciales tirées consécutivement avant la figure suivante | Trois cartes physiques distinctes créditées dans la réserve, sans arrêt de recherche ni duplication | Spécifié, non exécuté |
| GC-V2-T87 | Cartes numériques mises de côté et As/Joker rencontrés entre elles | Seules les numériques sont réinjectées sous la pioche après la figure ; les spéciales restent en réserve | Spécifié, non exécuté |
| GC-V2-T88 | Joker découvert puis ultérieurement inutilisé à la victoire | Joker toujours non dépensé, inclus dans le score officiel GC-08 | Spécifié, non exécuté |
| GC-V2-T89 | Aucune figure vivante, rencontre d'un As ; grille incompatible avec la précédente numérique | Aucune armure, aucun recours imposé, recherche de figure maintenue | Spécifié, non exécuté |
| GC-V2-T90 | Fin de recherche au tirage d'une figure juste après un As | Figure placée légalement, As conservé dans la réserve et non remis en pioche | Spécifié, non exécuté |
| GC-V2-T91 | Sauvegarde après découverte d'un Joker, avant la prochaine figure | Reprise avec Joker disponible une seule fois, état de recherche et pioche inchangés | Spécifié, non exécuté |
| GC-V2-T92 | Rejeu accidentel du même événement de tirage As/Joker | Une seule carte spéciale ajoutée à la réserve, aucun doublon statistique | Spécifié, non exécuté |
| GC-V2-T93 | Recherche avec As/Joker, puis épuisement de pioche sans figure | As/Joker correctement en réserve ; **issue de l'épuisement non tranchée** et renvoyée à G-05 | En attente d'arbitrage G-05 |

**Prochain arbitrage GC-10 :** à la sortie du mode recherche de GC-06, dans quel **ordre** remettre les cartes numériques traversées sous la pioche après l'apparition d'une figure ? La remise sans mélange est actée, mais l'ordre exact de la séquence temporaire (ordre de rencontre, ordre inverse, réorganisation) reste à valider. **Cette question est distincte de GC-05**, qui porte sur les piles complètes extraites par As.


## 24. Décision fonctionnelle Gridcannon V2 — GC-10 : ordre des cartes numériques réinsérées après la recherche de figure

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Lorsqu'aucune figure vivante n'est présente, la recherche de la prochaine figure définie par **GC-06** met temporairement de côté les cartes **numériques 2 à 10** rencontrées. À la découverte et au placement légal de la nouvelle figure, ces cartes numériques sont replacées **face cachée sous la pioche dans leur ordre chronologique de rencontre**, **sans mélange, inversion ni réorganisation par le joueur**.

**Contrat métier et invariants CardForge :**
1. Pendant la recherche, les numériques révélées sont conservées dans une **séquence temporaire ordonnée du premier au dernier tirage**, avec leurs identifiants physiques distincts. Les As/Jokers rencontrés rejoignent la réserve conformément à **GC-09** et ne font pas partie de la séquence temporaire.
2. Lorsqu'une nouvelle figure est révélée, appliquer son placement légal suivant **GC-01/GC-02**. La recherche s'achève après le placement ; **les numériques temporaires** sont ajoutées **en bloc à la fin de l'ordre futur de tirage** de la pioche, dans **le même ordre où elles avaient été rencontrées**.
3. Exemple : les cartes traversées sont `4♣`, `8♦`, `5♠`, puis apparaît `Q♥`. Après placement de `Q♥`, les cartes numériques du lot reviendront à la pioche dans l'ordre de futur tirage **`4♣ → 8♦ → 5♠`**. Elles ne sont ni jouées durant la recherche ni transformées en armure (GC-06).
4. **Priorité des cartes déjà en pioche :** si des cartes y demeurent après le placement de la figure, elles **seront tirées avant** le groupe numérique réinjecté. Ainsi, avec une pioche restante d'ordre de tirage `[A, B]` et un lot traversé `[4♣,8♦,5♠]`, le nouvel ordre est **`[A,B,4♣,8♦,5♠]`**.
5. Si la pioche est **vide au moment où la figure est trouvée**, les numériques du lot traversé constituent la totalité de la pioche reconstituée, dans leur **ordre de rencontre**. Si le lot est vide, n'ajouter aucune carte.
6. Les cartes réinjectées sont **face cachée** ; l'opération ne donne **aucun aperçu supplémentaire** du contenu futur de la pioche et ne remet en jeu aucun As/Joker de la réserve.
7. Si une nouvelle recherche survient plus tard, elle crée son **propre lot ordonné** ; chaque lot est ajouté sous la pioche existante à la fin de cette recherche. Le traitement de l'ordre de **piles entières extraites par As** (GC-05) reste indépendant et inchangé.
8. La **sauvegarde/reprise** durant la recherche doit sérialiser la **séquence ordonnée** des numériques temporaires, la pioche courante, le mode recherche et les cartes spéciales en réserve. L'opération de placement de figure et de réinsertion est **atomique et idempotente** : aucun lot ne doit être réinséré deux fois après un rechargement ou un double déclenchement.
9. **Hors portée de GC-10 :** cas où **aucune figure n'est découverte avant épuisement complet de la pioche**, alors que moins de douze sont vaincues (G-05) ; droit de jouer une action spéciale **pendant** la recherche (futur **GC-11**). Ne pas inventer un verdict terminal ni une permission/restriction d'action sur la seule base de GC-10.

**Statut : GC-10 CLOS pour CardForge.** La remise sous la pioche sans mélange après recherche de figure est documentée dans les références de la Version 2 ; le choix précis **ordre de rencontre → ordre futur de tirage** est un **arbitrage fonctionnel CardForge**, non une précision explicitement citée de Tom Francis. Les tests ci-dessous sont spécifiés, **non exécutés**.

### 24.1. Scénarios de conformité — GC-10

| Test | Précondition / action | Résultat attendu | Statut |
| --- | --- | --- | --- |
| GC-V2-T94 | Numériques 4♣, 8♦, 5♠ traversées, puis Q♥ révélée | Après placement de la Dame, ordre de retour **4♣, 8♦, 5♠** | Spécifié, non exécuté |
| GC-V2-T95 | Pioche encore [A, B] lors de la révélation de la figure, lot numérique [4♣, 8♦, 5♠] | Ordre final **[A, B, 4♣, 8♦, 5♠]** | Spécifié, non exécuté |
| GC-V2-T96 | As/Joker révélés au milieu des numériques traversées | As/Joker en réserve selon GC-09 ; seules les numériques sont réinsérées, ordre maintenu | Spécifié, non exécuté |
| GC-V2-T97 | Aucune numérique traversée avant la nouvelle figure | Pas de réinsertion ; pioche inchangée hormis figure prélevée | Spécifié, non exécuté |
| GC-V2-T98 | Pioche vide **après révélation de la figure**, lot temporaire non vide | Lot réinjecté seul, dans l'ordre de rencontre | Spécifié, non exécuté |
| GC-V2-T99 | Deux épisodes de recherche de figure avec des lots numériques distincts | Chaque lot ajouté à la fin de la pioche à son propre moment, sans inversion | Spécifié, non exécuté |
| GC-V2-T100 | Recherche avec une carte 2 pourtant posable sur une case vide | 2 reste temporaire ; retour sous la pioche, aucune pose ni armure | Spécifié, non exécuté |
| GC-V2-T101 | Sauvegarde au milieu de la recherche avec 3 numériques temporaires | Reprise reproduit le même ordre, les mêmes identifiants et la même réserve | Spécifié, non exécuté |
| GC-V2-T102 | Double événement de fin de recherche après révélation de figure | Figure et lot numériques traités exactement une fois ; aucune duplication physique | Spécifié, non exécuté |
| GC-V2-T103 | Réinsertion des numériques après une Extraction survenue antérieurement | Maintien de l'ordre préalable de pioche, groupe numérique placé après les cartes encore présentes ; GC-05 inchangé | Spécifié, non exécuté |
| GC-V2-T104 | Pioche épuisée sans nouvelle figure malgré des figures encore non vaincues | **Cas non décidé par GC-10**, à examiner dans G-05 ; aucune défaite ou boucle fictive inventée | En attente G-05 |

**Prochaine décision GC-11 :** les As/Jokers **déjà disponibles**, y compris ceux révélés pendant une recherche (GC-09), peuvent-ils être **activés volontairement alors que le moteur cherche encore la prochaine figure** (GC-06), ou leur usage doit-il attendre la fin de cette recherche ? La Version 2 présente les actions spéciales comme disponibles « à tout moment », mais le séquencement avec la recherche est à préciser.


## 25. Décision fonctionnelle Gridcannon V2 — GC-11 : actions spéciales volontaires pendant la recherche de figure

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Lorsqu'aucune figure vivante n'est présente et que le jeu recherche la prochaine figure (**GC-06**), le joueur peut **activer volontairement un As (Extraction) ou un Joker (Réaffectation) disponible** avant l'apparition du nouvel adversaire, sous réserve des **conditions de légalité ordinaires** de l'action. Après sa résolution, le moteur **reprend la recherche à partir de l'état réel de la pioche et du plateau**, sans réinitialiser les numériques temporairement écartées et sans dépense automatique de carte spéciale.

**Contrat métier :**
1. **Réserve disponible :** toutes les actions spéciales présentes, y compris les As/Jokers révélés et ajoutés pendant la recherche par **GC-09**, peuvent être proposées au joueur. Une action reste disponible jusqu'à **l'activation explicite et légale** ; sa révélation ne la dépense jamais.
2. **Extraction / As :** l'utilisateur peut choisir une **pile non vide** de la grille, en retirer la **pile entière**, consommer l'As **une seule fois** et transférer les cartes face cachée **sous la pioche**, selon **GC-03 et GC-05**. Une case déjà vide ne constitue pas une cible extractible. Le nouvel ordre de pioche tient compte de cette Extraction.
3. **Réaffectation / Joker :** le joueur peut déplacer la **carte supérieure réelle** d'une pile non vide vers une autre destination **légalement admissible**, en consommant le Joker **une seule fois**. Cela peut modifier les sommets ou créer une case vide ; les règles de placement (dont GC-03) restent applicables. Les conséquences de tirs sont évaluées selon les règles normales **s'il existe une cible vivante** ; aucune figure vivante n'est créée ni éliminée artificiellement durant cette phase.
4. **La recherche reste active** tant qu'aucune figure vivante n'a été découverte/placée et que moins de douze figures sont vaincues. L'activation d'une action spéciale **ne constitue pas la fin de la recherche**, ne donne pas le droit de jouer les cartes numériques traversées et n'entraîne aucune conversion en armure.
5. La **séquence temporaire ordonnée** des cartes numériques écartées selon **GC-06/GC-10** est **conservée à l'identique** durant les actions spéciales. Les cartes de cette zone ne sont pas disponibles comme sources ou destinations de Réaffectation/Extraction.
6. Après l'action, les futurs tirages de recherche suivent **l'ordre réel de la pioche ainsi mis à jour** ; un As qui réinjecte une pile peut donc prolonger la recherche en ajoutant des cartes au bas du paquet, sans mélanger ni réinsérer prématurément les cartes numériques retenues.
7. La manière dont l'interface fournit au joueur des **points de décision pour intervenir** dans un parcours qui pourrait autrement être automatique constitue un **choix d'interaction à régler dans GC-12 ou dans les spécifications UX**, sans permettre au moteur de priver en pratique le joueur du droit de jouer ces actions avant la nouvelle figure.
8. **Sauvegarde/reprise et idempotence :** préserver la phase de recherche, les cartes numériques retenues dans leur ordre, les As/Jokers disponibles ou dépensés, les modifications de grille et le nouvel ordre de pioche. Ne pas doubler une Extraction, une Réaffectation ou un tirage après une interruption.
9. **Hors de portée :** la situation où la pioche deviendrait vide sans nouvelle figure alors que des figures restent non vaincues, déjà signalée en **G-05**, **n'est pas résolue** par le seul droit d'utiliser une action spéciale. Ne pas inventer de défaite, de figure ou de reconstitution automatique du paquet.

**Exemple :** pendant une recherche, `4♣` et `8♦` ont été temporairement écartées. Un As disponible est activé pour extraire une pile `[9♥,5♠]` de la grille ; l'As est dépensé, la case devient vide et le groupe `[9♥,5♠]` est ajouté sous la pioche selon **GC-05**. La recherche reprend, les cartes `4♣,8♦` restant provisoirement écartées et ordonnées jusqu'à la prochaine figure (GC-10).

**Statut : GC-11 CLOS pour CardForge.** La disponibilité générale des actions spéciales est étayée par la Version 2, mais leur activation précisément **pendant le cycle de recherche d'une figure** est une **décision fonctionnelle CardForge**, sans confirmation textuelle spécifique de Tom Francis. Aucun test moteur ni parcours UX n'a été exécuté.

### 25.1. Scénarios de conformité — GC-11

| Test | Précondition / action | Attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T105 | Recherche en cours, un As disponible, pile de grille non vide | Extraction autorisée sur demande, As consommé une fois ; recherche continue | Spécifié, non exécuté |
| GC-V2-T106 | Recherche en cours, un Joker disponible, source et destination légales | Réaffectation autorisée, Joker consommé une fois ; recherche continue | Spécifié, non exécuté |
| GC-V2-T107 | As révélé pendant la recherche puis activé volontairement | As d'abord ajouté disponible à la réserve (GC-09), puis dépensé seulement sur activation explicite | Spécifié, non exécuté |
| GC-V2-T108 | Joker révélé puis inutilisé jusqu'à l'apparition de la figure | Joker toujours disponible et non dépensé à la sortie de recherche | Spécifié, non exécuté |
| GC-V2-T109 | Deux cartes numériques déjà écartées, puis Extraction pendant la recherche | Numériques temporaires inchangées ; pile extraite ajoutée sous la pioche selon GC-05 | Spécifié, non exécuté |
| GC-V2-T110 | Joker utilisé pour déplacer une carte alors qu'aucune figure n'est vivante | Grille modifiée légalement, aucune figure créée ou tuée fictivement | Spécifié, non exécuté |
| GC-V2-T111 | Tentative d'Extraction d'une case vide pendant la recherche | Action rejetée et As préservé ; aucune mutation de pioche | Spécifié, non exécuté |
| GC-V2-T112 | Tentative de Réaffectation vers une destination illégale | Action rejetée et Joker préservé ; aucune mutation de grille | Spécifié, non exécuté |
| GC-V2-T113 | Recherche après Extraction suivie d'une nouvelle figure | Ordre réel de pioche respecté ; figure placée GC-01/02 ; réinsertion des numériques GC-10 | Spécifié, non exécuté |
| GC-V2-T114 | Sauvegarde après usage d'un As en recherche, puis reprise | As dépensé une fois, pioche reconstruite et cartes numériques écartées identiques | Spécifié, non exécuté |
| GC-V2-T115 | Rejeu du même ordre d'activation après interruption | Aucun second prélèvement de pile ni double consommation d'action | Spécifié, non exécuté |
| GC-V2-T116 | Interface déclenchant la recherche automatiquement alors qu'un As/Joker est disponible | **Point de contrôle UX à valider** : le joueur doit pouvoir exercer GC-11 avant que la recherche n'atteigne la figure suivante | Spécifié, non exécuté — conception UX ouverte |

**Prochain arbitrage GC-12 / sous-cas G-05 :** la recherche n'a révélé **aucune nouvelle figure** avant l'épuisement de la pioche, alors que **moins de douze figures sont vaincues et aucune n'est vivante**. Dans un état de jeu conservant les 12 figures physiques, ce cas paraît **inatteignable** si toute figure non apparue reste obligatoirement dans la pioche : il faut déterminer le traitement d'un **état incohérent**, sans inventer une condition de défaite officielle. La question d'ergonomie des pauses pendant la recherche reste distincte.


## 26. Décision fonctionnelle Gridcannon V2 — GC-12 / sous-cas G-05 : pioche épuisée pendant la recherche sans nouvelle figure

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Si le moteur est en **recherche de nouvelle figure** (aucune figure vivante, moins de douze vaincues) et atteint la fin de la pioche **sans découvrir de figure**, il ne doit **ni déclarer automatiquement une défaite ni inventer des cartes**. Il vérifie l'intégrité des **douze figures physiques** et l'état du cycle de jeu. Si l'état est incohérent, il **interrompt en sécurité la progression**, signale une **anomalie d'intégrité**, préserve les informations de diagnostic et protège la partie et ses statistiques d'une modification terminale erronée.

**Justification et invariant :** dans un état de jeu V2 valide et stabilisé (hors transaction de pose en cours), toute figure physique parmi les douze est soit **apparue, vivante**, soit **apparue, vaincue et conservée à sa place extérieure**, soit **encore dans la pioche**, éventuellement dans une zone de transit explicitement sérialisée et non encore validée. L'Extraction des As concerne **uniquement des piles numériques de la grille** et ne retire aucune figure extérieure. La recherche GC-06 écarte temporairement seulement les numériques (GC-09 : As/Jokers en réserve). Ainsi, si aucune figure vivante n'existe, que moins de douze sont vaincues et qu'aucune figure ne subsiste dans la pioche ou une zone de transit légale, **au moins une figure manque dans l'état connu**. Ce n'est pas une nouvelle condition de défaite officielle. Lorsqu'une transaction n'est pas terminée, le moteur doit d'abord l'achever de manière déterministe ou valider sa sérialisation avant de conclure à une corruption.

**Contrat métier CardForge :**
1. **Détecter sans muter** : lorsque la recherche ne peut trouver de figure, inspecter les douze **identifiants uniques des figures J/Q/K** dans toutes les zones autorisées : pioche, figures extérieures vivantes ou vaincues, éventuelle carte courante et zone de transit reconnue. Vérifier également qu'une figure n'est ni dupliquée, ni comptée simultanément dans deux zones, ni simplement omise d'un instantané.
2. Si l'état correspond à une **opération légalement en cours** (ex. figure déjà révélée, pose à compléter), traiter ou reprendre cette opération suivant son contrat **atomique**, sans comptabiliser à tort une disparition ou provoquer un second tirage.
3. Si l'invariant est rompu, passer à un **état d'erreur d'intégrité non terminal** : ne pas piocher, ne pas attribuer d'armure, ne pas dépenser d'As/Joker, ne pas remélanger, ne pas créer artificiellement de figure et **ne pas enregistrer une victoire ou une défaite**.
4. **Préserver la preuve** : conserver, autant que le stockage disponible le permet, l'instantané problématique et un diagnostic factuel non sensible (état de recherche, emplacement attendu, cartes physiques présentes/manquantes/dupliquées, version de sauvegarde, identifiant d'opération), sans remplacer silencieusement une sauvegarde valide par un état corrompu.
5. **Reprise prudente :** lorsqu'un **dernier état valide déjà disponible** existe, proposer explicitement de repartir de cet état après validation de son intégrité ; **ne pas supposer** qu'une copie ou un historique de sauvegardes existe (le MVP conserve normalement une seule sauvegarde active par jeu). En l'absence d'état valide vérifiable, signaler l'impossibilité de reprendre cette partie sans inventer une restauration.
6. **Statistiques :** une erreur d'intégrité **ne compte ni comme défaite, ni comme abandon, ni comme victoire**, et ne doit pas modifier les statistiques personnelles. Un nouvel essai de lecture ou une reprise ne duplique aucun résultat.
7. **Conserver la distinction** entre une **pioche normalement épuisée** avec des figures vivantes ou des recours encore utilisables et cette situation d'anomalie pendant la recherche. Les règles officielles de défaite pour armure impossible ou impasse légale restent applicables à une partie intègre et ne sont pas annulées par GC-12.
8. **Contrôles préventifs :** exiger l'unicité des douze figures lors de la création et de la sauvegarde/reprise, l'absence de figures dans les piles numériques extractibles et la cohérence des cartes dans les zones temporaires. Le moteur doit pouvoir distinguer une condition de victoire (douze figures vaincues) d'une absence anormale de figure.
9. **Hors périmètre :** GC-12 ne décide ni d'une récupération automatique depuis une infrastructure inexistante, ni d'un statut de jeu « définitivement perdu » imputé au joueur ; il ne définit pas les détails de l'interface d'assistance ou de l'export de diagnostic au-delà des invariants fonctionnels.

**Exemple :** le compteur affiche **8/12 figures vaincues**, **aucune figure vivante**, **aucune figure en pioche ni en transit**, et la pioche est vide. Le moteur signale « État de la partie incohérent » et **n'enregistre pas de défaite**. Il conserve l'état pour diagnostic et n'offre une reprise que si un état antérieur valide existe réellement.

**Statut : GC-12 / G-05 (sous-cas d'incohérence) CLOS pour CardForge.** La conservation physique des douze figures découle des règles retenues ; le traitement d'une sauvegarde incohérente relève de la **résilience technique CardForge**, et non d'une règle de victoire/défaite nouvelle attribuée à Tom Francis. Aucun test logiciel, restauration ou audit de code n'a été exécuté à cette étape.

### 26.1. Scénarios de conformité — GC-12

| Test | Situation | Résultat attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T117 | 8 figures vaincues, aucune vivante, pioche vide, 4 figures introuvables dans les zones autorisées | Anomalie d'intégrité, **aucune défaite**, aucune carte inventée | Spécifié, non exécuté |
| GC-V2-T118 | 11 figures vaincues, 0 vivante, dernière figure déjà révélée mais dans une transaction de pose persistée | Reprendre/terminer la pose atomique, pas de faux signal de figure perdue | Spécifié, non exécuté |
| GC-V2-T119 | Une figure physique présente deux fois (pioche et emplacement extérieur) | Détection de doublon, progression protégée | Spécifié, non exécuté |
| GC-V2-T120 | Une figure physiquement manquante dans une sauvegarde locale | Diagnostic d'invariant, aucune création/remélange automatique | Spécifié, non exécuté |
| GC-V2-T121 | Fin de pioche alors qu'une figure vivante reste sur le plateau | Ne pas traiter comme GC-12 ; évaluer les règles normales de recours/défaite | Spécifié, non exécuté |
| GC-V2-T122 | Douze figures vaincues, pioche vide | Victoire immédiate, pas de recherche ni d'anomalie GC-12 | Spécifié, non exécuté |
| GC-V2-T123 | Extraction légale d'une pile numérique avec conservation des figures extérieures | Les douze figures restent comptées, aucune anomalie de figure | Spécifié, non exécuté |
| GC-V2-T124 | Anomalie détectée avec actions spéciales encore disponibles | Pas de dépense forcée, pas de figure artificielle, pas de fausse défaite | Spécifié, non exécuté |
| GC-V2-T125 | Erreur d'intégrité suivie d'un rechargement | Diagnostic reproductible et aucun résultat ou compteur statistique ajouté | Spécifié, non exécuté |
| GC-V2-T126 | Dernier état valide réellement conservé et vérifiable | Proposer sa reprise de façon explicite, sans restauration silencieuse | Spécifié, non exécuté |
| GC-V2-T127 | Aucun dernier état valide disponible, une seule sauvegarde active corrompue | Ne pas promettre une récupération automatique ; signaler la limite | Spécifié, non exécuté |
| GC-V2-T128 | Situation de recherche avec cartes numériques temporaires et actions spéciales en réserve | Contrôler les zones sans supposer qu'elles peuvent contenir des figures ; aucune perte de cartes physiques | Spécifié, non exécuté |
| GC-V2-T129 | Répétition du même contrôle d'intégrité sur une partie incohérente | Résultat stable, pas de nouvelle mutation, score et statistiques inchangés | Spécifié, non exécuté |

**Prochain arbitrage GC-13 / interaction G-01b–G-02 :** si une **figure doit apparaître** mais que les seuls emplacements extérieurs libres sont adjacents à des **cases périphériques vides après Extraction**, toutes les cartes périphériques réellement visibles ont leurs emplacements adjacents occupés. GC-01/GC-02 excluent les cases vides des candidats ; **aucun placement admissible n'est alors défini**, bien que des places extérieures restent disponibles. Il s'agit d'une **impasse légale potentiellement atteignable**, à distinguer de la corruption GC-12.


## 27. Décision fonctionnelle Gridcannon V2 — GC-13 / interaction G-01b–G-02 : placement de secours d'une figure

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Si une nouvelle figure doit être placée autour de la grille, le moteur applique **d'abord intégralement GC-01 et GC-02** : recherche parmi les **cartes visibles des huit cases périphériques** et choix du meilleur rang de similitude **disposant d'au moins une place extérieure adjacente libre**. **Uniquement si aucune de ces candidates ne possède de destination admissible**, alors qu'**au moins un emplacement extérieur reste libre**, CardForge autorise **en dernier recours** le placement de la figure dans **n'importe quelle place extérieure encore libre**, au **choix du joueur**, même si cette place ne jouxte qu'une case périphérique vide à la suite d'une Extraction.

**Contrat métier et périmètre :**
1. Une figure nouvellement apparue reste une **carte physique unique** : ne pas la laisser occuper plusieurs emplacements ; conserver sa valeur, son enseigne, son armure initiale et son identité.
2. Calculer les placements normaux sans changer les priorités **même enseigne → même couleur → valeur supérieure**, ni le périmètre **huit cases périphériques** (GC-01). Une carte du centre ne devient jamais attractive ; une case périphérique vide après Extraction n'est **pas** transformée en carte fictive de valeur zéro (GC-03).
3. Exclure des destinations disponibles toutes les places extérieures déjà occupées, y compris par des **figures vaincues face cachée** ; ne jamais déplacer automatiquement une figure déjà placée (GC-02).
4. **Si au moins une destination normale existe**, même chez une carte moins semblable que d'autres candidates bloquées, **appliquer exclusivement GC-02** : l'exception de secours **reste interdite**.
5. **Si aucune destination normale n'existe**, mais qu'au moins une des **douze places extérieures** est libre, activer le **mode de placement de secours**. Proposer au joueur **l'ensemble des places extérieures réellement libres**, sans leur attribuer de rang fictif de couleur/enseigne/valeur ; aucune place occupée n'est proposée.
6. En cas de plusieurs places extérieures libres, **laisser le joueur choisir** : ne pas imposer le premier emplacement dans un ordre technique, ne pas proposer de tirage aléatoire et ne pas déplacer automatiquement la figure vers une autre case.
7. Une fois le choix validé, la figure occupe cette place et reste là pour le reste de la partie, y compris après défaite. Son comportement de résistance, d'armure, de tir et de victoire reste **inchangé**. La provenance « secours » peut être enregistrée à titre de diagnostic, mais elle n'ajoute aucune capacité à la carte.
8. Cette exception peut intervenir **à la mise en place** ou lors des apparitions ultérieures si son prédicat est satisfait, sans exiger que la cause soit forcément une Extraction ; les cas classiques avec grille complète continuent à privilégier les candidats normaux.
9. Si **aucune place extérieure n'est libre**, ne pas forcer la figure sur une position occupée. Un tel état avant placement des douze figures nécessite une **vérification de cohérence/transaction**, sans lui attribuer automatiquement une condition de défaite ; ce sous-cas n'est pas décidé par GC-13.
10. La phase de choix doit être **sauvegardable** : conserver la figure en cours, l'ensemble déterministe des emplacements libres, le fait que le mode secours a été déclenché et la destination validée. Une reprise ou un double clic ne doit ni replacer ni dupliquer la figure ni déclencher deux fois la même action.
11. **Statut de provenance :** cette exception de dernier recours est une **décision fonctionnelle CardForge**, et **non** une règle explicitement confirmée par Tom Francis dans la Version 2. Elle ne doit jamais être généralisée à un choix libre en présence d'une destination de similitude valable.

**Exemple :** onze emplacements extérieurs sont occupés (les figures vaincues les occupent toujours) ; seul un emplacement extérieur reste libre, mais il est adjacent à une **case périphérique vide** dont la pile a été extraite. Toutes les cartes périphériques visibles n'ont plus de place adjacente libre. La figure nouvellement révélée est alors placée **dans la dernière place libre** par l'exception GC-13, sans carte attractive inventée et sans défaite artificielle.

**Statut : GC-13 / G-01b–G-02 CLOS pour CardForge.** Test de conformité du moteur **non exécuté** ; l'implémentation et la compatibilité complète avec la conception graphique restent à valider.

### 27.1. Scénarios de conformité — GC-13

| Test | Situation | Attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T130 | Onze emplacements extérieurs occupés ; seule place libre adjacente à une case périphérique vidée par Extraction | Placement de secours dans cette place, **sans défaite** | Spécifié, non exécuté |
| GC-V2-T131 | Aucune candidate périphérique visible avec voisin extérieur libre ; deux places extérieures libres | Joueur choisit **l'une des deux places réellement libres** | Spécifié, non exécuté |
| GC-V2-T132 | Meilleure candidate périphérique bloquée ; seconde candidate visible avec voisin libre | **GC-02 s'applique**, pas de placement de secours | Spécifié, non exécuté |
| GC-V2-T133 | Candidate visible moins semblable avec place libre ; place extérieure ailleurs uniquement adjacente à une pile vide | Utiliser la candidate visible disponible, exception refusée | Spécifié, non exécuté |
| GC-V2-T134 | Centre occupé par carte parfaitement similaire ; périphérie sans destination normale | Le centre ne devient pas attractif ; secours sur une place extérieure libre | Spécifié, non exécuté |
| GC-V2-T135 | Place extérieure bloquée par une figure vaincue face cachée | Ne jamais proposer cette place parmi les choix de secours | Spécifié, non exécuté |
| GC-V2-T136 | Plusieurs places libres en mode secours, aucune préférence exprimée | Aucune place choisie automatiquement, aucune figure aléatoire | Spécifié, non exécuté |
| GC-V2-T137 | Figure placée en secours puis vaincue par un tir ultérieur | Figure reste définitivement dans son emplacement, comme toute autre figure | Spécifié, non exécuté |
| GC-V2-T138 | Cas de secours pendant la mise en place où aucune destination normale n'existe, mais une place extérieure est libre | Même dernier recours, sans activer l'exception s'il existe un candidat normal | Spécifié, non exécuté |
| GC-V2-T139 | Figure en attente, douze places extérieures déjà occupées | **Pas de chevauchement** ; signaler l'impasse pour analyse d'intégrité/transaction, sans défaite inventée | Spécifié, non exécuté |
| GC-V2-T140 | Sauvegarde en cours de choix de secours puis reprise | Même figure et même liste de places légales ; un seul placement définitif | Spécifié, non exécuté |
| GC-V2-T141 | Figure nouvellement révélée, puis action répétée ou double clic sur une place de secours | Aucun doublon de figure ou de position, statistiques inchangées | Spécifié, non exécuté |

**Prochain arbitrage proposé GC-14 :** la **faculté de remplacer une carte de la grille immédiatement après la mise en place initiale**, documentée au §2, n'a pas encore un contrat de traitement complet. Si le joueur choisit de remplacer l'une des neuf cartes et pioche d'abord une **figure, un As ou un Joker**, faut-il continuer jusqu'à une **carte numérique de remplacement**, traiter les cartes intermédiaires comme pendant la mise en place, ou annuler l'échange ? Le remplacement initial facultatif et son séquencement doivent être précisés sans ajout de capacités tactiques nouvelles.


## 28. Décision fonctionnelle Gridcannon V2 — GC-14 : tirages successifs pendant le remplacement initial facultatif

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Après la **mise en place initiale** de Gridcannon Version 2, le joueur peut choisir de **remplacer une seule carte numérique** de la grille 3 × 3 (ou renoncer à cette faculté). La carte sélectionnée quitte la grille et rejoint **face cachée le bas de la pioche**. Le moteur poursuit alors les tirages **jusqu'à obtenir une carte numérique 2–10** destinée à remplir la case temporairement vide. Les éventuelles **figures J/Q/K tirées avant cette numérique sont mises temporairement en attente** ; les **As et Jokers** rencontrés sont placés **immédiatement, face visible et non dépensés, dans la réserve d'actions spéciales**. **Après** réoccupation de la case par la carte numérique, les figures provisoirement retenues sont placées autour de la grille selon les règles de figure **GC-01/GC-02** et, seulement si nécessaire, le placement de secours **GC-13**.

**Contrat métier CardForge :**
1. **Déclencheur facultatif unique :** offrir le remplacement après la préparation des neuf cases numériques et la mise en place des figures déjà rencontrées. L'utilisateur peut ignorer ce droit ; aucune carte n'est déplacée sans confirmation de la case à remplacer. **Un remplacement au maximum** dans cette séquence initiale ; il ne s'agit pas d'un pouvoir réutilisable à chaque tour.
2. **Retrait de la carte :** prendre **uniquement la carte réelle sélectionnée** de la grille initiale (neuf cases à ce stade), la replacer **face cachée sous la pioche** en préservant son identité physique ; la case concernée reste **temporairement vide** jusqu'au tirage numérique de remplacement. Aucune carte supplémentaire n'est créée et les autres cases de la grille ne sont pas affectées.
3. **Parcours des tirages :** tirer successivement du haut de la pioche jusqu'à révéler une **première carte numérique 2–10** ; celle-ci devient la nouvelle carte de la case cible. Il n'est **pas nécessaire** de comparer sa valeur avec celle de la carte retirée, car il s'agit de **remplacer une carte**, pas d'empiler une carte selon la règle ordinaire de placement sur une pile occupée. Si la carte initialement remise sous la pioche devait finalement être celle repiochée, conserver l'identité et le déroulement réel, sans relancer une seconde tentative gratuite.
4. **Figure intermédiaire :** ne placer **aucune figure révélée durant le tirage de remplacement** tant que la case cible est vide ; les retenir dans une **liste chronologique de figures en attente** pour que leur placement s'effectue sur une **grille à nouveau complète**. Après réception du numérique de remplacement, traiter les figures conservées **dans leur ordre de rencontre** en utilisant les règles normales de similitude, de cases disponibles et de placement de secours.
5. **As ou Joker intermédiaire :** mettre **immédiatement en réserve** face visible et **non dépensé** ; la carte ne rejoint pas le groupe de figures en attente, ne remplace pas la case et n'est pas placée sous la pioche. Aucun As/Joker n'est automatiquement activé par sa découverte.
6. **Sans numéro encore obtenu :** continuer le parcours du paquet ; ne pas conclure prématurément à l'annulation de l'échange parce que la première carte est une figure ou une action spéciale. **Pioche vide avant tout numérique et case toujours vide** : état exceptionnel à traiter par un contrôle des cartes et de la transition ; GC-14 n'autorise **ni carte fictive, ni deuxième échange, ni défaite inventée**.
7. Le remplacement de mise en place **n'est pas assimilé** aux tirages de recherche **GC-06/09/10**, dans lesquels les **numériques** sont temporisées. Ici les **figures** sont temporisées jusqu'au premier **numérique** ; les cartes intermédiaires ne doivent pas être injectées à tort dans le circuit de GC-10.
8. Le traitement des **tirs éventuellement déclenchés par la pose de la nouvelle carte numérique de remplacement** fait l'objet d'un arbitrage indépendant (**GC-15**) ; GC-14 ne doit pas décider silencieusement si cette pose initiale compte comme une attaque normale. Le comportement autorisé d'autres actions spéciales activées volontairement **pendant cette sous-phase de remplacement** n'est pas étendu par la seule présente décision.
9. **Sauvegarde et reprise déterministes :** mémoriser le fait que le droit de remplacement a été exercé ou refusé, la case cible, la pioche modifiée, les identifiants des figures temporairement rencontrées dans leur ordre, les actions spéciales obtenues, l'étape d'attente d'une numérique et la résolution des placements ultérieurs. Prévenir les retraits et placements doublés en cas d'interruption ou de double clic.

**Exemple :** après mise en place, le joueur remplace **6♥** : la carte est transférée au bas de la pioche, sa case devient temporairement vide ; le tirage rencontre successivement **Q♣**, **A♠**, puis **9♦**. La **Dame** attend, l'**As** rejoint la réserve face visible sans être dépensé, le **9♦** remplit la case du **6♥** ; ensuite la **Dame** est placée suivant les règles normales d'attraction ou leur dernier recours. Le remplacement initial est alors **consommé**.

**Statut : GC-14 CLOS pour CardForge.** La possibilité de remplacer une carte pendant la préparation est attestée par le référentiel Version 2 ; **le détail de la traversée des tirages et de la mise en attente des figures constitue un arbitrage produit approuvé**, et non une séquence littéralement vérifiée auprès de Tom Francis. Aucune exécution de moteur ou validation logicielle n'a été réalisée.

### 28.1. Scénarios de conformité — GC-14

| Test | Situation | Attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T142 | Joueur refuse le remplacement initial | Grille, pioche et réserve inchangées ; phase de jeu normale | Spécifié, non exécuté |
| GC-V2-T143 | Remplacement de 6♥ ; première carte tirée 9♦ | 6♥ rejoint le bas de la pioche ; 9♦ occupe la case vidée ; un seul remplacement | Spécifié, non exécuté |
| GC-V2-T144 | Après retrait de 6♥, tirage Q♣, A♠, 9♦ | Q♣ temporairement écartée ; As en réserve non dépensé ; 9♦ posé, puis Q♣ placée | Spécifié, non exécuté |
| GC-V2-T145 | Tirage de deux figures distinctes avant la première numérique | Deux figures en attente, puis placements dans leur ordre de rencontre après restauration de la grille complète | Spécifié, non exécuté |
| GC-V2-T146 | As puis Joker rencontrés avant la numérique | Les deux actions spéciales entrent en réserve, sans consommation ni remplacement de grille | Spécifié, non exécuté |
| GC-V2-T147 | Carte de remplacement numérique de valeur inférieure à la carte initialement retirée | Remplacement de case accepté : **pas une pose sur une pile occupée** | Spécifié, non exécuté |
| GC-V2-T148 | Figures intermédiaires, première numérique enfin trouvée | Les figures sont attirées **après** remplissage de la case, avec GC-01/02/13 | Spécifié, non exécuté |
| GC-V2-T149 | Figure intermédiaire dont la meilleure attraction serait la case temporairement vide | Aucun placement prématuré ; recalcul avec la nouvelle carte numérique après réoccupation | Spécifié, non exécuté |
| GC-V2-T150 | Le joueur tente un second remplacement après le premier | Refuser : faculté initiale unique épuisée | Spécifié, non exécuté |
| GC-V2-T151 | Remplacement facultatif, ancienne carte au bas de la pioche finalement repiochée comme première numérique disponible | Identité conservée, pas de tirage supplémentaire ni reroll | Spécifié, non exécuté |
| GC-V2-T152 | Sauvegarde pendant l'attente d'une numérique, avec deux figures retenues et un As découvert | Reprise exacte de la grille, de l'ordre des figures et de la réserve ; aucune carte dupliquée | Spécifié, non exécuté |
| GC-V2-T153 | Pioche épuisée avant qu'une numérique ne remplisse la case | Cas limite signalé sans création artificielle de carte, défaite ajoutée ou réinitialisation tacite du remplacement | À vérifier par invariant, non exécuté |

**Prochaine décision GC-15 :** la carte numérique **posée comme remplacement initial** peut se trouver en bordure, face à une figure déjà présente. Doit-elle **déclencher des tirs comme une pose ordinaire** (avec éventuellement les deux axes d'un coin), ou le remplacement reste-t-il une opération de préparation **sans attaque** ? Le référentiel documente la faculté de remplacement mais ne confirme pas explicitement l'application des tirs à cette sous-phase.


## 29. Décision fonctionnelle Gridcannon V2 — GC-15 : absence de tir pendant le remplacement initial

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Le **remplacement facultatif d'une carte de la grille pendant la mise en place** défini par **GC-14** est une opération de **préparation** : la carte numérique de remplacement est posée dans sa case **sans déclencher de tir**, même si elle se trouve en bordure ou dans un coin et que des figures ennemies ont déjà été placées aux extrémités de la ligne ou de la colonne. La règle de double tir simultané **GC-04** ne s'applique qu'aux **poses de jeu susceptibles de tirer** ; la simple complétion du remplacement préparatoire ne constitue pas une attaque.

**Contrat fonctionnel CardForge :**
1. **Phase :** le drapeau de préparation reste actif depuis l'offre de remplacement initial jusqu'au **refus explicite** du remplacement ou à sa **complétion entière** (case numérique reconstituée, puis figures temporairement mises en attente placées conformément à GC-14). La prise d'une nouvelle carte pendant cette sous-phase n'est pas une pose ordinaire d'un tour de jeu.
2. **Pose de remplacement sans tir :** lorsqu'une carte numérique est obtenue après les tirages intermédiaires de GC-14, elle prend la place de la carte retirée ; son insertion ne déclenche **aucun calcul de puissance, aucune attaque horizontale ou verticale et aucune élimination**, quelle que soit la case (coin, bordure ou centre).
3. **Figures initiales déjà présentes :** une figure éventuellement alignée et vulnérable demeure **vivante et inchangée** ; la carte de remplacement seule ne peut pas la vaincre. Les chiffres de résistance, armure et compteurs de figures vaincues ne sont pas modifiés par cette substitution.
4. **Figures révélées durant le remplacement :** les placer **après reconstitution de la grille**, dans l'ordre prévu par GC-14, avec les règles de position GC-01/02 et secours GC-13 ; leur placement ne déclenche pas rétroactivement un tir de la carte de remplacement contre une figure nouvellement installée.
5. **Fin de préparation :** lorsque l'opération facultative est entièrement résolue (ou refusée), le moteur passe au **cycle normal**. Les poses numériques **ultérieures** doivent alors déclencher les attaques légales, et en coin les deux axes calculés selon GC-04 ; aucun tour d'attaque supplémentaire n'est offert gratuitement lors de la transition.
6. La dispense de tir **ne s'étend pas aux actions normales du joueur une fois la partie commencée**, même si elles ont lieu immédiatement après le remplacement. Cette décision ne change aucune condition de victoire, défaite, score, figure ou armure.
7. Les As et Jokers éventuellement **révélés pendant GC-14** rejoignent la réserve, mais le **droit de les activer volontairement au cours de la préparation encore inachevée** reste explicitement **ouvert sous GC-16**. GC-15 n'invente pas une permission ni une interdiction de Réaffectation pendant cette sous-phase.
8. **Sauvegarde/reprise :** conserver le statut préparatoire, la carte numérique posée, la file éventuelle des figures à placer et le fait que **l'événement de tir est désactivé pour la pose de remplacement**. Ne jamais produire une attaque différée ou rejouer une élimination à la reprise.

**Exemple :** une case en coin contient une carte remplacée ; une figure vivante est déjà située en face sur l'axe horizontal, une autre peut être présente sur l'axe vertical. Le joueur remplace cette carte par **9♦** et les deux sommets intermédiaires seraient normalement assez puissants pour vaincre les figures. **Aucune figure n'est attaquée**, car il s'agit d'un remplacement de préparation. Une **pose ordinaire ultérieure** sur une position d'extrémité déclenche de nouveau les tirs réglementaires.

**Statut : GC-15 CLOS pour CardForge.** L'interdiction des tirs pendant ce remplacement est un **arbitrage de phase approuvé par le porteur**, pas une précision explicitement confirmée du règlement publié par Tom Francis. Tests documentés ci-dessous, **non exécutés**.

### 29.1. Scénarios de conformité — GC-15

| Test | Situation | Attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T154 | Remplacement initial en bordure, tir théoriquement suffisant contre figure vivante | Aucun tir, aucune figure vaincue | Spécifié, non exécuté |
| GC-V2-T155 | Remplacement initial dans un coin, deux tirs théoriquement suffisants | Aucun tir horizontal ni vertical ; pas de double attaque GC-04 | Spécifié, non exécuté |
| GC-V2-T156 | Remplacement initial au centre de la grille | Pose préparatoire sans tir, comme ailleurs | Spécifié, non exécuté |
| GC-V2-T157 | Remplacement initial avec puissance insuffisante | Aucune évaluation de tir ; nouvelle carte conservée | Spécifié, non exécuté |
| GC-V2-T158 | Figure Q♣ rencontrée pendant tirage de remplacement puis placée après la nouvelle numérique | Pas de tir rétroactif de la nouvelle carte contre Q♣ | Spécifié, non exécuté |
| GC-V2-T159 | Deux figures retenues pendant l'opération initiale puis placées | Figures restent vivantes ; pas d'attaque de préparation sur aucun axe | Spécifié, non exécuté |
| GC-V2-T160 | Joueur refuse le remplacement initial, puis effectue une pose numérique normale en bordure | Tirs normaux actifs à partir du jeu réel | Spécifié, non exécuté |
| GC-V2-T161 | Joueur valide le remplacement puis pioche une numérique au premier tour | La **pose de jeu ultérieure** peut tirer selon les règles habituelles | Spécifié, non exécuté |
| GC-V2-T162 | Sauvegarde pendant l'attente d'une numérique de remplacement puis reprise | Phase préparatoire rétablie ; pas d'attaque sur insertion de la numérique | Spécifié, non exécuté |
| GC-V2-T163 | Sauvegarde après insertion de la nouvelle carte mais avant placement des figures en attente | Aucune attaque différée ; reprise des placements de figures uniquement | Spécifié, non exécuté |
| GC-V2-T164 | Dernière figure initiale placée et sortie de préparation | Aucun tir rétroactif ni victoire artificielle à la transition | Spécifié, non exécuté |

**Prochain arbitrage GC-16 :** si un As ou un Joker a été révélé et mis en réserve pendant la mise en place ou pendant le **remplacement facultatif GC-14**, peut-on **activer volontairement une action spéciale alors que ce remplacement n'est pas encore terminé** (case provisoirement vide, figures en attente) ? Distinguer cette sous-phase préparatoire du droit déjà validé en **GC-11** d'utiliser des actions pendant la recherche d'une nouvelle figure **en cours de partie**.


## 30. Décision fonctionnelle Gridcannon V2 — GC-16 : activer les actions spéciales seulement après la préparation complète

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Les As et Jokers révélés pendant la mise en place initiale et le remplacement facultatif **GC-14** rejoignent **immédiatement la réserve**, face visible et **non dépensés**. **Ils ne peuvent pas être activés tant que la préparation n'est pas entièrement terminée**, y compris lorsqu'une case de la grille est temporairement vide ou que des figures piochées pendant le remplacement attendent d'être placées. L'activation volontaire de toute action spéciale devient disponible **seulement après clôture de la préparation et entrée en phase de jeu**.

**Contrat métier et séquencement :**
1. La **préparation** comprend la construction de la grille de neuf cartes numériques, le placement des figures révélées lors de cette construction, l'offre explicite du **remplacement initial unique et facultatif**, puis, s'il est choisi, la restitution de la carte remplacée sous la pioche, les tirages successifs jusqu'à une numérique remplaçante, et enfin le placement des figures temporairement retenues (**GC-14**).
2. Les As/Jokers découverts pendant cette période sont bien **présents et visibles dans la réserve** conformément aux règles de mise en place et à GC-14, mais restent **désactivés pour l'usage** jusqu'à la fin de la préparation. Leur statut de carte reste **disponible et non dépensé**, distinct de la permission de l'activer à cet instant.
3. Pendant la préparation, aucune **Extraction** ni **Réaffectation** volontaire n'est acceptée, que la grille soit complète ou temporairement incomplète. Une tentative ne doit **ni consommer** de carte spéciale ni modifier le plateau, la pioche, les figures en attente ou la réserve.
4. Une fois les neuf cases reconstituées et **toutes les figures en attente placées légalement**, ou après le refus du remplacement, effectuer **une seule transition de phase** « préparation terminée → partie en cours ». Les actions spéciales déjà découvertes deviennent alors activables, sous réserve de leurs conditions normales de légalité. La permission d'action ne nécessite aucun tirage artificiel.
5. Les règles **GC-15** demeurent strictes : la pose de la numérique de remplacement ne déclenche **aucun tir** ; la clôture de préparation ne déclenche **aucune attaque rétroactive** contre les figures déjà installées. Les actions spéciales jouées **après cette clôture** et les poses de jeu ultérieures suivent les tirs normaux, dont GC-04.
6. **GC-11 reste inchangé :** en **cours de partie**, pendant la recherche d'une nouvelle figure après élimination des figures vivantes, le joueur peut activer volontairement des As/Jokers. Cette recherche de figure en partie **n'est pas** une nouvelle phase de préparation.
7. L'interface doit distinguer le statut « **en réserve / non dépensé** » du droit « **activable à cet instant** » : montrer la carte comme acquise, mais indiquer l'indisponibilité temporaire de son activation, sans simuler une action réussie ou effacer sa présence.
8. La sauvegarde/reprise conserve la phase, la présence des actions dans la réserve, leurs identifiants et état dépensé/non dépensé, la case à remplacer, les figures retenues et la clôture de préparation. Les tentatives répétées et doubles clics ne doivent provoquer aucune transition prématurée, dépense ni tir.
9. **La partie commence** une fois les choix de préparation terminés, sans offrir d'action supplémentaire gratuite, ni retirer les actions spéciales obtenues. Les conditions de score **GC-08** comptent seulement les As/Jokers effectivement non dépensés à la victoire, y compris ceux obtenus durant la préparation.

**Exemple :** lors du remplacement initial du 6♥, une Dame puis un As sont révélés avant le 9♦ remplaçant. L'As rejoint aussitôt la réserve, **sans être utilisable pendant le remplacement**. Le 9♦ remplit la case **sans tir** (GC-15), puis la Dame est installée. Quand la préparation est entièrement terminée, l'As peut être volontairement utilisé pour une Extraction légale.

**Statut : GC-16 CLOS pour CardForge.** La séparation entre présence en réserve et droit d'activation durant la préparation est une **décision fonctionnelle CardForge**, et non une interdiction explicitement attribuée à Tom Francis. Aucune implémentation, exécution du moteur ou test UX n'a été effectuée.

### 30.1. Scénarios de conformité — GC-16

| Test | Situation | Attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T165 | As découvert pendant la construction des neuf cases | As immédiatement en réserve, non dépensé et activation indisponible pendant la préparation | Spécifié, non exécuté |
| GC-V2-T166 | Joker découvert pendant le remplacement initial GC-14 | Joker immédiatement en réserve ; impossible de déclencher une Réaffectation avant clôture | Spécifié, non exécuté |
| GC-V2-T167 | Case temporairement vide pendant le remplacement ; As disponible | Tentative d'Extraction refusée, As intact et pioche inchangée | Spécifié, non exécuté |
| GC-V2-T168 | Numérique de remplacement déjà posée, une figure tirée attend encore son placement | Actions spéciales encore non activables | Spécifié, non exécuté |
| GC-V2-T169 | Joueur refuse le remplacement initial après la mise en place | Transition de préparation terminée ; actions spéciales de la réserve deviennent activables | Spécifié, non exécuté |
| GC-V2-T170 | Remplacement achevé et dernière figure en attente légalement placée | Transition unique en phase de jeu, activation des actions spéciales permise | Spécifié, non exécuté |
| GC-V2-T171 | Carte de remplacement en coin, figures vivantes et As en réserve | Aucun tir ni dépense pendant préparation ; pas d'attaque rétroactive à la clôture (GC-15) | Spécifié, non exécuté |
| GC-V2-T172 | Phase de jeu active, recherche nouvelle figure GC-06 et As disponible | Action légale utilisable pendant la recherche, selon GC-11 ; ne pas réappliquer le verrou de préparation | Spécifié, non exécuté |
| GC-V2-T173 | Sauvegarde en plein remplacement avec deux cartes spéciales découvertes | Reprise avec cartes visibles non dépensées mais non activables tant que phase inachevée | Spécifié, non exécuté |
| GC-V2-T174 | Double clic sur action spéciale non activable ou sur transition de phase | Aucune dépense prématurée, duplication de transition ou mutation de grille | Spécifié, non exécuté |
| GC-V2-T175 | Victoire ultérieure avec cartes spéciales obtenues en préparation non dépensées | Compter ces cartes parmi les actions spéciales encore disponibles selon GC-08 | Spécifié, non exécuté |

**Prochain arbitrage GC-17 / G-06 :** choisir le **titre public distinct** de l'adaptation CardForge et la **formule de crédit à Tom Francis** dans la fiche du jeu, les règles, les écrans de jeu et les informations du projet. La publication de l'auteur encourage les adaptations, recommande un nom distinct de « Gridcannon » seul et un crédit explicite ; la **dénomination exacte de CardForge** n'est pas encore approuvée.


## 31. Décision de présentation Gridcannon V2 — GC-17 / G-06 : nom public provisoire et crédit à l'auteur

**Option A VALIDÉE avec réserve explicite par le porteur le 22 novembre 2026.** Le **nom public de travail** de l'adaptation spatiale de Gridcannon Version 2 dans CardForge est **« Bastion Stellaire »**, accompagné d'une **attribution explicite au jeu d'origine « Gridcannon » et à son auteur Tom Francis**. Ce **nom n'est pas définitif** : le porteur conserve **la possibilité de le changer ultérieurement**, avant ou après sa mise en œuvre, sans modification des règles, de l'identité logique de la partie, des sauvegardes ni des statistiques. La décision ne vaut **ni contrôle de disponibilité du nom, ni autorisation de marque, ni approbation juridique** de publication.

### 31.1. Exigences produit de présentation et d'évolution

1. **Nom d'affichage initial :** `Bastion Stellaire` (titre public **provisoire**, à confirmer avant diffusion). Ne pas l'utiliser comme clé technique pérenne.
2. **Identifiant métier stable :** conserver l'identité interne existante du jeu **Gridcannon Version 2** (ou sa clé technique déjà retenue par l'architecture) pour les règles, la sélection du moteur, la persistance, les historiques, les statistiques et la compatibilité des sauvegardes. **Un renommage ne crée pas de nouveau jeu ni de nouvelle partie.**
3. **Crédit obligatoire et lisible :** afficher au minimum la mention **« Adaptation du jeu de cartes Gridcannon, créé par Tom Francis. »** accompagnée, dans les informations/règles/crédits, du lien vers la publication primaire : https://www.pentadact.com/2019-08-20-gridcannon-a-single-player-game-with-regular-playing-cards/ .
4. **Points d'affichage :** nom public dans le catalogue, la fiche, les en-têtes de jeu, les règles/tutoriels et les supports publics pertinents ; crédit à l'auteur **visible et accessible** depuis la fiche, les règles et les crédits de l'application, sans imposer un texte permanent encombrant le plateau de jeu.
5. **Indépendance du visuel et des règles :** le nom public, les traductions et les textes de crédit relèvent des **métadonnées de présentation**, non du modèle de règles. Toute mise à jour du nom réutilise le même jeu, les mêmes cartes, illustrations sous réserve de leur propriété, statistiques, parties et états de sauvegarde.
6. **Internationalisation :** gérer le titre affiché et les formules de crédit dans les ressources de texte / catalogue adaptées aux langues de CardForge ; garder les **noms propres « Gridcannon » et « Tom Francis »** dans l'attribution. Un renommage public peut concerner les variantes linguistiques sans changer la clé métier.
7. **Renommage ultérieur :** un nouveau titre public pourra être soumis à validation du porteur puis propagé aux interfaces et documents publics. Éviter la duplication de la définition du titre dans le code ou des chemins de sauvegarde dépendant de la chaîne affichée ; conserver les liens internes pérennes si possible.
8. **Contrôle avant publication :** vérifier, sur autorisation expresse du porteur pour toute nouvelle recherche web avancée, les risques éventuels de conflit de nom, la cohérence des crédits, les ressources artistiques utilisées et les conditions de diffusion. **Aucune vérification externe supplémentaire n'a été réalisée pour « Bastion Stellaire »** ; son adoption comme **nom de travail** n'implique pas une disponibilité prouvée ni un dépôt de marque.
9. **Source et attribution :** la publication de Tom Francis encourage les adaptations et recommande l'identification de l'auteur et un titre distinct de « Gridcannon » seul. **Ce choix du nom, sa formulation française et sa réversibilité relèvent expressément de CardForge** ; ne pas confondre recommandation de l'auteur et garantie de droits sur le nom proposé.

**Statut : GC-17 / G-06 CLOS sur le principe de présentation et l'attribution ; TITRE PROVISOIRE et révisable.** Le choix définitif de la dénomination pour diffusion et les contrôles préalables restent à confirmer. **Aucun changement de code, recherche de disponibilité, vérification juridique ni test logiciel n'a été exécuté.**

### 31.2. Scénarios de conformité documentaire et produit — GC-17

| Test | Situation | Résultat attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T176 | Affichage catalogue de l'adaptation | Titre provisoire **Bastion Stellaire** ; identifiant interne du jeu inchangé | Spécifié, non exécuté |
| GC-V2-T177 | Consultation de la fiche et des règles | Crédit explicite à **Gridcannon** et **Tom Francis**, lien vers source primaire | Spécifié, non exécuté |
| GC-V2-T178 | Consultation des crédits de l'application | Attribution de l'œuvre originale accessible et non ambiguë | Spécifié, non exécuté |
| GC-V2-T179 | Choix ultérieur d'un nouveau titre public | Textes d'affichage mis à jour sans modification du moteur ni des règles | Spécifié, non exécuté |
| GC-V2-T180 | Renommage avec une partie sauvegardée en cours | Reprise de la même partie, sans migration destructive de clé de jeu | Spécifié, non exécuté |
| GC-V2-T181 | Renommage avec résultats historiques et statistiques | Historiques conservés sous la même identité métier | Spécifié, non exécuté |
| GC-V2-T182 | Application en FR/EN et traduction ultérieure | Titres/crédits gérés comme métadonnées de présentation ; noms propres de l'auteur et de l'œuvre préservés | Spécifié, non exécuté |
| GC-V2-T183 | Préparation d'une publication avec nom de travail non vérifié | Ne pas présumer disponibilité du nom ni validation juridique | À vérifier avant diffusion |
| GC-V2-T184 | Navigation depuis le catalogue vers le jeu après renommage | Liaison par identifiant stable, sans rupture de partie ou de route pérenne | Spécifié, non exécuté |

**Prochain arbitrage GC-18 / UX en jeu (suite GC-11, GC-V2-T116) :** comment rendre le mode **recherche d'une figure** compatible avec le droit validé du joueur d'**intervenir volontairement avec un As/Joker** avant la révélation de la nouvelle figure ? Le moteur doit prévoir des **points de décision réels** plutôt qu'un défilement automatique non interruptible.


## 32. Décision fonctionnelle Gridcannon V2 — GC-18 : recherche manuelle de figure, carte par carte

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Pendant le **mode de recherche de nouvelle figure** défini par **GC-06** (aucune figure vivante, moins de douze vaincues), le joueur révèle **une carte à la fois** grâce à une action explicite **« Carte suivante »**. Le moteur **ne déroule pas automatiquement toute la pioche** jusqu'à une figure. **Entre deux révélations**, le joueur peut consulter la réserve et **utiliser volontairement** tout As ou Joker légalement activable, conformément à **GC-11**, y compris les cartes spéciales découvertes au cours de la recherche selon **GC-09**.

### 32.1. Exigences fonctionnelles et d'interface

1. **Entrée en mode recherche :** après l'élimination de la dernière figure vivante, si **moins de douze figures sont vaincues**, basculer en mode recherche (GC-06). Si la douzième figure vient d'être vaincue, déclarer **immédiatement la victoire**, sans proposer de nouveau tirage.
2. **Rythme :** présenter une seule action manuelle **« Carte suivante »** autorisant la révélation **d'exactement une carte physique** depuis le haut de la pioche réelle. Ne jamais piocher implicitement la carte suivante après cette révélation, après une intervention spéciale ou après une reprise de sauvegarde.
3. **Numérique 2–10 :** lorsque la carte suivante est numérique, la retirer de la pioche et l'ajouter à la **séquence temporaire ordonnée** (GC-06/GC-10), **sans pose, armure, tir ou décision de destination**. Rendre à nouveau accessible « Carte suivante » après cette transition, avec possibilité de jouer une action spéciale avant le prochain tirage.
4. **As/Joker :** placer immédiatement et sans dépense la carte révélée dans la réserve (GC-09), puis revenir au point de décision : le joueur peut **utiliser ce nouvel As/Joker**, en activer un autre disponible, ou demander **« Carte suivante »**.
5. **Action spéciale volontaire :** permettre entre deux tirages toute Extraction/Réaffectation **légale**. Après résolution, revenir au **même point d'attente d'un tirage manuel**, avec la nouvelle configuration réelle de la grille et de la pioche ; ne pas déclencher de tirage ni réinjecter la séquence temporaire automatiquement. Les actions invalides ne consomment rien.
6. **Figure J/Q/K :** la découverte d'une figure met fin au défilement par « Carte suivante » ; passer au **choix/placement légal de cette figure** conformément à GC-01/02/13, avant de clore le mode recherche. Une fois la figure placée, **réinjecter les numériques traversées sous la pioche** selon GC-10 et reprendre le cycle normal. Ne pas révéler la carte suivant immédiatement la figure.
7. **Aucune figure à créer artificiellement :** si « Carte suivante » est impossible faute de carte restante alors que la recherche ne devrait pas être terminée, contrôler les invariants d'intégrité définis par GC-12 ; ne pas fabriquer une figure, autoriser un tirage vide ou compter une défaite fictive.
8. **Interface accessible et déterministe :** identifier clairement le mode **« Recherche de figure »**, l'action « Carte suivante », les cartes spéciales disponibles, et le fait qu'**aucun placement numérique normal n'est permis pendant cette phase**. La prise de décision est réelle, pas une simple animation impossible à interrompre. L'action doit être accessible au clavier et au tactile ; pas de mécanisme dépendant uniquement du survol.
9. **Aucun tirage supplémentaire lors d'une action spéciale :** une Extraction peut alimenter la pioche selon GC-05, un Joker peut modifier la grille ; seule une nouvelle **commande explicite** reprend l'avancement de la recherche.
10. **Persistance :** après **chaque action validée** (tirage, ajout en réserve, Extraction, Réaffectation, choix de figure), sauvegarder la phase, les cartes temporaires ordonnées, la pioche, les actions disponibles/dépensées et le point de décision. Le retour à l'application ne lance **aucun tirage automatique** ; deux clics concomitants ne doivent pas consommer deux cartes.
11. **Hors périmètre :** la **visibilité détaillée des cartes numériques temporairement écartées** et leur présentation après réinsertion, sans fuite d'informations futures, relève d'un arbitrage UX complémentaire **GC-19**. GC-18 impose le rythme et les points d'intervention, pas une présentation nouvelle du contenu futur de la pioche.

**Exemple :** aucune figure vivante, sept vaincues. Le joueur sélectionne « Carte suivante » : `4♣` est mise de côté. Il peut maintenant jouer un As ou continuer. Au clic suivant, il révèle `Joker`, qui rejoint sa réserve ; il peut **utiliser immédiatement ce Joker** avant de demander la prochaine carte. Il clique ensuite et trouve `Q♥` : la Dame est placée selon GC-01/02/13, les numériques écartées sont réintroduites selon GC-10 et la recherche s'achève. À aucun moment le moteur n'a pris plusieurs cartes sur une seule commande.

**Statut : GC-18 CLOS pour CardForge.** Le rythme de révélation **manuel carte par carte** est une **décision UX/produit**, conçue pour respecter le droit à intervenir déjà validé en GC-11. Il ne constitue pas une précision supplémentaire prétendument attribuée à Tom Francis. Aucun test logiciel ni parcours utilisateur n'a été exécuté.

### 32.2. Scénarios de conformité — GC-18

| Test | Situation | Attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T185 | Dernière figure vivante éliminée, moins de douze vaincues | Mode recherche actif, action **« Carte suivante »** disponible, aucun tirage automatique | Spécifié, non exécuté |
| GC-V2-T186 | Action « Carte suivante » avec numérique en tête | **Une seule carte** retirée de pioche et ajoutée à la zone numérique temporaire | Spécifié, non exécuté |
| GC-V2-T187 | Numérique écartée, As déjà disponible | Possibilité d'utiliser l'As ou de piocher une seule prochaine carte | Spécifié, non exécuté |
| GC-V2-T188 | As découvert sur commande manuelle | As immédiatement en réserve non dépensé ; attente de décision avant autre tirage | Spécifié, non exécuté |
| GC-V2-T189 | Joker découvert, utilisé légalement avant la commande suivante | Réaffectation validée, Joker consommé une fois, **aucun tirage automatique** | Spécifié, non exécuté |
| GC-V2-T190 | Extraction volontaire pendant recherche avec numériques écartées | Pioche augmentée selon GC-05, temporaires inchangées ; prochain tirage uniquement sur commande | Spécifié, non exécuté |
| GC-V2-T191 | Une figure est révélée par « Carte suivante » | Demander/traiter le placement de figure, ne pas révéler de carte supplémentaire | Spécifié, non exécuté |
| GC-V2-T192 | Placement de figure terminé après plusieurs numériques traversées | Réinjection des numériques selon GC-10, sortie de recherche et reprise normale | Spécifié, non exécuté |
| GC-V2-T193 | Sauvegarde alors qu'une numérique a été écartée et un Joker est disponible | Reprise sur le **même point d'attente** sans tirage automatique ni double crédit du Joker | Spécifié, non exécuté |
| GC-V2-T194 | Deux commandes « Carte suivante » déclenchées presque simultanément | Une seule transition de révélation acceptée pour le même état, aucun double tirage | Spécifié, non exécuté |
| GC-V2-T195 | Douzième figure vaincue, mode de recherche normalement envisagé | Victoire immédiate ; aucun bouton de recherche ni carte piochée | Spécifié, non exécuté |
| GC-V2-T196 | Pioche vide en recherche avant figure, moins de douze vaincues | Pas de tirage vide ; contrôles GC-12, aucune défaite fictive | Spécifié, non exécuté |
| GC-V2-T197 | Utilisation clavier / écran tactile pendant la recherche | « Carte suivante » et actions disponibles utilisables sans survol ni automatisme | À vérifier en test UX, non exécuté |

**Prochain arbitrage GC-19 :** durant la recherche **pas à pas**, faut-il montrer au joueur **les identités des cartes numériques déjà révélées et temporairement mises de côté**, leur nombre seulement, ou les masquer ? À la réinsertion, ces cartes deviennent de nouveau des cartes **face cachée sous la pioche** : leur présentation ne doit pas constituer une consultation illimitée des futurs tirages.


## 33. Décision d'ergonomie Gridcannon V2 — GC-19 : visibilité des numériques temporairement écartées

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Pendant la recherche **manuelle, carte par carte**, d'une nouvelle figure (**GC-18**), l'interface affiche une zone identifiée **« Cartes temporairement écartées »** présentant **les cartes numériques 2–10 déjà révélées, avec leur valeur et leur enseigne, dans l'ordre chronologique de révélation**. Cette zone est visible uniquement tant que le **mode recherche GC-06** est actif. Après révélation et **placement légal** de la nouvelle figure, les cartes numériques retournent **face cachée sous la pioche** dans leur ordre de rencontre (**GC-10**) et **la zone disparaît**. Le joueur ne peut ni manipuler ni réordonner les cartes de cette zone.

### 33.1. Contrat fonctionnel et UX

1. **Contenu affiché :** toutes les cartes physiques numériques **déjà** tirées depuis l'entrée dans la recherche en cours, dans l'ordre **première révélée → dernière révélée**, avec **valeur et enseigne** ; ne montrer aucune carte non encore tirée.
2. **Rôle de la zone :** un affichage **informatif et non interactif** de la liste temporaire réelle du moteur, en lecture seule ; pas de commande pour déplacer, trier, retourner, sélectionner comme cible d'action spéciale, jouer sur la grille ou remettre prématurément sous la pioche.
3. **Mise à jour :** après chaque « Carte suivante » révélant une **numérique** (GC-18), ajouter **exactement une** carte à la fin de la liste visible, sans réordonnancement. Si le tirage est un **As ou Joker**, la réserve se met à jour selon **GC-09**, mais la liste numérique **reste inchangée** ; si c'est une figure, le moteur engage sa pose légale.
4. **Actions spéciales pendant la recherche :** une Extraction ou Réaffectation **légalement exécutée** (GC-11) modifie la grille, la pioche ou la réserve selon sa propre règle, **sans modifier les cartes numériques déjà écartées ni leur ordre** ; celles-ci sont hors des piles cibles d'actions.
5. **Clôture :** lors de l'apparition d'une figure, il est possible que le moteur doive encore obtenir un **choix de placement** (GC-01/02/13). La zone de cartes écartées **reste liée à l'état de recherche et ne s'efface pas avant la validation complète de la pose**, suivie de la **réinsertion atomique** des numériques sous la pioche selon GC-10. Dès la réinsertion, la zone est vidée et **masquée**.
6. **Protection de l'information après réinsertion :** les cartes devenues **face cachée** ne sont plus affichées via cette zone, ni dans une liste consultable de futur ordre de pioche. L'interface ne prétend pas que le joueur a oublié ces cartes ; elle **ne maintient simplement pas de visualisation supplémentaire** de leur identité ou de leur position après leur retour au paquet.
7. **Recherche suivante :** créer une **nouvelle zone temporaire vide**, sans afficher les cartes écartées lors des recherches précédentes. Une nouvelle carte ne s'y ajoute que sur révélation effective pendant la recherche courante.
8. **Présentation adaptative :** prévoir une zone lisible et accessible sur bureau et mobile ; une présentation horizontale défilante ou réductible est acceptable **si** la liste complète, les valeurs et les enseignes restent consultables pendant la recherche sans perdre l'ordre, et **sans modification de l'état de jeu**.
9. **Sauvegarde/reprise :** ne pas créer de deuxième inventaire d'état divergent ; reconstruire la présentation depuis la **séquence temporaire ordonnée unique** persistée pour GC-06/10. La reprise en cours de recherche réaffiche exactement les cartes retenues ; la reprise après clôture n'affiche **aucune zone résiduelle** et ne révèle aucune carte future.
10. **Événements limites :** à la douzième figure vaincue, **GC-08** impose la victoire immédiate, sans nouvelle recherche ; en cas d'anomalie GC-12, ne pas effacer l'état temporaire avant sauvegarde/diagnostic. Si le mode recherche n'a encore révélé aucune carte numérique, une zone vide ou l'absence de son contenu est acceptable ; aucune carte fictive n'est représentée.

**Exemple :** en recherche, les tirages successifs `4♣`, `As♠`, `8♦`, `Joker`, `5♠`, `Q♥` entraînent l'affichage temporaire **[4♣, 8♦, 5♠]**, tandis que l'As et le Joker rejoignent la réserve. Après le placement légal de la Dame, **[4♣, 8♦, 5♠]** rejoint le dessous de la pioche dans cet ordre, face cachée, et la zone d'attente est masquée.

**Statut : GC-19 CLOS pour CardForge.** Il s'agit d'un **choix de présentation** qui respecte la connaissance acquise par révélation et les décisions GC-06/09/10/11/18, **sans revendiquer une règle originale supplémentaire de Tom Francis**. Aucun test moteur ou parcours UX n'a été exécuté.

### 33.2. Scénarios de conformité — GC-19

| Test | Situation | Attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T198 | Entrée en recherche, aucune numérique encore révélée | Zone identifiée, vide ou sans contenu fictif | Spécifié, non exécuté |
| GC-V2-T199 | Tirages `4♣`, puis `8♦`, puis `5♠` | Afficher **4♣ → 8♦ → 5♠** avec valeurs et enseignes | Spécifié, non exécuté |
| GC-V2-T200 | As et Joker tirés entre deux numériques | As/Joker en réserve ; liste numérique inchangée | Spécifié, non exécuté |
| GC-V2-T201 | Joueur tente de glisser ou jouer une numérique temporaire | Aucune pose, réorganisation ou dépense autorisée | Spécifié, non exécuté |
| GC-V2-T202 | Extraction légale exécutée durant la recherche | Liste numérique temporaire et son ordre inchangés | Spécifié, non exécuté |
| GC-V2-T203 | Figure révélée mais choix de position GC-13 encore en attente | Liste conservée tant que la figure n'est pas placée et le lot réinséré | Spécifié, non exécuté |
| GC-V2-T204 | Figure placée ; lot numérique réinjecté GC-10 | Liste effacée et zone masquée ; pioche face cachée, ordre interne inchangé | Spécifié, non exécuté |
| GC-V2-T205 | Joueur tente de consulter l'ancien lot depuis la pioche après réinsertion | Aucune vue supplémentaire de l'ordre futur face cachée | Spécifié, non exécuté |
| GC-V2-T206 | Deux recherches successives avec lots distincts | Seul le lot de la recherche courante s'affiche | Spécifié, non exécuté |
| GC-V2-T207 | Sauvegarde avec trois numériques temporaires puis reprise | Même liste visible, même ordre, aucune duplication de carte | Spécifié, non exécuté |
| GC-V2-T208 | Reprise après recherche terminée | Aucune ancienne liste affichée ni carte future révélée | Spécifié, non exécuté |
| GC-V2-T209 | Recherche sur petit écran, longue liste de numériques | Liste complète accessible dans l'ordre, sans altérer les actions « Carte suivante » et As/Joker | À vérifier en test UX, non exécuté |
| GC-V2-T210 | Tirage répété par erreur technique du même identifiant de carte | Une seule carte temporaire affichée, moteur cohérent avec le tirage réel | Spécifié, non exécuté |

**Prochain arbitrage GC-20 / fin de pioche en cours de jeu (G-05) :** lorsque la pioche est **vide** alors qu'au moins **une figure vivante subsiste**, faut-il **laisser le joueur utiliser ses actions spéciales légalement utiles** avant de prononcer une défaite, déclarer immédiatement une défaite, ou conserver indéfiniment la partie en attente ? Ce cas est **distinct de GC-12**, qui concerne une recherche sans figure vivante et des figures physiques introuvables.


## 34. Décision fonctionnelle Gridcannon V2 — GC-20 / G-05 : pioche vide avec figure(s) vivante(s)

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Si la **pioche est vide** alors qu'il reste **au moins une figure vivante**, le moteur **ne prononce pas immédiatement la défaite**. Il examine les **actions spéciales disponibles et légalement utiles** ; le joueur peut les utiliser volontairement avant tout verdict. Une **Extraction par As d'une pile numérique non vide** peut remettre des cartes au bas de la pioche (GC-03/05), puis permettre la reprise des tirages. Une **Réaffectation par Joker** peut, si le déplacement est légal, **déclencher un tir normal** ou permettre une suite réellement utile, même sans nouvelle carte à piocher. La **défaite d'impasse** ne peut être prononcée que lorsqu'**aucune continuation légale utile** ne peut plus permettre au joueur de progresser vers l'élimination des figures restantes, après considération des ressources réellement disponibles.

### 34.1. Contrat de fin de pioche CardForge

1. **Ordre de priorité des résultats :** si les douze figures ont été vaincues, appliquer immédiatement la victoire et le score GC-08 ; si une condition de défaite par **armure excessive** est déjà atteinte (J/Q ≥ 20, K ≥ 19), conserver cette règle. **La pioche vide ne constitue pas en soi un résultat terminal.**
2. **Cas concerné :** pioche de longueur zéro et **au moins une figure vivante**, en cours de partie et dans un état physiquement cohérent. Ne pas confondre ce cas avec la recherche sans figure vivante de **GC-06/12**, ni avec la phase de préparation **GC-14/16**.
3. **Extraction utile :** si un As est **non dépensé** et qu'au moins une **pile de grille non vide** peut légalement être extraite, le joueur doit pouvoir déclencher cette Extraction selon GC-03/05. Elle réapprovisionne effectivement la pioche et peut relancer le jeu ; le simple constat « zéro carte à piocher » ne doit ni bloquer l'As ni déclarer une défaite.
4. **Joker utile :** si un Joker non dépensé permet une **Réaffectation légale** susceptible de faire progresser la partie, par exemple une pose qui **déclenche un tir gagnant** (GC-04), proposer ce mouvement. Un Joker qui autorise seulement des déplacements stériles ne protège **pas indéfiniment** contre l'impasse.
5. **Légalité et utilité :** distinguer **action disponible** de **continuation utile**, selon l'esprit de GC-07. Évaluer les actions légales et, lorsqu'il faut combiner les ressources disponibles, leurs suites **finies et licites** ; ne pas imposer au joueur une séquence de déplacements qui n'a **aucun effet possible** sur la pioche ou les figures vivantes. Aucune dépense forcée et aucun chemin fictif de progression.
6. **Choix du joueur :** lorsque plusieurs recours utiles sont disponibles, le joueur choisit l'As, le Joker et leurs destinations légales ; aucune action spéciale n'est utilisée automatiquement. Après chaque action validée, recalculer l'état réel de la pioche, de la grille, des figures et des ressources.
7. **Reprise des tirages :** une fois la pioche réalimentée par Extraction, le joueur peut reprendre le cycle normal selon les mécanismes de pioche déjà approuvés ; les cartes reviennent **face cachée dans leur ordre GC-05**, sans mélange ni bonus de score. Un As dépensé ne compte plus dans le score GC-08.
8. **Défaite réelle par impasse :** si **aucune carte ne demeure en pioche**, **au moins une figure reste vivante**, et qu'aucune **suite d'actions spéciales légalement réalisable et utile** ne peut encore alimenter la pioche ou éliminer une figure, le moteur peut **terminer la partie par défaite d'impasse**. L'absence de résultat doit être établie sur les **vraies cartes et les vraies actions** ; ne pas assimiler automatiquement un Joker encore en réserve à une possibilité de victoire.
9. **Pas d'attente infinie :** si les seules actions techniquement légales sont des Réaffectations répétitives sans effet possible sur les figures ni sur la pioche, elles ne rendent pas la partie « non perdue » indéfiniment. Inversement, ne pas déclarer une impasse alors qu'une Extraction légale et réellement réapprovisionnante existe.
10. **État sauvegardé et statistiques :** conserver la possibilité de recours, la pioche vide, les ressources disponibles/dépensées et les figures vivantes. Une défaite d'impasse confirmée est enregistrée **une seule fois**, sans score officiel de victoire (GC-08), y compris après sauvegarde/reprise. Les vérifications d'état ne doivent jamais dépenser une ressource à la place du joueur.
11. **Réserve d'implémentation :** la détection de l'absence de **toute suite utile** doit être testée sur les situations combinatoires avec Joker. **GC-20 fixe l'exigence métier** ; aucune preuve algorithmique, performance de recherche de mouvements ou vérification complète du moteur n'est revendiquée ici.

**Exemple A — continuer :** il reste deux figures vivantes, **zéro carte en pioche**, un As intact et une pile numérique non vide. Le joueur peut extraire cette pile, consommer l'As, remettre ses cartes sous la pioche (GC-05) et reprendre les tirages. **Pas de défaite immédiate.**

**Exemple B — impasse :** pioche vide, une figure vivante, **aucun As disponible**, et un Joker qui ne peut produire ni tir utile ni suite utile selon les actions légales. La simple présence du Joker n'évite pas l'**impasse définitive** ; la défaite est alors enregistrée sans score de victoire.

**Statut : GC-20 / G-05 (sous-cas fin de pioche avec figure vivante) CLOS pour CardForge.** La possibilité d'utiliser les actions spéciales après épuisement de la pioche correspond au mécanisme étudié en Version 2 ; la **précision du critère de continuation utile** et son évaluation explicite sont des **arbitrages fonctionnels CardForge**, sans prétendre attribuer à Tom Francis cet algorithme exact. Aucun test du moteur ni recherche web supplémentaire n'a été exécuté.

### 34.2. Scénarios de conformité — GC-20

| Test | Situation | Résultat attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T211 | Pioche vide, figure vivante, As intact et pile non vide | Pas de défaite ; proposer Extraction légale | Spécifié, non exécuté |
| GC-V2-T212 | Extraction choisie après fin de pioche | As dépensé une fois ; pile entière sous la pioche selon GC-05 ; reprise possible | Spécifié, non exécuté |
| GC-V2-T213 | Pioche vide, figure vivante, Joker disponible, Réaffectation légale déclenchant un tir gagnant | Proposer cette Réaffectation, puis appliquer les tirs normaux | Spécifié, non exécuté |
| GC-V2-T214 | Pioche vide, figure vivante, aucun As/Joker et aucun tirage possible | Défaite d'impasse, enregistrée une fois | Spécifié, non exécuté |
| GC-V2-T215 | Pioche vide, seule ressource restante : Joker sans mouvement utile ni suite légale utile | Défaite d'impasse, malgré une carte spéciale non dépensée | Spécifié, non exécuté |
| GC-V2-T216 | Pioche vide et un As en réserve, mais toutes les piles de grille vides | Pas d'Extraction illégale ; évaluer les autres recours et l'impasse | Spécifié, non exécuté |
| GC-V2-T217 | Plusieurs actions utiles possibles, As et Joker | Choix du joueur, aucune dépense automatique | Spécifié, non exécuté |
| GC-V2-T218 | Joker inutile immédiatement, mais suite licite d'actions spéciales finit par réalimenter la pioche ou vaincre une figure | Ne pas annoncer prématurément la défaite ; considérer la suite utile | Spécifié, non exécuté |
| GC-V2-T219 | Pioche vide après victoire sur la douzième figure | Victoire GC-08 prioritaire ; aucune défaite d'impasse | Spécifié, non exécuté |
| GC-V2-T220 | Pioche vide, aucune figure vivante mais moins de douze vaincues | Appliquer GC-06/12 et invariants ; pas de fausse défaite GC-20 | Spécifié, non exécuté |
| GC-V2-T221 | Après Extraction puis victoire, trois actions spéciales non dépensées | Score officiel 3 selon GC-08 ; pas de pénalité de pioche | Spécifié, non exécuté |
| GC-V2-T222 | Défaite d'impasse, puis rechargement et nouvel événement de vérification | Une seule défaite enregistrée, aucun score officiel de victoire | Spécifié, non exécuté |
| GC-V2-T223 | Suite de Réaffectations tournant en boucle et n'ouvrant aucune progression possible | Détecter l'impasse ; pas de partie bloquée indéfiniment | À vérifier par moteur, non exécuté |

**Prochain arbitrage GC-21 / égalité d'attribution d'armure :** lorsqu'une carte numérique doit devenir une **armure** (GC-07), la règle de « ressemblance inverse » peut désigner **plusieurs figures vivantes de même valeur minimale et de même rang de priorité**, sans départage explicite. Doit-on **laisser le joueur choisir** parmi ces cibles ex æquo, imposer un ordre de plateau déterministe, ou appliquer l'armure à toutes les cibles à égalité ? Les seuils de défaite J/Q/K demeurent inchangés.


## 35. Décision fonctionnelle Gridcannon V2 — GC-21 : égalité d'attribution d'armure

**Option A VALIDÉE par le porteur le 22 novembre 2026 : choix du joueur entre les cibles ex æquo.** Lorsqu'une carte numérique ne peut légalement être posée et doit devenir une armure conformément à GC-07, le moteur établit d'abord les figures vivantes candidates selon la règle de « ressemblance inverse » (même enseigne, sinon même couleur, sinon plus faible valeur). Si plusieurs figures vivantes restent **strictement ex æquo au meilleur rang d'éligibilité et à la plus faible valeur**, le joueur choisit **une seule** de ces figures pour recevoir **la totalité de la carte d'armure**. Le moteur ne départage pas silencieusement par ordre de plateau et ne duplique pas l'armure.

### 35.1. Contrat fonctionnel CardForge

1. **Déclenchement conditionnel :** ne proposer l'attribution d'armure qu'après les contrôles de pose et de recours légalement utiles de GC-07 ; ne pas transformer prématurément une carte jouable en armure.
2. **Calcul inchangé des priorités :** préserver l'ordre officiel d'attraction inverse déjà documenté : même enseigne prioritaire, à défaut même couleur, à défaut figure de plus faible valeur. À l'intérieur du meilleur groupe, conserver seulement les figures ayant **la valeur minimale applicable**. Une figure vaincue n'est jamais une cible.
3. **Absence d'égalité :** si une unique cible gagne ces comparaisons, lui affecter la carte sans demander de choix superflu.
4. **Égalité exacte :** si plusieurs cibles restent à la même priorité et à la même valeur, présenter au joueur les seules cibles encore éligibles ; le joueur choisit librement **une cible unique**. Ne pas sélectionner automatiquement selon l'ordre des côtés ou des emplacements.
5. **Une carte physique, une attribution :** ajouter la valeur de la carte numérique **une seule fois**, à la résistance courante de la seule figure choisie. La carte ne peut ni être divisée, ni être copiée sur toutes les figures ex æquo.
6. **Effet terminal :** après l'attribution, réévaluer immédiatement les seuils de défaite inchangés : **20 ou plus** pour valet/dame, **19 ou plus** pour roi. Le choix du joueur peut donc changer l'issue ; ne pas rediriger automatiquement vers une figure plus favorable.
7. **Interface et décision :** afficher les figures candidates, leur résistance actuelle et l'effet de l'armure avant confirmation, sans proposer des cibles non éligibles. Le choix doit fonctionner au clavier et au tactile.
8. **Sauvegarde et unicité :** tant que le choix n'est pas confirmé, conserver la carte numérique en attente sans modifier les armures. Après confirmation, persister la cible, la carte et son effet atomiquement pour éviter les doubles attributions à la reprise ou lors de clics concurrents.
9. **Traçabilité :** distinguer dans le journal de partie la carte, le groupe de candidates et la figure finalement choisie, pour faciliter les contrôles de conformité sans révéler le contenu futur de la pioche.
10. **Portée de l'arbitrage :** ce départage par choix du joueur est une **précision fonctionnelle CardForge** pour un cas non explicité dans la source déjà étudiée, **pas une nouvelle règle attribuée à Tom Francis**.

**Exemple :** une carte d'armure 5♥ doit être attribuée, toutes les figures rouges sont vaincues et les valets noirs J♠ et J♣ sont les figures vivantes de plus faible valeur, chacun avec une résistance courante de 13. Le moteur propose ces deux cibles ; le joueur en choisit **une seule**, qui passe à 18. L'autre reste à 13. L'armure 5♥ n'est pas répliquée.

**Statut : GC-21 CLOS pour CardForge par validation de l'option A le 22 novembre 2026.** Cette décision complète GC-07 et GC-20 sans modifier la définition des armures ni leurs seuils. **Spécification documentaire uniquement : aucun test n'a été exécuté.**

### 35.2. Scénarios de conformité — GC-21

| Test | Situation | Résultat attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T224 | Une seule figure vivante éligible au meilleur rang | Attribution à cette figure ; aucun choix artificiel | Spécifié, non exécuté |
| GC-V2-T225 | Deux figures vivantes strictement ex æquo au meilleur rang et à la valeur minimale | Choix proposé entre ces deux figures seulement | Spécifié, non exécuté |
| GC-V2-T226 | Deux cibles ex æquo, choix de la seconde | Une seule armure ajoutée à la seconde ; première inchangée | Spécifié, non exécuté |
| GC-V2-T227 | Figure plus faible mais de priorité d'enseigne/couleur inférieure | La priorité inverse l'emporte ; figure inférieure non proposée | Spécifié, non exécuté |
| GC-V2-T228 | Une des figures ex æquo est déjà vaincue | Figure vaincue exclue des choix | Spécifié, non exécuté |
| GC-V2-T229 | L'armure choisie fait atteindre le seuil terminal à un valet ou une dame | Défaite immédiate à 20 ou plus | Spécifié, non exécuté |
| GC-V2-T230 | L'armure choisie fait atteindre le seuil terminal à un roi | Défaite immédiate à 19 ou plus | Spécifié, non exécuté |
| GC-V2-T231 | Sauvegarde au cours du choix, puis reprise | Même carte et mêmes candidates ; aucune armure attribuée avant confirmation | Spécifié, non exécuté |
| GC-V2-T232 | Double clic de confirmation ou reprise après attribution | Une seule attribution physique et une seule mise à jour de résistance | Spécifié, non exécuté |
| GC-V2-T233 | Candidats ex æquo sur mobile et au clavier | Choix accessible, résistance et impact visibles avant validation | À vérifier en UX, non exécuté |

**Prochain arbitrage proposé — GC-22 / lisibilité des armures :** comment représenter au joueur la **résistance actuelle** de chaque figure (base + armures cumulées) et les cartes d'armure attribuées, afin de permettre des décisions éclairées sans modifier les règles ? Les options d'affichage devront rester adaptées au mobile et préserver la visibilité des seuils de défaite.


## 36. Décision d'ergonomie Gridcannon V2 — GC-22 : résistance et armures — affichage hybride

**Option C VALIDÉE par le porteur le 22 novembre 2026.** Sur chaque figure, afficher de façon permanente sa **résistance actuelle totale** ainsi que le **bonus d'armure cumulé**. Sur action volontaire du joueur (clic, toucher ou activation clavier), ouvrir une vue détaillant les **cartes d'armure réellement attribuées** à cette figure. Ce dispositif est purement informatif et ne change ni la mécanique des armures ni leurs seuils de défaite. Les figures vaincues conservent leur emplacement conformément aux règles déjà validées.

### 36.1. Contrat fonctionnel et UX

1. **Affichage permanent :** pour toute figure vivante, présenter une valeur de résistance lisible et le supplément d'armure cumulé (ex. « Résistance 17 », « Armure +6 »). La résistance totale est calculée à partir de la résistance de base (Valet 11, Dame 12, Roi 13) et des seules cartes d'armure effectivement attribuées ; ne pas maintenir un total d'interface susceptible de diverger du moteur.
2. **Sans armure :** afficher la résistance de base et un état explicite « Armure +0 », ou un indicateur d'absence d'armure équivalent accessible ; ne pas masquer la résistance initiale.
3. **Détail sur demande :** l'activation d'une figure dévoile dans une fiche/panneau accessible l'identité (valeur et enseigne) de chacune de ses cartes d'armure, dans l'ordre de leur attribution si cet ordre est connu du moteur, ainsi que base, somme d'armures et résistance totale. La vue est en lecture seule : aucune suppression, redistribution, dépense ou réorganisation n'y est possible.
4. **Mobile et bureau :** le détail s'ouvre au toucher/clic et au clavier, sans dépendance au survol. Fermer/revenir au plateau sans déclencher de mouvement, tir, pioche ni altérer une sélection en cours. Ne pas encombrer les douze emplacements périphériques avec les cartes d'armure ouvertes simultanément.
5. **Seuil de défaite :** indiquer clairement le seuil applicable, **20 pour Valet/Dame, 19 pour Roi**, et l'approche de ce seuil sans changer la condition de défaite ; ne jamais présenter un état de résistance au-delà du seuil comme encore jouable si le moteur a déjà prononcé la défaite. Éviter de ne différencier les états que par la couleur.
6. **Actualisation :** lorsqu'une armure est attribuée selon GC-07/21, actualiser immédiatement la figure concernée, son total et son détail après la confirmation unique de l'action. Les autres figures conservent leurs valeurs.
7. **Choix d'armure GC-21 :** pendant la sélection entre figures ex æquo, montrer à titre de prévisualisation **avant validation** l'effet envisagé sur résistance et seuil, sans le comptabiliser ni modifier le détail réel. Ne confirmer et sauvegarder l'armure que sur le choix final.
8. **Figures vaincues :** conserver la place de la figure vaincue, clairement différencier son état de celui d'une figure vivante ; une éventuelle consultation historique ne doit pas restaurer son statut ni rendre sa position réutilisable.
9. **Reprise et intégrité :** reconstituer les valeurs et les détails à partir de l'état métier sauvegardé. Après rechargement, le même jeu de cartes d'armure doit produire les mêmes résistances ; aucune carte dupliquée ou perdue.
10. **Portée :** GC-22 est une **décision d'ergonomie CardForge**, non une modification des règles originales de Gridcannon Version 2. La conception graphique détaillée peut être confiée à Sally sans remettre en cause ce contrat.

**Exemple :** un Valet a reçu une armure 2♣ puis une armure 4♥. Sa carte affiche en permanence « Résistance 17 » et « Armure +6 ». Le détail affiche « Base 11 + 2♣ + 4♥ = 17 » et « Défaite à 20 ». Une nouvelle armure 3♦ amènerait la résistance à 20 et déclencherait la défaite selon la règle existante, sans protection spéciale créée par l'affichage.

**Statut : GC-22 CLOS pour CardForge par validation de l'option C le 22 novembre 2026.** Spécification documentaire : aucun rendu UX ni test logiciel n'a été exécuté.

### 36.2. Scénarios de conformité — GC-22

| Test | Situation | Résultat attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T234 | Valet vivant sans armure | Résistance 11 visible ; armure nulle explicite ou équivalent accessible | Spécifié, non exécuté |
| GC-V2-T235 | Dame avec armures 2 et 4 | Résistance 18, Armure +6 ; total cohérent avec la base 12 | Spécifié, non exécuté |
| GC-V2-T236 | Ouverture du détail d'une figure | Identité de chaque armure, base, somme, total et seuil affichés | Spécifié, non exécuté |
| GC-V2-T237 | Fermeture du détail | Aucun changement de carte, de pioche, de tour ou d'état de partie | Spécifié, non exécuté |
| GC-V2-T238 | Attribution confirmée à une seule cible ex æquo GC-21 | Une seule figure change de résistance ; détails cohérents ; pas de duplication | Spécifié, non exécuté |
| GC-V2-T239 | Prévisualisation d'une armure en attente GC-21 | Impact visible mais résistance métier inchangée jusqu'à confirmation | Spécifié, non exécuté |
| GC-V2-T240 | Valet/Dame atteint 20 ou Roi atteint 19 | Défaite selon règle préexistante ; pas d'état jouable trompeur | Spécifié, non exécuté |
| GC-V2-T241 | Figure vaincue toujours en périphérie | État vaincu distinct ; position conservée, pas de cible d'armure active | Spécifié, non exécuté |
| GC-V2-T242 | Sauvegarde puis reprise avec deux armures | Mêmes cartes détaillées et même résistance totale ; aucun double ajout | Spécifié, non exécuté |
| GC-V2-T243 | Consultation sur mobile et clavier sans survol | Détail ouvrable/fermable et lisible, seuil compréhensible sans seule couleur | À vérifier en UX, non exécuté |

**Prochain arbitrage proposé — GC-23 / aide à la lecture des tirs :** lorsqu'un joueur sélectionne une position de grille pour poser ou déplacer une carte, quel niveau de visualisation fournir pour les **attaques possibles** vers les figures (axes concernés, puissance réellement compatible avec Valet/Dame/Roi, résistance à atteindre) ? Étudier trois niveaux : (A) aucun aperçu avant action, bilan après la pose ; (B) mise en évidence des axes et cibles avant confirmation ; (C) aperçu complet de la puissance et du résultat potentiel, sans effectuer le tir avant validation. Il s'agit d'une décision d'assistance UX, pas d'un changement de mécanique ni d'un calcul d'attaque automatique supplémentaire.


## 37. Décision d'ergonomie Gridcannon V2 — GC-23 : prévisualisation complète des attaques

**Option C VALIDÉE par le porteur le 22 novembre 2026.** Avant confirmation d'un placement légal de carte numérique sur la grille — que ce soit après pioche ou lors d'une Réaffectation par Joker — CardForge affiche une **prévisualisation complète et non destructive** des attaques qui seraient déclenchées par ce placement : axes concernés, figures vivantes ciblées, contribution de chacune des deux cartes intermédiaires, puissance effectivement admissible compte tenu des restrictions de la figure, résistance actuelle armure comprise et résultat potentiel (figure vaincue ou survivante). **Aucune attaque ni aucune dépense d'action spéciale n'est effective avant la validation du mouvement.**

### 37.1. Contrat métier et d'interface

1. **Légalité d'abord :** seules les destinations autorisées par le moteur peuvent être envisagées pour une prévisualisation d'un placement réalisable, conformément à GC-03/04 et aux restrictions des mouvements par Joker. Une destination illégale doit être signalée comme telle sans produire de faux résultat de tir.
2. **Déclencheur exclu :** calculer les tirs à partir des **deux cartes supérieures intermédiaires**, après application hypothétique du placement, sans jamais ajouter la valeur de la nouvelle carte déclencheuse à la puissance (règle Version 2).
3. **Cibles et restrictions :** chaque figure vivante située à l'extrémité opposée d'une ligne/colonne admissible est évaluée selon ses règles : Valet toutes enseignes ; Dame même couleur ; Roi même enseigne. Afficher les contributions retenues et celles écartées, sans inventer de bonus.
4. **Résistance réelle :** comparer la somme admissible à la résistance courante **base + armures déjà attribuées**, conformément à GC-22. Indiquer visiblement « vaincue si confirmé » ou « résiste si confirmé », y compris en cas d'égalité exacte entre attaque et résistance (vaincue).
5. **Double tir :** un placement dans un coin peut produire **deux attaques**, une sur chaque axe. Afficher les deux cibles et leurs bilans indépendants, conformément à GC-04, y compris si une seule est vaincue. Une case centrale n'invente aucun tir direct.
6. **Aucun effet avant confirmation :** l'aperçu ne dépense pas le Joker, ne change pas la grille, ne retourne aucune figure, ne modifie pas l'armure ou le score et ne produit aucune statistique de victoire/défaite. Annuler le choix laisse intégralement l'état de jeu inchangé.
7. **Confirmation atomique :** lors de la validation, le moteur recontrôle la légalité et applique le placement réel, ses tirs et ses issues terminales conformément aux règles existantes ; l'aperçu est recalculé ou invalidé si l'état sous-jacent a changé. Ne pas prendre le résultat visuel pour un ordre métier faisant autorité.
8. **Présentation accessible :** mise en évidence des axes et cibles, valeurs chiffrées lisibles et explications textuelles, sans dépendre uniquement de couleurs, du survol ou d'animations. Sur mobile, la prévisualisation doit rester visible sans masquer l'action de confirmer ou d'annuler.
9. **Information autorisée :** n'utiliser que les cartes déjà visibles sur le plateau, les résistances et armures connues et la carte actuellement en jeu ; ne jamais exposer des cartes futures ou cachées de la pioche.
10. **Préservation des décisions existantes :** conserver les règles de GC-04 (double tir), GC-08 (victoire et score), GC-11 (actions spéciales volontaires), GC-21 (choix d'armure) et GC-22 (affichage de résistance). Une prévisualisation ne confère ni nouvelle action ni droit de rejouer un placement.
11. **Persistance :** si le joueur quitte l'application avant confirmation, aucune attaque prévisualisée n'est enregistrée comme réalisée. La reprise restaure la carte en attente et un choix non confirmé sans double application.
12. **Portée :** cet aperçu complet est un **choix UX CardForge** et n'est pas présenté comme une mécanique ajoutée par Tom Francis.

**Exemple :** la pose envisagée dans un coin menace un Valet et une Dame. Le Valet a une résistance actuelle de 14 ; les deux cartes intermédiaires totalisent 15, donc « vaincu si confirmé ». La Dame a une résistance de 12 ; sur son axe, seule une carte de valeur 7 possède la couleur adéquate, donc « résiste si confirmé » avec puissance admissible 7. Le plateau reste inchangé jusqu'à confirmation. Chaque axe utilise ses propres cartes intermédiaires.

**Statut : GC-23 CLOS pour CardForge par validation de l'option C le 22 novembre 2026.** Spécification documentaire uniquement ; aucune implémentation ni test UX ou moteur n'a été exécuté.

### 37.2. Scénarios de conformité — GC-23

| Test | Situation | Résultat attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T244 | Placement légal envisagé en extrémité | Afficher axe, cible, deux intermédiaires, puissance, résistance et verdict potentiel | Spécifié, non exécuté |
| GC-V2-T245 | Carte déclencheuse de forte valeur, deux intermédiaires faibles | Déclencheuse exclue du total ; aucun faux tir gagnant | Spécifié, non exécuté |
| GC-V2-T246 | Dame, une carte intermédiaire de couleur incompatible | Cette carte ne contribue pas ; explication visible | Spécifié, non exécuté |
| GC-V2-T247 | Roi, intermédiaire d'une autre enseigne | Carte incompatible exclue du total | Spécifié, non exécuté |
| GC-V2-T248 | Puissance égale exactement à résistance totale avec armure | Verdict potentiel « vaincue » | Spécifié, non exécuté |
| GC-V2-T249 | Pose au coin avec deux figures vivantes | Deux axes évalués séparément et résultats indépendants | Spécifié, non exécuté |
| GC-V2-T250 | Pose au centre sans cible à deux cartes de distance | Aucun tir direct inventé | Spécifié, non exécuté |
| GC-V2-T251 | Destination illégale | Pas de faux résultat ; aucune confirmation de pose illégale | Spécifié, non exécuté |
| GC-V2-T252 | Annulation d'une prévisualisation | Aucun effet sur grille, figures, armure, ressources ou statistiques | Spécifié, non exécuté |
| GC-V2-T253 | Joker : prévisualisation puis confirmation | Un déplacement légal, une dépense de Joker et tirs réellement résolus une fois | Spécifié, non exécuté |
| GC-V2-T254 | Changement d'état entre calcul d'aperçu et confirmation | Revalidation de l'état, aucune application obsolète | Spécifié, non exécuté |
| GC-V2-T255 | Fermeture puis reprise avant validation | Aucune attaque exécutée ; état et carte en attente préservés | Spécifié, non exécuté |
| GC-V2-T256 | Usage mobile, clavier et contraste réduit | Axes, valeurs et résultats compréhensibles sans survol ni couleur seule | À vérifier en UX, non exécuté |

**Prochain arbitrage proposé — GC-24 / restitution visuelle d'un tir confirmé :** après validation du placement et résolution des attaques, comment montrer au joueur les tirs effectivement produits et leur résultat ? Trois options sont à comparer : **A** résultat instantané sans animation ; **B** animation courte, lisible et non bloquante, avec bilan textuel ; **C** séquence cinématique détaillée (effets plus riches, successifs) avec possibilité de passer l'animation. Il s'agit d'une décision de présentation ; le moteur doit déterminer et enregistrer le résultat indépendamment de toute animation.


## 38. Décision UX Gridcannon V2 — GC-24 : animation courte et restitution des tirs confirmés

**Option B VALIDÉE par le porteur le 22 novembre 2026.** Chaque attaque déclenchée par un placement confirmé dispose d'une **animation courte et lisible**, avec un faisceau/trait d'énergie entre la ligne d'attaque et la figure ciblée, un retour visuel distinct selon la réussite ou l'échec du tir et un bilan textuel explicite. Cette présentation convient à l'univers de guerre spatiale « Bastion Stellaire » sans ajouter de nouvelle mécanique. Les animations doivent être **désactivables**, non bloquantes et adaptées au mobile.

### 38.1. Contrat fonctionnel et UX

1. **Séparation moteur / présentation :** la confirmation du placement légal déclenche une **unique transition métier atomique**, qui calcule et sauvegarde immédiatement les tirs, les figures vaincues, le score et le résultat de partie applicable. L'animation ne calcule pas de nouveaux tirs, ne retarde pas le verdict métier et ne gouverne jamais les sauvegardes.
2. **Animation courte :** représenter l'attaque par un signal visuel bref (par exemple trait d'énergie et impact), sans cinématique longue ni attente imposée au joueur. Les durées et effets précis seront harmonisés par Sally lors de la conception UX, sans dépendance de la logique de jeu à leur achèvement.
3. **Retour d'impact :** distinguer clairement un tir qui vainc la figure d'un tir insuffisant ou incompatible ; accompagner l'effet de textes et valeurs tels que « Attaque 13 / Résistance 12 — Figure vaincue » ou « Attaque 7 / Résistance 12 — Figure résistante ».
4. **Double tir GC-04/23 :** lors d'une pose en coin, **représenter les deux attaques effectivement résolues**, même si une seule détruit sa cible. Une restitution très brève successive ou simultanée est acceptable si elle reste compréhensible ; l'ordre de rendu ne doit pas modifier le résultat calculé par le moteur.
5. **État final fiable :** après résolution, les figures vaincues sont retournées et restent à leur position (GC-03), les résistances/armures sont celles de l'état réel (GC-22) et les verdicts victoire/défaite sont ceux déjà établis, indépendamment de l'animation.
6. **Paramètre utilisateur :** proposer une préférence permettant de **désactiver les animations de tirs**. Dans ce cas, afficher immédiatement l'état final et un bilan textuel équivalent à celui du mode animé ; la préférence est sans effet sur la partie ou les tirages.
7. **Accessibilité :** respecter la préférence système de réduction des mouvements lorsque détectable ; permettre la compréhension du résultat sans mouvement ni code couleur seul. Les textes doivent être consultables sur mobile et au clavier. Ne pas rendre l'expérience dépendante du son.
8. **Pas de blocage ni de doublon :** l'utilisateur peut passer l'effet visuel ou continuer dès que l'état métier le permet ; cela ne doit ni lancer une seconde attaque ni permettre de rejouer le mouvement. Les interactions répétées et les rafraîchissements ne créent pas de nouveaux événements.
9. **Reprise :** une sauvegarde/reprise au cours d'une animation restitue l'état métier **déjà confirmé** et ne rejoue pas le tir ; une animation peut être omise après reprise. Aucun score ni résultat de partie ne peut être enregistré une deuxième fois.
10. **Couverture des mouvements :** même restitution pour les tirs déclenchés par la pose d'une carte piochée et par une Réaffectation légale via Joker. Les mouvements ne déclenchant aucun tir ne génèrent aucune attaque fictive.
11. **Périmètre :** l'animation est un **habillage propre à CardForge**, pas une règle supplémentaire attribuée à Tom Francis. Les visuels et paramètres ne modifient pas la Version 2.

**Exemple :** une carte est posée légalement dans un coin et le moteur constate un tir victorieux sur un Valet ainsi qu'un tir insuffisant sur une Dame. L'état final est sauvegardé une seule fois. L'interface montre brièvement les deux axes, un impact sur chaque cible et leurs bilans distincts ; le Valet est retourné face cachée à sa place, la Dame reste vivante. Sans animation, les mêmes états et bilans apparaissent immédiatement.

**Statut : GC-24 CLOS pour CardForge — option B validée le 22 novembre 2026.** Documentation fonctionnelle uniquement ; aucune implémentation ni test logiciel ou UX n'a été exécuté.

### 38.2. Scénarios de conformité — GC-24

| Test | Situation | Résultat attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T257 | Attaque confirmée contre figure vaincue | Effet bref, bilan chiffré, figure retournée à son emplacement | Spécifié, non exécuté |
| GC-V2-T258 | Tir confirmé de puissance insuffisante | Impact et texte distincts, cible reste vivante | Spécifié, non exécuté |
| GC-V2-T259 | Pose en coin déclenchant deux tirs | Deux résultats représentés, sans dépendance de l'ordre visuel | Spécifié, non exécuté |
| GC-V2-T260 | Animation désactivée dans les préférences | Résultat immédiat, bilan textuel complet, état métier identique | Spécifié, non exécuté |
| GC-V2-T261 | Préférence de mouvement réduit active | Animation évitée ou fortement réduite, résultat lisible | À vérifier en UX, non exécuté |
| GC-V2-T262 | Fermeture/rechargement pendant une animation | État final restauré, aucune deuxième attaque ni double statistique | Spécifié, non exécuté |
| GC-V2-T263 | Confirmation répétée rapidement ou effet visuel passé | Une transition métier et une seule dépense de ressources | Spécifié, non exécuté |
| GC-V2-T264 | Joker déclenche un tir normal | Même restitution que pour carte piochée, dépense du Joker unique | Spécifié, non exécuté |
| GC-V2-T265 | Pose ne déclenchant aucun tir | Aucun faisceau fictif ni fausse cible vaincue | Spécifié, non exécuté |
| GC-V2-T266 | Attaque terminant la partie | Résultat officiel prioritaire, animation sans délai de validation métier | Spécifié, non exécuté |
| GC-V2-T267 | Contrôle tactile/clavier, faible contraste et absence de son | Information complète compréhensible sans animation ni couleur seule | À vérifier en UX, non exécuté |

**Prochain arbitrage proposé — GC-25 / ambiance sonore et retours audio :** définir la place du son dans les actions de jeu (pose, tir, figure vaincue, victoire/défaite), sans modifier les règles ni imposer l'audio. Options à étudier : **A** entièrement silencieux ; **B** effets sonores courts, discrets et facultatifs (désactivables, muets par défaut si contraintes navigateur) ; **C** ambiance musicale et effets immersifs continus, avec réglages séparés. Évaluer accessibilité, autonomie mobile, répétition et comportement des navigateurs.


## 39. Décision UX Gridcannon V2 — GC-25 : effets sonores discrets et facultatifs

**Option B VALIDÉE par le porteur le 22 novembre 2026.** Bastion Stellaire proposera des **effets sonores brefs, discrets et désactivables** associés aux événements importants (pose de carte, tir, figure vaincue, victoire, défaite). Il n'y aura **pas de musique d'ambiance continue** au titre de GC-25. **Le son sera coupé par défaut au premier lancement** et ne sera activé qu'à la demande du joueur. Les règles, les informations et les résultats de partie restent intégralement utilisables sans son.

### 39.1. Contrat fonctionnel et UX

1. **Événements sonorisables :** placement légal confirmé, attaque effectivement résolue (animation GC-24), figure vaincue, victoire et défaite. Ces effets sont des retours de présentation et non des actions métier.
2. **Sobriété :** effets courts, volumes maîtrisés, sans bande sonore musicale permanente ni répétition agressive ; une séquence de deux tirs en coin ne doit pas empiler des sons incompréhensibles.
3. **Paramètre de jeu :** proposer une commande accessible « Effets sonores : activés / désactivés », identifiable au clavier, au toucher et par lecteur d'écran. **Valeur initiale : désactivés** tant que l'utilisateur ne les a pas volontairement activés.
4. **Persistance de préférence :** mémoriser localement le choix utilisateur selon les mécanismes de préférences de CardForge ; ne pas modifier ni polluer les sauvegardes du moteur. Une préférence absente ou non accessible revient au mode silencieux.
5. **Contraintes navigateurs :** respecter les politiques de lecture audio (autorisation liée à une interaction utilisateur quand nécessaire) ; ne jamais forcer la lecture ni considérer le refus de lecture comme une erreur bloquante de jeu.
6. **Silence garanti :** mode désactivé, onglet ou application mise en arrière-plan si la plateforme l'exige, perte de contexte audio, absence de périphérique ou impossibilité de lecture ne doivent jamais empêcher un tir, un placement, une victoire ni la poursuite de partie.
7. **Accessibilité :** chaque événement important reste signifié visuellement et/ou textuellement (GC-22 à GC-24), sans dépendance exclusive au son. Un son de défaite ne remplace pas le message de résultat officiel.
8. **Déclenchement après événement réel :** ne jouer un son qu'en réponse à un événement métier **confirmé** et effectivement présenté ; pas de son « tir réussi » sur une simple prévisualisation GC-23. Une annulation de placement ne doit pas déclencher de faux son d'attaque.
9. **Unicité :** éviter les doubles sons causés par un double clic, une répétition de rendu, une reprise ou la fin d'une animation. Une reprise de sauvegarde n'a pas à rejouer les sons du passé.
10. **Cohérence des terminaux :** les signaux de victoire et de défaite doivent être distincts et discrets. Quand un tir décisif termine une partie, prioriser un résultat clairement perceptible plutôt qu'une cascade bruyante d'effets.
11. **Ressources et droits :** utiliser uniquement des ressources audio originales, licenciées pour la distribution prévue ou autrement autorisées ; documenter les crédits nécessaires. Ne pas présupposer la disponibilité d'une bibliothèque sonore.
12. **Portée :** choix de design CardForge sans changement de règles de Gridcannon Version 2. Les sons et leur calendrier exact seront précisés au design UX, sans conditionner le fonctionnement du moteur.

**Exemple :** le joueur active volontairement les effets sonores. Lorsqu'il confirme une pose en coin provoquant deux attaques, des retours sonores brefs accompagnent les impacts effectivement résolus, sans jouer de sons supplémentaires à chaque recalcul de l'interface. Si les effets sont désactivés, le même bilan chiffré et les mêmes animations visuelles sont disponibles et le résultat métier est strictement identique.

**Statut : GC-25 CLOS pour CardForge — option B validée le 22 novembre 2026.** Spécification documentaire uniquement : aucun fichier audio produit, aucune implémentation ni aucun test exécuté.

### 39.2. Scénarios de conformité — GC-25

| Test | Situation | Résultat attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T268 | Première ouverture sans préférence enregistrée | Effets sonores désactivés, aucune lecture spontanée | Spécifié, non exécuté |
| GC-V2-T269 | Activation volontaire des effets | Préférence mémorisée localement, sons autorisés après interaction compatible navigateur | Spécifié, non exécuté |
| GC-V2-T270 | Désactivation volontaire puis tir confirmé | Aucun son ; bilan visuel et état métier inchangés | Spécifié, non exécuté |
| GC-V2-T271 | Pose légale et attaque confirmées, son activé | Effets brefs pertinents, non déclenchés avant confirmation | Spécifié, non exécuté |
| GC-V2-T272 | Prévisualisation GC-23 annulée | Aucun effet de tir ni de victoire fictifs | Spécifié, non exécuté |
| GC-V2-T273 | Deux attaques dans un coin | Retours compréhensibles, sans superposition sonore excessive | À vérifier en UX, non exécuté |
| GC-V2-T274 | Refus de lecture automatique ou absence de sortie audio | Partie continuée sans erreur bloquante | Spécifié, non exécuté |
| GC-V2-T275 | Rechargement de la partie après un tir | Aucun son ancien rejoué ni nouvel événement métier créé | Spécifié, non exécuté |
| GC-V2-T276 | Victoire ou défaite confirmée | Retour sonore distinct si activé ; message textuel présent dans tous les cas | Spécifié, non exécuté |
| GC-V2-T277 | Commande sonore sur mobile, au clavier ou avec lecteur d'écran | Contrôle accessible, état activé/désactivé explicite | À vérifier en UX, non exécuté |
| GC-V2-T278 | Mode silencieux après changement de préférence et relancement | Préférence conservée, jeu utilisable entièrement sans son | Spécifié, non exécuté |

**Prochain arbitrage proposé — GC-26 / accompagnement des nouveaux joueurs :** comment expliquer les règles parfois complexes de la Version 2 (placement, attaques, As, Joker, armures et cas limites), sans automatiser des décisions à la place du joueur ni altérer les règles ? Options à comparer : **A** règlement consultable à tout moment ; **B** règlement structuré + conseils contextuels facultatifs sur les actions et les erreurs ; **C** tutoriel interactif guidé avec une partie d'apprentissage dédiée, en plus du règlement. Aucun des trois choix ne doit révéler la pioche future ni prendre de décision stratégique à la place du joueur.


## 40. Décision UX Gridcannon V2 — GC-26 : aide contextuelle facultative et couverture multilingue

**Option B VALIDÉE par le porteur le 22 novembre 2026 : aide contextuelle facultative, en complément d'un règlement complet accessible à tout moment.** Exigence transversale confirmée : **CardForge, l'application commune et chacun de ses jeux doivent prendre en charge au moins dix langues**, y compris les règles, l'aide, les retours des actions et les messages d'erreur. Cette exigence dépasse le seul jeu Gridcannon et doit être reprise dans la planification produit/architecture. Les dix langues exactes seront fixées séparément : ne pas supposer qu'elles ont déjà été choisies.

### 40.1. Contrat fonctionnel et UX

1. **Règlement complet :** proposer un règlement structuré, consultable pendant une partie, couvrant la mise en place, les placements, figures, tirs, armures, As, Jokers, victoire, défaite et cas particuliers déjà validés, avec exemples adaptés à Version 2 uniquement.
2. **Aide à la demande :** depuis une carte, une figure, une action spéciale ou une situation d'erreur, le joueur peut consulter l'explication pertinente ; l'aide montre la règle applicable et, quand utile, la raison d'une action invalide. Elle ne remplace pas la prévisualisation des tirs GC-23.
3. **Conseils non intrusifs :** les messages automatiques éventuels sont courts, circonstanciés, non bloquants et facultatifs. Une préférence permet de les masquer durablement sans supprimer l'accès volontaire au règlement ou à une explication.
4. **Absence d'automatisation stratégique :** l'aide ne choisit pas une destination, une cible d'armure ou une action spéciale à la place du joueur ; elle ne divulgue jamais les cartes futures de la pioche. Les décisions GC-07/11/18/21 restent volontaires.
5. **Véracité :** ne pas présenter une convention spécifique CardForge comme une citation de Tom Francis. Les exemples doivent refléter exactement les règles et arbitrages GC-01 à GC-25.
6. **Portée multilingue :** l'interface de CardForge, le catalogue, les réglages, chacun des jeux, les tutoriels ou aides existants, les règles, les infobulles, les avertissements, les retours de tirs, les statistiques et les états de victoire/défaite doivent fonctionner dans **au moins dix langues**. La mise à disposition d'une langue suppose la couverture des parcours essentiels du jeu et de l'application, sans mélange involontaire de textes.
7. **Ressources localisables :** employer des identifiants stables pour les textes avec paramètres (valeurs de cartes, résistances, touches/actions), éviter les chaînes codées en dur et respecter les règles de pluralisation, les formats locaux et les libellés accessibles.
8. **Cohérence de langue :** la préférence linguistique doit être commune au shell CardForge et au jeu ouvert ; le changement de langue ne doit pas changer l'état métier, redémarrer la partie, modifier la pioche ou faire perdre le point d'avancement.
9. **Hors ligne :** les textes indispensables aux dix langues prises en charge et les explications nécessaires au jeu hors ligne doivent être disponibles sans accès réseau sur les plateformes promises comme hors ligne ; stratégie précise de chargement/cache à fixer avec Winston.
10. **Qualité de traduction :** établir et vérifier glossaire, noms d'actions, règles et messages de cas limites ; le vocabulaire doit conserver son sens stratégique. Les noms propres de l'auteur et les crédits restent attribués correctement, quel que soit le langage d'interface.
11. **Accessibilité :** assistance utilisable au clavier et au tactile, compatible lecteurs d'écran, sans dépendance au son (GC-25), au seul survol ni à la seule couleur.
12. **Réversibilité :** fermer un conseil ou modifier la langue ne provoque aucune action métier, aucune dépense de ressource et aucun effet sur le score.
13. **Arbitrages à ne pas inventer :** le choix des dix langues, l'ordre de livraison, la stratégie de traduction et les éventuels parcours interactifs de formation doivent faire l'objet d'une décision ultérieure. GC-26 ne supprime pas de plein droit un tutoriel facultatif déjà mentionné dans le cadrage transversal du MVP : le périmètre doit être harmonisé avec John.

**Statut : GC-26 CLOS — option B validée le 22 novembre 2026, avec exigence de dix langues minimum à l'échelle de CardForge.** Documentation uniquement, sans implémentation ni exécution de tests.

### 40.2. Scénarios de conformité — GC-26

| Test | Situation | Résultat attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T279 | Joueur ouvre le règlement pendant une partie | Règles Version 2 consultables sans altérer la partie | Spécifié, non exécuté |
| GC-V2-T280 | Destination de carte illégale | Explication contextuelle exacte, aucune pose fictive | Spécifié, non exécuté |
| GC-V2-T281 | Aide sur Joker, As ou armure | Règles et limites propres à l'action visibles sans automatisme | Spécifié, non exécuté |
| GC-V2-T282 | Joueur masque les conseils automatiques | Conseils non sollicités absents ; règlement et aide à la demande toujours accessibles | Spécifié, non exécuté |
| GC-V2-T283 | Conseil contextuel durant un choix GC-21 | Aucun choix de figure ni changement d'armure automatique | Spécifié, non exécuté |
| GC-V2-T284 | Changement de langue pendant une partie | Interface et aide changent de langue, état et pioche identiques | Spécifié, non exécuté |
| GC-V2-T285 | Parcours clés de l'application et de chaque jeu dans chacune des langues livrées | Au moins dix langues effectivement couvertes ; messages essentiels complets et cohérents | À vérifier, non exécuté |
| GC-V2-T286 | Mode hors ligne dans une langue officiellement prise en charge | Règles, aides et messages indispensables accessibles sans réseau | À vérifier, non exécuté |
| GC-V2-T287 | Résistance, valeur de carte et enseigne interpolées dans une traduction | Valeurs exactes, textes localisés sans altérer les calculs | Spécifié, non exécuté |
| GC-V2-T288 | Erreur ou conseil sur écran tactile et lecteur d'écran | Contenu compréhensible, action de fermeture accessible | À vérifier en UX, non exécuté |
| GC-V2-T289 | Carte cachée de la pioche pendant une aide | Aucune divulgation des cartes futures | Spécifié, non exécuté |
| GC-V2-T290 | Reprise après fermeture d'une aide et changement de langue | Sauvegarde et statistiques invariantes, langue choisie respectée | Spécifié, non exécuté |

**Prochain arbitrage proposé — GC-27 / sélection et cohérence des dix langues :** déterminer comment choisir et présenter les langues de l'application et des jeux. Options : **A** sélection manuelle unique pour toute l'application et tous les jeux ; **B** détection initiale de la langue du système avec sélection manuelle commune et persistante ; **C** langue indépendante par jeu, avec préférence globale de l'application. Ne pas fixer les dix langues ni lancer de traduction avant validation spécifique.


## 41. Décision transversale CardForge — GC-27 : détection automatique et préférence linguistique commune

**Option B VALIDÉE par le porteur le 22 novembre 2026. Langue de repli explicitement validée : anglais (en).** La langue est **commune à l'application CardForge et à tous ses jeux**. Au premier lancement sans choix enregistré, détecter les préférences linguistiques de l'appareil/navigateur et utiliser la première langue effectivement prise en charge ; à défaut, afficher l'application en **anglais**. Le joueur peut choisir manuellement une autre langue disponible à tout moment ; son choix est persistant et prioritaire sur toute détection ultérieure.

### 41.1. Contrat fonctionnel et UX

1. **Priorité de sélection :** (a) langue choisie explicitement et enregistrée, si encore prise en charge ; sinon (b) première langue compatible parmi les langues préférées exposées par le système/navigateur ; sinon (c) **anglais**. En l'absence de préférence enregistrée, la détection est effectuée à l'ouverture.
2. **Repli anglais :** l'anglais doit toujours faire partie des langues complètes livrées ; aucun message indispensable ne doit devenir vide ou illisible faute de traduction. Un repli ponctuel de texte est une protection technique et non un substitut à la couverture complète des langues annoncées.
3. **Sélection manuelle :** rendre une commande de changement de langue visible et accessible dans les paramètres communs. Afficher le nom des langues de manière compréhensible, indépendamment de la langue active. La préférence explicite prime sur une détection à chaque visite.
4. **Portée :** une seule langue active couvre le catalogue CardForge, l'ensemble des jeux disponibles, règles, aides contextuelles GC-26, statistiques, messages d'erreur, préférences et résultats. Ne pas conserver de réglage linguistique divergent propre à un jeu.
5. **Changement à chaud :** changer de langue sans redémarrer ni réinitialiser une partie, déplacer des cartes, modifier la pioche, les figures, les actions spéciales ou les scores. Mettre à jour les textes immédiatement, sans réexécuter une action métier ni une animation.
6. **Langues régionales :** gérer les variantes régionales via correspondance raisonnable vers une langue effectivement disponible (par exemple une variante de langue vers son code de base si pris en charge) ; en cas d'échec, anglais. Ne jamais présumer que des variantes spécifiques sont déjà traduites.
7. **Hors ligne :** conserver le choix linguistique localement et assurer le fonctionnement hors réseau pour les langues officiellement livrées, conformément à GC-26 et aux engagements PWA ; aucune dépendance de traduction en temps réel obligatoire.
8. **Formatage localisé :** formats de nombres, dates, libellés, pluriels et accessibilité adaptés à la langue sélectionnée. Les identifiants de cartes, l'ordre de pioche, les règles et les sauvegardes restent indépendants des chaînes traduites.
9. **Persistance et intégrité :** si le stockage de préférences est indisponible, garder un fonctionnement de repli sans bloquer le jeu ; la sauvegarde des parties ne dépend pas de la langue. Ne jamais écraser une préférence explicite valide par simple mise à jour de la langue système.
10. **Dix langues au minimum :** l'obligation globale GC-26 demeure. **La liste de dix langues n'est pas encore validée** ; leur sélection et la politique des ressources incomplètes feront l'objet des prochains arbitrages.
11. **Accessibilité :** le sélecteur est utilisable au clavier et au tactile, sans son ni survol imposé, et expose correctement la langue active aux technologies d'assistance.
12. **Portée de décision :** cette règle de localisation est un choix produit CardForge, sans impact sur les règles originales de Gridcannon Version 2.

**Exemple :** un appareil est configuré en français puis en allemand. Si le français est pris en charge, CardForge démarre en français. Le joueur choisit ensuite l'anglais : CardForge et tous les jeux passent en anglais et le restent lors du prochain lancement, même si le système reste français. Si aucune langue de l'appareil n'est disponible, l'anglais est utilisé par défaut.

**Statut : GC-27 CLOS — option B et repli anglais validés le 22 novembre 2026.** Spécification documentaire ; aucune implémentation, traduction ni test exécuté.

### 41.2. Scénarios de conformité — GC-27

| Test | Situation | Résultat attendu CardForge | Statut |
| --- | --- | --- | --- |
| GC-V2-T291 | Aucun réglage enregistré, première langue système prise en charge | Première langue compatible sélectionnée | Spécifié, non exécuté |
| GC-V2-T292 | Plusieurs langues système, première inconnue mais deuxième disponible | Deuxième langue compatible choisie | Spécifié, non exécuté |
| GC-V2-T293 | Aucune langue système compatible | Repli anglais (en) | Spécifié, non exécuté |
| GC-V2-T294 | Préférence manuelle valide différente de celle du système | Préférence manuelle conservée et appliquée à tous les jeux | Spécifié, non exécuté |
| GC-V2-T295 | Changement manuel pendant une partie Gridcannon | Textes actualisés, état du moteur et ordre de pioche inchangés | Spécifié, non exécuté |
| GC-V2-T296 | Passage d'un jeu à un autre | Même langue active pour le catalogue, les jeux et les aides | Spécifié, non exécuté |
| GC-V2-T297 | Langue système variante régionale non disponible, langue de base disponible | Correspondance vers langue de base prise en charge | Spécifié, non exécuté |
| GC-V2-T298 | Application utilisée hors ligne après choix manuel | Langue conservée, textes essentiels disponibles sans réseau | À vérifier, non exécuté |
| GC-V2-T299 | Préférence enregistrée devenue indisponible | Détection d'une langue compatible ou anglais sans blocage | Spécifié, non exécuté |
| GC-V2-T300 | Changement de langue avec lecteur d'écran ou clavier | Sélecteur accessible, langue active identifiable | À vérifier en UX, non exécuté |
| GC-V2-T301 | Dix langues annoncées par l'application | Anglais inclus, parcours fondamentaux complets dans chaque langue livrée | À vérifier, non exécuté |

**GC-28 : décision prise ultérieurement — première livraison limitée au français et à l’anglais ; objectif d’au moins dix langues à terme (voir §42).**


## 42. Décision de livraison multilingue — GC-28 : français et anglais au lancement, extension progressive

**Décision VALIDÉE le 22 novembre 2026.** La première livraison de CardForge et de ses jeux démarre avec **deux langues complètes : français (fr) et anglais (en)**. Les autres langues seront ajoutées dans des livraisons ultérieures, avec un **objectif global maintenu d'au moins dix langues**, sans liste ni calendrier arrêtés à ce stade. Cette décision précise et **remplace toute interprétation antérieure imposant dix langues dès le MVP** dans GC-26 et GC-27. Le repli reste **l'anglais** et la sélection reste **détection automatique puis choix manuel persistant**, commune à l'application et aux jeux (GC-27).

### 42.1. Exigences et implications

1. **Première livraison :** français et anglais sont disponibles pour toute l'application, Clear the Dungeon, Gridcannon V2, les règles, aides, résultats, messages d'erreur et parcours utiles ; pas seulement pour la page d'accueil.
2. **Détection :** une préférence système en français sélectionne le français, une préférence en anglais sélectionne l'anglais, toute autre langue non prise en charge conduit à l'anglais, sauf si une préférence manuelle valide est enregistrée.
3. **Choix manuel :** seul le catalogue de langues effectivement livrées est proposé. Aucun sélecteur laissant croire que huit langues non publiées seraient disponibles.
4. **Extension :** l'architecture de localisation doit accepter de nouvelles langues par ressources isolées, sans changements du moteur de jeu, de ses sauvegardes ni de ses identifiants métier ; les langues ajoutées rejoignent la détection et le sélecteur quand leurs ressources sont complètes.
5. **Hors ligne :** les textes et aides en français et anglais requis pour les parties hors ligne sont fournis localement ; les futures langues suivent la même exigence lorsqu'elles deviennent disponibles.
6. **Qualité :** vérifier les deux langues sur tous les parcours et terminologies de règles avant livraison ; ne pas assimiler l'objectif de dix langues à un engagement de livraison immédiate.
7. **Traçabilité :** GC-28 est une **décision de phasage** transversale à CardForge. Les références plus anciennes « dix langues complètes » dans GC-26/GC-27 décrivent désormais la **cible à terme** et doivent être lues avec cette précision de périmètre.
8. **Hors décision :** les langues n°3 à n°10, leur ordre de priorité, leur date de livraison et les éventuelles variantes régionales ne sont pas validés.

**Statut : GC-28 CLOS — lancement fr/en, extension ultérieure vers au moins dix langues.** Cadrage documentaire ; aucune traduction ni test exécuté.

### 42.2. Scénarios de conformité — GC-28

| Test | Situation | Résultat attendu | Statut |
| --- | --- | --- | --- |
| GC-V2-T302 | Premier lancement appareil en français sans choix enregistré | Interface et jeu en français | Spécifié, non exécuté |
| GC-V2-T303 | Premier lancement appareil en anglais sans choix enregistré | Interface et jeu en anglais | Spécifié, non exécuté |
| GC-V2-T304 | Premier lancement dans une langue autre que fr/en | Repli anglais | Spécifié, non exécuté |
| GC-V2-T305 | Choix manuel du français depuis l'anglais | Application, règles et aides basculent en français sans changer la partie | Spécifié, non exécuté |
| GC-V2-T306 | Sélecteur des langues au MVP | Français et anglais uniquement, sans langues indisponibles | Spécifié, non exécuté |
| GC-V2-T307 | Partie hors ligne en français ou anglais | Règles, aide et actions restent utilisables sans réseau | À vérifier, non exécuté |
| GC-V2-T308 | Ajout futur d'une troisième langue complète | Langue détectable/sélectionnable sans modification de règle ou sauvegarde | À vérifier lors d'une livraison ultérieure |
| GC-V2-T309 | Relecture des écrans critiques dans les deux langues | Aucun texte métier manquant ni traduction ambiguë de règle | À vérifier, non exécuté |

**GC-29 : option B validée ultérieurement — pioche face cachée avec compteur exact des cartes restantes (voir §43).**



## 43. Décision UX Gridcannon V2 — GC-29 : pioche fermée avec compteur de cartes restantes

**Option B VALIDÉE par le porteur le 22 novembre 2026.** La pioche reste représentée **face cachée**, sans possibilité d'inspecter son contenu ni son ordre ; l'interface affiche de façon permanente un **compteur exact du nombre de cartes physiques encore présentes dans la pioche**. Les cartes tirées auparavant ne sont pas présentées dans un historique consultable par GC-29. La zone provisoire des numériques déjà révélées pendant la recherche de figure reste distincte et inchangée (GC-19).

### 43.1. Contrat fonctionnel et UX

1. **Contenu du compteur :** utiliser exclusivement la longueur de la **pioche réelle** dans l'état canonique du moteur. Ne compter ni les cartes des neuf piles de la grille, ni les figures en périphérie, ni les As/Jokers conservés en réserve, ni les numériques temporairement écartées de GC-19.
2. **Information autorisée :** montrer la quantité seulement, jamais la valeur ou l'enseigne d'une carte cachée, l'ordre des futures cartes, ni la carte suivante. La pioche est visuellement face cachée tant qu'elle contient des cartes.
3. **Actualisation à chaque changement réel :** décrémenter après chaque tirage confirmé ; incrémenter lorsque GC-05 réinsère une pile entière sous la pioche ; refléter les réinsertions GC-10 et autres mécanismes effectivement exécutés par le moteur. Une prévisualisation GC-23 ou une animation GC-24 ne change pas le compteur.
4. **Pendant la recherche GC-06/18/19 :** chaque clic « Carte suivante » retire une seule carte de la pioche et diminue le compteur d'une unité ; les numériques de la zone temporaire ne sont pas comptées jusqu'à leur remise effective sous la pioche. La remise de ce lot recalcule le compteur selon le nombre exact réintroduit.
5. **Pioche vide :** afficher explicitement **0** et signaler l'épuisement sans annoncer automatiquement une défaite. Si des actions spéciales légalement utiles restent disponibles, GC-20 autorise la continuation selon ses règles.
6. **Préparation et remplacement initial :** après la distribution et les éventuels tirages du remplacement facultatif GC-14/16, refléter la pioche réelle à chaque étape où elle est montrée, y compris les cartes réinjectées. Pas de nombre supposé fixe après la mise en place.
7. **Aucune nouvelle capacité :** le compteur est strictement informatif ; il ne permet pas de trier, consulter, manipuler, mélanger ou reconstituer un historique des cartes passées.
8. **Sauvegarde/reprise :** reconstruire le nombre depuis la pioche restaurée sans second compteur sauvegardé divergent. Aucun double décrément à la suite de clics concurrents, de rafraîchissements ou d'une reprise.
9. **Localisation et accessibilité :** les libellés « Cartes restantes » et « Pioche vide » sont disponibles en français et en anglais pour le MVP (GC-28) et extensibles aux langues futures. Le compteur reste lisible sur mobile, distinguable des totaux d'armures et interprétable par lecteur d'écran.
10. **Source de vérité :** la quantité n'est pas un score supplémentaire ni une mécanique nouvelle de Gridcannon V2 ; c'est une aide de lecture propre à CardForge.

**Exemple :** si 12 cartes sont dans la pioche, le compteur affiche « 12 cartes restantes ». Le joueur en révèle une par « Carte suivante », ce qui donne 11. Trois numériques déjà tirées sont temporairement écartées dans GC-19 : elles ne sont pas comptées. Après le placement légal de la nouvelle figure et la réinsertion de ces trois numériques selon GC-10, le nombre augmente de trois, sans révéler leur nouvel ordre.

**Statut : GC-29 CLOS pour CardForge — option B validée le 22 novembre 2026.** Spécification documentaire uniquement, aucun test exécuté.

### 43.2. Scénarios de conformité — GC-29

| Test | Situation | Résultat attendu | Statut |
| --- | --- | --- | --- |
| GC-V2-T310 | Pioche de 12 cartes physiques | Affichage 12, cartes cachées et non consultables | Spécifié, non exécuté |
| GC-V2-T311 | Une carte tirée légalement | Compteur décrémenté d'une carte exactement | Spécifié, non exécuté |
| GC-V2-T312 | Pioche alimentée par extraction d'une pile de quatre cartes | Compteur augmenté de quatre, sans révélation de contenu | Spécifié, non exécuté |
| GC-V2-T313 | Trois numériques temporairement écartées pendant recherche de figure | Hors du compteur ; chacune visible uniquement dans la zone GC-19 | Spécifié, non exécuté |
| GC-V2-T314 | Réinsertion des trois numériques de GC-19 après figure placée | Compteur augmenté de trois, zone temporaire masquée | Spécifié, non exécuté |
| GC-V2-T315 | Pioche vide avec As encore utile | Compteur 0, pas de défaite automatique contraire à GC-20 | Spécifié, non exécuté |
| GC-V2-T316 | Prévisualisation de tir, puis annulation | Compteur et pioche inchangés | Spécifié, non exécuté |
| GC-V2-T317 | Reprise de sauvegarde avec pioche de taille connue | Compteur reconstruit exactement sans duplication | Spécifié, non exécuté |
| GC-V2-T318 | Double commande de tirage concurrente sur le même état | Un seul tirage accepté, compteur cohérent | Spécifié, non exécuté |
| GC-V2-T319 | Consultation de la pioche par clic/toucher | Aucune identité de carte cachée ni historique divulgué | Spécifié, non exécuté |
| GC-V2-T320 | Lecture du compteur sur mobile en français et anglais | Libellé et quantité lisibles, état 0 explicite | À vérifier en UX, non exécuté |

**GC-30 : option B validée ultérieurement — mini-cartes interactives pour les As et Jokers révélés ; voir §44.**


## 44. Décision UX Gridcannon V2 — GC-30 : As et Jokers en cartes miniatures interactives

**Option B VALIDÉE par le porteur le 22 novembre 2026.** Les actions spéciales physiquement **déjà découvertes** sont représentées dans une réserve dédiée par des **mini-cartes illustrées interactives**. Chaque As et Joker garde une identité stable ; la présentation distingue les cartes **disponibles** de celles **consommées**. Les cartes pas encore découvertes **ne sont pas exposées**. Sélectionner une carte disponible ouvre le choix de son action **légale** ; cette seule sélection ne la dépense pas.

### 44.1. Contrat fonctionnel et UX

1. **Réserve fidèle :** afficher seulement les As/Jokers effectivement révélés pendant la mise en place, une pioche normale ou la recherche de figure GC-06/09/18 ; jusqu'à **quatre As et deux Jokers physiques distincts**, sans création de ressources fictives ni anticipation de la pioche.
2. **Mini-cartes :** chaque carte révélée est identifiable par son type (As = Extraction ; Joker = Réaffectation), avec un rendu adapté à l'univers spatial/fantasy et un texte accessible. Les informations d'identité utiles aux actions restent explicites.
3. **États clairs :** une ressource non dépensée est disponible ; une ressource déjà consommée reste visible comme **utilisée**, mais ne peut plus être activée. Ne pas compter une carte non découverte comme « utilisée ».
4. **Activation volontaire :** sélectionner une ressource disponible ouvre le flux d'Extraction (choix d'une pile non vide, GC-03/05) ou de Réaffectation (choix de la carte supérieure et de la destination légalement autorisée, GC-04/11). Aucun mouvement ou retrait de carte ne se produit à la simple ouverture.
5. **Confirmation et validation :** le moteur contrôle les conditions de légalité et les cibles au moment de confirmer. En cas d'annulation, d'absence de destination légale, d'état obsolète ou d'action devenue impossible, la ressource n'est pas dépensée.
6. **Moment d'utilisation :** respecter les fenêtres d'activation déjà autorisées par les décisions de Version 2, notamment après pioche avant placement, durant la recherche manuelle d'une figure et après épuisement de la pioche si le recours reste utile (GC-11/18/20). Ne pas autoriser une dépense durant une phase où les règles l'interdisent (GC-16).
7. **Joker et prévisualisation :** la sélection d'une destination par Joker peut présenter la prévisualisation non destructive GC-23 ; le Joker n'est consommé qu'à confirmation du déplacement réellement exécuté. Le tir éventuel suit GC-24.
8. **Unicité :** une action confirmée consomme exactement **une** carte physique de la réserve et effectue exactement une transition métier. Double clics, rafraîchissements ou reprises ne doivent pas dupliquer la dépense, le mouvement ou un tir.
9. **Présentation mobile :** prévoir une bande compacte de mini-cartes, adaptative et éventuellement défilante ; ne pas masquer la grille, les décisions ouvertes ni les contrôles de confirmation. Les cartes consommées restent identifiables sans se confondre avec les ressources disponibles.
10. **Accessibilité :** taille d'activation adaptée au tactile, parcours clavier, état « disponible/utilisé » perceptible par lecteur d'écran et autrement que par la couleur ; ne pas dépendre du survol, d'une animation ou du son (GC-24/25).
11. **Localisation et sauvegarde :** libellés, explications et messages disponibles en français et anglais dès le MVP (GC-28). Après rechargement, reconstruire la réserve à partir des identifiants physiques et de leur état métier, sans inventaire d'interface divergent.
12. **Portée :** GC-30 est un choix d'interface CardForge sans modification des six actions spéciales originales ni de leur usage ; le nombre de ressources affichées est celui **réellement révélées**, non un compteur de ressources encore à découvrir.

**Exemple :** deux As et un Joker ont été découverts ; un As est déjà utilisé. La réserve présente trois mini-cartes, dont un As inactif. Le joueur sélectionne le Joker, envisage un déplacement, puis annule : le Joker reste disponible. Après une réaffectation légale confirmée, il passe à l'état utilisé ; aucun Joker non révélé n'apparaît.

**Statut : GC-30 CLOS pour CardForge — option B validée le 22 novembre 2026.** Spécification documentaire uniquement, sans développement ni test exécuté.

### 44.2. Scénarios de conformité — GC-30

| Test | Situation | Résultat attendu | Statut |
| --- | --- | --- | --- |
| GC-V2-T321 | Deux As et un Joker révélés, trois autres ressources encore cachées | Seules trois mini-cartes physiques en réserve sont visibles | Spécifié, non exécuté |
| GC-V2-T322 | Un As dépensé parmi trois cartes découvertes | Mini-carte « utilisée » visible, non activable ; autres inchangées | Spécifié, non exécuté |
| GC-V2-T323 | Sélection d'un As puis annulation | Aucune pile retirée, As non dépensé | Spécifié, non exécuté |
| GC-V2-T324 | Confirmation d'Extraction sur pile non vide | Une pile extraite et un As dépensé exactement une fois | Spécifié, non exécuté |
| GC-V2-T325 | Tentative d'Extraction illégale | Dépense refusée, carte toujours disponible | Spécifié, non exécuté |
| GC-V2-T326 | Joker sélectionné puis prévisualisation GC-23 annulée | Aucune dépense, grille inchangée | Spécifié, non exécuté |
| GC-V2-T327 | Joker confirmé sur déplacement légal déclenchant un tir | Une dépense, un déplacement et tirs réels résolus | Spécifié, non exécuté |
| GC-V2-T328 | Recherche GC-18 : Joker tiré | Carte ajoutée à la réserve, aucune activation automatique | Spécifié, non exécuté |
| GC-V2-T329 | Préparation inachevée GC-16 | Aucune activation spéciale prématurée | Spécifié, non exécuté |
| GC-V2-T330 | Pioche vide avec un As légalement utile GC-20 | Mini-carte activable, aucune défaite prématurée | Spécifié, non exécuté |
| GC-V2-T331 | Double confirmation ou reprise après dépense | Une seule ressource consommée, invariant physique préservé | Spécifié, non exécuté |
| GC-V2-T332 | Mini-cartes sur mobile, clavier et lecteur d'écran en français/anglais | Type, disponibilité et action compréhensibles et accessibles | À vérifier en UX, non exécuté |

**Prochain arbitrage proposé — GC-31 / suivi de progression des figures :** comment représenter la progression vers les **douze figures vaincues**, sachant que les figures éliminées restent retournées à leur emplacement autour de la grille ? Options : **A**, aucune jauge supplémentaire (seul le plateau fait foi) ; **B**, compteur compact « Figures vaincues : X/12 » en plus de la représentation physique des figures ; **C**, panneau de progression détaillé par figure et par côté avec récapitulatif de leur état. Ne jamais révéler les figures non encore tirées ni considérer une figure non révélée comme déjà vaincue.
