# Tokens de diseño

Todos los tokens viven en `src/index.css`. Se definen como variables CSS en
`:root` (light) y `.dark` (dark), y se exponen como utilidades de Tailwind v4
vía `@theme inline`. **Las páginas solo consumen utilidades; nunca escriben
colores directos.**

## Tipografía

| Token | Valor | Utilidad | Uso |
|---|---|---|---|
| `--font-sans` | Inter Variable | `font-sans` | Todo el texto (default en `html`) |
| `--font-heading` | InterDisplay | `font-heading` | Títulos (`h1`–`h6` automático) |

Las fuentes se auto-hospedan vía npm (`@fontsource-variable/inter` e
`inter-ui`), importadas al inicio de `src/index.css`. No usar Google Fonts CDN.

## Colores base

| Token | Utilidades | Uso |
|---|---|---|
| `--background` / `--foreground` | `bg-background`, `text-foreground` | Fondo de página (`#f1f1f1` en light, para contrastar con las cards blancas) y texto |
| `--card` / `--card-foreground` | `bg-card` | Tarjetas y superficies elevadas |
| `--popover` / `--popover-foreground` | `bg-popover` | Menús, popovers, tooltips |
| `--primary` / `--primary-foreground` | `bg-primary`, `text-primary` | Acción principal (un solo acento) |
| `--secondary` / `--secondary-foreground` | `bg-secondary` | Acciones secundarias |
| `--muted` / `--muted-foreground` | `bg-muted`, `text-muted-foreground` | Fondos suaves y texto secundario |
| `--accent` / `--accent-foreground` | `bg-accent` | Hover/selección en listas y menús |
| `--border` | `border-border` (default de `border`) | Bordes |
| `--input` | `border-input` | Bordes de inputs |
| `--ring` | `ring-ring` | Focus rings |

## Colores semánticos de estado

| Token | Utilidades | Uso |
|---|---|---|
| `--destructive` | `text-destructive`, `bg-destructive/10` | Errores, eliminar, cancelado |
| `--success` | `text-success`, `bg-success/10` | Éxito, pagado, activo |
| `--warning` | `text-warning`, `bg-warning/10` | Advertencia, pendiente |
| `--info` | `text-info`, `bg-info/10` | Informativo, en tránsito |

Patrón de badge de estado: `Badge variant="outline"` (borde, fondo
transparente, texto normal) con un **icono coloreado a la izquierda** que
comunica el estado (ej. `CircleCheck` con `fill-success stroke-white`,
`Loader` gris para pendiente). El color va en el icono, nunca en el fondo ni
en el texto. Ver `src/components/orders/order-status-badge.tsx`.

## Tablas

| Token | Utilidad | Uso |
|---|---|---|
| `--table-foreground` | `text-table-foreground` (lo aplica `data-table`) | Texto de tablas: `#4b4b4b` en light, gris claro en dark |
| `--table-header` | `bg-table-header` (lo aplica `data-table`) | Fondo del encabezado de tabla (`#f7f7f7` en light) |
| `--badge-neutral` | `bg-badge-neutral` | Pastilla de estado resuelto (`#e3e3e3`) |
| `--badge-success` | `bg-badge-success` | Resultado positivo — pagado, cobrado, en stock (verde `#c3ecd1`) |
| `--badge-info` | `bg-badge-info` | En tránsito / informativo — enviado (azul `#cfe0fb`) |
| `--badge-warning` | `bg-badge-warning` | Requiere atención — pendiente, bajo (amarillo `#ffe27a`) |
| `--badge-critical` | `bg-badge-critical` | Negativo / urgente — vencido, agotado, cancelado (rojo `#ffcfcf`) |

Estándar de estados tipo semáforo (tono = significado, no página): ver
"Badges de estado" en DESIGN_RULES §8. Son los únicos tonos de badge de
estado; no se crean colores nuevos.

## Gráficas

`--chart-1` … `--chart-5` (utilidades `var(--chart-n)` dentro de `ChartConfig`).
Se usan en orden; no inventar colores de serie.

## Sidebar

El sidebar tiene su propia familia de tokens (`--sidebar`, `--sidebar-foreground`,
`--sidebar-accent`, `--sidebar-border`, …) y es **oscuro en ambos temas**.
Cualquier cosa que se renderice dentro del sidebar usa exclusivamente estos
tokens (`bg-sidebar-accent`, `text-sidebar-foreground/60`, etc.).

## Radio

`--radius: 0.625rem` genera `rounded-sm/md/lg/xl/…` por multiplicación.
Para cambiar la personalidad de un proyecto completo basta con ajustar
`--radius`; nunca valores por componente.

## Cómo cambiar el branding de un proyecto nuevo

1. Ajusta `--primary` y `--primary-foreground` en `:root` y `.dark`.
2. Ajusta `--radius` si la marca es más suave o más cuadrada.
3. (Opcional) Ajusta `--chart-*` a la paleta de la marca.
4. **No toques nada más.** Los grises neutros y los tokens semánticos son
   compartidos entre proyectos.

## Cómo agregar un token nuevo

1. Define la variable en `:root` **y** en `.dark`.
2. Regístrala en `@theme inline` como `--color-<nombre>: var(--<nombre>);`.
3. Documéntala en esta tabla.
4. Úsala solo a través de su utilidad (`bg-<nombre>`, `text-<nombre>`).
