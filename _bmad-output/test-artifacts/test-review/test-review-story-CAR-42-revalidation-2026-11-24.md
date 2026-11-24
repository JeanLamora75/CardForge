# Murat — Contre-revue QA CAR-42 après correctifs Amelia

**Date :** 24 novembre 2026  
**Story :** [CAR-42 — CI Web et recette E2E FR/EN, mobile et hors ligne](https://lmn24.atlassian.net/browse/CAR-42)  
**Rôle :** Murat / Quality Engineer, revue technique des correctifs et preuves exécutées ; aucun script `uv` ni agent QA autonome exécuté  
**Code vérifié :** `42bed08dfd0c214b69d49d3bcd6bafc5d6b95560` sur `main`  
**Run unique de validation :** [GitHub Actions #45341981900](https://github.com/JeanLamora75/CardForge/actions/runs/45341981900)  
**Contexte :** [rapport initial en échec](./test-review-story-CAR-42.md) et [documentation Amelia](../../implementation-artifacts/CAR-42.md).

## Verdict : **PASS TECHNIQUE E2E Web/PWA avec RÉSERVE publication**

Les lacunes P0/P1 de couverture E2E sur la **PWA de production** sont résolues et **exécutées avec succès en Chromium**, sur les quatre combinaisons requises. L'exécution a également mis en évidence puis corrigé un vrai défaut de restitution des ressources statiques depuis CacheStorage hors connexion.

**Mais CAR-42 ne peut pas être déclarée totalement « release-cleared » : aucun flux de publication effectif, hébergeur ni protection de branche/environnement de publication n'est configuré, et les cibles mobiles physiques/natives ne sont pas qualifiées.** Le gate qualité CI est opérationnel ; il ne constitue pas un gate de déploiement opérationnel. Les droits avant diffusion restent sous CAR-43.

## Preuves CI sur le même commit

| Contrôle | Évidence vérifiée |
| --- | --- |
| Tests unitaires et intégration IndexedDB | **314/314 PASS, 0 FAIL** |
| Recette Chromium de CAR-41 | **PASS** : restauration, deux onglets concurrents, un seul résultat/statistique, avertissement d'incompatibilité sans perte |
| Audit des matrices Mary | **121/121 CTD + 35/35 GC + 21/21 historiques** reliés aux tests avec assertions ; pas une certification automatique de chaque oracle |
| Build TypeScript/Vite | **PASS** |
| Vérification du bundle PWA | **PASS**, 8 ressources cachées attendues |
| **E2E Web de production** | **PASS** : `fr/keyboard`, `fr/touch`, `en/keyboard`, `en/touch` ; **chaque parcours exerce Grim Delve ET Thunderfighter** et la reprise hors réseau |
| `web-quality-gate` dépendant de `web` | **PASS** |

**Preuve négative du gate :** le run [#45341795564](https://github.com/JeanLamora75/CardForge/actions/runs/45341795564) avait `web = failure` et `Web MVP quality gate (no publication) = skipped`. Le run vert #45341981900 présente `web = success` et `web-quality-gate = success`. Ce constat prouve le **blocage du gate qualité**, pas d'une publication encore inexistante.

## Revue par critère Jira

| Critère | Verdict Murat | Réserves |
| --- | --- | --- |
| **AC1 — Build, métier, intégration, E2E, blocage publication** | **PASS CI ; CONCERNS publication** | Les étapes sont ordonnées et le gate qualité exige `needs: [web]` ; aucun job de publication, aucune configuration d'environnement protégé ni destination distante ne permet d'attester un vrai déploiement bloqué. Une publication future devra impérativement dépendre de ce gate et de CAR-43. |
| **AC2 — CTD/GC FR/EN, clavier/tactile, reprise, offline** | **PASS automatisé sur Web Chromium** | Quatre contextes, interactions utilisateur visibles et persistées, déconnexion et **nouvel onglet offline** pour les deux jeux. Le tactile est **émulé** (Playwright `hasTouch`, `isMobile`), pas mesuré sur téléphone physique. Tests d'une action de chaque jeu, pas d'un parcours complet de partie jusqu'à chaque résultat terminal via UI. |
| **AC3 — Séparation Web vs Capacitor** | **PASS documentaire et technique** | Aucune cible Capacitor native n'est compilée ou déclarée PASS. Android/iOS restent **NON DÉVELOPPÉS / NON TESTÉS**. |

## Correctifs confirmés sur les cinq écarts initiaux

### QA-42-01 — PWA réelle hors ligne : **résolu pour Chromium**

La recette `scripts/test-production-e2e.mjs` lance `vite preview` après le build, contrôle un service worker qui a effectivement précaché les huit ressources, ferme l'onglet, passe `context.setOffline(true)`, recrée un onglet puis vérifie les sauvegardes et les règles des **deux jeux** sans connexion.

**Défaut réel découvert :** CacheStorage contenait bien les fichiers `assets/index-*.js` et CSS, mais leur chargement produisait `net::ERR_FAILED` hors réseau, laissant une page HTML vide. `src/pwa/service-worker-build.ts` utilise désormais la correspondance d'**URL statique exacte** dans le cache actif avec `ignoreVary: true` ; `OfflineReadiness.tsx` interroge d'abord le contrôleur existant en relance hors réseau. La CI a **rejoué et réussi** la reprise après ce correctif.

**Réserve non bloquante pour la recette automatisée :** changement de version du cache avec téléchargement incomplet, installation native PWA sur Android/Windows et origine HTTPS distante ne sont pas attestés par cette CI ; ces essais resteront nécessaires avant publication réelle.

### QA-42-02 — Parcours UI FR/EN : **résolu pour les parcours essentiels**

Les deux langues sont effectivement vérifiées dans le DOM (`html.lang`, titre du catalogue, règles, état réseau). Le joueur navigue dans le catalogue, ouvre chaque fiche, choisit la partie normale, crée une partie et effectue une action dans les vrais plateaux React. Le test lit les snapshots IndexedDB **uniquement pour les assertions**, sans appeler les moteurs pour jouer. La sauvegarde change et se retrouve **identique** après fermeture et reprise hors connexion. Pour Grim Delve, annuler puis accepter la confirmation de défausse sont testés ; pour Thunderfighter, l'aperçu, l'annulation et la confirmation d'une action sont testés sans écritures intempestives.

**Limite :** le résultat terminal d'une partie entière n'est pas reproduit depuis la seule UI dans cette suite ; la persistance des résultats terminaux est déjà testée en intégration CAR-41.

### QA-42-03 — Clavier/tactile et mobile : **résolu en émulation Chromium**

Les parcours desktop utilisent **Tab, Enter et Space** pour naviguer et activer les vrais contrôles ; le helper attend qu'ils soient activés, y compris après reprise IndexedDB asynchrone. Les parcours mobiles utilisent `locator.tap()` avec viewport **390 × 844** et `hasTouch: true`. La suite vérifie l'absence de débordement horizontal sur les écrans de règles observés. **L'accessibilité WCAG exhaustive et les tests sur matériel physique ne sont pas revendiqués.**

### QA-42-04 — Gate CI/publication : **gate qualité résolu, publication non configurée**

Le workflow `.github/workflows/cardforge-tests.yml` exécute d'abord les tests et la recette du build réel, et le job `Web MVP quality gate (no publication)` dépend explicitement de `web`. Exécution rouge → gate sauté ; exécution verte → gate réussi.

**Aucune action de publication n'est définie** : ne pas prétendre que la mise en ligne est réellement protégée ou réalisée. Raccorder un futur job de déploiement au gate et protéger l'environnement une fois la cible connue et les droits CAR-43 validés ; ne pas publier prématurément.

### QA-42-05 — Web / Android / iOS : **résolu comme séparation de qualification**

| Cible | Statut |
| --- | --- |
| Web Chromium Linux desktop FR/EN | **PASS automatisé** |
| Web Chromium Linux mobile tactile émulé FR/EN | **PASS automatisé** |
| PWA de production localhost contrôlée puis offline | **PASS automatisé** |
| Installation PWA sur appareils physiques Windows/Android | **NON TESTÉE** |
| Capacitor Android natif | **NON DÉVELOPPÉ / NON TESTÉ** |
| Capacitor iOS natif | **NON DÉVELOPPÉ / NON TESTÉ** |

## Décision et suivi

**Murat valide techniquement la livraison des tests E2E de production sur Web/PWA et les corrections révélées, avec CI intégralement verte sur un même commit.** Aucun faux PASS Android/iOS n'a été déclaré.

**Réserve avant acceptation de publication de CAR-42 :** relier un dispositif effectif de déploiement à ce gate une fois les droits de CAR-43 vérifiés ; exécuter les essais ciblés sur appareils physiques et, idéalement, sur mise à jour PWA avec cache partiellement inaccessible. **CAR-42 peut être considérée prête pour la recette QA Web automatisée, pas pour une diffusion publique juridiquement et opérationnellement validée.**

Aucun changement de statut Jira sans autorisation. Aucune recherche web publique ni script `uv`. La validation est fondée sur la revue des fichiers via GitHub et les logs d'une **vraie exécution GitHub Actions**, et non sur une affirmation d'exécution locale.

**Confiance : 99 % pour la CI, les quatre parcours Chromium et la reprise hors réseau exécutés ; 85 % sur l'aptitude à une sortie publique (appareils physiques, réseau distant, droits et promotion non testés).**
