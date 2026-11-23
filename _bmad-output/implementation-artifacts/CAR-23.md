# CAR-23 — Thunderfighter : placement des figures et cas de secours

**Agent :** Amelia — Senior Software Engineer (BMAD)  
**Date :** 23 novembre 2026 · **Story :** CAR-23 / S16  
**Livraison :** moteur, tests et preuves publiés sur `main`.

## Références
- [Jira CAR-23](https://lmn24.atlassian.net/browse/CAR-23)
- [Mary — Gridcannon V2, décisions GC-01, GC-02 et GC-13, audit §68](../planning-artifacts/game-rules/gridcannon.md)
- [CAR-22 — préparation](CAR-22.md)
- [Source officielle Tom Francis — Gridcannon Version 2](https://www.pentadact.com/2019-08-20-gridcannon-a-single-player-game-with-regular-playing-cards/)

## Implémentation

- `src/games/gridcannon/engine.ts` : `getFigurePlacementOptions` distingue explicitement `normal`, `rescue`, `blocked` et `none` ; `availableFigureSlots` réutilise le même calcul.
- **GC-01** : seuls les huit sommets **périphériques** entrent dans l'attraction ; la case centrale (index 4) reste hors comparaison, même si elle porte une carte meilleure. Ordre des priorités : **même enseigne**, sinon **même couleur**, sinon **plus grand rang** ; à chaque catégorie, le rang le plus élevé prime. Une figure au coin offre les deux positions extérieures adjacentes encore libres.
- **GC-02** : un sommet très semblable dont les places adjacentes sont toutes occupées est ignoré au profit du **meilleur sommet suivant disposant d'une place libre**. Tant qu'une destination normale existe, le mode secours est interdit.
- **GC-13** : si aucune carte périphérique visible ne possède une destination libre admissible, proposer **toutes les positions extérieures réellement libres** sans choix automatique. Si aucune n'est libre, `blocked` avec zéro action ; aucune défaite artificielle ni duplication. La liste et son mode sont recalculables après sauvegarde/reprise.
- **Vie et occupation** : `getFigureSlotStatus(state, slot)` retourne `empty`, `alive` ou `defeated`. Le champ sérialisable facultatif `defeatedFigures?: string[]` conserve l'état de figure vaincue sans libérer `figureSlots`, compatible avec les sauvegardes CAR-22 ne contenant pas ce champ. Le moteur valide l'absence de doublons et impose que chaque figure vaincue occupe effectivement une case.
- **Scénarios d'Extraction à venir** : introduction de `phase='placing-figure'` pour représenter un placement de figure pendant le jeu sur une grille dont certaines cases sont vides. Le moteur n'implémente pas encore l'Extraction elle-même ni la transition permettant d'abattre une figure (Stories ultérieures) ; les tests utilisent des instantanés déterministes valides. Aucune carte fictive n'est utilisée pour une case vide.
- **Intégrité** : conservation de l'identité physique de chaque figure, refus des placements répétés ou occupés, contrôle des 54 cartes et statut des figures indépendant de la position.

## Couverture Jira

| AC | Réalisation |
| --- | --- |
| AC1 — Périphérie seule et centre exclu | Tests centre exact, priorités enseigne/couleur/rang, coin et choix de destination |
| AC2 — Repli du meilleur sommet bloqué et secours GC-13 | Tests meilleur bloqué, suivant disponible, secours avec périphérie vide, dernière place libre |
| AC3 — Douze figures identifiables et zones sans doublon | Statuts vide/vivante/vaincue, validation des figures vaincues, conservation de l'emplacement, tentative de treizième figure refusée, sauvegarde/reprise et double clic |

## Preuves d'exécution

1. **12/12 nouveaux scénarios CAR-23 réussis** et **10/10 scénarios CAR-22 toujours réussis**, en exécutant les corps des fichiers de test publiés contre le moteur GitHub mécaniquement dépouillé des annotations TypeScript. Les helpers du paquet et du PRNG sont équivalents ; les assertions et la copie structurée utilisent des remplaçants JavaScript fondés sur les états JSON. **Ce n'est pas une exécution native Node des tests.**
2. **300/300 préparations déterministes complètes** réussies dans ce même outil (création avec seed 0–299, placement des figures, remplacement, pose des figures différées, validation du plateau).
3. **Preuve CI GitHub Actions native sur commit `236cd6325a2a743a1fc62fdc7c90f247d5f079e3`**, [run 45245800073](https://github.com/JeanLamora75/CardForge/actions/runs/45245800073), statut `completed`, conclusion `success`. Job **web** : `Install dependencies`, `Unit tests`, `TypeScript and Web build` tous **success** ; vérifié via les données du job GitHub Actions. Le commit contient les modifications du moteur et des tests CAR-23, avant le présent rapport.
4. Pas de test manuel effectué sur un vrai navigateur ni de qualification UI/IndexedDB de l'affichage des choix de placement. Le moteur de gameplay complet et la destruction de figures restent hors de ce périmètre.
5. Workflow BMAD adapté aux connecteurs et à GitHub Actions, aucun script `uv` exécuté ou prétendu exécuté.

## Distinction entre source et arbitrages

Les cas de centre exclu, de repli vers le candidat suivant et de secours GC-13 sont **des décisions d'adaptation CardForge approuvées** pour les zones d'ombre de la Version 2 ; ils ne doivent pas être présentés comme des prescriptions textuelles de Tom Francis. L'assignation physique des figures et la permanence d'une figure vaincue dans sa place sont conformes au référentiel technique choisi.

## Limites / suite

- La mise à jour de `defeatedFigures` au moment de la défaite d'une figure sera raccordée avec les attaques de Thunderfighter. Les tests CAR-23 exercent des états déjà marqués vaincus, sans simuler un combat inexistant.
- Ajouter l'expérience visuelle de choix d'une position et le feedback de secours à l'interface de jeu.
- Les positions de secours ne deviennent jamais une nouvelle mécanique d'attaque. Les règles d'attaque, armure et pouvoirs spéciaux seront développées dans les Stories suivantes.
