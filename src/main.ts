import Phaser from "phaser";
import { demarrerEspaceReglages } from "./reglages/reglages";
import { AgendaScene } from "./scenes/AgendaScene";
import { HomeScene } from "./scenes/HomeScene";
import { SessionScene } from "./scenes/SessionScene";
import "./style.css";

// Point d'entree : deux espaces separes.
// - "#reglages" : formulaires DOM pour l'accompagnant (profil, planning).
// - sinon : le jeu Phaser, espace eleve, sans aucun acces a la
//   configuration (conforme a la contrainte de routine/previsibilite).
function demarrer(): void {
  const conteneur = document.getElementById("app");
  if (!conteneur) return;
  conteneur.innerHTML = "";

  if (window.location.hash === "#reglages") {
    demarrerEspaceReglages(conteneur);
    return;
  }

  // Configuration Phaser minimale : taille fixe, mise a l'echelle FIT
  // (pas de redimensionnement brusque), aucun systeme aleatoire au niveau
  // moteur (pas de seed random custom, pas de physique arcade avec gravite
  // aleatoire, etc.).
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: "app",
    width: 1024,
    height: 768,
    backgroundColor: "#faf9f6",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [HomeScene, SessionScene, AgendaScene],
  };

  new Phaser.Game(config);
}

// Changer d'espace (eleve <-> reglages) recharge la page : plus simple et
// plus fiable que de detruire/recreer le jeu Phaser a la volee.
window.addEventListener("hashchange", () => window.location.reload());

demarrer();
