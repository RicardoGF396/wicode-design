# Páginas receta

Cada página de `src/pages/` es una **receta reutilizable**: para una pantalla
nueva, copia la receta más cercana y cambia datos y textos. No se diseñan
pantallas desde cero.

Rutas en `src/App.tsx`: auth fuera de `AppLayout`; todo lo demás dentro.

---

## 1. Login — `src/pages/login.tsx`

**Receta:** `AuthLayout` > `Card` > `form` > `FieldGroup`.

- Estructura: título + descripción (`CardHeader` centrado), email, contraseña
  (con link "¿Olvidaste…?" junto al label), botón primario full-width,
  `FieldSeparator` "O continúa con", botones sociales `outline` en grid de 2,
  `FieldDescription` final con link a registro.
- Validación: zod (`z.email()`, mínimo 8 caracteres), errores con `FieldError`.
- Envío: `Spinner` en el botón + `disabled`, `toast.success` al terminar.

**Recicla para:** recuperación de contraseña, verificación de código, MFA.

## 2. Sign up — `src/pages/signup.tsx`

Misma receta que login con más campos. Lo único nuevo:

- Confirmación de contraseña con `.refine()` en el esquema zod
  (`path: ["confirmPassword"]` para que el error caiga en el campo correcto).
- `FieldDescription` como ayuda bajo el campo ("Mínimo 8 caracteres.").

**Recicla para:** cualquier wizard corto de alta, onboarding de un paso.

## 3. Dashboard — `src/pages/dashboard.tsx`

**Receta (patrón Analytics):** `PageActions` solo con secundarios (Exportar,
Imprimir; sin acción primaria) → fila de filtros de periodo → 8 KPIs con
sparkline → grid 2/3 + 1/3 (gráfica principal + desglose) → grid de 3 (dona
por canal, serie secundaria, barras por producto) → grid de 3 con más
gráficas shadcn (`AreaChart` con gradiente, `BarChart` con esquinas
redondeadas, `RadialBarChart` de progreso hacia la meta con % centrado).

- Filtros de periodo: `Select` de presets (Hoy/7/30/90 días/Personalizado) +
  `Popover` con `Tabs` Rango/Día y `Calendar` (`mode="range"` con
  `numberOfMonths={2}`, o `mode="single"`), formato con `date-fns` y locale
  `es` + botón de moneda.
- KPI: card horizontal con label de subrayado punteado, valor
  `text-lg font-medium tabular-nums` + guion de tendencia y `Sparkline`.
- Series temporales: `LineChart` con DOS series — periodo actual
  (`--chart-2`) y periodo anterior (mismo color al 35% vía `color-mix`) — y
  leyenda de periodos con puntos de color.
- Desglose: lista de filas alternadas (`bg-muted/50` en pares), label en
  `text-info` y valor tabular.
- Dona: `PieChart` con `innerRadius`, total centrado con overlay absoluto y
  leyenda lateral.
- Barras por producto: divs con ancho proporcional al máximo (sin recharts),
  valor al lado y línea comparativa del periodo anterior.

**Recicla para:** analytics, reportes, resumen ejecutivo de cualquier módulo.

## 4. Table — `src/pages/table-page.tsx`

**Receta (patrón Orders):** `PageActions` (Exportar `outline` + Crear
primario, en el header del layout) → card de métricas del periodo (chip de
fecha + segmentos con borde, label con subrayado punteado, valor y
`Sparkline`) → **una sola card** que integra la barra de filtro (select de
estado + búsqueda "Buscar y filtrar" + botón de columnas) y la
`Table className="data-table table-sticky-header table-sticky-col"` → pie con
selección, selector "Filas por página" (10/25/50/100, default 25) y
paginación, siempre visibles sin scroll de página.

- Columnas: checkbox de selección, id en `font-medium`, celda compuesta
  (principal + secundario en `text-xs text-muted-foreground`), fecha oculta en
  móvil (`hidden md:table-cell`), `OrderStatusBadge`, total `text-right
  tabular-nums`, menú `MoreHorizontal` al final.
