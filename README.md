# je-decouvre

Application web educative (Phaser 3 + TypeScript + Vite) pour apprendre les
mathematiques, le francais et l'histoire-geographie, en commencant au
niveau 6e. Voir [CLAUDE.md](./CLAUDE.md) pour le contexte complet du projet.

## Installation

```bash
npm install
```

## Developpement

```bash
npm run dev
```

## Build de production

```bash
npm run build
```

## Structure du depot

- `src/` — code du moteur de jeu (scenes, entites, UI, sauvegarde)
- `content/` — donnees pedagogiques (JSON) par matiere/niveau/competence
- `docs/` — documentation et decisions de conception
- `public/` — assets statiques (images, sons)
