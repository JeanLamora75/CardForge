# CAR-65 — Issues et projection publique Skydeck
Amelia — main, sans uv.
AC1 : résolution centralisée après A/B/C, victoire si pioche et ligne ennemies vides, main/défausse conservées ; absence d'ennemi en état actif rejetée.
AC2 : perte prioritaire si figure/As dans enemyCapture ; aucune défaite sans preuve protégée pour le moment. CC-R02 reste non confirmé : la projection signale explicitement le blocage de pioche, sans inventer une défaite. Un scénario atteignable (six retraits C depuis 14 cartes personnelles) démontre la pénurie réelle ; impossibilité de A seule n'est jamais une défaite. CC-R01/R03/R04 restent ouverts.
AC3 : inspectSkydeck expose strictement manche, phase, issue, main, ligne, compteurs des quatre piles, actions légales et motif de blocage non sensible. Pas de graine, ordre caché, identités cachées ni référence mutable vers l'état interne. Protection de l'interface, pas une frontière de sécurité contre inspection de la mémoire locale. L'interface CAR-66 devra consommer uniquement cette projection.
AC4 : aucun score officiel, verrouillage terminal, refus d'intégrité sans transformation en défaite.
Tests de projection, non-interférence, trajectoires déterministes, issues, blocage atteignable et exclusivité. CI CAR-64 verte ; CI de ce commit à constater. AC2 reste partiellement accepté jusqu'à preuve primaire CC-R02 ; pas de publication publique.