- Filtros: estado en `useState` + `useMemo`; `setPage(1)` al cambiar filtro.
  Nunca tabs para estados: siempre el select dentro de la barra de búsqueda.
  Junto al botón de columnas va un botón de filtro (icono `ListFilter`) que
  abre un `Popover` con paneles de checkboxes (canal, preparación…) y un badge
  con el número de filtros activos.
- Métricas: el chip de fecha es un `Select` de periodo (Hoy/7/30 días/mes) y
  las sparklines son `interactive` (muestran el valor al hacer hover).
- Crear/editar: la primaria y la acción "Editar" de la fila abren un `Dialog`
  con el formulario del registro (remontado por `key` para resetear); al
  guardar, `toast` de confirmación.
- Estilo de tabla: `data-table` (filas blancas con divisores finos, sin
  zebra ni líneas verticales), ver DESIGN_RULES §8.
- Filas canceladas/archivadas: atributo `data-cancelled` en el `TableRow`
  (texto tachado automático, badges intactos).
- Eliminar: `AlertDialog` anidado en el `DropdownMenu` con
  `closeOnClick={false}` en el item para que el menú no cierre el diálogo.
- Vacío: `Empty` dentro de un `TableCell colSpan`.

**Recicla para:** cualquier listado CRUD (productos, usuarios, facturas).
Con cientos de filas o sort complejo, migrar el estado a TanStack Table
manteniendo este mismo markup.

## 5. Drawer Detail — `src/pages/drawer-detail.tsx`

**Receta:** misma estructura que Table (métricas con sparkline, filtro
integrado con select de segmento + búsqueda + selector de columnas, columnas
configurables, selección, pie con filas por página y paginación) + filas
`cursor-pointer` que abren **un solo** `Sheet` controlado para toda la lista.

- El checkbox de selección lleva `onClick` con `stopPropagation` para no
  abrir el drawer al seleccionar.

- Estado: `useState<Entidad | null>`; `open={x !== null}` y
  `onOpenChange` que limpia al cerrar. Nunca un Sheet por fila.
- Ancho y posición: `SheetContent` flotante con márgenes y esquinas
  redondeadas — `data-[side=right]:inset-y-3 data-[side=right]:right-3
  data-[side=right]:h-auto data-[side=right]:border data-[side=right]:sm:max-w-xl`
  + `rounded-xl overflow-hidden`. Clave: el componente base pinta la posición
  y el ancho con la variante `data-[side=right]:` (inset-y-0, right-0, h-full,
  sm:max-w-sm); para sobrescribirlos hay que usar la MISMA variante, o
  tailwind-merge conserva ambos y gana el del componente.
- Estructura homologada a shadcn: `SheetContent` con `gap-0 p-0`; header con
  `border-b p-6` (avatar + título/subtítulo + badge de segmento, `pr-12` para
  librar el botón de cerrar); cuerpo `flex-1 overflow-y-auto p-6 space-y-6`
  (stats en grid de 2 con `bg-muted/40`, contacto en tarjeta con `divide-y`,
  `Tabs`). Sin footer de acciones.

**Recicla para:** detalle de pedido, ficha de usuario, panel de configuración
contextual, preview de registro.

## 6. One Page Forms — `src/pages/forms.tsx`

**Receta:** `PageActions` (Descartar con `AlertDialog` de confirmación +
Guardar primario asociado por `form="<id>"`) → resumen de errores
(`Alert variant="destructive"` con conteo, visible tras submit inválido) →
`form` en grid `lg:grid-cols-3` con una `Card` por sección.

Casos cubiertos (catálogo de patrones de formulario):

- **Texto y validación**: `Field` + `Input` + `FieldError`, esquema zod único
  con mensajes en español; `aria-invalid`/`data-invalid` en cada campo.
- **Rich text**: toolbar (negritas, cursivas, subrayado, listas) +
  `contentEditable` controlado con `Controller`; la validación zod se hace
  sobre el texto plano (strip de etiquetas).
- **Subida de imágenes**: dropzone con drag & drop (estado resaltado con
  `border-info`), input file oculto, previews en grid con botón de quitar y
  límite validado por zod.
