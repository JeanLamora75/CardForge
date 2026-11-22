# Étude Mary — Clear the Dungeon : règles, versions et droits

**Date d'étude :** 21 novembre 2026  
**Statut :** analyse documentaire vérifiée, pas une autorisation de publication  
**Usage :** étude BMAD préparatoire au PRD et aux tests du moteur de jeu

## Mise à jour des droits — 22 novembre 2026

**Information fournie directement par le porteur de CardForge :** Mark S. Ball a donné son accord pour l'adaptation de Clear the Dungeon **tant que le jeu reste gratuit**.

- Statut : **accord déclaré**, non vérifié indépendamment (copie de l'échange et formulation précise non consultées).
- Contraintes de CardForge : le jeu doit rester gratuit ; ne prévoir ni paiement ni achat intégré, et maintenir l'absence de publicité prévue pour la V1. Toute monétisation ultérieure requiert une nouvelle vérification et, si nécessaire, un accord complémentaire.
- Périmètre à documenter avant la publication : usage du nom Clear the Dungeon, adaptation graphique avec illustrations inédites, diffusion Web et Android, territoires, attribution, durée et éventuelles autres conditions.
- Cette déclaration permet de faire avancer le cadrage et le développement, sans remplacer la vérification du périmètre exact des droits avant publication.
- Les mentions antérieures de « droits non clarifiés » ci-dessous décrivent **l'état au moment de la recherche initiale**, avant cette déclaration, et ne doivent pas être interprétées comme le statut actuel.

## Synthèse

- Auteur identifié : **Mark S. Ball**.
- Référence principale : **Clear the Dungeon Classic v1.1.0**, mise à jour le 23 octobre 2024, selon la publication attribuée à l'auteur ; **Advanced v1.2.0** est une autre variante, à ne pas amalgamer.
- Les règles de la version Classic sont **partiellement suffisamment documentées pour rédiger un cahier de tests**, mais des précisions restent nécessaires (réserve, fin de pioche, choix de règles facultatives).
- Les documents de règles portent la mention **CC BY-NC-ND 4.0**. La licence ne permet pas à elle seule de **partager une adaptation des éléments protégés**, même gratuite. Une autorisation individuelle a été obtenue par PySolFC, sans que cette permission s'étende automatiquement à CardForge.
- **Décision recommandée :** ne pas publier une adaptation identifiée *Clear the Dungeon* (ni réutiliser ses textes ou illustrations) tant que les droits nécessaires ne sont pas clarifiés. Prototyper les primitives techniques génériques séparément.

## Sources consultées

1. [Présentation et règles Classic v1.1.0, auteur cité, ressources associées](https://giftsforcardplayers.com/clear-the-dungeon-a-solo-card-game/) — décrit le jeu, les variantes, le score et indique la licence CC BY-NC-ND.
2. [Message de l'auteur du 23 octobre 2024 sur le livre de règles Classic 1.1 / Advanced 1.2](https://boardgamegeek.com/thread/3392258/clear-the-dungeon-complete-rule-book) — texte indexé, accès direct BGG partiellement restreint lors de la recherche.
3. [Document de règles Classic 1.1 / Advanced 1.2 (miroir Scribd)](https://www.scribd.com/document/846020212/Clear-the-Dungeon-Complete-1-0-2) — corroboration documentaire ; cette reproduction n'est pas la source de distribution officielle.
4. [Document plus ancien, Clear the Dungeon (miroir PDF)](https://www.docdroid.net/file/download/UZy4owj/clear-the-dungeon-pdf.pdf) — permet d'identifier les différences entre versions ; ne pas l'employer comme source unique de la V1.
5. [PySolFC : règles d'une adaptation](https://pysolfc.sourceforge.io/doc/rules/clearthedungeon.html) — confirme des mécaniques, mais ses choix techniques ne constituent pas une norme officielle.
6. [Échange PySolFC, autorisation obtenue individuellement auprès de Mark Ball](https://sourceforge.net/p/pysolfc/discussion/503708/thread/7fe11e76c9/) — déclaration d'un développeur, 20 août 2023 ; ne donne pas de licence générale.
7. [Licence CC BY-NC-ND 4.0, résumé officiel](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.fr), [texte légal](https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode.en).
8. [U.S. Copyright Office, Games](https://www.copyright.gov/register/tx-games.html) — distinction américaine entre les méthodes de jeu et l'expression de leurs règles ; le droit applicable à une diffusion internationale doit être vérifié.

## Classic v1.1.0 — mécanismes documentés

| ID | Élément | Règle retenue pour analyse | Niveau de certitude |
| --- | --- | --- | --- |
| CTD-01 | Matériel | 52 cartes classiques (A à K, quatre enseignes) et deux jokers, soit 54. | Élevé |
| CTD-02 | Monstres | 12 figures J, Q et K, mélangées dans quatre colonnes de trois ; seule la figure du dessus est révélée. | Élevé |
| CTD-03 | Pioche | Les A à 10 et les deux jokers forment un paquet de 42 cartes de puissance. | Élevé |
| CTD-04 | Main | Piocher trois cartes ; les jouer ou les défausser avant de tirer de nouvelles cartes. | Élevé |
| CTD-05 | Résistances | Valet = 11, Dame = 12, Roi = 13. | Élevé |
| CTD-06 | Attaque | Les deux **premières** cartes d'une attaque doivent avoir une somme **supérieure ou égale** à la résistance ; leurs enseignes sont libres. | Élevé |
| CTD-07 | Déclenchement | La **troisième** carte d'attaque doit correspondre à l'enseigne du monstre, quelle que soit sa valeur. | Élevé |
| CTD-08 | Joker | Joker polyvalent : puissance 10, peut prendre l'enseigne requise et servir de carte déclencheuse. | Élevé |
| CTD-09 | Après victoire locale | Retirer le monstre vaincu et les trois cartes d'attaque vers la pile des cartes éliminées ; révéler le prochain monstre accessible de cette colonne. | Élevé |
| CTD-10 | Défausse / dégâts | Les cartes non jouées vont à une pile de dégâts ; la publication Classic v1.1 mentionne une défaite à la septième carte de dégâts. | Élevé pour la règle publiée, cas particuliers à préciser |
| CTD-11 | Réserve | Règle **facultative** : le sommet de la pile de dégâts peut servir de carte disponible. | Élevé pour le caractère facultatif, interactions précises à tester |
| CTD-12 | Victoire | Éliminer les douze monstres. | Élevé |
| CTD-13 | Score | Nombre de cartes encore dans le paquet de puissance ; cartes restantes en main non comptées. | Élevé |
| CTD-14 | Variantes | Retrait des jokers ou désactivation de la réserve : adaptations de difficulté documentées, à ne pas activer implicitement. | Élevé |

### Corrections des propositions graphiques précédentes

1. La somme des deux cartes doit être **≥** résistance, et non égale exactement.
2. La carte déclencheuse correspond à une **enseigne/faction exacte**, pas seulement au rouge/noir ni à une catégorie générique.
3. Les deux jokers doivent être pris en compte : une illustration Fantasy doit représenter cette polyvalence sans ajouter de pouvoir.
4. L'éventuel seuil de dégâts de sept cartes et la règle facultative de réserve doivent être spécifiés avant d'afficher un moteur conforme.
5. Une maquette graphique produite auparavant ne constitue pas une preuve de conformité aux règles.

## Version de référence et points ouverts

**Proposition de référence : Classic 1.1.0.** Ne pas intégrer Advanced 1.2.0 dans le MVP par défaut. La variante Advanced présente un autre agencement, des objets liés à certains rois et une condition de dégâts différente.

Points à confirmer sur la version primaire complète avant la conception détaillée :
- Activation initiale ou non de la **réserve facultative** ; chaque option correspond à une variante de règles explicitement visible, et non à une difficulté inventée.
- Application exacte de la limite de **sept dégâts** lorsque la carte supérieure de réserve est rejouée.
- Conditions d'échec et gestion de la pioche lorsque le paquet est vide mais que des cartes restent dans la main ou la réserve ; ne pas clore prématurément la partie.
- Possibilité de répartir librement les trois cartes de la main entre plusieurs monstres et comportement des attaques partiellement posées (le texte parle de distribution libre, mais les cas limites restent à formaliser).
- Précisions sur la nature exacte des scores en cas de défaite ou d'abandon, qui ne doivent pas être inventés.
- Validation d'une matrice d'exemples déterministes, incluant as (valeur 1), double joker, déclencheur joker, attaque supérieure à la résistance, colonne vidée et paquet épuisé.

## Correspondance purement visuelle — projet CardForge

| Interne (provisoire) | Affichage thématique provisoire |
| --- | --- |
| Cœur | Flammes |
| Pique | Givre |
| Trèfle | Nature |
| Carreau | Lumière |
| J / 11 | Champion |
| Q / 12 | Gardien |
| K / 13 | Seigneur |
| Joker / 10 / enseigne variable | Carte polyvalente Fantasy, iconographie à définir |

Ces conventions de nommage sont **cosmétiques**. Le moteur continue d'évaluer des identifiants stables de carte et d'enseigne ; aucun personnage ne gagne un pouvoir. Les familles de personnages et leurs illustrations restent fixes pour le MVP.

## Analyse des droits

### Confirmé
- L'auteur cité est Mark S. Ball, avec des règles diffusées par Riffle Shuffle & Roll et via des ressources associées.
- Les publications de règles Classic v1.1.0 et Advanced v1.2.0 mentionnent **Creative Commons Attribution–NonCommercial–NoDerivatives 4.0**.
- Cette licence ne permet pas de distribuer des adaptations **du contenu protégé**, y compris gratuitement, sans une permission distincte, sous réserve des exceptions légales.
- Un développeur de PySolFC a publié une déclaration indiquant avoir obtenu personnellement l'accord de Mark Ball pour une intégration au logiciel en 2023. Cela montre une voie de contact, **pas** une autorisation universelle.

### Nuances nécessaires
- Selon le Copyright Office américain, les **méthodes de jeu abstraites** ne relèvent généralement pas du copyright, contrairement à une expression originale des règles, aux graphismes ou au code. Cette source ne tranche pas à elle seule la situation juridique en France ou sur les boutiques mobiles.
- Les noms, visuels et textes du jeu n'ont pas été autorisés pour CardForge. L'absence de publicité ne suffit pas à lever les restrictions.
- L'existence d'autres adaptations publiées n'établit pas un droit réutilisable pour CardForge.
- **Avis non juridique.** Pour une publication publique, obtenir idéalement un accord écrit qui précise le nom, les références à l'œuvre, les territoires, les plateformes web/Android, l'exploitation gratuite, les modifications visuelles et l'attribution ; envisager une revue juridique si nécessaire.

### Recommandation opérationnelle
- **Développement générique autorisé sous réserve des droits applicables :** modèle de paquet, moteur de transitions d'état, bibliothèque de composants et maquettes originales.
- **Publication d'une adaptation identifiée Clear the Dungeon : en attente de clarification des droits.**
- Ne pas contacter l'auteur au nom de l'utilisateur sans demande ou autorisation distincte.

## Prochain livrable BMAD

Passer à John après :
1. Vérification de la version primaire et des cas limites de la règle Classic.
2. Décision sur l'activation par défaut de la réserve, sans confusion avec Advanced.
3. Clarification du statut de publication/droits pour les éléments protégés.
4. Rédaction d'une matrice de tests de conformité à partir des règles vérifiées.

**État :** cadrage documentaire initial terminé ; conformité complète et droits de publication non encore validés.

## Décision complémentaire — réserve facultative (22 novembre 2026)
- **Option A approuvée : aucune réserve facultative activée dans le MVP** de CardForge.
- Le moteur ne doit autoriser aucun prélèvement de carte dans la pile de dégâts par l'effet de cette option. La pile et le seuil de défaite demeurent applicables.
- Cette décision constitue une configuration de Classic 1.1.0 et n'autorise pas à inventer d'autres variantes.
- Les scénarios et questions ouverts sont consignés dans [la matrice de conformité](./clear-the-dungeon-rule-test-matrix.md).

## Révision de la valeur du joker — 22 novembre 2026
La [publication des règles Classic v1.1.0](https://giftsforcardplayers.com/clear-the-dungeon-a-solo-card-game/) précise que la **puissance du joker est choisie, jusqu'à 10**. Les anciennes mentions « joker vaut 10 » sont une simplification insuffisante : une valeur variable doit être considérée. La borne inférieure et la gestion des choix dans des combinaisons particulières ne sont pas explicitement tranchées dans les sources consultées. Voir le [référentiel de règles actuel](./game-rules/clear-the-dungeon.md) et la [matrice de conformité](./clear-the-dungeon-rule-test-matrix.md).
