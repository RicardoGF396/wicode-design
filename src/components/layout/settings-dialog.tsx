import { useState, type ReactNode } from "react"
import {
  Check,
  Copy,
  CreditCard,
  Monitor,
  Moon,
  Palette,
  Plug,
  Receipt,
  Shield,
  Store,
  Sun,
  Terminal,
  Trash2,
  Truck,
  User,
  Users,
  Wallet,
  Bell,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

// Fila de ajuste: título + descripción a la izquierda, control a la derecha.
function SettingRow({
  title,
  description,
  htmlFor,
  control,
}: {
  title: string
  description?: string
  htmlFor?: string
  control: ReactNode
}) {
  return (
    <Field orientation="horizontal" className="items-center justify-between gap-6">
      <FieldContent>
        <FieldLabel htmlFor={htmlFor}>{title}</FieldLabel>
        {description ? <FieldDescription>{description}</FieldDescription> : null}
      </FieldContent>
      <div className="shrink-0">{control}</div>
    </Field>
  )
}

function SectionHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="space-y-1">
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function SimpleSelect({
  value,
  onValueChange,
  items,
  placeholder,
  className,
}: {
  value: string
  onValueChange: (value: string) => void
  items: Record<string, string>
  placeholder?: string
  className?: string
}) {
  return (
    <Select
      items={items}
      value={value || null}
      onValueChange={(v) => onValueChange(v ?? "")}
    >
      <SelectTrigger size="sm" className={cn("w-44 bg-card", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.entries(items).map(([v, label]) => (
            <SelectItem key={v} value={v}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

const team = [
  { name: "Ricardo González", email: "ricardo.gonzalez@wicode.com.mx", role: "propietario" },
  { name: "Ana Martínez", email: "ana.mtz@wicode.com.mx", role: "administrador" },
  { name: "Diego Sánchez", email: "diego.s@wicode.com.mx", role: "editor" },
]
const roleItems = {
  propietario: "Propietario",
  administrador: "Administrador",
  editor: "Editor",
  lectura: "Solo lectura",
}

const integrations = [
  { name: "Google", desc: "Analytics y Merchant Center", connected: true },
  { name: "Meta", desc: "Facebook e Instagram Shopping", connected: true },
  { name: "Slack", desc: "Alertas de pedidos en tu canal", connected: false },
  { name: "Mailchimp", desc: "Sincroniza tu lista de correo", connected: false },
]

type SectionDef = {
  key: string
  label: string
  icon: LucideIcon
  render: () => ReactNode
}

export function SettingsDialogContent() {
  const { theme, setTheme } = useTheme()
  const [active, setActive] = useState("general")

  // Estado local de ejemplo (en un proyecto real vendría de la API)
  const [general, setGeneral] = useState({
    name: "Aldama Home",
    email: "hola@aldamahome.com",
    language: "es",
    timezone: "america-cdmx",
    currency: "mxn",
  })
  const [fullWidth, setFullWidth] = useState(false)
  const [density, setDensity] = useState("comoda")
  const [notif, setNotif] = useState({
    orders: true,
    payments: true,
    lowStock: true,
    mentions: true,
  })
  const [notifChannel, setNotifChannel] = useState("ambos")
  const [payments, setPayments] = useState({ stripe: true, paypal: false, mercado: true })
  const [freeShipping, setFreeShipping] = useState(true)
  const [taxIncluded, setTaxIncluded] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)

  const sections: SectionDef[] = [
    {
      key: "general",
      label: "General",
      icon: Store,
      render: () => (
        <>
          <SectionHeader
            title="General"
            description="Información básica de tu tienda."
          />
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="s-name">Nombre de la tienda</FieldLabel>
              <Input
                id="s-name"
                value={general.name}
                onChange={(e) => setGeneral({ ...general, name: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="s-email">Correo de contacto</FieldLabel>
              <Input
                id="s-email"
                type="email"
                value={general.email}
                onChange={(e) => setGeneral({ ...general, email: e.target.value })}
              />
            </Field>
            <FieldSeparator />
            <SettingRow
              title="Idioma"
              description="Idioma de la interfaz de administración."
              control={
                <SimpleSelect
                  value={general.language}
                  onValueChange={(v) => setGeneral({ ...general, language: v })}
                  items={{ es: "Español", en: "English" }}
                />
              }
            />
            <SettingRow
              title="Zona horaria"
              control={
                <SimpleSelect
                  value={general.timezone}
                  onValueChange={(v) => setGeneral({ ...general, timezone: v })}
                  items={{
                    "america-cdmx": "CDMX (GMT-6)",
                    "america-cancun": "Cancún (GMT-5)",
                    "america-tijuana": "Tijuana (GMT-8)",
                  }}
                />
              }
            />
            <SettingRow
              title="Moneda"
              description="Moneda en la que se muestran los precios."
              control={
                <SimpleSelect
                  value={general.currency}
                  onValueChange={(v) => setGeneral({ ...general, currency: v })}
                  items={{ mxn: "MXN $", usd: "USD $", eur: "EUR €" }}
                />
              }
            />
          </FieldGroup>
        </>
      ),
    },
    {
      key: "apariencia",
      label: "Apariencia",
      icon: Palette,
      render: () => (
        <>
          <SectionHeader
            title="Apariencia"
            description="Personaliza cómo se ve el panel."
          />
          <FieldGroup>
            <Field>
              <FieldLabel>Tema</FieldLabel>
              <FieldDescription>Claro, oscuro o según el sistema.</FieldDescription>
              <RadioGroup
                value={theme}
                onValueChange={(v) => setTheme(v as typeof theme)}
                className="grid-cols-3 pt-1"
              >
                {(
                  [
                    { value: "light", label: "Claro", icon: Sun },
                    { value: "dark", label: "Oscuro", icon: Moon },
                    { value: "system", label: "Sistema", icon: Monitor },
                  ] as const
                ).map((opt) => (
                  <label
                    key={opt.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition-colors",
                      theme === opt.value
                        ? "border-ring bg-muted/50"
                        : "hover:bg-muted/40"
                    )}
                  >
                    <RadioGroupItem value={opt.value} className="sr-only" />
                    <opt.icon className="size-4 text-muted-foreground" />
                    {opt.label}
                    {theme === opt.value && <Check className="ml-auto size-4" />}
                  </label>
                ))}
              </RadioGroup>
            </Field>
            <FieldSeparator />
            <SettingRow
              title="Densidad"
              description="Espaciado de las listas y tablas."
              control={
                <SimpleSelect
                  value={density}
                  onValueChange={setDensity}
                  items={{ comoda: "Cómoda", compacta: "Compacta" }}
                  className="w-36"
                />
              }
            />
            <SettingRow
              title="Ajustar al ancho completo"
              description="Estira el contenido en lugar de la columna centrada."
              htmlFor="s-fullwidth"
              control={
                <Switch
                  id="s-fullwidth"
                  checked={fullWidth}
                  onCheckedChange={setFullWidth}
                />
              }
            />
          </FieldGroup>
        </>
      ),
    },
    {
      key: "cuenta",
      label: "Cuenta",
      icon: User,
      render: () => (
        <>
          <SectionHeader
            title="Cuenta"
            description="Tus datos personales y de acceso."
          />
          <FieldGroup>
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarFallback className="text-base">RG</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <Button variant="outline" size="sm">
                  Cambiar foto
                </Button>
                <p className="text-xs text-muted-foreground">JPG o PNG, máx. 2 MB.</p>
              </div>
            </div>
            <Field>
              <FieldLabel htmlFor="a-name">Nombre completo</FieldLabel>
              <Input id="a-name" defaultValue="Ricardo González" />
            </Field>
            <Field>
              <FieldLabel htmlFor="a-email">Correo</FieldLabel>
              <Input id="a-email" type="email" defaultValue="ricardo.gonzalez@wicode.com.mx" />
            </Field>
            <Field>
              <FieldLabel htmlFor="a-phone">Teléfono</FieldLabel>
              <Input id="a-phone" type="tel" defaultValue="+52 55 1234 5678" />
            </Field>
          </FieldGroup>
        </>
      ),
    },
    {
      key: "notificaciones",
      label: "Notificaciones",
      icon: Bell,
      render: () => (
        <>
          <SectionHeader
            title="Notificaciones"
            description="Elige sobre qué quieres recibir avisos."
          />
          <FieldGroup>
            <SettingRow
              title="Nuevos pedidos"
              htmlFor="n-orders"
              control={
                <Switch
                  id="n-orders"
                  checked={notif.orders}
                  onCheckedChange={(v) => setNotif({ ...notif, orders: v })}
                />
              }
            />
            <SettingRow
              title="Pagos recibidos"
              htmlFor="n-pay"
              control={
                <Switch
                  id="n-pay"
                  checked={notif.payments}
                  onCheckedChange={(v) => setNotif({ ...notif, payments: v })}
                />
              }
            />
            <SettingRow
              title="Stock bajo"
              description="Cuando un producto baja del umbral mínimo."
              htmlFor="n-stock"
              control={
                <Switch
                  id="n-stock"
                  checked={notif.lowStock}
                  onCheckedChange={(v) => setNotif({ ...notif, lowStock: v })}
                />
              }
            />
            <SettingRow
              title="Menciones"
              htmlFor="n-mentions"
              control={
                <Switch
                  id="n-mentions"
                  checked={notif.mentions}
                  onCheckedChange={(v) => setNotif({ ...notif, mentions: v })}
                />
              }
            />
            <FieldSeparator />
            <SettingRow
              title="Canal de entrega"
              description="Dónde quieres recibir las notificaciones."
              control={
                <SimpleSelect
                  value={notifChannel}
                  onValueChange={setNotifChannel}
                  items={{ email: "Correo", push: "Push", ambos: "Correo y push" }}
                />
              }
            />
          </FieldGroup>
        </>
      ),
    },
    {
      key: "facturacion",
      label: "Facturación",
      icon: CreditCard,
      render: () => (
        <>
          <SectionHeader
            title="Facturación"
            description="Tu plan y método de pago."
          />
          <FieldGroup>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Plan Pro</span>
                  <Badge
                    variant="secondary"
                    className="bg-badge-success font-normal text-foreground"
                  >
                    Activo
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  $1,499 MXN / mes · se renueva el 1 nov 2026.
                </p>
              </div>
              <Button variant="outline" size="sm">
                Cambiar plan
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="size-5 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Visa terminada en 6411</p>
                  <p className="text-muted-foreground">Expira 09/28</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Actualizar
              </Button>
            </div>
            <SettingRow
              title="Recibir facturas por correo"
              htmlFor="b-invoices"
              control={<Switch id="b-invoices" defaultChecked />}
            />
          </FieldGroup>
        </>
      ),
    },
    {
      key: "pagos",
      label: "Pagos",
      icon: Wallet,
      render: () => (
        <>
          <SectionHeader
            title="Pagos"
            description="Proveedores con los que cobras a tus clientes."
          />
          <FieldGroup>
            {(
              [
                { key: "stripe", name: "Stripe", desc: "Tarjetas y wallets" },
                { key: "paypal", name: "PayPal", desc: "Pagos con cuenta PayPal" },
                { key: "mercado", name: "Mercado Pago", desc: "Tarjetas y meses sin intereses" },
              ] as const
            ).map((p) => (
              <SettingRow
                key={p.key}
                title={p.name}
                description={p.desc}
                htmlFor={`pay-${p.key}`}
                control={
                  <Switch
                    id={`pay-${p.key}`}
                    checked={payments[p.key]}
                    onCheckedChange={(v) => setPayments({ ...payments, [p.key]: v })}
                  />
                }
              />
            ))}
            <FieldSeparator />
            <SettingRow
              title="Captura automática"
              description="Cobra el pago al confirmar el pedido."
              htmlFor="pay-auto"
              control={<Switch id="pay-auto" defaultChecked />}
            />
          </FieldGroup>
        </>
      ),
    },
    {
      key: "envios",
      label: "Envíos",
      icon: Truck,
      render: () => (
        <>
          <SectionHeader
            title="Envíos"
            description="Tarifas y reglas de envío."
          />
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="ship-base">Costo base de envío</FieldLabel>
              <InputGroup className="w-48">
                <InputGroupAddon>
                  <InputGroupText>$</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput id="ship-base" type="number" defaultValue="99" />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>MXN</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <FieldSeparator />
            <SettingRow
              title="Envío gratis"
              description="Ofrecer envío gratis a partir de un monto."
              htmlFor="ship-free"
              control={
                <Switch
                  id="ship-free"
                  checked={freeShipping}
                  onCheckedChange={setFreeShipping}
                />
              }
            />
            {freeShipping && (
              <Field>
                <FieldLabel htmlFor="ship-threshold">Monto mínimo</FieldLabel>
                <InputGroup className="w-48">
                  <InputGroupAddon>
                    <InputGroupText>$</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="ship-threshold"
                    type="number"
                    defaultValue="999"
                  />
                </InputGroup>
              </Field>
            )}
          </FieldGroup>
        </>
      ),
    },
    {
      key: "impuestos",
      label: "Impuestos",
      icon: Receipt,
      render: () => (
        <>
          <SectionHeader
            title="Impuestos"
            description="Cómo se calculan los impuestos."
          />
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="tax-iva">Tasa de IVA</FieldLabel>
              <InputGroup className="w-32">
                <InputGroupInput id="tax-iva" type="number" defaultValue="16" />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>%</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <SettingRow
              title="Los precios incluyen impuestos"
              description="Muestra los precios con IVA incluido."
              htmlFor="tax-incl"
              control={
                <Switch
                  id="tax-incl"
                  checked={taxIncluded}
                  onCheckedChange={setTaxIncluded}
                />
              }
            />
            <FieldSeparator />
            <Field>
              <FieldLabel htmlFor="tax-rfc">RFC</FieldLabel>
              <Input id="tax-rfc" placeholder="ABC123456XYZ" className="uppercase" />
            </Field>
          </FieldGroup>
        </>
      ),
    },
    {
      key: "equipo",
      label: "Equipo",
      icon: Users,
      render: () => (
        <>
          <SectionHeader
            title="Equipo"
            description="Personas con acceso a tu tienda."
          />
          <div className="space-y-3">
            <div className="flex justify-end">
              <Button size="sm">Invitar miembro</Button>
            </div>
            <div className="divide-y overflow-hidden rounded-lg border">
              {team.map((member) => (
                <div
                  key={member.email}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">
                      {member.name
                        .split(" ")
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{member.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                  <SimpleSelect
                    value={member.role}
                    onValueChange={() => {}}
                    items={roleItems}
                    className="w-40"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      ),
    },
    {
      key: "seguridad",
      label: "Seguridad",
      icon: Shield,
      render: () => (
        <>
          <SectionHeader
            title="Seguridad"
            description="Protege el acceso a tu cuenta."
          />
          <FieldGroup>
            <SettingRow
              title="Verificación en dos pasos"
              description="Pide un código además de tu contraseña."
              htmlFor="sec-2fa"
              control={
                <Switch
                  id="sec-2fa"
                  checked={twoFactor}
                  onCheckedChange={setTwoFactor}
                />
              }
            />
            <SettingRow
              title="Contraseña"
              description="Última actualización hace 3 meses."
              control={
                <Button variant="outline" size="sm">
                  Cambiar
                </Button>
              }
            />
            <SettingRow
              title="Tiempo de sesión"
              description="Cierra sesión tras un periodo de inactividad."
              control={
                <SimpleSelect
                  value="8h"
                  onValueChange={() => {}}
                  items={{ "1h": "1 hora", "8h": "8 horas", "24h": "24 horas" }}
                  className="w-36"
                />
              }
            />
            <SettingRow
              title="Sesiones activas"
              description="3 dispositivos con sesión iniciada."
              control={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success("Se cerraron las demás sesiones")}
                >
                  Cerrar otras
                </Button>
              }
            />
          </FieldGroup>
        </>
      ),
    },
    {
      key: "integraciones",
      label: "Integraciones",
      icon: Plug,
      render: () => (
        <>
          <SectionHeader
            title="Integraciones"
            description="Conecta Wicode con otras herramientas."
          />
          <div className="divide-y overflow-hidden rounded-lg border">
            {integrations.map((item) => (
              <div key={item.name} className="flex items-center gap-3 px-4 py-3">
                <span className="flex size-9 items-center justify-center rounded-md bg-muted text-sm font-medium">
                  {item.name[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
                {item.connected ? (
                  <Badge
                    variant="secondary"
                    className="bg-badge-success font-normal text-foreground"
                  >
                    Conectado
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm">
                    Conectar
                  </Button>
                )}
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      key: "avanzado",
      label: "Avanzado",
      icon: Terminal,
      render: () => (
        <>
          <SectionHeader
            title="Avanzado"
            description="Opciones para desarrolladores."
          />
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="api-key">Llave de API</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="api-key"
                  readOnly
                  value="wc_live_8f2a…b41c"
                  className="font-mono"
                />
                <InputGroupAddon align="inline-end">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Copiar"
                    onClick={() => {
                      navigator.clipboard.writeText("wc_live_8f2a…b41c")
                      toast.success("Llave copiada")
                    }}
                  >
                    <Copy />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>No la compartas públicamente.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="webhook">URL de webhook</FieldLabel>
              <Input id="webhook" placeholder="https://tu-servidor.com/webhook" />
            </Field>
            <FieldSeparator />
            <SettingRow
              title="Exportar datos"
              description="Descarga un respaldo de tu tienda."
              control={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Preparando exportación…")}
                >
                  Exportar
                </Button>
              }
            />
            <SettingRow
              title="Eliminar cuenta"
              description="Borra tu tienda y todos sus datos."
              control={
                <AlertDialog>
                  <AlertDialogTrigger
                    render={<Button variant="destructive" size="sm" />}
                  >
                    <Trash2 data-icon="inline-start" />
                    Eliminar
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar la cuenta?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción es permanente. Se eliminará la tienda y
                        todos sus datos sin posibilidad de recuperarlos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => toast.success("Cuenta programada para eliminación")}
                      >
                        Eliminar cuenta
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              }
            />
          </FieldGroup>
        </>
      ),
    },
  ]

  const current = sections.find((s) => s.key === active) ?? sections[0]

  return (
    <DialogContent className="flex h-[82vh] max-h-[560px] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl">
      <DialogTitle className="sr-only">Configuración · {current.label}</DialogTitle>
      <DialogDescription className="sr-only">
        Ajustes de la tienda organizados por sección.
      </DialogDescription>
      <div className="flex min-h-0 flex-1">
        {/* Menú de secciones */}
        <nav className="w-52 shrink-0 space-y-0.5 overflow-y-auto border-r bg-muted/30 p-3">
          <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Configuración
          </p>
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => setActive(section.key)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                section.key === active
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <section.icon className="size-4 shrink-0" />
              {section.label}
            </button>
          ))}
        </nav>

        {/* Contenido de la sección */}
        <div className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl space-y-6 p-6">{current.render()}</div>
        </div>
      </div>
    </DialogContent>
  )
}
