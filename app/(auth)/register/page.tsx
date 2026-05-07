"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { UtensilsCrossed, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { generateSlug } from "@/lib/utils"
import toast from "react-hot-toast"

const RESERVED_SLUGS = new Set([
  "dashboard", "login", "register", "api", "admin", "demo",
  "app", "www", "settings", "help", "about", "contact",
  "support", "blog", "static", "assets", "public", "null",
  "undefined", "home", "index", "auth", "oauth", "callback",
])

const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  restaurantName: z.string().min(2, "Nome demasiado curto").max(80, "Nome demasiado longo"),
  slug: z
    .string()
    .min(2, "Slug demasiado curto")
    .max(50, "Slug demasiado longo")
    .regex(/^[a-z0-9-]+$/, "Apenas letras minúsculas, números e hífens")
    .refine((v) => !RESERVED_SLUGS.has(v.toLowerCase()), "Este URL é reservado. Escolhe outro."),
})

type RegisterValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) })

  const handleRestaurantNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setValue("restaurantName", name)
    setValue("slug", generateSlug(name))
  }

  const onSubmit = async (data: RegisterValues) => {
    const supabase = createClient()

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (signUpError) {
      toast.error(signUpError.message === "User already registered"
        ? "Este email já está registado."
        : "Erro ao criar conta. Tenta novamente.")
      return
    }

    if (!authData.user) {
      toast.error("Erro ao criar conta. Tenta novamente.")
      return
    }

    const res = await fetch("/api/create-restaurant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: authData.user.id, name: data.restaurantName, slug: data.slug }),
    })
    const result = await res.json()

    if (!result || result.error) {
      const msg =
        result?.error === "slug_taken" ? "Este URL já está a ser usado. Escolhe outro." :
        result?.error === "slug_reserved" ? "Este URL é reservado. Escolhe outro." :
        result?.error ?? "Erro ao criar restaurante. A conta foi removida — tenta novamente."
      toast.error(msg)
      return
    }

    toast.success("Conta criada com sucesso!")
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#C8622A] flex items-center justify-center mb-4 shadow-lg shadow-[#C8622A]/20">
            <UtensilsCrossed className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-playfair text-2xl font-bold text-[#1A1510]">Cria a tua conta</h1>
          <p className="font-dm-sans text-sm text-[#A89880] mt-1">Grátis, para sempre</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E0D5] p-7 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-dm-sans font-medium text-[#1A1510] mb-1.5">
                Nome do Restaurante
              </label>
              <input
                {...register("restaurantName")}
                onChange={handleRestaurantNameChange}
                placeholder="Ex: Tasca do Zé"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#E8E0D5] rounded-xl text-sm font-dm-sans text-[#1A1510] placeholder-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#C8622A]/30 focus:border-[#C8622A] transition"
              />
              {errors.restaurantName && (
                <p className="mt-1 text-xs text-red-600 font-dm-sans">{errors.restaurantName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-dm-sans font-medium text-[#1A1510] mb-1.5">
                URL do Cardápio
              </label>
              <div className="flex items-center border border-[#E8E0D5] rounded-xl overflow-hidden bg-[#FAF8F4] focus-within:ring-2 focus-within:ring-[#C8622A]/30 focus-within:border-[#C8622A] transition">
                <span className="px-3 py-2.5 text-xs font-dm-sans text-[#A89880] border-r border-[#E8E0D5] bg-[#F2EFE9] whitespace-nowrap">
                  cardap.io/
                </span>
                <input
                  {...register("slug")}
                  placeholder="o-teu-restaurante"
                  className="flex-1 px-3 py-2.5 bg-transparent text-sm font-mono text-[#1A1510] placeholder-[#A89880] focus:outline-none"
                />
              </div>
              {errors.slug ? (
                <p className="mt-1 text-xs text-red-600 font-dm-sans">{errors.slug.message}</p>
              ) : (
                watch("slug") && (
                  <p className="mt-1 text-xs text-[#A89880] font-dm-sans">
                    O teu cardápio ficará em /{watch("slug")}
                  </p>
                )
              )}
            </div>

            <div>
              <label className="block text-sm font-dm-sans font-medium text-[#1A1510] mb-1.5">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="o.teu@email.com"
                autoComplete="email"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#E8E0D5] rounded-xl text-sm font-dm-sans text-[#1A1510] placeholder-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#C8622A]/30 focus:border-[#C8622A] transition"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 font-dm-sans">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-dm-sans font-medium text-[#1A1510] mb-1.5">Senha</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  className="w-full px-3.5 py-2.5 pr-10 bg-[#FAF8F4] border border-[#E8E0D5] rounded-xl text-sm font-dm-sans text-[#1A1510] placeholder-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#C8622A]/30 focus:border-[#C8622A] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89880] hover:text-[#6B5E4E]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 font-dm-sans">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-[#C8622A] hover:bg-[#A84E1E] text-white font-dm-sans font-medium py-2.5"
            >
              {isSubmitting ? "A criar conta..." : "Criar Conta Grátis"}
            </Button>
          </form>
        </div>

        <p className="text-center font-dm-sans text-sm text-[#A89880] mt-5">
          Já tens conta?{" "}
          <Link href="/login" className="text-[#C8622A] hover:text-[#A84E1E] font-medium">
            Faz login
          </Link>
        </p>
      </div>
    </div>
  )
}
