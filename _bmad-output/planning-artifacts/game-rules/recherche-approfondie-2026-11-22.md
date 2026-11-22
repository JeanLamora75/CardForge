# Mary — Recherche approfondie sur les règles des deux jeux (22 novembre 2026)

**Statut :** recherche documentaire approfondie terminée pour les sources accessibles ; sans contact direct des auteurs et sans validation de moteur.  
**Version CardForge :** Clear the Dungeon Classic 1.1.0 sans réserve ; Gridcannon Version 2.  
**Objectif :** fermer ce qui est explicitement dit par les créateurs, écarter les règles propres aux adaptations et isoler les vraies questions.

## 1. Méthode et hiérarchie de preuve

1. Texte de l'auteur daté/versionné : priorité pour les règles.
2. Livret attribué à l'auteur mais reproduit par un tiers : preuve forte du contenu reproduit, authenticité/mises à jour non garanties.
3. Versions tierces, tutoriels et implémentations : indices pour identifier un cas limite, jamais source normative si elles divergent.
4. Lien Google Docs officiel de Clear the Dungeon [source](https://docs.google.com/document/d/1BBPusx0Q_UM7vo8i5Yzuk7UyrWBf3PvjdDsx_h-qHwQ/edit) : trouvé, mais **texte intégral non récupérable dans l'environnement de recherche** ; l'export TXT/PDF n'a pas été accessible, donc aucune lecture intégrale prétendue.

**Sources primaires/sources attribuées :**
- [Gifts for Card Players — Clear the Dungeon](https://giftsforcardplayers.com/clear-the-dungeon-a-solo-card-game/) : page présentant Classic v1.1.0, mise à jour 2024.
- [Reproduction Scribd « Clear the Dungeon Complete »](https://www.scribd.com/document/846020212/Clear-the-Dungeon-Complete-1-0-2) : section Classic datée 23 octobre 2024, puis Advanced distinct ; reproduction non officielle.
- [BoardGameGeek — annonce du livre complet par Mark S. Ball](https://boardgamegeek.com/thread/3392258/clear-the-dungeon-complete-rule-book) : atteste l'existence d'un livret auteur combinant Classic et Advanced.
- [Tom Francis — Gridcannon, version 2 puis v1 historique](https://www.pentadact.com/2019-08-20-gridcannon-a-single-player-game-with-regular-playing-cards/) : source primaire directe, la vidéo accompagnant l'article illustre la **version antérieure** ; Francis précise l'évolution écrite.
- [Howto.cards — Gridcannon V2](https://howto.cards/en/gridcannon/) : source secondaire identifiant explicitement deux lacunes de V2 (place d'une figure sans voisin libre, case vide après Extraction).
- [PySolFC — Clear the Dungeon](https://pysolfc.sourceforge.io/doc/rules/clearthedungeon.html) : adaptation indiquant joker 10, mais autorise une réserve et n'est pas la configuration CardForge.

## 2. Clear the Dungeon — ce qui est soutenu

**CD-VER-01 :** 54 cartes ; 12 figures monstres, 4 colonnes de 3 ; 40 cartes A–10 + 2 jokers comme paquet de puissance.  
**CD-VER-02 :** trois phases Pioche / Attaque / Défausse, main de trois cartes jouées ou défaussées avant le tour suivant.  
**CD-VER-03 :** trois cartes **exactement** terminent une attaque : deux cartes dont la somme atteint au moins J11, Q12 ou K13, puis une troisième carte ayant la même enseigne que le monstre. Le monstre vaincu est retiré immédiatement.  
**CD-VER-04 :** les cartes inutilisées entrent dans la pile de dégâts, défaite immédiate à sept cartes.  
**CD-VER-05 :** les jokers peuvent avoir toute enseigne et servir de déclencheurs (le livret reproduit le précise).  
**CD-VER-06 :** score de victoire = cartes encore dans la pioche, cartes de main exclues ; réserve facultative désactivée dans le MVP.  

### Incohérence documentaire CTD-J01 (bloquante)

| Source | Formulation |
| --- | --- |
| Page de présentation publiée sous le nom de l'auteur | Joker de puissance **choisie jusqu'à 10** |
| Reproduction du livret **Classic v1.1.0** daté du 23 octobre 2024 | Joker de puissance **10** |
| Adaptation PySolFC et autres résumés tiers | Joker de puissance **10** |

**Analyse :** pour respecter **strictement la version du livret Classic 1.1.0**, une valeur fixe 10 est **l'hypothèse documentaire la mieux corroborée**, mais **ce n'est pas un arbitrage officiel** puisque la page de l'auteur diverge et la copie officielle du livre n'a pas été lue. **Ne pas transformer l'hypothèse en test d'acceptation définitif** avant de consulter le livre officiel ou d'obtenir une clarification de Mark S. Ball.

### Points encore non tranchés

- **O-CTD-01/03 :** peut-on poser des cartes d'attaque partielle sur plusieurs monstres et les conserver d'une main à la suivante ? Le livret reproduit parle de déposer les cartes sur « les monstres que vous souhaitez attaquer » ; le délai exact de complétion reste à documenter.
- **O-CTD-02 :** que faire lorsque la pioche contient moins de trois cartes ou devient vide alors qu'une main ou une attaque partielle est active ?
- **O-CTD-05 :** ordre de résolution si un déclencheur vainc le 12e monstre au voisinage du seuil de dégâts ; aucune nouvelle priorité à inventer.
- **CTD-J01 :** puissance du joker exactement 10 ou valeur choisie jusqu'à 10.
- Le titre « Classic v1.1.0 » ne justifie pas d'intégrer les variantes ultérieures (« Boomer-Ace », autres dispositions, Advanced, réserve).

## 3. Gridcannon — ce qui est confirmé par Tom Francis V2

**GC-VER-01 :** une grille initiale **complète de neuf cartes 2–10**, figures/As/jokers mis à part puis traités ; substitution facultative d'une carte initiale.  
**GC-VER-02 :** la pose d'une carte numérique sur une pile de valeur inférieure ou égale est permise ; le tir utilise les deux cartes intermédiaires, **pas** le déclencheur.  
**GC-VER-03 :** J11 toutes enseignes, Q12 même couleur, K13 même enseigne ; figures tuées restent sur leurs emplacements.  
**GC-VER-04 :** As = Extraction d'une pile complète sous la pioche ; Joker = Réaffectation d'une carte supérieure ; ploys disponibles même après le tirage et avant la pose.  
**GC-VER-05 :** armures cumulées ; défaite si J/Q atteint 20 ou K atteint 19.  
**GC-VER-06 :** si aucune figure vivante mais moins de douze vaincues, faire défiler les cartes jusqu'à une nouvelle figure, puis réintroduire les cartes traversées sous la pioche.  
**GC-VER-07 :** après épuisement de la pioche, des ploys peuvent encore éviter la défaite ; victoire lorsque les douze figures sont vaincues.  
**GC-VER-08 :** un coin peut déclencher un tir sur deux axes ; la source secondaire le souligne, et la géométrie des règles primaires est compatible.

### Lacunes confirmées et nouvelles interrogations

| ID | Question | État |
| --- | --- | --- |
| **G-01a** | La figure attire la meilleure carte d'après enseigne/couleur/valeur, mais la carte gagnante peut être **au centre de la grille 3×3** : elle n'a aucun emplacement extérieur adjacent. Doit-on comparer uniquement les huit cartes périphériques ? | **Nouveau point bloquant, non dit dans V2** |
| G-01b | Si les emplacements adjacents à la meilleure carte périphérique sont tous occupés, comment chercher un autre emplacement ? | Ouvert ; howto.cards propose la suivante, pas une règle de l'auteur |
| G-02 | Valeur/validité d'une case de grille devenue vide après Extraction | Ouvert ; « valeur 0 » est une déduction de V1, pas explicitement de V2 |
| G-03 | Deux tirs depuis un coin sont possibles ; ordre exact si deux ennemis sont tués sur la même action | Déclenchement double soutenu ; ordre ouvert |
| G-04 | Ordre et orientation des cartes d'une pile entière replacée sous la pioche | Dépôt de pile confirmé, ordre fin ouvert |
| G-05 | Conditions d'impasse sans action encore utile et attribution d'armure sans figure vivante | Principal confirmé ; cas spécifiques ouverts |
| **G-07** | Le texte de l'auteur dit « aucune action spéciale à utiliser » ; une source secondaire dit « ou aucune qui puisse aider ». Peut-on attribuer une armure lorsqu'un ploy existe mais n'a pas de cible utile ? | **Nouveau cas de séquencement** |
| **G-08** | Le scoring est formulé pour une victoire avant épuisement de pioche ; faut-il le compter identiquement si un As permet de reconstituer la pioche après épuisement ? | Cas limite faible priorité, à expliciter |
| G-06 | Nom public distinct de « Gridcannon » seul et crédit à Tom Francis | Décision produit à prendre ; l'auteur le **suggère**, ce n'est pas formulé comme interdiction juridique |

**Attention vidéo :** la vidéo intégrée dans la page de Tom Francis est antérieure aux ajustements écrits. Elle n'est pas une démonstration fiable des règles V2 lorsqu'elles diffèrent de V1.

## 4. Hiérarchie de traitement proposée

1. **Bloquants mécaniques** : CTD-J01, O-CTD-01/02/03, G-01a/b, G-02, G-04, G-07.
2. **Cas à tester après clarification** : G-03, G-05, G-08 et terminaux exacts de Clear the Dungeon.
3. **Publication et identité** : vérification de la permission écrite de Mark S. Ball (condition de gratuité), titre distinct/attribution conseillé par Tom Francis, droits des ressources visuelles et sonores.
4. **Sans réponse d'auteur** : proposer une règle d'interprétation **explicitement documentée** pour décision du porteur ; ne jamais présenter cette interprétation comme règle originale certaine ni la développer silencieusement.

## 5. Recommandations d'étape

- Conserver **deux documents de règles indépendants** sous `game-rules/`, et les matrices existantes. Les mettre à jour sans inventer des comportements.
- Préparer une question courte par zone d'incertitude pour les auteurs (seulement si le porteur autorise un contact ou effectue le contact lui-même).
- Pendant les clarifications, permettre à Winston/Amelia de développer les **contrats et moteurs purs uniquement sur les règles incontestées**, avec tests bloqués ou en attente pour les cas litigieux. Ne jamais annoncer une partie conforme/terminée avant la clôture de ces points.
- Aucune recherche ou action n'a contacté un auteur, créé des User Stories Jira ou exécuté des tests.

## 6. Niveau de confiance

- Source primaire de Tom Francis et identification de Gridcannon V2 : **élevé**.
- Règles générales Clear the Dungeon Classic : **élevé**.
- Joker CTD et comportements Gridcannon lorsque la source est muette : **indéterminé / non confirmé**, et non pourcentage inventé.
- Cette recherche est un **état de preuve documentaire**, pas une certification des moteurs.

## 7. Décision de cadrage ultérieure — joker de Clear the Dungeon

**22 novembre 2026 — décision explicite du porteur : joker = 10 fixe.** Le désaccord entre la page Web et le livret reproduit subsiste comme fait historique ; il est résolu **pour le comportement CardForge**, pas au nom de l'auteur. CTD-J01 n'est donc plus un point d'arbitrage produit bloquant. La [documentation du jeu](./clear-the-dungeon.md) et la [matrice de tests](../clear-the-dungeon-rule-test-matrix.md) comportent cette décision et les cas de test à appliquer.

**Restent prioritaires :** attaques partielles et leur éventuelle persistance, main en fin de pioche, détails de défausse ; pour Gridcannon, centre/placements occupés, pile vide après as, pile réinjectée et armure quand un ploy existe mais ne sert à rien.


## 8. Arbitrage CardForge CTD-ARB-01 — attaques partielles (22 novembre 2026)

**Option B approuvée par le porteur** : il est permis d'entamer plusieurs attaques sur des monstres différents, et les cartes posées y restent associées à travers les mains/tours. Cet arbitrage est **clos pour CardForge**, sans prétendre que le texte complet original a été consulté ou confirmé sur ce cas précis. Le traitement des cartes déjà posées (récupération, déplacement, changement de cible) est à examiner séparément sous **CTD-02**. Une conservation rigoureuse dans les sauvegardes et des tests multi-monstres sont requis.


## 9. Arbitrage CardForge CTD-ARB-02 — cartes posées durant la main (22 novembre 2026)

**Décision du porteur : option B.** Les cartes de la main courante peuvent être récupérées/repositionnées avant clôture, mais les cartes des mains précédentes sont verrouillées. Les attaques déjà entièrement résolues ne sont pas réversibles. Ce point est **fermé pour l'implémentation CardForge**, mais demeure une interprétation produit faute de texte officiel assez précis. Le prochain point CTD-03 concerne les cartes inutilisées à la clôture de la main.


## 10. Arbitrage CardForge CTD-ARB-03 — défausse explicite (22 novembre 2026)

**Option B validée par le porteur :** défausse explicite (carte par carte ou toutes les restantes) avant la prochaine pioche ; chacune compte pour un dégât et le 7e déclenche immédiatement la défaite. Les cartes engagées dans des attaques partielles ne sont pas défaussées lors du renouvellement. Les placements provisoires deviennent verrouillés à la clôture de la main selon CTD-ARB-02. Le point **CTD-03 est clos pour CardForge**, sans résoudre **CTD-04** (épuisement de la pioche).


## 11. Arbitrage CardForge CTD-ARB-04 — pioche finale de taille inférieure à trois (22 novembre 2026)

**Option A validée par le porteur :** quand il reste une ou deux cartes au moment où la pioche est autorisée, le joueur prend toutes les cartes restantes, qui constituent une main jouable. La pioche devient vide, mais la main ne perd pas son droit d'être jouée ; aucune carte de dégâts n'est recyclée. **La défaite une fois la main épuisée demeure la question CTD-05**, qui n'est pas décidée ici. Décision de comportement CardForge, pas une citation officielle non ambiguë de l'auteur. Voir [règles](./clear-the-dungeon.md) et [matrice de conformité](../clear-the-dungeon-rule-test-matrix.md).


## 12. Arbitrage CardForge CTD-ARB-05 — moment de défaite par pioche vide (22 novembre 2026)

**Option A approuvée par le porteur :** une dernière main reste jouable même avec une pioche vide ; si la dernière main est clôturée et qu'au moins un monstre subsiste, la défaite est automatique. Une victoire par élimination du 12e monstre est immédiate ; le 7e dégât déclenche une défaite immédiate avant toute clôture. Ce comportement est acté pour le moteur CardForge sans présumer que tous ses détails figurent dans le texte officiel intégral encore inaccessible. Les tests CTD-T55 à CTD-T61 ont été ajoutés à la matrice. **CTD-06** (séquence d'élimination et révélation) reste à décider.


## 13. Arbitrage CardForge CTD-ARB-06 — révélation après une victoire locale (22 novembre 2026)

**Option A validée :** le monstre vaincu et ses trois cartes d'attaque sont retirés immédiatement, puis le prochain monstre de la même colonne est révélé aussitôt (s'il existe). La main en cours et les attaques partielles contre d'autres monstres restent jouables ; douzième monstre éliminé = victoire immédiate, sans révélation ou pioche supplémentaire. Le comportement est tracé dans [les règles](./clear-the-dungeon.md) et les tests CTD-T62 à CTD-T68 de [la matrice](../clear-the-dungeon-rule-test-matrix.md). **CTD-06 est clos ; CTD-07 reste ouvert**. Aucun test logiciel n'a été exécuté.


## 14. Décision CardForge CTD-ARB-07 — ordre des cartes d'attaque (22 novembre 2026)

**Option A validée par le porteur :** deux cartes de puissance **avant** une troisième carte déclencheuse ; aucun déclencheur anticipé, aucun tri automatique des cartes pour construire a posteriori une attaque complète. Les cartes de puissance peuvent venir de mains successives selon CTD-ARB-01 et CTD-ARB-02. Une attaque complète et légale est résolue selon CTD-ARB-06. Les tests CTD-T69 à CTD-T77 sont spécifiés, non exécutés. **CTD-07 est clos ; CTD-08** (seconde puissance sous le seuil) reste à trancher. Cette décision ne résout pas d'autres incertitudes concernant l'auteur.


## 15. Arbitrage CardForge CTD-ARB-08 — seconde puissance insuffisante (22 novembre 2026)

**Option A validée par le porteur :** refuser sans mutation l'ajout de la seconde carte de puissance lorsqu'elle ferait une somme inférieure à la résistance du monstre ; la carte reste en main, aucune pénalité de dégâts. Une somme égale ou supérieure au seuil est valide et le déclencheur reste obligatoire. Scénarios CTD-T78 à CTD-T84 spécifiés mais non exécutés. **CTD-08 clos ; CTD-09 (première puissance mathématiquement non complétable) reste à décider.** Il s'agit d'un arbitrage produit documenté, non d'une nouvelle citation de l'auteur.


## 16. Arbitrage CardForge CTD-ARB-09 — première puissance mathématiquement complétable (22 novembre 2026)

**Option A validée par le porteur :** une première carte de puissance n'est acceptée que si sa valeur + 10 atteint au moins la résistance du monstre (valet 11, dame 12, roi 13). Ce test de borne supérieure théorique n'inspecte pas la pioche et refuse les premières poses impossibles sans modifier l'état de jeu. Scénarios CTD-T85 à CTD-T93 spécifiés, non exécutés. **CTD-09 clos ; CTD-10** portera sur le rôle et l'enseigne du joker à la pose. La règle d'interdiction anticipée est un arbitrage CardForge et non une citation officielle.


## 17. Arbitrage CardForge CTD-ARB-10 — usage contextuel du joker (22 novembre 2026)

**Option A validée par le porteur :** le joueur choisit l'emplacement physique d'un joker ; ce placement détermine sans dialogue supplémentaire son rôle de première/deuxième puissance (valeur 10 fixe) ou de déclencheur (enseigne automatiquement égale à celle du monstre). Un même joker physique n'occupe jamais plusieurs emplacements simultanément ; les deux jokers disposent d'identités indépendantes, y compris après sauvegarde. Aucun rôle n'est imposé automatiquement par une IA ou par une combinaison inférée après coup. **CTD-10 clos ; CTD-11** demeure ouvert sur le cumul des deux jokers distincts dans une attaque, sans présupposer une restriction du livret. Tests CTD-T94 à CTD-T103 spécifiés, non exécutés.


## 18. Arbitrage CardForge CTD-ARB-11 — deux jokers dans une même attaque (22 novembre 2026)

**Option A validée par le porteur :** les deux jokers sont des cartes physiques distinctes et peuvent être utilisés dans une seule attaque ; ils peuvent constituer les deux puissances (10 + 10, plus un déclencheur distinct) ou une puissance 10 et un déclencheur prenant l'enseigne du monstre. Aucune limite nouvelle d'un joker par attaque/main, jamais de duplication d'un seul joker. **CTD-11 clos**, tests CTD-T104 à CTD-T113 spécifiés mais non exécutés ; **CTD-12** concerne le comptage du score de victoire lorsque des cartes demeurent en main. Arbitrage produit distinct d'une confirmation officielle de l'auteur.


## 19. Arbitrage CardForge CTD-ARB-12 — score officiel et main restante (22 novembre 2026)

**Option A validée par le porteur :** le score à la victoire compte **seulement les cartes encore en pioche**, et exclut toute carte encore en main. Pioche vide et douzième monstre vaincu = victoire avec score 0 ; aucune valeur de score officiel de victoire n'est attribuée en cas de défaite/abandon. Ce calcul est confirmé dans les références sur le jeu et reste distinct des statistiques maison CardForge. Tests CTD-T114 à CTD-T121 spécifiés, non exécutés. **CTD-12 clos ; CTD-13** concerne la séquence et l'autorisation des défausses pendant la main (distinct de leur caractère explicitement obligatoire déjà validé dans CTD-03).


## 20. Arbitrage CardForge CTD-ARB-13 — alternance attaques / défausses (22 novembre 2026)

**Option B validée :** le joueur peut alterner les attaques et les défausses explicites pendant une même main. La carte défaussée est définitivement versée aux dégâts ; les autres cartes et les placements provisoires restent utilisables selon CTD-ARB-02. Au septième dégât, défaite immédiate ; au douzième monstre, victoire immédiate. Cette flexibilité est une décision de fonctionnement CardForge, et non une précision attribuée à l'auteur ; le cycle général Pioche/Attaque/Défausse reste documenté. **CTD-13 clos**, tests CTD-T122 à CTD-T130 spécifiés, non exécutés ; **CTD-14 ouvert** sur le mécanisme de clôture lorsque la main est vide.


## 21. Arbitrage CardForge CTD-ARB-14 — main vide et clôture explicite (22 novembre 2026)

**Option B validée :** une main vide peut rester ouverte ; les placements de cette main restent provisoires et réaffectables. Le joueur clôture par une action explicite, éventuellement combinée avec la nouvelle pioche s'il reste des cartes au paquet ; récupérer une carte provisoire rétablit une main non vide et empêche de clôturer. Si le paquet est vide et que des monstres survivent, cette clôture entraîne la défaite conformément à CTD-ARB-05. Les victoires et défaites immédiates restent prioritaires. Tests CTD-T131 à CTD-T140 ajoutés, **non exécutés**.

**Relais d'analyse :** CTD-01 à CTD-14 sont des décisions produit actées, **pas** une certification complète des règles d'origine. Le prochain point de véritable ambiguïté identifié est dans **Gridcannon Version 2 — G-01a : meilleure carte de similitude au centre de la grille** ; ce cas n'est pas résolu par les textes précédemment consultés.


## 22. Arbitrage Gridcannon Version 2 — GC-01 / G-01a (22 novembre 2026)

**Option A approuvée par le porteur :** seules les **huit cartes périphériques** de la grille Version 2 peuvent attirer une figure à placer dans une case extérieure adjacente. Une carte centrale, même plus semblable, est exclue **uniquement de la sélection de la carte attractive**, et reste pleinement participante aux tirs, poses et actions spéciales du jeu. Mise en place et apparitions en cours de partie couvertes. L'absence d'adjacence extérieure depuis le centre motive ce choix ; **aucune source primaire n'a explicitement résolu ce cas**, qui est donc consigné comme arbitrage propre à CardForge. Tests GC-V2-T01 à GC-V2-T07 spécifiés dans [le référentiel](./gridcannon.md), non exécutés. **GC-01 / G-01a clos ; GC-02 / G-01b ouvert** : meilleure carte périphérique dont les emplacements extérieurs adjacents sont déjà occupés.


## 23. Arbitrage Gridcannon Version 2 — GC-02 / G-01b : figure et voisinages occupés (22 novembre 2026)

**Option A VALIDÉE par le porteur :** si la carte périphérique la plus semblable à une figure n'a aucune case extérieure adjacente libre, poursuivre la recherche vers la **meilleure candidate périphérique suivante** disposant d'une place. Les figures vaincues, restées sur le plateau, comptent comme **emplacements occupés**. Les priorités demeurent même enseigne, puis même couleur, puis valeur décroissante dans chaque classe ; à rang égal, le joueur choisit parmi les places réellement admissibles. Aucun déplacement d'une figure installée, aucun choix arbitraire de case et aucune nouvelle défaite pour simple blocage de la meilleure carte. Décision fonctionnelle CardForge inspirée d'une interprétation secondaire, **pas une règle explicitement confirmée dans le texte primaire Version 2**. Mise en place et apparitions en cours de partie couvertes ; tests **GC-V2-T08 à GC-V2-T17** spécifiés dans [le référentiel Gridcannon](./gridcannon.md), non exécutés.

**GC-02 / G-01b CLOS. Prochain arbitrage GC-03 / G-02 :** comportement des **cases de grille vides après une Extraction**. Le cas où aucun placement extérieur n'est admissible n'est pas résolu par GC-02 et reste un sujet d'impasse G-05. Les rubriques historiques décrivant G-01b comme « ouvert » sont désormais supplantées par cette décision datée.


## 24. Arbitrage Gridcannon Version 2 — GC-03 / G-02 : pile vide après Extraction (22 novembre 2026)

**Option A VALIDÉE par le porteur :** une case vidée par l'Extraction d'un As est admissible pour la pose de **toute carte numérique 2–10** en étant traitée comme valeur **0 uniquement lors de la vérification de destination**. Aucun remplissage prioritaire n'est imposé : le joueur peut choisir une autre pile admissible. Après pose, la nouvelle pile n'a que la carte déposée et sa vraie valeur ; aucune carte 0 inventée ne participe aux tirs, à l'attraction des figures, à l'état sauvegardé ou au paquet. L'Extraction retire toujours la pile complète et l'As reste consommé. **Ce traitement est un arbitrage CardForge**, inspiré de la version ancienne et des analyses secondaires, **pas une affirmation que Tom Francis l'a formellement spécifié dans la Version 2**.

**GC-03 / G-02 CLOS** ; tests GC-V2-T18 à GC-V2-T27 **spécifiés mais non exécutés** dans [le référentiel](./gridcannon.md). **GC-04 / G-03** demeure ouvert : simultanéité et ordre de résolution des tirs horizontal et vertical consécutifs à une pose de coin. **G-04** (ordre interne des cartes réinjectées sous la pioche) reste indépendamment ouvert.


## 25. Arbitrage Gridcannon Version 2 — GC-04 / G-03 : simultanéité des tirs depuis un coin (22 novembre 2026)

**Option A VALIDÉE par le porteur :** les deux tirs possibles lors d'une pose dans un coin sont évalués sur **un seul état après la pose**, indépendamment selon les conditions de chaque cible et les cartes intermédiaires, puis leurs victoires locales sont appliquées **ensemble**. Aucun ordre horizontal/vertical imposé, aucun choix tactique additionnel ; une élimination sur un axe ne change pas le calcul de l'autre. En cas de double victoire locale atteignant douze figures vaincues, l'événement de victoire est **unique**. L'animation ne peut altérer cette résolution atomique. Scénarios **GC-V2-T28 à GC-V2-T38** spécifiés dans [le référentiel](./gridcannon.md), **non exécutés**. **GC-04 / G-03 CLOS** pour CardForge : la possibilité d'un double tir est documentée, son traitement simultané est une décision produit, pas un passage cité de l'auteur.

**GC-05 / G-04 encore ouvert :** l'ordre des cartes dans une pile retirée par As et remise sous la pioche est à trancher séparément, sans mélanger ni inventer de comportement officiel.


## 26. Arbitrage Gridcannon Version 2 — GC-05 / G-04 : ordre d'une pile extraite sous la pioche (22 novembre 2026)

**Option A VALIDÉE par le porteur :** l'Extraction d'une pile complète replace les cartes sous la pioche **dans l'ordre relatif sommet → fond**, qui sera également leur ordre futur de tirage, **sans inversion ni mélange** lors du passage face cachée. Le paquet déjà en pioche reste en tête, puis viennent les groupes extraits successivement dans l'ordre de leur Extraction. Chaque carte et As conserve son identité ; une case vide ne constitue pas une pile extractible. La sauvegarde/restauration ne réordonne aucun élément. Tests **GC-V2-T39 à GC-V2-T49** spécifiés mais non exécutés dans le [référentiel](./gridcannon.md).

**GC-05 / G-04 CLOS** pour le comportement CardForge. La remise au bas de la pioche est attestée ; l'ordre interne retenu est une **convention de CardForge validée**, et non un détail officiellement vérifié du règlement de Tom Francis. **GC-06 / G-05** reste à trancher : carte numérique non posable lorsqu'aucune figure vivante n'est présente, donc aucune cible légale pour ajouter de l'armure. Les conditions d'utilisation effective d'un As/Joker inutile relèvent d'une question distincte **G-07**.


## 27. Arbitrage Gridcannon V2 — GC-06 / G-05 : traversée de pioche sans figure vivante (22 novembre 2026)

**Option A VALIDÉE :** lorsqu'il ne reste aucune figure vivante mais que moins de douze figures ont été vaincues, les **cartes numériques rencontrées** pendant la recherche de la figure suivante sont **conservées temporairement**, même si elles seraient posables en temps normal. À la découverte d'une nouvelle figure, ces numériques rejoignent le dessous de la pioche sans mélange ; **aucune armure n'est attribuée en l'absence de figure vivante**, aucune action spéciale n'est exigée pour résoudre un blocage numérique inexistant pendant cette recherche. Le résultat de la recherche reste déterministe et compatible avec la sauvegarde.

**GC-06 / G-05 (absence de cible vivante) CLOS** pour le traitement des numériques. Scénarios **GC-V2-T50 à GC-V2-T60** documentés dans [le référentiel](./gridcannon.md) et **non exécutés** ; les cas de **pioche épuisée avant toute nouvelle figure** et de **rencontre d'As/Joker pendant la recherche** demeurent explicitement ouverts. Le détail exact de l'ordre du lot traversé doit aussi être isolé du contrat **GC-05** propre aux piles extraites. **Prochaine décision GC-07 / G-07 :** carte numérique non posable avec une figure vivante et un joker/as encore disponible mais sans action réellement utile pour la débloquer.


## 28. Arbitrage Gridcannon Version 2 — GC-07 / G-07 : action spéciale disponible sans solution utile (22 novembre 2026)

**Option A VALIDÉE par le porteur :** si une **figure vivante** est présente et qu'une carte numérique n'a aucune destination normale, examiner si un As/Joker disponible peut **réellement la rendre posable** en respectant des actions légales. Un As extrayant une pile non vide ouvre une case vide et constitue donc un recours utile (GC-03/05) ; un Joker restant peut être inutile s'il n'existe aucune Réaffectation ou suite légale résolvant le blocage. **Seuls les recours effectivement utiles** empêchent de convertir la carte en armure. Si aucun n'existe, attribution d'armure suivant la similitude inverse et les seuils originaux (J/Q 20+, K 19+) ; ne jamais contraindre le joueur à dépenser une action inutile. Aucun armement si aucune figure vivante : GC-06 garde priorité. Ressources non utilisées et état de reprise conservés.

**GC-07 / G-07 CLOS pour CardForge**, décision issue d'une divergence entre la formulation primaire et l'interprétation secondaire, **pas** une nouvelle règle attribuée à Tom Francis. Scénarios **GC-V2-T61 à GC-V2-T72** spécifiés, non exécutés dans [le référentiel](./gridcannon.md). **GC-08 / G-08** ouvert sur le score lorsque la pioche a été épuisée puis réalimentée par Extraction avant la victoire.


## 29. Arbitrage Gridcannon Version 2 — GC-08 / G-08 : score après épuisement temporaire (22 novembre 2026)

**Option A VALIDÉE par le porteur :** la victoire après épuisement puis réapprovisionnement de la pioche par Extraction reçoit **le score normal de la Version 2**, calculé **uniquement sur les As/Jokers non dépensés au moment où les douze figures sont vaincues** ; aucun malus, bonus ou statut de victoire différent ne dépend de l'historique d'épuisement. Un As utilisé pour une Extraction n'est plus disponible pour le score ; une victoire avec zéro action restante a score 0, tandis qu'une défaite n'a pas de score officiel de victoire. Résultat et score figés une seule fois, même après reprise. Tests **GC-V2-T73 à GC-V2-T82** spécifiés dans [le référentiel Gridcannon](./gridcannon.md), non exécutés.

**GC-08 / G-08 CLOS**. Il s'agit de l'application cohérente du calcul officiel connu à un scénario limite, **pas** d'une nouvelle exception attestée par l'auteur. **GC-09 / sous-cas G-05** reste ouvert : As/Joker rencontrés pendant la recherche de la prochaine figure lorsqu'aucun adversaire vivant n'est présent, problème déjà consigné en GC-V2-T59 (GC-06).


## 30. Arbitrage Gridcannon Version 2 — GC-09 : As et Jokers durant la recherche de figure (22 novembre 2026)

**Option A VALIDÉE par le porteur :** au cours de la recherche de nouvelle figure définie par GC-06, les **As et Jokers rencontrés** rejoignent **immédiatement** la réserve **face visible et non dépensés**, sans y être joués automatiquement. La recherche de la prochaine figure continue ; seules les cartes numériques traversées sont temporairement mises de côté puis réintroduites sous la pioche. Les As/Jokers révélés restent dans la réserve, conservent leur identité et sont disponibles pour le déroulement ultérieur et le score de victoire GC-08. Aucun effet d'armure ne s'applique en l'absence de figure vivante. La sauvegarde préserve les états physiques des cartes et le mode de recherche sans répétition des effets.

**GC-09 CLOS pour CardForge**, arbitrage de précision compatible avec le rôle des actions spéciales en Version 2, sans le présenter comme une précision officielle de Tom Francis pour ce cas limite. Tests **GC-V2-T83 à GC-V2-T93** spécifiés dans [le référentiel](./gridcannon.md), non exécutés ; le cas historique GC-V2-T59 est désormais réglé. **Restent ouverts** : usage volontaire d'actions pendant la recherche, pioche épuisée avant nouvelle figure (G-05), et **GC-10**, ordre exact de réinsertion des cartes numériques temporairement traversées (à distinguer de GC-05 relatif aux piles extraites).


## 31. Arbitrage Gridcannon Version 2 — GC-10 : réinsertion des numériques traversées (22 novembre 2026)

**Option A VALIDÉE par le porteur :** pendant la recherche de figure sans adversaire vivant (GC-06), les cartes **numériques** temporairement écartées forment une liste ordonnée selon leur **chronologie de révélation**. Lorsqu'une nouvelle figure apparaît et est placée, cette liste rejoint **le bas de la pioche** face cachée, **dans le même ordre de futur tirage**, après les cartes encore présentes dans la pioche ; ni inversion, ni mélange, ni réorganisation par le joueur. As et Jokers révélés pendant la recherche restent en réserve (GC-09) et ne figurent pas dans la liste. Aucune carte numérique écartée ne devient pose ou armure ; la sauvegarde et les résultats sont déterministes et idempotents. La règle GC-05, relative à l'ordre interne d'une pile extraite par As, reste distincte.

**GC-10 CLOS pour CardForge** ; convention d'ordre explicitement approuvée, sans en faire une citation littérale de Tom Francis. **GC-V2-T94 à GC-V2-T104** spécifiés dans [le référentiel](./gridcannon.md), **non exécutés**. **GC-11** reste à arbitrer : utilisation volontaire d'As/Jokers pendant la recherche en cours de prochaine figure (GC-06 / GC-09). Cas d'épuisement sans nouvelle figure maintenu ouvert au titre G-05.


## 32. Arbitrage Gridcannon Version 2 — GC-11 : utiliser As/Joker pendant la recherche de figure (22 novembre 2026)

**Option A VALIDÉE :** pendant la recherche de la prochaine figure lorsque aucune figure n'est vivante (GC-06), le joueur peut **activer volontairement un As ou Joker disponible**, y compris une carte spéciale révélée au cours de la même recherche et mise en réserve selon GC-09. Les actions restent soumises à leur légalité ordinaire ; aucune carte spéciale n'est dépensée à sa découverte. Un As extrait une pile non vide vers le bas de la pioche (GC-03/05), un Joker réaffecte une carte supérieure vers une position légale. Après résolution, la recherche reprend à partir de la pioche actualisée et conserve **sans interruption** les numériques temporairement écartées dans l'ordre GC-10. Pas de pose normale des numériques traversées, pas de figure créée artificiellement, pas d'armure sans figure vivante, et sauvegarde/reprise déterministe.

**GC-11 CLOS pour CardForge** ; application en phase de recherche d'une disponibilité générale décrite par la Version 2, documentée ici comme **décision CardForge**, non comme précision explicite de Tom Francis. Scénarios **GC-V2-T105 à GC-V2-T116** dans [le référentiel](./gridcannon.md), **non exécutés**. L'interface devra garantir une possibilité d'intervenir pendant la recherche. **GC-12 / G-05** à trancher : épuisement de pioche pendant la recherche sans figure apparue, en tenant compte de l'invariant de présence physique des douze figures ; ne pas confondre corruption d'état et défaite réglementaire.


## 33. Arbitrage Gridcannon Version 2 — GC-12 : épuisement sans figure et intégrité des douze figures (22 novembre 2026)

**Option A VALIDÉE par le porteur :** une recherche de nouvelle figure qui épuise la pioche avec **moins de douze figures vaincues et aucune vivante** doit déclencher la **vérification des douze figures physiques et de toute transaction de placement en cours**. Une figure non apparue est normalement encore dans la pioche (ou dans un transit identifié) ; l'Extraction d'une pile numérique ne retire jamais de figure extérieure. Si les cartes ou leur localisation sont incohérentes, **signaler l'anomalie et protéger la partie, sans déclaration de défaite, victoire ou abandon et sans inventer de carte**. Conserver autant que possible les preuves d'état ; ne proposer une récupération qu'à partir d'un état antérieur réellement disponible et validé, sans présumer l'existence d'une sauvegarde supplémentaire. Les fins de pioche normales restent gouvernées par les règles existantes. Scénarios **GC-V2-T117 à GC-V2-T129** spécifiés dans [le référentiel](./gridcannon.md), **non exécutés**.

**GC-12 / sous-cas G-05 CLOS** pour CardForge : mesure d'intégrité/résilience, pas nouvelle condition de défaite issue de Tom Francis. **GC-13 / interaction G-01b–G-02** proposée : un placement de figure peut rester impossible malgré des positions extérieures libres lorsque seules des cases périphériques vides sont adjacentes à ces positions. Cette situation peut être légale après Extraction et ne doit pas être assimilée à une corruption de sauvegarde.


## 34. Arbitrage Gridcannon Version 2 — GC-13 : placement de secours malgré des cases périphériques vides (22 novembre 2026)

**Option A VALIDÉE par le porteur :** quand une figure doit apparaître et qu'**aucune carte périphérique réellement visible ne dispose d'une case extérieure libre admissible** selon **GC-01/02**, mais qu'au moins une place extérieure reste disponible, le joueur peut, **uniquement à titre de dernier recours**, sélectionner **l'une des places extérieures libres**, sans correspondance fictive de carte sur les piles vidées par Extraction (**GC-03**). Toutes les règles normales de classement et de repli restent obligatoires tant qu'une destination naturelle est accessible. Les places occupées, y compris par figures vaincues, restent indisponibles. La figure conserve son identité et son emplacement définitif ; pas de défaite ajoutée ni de déplacement automatique. Le choix et la sauvegarde sont reproductibles et atomiques.

**GC-13 / G-01b–G-02 CLOS pour CardForge** comme exception approuvée du produit, **pas comme précision originale attestée par l'auteur**. Scénarios **GC-V2-T130 à GC-V2-T141** spécifiés dans [le référentiel](./gridcannon.md), non exécutés. **GC-14** proposé : séquencement du **remplacement initial facultatif d'une seule carte de grille**, notamment traitement des figures/As/Jokers éventuellement révélés avant une nouvelle numérique. Les derniers points non gameplay de nom et de crédit restent distincts (**G-06**).


## 35. Arbitrage Gridcannon Version 2 — GC-14 : traitement de figures/As/Jokers avant la numérique de remplacement (22 novembre 2026)

**Option A VALIDÉE par le porteur :** lorsqu'un joueur exerce **une seule fois** la substitution facultative d'une carte numérique de sa grille juste après mise en place, la carte retirée est déplacée **face cachée sous la pioche**. Il faut poursuivre les tirages jusqu'à révéler une **carte numérique** et remplir la case cible. Les **figures tirées avant ce remplacement numérique** restent temporairement en attente, dans l'ordre de rencontre, puis sont placées **après la réoccupation de la case** suivant la similitude GC-01/02 et le dernier recours GC-13. Les **As et Jokers** rejoignent immédiatement la réserve face visible sans être dépensés. La comparaison normale d'empilement ne s'applique pas à une **substitution de carte** ; la valeur de la nouvelle numérique peut être différente, y compris inférieure. La sauvegarde conserve le remplacement en cours, les cartes et leur identité ; ne pas offrir de deuxième essai.

**GC-14 CLOS pour CardForge**, arbitrage fonctionnel compatible avec la mécanique de mise en place documentée mais non revendiqué comme précision officielle de Tom Francis. **GC-V2-T142 à GC-V2-T153** spécifiés dans [le référentiel](./gridcannon.md), **non exécutés**. **GC-15 ouvert** : une carte de remplacement initiale posée en bordure avec une figure déjà présente peut-elle déclencher un tir, ou faut-il considérer ce remplacement comme une action préparatoire sans attaque ?


## 36. Arbitrage Gridcannon Version 2 — GC-15 : absence d'attaque pendant une substitution préparatoire (22 novembre 2026)

**Option A VALIDÉE par le porteur :** la carte numérique introduite lors du **remplacement facultatif initial GC-14** ne peut pas déclencher de tirs, même lorsqu'elle est placée dans un coin offrant deux axes, ou face à une figure initialement présente. La phase de préparation se termine seulement après le remplissage de la case et le placement des figures temporairement révélées ; aucune attaque rétroactive ne naît à cette transition. **Les poses de jeu ordinaires ultérieures** conservent toutes les règles normales de tir, y compris la simultanéité GC-04. La sauvegarde et la reprise doivent conserver l'interdiction des tirs sur cet événement de préparation.

**GC-15 CLOS pour CardForge.** C'est une convention explicitement validée, **pas** un détail de la Version 2 attribuable à Tom Francis. Tests **GC-V2-T154 à GC-V2-T164** spécifiés dans [le référentiel Gridcannon](./gridcannon.md), **non exécutés**. **GC-16 demeure ouvert :** permettre ou différer l'activation volontaire des As/Jokers pendant le remplacement initial qui n'a pas encore été entièrement résolu, alors que GC-11 autorise déjà leur utilisation pendant la recherche de figure en cours de partie.


## 37. Arbitrage Gridcannon Version 2 — GC-16 : actions spéciales pendant la préparation (22 novembre 2026)

**Option A VALIDÉE par le porteur :** As et Jokers piochés durant la construction initiale et le remplacement facultatif **GC-14** sont immédiatement déposés en réserve face visible et **non dépensés**, mais leur **activation est interdite tant que la préparation complète n'est pas terminée**. La préparation englobe la pose des neuf numériques, des figures initialement révélées, l'éventuel remplacement d'une carte et le placement des figures découvertes pendant ce dernier ; la clôture unique de préparation rend ensuite toutes les actions spéciales acquises activables selon leurs conditions de légalité normales. Aucun tir de préparation (GC-15), aucune activation rétroactive, aucune dépense forcée. Cette restriction de préparation est **distincte de GC-11**, qui autorise l'usage volontaire des As/Jokers pendant une recherche de figure survenant **en cours de jeu**. La sauvegarde doit distinguer carte acquise et activation temporairement verrouillée, conserver toutes les cartes et permettre une reprise déterministe.

**GC-16 CLOS pour CardForge**, décision de phase du produit et non précision originale explicitement vérifiée chez Tom Francis. **GC-V2-T165 à GC-V2-T175** spécifiés dans [le référentiel](./gridcannon.md), **non exécutés**. **Prochain arbitrage GC-17 / G-06 :** nom public distinct de l'adaptation et attribution à l'auteur. Le référentiel recommande un titre qui ne soit pas simplement « Gridcannon » et un crédit explicite à Tom Francis ; le nom public reste une décision du porteur.
