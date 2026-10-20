import { useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Bold,
  Calendar as CalendarIcon,
  Check,
  ChevronsUpDown,
  CircleAlert,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  Minus,
  Plus,
  Trash2,
  Underline,
  X,
} from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { PageActions } from "@/components/layout/page-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// ── Esquema ──────────────────────────────────────────────────────────────

const variantSchema = z.object({
  option: z.string().min(1, "Indica la opción"),
  value: z.string().min(1, "Indica el valor"),
  extra: z.coerce.number().nonnegative("Debe ser mayor o igual a 0").optional(),
})

const productSchema = z
  .object({
    name: z.string().min(2, "El nombre es obligatorio"),
    // Rich text: valida el texto plano, no el HTML
    description: z
      .string()
      .refine(
        (value) => value.replace(/<[^>]+>/g, " ").trim().length >= 10,
        "Describe el producto (mínimo 10 caracteres)"
      ),
    images: z.array(z.string()).max(6, "Máximo 6 imágenes"),
    price: z.coerce.number().positive("El precio debe ser mayor a 0"),
    comparePrice: z.coerce.number().nonnegative().optional(),
    cost: z.coerce.number().nonnegative().optional(),
    chargeTax: z.boolean(),
    discount: z.number().min(0).max(50),
    sku: z
      .string()
      .min(1, "El SKU es obligatorio")
      .regex(/^[A-Z0-9-]+$/, "Solo mayúsculas, números y guiones"),
    barcode: z
      .string()
      .regex(/^\d{8,14}$/, "Entre 8 y 14 dígitos")
      .or(z.literal("")),
    stock: z.coerce
      .number()
      .int("Debe ser un número entero")
      .nonnegative("No puede ser negativo"),
    warehousePin: z
      .string()
      .length(4, "Captura los 4 dígitos")
      .regex(/^\d+$/, "Solo dígitos"),
    mainColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Color hex inválido"),
    category: z.string().min(1, "Selecciona una categoría"),
    vendor: z.string().min(1, "Selecciona un proveedor"),
    status: z.enum(["activo", "borrador"]),
    condition: z.enum(["nuevo", "usado", "reacondicionado"]),
    tags: z.array(z.string()).max(8, "Máximo 8 etiquetas"),
    channels: z.array(z.string()).min(1, "Selecciona al menos un canal"),
    variants: z
      .array(variantSchema)
      .min(1, "Agrega al menos una variante")
      .max(5, "Máximo 5 variantes"),
    availableFrom: z.date("Selecciona la fecha de disponibilidad"),
    promo: z
      .object({ from: z.date().optional(), to: z.date().optional() })
      .optional(),
    cutoffTime: z.string().min(1, "Indica la hora límite"),
    weight: z.coerce.number().nonnegative().optional(),
    weightUnit: z.enum(["kg", "g"]),
    trackInventory: z.boolean(),
    freeShipping: z.boolean(),
    hasWarranty: z.boolean(),
    warrantyMonths: z.coerce.number().int().positive().optional(),
    contactEmail: z.email("Correo inválido"),
    contactPhone: z
      .string()
      .regex(/^\+?[\d\s-]{10,15}$/, "Teléfono inválido (10 a 15 dígitos)"),
    website: z.union([z.literal(""), z.url("URL inválida")]),
    internalNotes: z.string().max(300, "Máximo 300 caracteres"),
    seoTitle: z.string().max(70, "Máximo 70 caracteres"),
    slug: z
      .string()
      .min(1, "El slug es obligatorio")
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones"),
    seoDescription: z.string().max(160, "Máximo 160 caracteres"),
  })
  // Campo condicional: si hay garantía, los meses son obligatorios
  .superRefine((values, ctx) => {
    if (values.hasWarranty && !values.warrantyMonths) {
      ctx.addIssue({
        code: "custom",
        path: ["warrantyMonths"],
        message: "Indica los meses de garantía",
      })
    }
  })

type ProductInput = z.input<typeof productSchema>
type ProductValues = z.output<typeof productSchema>

const initialCategories = ["Hogar", "Cocina", "Decoración", "Muebles", "Textiles"]
const vendors: Record<string, string> = {
  aldama: "Aldama Home",
  "mx-textil": "MX Textil",
  "casa-norte": "Casa Norte",
}
const weightUnits: Record<string, string> = { kg: "kg", g: "g" }
const channelOptions = [
  "Tienda en línea",
  "Punto de venta",
  "Instagram",
  "Facebook",
]
const conditionOptions = [
  { value: "nuevo", label: "Nuevo" },
  { value: "usado", label: "Usado" },
  { value: "reacondicionado", label: "Reacondicionado" },
]

