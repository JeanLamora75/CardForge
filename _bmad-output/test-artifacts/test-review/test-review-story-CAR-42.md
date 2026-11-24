# Murat — Audit QA de CAR-42 : CI Web et recette E2E FR/EN, mobile et hors ligne

**Date :** 24 novembre 2026  
**Story Jira :** [CAR-42 — S35](https://lmn24.atlassian.net/browse/CAR-42)  
**Rôle :** Murat / Quality Engineer (BMAD)  
**Révision inspectée :** `main` à `e5587c8fabc3fcf63aba5599917d7724437c1b5d`  
**Preuve CI examinée :** [GitHub Actions #45337868350](https://github.com/JeanLamora75/CardForge/actions/runs/45337868350) sur le commit de code `d5b9514a83300a6efb9f057f7d534faf75f089df`.

## Verdict : **FAIL — CAR-42 non conforme à ses critères d'acceptation**

La base est solide, mais les preuves automatisées disponibles ne satisfont pas l'ensemble de la recette demandée. Une CI verte **ne démontre pas** un parcours utilisateur multilingue, tactile et hors ligne dans une PWA **construite pour la production**. Ce rapport est un **audit d'existant**, pas une exécution d'une nouvelle campagne E2E.

| Critère Jira | Avis | Constat |
| --- | --- | --- |
| **AC1** : build, métier, intégration, E2E Web, échec bloquant publication | **PARTIEL / FAIL sur le gate de publication** | GitHub Actions exécute réellement `npm test`, la recette Chromium IndexedDB, le contrôle des matrices, `npm run build` et `verify:pwa`. Toutefois, la recette actuelle **n'est pas E2E des parcours visibles des deux plateaux**. Aucun workflow de déploiement/publication de CardForge n'est présent dans `.github/workflows/` ; il n'existe donc **aucune preuve** qu'un échec du workflow empêche effectivement la publication. Le filtrage `paths` ne lance pas la CI pour tout changement documentaire ou référentiel. |
| **AC2** : CTD/GC FR/EN, clavier/tactile, reprise, hors ligne, appareils cibles | **FAIL** | Aucune recette automatisée sur les deux jeux via leurs **éléments interactifs visibles** en FR et EN ; pas de simulation de toucher mobile ni de navigation clavier dans la suite Playwright ; pas de PWA mise en cache puis rechargée **réseau coupé** avec partie poursuivie. Les tests Chromium existants utilisent des imports directs des moteurs et l'IndexedDB depuis `page.evaluate`, et le serveur Vite **dev** sans service worker de production. |
| **AC3** : distinguer Web MVP et Capacitor Android/iOS | **PARTIEL (séparation déclarée)** | Le cadrage et les scripts sont explicitement Web/PWA ; aucun dossier natif Capacitor ni CI Android/iOS vérifié dans le dépôt. Il est donc correct de ne **pas** qualifier le build Web comme une validation mobile native. Cette distinction doit aussi figurer dans un gate / rapport de livraison avec statut « non testé » pour Android/iOS. |

## Preuves positives vérifiées

- [CI #45337868350](https://github.com/JeanLamora75/CardForge/actions/runs/45337868350) : **314 tests Node réussis sur 314**, Chromium installé et recette d'intégration passée, audit des règles Mary 121/121 + 35/35 + 21/21 en traçabilité avec assertion, build TypeScript/Vite et 8 ressources PWA générées vérifiés.
- [`scripts/test-indexeddb-browser.mjs`](https://github.com/JeanLamora75/CardForge/blob/main/scripts/test-indexeddb-browser.mjs) : sur `createServer({configFile:false, ...})` et le **serveur de développement**, tests réels du stockage navigateur : fermeture et réouverture d'onglet, deux jeux, double confirmation terminale depuis deux onglets, un résultat/statistique, message de sauvegarde incompatible réellement visible et enregistrement conservé.
- [`scripts/verify-pwa-build.mjs`](https://github.com/JeanLamora75/CardForge/blob/main/scripts/verify-pwa-build.mjs) : présence réelle des ressources listées dans le cache de production, du manifeste et des icônes. **Ne prouve pas** l'installation du service worker ni sa réponse hors réseau.
- [`src/components/GrimDelveBoard.tsx`](https://github.com/JeanLamora75/CardForge/blob/main/src/components/GrimDelveBoard.tsx) et [`src/components/ThunderfighterBoard.tsx`](https://github.com/JeanLamora75/CardForge/blob/main/src/components/ThunderfighterBoard.tsx) : commandes accessibles sous forme de boutons, prévisualisation / confirmation sur GC, `role=status` et annonces `aria-live` ; **accessibilité pratique non attestée** sur clavier/lecteur d'écran/tactile.
- [`src/i18n/surface.ts`](https://github.com/JeanLamora75/CardForge/blob/main/src/i18n/surface.ts) : traduction de présentation par DOM avec mutation observer ; l'état moteur n'est pas modifié. **Le fait que des traductions existent ne prouve pas un E2E EN complet.**

## Écarts à corriger

### QA-42-01 — P0 / Bloquant : pas de recette PWA de production hors ligne

**Faits :** `test-indexeddb-browser.mjs` démarre Vite en mode développement, sans `vite.config.ts`, donc sans le service worker de build. Les tests de PWA existants contrôlent la **présence des fichiers** et des chaînes de code. Ils ne basculent jamais Playwright en `offline: true`.

**À réaliser par Amelia :** démarrer `vite preview` (ou serveur statique HTTPS/localhost) **après** `npm run build`, attendre l'installation effective et l'état `data-offline-phase="ready"`, ouvrir les deux plateaux et leurs règles FR/EN, couper toute connectivité, fermer/rouvrir l'onglet et contrôler la reprise réelle sans requêtes réseau. Prévoir le test de mise à jour atomique et la sauvegarde conservée lorsque le nouveau précache échoue ; inclure des assertions sur l'ancien cache et les données IndexedDB. La suite doit échouer si l'application affiche « prêt » alors qu'une ressource attendue manque.

### QA-42-02 — P0 / Bloquant : E2E fonctionnel CTD/GC en deux langues non exécuté

**Faits :** dans la recette Chromium existante, les actions des moteurs sont invoquées par `page.evaluate` en important les modules. Seule l'erreur de restauration incompatible est recherchée via `getByText`. Les parcours des interfaces ne sont pas joués en français/anglais.

**À réaliser :** scénarios de vrais clics sur les boutons des deux plateaux : catalogue → fiche → mode « Jouer directement » → démarrage → choix / coup légal → sauvegarde → retour → reprise ; tutoriels et règles ; résultats, statistiques et refus de coups interdits. Parcours en **FR puis EN**, modification de langue pendant une partie et vérification des ID stables, absence de contenu français résiduel majeur, noms publics et crédits. Ne pas remplacer ces tests UI par des appels directs aux moteurs.

### QA-42-03 — P1 / Bloquant AC2 : clavier, tactile et résolution mobile sans preuve

**Faits :** aucun `page.keyboard`, `locator.press`, `tap`, `hasTouch`, émulation de viewport mobile ou vérification explicite de focus / débordement dans le script Playwright actuellement utilisé.

**À réaliser :** Playwright desktop clavier seul (`Tab`, `Enter`, `Space`, retour focus, confirmation et annulation), mobile tactile (`hasTouch:true`, `isMobile:true`, viewport mobile réaliste et `locator.tap()`), contrôles de lisibilité et absence de débordement. Inclure CTD et GC en FR/EN. Appareils physiques Android/iOS restent des **réserves explicites** si non utilisés.

### QA-42-04 — P1 / publication : aucun couplage gate CI → déploiement

**Faits :** [`.github/workflows/cardforge-tests.yml`](https://github.com/JeanLamora75/CardForge/blob/main/.github/workflows/cardforge-tests.yml) exécute les jobs de test mais ne définit aucun job de déploiement ou politique de promotion, et le dépôt ne contient pas d'autre workflow publiant la Web App. Impossible d'affirmer « échec bloque publication » sans preuve de protection ou promotion dépendante de ce job.

**À réaliser :** clarifier la cible de publication, définir la dépendance explicite à la réussite des jobs (par ex. `needs`/environnement protégé et contrôle des vérifications de branche) et démontrer qu'un échec empêche la publication. Si aucune publication n'existe encore, documenter « pas de diffusion automatisée / gate à intégrer avant publication » et garder AC1 non validé.

### QA-42-05 — P2 / preuve de plateforme

**Faits :** le cadrage dit Web responsive/PWA en premier puis Capacitor Android ; les scripts de test, le package et les workflows sont Web. Aucun contrôle natif Android/iOS n'a été observé.

**À réaliser :** un tableau de qualification par plateforme : Web desktop, Web mobile responsive, PWA installée / hors ligne, Android Capacitor, iOS Capacitor avec **PASS / FAIL / NON TESTÉ** et URL des runs. Un PASS Web ne doit pas servir de preuve d'installation sur Android/iOS natifs.

## Proposition de stratégie de tests pour CAR-42

1. **Lot A / P0 :** suite UI Playwright sur build **production** ; FR/EN et les deux plateaux ; jeu normal, reprise, actions légales et illégales, résultat, règles et statistiques.
2. **Lot B / P0 :** installation SW, état « prêt », arrêt réseau, fermeture/reprise des deux plateaux, cache versionné et conservation des sauvegardes lors des mises à jour.
3. **Lot C / P1 :** clavier desktop et tactile en émulation mobile, focus, libellés, absence de débordement, captures / traces de diagnostics en cas d'échec.
4. **Lot D / P1 :** intégration dans la CI **après le build**, gate de publication démontré ; conserver la suite IndexedDB existante avant build pour les tests applicatifs rapides.
5. **Lot E / P2 :** qualification explicite Web vs Android/iOS Capacitor et campagne sur appareils cibles, sans déduire une certification native du navigateur Chromium Linux.

## Décision Murat

**CAR-42 : QA FAIL, non clôturable**, principalement faute de preuves E2E de la PWA **construite pour la production**, jouée en FR/EN, hors ligne, au clavier et au tactile, ainsi que faute de gate de publication attesté.

**Action recommandée :** confier les correctifs et la campagne E2E à Amelia ; demander ensuite à Murat une contre-revue sur la **CI complète d'un même commit**. Ne pas modifier les règles métier des jeux pour satisfaire les tests et ne pas prétendre à une validation Android/iOS Capacitor.

**Confiance : élevée (98 %) sur l'inventaire du code / des workflows et la preuve CI citée ; moyenne (85 %) sur la liste exhaustive des problèmes de parcours UI**, car ils ne sont pas encore testés.

**Adaptations BMAD :** skill Murat et références des workflows TEA lus ; le workflow TEA complet réclame des prérequis de configuration/modules spécifiques, donc cette revue est exécutée selon le protocole QA CardForge et des critères Jira, sans revendiquer une exécution intégrale de TEA ni de scripts `uv`. Aucune recherche web publique, aucun test navigateur supplémentaire et aucune modification du code produit pendant cet audit.
