import Phaser from "phaser";
import { obtenirCompetence, obtenirInfoMatiere } from "../data/content";
import { chargerEtat, marquerSeanceTerminee } from "../data/storage";
import type { CompetenceContent, Seance } from "../data/types";
import { COULEURS, COULEURS_PHASER } from "../theme";
import { creerBouton } from "../ui/bouton";

interface DonneesSessionScene {
  seanceId: string;
}

// Une seance = une suite de questions QCM pour une competence. Toujours la
// meme structure d'ecran (question en haut, choix en dessous, feedback au
// meme endroit) et aucune progression automatique : c'est l'eleve qui
// clique sur "Continuer" quand il est pret, jamais un minuteur.
export class SessionScene extends Phaser.Scene {
  private seance: Seance | undefined;
  private competence: CompetenceContent | undefined;
  private indexQuestion = 0;
  private questionResolue = false;
  private elementsEcran: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super("SessionScene");
  }

  init(donnees: DonneesSessionScene): void {
    const etat = chargerEtat();
    const seance = etat.seances.find((s) => s.id === donnees.seanceId);
    const competence = seance ? obtenirCompetence(seance.matiere, seance.competenceId) : undefined;

    this.seance = seance;
    this.competence = competence;
    this.indexQuestion = 0;
    this.questionResolue = false;
  }

  create(): void {
    const { width, height } = this.scale;
    this.add.rectangle(0, 0, width, height, COULEURS_PHASER.fond).setOrigin(0);

    if (!this.seance || !this.competence) {
      // Seance introuvable (supprimee entre-temps depuis les reglages,
      // par exemple) : retour previsible a l'accueil plutot qu'une erreur.
      this.scene.start("HomeScene");
      return;
    }

    this.afficherQuestion();
  }

  private afficherQuestion(): void {
    if (!this.competence) return;

    this.effacerElementsEcran();
    this.questionResolue = false;
    const { width } = this.scale;
    const question = this.competence.questions[this.indexQuestion];

    const progression = this.add
      .text(width / 2, 50, `Question ${this.indexQuestion + 1} / ${this.competence.questions.length}`, {
        fontFamily: "sans-serif",
        fontSize: "18px",
        color: COULEURS.texteClair,
      })
      .setOrigin(0.5);
    this.elementsEcran.push(progression);

    const enonce = this.add
      .text(width / 2, 140, question.enonce, {
        fontFamily: "sans-serif",
        fontSize: "26px",
        color: COULEURS.texte,
        align: "center",
        wordWrap: { width: 640 },
      })
      .setOrigin(0.5);
    this.elementsEcran.push(enonce);

    const zoneFeedback = this.add
      .text(width / 2, 230, "", {
        fontFamily: "sans-serif",
        fontSize: "20px",
        color: COULEURS.vert,
        align: "center",
      })
      .setOrigin(0.5);
    this.elementsEcran.push(zoneFeedback);

    const yDepart = 300;
    const espacement = 74;
    question.choix.forEach((choix, i) => {
      const boutonChoix = creerBouton(
        this,
        width / 2,
        yDepart + i * espacement,
        460,
        58,
        choix,
        () => this.traiterReponse(choix, question.reponseCorrecte, zoneFeedback),
        COULEURS_PHASER.bleu,
      );
      this.elementsEcran.push(boutonChoix);
    });
  }

  private traiterReponse(choix: string, reponseCorrecte: string, zoneFeedback: Phaser.GameObjects.Text): void {
    if (this.questionResolue) return;

    if (choix === reponseCorrecte) {
      this.questionResolue = true;
      zoneFeedback.setColor(COULEURS.vert);
      zoneFeedback.setText("Bravo, c'est la bonne reponse !");
      this.afficherBoutonContinuer();
    } else {
      zoneFeedback.setColor(COULEURS.attention);
      zoneFeedback.setText("Pas tout a fait, essaie encore.");
    }
  }

  private afficherBoutonContinuer(): void {
    if (!this.competence || !this.seance) return;

    const { width, height } = this.scale;
    const estDerniereQuestion = this.indexQuestion >= this.competence.questions.length - 1;
    const bouton = creerBouton(
      this,
      width / 2,
      height - 70,
      240,
      60,
      estDerniereQuestion ? "Terminer" : "Continuer",
      () => {
        if (estDerniereQuestion) {
          this.terminerSeance();
        } else {
          this.indexQuestion += 1;
          this.afficherQuestion();
        }
      },
      COULEURS_PHASER.vert,
    );
    this.elementsEcran.push(bouton);
  }

  private terminerSeance(): void {
    if (!this.seance) return;

    marquerSeanceTerminee(this.seance.id);
    this.effacerElementsEcran();
    const { width, height } = this.scale;
    const info = obtenirInfoMatiere(this.seance.matiere);

    const message = this.add
      .text(width / 2, height / 2 - 40, `Bravo !\nSeance ${info.label} terminee.`, {
        fontFamily: "sans-serif",
        fontSize: "28px",
        color: COULEURS.texte,
        align: "center",
      })
      .setOrigin(0.5);
    this.elementsEcran.push(message);

    const bouton = creerBouton(
      this,
      width / 2,
      height / 2 + 90,
      280,
      60,
      "Retour a l'accueil",
      () => this.scene.start("HomeScene"),
      COULEURS_PHASER.bleu,
    );
    this.elementsEcran.push(bouton);
  }

  private effacerElementsEcran(): void {
    for (const element of this.elementsEcran) {
      element.destroy();
    }
    this.elementsEcran = [];
  }
}
