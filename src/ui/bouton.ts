import Phaser from "phaser";
import { COULEURS_PHASER } from "../theme";

const PADDING_HORIZONTAL = 24;
const TAILLE_POLICE_MIN = 13;

// Bouton reutilisable : meme apparence et meme comportement partout
// (survol discret, pas d'effet clignotant), pour une navigation previsible
// d'un ecran a l'autre. Le texte reduit automatiquement sa taille s'il est
// trop long pour la largeur du bouton, plutot que de deborder.
export function creerBouton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  largeur: number,
  hauteur: number,
  libelle: string,
  onClic: () => void,
  couleurFond: number = COULEURS_PHASER.bleu,
  tailleDepart = 22,
): Phaser.GameObjects.Container {
  const fond = scene.add
    .rectangle(0, 0, largeur, hauteur, couleurFond, 1)
    .setStrokeStyle(0);
  const texte = scene.add
    .text(0, 0, libelle, {
      fontFamily: "sans-serif",
      fontSize: `${tailleDepart}px`,
      color: "#ffffff",
      fontStyle: "bold",
    })
    .setOrigin(0.5);

  let taillePolice = tailleDepart;
  while (texte.width > largeur - PADDING_HORIZONTAL && taillePolice > TAILLE_POLICE_MIN) {
    taillePolice -= 1;
    texte.setFontSize(taillePolice);
  }

  const conteneur = scene.add.container(x, y, [fond, texte]);
  fond.setInteractive({ useHandCursor: true });

  fond.on("pointerover", () => fond.setAlpha(0.9));
  fond.on("pointerout", () => fond.setAlpha(1));
  fond.on("pointerdown", () => onClic());

  return conteneur;
}
