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
