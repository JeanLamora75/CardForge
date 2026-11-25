# ThunderFighter — Référentiel artistique des cartes numériques V1
Date : 25 novembre 2026. Sally (UX), Mary (règles). Statut : direction et maquette 6 validées par le porteur ; matrice de production proposée sur sa demande, angles et détails à éprouver en recette graphique. Aucun changement de moteur.

## Décisions et correspondances
| Faction | Enseigne logique | Couleur graphique | Alliance (couleur logique) |
|---|---|---|---|
| Nova | ♥ hearts | Orange | Phoenix (rouge) |
| Vector | ♦ diamonds | Jaune | Phoenix (rouge) |
| Aegis | ♠ spades | Bleu | Orion (noir) |
| Solaris | ♣ clubs | Vert | Orion (noir) |

La dernière correspondance validée prime sur les propositions antérieures. Les enseignes classiques restent visibles, colorées selon la faction et non selon la couleur historique. Phoenix : insigne blanc d'oiseau stylisé, corps vertical et deux paires d'ailes déployées. Orion : insigne blanc de deux chevrons descendants superposés et pointe centrale supérieure. Option A validée ; ne pas revenir au rond/triangle. Les deux insignes sont distincts par leur silhouette, indépendamment de la couleur. Valeurs 2–10 inchangées. Nomenclature validée : Valet = Lieutenant (LT), Dame = Commandant (CMD), Roi = Amiral (ADM), As = Alpha (α), Joker = Singularité (SIG). Les figures et spéciales feront l'objet d'une planche distincte ; ne pas attribuer de faction/alliance aux jokers. Traductions FR/EN à vérifier.

## Matrice Phoenix
ADN : coques anguleuses, lignes offensives, propulsion apparente. Nova : accents orange, énergie chaude ; Vector : accents jaunes, détails géométriques et précis.
| Valeur | Classe | Silhouette | Angle de vue |
|---:|---|---|---|
| 2 | Éclaireur | Fuselage étroit, ailes courtes en flèche, deux petits réacteurs | Dessus, inclinaison 15° |
| 3 | Intercepteur | Nez allongé, ailes en delta, moteurs jumelés | Trois-quarts avant gauche, plongée 25° |
| 4 | Chasseur d'assaut | Ailes inversées, cockpit central, armements latéraux | Face avant, plongée 10° |
| 5 | Frégate légère | Coque longitudinale, nacelles latérales, blindage segmenté | Trois-quarts avant droit, plongée 20° |
| 6 | Chasseur lourd | Silhouette de la maquette validée, structure équilibrée et offensive | Angle de la maquette validée |
| 7 | Corvette d'assaut | Coque épaisse, ailes renforcées, modules d'armement apparents | Trois-quarts avant gauche, contre-plongée 15° |
| 8 | Destroyer | Coque en pointe massive, quatre réacteurs, ailerons arrière | Trois-quarts arrière droit, plongée 20° |
| 9 | Croiseur d'attaque | Long fuselage blindé, pont central surélevé, structures latérales | Profil gauche, plongée 15° |
| 10 | Cuirassé de percée | Coque monumentale en fer de lance, architecture à plusieurs niveaux | Trois-quarts avant droit, contre-plongée 20° |

## Matrice Orion
ADN : coques enveloppantes, courbes technologiques, structures symétriques. Aegis : accents bleus, blindage apparent ; Solaris : accents verts, énergie fluide.
| Valeur | Classe | Silhouette | Angle de vue |
|---:|---|---|---|
| 2 | Drone éclaireur | Petite coque ovoïde, deux ailerons courbes, noyau central | Dessus, inclinaison 15° |
| 3 | Intercepteur tactique | Fuselage compact, ailes en croissant, moteurs intégrés | Trois-quarts avant droit, plongée 25° |
| 4 | Chasseur avancé | Coque arrondie, ailes enveloppantes, double nacelle énergétique | Face avant, plongée 10° |
| 5 | Corvette de soutien | Corps central large, modules symétriques, blindage périphérique | Trois-quarts avant gauche, plongée 20° |
| 6 | Frégate tactique | Silhouette de la maquette validée, structure équilibrée et technologique | Angle de la maquette validée |
| 7 | Frégate lourde | Coque imposante, arcs latéraux, noyau énergétique protégé | Trois-quarts avant droit, contre-plongée 15° |
| 8 | Destroyer technologique | Grande coque elliptique, structures concentriques, moteurs encastrés | Trois-quarts arrière gauche, plongée 20° |
| 9 | Croiseur supérieur | Architecture étagée, anneaux partiels, pont de commandement intégré | Profil droit, plongée 15° |
| 10 | Bastion stellaire | Coque monumentale symétrique, noyau central massif, arcs protecteurs | Trois-quarts avant gauche, contre-plongée 20° |

## Contrat de production
- 18 modèles de référence (9 par alliance), 36 illustrations finales (9 par faction). Même classe, silhouette de base et angle pour les deux factions d'une alliance à valeur égale ; accents et détails secondaires propres à chaque faction. Exception : préserver les quatre rendus 6 validés, sans les remplacer arbitrairement.
- Progression visuelle : 2–4 légers, 5–7 moyens, 8–10 lourds. Classes exclusivement narratives : aucun pouvoir, bonus, comportement ou statistique supplémentaire.
- Conserver le gabarit de la carte 6 : illustration SF pulp, valeur dominante, enseigne explicite, nom de faction et insigne d'alliance blanc. Position constante des marqueurs sur toutes les cartes ; fond spatial sombre, contraste suffisant, pas de confusion entre accents de faction. Angles indicatifs de cadrage, à ajuster sans changer les silhouettes.
- Produire d'abord les valeurs 2, 6, 10 des deux alliances, contrôler le rendu compact du plateau et la vue détaillée, puis les intermédiaires. Éviter tout texte généré dans l'illustration seule ; privilégier les marqueurs d'interface séparés et accessibles, conformément à TF-UX-03.
- La maquette 6 est validée dans la conversation ; son fichier graphique n'est pas inclus dans ce commit. Retrouver l'original avant toute production qui en dépend. Les insignes sont décrits, pas livrés comme fichiers SVG définitifs.
- Critères de recette : 36 combinaisons distinctes et complètes ; chaque valeur, enseigne, alliance lisible en miniature ; mêmes symboles en détail et sur plateau ; couleurs non seules porteuses d'information ; six résolutions de référence, FR/EN, clavier/tactile, hors ligne ; aucun contenu futur/caché révélé.
- Vérifier l'existant (src/application/thunderfighter-card-view.ts et thunderfighter-art.ts) avant intégration ; le premier utilise encore les libellés classiques au moment de cette rédaction. Ne pas modifier IDs, rangs, enseignes, couleur logique, sauvegardes ou moteur.
- Règles : Lieutenant résistance 11 toutes enseignes ; Commandant résistance 12 même alliance (couleur logique) ; Amiral résistance 13 même enseigne (faction) ; armure ajoutée à la résistance. Seules les deux cartes intermédiaires contribuent, jamais la carte déclencheuse. Placement des figures et armures conserve ses priorités de ressemblance. Alpha = Extraction, Singularité = Réaffectation.
- Références : [règles](game-rules/gridcannon.md), [UX plateau](ux-thunderfighter-board.md). Périmètre artistique CAR-90 mentionné dans la documentation UX ; aucun ticket Jira modifié ni créé. Aucun script uv ni test exécuté pour cette livraison documentaire.
