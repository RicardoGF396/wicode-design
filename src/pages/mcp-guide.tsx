import { useState } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, ExternalLink, Info, X } from "lucide-react"
import { toast } from "sonner"

import { CodeBlock } from "@/components/docs/code-block"
import { PageActions } from "@/components/layout/page-actions"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldLabel } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const DEPLOY_URL = "https://wicode-design.vercel.app"

const snippets: Record<string, { label: string; code: string }> = {
  comando: {
    label: "Claude Code",
    code: `# ==========================================
# Wicode Design System · Servidor MCP
# Propósito: dar contexto de diseño al agente
# ==========================================

# 1. Clona el repositorio e instala dependencias
git clone https://github.com/RicardoGF396/wicode-design.git
cd wicode-design && npm install

# 2. Registra el servidor MCP en Claude Code
claude mcp add wicode-design -- node $(pwd)/mcp/server.mjs

# 3. Verifica la conexión
claude mcp list`,
  },
  json: {
    label: "Otros clientes (JSON)",
    code: `{
  "mcpServers": {
    "wicode-design": {
      "command": "node",
      "args": ["<ruta-al-repo>/mcp/server.mjs"]
    }
  }
}`,
  },
  prompt: {
    label: "Prompt del agente",
    code: `Eres un diseñador de producto de Wicode. Antes de
proponer cualquier pantalla al cliente:

1. Llama a get_design_system del MCP wicode-design y
   respeta TODAS las reglas: tokens, peso máximo 500,
   tablas data-table, badges StatusPill y PageActions.
2. Parte siempre de una receta de "pages" (dashboard
   Analytics, tabla Orders, drawer detail, formulario
   de una página, login/signup).
3. Usa ${DEPLOY_URL} como referencia
   visual al describir la propuesta.

Entrega la propuesta como composición de esas recetas,
nunca como un diseño desde cero.`,
  },
  urls: {
    label: "Sin MCP (URLs)",
    code: `# Índice para agentes
${DEPLOY_URL}/llms.txt

# Documentos en markdown crudo
${DEPLOY_URL}/docs/DESIGN_RULES.md
${DEPLOY_URL}/docs/TOKENS.md
${DEPLOY_URL}/docs/COMPONENTS.md
${DEPLOY_URL}/docs/PAGES.md
${DEPLOY_URL}/docs/CLAUDE.md`,
  },
}

const contextDocs = [
  "Reglas de diseño",
  "Tokens",
  "Componentes",
  "Páginas receta",
]

function InfoHint({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span className="inline-flex cursor-help align-middle text-muted-foreground" />
        }
      >
        <Info className="size-3.5" />
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  )
}

