import type { EtatApplication, Profil, Seance } from "./types";

// Cle versionnee : permet de faire evoluer le format de sauvegarde plus
// tard sans casser une sauvegarde existante (on changerait de cle ou on
// ecrirait une migration a la lecture).
const CLE_STOCKAGE = "je-decouvre:v1";

function etatParDefaut(): EtatApplication {
  return {
    version: 1,
    profil: null,
    seances: [],
  };
}

export function chargerEtat(): EtatApplication {
  const brut = localStorage.getItem(CLE_STOCKAGE);
  if (!brut) {
    return etatParDefaut();
  }
  try {
    const donnees = JSON.parse(brut) as EtatApplication;
    if (donnees.version !== 1) {
      return etatParDefaut();
    }
    return donnees;
  } catch {
    return etatParDefaut();
  }
}

export function sauvegarderEtat(etat: EtatApplication): void {
  localStorage.setItem(CLE_STOCKAGE, JSON.stringify(etat));
}

export function sauvegarderProfil(profil: Profil): EtatApplication {
  const etat = chargerEtat();
  etat.profil = profil;
  sauvegarderEtat(etat);
  return etat;
}

export function ajouterSeance(seance: Seance): EtatApplication {
  const etat = chargerEtat();
  etat.seances.push(seance);
  sauvegarderEtat(etat);
  return etat;
}

export function supprimerSeance(seanceId: string): EtatApplication {
  const etat = chargerEtat();
  etat.seances = etat.seances.filter((s) => s.id !== seanceId);
  sauvegarderEtat(etat);
  return etat;
}

export function marquerSeanceTerminee(seanceId: string): EtatApplication {
  const etat = chargerEtat();
  const seance = etat.seances.find((s) => s.id === seanceId);
  if (seance) {
    seance.termineeLe = new Date().toISOString();
  }
  sauvegarderEtat(etat);
  return etat;
}

export function prochaineSeance(etat: EtatApplication): Seance | undefined {
  return [...etat.seances]
    .filter((s) => s.termineeLe === null)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
}
