import type { CompetenceContent, Matiere } from "./types";

// Charge tous les fichiers JSON de /content au build (aucun appel reseau a
// l'execution, coherent avec une application 100% statique).
const modules = import.meta.glob("/content/**/*.json", {
  eager: true,
  import: "default",
}) as Record<string, CompetenceContent>;

const toutesLesCompetences: CompetenceContent[] = Object.values(modules).sort(
  (a, b) => (a.ordre ?? 999) - (b.ordre ?? 999),
);

export interface MatiereInfo {
  id: Matiere;
  label: string;
  icone: string;
}

export const MATIERES: MatiereInfo[] = [
  { id: "mathematiques", label: "Mathematiques", icone: "📐" },
  { id: "francais", label: "Francais", icone: "✏️" },
  { id: "histoire-geographie", label: "Histoire-geographie", icone: "🌍" },
];

export function listerCompetences(): CompetenceContent[] {
  return toutesLesCompetences;
}

export function listerCompetencesParMatiere(matiere: Matiere): CompetenceContent[] {
  return toutesLesCompetences.filter((c) => c.matiere === matiere);
}

export function obtenirCompetence(
  matiere: Matiere,
  competenceId: string,
): CompetenceContent | undefined {
  return toutesLesCompetences.find(
    (c) => c.matiere === matiere && c.competence === competenceId,
  );
}

export function obtenirInfoMatiere(matiere: Matiere): MatiereInfo {
  const info = MATIERES.find((m) => m.id === matiere);
  if (!info) {
    throw new Error(`Matiere inconnue : ${matiere}`);
  }
  return info;
}
