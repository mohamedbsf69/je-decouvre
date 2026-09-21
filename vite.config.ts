import { defineConfig } from "vite";

// Le site est publie sur GitHub Pages a l'adresse
// https://mohamedbsf69.github.io/je-decouvre/ (un sous-dossier, pas la
// racine du domaine) : il faut donc que les chemins des fichiers generes
// (JS/CSS) soient prefixes par "/je-decouvre/" au build. En dev, on garde
// la racine "/" pour que le serveur local (npm run dev) continue de
// fonctionner sur http://localhost:5173/ sans changement.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/je-decouvre/" : "/",
}));
