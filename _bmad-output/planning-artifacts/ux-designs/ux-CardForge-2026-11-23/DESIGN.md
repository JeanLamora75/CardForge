---
name: CardForge
description: "Identité de collection unifiée, cartes fantasy illustrées et univers visuels distincts pour chaque jeu solo."
status: draft-for-visual-validation
updated: '2026-11-23'
sources:
  - '../../../../docs/cadrage.md'
  - '../../prds/prd-CardForge-2026-11-22/prd.md'
  - '../../architecture/architecture-CardForge-2026-11-22/ARCHITECTURE-SPINE.md'
  - '../../game-rules/clear-the-dungeon.md'
  - '../../game-rules/gridcannon.md'
colors:
  shell-base: '#12111B'
  surface-card: '#1C1A25'
  surface-raised: '#25222E'
  ink-primary: '#F5F0E8'
  ink-secondary: '#BCB7C3'
  ink-muted: '#AAA3B0'
  accent-collection: '#E8B777'
  border-subtle: '#3E3947'
  focus-visible: '#F4D8A3'
  danger-text: '#FFD4CA'
  danger-surface: '#522B2A'
  success-text: '#B4F2D0'
  success-surface: '#1A4434'
  ctd-ambiance: '#5D2D26'
  gridcannon-ambiance: '#20365C'
  card-capture-ambiance: '#4B205F'
  loot-the-loop-ambiance: '#7B5528'
  twelve-tyrants-ambiance: '#554061'
typography:
  display:
    fontFamily: 'Georgia, serif'
    fontWeight: '700'
    fontSize: 'clamp(2.2rem, 6vw, 4.8rem)'
    lineHeight: '1.1'
  heading:
    fontFamily: 'Georgia, serif'
    fontWeight: '700'
    fontSize: '1.55rem'
    lineHeight: '1.25'
  body:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontSize: '1rem'
    lineHeight: '1.5'
  card-stat:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontWeight: '700'
    fontSize: '1rem'
    lineHeight: '1.2'
  meta:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontSize: '0.875rem'
    lineHeight: '1.4'
rounded:
  sm: '9px'
  md: '12px'
  lg: '18px'
  xl: '24px'
  full: '9999px'
spacing:
  '1': '4px'
  '2': '8px'
  '3': '12px'
  '4': '16px'
  '5': '20px'
  '6': '24px'
  '7': '32px'
  screen-mobile: '16px'
  screen-desktop: '22px'
components:
  game-card:
    background: '{colors.surface-card}'
    border-color: '{colors.border-subtle}'
    radius: '{rounded.lg}'
  action-primary:
    accent: '{colors.accent-collection}'
    radius: '{rounded.sm}'
    min-hit-target: '44px'
  action-secondary:
    border-color: '{colors.border-subtle}'
    radius: '{rounded.sm}'
    min-hit-target: '44px'
  card-readable-stat:
    color: '{colors.ink-primary}'
    typography: '{typography.card-stat}'
  focus-ring:
    color: '{colors.focus-visible}'
    width: '3px'
---

# CardForge — DESIGN.md

> **Statut : proposition de langage visuel pour revue avec le porteur.** L'orientation générale (collection immersive, univers distincts, cartes illustrées façon jeu de cartes fantasy, mobile-first, illustrations fixes, lisibilité de valeurs/factions) est **validée** dans `docs/cadrage.md`. Les valeurs de couleur, police, rayon et espacement ci-dessus sont **un point de départ issu de `src/styles.css` quand elles existent**, sinon un **[PROPOSITION SALLY]** : leur inclusion ne vaut pas validation artistique. Les deux moteurs de règles et leurs données restent indépendants de ces tokens.

## Brand & Style

CardForge est une bibliothèque de mondes : le catalogue relie cinq jeux de cartes solo grâce à une identité commune, mais chaque jeu possède un imaginaire et une mise en scène propres. La promesse visuelle : **collection de cartes illustrées à personnages, factions et puissances lisibles**, dans l'esprit des jeux de cartes fantasy à collectionner, sans ajout de capacité et sans effacement des informations utiles aux règles.

**Déjà décidé :** esthétique immersive, illustration **fixe** par carte dans le MVP, cartes non limitées à un habillage de carte traditionnelle, distinction claire entre présentation et modèle métier (AD-05). **[PROPOSITION SALLY]** : conserver le socle sombre et les accents dorés actuellement présents dans le prototype comme identité « cadre » de la collection ; chaque monde peut avoir ses propres images, motifs de fond et accent secondaire, sans modifier le contraste ni les composants de commande.

Les univers recensés dans le catalogue actuel restent des références provisoires ; **« Les Douze Tyrans » / Grèce antique** est le titre et l'univers validés, malgré la présentation historique « Regicide / Fantasy héroïque » encore dans le code. **« Thunderfighter »** est le titre public **validé le 23 novembre 2026** pour Gridcannon V2 ; « Bastion Stellaire » est abandonné.

