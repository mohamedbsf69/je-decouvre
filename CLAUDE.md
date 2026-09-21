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

- Squelette technique en place : Vite + TypeScript + Phaser 3.
- **V1 fonctionnelle** (decision du 2026-09-18, voir `docs/decisions.md`) :
  avant l'exploration façon Zelda, priorite a une interface simple pour
  enseigner les 3 matieres avec un parcours planifiable par l'utilisateur.
  - Espace reglages (accompagnant), DOM classique, accessible via
    `#reglages` : creation du profil (prenom + couleur) et planning manuel
    des seances (date + matiere + competence), `src/reglages/reglages.ts`.
  - Espace eleve (Phaser) : `HomeScene` affiche la prochaine seance non
    terminee du planning ; `SessionScene` fait passer les questions QCM
    d'une competence avec feedback coherent, retry sans penalite, aucun
    minuteur, et un bouton "Continuer"/"Terminer" clique par l'eleve.
  - Etat (profil/planning/progression) versionne dans `localStorage`
    (`src/data/storage.ts`, cle `je-decouvre:v1`).
  - Contenu charge depuis `/content/**/*.json` via `import.meta.glob`
    (`src/data/content.ts`).
  - Palette de couleurs simple et calme definie dans `src/theme.ts`.
  - Teste manuellement de bout en bout dans le navigateur (creation profil,
    ajout de 2 seances, session complete avec bonne/mauvaise reponse, statut
    "Terminee" mis a jour cote reglages).
  - **Agenda hebdomadaire** (2026-09-21) : `AgendaScene` accessible depuis
    l'accueil eleve via un bouton fixe "Voir mon planning de la semaine".
    Affiche toujours la semaine civile lundi->dimanche contenant la date du
    jour (pas une fenetre glissante), avec le jour courant mis en valeur.
    Logique pure de calcul de semaine dans `src/data/planning.ts`. Le
    bouton generique (`src/ui/bouton.ts`) reduit desormais automatiquement
    la taille du texte s'il est trop long pour tenir dans le bouton.
- **Programme de mathematiques 6e complet** (2026-09-21) : 18 competences
  dans `content/mathematiques/6e/` couvrant les 4 grands domaines du
  programme officiel (nombres et calculs, grandeurs et mesures, espace et
  geometrie, organisation et gestion de donnees), 4 questions QCM chacune.
  Chaque fichier a un champ `ordre` utilise pour trier les listes (menu
  deroulant des reglages, etc. — voir `src/data/content.ts`).
  `content/francais/6e` et `content/histoire-geographie/6e` n'ont encore
  que leur exemple initial — a etoffer de la meme maniere si besoin.
- Reference visuelle "Je decouvre l'ordinateur" (Generation 5) toujours pas
  precisee — l'habillage actuel est un placeholder simple et calme, a
  remplacer quand la reference sera fournie. Decision explicite de
  l'utilisateur (2026-09-21) : rester sur cette interface simple sans
  mascotte pour l'instant, prioriser une app utilisable.

## Prochaines etapes (a affiner avec l'utilisateur)

1. Etoffer le contenu pedagogique de francais et histoire-geographie 6e
   (une seule competence d'exemple chacun pour le moment).
2. Decider si l'accueil eleve doit se lier strictement a la date du jour
   ou continuer a afficher "la prochaine seance non terminee" quelle que
   soit la date (voir note dans `docs/decisions.md`).
3. Obtenir la reference visuelle precise (mascotte, menus) pour habiller
   l'espace eleve au-dela du placeholder actuel — pas urgent, l'utilisateur
   a confirme vouloir d'abord une app utilisable.
4. Envisager, une fois la V1 validee par l'utilisateur, la couche
   d'exploration façon Zelda (monde/zones qui se debloquent) par-dessus le
   systeme de parcours existant.
