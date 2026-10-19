#!/usr/bin/env node
// Servidor MCP de Wicode Design System.
// Expone la documentación del sistema (reglas, tokens, componentes, recetas)
// para que cualquier agente la consuma y construya propuestas sobre esta base.
//
// Uso con Claude Code:
//   claude mcp add wicode-design -- node <ruta-al-repo>/mcp/server.mjs
//
// Lee las docs del deploy (https://wicode-design.vercel.app/docs/*) y, si no
// hay red, cae al sistema de archivos local del repositorio.

import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"

const BASE_URL =
  process.env.WICODE_DESIGN_URL ?? "https://wicode-design.vercel.app"

const DOCS = {
  "design-rules": {
    file: "DESIGN_RULES.md",
    description:
      "Reglas de diseño obligatorias: layout, escala, tipografía, color, tablas, formularios y anti-patrones.",
  },
  tokens: {
    file: "TOKENS.md",
    description:
      "Tokens de diseño: colores, tipografía (Inter/Inter Display), radios, tablas y badges. Cómo cambiar branding.",
  },
  components: {
    file: "COMPONENTS.md",
    description:
      "Capas de componentes, patrones de shadcn sobre Base UI (prop render, grupos) y personalizaciones aprobadas.",
  },
  pages: {
    file: "PAGES.md",
    description:
      "Recetas de página reutilizables: login, signup, dashboard Analytics, tabla Orders, drawer detail y formularios.",
  },
  agents: {
    file: "CLAUDE.md",
    description:
      "Instrucciones condensadas para agentes que generan UI sobre esta base.",
  },
}

const here = path.dirname(fileURLToPath(import.meta.url))

async function loadDoc(file) {
  try {
    const res = await fetch(`${BASE_URL}/docs/${file}`)
    if (res.ok) return await res.text()
  } catch {
    // sin red: usar la copia local del repo
  }
  const local =
    file === "CLAUDE.md"
      ? path.join(here, "..", file)
      : path.join(here, "..", "docs", file)
  return readFile(local, "utf8")
}

const server = new McpServer(
  { name: "wicode-design", version: "1.0.0" },
  {
    instructions:
      "Design system base de Wicode (React + shadcn/ui sobre Base UI). " +
      "Antes de proponer o generar cualquier pantalla para un cliente: " +
      "1) lee design-rules, 2) consulta tokens y components, 3) parte de una " +
      "receta de pages. Demo navegable: " +
      BASE_URL +
      " (rutas: /, /table, /drawer-detail, /forms, /login, /signup).",
  }
)

server.registerTool(
  "list_docs",
  {
    title: "Listar documentación",
    description:
      "Lista los documentos del design system de Wicode con su descripción.",
    inputSchema: {},
  },
  async () => ({
    content: [
      {
        type: "text",
        text: Object.entries(DOCS)
          .map(([key, doc]) => `- ${key}: ${doc.description}`)
          .join("\n"),
      },
    ],
  })
)

server.registerTool(
  "get_doc",
  {
    title: "Obtener documento",
    description:
      "Devuelve el contenido completo de un documento del design system de Wicode.",
    inputSchema: {
      doc: z
        .enum(Object.keys(DOCS))
        .describe("Documento a leer: design-rules, tokens, components, pages o agents"),
    },
  },
  async ({ doc }) => ({
    content: [{ type: "text", text: await loadDoc(DOCS[doc].file) }],
  })
)

server.registerTool(
  "get_design_system",
  {
    title: "Obtener design system completo",
    description:
      "Devuelve toda la documentación del design system de Wicode en un solo texto, lista para usarse como contexto al generar propuestas de UI para clientes.",
    inputSchema: {},
  },
  async () => {
    const parts = await Promise.all(
      Object.entries(DOCS).map(
        async ([key, doc]) =>
          `\n\n━━━ ${key.toUpperCase()} (${doc.file}) ━━━\n\n${await loadDoc(doc.file)}`
      )
    )
    return { content: [{ type: "text", text: parts.join("") }] }
  }
)

for (const [key, doc] of Object.entries(DOCS)) {
  server.registerResource(
    key,
    `wicode-design://docs/${key}`,
    { title: doc.file, description: doc.description, mimeType: "text/markdown" },
    async (uri) => ({
      contents: [{ uri: uri.href, mimeType: "text/markdown", text: await loadDoc(doc.file) }],
    })
  )
}

await server.connect(new StdioServerTransport())