- **Dinero y unidades**: `InputGroup` con prefijos/sufijos (`$`, `+$`,
  dominio del slug).
- **Lista dinámica**: variantes con `useFieldArray` (agregar/eliminar filas,
  errores por fila y error raíz de mínimo/máximo).
- **Búsqueda en listas**: combobox de categoría con `Popover` + `Command`
  (búsqueda, check en la seleccionada) y item `forceMount`
  "Crear categoría…" que abre un **`Dialog`** de alta rápida (crea,
  selecciona y notifica con toast).
- **Badges**: etiquetas tipo tags-input (Enter/coma agrega, X quita),
  renderizadas como `Badge` neutral.
- **Contadores**: campos SEO con contador `n/máx` que se pinta destructive
  al excederse; slug validado con regex.
- **Controles**: `Select`, `RadioGroup`, `Switch`, `Checkbox` conectados con
  `Controller`; los nativos con `form.register`.
- **Fechas y hora**: `Popover` + `Calendar` en `mode="single"` (fecha de
  disponibilidad, requerida con `z.date`) y `mode="range"` (promoción,
  opcional), formato con `date-fns` y locale `es`; hora con
  `Input type="time"`.
- **Slider**: descuento 0–50% con valor visible junto al label.
- **Toggle group**: condición (Nuevo/Usado/Reacondicionado) de selección
  única (el `value` de Base UI es arreglo; se toma el último).
- **Stepper numérico**: stock con `InputGroupButton` +/- que hace
  `setValue` validado.
- **OTP**: PIN de bodega con `InputOTP` de 4 dígitos (`z.string().length`).
- **Regex y formatos**: SKU en mayúsculas, código de barras de 8–14 dígitos,
  teléfono, `z.email` y `z.url` (sitio opcional con `z.literal("")`).
- **Color picker**: input nativo `type="color"` sincronizado con un `Input`
  hex validado por regex.
- **Multi-selección**: canales de venta como grupo de checkboxes sobre
  `z.array(...).min(1)`.
- **Campo condicional**: "Incluye garantía" (`Switch`) muestra "Meses de
  garantía", obligatorio solo si está activo (`superRefine`).
- **Textarea con contador**: notas internas con máximo de 300.

**Recicla para:** alta/edición de cualquier entidad compleja, página de
configuración, wizard de un paso.

---

## Checklist para una página nueva

- [ ] Parte de la receta más cercana de esta lista.
- [ ] Vive en `src/pages/` y se registra en `src/App.tsx` (y en el sidebar si
      corresponde, en `src/components/layout/app-sidebar.tsx`).
- [ ] Declara sus botones principales con `PageActions` (o usa `AuthLayout`
      si es pública). El título y el icono del header se registran en el mapa
      `pages` de `app-layout.tsx`.
- [ ] Datos tipados en `src/lib/` (mock) o capa de API real.
- [ ] Estados vacío, carga y error resueltos (`Empty`, `Skeleton`, `toast`).
- [ ] Probada en light y dark, y en ancho móvil.

## 7. Guía MCP — `src/pages/mcp-guide.tsx`

**Receta (página de detalle):** columna única centrada con
`max-w-[600px]` → banner informativo descartable (icono en círculo
`bg-info/15`, texto con link y X) → card de configuración con secciones
colapsables (`Collapsible` con header `bg-muted/50` + chevron rotatorio;
radio + checkboxes dentro) y `CardFooter` gris con link → card "Código" con
`Select` en el header para cambiar snippet y `CodeBlock variant="editor"`
(números de línea).

- Acciones: solo secundarias (Probar, Más acciones ▾, link a docs).

**Recicla para:** detalle de una integración, configuración de un conector,
onboarding técnico.

## 8. Documentación — `src/pages/docs-page.tsx`

**Receta:** `PageActions` (Descargar todo) → `Tabs` con un documento por
pestaña → card de altura completa con header (título + archivo + botones
Copiar y Descargar) y cuerpo `pre` scrolleable. El contenido se importa con
`?raw` desde `/docs`, así siempre refleja la fuente de verdad.

