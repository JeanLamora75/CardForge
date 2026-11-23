# Regicide — référentiel des règles originales pour CardForge

**Responsable :** Mary — Business Analyst BMAD  
**Étude :** 22 novembre 2026  
**Version étudiée :** livret officiel *Regicide*, règles du **mode solo** pour un joueur  
**Statut :** **cadrage fonctionnel documenté à partir du livret officiel ; prêt pour revue de conformité des règles**, sans implémentation ni tests exécutés  
**Périmètre :** règles solo originales, sans ajout de pouvoirs, d'objets, de capacités ou de difficulté. **Décision produit validée : l'adaptation CardForge porte le nom « Les Douze Tyrans » et prend place dans un univers Wuxia / Chanbara d'Asie féodale fantastique (décision actualisée le 23 novembre 2026).** Le thème n'a aucun effet sur le moteur. La disponibilité juridique du titre et les droits d'adaptation restent à vérifier avant diffusion.

## 1. Sources, version, provenance et périmètre

### Source normative primaire

- **Livret officiel de Regicide** (2 pages, éditeur/auteurs Badgers From Mars) : https://www.regicidegame.com/site_files/33132/upload_files/RegicideRulesA4.pdf
- **Page officielle de règles :** https://www.regicidegame.com/how-to-play/
- **Édition française de l'éditeur IELLO**, pour recoupement terminologique : https://iello.fr/wp-content/uploads/2025/01/Regicide_RuleBook_FR_V1.pdf
- **Page de l'éditeur français :** https://iello.fr/jeux/regicide/

La source officielle anglaise a été consultée intégralement, **pages 1 et 2**, y compris le bloc SOLO PLAY et les règles communes. Le jeu est conçu par **Paul Abrahams, Luke Badger et Andy Richdale** ; les illustrations originales du livret sont attribuées à **Sketchgoblin**.

**Hiérarchie :** les règles solo spécifiques prévalent sur les règles générales qui sont remplacées ; les autres règles communes demeurent applicables. Les résumés tiers et les autres variantes numériques ne deviennent jamais normatifs. L'adaptation CardForge doit préserver les mécanismes mathématiques et la composition réelle des cartes.

## 2. But du jeu et éléments physiques

**Objectif :** vaincre **12 ennemis** successifs : quatre Valets, puis quatre Dames, puis quatre Rois. La **victoire** intervient à l'élimination du **dernier Roi**, sans subir sa riposte.

**Matériel total : 54 cartes physiques distinctes :**
- **12 ennemis :** quatre J, quatre Q, quatre K.
- **40 cartes de Taverne :** quatre As et les cartes 2 à 10 des quatre enseignes (4 + 36).
- **2 Jokers** : en solo, **placés à part** et utilisés comme deux pouvoirs de renouvellement de la main ; **ils ne sont pas mélangés à la Taverne**.

**Sémantique des enseignes d'origine :** ♥ Cœurs = recyclage de la défausse, ♦ Carreaux = pioche, ♣ Trèfles = dégâts doublés, ♠ Piques = protection cumulative. Toute future transposition en factions antiques conserve une **correspondance bijective** et non ambiguë entre ces quatre enseignes et leurs pouvoirs, ainsi qu'entre les rangs et leurs valeurs.

## 3. Préparation du mode solo

1. Mélanger **séparément** les quatre Rois, les poser face cachée au fond de la **pioche Château**.
2. Mélanger **séparément** les quatre Dames, les poser au-dessus des Rois.
3. Mélanger **séparément** les quatre Valets, les poser au-dessus des Dames. **Ne pas mélanger les trois niveaux ensemble.**
4. Révéler le premier Valet : c'est l'ennemi actif.
5. Mélanger les **40 cartes de Taverne** ; en distribuer **huit** au joueur. Le reste forme la pioche Taverne. Former une défausse commune initialement vide.
6. Mettre les **deux Jokers face visible à part**, non utilisés ; ils restent disponibles séparément de la main et de la pioche.

