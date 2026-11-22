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
