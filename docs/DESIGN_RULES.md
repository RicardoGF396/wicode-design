# Reglas de diseño

Reglas obligatorias para cualquier proyecto construido sobre esta base.
Si una pantalla no puede construirse siguiendo estas reglas, se discute en
equipo antes de romperlas.

## 1. Principios

1. **shadcn/ui primero.** Nunca escribas un `<button>`, `<input>`, `<select>`
   o modal a mano si existe el componente en `src/components/ui/`. Si falta un
   componente, se agrega con `npx shadcn@latest add <componente>`, no se
   improvisa.
2. **Tokens, no valores sueltos.** Los colores, radios y tipografías salen de
   los tokens de `src/index.css`. Prohibido usar hex/oklch directos o clases
   de paleta de Tailwind (`bg-zinc-100`, `text-green-600`) en páginas.
   Ver [TOKENS.md](./TOKENS.md).
3. **Las páginas se componen, no se diseñan desde cero.** Toda pantalla nueva
   parte de una de las páginas receta de [PAGES.md](./PAGES.md).
4. **Light y dark siempre.** El tema por defecto es **light** y solo se cambia
   desde Configuración (dropdown del sidebar); no hay toggles de tema en el
   header ni atajos de teclado. Aun así, todo lo que se construya debe verse
   bien en ambos temas — si usaste tokens, esto es automático.

## 2. Layout

- Toda página interna vive dentro de `AppLayout` (sidebar + header + `<main>`).
- El sidebar usa `variant="inset"`: el contenido flota como tarjeta redondeada
  (`rounded-xl` + sombra) sobre el fondo del sidebar, sin pegarse a los bordes.
  No cambiar esta variante por página.
- El `<main>` usa `flex flex-col gap-6 p-6`. No agregues paddings propios al
  nivel de página.
- El header de página es **estándar y lo renderiza el layout**: compacto
  (h-14), sin borde inferior, icono + título (`text-sm font-medium`) a la
  izquierda y las **acciones principales de la página arriba a la derecha**.
  Las páginas declaran sus botones con `<PageActions>…</PageActions>`; nunca
  construyen su propio header ni usan breadcrumbs. Máximo tres controles:
  secundaria `outline` + "Más acciones" (`outline` con `ChevronDown`, abre un
  `DropdownMenu` con las acciones restantes) + la primaria. Si hay más de dos
  acciones secundarias, van dentro de "Más acciones", no como botones extra. El header no lleva utilidades
  globales: notificaciones (con badge rojo de no leídas) y Configuración viven
  en el footer del sidebar.
- Las páginas de autenticación usan `AuthLayout` (centrado, max-w-sm, logo
  arriba, legales abajo). Nada más vive fuera de estos dos layouts.
- El sidebar es oscuro en ambos temas (tokens `--sidebar-*`); el contenido es
  claro en light y oscuro en dark. No se invierte.

## 3. Escala e interacción globales

- El sistema se renderiza a **escala 90%** (`html { font-size: 90% }` en
  `src/index.css`): todo lo definido en rem — texto, espaciado, iconos,
  anchos de sidebar — escala junto. No compensar con tamaños más grandes por
  componente; si algo se ve pequeño, es decisión de sistema, no de página.
- Todo elemento interactivo habilitado muestra `cursor: pointer` y los
  deshabilitados `cursor: not-allowed` (reglas globales en `src/index.css`);
  no declarar cursores por componente.
- Los botones que no son la acción principal son **blancos** (variante
  `outline`, fondo `bg-card`). La acción principal es la única con
  `bg-primary`.

## 4. Densidad y espaciado

- Una sola densidad por página: `gap-6` entre secciones, `p-6` en contenedores,
  `text-sm` como tamaño base. No mezclar con valores arbitrarios (`p-[13px]`).
- Grids responsivos estándar:
  - métricas: `grid gap-4 sm:grid-cols-2 lg:grid-cols-4`
  - tarjetas de contenido: `grid gap-6 md:grid-cols-2 lg:grid-cols-3`
- Radio: usar las utilidades `rounded-md` / `rounded-lg` / `rounded-xl`
  (derivadas de `--radius`). Nunca `rounded-[10px]`.

