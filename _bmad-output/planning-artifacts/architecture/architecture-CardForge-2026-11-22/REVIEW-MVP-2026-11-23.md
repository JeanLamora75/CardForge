# Revue ciblée d'architecture — MVP CardForge

**Agent :** Winston — System Architect (BMAD v6.12.4)  
**Date :** 23 novembre 2026  
**Périmètre :** socle commun et les deux jeux du MVP, Clear the Dungeon Classic 1.1.0 et Gridcannon Version 2 ; préparation Web/PWA puis Android/iOS.  
**Méthode :** revue documentaire manuelle par lecture GitHub du code, PRD, architecture existante et référentiels Mary. **Ni `uv`, ni build, ni tests, ni revue indépendante automatisée exécutés.** Pas de recherche Web externe ni de vérification des versions publiées.

## 1. Corpus inspecté

- [Architecture et AD-01 à AD-12](./ARCHITECTURE-SPINE.md) ; [journal de décisions](./.memlog.md).
- [PRD John](../../prds/prd-CardForge-2026-11-22/prd.md), [Product Brief](../../product-brief-cardforge.md), [cadrage](../../../../docs/cadrage.md).
- [Clear the Dungeon — règles](../../game-rules/clear-the-dungeon.md) et [matrice](../../clear-the-dungeon-rule-test-matrix.md).
- [Gridcannon V2 — règles et audit de complétude §68](../../game-rules/gridcannon.md) et [matrice historique](../../gridcannon-rule-test-matrix.md).
- [Card Capture](../../game-rules/card-capture.md), [Loot the Loop](../../game-rules/loot-the-loop.md), [Regicide / Les Douze Tyrans](../../game-rules/regicide.md) : vérification de l'extensibilité, pas inclusion de ces moteurs au MVP.
- Code de la branche `main` : `src/core/cards.ts`, `src/catalog.ts`, `src/App.tsx`, `tests/cards.test.mjs`, `package.json`, `.github/workflows/bmad-install.yml`.

## 2. Verdict

**Architecture générale cohérente et conservée ; préparation détaillée du développement encore incomplète.** Les AD-01 à AD-12 restent applicables et leurs identifiants inchangés. Cette revue précise les contrats qu'Amelia et John devront décliner. Elle **n'atteste ni l'exécution des scénarios Mary, ni la conformité juridique, ni la production d'un MVP jouable**.

## 3. Constat vérifié, incidence et suite

| Priorité | Constat prouvé par dépôt/référentiel | Conséquence / traitement |
| --- | --- | --- |
| P0 | `makeStandardDeck()` fabrique 52 cartes sans joker. Or Clear the Dungeon et Gridcannon V2 s'appuient sur 54 cartes physiques et ont des usages distincts des jokers. | Garder le noyau neutre et définir explicitement l'identité physique des jokers et les cartes par jeu ; ne pas confondre rang, valeur d'attaque et rôle contextuel. |
| P0 | Pas de `src/games/` ni contrat moteur implémenté ; les deux référentiels Mary ont leurs propres phases et actions. | Définir interface générique minimale et machines à états spécifiques par jeu, sans moteur unique de règles. |
| P0 | Décisions CTD-ARB-01 à 14 et GC-01 à 21 clôturées dans les documents récents ; l'architecture antérieure évoquait encore des arbitrages de règles ouverts. | Mise à jour de la spine : décisions **produit** à implémenter, fidélité primaire et exécution des tests toujours à démontrer. Références normatives : CTD §11–25 et Gridcannon §68. |
| P0 | Sauvegarde, couche applicative et transaction idempotente absentes du code ; PRD exige une partie active par jeu, reprise exacte et abandon enregistré une seule fois. | Première livraison du socle doit inclure validation d'état, sérialisation ordonnée, versionnement, commande sérielle et écriture atomique. |
| P0 | `tests/cards.test.mjs` inspecte le texte source, sans exécuter `makeStandardDeck` ou `shuffle`. | Ajouter tests comportementaux exécutables, puis scénarios métier Mary reliés aux décisions. Ne pas considérer la matrice comme réussie. |
| P1 | Gridcannon décrit séquences de préparation, recherche de figure, piles, As/Jokers en réserve, égalités d'armure et prévisualisations/confirmations GC-23/30/47/52. | Les sélections et aperçus UI doivent être distincts de la commande confirmée ; le moteur contrôle l'effet et l'orchestrateur garantit une seule persistance. |
| P1 | `src/catalog.ts` affiche encore « Regicide » / Fantasy héroïque alors que le titre « Les Douze Tyrans » et l'univers grec sont validés. | Correction de présentation à prévoir dans une US, tout en stabilisant l'identifiant logique et en conservant la traçabilité des règles originales. **Aucun changement de code réalisé.** |
| P1 | `src/App.tsx` n'affiche qu'un catalogue ; PWA, IndexedDB, Capacitor et CI de test/build absents. | Découpage incrémental : moteurs et application, stockage, interface, offline, tests ; preuve sur appareil avant annonce Android/iOS. |
| P1 | PRD vise FR/EN au MVP et dix langues à terme ; l'UI existante est en français codé en dur. | Introduire des catalogues de messages localisés séparés des moteurs ; repli anglais et mode hors ligne pour langues livrées. |
| P2 | Les trois jeux futurs disposent de référentiels propres et potentiellement de compositions/états particuliers. | Les accepter par nouveau moteur isolé et mapping visuel ; **pas** de développement anticipé de leurs règles ni de généralisation universelle prématurée. |

