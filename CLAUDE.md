# Contexte du projet — je-decouvre

Ce fichier est charge automatiquement par Claude Code au demarrage. Il decrit
le projet, les contraintes de conception et l'etat d'avancement. A tenir a
jour au fil du developpement (ajouter une note dans "Etat actuel" a chaque
etape importante).

## Vision

Application web educative destinee a une personne autiste pour apprendre les
mathematiques, le francais et l'histoire-geographie, en commencant au niveau
6e puis en montant progressivement vers les niveaux superieurs.

Le but est de reproduire l'esprit des logiciels educatifs Generation 5 des
annees 1990-2000 (dont "Je decouvre l'ordinateur", qui donne son nom a ce
depot), avec en plus une couche d'exploration inspiree de Zelda : un monde a
parcourir en vue du dessus, avec des zones/epreuves qui se debloquent au fur
et a mesure de la progression.

**Reference visuelle precise (menus, mascotte ourson, types d'epreuves) :
EN COURS DE DEFINITION.** Ne pas inventer de details sur l'apparence de la
mascotte, les couleurs, ou la mise en page des menus tant que ce n'est pas
confirme par l'utilisateur — demander plutot que de supposer. Si l'utilisateur
fournit une capture d'ecran, une video ou une description, elle doit etre
consignee dans ce fichier (nouvelle section "Reference visuelle") avant de
commencer l'habillage graphique.

## Public cible et contraintes de conception

- Un seul utilisateur, usage local. Pas de comptes, pas de serveur, pas de
  systeme multi-joueur.
- **Contrainte la plus importante du projet : la personne a besoin de
  routine stricte et de tres peu de surprises ou d'alea.** Consequences
  concretes, non negociables sauf instruction contraire explicite de
  l'utilisateur :
  - Aucun evenement aleatoire surprise (pas d'ennemi qui surgit, pas de
    minuteur impose par defaut, pas de changement brusque de regle en cours
    de partie).
  - Retours coherents et repetables : une reponse correcte declenche
    toujours le meme type de feedback (son/animation) ; une reponse
    incorrecte aussi, dans un autre registre mais tout aussi previsible.
  - Navigation previsible : memes emplacements de boutons, memes
    transitions d'un ecran a l'autre, jamais de reorganisation surprise de
    l'interface.
  - Aucune mecanique punitive forte (pas de game over, pas de perte de vie
    definitive, pas de retour en arriere force). Se tromper doit permettre
    de reessayer sans consequence anxiogene.
  - Les regles d'une epreuve sont toujours annoncees clairement avant de la
    commencer, jamais decouvertes en cours de route.
  - Pas d'animations clignotantes, de flashs, ou de sons soudains/forts.
- L'utilisateur (pilote du projet) a quelques notions de developpement (git,
  terminal) mais souhaite que Claude ecrive l'essentiel du code. Il doit
  pouvoir suivre et comprendre les choix (commentaires clairs, explications
  dans les reponses), sans avoir a coder au quotidien. Pas besoin
  d'expliquer les commandes git/terminal de base.

## Stack technique (validee, ne pas remettre en question sans raison forte)

- Phaser 3 (moteur de jeu 2D) + TypeScript + Vite
- Application 100% web statique, aucun backend
- Sauvegarde de progression en `localStorage`, avec une cle versionnee pour
  pouvoir migrer le format plus tard sans casser une sauvegarde existante
- Contenu pedagogique en JSON, entierement separe du code du moteur

## Structure du depot

```
/src        code du moteur de jeu (scenes, entites, UI, sauvegarde)
/content    donnees pedagogiques (JSON) par matiere/niveau/competence
/docs       documentation et decisions de conception
/public     assets statiques (images, sons) une fois definis
```

## Conventions de code

- TypeScript strict active, pas de `any` sans raison explicite.
- Une scene Phaser = un ecran/etape logique du parcours, pas un fourre-tout.
- Toute logique pedagogique (quelle question poser, quel seuil de reussite)
  doit lire ses donnees depuis `/content`, jamais etre codee en dur dans une
  scene.
- Commentaires en francais.

## Instructions immediates pour Claude Code

Si le depot est vide ou ne contient pas encore le squelette technique,
commencer par le mettre en place avant toute autre chose :

1. Initialiser un projet Vite + TypeScript (`npm create vite@latest . --
   --template vanilla-ts`, ou equivalent manuel) et ajouter la dependance
   `phaser`.
2. Creer `src/main.ts` avec une config Phaser minimale (taille fixe,
   `Phaser.Scale.FIT`, pas d'effets aleatoires au niveau moteur).
3. Creer une `BootScene` provisoire qui affiche juste un texte de
   validation ("le moteur fonctionne") — pas d'habillage visuel definitif
   tant que la reference n'est pas fournie.
4. Creer les dossiers `content/mathematiques/6e`, `content/francais/6e`,
   `content/histoire-geographie/6e`, `docs/`, `public/`, chacun avec un
   exemple minimal de fichier JSON pour illustrer le format de contenu.
5. Ajouter un `README.md` avec les instructions `npm install` / `npm run
   dev` / `npm run build`.
6. Ajouter un `.gitignore` standard (node_modules, dist, .DS_Store, etc.).
7. Ne pas commencer la conception des menus, de la mascotte ou du systeme
   de parcours/exploration avant d'avoir demande a l'utilisateur la
   reference visuelle precise si elle n'est pas encore dans ce fichier.

## Etat actuel

- Squelette technique en place : Vite + TypeScript + Phaser 3, `src/main.ts`
  avec config Phaser minimale (taille fixe, `Scale.FIT`, sans alea moteur)
  et `src/scenes/BootScene.ts` provisoire ("Le moteur fonctionne").
- Dossiers `content/mathematiques/6e`, `content/francais/6e`,
  `content/histoire-geographie/6e` crees avec un JSON d'exemple chacun
  (structure : matiere/niveau/competence/questions QCM).
- `docs/`, `public/` (avec `.gitkeep`), `README.md` et `.gitignore` en place.
- Stack et contraintes de conception validees avec l'utilisateur.
- Reference visuelle "Je decouvre l'ordinateur" (Generation 5) pas encore
  precisee — a demander en priorite avant tout travail sur l'interface
  (menus, mascotte, types d'epreuves).

## Prochaines etapes (a affiner avec l'utilisateur)

1. Obtenir la reference visuelle precise (captures d'ecran ou description
   du menu, de la mascotte, des types d'epreuves) et la consigner ici.
2. Concevoir l'architecture du "parcours" : comment une zone/epreuve se
   debloque, comment la progression est representee a l'ecran.
3. Definir le referentiel de competences 6e par matiere (programme officiel
   ou autre source choisie avec l'utilisateur).
4. Implementer le systeme de sauvegarde de progression.
5. Construire un premier module de matiere complet (probablement
   mathematiques) comme gabarit avant de dupliquer pour les deux autres.
