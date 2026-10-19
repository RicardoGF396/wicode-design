import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { PageActions } from "@/components/layout/page-actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

const productSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  description: z.string().min(10, "Describe el producto (mínimo 10 caracteres)"),
  price: z.coerce.number().positive("El precio debe ser mayor a 0"),
  comparePrice: z.coerce.number().nonnegative().optional(),
  category: z.string().min(1, "Selecciona una categoría"),
  status: z.enum(["activo", "borrador"]),
  trackInventory: z.boolean(),
  freeShipping: z.boolean(),
})

// z.coerce convierte el string del input a número, por lo que el tipo de
// entrada (lo que escribe el usuario) y el de salida (lo validado) difieren.
type ProductInput = z.input<typeof productSchema>
type ProductValues = z.output<typeof productSchema>

const categories = [
  { value: "hogar", label: "Hogar" },
  { value: "cocina", label: "Cocina" },
  { value: "decoracion", label: "Decoración" },
  { value: "muebles", label: "Muebles" },
]

export function FormsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<ProductInput, unknown, ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: undefined,
      comparePrice: undefined,
      category: "",
      status: "borrador",
      trackInventory: true,
      freeShipping: false,
    },
  })

  const onSubmit = async (values: ProductValues) => {
    setIsSubmitting(true)
    // Simula el guardado; aquí va la llamada real a la API.
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsSubmitting(false)
    toast.success(`Producto "${values.name}" guardado`)
  }

  const { errors } = form.formState

  return (
    <>
      {/* Las acciones del formulario viven en el header; el submit se asocia
          al form por id (atributo form del botón). */}
      <PageActions>
        <Button variant="outline" onClick={() => form.reset()}>
          Descartar
        </Button>
        <Button type="submit" form="product-form" disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          Guardar producto
        </Button>
      </PageActions>

      <form
        id="product-form"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="mx-auto grid w-full max-w-4xl gap-6 lg:grid-cols-3"
      >
        <div className="space-y-6 lg:col-span-2">
          {/* Sección: información general */}
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
                <Field data-invalid={!!errors.description || undefined}>
                  <FieldLabel htmlFor="description">Descripción</FieldLabel>
                  <Textarea
                    id="description"
                    placeholder="Describe materiales, dimensiones y usos…"
                    rows={4}
                    aria-invalid={!!errors.description}
                    {...form.register("description")}
                  />
                  <FieldDescription>
                    Se muestra en la página del producto.
                  </FieldDescription>
                  <FieldError
                    errors={errors.description ? [errors.description] : undefined}
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Sección: precios */}
          <Card>
            <CardHeader>
              <CardTitle>Precios</CardTitle>
              <CardDescription>
                Define el precio de venta y el precio de comparación.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="sm:grid sm:grid-cols-2 sm:gap-4">
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
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>MXN</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldError errors={errors.price ? [errors.price] : undefined} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="comparePrice">
                    Precio de comparación
                  </FieldLabel>
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
                  <FieldDescription>
                    Opcional, se muestra tachado.
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Sección: envío e inventario */}
          <Card>
            <CardHeader>
              <CardTitle>Envío e inventario</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
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
              </FieldGroup>
            </CardContent>
          </Card>
        </div>

        {/* Columna lateral: organización */}
        <div className="space-y-6">
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
                      <Select
                        value={field.value || null}
                        onValueChange={(value) => field.onChange(value ?? "")}
                      >
                        <SelectTrigger aria-invalid={!!errors.category}>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError
                    errors={errors.category ? [errors.category] : undefined}
                  />
                </Field>

                <FieldSet>
                  <FieldLegend>Estado</FieldLegend>
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <Field orientation="horizontal">
                          <RadioGroupItem value="activo" id="status-activo" />
                          <FieldLabel
                            htmlFor="status-activo"
                            className="font-normal"
                          >
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
              </FieldGroup>
            </CardContent>
          </Card>

        </div>
      </form>
    </>
  )
}
