import { defineConfig } from "vite";

// Le site est publie sur GitHub Pages, dans un sous-dossier du domaine
// (pas a la racine) : il faut donc que les chemins des fichiers generes
// (JS/CSS) soient prefixes en consequence. Deux versions coexistent sur le
// meme site (voir .github/workflows/deploy-pages.yml et docs/decisions.md) :
//   - uat (branche main)  -> /je-decouvre/
//   - dev (branche dev)   -> /je-decouvre/dev/
// La variable DEPLOY_BASE_PATH (definie par le workflow) choisit laquelle.
// En dev local, on garde la racine "/" pour que `npm run dev` continue de
// fonctionner sur http://localhost:5173/ sans changement.
export default defineConfig(({ command }) => ({
  base: command === "build" ? (process.env.DEPLOY_BASE_PATH ?? "/je-decouvre/") : "/",
}));