## 5. Tipografía

- **Inter** (`font-sans`) para todo el texto. **Inter Display**
  (`font-heading`) para títulos — `h1`–`h6` la aplican automáticamente.
- **Peso máximo: 500 (`font-medium`).** Prohibido cualquier peso mayor:
  `font-semibold`, `font-bold` o valores arbitrarios ≥ 600 no existen en este
  sistema. La jerarquía se logra con tamaño y color, no con pesos pesados.
- Jerarquía fija:
  - Título de página: icono `size-5` + `text-base font-medium` (lo pone el
    layout, alineado al `p-6` del contenido)
  - Título de sección/saludo en contenido: `text-2xl font-medium tracking-tight`
  - Título de card: `CardTitle` (no personalizar tamaño salvo `text-base` en
    tarjetas pequeñas)
  - Texto secundario: `text-sm text-muted-foreground`
  - Metadatos / ayuda: `text-xs text-muted-foreground`
- Números tabulares en cifras y dinero: agregar `tabular-nums`.

## 6. Color semántico

- Texto principal `text-foreground`; secundario `text-muted-foreground`.
- Superficies: `bg-background` (página), `bg-card` (tarjetas),
  `bg-muted` (énfasis suave).
- Estados de negocio **siempre** con tokens semánticos:
  `--success`, `--warning`, `--info`, `--destructive`. Los badges de estado se
  centralizan en un componente (ver `OrderStatusBadge`), nunca se colorea un
  badge inline en la página.
- Un solo color de acento por proyecto (`--primary`). Las gráficas usan
  `--chart-1` … `--chart-5` en orden.

## 7. Iconos

- Solo **lucide-react** (el set oficial de shadcn).
- Tamaño por defecto dentro de componentes shadcn: automático (16px). Fuera de
  ellos: `size-4` (o `size-5` en contenedores destacados). Nunca más grande en
  UI de producto.
- Icono + texto en botones: usar `data-icon="inline-start"` /
  `data-icon="inline-end"` para que el padding se ajuste solo.

## 8. Tablas

