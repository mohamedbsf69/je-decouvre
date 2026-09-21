---
name: lancer-reglages
description: Demarre le serveur de developpement du projet je-decouvre et ouvre directement l'espace reglages (accompagnant) dans le Browser pane, a l'adresse http://localhost:5173/#reglages. Utilise cette skill des que l'utilisateur veut configurer le profil eleve, planifier ou modifier des seances, ou dit vouloir "lancer l'app cote reglages", "ouvrir les reglages", "configurer l'espace accompagnant" ou "acceder a la config", meme sans mentionner le mot "skill".
---

# Lancer l'espace reglages (je-decouvre)

Ouvre l'espace destine a l'accompagnant : creation du profil (prenom +
couleur) et planning manuel des seances (date + matiere + competence).
Voir `src/reglages/reglages.ts` pour le detail de cet ecran.

## Etapes

1. Demarre (ou reutilise s'il tourne deja) le serveur de dev avec l'outil
   `preview_start`, en passant `name: "je-decouvre-dev"` — la config existe
   deja dans `.claude/launch.json` (`npm run dev`, port 5173). Recupere le
   `tabId` renvoye.
2. Avec l'outil `navigate`, charge `http://localhost:5173/#reglages` sur ce
   meme `tabId`.
3. Confirme brievement que l'espace reglages est ouvert. Si aucun profil
   n'est encore enregistre, rappelle en une phrase que c'est ici qu'on cree
   le profil et qu'on planifie les seances — pas besoin de detailler tout
   le formulaire sauf si l'utilisateur le demande.

## Pourquoi cet ordre precis

L'application route selon le `#hash` de l'URL au chargement de la page
(`src/main.ts`) : `#reglages` affiche les formulaires DOM de l'accompagnant,
l'absence de hash affiche l'espace eleve (Phaser). Naviguer directement vers
l'URL avec le hash deja present evite un rechargement de page supplementaire
(le `hashchange` listener de l'app ne sert qu'a recharger quand l'utilisateur
change de hash *apres* le premier chargement).
