# BMAD dans CardForge

Structure d'agents et de workflows **adaptée** à CardForge en s'inspirant de l'organisation BMAD utilisée dans SMN.

Ce dépôt contient des instructions d'agents et un circuit de livrables lisible directement par l'assistant. **Ce n'est pas une installation complète de la distribution officielle BMAD 6.x** : les utilitaires, manifestes d'installation, shims et scripts de SMN ne sont pas copiés, et aucune exécution automatique d'agents n'est garantie par GitHub seul.

## Activer un rôle
Consulter `.agents/skills/bmad-agent-<role>/SKILL.md` et `_bmad/config.yaml`, puis annoncer le rôle chargé et son périmètre. Un agent est une **consigne de travail**, pas un programme autonome.

## Circuit
Mary (analyse) → John (PRD/stories) → Sally (UX) + Winston (architecture) → Amelia (code) → Murat (QA) → Camille (aide).
Les rôles interviennent selon la tâche, sans passage de relais artificiel.

## Garde-fous
- Ne jamais modifier les règles originales au nom d'un simple rethémage.
- Source primaire des règles, cas limites et autorisations vérifiés avant publication.
- Factions/puissances visuelles découplées des enseignes/valeurs internes.
- Pas de monétisation ni de publicité en V1.
- Aucune dépendance obligatoire à un serveur pour les jeux solo.
- Aucun script `uv` requis ni utilisé.
- Publier sur `main`, avec tests et vérification du commit/CI lorsque possible.
- Pas de secrets ni de médias tiers non autorisés dans le dépôt.
