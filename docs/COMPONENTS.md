# Componentes

## Capas

```
src/components/
├── ui/          ← shadcn/ui. Se agregan con el CLI. NO se editan a mano.
├── layout/      ← AppLayout, AppSidebar, AuthLayout, PageActions.
├── <dominio>/   ← Componentes de negocio (ej. orders/, dashboard/).
└── theme-*.tsx  ← Proveedor y toggle de tema.
```

- **`ui/`** es la capa shadcn: se instala (`npx shadcn@latest add x`), se
  actualiza con el CLI y no se modifica salvo decisión de equipo documentada.
- **`layout/`** define las dos plantillas de página (app y auth). Las páginas
  no conocen el sidebar ni el header; solo renderizan su contenido.
- **`<dominio>/`** envuelve componentes `ui/` con significado de negocio
  (ej. `OrderStatusBadge`, `MetricCard`). Si un patrón se repite dos veces en
  páginas, se extrae aquí.

## Esta base usa shadcn sobre Base UI

Los componentes `ui/` de este proyecto están construidos sobre **Base UI**
(`@base-ui/react`), no Radix. Dos diferencias clave con los ejemplos de
internet:

### 1. `render`, no `asChild`

```tsx
// ❌ Patrón Radix (no existe aquí)
<SidebarMenuButton asChild>
  <Link to="/">Inicio</Link>
</SidebarMenuButton>

// ✅ Patrón Base UI
<SidebarMenuButton render={<Link to="/" />}>
  <Home />
  <span>Inicio</span>
</SidebarMenuButton>
```

Los children se declaran en el componente exterior; el elemento de `render`
recibe las props fusionadas. Si el `render` de un `Button` no es un `<button>`
nativo (ej. un `Link`), agrega `nativeButton={false}`.

### 2. Atributos de estado `data-*`

Base UI expone estado como `data-popup-open` (triggers de menú),
`data-panel-open` (collapsible) y `data-open`. Para estilos dependientes del
estado: `data-[popup-open]:bg-accent`, `in-data-[panel-open]:rotate-90`.

### 3. Los items siempre van dentro de su Group

En esta variante, el padding y el contexto viven en el grupo, no en el
contenido: los `SelectItem` van dentro de `SelectGroup` (sin él, el menú
queda sin padding) y `DropdownMenuLabel` dentro de `DropdownMenuGroup`
(sin él, Base UI lanza error de contexto).

## Inventario instalado

alert, alert-dialog, avatar, badge, breadcrumb, button, button-group, calendar,
card, chart, checkbox, collapsible, command, dialog, dropdown-menu, empty,
field, input, input-group, item, kbd, label, pagination, popover, progress,
radio-group, scroll-area, select, separator, sheet, sidebar, skeleton, sonner,
spinner, switch, table, tabs, textarea, tooltip.

## Para qué sirve cada cosa (decisiones rápidas)

| Necesitas | Usa | No uses |
|---|---|---|
| Confirmar algo destructivo | `AlertDialog` | `Dialog`, `confirm()` |
| Detalle sin cambiar de página | `Sheet` | `Dialog` grande |
| Crear/editar algo corto | `Dialog` | página nueva |
| Avisar resultado de una acción | `toast` (sonner) | `alert()`, banner propio |
| Menú de acciones por fila | `DropdownMenu` | botones sueltos |
| Estado de negocio | `Badge` + token semántico | texto coloreado |
| Lista vacía | `Empty` | tabla en blanco |
| Carga de contenido | `Skeleton` | spinner a pantalla completa |
| Carga en botón | `Spinner` + `disabled` | cambiar el texto |
| Campo con prefijo/sufijo | `InputGroup` | padding manual |
| Formularios | `Field*` + react-hook-form + zod | labels sueltos |
| Atajo de teclado visible | `Kbd` | `<code>` |

## Personalizaciones aprobadas en `ui/`

Excepciones vigentes a "no editar `ui/`", decididas para este sistema:

- `button.tsx`: la variante `outline` usa `bg-card` (blanca) en lugar de
  `bg-background`, para contrastar con el fondo gris de página.

- `table.tsx`: densidad compacta por defecto — `TableHead` usa `h-9` y
  `font-normal`, `TableCell` usa `px-3 py-1` (en lugar de `h-10` /
  `font-medium` / `p-2` de shadcn). Todo el texto de tablas pesa 400.
  `TableHeader` anula el `border-b` de sus filas: la línea inferior del
  encabezado la pone `data-table` con una sombra en los `th` (una sola línea,
  compatible con encabezado sticky).

## Reglas

1. **Nunca edites `ui/` directamente.** Para variantes nuevas (ej. un botón
   `success`), se decide en equipo y se documenta aquí; para casos puntuales,
   `className` en el punto de uso o un wrapper de dominio.
2. **Los componentes de dominio no re-estilizan**, componen: reciben datos
   tipados y arman componentes `ui/` con tokens.
3. **Tamaños con Tailwind, no props.** `<Avatar className="size-12">`;
   los componentes shadcn no tienen prop `size` salvo que su variante lo defina.
4. **Un componente de dominio nuevo** se crea cuando el mismo markup aparece
   por segunda vez. A la tercera repetición ya es deuda.
