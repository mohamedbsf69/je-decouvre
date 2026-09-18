// Palette partagee entre l'espace reglages (DOM/CSS) et l'espace eleve
// (Phaser, qui a besoin des memes couleurs au format numerique).
// Couleurs douces, pas de rouge vif ni de contrastes agressifs.

export const COULEURS = {
  fond: "#faf9f6",
  bleu: "#4a90d9",
  vert: "#5cb85c",
  orange: "#f5a623",
  attention: "#d98a3d",
  texte: "#333333",
  texteClair: "#666666",
  bordure: "#e0ddd6",
} as const;

// Memes couleurs, format numerique hexadecimal pour Phaser (0xrrggbb).
export const COULEURS_PHASER = {
  fond: 0xfaf9f6,
  bleu: 0x4a90d9,
  vert: 0x5cb85c,
  orange: 0xf5a623,
  attention: 0xd98a3d,
  texte: 0x333333,
  texteClair: 0x666666,
  bordure: 0xe0ddd6,
} as const;

// Couleurs au choix pour personnaliser le profil de l'eleve (accent de
// couleur sur sa carte, pas un avatar illustre tant que la reference
// visuelle n'est pas fournie).
export const COULEURS_PROFIL: { id: string; label: string; hex: string }[] = [
  { id: "bleu", label: "Bleu", hex: "#4a90d9" },
  { id: "vert", label: "Vert", hex: "#5cb85c" },
  { id: "orange", label: "Orange", hex: "#f5a623" },
  { id: "violet", label: "Violet", hex: "#9b7ed9" },
  { id: "rose", label: "Rose", hex: "#e07ba0" },
  { id: "turquoise", label: "Turquoise", hex: "#4ac4c4" },
];
