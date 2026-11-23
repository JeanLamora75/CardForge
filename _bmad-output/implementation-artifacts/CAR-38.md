# CAR-38 — PWA installable et ressources de Grim Delve et Thunderfighter hors ligne

**Amelia · 23 novembre 2026** · [Jira CAR-38](https://lmn24.atlassian.net/browse/CAR-38)

## Périmètre livré

La PWA de CardForge est produite au **build Vite** et installable via les commandes natives des navigateurs compatibles, sur origine sécurisée HTTPS ou localhost.

- `public/manifest.webmanifest` : identité CardForge, nom court, ouverture en application autonome, `start_url` et `scope` relatifs, icônes originales PNG 192×192 et 512×512 et SVG.
- `index.html` : manifeste, icône et métadonnées pour l’installation.
- `vite.config.ts` et `src/pwa/service-worker-build.ts` : génération d’un service worker propre au build réel, avec version fondée sur les fichiers JS/CSS émis ; cache `cardforge-app-<version>` et liste explicite de toutes les ressources locales. `base: "./"` permet les déploiements en sous-répertoire.
- `src/components/OfflineReadiness.tsx` : registration dans le build de production uniquement, vérification par MessageChannel auprès du worker et indicateurs accessibles FR/EN (préparation, installation réalisée mais rechargement nécessaire, prêt, indisponible).
- `src/application/offline-readiness.ts` : un état « prêt » n'est admis que si le worker contrôle effectivement la page et a confirmé **toutes** les ressources de la version.
- `src/App.tsx` : état hors ligne affiché au-dessus du contenu, pour le catalogue et les deux plateaux.
- `src/vite-env.d.ts` : contrat de typage de l’environnement Vite.

## AC1 — Ressources requises et absence de CDN

La liste générée lors du build comprend la page d’entrée, le manifeste, les icônes, chaque chunk JavaScript, CSS et ressource statique Vite. Dans l’état actuel du dépôt les **deux moteurs de jeu, leurs règles FR/EN et leurs textes** sont compilés dans le bundle JavaScript : il n’y a pas de chargement distant exigé pour la logique des jeux. Les sons sont produits localement par Web Audio, sans dépendance à un média distant. Les liens GitHub vers les règles sources sont facultatifs et ne sont pas requis pour jouer.

Le service worker crée un nouveau cache temporaire et n'achève son installation que lorsque **toutes** les requêtes requises ont réussi et que leurs réponses sont retrouvables. Une installation incomplète entraîne la suppression du nouveau cache et n’est pas annoncée comme prête.

## AC2 — Indication fiable après préparation complète

L'indicateur d'état interroge le service worker par MessageChannel. L'application n'annonce « **Grim Delve et Thunderfighter prêts hors ligne** » que lorsque **toutes les ressources** sont vérifiées en cache et lorsque la page est contrôlée par le worker. Si les ressources sont installées mais que la première page n'est pas encore contrôlée, l'indicateur propose de recharger. Sans HTTPS / localhost, ou en mode développement, aucune préparation hors ligne n'est revendiquée.

**Limite de preuve :** les tests automatisés ci-dessous ne constituent pas une session de jeu et un redémarrage hors connexion réalisés sur navigateur physique. Cette recette E2E appartient également à CAR-42 ; elle demeure obligatoire avant validation fonctionnelle définitive.

## AC3 — Mise à jour non destructive

Le service worker ne touche qu'aux caches préfixés `cardforge-app-`. Au moment d'activer la nouvelle version, il vérifie son propre cache complet, prend le contrôle de la page, puis efface uniquement les anciennes versions du **cache applicatif**. Il n'invoque jamais `indexedDB.deleteDatabase`, ni ne supprime les sessions, résultats, statistiques ou préférences localStorage. Le code des moteurs conserve la gestion transactionnelle existante, indépendante de la PWA.

## Preuves exécutées

- `tests/pwa.test.mjs` : stabilité et changement des versions à modification du bundle, précache complet, rejet des URL externes, affichage « prêt » refusé si manque un actif ou si page non contrôlée, vérification de l’absence de suppression de base de données dans le script généré.
- `scripts/verify-pwa-build.mjs` : vérifie le **résultat réel du build** : `dist/sw.js`, manifeste, icônes PNG, JavaScript, CSS et chacun des fichiers énumérés dans le précache.
- `.github/workflows/cardforge-tests.yml` : test, build TypeScript/Vite, puis vérification PWA ; déclenchement également sur modifications `public/**`, `index.html` et `vite.config.ts`.
- CI verte : [GitHub Actions #45272065655](https://github.com/JeanLamora75/CardForge/actions/runs/45272065655) — **265 tests réussis, 0 échec**, build TypeScript/Vite et vérification de **8 ressources de cache** au commit `e834836d2f51d5ace67ce507c9576bcc4d349c18` (inclut les chemins relatifs).

## Recette manuelle encore attendue

1. Publier le contenu de `dist/` sur une origine HTTPS et installer la PWA ; vérifier les icônes et le démarrage autonome (Chrome/Edge/Android au minimum).
2. Attendre « prêt hors ligne », débrancher le réseau, fermer et rouvrir l’application puis démarrer/reprendre une partie des **deux** jeux, consulter règles FR/EN, sons locaux et résultats.
3. Installer une nouvelle version, vérifier le basculement du cache sans perte des sauvegardes et statistiques IndexedDB, y compris en cas d’échec de téléchargement.
4. Vérifier l’état « préparation » si une ressource manque, le refus de marquer « prêt », et le comportement multi-onglets.

**Adaptation BMAD :** scripts `uv` non exécutables sur GitHub ; développement, tests et revue de CI via les connecteurs et GitHub Actions. Aucune vérification navigateur réel n'est revendiquée.
