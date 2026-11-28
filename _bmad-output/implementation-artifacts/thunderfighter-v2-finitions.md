# Thunderfighter V2 — Finitions du plateau

Validation utilisateur : TF-V2-01 à TF-V2-16. Périmètre exclusivement visuel, moteur et sauvegardes inchangés.

| Références | Implémentation |
|---|---|
| TF-V2-01 | Logo centré, bandeau sans sphère (dégradé métallique et séparateur existant). |
| TF-V2-02 | Cadre découpé par border-image, épaisseur fixe de 8 px, côtés répétés sans étirement global. |
| TF-V2-03, 09, 10 | Bordure verte unique, viseur centré décoratif, bouton + existant ; cellules vides aux mêmes dimensions. |
| TF-V2-04 | Hologramme sur les écrans portrait dès 480 px, espace réservé au texte. |
| TF-V2-05 | Commandes indisponibles opaques, texte lisible, désaturation modérée de la miniature uniquement. |
| TF-V2-06 | Fond opaque de console et décor limité au bord inférieur. |
| TF-V2-07 | Jauge 12 segments rehaussée et espacée. |
| TF-V2-08, 11, 12 | Cadre tactique renforcé, fond spatial assombri, espacements harmonisés. |
| TF-V2-13, 14 | Géométrie des cartes et gestionnaires d'interaction conservés ; aucune modification du moteur. |
| TF-V2-15, 16 | Matrice E2E existante enrichie de contrôles logo/jauge/opacité/console ; cache des 32 ressources déjà contrôlé par verify:pwa. |

## Recette
Les assertions E2E sont ajoutées mais leur exécution doit être confirmée par CI. Vérifier les captures aux formats 360×640, 390×844, 600×900 et paysage, en FR/EN, puis le comportement tactile/clavier et hors ligne. Vérifier les préférences de réduction des mouvements. Aucune mesure de performance ni validation visuelle réelle n'est déclarée acquise.

Le bandeau original avec sphère et les 32 fichiers sources restent inchangés. Aucun nouvel asset requis. Workflow BMAD adapté manuellement, sans uv.
