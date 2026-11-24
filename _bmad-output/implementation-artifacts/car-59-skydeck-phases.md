# CAR-59 — Phases Skydeck
Implémentation directe sur main sans uv, 24 novembre 2026.
AC1 : compactage vers position 1, remplissage ordonné, pioche épuisée, figures non filtrées après préparation.
AC2 : ennemi → défausse vide → pioche simple → capture ; tests 64 graines. Défausse sélectionnée et recyclage CAR-60.
AC3 : refus des actions hors phase, répétées et après fin. Les actions de capture ne sont pas encore implémentées (CAR-61/63/64) ; exclusivité après une capture effective et retour à la manche suivante restent à prouver avec ces Stories. Aucun faux passage de manche. CC-T14 complet reste ouvert.
Validation généralisée des zones et conservation des 54 cartes. CC-R01 reste provisoire. CI à vérifier sur le commit publié.
