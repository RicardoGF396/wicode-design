// Datos de ejemplo compartidos por las páginas demo.
// En un proyecto real, esta capa se reemplaza por llamadas a la API.

export type OrderStatus = "pagado" | "pendiente" | "enviado" | "cancelado"
export type FulfillmentStatus = "preparado" | "sin_preparar" | "no_requerido"

export type Order = {
  id: string
  customer: string
  email: string
  date: string
  status: OrderStatus
  fulfillment: FulfillmentStatus
  items: number
  total: number
  channel: string
  delivery: string
  destination: string
  tags: string
  address: string
}

export const orders: Order[] = [
  { id: "#1054", customer: "María González", email: "maria.gonzalez@example.com", date: "2026-10-19", status: "pagado", fulfillment: "sin_preparar", items: 3, total: 1250.0, channel: "Tienda en línea", delivery: "Envío estándar", destination: "CDMX", tags: "mayoreo", address: "Av. Reforma 123, CDMX" },
  { id: "#1053", customer: "Carlos Hernández", email: "carlos.h@example.com", date: "2026-10-19", status: "pendiente", fulfillment: "sin_preparar", items: 1, total: 349.5, channel: "Punto de venta", delivery: "Recolección", destination: "Puebla", tags: "", address: "Calle 5 de Mayo 45, Puebla" },
  { id: "#1052", customer: "Ana Martínez", email: "ana.mtz@example.com", date: "2026-10-18", status: "enviado", fulfillment: "preparado", items: 2, total: 820.0, channel: "Tienda en línea", delivery: "Envío exprés", destination: "Monterrey", tags: "frágil", address: "Blvd. Díaz Ordaz 890, Monterrey" },
  { id: "#1051", customer: "Luis Ramírez", email: "luis.ramirez@example.com", date: "2026-10-18", status: "pagado", fulfillment: "preparado", items: 5, total: 2104.99, channel: "Instagram", delivery: "Envío estándar", destination: "Guadalajara", tags: "vip", address: "Av. Chapultepec 210, Guadalajara" },
  { id: "#1050", customer: "Sofía Torres", email: "sofia.t@example.com", date: "2026-10-17", status: "cancelado", fulfillment: "no_requerido", items: 1, total: 199.0, channel: "Tienda en línea", delivery: "—", destination: "Querétaro", tags: "", address: "Av. Universidad 55, Querétaro" },
  { id: "#1049", customer: "Jorge Flores", email: "jorge.flores@example.com", date: "2026-10-17", status: "pagado", fulfillment: "preparado", items: 2, total: 640.0, channel: "Facebook", delivery: "Envío estándar", destination: "Mérida", tags: "", address: "Calle Hidalgo 12, Mérida" },
  { id: "#1048", customer: "Lucía Pérez", email: "lucia.perez@example.com", date: "2026-10-16", status: "enviado", fulfillment: "preparado", items: 4, total: 1580.25, channel: "Tienda en línea", delivery: "Envío exprés", destination: "León", tags: "mayoreo", address: "Av. Juárez 300, León" },
  { id: "#1047", customer: "Diego Sánchez", email: "diego.s@example.com", date: "2026-10-16", status: "pendiente", fulfillment: "sin_preparar", items: 2, total: 475.0, channel: "Punto de venta", delivery: "Recolección", destination: "Monterrey", tags: "", address: "Av. Constitución 77, Monterrey" },
  { id: "#1046", customer: "Valeria Cruz", email: "valeria.cruz@example.com", date: "2026-10-15", status: "pagado", fulfillment: "preparado", items: 1, total: 99.9, channel: "Tienda en línea", delivery: "Envío estándar", destination: "CDMX", tags: "", address: "Calle Madero 8, CDMX" },
  { id: "#1045", customer: "Andrés Morales", email: "andres.m@example.com", date: "2026-10-15", status: "enviado", fulfillment: "preparado", items: 3, total: 1340.0, channel: "Tienda en línea", delivery: "Envío estándar", destination: "Zapopan", tags: "vip", address: "Av. Patria 450, Zapopan" },
  { id: "#1044", customer: "Fernanda López", email: "fer.lopez@example.com", date: "2026-10-14", status: "pagado", fulfillment: "preparado", items: 2, total: 760.5, channel: "Instagram", delivery: "Envío exprés", destination: "Guadalajara", tags: "", address: "Av. Vallarta 1020, Guadalajara" },
  { id: "#1043", customer: "Ricardo Gómez", email: "ricardo.gomez@example.com", date: "2026-10-14", status: "cancelado", fulfillment: "no_requerido", items: 6, total: 3250.0, channel: "Tienda en línea", delivery: "—", destination: "CDMX", tags: "mayoreo", address: "Paseo de la Reforma 505, CDMX" },
  { id: "#1042", customer: "Paola Ruiz", email: "paola.ruiz@example.com", date: "2026-10-13", status: "pagado", fulfillment: "preparado", items: 2, total: 540.0, channel: "Tienda en línea", delivery: "Envío estándar", destination: "Toluca", tags: "", address: "Av. Independencia 20, Toluca" },
  { id: "#1041", customer: "Héctor Vargas", email: "hector.v@example.com", date: "2026-10-13", status: "enviado", fulfillment: "preparado", items: 1, total: 289.0, channel: "Punto de venta", delivery: "Recolección", destination: "Puebla", tags: "", address: "Av. Juárez 15, Puebla" },
  { id: "#1040", customer: "Gabriela Castro", email: "gaby.castro@example.com", date: "2026-10-12", status: "pagado", fulfillment: "sin_preparar", items: 4, total: 1860.75, channel: "Tienda en línea", delivery: "Envío exprés", destination: "Cancún", tags: "frágil", address: "Av. Tulum 88, Cancún" },
  { id: "#1039", customer: "Emilio Ortega", email: "emilio.o@example.com", date: "2026-10-12", status: "pendiente", fulfillment: "sin_preparar", items: 2, total: 420.0, channel: "Facebook", delivery: "Envío estándar", destination: "Tijuana", tags: "", address: "Blvd. Agua Caliente 300, Tijuana" },
  { id: "#1038", customer: "Daniela Ríos", email: "daniela.rios@example.com", date: "2026-10-11", status: "pagado", fulfillment: "preparado", items: 3, total: 980.0, channel: "Tienda en línea", delivery: "Envío estándar", destination: "Querétaro", tags: "vip", address: "Av. 5 de Febrero 120, Querétaro" },
  { id: "#1037", customer: "Raúl Mendoza", email: "raul.m@example.com", date: "2026-10-11", status: "enviado", fulfillment: "preparado", items: 2, total: 715.5, channel: "Instagram", delivery: "Envío exprés", destination: "Mérida", tags: "", address: "Calle 60 #45, Mérida" },
  { id: "#1036", customer: "Isabel Romero", email: "isa.romero@example.com", date: "2026-10-10", status: "pagado", fulfillment: "preparado", items: 1, total: 150.0, channel: "Tienda en línea", delivery: "Envío estándar", destination: "CDMX", tags: "", address: "Av. Insurgentes 900, CDMX" },
  { id: "#1035", customer: "Mauricio Peña", email: "mau.pena@example.com", date: "2026-10-10", status: "cancelado", fulfillment: "no_requerido", items: 2, total: 530.0, channel: "Punto de venta", delivery: "—", destination: "Guadalajara", tags: "", address: "Av. México 210, Guadalajara" },
  { id: "#1034", customer: "Carmen Aguilar", email: "carmen.a@example.com", date: "2026-10-09", status: "pagado", fulfillment: "preparado", items: 5, total: 2450.0, channel: "Tienda en línea", delivery: "Envío estándar", destination: "Monterrey", tags: "mayoreo", address: "Av. Gonzalitos 44, Monterrey" },
  { id: "#1033", customer: "Óscar Navarro", email: "oscar.n@example.com", date: "2026-10-09", status: "pendiente", fulfillment: "sin_preparar", items: 1, total: 310.0, channel: "Facebook", delivery: "Recolección", destination: "León", tags: "", address: "Blvd. López Mateos 77, León" },
  { id: "#1032", customer: "Patricia Vega", email: "paty.vega@example.com", date: "2026-10-08", status: "enviado", fulfillment: "preparado", items: 3, total: 1120.0, channel: "Tienda en línea", delivery: "Envío exprés", destination: "Puebla", tags: "frágil", address: "Av. Reforma 60, Puebla" },
  { id: "#1031", customer: "Fernando Soto", email: "fer.soto@example.com", date: "2026-10-08", status: "pagado", fulfillment: "preparado", items: 2, total: 680.0, channel: "Instagram", delivery: "Envío estándar", destination: "CDMX", tags: "vip", address: "Av. Coyoacán 1500, CDMX" },
]

