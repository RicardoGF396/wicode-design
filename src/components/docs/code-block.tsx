import { useState } from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Bloque de código con botón de copiado (para tutoriales y docs).
// variant "dark": pastilla oscura simple. variant "editor": fondo claro con
// números de línea, como un editor embebido.
export function CodeBlock({
  code,
  variant = "dark",
  className,
}: {
  code: string
  variant?: "dark" | "editor"
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const copyButton = (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Copiar"
      onClick={copy}
      className={cn(
        "absolute top-2 right-2",
        variant === "dark" &&
          "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      {copied ? <Check className="text-success" /> : <Copy />}
    </Button>
  )

  if (variant === "editor") {
    const lines = code.split("\n")
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border bg-card",
          className
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-mono text-xs leading-6">
            <tbody>
              {lines.map((line, index) => (
                <tr key={index}>
                  <td className="w-10 bg-muted/50 pr-3 text-right align-top text-muted-foreground select-none">
                    {index + 1}
                  </td>
                  <td className="pr-12 pl-4 whitespace-pre text-table-foreground">
                    {line || " "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {copyButton}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative rounded-lg bg-sidebar text-sidebar-foreground",
        className
      )}
    >
      <pre className="overflow-x-auto p-4 pr-12 font-mono text-xs leading-relaxed whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
      {copyButton}
    </div>
  )
}
