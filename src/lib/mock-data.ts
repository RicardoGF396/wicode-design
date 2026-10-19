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

export type Metric = {
  label: string
  value: string
  change: number
}

export const metrics: Metric[] = [
  { label: "Visitas", value: "12,480", change: 12.4 },
  { label: "Ventas totales", value: "$48,920", change: 8.1 },
  { label: "Pedidos", value: "1,024", change: -2.3 },
  { label: "Tasa de conversión", value: "3.2%", change: 0.6 },
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

export const salesByMonth = [
  { month: "May", ventas: 18600, pedidos: 420 },
  { month: "Jun", ventas: 22400, pedidos: 510 },
  { month: "Jul", ventas: 19800, pedidos: 468 },
  { month: "Ago", ventas: 26900, pedidos: 590 },
  { month: "Sep", ventas: 31200, pedidos: 645 },
  { month: "Oct", ventas: 48920, pedidos: 1024 },
]

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
    value
  )

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(
    new Date(`${iso}T12:00:00`)
  )