export const orderStatusLabel: Record<OrderStatus, string> = {
  pagado: "Pagado",
  pendiente: "Pendiente",
  enviado: "Enviado",
  cancelado: "Cancelado",
}

export const fulfillmentLabel: Record<FulfillmentStatus, string> = {
  preparado: "Preparado",
  sin_preparar: "Sin preparar",
  no_requerido: "No se requiere",
}

// ── Analytics (dashboard) ────────────────────────────────────────────────

export const analyticsKpis = [
  { label: "Ventas brutas", value: "$1,009.40", spark: [0, 0, 0, 0, 0, 0, 2, 9, 1, 0] },
  { label: "Ventas netas", value: "$827.20", spark: [0, 0, 0, 0, 0, 0, 2, 8, 1, 0] },
  { label: "Pedidos", value: "5", spark: [0, 0, 0, 0, 0, 0, 2, 5, 1, 0] },
  { label: "Pedidos preparados", value: "4", spark: [0, 0, 0, 0, 0, 0, 1, 4, 1, 0] },
]

// Dos series: periodo actual y periodo anterior (comparativo)
export const salesOverTime = [
  { date: "12 jun", actual: 0, anterior: 0 },
  { date: "15 jun", actual: 0, anterior: 12 },
  { date: "18 jun", actual: 0, anterior: 0 },
  { date: "21 jun", actual: 0, anterior: 25 },
  { date: "24 jun", actual: 0, anterior: 0 },
  { date: "27 jun", actual: 0, anterior: 8 },
  { date: "30 jun", actual: 0, anterior: 0 },
  { date: "3 jul", actual: 95, anterior: 0 },
  { date: "6 jul", actual: 732, anterior: 15 },
  { date: "9 jul", actual: 0, anterior: 0 },
]

