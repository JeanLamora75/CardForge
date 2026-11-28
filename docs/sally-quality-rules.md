# Sally — règles qualité obligatoires CardForge

Statut : obligatoire — validé par le porteur le 27 novembre 2026.
Périmètre : tous les jeux CardForge, tous les travaux UX/UI et graphiques de Sally.
Ces exigences complètent les principes BMAD et s'appliquent à chaque activation et livraison.

| ID | Règle obligatoire |
| --- | --- |
| CF-QUAL-01 | Amelia valide l'utilité technique des ressources avant leur production. |
| CF-QUAL-02 | Sally ne produit que les ressources nécessaires. |
| CF-QUAL-03 | Une ressource graphique correspond à un fichier autonome exploitable. |
| CF-QUAL-04 | Toute planche composite est un document de travail, jamais un livrable final. |
| CF-QUAL-05 | Contrôle systématique des dimensions, de la transparence et du détourage. |
| CF-QUAL-06 | Aucun lot déclaré terminé s'il est incomplet. |
| CF-QUAL-07 | Aucun passage au lot suivant sans contrôle du précédent. |
| CF-QUAL-08 | Aucune intégration déclarée validée sans preuves techniques. |
| CF-QUAL-09 | Les erreurs précédemment identifiées deviennent des contraintes obligatoires. |
| CF-QUAL-10 | Privilégier systématiquement la solution la plus simple répondant au besoin. |

## Application concrète

Avant production, Sally définit avec Amelia la liste minimale des ressources, leur usage, format, dimensions, transparence, zone utile et contraintes responsive. Comparer CSS/SVG/composants existants aux images raster ; ne pas générer de graphismes si une solution plus simple satisfait le besoin. Ne pas confondre maquette de référence et livrable.

Avant livraison, contrôler chaque fichier réellement accessible : ouverture/décodage, dimensions, canal alpha réel lorsque requis, absence de fond parasite, détourage, zone utile non tronquée, absence de textes/compteurs figés (hors identité graphique explicitement validée), cohérence artistique et noms de fichiers uniques. Les ressources dynamiques et les traductions restent dans le code. Vérifier la liste attendue contre la liste livrée, le manifeste et l'intégrité du ZIP si utilisé. Une planche source peut être découpée uniquement si les fichiers obtenus satisfont les mêmes contrôles.

Distinguer quatre statuts : concept, produit non contrôlé, contrôlé et prêt à intégrer, intégré et vérifié. Seuls les fichiers réellement contrôlés peuvent être annoncés prêts à intégrer. Ne pas annoncer une validation artistique, technique ou fonctionnelle non réalisée. Si un contrôle échoue ou si une ressource manque, le lot reste incomplet ; corriger avant de poursuivre. Signaler précisément tout blocage réel plutôt que livrer une planche inutilisable ou promettre une livraison future.

Pour une intégration, Amelia vérifie le rendu dans le jeu aux tailles cibles, les interactions, la lisibilité, l'accessibilité et les régressions pertinentes ; la CI et les tests réellement exécutés constituent les preuves techniques. Aucun script uv. Respecter les règles originales, la séparation présentation/moteur et les choix validés du porteur.

## Critère de sortie d'un lot

Liste minimale convenue avec Amelia, fichiers individuels présents et contrôlés, manifeste (nom, usage, dimensions, format, transparence), archive vérifiée si applicable, limites éventuelles explicites. Toute exigence non satisfaite interdit le passage au lot suivant. Ce contrôle est interne et ne doit pas imposer une validation manuelle supplémentaire au porteur pour des vérifications techniques ordinaires.
