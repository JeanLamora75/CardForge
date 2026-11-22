# Clear the Dungeon — matrice initiale de conformité aux règles

**Auteur BMAD :** Mary (analyse métier)  
**Date :** 22 novembre 2026  
**Référence de travail :** Classic 1.1.0, sans réserve facultative, avec les deux jokers  
**Statut :** matrice de spécification **à confirmer sur la source primaire intégrale**, pas une preuve de conformité ni un jeu déjà testé.

## Règles de référence et statut

| ID | Règle ou décision | Statut |
| --- | --- | --- |
| C-01 | Un paquet classique contient 52 cartes et deux jokers ; les 12 figures J/Q/K représentent les monstres. | Documenté |
| C-02 | Quatre colonnes de trois figures ; révélation progressive des ennemis. | Documenté ; détails de révélation à vérifier |
| C-03 | Les 40 cartes A–10 plus deux jokers alimentent le jeu. | Documenté |
| C-04 | Une main de trois cartes pour former les attaques. | Documenté ; séquences de jeu à confirmer |
| C-05 | Valeur de résistance des figures : J=11, Q=12, K=13. | Documenté |
| C-06 | Une attaque requiert deux cartes dont la **somme est supérieure ou égale** à la résistance. | Documenté |
| C-07 | Une troisième carte déclenche l'attaque avec une enseigne identique à celle du monstre. | Documenté |
| C-08 | Le joker vaut 10 et peut être de l'enseigne requise. | Documenté ; contraintes de combinaison à détailler |
| C-09 | Sept cartes dans la pile de dégâts entraînent une défaite selon la règle retenue. | Documenté ; ordre d'évaluation exact à confirmer |
| C-10 | Gagner signifie éliminer les 12 monstres. | Documenté |
| C-11 | **Réserve facultative désactivée** pour CardForge V1. | Décision utilisateur validée |
| C-12 | Advanced 1.2.0 et les autres modifications de difficulté ne font pas partie du MVP. | Décision de périmètre |
| C-13 | Habillage original : quatre factions, personnages illustrés fixes, puissance lisible. Aucun pouvoir nouveau. | Décision de présentation |

## Scénarios déterministes — contrats de tests à prévoir

Tous les exemples qui suivent sont **conceptuels**. Ils servent à préciser les règles, pas à annoncer des tests exécutés.

| Test | Précondition | Action | Résultat attendu | Statut |
| --- | --- | --- | --- | --- |
| T-01 | Monstre J (11), cartes 5 et 6, déclencheur de même enseigne | Attaquer | Attaque admissible à 11 | Spécifié |
| T-02 | Monstre J (11), cartes 8 et 6, déclencheur de même enseigne | Attaquer | Attaque admissible à 14 : **pas** d'égalité stricte | Spécifié |
| T-03 | Monstre J (11), cartes 5 et 5, déclencheur correct | Attaquer | Insuffisant, ennemi non vaincu | Spécifié |
| T-04 | Monstre Q (12), cartes 6 et 6, déclencheur d'une autre enseigne | Attaquer | Attaque non admissible | Spécifié |
| T-05 | Monstre Q (12), cartes 6 et 6, déclencheur de bonne enseigne | Attaquer | Attaque admissible | Spécifié |
| T-06 | Monstre K (13), cartes 6 et 7, déclencheur correct | Attaquer | Attaque admissible | Spécifié |
| T-07 | Monstre J, cartes 1 (As) et 10, déclencheur correct | Attaquer | Attaque admissible si As=1 | Spécifié ; confirmer As |
| T-08 | Monstre J, deux valeurs suffisantes et joker déclencheur | Attaquer | Attaque admissible si le joker tient l'enseigne requise | Spécifié |
| T-09 | Main contenant un joker comme carte de puissance | Attaquer | **Attendu à arbitrer** : joker à puissance choisie jusqu'à 10 ou fixe 10, selon source faisant foi | À préciser |
| T-10 | Pioche initiale | Distribuer la mise en place | Douze figures en quatre colonnes, paquet de puissance de 42 cartes, aucune carte créée/perdue | Spécifié |
| T-11 | Un monstre accessible est vaincu, un autre est caché sous lui | Finaliser l'attaque | Révélation du monstre suivant et mouvement des cartes conforme à la règle | À préciser |
| T-12 | Pile de dégâts à 6 cartes | Ajouter une carte de dégâts | Défaite au seuil de 7 selon l'ordre officiel de résolution | À préciser |
| T-13 | Pile de dégâts non vide, réserve désactivée | Tenter de jouer son sommet | Action impossible dans le MVP | Validé par décision |
| T-14 | Onzième monstre vaincu, un dernier encore présent | Jouer une attaque valide | Pas de victoire prématurée | Spécifié |
| T-15 | Douzième monstre vaincu | Finaliser | Victoire définitive, un seul résultat enregistré | Spécifié |
| T-16 | La pioche est épuisée avec des cartes restantes en main | Continuer les actions | Ne pas déclarer de fin sans appliquer la condition exacte de la règle | À préciser |
| T-17 | Parties et cartes avec état de pioche ordonné | Sauvegarder et reprendre | Ordre de pioche et état inchangés, aucun nouveau mélange | Décision transverse |
| T-18 | Partie active et « Nouvelle partie » confirmé | Remplacer | L'ancienne partie compte comme **un** abandon, les autres jeux sont intacts | Décision transverse |
| T-19 | Une attaque déjà conclue | Rafraîchir l'interface | Aucun double retrait de cartes ni double comptage du résultat | Décision transverse |
| T-20 | Même carte interne, habillage Fantasy | Calculer une attaque | Résultat identique avec ou sans illustrations | Décision transverse |

