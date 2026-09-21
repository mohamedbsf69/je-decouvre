// Types partages pour le contenu pedagogique et l'etat de l'application.
// Le contenu pedagogique (competences/questions) vient de /content, jamais
// code en dur dans une scene.

export type Matiere = "mathematiques" | "francais" | "histoire-geographie";

export interface QuestionQCM {
  id: string;
  type: "qcm";
  enonce: string;
  choix: string[];
  reponseCorrecte: string;
}

export type Question = QuestionQCM;

export interface CompetenceContent {
  matiere: Matiere;
  niveau: string;
  competence: string;
  titre: string;
  domaine?: string; // grand domaine du programme (ex: "Nombres et calculs")
  ordre?: number; // ordre pedagogique suggere, pour trier les listes
  questions: Question[];
}

export interface Profil {
  prenom: string;
  couleur: string;
}

export interface Seance {
  id: string;
  date: string; // format ISO yyyy-mm-dd, choisie manuellement par l'accompagnant
  matiere: Matiere;
  competenceId: string;
  termineeLe: string | null; // date ISO, null tant que la seance n'est pas terminee
}

export interface EtatApplication {
  version: 1;
  profil: Profil | null;
  seances: Seance[];
}
