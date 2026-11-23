# Relais Winston → John — CardForge

**Date :** 23 novembre 2026  
**État :** prêt pour consolidation du PRD et préparation du découpage produit ; **aucune User Story créée ni modifiée dans Jira**.  
**Destinataire :** John — Product Manager BMAD.

## 1. Sources faisant foi

- [Architecture Spine](./ARCHITECTURE-SPINE.md) — AD-01 à AD-12, notamment validation explicite AD-02/04/05 du 23 novembre.
- [Journal des décisions](./.memlog.md) ; [revue ciblée de Winston](./REVIEW-MVP-2026-11-23.md).
- [PRD de John](../../prds/prd-CardForge-2026-11-22/prd.md) — à harmoniser avec les décisions récentes.
- [Cadrage du projet](../../../../docs/cadrage.md).
- [Règles Clear the Dungeon](../../game-rules/clear-the-dungeon.md), [matrice CTD](../../clear-the-dungeon-rule-test-matrix.md).
- [Règles Gridcannon V2](../../game-rules/gridcannon.md), notamment **§68** audit de complétude ; [matrice GC historique](../../gridcannon-rule-test-matrix.md).
- Jeux envisagés ultérieurement : [Card Capture](../../game-rules/card-capture.md), [Loot the Loop](../../game-rules/loot-the-loop.md), [Regicide / Les Douze Tyrans](../../game-rules/regicide.md).

## 2. Arbitrages utilisateur déjà obtenus — NE PAS redemander

| ID | Décision validée | Contrainte pour les Stories |
| --- | --- | --- |
| AD-02 | **Option B :** contrat commun minimal, moteur de règles indépendant pour chaque jeu. | Définir une frontière TypeScript partagée ; actions, états et règles propres au jeu ; pas de moteur général à exceptions. |
| AD-05 | **Option B :** chaque carte physique a un identifiant unique et stable dans la partie, y compris les Jokers distincts. | Contrôler unicité, conservation et déplacements des cartes ; séparer identité de carte, fonction dans le jeu, visuel et traduction. |
| AD-04 | **Option B :** IndexedDB transactionnel pour le MVP Web/PWA. | Port de persistance ; transactions atomiques sauvegarde/résultat/statistiques ; reprise exacte, erreurs non destructives. Compatibilité Android/iOS à tester séparément. |

Les principes de ces trois AD étaient déjà présents et sont maintenant **explicitement ratifiés** le 23 novembre 2026. Les AD-01 à AD-12 ne sont pas renumérotés.

## 3. Périmètre produit conservé

- **MVP Web/PWA :** Clear the Dungeon **Classic 1.1.0 sans réserve facultative** et **Gridcannon Version 2**, tous deux jouables après validation de leurs règles et tests.
- **Après MVP :** Card Capture, Loot the Loop, puis l'adaptation de Regicide intitulée **Les Douze Tyrans**, dans la Grèce antique ; ne pas intégrer leurs moteurs au MVP.
- Gratuit, sans publicité, solo local et hors ligne ; sauvegarde automatique d'une partie active par jeu, statistiques propres à chaque jeu, tutoriels facultatifs.
- Français/anglais complets dans le MVP, repli en anglais et extension ultérieure vers dix langues au moins.
- Android/iOS prévus architecturalement, sans exiger leur livraison simultanée à la première version Web.

## 4. Ajustements recommandés au PRD (sans modification de règle)

1. Harmoniser les passages du PRD qui parlent encore de **cas de règles « ouverts »** avec les documents Mary plus récents. CTD-ARB-01 à CTD-ARB-14 et Gridcannon §68 sont **clos sur le plan documentaire**. Ne pas écrire que la conformité aux règles originales est démontrée : arbitrages CardForge non nécessairement confirmés par les auteurs ; tests non exécutés.
2. Relier les exigences FR-05 à FR-09, FR-16 à FR-20, FR-33 et les non-fonctionnelles aux AD-02/04/05, sans confondre règles métier et choix d'architecture.
3. Inscrire explicitement dans les critères de sortie : **54 cartes physiques distinctes** pour les deux jeux du MVP, absence de pertes/duplications, déterminisme, reprise à l'état exact, transaction atomique et pas de résultat compté deux fois.
4. Préserver la distinction entre **intention/prévisualisation UI** et **action de jeu confirmée** (Gridcannon GC-23/30/47/52) ; aucun résultat, coût de ressource ou sauvegarde terminale lors d'une simple prévisualisation.
5. Faire apparaître comme jalons de preuve les tests exécutables Mary, les contrôles de stockage, la localisation complète et le mode hors ligne, ainsi que les autorisations juridiques avant diffusion publique.
6. Le titre affiché de Regicide doit devenir **Les Douze Tyrans** dans le catalogue futur, sans changer le moteur ni effacer la traçabilité vers l'original ; cela ne fait pas partie des deux moteurs du MVP.

## 5. Proposition de découpage à préparer (non validée Jira)

| Lot proposé | Valeur fonctionnelle et critères incontournables | Dépendances |
| --- | --- | --- |
| A — Socle de cartes et moteurs | Cartes uniques 52+2, contrat commun, transitions pures, tests comportementaux | AD-02/03/05 ; preuve de base pour B et C |
| B — Clear the Dungeon | Règles Classic 1.1.0, arbitrages CTD, cas limites, victoire/défaite, conformité testée | A |
| C — Gridcannon Version 2 | Grille, piles, armure, As/Jokers, impasses, phases de recherche, règles GC et scénarios | A |
| D — Persistance et statistiques | IndexedDB transactionnel, sauvegarde par jeu, migrations, reprises et idempotence des résultats | A ; intégrer progressivement avec B/C |
| E — Interface et pédagogie | Fiches, plateaux, cartes illustrées, tutoriels, aides, accessibilité, FR/EN | A–D ; revue UX Sally |
| F — Validation du MVP Web/PWA | CI réelle, tests de bout en bout, hors ligne, stabilité, droits et publication | B–E |

Ce regroupement est **un support de préparation**, pas six Epics automatiquement approuvés. John doit produire des User Stories petites, autonomes autant que possible, testables et référencées aux règles et décisions, avec dépendances explicites.

## 6. Travail attendu de John

1. Consolider le PRD sans rouvrir les arbitrages déjà validés.
2. Présenter au porteur les seules divergences ou décisions fonctionnelles véritablement bloquantes, en privilégiant une résolution parcimonieuse.
3. Proposer les Epics et User Stories avec besoin, critères d'acceptation, dépendances, impacts techniques, tests et liens aux référentiels Mary et AD.
4. **Demander l'accord avant toute création/modification dans Jira CAR.**

## 7. Hors périmètre et limitations

- Pas de code applicatif modifié, pas de tests, pas de build, pas de compatibilité WebView mesurée.
- Aucun script `uv` exécuté ; la documentation BMAD est écrite via le connecteur GitHub.
- Les contrats TypeScript détaillés, migrations de schéma et stratégie de concurrence sont à spécifier par Amelia/Winston lors du développement.
- Pas de recherche Web externe ni de vérification actualisée des bibliothèques.
