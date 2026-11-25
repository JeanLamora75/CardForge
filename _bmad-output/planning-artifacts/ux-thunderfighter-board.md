# Thunderfighter — Refonte UX du plateau
Décisions validées le 25 novembre 2026 avec Sally. Responsable technique : Amelia.
## Direction
Poste de commandement rétrofuturiste, métal bleu nuit, acier, accents orange et cuivre, Rajdhani locale. Plateau central, HUD compact, zone d’action en bas. Double représentation de la même carte : vue tactique et détail illustré. Priorité mobile portrait, adaptation paysage et desktop.
## Exigences
- TF-UX-01 : identité poste de commandement, distincte des autres jeux.
- TF-UX-02 : HUD pioche, ennemis neutralisés sur 12, réserve spéciale ; navigation retour, paramètres, aide/règles.
- TF-UX-03 : représentation compacte avec valeur, enseigne, rang et état ; détail accessible au toucher et clavier. Identifiant physique stable, illustrations sans nouvelles capacités. Ne pas révéler les cartes cachées ni les cartes futures.
- TF-UX-04 : neuf piles centrales, douze positions périphériques, ordre des secteurs identique au moteur ; figures neutralisées conservent leur emplacement. Résistance actuelle et armure lisibles directement ou en détail.
- TF-UX-05 : destinations mises en évidence exclusivement à partir des actions légales ; sélection directe, prévisualisation, annulation, confirmation ; alternative accessible pour toutes les actions, notamment choix ambigus et actions spéciales.
- TF-UX-06 : supprimer identifiants techniques, badge à venir, références internes et invariant 54 cartes de l'affichage joueur ; conserver messages utiles, erreurs et tutoriel facultatif.
- TF-UX-07 : moteur, règles, sauvegardes et résultats inchangés. La prévisualisation ne mute ni ne sauvegarde ; la confirmation valide une seule action. Réserve As/Jokers, armures, remplacement initial, recherche, victoire/défaite restent accessibles. Aucun affichage anticipé d'une pioche.
- TF-UX-08 : FR/EN, clavier, tactile, huit résolutions de référence, cache PWA local, reprise exacte, tests et CI avant clôture. Sur petits écrans permettre un défilement sans masquer d'action plutôt que réduire excessivement les cibles tactiles.
## Livraison progressive
| Story | Périmètre | Dépendances |
|---|---|---|
| CAR-83 | Structure immersive et HUD | CAR-22 à CAR-28 |
| CAR-84 | Double représentation | CAR-83 |
| CAR-85 | Sélection directe et confirmation | CAR-83, CAR-84 |
| CAR-86 | Réserve, armures et recherche | CAR-85 |
| CAR-87 | Ressources artistiques et effets | CAR-84 |
| CAR-88 | Recette et non-régression | CAR-83 à CAR-87 |
## Références
Règles : game-rules/gridcannon.md (V2, arbitrages existants prioritaires). Code : src/components/ThunderfighterBoard.tsx, GameLearning.tsx, App.tsx. Les maquettes ne sont pas des règles. Les illustrations définitives restent à produire et à valider. Aucun résultat de test revendiqué à ce stade.

## Revue V2 validée le 25 novembre 2026
CAR-89 : TF-UX-09 bandeau unique logo/retour/aide/paramètres ; 10 regrouper aide/règles/tutoriel ; 11 carte courante visible ; 12 géométrie stable ; 13 cases vides sobres ; 14 marqueurs compacts ; 15 supprimer valeurs répétées ; 16 réserve compacte ; 18 portrait/paysage/desktop ; 19 retirer redondances ; 20 tests FR/EN clavier tactile hors ligne. CAR-90 : TF-UX-17 illustrations définitives séparées. La carte courante est placée avant le plateau en portrait pour rester visible pendant la sélection ; en paysage elle est latérale. Aucun changement du moteur ni stockage. Les cibles de sélection et consultation restent distinctes. Recette réelle et CI obligatoires avant clôture.