const defaultValues: ProductInput = {
  name: "",
  description: "",
  images: [],
  price: undefined,
  comparePrice: undefined,
  cost: undefined,
  chargeTax: true,
  discount: 10,
  sku: "",
  barcode: "",
  stock: 0,
  warehousePin: "",
  mainColor: "#4b4b4b",
  category: "",
  vendor: "",
  status: "borrador",
  condition: "nuevo",
  tags: ["hogar"],
  channels: ["Tienda en línea"],
  variants: [{ option: "Color", value: "", extra: undefined }],
  availableFrom: undefined as unknown as Date,
  promo: undefined,
  cutoffTime: "13:00",
  weight: undefined,
  weightUnit: "kg",
  trackInventory: true,
  freeShipping: false,
  hasWarranty: false,
  warrantyMonths: undefined,
  contactEmail: "",
  contactPhone: "",
  website: "",
  internalNotes: "",
  seoTitle: "",
  slug: "",
  seoDescription: "",
}

// Contador de caracteres para campos con máximo
function CharCount({ value, max }: { value: string; max: number }) {
  return (
    <span
      className={cn(
        "ml-auto text-xs tabular-nums",
        value.length > max ? "text-destructive" : "text-muted-foreground"
      )}
    >
      {value.length}/{max}
    </span>
  )
}

