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
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

const signupSchema = z
  .object({
    name: z.string().min(2, "Ingresa tu nombre completo"),
    email: z.email("Ingresa un correo válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

type SignupValues = z.infer<typeof signupSchema>

export function SignupPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  })

  const onSubmit = async (values: SignupValues) => {
    setIsSubmitting(true)
    // Simula una llamada a la API; aquí va la integración real de registro.
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsSubmitting(false)
    toast.success(`Cuenta creada para ${values.email}`)
    navigate("/")
  }

  const { errors } = form.formState

  return (
    <AuthLayout>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crea tu cuenta</CardTitle>
          <CardDescription>
            Comienza gratis, sin tarjeta de crédito
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field data-invalid={!!errors.name || undefined}>
                <FieldLabel htmlFor="name">Nombre completo</FieldLabel>
                <Input
                  id="name"
                  placeholder="María González"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  {...form.register("name")}
                />
                <FieldError errors={errors.name ? [errors.name] : undefined} />
              </Field>
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
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  {...form.register("password")}
                />
                <FieldDescription>Mínimo 8 caracteres.</FieldDescription>
                <FieldError
                  errors={errors.password ? [errors.password] : undefined}
                />
              </Field>
              <Field data-invalid={!!errors.confirmPassword || undefined}>
                <FieldLabel htmlFor="confirmPassword">
                  Confirmar contraseña
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                  {...form.register("confirmPassword")}
                />
                <FieldError
                  errors={
                    errors.confirmPassword ? [errors.confirmPassword] : undefined
                  }
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Spinner />}
                  Crear cuenta
                </Button>
              </Field>
              <FieldDescription className="text-center">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Inicia sesión
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
