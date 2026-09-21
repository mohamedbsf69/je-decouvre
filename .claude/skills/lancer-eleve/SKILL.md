---
name: lancer-eleve
description: Demarre le serveur de developpement du projet je-decouvre et ouvre directement l'espace eleve dans le Browser pane, a l'adresse http://localhost:5173/ (accueil avec la prochaine seance, planning de la semaine, questions). Utilise cette skill des que l'utilisateur veut voir ou tester ce que voit l'eleve, dit vouloir "lancer l'app cote eleve", "ouvrir l'espace eleve", "voir l'accueil eleve" ou "tester une seance", meme sans mentionner le mot "skill".
---

# Lancer l'espace eleve (je-decouvre)

Ouvre l'espace destine a l'eleve : accueil avec la prochaine seance non
terminee, planning de la semaine (lundi->dimanche), et deroule des
questions QCM. Voir `src/scenes/HomeScene.ts`, `src/scenes/AgendaScene.ts`
et `src/scenes/SessionScene.ts`.

## Etapes

1. Demarre (ou reutilise s'il tourne deja) le serveur de dev avec l'outil
   `preview_start`, en passant `name: "je-decouvre-dev"` — la config existe
   deja dans `.claude/launch.json` (`npm run dev`, port 5173). Recupere le
   `tabId` renvoye.
2. Avec l'outil `navigate`, charge `http://localhost:5173/` (sans hash) sur
   ce meme `tabId`.
3. Confirme brievement que l'espace eleve est ouvert. Si aucun profil n'est
   configure, l'ecran affichera "Ton espace n'est pas encore pret" — dans ce
   cas, propose de lancer plutot la skill `lancer-reglages` pour d'abord
   creer un profil et planifier des seances.

## Pourquoi cet ordre precis

L'application route selon le `#hash` de l'URL au chargement de la page
(`src/main.ts`) : l'absence de hash affiche l'espace eleve (Phaser),
`#reglages` affiche les formulaires de l'accompagnant. Si le tab est deja
ouvert sur `#reglages`, naviguer vers `http://localhost:5173/` change le
hash et recharge la page via le `hashchange` listener de l'app, ce qui est
attendu.
