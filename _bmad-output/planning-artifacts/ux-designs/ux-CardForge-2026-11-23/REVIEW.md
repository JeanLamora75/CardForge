# Contrôle documentaire UX — Sally

**Date :** 23 novembre 2026  
**Nature :** contrôle manuel sur les spécifications, pas de test d'accessibilité exécuté ni de reviewer gate BMAD.

## Contrôles réussis

- Les skills `.agents/skills/bmad-agent-ux-designer/SKILL.md` et `.agents/skills/bmad-ux/SKILL.md` ont été **lus depuis GitHub** ainsi que leurs `customize.toml`; personnalisation CardForge chargée.
- Les deux contrats jumeaux `DESIGN.md` (apparence) et `EXPERIENCE.md` (parcours et interactions) ont été publiés.
- Le socle de styles du prototype `src/styles.css` a été lu ; les tokens proposés non approuvés sont explicitement identifiés.
- `EXPERIENCE.md` décrit les 13 surfaces UX-01..UX-13 et les 17 composants comportementaux UX-DR01..UX-DR17, ainsi que les états, la navigation, les interactions spécifiques CTD et Gridcannon, cinq parcours utilisateurs, le responsive et l'accessibilité.
- Les décisions déjà prises GC-22..GC-53 et CTD-ARB-01..14 sont tracées, sans demander de nouveaux arbitrages de règles.
- Les Stories UI du projet Jira CAR-29..CAR-39 sont référencées ; les compléments potentiels sont des **recommandations**, et aucun ticket n'a été modifié.
- Les contraintes « choix non confirmé ≠ coup », identité stable des cartes, sauvegarde transactionnelle, langue FR/EN, hors ligne et le statut provisoire de « Bastion Stellaire » ont été rappelées.

## Points ouverts en toute transparence

1. **Validation graphique :** charte visuelle, variantes des cartes, schéma exact des panneaux responsive et tokens proposés à valider sur maquettes. Les couleurs de prototype n'ont pas valeur de charte homologuée.
2. **Recette UX :** aucun prototype visuel interactif, test sur mobile, test lecteur d'écran, test clavier, contrôle chiffré WCAG ou essai de chargement hors ligne n'a été effectué.
3. **Produit :** granularité de suppression de données A-01 à valider ; GC-54 est hors UX et reste chez Winston/Amelia.
4. **Relais Jira :** préciser dans CAR-34 la réinitialisation des statistiques de Gridcannon GC-35 ; autres compléments suggérés dans EXPERIENCE.md. Nécessite validation avant modification des User Stories Jira.
5. **Procédure BMAD :** scripts `uv` et sous-agents BMAD indisponibles dans le contexte connecté ; aucun faux compte-rendu d'exécution.

**Verdict :** les spécifications documentaires UX pour préparer les maquettes, les tests et le développement du MVP sont **rédigées**. Elles demeurent **en projet pour validation visuelle**, et ne constituent ni un design final approuvé ni une interface implémentée.

## Complément de revue — feedback des maquettes V1 (23 novembre 2026)

- **Clear the Dungeon :** « à améliorer » ; pas de commentaire détaillé fourni.
- **Gridcannon :** « à améliorer » ; pas de commentaire détaillé fourni.
- **Statut de la revue :** les deux dispositions sont des bases de travail, **pas des maquettes approuvées**.
- **Points de contrôle UX V2 proposés** : lisibilité des colonnes/attaques/main CTD ; lisibilité des figures/résistance/armure et non-recouvrement de l'aperçu Gridcannon ; portrait mobile, puis paysage/desktop.
- **Limite** : aucun arbitrage détaillé ne peut être déduit du seul choix « à améliorer ». La prochaine itération devra présenter des variantes puis recueillir un choix explicite.
- **Aucune modification** apportée au code des jeux ou aux tickets Jira dans cette mise à jour documentaire.
