# CAR-42 — Recette E2E Web/PWA et gate qualité

**Story :** [CAR-42](https://lmn24.atlassian.net/browse/CAR-42) · **Implémentation :** Amelia · **Date :** 24 novembre 2026

## Périmètre implémenté

- `scripts/test-production-e2e.mjs` : démarre **`vite preview` sur le dossier `dist/` déjà construit** (pas le serveur Vite de développement), lance Chromium via Playwright, vérifie les assets pré-cachés avec `MessageChannel` et l'état visible `ready` contrôlé par un service worker.
- **Matrice FR/EN × desktop clavier / mobile tactile émulé** : quatre contextes isolés, locale et sélection UI cohérentes, les deux titres publics, navigation depuis le catalogue vers les fiches et les deux plateaux, choix « jouer directement », création d'une partie, sélection d'une action légale via commande visuelle, preuve IndexedDB que le coup a été sauvegardé. Thunderfighter vérifie de plus que l'aperçu et l'annulation ne modifient pas la sauvegarde ; un coup confirmé la modifie réellement.
- **Redémarrage hors ligne** : après sauvegarde des deux jeux, fermer l'onglet, passer `browserContext.setOffline(true)`, ouvrir un **nouvel onglet à la même origine** et relire l'état exact des deux jeux depuis l'IndexedDB natif, vérifier la traduction et les règles accessibles hors réseau ; le composant PWA doit afficher « hors connexion / offline ». Le cache service worker doit être complet.
- **Clavier** : Tab pour atteindre un élément interactif, activation Enter et Space des commandes. **Tactile** : `locator.tap()` dans des contextes avec `hasTouch:true`, `isMobile:true` et viewport 390 × 844 ; contrôle de débordement horizontal.
- `.github/workflows/cardforge-tests.yml` : tests Node, Chromium IndexedDB, audit des matrices, build TypeScript/Vite, `verify:pwa`, **E2E de production en dernière étape de `web`**, puis job `web-quality-gate` qui a explicitement `needs: [web]`. Le gate est sauté si le job Web échoue.
- `package.json` : `npm run test:e2e:production` pour la recette du build.
- **Aucune publication automatique** n'est configurée : le gate est une **condition préalable de qualité pour tout mécanisme de publication futur**, pas une preuve de déploiement. La publication réelle doit encore être conçue, protégée par les droits CAR-43 et reliée au gate.

## Qualification par plateforme

| Cible | Type de preuve | État |
| --- | --- | --- |
| Web desktop Chromium Linux (runner CI) | E2E clavier + FR/EN | **PASS — CI #45341981900** |
| Web mobile simulé Chromium Linux, 390 × 844 | Touch events Playwright + FR/EN | **PASS — CI #45341981900** |
| PWA de production sur localhost sécurisé | SW installé, ressources contrôlées, fermeture/relance offline | **PASS — CI #45341981900** |
| Chrome/Edge sur Windows 11 physique | Appareil réel | **NON TESTÉ** |
| Chrome sur Android physique | Appareil réel / installation de PWA | **NON TESTÉ** |
| Capacitor Android natif | Projet natif et batterie native | **NON DÉVELOPPÉ / NON TESTÉ** |
| Capacitor iOS natif | Projet natif et batterie native | **NON DÉVELOPPÉ / NON TESTÉ** |

La validation Web ne doit **jamais** être affichée comme une validation Android/iOS Capacitor. Les interactions tactiles simulées ne certifient pas la PWA installée sur un appareil physique.

## Limites, transparence et suivi

- Les parcours sont des **tests utilisateur réels** via clics et taps sur les composants React ; la lecture directe de l'IndexedDB n'est utilisée que comme assertion de conservation, et non pour jouer les actions.
- Le SW n'est pas testé contre un déploiement distant HTTPS, les conditions de réseau ou disque propres à Android/Windows, ni une évolution de version du cache avec échec partiel : recette complémentaire CAR-38/CAR-42 à conduire avant publication.
- L'accessibilité visuelle/lecteur d'écran et la compatibilité Safari/iOS ne sont pas certifiées par Chromium ; le contrôle clavier ne constitue pas un audit WCAG complet.
- Le gate qualité ne prouve **pas** qu'une destination de publication inexistante serait protégée. Aucun droit de diffusion des œuvres source n'est présumé ; CAR-43 doit être validée avant mise en ligne.
- Les scripts `uv` sont indisponibles sur GitHub et n'ont pas été exécutés.

## CI

**CI complète verte vérifiée : [GitHub Actions #45341981900](https://github.com/JeanLamora75/CardForge/actions/runs/45341981900), commit de code `42bed08dfd0c214b69d49d3bcd6bafc5d6b95560`.**

- **314 tests Node réussis sur 314**, aucun échec ;
- **CAR-41 Chromium** : restauration, concurrence de deux onglets et sauvegarde incompatible confirmées ;
- **CAR-42 production** : quatre parcours E2E exécutés et réussis, logs explicites `fr/keyboard`, `fr/touch`, `en/keyboard`, `en/touch`, chacun comprenant les deux vrais plateaux, le jeu normal, la modification de sauvegarde par action UI, l'annulation non destructive, la reprise hors connexion après fermeture d'onglet, le service worker actif et les règles localisées ;
- **Audit strict Mary** : 121/121 CTD-T, 35/35 GC-T, 21/21 références historiques reliées à des tests avec assertions ;
- **Build TypeScript/Vite et précache** : succès, 8 ressources PWA vérifiées ;
- **Job `Web MVP quality gate (no publication)` : PASS** car il dépend de la réussite du job `web`.

**Preuve du blocage du gate qualité :** lors du run rouge [#45341795564](https://github.com/JeanLamora75/CardForge/actions/runs/45341795564), le job `web` a échoué sur le E2E hors ligne et `Web MVP quality gate` a été explicitement **SKIPPED**. Lors du run vert #45341981900 les **deux jobs** ont réussi. Cette preuve confirme la dépendance des jobs CI, mais **aucune publication effective n'est configurée** : ne pas affirmer qu'une plateforme de déploiement en production est aujourd'hui protégée.

**Correctif produit révélé par CAR-42 :** les `assets/index*.js` et CSS existaient dans CacheStorage mais les requêtes hors ligne échouaient (`net::ERR_FAILED`). `src/pwa/service-worker-build.ts` sert maintenant les ressources statiques versionnées par correspondance d'URL exacte avec `ignoreVary: true`. `OfflineReadiness` interroge d'abord le contrôleur existant avant tentative de réenregistrement pendant une relance sans réseau. Les scénarios Chromium attestent ensuite l'affichage de tous les contenus et la reprise des deux parties hors connexion.

**Revue QA Murat** : à consigner séparément, avec réserves sur les appareils physiques et le mécanisme de publication encore inexistant.
