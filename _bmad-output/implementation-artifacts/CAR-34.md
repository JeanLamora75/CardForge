# CAR-34 — Bilan immersif, statistiques visibles et accessibilité

**Agent :** Amelia — Senior Software Engineer (BMAD)  
**Date :** 23 novembre 2026 · **Jira :** [CAR-34](https://lmn24.atlassian.net/browse/CAR-34)  
**Statut :** code implémenté sur `main` ; qualification UI réelle à compléter.

## Critères d'acceptation et réalisation

| Critère | Implémentation |
| --- | --- |
| **AC1 — Résultats distincts, score conditionnel, Rejouer et Catalogue** | `src/application/game-results.ts` prépare le texte métier selon le jeu et la cause de perte ; `src/components/GameResultPanel.tsx` affiche titre, explication, compteurs et score **uniquement** pour une victoire avec score officiel défini. Boutons Rejouer et Retour au catalogue sans animation obligatoire. `replayFinishedGame` vérifie que la sauvegarde durable est terminée puis la remplace par `confirmNewGame` / `replaceGame`, sans abandon silencieux de partie active. |
| **AC2 — statistiques par jeu et tutoriels exclus** | Une vue commune `GameStatisticsPanel` présente les victoires, défaites, abandons et `victoryRate` du catalogue. Taux calculé strictement sur victoires + défaites, « — » pour dénominateur nul. Le tutoriel n'utilise pas IndexedDB et ne lit pas la vue des statistiques. Les résultats sont enregistrés par le mécanisme transactionnel de CAR-14 déjà existant. La consultation des statistiques sur la fiche est rafraîchie à la navigation hash. |
| **AC3 — clavier/tactile, non chromatique, animations réduites et focus** | Bilan explicite (« Victoire » / « Défaite »), score libellé, causes écrites, boutons sémantiques avec taille minimale tactile de 44 px, passage automatique du focus sur le titre de résultat, structure responsive et `prefers-reduced-motion`. Retour au catalogue via lien d'ancrage ; navigation existante et retour de focus du catalogue conservés. |

## Fichiers

- `src/application/game-results.ts` : fonctions de résumé pures et garde de replay.
- `src/components/GameResultPanel.tsx` : écran de fin + compteurs.
- `src/components/GrimDelveBoard.tsx`, `src/components/ThunderfighterBoard.tsx` : intégration sur les états terminaux ; actions de replay du jeu normal ou de l'exercice guidé selon le mode.
- `src/components/GameLearning.tsx` : relance des exercices déterministes en mémoire.
- `src/App.tsx` : statistiques partagées, actualisation à la navigation.
- `src/styles.css` : rendu responsive et support mouvement réduit.
- `tests/game-results.test.mjs` : scores non inventés sur défaite, causes d'échec, taux, reprise après partie terminée et rejet du replay sur partie active.

## Invariants

1. Un score officiel ne s'affiche **que** si le moteur fournit un score et que la partie a été gagnée.
2. Les tutoriels n'influencent pas les statistiques ni les sauvegardes ordinaires.
3. Un replay ne remplace jamais une sauvegarde encore active sans décision explicite de nouveau jeu ; pour CAR-34, le replay est offert **après clôture uniquement**.
4. Les identifiants internes des jeux, règles et moteurs restent inchangés.
5. Navigation vers le catalogue et consultation des résultats n'entraînent jamais un abandon.

## Qualité, adaptations et réserves

- Vérifications automatisées attendues : GitHub Actions exécute `npm test` puis `npm run build` (TypeScript + Vite). Les statuts CI doivent être relevés sur le dernier commit réellement testé.
- Recette réelle non attestée : clavier, lecteur d'écran, contraste, tactile/mobile, retour du focus avec navigation depuis le bilan et reprise sur plusieurs onglets.
- Conformément aux contraintes CardForge, **aucun script `uv` BMAD exécuté** ; exploitation directe des référentiels GitHub, Story Jira et tests CI natifs.
- Les sauvegardes actives ne peuvent pas être remplacées par Rejouer ; le flux général de confirmation d'abandon est géré séparément dans le service `confirmNewGame`.
