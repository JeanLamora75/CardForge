# CAR-61 — Capture A Skydeck
24 novembre 2026 — Amelia, main, sans uv.
AC1 : choix d’une position occupée (1 à 4), cartes distinctes en main, même enseigne, somme >= cible, As 14, figures 11–13. Les Jokers ne sont pas encore utilisables pour A : CAR-62 doit implémenter leur copie.
AC2 : cartes engagées dans l’ordre de main et cible vers défausse personnelle ; une seule cible retirée, aucune carte en capture ennemie ; invariant 54.
AC3 : refus des actions invalides sans mutation ; fermeture de la phase, prochaine manche ou victoire si dernier ennemi (condition documentée CC-R05). B/C restent à implémenter ; CC-T14 et CC-T15 ne sont couverts ici que pour A.
Tests CC-T07/08/09, cas A de CC-T14/15, identité physique et immutabilité. CC-R01/R02/R03/R04 non résolus. Aucun changement des autres moteurs, du catalogue ou de la publication. CI à constater sur ce commit.
