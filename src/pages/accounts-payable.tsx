import { CheckCircle2, Download, FileText, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  formatCurrency,
  formatDate,
  payableMetrics,
  payables,
  type Payable,
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
  pagado: "Pagadas",
}

const columns: DataColumn<Payable>[] = [
  { key: "vendor", label: "Proveedor", headClass: "min-w-44", cell: (r) => r.vendor },
  { key: "emision", label: "Emisión", headClass: "min-w-32", cell: (r) => formatDate(r.issueDate) },
  { key: "vencimiento", label: "Vencimiento", headClass: "min-w-32", cell: (r) => formatDate(r.dueDate) },
  { key: "categoria", label: "Categoría", headClass: "min-w-32", cell: (r) => r.category },
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

export function AccountsPayablePage() {
  return (
    <>
      <PageActions>
        <Button variant="outline">
          <Download data-icon="inline-start" />
          Exportar
        </Button>
        <Button>
          <Plus data-icon="inline-start" />
          Registrar factura
        </Button>
      </PageActions>

      <DataTableShell
        metrics={payableMetrics}
        metricsLabel="Este mes"
        filterItems={filterItems}
        matchesFilter={(row, filter) => filter === "todos" || row.status === filter}
        matchesSearch={(row, query) =>
          row.vendor.toLowerCase().includes(query.toLowerCase()) ||
          row.id.toLowerCase().includes(query.toLowerCase())
        }
        searchPlaceholder="Buscar por folio o proveedor"
        primaryHeader="Folio"
        primaryHeadClass="min-w-28"
        primaryCell={(row) => row.id}
        columns={columns}
        rows={payables}
        getRowId={(row) => row.id}
        entityPlural="facturas"
        rowActions={(row) => (
          <>
            <DropdownMenuItem onClick={() => toast.info(`Editando ${row.id}`)}>
              <FileText />
              Ver factura
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.success(`Factura ${row.id} marcada como pagada`)}
            >
              <CheckCircle2 />
              Marcar como pagada
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
                    por pagar.
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
