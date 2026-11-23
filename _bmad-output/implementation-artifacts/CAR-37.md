# CAR-37 — Confidentialité, gestion et suppression volontaire des données

**Amelia (BMAD)** · **23 novembre 2026** · [Jira CAR-37](https://lmn24.atlassian.net/browse/CAR-37)

**Décision du Product Owner : option B validée** — suppression par jeu, préférences distinctes ou totalité des données CardForge. Le présent document remplace le blocage A-01 initial.

## Critères d’acceptation

| Critère | Réalisation |
| --- | --- |
| **AC1 — Information claire, locale, sans compte/publicité/synchronisation** | `src/components/PrivacyPanel.tsx` décrit en FR/EN les sauvegardes, historiques des résultats, statistiques et préférences, ainsi que les tutoriels en mémoire. `src/application/privacy.ts` inventorie les sept catégories sans modifier de données. |
| **AC2 — Action explicite, périmètre, confirmation ; Annuler sans écriture** | Trois commandes séparées dans Paramètres. La demande ouvre une confirmation explicite détaillant données effacées/conservées ; un bouton Annuler ne fait aucune mutation. Avertissement irréversible, état occupé et retour du focus ; Escape annule et les touches Tab restent dans le panneau de confirmation. Aucun effacement automatique lors d’une navigation, du chargement, de l’ouverture des paramètres ou d’un tutoriel. |
| **AC3 — Option B, intégrité des autres données** | **Par jeu :** transaction `readwrite` unique sur `sessions/results/statistics` filtrant les résultats historiques par `gameId`, supprime seulement ce jeu et conserve les autres jeux et toutes préférences. **Préférences :** efface uniquement les sept clés CardForge identifiées dans `localStorage`, conserve toutes les données IndexedDB. **Totalité :** transaction atomique de nettoyage des trois tables IndexedDB de CardForge, puis suppression de ses clés de préférence ; aucune clé d’autres applications/sites touchée. L’application est rechargée après succès pour éviter d’afficher un état React encore en mémoire. |

## Implémentation

- `src/adapters/indexeddb-privacy-storage.ts` : adaptateur d'effacement à schéma IndexedDB v1 identique à `indexeddb-game-storage.ts`, transactions atomiques par jeu et globales ; résolutions seulement sur `tx.oncomplete`, rejets sur abort ou blocage. La suppression par jeu consulte tous les résultats dans **la même transaction** avant de retirer chaque résultat du jeu choisi.
- `src/application/privacy.ts` : `PrivacyDeletionScope` validé (`game/preferences/all`), liste des cinq identifiants réels et des sept clés localStorage appartenant à CardForge, `executePrivacyDeletion` soumis au booléen `confirmed` (false = aucun effet).
- `src/components/PrivacyPanel.tsx` : interfaces FR/EN spécifiques et périmètres clairs ; sélection du jeu, dialogue de confirmation accessible, erreurs explicites, rechargement après réussite.
- `src/styles.css` : commandes de suppression adaptées au mobile et au clavier.
- `tests/indexeddb-game-storage.test.mjs` : simulateur de transaction étendu pour `getAll`, `delete`, `clear`, rollback ; tests pour l'historique à plusieurs sessions, l'isolement des autres jeux, échec d'écriture et reprise, effacement total isolé à la base CardForge.
- `tests/privacy.test.mjs` : couverture des trois granularités, refus d’une suppression non confirmée, liste des clés appartenant à CardForge et erreurs d’accès.

## Vérification exécutée

**[GitHub Actions #45270100099](https://github.com/JeanLamora75/CardForge/actions/runs/45270100099)** — commit `ba867de0a7700bd53adb678814f90570bd523209` :
- **261/261 tests Node réussis ; 0 échec** ;
- **Build TypeScript et Vite réussi** ;
- transactions testées avec un simulateur IndexedDB asynchrone et transactionnel, **pas dans un véritable navigateur**.

## Limites et recette avant clôture fonctionnelle définitive

- Les transactions IndexedDB garantissent l’atomicité **au sein des trois tables**. **IndexedDB et localStorage sont deux mécanismes distincts : aucune transaction commune n’existe.** En cas de refus de `localStorage` après suppression IndexedDB lors d’un effacement total, l’interface affiche une erreur de suppression partielle et ne prétend jamais que tout a été supprimé. Les autres catégories ne sont pas effacées silencieusement.
- Les tests automatisés n’attestent pas encore les permissions de suppression d’un navigateur réel, la gestion de deux onglets ouverts simultanément, la lecture par technologies d’assistance ou les petits écrans.
- Après confirmation, il est préférable de fermer les éventuels autres onglets CardForge avant l’effacement : une autre instance encore active pourrait conserver un ancien état mémoire. Protection multi-onglets et recette navigateur restent à éprouver avant diffusion publique.
- Aucun script `uv` exécuté : workflow BMAD adapté aux connecteurs GitHub/Jira et à la CI du dépôt.
- La Story Jira n’est pas déclarée fonctionnellement clôturée sans validation de la recette utilisateur.

## Décision produit

**Option B confirmée directement par l’utilisateur :** périmètre par jeu cohérent (sessions + tous résultats + statistiques), préférences séparées, et totalité des données CardForge. Ne pas introduire de suppression fine de résultats isolés sans nouvelle décision.
