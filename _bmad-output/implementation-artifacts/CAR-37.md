# CAR-37 — Confidentialité, gestion et suppression volontaire des données

**Amelia (BMAD)** · **23 novembre 2026** · [Jira CAR-37](https://lmn24.atlassian.net/browse/CAR-37)

## Statut : partiellement implémenté — suppression suspendue pour validation PO (A-01)

La Story impose **explicitement** une validation préalable de la granularité de suppression par le Product Owner avant codage. Le périmètre n'étant pas validé, **aucune commande destructive ni API de suppression de données n'a été implémentée**. Il serait incorrect de considérer l'AC2 ou l'AC3 comme terminés.

## AC1 — information claire : livré

- `src/application/privacy.ts` : inventaire descriptif versionné des sept catégories : sessions, résultats, statistiques dans IndexedDB ; langue, réglages communs, choix d'apprentissage dans localStorage ; tutoriels uniquement en mémoire.
- `src/components/PrivacyPanel.tsx` : rubrique « Confidentialité et mes données » bilingue dans les paramètres. Mention explicite du fonctionnement sans compte, publicité ni synchronisation des parties, de la sauvegarde limitée à l'appareil/navigateur, et des limites liées au navigateur/système.
- `src/App.tsx` : intégration de la rubrique dans les paramètres existants, sans mutation de partie ni nouvelle route.
- `src/styles.css` : présentation responsive lisible.
- `tests/privacy.test.mjs` : complétude des catégories et impossibilité de déclencher un effacement non validé.

## AC2 / AC3 — conception suspendue à la décision A-01

**Décision proposée au PO :**

- **Option A** — suppression totale uniquement : toutes les parties, résultats, statistiques et préférences CardForge, sans possibilité de sélectionner.
- **Option B (recommandée)** — suppression par jeu (partie, résultats et statistiques de ce jeu ensemble), suppression des préférences séparément, et suppression totale : contrôle utile et cohérence transactionnelle. Les choix de tutoriel propres aux jeux devront avoir un rattachement explicitement décidé.
- **Option C** — suppression fine par catégorie, voire des résultats séparément des statistiques : flexibilité supérieure, mais nécessite une règle de recalcul des compteurs et un contrat d'intégrité supplémentaire.

**Points de confirmation pour toute option** : périmètre exact de chaque action, interaction avec les données historiques, conservation des préférences de langue, cas navigateur sans IndexedDB, confirmation explicite détaillée et annulation strictement sans écriture, transaction et gestion des erreurs, protection contre une session en cours ouverte dans un autre onglet.

Tant que cette décision n'est pas validée, afficher une action « Supprimer » serait trompeur. La rubrique informe honnêtement que la suppression depuis l'application n'est pas encore disponible.

## Contrôles / limites

- Les tests `privacy.test.mjs` sont ajoutés à la suite Node/TypeScript de GitHub Actions.
- La validation des effets de suppression doit être réalisée *après* validation produit ; il n'existe donc pas de test d'effacement réussi à ce stade.
- Recette visuelle du panneau sur navigateur réel à compléter.
- Aucun script `uv` exécuté, conformément aux contraintes CardForge.

**Suite :** validation PO de A/B/C, puis implémentation atomique du parcours de confirmation et de suppression avec preuves de non-régression des autres catégories.
