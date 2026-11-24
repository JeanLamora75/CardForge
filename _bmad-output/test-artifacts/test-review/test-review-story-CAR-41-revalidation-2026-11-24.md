# Murat — Contre-revue QA CAR-41 après corrections Amelia

**Date :** 24 novembre 2026  
**Story :** [CAR-41 — Tests d'intégration des sauvegardes, migrations et résultats](https://lmn24.atlassian.net/browse/CAR-41)  
**Auteur de la revue :** Murat / Quality Engineer (rôle BMAD, revue documentaire et technique via GitHub/Jira).  
**Objet :** contrôle des corrections de la [première revue](./test-review-story-CAR-41.md) sur l'implémentation réelle et les logs CI.

## Verdict : **PASS TECHNIQUE AVEC RÉSERVES DE RECETTE**

Les **quatre constats de la première revue** (QA-41-01 à QA-41-04) sont **corrigés pour leur périmètre automatisé**. La CI fournit maintenant une preuve d'intégration sur Chromium réel et sur des transactions IndexedDB plus proches du navigateur. La validation **sur appareil utilisateur avec quota réellement saturé**, ainsi que les courses entre deux onglets modifiant simultanément un **état non terminal**, restent hors de cette couverture.

### Exécution CI intégrale vérifiée

**[GitHub Actions #45337868350](https://github.com/JeanLamora75/CardForge/actions/runs/45337868350)** — commit unique de code `d5b9514a83300a6efb9f057f7d534faf75f089df`.

| Étape CI | Résultat réellement vérifié |
| --- | --- |
| Installation des dépendances | PASS |
| **Tests Node, incluant `fake-indexeddb` et vrais moteurs** | **314 tests, 314 PASS, 0 FAIL** |
| Installation Chromium | PASS |
| **Recette Chromium sur un serveur Vite localhost** | **PASS** : deux jeux restaurés à l'identique après fermeture/réouverture d'onglet ; même terminal joué depuis deux onglets → un résultat et un compteur ; sauvegarde incompatible signalée dans l'interface sans effacement |
| Audit Mary strict | PASS : **121/121 CTD**, **35/35 GC**, **21/21 historiques** (traçabilité avec assertion, pas conformité sémantique complète) |
| Build TypeScript/Vite | PASS |
| Vérification PWA | PASS : 8/8 ressources attendues |

**Règle de preuve :** la CI atteste les assertions exécutées et les résultats réellement observés ; la revue Murat repose sur l'examen du code et de ces sorties, sans prétendre qu'un sous-agent indépendant ou un script local `uv` aurait été exécuté.

## Critères Jira après corrections

| Critère | Contre-verdict | Justification |
| --- | --- | --- |
| **AC1** — Deux jeux indépendants, fermeture/reprise, rollback et migration incompatible | **PASS automatisé** | `tests/indexeddb-real-integration.test.mjs` : deux vrais moteurs, deux adaptateurs, reprise, migration déclarée, incompatibilité conservée, `DataCloneError` et `ConstraintError` avec rollback. Chromium valide effectivement la fermeture/réouverture. |
| **AC2** — Terminal concurrent, abandon, score et statistiques une fois | **PASS automatisé** | Concurrence de **deux onglets réels**, résultat et statistiques uniques, plus tests d'abandon et reprise depuis l'IndexedDB de test ; le score de Grim Delve est désormais persisté par `getVictoryScore`. |
| **AC3** — Quota / migration inconnue : conserver, informer, ne pas écraser | **PASS avec réserve environnement** | Les deux plateaux passent par `resumeRegisteredGame`, qui refuse toute migration non déclarée. Les messages FR/EN classent les erreurs de format/corruption/quota et le test de quota confirme le rollback, la cause préservée et le succès d'une reprise ultérieure. **Chromium a vérifié l'affichage réel du message d'incompatibilité et la conservation de l'enregistrement ; pas de saturation physique du quota du navigateur en test.** |

## Revue de chaque constat initial

### QA-41-01 — Résolu

`fake-indexeddb` teste le contrat asynchrone IndexedDB, les contraintes de clé et les abandons de transactions. `scripts/test-indexeddb-browser.mjs` lance le vrai Chromium, ferme un onglet puis réouvre la même origine, récupère deux états de jeu complets identiques, et lit des données réellement persistées en IndexedDB. Le nouveau test d'exception `ConstraintError` annule **les trois collections dans une transaction réelle** de l'environnement de test, contrairement à une simple exception lancée par un simulateur de tableau.

### QA-41-02 — Résolu pour la version actuelle

Les composants `GrimDelveBoard.tsx` et `ThunderfighterBoard.tsx` utilisent désormais `resumeRegisteredGame` → `migrateAndResumeGame`. Le registre par jeu est **explicitement vide** car le format en production est 1 pour les deux ; **aucune migration de règles ni conversion de format future n'est présumée**. Les tests de migration 1→2 constituent un exemple **uniquement de test** et démontrent l'atomicité et la conservation des autres parties. Une migration future réelle exigera un traitement produit et un registre explicitement approuvé.

### QA-41-03 — Résolu avec réserve de saturation matérielle

- `src/application/storage-recovery-messages.ts` classifie les erreurs avec cause racine `QuotaExceededError`, les règles incompatibles, états corrompus, migrations échouées et stockage inaccessible ; les écrans affichent des avertissements différenciés.
- `src/adapters/indexeddb-game-storage.ts` conserve désormais la **cause d'une exception synchrone** lors d'une transaction annulée, ce qui permet le diagnostic du quota.
- `tests/indexeddb-game-storage.test.mjs` provoque le quota simulé au troisième écrit, vérifie **l'ancienne sauvegarde, le résultat et les statistiques inchangés**, puis un nouvel essai réussi.
- En vrai Chromium, une sauvegarde de règles futures provoque le message explicite de non-compatibilité et le test relit et compare le snapshot d'origine **inchangé**.

**Réserve :** ni quota de stockage réellement atteint sur un ordinateur/téléphone, ni coupure forcée du processus de navigateur au milieu du commit n'ont été exécutés.

### QA-41-04 — Résolu pour le résultat terminal

Les deux **véritables moteurs** sont éprouvés avec l'adaptateur IndexedDB ; test de fin de partie, score, idempotence, concurrence et isolement des statistiques. Une **concurrence réelle entre deux onglets** vérifie l'unicité du terminal. `grimDelveEngine.getVictoryScore` expose maintenant le score déjà présent dans l'état de victoire afin de le sauvegarder dans `GameResult.score`. Aucun calcul de règle n'a été changé.

**Réserve distincte :** deux onglets écrivant des **actions non terminales dans la même session** peuvent nécessiter une vérification CAS/gestion de version des instantanés plus poussée ; la présente recette ne prouve que la concurrence terminale exigée par AC2.

## Conclusion et conditions de clôture

**Murat donne un PASS technique pour l'ensemble des critères CAR-41 tels que démontrés en CI.** Les lacunes techniques constatées lors de la première revue ne bloquent plus la livraison d'une campagne de tests d'intégration automatisés.

Pour une **validation fonctionnelle définitive en conditions d'usage**, conserver deux réserves documentées :
1. Essai de saturation réelle de stockage et fermeture forcée sur appareils cibles (notamment Android/Windows) ;
2. Évaluation du risque « dernier écrivain gagnant » lorsque deux onglets modifient une partie **encore en cours**, au-delà de l'idempotence terminale.

Ces réserves sont **transparentes** : elles ne sont pas masquées par le PASS automatisé. Aucun statut Jira n'a été changé sans validation de l'utilisateur. Les livrables d'Amelia sont consignés dans [CAR-41](../../implementation-artifacts/CAR-41.md).

**Confiance de Murat : élevée (98 %) sur l'exécution de la CI, les vérifications et le comportement observé en Chromium ; plus limitée (80 %) sur les scénarios de panne matérielle non reproduits.**
