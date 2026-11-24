# CAR-43 — Gate de publication : droits, conformité et disponibilité

**Date :** 24 novembre 2026  
**Story :** [CAR-43](https://lmn24.atlassian.net/browse/CAR-43)  
**Rôle :** Amelia / développement, BMAD CardForge  
**Décision :** ne rendre aucun jeu officiellement disponible et **ne pas publier le MVP** avant justification des droits propres à chaque jeu.

## Résultat concret

- `src/application/publication-gate.ts` : registre de preuves explicites pour les cinq identifiants stables. Chaque dossier réunit **huit critères distincts** : autorisation d'adaptation, périmètre de l'autorisation, vérification du titre public, attribution des auteurs, provenance/licences des ressources, conformité des règles/tests, expérience bilingue et fonctionnement hors ligne. Un élément sans justificatif vérifié reste `verified:false`, jamais implicitement validé.
- `scripts/audit-publication-gate.mjs` : par défaut audit **sans publication** et contrôle qu'aucun jeu `available` n'ait un dossier incomplet. L'option **`--require-mvp-publication` doit échouer aujourd'hui** pour Grim Delve et Thunderfighter ; elle ne se contente pas de l'état vert des tests.
- `tests/publication-gate.test.mjs` : vérifie les cinq noms publics et attributions, l'absence de preuve juridique pour les deux jeux MVP, le refus d'un statut `available` falsifié, l'exigence d'un justificatif par critère et le refus effectif de publication par le script.
- `package.json` : commandes `npm run audit:publication` et `npm run release:check` ; `prepublishOnly` exécute `release:check` avant un éventuel `npm publish`. `private:true` reste déjà défini pour le package. Un déploiement Web distinct ne serait **pas** automatiquement protégé par `prepublishOnly` ; il doit être relié explicitement au contrôle avant toute mise en ligne.
- `.github/workflows/cardforge-tests.yml` : ajoute `npm run audit:publication` au job Web. Le gate qualité continue de passer pour un **build interne** dont les cinq dossiers restent bloqués, sans transformer une CI verte en permission de diffusion.
- `src/App.tsx` : les jeux non autorisés affichent **« À venir »** et un avertissement de publication non autorisée ; les deux plateaux existants demeurent **des préversions techniques internes**, pas des jeux officiellement déclarés disponibles. Aucun changement aux identifiants, moteurs, cartes, sauvegardes ou scores.

## Matrice des cinq jeux — état de publication

| Jeu CardForge | Règles sources / auteur | Preuves techniques | Vérifications bloquantes |
| --- | --- | --- | --- |
| **Grim Delve** | Clear the Dungeon Classic 1.1.0, Mark S. Ball | CI Web, matrice Mary, FR/EN et offline exécutés, attribution identifiée | **Accord gratuit déclaré, copie et périmètre non vérifiés** ; emploi public du nouveau nom ; inventaire de provenance de toutes ressources |
| **Thunderfighter** | Gridcannon V2, Tom Francis | CI Web, matrice Mary, FR/EN et offline exécutés, attribution identifiée | **Droits de l'adaptation non démontrés**, disponibilité du nom Thunderfighter, revue de provenance des ressources, convention de score à confirmer selon référentiel |
| **Skydeck** | Card Capture, Lucas Gentry | Attribution documentaire | Autorisations, nouveau titre, ressources et jeu complet + tests FR/EN/offline |
| **Midnight Syndicate** | Loot the Loop, Wil Su (Isaludo) | Attribution documentaire | Autorisations, nouveau titre, ressources et jeu complet + tests FR/EN/offline |
| **Les Douze Tyrans** | Regicide, Paul Abrahams, Luke Badger, Andy Richdale | Attribution documentaire | Autorisations, nouveau titre, ressources et moteur conservant strictement les règles Regicide, FR/EN/offline |

**Règles de preuve :**
1. Une déclaration du porteur du projet ne remplace pas la vérification de son périmètre. Si le document original est privé, ne pas l'ajouter au dépôt public ; y consigner seulement une référence **non sensible** à une revue documentée, avec l'accord du porteur et selon une méthode de preuve convenue.
2. Les tests techniques de CAR-40, CAR-41 et CAR-42 prouvent leur portée **technique** ; ils n'autorisent ni la réutilisation d'une œuvre, ni un nouveau titre commercial.
3. Les univers CardForge sont des présentations originales : ne pas prendre une simple référence artistique, une licence de texte de règles ou la présence d'une œuvre en ligne pour une autorisation d'exploitation.
4. Les trois jeux futurs demeurent **« À venir »** jusqu'à leur propre revue. L'univers Wuxia/Chanbara des Douze Tyrans ne crée aucune règle supplémentaire à Regicide.
5. Le déploiement public **n'est pas configuré** dans GitHub Actions. Une publication ne sera pas déclarée possible tant qu'un job de déploiement réel, conditionné au gate juridique et qualité, n'aura pas été testé.

## Arbitrages et justificatifs attendus

- **Grim Delve :** validation confidentielle ou documentaire de l'accord Mark S. Ball, notamment gratuité, univers adapté, titre Grim Delve, Web, crédits, modalités de diffusion et éventuel Android ultérieur.
- **Thunderfighter :** qualification de ce qui nécessite réellement une autorisation de réutilisation, revue du titre **Thunderfighter**, confirmation des crédits Tom Francis et des conventions de score.
- **Tous les jeux :** inventaire des illustrations, icônes, sons, polices et notices de licences effectivement embarquées. Références/licences originales vérifiables, validation de la traduction et du rendu offline.
- **Avant toute mise en ligne :** workflow de publication relié à `npm run release:check` ET au job Web QA ; validation humaine des droits et des noms, contrôle des ressources finales.

## Limites

**Aucune vérification juridique indépendante, recherche de marque ou lecture de l'accord auteur n'a été réalisée ici.** L'utilisateur a demandé une confirmation préalable aux recherches web et ne l'a pas autorisée dans ce tour. Les outils de développement ne remplacent pas un conseil juridique. Aucune preuve de permission, de licence de ressources ou de disponibilité d'un titre n'a été inventée ou marquée `verified:true`.

**CI complète vérifiée : [GitHub Actions #45343470923](https://github.com/JeanLamora75/CardForge/actions/runs/45343470923), commit de code `b71f12e561310e91640e81cc624ca0c4565c2469`.** Résultats : **319/319 tests réussis**, script de contrôle CAR-43 affichant **les cinq jeux `BLOCKED`**, audit des matrices Mary, build TypeScript/Vite, précache PWA 8 ressources, quatre E2E production FR/EN clavier/tactile et reprise hors connexion, **deux jobs CI verts**. La commande `--require-mvp-publication` est également vérifiée en mode refus dans les tests du gate. La documentation a été publiée dans un commit ultérieur ne modifiant pas le code exécuté. **CI verte ne signifie pas permission de diffusion.**

**État Jira :** non modifié ; la mise en conformité juridique reste bloquante pour une diffusion publique.