## Questions métier bloquantes avant de coder le moteur complet

1. Ordre exact des phases : distribution, manipulation des cartes, déclaration d'une attaque, élimination et réapprovisionnement.
2. Possibilité de répartir les cartes de la main entre plusieurs ennemis, et gestion de cartes déjà posées.
3. Détails de consommation et défausse après une attaque, et fonctionnement de la pile de dégâts lorsque la réserve est désactivée.
4. Cas limites avec joker (carte de puissance, déclencheur, plusieurs jokers et règles de disponibilité).
5. Détermination exacte de l'échec sur la pile de dégâts, de l'épuisement de pioche et d'une éventuelle absence d'actions.
6. Critères de score officiel, si présent, distincts des statistiques transversales de CardForge.

Les points « à préciser » doivent être tranchés par le texte original ou par clarification de l'auteur, **pas par invention produit**.

## Critères de sortie pour John / Winston / Amelia

- Version primaire des règles intégralement consultée et référencée.
- Toute ambiguïté résolue, exemples de test réconciliés avec la source.
- Transitions de jeu décrites comme états et événements sans dépendance à l'interface graphique.
- Les règles retenues restent Classic 1.1.0, sans réserve ; les autres modes sont exclus du MVP.
- Une suite de tests exécutés couvrira ultérieurement les cas normaux et limites. Ce document seul ne valide aucune implémentation.

## Références

