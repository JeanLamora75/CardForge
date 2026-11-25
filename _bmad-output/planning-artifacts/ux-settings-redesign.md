# CAR-82 — Refonte UX du centre de paramètres
Date : 25 novembre 2026. Cadrage Sally, implémentation Amelia. Validation du porteur : réalisation autorisée sur main.
## Besoin
Remplacer la longue page technique par un centre de configuration CardForge, noir et or, compact, sans retirer les fonctions existantes.
## Critères d’acceptation
| ID | Exigence |
|---|---|
| SET-01 | Composants communs aux paramètres et aux crédits. |
| SET-02 | Logo officiel, fond du catalogue, engrenages existants, titres Cinzel et textes fonctionnels sans empattement. |
| SET-03 | Cinq catégories : Langue, Audio, Confort et accessibilité, Confidentialité et données, À propos. |
| SET-04 | Navigation explicite, retour catégorie puis écran d’origine, focus clavier. |
| SET-05 | Interrupteurs accessibles pour musique, sons et aides. |
| SET-06 | Sélecteurs harmonisés, langue et animations, sauvegarde automatique. |
| SET-07 | Descriptions courtes, détails accessibles à la demande. |
| SET-08 | Inventaire complet dépliable et vocabulaire non technique, informations de stockage et limites conservées. |
| SET-09 | Trois périmètres inchangés : jeu, préférences, toutes données ; confirmation explicite, annulation, focus initial non destructif et accent rouge. |
| SET-10 | Crédits et notices intégrales conservés et harmonisés. |
| SET-11 | Aucun changement des moteurs, du stockage ou de la politique de suppression. |
| SET-12 | FR/EN, portrait/paysage, clavier/tactile, ressources locales PWA, statut discret et erreurs visibles. |
| SET-13 | Tests E2E des catégories, réglages, annulation, navigation et hors ligne ; CI et recette requises avant clôture. |
## Décisions techniques
Conserver le routage #settings et #about, catégories internes à Settings. Retour depuis les crédits vers le centre. Préserver les contrats SharedSettings et PrivacyPanel. Réutiliser les ressources existantes, sans dépendance externe. Les détails de confidentialité restent disponibles. Pas de changement des autorisations de publication.
## Dépendances
CAR-30, CAR-36, CAR-37 ; Epic CAR-6. Jira CAR-82 : https://lmn24.atlassian.net/browse/CAR-82.
## Validation
Publication du code ne vaut pas réussite de CI. Recette visuelle et résultats effectifs requis.

## Recette V2 — SET-14 à SET-25
- SET-14/15 : volumes indépendants 0–100 %, zéro coupe immédiatement le bus. Migration true → 100 (niveau historique), false → 0 ; même clé de stockage, autres préférences conservées, booléens dérivés pour compatibilité.
- SET-16 : bouton de test des effets, volontaire, désactivé à zéro.
- SET-17/18 : titres et descriptions séparés, SVG originaux locaux.
- SET-19/20 : en-têtes compacts, retour supérieur sur sous-pages, statut nominal masqué visuellement, version uniquement À propos et crédits.
- SET-21/22 : panneaux dépliables confidentialité, données par jeu, préférences, crédits avec logos et notices complètes.
- SET-23/24 : marges et styles harmonisés, confirmations et droits inchangés.
- SET-25 : tests unitaires migration et gains, E2E FR/EN, responsive et hors ligne ; résultats effectifs requis avant clôture.

## Recette V3 — SET-26 à SET-35
- SET-26/27 : retour unique dans le bandeau, retour catalogue depuis le catalogue et écran d’origine depuis une partie (contrat existant préservé).
- SET-28 : bandeau et cartes compacts, cibles de 44 px minimum.
- SET-29 : résumés dynamiques des volumes, aides, animations, langue et version.
- SET-30/31 : indication de silence uniquement à zéro, test sonore pleine largeur, aides dépliables et messages utiles conservés.
- SET-32 : zone sensible distincte, aucun changement des confirmations ni des périmètres.
- SET-33 : À propos centré avec logo, version, gratuité, absence de publicité et restriction de diffusion.
- SET-34 : titres centrés par grille symétrique, bandeau commun y compris crédits.
- SET-35 : tests FR/EN et huit résolutions adaptés, contrôles de navigation, résumés et zone sensible ; CI et recette nécessaires.
