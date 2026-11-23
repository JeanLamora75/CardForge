# CAR-33 — Tutoriels facultatifs et règles intégrées aux deux jeux

**Agent :** Amelia — Senior Software Engineer (BMAD)  
**Date :** 23 novembre 2026  
**Story :** [CAR-33](https://lmn24.atlassian.net/browse/CAR-33) / S26  
**Statut :** code publié sur `main`, qualification visuelle réelle encore nécessaire.

## Contrat fonctionnel et implémentation

| Critère | Preuve de code |
| --- | --- |
| AC1 — choix initial par jeu, sans bloquer le jeu libre | `src/components/GameLearning.tsx` ouvre « Apprendre à jouer » ou « Jouer directement ». `src/application/learning.ts` mémorise séparément pour `clear-the-dungeon` et `gridcannon` dans `localStorage`. L'absence ou l'indisponibilité du stockage ne bloque aucun mode |
| AC2 — tutoriels relançables et totalement isolés | `createTutorialSession` ne prend aucun port de stockage ; ses états sont initialisés par seed déterministe et ses transitions validées par le même moteur que le jeu réel. Bouton « Recommencer l’entraînement » recrée une partie indépendante et n'emploie jamais `commit`, `commitTerminal`, `readGame` ou `replaceGame` |
| AC3 — règles et aide indépendante | `Rulebook` expose les règles jouables propres aux deux moteurs directement dans la fiche « Règles » et depuis le plateau. Aide contextuelle cochant/décochant uniquement `hintsEnabled` ; la règle ne disparaît pas. Les actions autorisées sont toujours issues de `getLegalActions`, que les aides soient activées ou non |

## Parcours UX

- Premier accès : choix explicite de l'apprentissage ou du plateau de jeu. Un choix mémorisé évite de reposer la question au retour.
- À tout moment : bouton « Relancer le tutoriel » ou « Jouer librement », règles consultables, aide indépendante.
- Grim Delve : mission déterministe `seed: 3301` avec explication des 4 colonnes, de la pose provisoire, de la troisième carte d’enseigne, de la fin de main et des dégâts.
- Thunderfighter : mission déterministe `seed: 3201` avec préparation, placement des figures, choix du remplacement, pioche, tirs, recherches, réserve spéciale et armures.
- Les actions de tutoriel sont bien des transitions légales du moteur original, **non** des simulations d’actions inventées. L'exercice permet de choisir librement parmi les actions légales et fournit des consignes adaptatives à la phase.

## Sécurité des données

- Données de préférences : clés `cardforge.learning.v1.clear-the-dungeon` et `cardforge.learning.v1.gridcannon`, distinctes des sauvegardes IndexedDB.
- Données de tutoriel : mémoire volatile uniquement. Le bouton Recommencer rejoue la distribution déterministe en mémoire ; quitter ne modifie pas une partie normale.
- Données de jeu : `gameId`, moteur, format de sauvegarde, règles et statistiques inchangés.
- Un refus d’action en tutoriel conserve l'état d'origine ; aucune écriture n'est tentée.

## Contrôles automatisés

`tests/learning.test.mjs` couvre : choix indépendant pour chacun des deux jeux ; préférences malformées ou stockage indisponible ; aide désactivée sans perte du mode ; départ identique et redémarrage des missions déterministes ; transitions acceptées conformes aux moteurs ; refus ne mutant pas le snapshot.

La suite de CI GitHub Actions lance `npm test` et `npm run build`. Vérifier la CI **sur le dernier commit de livraison** plutôt que de conclure sur un commit précédent.

## Limites de qualification

- Un test d'utilisation réel sur navigateur tactile et clavier, la revue du lecteur d'écran, la visualisation à petite largeur, et la confrontation éditoriale finale des règles intégrées aux derniers arbitrages Mary doivent encore être réalisés.
- Les missions sont des entraînements guidés par étapes et règles dynamiques, non des parcours à solution forcée : toutes les actions légales restent disponibles, pour ne pas modifier le jeu d'origine.
- `bmad-build` réclame un script `uv` indisponible dans ce contexte GitHub ; aucune exécution `uv` ni workflow généré par ce script n'est déclarée. Le travail a été effectué directement avec les fichiers BMAD, GitHub et Jira.

## Liens

- [Règles Grim Delve](../planning-artifacts/game-rules/clear-the-dungeon.md)
- [Règles Thunderfighter](../planning-artifacts/game-rules/gridcannon.md)
- [Story CAR-33](https://lmn24.atlassian.net/browse/CAR-33)
