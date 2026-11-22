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

- La publication consultée indique : **la page Web permet de choisir la valeur d'un joker jusqu'à 10, mais le livret Classic v1.1.0 reproduit indique une valeur de 10**, et son enseigne peut être celle requise.
- Le joker peut participer à la puissance ou jouer le rôle de déclencheur selon les restrictions officielles à préciser.
- **Correction documentaire :** la formulation ancienne « joker vaut 10 » est trop restrictive pour restituer fidèlement la source ; pour CardForge, **valeur du joker = point de divergence entre sources**, mais le minimum possible, l'instant du choix et la disponibilité lors d'attaques partielles nécessitent validation du texte complet.
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
| CTD-06 | Joker polyvalent en enseigne ; valeur variable jusqu'à 10 sur la page Web, valeur fixe 10 dans le livret Classic reproduit | **Conflit documentaire, non arbitré** |
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

## 9. Recherche complémentaire du 22 novembre 2026 — confrontation des textes

**Sources examinées pendant cette recherche :**
- [Règles de présentation publiées par Gifts for Card Players sous le nom de Mark S. Ball](https://giftsforcardplayers.com/clear-the-dungeon-a-solo-card-game/), sections Gameplay et Jokers.
- [Reproduction Scribd du document « Clear the Dungeon Complete », incluant Classic v1.1.0 daté du 23 octobre 2024](https://www.scribd.com/document/846020212/Clear-the-Dungeon-Complete-1-0-2). **Source secondaire :** la reproduction ne prouve pas être la version officielle définitive ni inchangée ; toutefois le texte du livret est directement visible.
- [Document original Google Docs lié par la page de règles](https://docs.google.com/document/d/1BBPusx0Q_UM7vo8i5Yzuk7UyrWBf3PvjdDsx_h-qHwQ/edit) : lien identifié, mais consultation du texte intégral impossible dans cet environnement (interface dépendante de JavaScript).

### Ce que la recherche permet de confirmer

- Classic 1.1.0 suit trois phases de tour **Pioche → Attaque → Défausse**. Trois cartes sont piochées ; elles doivent être jouées ou défaussées avant une nouvelle main.
- Les deux premières cartes d'attaque totalisent **au moins** la résistance J11/Q12/K13 ; la troisième correspond à l'enseigne et provoque la défaite immédiate du monstre.
- Les cartes non jouées/défaussées alimentent les dégâts ; **sept dégâts** font perdre immédiatement ; la réserve est facultative et reste **désactivée** par décision CardForge.
- Le score officiel est la quantité de cartes encore dans la pioche, sans les cartes de la main ; il ne faut pas attribuer un score artificiel aux défaites ou abandons.

### Divergence importante CTD-J01 — valeur du joker

- **Page Web :** le joueur **choisit** la puissance du joker, dans une plage **jusqu'à 10** ; enseigne libre.
- **Livret Classic reproduit :** le joker a une puissance **fixe de 10**, son enseigne est libre et il peut servir de **déclencheur**.
- **Décision : INCONNUE.** Ces formulations ne sont pas équivalentes. Ne pas coder une puissance libre sans confirmation de la version originale faisant foi. La prise de décision doit être documentée comme clarification officielle, **pas** comme simplification par CardForge.

### Questions réévaluées

| ID | Résultat | Statut |
| --- | --- | --- |
| O-CTD-01 | Les phases Pioche/Attaque/Défausse sont attestées ; répartition et placement d'attaques partielles encore incomplets | Partiellement confirmé |
| O-CTD-02 | Conditions « avant épuisement de la pioche » mentionnées ; derniers tirages incomplets/absence de coup non détaillés | Ouvert |
| O-CTD-03 | Le texte indique que les cartes peuvent être posées sur les **monstres choisis** ; séquence d'élimination et défausse de plusieurs attaques restent à préciser | Partiellement confirmé |
| O-CTD-04 / CTD-J01 | La plage de puissance du joker est **contradictoire** (choix jusqu'à 10 vs 10 fixe) ; l'enseigne flexible et sa fonction de déclencheur sont soutenues | **Bloquant** |
| O-CTD-05 | La défaite est immédiate au **septième dégât** ; ordre en cas d'actions simultanées non décrit | Partiellement confirmé |
| O-CTD-06 | Score = pioche restante, main exclue | Confirmé pour victoire |

**À obtenir pour clore CTD-J01 et O-CTD :** consultation du Google Doc officiel via navigateur permettant JavaScript, PDF de l'auteur ou clarification directe de Mark S. Ball. Ne pas utiliser une simulation tierce comme source de règle supérieure au créateur.

## 10. Approfondissement et hiérarchie des preuves (22 novembre 2026)
- **[Dossier de recherche approfondie](./recherche-approfondie-2026-11-22.md)** — sources, confrontations et décisions différées.
- **CTD-J01 demeure BLOQUANT :** la page de présentation donne un joker de puissance choisie jusqu'à 10, mais le livret Classic 1.1.0 reproduit et l'implémentation PySolFC attribuent une valeur fixe de 10. La valeur fixe **semble la mieux soutenue pour le livret Classic 1.1.0**, sans constituer un arbitrage officiel. La copie officielle du livret Google Docs n'a pas pu être récupérée malgré une tentative d'accès ; l'auteur reste la meilleure source de clarification.
- **CTD-P01 :** le texte de la règle précise **exactement trois cartes pour vaincre un monstre**, avec les deux premières de puissance et la troisième de déclenchement. La possibilité de préparer plusieurs attaques partielles et leur persistance entre mains sont à confirmer séparément.
- **CTD-P02 :** le texte du livret reproduit indique de dévoiler **immédiatement** une carte de monstre quand elle est entièrement découverte ; ce principe peut devenir un test, sans inventer le déroulement d'une attaque simultanée.
- **CTD-D01 :** le jeu se termine **immédiatement au septième dégât**. L'épuisement de la pioche avec une main non vide reste une question distincte.
- **Interdiction de mélange des variantes :** les variantes proposées sur des sites secondaires (Boomer-Ace, Power Reserve, aptitudes des rois, agencements alternatifs) ne font pas partie de la configuration Classic 1.1.0 retenue.

## 11. Arbitrage CardForge du 22 novembre 2026 — CTD-J01 clos pour l'implémentation

**Décision explicite du porteur : un joker a une valeur de puissance fixe de 10.** Il peut adopter l'enseigne requise, y compris lorsqu'il sert de déclencheur si cette fonction est admise par la règle de la version retenue. **Aucune sélection de valeur 1–9** n'est proposée au joueur.

- **Statut d'implémentation : CTD-J01 FERMÉ par décision CardForge.** Le référentiel Classic 1.1.0 reproduit donne également une valeur 10, mais la présentation Web de l'auteur mentionne une valeur choisie jusqu'à 10 ; cette divergence documentaire est conservée ci-dessus comme historique de recherche et **n'est pas réputée résolue officiellement par l'auteur**.
- Tester un joker comme carte de puissance = **10**, et comme déclencheur de toute enseigne autorisée ; tester que la valeur ne dépend ni des illustrations ni d'un choix utilisateur.
- **Toujours ouverts :** O-CTD-01/03 (attaques incomplètes et leur durée), O-CTD-02 (épuisement de pioche et main), O-CTD-05 (ordre de fin de partie dans les cas limites). Le déroulement des défausses exactes demeure à valider.


## 12. Décision fonctionnelle CTD-01 / CTD-ARB-01 — attaques partielles multi-monstres

**Décision du porteur de CardForge, 22 novembre 2026 : option B VALIDÉE.**

**Règle retenue pour CardForge :** le joueur peut engager plusieurs attaques incomplètes contre des monstres différents, en répartissant des cartes de sa main entre ces cibles. Les cartes affectées à ces attaques demeurent associées à leur monstre lorsque le joueur passe à une nouvelle main ou à un nouveau tour, jusqu'à l'achèvement de l'attaque, sous réserve d'autres règles de déplacement et défausse à trancher séparément. Un monstre n'est vaincu qu'une fois les trois cartes nécessaires réunies et les conditions de puissance/enseigne satisfaites.

**Conséquences vérifiables :**
- Plusieurs monstres peuvent chacun conserver des cartes posées au même instant.
- Les cartes posées sur ces monstres ne sont pas automatiquement envoyées à la pile de dégâts lors du renouvellement de la main.
- Le contenu et l'affectation des attaques partielles doivent être inclus dans la sauvegarde et restitués à l'identique.
- Aucune carte ne peut être comptée deux fois comme carte disponible dans deux emplacements.
- Cette décision **ne tranche pas** si le joueur peut reprendre, changer de cible, remplacer ou réorganiser une carte déjà posée : **prochain arbitrage CTD-02**.
- Cette décision **ne tranche pas** les limites de cartes par monstre ni la façon de récupérer les cartes si un monstre est supprimé dans un autre événement ; ne rien inventer.

**Statut :** CTD-01 (nom de l'arbitrage utilisateur) = **validé**. Pour éviter la collision avec le code de contrôle documentaire « CTD-01 — composition du paquet », cette décision est tracée techniquement sous **CTD-ARB-01**. Les anciens paragraphes notant O-CTD-01/03 « ouverts » constituent l'historique antérieur ; ce point précis est maintenant résolu pour CardForge.

**Provenance :** arbitrage explicite du porteur, cohérent avec la possibilité de poser des cartes contre différents monstres dans la documentation précédente, mais persistance entre mains non attestée indépendamment dans la version originale intégrale. Ne pas attribuer cette clarification à Mark S. Ball.


## 13. Décision fonctionnelle CTD-02 / CTD-ARB-02 — réaffectation pendant la main actuelle

**Option B VALIDÉE par le porteur le 22 novembre 2026.** Pour CardForge, le joueur peut reprendre dans sa main ou déplacer vers un autre monstre une carte qu'il a placée **pendant la main actuelle**, tant que cette main n'est pas clôturée. Les cartes qui étaient déjà placées avant l'ouverture de cette main sont **définitivement engagées** et non récupérables/réaffectables.

**Conséquences fonctionnelles :**
- Une carte déposée sur un monstre durant la main courante est marquée comme « placement courant provisoire » et peut être reprise ou réaffectée à un autre monstre tant que la main est ouverte et que l'attaque concernée n'a pas été entièrement résolue. Reprendre une carte la remet dans la main courante sans augmenter le nombre total de cartes détenues.
- Clore la main confirme les placements encore provisoires ; ils deviennent **verrouillés** pour toutes les mains suivantes. La pioche d'une nouvelle main ne déverrouille jamais les cartes anciennes, conformément à CTD-ARB-01.
- **Une attaque déjà résolue et un monstre vaincu ne sont pas annulés** par le déplacement d'une carte ; les choix de retour en arrière sur une action terminée ou d'annulation de tour ne sont pas ouverts par cette décision.
- La sauvegarde/reprise restitue, en plus des cartes par monstre, la distinction entre cartes verrouillées et cartes modifiables de la main courante ainsi que la phase en cours.
- La validation de la fin de main est le **point de verrouillage** ; l'interface doit permettre au joueur de comprendre la conséquence avant de continuer.

**Portée :** décision de comportement CardForge sur une ambiguïté documentaire, **non présentée comme une confirmation de l'auteur**. CTD-02 / CTD-ARB-02 est **CLOS pour l'implémentation**.

**Prochaine question CTD-03 :** clôture de main et traitement des cartes restant non placées (défausse et dégâts).


## 14. Décision fonctionnelle CTD-03 / CTD-ARB-03 — défausse explicite en fin de main

**Option B VALIDÉE par le porteur le 22 novembre 2026 :** les cartes inutilisées de la main courante doivent être **explicitement défaussées**, individuellement ou par une action « Défausser les cartes restantes », avant de pouvoir piocher la main suivante. Les cartes défaussées alimentent la **pile de dégâts**, chacune comptant pour **une carte de dégâts**. La défaite s'applique **immédiatement au septième dégât**, même si une pioche ultérieure serait possible.

**Règles exécutables pour CardForge :**
- Tant qu'une carte reste dans la main courante, une nouvelle main ne peut pas être piochée. Les cartes peuvent être jouées selon les règles d'attaque ou défaussées par le joueur ; **elles ne sont jamais conservées gratuitement dans une nouvelle main**.
- Le joueur peut défausser une carte explicitement, ou toutes les cartes restantes en une action explicite. Dans ce dernier cas, chaque carte compte séparément dans la pile de dégâts et le seuil de sept est contrôlé immédiatement pendant l'opération ; aucune carte n'est piochée si la défaite survient.
- Les cartes déjà affectées à des **attaques partielles** ne sont pas des cartes « inutilisées en main » ; elles restent sur leur monstre selon CTD-ARB-01.
- Les cartes posées pendant la main actuelle restent récupérables/repositionnables **avant clôture** selon CTD-ARB-02. La clôture de la main, possible lorsque la main est vide, confirme/verrouille les placements partiels encore provisoires.
- La défausse et la transition de main sont des actions métier explicites et sauvegardées selon AD-03/09/10/11 ; l'UI indique la conséquence en dégâts avant de défausser.

**Exemple d'acceptation :** le joueur a joué un 8 sur un roi et conserve les cartes 4 et 2 en main. Une action explicite « Défausser les cartes restantes » envoie 4 et 2 aux dégâts (**+2**), laisse le 8 engagé sur le roi, puis rend la nouvelle pioche possible **si la partie n'est pas terminée**. En cas de six dégâts initiaux, la défausse déclenche la défaite dès la première carte défaussée.

**Statut :** CTD-03 / CTD-ARB-03 **clos**. C'est un choix d'interface explicitant la défausse prévue par les règles publiées, et non une variante autorisant la conservation de cartes inutilisées entre les mains. **Prochain arbitrage : CTD-04, fin de pioche (1–2 cartes restantes, pioche vide, actions encore possibles).**


## 15. Décision fonctionnelle CTD-04 / CTD-ARB-04 — dernière main incomplète

**Décision du porteur, 22 novembre 2026 : option A VALIDÉE.** Lorsqu'une nouvelle pioche est autorisée (main précédente entièrement jouée ou explicitement défaussée et phase close), le joueur prend **toutes les cartes restant dans la pioche, dans leur ordre exact**, même si elles sont seulement une ou deux, au lieu d'exiger trois cartes.

**Contrat métier :**
- Si la pioche contient trois cartes ou plus, piocher trois cartes suivant la règle ordinaire. Si elle contient **deux**, en piocher deux ; si elle contient **une**, en piocher une.
- Les cartes de cette dernière main peuvent être placées en attaque, y compris pour achever une attaque partielle précédemment engagée selon **CTD-ARB-01**, et restent provisoirement réaffectables selon **CTD-ARB-02** jusqu'à clôture ou résolution.
- Les cartes non utilisées de cette dernière main sont explicitement défaussées, conformément à **CTD-ARB-03** et au seuil de sept dégâts. Le nombre inférieur à trois **n'entraîne pas une défausse automatique**, et aucune carte de la pile de dégâts ne sert à compléter artificiellement la main.
- La pioche devenue vide **pendant le tirage de la dernière main ne déclenche pas de défaite instantanée du seul fait de son épuisement** : la main obtenue est disponible pour les actions légales. Le traitement final une fois toutes les ressources utilisables épuisées reste à décider en **CTD-05**.
- Aucune création, aucun recyclage, aucun remélange des cartes de la pioche, notamment lors d'une reprise après sauvegarde.

**Exemples :** 2 cartes restantes → main de 2 et pioche 0 ; 1 carte restante → main de 1 et pioche 0 ; 0 carte restante → aucune nouvelle main (son effet terminal est décidé séparément en CTD-05).

**Statut : CTD-04 / CTD-ARB-04 CLOS pour CardForge.** La taille réduite de la dernière main est un arbitrage explicite du porteur et n'est pas attribuée comme précision certaine à Mark S. Ball faute de source primaire détaillée sur ce cas.


## 16. Décision fonctionnelle CTD-05 / CTD-ARB-05 — défaite sur épuisement après la dernière main

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Une pioche vide **ne provoque pas immédiatement une défaite** si la dernière main, éventuellement composée d'une ou deux cartes (CTD-ARB-04), est encore active. Le joueur peut achever ses actions légales, y compris compléter les attaques partielles existantes. **Au moment de clôturer la dernière main**, si la pioche est vide et qu'au moins un monstre reste vivant, **défaite automatique**, sans imposer un clic inutile sur « Piocher ».

**Règles de résolution retenues pour CardForge :**
- Le moteur vérifie toujours une **victoire dès que le 12e monstre est vaincu**. Une partie gagnée ne doit pas être convertie en défaite parce que la pioche est vide ou que la main n'a pas été formellement clôturée.
- Les cartes de la dernière main demeurent jouables jusqu'à leur utilisation ou leur **défausse explicite** selon CTD-ARB-03. La présence d'attaques partielles n'autorise pas à inventer des cartes ou de nouvelles mains quand la pioche est vide.
- Si le **7e dégât** est atteint au cours de la défausse, la défaite s'applique **immédiatement**, avant toute clôture de la main ; cette règle déjà documentée reste prioritaire.
- Une fois la main vide, le joueur peut clôturer cette main ; ses placements provisoires éventuels sont verrouillés selon CTD-ARB-02. Si **pioche vide + monstres restants**, la défaite par épuisement est alors prononcée automatiquement.
- Si la pioche est encore non vide et la main vide, la clôture prépare normalement la pioche suivante. Aucun tirage ni remélange n'est autorisé après une fin de partie.
- L'issue est persistée **une seule fois**, avec sa cause (victoire / dégâts / épuisement) ; une reprise, un double clic ou un rafraîchissement ne peut déclencher deux résultats.

**Exemple de cas limite :** pioche vide, 2 cartes dans la dernière main et un seul monstre encore vivant. Si ces cartes permettent de terminer une attaque partielle qui tue ce monstre : **victoire immédiatement**. Sinon, le joueur utilise/défausse sa main, puis clôture ; si le monstre demeure, **défaite**.

**Statut : CTD-05 / CTD-ARB-05 CLOS pour l'implémentation.** Le moment précis de cette défaite est un arbitrage fonctionnel CardForge, non revendiqué comme citation littérale de Mark S. Ball. **Prochain point CTD-06** : ordre de retrait des trois cartes d'attaque, élimination du monstre et révélation du suivant, lorsque plusieurs attaques sont en préparation.


## 17. Décision fonctionnelle CTD-06 / CTD-ARB-06 — révélation immédiate après une victoire locale

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Lorsqu'une attaque complète contre un monstre accessible est reconnue valide, ce monstre est vaincu et **le monstre suivant de la même colonne est révélé immédiatement**, s'il en reste un caché.

**Ordre de traitement du moteur CardForge :**
1. Vérifier que l'attaque est complète et valide : deux cartes de puissance dont la somme atteint la résistance, puis déclencheur de l'enseigne du monstre (joker fixe 10 et polyvalent selon CTD-J01).
2. Retirer du jeu **uniquement** les trois cartes de cette attaque et le monstre vaincu, sans les traiter comme des cartes défaussées infligeant des dégâts.
3. Si la colonne contient encore une figure cachée et accessible, **la révéler immédiatement**, sans attendre la clôture de la main ni une action « Révéler ».
4. Préserver l'état des attaques partielles sur les autres monstres ; le joueur peut continuer à jouer les cartes qu'il lui reste en main courante contre les monstres visibles, y compris celui qui vient d'être révélé.
5. Si le monstre éliminé était le **douzième**, appliquer aussitôt la **victoire définitive** ; aucune action supplémentaire, aucune révélation ni pioche n'est nécessaire. Si la colonne est vide après élimination mais que d'autres monstres vivent ailleurs, il n'y a rien à révéler dans cette colonne.
6. Persister dans un état cohérent le retrait, la nouvelle carte révélée, les cartes en main, les attaques partielles et le résultat éventuel ; un rafraîchissement ou une commande répétée ne peut retirer deux fois un monstre.

**CTD-01 à CTD-05 restent applicables.** La révélation n'oblige pas le joueur à clôturer sa main, ne libère aucune carte engagée précédemment et ne compte jamais comme défausse vers la pile de dégâts.

**Statut : CTD-06 / CTD-ARB-06 CLOS pour CardForge.** Le principe de révélation immédiate est étayé par le livret Classic reproduit, mais l'implémentation devra continuer à respecter les autres règles documentées ; aucun test de moteur n'a été exécuté lors de cet arbitrage.

**Prochaine question CTD-07 :** l'ordre de pose des deux cartes de puissance et de la troisième carte déclencheuse, compte tenu des attaques partielles persistantes et de la correction de placements pendant la main courante.


## 18. Décision fonctionnelle CTD-07 / CTD-ARB-07 — ordre obligatoire des cartes d'une attaque

**Option A VALIDÉE par le porteur le 22 novembre 2026 :** pour attaquer un monstre, le joueur pose d'abord **deux cartes de puissance** puis, lorsque leur somme atteint au moins la résistance du monstre, **une troisième carte déclencheuse** de l'enseigne requise (un joker pouvant adopter cette enseigne). La pose du déclencheur **avant** ces deux cartes n'est pas une action légale. La notion de « troisième carte » est **un rôle et un ordre chronologique**, pas une combinaison reconstruite automatiquement à partir de trois cartes quelconques.

**Contrat de gameplay CardForge :**
- Sur un monstre visible, le moteur suit les positions d'attaque **puissance 1 → puissance 2 → déclencheur**. Les deux cartes de puissance peuvent être d'enseignes quelconques ; leur ordre mutuel est indifférent pour le calcul, mais chacune est posée avant le déclencheur.
- Une attaque partielle avec **une seule carte de puissance** reste préparée d'une main à l'autre conformément à CTD-ARB-01, et peut recevoir sa seconde puissance lors d'une main ultérieure.
- Après que deux cartes de puissance légales atteignent la résistance, le joueur peut conserver cette attaque partielle et attendre une **carte déclencheuse valide** au cours d'une main ultérieure. Aucune troisième carte déclencheuse n'est « réservée » à l'avance.
- Les cartes de la main courante peuvent être déplacées/reprises avant clôture conformément à CTD-ARB-02 ; celles de mains précédentes restent engagées. Une attaque déjà résolue est irréversible.
- Le déclencheur est **exactement une** carte de l'enseigne du monstre (ou joker autorisé), **indépendamment de sa valeur** ; les jokers de puissance ont la valeur fixe 10 conformément à CTD-J01.
- La pose du déclencheur valide termine immédiatement l'attaque et entraîne retrait/révélation selon CTD-ARB-06, sans défausse de ces cartes vers les dégâts.
- **À trancher en CTD-08 :** si une seconde carte de puissance fait une somme **inférieure** à la résistance du monstre, faut-il refuser immédiatement cette pose ou autoriser provisoirement deux cartes sous le seuil ? Aucune troisième carte de puissance et aucun déclencheur ne doivent être autorisés à contourner le critère officiel de victoire.

**Statut : CTD-07 / CTD-ARB-07 CLOS.** Il s'agit de l'application explicite de la séquence documentée des « deux premières cartes de puissance » puis de la « troisième carte déclencheuse » au modèle de mains/attaques partielles choisi dans CardForge. Aucun test de moteur n'a été exécuté à l'occasion de cet arbitrage.


## 19. Arbitrage CardForge CTD-08 / CTD-ARB-08 — refus d'une seconde puissance insuffisante

**Décision du porteur du 22 novembre 2026 : OPTION A VALIDÉE.** Pour un monstre de résistance `R`, si une première carte de puissance `P1` est déjà posée, la seconde carte de puissance `P2` ne peut être placée que si `P1 + P2 >= R`. **Si la somme est inférieure à R, la pose de P2 est refusée**, sans modification de l'état du plateau, de la main, des cartes verrouillées ni de la pile de dégâts. Le joueur conserve P2 dans sa main et peut tenter un autre placement autorisé ou la défausser explicitement selon CTD-ARB-03.

**Exemples exécutables :**
- Valet de résistance 11, première puissance 5 : une seconde puissance 4 est **refusée** car 5 + 4 = 9 ; une seconde puissance 6 est **acceptée** car 5 + 6 = 11.
- Roi de résistance 13, première puissance 5 : une seconde puissance 8 est **acceptée** ; une seconde puissance 7 est **refusée**.
- Une somme **supérieure** au seuil est aussi recevable ; l'égalité stricte n'est pas requise.
- Un joker employé comme puissance vaut **10 fixe** conformément à CTD-J01.
- Aucune troisième carte de puissance ne peut compenser une deuxième carte insuffisante ; le rôle de troisième carte reste **déclencheur** après deux puissances suffisantes selon CTD-ARB-07.

Cette validation ne modifie pas les règles CTD-ARB-01/02 : la première puissance posée sur un monstre peut rester d'une main à l'autre et une carte posée pendant la main courante peut être reprise tant que sa main est ouverte.

**Statut : CTD-08 / CTD-ARB-08 CLOS pour l'implémentation CardForge.** Ce rejet explicite des poses illégales est un arbitrage de comportement demandé par le porteur ; ne pas le présenter comme une règle formellement précisée par Mark S. Ball. Aucun test n'a été exécuté.

**Prochaine question CTD-09 :** une *première* carte de puissance peut-elle être placée si, même accompagnée de la plus forte seconde puissance possible (10), elle ne peut jamais atteindre la résistance du monstre ?


## 20. Décision fonctionnelle CTD-09 / CTD-ARB-09 — première puissance mathématiquement complétable

**Option A VALIDÉE par le porteur le 22 novembre 2026.** Une première carte de puissance de valeur `P1` ne peut être placée contre un monstre de résistance `R` que si **`P1 + 10 >= R`**, car une carte de puissance supplémentaire (joker compris) ne peut dépasser 10. Si ce critère n'est pas respecté, **le placement est refusé immédiatement** et la carte demeure dans la main : aucune carte n'est engagée, aucune pile modifiée, aucun dégât infligé.

**Seuils d'admissibilité de la première puissance :**
| Monstre | Résistance | Première puissance minimale |
| --- | ---: | ---: |
| Valet (J) | 11 | 1 |
| Dame (Q) | 12 | 2 |
| Roi (K) | 13 | 3 |

**Exemples :** un 2 contre un roi (13) est rejeté car `2 + 10 = 12 < 13` ; un 3 contre le même roi est accepté car `3 + 10 = 13`. Un As vaut 1, un joker de puissance vaut **10 fixe** (CTD-J01). Un premier placement admissible **ne garantit pas** qu'une deuxième carte suffisante sera réellement piochée ; l'algorithme effectue uniquement un contrôle de borne **théorique** sans examiner ou révéler la pioche.

**Interaction avec CTD-ARB-01/02/07/08 :** les attaques partielles et les mains successives restent permises ; seule une première carte théoriquement impossible est rejetée. L'acceptation d'une première carte ne dispense pas du contrôle concret lors de l'ajout de la seconde puissance (CTD-ARB-08) et du déclencheur distinct (CTD-ARB-07). La carte refusée reste librement utilisable pour un autre monstre, comme déclencheur valide lorsque le contexte le permet, ou peut être défaussée explicitement (CTD-ARB-03).

**Statut : CTD-09 / CTD-ARB-09 CLOS pour CardForge.** Décision explicite de validation de placement du porteur, non présentée comme précision officielle de Mark S. Ball. Aucun test n'a été exécuté.

**Prochain arbitrage CTD-10 (ergonomie et moteur) :** affectation du joker polyvalent entre rôle « puissance » ou « déclencheur » et éventuel choix d'enseigne dans l'interface, sans changer la valeur 10 ni permettre de jouer une carte dans deux rôles.


## 21. Décision fonctionnelle CTD-10 / CTD-ARB-10 — rôle du joker déterminé par son emplacement

**Option A VALIDÉE par le porteur, le 22 novembre 2026.** Dans Clear the Dungeon, le joueur choisit **explicitement la cible et l'emplacement** de son joker : première puissance, deuxième puissance ou déclencheur. Le moteur déduit le rôle du joker de cet emplacement, sans demander un choix supplémentaire de rôle ni d'enseigne. Cette décision est compatible avec CTD-J01 (joker = **10 fixe**, enseigne polyvalente).

**Comportements exécutables :**
- **Emplacement puissance 1 :** joker de valeur 10, soumis au contrôle de faisabilité du premier placement (CTD-ARB-09). L'enseigne n'intervient pas dans la somme de puissance.
- **Emplacement puissance 2 :** joker de valeur 10, soumis au contrôle de somme avec la première puissance déjà engagée (CTD-ARB-08). Les deux puissances suffisent ou non selon la résistance ; aucune victoire sans déclencheur.
- **Emplacement déclencheur :** emplacement autorisé seulement **après** que deux puissances valides atteignent le seuil (CTD-ARB-07/08). Le joker prend **automatiquement l'enseigne du monstre ciblé** et déclenche immédiatement le retrait/révélation selon CTD-ARB-06. Aucune boîte de dialogue supplémentaire pour l'enseigne.
- **Choix tactique conservé :** l'application ne choisit pas d'elle-même si le joker sert de puissance ou de déclencheur ; elle ne change pas son rôle après pose sans commande de déplacement autorisée par CTD-ARB-02.
- **Identité des cartes :** chacun des **deux jokers physiques** reste un objet de carte unique, associé à un seul emplacement à la fois. Le même joker ne peut jamais apparaître simultanément en puissance et en déclencheur, ni sur plusieurs monstres. Un placement refusé ne consomme pas le joker et ne modifie pas le plateau ou les dégâts.
- **Sauvegarde/reprise :** préserver l'identifiant de chaque joker, la cible, l'emplacement, le rôle déduit, l'état provisoire/verrouillé et l'état d'attaque ; ne pas attribuer définitivement une enseigne au joker hors du contexte du déclenchement.
- **Visuel Fantasy :** le symbole et l'animation du joker peuvent varier selon l'emplacement ; jamais la valeur, la disponibilité ou les droits tactiques.

**Statut : CTD-10 / CTD-ARB-10 CLOS pour CardForge.** Il s'agit d'une décision de conception d'interaction fidèle aux deux usages documentés du joker, non d'une nouvelle mécanique officielle attribuée à Mark S. Ball. Aucun test de moteur n'a été exécuté.

**Prochain arbitrage CTD-11 :** les deux jokers physiques peuvent-ils être utilisés dans **une même attaque** (deux puissances ou une puissance et un déclencheur) ? La recherche documentaire n'établit pas de restriction spécifique ; aucune limite arbitraire n'est ajoutée avant validation du porteur.


## 22. Décision fonctionnelle CTD-11 / CTD-ARB-11 — deux jokers distincts dans une même attaque

**Option A VALIDÉE explicitement par le porteur le 22 novembre 2026.** Les deux jokers physiques de Clear the Dungeon sont **deux cartes indépendantes** : ils peuvent tous deux être affectés **à une même attaque**, dans deux emplacements différents, pourvu que l'ordre, les rôles et les conditions de victoire soient respectés.

**Combinaisons légales :**
- **Joker 1 puissance + joker 2 puissance** : somme = **10 + 10 = 20** (admissible contre J11, Q12 ou K13), mais la cible n'est vaincue qu'avec **une troisième carte déclencheuse**, normale de l'enseigne requise, selon CTD-ARB-07.
- **Joker 1 puissance + carte numérique puissance + joker 2 déclencheur** : les puissances doivent atteindre la résistance ; joker 2 adopte automatiquement l'enseigne de la cible selon CTD-ARB-10.
- Le même raisonnement s'applique avec les deux jokers inversés ; **aucune limite arbitraire d'un joker par attaque ni d'un joker par main** n'est introduite.
- Les deux jokers peuvent aussi être utilisés dans **deux attaques différentes** ; aucun partage de ressources entre emplacements.
- Une **même carte joker**, même si polyvalente, **ne peut jamais remplir deux rôles ou deux emplacements simultanément**. Les trois cartes utilisées pour une attaque victorieuse restent trois **cartes physiques distinctes**.
- Le moteur conserve la **valeur fixe 10**, l'enseigne adaptée uniquement dans le rôle déclencheur, les contrôles de la première et deuxième puissance (CTD-ARB-08/09), et la séquence puissance → puissance → déclencheur.
- La sauvegarde/reprise conserve l'identifiant et l'emplacement de chaque joker, y compris lorsqu'un joker a été engagé dans une main antérieure et l'autre dans la main courante.

**Exemple déterministe :** Roi de pique (résistance 13), Joker A comme première puissance 10, un 3 de carreau comme deuxième puissance 3, Joker B comme déclencheur prenant l'enseigne pique : **victoire contre ce roi**. Autre cas : Joker A + Joker B en puissances 10 + 10, puis un 2 de pique comme déclencheur : **victoire contre le roi**.

**Statut : CTD-11 / CTD-ARB-11 CLOS pour CardForge.** Arbitrage explicite compatible avec les rôles des jokers définis, mais aucune restriction ou permission spécifique aux deux jokers n'a été explicitement confirmée par l'auteur dans le texte officiel intégral inaccessible ; ne pas présenter la décision comme une citation d'auteur. Scénarios spécifiés mais non exécutés.

**Prochain point CTD-12 :** calcul du score officiel en cas de victoire **avec des cartes restant dans la main**, distinct de la réussite elle-même.


## 23. Décision fonctionnelle CTD-12 / CTD-ARB-12 — calcul officiel du score de victoire

**Option A VALIDÉE par le porteur le 22 novembre 2026 :** le **score de victoire** de Clear the Dungeon correspond **exclusivement au nombre de cartes encore présentes dans la pioche de puissance au moment exact où le douzième monstre est vaincu**. Les cartes en main ne sont pas ajoutées ; les cartes engagées sur d'autres monstres, déjà sorties du jeu ou versées aux dégâts n'entrent pas davantage dans ce score.

**Règles déterministes et traçabilité :**
- À l'événement de victoire (CTD-ARB-05/06), calculer `victoryScore = drawPile.length` avant toute action complémentaire, et **figer** ce résultat ; la victoire n'exige ni de clôturer la main ni de défausser les cartes restant en main.
- **Exemple :** 5 cartes en pioche, 2 cartes encore en main, douzième monstre vaincu → **score officiel 5**, pas 7.
- Une victoire lorsque la pioche est vide donne un **score de 0**, qui demeure une victoire, pas une défaite par épuisement.
- La défaite par sept dégâts ou par épuisement **n'a pas de score de victoire** ; ne pas créer de faux score officiel 0 pour les défaites. Les résultats `win/loss/abandon` et statistiques transversales CardForge sont consignés séparément, avec le score optionnel uniquement en cas de victoire.
- Ne pas attribuer de bonus pour la main, les jokers, les dégâts évités, la durée, les illustrations ou les animations. Si des indicateurs dérivés existent, ils sont explicitement étiquetés **statistiques CardForge**, jamais « score officiel ».
- Sauvegarder le score officiel et le résultat **une seule fois** ; une reprise ou un double événement de fin ne doit pas recalculer ni dupliquer la partie.
- La règle est conforme aux sources documentées : score = cartes restant dans la pioche, **main exclue**.

**Statut : CTD-12 / CTD-ARB-12 CLOS pour CardForge.** Décision du porteur conforme au score classique référencé. Aucun test logiciel n'a été exécuté pendant cette revue.

**Prochaine question CTD-13 :** organisation des phases Attaque / Défausse — le joueur peut-il défausser une carte au milieu d'une main, puis reprendre ses placements, ou passe-t-il explicitement à une phase de défausse sans retour ? Ce point n'a pas été décidé par CTD-ARB-03 (qui exige une défausse explicite avant de piocher).
