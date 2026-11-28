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

## V3.1 — Finitions validées le 28 novembre 2026

| ID | Critère |
|---|---|
| TF-CONSOLE-23 | Radar de géométrie identique entre phases à viewport constant. |
| TF-CONSOLE-24 | Hauteur de console réservée par résolution, indépendante du contenu. |
| TF-CONSOLE-25 | Une transmission remplace la précédente. |
| TF-CONSOLE-26 | Supprimer le titre Décision tactique. |
| TF-CONSOLE-27 | Arsenal tactique / Tactical arsenal. |
| TF-CONSOLE-28 | Six logements instrumentés. |
| TF-CONSOLE-29 | Couleurs de faction, y compris logements vides. |
| TF-CONSOLE-30 | Illustrations carrées sans écrasement. |
| TF-CONSOLE-31 | Témoins et libellés accessibles des quatre états. |
| TF-CONSOLE-32 | Consignes de manœuvre dans la transmission. |
| TF-CONSOLE-33 | Annuler compact dans une ligne de commande stable. |
| TF-CONSOLE-34 | Équipement sélectionné clairement signalé. |
| TF-CONSOLE-35 | Messages distincts extraction / déplacement source / destination. |
| TF-CONSOLE-36 | Pas de répétition des consignes. |
| TF-CONSOLE-37 | Garder drag/drop, clic et clavier. |
| TF-CONSOLE-38 | Commandes cohérentes avec le HUD. |
| TF-CONSOLE-39 | Jouer/Apprendre, FR/EN. |
| TF-CONSOLE-40 | Mesurer radar et console avant/après sélection, confirmation, annulation et action sur huit résolutions ; vérifier absence de débordement. |

Conserver règles et ressources existantes. Pas de nouvelle production graphique. Aucun uv. Les confirmations sensibles restent disponibles. Statut : critères validés, recette technique à démontrer.
