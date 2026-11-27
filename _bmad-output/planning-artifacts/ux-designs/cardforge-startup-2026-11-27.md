# CardForge — Démarrage immersif
Validation utilisateur : 27 novembre 2026. Sally — UX.

| ID | Critère d'acceptation |
|---|---|
| CF-LOAD-01 | Fenêtre mobile ouverte avant installation et compilation. |
| CF-LOAD-02 | Fond et logo officiels. |
| CF-LOAD-03 | Jauge animée, réduction des mouvements respectée. |
| CF-LOAD-04 | Pourcentage par jalon, sans promesse de durée. |
| CF-LOAD-05 | Libellé de l'étape courante. |
| CF-LOAD-06 | Navigations et rechargements de préparation en arrière-plan. |
| CF-LOAD-07 | Passage automatique à l'accueil prêt. |
| CF-LOAD-08 | Sauvegardes et statistiques conservées. |
| CF-LOAD-09 | Profil CardForge-Preview et origine 127.0.0.1:4173 conservés. |
| CF-LOAD-10 | Commandes O/N/Q préservées. |
| CF-LOAD-11 | Échec explicite, sans faux 100 %. |
| CF-LOAD-12 | Portrait et paysage. |
| CF-LOAD-13 | FR/EN. |
| CF-LOAD-14 | Aucun clic de confirmation en cas de succès. |
| CF-LOAD-15 | Habillage réutilisable pour Web/PWA et future application mobile. |

Optimisations validées : installation seulement si empreinte dépendances différente ou fichiers manquants ; conversion des illustrations seulement si source, paramètres ou sortie diffèrent. Contrôle des empreintes originales et build/PWA conservés.

## Optimisations complémentaires validées
| ID | Critère |
|---|---|
| CF-LOAD-16 | Progression 20–64 % calculée selon le nombre réellement terminé ; 65 % au passage compilation. |
| CF-LOAD-17 | Compteur FR/EN des illustrations préparées, y compris celles réutilisées après vérification. |
| CF-LOAD-18 | Conversions concurrentes bornées selon les CPU disponibles, maximum quatre. |
| CF-LOAD-19 | Cache persistant dans .cardforge-cache, migration de l'ancien cache si disponible. |
| CF-LOAD-20 | Réutilisation du build uniquement si empreintes sources, configuration, environnement et sortie correspondent. |
| CF-LOAD-21 | Durées réelles des étapes et durée totale dans la console. |
| CF-LOAD-22 | Vérifications SHA des illustrations, bundle PWA et cache navigateur toujours exécutées. |