## 4. Contrats recommandés à stabiliser avant Stories d'implémentation

1. **Carte physique :** identifiant unique pour chaque carte, jokers inclus ; invariants d'unicité et de conservation par jeu, sans imposer une même fonction aux jokers.
2. **Moteur :** création déterministe, description des coups légaux, validation métier, transition pure, calcul d'issue, validation/serialization de l'état ; ensemble de commandes et phases typées par jeu. Noms d'API indicatifs, non décidés.
3. **Orchestration :** commande confirmée sérialisée, transition unique, transaction de sauvegarde/résultat, publication de l'état enregistré et erreurs récupérables ; un double clic n'engendre pas deux résultats.
4. **État reprenable :** conservation des piles dans l'ordre, cartes et zones, étapes temporaires nécessaires, As/Jokers, armures, résultats et identifiants de version. Migration incompatible = conservation sans restauration forcée. **GC-54** reste une proposition technique à analyser, non une décision de Mary.
5. **Qualité :** associer explicitement chaque test aux références CTD/GC, aux invariants transversaux et aux frontières AD ; jeux non déclarés « Disponibles » sans preuves des scénarios critiques et autorisations requises.
6. **Livraison :** Web/PWA FR/EN jouable et hors ligne d'abord ; adaptation Android/iOS derrière ports, et preuves natives séparées. Aucune version externe de Capacitor ou des runners n'est confirmée par cette revue.

## 5. Séquencement recommandé pour John (sans création Jira)

- **Lot A — Socle exécutable :** cartes 52/54 et jokers, contrats moteurs, orchestration et premiers tests comportementaux.
- **Lot B — Règles Clear the Dungeon :** moteur CTD et scénarios CTD-ARB-01 à 14, y compris états provisoires et issues terminales.
- **Lot C — Règles Gridcannon V2 :** moteur GC, invariants 54 cartes, grille/piles/recherche/armure, cas limites et tests.
- **Lot D — Services communs :** sauvegarde atomique, reprises, abandons/statistiques, migrations, gestion des erreurs.
- **Lot E — Expérience jouable :** catalogue/fiches, cartes illustrées, tutoriels, règles, accessibilité, FR/EN, ressources hors ligne.
- **Lot F — Validation et distribution :** tests CI exécutables, parcours Web/PWA et vérifications des droits avant diffusion ; portage Android/iOS ensuite.

Ces lots sont un **ordre de travail proposé**, pas des Epics approuvés et pas des tickets Jira créés. Les dépendances techniques et le découpage final doivent être affinés par John/Amelia/Murat ; une réalisation incrémentale peut croiser ces lots.

## 6. Vérifications et limitations

- **Contrôlé manuellement :** cohérence des AD existants, existence/absence des modules recensés sur `main`, frontières domaine/UI/stockage, décisions Mary les plus récentes.
- **Non exécuté :** `npm install`, `npm run test`, `npm run build`, analyse statique, lint BMAD, reviewer gate indépendant, tests de conformité, appareils WebView et signature mobile.
- **Non vérifié en externe :** versions actuelles et compatibilité Capacitor/IndexedDB, droits d'adaptation et disponibilité des titres.
- **À considérer avant démarrage des Stories :** PRD encore marqué `draft-for-review` ; le PRD contient certains statuts historiques dépassés, même si les référentiels Mary les ont clôturés. John devra le synchroniser avant de figer la backlog.

**Conclusion Winston :** feu vert pour **préparer les contrats et découper les Stories** sur la base des AD-01 à AD-12 ; **pas de feu vert d'implémentation sans validation des contrats critiques, ni de déclaration de jeu conforme/jouable**.