export const salesBreakdown = [
  { label: "Ventas brutas", value: 1009.4 },
  { label: "Descuentos", value: 0 },
  { label: "Devoluciones", value: -182.2 },
  { label: "Ventas netas", value: 827.2 },
  { label: "Cargos de envío", value: 0 },
  { label: "Cuotas de devolución", value: 0 },
  { label: "Impuestos", value: 0 },
  { label: "Ventas totales", value: 827.2 },
]

export const salesByChannel = [
  { channel: "Tienda en línea", value: 620 },
  { channel: "Punto de venta", value: 207.2 },
]

export const aovOverTime = [
  { date: "12 jun", actual: 0, anterior: 0 },
  { date: "19 jun", actual: 0, anterior: 48 },
  { date: "26 jun", actual: 0, anterior: 0 },
  { date: "3 jul", actual: 160, anterior: 22 },
  { date: "6 jul", actual: 202, anterior: 0 },
  { date: "10 jul", actual: 0, anterior: 0 },
]

// Métricas del encabezado de la página de clientes
export const customerMetrics = [
  { label: "Clientes", value: "24", spark: [10, 12, 14, 15, 17, 19, 21, 24] },
  { label: "Clientes nuevos", value: "3", spark: [0, 1, 0, 1, 0, 0, 1, 3] },
  { label: "Tasa de recompra", value: "12.5%", spark: [4, 6, 5, 8, 9, 11, 10, 12.5] },
  { label: "Gasto promedio", value: "$834.40", spark: [420, 510, 480, 640, 590, 720, 780, 834] },
  { label: "Clientes VIP", value: "4", spark: [1, 1, 2, 2, 3, 3, 4, 4] },
]

