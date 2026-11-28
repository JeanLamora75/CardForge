# Thunderfighter — Console tactique V3 (option C)

Validation porteur : 28/11/2026. Périmètre : console inférieure uniquement, moteurs et ressources du radar inchangés.

| ID | Critère d'acceptation |
|---|---|
| TF-CONSOLE-01 | En-tête, compteurs et radar préservés. |
| TF-CONSOLE-02 | Refonte de la console inférieure uniquement. |
| TF-CONSOLE-03 | Trois régions permanentes : transmission/renfort, équipements, décision. |
| TF-CONSOLE-04 | Carte en attente agrandie dans le budget disponible. |
| TF-CONSOLE-05 | Pas de scroll global ou interne, pas de contenu tronqué. |
| TF-CONSOLE-06 | Géométrie du radar stable entre phases à viewport constant. |
| TF-CONSOLE-07 | Six emplacements fixes : quatre Alphas, deux Singularités. |
| TF-CONSOLE-08 | Distinguer absent, consommé, disponible et détenu non utilisable, sans dévoiler la pioche. |
| TF-CONSOLE-09 | Signaler les équipements utiles au blocage selon les actions légales. |
| TF-CONSOLE-10 | Fonction explicite et détail de la carte détenue consultable. |
| TF-CONSOLE-11 | Tactile, souris, clavier et glisser-déposer conservés. |
| TF-CONSOLE-12 | Transmission contextuelle selon phase, action et résultat. |
| TF-CONSOLE-13 | Instructions fondées sur les actions légales, sans décision forcée. |
| TF-CONSOLE-14 | Présenter tirs, armures, neutralisations via effets et transmission. |
| TF-CONSOLE-15 | Alerte de saturation visible. |
| TF-CONSOLE-16 | Commande spécifique par phase. |
| TF-CONSOLE-17 | Pas de confirmation de pioche, déploiement initial ou conservation ; garder les décisions sensibles. |
| TF-CONSOLE-18 | Réutiliser effets audio et visuels avec préférences utilisateur. |
| TF-CONSOLE-19 | Pas de nouvelle production graphique ; ressources locales existantes. |
| TF-CONSOLE-20 | Même composant Jouer et Apprendre, sauvegardes distinctes. |
| TF-CONSOLE-21 | FR/EN, accessibilité, PWA hors ligne. |
| TF-CONSOLE-22 | E2E sur huit résolutions, deux langues et modes ; preuve CI. |

## Décisions d'implémentation
Inventaire fixe sans révéler les cartes non détenues. Confirmation contextualisée pour les coups tactiques irréversibles. La console ne change pas le moteur et conserve la sauvegarde existante. Éviter toute automatisation si une alternative légale existe. Réutiliser les assets et les effets existants. Sur petits écrans, densité adaptée au viewport, sans masquer les actions. Publication main autorisée. Aucun uv ; workflow adapté manuellement. Statut : spécifié, validation technique à établir.