## Colors

| Token | Destination | Statut |
| --- | --- | --- |
| `{colors.shell-base}`, `{colors.surface-card}`, `{colors.ink-primary}` | Shell principal, catalogue, corps de texte | Relevé dans `src/styles.css` |
| `{colors.accent-collection}` | Identité commune, accent ponctuel, action principale | Approximation du prototype ; validation visuelle à demander |
| `{colors.ctd-ambiance}`, `{colors.gridcannon-ambiance}` | Atmosphère des deux jeux MVP, fonds décoratifs uniquement | Couleurs du catalogue existant, **non charte finale** |
| `{colors.card-capture-ambiance}`, `{colors.loot-the-loop-ambiance}`, `{colors.twelve-tyrants-ambiance}` | Repères futurs, sans livrer les jeux | Provisoire ; univers des Douze Tyrans à redessiner selon la Grèce antique |
| `{colors.focus-visible}`, `{colors.danger-text}`, `{colors.success-text}` | Focus et retours d'état sémantiques | **[PROPOSITION SALLY]**, à valider par test de contraste réel |

**Règles contraignantes :** couleur seule ne signifie jamais une enseigne, une faction, un coup légal, un statut « disponible » ou une victoire ; ajouter nom, forme, pictogramme et/ou texte. Une teinte de faction ou d'univers ne change jamais une enseigne de règle. Tester les contrastes sur carte et fond illustrés, pas seulement sur surfaces unies.

## Typography

- **Titres de collection :** `{typography.display}`, prolongement de Georgia utilisée par `src/styles.css`. [PROPOSITION] Ne pas imposer cette police aux chiffres des cartes.
- **Information métier :** `{typography.card-stat}` pour rang, puissance, résistance totale, armure et compteur ; ces données sont hors de l'illustration, au-dessus du décor et non cachées par une texture.
- **Textes et contrôles :** `{typography.body}` et `{typography.meta}` avec adaptation à l'agrandissement du texte. La lisibilité de la puissance d'une carte prime sur les noms de personnages longs.
- Les chiffres d'attaque, les restrictions d'enseigne/couleur et les états doivent rester identifiables dans les deux langues ; ne pas dessiner de texte fixe FR/EN au sein des illustrations exportées.

## Layout & Spacing

**Mobile-first validé.** Le catalogue est une galerie responsive, la fiche de jeu une composition principalement verticale et les plateaux privilégient la zone de jeu avant la décoration.

| Contexte | Composition proposée | Contraintes |
| --- | --- | --- |
| Catalogue mobile | 1 colonne ; image de monde en tête de carte, informations puis état | Prioriser le titre et « À venir »/« Disponible » sans fausse action |
| Catalogue tablette/desktop | 2–3 colonnes selon espace réellement utile | Ne pas confondre ordre de présentation et rang du jeu |
| Fiche jeu | Image/identité, description courte, actions Jouer/Reprendre/Règles/Statistiques | Boutons libellés visibles, pas d'icônes isolées |
| Plateau CTD portrait | Bandeau compact, monstres/attaques, main et actions persistantes accessibles | Quatre colonnes sans valeur tronquée ; défilement/agrandissement autorisé sans changement d'ordre |
| Plateau Gridcannon portrait | En-tête avec état et compteur, grille 3×3 entière, figures périphériques, réserve spéciale et action | Zoom/panoramique facultatifs, contenu du plateau jamais coupé irrécupérablement |
| Plateau paysage/desktop | Grille centrale et panneaux latéraux contextualisés | Actions identiques à mobile, sans avantage d'information cachée |

**[PROPOSITION SALLY]** conserver une échelle 4/8/12/16/20/24/32 et des marges mobiles `{spacing.screen-mobile}` ; ajuster les densités après maquettes et essais de taille de cartes. Aucune largeur fixe ne doit rendre une case inaccessible.

## Elevation & Depth

Élévation décorative limitée au catalogue et aux inspections de cartes. Éviter des ombres massives dans les zones de combat : elles doivent rester discernables, même sans animation. Les fenêtres de confirmation et d'inspection apparaissent au-dessus du jeu sans modifier les états de cartes.

**[PROPOSITION SALLY]** : distinguer la carte sélectionnée par bordure nette + marqueur textuel, la destination légale par contour léger + libellé accessible, et une zone interdite par absence de sélection et explication accessible. Les animations ne constituent jamais le seul retour.

## Shapes

`{rounded.sm}` pour boutons et champs, `{rounded.lg}` pour cartes de catalogue ; les cartes de jeu restent des **objets de collection illustrés**, avec cadre, éléments de faction, puissance et personnage. `{rounded.full}` n'est autorisé que pour des indicateurs très compacts, sans obligation d'utiliser des pastilles.

**[PROPOSITION SALLY]** : employer des cadres et motifs spécifiques aux univers, mais conserver une structure de carte reconnaissable pour la navigation et l'accessibilité. L'image ne définit jamais l'identifiant physique `cardId`.

