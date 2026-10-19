# Wicode Base · Design System

Proyecto base y **biblia de diseño** para nuevos proyectos. Incluye tokens,
componentes, layouts y páginas receta listos para reciclar, construidos con
**React + Vite + Tailwind CSS v4 + shadcn/ui (Base UI)**.

## Inicio rápido

```bash
npm install
npm run dev        # http://localhost:5173
```

Otros scripts: `npm run build`, `npm run typecheck`, `npm run lint`,
`npm run format`.

## Qué incluye

| Ruta | Página receta |
|---|---|
| `/login` | Login (auth centrado) |
| `/signup` | Registro con confirmación de contraseña |
| `/` | Dashboard: métricas, gráfica, tarjetas de acción |
| `/table` | Tabla CRUD: filtros, selección, paginación, acciones |
| `/drawer-detail` | Listado + detalle en drawer lateral (Sheet) |
| `/forms` | Formulario de una página por secciones (RHF + zod) |
| `/mcp-guide` | Tutorial para consumir el sistema como MCP |
| `/docs` | Documentación para copiar o descargar |

Demo desplegada: https://wicode-design.vercel.app ·
Repositorio: https://github.com/RicardoGF396/wicode-design

El tema por defecto es light; se cambia desde Configuración, en el footer del
sidebar (Claro / Oscuro / Sistema).

## Documentación obligatoria

Antes de construir cualquier pantalla, lee en orden:

1. [docs/DESIGN_RULES.md](docs/DESIGN_RULES.md) — reglas de diseño y anti-patrones.
2. [docs/TOKENS.md](docs/TOKENS.md) — tokens de color, tipografía y radio.
3. [docs/COMPONENTS.md](docs/COMPONENTS.md) — capas de componentes y patrones Base UI.
4. [docs/PAGES.md](docs/PAGES.md) — recetas de página y cómo reciclarlas.

## Stack y decisiones

- **shadcn/ui sobre Base UI** (`@base-ui/react`): los componentes usan la prop
  `render` en lugar de `asChild`. Ver COMPONENTS.md.
- **Tipografía**: Inter (texto) + Inter Display (títulos), auto-hospedadas.
- **Iconos**: lucide-react exclusivamente.
- **Formularios**: react-hook-form + zod.
- **Rutas**: react-router-dom; auth fuera del `AppLayout`, el resto dentro.
- **Gráficas**: recharts vía el wrapper `ChartContainer` de shadcn.
- **Tema**: `ThemeProvider` propio (localStorage), light por defecto; se cambia
  solo desde Configuración en el sidebar. Sidebar oscuro en ambos temas.

## Estructura

```
src/
├── components/
│   ├── ui/          # shadcn/ui — se agrega con CLI, no se edita a mano
│   ├── layout/      # AppLayout, AppSidebar, AuthLayout, PageHeader
│   ├── dashboard/   # componentes de dominio (MetricCard, …)
│   └── orders/      # componentes de dominio (OrderStatusBadge, …)
├── pages/           # páginas receta
├── lib/             # utils + datos mock (reemplazar por capa de API)
├── hooks/
└── index.css        # TODOS los tokens de diseño
```

## Uso como MCP (para agentes)

El proyecto expone su documentación para que otros agentes basen sus
propuestas de clientes en este sistema:

- **Servidor MCP (stdio)** en [mcp/server.mjs](mcp/server.mjs), con las
  herramientas `list_docs`, `get_doc` y `get_design_system`:
  ```bash
  claude mcp add wicode-design -- node $(pwd)/mcp/server.mjs
  ```
- **Por URL** (sin MCP): el deploy sirve las docs como markdown crudo —
  índice para agentes en `https://wicode-design.vercel.app/llms.txt` y
  documentos en `/docs/*.md` (el script `sync-docs` las copia a `public/docs`
  en cada build).
- Tutorial completo en la página **/mcp-guide** de la app.

## Cómo iniciar un proyecto nuevo desde esta base

1. Clona/copia este repositorio.
2. Cambia el branding: `--primary` y `--radius` en `src/index.css`
   (ver "Cómo cambiar el branding" en TOKENS.md), nombre y logo en
   `app-sidebar.tsx` / `auth-layout.tsx` e `index.html`.
3. Borra las páginas que no apliquen y reemplaza `src/lib/mock-data.ts` por tu
   capa de datos.
4. Construye cada pantalla nueva partiendo de una receta de PAGES.md.