La partie commence face au premier Valet, avec une main de huit cartes maximum. Il n'existe ni points de vie autonomes du joueur, ni deuxième main, ni phase de préparation donnant des actions gratuites.

## 4. Tour normal du joueur — quatre étapes officielles

Sauf victoire/fin déclenchée plus tôt, l'unique joueur enchaîne les tours suivants.

1. **Jouer** une carte, une paire admise d'As, ou une combinaison numérique légale (la règle commune parle aussi de « passer » ; son interprétation solo est examinée au §11).
2. **Résoudre obligatoirement les pouvoirs des enseignes**, à l'exclusion du pouvoir de l'enseigne contre lequel l'ennemi actif est immunisé.
3. **Infliger les dégâts** cumulables à l'ennemi ; si ses points de vie sont épuisés, résoudre immédiatement sa défaite puis commencer un nouveau tour contre l'ennemi suivant **sans riposte**.
4. Si l'ennemi survit, **subir sa riposte** en défaussant suffisamment de cartes de main. Le prochain tour commence ensuite contre ce même ennemi.

**Important :** la puissance d'attaque du joueur et les points de vie de l'ennemi sont deux paramètres distincts. Les pouvoirs d'enseignes sont obligatoires quand ils sont applicables ; le joueur ne peut renoncer à un pouvoir de Cœur ou Carreau pour choisir une autre tactique.

## 5. Valeurs, vie, ripostes et cartes royales recrutées

| Ennemi | Points de vie initiaux | Riposte initiale | Valeur de la carte royale en main après recrutement |
| --- | ---: | ---: | ---: |
| Valet J | 20 | 10 | 10 |
| Dame Q | 30 | 15 | 15 |
| Roi K | 40 | 20 | 20 |

- Les **dégâts infligés s'accumulent** contre le même ennemi tant qu'il reste vivant ; ils ne sont pas effacés au début du tour.
- Les **As** ont une **valeur d'attaque de 1** et une valeur de défausse défensive de 1.
- Une carte royale vaincue puis piochée dans la main du joueur devient jouable : elle vaut **10 / 15 / 20** (J/Q/K), en attaque **ou** pour absorber la riposte, et son enseigne active le pouvoir associé lorsqu'elle est jouée.
- Les cartes royales nouvellement gagnées **ne sont pas d'autres ennemis** ; elles ont une identité physique unique dans les zones légales et ne retournent pas dans la pioche Château.
- Une carte de Taverne de valeur 2 à 10 inflige sa valeur indiquée, avant l'effet éventuel des Trèfles.

## 6. Pouvoirs des enseignes

| Enseigne | Effet obligatoire | Règle détaillée |
| --- | --- | --- |
| ♥ Cœurs | Restaurer la pioche Taverne | Mélanger la **défausse disponible**, prendre jusqu'à la **valeur d'attaque** en cartes face cachée de cette défausse mélangée, et les placer **sous** la pioche Taverne, sans dévoiler leur ordre |
| ♦ Carreaux | Piocher | Piocher jusqu'à la **valeur d'attaque** en cartes, sans jamais dépasser **8 cartes en main** ; arrêter si la pioche Taverne est vide |
| ♣ Trèfles | Double dégâts | Les dégâts de l'étape 3 valent **2 × valeur d'attaque totale** de l'ensemble joué, et non 2 × le nombre de cartes |
| ♠ Piques | Bouclier | Réduire la riposte de l'ennemi actif de la **valeur d'attaque totale** de l'ensemble joué ; les boucliers Piques de plusieurs tours sont **cumulatifs** jusqu'à la défaite de cet ennemi |

