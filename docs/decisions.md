# Decisions de conception

## V1 : espace reglages (accompagnant) + espace eleve, planning manuel

Decision prise avec l'utilisateur (2026-09-18) : avant l'exploration façon
Zelda, une premiere version doit permettre d'enseigner les 3 matieres et de
planifier le travail sur une duree choisie, avec un parcours creable par
l'utilisateur et une interface attractive mais previsible.

Choix retenus :

- **Deux espaces separes** : un espace "reglages" pour l'accompagnant
  (profil, planning) et un espace "eleve" qui ne montre que la seance du
  jour, sans aucun bouton de configuration visible.
- **Planning manuel** : l'accompagnant place chaque seance a une date
  choisie (pas de generation automatique en V1).
- **Cote eleve, la logique n'est pas liee strictement a la date du jour** :
  l'accueil affiche toujours la *prochaine seance non terminee* du
  planning, triee par date. Choix fait pour eviter un ecran "rien a faire
  aujourd'hui" qui casserait la routine si l'eleve ouvre l'application un
  autre jour que prevu. A revoir avec l'utilisateur si un lien strict a la
  date reelle est souhaite.
- **Acces aux reglages** : via l'URL `#reglages` (tape dans la barre
  d'adresse), pas de lien visible depuis l'espace eleve. A ce stade, pas de
  protection par mot de passe (usage local, un seul foyer).
- **Style visuel** : palette simple et calme (fond blanc casse, bleu,
  vert, orange doux), sans mascotte ni theme "Generation 5" — provisoire en
  attendant la reference visuelle precise.

## Architecture technique

- L'espace reglages est du DOM/HTML classique (`src/reglages/`), pas du
  Phaser : plus simple et plus accessible pour des formulaires (texte,
  date, listes deroulantes).
- L'espace eleve est en Phaser (`src/scenes/`) : `HomeScene` (accueil,
  prochaine seance) et `SessionScene` (questions QCM d'une competence).
- Le contenu pedagogique (`/content/**/*.json`) est charge au build via
  `import.meta.glob`, jamais par appel reseau a l'execution.
- L'etat (profil, planning, progression) est stocke dans `localStorage`
  sous la cle versionnee `je-decouvre:v1` (voir `src/data/storage.ts`).
