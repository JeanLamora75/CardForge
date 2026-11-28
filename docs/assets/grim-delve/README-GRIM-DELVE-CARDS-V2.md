# Grim Delve — Cartes V2

Lot complémentaire V1 : 36 cartes (2 à 10) et 4 emblèmes. Aucun fichier V1 dupliqué.

Extraire à la racine du dépôt après contrôle des collisions. Les emblèmes sont classés dans icons/grim-delve (choix de classement fonctionnel selon le référentiel). Fusionner le fragment de manifeste avec le manifeste principal sans écraser les entrées existantes. Les WebP fournis sont préoptimisés par Pillow qualité 82, max 1000 px ; régénérer via npm run assets:optimize (Sharp). Vérifier build, tests, PWA, CI et rendu mobile FR/EN. Aucun uv. Aucune validation CI ni comparaison GitHub actuelle effectuée.

Les illustrations de la dague elfique (2) montrent deux lames et la lame lunaire (5) une épée fine ; variantes visuelles retenues sans incidence sur les règles.

## Correspondances

| Chemin PNG | Nom | Source |
|---|---|---|
| `public/assets/cards/grim-delve/hearts-2.png` | Épée courte | `a_dramatic_highly_detailed_fantasy_still_life_sce.png` |
| `public/assets/cards/grim-delve/hearts-3.png` | Lance | `a_cinematic_fantasy_still_life_a_detailed_ornate.png` |
| `public/assets/cards/grim-delve/hearts-4.png` | Masse | `a_cinematic_highly_detailed_fantasy_traditional_r.png` |
| `public/assets/cards/grim-delve/hearts-5.png` | Arbalète | `a_detailed_fantasy_still_life_scene_a_richly_deta.png` |
| `public/assets/cards/grim-delve/hearts-6.png` | Marteau | `a_dramatic_highly_detailed_fantasy_illustration.png` |
| `public/assets/cards/grim-delve/hearts-7.png` | Hallebarde | `a_dramatic_fantasy_illustration_a_detailed_ornate.png` |
| `public/assets/cards/grim-delve/hearts-8.png` | Espadon | `a_dramatic_fantasy_close_up_scene_a_massive_ornat.png` |
| `public/assets/cards/grim-delve/hearts-9.png` | Épée sacrée | `a_dramatic_highly_detailed_fantasy_illustration_2.png` |
| `public/assets/cards/grim-delve/hearts-10.png` | Excalibur | `excalibur_dans_la_nef_doréeацарт.png` |
| `public/assets/cards/grim-delve/diamonds-2.png` | Dague elfique | `a_detailed_fantasy_illustration_two_elegant_elven.png` |
| `public/assets/cards/grim-delve/diamonds-3.png` | Flèche enchantée | `a_detailed_fantasy_illustration_a_close_up_single.png` |
| `public/assets/cards/grim-delve/diamonds-4.png` | Arc elfique | `a_highly_detailed_fantasy_illustration_an_ornate.png` |
| `public/assets/cards/grim-delve/diamonds-5.png` | Lame lunaire | `a_highly_detailed_fantasy_illustration_an_elegant.png` |
| `public/assets/cards/grim-delve/diamonds-6.png` | Lance runique | `a_highly_detailed_fantasy_illustration_a_single_e.png` |
| `public/assets/cards/grim-delve/diamonds-7.png` | Sceptre arcanique | `a_highly_detailed_fantasy_fantasy_illustration_no.png` |
| `public/assets/cards/grim-delve/diamonds-8.png` | Arc ancestral | `a_detailed_fantasy_illustration_of_an_ornate_magic.png` |
| `public/assets/cards/grim-delve/diamonds-9.png` | Lame astrale | `a_detailed_fantasy_illustration_a_glowing_magical.png` |
| `public/assets/cards/grim-delve/diamonds-10.png` | Fureur des arcanes | `a_highly_detailed_fantasy_magical_scene_an_ancien.png` |
| `public/assets/cards/grim-delve/clubs-2.png` | Gourdin | `gourdin_orc_ancestral_aux_lueurs_vertes.png` |
| `public/assets/cards/grim-delve/clubs-3.png` | Hachette | `hachette_orque_devant_une_forteresse_en_flammes.png` |
| `public/assets/cards/grim-delve/clubs-4.png` | Hache de guerre | `hache_orque_runique_devant_la_forge_maudite.png` |
| `public/assets/cards/grim-delve/clubs-5.png` | Masse tribale | `masse_tribale_orque_sur_autel_enflammé.png` |
| `public/assets/cards/grim-delve/clubs-6.png` | Marteau de guerre | `marteau_de_guerre_orc_devant_la_forteresse_en_flam.png` |
| `public/assets/cards/grim-delve/clubs-7.png` | Totem chamanique | `totem_orcique_au_cristal_émeraude.png` |
| `public/assets/cards/grim-delve/clubs-8.png` | Hache double | `hache_orque_runique_au_cœur_de_la_forteresse.png` |
| `public/assets/cards/grim-delve/clubs-9.png` | Arme du titan | `hache_de_guerre_runique_dans_la_brume_verte.png` |
| `public/assets/cards/grim-delve/clubs-10.png` | Rage ancestrale | `hache_orque_ancestrale_dans_la_tempête.png` |
| `public/assets/cards/grim-delve/spades-2.png` | Dague rituelle | `dague_rituelle_aux_runes_violettes.png` |
| `public/assets/cards/grim-delve/spades-3.png` | Crâne ensorcelé | `crâne_runique_enflammé_dans_une_crypteҟь.png` |
| `public/assets/cards/grim-delve/spades-4.png` | Grimoire | `grimoire_spectral_aux_lueurs_violettes.png` |
| `public/assets/cards/grim-delve/spades-5.png` | Chaînes spectrales | `chaînes_spectrales_dans_les_ténèbres_gbc.png` |
| `public/assets/cards/grim-delve/spades-6.png` | Faux maudite | `faucheuse_spectrale_dans_un_cimetière_maudit.png` |
| `public/assets/cards/grim-delve/spades-7.png` | Orbe des âmes | `l_orbe_violet_des_âmes_captives.png` |
| `public/assets/cards/grim-delve/spades-8.png` | Sceptre de la mort | `bâton_nécromantique_au_crâne_violet.png` |
| `public/assets/cards/grim-delve/spades-9.png` | Invocation spectrale | `roi_spectre_du_cercle_rituel.png` |
| `public/assets/cards/grim-delve/spades-10.png` | Tempête des âmes | `vortex_spectral_autour_du_cristal_violet.png` |
| `public/assets/icons/grim-delve/faction-hearts.png` | Lion doré | `emblème_royal_du_lion_doré_en_majesté.png` |
| `public/assets/icons/grim-delve/faction-diamonds.png` | Arbre argenté | `emblème_elfique_d_arbre_cristallin.png` |
| `public/assets/icons/grim-delve/faction-clubs.png` | Crâne tribal | `emblème_de_crâne_orque_guerrier.png` |
| `public/assets/icons/grim-delve/faction-spades.png` | Crâne spectral | `emblème_gothique_du_crâne_violet.png` |
