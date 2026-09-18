import { listerCompetencesParMatiere, MATIERES, obtenirCompetence, obtenirInfoMatiere } from "../data/content";
import { ajouterSeance, chargerEtat, sauvegarderProfil, supprimerSeance } from "../data/storage";
import type { Matiere, Seance } from "../data/types";
import { COULEURS_PROFIL } from "../theme";

// Espace reglages : destine a l'accompagnant, separe de l'espace eleve.
// C'est ici (et uniquement ici) que le profil et le planning des seances
// sont crees/modifies. Rendu en DOM classique (formulaires), pas en
// Phaser : plus simple et plus accessible pour ce type d'ecran.

function formaterDate(dateIso: string): string {
  const date = new Date(`${dateIso}T00:00:00`);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function genererId(): string {
  return `seance-${Date.now()}-${Math.round(Math.random() * 100000)}`;
}

export function demarrerEspaceReglages(conteneur: HTMLElement): void {
  const etat = chargerEtat();

  conteneur.innerHTML = `
    <div class="reglages">
      <div class="reglages__entete">
        <h1>Reglages — espace accompagnant</h1>
        <a class="reglages__lien-eleve" href="/">Ouvrir l'espace eleve</a>
      </div>
      <p class="message-info">
        Cet espace sert a creer le profil et a planifier les seances de
        travail. L'eleve n'y a pas acces directement.
      </p>

      <h2>Profil</h2>
      <div class="champ">
        <label for="champ-prenom">Prenom</label>
        <input type="text" id="champ-prenom" maxlength="30" />
      </div>
      <div class="champ">
        <label>Couleur</label>
        <div class="couleurs" id="couleurs"></div>
      </div>
      <button class="bouton" id="bouton-profil">Enregistrer le profil</button>
      <span class="confirmation" id="confirmation-profil" hidden>Enregistre !</span>

      <h2>Planning des seances</h2>
      <p class="message-info">
        Ajoute une seance pour chaque date choisie. L'eleve verra toujours,
        dans son espace, la prochaine seance non terminee — dans cet ordre,
        sans surprise.
      </p>
      <form class="formulaire-seance" id="formulaire-seance">
        <div class="champ">
          <label for="champ-date">Date</label>
          <input type="date" id="champ-date" required />
        </div>
        <div class="champ">
          <label for="champ-matiere">Matiere</label>
          <select id="champ-matiere"></select>
        </div>
        <div class="champ">
          <label for="champ-competence">Competence</label>
          <select id="champ-competence"></select>
        </div>
        <button class="bouton" type="submit">Ajouter la seance</button>
      </form>

      <ul class="liste-seances" id="liste-seances"></ul>
    </div>
  `;

  // --- Profil ---
  const champPrenom = conteneur.querySelector<HTMLInputElement>("#champ-prenom")!;
  const conteneurCouleurs = conteneur.querySelector<HTMLDivElement>("#couleurs")!;
  const boutonProfil = conteneur.querySelector<HTMLButtonElement>("#bouton-profil")!;
  const confirmationProfil = conteneur.querySelector<HTMLSpanElement>("#confirmation-profil")!;

  champPrenom.value = etat.profil?.prenom ?? "";
  let couleurSelectionnee = etat.profil?.couleur ?? COULEURS_PROFIL[0].id;

  function dessinerCouleurs(): void {
    conteneurCouleurs.innerHTML = "";
    for (const couleur of COULEURS_PROFIL) {
      const pastille = document.createElement("button");
      pastille.type = "button";
      pastille.className = "couleurs__pastille";
      if (couleur.id === couleurSelectionnee) {
        pastille.className += " couleurs__pastille--selection";
      }
      pastille.style.background = couleur.hex;
      pastille.title = couleur.label;
      pastille.addEventListener("click", () => {
        couleurSelectionnee = couleur.id;
        dessinerCouleurs();
      });
      conteneurCouleurs.appendChild(pastille);
    }
  }
  dessinerCouleurs();

  boutonProfil.addEventListener("click", () => {
    const prenom = champPrenom.value.trim();
    if (!prenom) {
      champPrenom.focus();
      return;
    }
    sauvegarderProfil({ prenom, couleur: couleurSelectionnee });
    confirmationProfil.hidden = false;
    window.setTimeout(() => {
      confirmationProfil.hidden = true;
    }, 2000);
  });

  // --- Planning ---
  const champDate = conteneur.querySelector<HTMLInputElement>("#champ-date")!;
  const champMatiere = conteneur.querySelector<HTMLSelectElement>("#champ-matiere")!;
  const champCompetence = conteneur.querySelector<HTMLSelectElement>("#champ-competence")!;
  const formulaireSeance = conteneur.querySelector<HTMLFormElement>("#formulaire-seance")!;
  const listeSeances = conteneur.querySelector<HTMLUListElement>("#liste-seances")!;

  for (const matiere of MATIERES) {
    const option = document.createElement("option");
    option.value = matiere.id;
    option.textContent = `${matiere.icone} ${matiere.label}`;
    champMatiere.appendChild(option);
  }

  function rafraichirCompetences(): void {
    const matiere = champMatiere.value as Matiere;
    champCompetence.innerHTML = "";
    for (const competence of listerCompetencesParMatiere(matiere)) {
      const option = document.createElement("option");
      option.value = competence.competence;
      option.textContent = competence.titre;
      champCompetence.appendChild(option);
    }
  }
  champMatiere.addEventListener("change", rafraichirCompetences);
  rafraichirCompetences();

  function dessinerListeSeances(): void {
    const etatActuel = chargerEtat();
    const seances = [...etatActuel.seances].sort((a, b) => a.date.localeCompare(b.date));

    listeSeances.innerHTML = "";
    if (seances.length === 0) {
      const vide = document.createElement("p");
      vide.className = "message-info";
      vide.textContent = "Aucune seance planifiee pour le moment.";
      listeSeances.appendChild(vide);
      return;
    }

    for (const seance of seances) {
      listeSeances.appendChild(creerLigneSeance(seance));
    }
  }

  function creerLigneSeance(seance: Seance): HTMLLIElement {
    const info = obtenirInfoMatiere(seance.matiere);
    const competence = obtenirCompetence(seance.matiere, seance.competenceId);

    const ligne = document.createElement("li");
    ligne.className = "seance-ligne";
    ligne.innerHTML = `
      <span class="seance-ligne__icone">${info.icone}</span>
      <span class="seance-ligne__details">
        <div class="seance-ligne__titre">${competence?.titre ?? seance.competenceId}</div>
        <div class="seance-ligne__date">${formaterDate(seance.date)}</div>
      </span>
      ${seance.termineeLe ? '<span class="seance-ligne__statut">Terminee</span>' : ""}
    `;

    const boutonSupprimer = document.createElement("button");
    boutonSupprimer.className = "bouton bouton--danger";
    boutonSupprimer.type = "button";
    boutonSupprimer.textContent = "Supprimer";
    boutonSupprimer.addEventListener("click", () => {
      supprimerSeance(seance.id);
      dessinerListeSeances();
    });
    ligne.appendChild(boutonSupprimer);

    return ligne;
  }

  formulaireSeance.addEventListener("submit", (evenement) => {
    evenement.preventDefault();
    if (!champDate.value) {
      champDate.focus();
      return;
    }
    const nouvelleSeance: Seance = {
      id: genererId(),
      date: champDate.value,
      matiere: champMatiere.value as Matiere,
      competenceId: champCompetence.value,
      termineeLe: null,
    };
    ajouterSeance(nouvelleSeance);
    champDate.value = "";
    dessinerListeSeances();
  });

  dessinerListeSeances();
}
