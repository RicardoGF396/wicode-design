import { BrowserRouter, Route, Routes } from "react-router-dom"

import { AppLayout } from "@/components/layout/app-layout"
import { Toaster } from "@/components/ui/sonner"
import { AccountsPayablePage } from "@/pages/accounts-payable"
import { AccountsReceivablePage } from "@/pages/accounts-receivable"
import { CalendarPage } from "@/pages/calendar-page"
import { CreateOrderPage } from "@/pages/create-order"
import { DashboardPage } from "@/pages/dashboard"
import { DocsPage } from "@/pages/docs-page"
import { DrawerDetailPage } from "@/pages/drawer-detail"
import { FormsPage } from "@/pages/forms"
import { InventoryPage } from "@/pages/inventory"
import { LoginPage } from "@/pages/login"
import { McpGuidePage } from "@/pages/mcp-guide"
import { SignupPage } from "@/pages/signup"
import { TablePage } from "@/pages/table-page"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas de autenticación: sin layout de aplicación */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Páginas internas: comparten el layout con sidebar */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/table" element={<TablePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/orders/new" element={<CreateOrderPage />} />
          <Route path="/drawer-detail" element={<DrawerDetailPage />} />
          <Route path="/accounts-payable" element={<AccountsPayablePage />} />
          <Route path="/accounts-receivable" element={<AccountsReceivablePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/forms" element={<FormsPage />} />
          <Route path="/mcp-guide" element={<McpGuidePage />} />
          <Route path="/docs" element={<DocsPage />} />
        </Route>
      </Routes>
      <Toaster position="bottom-right" />
    </BrowserRouter>
  )
}

export default App