- Toda tabla de datos usa `<Table className="data-table">` (patrón Orders):
  filas blancas con divisores horizontales finos y encabezado con fondo
  `--table-header` (#f7f7f7) y borde superior e inferior. **Sin zebra y sin
  líneas verticales entre columnas.** La clase vive en `src/index.css`; no
  recrear el patrón con utilidades sueltas.
- El texto de tablas usa el token `--table-foreground` (#4b4b4b en light),
  aplicado automáticamente por `data-table`; no fijar colores de texto por
  celda salvo `text-muted-foreground` para datos secundarios.
- Columnas con aire: cada `TableHead` define su ancho mínimo (`min-w-24` a
  `min-w-48` según el contenido); nunca dejar que todas las columnas se
  compriman al mínimo.
- La paginación debe verse sin hacer scroll de página: la card de la tabla
  lleva `min-h-0 flex-1 !shrink` y el contenido scrollea por dentro
  (`table-sticky-header` hace que el contenedor interno sea `flex-1` con
  `overflow-y: auto`).
- Tablas anchas (con scroll horizontal): agregar `table-sticky-header`
  (encabezado fijo dentro de la card) y `table-sticky-col`
  (checkbox + primera columna de datos fijos a la izquierda, con sombra y
  fondo sólido). Ambas clases viven en `src/index.css`.
- Filas canceladas/archivadas: `data-cancelled` en el `TableRow` — el texto
  se tacha automáticamente y los badges quedan intactos.
- El filtro de una tabla es **una sola barra integrada a la card de la
  tabla**: select de estado (con separador vertical) + búsqueda "Buscar y
  filtrar" + botón de columnas a la derecha, que abre un menú con
  `DropdownMenuCheckboxItem` para mostrar/ocultar cada columna
  (`closeOnClick={false}`). Las columnas se definen como configuración
  (arreglo `ColumnDef`) para poder ocultarse. Nunca tabs para filtrar estados.
- Checkbox de selección en la primera columna; acciones por fila al final.
- **Una sola línea por celda.** Nunca apilar dato principal + secundario
  (ej. nombre y correo) en la misma celda: el dato secundario va en su propia
  columna (ocultable en pantallas chicas con `hidden lg:table-cell`) o en el
  detalle de la fila.
- Badges de estado: **siempre** el componente `StatusPill` con el estándar
  semántico tipo semáforo — nunca colores sueltos ni tonos nuevos. Texto en
  peso 400 color foreground; punto relleno si el estado está asentado/terminal
  y círculo abierto si está activo y pide seguimiento:

  | Tono | Color | Significado | Ejemplos |
  |---|---|---|---|
  | `success` | verde `--badge-success` | resultado positivo confirmado | Pagado, Cobrado, Preparado, En stock |
  | `info` | azul `--badge-info` | en tránsito · informativo activo | Enviado |
  | `warning` | amarillo `--badge-warning` | requiere atención · pendiente · bajo | Pendiente, Sin preparar, Bajo |
  | `critical` | rojo `--badge-critical` | negativo · urgente | Vencido, Agotado, Cancelado |
  | `neutral` | gris `--badge-neutral` | sin carga · no aplica | No se requiere |

  Un estado se mapea a un tono por su **significado**, no por su página: el
  mismo significado usa siempre el mismo color. Cada entidad tiene su badge de
  dominio (`OrderStatusBadge`, `AccountStatusBadge`, `StockStatusBadge`…) que
  solo mapea estado → tono sobre `StatusPill`.
- **Peso en tablas: todo 400.** Encabezados y celdas van en `font-normal`;
  nada de `font-medium` ni `font-semibold` dentro de una tabla. El énfasis se
  logra con color (`text-muted-foreground` para lo secundario), no con peso.
- Densidad compacta: el componente `Table` base ya es compacto (th `h-9`,
  td `py-1`). No agregar paddings verticales extra en celdas; los elementos
  dentro de celdas se mantienen chicos (avatares `size-6`, botones `icon-sm`).

## 9. Interacción y feedback

- Confirmación destructiva: `AlertDialog`, nunca `Dialog`.
- Feedback de acciones: `toast` de sonner (`toast.success/error/info`). No
  inventar banners propios.
- Acciones por fila de tabla: `DropdownMenu` con icono `MoreHorizontal`.
- Detalle contextual sin salir de la página: `Sheet` (drawer) lateral.
- Estados de carga: `Spinner` dentro del botón + `disabled`; para contenido,
  `Skeleton`.
- Estados vacíos: componente `Empty` con título y descripción accionable.
  Nunca una tabla en blanco ni un "No data".

## 10. Formularios

- Siempre `react-hook-form` + `zod` (`zodResolver`). El esquema zod vive junto
  a la página y es la única fuente de validación.
- Estructura: `FieldGroup` > `Field` > `FieldLabel` + control + `FieldError`
  (+ `FieldDescription` opcional). Secciones con `Card` o `FieldSet`/`FieldLegend`.
- Inputs controlados (Select, Switch, RadioGroup, Checkbox) se conectan con
  `<Controller />`; los nativos con `form.register`.
- Todo input con error lleva `aria-invalid` y su `Field` lleva `data-invalid`.
- Mensajes de validación en español, accionables ("Ingresa un correo válido").
- Dinero y unidades: `InputGroup` con `InputGroupAddon` (ej. `$` / `MXN`).

## 11. Accesibilidad

- Todo botón de solo icono lleva `aria-label`.
- Los labels siempre asociados (`htmlFor` + `id`).
- No remover los focus rings de los componentes base.
- Contraste: si necesitas un gris más claro que `text-muted-foreground`, es
  señal de que ese texto no debería existir.

## 12. Anti-patrones (prohibido)

- Elementos nativos crudos cuando existe el componente shadcn.
- `div rounded-xl border p-6` repetido en lugar de `Card`.
- Cards anidadas más de un nivel.
- Varios colores de acento compitiendo.
- Gradientes grandes y glassmorphism en superficies de producto.
- `Dialog` para confirmar algo destructivo.
- Estados vacío/carga/error sin tratamiento de diseño.
- Modificar un componente de `src/components/ui/` para un caso puntual:
  se extiende con `className` o se crea un componente de dominio en
  `src/components/<dominio>/`.
