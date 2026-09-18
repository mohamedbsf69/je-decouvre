import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";

// Configuration Phaser minimale : taille fixe, mise a l'echelle FIT
// (pas de redimensionnement brusque), aucun systeme aleatoire au niveau
// moteur (pas de seed random custom, pas de physique arcade avec gravite
// aleatoire, etc.).
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: 1024,
  height: 768,
  backgroundColor: "#ffffff",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene],
};

new Phaser.Game(config);
