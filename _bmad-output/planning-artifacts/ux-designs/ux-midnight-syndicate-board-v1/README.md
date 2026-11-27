# Midnight Syndicate — Plateau V1

70 PNG maîtres, six lots. Extraire à la racine de CardForge (pas dans un sous-dossier supplémentaire). Conserver tous les fichiers historiques. Aucun WebP livré : ils sont générés par le script existant.

## Intégration Amelia
1. Vérifier à nouveau les collisions avant copie. Les dix sous-dossiers cibles du slug ont retourné 404 lors de la consultation GitHub ; les chemins historiques plats sont distincts. Aucun écrasement autorisé sans validation.
2. Fusionner les 70 entrées du fichier `assets-manifest-fragment.json` dans `_bmad-output/planning-artifacts/ux-designs/ux-CardForge-2026-11-24/assets-manifest.json` (80 entrées observées), sans remplacer les entrées existantes ni ajouter le fond Grim Delve injecté par le script.
3. Exécuter `npm run assets:optimize` ; référencer les WebP sous `public/art` via les URL compatibles avec la base Vite. Vérifier le précache.
4. Utiliser `boards/midnight-syndicate/portrait.png` et `landscape.png` comme fonds maîtres. Les cadres sont intégrés : adapter les zones aux proportions, tester les petits écrans. Le parcours seul défile, pas la page. Les compteurs, libellés, valeurs, actions légales et états restent dynamiques FR/EN. Les icônes déjà encadrées ne nécessitent pas de bouton graphique supplémentaire. Les cartes cachées utilisent exclusivement le dos commun, sans indice de rang ou famille. Le cadre route-location-window accueille une illustration séparée. Distinguer position et destination aussi par forme et libellé.
5. Exécuter `npm run build`, `npm run test`, `npm run verify:pwa`, `npm run test:e2e:production` et vérifier la CI. Tester portrait/paysage, clavier/tactile, reprise et hors ligne. Aucun uv.

## Limites
Les 53 illustrations individuelles et les écrans de fin ne sont pas inclus. Les fichiers sont contrôlés, pas le rendu dans l’application. Aucun code ou fichier GitHub modifié. Les lots 1 et 2 utilisent les PNG originaux, sans rééchantillonnage. Les fonds ont une résolution native de 941 × 1672 et 1672 × 941. Les noms fonctionnels des lots 1 et 2 ont été normalisés. Les états des boutons sont à gérer en CSS. Les anciens fonds et maquettes ne sont pas inclus.