export const sessionsOverTime = [
  { date: "12 jun", sesiones: 24, visitantes: 18 },
  { date: "15 jun", sesiones: 38, visitantes: 29 },
  { date: "18 jun", sesiones: 31, visitantes: 22 },
  { date: "21 jun", sesiones: 46, visitantes: 35 },
  { date: "24 jun", sesiones: 41, visitantes: 30 },
  { date: "27 jun", sesiones: 57, visitantes: 44 },
  { date: "30 jun", sesiones: 49, visitantes: 36 },
  { date: "3 jul", sesiones: 74, visitantes: 58 },
  { date: "6 jul", sesiones: 92, visitantes: 71 },
  { date: "9 jul", sesiones: 60, visitantes: 47 },
]

export const ordersPerDay = [
  { day: "Lun", pedidos: 3 },
  { day: "Mar", pedidos: 5 },
  { day: "Mié", pedidos: 2 },
  { day: "Jue", pedidos: 6 },
  { day: "Vie", pedidos: 8 },
  { day: "Sáb", pedidos: 4 },
  { day: "Dom", pedidos: 1 },
]

// Progreso hacia la meta de ventas del periodo (para gráfica radial)
export const salesTarget = {
  current: 827.2,
  goal: 1200,
}

export const salesByProduct = [
  { name: "Pamina Comfort Edredón King", value: 700, previous: 0 },
  { name: "Hojas de tomillo premium – Hierba mediterránea", value: 99, previous: 0 },
  { name: "Pul Biber premium (hojuelas de chile turco)", value: 20, previous: 0 },
  { name: "Especia de pimiento rojo – Chile molido aromático", value: 8.2, previous: 0 },
]

// Métricas del día para el encabezado de la página de pedidos.
// "spark" alimenta la mini gráfica de tendencia de cada métrica.
export const todayOrderMetrics = [
  { label: "Pedidos", value: "12", spark: [2, 1, 0, 3, 1, 8, 4, 12] },
  { label: "Artículos pedidos", value: "31", spark: [4, 2, 1, 9, 3, 24, 12, 31] },
  { label: "Reversiones de ventas", value: "-$182", spark: [0, 0, -2, 0, 0, -6, -1, -3] },
  { label: "Pedidos preparados", value: "8", spark: [1, 0, 2, 1, 4, 2, 6, 8] },
  { label: "Pedidos entregados", value: "5", spark: [0, 1, 0, 2, 1, 3, 2, 5] },
]

// ── Cuentas por pagar / por cobrar ───────────────────────────────────────

export type AccountStatus = "pendiente" | "pagado" | "cobrado" | "vencido"

export const accountStatusLabel: Record<AccountStatus, string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  cobrado: "Cobrado",
  vencido: "Vencido",
}

export type Payable = {
  id: string
  vendor: string
  dueDate: string
  issueDate: string
  amount: number
  status: Extract<AccountStatus, "pendiente" | "pagado" | "vencido">
  category: string
  method: string
}

