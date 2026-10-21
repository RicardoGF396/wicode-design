import { Download, FileText, Plus, Send, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  formatCurrency,
  formatDate,
  receivableMetrics,
  receivables,
  type Receivable,
} from "@/lib/mock-data"
import { PageActions } from "@/components/layout/page-actions"
import {
  DataTableShell,
  type DataColumn,
} from "@/components/data-table/data-table-shell"
import { AccountStatusBadge } from "@/components/finance/account-status-badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

const filterItems: Record<string, string> = {
  todos: "Todas",
  pendiente: "Pendientes",
  vencido: "Vencidas",
  cobrado: "Cobradas",
}

const columns: DataColumn<Receivable>[] = [
  { key: "customer", label: "Cliente", headClass: "min-w-44", cell: (r) => r.customer },
  { key: "emision", label: "Emisión", headClass: "min-w-32", cell: (r) => formatDate(r.issueDate) },
  { key: "vencimiento", label: "Vencimiento", headClass: "min-w-32", cell: (r) => formatDate(r.dueDate) },
  { key: "canal", label: "Canal", headClass: "min-w-36", cell: (r) => r.channel },
  { key: "metodo", label: "Método", headClass: "min-w-36", cell: (r) => r.method },
  {
    key: "estado",
    label: "Estado",
    headClass: "min-w-32",
    cell: (r) => <AccountStatusBadge status={r.status} />,
  },
  {
    key: "monto",
    label: "Monto",
    headClass: "min-w-32 text-right",
    cellClass: "text-right tabular-nums",
    cell: (r) => formatCurrency(r.amount),
  },
]

export function AccountsReceivablePage() {
  return (
    <>
      <PageActions>
        <Button variant="outline">
          <Download data-icon="inline-start" />
          Exportar
        </Button>
        <Button>
          <Plus data-icon="inline-start" />
          Crear factura
        </Button>
      </PageActions>

      <DataTableShell
        metrics={receivableMetrics}
        defaultPeriod="mes"
        filterItems={filterItems}
        matchesFilter={(row, filter) => filter === "todos" || row.status === filter}
        matchesSearch={(row, query) =>
          row.customer.toLowerCase().includes(query.toLowerCase()) ||
          row.id.toLowerCase().includes(query.toLowerCase())
        }
        searchPlaceholder="Buscar por folio o cliente"
        primaryHeader="Folio"
        primaryHeadClass="min-w-28"
        primaryCell={(row) => row.id}
        columns={columns}
        rows={receivables}
        getRowId={(row) => row.id}
        entityPlural="facturas"
        rowActions={(row) => (
          <>
            <DropdownMenuItem onClick={() => toast.info(`Abriendo ${row.id}`)}>
              <FileText />
              Ver factura
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.success(`Recordatorio enviado para ${row.id}`)}
            >
              <Send />
              Enviar recordatorio
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger
                render={<DropdownMenuItem variant="destructive" closeOnClick={false} />}
              >
                <Trash2 />
                Eliminar
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar la factura {row.id}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer y se eliminará el registro
                    por cobrar.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => toast.success(`Factura ${row.id} eliminada`)}
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      />
    </>
  )
}
