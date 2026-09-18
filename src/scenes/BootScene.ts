import Phaser from "phaser";

/**
 * Scene provisoire affichee au demarrage pour valider que le moteur
 * fonctionne. Aucun habillage visuel definitif tant que la reference
 * graphique (menus, mascotte, epreuves) n'a pas ete fournie par
 * l'utilisateur.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2, "Le moteur fonctionne", {
        fontFamily: "sans-serif",
        fontSize: "32px",
        color: "#222222",
      })
      .setOrigin(0.5);
  }
}