export const payables: Payable[] = [
  { id: "FP-2041", vendor: "MX Textil", issueDate: "2026-09-28", dueDate: "2026-10-28", amount: 18450.0, status: "pendiente", category: "Inventario", method: "Transferencia" },
  { id: "FP-2040", vendor: "Casa Norte", issueDate: "2026-09-20", dueDate: "2026-10-05", amount: 9230.5, status: "vencido", category: "Inventario", method: "Transferencia" },
  { id: "FP-2039", vendor: "Logística del Bajío", issueDate: "2026-09-30", dueDate: "2026-10-30", amount: 4120.0, status: "pendiente", category: "Logística", method: "Tarjeta" },
  { id: "FP-2038", vendor: "Aldama Home", issueDate: "2026-09-10", dueDate: "2026-10-10", amount: 25600.0, status: "pagado", category: "Inventario", method: "Transferencia" },
  { id: "FP-2037", vendor: "Energía MX", issueDate: "2026-09-15", dueDate: "2026-10-15", amount: 3870.75, status: "pagado", category: "Servicios", method: "Domiciliado" },
  { id: "FP-2036", vendor: "Publicidad Norte", issueDate: "2026-09-18", dueDate: "2026-10-02", amount: 7500.0, status: "vencido", category: "Marketing", method: "Tarjeta" },
  { id: "FP-2035", vendor: "Empaques del Centro", issueDate: "2026-10-01", dueDate: "2026-10-31", amount: 2140.0, status: "pendiente", category: "Insumos", method: "Transferencia" },
  { id: "FP-2034", vendor: "Seguros Patria", issueDate: "2026-09-05", dueDate: "2026-10-05", amount: 12300.0, status: "pagado", category: "Servicios", method: "Domiciliado" },
  { id: "FP-2033", vendor: "MX Textil", issueDate: "2026-09-25", dueDate: "2026-10-25", amount: 16890.0, status: "pendiente", category: "Inventario", method: "Transferencia" },
  { id: "FP-2032", vendor: "Renta Corporativa", issueDate: "2026-10-01", dueDate: "2026-10-05", amount: 32000.0, status: "vencido", category: "Renta", method: "Transferencia" },
  { id: "FP-2031", vendor: "Casa Norte", issueDate: "2026-09-12", dueDate: "2026-10-12", amount: 5400.0, status: "pagado", category: "Inventario", method: "Transferencia" },
  { id: "FP-2030", vendor: "Internet Fibra", issueDate: "2026-09-20", dueDate: "2026-10-20", amount: 1290.0, status: "pendiente", category: "Servicios", method: "Domiciliado" },
  { id: "FP-2029", vendor: "Papelería Express", issueDate: "2026-09-22", dueDate: "2026-10-22", amount: 870.5, status: "pendiente", category: "Insumos", method: "Tarjeta" },
  { id: "FP-2028", vendor: "Logística del Bajío", issueDate: "2026-09-08", dueDate: "2026-10-08", amount: 6450.0, status: "pagado", category: "Logística", method: "Transferencia" },
  { id: "FP-2027", vendor: "Diseño Studio", issueDate: "2026-09-26", dueDate: "2026-10-26", amount: 9800.0, status: "pendiente", category: "Marketing", method: "Transferencia" },
  { id: "FP-2026", vendor: "Mantenimiento Pro", issueDate: "2026-09-14", dueDate: "2026-09-29", amount: 2300.0, status: "vencido", category: "Servicios", method: "Tarjeta" },
]

export type Receivable = {
  id: string
  customer: string
  issueDate: string
  dueDate: string
  amount: number
  status: Extract<AccountStatus, "pendiente" | "cobrado" | "vencido">
  channel: string
  method: string
}