- Les Cœurs et Carreaux se résolvent à l'**étape 2**. Si les deux s'appliquent au même tour, toujours **Cœurs avant Carreaux**.
- Le bouclier de Piques se cumule sur **l'ennemi courant uniquement** ; sa protection est supprimée lors du changement d'ennemi. La riposte nette est **max(0, riposteInitiale − bouclierCumulé)**.
- Les Trèfles doublent les dégâts du coup **courant** ; ils ne doublent pas rétroactivement les attaques antérieures ni la valeur de la protection.
- En cas de plusieurs enseignes différentes jouées dans un ensemble légal, **chacun des pouvoirs différents s'applique à la valeur d'attaque totale de l'ensemble**. Une même enseigne présente deux fois **ne déclenche son pouvoir qu'une fois**.
- Le pouvoir lié à l'enseigne de l'**ennemi actif** est **inopérant** : la carte conserve toutefois sa valeur d'attaque normale et peut contribuer à une paire ou combinaison. En solo, les Jokers **ne suppriment jamais cette immunité**.

**Exemple officiel :** 8♦ accompagné de A♣ = valeur d'attaque 9, jusqu'à 9 cartes piochables (avec plafond de main), dégâts = 18 si aucun de ces pouvoirs n'est neutralisé par l'immunité ennemie.

## 7. Coups légaux : carte seule, compagnons As et combinaisons

### 7.1 Une carte seule

Toute carte ordinaire jouable de main peut constituer un coup. La carte royale recrutée se joue de la même façon avec sa valeur spécifique.

### 7.2 Un As (« compagnon »)

- Un As peut être joué **seul**, pour une valeur totale d'attaque de 1.
- Il peut aussi être joué **avec exactement une autre carte** (à l'exception d'un Joker), et cette autre carte peut être **un second As**.
- L'attaque totale est la **somme** des deux valeurs, et les pouvoirs d'enseigne applicables utilisent ce **total**.
- Jouer deux As de la **même enseigne** est physiquement impossible avec un paquet standard ; la règle générale précise simplement qu'une enseigne commune n'activerait son pouvoir qu'une fois.
- Un As ne peut **jamais s'ajouter à une combinaison de cartes numériques**, même si le total resterait ≤10 ; il ne peut pas former un trio avec deux autres cartes.

### 7.3 Combinaisons de cartes de même rang

- Au lieu d'une carte seule, le joueur peut jouer **2, 3 ou 4 cartes de même valeur numérique**, pour autant que la **somme totale de leurs valeurs soit ≤10**.
- Combinaisons admises de cartes 2–10 : paires de 2, 3, 4 ou 5 ; triples de 2 ou 3 ; quadruple de 2.
- La combinaison mobilise la **valeur totale** pour les pouvoirs et les dégâts, indépendamment du nombre de cartes du lot.
- Les As ne s'ajoutent pas à ces combinaisons et ne sont pas eux-mêmes une combinaison.
- Les **figures recrutées** J/Q/K valent 10/15/20 lorsqu'elles sont jouées : elles ne peuvent pas former de combinaison de deux cartes de même rang puisque leur total dépasserait 10.
- Exemple officiel : 3♦ + 3♠ + 3♣ = valeur 9 ; Carreaux peut piocher 9 (dans la limite de main), Piques donne 9 de bouclier, Trèfles inflige 18 dégâts — sauf immunité correspondant à l'ennemi.

## 8. Résolution d'une victoire locale et recrutement d'un ennemi

Après l'application de tous les pouvoirs légaux et des dégâts de l'étape 3 :

1. Si le total de dégâts **est inférieur** aux points de vie initiaux de l'ennemi, celui-ci survit et attaque à l'étape 4.
2. Si le total de dégâts **égale exactement** la vie initiale, mettre la **carte ennemie vaincue face cachée au sommet de la pioche Taverne** : elle rejoindra la main du joueur à un futur tirage (recrutement).
3. Si le total de dégâts **dépasse** la vie initiale, placer la **carte ennemie vaincue dans la défausse** ; elle pourra revenir plus tard par le pouvoir Cœur.
4. Dans les deux cas de défaite d'ennemi, placer toutes les cartes engagées contre cet ennemi lors des tours précédents et du tour actuel dans la **défausse**, **après** avoir déterminé le sort de la carte ennemie.
5. Révéler la prochaine carte de la pioche Château ; les dégâts et boucliers propres à l'ennemi précédent sont remis à zéro. Le joueur **saute la riposte** et joue immédiatement un nouveau tour.
6. Si le dernier Roi vient d'être vaincu, c'est une **victoire globale immédiate** ; ne pas essayer de révéler une treizième figure.

