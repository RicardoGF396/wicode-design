import { Link, useLocation } from "react-router-dom"
import {
  Bell,
  Check,
  ChevronRight,
  FileText,
  Home,
  LogOut,
  Monitor,
  Moon,
  Search,
  Settings,
  ShoppingBag,
  Store,
  Sun,
  User,
  Users,
} from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { WicodeLogo, WicodeMark } from "@/components/brand/wicode-logo"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd } from "@/components/ui/kbd"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const mainNav = [
  { title: "Inicio", url: "/", icon: Home },
  { title: "Pedidos", url: "/table", icon: ShoppingBag },
  { title: "Clientes", url: "/drawer-detail", icon: Users },
  { title: "Formularios", url: "/forms", icon: FileText },
]

const salesChannels = [
  { title: "Tienda en línea", url: "#" },
  { title: "Punto de venta", url: "#" },
  { title: "Facebook & Instagram", url: "#" },
]

export function AppSidebar() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          {/* Marca + botón de colapso. Colapsado, el botón desaparece y el
              sidebar se reabre con el rail del borde derecho. */}
          <SidebarMenuItem className="flex items-center gap-1">
            <SidebarMenuButton
              size="lg"
              render={<Link to="/" aria-label="Wicode" />}
              className="flex-1 text-white"
            >
              <WicodeLogo className="!h-5 !w-auto px-1 group-data-[collapsible=icon]:hidden" />
              <WicodeMark className="hidden !h-5 !w-auto group-data-[collapsible=icon]:block" />
            </SidebarMenuButton>
            <SidebarTrigger className="text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
          </SidebarMenuItem>
        </SidebarMenu>
        {/* Buscador tipo pill: relleno gris, sin borde, atajo a la derecha */}
        <div className="relative group-data-[collapsible=icon]:hidden">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-sidebar-foreground/50" />
          <SidebarInput
            placeholder="Buscar"
            className="h-9 rounded-full border-0 bg-sidebar-accent/70 pr-12 pl-9 shadow-none placeholder:text-sidebar-foreground/50 focus-visible:ring-1 focus-visible:ring-sidebar-ring dark:bg-sidebar-accent/70"
          />
          <Kbd className="absolute top-1/2 right-3 -translate-y-1/2 border-none bg-transparent text-sidebar-foreground/50">
            ⌘K
          </Kbd>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                    render={<Link to={item.url} />}
                    className="rounded-lg text-sidebar-foreground/80 data-active:text-sidebar-accent-foreground"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Canales de venta</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen>
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    render={<SidebarMenuButton tooltip="Canales de venta" />}
                  >
                    <Store />
                    <span>Canales</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 in-data-[panel-open]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {salesChannels.map((channel) => (
                        <SidebarMenuSubItem key={channel.title}>
                          <SidebarMenuSubButton render={<a href={channel.url} />}>
                            <span>{channel.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Notificaciones" render={<a href="#" />}>
              <Bell />
              <span>Notificaciones</span>
            </SidebarMenuButton>
            {/* Badge rojo de no leídas */}
            <SidebarMenuBadge className="rounded-full bg-destructive px-1.5 text-white">
              7
            </SidebarMenuBadge>
          </SidebarMenuItem>
          <SidebarMenuItem>
            {/* Configuración: única vía para cambiar el tema */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<SidebarMenuButton tooltip="Configuración" />}
              >
                <Settings />
                <span>Configuración</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Tema</DropdownMenuLabel>
                  {(
                    [
                      { value: "light", label: "Claro", icon: Sun },
                      { value: "dark", label: "Oscuro", icon: Moon },
                      { value: "system", label: "Sistema", icon: Monitor },
                    ] as const
                  ).map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                    >
                      <option.icon />
                      {option.label}
                      {theme === option.value && <Check className="ml-auto" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[popup-open]:bg-sidebar-accent data-[popup-open]:text-sidebar-accent-foreground"
                  />
                }
              >
                <Avatar className="size-8 rounded-md">
                  <AvatarFallback className="rounded-md">RG</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Ricardo González</span>
                  <span className="truncate text-xs text-sidebar-foreground/60">
                    ricardo.gonzalez@wicode.com.mx
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <LogOut />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      {/* Franja clicable en el borde: cursor de redimensionar y clic para
          abrir/cerrar el sidebar */}
      <SidebarRail />
    </Sidebar>
  )
}