export const receivables: Receivable[] = [
  { id: "FC-5082", customer: "Boutique Aurora", issueDate: "2026-10-01", dueDate: "2026-10-31", amount: 12400.0, status: "pendiente", channel: "Mayoreo", method: "Transferencia" },
  { id: "FC-5081", customer: "Hotel Reforma", issueDate: "2026-09-15", dueDate: "2026-10-01", amount: 28900.0, status: "vencido", channel: "Corporativo", method: "Transferencia" },
  { id: "FC-5080", customer: "María González", issueDate: "2026-09-20", dueDate: "2026-10-20", amount: 1250.0, status: "cobrado", channel: "Tienda en línea", method: "Tarjeta" },
  { id: "FC-5079", customer: "Decoración Viva", issueDate: "2026-10-02", dueDate: "2026-11-01", amount: 8700.5, status: "pendiente", channel: "Mayoreo", method: "Transferencia" },
  { id: "FC-5078", customer: "Luis Ramírez", issueDate: "2026-09-18", dueDate: "2026-10-18", amount: 2104.99, status: "cobrado", channel: "Instagram", method: "Tarjeta" },
  { id: "FC-5077", customer: "Restaurante El Patio", issueDate: "2026-09-10", dueDate: "2026-09-25", amount: 15600.0, status: "vencido", channel: "Corporativo", method: "Transferencia" },
  { id: "FC-5076", customer: "Casa Bella", issueDate: "2026-10-03", dueDate: "2026-11-02", amount: 6400.0, status: "pendiente", channel: "Mayoreo", method: "Transferencia" },
  { id: "FC-5075", customer: "Ana Martínez", issueDate: "2026-09-22", dueDate: "2026-10-22", amount: 820.0, status: "cobrado", channel: "Tienda en línea", method: "Tarjeta" },
  { id: "FC-5074", customer: "Spa Zen", issueDate: "2026-09-12", dueDate: "2026-10-12", amount: 9300.0, status: "pendiente", channel: "Corporativo", method: "Transferencia" },
  { id: "FC-5073", customer: "Hotel Reforma", issueDate: "2026-09-05", dueDate: "2026-09-20", amount: 34200.0, status: "vencido", channel: "Corporativo", method: "Transferencia" },
  { id: "FC-5072", customer: "Jorge Flores", issueDate: "2026-09-28", dueDate: "2026-10-28", amount: 640.0, status: "cobrado", channel: "Facebook", method: "Tarjeta" },
  { id: "FC-5071", customer: "Mueblería Centro", issueDate: "2026-10-01", dueDate: "2026-10-31", amount: 18200.0, status: "pendiente", channel: "Mayoreo", method: "Transferencia" },
  { id: "FC-5070", customer: "Lucía Pérez", issueDate: "2026-09-16", dueDate: "2026-10-16", amount: 1580.25, status: "cobrado", channel: "Tienda en línea", method: "Tarjeta" },
  { id: "FC-5069", customer: "Oficinas Delta", issueDate: "2026-09-08", dueDate: "2026-09-23", amount: 21000.0, status: "vencido", channel: "Corporativo", method: "Transferencia" },
  { id: "FC-5068", customer: "Boutique Aurora", issueDate: "2026-09-25", dueDate: "2026-10-25", amount: 7400.0, status: "pendiente", channel: "Mayoreo", method: "Transferencia" },
  { id: "FC-5067", customer: "Diego Sánchez", issueDate: "2026-09-19", dueDate: "2026-10-19", amount: 475.0, status: "cobrado", channel: "Punto de venta", method: "Efectivo" },
]

export const payableMetrics = [
  { label: "Total por pagar", value: "$102,340", spark: [60, 72, 68, 80, 90, 85, 95, 102] },
  { label: "Vencido", value: "$51,000", spark: [10, 14, 20, 28, 35, 42, 48, 51] },
  { label: "Por vencer (7 días)", value: "$23,870", spark: [30, 28, 25, 22, 26, 24, 23, 23] },
  { label: "Facturas abiertas", value: "9", spark: [12, 11, 10, 11, 10, 9, 9, 9] },
  { label: "Proveedores", value: "11", spark: [8, 9, 9, 10, 10, 11, 11, 11] },
]

