import Phaser from "phaser";
import { obtenirCompetence, obtenirInfoMatiere } from "../data/content";
import { chargerEtat, prochaineSeance } from "../data/storage";
import { COULEURS, COULEURS_PHASER } from "../theme";
import { creerBouton } from "../ui/bouton";

// Ecran d'accueil de l'espace eleve : toujours la meme structure, la meme
// place pour chaque element, pour rester previsible. Ne montre jamais tout
// le planning d'un coup au centre, seulement la prochaine seance a faire ;
// le planning complet de la semaine reste consultable via un bouton fixe
// en bas d'ecran (toujours au meme endroit, cf. AgendaScene).
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
      .text(width / 2, 80, `Bonjour ${etat.profil.prenom} !`, {
        fontFamily: "sans-serif",
        fontSize: "34px",
        color: COULEURS.texte,
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const seance = prochaineSeance(etat);

    if (!seance) {
      this.add
        .text(
          width / 2,
          height / 2 - 30,
          "Bravo, toutes tes seances prevues sont terminees !\nDemande a un adulte d'en ajouter de nouvelles.",
          {
            fontFamily: "sans-serif",
            fontSize: "22px",
            color: COULEURS.texteClair,
            align: "center",
          },
        )
        .setOrigin(0.5);
      this.afficherBoutonAgenda();
      return;
    }

    const info = obtenirInfoMatiere(seance.matiere);
    const competence = obtenirCompetence(seance.matiere, seance.competenceId);

    this.add
      .text(width / 2, height / 2 - 130, "Aujourd'hui, tu vas faire :", {
        fontFamily: "sans-serif",
        fontSize: "22px",
        color: COULEURS.texteClair,
      })
      .setOrigin(0.5);

    // Carte de la seance : toujours au meme endroit, meme apparence.
    this.add
      .rectangle(width / 2, height / 2 - 30, 520, 160, 0xffffff)
      .setStrokeStyle(3, COULEURS_PHASER.bordure);
    this.add
      .text(width / 2, height / 2 - 65, `${info.icone} ${info.label}`, {
        fontFamily: "sans-serif",
        fontSize: "24px",
        color: COULEURS.texte,
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.add
      .text(width / 2, height / 2 - 20, competence?.titre ?? "", {
        fontFamily: "sans-serif",
        fontSize: "20px",
        color: COULEURS.texte,
        align: "center",
        wordWrap: { width: 460 },
      })
      .setOrigin(0.5);

    creerBouton(this, width / 2, height / 2 + 110, 240, 60, "Commencer", () => {
      this.scene.start("SessionScene", { seanceId: seance.id });
    });

    this.afficherBoutonAgenda();
  }

  private afficherBoutonAgenda(): void {
    const { width, height } = this.scale;
    creerBouton(
      this,
      width / 2,
      height - 50,
      320,
      54,
      "Voir mon planning de la semaine",
      () => this.scene.start("AgendaScene"),
      COULEURS_PHASER.orange,
    );
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
          color: COULEURS.texteClair,
          align: "center",
        },
      )
      .setOrigin(0.5);
  }
}
