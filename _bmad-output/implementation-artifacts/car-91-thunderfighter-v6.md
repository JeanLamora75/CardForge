# CAR-91 — Console tactique compacte V6

## Brief Amelia
Réunir carte et consigne, réduire la console et le HUD, intégrer les actions spéciales à une réglette compacte, conserver le plateau carré et les interactions légales. Ne pas modifier moteur ou stockage.

## Critères
TF-UX-59–72 : console compacte, instruction intégrée, entraînement discret, réserve horizontale, confirmation contextuelle, états légaux distincts, feedback visuel, HUD et typographie optimisés, marges réduites, panneaux secondaires, hiérarchie des actions, aide refermable, adaptation par phase. Tests six résolutions, FR/EN, souris/tactile/clavier, armure et réserve pleine. CAR-90 inchangée.

## Livraison
CSS et composants Thunderfighter uniquement, tests existants conservés avec contrôle de non-clipping. Aide et détails existants conservés ; pas de nouvelle animation complexe ni de panneau de réserve détaillé ajouté. La CI précédente échoue sur stabilité du plateau ; nouvelle CI indispensable. Le budget commun est réduit mais peut grandir pour les états exceptionnels, donc stabilité absolue non démontrée. Workflow manuel sans uv.

## Combat TF-UX-73–81
Refactorisation du calcul de tir en analyse détaillée partagée avec getShotTargets ; projection pure des placements/réaffectations ; SVG tactique et effets après dispatch accepté. Tests ciblés ajoutés. Vérification du cas haut-droite : jamais de tir vers le nord adjacent ; le Valet peut être neutralisé par une pose en bas-droite (10+6). Pas de preuve de l'état historique utilisateur. CI précédente V6 en échec E2E. CI nouvelle requise ; aucun uv. La neutralisation reste immédiate dans le moteur, effet d'impact superposé après confirmation.