export const receivableMetrics = [
  { label: "Total por cobrar", value: "$148,970", spark: [90, 100, 110, 120, 130, 140, 145, 148] },
  { label: "Vencido", value: "$99,000", spark: [20, 35, 48, 60, 72, 84, 92, 99] },
  { label: "Por cobrar (7 días)", value: "$31,100", spark: [40, 38, 35, 33, 32, 31, 31, 31] },
  { label: "Facturas abiertas", value: "9", spark: [13, 12, 11, 11, 10, 9, 9, 9] },
  { label: "Clientes", value: "12", spark: [9, 10, 10, 11, 11, 12, 12, 12] },
]

// ── Inventario ────────────────────────────────────────────────────────────

export type StockStatus = "en_stock" | "bajo" | "agotado"

export const stockStatusLabel: Record<StockStatus, string> = {
  en_stock: "En stock",
  bajo: "Bajo",
  agotado: "Agotado",
}

export type InventoryItem = {
  sku: string
  product: string
  category: string
  location: string
  available: number
  committed: number
  onHand: number
  unitCost: number
  status: StockStatus
}

export const inventory: InventoryItem[] = [
  { sku: "EDR-PAM-BLA-KNG", product: "Pamina Comfort Edredón · Blanco / King", category: "Edredones", location: "Bodega CDMX", available: 0, committed: 2, onHand: 2, unitCost: 540, status: "agotado" },
  { sku: "EDR-PAM-BLA-QUE", product: "Pamina Comfort Edredón · Blanco / Queen", category: "Edredones", location: "Bodega CDMX", available: 8, committed: 1, onHand: 9, unitCost: 540, status: "en_stock" },
  { sku: "EDR-PAM-BEI-KNG", product: "Pamina Comfort Edredón · Beige / King", category: "Edredones", location: "Bodega CDMX", available: 3, committed: 0, onHand: 3, unitCost: 540, status: "bajo" },
  { sku: "MAN-OCR-STD", product: "Manta Ocre", category: "Mantas", location: "Bodega GDL", available: 30, committed: 0, onHand: 30, unitCost: 180, status: "en_stock" },
  { sku: "TOA-ALG-GRS", product: "Toalla de algodón · Gris", category: "Baño", location: "Bodega GDL", available: 2, committed: 4, onHand: 6, unitCost: 95, status: "bajo" },
  { sku: "ALM-PLU-STD", product: "Almohada de plumón", category: "Almohadas", location: "Bodega CDMX", available: 42, committed: 6, onHand: 48, unitCost: 220, status: "en_stock" },
  { sku: "SAB-LIN-KNG", product: "Juego de sábanas lino · King", category: "Sábanas", location: "Bodega MTY", available: 0, committed: 0, onHand: 0, unitCost: 410, status: "agotado" },
  { sku: "SAB-LIN-QUE", product: "Juego de sábanas lino · Queen", category: "Sábanas", location: "Bodega MTY", available: 15, committed: 2, onHand: 17, unitCost: 410, status: "en_stock" },
  { sku: "COB-TER-GRS", product: "Cobija térmica · Gris", category: "Cobijas", location: "Bodega GDL", available: 4, committed: 1, onHand: 5, unitCost: 260, status: "bajo" },
  { sku: "TAP-DEC-RED", product: "Tapete decorativo · Rojo", category: "Tapetes", location: "Bodega CDMX", available: 20, committed: 3, onHand: 23, unitCost: 150, status: "en_stock" },
  { sku: "COR-BLK-GRS", product: "Cortina blackout · Gris", category: "Cortinas", location: "Bodega MTY", available: 1, committed: 2, onHand: 3, unitCost: 320, status: "bajo" },
  { sku: "FUN-DEC-BEI", product: "Funda decorativa · Beige", category: "Fundas", location: "Bodega GDL", available: 60, committed: 8, onHand: 68, unitCost: 75, status: "en_stock" },
  { sku: "EDR-PAM-VER-KNG", product: "Pamina Comfort Edredón · Verde / King", category: "Edredones", location: "Bodega CDMX", available: 0, committed: 0, onHand: 0, unitCost: 540, status: "agotado" },
  { sku: "ALM-MEM-STD", product: "Almohada memory foam", category: "Almohadas", location: "Bodega CDMX", available: 25, committed: 5, onHand: 30, unitCost: 290, status: "en_stock" },
  { sku: "TOA-ALG-BLA", product: "Toalla de algodón · Blanco", category: "Baño", location: "Bodega GDL", available: 3, committed: 2, onHand: 5, unitCost: 95, status: "bajo" },
  { sku: "SAB-ALG-IND", product: "Juego de sábanas algodón · Individual", category: "Sábanas", location: "Bodega MTY", available: 18, committed: 1, onHand: 19, unitCost: 280, status: "en_stock" },
]

