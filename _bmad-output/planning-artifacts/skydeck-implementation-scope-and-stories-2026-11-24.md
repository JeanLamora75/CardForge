---
title: "Skydeck — cadrage MVP et User Stories"
date: "2026-11-24"
owner: "John — Product Manager BMAD"
status: "périmètre MVP validé ; Stories à valider avant Jira"
jira: "aucune création ni modification"
---
# Skydeck — cadrage d'implémentation
Décision du porteur du 24 novembre 2026 : Skydeck devient le quatrième jeu du MVP, avec Grim Delve, Thunderfighter et Midnight Syndicate. Les Douze Tyrans reste après MVP. Cette décision prévaut sur les mentions historiques « Après MVP » du PRD et des référentiels. Développement Web/PWA gratuit sans publicité, portages natifs ultérieurs ; publication publique distincte et conditionnée aux preuves CAR-43. Identifiant stable `card-capture`, titre Skydeck, univers corsaires du ciel, flottes aériennes et îles flottantes. Source : Card Capture, Lucas Gentry (2018). Aucun changement des règles, aucun score officiel identifié, aucune variante.
## Sources et limites
- [Mary — règles](game-rules/card-capture.md) : CC-T01–16, CC-R01–06 ; transcriptions croisées, PDF primaire inaccessible lors de l'étude. CC-R01–04 à confirmer avant conformité intégrale ; CC-R05 victoire indépendante de la main ; CC-R06 droits.
- [PRD](prds/prd-CardForge-2026-11-22/prd.md), [architecture](architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md), [epics](epics.md), [cadrage](../../docs/cadrage.md).
- Existant consulté : src/catalog.ts (coming-soon, route null), src/core/cards.ts (54 identités et mélange injecté), src/core/game-engine.ts (contrat commun), src/application/publication-gate.ts (preuves Skydeck manquantes sauf attribution). Ne pas modifier les autres moteurs ; As logique rank 1 vaut 14 dans Skydeck uniquement.
- Adaptation manuelle BMAD : skill John et configuration chargés, skill de découpage consulté ; pas de script uv, ni exécution du workflow interactif complet, ni recherche Web publique, ni test de code. Ce document est une proposition détaillée, pas une validation de conformité.
## Epic proposé
[MVP] Skydeck — Card Capture fidèle, jouable Web/PWA. En tant que joueur, je veux construire mon paquet en capturant les adversaires et terminer une partie solo conforme, sur mobile ou ordinateur, même hors ligne après préparation. Sortie : critères des 11 Stories satisfaits, revue Murat sur CI complète du même commit, cas limites documentés et preuves de publication distinctes. Identifiants SD-xx locaux, pas des clés Jira.
## SD-01 — Initialiser les 54 cartes et les deux pioches
Besoin : commencer une partie réglementaire et reproductible.
- AC1 : 14 cartes personnelles (quatre 2, quatre 3, quatre 4, deux Jokers distincts), 40 adverses avant ligne (5–10, J/Q/K/A), mélange déterministe injecté.
- AC2 : tirer quatre ennemis visibles positions 1 à 4 ; retourner figures/As sous pioche adverse, laisser les trous jusqu'à première phase ennemie ; ordre multiple soumis à CC-R01.
- AC3 : main, défausse personnelle et capture ennemie vides ; phase initiale ennemie ; invariant 54 identités exactement une fois dans toutes zones. État invalide rejeté, sans mutation.
Dépendances : CAR-8/9, CC-R01 ; tests CC-T01/02/03. Impact : moteur autonome src/games/card-capture/engine.ts et types.
## SD-02 — Orchestrer les quatre phases
Besoin : jouer une manche dans l'ordre officiel.
- AC1 : phase ennemie compacte la ligne vers position 1 à droite sans modifier ordre relatif ; complète depuis position 4 côté pioche, sans fabriquer de cartes lorsque vide.
- AC2 : enchaîner ennemi, défausse, pioche, capture ; la première défausse peut être vide.
- AC3 : une seule action A/B/C par manche ; phase invalide ou commande répétée refusée sans mutation ; résultat terminal verrouillé.
Dépendance SD-01 ; tests CC-T03/04/14. Impact : machine d'états et actions.
## SD-03 — Défausser et renouveler la pioche
Besoin : choisir les cartes conservées et retrouver les cartes conquises.
- AC1 : défausser zéro à toutes les cartes de main vers défausse personnelle, jamais pile ennemie ; choix invalide refusé.
- AC2 : compléter main à quatre ; si pioche épuisée, mélanger défausse seulement si nécessaire ; conserver l'état du générateur ou une stratégie déterministe sérialisable.
- AC3 : si deux zones insuffisantes, ne pas créer de carte ni imposer une défaite non sourcée ; résoudre CC-R02 avant acceptation du cas.
Dépendance SD-02 ; tests CC-T05/06. Impact : hasard déterministe et état.
## SD-04 — Capturer un adversaire (A)
Besoin : gagner une carte en combinant des cartes de même enseigne.
- AC1 : une cible occupée ; cartes engagées distinctes et en main, enseigne cible, somme >= valeur cible ; J=11 Q=12 K=13 A=14 ; 9 coeur avec 4+5 coeur accepté, 4 pique+5 coeur refusé.
- AC2 : cible et cartes engagées vers défausse personnelle ; une seule cible retirée ; aucun mouvement vers pile ennemie.
- AC3 : actions illégales (somme insuffisante, mauvaise enseigne, cible absente) sans mutation ; capture de figure autorisée.
Dépendance SD-03 ; tests CC-T07/08/09. Impact : validation et transitions.
## SD-05 — Copier une carte avec les Jokers
Besoin : employer les Jokers selon leur rôle original.
- AC1 : Joker copie valeur ET enseigne d'une carte réellement engagée ; exemple 5 coeur + Joker contre 10 coeur accepté.
- AC2 : pas de valeur arbitraire ni de copie d'une carte extérieure à l'action ; aucune identité physique du Joker modifiée.
- AC3 : cas des deux Jokers avec ou sans référence non Joker tranché à partir de CC-R03 avant acceptation ; tests positifs/négatifs correspondants.
Dépendance SD-04 ; test CC-T10. Impact : calcul de valeur propre au moteur.
## SD-06 — Laisser l'ennemi capturer (B)
Besoin : sacrifier une carte pour retirer l'ennemi en position 1.
- AC1 : une carte choisie en main et l'ennemi de position 1 vont dans pile de capture ennemie, définitivement hors circuit.
- AC2 : si l'une des deux est J/Q/K/A, défaite immédiate ; aucune carte protégée dans cette pile sans issue de défaite.
- AC3 : position 1 vide et ligne non vide : CC-R04 à résoudre ; ne pas choisir une autre cible implicitement.
Dépendance SD-03 ; tests CC-T11/12. Impact : transition B et résultat.
## SD-07 — Repousser un ennemi (C)
Besoin : sacrifier deux cartes pour différer un adversaire.
- AC1 : deux identités distinctes en main vers pile ennemie ; une cible occupée choisie revient sous la pioche adverse sans mélange ni capture personnelle.
- AC2 : J/Q/K/A sacrifié entraîne défaite immédiate ; Joker non assimilé à une figure protégée.
- AC3 : cible vide, une seule carte, doublon ou commande hors phase refusés sans mutation.
Dépendance SD-03 ; tests CC-T12/13/14. Impact : transition C et ordre de pioche.
## SD-08 — Résoudre les issues et protéger l'information
Besoin : terminer uniquement selon les règles.
- AC1 : victoire après capture seulement si pioche adverse et quatre positions vides, sans carte protégée dans pile ennemie ; main/défausse personnelle restantes admises (CC-R05).
- AC2 : défaite immédiate prioritaire si carte protégée capturée par ennemi ; impasse réellement réglementaire, démontrée via CC-R02 et états atteignables, pas d'heuristique sur la seule impossibilité de A.
- AC3 : projection publique main/ligne seulement et compteurs autorisés ; aucun rang/enseigne/identifiant des cartes cachées ni consultation libre des piles ; sauvegarde interne distincte.
- AC4 : aucun score officiel inventé ; résultat terminal immuable ; anomalie d'intégrité n'est pas défaite.
Dépendances SD-04/05/06/07 ; tests CC-T12/14/15 et propriétés. Impact : issue, projection, invariants.
## SD-09 — Plateau Skydeck
Besoin : jouer confortablement au tactile et clavier.
- AC1 : quatre positions lisibles, position 1 droite et position 4 entrée ; main, phases, compteurs et actions légales explicites ; sélection/prévisualisation sans mutation, confirmation via orchestrateur.
- AC2 : les trois actions restent distinctes et les Jokers permettent de comprendre leur copie ; aucune fuite de cartes cachées ; erreurs localisées.
- AC3 : mobile portrait et ordinateur, focus visible, noms accessibles, factions non fondées uniquement sur couleur, animations réduites ; habillage fixe original sans effet métier.
- AC4 : route de préversion interne accessible pour recette sans déclarer la publication publique autorisée ; catalogue conserve gameId et protections.
Dépendance SD-08 ; revue Sally recommandée ; impacts React, catalogue, assets, i18n.
## SD-10 — Reprise, apprentissage et statistiques
Besoin : retrouver exactement ma partie et apprendre sans fausser mes résultats.
- AC1 : sauvegarde versionnée après action validée, ordre des pioches, zones, phase, manche, état aléatoire, résultat et identités restaurés ; mêmes actions après reprise donnent même issue ; CC-T16.
- AC2 : une partie par jeu ; remplacement confirmé uniquement, abandon séparé et idempotent ; sauvegarde incompatible conservée, erreur de stockage visible, autres jeux intacts.
- AC3 : tutoriel facultatif au premier lancement, rejouable, sans statistiques ni sauvegarde ordinaire ; règles/aides FR/EN complètes, crédits Lucas Gentry, repli EN.
- AC4 : victoire/défaite, rejouer/catalogue ; statistiques locales victoires/défaites/abandons et taux hors abandons ; aucun score inventé ; transaction atomique résultat/statistiques.
Dépendance SD-08/09 ; réutiliser socle CAR-12 à 16, 33–34 ; impact persistance IndexedDB, migrations enregistrées, composants communs.
## SD-11 — Conformité et CI
Besoin : disposer d'un jeu réellement vérifié avant diffusion.
- AC1 : matrice CC-T01–16 reliée à assertions exécutées ; CC-R01–04 confirmés et testés, CC-R05 couvert, aucun faux feu vert ; propriétés sur 54 identités, déterminisme, exclusivité des phases, non-divulgation et refus immuables.
- AC2 : tests intégration reprise/transactions, échecs stockage, idempotence et isolation entre quatre jeux ; E2E production FR/EN, clavier et tactile, victoire/défaite, abandon et reprise dans nouvelle page hors ligne après préparation ; ressources embarquées.
- AC3 : typecheck, tests, build, E2E et régressions des autres jeux verts sur même commit ; Murat vérifie journaux et assertions réelles, pas seulement noms de tests ; preuves et SHA consignés.
- AC4 : droits, périmètre permission, titre, crédits, ressources et conformité documentés dans publication-gate ; si preuves manquantes, statut public bloqué même si recette interne possible. CC-R06/CAR-43. Aucun droit présumé.
Dépendances SD-01 à SD-10 ; impacts CI, QA, publication et docs.
## Ordre et traçabilité
SD-01 → 02 → 03 → (04 → 05, 06, 07) → 08 → 09 → 10 → 11. Les cas CC-R01–04 sont des préconditions ciblées des Stories correspondantes, non des règles inventées. Les tests sont à réaliser, pas exécutés. Aucune création Jira. Le porteur a validé le périmètre MVP, pas encore la création de l'Epic et des Stories.