export function FormsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [invalidCount, setInvalidCount] = useState(0)
  const [categories, setCategories] = useState(initialCategories)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [newCategoryOpen, setNewCategoryOpen] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [tagDraft, setTagDraft] = useState("")
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<ProductInput, unknown, ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })
  const { errors } = form.formState
  const variantsArray = useFieldArray({ control: form.control, name: "variants" })
  const hasWarranty = form.watch("hasWarranty")

  const onSubmit = async (values: ProductValues) => {
    setInvalidCount(0)
    setIsSubmitting(true)
    // Simula el guardado; aquí va la llamada real a la API.
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsSubmitting(false)
    toast.success(`Producto "${values.name}" guardado`)
  }

  const addCategory = () => {
    const name = newCategory.trim()
    if (!name) return
    if (!categories.includes(name)) setCategories([...categories, name])
    form.setValue("category", name, { shouldValidate: true })
    setNewCategory("")
    setNewCategoryOpen(false)
    toast.success(`Categoría "${name}" creada`)
  }

  const stepStock = (delta: number) => {
    const current = Number(form.getValues("stock")) || 0
    form.setValue("stock", Math.max(0, current + delta), {
      shouldValidate: true,
    })
  }

  return (
    <>
      {/* Las acciones del formulario viven en el header; descartar confirma
          con AlertDialog y el submit se asocia al form por id */}
      <PageActions>
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outline" />}>
            Descartar
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Descartar los cambios?</AlertDialogTitle>
              <AlertDialogDescription>
                Se perderá todo lo capturado en el formulario. Esta acción no
                se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Seguir editando</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  form.reset()
                  setInvalidCount(0)
                  toast.info("Cambios descartados")
                }}
              >
                Descartar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button type="submit" form="product-form" disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          Guardar producto
        </Button>
      </PageActions>

      <form
        id="product-form"
        onSubmit={form.handleSubmit(onSubmit, (formErrors) =>
          setInvalidCount(Object.keys(formErrors).length)
        )}
        noValidate
        className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-3"
      >
        <div className="min-w-0 space-y-6 lg:col-span-2">
          {/* Resumen de errores al enviar */}
          {invalidCount > 0 && (
            <Alert variant="destructive">
              <CircleAlert />
              <AlertTitle>Revisa el formulario</AlertTitle>
              <AlertDescription>
                {invalidCount}{" "}
                {invalidCount === 1
                  ? "campo necesita atención"
                  : "campos necesitan atención"}
                . Los errores están marcados en rojo.
              </AlertDescription>
            </Alert>
          )}

          {/* Sección: información general (texto + rich text) */}
          <Card>
            <CardHeader>
              <CardTitle>Información general</CardTitle>
              <CardDescription>
                Nombre y descripción visibles en tu tienda.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field data-invalid={!!errors.name || undefined}>
                  <FieldLabel htmlFor="name">Nombre del producto</FieldLabel>
                  <Input
                    id="name"
                    placeholder="Silla de madera de roble"
                    aria-invalid={!!errors.name}
                    {...form.register("name")}
                  />
                  <FieldError errors={errors.name ? [errors.name] : undefined} />
                </Field>

                {/* Rich text: toolbar + contentEditable controlado por RHF */}
                <Field data-invalid={!!errors.description || undefined}>
                  <FieldLabel>Descripción</FieldLabel>
                  <Controller
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                      <div
                        className={cn(
                          "overflow-hidden rounded-lg border",
                          fieldState.invalid &&
                            "border-destructive ring-3 ring-destructive/20"
                        )}
                      >
                        <div className="flex items-center gap-0.5 border-b bg-muted/50 px-1.5 py-1">
                          {(
                            [
                              { icon: Bold, command: "bold", label: "Negritas" },
                              { icon: Italic, command: "italic", label: "Cursivas" },
                              { icon: Underline, command: "underline", label: "Subrayado" },
                              { icon: List, command: "insertUnorderedList", label: "Lista" },
                              { icon: ListOrdered, command: "insertOrderedList", label: "Lista numerada" },
                            ] as const
                          ).map((tool) => (
                            <Button
                              key={tool.command}
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label={tool.label}
                              onMouseDown={(event) => {
                                event.preventDefault()
                                document.execCommand(tool.command)
                              }}
                            >
                              <tool.icon />
                            </Button>
                          ))}
                        </div>
                        <div
                          role="textbox"
                          aria-multiline="true"
                          aria-label="Descripción"
                          contentEditable
                          suppressContentEditableWarning
                          className="min-h-28 px-3 py-2 text-sm outline-none [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                          onInput={(event) =>
                            field.onChange(
                              (event.target as HTMLElement).innerHTML
                            )
                          }
                          onBlur={field.onBlur}
                          ref={(el) => {
                            if (
                              el &&
                              el.innerHTML !== field.value &&
                              document.activeElement !== el
                            ) {
                              el.innerHTML = field.value
                            }
                          }}
                        />
                      </div>
                    )}
                  />
                  <FieldDescription>
                    Usa la barra para dar formato (negritas, listas…).
                  </FieldDescription>
                  <FieldError
                    errors={errors.description ? [errors.description] : undefined}
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Sección: multimedia (subida de imágenes con preview) */}
          <Card>
            <CardHeader>
              <CardTitle>Multimedia</CardTitle>
              <CardDescription>
                Hasta 6 imágenes. Arrastra archivos o haz clic para subirlos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                control={form.control}
                name="images"
                render={({ field, fieldState }) => {
                  const addFiles = (files: FileList | null) => {
                    if (!files) return
                    const urls = [...files]
                      .filter((file) => file.type.startsWith("image/"))
                      .map((file) => URL.createObjectURL(file))
                    field.onChange([...field.value, ...urls].slice(0, 6))
                  }
                  return (
                    <Field data-invalid={fieldState.invalid || undefined}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(event) => {
                          addFiles(event.target.files)
                          event.target.value = ""
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(event) => {
                          event.preventDefault()
                          setDragging(true)
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(event) => {
                          event.preventDefault()
                          setDragging(false)
                          addFiles(event.dataTransfer.files)
                        }}
                        className={cn(
                          "flex min-h-28 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-sm text-muted-foreground transition-colors hover:bg-muted/50",
                          dragging && "border-info bg-info/5 text-info"
                        )}
                      >
                        <ImagePlus className="size-5" />
                        Arrastra imágenes aquí o haz clic para buscar
                      </button>
                      {field.value.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 pt-1 sm:grid-cols-6">
                          {field.value.map((url, index) => (
                            <div
                              key={url}
                              className="group relative aspect-square overflow-hidden rounded-lg border"
                            >
                              <img
                                src={url}
                                alt={`Imagen ${index + 1}`}
                                className="size-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                size="icon-xs"
                                aria-label="Quitar imagen"
                                className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={() => {
                                  URL.revokeObjectURL(url)
                                  field.onChange(
                                    field.value.filter((item) => item !== url)
                                  )
                                }}
                              >
                                <X />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      <FieldError
                        errors={fieldState.error ? [fieldState.error] : undefined}
                      />
                    </Field>
                  )
                }}
              />
            </CardContent>
          </Card>

          {/* Sección: precios (dinero + checkbox + slider) */}
          <Card>
            <CardHeader>
              <CardTitle>Precios</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup className="sm:grid sm:grid-cols-3 sm:gap-4">
                <Field data-invalid={!!errors.price || undefined}>
                  <FieldLabel htmlFor="price">Precio</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      aria-invalid={!!errors.price}
                      {...form.register("price")}
                    />
                  </InputGroup>
                  <FieldError errors={errors.price ? [errors.price] : undefined} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="comparePrice">Comparación</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="comparePrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...form.register("comparePrice")}
                    />
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel htmlFor="cost">Costo</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="cost"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...form.register("cost")}
                    />
                  </InputGroup>
                  <FieldDescription>No visible al cliente.</FieldDescription>
                </Field>
              </FieldGroup>
              <div className="space-y-4 pt-4">
                <Field orientation="horizontal">
                  <Controller
                    control={form.control}
                    name="chargeTax"
                    render={({ field }) => (
                      <Checkbox
                        id="chargeTax"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <FieldLabel htmlFor="chargeTax" className="font-normal">
                    Cobrar impuestos sobre este producto
                  </FieldLabel>
                </Field>
                {/* Slider con valor visible */}
                <Field>
                  <div className="flex items-center">
                    <FieldLabel>Descuento máximo permitido</FieldLabel>
                    <span className="ml-auto text-sm tabular-nums text-muted-foreground">
                      {form.watch("discount")}%
                    </span>
                  </div>
                  <Controller
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <Slider
                        value={field.value}
                        onValueChange={(value) =>
                          field.onChange(Array.isArray(value) ? value[0] : value)
                        }
                        min={0}
                        max={50}
                        step={5}
                      />
                    )}
                  />
                  <FieldDescription>
                    Tope para promociones y cupones (0–50%).
                  </FieldDescription>
                </Field>
              </div>
            </CardContent>
          </Card>

          {/* Sección: inventario (regex, stepper numérico y OTP) */}
          <Card>
            <CardHeader>
              <CardTitle>Inventario</CardTitle>
              <CardDescription>
                Identificadores y existencias en bodega.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="sm:grid sm:grid-cols-2 sm:gap-4">
                <Field data-invalid={!!errors.sku || undefined}>
                  <FieldLabel htmlFor="sku">SKU</FieldLabel>
                  <Input
                    id="sku"
                    placeholder="SILLA-ROBLE-01"
                    className="uppercase"
                    aria-invalid={!!errors.sku}
                    {...form.register("sku")}
                  />
                  <FieldError errors={errors.sku ? [errors.sku] : undefined} />
                </Field>
                <Field data-invalid={!!errors.barcode || undefined}>
                  <FieldLabel htmlFor="barcode">
                    Código de barras (opcional)
                  </FieldLabel>
                  <Input
                    id="barcode"
                    inputMode="numeric"
                    placeholder="7501234567890"
                    aria-invalid={!!errors.barcode}
                    {...form.register("barcode")}
                  />
                  <FieldError
                    errors={errors.barcode ? [errors.barcode] : undefined}
                  />
                </Field>
                {/* Stepper numérico con botones +/- */}
                <Field data-invalid={!!errors.stock || undefined}>
                  <FieldLabel htmlFor="stock">Stock inicial</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupButton
                        aria-label="Disminuir stock"
                        onClick={() => stepStock(-1)}
                      >
                        <Minus />
                      </InputGroupButton>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="stock"
                      type="number"
                      className="text-center"
                      aria-invalid={!!errors.stock}
                      {...form.register("stock")}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        aria-label="Aumentar stock"
                        onClick={() => stepStock(1)}
                      >
                        <Plus />
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldError errors={errors.stock ? [errors.stock] : undefined} />
                </Field>
                {/* OTP de 4 dígitos */}
                <Field data-invalid={!!errors.warehousePin || undefined}>
                  <FieldLabel htmlFor="warehousePin">PIN de bodega</FieldLabel>
                  <Controller
                    control={form.control}
                    name="warehousePin"
                    render={({ field }) => (
                      <InputOTP
                        maxLength={4}
                        value={field.value}
                        onChange={field.onChange}
                        aria-invalid={!!errors.warehousePin}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                      </InputOTP>
                    )}
                  />
                  <FieldDescription>
                    Requerido para ajustes de inventario.
                  </FieldDescription>
                  <FieldError
                    errors={errors.warehousePin ? [errors.warehousePin] : undefined}
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Sección: variantes (lista dinámica + color picker) */}
          <Card>
            <CardHeader>
              <CardTitle>Variantes</CardTitle>
              <CardDescription>
                Opciones del producto (color, talla…). Lista dinámica: agrega o
                elimina filas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {variantsArray.fields.map((row, index) => {
                const rowErrors = errors.variants?.[index]
                return (
                  <div key={row.id} className="space-y-1">
                    <div className="grid grid-cols-[1fr_1fr_8rem_auto] items-start gap-2">
                      <Input
                        placeholder="Opción (Color)"
                        aria-invalid={!!rowErrors?.option}
                        aria-label={`Opción de la variante ${index + 1}`}
                        {...form.register(`variants.${index}.option`)}
                      />
                      <Input
                        placeholder="Valor (Rojo)"
                        aria-invalid={!!rowErrors?.value}
                        aria-label={`Valor de la variante ${index + 1}`}
                        {...form.register(`variants.${index}.value`)}
                      />
                      <InputGroup>
                        <InputGroupAddon>
                          <InputGroupText>+$</InputGroupText>
                        </InputGroupAddon>
                        <InputGroupInput
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          aria-label={`Precio extra de la variante ${index + 1}`}
                          {...form.register(`variants.${index}.extra`)}
                        />
                      </InputGroup>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Eliminar variante"
                        onClick={() => variantsArray.remove(index)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                    <FieldError
                      errors={[rowErrors?.option, rowErrors?.value, rowErrors?.extra].filter(
                        Boolean
                      ) as { message?: string }[]}
                    />
                  </div>
                )
              })}
              <FieldError
                errors={
                  errors.variants?.root ?? errors.variants?.message
                    ? [
                        (errors.variants.root ?? {
                          message: errors.variants.message,
                        }) as { message?: string },
                      ]
                    : undefined
                }
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  variantsArray.append({ option: "", value: "", extra: undefined })
                }
                disabled={variantsArray.fields.length >= 5}
              >
                <Plus data-icon="inline-start" />
                Agregar variante
              </Button>

              {/* Color picker nativo + hex sincronizado */}
              <Field
                data-invalid={!!errors.mainColor || undefined}
                className="pt-2"
              >
                <FieldLabel htmlFor="mainColorHex">Color principal</FieldLabel>
                <Controller
                  control={form.control}
                  name="mainColor"
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        aria-label="Selector de color"
                        value={/^#[0-9a-fA-F]{6}$/.test(field.value) ? field.value : "#000000"}
                        onChange={(event) => field.onChange(event.target.value)}
                        className="size-8 cursor-pointer rounded-md border bg-card p-0.5"
                      />
                      <Input
                        id="mainColorHex"
                        value={field.value}
                        onChange={(event) => field.onChange(event.target.value)}
                        placeholder="#4b4b4b"
                        className="w-28 font-mono"
                        aria-invalid={!!errors.mainColor}
                      />
                    </div>
                  )}
                />
                <FieldError
                  errors={errors.mainColor ? [errors.mainColor] : undefined}
                />
              </Field>
            </CardContent>
          </Card>

          {/* Sección: disponibilidad (fecha, rango, hora y toggle group) */}
          <Card>
            <CardHeader>
              <CardTitle>Disponibilidad</CardTitle>
              <CardDescription>
                Cuándo se publica y en qué condición se vende.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="sm:grid sm:grid-cols-2 sm:gap-4">
                {/* Fecha única con calendario */}
                <Field data-invalid={!!errors.availableFrom || undefined}>
                  <FieldLabel>Disponible a partir de</FieldLabel>
                  <Controller
                    control={form.control}
                    name="availableFrom"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger
                          render={
                            <Button
                              type="button"
                              variant="outline"
                              aria-invalid={!!errors.availableFrom}
                              className="w-full justify-between font-normal"
                            />
                          }
                        >
                          <span
                            className={cn(!field.value && "text-muted-foreground")}
                          >
                            {field.value
                              ? format(field.value, "d 'de' MMMM yyyy", { locale: es })
                              : "Selecciona una fecha"}
                          </span>
                          <CalendarIcon
                            data-icon="inline-end"
                            className="text-muted-foreground"
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            locale={es}
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  <FieldError
                    errors={errors.availableFrom ? [errors.availableFrom] : undefined}
                  />
                </Field>

                {/* Rango de fechas de promoción */}
                <Field>
                  <FieldLabel>Promoción (opcional)</FieldLabel>
                  <Controller
                    control={form.control}
                    name="promo"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger
                          render={
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full justify-between font-normal"
                            />
                          }
                        >
                          <span
                            className={cn(
                              "truncate",
                              !field.value?.from && "text-muted-foreground"
                            )}
                          >
                            {field.value?.from
                              ? `${format(field.value.from, "d MMM", { locale: es })} – ${
                                  field.value.to
                                    ? format(field.value.to, "d MMM yyyy", { locale: es })
                                    : "…"
                                }`
                              : "Selecciona un rango"}
                          </span>
                          <CalendarIcon
                            data-icon="inline-end"
                            className="text-muted-foreground"
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            numberOfMonths={2}
                            locale={es}
                            selected={field.value as DateRange | undefined}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </Field>

                {/* Hora */}
                <Field data-invalid={!!errors.cutoffTime || undefined}>
                  <FieldLabel htmlFor="cutoffTime">
                    Hora límite para envío el mismo día
                  </FieldLabel>
                  <Input
                    id="cutoffTime"
                    type="time"
                    aria-invalid={!!errors.cutoffTime}
                    {...form.register("cutoffTime")}
                  />
                  <FieldError
                    errors={errors.cutoffTime ? [errors.cutoffTime] : undefined}
                  />
                </Field>

                {/* Toggle group de selección única */}
                <Field>
                  <FieldLabel>Condición</FieldLabel>
                  <Controller
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <ToggleGroup
                        variant="outline"
                        value={[field.value]}
                        onValueChange={(value: string[]) => {
                          const next = value[value.length - 1]
                          if (next) field.onChange(next)
                        }}
                      >
                        {conditionOptions.map((option) => (
                          <ToggleGroupItem key={option.value} value={option.value}>
                            {option.label}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    )}
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Sección: envío (peso + switches + condicional) */}
          <Card>
            <CardHeader>
              <CardTitle>Envío y garantía</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid grid-cols-[1fr_7rem] gap-2">
                  <Field>
                    <FieldLabel htmlFor="weight">Peso</FieldLabel>
                    <Input
                      id="weight"
                      type="number"
                      step="0.01"
                      placeholder="0.0"
                      {...form.register("weight")}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Unidad</FieldLabel>
                    <Controller
                      control={form.control}
                      name="weightUnit"
                      render={({ field }) => (
                        <Select
                          items={weightUnits}
                          value={field.value}
                          onValueChange={(v) => field.onChange(v ?? "kg")}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {Object.entries(weightUnits).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                </div>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor="trackInventory">
                      Rastrear inventario
                    </FieldLabel>
                    <FieldDescription>
                      Descuenta existencias con cada venta.
                    </FieldDescription>
                  </FieldContent>
                  <Controller
                    control={form.control}
                    name="trackInventory"
                    render={({ field }) => (
                      <Switch
                        id="trackInventory"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </Field>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor="freeShipping">Envío gratis</FieldLabel>
                    <FieldDescription>
                      El cliente no paga costos de envío.
                    </FieldDescription>
                  </FieldContent>
                  <Controller
                    control={form.control}
                    name="freeShipping"
                    render={({ field }) => (
                      <Switch
                        id="freeShipping"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </Field>

                {/* Campo condicional: aparece solo con el switch activo */}
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor="hasWarranty">
                      Incluye garantía
                    </FieldLabel>
                    <FieldDescription>
                      Muestra el sello de garantía en la página del producto.
                    </FieldDescription>
                  </FieldContent>
                  <Controller
                    control={form.control}
                    name="hasWarranty"
                    render={({ field }) => (
                      <Switch
                        id="hasWarranty"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </Field>
                {hasWarranty && (
                  <Field data-invalid={!!errors.warrantyMonths || undefined}>
                    <FieldLabel htmlFor="warrantyMonths">
                      Meses de garantía
                    </FieldLabel>
                    <InputGroup className="w-40">
                      <InputGroupInput
                        id="warrantyMonths"
                        type="number"
                        placeholder="12"
                        aria-invalid={!!errors.warrantyMonths}
                        {...form.register("warrantyMonths")}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupText>meses</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldError
                      errors={
                        errors.warrantyMonths ? [errors.warrantyMonths] : undefined
                      }
                    />
                  </Field>
                )}
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Sección: SEO (contadores de caracteres y slug con prefijo) */}
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
              <CardDescription>
                Cómo se ve el producto en los buscadores.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field data-invalid={!!errors.seoTitle || undefined}>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="seoTitle">Título SEO</FieldLabel>
                    <CharCount value={form.watch("seoTitle")} max={70} />
                  </div>
                  <Input
                    id="seoTitle"
                    aria-invalid={!!errors.seoTitle}
                    {...form.register("seoTitle")}
                  />
                  <FieldError
                    errors={errors.seoTitle ? [errors.seoTitle] : undefined}
                  />
                </Field>
                <Field data-invalid={!!errors.slug || undefined}>
                  <FieldLabel htmlFor="slug">Slug</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>tienda.mx/productos/</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="slug"
                      placeholder="silla-roble"
                      aria-invalid={!!errors.slug}
                      {...form.register("slug")}
                    />
                  </InputGroup>
                  <FieldError errors={errors.slug ? [errors.slug] : undefined} />
                </Field>
                <Field data-invalid={!!errors.seoDescription || undefined}>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="seoDescription">
                      Meta descripción
                    </FieldLabel>
                    <CharCount value={form.watch("seoDescription")} max={160} />
                  </div>
                  <Input
                    id="seoDescription"
                    aria-invalid={!!errors.seoDescription}
                    {...form.register("seoDescription")}
                  />
                  <FieldError
                    errors={
                      errors.seoDescription ? [errors.seoDescription] : undefined
                    }
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>

        {/* Columna lateral */}
        <div className="min-w-0 space-y-6">
          {/* Organización: combobox con búsqueda + dialog de alta */}
          <Card>
            <CardHeader>
              <CardTitle>Organización</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field data-invalid={!!errors.category || undefined}>
                  <FieldLabel>Categoría</FieldLabel>
                  <Controller
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                        <PopoverTrigger
                          render={
                            <Button
                              type="button"
                              variant="outline"
                              aria-invalid={!!errors.category}
                              className="w-full justify-between font-normal"
                            />
                          }
                        >
                          <span
                            className={cn(
                              "truncate",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value || "Buscar categoría…"}
                          </span>
                          <ChevronsUpDown
                            data-icon="inline-end"
                            className="text-muted-foreground"
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-(--anchor-width) p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Buscar categoría…" />
                            <CommandList>
                              <CommandEmpty>Sin resultados.</CommandEmpty>
                              <CommandGroup>
                                {categories.map((category) => (
                                  <CommandItem
                                    key={category}
                                    value={category}
                                    onSelect={(value) => {
                                      field.onChange(value)
                                      setCategoryOpen(false)
                                    }}
                                  >
                                    {category}
                                    {field.value === category && (
                                      <Check className="ml-auto" />
                                    )}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                              <CommandSeparator alwaysRender />
                              <CommandGroup forceMount>
                                <CommandItem
                                  forceMount
                                  onSelect={() => {
                                    setCategoryOpen(false)
                                    setNewCategoryOpen(true)
                                  }}
                                >
                                  <Plus />
                                  Crear categoría…
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  <FieldError
                    errors={errors.category ? [errors.category] : undefined}
                  />
                </Field>

                <Field data-invalid={!!errors.vendor || undefined}>
                  <FieldLabel>Proveedor</FieldLabel>
                  <Controller
                    control={form.control}
                    name="vendor"
                    render={({ field }) => (
                      <Select
                        items={vendors}
                        value={field.value || null}
                        onValueChange={(value) => field.onChange(value ?? "")}
                      >
                        <SelectTrigger aria-invalid={!!errors.vendor}>
                          <SelectValue placeholder="Selecciona un proveedor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.entries(vendors).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError errors={errors.vendor ? [errors.vendor] : undefined} />
                </Field>

                <FieldSet>
                  <FieldLegend>Estado</FieldLegend>
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <RadioGroup value={field.value} onValueChange={field.onChange}>
                        <Field orientation="horizontal">
                          <RadioGroupItem value="activo" id="status-activo" />
                          <FieldLabel htmlFor="status-activo" className="font-normal">
                            Activo
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                          <RadioGroupItem value="borrador" id="status-borrador" />
                          <FieldLabel
                            htmlFor="status-borrador"
                            className="font-normal"
                          >
                            Borrador
                          </FieldLabel>
                        </Field>
                      </RadioGroup>
                    )}
                  />
                </FieldSet>

                {/* Etiquetas: input → badges removibles */}
                <Field data-invalid={!!errors.tags || undefined}>
                  <FieldLabel htmlFor="tagDraft">Etiquetas</FieldLabel>
                  <Controller
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <>
                        <Input
                          id="tagDraft"
                          placeholder="Escribe y presiona Enter"
                          value={tagDraft}
                          onChange={(event) => setTagDraft(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key !== "Enter" && event.key !== ",") return
                            event.preventDefault()
                            const tag = tagDraft.trim().toLowerCase()
                            if (tag && !field.value.includes(tag)) {
                              field.onChange([...field.value, tag])
                            }
                            setTagDraft("")
                          }}
                        />
                        {field.value.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {field.value.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="gap-1 bg-badge-neutral font-normal text-foreground capitalize"
                              >
                                {tag}
                                <button
                                  type="button"
                                  aria-label={`Quitar etiqueta ${tag}`}
                                  onClick={() =>
                                    field.onChange(
                                      field.value.filter((item) => item !== tag)
                                    )
                                  }
                                  className="-mr-0.5 rounded-full hover:text-destructive"
                                >
                                  <X className="size-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  />
                  <FieldError
                    errors={
                      errors.tags ? [errors.tags as { message?: string }] : undefined
                    }
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Multi-selección con checkboxes */}
          <Card>
            <CardHeader>
              <CardTitle>Canales de venta</CardTitle>
              <CardDescription>Dónde estará disponible.</CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                control={form.control}
                name="channels"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <div className="space-y-3">
                      {channelOptions.map((channel) => (
                        <Field key={channel} orientation="horizontal">
                          <Checkbox
                            id={`channel-${channel}`}
                            checked={field.value.includes(channel)}
                            onCheckedChange={(checked) =>
                              field.onChange(
                                checked
                                  ? [...field.value, channel]
                                  : field.value.filter((item) => item !== channel)
                              )
                            }
                          />
                          <FieldLabel
                            htmlFor={`channel-${channel}`}
                            className="font-normal"
                          >
                            {channel}
                          </FieldLabel>
                        </Field>
                      ))}
                    </div>
                    <FieldError
                      errors={fieldState.error ? [fieldState.error] : undefined}
                    />
                  </Field>
                )}
              />
            </CardContent>
          </Card>

          {/* Contacto: email, teléfono y URL validados */}
          <Card>
            <CardHeader>
              <CardTitle>Contacto del proveedor</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field data-invalid={!!errors.contactEmail || undefined}>
                  <FieldLabel htmlFor="contactEmail">Correo</FieldLabel>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="compras@proveedor.mx"
                    aria-invalid={!!errors.contactEmail}
                    {...form.register("contactEmail")}
                  />
                  <FieldError
                    errors={errors.contactEmail ? [errors.contactEmail] : undefined}
                  />
                </Field>
                <Field data-invalid={!!errors.contactPhone || undefined}>
                  <FieldLabel htmlFor="contactPhone">Teléfono</FieldLabel>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="+52 55 1234 5678"
                    aria-invalid={!!errors.contactPhone}
                    {...form.register("contactPhone")}
                  />
                  <FieldError
                    errors={errors.contactPhone ? [errors.contactPhone] : undefined}
                  />
                </Field>
                <Field data-invalid={!!errors.website || undefined}>
                  <FieldLabel htmlFor="website">Sitio web (opcional)</FieldLabel>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://proveedor.mx"
                    aria-invalid={!!errors.website}
                    {...form.register("website")}
                  />
                  <FieldError
                    errors={errors.website ? [errors.website] : undefined}
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Textarea con contador */}
          <Card>
            <CardHeader>
              <CardTitle>Notas internas</CardTitle>
              <CardDescription>No visibles para el cliente.</CardDescription>
            </CardHeader>
            <CardContent>
              <Field data-invalid={!!errors.internalNotes || undefined}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="internalNotes">Notas</FieldLabel>
                  <CharCount value={form.watch("internalNotes")} max={300} />
                </div>
                <Textarea
                  id="internalNotes"
                  rows={4}
                  placeholder="Instrucciones de manejo, acuerdos con el proveedor…"
                  aria-invalid={!!errors.internalNotes}
                  {...form.register("internalNotes")}
                />
                <FieldError
                  errors={errors.internalNotes ? [errors.internalNotes] : undefined}
                />
              </Field>
            </CardContent>
          </Card>
        </div>
      </form>

      {/* Dialog: crear categoría desde el combobox */}
      <Dialog open={newCategoryOpen} onOpenChange={setNewCategoryOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Nueva categoría</DialogTitle>
            <DialogDescription>
              Se agrega a la lista y se selecciona en el producto.
            </DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="newCategory">Nombre</FieldLabel>
            <Input
              id="newCategory"
              placeholder="Iluminación"
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  addCategory()
                }
              }}
            />
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewCategoryOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={addCategory} disabled={!newCategory.trim()}>
              Crear categoría
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
