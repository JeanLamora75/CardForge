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

**Décision de nom CardForge à faire valider :** dans la documentation interne, l'identifiant « Gridcannon » peut rester stable ; **le nom public de l'adaptation devrait être distinct de « Gridcannon » seul**, accompagné d'une attribution explicite à Tom Francis. Le titre final et la formule des crédits ne sont **pas encore décidés**.

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
| G-06 | Invitation publique à créer des adaptations, crédit à Tom Francis recommandé et nom public différent de « Gridcannon » seul recommandé | **Consigne d'auteur confirmée ; décision de nom CardForge ouverte** |

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