export const inventoryMetrics = [
  { label: "SKUs totales", value: "16", spark: [12, 13, 14, 15, 15, 16, 16, 16] },
  { label: "Unidades disponibles", value: "269", spark: [300, 290, 285, 280, 275, 272, 270, 269] },
  { label: "Comprometidas", value: "39", spark: [20, 24, 28, 31, 34, 36, 38, 39] },
  { label: "Bajo stock", value: "5", spark: [2, 2, 3, 3, 4, 4, 5, 5] },
  { label: "Agotados", value: "3", spark: [0, 1, 1, 2, 2, 3, 3, 3] },
]

// ── Notificaciones (panel del sidebar) ───────────────────────────────────

export type NotificationKind = "pedido" | "pago" | "inventario" | "mencion"

export type AppNotification = {
  id: string
  kind: NotificationKind
  title: string
  description: string
  time: string
  unread: boolean
  mention?: boolean
}

export const notifications: AppNotification[] = [
  { id: "n1", kind: "pedido", title: "Nuevo pedido #1054", description: "María González realizó un pedido por $1,250.00.", time: "Justo ahora", unread: true },
  { id: "n2", kind: "pago", title: "Pago recibido", description: "Se cobró la factura FC-5080 por $1,250.00.", time: "Hace 12 min", unread: true },
  { id: "n3", kind: "inventario", title: "Stock bajo", description: "«Toalla de algodón · Gris» quedó con 2 unidades.", time: "Hace 1 h", unread: true },
  { id: "n4", kind: "mencion", title: "Ana te mencionó", description: "@ricardo revisa la factura vencida de Hotel Reforma.", time: "Hace 3 h", unread: false, mention: true },
  { id: "n5", kind: "inventario", title: "Producto agotado", description: "«Pamina Comfort Edredón · Verde / King» se agotó.", time: "Ayer", unread: false },
  { id: "n6", kind: "pedido", title: "Pedido preparado", description: "El pedido #1048 fue marcado como preparado.", time: "Ayer", unread: false },
  { id: "n7", kind: "pago", title: "Factura vencida", description: "La factura FP-2040 de Casa Norte venció hoy.", time: "18 oct 2026", unread: false },
  { id: "n8", kind: "mencion", title: "Diego te mencionó", description: "@ricardo ¿aprobamos el ajuste de inventario?", time: "17 oct 2026", unread: false, mention: true },
]

// ── Creación de pedidos ───────────────────────────────────────────────────

export const salesReps = [
  "Laura Méndez",
  "Pedro Ramos",
  "Sofía Lara",
  "Jorge Niño",
  "Mónica Salas",
]

export const orderTypes: Record<string, string> = {
  venta: "Venta",
  cotizacion: "Cotización",
  preventa: "Preventa",
  devolucion: "Devolución",
}

export const saleTypes: Record<string, string> = {
  contado: "Contado",
  credito: "Crédito",
  consignacion: "Consignación",
}

// Catálogo de clientes para el buscador (deriva de los pedidos existentes)
export const customers = [...new Set(orders.map((o) => o.customer))].sort()

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
    value
  )

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(
    new Date(`${iso}T12:00:00`)
  )