## Components

| Composant visuel | Anatomie obligatoire | Variantes et contraintes |
| --- | --- | --- |
| `GameWorldCard` | Image de monde, titre, pitch, état, action contextuelle | Pas de bouton Jouer pour jeux à venir ; afficher partie active sans masquer état |
| `GameHero` | Titre du jeu, univers, crédits de source accessibles | Titre Gridcannon provisoire tant que non vérifié |
| `CollectibleCard` | Personnage illustré, nom, repère de faction/enseigne, rang/puissance lisibles | Visuel propre au jeu ; une carte logique peut changer d'illustration sans changer ses règles |
| `CardFaceDown` | Dos identifiable et quantité autorisée, sans rang/enseigne cachés | Gridcannon GC-29 : pioche fermée, compteur exact dérivé de l'état |
| `FigureStatus` | Figure, résistance courante totale, armure cumulée, état vivante/vaincue | GC-22 : détail de chaque armure sur demande, seuil de défaite lisible |
| `CardStack` | Sommet visible, bordures décalées, nombre de cartes | GC-42 ; inspection du contenu **connu** seulement GC-43 |
| `ResourceMiniCard` | Type As/Joker, identité visuelle, état disponible/utilisé | GC-30 : n'afficher que ressources découvertes, jamais des cartes cachées |
| `LegalDestination` | Contour + symbole non chromatique et état clavier | GC-38 : guidage de légalité, pas recommandation stratégique |
| `ActionPreview` | Source, destination, deux axes éventuels, puissances, résistance et conséquence | GC-23 : complet avant confirmation, aucun effet réel |
| `ActionBar` | Action principale, annulation, accès à l'aide/inspection, statut de sauvegarde | Ne jamais reléguer un geste indispensable à un drag-and-drop seul |
| `SaveStatus` | Texte « Enregistrement… », « Enregistré » ou erreur | GC-46 : sobriété et exactitude ; jamais de succès anticipé |
| `ResultScene` | Victoire/défaite, résumé chiffré, Rejouer, Catalogue | Réduction des mouvements, pas d'écran bloquant |
| `FocusRing` | Contour visible `{colors.focus-visible}` | Toutes commandes et cartes activables au clavier |
| `ConfirmDialog` | Titre explicite, impact, Annuler, Confirmer/Abandonner | Bouton dangereux clairement nommé, pas de double confirmation GC-52 |

## Do's and Don'ts

| À faire | À éviter |
| --- | --- |
| Prioriser plateau, information réglementaire, feedback et accessibilité | Faire primer l'illustration sur un seuil de résistance ou une sélection légale |
| Utiliser la même anatomie d'action et de confirmation entre jeux | Mutualiser leurs règles et leurs pouvoirs sous prétexte de cohérence visuelle |
| Afficher statut de sauvegarde exact, accessible et discret | Afficher « Enregistré » avant transaction IndexedDB confirmée |
| Proposer inspection sans jouer ni consommer une carte | Révéler le contenu futur d'une pioche par effet de survol ou de zoom |
| Conserver les ressources du MVP pour une partie hors ligne | Dépendre d'une image ou police distante pour identifier une carte |
| Préserver les décisions GC-22..53 et CTD-ARB-01..14 | Multiplier des demandes d'arbitrage UX sur les mécanismes déjà validés |

## Statut de validation

Les **principes** de collection, de cartes illustrées, d'univers indépendants et d'accessibilité sont hérités de décisions déjà prises. La **palette complète, la taille des cartes, le détail des motifs et la direction artistique finalisée** restent à valider sur maquettes auprès du porteur ; les chiffres CSS repris du prototype ne sont pas une homologation de charte. Aucun mock, test de contraste ou essai utilisateur n'a été exécuté. Ce document forme avec [EXPERIENCE.md](./EXPERIENCE.md) la base contractuelle UX à consolider par Sally avant développement d'interface.

## Mise à jour validée — titre et univers Thunderfighter (23 novembre 2026)

**Thunderfighter** est le **nom public désormais validé** de l'adaptation Gridcannon V2 ; **Bastion Stellaire est abandonné**. La direction graphique **rétrofuturiste pulp spatiale, évoquant l'esprit Buck Rogers**, a été appréciée et validée comme ambiance générale, avec l'organisation des écrans, lors de la revue visuelle du 23 novembre. Cette inspiration n'autorise pas la reproduction d'éléments graphiques protégés d'une franchise ; privilégier des illustrations originales.

Dans les nouveaux écrans, afficher **Thunderfighter** et conserver « Gridcannon, créé par Tom Francis » dans les crédits et informations de règles. Le choix du nom n'implique **aucune modification des règles, cartes ou statistiques**. Les mentions anciennes de « Bastion Stellaire » dans ce document décrivent l'état antérieur de la conception.