**Attention à l'ordre :** un coup de Cœur qui élimine l'ennemi résout d'abord son pouvoir avec la défausse **existant avant** le transfert des cartes engagées de ce combat. La remise à la Taverne d'une figure vaincue sur dégâts exacts est distincte de la récupération de Cœurs.

## 9. Riposte ennemie et défaite

Quand l'ennemi survit :
- Dégâts de riposte = **max(0, valeur de riposte de la figure − bouclier Piques accumulé contre cette figure)**.
- Le joueur sélectionne et défausse **une à une** des cartes de main, face visible, jusqu'à totaliser une valeur **au moins égale** à la riposte.
- Les cartes ordinaires ont leur valeur faciale, As = 1, figures recrutées J/Q/K = **10 / 15 / 20** ; les jokers sont **hors main en solo**, donc ne peuvent pas servir de cartes défensives.
- La règle n'exige pas une égalité stricte : **le dépassement est permis**. Les cartes défaussées ne déclenchent pas leur pouvoir d'enseigne.
- Une riposte nette **nulle** ne consomme aucune carte ; le prochain tour est autorisé.
- Si la main restante ne permet pas d'atteindre le montant requis, la partie est **perdue**. En mode solo, il faut toutefois laisser au joueur la fenêtre légale d'emploi d'un Joker **au début de l'étape 4**, avant de conclure.
- Une **main vide est autorisée** après paiement ; la défaite n'intervient pas du seul fait de se retrouver sans cartes après une riposte.

## 10. Spécificités officielles du mode solo

### 10.1 Deux jokers de renouvellement — hors pioche

Le joueur possède **deux Jokers**, face visible à part. Chacun peut être retourné **une seule fois** par partie, soit :
- **au début de l'étape 1**, avant de choisir une carte d'attaque ;
- **au début de l'étape 4**, avant d'avoir à payer la riposte.

L'activation d'un Joker :
1. **Défausse la totalité de la main actuelle**.
2. **Reconstitue une main jusqu'à huit cartes** depuis la pioche Taverne, suivant son ordre réel ; si la pioche Taverne comporte moins de huit cartes, ne pas inventer des cartes ni remélanger automatiquement la défausse.
3. Consomme **exactement un** Joker et le retourne à l'état utilisé.
4. N'est **pas considérée comme une pioche soumise à l'immunité Carreau de l'ennemi**.
5. Ne **supprime pas l'immunité de l'ennemi** (différence explicite avec le pouvoir du Joker multijoueur).
6. Ne remplace pas une attaque, ni une riposte, ni la séquence de jeu normale ; l'étape 1 ou 4 reprend après son activation.

