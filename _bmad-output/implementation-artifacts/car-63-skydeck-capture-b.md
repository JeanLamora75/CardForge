# CAR-63 — Capture B Skydeck
Amelia — implémentation sur main, sans uv.
AC1 : une carte physique de la main et l'ennemi de position 1 sont transférés définitivement dans enemyCapture. Aucun choix implicite d'une autre cible, aucune mutation des pioches ou de la défausse. Joker sacrifiable.
AC2 : défaite immédiate prioritaire dès qu'un J/Q/K/A entre dans enemyCapture, que la carte provienne de la main ou de la ligne. La victoire éventuelle sur le dernier ennemi ne prévaut jamais sur la défaite. Validation renforcée : une carte protégée dans enemyCapture impose l'issue loss.
AC3 : CC-R04 reste documentaire ; une ligne non compactée en phase capture est rejetée conformément à la machine d'états existante, aucune règle originale supplémentaire revendiquée.
Tests CC-T11/12, cas B de CC-T14/15, CC-R04, conservation et non-réintégration. Aucun autre moteur modifié. CI à constater.