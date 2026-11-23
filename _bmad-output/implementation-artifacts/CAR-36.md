# CAR-36 — Réglages partagés musique, sons, animations et aides

**Amelia (BMAD)** · **23 novembre 2026** · [Story Jira CAR-36](https://lmn24.atlassian.net/browse/CAR-36)

## Implémentation

| Critère d'acceptation | Solution |
| --- | --- |
| AC1 — Musique et sons séparés, préférences locales | `src/application/shared-settings.ts` définit deux booléens distincts, `music` et `sounds`, tous deux désactivés par défaut. Les préférences sont isolées de l'IndexedDB de jeu et conservées sous `cardforge.settings.v1` dans `localStorage`. `src/application/audio.ts` fournit une ambiance originale synthétisée localement par Web Audio ainsi que de brefs effets de coup, victoire et défaite. La musique est contrôlée séparément des effets et ne dépend d'aucun téléchargement. Un navigateur peut refuser la lecture tant qu'aucune interaction n'a autorisé le son. |
| AC2 — Animations suivre système / activer / désactiver | `animations` valide les trois valeurs `system/on/off`. `motionAllowed` permet de tester le respect de `prefers-reduced-motion`. `src/styles.css` applique le comportement système par défaut, un arrêt explicite, ou une animation explicite de bilan même si le système réduit les mouvements. Le bilan reste lisible sans son ou animation ; aucun événement de jeu n'en dépend. |
| AC3 — Aides facultatives sans modifier la mécanique | `hints` est un booléen global transmis aux deux plateaux via `App -> GameDetail -> GameLearning`. Le contrôle rapide « Aide contextuelle » du plateau agit désormais sur le même réglage que la page Paramètres. L'ouverture des règles et les actions légales restent accessibles si l'aide est coupée. Les préférences de premier accès « Apprendre/Jouer » restent propres à chaque jeu. Aucun moteur ni sauvegarde n'est modifié. |

## Modifications

- `src/application/shared-settings.ts` — defaults sûrs, lecture/écriture locale résiliente, migration non destructive d'un ancien choix « cacher l'aide » par jeu, fonction pure de politique d'animation.
- `src/application/audio.ts` — interface Web Audio sans dépendance distante ; séquence musicale originale légère et effets distincts, arrêt si désactivé ou application masquée ; aucun audio indispensable à la compréhension.
- `src/App.tsx` — paramètres réactifs partagés, application de la préférence d'animation, contrôle du cycle de vie audio ; sauvegarde et message d'alerte si stockage non disponible.
- `src/components/GameLearning.tsx` — unifie le réglage d'aide entre Grim Delve et Thunderfighter, sans déplacer la sélection Apprendre/Jouer.
- `src/components/GrimDelveBoard.tsx`, `src/components/ThunderfighterBoard.tsx` — signaux sonores optionnels **après** un coup accepté par le moteur ; les transitions et résultats restent inchangés.
- `src/styles.css` — contrôles accessibles, traitement des animations incluant réduction des mouvements système.
- `src/i18n/language.ts` — libellés FR/EN des paramètres.
- `tests/shared-settings.test.mjs` — préférences indépendantes, stockage indisponible ou invalide, migration et invariance des états et actions légales.
- `tests/audio.test.mjs` — vérifie qu'un canal sonore désactivé n'instancie pas le système audio et qu'une activation produit un son de test.

## Limites de qualification

- Vérifier la CI du commit `cae2570b6a060456f7f2a3642cb34dfb8179b8b2`, puis relire les statuts sur `main`.
- Recette utilisateur réelle encore nécessaire : navigateurs refusant l'autoplay ou sans Web Audio, sortie audio mobile, préférences des lecteurs d'écran, changements de paramètres pendant une partie et rendu à faible largeur.
- Aucun script `uv` n'a été exécuté, conformément à la contrainte CardForge. Les contrôles sont ceux de la CI GitHub, non des scripts BMAD indisponibles.