Les deux utilisations sont séparées et facultatives ; un Joker déjà utilisé ne peut être réactivé. **Ne jamais appliquer au mode solo** le tour multijoueur du Joker (attaque zéro, suppression d'immunité, choix du prochain joueur).

### 10.2 Résultat officiel de victoire solo

| Jokers utilisés | Qualificatif |
| ---: | --- |
| 0 | **Victoire Or** |
| 1 | **Victoire Argent** |
| 2 | **Victoire Bronze** |

Une défaite n'obtient aucune médaille. Ces médailles font partie des règles officielles solo et ne sont pas des récompenses inventées par CardForge.

### 10.3 Pas de règle coopérative à inventer

Le joueur utilise une **unique main**, limite 8, et joue tous les tours consécutivement. La discussion entre coéquipiers, l'ordre des joueurs et le choix de prochain joueur par un Joker multijoueur n'ont aucun objet en solo. La limite de main est **8**, y compris lorsque l'effet Carreau s'applique.

## 11. Questions de fidélité et cas limites à contrôler

La source est claire sur les mécaniques fondamentales. Les vérifications suivantes sont ciblées et **n'autorisent pas la création d'une variante CardForge silencieuse**.

| ID | Cas | Lecture du livret et critère à vérifier |
| --- | --- | --- |
| REG-R01 | **« Passer » en solo** | La règle commune autorise de passer sous restriction liée aux autres joueurs ; avec un seul joueur, déterminer si cela est admis et avec quelle limite à partir d'un complément officiel. **Ne pas implémenter une permission de passer gratuitement sans confirmation** |
| REG-R02 | **Réactivation du Joker au début de l'étape 4 avec main déjà insuffisante** | Le joueur peut renouveler la main avant d'acquitter les dégâts : ce renouvellement précède obligatoirement la défaite |
| REG-R03 | **Joker activé quand la Taverne a moins de huit cartes** | Reconstituer jusqu'à l'épuisement réel de la Taverne ; ne pas réinjecter automatiquement la défausse sans effet Cœur |
| REG-R04 | **Effet Cœur avec défausse insuffisante ou vide** | Seules les cartes existantes sont réinjectées, aucun tirage de carte fantôme |
| REG-R05 | **Main pleine et Carreau** | Ne pas dépasser huit cartes ni imposer de faux tirages. L'attaque et les autres pouvoirs restent valides |
| REG-R06 | **Ennemi Trèfle/Pique et combos mixtes** | Neutraliser seulement le pouvoir de l'enseigne ennemie ; les autres pouvoirs et les dégâts de base subsistent |
| REG-R07 | **Passage d'ennemi et effets cumulés** | Seul le bouclier de l'ennemi courant persiste entre ses tours ; aucune protection transmise au suivant |
| REG-R08 | **Épuisement de la pioche et de la main** | Défaite lorsqu'aucune carte ne peut être jouée et aucun recours autorisé n'existe ; vérifier l'interaction avec le passage solo REG-R01 |
| REG-R09 | **Autorisation d'adaptation numérique et de changement d'univers/nom** | À vérifier auprès des ayants droit ; le livret public gratuit ne constitue pas une licence d'adaptation numérique |

**Véritable point métier potentiellement ouvert : REG-R01 sur le droit de passer en mode solo.** Les autres entrées sont principalement des tests d'application des règles déjà écrites. Aucune décision UX supplémentaire n'est nécessaire.

## 12. Matrice de conformité métier (scénarios à automatiser)

| Test | Situation | Résultat attendu |
| --- | --- | --- |
| REG-T01 | Début d'une partie solo | Château de 12 figures par niveau J/Q/K, 40 cartes Taverne, 8 en main, deux Jokers hors pioche |
| REG-T02 | Un Valet est vaincu | Dame/Roi non révélés avant disparition des quatre Valets |
| REG-T03 | Jouer 7♥ avec défausse suffisante | Sept cartes maximum réinsérées sous la Taverne, dégâts de base 7 |
| REG-T04 | Jouer 8♦ avec 5 cartes en main après pose | Tirer 3 au maximum pour atteindre 8 |
| REG-T05 | Jouer 8♣ sans immunité Trèfle | 16 dégâts |
| REG-T06 | Jouer 8♠ puis 3♠ sur le même ennemi | Bouclier cumulé de 11 pour les ripostes suivantes |
| REG-T07 | Ennemi ♣ face à 8♣ | Pouvoir doublement neutralisé, dégâts de base 8 |
| REG-T08 | Ennemi ♦ face à 8♦ | Pioche Carreau neutralisée, dégâts de base 8 |
| REG-T09 | 8♦ + A♣ contre ennemi sans ces immunités | Puissance 9, deux pouvoirs à 9, dégâts 18 |
| REG-T10 | A♥ + A♦ sur le même tour | Pouvoir Cœur avant Carreau, puissance 2 |
| REG-T11 | Deux cartes 5 de rang identique | Combo puissance 10 légale |
| REG-T12 | Trois cartes 4 identiques | Combo refusée (12 > 10) |
| REG-T13 | Deux As + une carte numérique | Lot refusé : un As avec une seule autre carte |
| REG-T14 | Figure recrutée J en main | Attaque/défense valeur 10, enseigne applicable en attaque |
| REG-T15 | Ennemi à 20 points de vie reçoit 20 exactement | Figure vaincue mise sur le dessus de la Taverne, pas dans la défausse |
| REG-T16 | Ennemi à 20 points de vie reçoit 21 | Figure vaincue vers la défausse, pas au sommet de la Taverne |
| REG-T17 | Ennemi vaincu par un coup de Cœur | Pouvoir Cœur résolu avant transfert des cartes jouées en défausse |
| REG-T18 | Ennemi vaincu alors qu'un bouclier est actif | Aucun retour de dégâts et bouclier remis à zéro pour l'ennemi suivant |
| REG-T19 | Riposte 10, défausse de 6 et 5 | Riposte couverte, dépassement admis |
| REG-T20 | Riposte 15, somme de la main 14 sans Joker utilisable | Défaite |
| REG-T21 | Riposte 0 grâce au bouclier | Aucune carte de main défaussée |
| REG-T22 | Joker solo déclenché en début d'étape 1 | Main défaussée, renouvellement jusqu'à 8, Joker consommé |
| REG-T23 | Joker solo déclenché au début d'étape 4 | Nouvelle main avant paiement de la riposte |
| REG-T24 | Joker solo contre ennemi ♦ | Renouvellement autorisé malgré immunité Carreau |
| REG-T25 | Joker solo contre ennemi ♠ | Immunité Pique non supprimée |
| REG-T26 | Victoire après usage de 0/1/2 Jokers | Médaille Or/Argent/Bronze respectivement |
| REG-T27 | Dernier Roi éliminé à l'étape 3 | Victoire immédiate, aucune riposte supplémentaire |
| REG-T28 | Sauvegarde/reprise | Identité des 54 cartes, ordre des deux pioches, main, défausse, bouclier, dégâts, jokers et phase conservés |
| REG-T29 | Main pleine avec Carreaux | Zéro tirage inutile, aucune mutation de cartes cachées |
| REG-T30 | Défausse vide avec Cœurs | Aucune création de cartes ; attaque quand même effectuée |
| REG-T31 | Deux pouvoirs différents dont celui de l'ennemi | Seul le pouvoir immunisé est neutralisé |
| REG-T32 | Tentative de passage en solo | Attendre clarification REG-R01 ; aucune interprétation implicite |

**État : 32 scénarios spécifiés, aucun exécuté.** Ces cas sont destinés aux tests du futur moteur ; aucune conclusion de réussite n'est déclarée.

## 13. Décision produit validée — nom et univers de l'adaptation (hors règles)

**Décision VALIDÉE par le porteur :**

- **Nom public retenu pour CardForge : « Les Douze Tyrans ».**
- **Univers retenu : Wuxia / Chanbara, Asie féodale fantastique (actualisation du 23 novembre 2026).**
- **Jeu de référence mécanique : Regicide, mode solo officiel.**
- **Principe impératif : conserver toutes les règles originales sans modification.**

Ces deux choix sont **définitivement validés au niveau du cadrage produit**, et ne sont plus de simples pistes créatives. Ils ne valent pas validation juridique de la disponibilité du nom ou des droits d'adaptation numérique ; ces contrôles restent nécessaires avant diffusion publique.

**Frontière fonctionnelle à respecter :**
- La préparation, les 54 cartes physiques, la main de huit cartes, la hiérarchie des douze ennemis, les valeurs, les quatre pouvoirs, les combinaisons, les immunités, les ripostes, les Jokers solo et les médailles de victoire restent **inchangés**.
- Les catégories de cartes (J/Q/K, 2–10, As, Joker), leurs nombres et leurs identifiants fonctionnels restent strictement identiques dans le moteur.
- Les illustrations, personnages, lieux, factions et appellations pourront être réinterprétés selon l'**Asie féodale fantastique Wuxia / Chanbara**, mais sans apporter de capacités ni d'exceptions aux règles.
- Les quatre domaines de pouvoir antiques devront correspondre **un pour un** aux enseignes originales (♥ recyclage, ♦ pioche, ♣ dégâts doublés, ♠ protection cumulative) ; aucune substitution n'en change les calculs.
- La déclinaison artistique détaillée et les choix de représentation relèveront de Sally, sans rouvrir les décisions de mécanique avec Mary.
- Le document reste nommé `regicide.md` pour conserver une traçabilité claire vers les règles originales ; le produit est présenté au public sous le nom **Les Douze Tyrans**, sous réserve des vérifications juridiques.

**Statut : nom et univers VALIDÉS ; fidélité mécanique inchangée ; aucune implémentation ni vérification de disponibilité du nom exécutée.**

## 14. Droits, crédits, publication

- Jeu original **Regicide** conçu par **Paul Abrahams, Luke Badger et Andy Richdale**, édité par **Badgers From Mars**.
- Le livret et les illustrations originales sont protégés ; le fait qu'il soit possible de jouer avec des cartes traditionnelles ou de télécharger les règles ne vaut **pas autorisation automatique** de créer/distribuer une adaptation numérique, avec un autre titre et un autre univers.
- Conserver la provenance du jeu source dans les documents internes et préparer un crédit produit transparent ; **vérifier les droits et obtenir les permissions nécessaires** avant toute diffusion publique, y compris gratuite.
- Le futur nom doit être recherché et validé pour éviter confusion et atteinte aux droits tiers ; le choix d'une esthétique antique ne suffit pas à établir l'indépendance juridique de l'adaptation.

## 15. Conclusion Mary

**Les mécanismes fondamentaux du mode solo sont documentés et reliés directement au livret officiel.** Le cadrage permet l'étude d'architecture et l'élaboration des tests. Avant de déclarer le moteur pleinement conforme, **clarifier le seul vrai doute de règle REG-R01 (droit de passer en solo)** et exécuter les cas de test ; avant diffusion, **vérifier séparément les autorisations de l'adaptation numérique**.

**Confiance : élevée** pour la préparation, les pouvoirs, combinaisons, immunités, ripostes, Jokers solo et médailles (tous présents dans les deux pages officielles) ; **modérée** pour la règle générale du passage transposée au solo, faute d'explicitation directe. **Aucun développement ni test exécuté pendant cette étude.**


## Décision produit confirmée — 23 novembre 2026 : Wuxia / Chanbara

**Validé explicitement par le porteur : l'univers officiel des « Les Douze Tyrans » devient l'Asie féodale fantastique, d'inspiration Wuxia / Chanbara, dans un empire fictif fracturé après la chute de l'Empereur.** La **Grèce antique est abandonnée** pour ce jeu : ses mentions anciennes ne sont conservées que comme historique et ne doivent plus guider les nouveaux visuels, spécifications ni textes de catalogue.

Les douze adversaires sont des seigneurs de guerre, maîtres martiaux ou gouverneurs tyranniques ; temples de montagne, bambouseraies, bannières, sabres, calligraphie, armures lamellaires et esprits folkloriques constituent la direction visuelle. Les références culturelles et artistiques citées sont des inspirations, **sans reprise d'éléments protégés**. Le nom public **Les Douze Tyrans** ne change pas. La transposition est **exclusivement esthétique** : le paquet de 54 cartes physiques, les 12 adversaires, les quatre pouvoirs d'enseigne, leurs valeurs et toutes les règles solo originales de Regicide restent inchangés. La disponibilité du nom et les droits d'adaptation demeurent à vérifier avant diffusion.
