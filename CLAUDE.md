# Instrucciones para agentes

Este repositorio es la base de diseño de Wicode. Las reglas no son opcionales.

- Lee `docs/DESIGN_RULES.md`, `docs/TOKENS.md`, `docs/COMPONENTS.md` y
  `docs/PAGES.md` antes de crear o modificar UI.
- Toda pantalla nueva parte de una receta de `docs/PAGES.md`; no diseñes desde
  cero.
- Usa solo componentes de `src/components/ui/` (shadcn sobre **Base UI**: prop
  `render`, no `asChild`). Si falta uno: `npx shadcn@latest add <componente>`.
- No edites archivos de `src/components/ui/` a mano.
- Colores/radios/tipografía solo mediante tokens (`src/index.css`). Prohibido
  `bg-zinc-100`, hex directos o `rounded-[Npx]` en páginas.
- Iconos: lucide-react. Formularios: react-hook-form + zod con componentes
  `Field*`. Confirmaciones destructivas: `AlertDialog`. Feedback: `toast`.
- UI en español. Verifica light y dark antes de dar por terminado.
- `npm run typecheck` debe pasar antes de terminar cualquier tarea.
