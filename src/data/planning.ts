import type { EtatApplication, Seance } from "./types";

// Logique pure de planning hebdomadaire (aucune lecture/ecriture de
// localStorage ici, voir storage.ts pour la persistance).

export interface JourAgenda {
  date: string; // format ISO yyyy-mm-dd
  seances: Seance[];
}

function formaterDateIso(date: Date): string {
  const annee = date.getFullYear();
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const jour = String(date.getDate()).padStart(2, "0");
  return `${annee}-${mois}-${jour}`;
}

// Renvoie les 7 dates (ISO) de la semaine civile (lundi a dimanche) qui
// contient la date de reference. Une semaine fixe lundi->dimanche est plus
// previsible qu'une fenetre glissante "7 prochains jours", qui changerait
// de composition d'un jour a l'autre.
export function joursDeLaSemaine(dateReference: Date = new Date()): string[] {
  const jourSemaine = dateReference.getDay(); // 0 = dimanche ... 6 = samedi
  const decalageVersLundi = jourSemaine === 0 ? -6 : 1 - jourSemaine;

  const lundi = new Date(dateReference);
  lundi.setHours(0, 0, 0, 0);
  lundi.setDate(dateReference.getDate() + decalageVersLundi);

  const jours: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(lundi);
    date.setDate(lundi.getDate() + i);
    jours.push(formaterDateIso(date));
  }
  return jours;
}

export function planningDeLaSemaine(
  etat: EtatApplication,
  dateReference: Date = new Date(),
): JourAgenda[] {
  return joursDeLaSemaine(dateReference).map((date) => ({
    date,
    seances: etat.seances.filter((s) => s.date === date),
  }));
}
