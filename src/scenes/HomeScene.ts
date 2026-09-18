import Phaser from "phaser";
import { obtenirCompetence, obtenirInfoMatiere } from "../data/content";
import { chargerEtat, prochaineSeance } from "../data/storage";
import { COULEURS_PHASER } from "../theme";
import { creerBouton } from "../ui/bouton";

// Ecran d'accueil de l'espace eleve : toujours la meme structure, la meme
// place pour chaque element, pour rester previsible. Ne montre jamais tout
// le planning d'un coup, seulement la prochaine seance a faire.
export class HomeScene extends Phaser.Scene {
  constructor() {
    super("HomeScene");
  }

  create(): void {
    const { width, height } = this.scale;
    this.add.rectangle(0, 0, width, height, COULEURS_PHASER.fond).setOrigin(0);

    const etat = chargerEtat();

    if (!etat.profil) {
      this.afficherEspaceNonConfigure();
      return;
    }

    this.add
      .text(width / 2, 90, `Bonjour ${etat.profil.prenom} !`, {
        fontFamily: "sans-serif",
        fontSize: "34px",
        color: "#333333",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const seance = prochaineSeance(etat);

    if (!seance) {
      this.add
        .text(
          width / 2,
          height / 2,
          "Bravo, toutes tes seances prevues sont terminees !\nDemande a un adulte d'en ajouter de nouvelles.",
          {
            fontFamily: "sans-serif",
            fontSize: "22px",
            color: "#666666",
            align: "center",
          },
        )
        .setOrigin(0.5);
      return;
    }

    const info = obtenirInfoMatiere(seance.matiere);
    const competence = obtenirCompetence(seance.matiere, seance.competenceId);

    this.add
      .text(width / 2, height / 2 - 120, "Aujourd'hui, tu vas faire :", {
        fontFamily: "sans-serif",
        fontSize: "22px",
        color: "#666666",
      })
      .setOrigin(0.5);

    // Carte de la seance : toujours au meme endroit, meme apparence.
    this.add
      .rectangle(width / 2, height / 2 - 20, 520, 160, 0xffffff)
      .setStrokeStyle(3, COULEURS_PHASER.bordure);
    this.add
      .text(width / 2, height / 2 - 55, `${info.icone} ${info.label}`, {
        fontFamily: "sans-serif",
        fontSize: "24px",
        color: "#333333",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.add
      .text(width / 2, height / 2 - 10, competence?.titre ?? "", {
        fontFamily: "sans-serif",
        fontSize: "20px",
        color: "#333333",
        align: "center",
        wordWrap: { width: 460 },
      })
      .setOrigin(0.5);

    creerBouton(this, width / 2, height / 2 + 130, 240, 60, "Commencer", () => {
      this.scene.start("SessionScene", { seanceId: seance.id });
    });
  }

  private afficherEspaceNonConfigure(): void {
    const { width, height } = this.scale;
    this.add
      .text(
        width / 2,
        height / 2,
        "Ton espace n'est pas encore pret.\nDemande a un adulte de le configurer\n(page reglages).",
        {
          fontFamily: "sans-serif",
          fontSize: "22px",
          color: "#666666",
          align: "center",
        },
      )
      .setOrigin(0.5);
  }
}
