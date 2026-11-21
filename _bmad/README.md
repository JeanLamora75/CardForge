# Installation BMAD CardForge

CardForge reprend l'organisation BMAD 6.12.4 observée dans SMN.

## Statut
Les fichiers des agents principaux, des workflows et de la configuration CardForge sont présents. Le workflow GitHub Actions `.github/workflows/bmad-install.yml` sert à compléter la bibliothèque d'agents et de références à partir d'une révision **figée** de SMN (sans copier les livrables SMN).

Le résultat complet doit être vérifié dans l'historique GitHub Actions ; la présence de ce workflow seule ne signifie pas qu'il a été exécuté.

## Structure
- `_bmad/config.toml` : configuration globale CardForge
- `_bmad/bmm/config.yaml`, `_bmad/core/config.yaml` : configuration des modules
- `_bmad/custom/` : personnalisations propres à CardForge
- `.agents/skills/` : compétences BMAD, rôles et références
- `_bmad/workflows/` : circuit CardForge complémentaire
- `_bmad-output/` : livrables CardForge seulement

## Contraintes
Aucun script `uv` n'est exécuté. Les éléments propres à SMN, ses livrables, ses données, ses paramètres d'utilisateur et ses scripts ne sont pas importés. Les agents sont des instructions et non des processus autonomes.

## Parcours recommandé
Mary → John → Sally/Winston → Amelia → Murat → Camille. Les contrôles des droits des jeux et de la fidélité des règles précèdent toute publication.
