import Phaser from "phaser";
import { obtenirCompetence, obtenirInfoMatiere } from "../data/content";
import type { JourAgenda } from "../data/planning";
import { planningDeLaSemaine } from "../data/planning";
import { chargerEtat } from "../data/storage";
import { COULEURS, COULEURS_PHASER } from "../theme";
import { creerBouton } from "../ui/bouton";

const NOMS_JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

function formaterDateCourte(dateIso: string): string {
  const date = new Date(`${dateIso}T00:00:00`);
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function estAujourdhui(dateIso: string): boolean {
  return dateIso === new Date().toISOString().slice(0, 10);
}

// Planning de la semaine (lundi a dimanche) : toujours accessible au meme
// endroit depuis l'accueil, toujours la meme semaine civile, pour que
// l'eleve sache a l'avance ce qui l'attend (previsibilite plutot que
// surprise).
export class AgendaScene extends Phaser.Scene {
  constructor() {
    super("AgendaScene");
  }

  create(): void {
    const { width, height } = this.scale;
    this.add.rectangle(0, 0, width, height, COULEURS_PHASER.fond).setOrigin(0);

    this.add
      .text(width / 2, 44, "Ton planning de la semaine", {
        fontFamily: "sans-serif",
        fontSize: "28px",
        color: COULEURS.texte,
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const etat = chargerEtat();
    const jours = planningDeLaSemaine(etat);

    const largeurLigne = 780;
    const hauteurLigne = 74;
    const yDepart = 100;

    jours.forEach((jour, index) => {
      this.dessinerLigneJour(jour, index, width / 2, yDepart + index * hauteurLigne, largeurLigne, hauteurLigne - 8);
    });

    creerBouton(this, width / 2, height - 46, 240, 56, "Retour a l'accueil", () => {
      this.scene.start("HomeScene");
    });
  }

  private dessinerLigneJour(
    jour: JourAgenda,
    index: number,
    xCentre: number,
    y: number,
    largeur: number,
    hauteur: number,
  ): void {
    const aujourdhui = estAujourdhui(jour.date);

    this.add
      .rectangle(xCentre, y, largeur, hauteur, 0xffffff)
      .setStrokeStyle(aujourdhui ? 3 : 2, aujourdhui ? COULEURS_PHASER.bleu : COULEURS_PHASER.bordure);

    const xGauche = xCentre - largeur / 2 + 24;

    this.add
      .text(xGauche, y, `${NOMS_JOURS[index]}\n${formaterDateCourte(jour.date)}`, {
        fontFamily: "sans-serif",
        fontSize: "15px",
        color: COULEURS.texteClair,
        align: "left",
      })
      .setOrigin(0, 0.5);

    const xContenu = xCentre - largeur / 2 + 190;

    if (jour.seances.length === 0) {
      this.add
        .text(xContenu, y, "Rien de prevu", {
          fontFamily: "sans-serif",
          fontSize: "17px",
          color: "#999999",
          fontStyle: "italic",
        })
        .setOrigin(0, 0.5);
      return;
    }

    const texte = jour.seances
      .map((seance) => {
        const info = obtenirInfoMatiere(seance.matiere);
        const competence = obtenirCompetence(seance.matiere, seance.competenceId);
        const statut = seance.termineeLe ? "  (terminee)" : "";
        return `${info.icone} ${competence?.titre ?? seance.competenceId}${statut}`;
      })
      .join("\n");

    this.add
      .text(xContenu, y, texte, {
        fontFamily: "sans-serif",
        fontSize: "16px",
        color: COULEURS.texte,
        align: "left",
        wordWrap: { width: largeur - 220 },
      })
      .setOrigin(0, 0.5);
  }
}