export function McpGuidePage() {
  const [bannerVisible, setBannerVisible] = useState(true)
  const [contextMode, setContextMode] = useState("requerido")
  const [snippet, setSnippet] = useState("comando")
  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(
    new Set(contextDocs)
  )

  const toggleDoc = (doc: string) => {
    const next = new Set(checkedDocs)
    if (next.has(doc)) {
      next.delete(doc)
    } else {
      next.add(doc)
    }
    setCheckedDocs(next)
  }

  return (
    <>
      <PageActions>
        <Button
          variant="outline"
          onClick={() =>
            toast.success("Servidor MCP respondiendo: 3 herramientas disponibles")
          }
        >
          Probar
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            Más acciones
            <ChevronDown data-icon="inline-end" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(snippets.comando.code)
                toast.success("Comando copiado")
              }}
            >
              Copiar comando de conexión
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(`${DEPLOY_URL}/llms.txt`)
                toast.success("URL de llms.txt copiada")
              }}
            >
              Copiar URL de llms.txt
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => window.open(DEPLOY_URL, "_blank")}
            >
              <ExternalLink />
              Abrir demo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" render={<Link to="/docs" />} nativeButton={false}>
          Documentación
        </Button>
      </PageActions>

      {/* Columna única, máx. 600px (patrón de página de detalle) */}
      <div className="mx-auto flex w-full max-w-[600px] flex-col gap-4">
        {/* Banner informativo descartable */}
        {bannerVisible && (
          <Card className="flex-row items-center gap-3 px-4 py-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-info/15 text-info">
              <Info className="size-4" />
            </span>
            <p className="min-w-0 flex-1 text-sm">
              Este design system se consume como servidor MCP para que los
              agentes basen sus propuestas en estas reglas.{" "}
              <Link
                to="/docs"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Más información
              </Link>
            </p>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Cerrar aviso"
              onClick={() => setBannerVisible(false)}
            >
              <X />
            </Button>
          </Card>
        )}

        {/* Configuración del contexto */}
        <Card className="gap-0 py-0">
          <CardHeader className="py-4">
            <CardTitle className="flex items-center gap-1.5 text-base">
              Contexto del agente{" "}
              <InfoHint text="Qué documentación debe cargar el agente antes de proponer" />
            </CardTitle>
          </CardHeader>
          <div className="mx-4 overflow-hidden rounded-lg border">
            <Collapsible defaultOpen>
              <CollapsibleTrigger
                render={
                  <button className="flex w-full items-center justify-between bg-muted/50 px-4 py-3 text-sm font-medium" />
                }
              >
                Documentación requerida
                <ChevronDown className="size-4 text-muted-foreground transition-transform in-data-[panel-open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-4 border-t p-4">
                  <RadioGroup value={contextMode} onValueChange={setContextMode}>
                    <Field orientation="horizontal">
                      <RadioGroupItem value="requerido" id="ctx-requerido" />
                      <FieldLabel htmlFor="ctx-requerido" className="font-normal">
                        Requerido
                      </FieldLabel>
                    </Field>
                    <div className="space-y-3 pl-7">
                      <p className="text-sm text-muted-foreground">
                        El agente carga estos documentos antes de generar
                        cualquier propuesta.
                      </p>
                      {contextDocs.map((doc) => (
                        <Field key={doc} orientation="horizontal">
                          <Checkbox
                            id={`doc-${doc}`}
                            checked={checkedDocs.has(doc)}
                            onCheckedChange={() => toggleDoc(doc)}
                            disabled={contextMode !== "requerido"}
                          />
                          <FieldLabel
                            htmlFor={`doc-${doc}`}
                            className="font-normal"
                          >
                            {doc}
                          </FieldLabel>
                        </Field>
                      ))}
                    </div>
                    <Field orientation="horizontal">
                      <RadioGroupItem value="libre" id="ctx-libre" />
                      <FieldLabel htmlFor="ctx-libre" className="font-normal">
                        No requerido
                      </FieldLabel>
                    </Field>
                  </RadioGroup>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible>
              <CollapsibleTrigger
                render={
                  <button className="flex w-full items-center justify-between border-t bg-muted/50 px-4 py-3 text-sm font-medium" />
                }
              >
                Avanzado
                <ChevronDown className="size-4 text-muted-foreground transition-transform in-data-[panel-open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-3 border-t p-4">
                  <p className="text-sm text-muted-foreground">
                    El servidor lee las docs del deploy; sin red usa la copia
                    local. Para apuntar a otro entorno:
                  </p>
                  <CodeBlock code={`WICODE_DESIGN_URL=https://staging.ejemplo.com \\\n  node mcp/server.mjs`} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          <CardFooter className="mt-4 border-t bg-muted/50 !py-3 text-sm text-muted-foreground [.border-t]:pt-3">
            <span>
              Consulta cómo se aplican estas reglas en{" "}
              <Link
                to="/docs"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Documentación
              </Link>
            </span>
          </CardFooter>
        </Card>

        {/* Código */}
        <Card className="gap-0 py-0">
          <CardHeader className="flex-row items-center py-3">
            <CardTitle className="flex flex-1 items-center gap-1.5 text-base">
              Código{" "}
              <InfoHint text="Snippets listos para conectar o instruir al agente" />
            </CardTitle>
            <Select
              items={Object.fromEntries(
                Object.entries(snippets).map(([key, s]) => [key, s.label])
              )}
              value={snippet}
              onValueChange={(value) => setSnippet(value ?? "comando")}
            >
              <SelectTrigger size="sm" className="w-auto gap-1 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(snippets).map(([key, s]) => (
                    <SelectItem key={key} value={key}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardHeader>
          <div className="px-4 pb-4">
            <CodeBlock variant="editor" code={snippets[snippet].code} />
          </div>
        </Card>
      </div>
    </>
  )
}
