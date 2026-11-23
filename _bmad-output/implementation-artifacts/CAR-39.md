# CAR-39 — Écran d'informations, crédits et notices de licence

**Amelia — Senior Software Engineer** · **23 novembre 2026**  
**Jira :** [CAR-39](https://lmn24.atlassian.net/browse/CAR-39)  
**Livraison :** code et tests publiés sur `main` ; la vérification juridique de diffusion demeure CAR-43.

## Critères d'acceptation

| AC | Implémentation et limites |
| --- | --- |
| **1. Version, créations originales, auteurs et licences accessibles** | Nouvelle route `#about`, ouverture permanente depuis le pied de page de CardForge, page FR/EN `CreditsPage`. La version est lue depuis `package.json` pour éviter une version codée deux fois. Notice du travail original CardForge et notices séparées pour chaque jeu ; liens de vérification vers les références originales et étude de droits. |
| **2. Attribution documentée, droits non présumés** | `src/application/credits.ts` lie les cinq entrées du catalogue aux noms sources et auteurs connus : **Mark S. Ball** (Clear the Dungeon), **Tom Francis** (Gridcannon V2), **Lucas Gentry** (Card Capture), **Wil Su** (Loot the Loop / Isaludo), **Paul Abrahams, Luke Badger et Andy Richdale** (Regicide). La notice précise que les documents CTD sont référencés comme CC BY-NC-ND 4.0, **sans inférer une permission de distribuer une adaptation**. Le consentement gratuit de Mark S. Ball est **déclaré par le porteur mais non vérifié indépendamment**, sans annonce d'autorisation juridique acquise. Pour les autres sources, les licences/permissions ne sont pas établies. |
| **3. Thunderfighter sans validation juridique prématurée** | Le nom de présentation `Thunderfighter` est conservé ; la page indique explicitement que ce nom validé fonctionnellement n'a **pas** été validé juridiquement. Le gate CAR-43 reste nécessaire avant publication. |
| **4. Correspondance cinq noms et jeux sources** | `ATTRIBUTIONS` dérive les titres publics, ID internes et noms originaux de `src/catalog.ts`. Les cinq univers sont désignés comme créations de présentation CardForge et non comme illustrations ni œuvres source, sans changement de `gameId`, moteur, règles, sauvegarde ou statistiques. |

## Fichiers

- `src/application/credits.ts` : données de crédit, version de l'application, statuts documentaires et liens.
- `src/components/CreditsPage.tsx` : page autonome, focus sur titre, légendes des droits, accès aux références, deux langues.
- `src/application/catalog-route.ts` : route `#about` et navigation retour vers l'écran de provenance.
- `src/App.tsx` : ouverture permanente des crédits depuis le footer et rendu de la nouvelle route.
- `src/styles.css` : mise en page adaptée mobile/desktop et commandes clavier.
- `tests/credits.test.mjs` et `tests/catalog-route.test.mjs` : auteurs, noms, notices, version, garde sur les autorisations, navigation sans mutation.

## Sources et méthode

Les attributions et limites ont été établies à partir de **documents déjà présents dans le dépôt CardForge et de la Story Jira** ; aucune recherche Web supplémentaire ni vérification juridique indépendante n'a été menée pendant cette Story. Références internes notamment :

- `_bmad-output/planning-artifacts/clear-the-dungeon-rules-rights-study.md`
- `_bmad-output/planning-artifacts/game-rules/gridcannon.md`
- `_bmad-output/planning-artifacts/game-rules/card-capture.md`
- `_bmad-output/planning-artifacts/game-rules/loot-the-loop.md`
- `_bmad-output/planning-artifacts/game-rules/regicide.md`
- `docs/cadrage.md`

Les notices des **dépendances logicielles** renvoient au dépôt et à son manifeste ; l'inventaire de licences tierces avant diffusion reste à valider. Aucune licence de réutilisation des créations propres à CardForge n'est inventée.

## Tests et points ouverts

- Preuve automatisée : la suite Node + compilation TypeScript/Vite dans `CardForge Web tests`. Renseigner l'exécution verte avant clôture technique.
- Non attestés : revue visuelle navigateur, technologies d'assistance, vérification finale de toutes les licences, pièces justifiant les permissions d'adaptation et disponibilité des titres.
- Gate **CAR-43** toujours ouvert. La publication publique ne doit pas découler de cette Story.
- Scripts `uv` BMAD non exécutés (indisponibles dans l'environnement GitHub).
