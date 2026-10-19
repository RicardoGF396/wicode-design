import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"

import { AuthLayout } from "@/components/layout/auth-layout"
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

const loginSchema = z.object({
  email: z.email("Ingresa un correo válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (values: LoginValues) => {
    setIsSubmitting(true)
    // Simula una llamada a la API; aquí va la integración real de auth.
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsSubmitting(false)
    toast.success(`Bienvenido de nuevo, ${values.email}`)
    navigate("/")
  }

  const { errors } = form.formState

  return (
    <AuthLayout>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Inicia sesión</CardTitle>
          <CardDescription>
            Ingresa tu correo para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field data-invalid={!!errors.email || undefined}>
                <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...form.register("email")}
                />
                <FieldError errors={errors.email ? [errors.email] : undefined} />
              </Field>
              <Field data-invalid={!!errors.password || undefined}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  {...form.register("password")}
                />
                <FieldError
                  errors={errors.password ? [errors.password] : undefined}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Spinner />}
                  Iniciar sesión
                </Button>
              </Field>
              <FieldSeparator>O continúa con</FieldSeparator>
              <Field orientation="horizontal" className="grid grid-cols-2">
                <Button variant="outline" type="button">
                  Google
                </Button>
                <Button variant="outline" type="button">
                  GitHub
                </Button>
              </Field>
              <FieldDescription className="text-center">
                ¿No tienes cuenta?{" "}
                <Link to="/signup" className="underline underline-offset-4">
                  Regístrate
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
