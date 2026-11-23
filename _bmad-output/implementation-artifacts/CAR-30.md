# CAR-30 — Fiches et navigation contextualisée sans abandon

**Agent :** Amelia — Senior Software Engineer (BMAD)  
**Date :** 23 novembre 2026 · **Story :** CAR-30 / S23  
**Statut technique :** code publié sur `main`, dernière CI native **226/226 tests réussis** et build TypeScript/Web réussi. Qualification UI réelle encore nécessaire.

## Références

- [Jira CAR-30](https://lmn24.atlassian.net/browse/CAR-30)
- [CAR-29 — catalogue et disponibilité honnête](CAR-29.md)
- [Cadrage produit — catalogue, navigation contextuelle, statistiques et reprises](../../docs/cadrage.md)
- [CI GitHub Actions #45258540895](https://github.com/JeanLamora75/CardForge/actions/runs/45258540895) au commit `9e3d5bbf81f473b32a822bf803261f1c29b3b2f6`

## Livrables

- **`src/application/catalog-navigation.ts`** : lecture strictement non mutatrice de `readGame`, `readResult`, `readStatistics` via le port `LocalGameStorage`. Statut `active` seulement si une sauvegarde existe pour le bon `gameId` et n'a pas de résultat terminal correspondant au même `sessionId`; `finished` si son résultat terminal existe ; `none` sinon. Métadonnées contradictoires et erreurs de lecture remontent sans créer, remplacer ni abandonner de partie.
- Calcul `victoryRate` = victoires / (victoires + défaites) ; `—` si aucune partie terminée normalement ; les abandons sont montrés séparément.
- `availableGameActions` n'autorise `play/newGame` que pour un jeu déclaré `available` avec route applicative locale non externe, et `resume` uniquement avec sauvegarde `active`. **Aucun jeu n'est actuellement `available`**, conformément à CAR-29 ; aucun Jouer, Reprendre ou Nouvelle partie n'est exposé en tant qu'action opérationnelle.
- **`src/App.tsx`** : catalogue et fiche de chacun des cinq jeux, indicateur discret de partie sauvegardée en cours, onglets contextuels **Présentation**, **Règles**, **Statistiques** et **Crédits**. Les statistiques locales réelles sont lues et affichées sans écriture. Les règles ne sont à ce stade qu'un **aperçu fidèle** du jeu source : ne pas les présenter comme un manuel complet. Tutoriel interactif annoncé « en préparation » sans fausse action. Un échec de lecture IndexedDB donne un message explicite sans effacement ni suppression.
- Navigation **Retour au catalogue**, accès par bouton **Découvrir**, retour au focus d'origine, support **Échap**, commandes sémantiques compatibles clavier/tactile. Pas de barre permanente au-dessus d'un futur plateau, pas de commande `dispatch`, `confirmNewGame`, `replaceGame`, `commitTerminal` déclenchée par la navigation.
- **`src/styles.css`** : barre d'onglets locale à la fiche, focus visible, cibles tactiles 44px, états actifs textuels, repère de session conservant sa lisibilité sur mobile.

## Critères Jira

| AC | Résultat |
| --- | --- |
| 1. Fiche jouable avec Jouer/Reprendre/Nouvelle partie/Règles/Statistiques/tutoriel | **Partiellement couvert et volontairement verrouillé** : fiches, règles en aperçu et statistiques consultables ; garde calculée pour les futures parties et la reprise. Aucune interface de jeu/tutoriel ni démarrage opérationnel à ce stade : les actions Jouer/Reprendre/Nouvelle partie ne sont pas affichées tant qu'aucune route vérifiée n'existe |
| 2. Retour catalogue/règles/statistiques/paramètres sans abandon ni changement de statistiques | **Couvert sur les parcours livrés** : seules les lectures sont utilisées pour catalogue, règles et statistiques ; aucun `replaceGame` ni comptabilisation d'abandon. Les paramètres globaux ne sont pas encore une vue interactive livrée |
| 3. Tactile/clavier sans barre permanente, partie active visible | **Implémenté au niveau de l'UI** : onglets/boutons et focus visible ; présence d'une session active affichée à partir du stockage local ; recette manuelle de clavier/tactile non exécutée |
| 4. Noms, univers et crédits des cinq jeux | **Couvert** par le référentiel stable CAR-29 conservé ; noms de règles sources consultables dans les Crédits |

## Preuves exécutées

- **9 nouveaux tests** dans `tests/catalog-navigation.test.mjs` : absence de sauvegarde, sauvegarde active, partie terminée, métadonnées contradictoires, refus d'écriture, erreur de stockage, indisponibilité des cinq jeux, garde de route, statistiques excluant les abandons du dénominateur.
- **CI native GitHub Actions [#45258540895](https://github.com/JeanLamora75/CardForge/actions/runs/45258540895)**, commit `9e3d5bbf81f473b32a822bf803261f1c29b3b2f6` : **216 tests, 216 pass, 0 fail**, `Unit tests` et `TypeScript and Web build` réussis. Le commit comprend les changements de code, style et tests.
- Les précédentes étapes de CI avant les tests étaient aussi vertes ; aucune suite spécifique Playwright/Chromium avec capture, aucun test lecteur d'écran et aucun test IndexedDB en navigateur réel n'ont été effectués.
- Aucun script BMAD `uv` exécuté ; adaptation aux connecteurs GitHub/Jira et vérification par GitHub Actions.

## Réserves / suites

1. **Pas d'action de jeu réelle** : les moteurs de Grim Delve et Thunderfighter existent mais leurs plateaux UI, le flux Nouveau/Reprendre, et le tutoriel interactif ne sont pas encore reliés. La future activation doit connecter les services existants `startPersistentGame`, `resumePersistentGame`, `getNewGameChoice`, `confirmNewGame` avec confirmation explicite de remplacement, et qualifier les jeux avant de les marquer disponibles.
2. **Statistiques réelles consultables** : la vue lit IndexedDB mais n'a pas été testée dans un navigateur réel ni sous lecteur d'écran. Aucune sauvegarde n'est créée en naviguant.
3. **Paramètres globaux** et **règles détaillées localisées** restent à développer ; le catalogue ne prétend pas leur présence.
4. Les décisions fonctionnelles sur les noms et univers de Grim Delve, Thunderfighter, Skydeck, Midnight Syndicate et Les Douze Tyrans sont conservées sans modifier `gameId` ou les données physiques.

## Complément de livraison et preuve finale CAR-30

La version initiale de ce rapport décrivait un premier lot de navigation sur le commit `9e3d5bbf81f473b32a822bf803261f1c29b3b2f6`. Un second lot de fiabilisation a été publié sur `main` :

- **`src/application/catalog-route.ts`** : itinéraires URL profonds `#game/:gameId`, `/rules`, `/statistics`, `#settings`, retour vers fiche ou catalogue ; restauration du contexte d'origine après ouverture des paramètres ; rejets des chemins inconnus.
- **`src/App.tsx`** : les cinq fiches, règles (aperçu et lien au référentiel BMAD), statistiques locales, crédits séparés, informations paramètres et retours navigation/Échap/focus. Un retour ne modifie ni sauvegarde, ni statistiques.
- **`src/application/catalog-navigation.ts`** : vérification supplémentaire de l'`outcome` du snapshot pour empêcher qu'une partie déjà gagnée/perdue, mais sans résultat terminal enregistré, soit présentée comme une reprise possible ; les snapshots sans `outcome` reconnu sont signalés comme incohérents et non modifiés.
- **`tests/catalog-route.test.mjs`** : 10 scénarios sur les itinéraires, le retour paramètres, les sauvegardes, les compteurs et les faux boutons de jeu. Les fixtures de `tests/catalog-navigation.test.mjs` ont été réalignées sur de vrais états de moteur porteurs de `outcome`, sans affaiblir cette validation.
- **Dernière CI native vérifiée : [#45259268422](https://github.com/JeanLamora75/CardForge/actions/runs/45259268422)**, commit `8ee214bafd8c0586b1e25c1864b1b3fb18678897` : **226 tests, 226 réussis, zéro échec, build TypeScript/Web réussi**, statut `completed/success` d'après les jobs et journaux GitHub Actions.
- Deux CI intermédiaires ont échoué sur les fixtures sans `outcome` du premier lot. Elles ont été corrigées, puis la suite entière a été relancée avec succès.
- **Limite maintenue :** aucune fiche n'est encore jouable ; Jouer/Reprendre/Nouvelle partie/tutoriel ne sont pas activés et nécessitent l'UI de plateau et sa qualification. Les règles intégrées restent un aperçu. Les tests E2E navigateur/lecteur d'écran et la recette IndexedDB multi-onglets restent non attestés. **AC1 est donc partiel**, pas validé de bout en bout.
