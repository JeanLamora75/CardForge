# Revue de cohérence manuelle — architecture CardForge

**Date :** 22 novembre 2026  
**Nature :** revue documentaire manuelle, **pas** exécution du reviewer gate automatisé BMAD.

## Contrôles effectués

- Les douze décisions de l'échange AD-01 à AD-12 sont présentes, avec identifiants stables.
- Chaque AD comporte `Binds`, `Prevents` et `Rule` ; la direction des dépendances est explicitée.
- Le modèle actuel `src/core/cards.ts` et la pile React/TypeScript/Vite sont respectés ; les répertoires proposés sont des créations futures.
- Séparation des responsabilités : React transmet les intentions, application sérialise/orchestre, moteur pur calcule, port de persistance assure l'accès aux données.
- Les résultats sont enregistrés de manière idempotente ; la sauvegarde doit confirmer avant d'être déclarée durable.
- Les contraintes Web + Android + iOS et l'absence d'IDE local sont explicitement prises en compte.
- Aucun système serveur n'est introduit pour le MVP solo hors ligne.
- Les règles, droits, compatibilité IndexedDB en WebView, versions Capacitor et signature iOS ne sont **pas** présentés comme acquis.

## Vérifications non exécutées

- Aucun `uv`, `lint_spine.py`, sous-agent indépendant, `npm test`, `npm run build` ou build mobile n'a été exécuté.
- Aucune recherche Web de versions courantes ni validation iOS/Android sur appareil ; ces travaux requièrent validation ultérieure.
- Aucune validation du moteur Clear the Dungeon ni de la matrice métier n'a été réalisée.

## Risques majeurs encore ouverts

1. Portabilité et durabilité d'IndexedDB dans les WebViews natives.
2. Compatibilité de versions de Capacitor, outils CI, runners macOS et signature iOS.
3. Cohérence transactionnelle entre états, compteurs et migrations.
4. Ambiguïtés de règles du jeu, à résoudre via la source officielle.
5. Périmètre documentaire de l'accord de publication gratuite de l'auteur.

**Verdict :** document utilisable comme référence d'architecture et pour préparer un PRD et les contrats techniques ; **pas** preuve de préparation à la livraison ou de conformité de l'application.