**Recicla para:** visores de changelog, políticas o cualquier markdown.

## 9. Listados sobre DataTableShell — pagar / cobrar / inventario

`src/pages/accounts-payable.tsx`, `accounts-receivable.tsx`, `inventory.tsx`.

**Receta:** `PageActions` (Exportar + primaria) + `<DataTableShell>` con la
configuración de la página. El shell (`components/data-table/`) aporta toda la
receta Table (métricas con sparkline, filtro integrado, columnas
configurables, selección, sticky, paginación). Cada página solo define:

- `metrics`, `filterItems` + `matchesFilter`/`matchesSearch`.
- Filtro por fecha: el shell pinta un `PeriodFilter` en la primera celda de la
  franja de métricas (homologado con el resto de páginas con métricas + tabla).
  Opcional: `periodItems` para cambiar las opciones y `defaultPeriod` para el
  valor inicial (ej. `defaultPeriod="mes"` en pagar/cobrar).
- `primaryHeader`/`primaryCell` (columna sticky, ej. Folio o Producto) y
  `columns` (`DataColumn<T>[]`).
- `rows`, `getRowId`, `entityPlural` y `rowActions` (menú por fila con su
  `AlertDialog` de borrado).
- Estado de negocio con el badge de dominio (`AccountStatusBadge`,
  `StockStatusBadge`) sobre `StatusPill` — vencido/agotado en tono `critical`.

**Edición rápida en celda (Inventario):** las columnas pueden volverse
editables desde su `cell`. Dos patrones listos:
- **Estado** → `DropdownMenu` (clic normal, cursor pointer) con
  `DropdownMenuRadioGroup` para cambiar el estatus de la fila. Los
  `DropdownMenuRadioItem` llevan `closeOnClick` (el default de Base UI es no
  cerrar), el `DropdownMenuLabel` va DENTRO del `RadioGroup` (Base UI exige un
  grupo), y la página mantiene `rows` en estado.
- **Costo unitario** → celda con `cellClass="relative p-0"` y un `<button
  className="absolute inset-0 …">` que cubre toda la altura de la celda:
  cursor pointer, `hover:bg-foreground/10` y un chevron que aparece en hover
  (`group-hover/cost`); al hacer clic abre un `Dialog` para editar el valor.

**Recicla para:** cualquier listado nuevo (facturas, movimientos, usuarios…).
Partir de una de estas tres páginas es el camino más corto para un listado.

## 10. Crear pedido — `src/pages/create-order.tsx`

**Receta (constructor de pedido, 2 columnas):** `PageActions` (Descartar con
`AlertDialog` + Crear pedido) → grid `lg:grid-cols-3`:

- Columna principal (2/3): card **Productos** (botón "Agregar producto" que
  abre un `Dialog` **con estilo de tabla**: barra de búsqueda + `Select` de
  filtro, `Table className="data-table"` con columnas checkbox / Producto /
  Disponible (triángulo `text-warning` si 0) / Precio, selección múltiple
  sincronizada con el carrito y footer "N seleccionados" + Cancelar / Agregar;
  el `DialogFooter` necesita `mx-0 mb-0` porque su estilo base asume `p-4` en
  el contenido). Cada línea del carrito: miniatura con borde, nombre (peso 400)
  + SKU debajo, precio unitario en `text-primary`, cantidad editable, importe y
  quitar; si el producto tiene 0 disponibles se muestra un banner de aviso
  (`bg-badge-warning/25`) arriba de esa línea, y las líneas se separan con
  `Separator`. Card **Pago** con subtotal, descuento, envío, IVA y total
  calculados en vivo.
- Columna lateral (1/3): card **Detalles del pedido** (Cliente como combobox
  `Popover`+`Command`, Vendedor, Tipo de pedido, Vendedor secundario opcional,
  Tipo de venta como `Select`) y card **Notas** (`Textarea`).

El carrito y los totales se actualizan mientras se capturan los datos. Se
abre desde el botón "Crear pedido" de Pedidos (`navigate("/orders/new")`).

**Recicla para:** punto de venta, cotizador, cualquier constructor con
catálogo + carrito + resumen.
