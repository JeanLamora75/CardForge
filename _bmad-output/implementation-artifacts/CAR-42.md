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
| Web desktop Chromium Linux (runner CI) | E2E clavier + FR/EN | En attente de vérification de la dernière CI |
| Web mobile simulé Chromium Linux, 390 × 844 | Touch events Playwright + FR/EN | En attente de vérification de la dernière CI |
| PWA de production sur localhost sécurisé | SW installé, ressources contrôlées, fermeture/relance offline | En attente de vérification de la dernière CI |
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

Preuves à enregistrer après une exécution complète sur **un même commit**, y compris le nouveau E2E et le gate qualité. Revue QA Murat distincte requise.
