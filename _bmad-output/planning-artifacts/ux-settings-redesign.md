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
