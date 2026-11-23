# Addendum — PRD CardForge

Ce document conserve les décisions de solution qui n'appartiennent pas au PRD fonctionnel. Référence d'architecture : [Winston — Architecture Spine](../../architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md).

## Décisions techniques héritées de Winston

- AD-01 : React Web partagé, portage Android/iOS via Capacitor.
- AD-02 : socle de cartes partagé et moteur pur par Jeu.
- AD-03 : transitions d'état immuables et déterministes, sans nouveau mélange à la reprise.
- AD-04 : IndexedDB derrière une interface de persistance, avec validation ultérieure sur WebViews natives.
- AD-05 : identité de cartes métier indépendante des illustrations et factions affichées.
- AD-06 : tests unitaires de règles, intégration et parcours sur plateformes.
- AD-07 : ressources intégrées dans la distribution, dossiers par Jeu.
- AD-08 : PWA Web avec cache de ressources versionné et paquets mobiles embarqués.
- AD-09 : sauvegardes versionnées, migrations transactionnelles sans changer les règles.
- AD-10 : couche applicative indépendante de React orchestrant commandes, écritures et Résultats.
- AD-11 : erreurs catégorisées et récupération non destructive.
- AD-12 : builds GitHub Actions pour Web puis Android/iOS avec runners natifs.

## Contraintes de travail

- Windows 11 sans droits d'administration ni IDE ; Node/npm/pnpm et GitHub Desktop disponibles.
- Les scripts `uv` BMAD présents dans GitHub ne sont pas exécutables ; utiliser les connecteurs et documenter les adaptations.
- Les versions courantes des bibliothèques mobiles, des runners et des règles de publication restent à vérifier ; aucune nouvelle recherche Web lancée pendant la rédaction.
- La première sortie est gratuite et sans publicité. Toute évolution de monétisation implique la réévaluation de la condition de l'auteur de Clear the Dungeon.

## Travaux de validation préalables

- Mary : règles primaires Classic 1.1.0 et matrice de conformité.
- Sally : parcours réels, interactions des cartes, accessibilité et écrans.
- Winston : contrat moteur, schémas versionnés, prototype de persistance WebView.
- Murat : tests exécutables et preuves d'exécution CI.
- John : validation des hypothèses restantes avec le porteur du projet.

## Précisions validées le 23 novembre 2026 — ratification du porteur

Les trois principes ci-dessous sont désormais approuvés, sans changement d'identifiants des AD préexistants. Leur détail technique complet reste dans [l'architecture de Winston](../../architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md) ; les besoins observables sont dans le PRD v0.3.

- **AD-02 — B :** contrat commun minimal et moteur de règles **indépendant par jeu**. Signatures TypeScript et modes de validation à définir avec Amelia ; aucune généralisation des règles des jeux.
- **AD-05 — B :** chaque **carte physique** conserve un identifiant stable unique pendant la partie, y compris deux Jokers distincts. Le rôle contextuel appartient au moteur du jeu et les apparences restent en présentation. Le socle actuel génère 52 cartes ordinaires ; sa prise en charge des jokers du MVP doit être développée et testée.
- **AD-04 — B :** **IndexedDB transactionnel** retenu pour le Web/PWA derrière un port de persistance, avec sauvegarde/résultat/statistiques en une écriture atomique. Réutilisation dans Android/iOS conditionnée à des tests WebView ; pas de décision de persistance native définitive.

**GC-54 :** question de compatibilité des sauvegardes à instruire par Winston/Amelia. **Pas** une règle de Gridcannon validée par Mary.

**Jalon de passage :** tests des deux moteurs effectivement exécutés et conformités vérifiées, droits de diffusion documentés, fonctionnement FR/EN et hors ligne éprouvé. Le PRD consolidé permet de **préparer** le backlog, pas de présumer la conformité logicielle ni de créer des tickets sans accord.