- [Étude initiale Mary — règles, versions et droits](./clear-the-dungeon-rules-rights-study.md).
- [Cadrage produit de CardForge](../../docs/cadrage.md).
- [Présentation des règles Clear the Dungeon](https://giftsforcardplayers.com/clear-the-dungeon-a-solo-card-game/).
- [Publication des règles sur BoardGameGeek](https://boardgamegeek.com/thread/3392258/clear-the-dungeon-complete-rule-book).

## Révision documentaire — 22 novembre 2026
- La publication accessible des règles Classic v1.1.0 indique que la puissance d'un joker est **choisie jusqu'à 10** ; l'ancienne formulation « vaut 10 » est incomplète. Les scénarios de joker doivent donc examiner plusieurs valeurs, mais la borne basse et les situations d'utilisation simultanée restent à vérifier sur la source primaire complète.
- Référentiel propre au jeu : [règles Clear the Dungeon](./game-rules/clear-the-dungeon.md).
- Ne pas confondre cette matrice de scénarios à exécuter avec une suite de tests réussis.

## Contrôle documentaire complémentaire du 22 novembre 2026
- **CTD-J01 — Bloquant :** la page de présentation ([Gifts for Card Players](https://giftsforcardplayers.com/clear-the-dungeon-a-solo-card-game/)) parle de puissance de joker choisie jusqu'à 10 ; le [livret Classic reproduit](https://www.scribd.com/document/846020212/Clear-the-Dungeon-Complete-1-0-2) parle d'une puissance de 10. Les anciennes formulations univoques de cette matrice étaient trop affirmatives : **les deux comportements ne doivent pas être testés comme simultanément officiels**.
- **CTD-T21 à prévoir :** deux jokers et déclencheur de joker, avec une attente fixée seulement après résolution CTD-J01.
- **CTD-T22 à prévoir :** septième carte de dégâts => défaite immédiate (attesté par deux textes).
- **CTD-T23 à prévoir :** répartition de cartes entre plusieurs monstres et attaque partiellement posée : résultat à confirmer.
- **CTD-T24 à prévoir :** fin de pioche avec une ou deux cartes en main : résultat à confirmer.
- [Référentiel actualisé Clear the Dungeon](./game-rules/clear-the-dungeon.md). Aucun scénario ci-dessus n'est exécuté.

## Nouveaux scénarios issus de l'approfondissement
- **CTD-T25 :** attaque complète : **exactement trois** cartes, deux pour puissance et une seule pour déclenchement, dans cet ordre ; pas de quatrième carte nécessaire ou comptée.
- **CTD-T26 :** dernier monstre de colonne vaincu : dévoiler immédiatement la carte nouvellement découverte (livret Classic reproduit).
- **CTD-T27 :** deux attaques incomplètes préparées sur des monstres différents puis nouvelle main : **RÉSULTAT À PRÉCISER** en vérifiant le texte officiel.
- **CTD-T28 :** joker de puissance utilisée à une valeur inférieure à 10 : **ATTENDU BLOQUÉ par CTD-J01** ; ne pas choisir arbitrairement 10 ou une valeur libre.
- Le [rapport approfondi](./game-rules/recherche-approfondie-2026-11-22.md) distingue explicitement les formulations concurrentes sur le joker. L'accès au Google Docs original n'a pas été obtenu, et les règles secondaires ne suffisent pas à trancher.

## Décision de test — joker fixe 10 (22 novembre 2026)

- **CTD-J01 — Fermé pour CardForge :** décision explicite du porteur de fixer la puissance de chaque joker à **10** ; enseigne libre selon le contexte de la règle. Cette décision n'efface pas le désaccord entre les sources originales, conservé dans les sections historiques.
- **T-09, T-28, CTD-T28 :** attendu désormais **joker puissance 10** ; aucun scénario de sélection de valeur inférieure n'est recevable comme comportement CardForge.
- **CTD-T29 à implémenter :** deux jokers ont chacun valeur 10 dans un rôle de puissance si leur usage simultané est autorisé par les règles ; les contraintes de disponibilité et la séquence exacte restent à confirmer.
- **CTD-T30 à implémenter :** joker déclencheur peut prendre l'enseigne du monstre, sans changer la valeur de puissance fixée (10) ; respecter les conditions officielles de combinaison.
- La source Web évoquant une valeur variable ne doit plus introduire de sélection libre dans l'implémentation CardForge.


## Arbitrage CTD-01 / CTD-ARB-01 — attaques partielles conservées (22 novembre 2026)

**Option B VALIDÉE par le porteur : plusieurs attaques partielles peuvent coexister et persister entre mains/tours.** Ancienne question O-CTD-01/03 résolue sur ce point précis pour CardForge ; les questions de déplacement et de défausse demeurent ouvertes. Le code **CTD-ARB-01** désigne cet arbitrage pour ne pas écraser le contrôle existant « CTD-01 » sur le paquet.

| Test à développer | Situation | Attendu CardForge | État |
| --- | --- | --- | --- |
| CTD-T31 | Poser une première carte de puissance sur le monstre A, puis une carte sur B | Les deux attaques partielles sont conservées séparément | Spécifié par décision, non exécuté |
| CTD-T32 | Renouveler la main lorsque A et B ont chacun une attaque incomplète | Les cartes posées sur A et B restent affectées, sans aller automatiquement aux dégâts | Spécifié par décision, non exécuté |
| CTD-T33 | Sauvegarder avec deux attaques partielles puis reprendre | Mêmes monstres, mêmes cartes attribuées et même ordre de pioche ; aucun nouveau mélange | Spécifié par décision, non exécuté |
| CTD-T34 | Compléter une attaque sur A tandis que B est incomplète | A seulement peut être vaincu suivant ses règles ; B conserve ses cartes | Spécifié par décision, non exécuté |

**Non tranché : CTD-02** — reprise, déplacement ou réaffectation d'une carte déjà posée ; la matrice sera complétée après décision. La persistance des attaques entre tours est une décision du projet et non une citation verbatim de l'auteur.


## Décision CTD-02 / CTD-ARB-02 — modifications provisoires pendant la main (22 novembre 2026)

**Option B VALIDÉE.** Une carte placée pendant la main courante est récupérable/réaffectable uniquement avant clôture de la main et avant résolution d'une attaque ; une carte issue d'une main antérieure est verrouillée. Ce choix est propre à CardForge lorsque les sources sont muettes.

| Test à développer | Situation | Résultat attendu | Statut |
| --- | --- | --- | --- |
| CTD-T35 | Le joueur place une carte 8 sur monstre A, puis la reprend avant la fin de main | La carte 8 revient dans la main ; elle ne figure plus sur A | Spécifié, non exécuté |
| CTD-T36 | Le joueur place une carte 8 sur A puis la déplace sur B dans la main courante | B seul possède la carte 8, sans duplication | Spécifié, non exécuté |
| CTD-T37 | Une carte placée sur A est confirmée par la clôture d'une main, puis la main suivante commence | Reprise/réaffectation de cette carte interdite | Spécifié, non exécuté |
| CTD-T38 | Une carte ancienne est verrouillée, une carte courante est provisoire sur le même monstre | Seule la carte de la main courante peut être reprise ou déplacée | Spécifié, non exécuté |
| CTD-T39 | Sauvegarde pendant une main avec des placements provisoires, puis reprise | Même répartition et mêmes droits de modification ; pas de remélange | Spécifié, non exécuté |
| CTD-T40 | Un monstre vient d'être vaincu par une attaque résolue | Impossible de reprendre les cartes de l'attaque achevée, même avant clôture de la main | Spécifié, non exécuté |

**Reste à arbitrer : CTD-03**, traitement des cartes encore en main lors de la clôture (défausse/dégâts). Les ancienne mentions « CTD-02 ouvert » dans l'historique ne reflètent plus son statut courant.


## Décision CTD-03 / CTD-ARB-03 — défausse explicite obligatoire avant pioche (22 novembre 2026)

**Option B VALIDÉE.** Les cartes non utilisées dans la main doivent être explicitement défaussées vers les dégâts ; celles déjà placées sur un monstre ne sont pas défaussées lors du renouvellement. Pioche interdite si une carte reste en main, défaite immédiate au septième dégât.

| Test | Précondition et action | Résultat attendu | État |
| --- | --- | --- | --- |
| CTD-T41 | Une carte non utilisée reste en main, demander une nouvelle main | Pioche refusée ; état inchangé | Spécifié, non exécuté |
| CTD-T42 | Main : 8 posé sur roi, 4 et 2 non utilisés ; défausser explicitement les deux | 4 et 2 rejoignent dégâts (+2), 8 reste sur roi, main vidée | Spécifié, non exécuté |
| CTD-T43 | Défausser une seule carte inutilisée | +1 dégât, autres cartes restent disponibles dans la main | Spécifié, non exécuté |
| CTD-T44 | Six cartes de dégâts, demander « Défausser les cartes restantes » avec deux cartes en main | Défaite au 7e dégât, pas de nouvelle pioche ni de continuation après état terminal | Spécifié, non exécuté |
| CTD-T45 | Après défausse explicite, main vide et attaque partielle sur plusieurs monstres | Les attaques partielles persistent ; clôture confirme les placements actuels | Spécifié, non exécuté |
| CTD-T46 | Main vide, demande de nouvelle main | Clôture des placements actuels et nouveau tirage uniquement selon CTD-04 à arbitrer | Spécifié partiellement, non exécuté |
| CTD-T47 | Défausse d'une carte puis rafraîchissement/reprise | Nombre de dégâts, état de la main et cartes engagées identiques ; pas de double dégât | Spécifié, non exécuté |

**Question restante CTD-04 :** quelle suite lorsque la pioche contient moins de trois cartes ou est vide, avec des monstres ou des attaques partielles en cours ? CTD-03 ne décide pas cette règle.


## Décision CTD-04 / CTD-ARB-04 — pioche finale de une ou deux cartes (22 novembre 2026)

**Option A VALIDÉE :** la dernière main prend toutes les cartes disponibles, même moins de trois ; pas d'appoint depuis la pile de dégâts et pas de défaite automatique au seul instant où la pioche devient vide. La défaite finale est **CTD-05 à arbitrer**.

| Test | Précondition / action | Attendu CardForge | Statut |
| --- | --- | --- | --- |
| CTD-T48 | Main précédente close, pioche contient 2 cartes | Prendre exactement 2 cartes en main ; pioche vide ; ordre inchangé | Spécifié, non exécuté |
| CTD-T49 | Main précédente close, pioche contient 1 carte | Prendre exactement 1 carte en main ; pioche vide | Spécifié, non exécuté |
| CTD-T50 | Dernière main de 2 cartes, une attaque partielle antérieure | Pouvoir jouer une carte pour compléter l'attaque si légale | Spécifié, non exécuté |
| CTD-T51 | Pioche vide immédiatement après le tirage final, cartes encore en main | Partie non automatiquement terminée par le seul tirage ; cartes jouables | Spécifié, non exécuté |
| CTD-T52 | Dernière main de 1 carte non utilisée, joueur choisit de la défausser | +1 dégât ; pas de recyclage ; fin du tour selon CTD-03 | Spécifié, non exécuté |
| CTD-T53 | Pioche vide et main close, demander une nouvelle main | Aucune carte créée ni repiochée ; résultat terminal à définir en CTD-05 | Partiellement spécifié, non exécuté |
| CTD-T54 | Sauvegarde puis reprise avec dernière main et pioche vide | Même main, mêmes cartes engagées, aucune nouvelle distribution | Spécifié, non exécuté |

**Traçabilité :** CTD-T16 / CTD-T24 (anciens scénarios « à préciser ») doivent être réévalués à partir de cette décision ; l'incertitude restante porte sur le *déclenchement de la défaite*, non sur le droit de jouer une dernière main incomplète.


## Arbitrage CTD-05 / CTD-ARB-05 — défaite à la clôture de la dernière main (22 novembre 2026)

**Option A VALIDÉE :** pioche vide = pas de défaite tant qu'il reste des actions autorisées dans la dernière main ; si un monstre reste vivant **à sa clôture**, défaite automatique. Douzième monstre vaincu = victoire immédiate ; 7e dégât = défaite immédiate.

| Test | Situation | Attendu CardForge | Statut |
| --- | --- | --- | --- |
| CTD-T55 | Tirer les deux dernières cartes : pioche devient vide, main contient deux cartes | Aucune défaite au seul tirage ; cartes jouables | Spécifié, non exécuté |
| CTD-T56 | Pioche vide, attaque partielle complétée avec la dernière carte, 12e monstre vaincu | Victoire immédiate, jamais suivie d'une défaite par épuisement | Spécifié, non exécuté |
| CTD-T57 | Pioche vide, dernière carte défaussée, monstres encore vivants, puis main clôturée | Défaite par épuisement automatiquement à la clôture | Spécifié, non exécuté |
| CTD-T58 | Pioche vide, 6 dégâts, dernière main contient une carte ; défausse explicite | 7e dégât = défaite immédiate, pas de clôture supplémentaire | Spécifié, non exécuté |
| CTD-T59 | Pioche vide et main vide, des attaques partielles verrouillées restent sans déclencheur et des monstres vivent | Clôture de la main = défaite, sans autorisation de piocher ou de rejouer les cartes verrouillées | Spécifié, non exécuté |
| CTD-T60 | Clôture de dernière main déclenchée deux fois ou rafraîchissement après défaite | Une seule fin de partie et un seul résultat statistique | Spécifié, non exécuté |
| CTD-T61 | Main terminée, pioche non vide, un monstre encore vivant | Clôture prépare le tirage normal, aucune défaite par épuisement | Spécifié, non exécuté |

**Reclassement des anciens scénarios :** CTD-T16, CTD-T24, CTD-T53 ont désormais une règle CardForge explicite sur la fin de pioche. Ces scénarios restent à implémenter et exécuter ; ils n'étaient pas des tests déjà passés. **CTD-06 à arbitrer** : séquence de retrait/révélation après attaque complète.


## Décision CTD-06 / CTD-ARB-06 — révélation immédiate du monstre suivant (22 novembre 2026)

**Option A VALIDÉE :** une attaque complète élimine immédiatement sa cible et ses trois cartes, puis révèle immédiatement le prochain monstre de cette colonne s'il existe. Les autres attaques partielles ne sont pas modifiées. Aucune défausse vers les dégâts, et la victoire au douzième monstre est prioritaire.

| Test | Précondition / action | Attendu CardForge | Statut |
| --- | --- | --- | --- |
| CTD-T62 | Un Valet visible couvre une Dame cachée ; terminer une attaque valide contre le Valet | Valet et trois cartes d'attaque retirés ; Dame révélée immédiatement, sans clôture de main | Spécifié, non exécuté |
| CTD-T63 | Après CTD-T62, le joueur possède encore une carte en main | Il peut l'utiliser sur le monstre désormais visible si son placement est légal | Spécifié, non exécuté |
| CTD-T64 | Attaque partielle sur monstre B tandis que A est vaincu | Les cartes déjà affectées à B restent inchangées et à leur emplacement | Spécifié, non exécuté |
| CTD-T65 | Dernier monstre de sa colonne vaincu, d'autres colonnes restent occupées | Colonne vidée ; aucune carte fictive révélée ; partie continue | Spécifié, non exécuté |
| CTD-T66 | Douzième monstre vaincu, pioche éventuellement vide | Victoire immédiate, jamais remplacée par défaite d'épuisement | Spécifié, non exécuté |
| CTD-T67 | Une attaque complète et valide vainc un monstre | Les trois cartes engagées sont éliminées et n'ajoutent aucun dégât | Spécifié, non exécuté |
| CTD-T68 | Après révélation, reprise sauvegardée, rafraîchissement ou attaque répétée | Monstre révélé une seule fois, aucun second retrait et aucun double résultat | Spécifié, non exécuté |

**Prochain arbitrage : CTD-07**, ordre de pose des cartes de puissance et de déclenchement. La mention « CTD-06 à arbitrer » dans la documentation historique est remplacée par cette validation.


## Décision CTD-07 / CTD-ARB-07 — ordre puissance, puissance, déclencheur (22 novembre 2026)

**Option A VALIDÉE :** les deux cartes de puissance doivent précéder la troisième carte déclencheuse. La main et le tour peuvent changer entre les placements, mais **le rôle de déclencheur n'est jamais prérempli**. Les déplacements de cartes de la main courante demeurent permis selon CTD-02.

| Test | Précondition / action | Résultat attendu CardForge | Statut |
| --- | --- | --- | --- |
| CTD-T69 | Valet de cœur J11, aucune puissance posée ; tenter de poser un 3 cœur comme déclencheur | Déclencheur refusé : les deux puissances ne sont pas placées | Spécifié, non exécuté |
| CTD-T70 | Valet J11 avec seulement un 6 de puissance posé ; tenter une carte déclencheuse de même enseigne | Refusé tant que la seconde puissance n'est pas présente | Spécifié, non exécuté |
| CTD-T71 | Valet J11 ; poser 6 puis 5 en puissance, et enfin 3 de l'enseigne du valet | Somme 11, attaque résolue à la pose de la troisième carte | Spécifié, non exécuté |
| CTD-T72 | Valet J11 ; première puissance 6 sur une main, seconde puissance 5 sur la suivante, déclencheur sur une troisième | Les placements antérieurs persistent et la troisième carte termine l'attaque | Spécifié, non exécuté |
| CTD-T73 | Dame Q12 ; deux puissances totalisent 12, mais le déclencheur ne correspond pas à l'enseigne | Attaque non résolue ; les rôles sont conservés sans déclenchement illégal | Spécifié, non exécuté |
| CTD-T74 | Roi K13 ; deux puissances totalisent 13, joker fixe 10 joué comme déclencheur d'enseigne adaptée | Attaque valide et résolue, sans capacité supplémentaire | Spécifié, non exécuté |
| CTD-T75 | Deux puissances totalisent le seuil, le joueur retire une carte posée dans la main actuelle avant de jouer le déclencheur | Attaque redevient partielle, déclencheur encore interdit tant qu'il manque une puissance | Spécifié, non exécuté |
| CTD-T76 | Trois cartes en main pourraient former une attaque en les permutant, sans placement chronologique approprié | Le moteur ne les réordonne pas automatiquement pour éliminer la cible | Spécifié, non exécuté |
| CTD-T77 | Deux puissances déjà posées totalisent **moins** que la résistance | **Attendu incomplet : CTD-08 doit décider** si la seconde pose est rejetée ou conservée sans déclencheur | En attente de décision |

**Prochain arbitrage CTD-08 :** comportement lorsqu'une seconde carte de puissance produit un total insuffisant ; le rejet d'un déclencheur insuffisant est acquis, le sort de la seconde carte insuffisante ne l'est pas.


## Arbitrage CTD-08 / CTD-ARB-08 — rejet de la seconde carte insuffisante (22 novembre 2026)

**Option A VALIDÉE :** avec la première puissance `P1` posée, le moteur refuse toute seconde puissance `P2` lorsque `P1 + P2 < résistance`. La deuxième carte reste en main ; aucune modification d'état ni dégât automatique. Les puissances égales ou supérieures au seuil sont valides. La troisième carte reste exclusivement un déclencheur.

**Révision de CTD-T77 :** attendu désormais **refus de la seconde puissance, état inchangé** (CTD-08 tranchée).

| Test | Précondition / action | Attendu CardForge | Statut |
| --- | --- | --- | --- |
| CTD-T78 | Valet J11, 5 déjà engagé, tenter d'ajouter 4 | Refus de pose, 4 conservé en main, 5 maintenu | Spécifié, non exécuté |
| CTD-T79 | Valet J11, 5 déjà engagé, ajouter 6 | Pose acceptée : 5 + 6 = 11 ; attendre déclencheur | Spécifié, non exécuté |
| CTD-T80 | Valet J11, 8 déjà engagé, ajouter 6 | Pose acceptée : 14 ≥ 11 ; égalité stricte non exigée | Spécifié, non exécuté |
| CTD-T81 | Roi K13, 5 posé, jouer un joker puissance 10 | Pose acceptée : 15 ≥ 13 ; aucune valeur choisie | Spécifié, non exécuté |
| CTD-T82 | Roi K13, 5 posé, ajouter 7 | Refus de pose : 12 < 13 ; aucun dégât, aucun changement de paquet | Spécifié, non exécuté |
| CTD-T83 | Rejeter une seconde puissance insuffisante puis sauvegarder/reprendre | Même première puissance, seconde carte toujours en main ; aucune mutation cachée | Spécifié, non exécuté |
| CTD-T84 | Deux puissances insuffisantes ; essayer une troisième puissance comme rattrapage | Aucun emplacement « troisième puissance » autorisé : la troisième place est réservée au déclencheur après deux puissances suffisantes | Spécifié, non exécuté |

**Prochain arbitrage : CTD-09**, validité d'une première carte de puissance qui ne pourrait atteindre le seuil avec aucune deuxième carte de valeur maximale 10.


## Décision CTD-09 / CTD-ARB-09 — première carte de puissance complétable (22 novembre 2026)

**Option A VALIDÉE :** refuser toute première puissance `P1` telle que `P1 + 10 < R`, sans mutation de la partie. Le calcul utilise le maximum théorique 10 et **n'inspecte jamais** les futures cartes de la pioche. La pose de la deuxième puissance garde sa validation indépendante CTD-08.

| Test | Situation | Attendu CardForge | Statut |
| --- | --- | --- | --- |
| CTD-T85 | Roi K13, première puissance 2 | Refus : 2 + 10 = 12 < 13 ; carte conservée en main, aucun dégât | Spécifié, non exécuté |
| CTD-T86 | Roi K13, première puissance 3 | Acceptation : 3 + 10 = 13 ; attaque partielle en attente | Spécifié, non exécuté |
| CTD-T87 | Dame Q12, première puissance As (1) | Refus : 1 + 10 = 11 < 12 | Spécifié, non exécuté |
| CTD-T88 | Dame Q12, première puissance 2 | Acceptation : 2 + 10 = 12 | Spécifié, non exécuté |
| CTD-T89 | Valet J11, première puissance As (1) | Acceptation : 1 + 10 = 11 | Spécifié, non exécuté |
| CTD-T90 | Roi K13, première puissance joker fixe 10 | Acceptation : 10 + 10 = 20 ≥ 13 | Spécifié, non exécuté |
| CTD-T91 | Première carte mathématiquement admissible mais aucune seconde carte suffisante effectivement disponible en pioche | Première pose acceptée ; aucune inspection d'informations cachées | Spécifié, non exécuté |
| CTD-T92 | Première puissance rejetée, puis sauvegarde/reprise | Même main, plateau et pioche, sans trace fantôme ni carte ajoutée aux dégâts | Spécifié, non exécuté |
| CTD-T93 | Première puissance autorisée puis seconde insuffisante | Première reste en place ; seconde refusée selon CTD-08 | Spécifié, non exécuté |

**Prochaine décision CTD-10 :** rôle et enseigne du joker au moment du placement (ergonomie/moteur). Les cas CTD-T85 à CTD-T93 sont seulement **spécifiés**, pas exécutés.
