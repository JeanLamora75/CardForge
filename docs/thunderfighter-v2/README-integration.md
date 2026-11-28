# Thunderfighter V2 — Guide d’intégration Amelia

32 ressources originales issues des six lots, sans remplacement des cartes existantes.
Copier le dossier `public/assets/hud/thunderfighter/v2/` dans le dépôt. Ce chemin est proposé, à confirmer avec les conventions actuelles du dépôt et le script assets:optimize. Les fichiers sources PNG/WebP sont inchangés. Ne pas copier les références visuelles dans public.

## Intégration
- Lot 1 : fond spatial en cover, cadre cockpit en calque non interactif (pointer-events:none), bandeau et console en arrière-plan ; fond tactique sous la grille dynamique ; séparateur facultatif. Garder les cartes aussi grandes que possible.
- Lot 2 : petits compteurs pioche/réserve, grand compteur ennemis, variante alerte seulement si état pertinent. Composer 12 segments dynamiques, sans valeurs incrustées.
- Lot 3 : cases vides, sélection et déploiement selon les états existants ; signe + dynamique. Halo, viseur et radar décoratifs ; aucune nouvelle case ni règle.
- Lot 4 : panneau de mission, cadre miniature et hologramme indépendants ; masquer le décor si l’espace manque. Texte FR/EN et miniature existante dynamiques.
- Lot 5 : fonds violet Singularité, bleu Aegis, jaune Vector, orange Nova. Superposer illustrations et libellés existants ; états disponibles, pressés, sélectionnés et désactivés en CSS.
- Lot 6 : icônes retour, aide, paramètres avec noms accessibles ; effets laser, impact, bouclier et singularité liés uniquement aux événements existants. Animations courtes, non bloquantes, désactivables (préférences et prefers-reduced-motion).

## Critères de recette
Conserver règles, valeurs, positions, illustrations, sauvegardes et fonctionnalités. Vérifier clavier/tactile, FR/EN, états désactivés, tailles mobiles (notamment 360/390 px et capture de référence), lisibilité, absence de chevauchements et de scroll dans le format de référence si possible sans rogner les commandes. Vérifier le cache hors ligne des ressources WebP/PNG, le poids du build et le temps de démarrage. Exécuter les tests du projet et CI sans uv. Aucun test d’intégration n’a été exécuté lors de la préparation de ce pack.

## Contrôle
Inventaire CSV : dimensions, format, extrema alpha, poids et SHA-256 des fichiers. Les références graphiques ne sont pas des assets de production. Le rendu responsive doit être validé dans le vrai jeu. Le fond WebP source peut nécessiter un traitement spécifique si le pipeline ne copie que les PNG.
