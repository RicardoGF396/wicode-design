// Copia la documentación del design system a public/docs para que el deploy
// la sirva como markdown crudo (consumible por agentes y por el servidor MCP).
import { cp, mkdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const out = path.join(root, "public", "docs")

await mkdir(out, { recursive: true })
for (const file of ["DESIGN_RULES.md", "TOKENS.md", "COMPONENTS.md", "PAGES.md"]) {
  await cp(path.join(root, "docs", file), path.join(out, file))
}
await cp(path.join(root, "CLAUDE.md"), path.join(out, "CLAUDE.md"))
console.log("docs sincronizadas en public/docs")
