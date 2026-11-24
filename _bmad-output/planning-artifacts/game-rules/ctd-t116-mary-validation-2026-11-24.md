# Mary — Avis fonctionnel sur CTD-T116 (CAR-40)

**Date :** 24 novembre 2026  
**Rôle :** Mary — Business Analyst (application du référentiel CardForge existant, sans recherche Web)  
**Sources :** [Matrice Mary Clear the Dungeon](../clear-the-dungeon-rule-test-matrix.md), [règles du jeu](./clear-the-dungeon.md), [CAR-40](https://lmn24.atlassian.net/browse/CAR-40), [revue Murat](../../test-artifacts/test-review/test-review-story-CAR-40.md).

## Demande et arbitrage analysé

**CTD-T116 initial** : « 12e monstre vaincu, 8 cartes en pioche, 3 cartes affectées à d'autres attaques partielles » ; « score officiel 8, excluant les attaques partielles ».

### Analyse Mary

1. La règle **CTD-ARB-01** autorise plusieurs attaques partielles, **sur plusieurs monstres vivants distincts**. Les attaques ne sont pas un stockage libre sur des monstres déjà vaincus.
2. Une victoire exige la défaite du douzième et **dernier** monstre. À cet instant, **zéro** monstre vivant reste ciblable. L'hypothèse de trois cartes affectées à « d'autres attaques partielles » implique au moins une autre cible vivante, contradiction avec « douzième monstre vaincu ».
3. Le score relève de **CTD-ARB-12** (option A déjà validée) : seul `drawPile.length` est compté. Le score 8 est donc bien applicable lorsque huit cartes demeurent dans la pioche au moment de la dernière victoire ; la présence de trois cartes sur d'autres cibles ne l'est pas.
4. Le moteur ne doit pas être modifié pour rendre cette conjonction incohérente possible.

## Décision d'analyse Mary

**Avis fonctionnel : NON APPLICABLE pour la précondition « trois cartes dans d'autres attaques partielles lors de la victoire sur le douzième monstre ». VALIDÉ sur le fond par l'analyse métier Mary**, indépendamment de la seule implémentation du validateur.

**Cas de remplacement recommandé :**
- **CTD-T116a, applicable :** onze monstres vaincus, dernier monstre ciblé, huit cartes en pioche, attaque finie légalement ; résultat victoire, score officiel **8**, sans ajout des cartes de main, dégâts ou cartes utilisées ; aucun autre monstre vivant/attaque sur d'autres cibles.
- **CTD-T116b, exception explicitée :** avant la dernière victoire, si une attaque partielle cible un autre monstre vivant, alors il ne s'agit **pas** du douzième et dernier monstre ; les préconditions conjointes du CTD-T116 historique sont logiquement incompatibles, donc aucun test de partie légale ne peut reproduire l'état.

La suite automatisée inclut les tests CTD-T116 d'invalidité des attaques sur cibles vaincues et du **score 8** sur un état valide.

**Validation produit obtenue le 24 novembre 2026 :** après cet avis, l'utilisateur a répondu explicitement « Oui je valide » à la proposition de requalifier CTD-T116. La matrice principale a été mise à jour avec l'exception non applicable et le cas valide du score 8. Il ne reste **aucune validation PO à demander pour CTD-T116**. Cet accord ne clôt pas à lui seul CAR-40 ; le statut Jira n'a pas été modifié.

## Conclusion

Pas de changement de règles, pas de mécanique inventée. La requalification est argumentée par les décisions **CTD-ARB-01 et CTD-ARB-12**, et peut être proposée à Murat pour sa revue technique de clôture avec réserve PO explicite.
