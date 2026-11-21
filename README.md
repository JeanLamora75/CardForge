# CardForge

Collection de jeux de cartes solo à identités graphiques distinctes.

## Vision
- Application gratuite, sans publicité et sans achat intégré en V1.
- Web responsive d'abord, PWA et Android (Capacitor) ensuite.
- Moteur de cartes partagé et moteurs de règles isolés par jeu.
- Cartes illustrées originales : faction, personnage et puissance remplacent visuellement les enseignes classiques.
- Fonctionnement local et hors ligne à terme ; sauvegarde locale.
- Premier candidat : **Clear the Dungeon** (Dark Fantasy).

> **État du projet : socle initial / catalogue de démonstration.** Aucune partie de Clear the Dungeon n'est encore jouable. La transcription des règles et les droits de publication doivent être validés avant intégration et diffusion.

## Démarrer

Prérequis : Node.js 22+.

```bash
npm install
npm run dev
```

`npm run build` valide TypeScript et produit le site statique.
`npm run test` exécute les tests du moteur de cartes.

## Structure
- `src/core/` : primitives neutres de cartes et de paquet.
- `src/games/` : futurs moteurs de règles séparés.
- `src/catalog.ts` : catalogue et univers graphiques.
- `src/App.tsx` : écran d'accueil mobile-first.
- `docs/` : cadrage et exigences.

## Droits
Les mécaniques et illustrations des jeux tiers ne sont pas réutilisées ici. Chaque adaptation doit faire l'objet d'une vérification juridique et des autorisations nécessaires. Les illustrations de référence produites en conversation ne sont pas intégrées au dépôt.
