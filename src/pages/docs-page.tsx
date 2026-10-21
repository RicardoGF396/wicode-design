import { useState } from "react"
import { Check, Copy, Download } from "lucide-react"
import { toast } from "sonner"

import designRules from "../../docs/DESIGN_RULES.md?raw"
import tokens from "../../docs/TOKENS.md?raw"
import components from "../../docs/COMPONENTS.md?raw"
import pages from "../../docs/PAGES.md?raw"
import agents from "../../CLAUDE.md?raw"

import { PageActions } from "@/components/layout/page-actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const docs = [
  {
    key: "design-rules",
    file: "DESIGN_RULES.md",
    title: "Reglas de diseño",
    description: "Las reglas obligatorias de todo proyecto sobre esta base.",
    content: designRules,
  },
  {
    key: "tokens",
    file: "TOKENS.md",
    title: "Tokens",
    description: "Colores, tipografía, radios y cómo cambiar el branding.",
    content: tokens,
  },
  {
    key: "components",
    file: "COMPONENTS.md",
    title: "Componentes",
    description: "Capas, patrones de Base UI y personalizaciones aprobadas.",
    content: components,
  },
  {
    key: "pages",
    file: "PAGES.md",
    title: "Páginas receta",
    description: "Las recetas reutilizables de cada tipo de página.",
    content: pages,
  },
  {
    key: "agents",
    file: "CLAUDE.md",
    title: "Agentes",
    description: "Instrucciones condensadas para agentes que generan UI.",
    content: agents,
  },
]

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function DocsPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copyDoc = async (key: string, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1500)
    toast.success("Documento copiado al portapapeles")
  }

  const downloadAll = () => {
    const all = docs
      .map((doc) => `<!-- ${doc.file} -->\n\n${doc.content}`)
      .join("\n\n---\n\n")
    download("wicode-design-system.md", all)
    toast.success("Documentación completa descargada")
  }

  return (
    <>
      <PageActions>
        <Button variant="outline" onClick={downloadAll}>
          <Download data-icon="inline-start" />
          Descargar todo
        </Button>
      </PageActions>

      <Tabs defaultValue="design-rules" className="min-h-0 flex-1 !shrink">
        <TabsList>
          {docs.map((doc) => (
            <TabsTrigger key={doc.key} value={doc.key}>
              {doc.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {docs.map((doc) => (
          <TabsContent
            key={doc.key}
            value={doc.key}
            className="flex min-h-0 flex-1 flex-col"
          >
            <Card className="flex h-full min-h-0 flex-col gap-0 py-0">
              <CardHeader className="shrink-0 flex-row items-center gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-base">
                    {doc.title}{" "}
                    <span className="font-mono text-xs font-normal text-muted-foreground">
                      {doc.file}
                    </span>
                  </CardTitle>
                  <CardDescription>{doc.description}</CardDescription>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyDoc(doc.key, doc.content)}
                  >
                    {copiedKey === doc.key ? (
                      <Check data-icon="inline-start" className="text-success" />
                    ) : (
                      <Copy data-icon="inline-start" />
                    )}
                    Copiar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => download(doc.file, doc.content)}
                  >
                    <Download data-icon="inline-start" />
                    Descargar
                  </Button>
                </div>
              </CardHeader>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <pre className="p-6 font-mono text-xs leading-relaxed whitespace-pre-wrap text-table-foreground">
                  {doc.content}
                </pre>
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}
