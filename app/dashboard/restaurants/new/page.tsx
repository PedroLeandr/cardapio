"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardShell } from "@/components/dashboard/DashboardShell"
import { createClient } from "@/lib/supabase/client"
import { setActiveRestaurantId } from "@/lib/restaurants/client"
import { canManageMultipleRestaurants } from "@/lib/restaurantAccess"
import { generateSlug } from "@/lib/utils"
import toast from "react-hot-toast"

const RESERVED_SLUGS = new Set([
  "dashboard", "login", "register", "api", "admin",
  "app", "www", "settings", "help", "about", "contact",
  "support", "blog", "static", "assets", "public", "null",
  "undefined", "home", "index", "auth", "oauth", "callback",
])

const newRestaurantSchema = z.object({
  name: z.string().min(2, "Nome demasiado curto").max(80, "Nome demasiado longo"),
  slug: z
    .string()
    .min(2, "Slug demasiado curto")
    .max(50, "Slug demasiado longo")
    .regex(/^[a-z0-9-]+$/, "Apenas letras minúsculas, números e hífens")
    .refine((v) => !RESERVED_SLUGS.has(v.toLowerCase()), "Este URL é reservado. Escolhe outro."),
})

type NewRestaurantValues = z.infer<typeof newRestaurantSchema>

export default function NewRestaurantPage() {
  const [checking, setChecking] = useState(true)
  const [userId, setUserId] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NewRestaurantValues>({ resolver: zodResolver(newRestaurantSchema) })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || !canManageMultipleRestaurants(user.email)) {
        window.location.href = "/dashboard"
        return
      }
      setUserId(user.id)
      setChecking(false)
    })
  }, [])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setValue("name", name)
    setValue("slug", generateSlug(name))
  }

  const onSubmit = async (data: NewRestaurantValues) => {
    const supabase = createClient()

    const { data: existing } = await supabase
      .from("restaurants")
      .select("id")
      .eq("slug", data.slug)
      .maybeSingle()

    if (existing) {
      toast.error("Este URL já está a ser usado. Escolhe outro.")
      return
    }

    const { data: created, error } = await supabase
      .from("restaurants")
      .insert({ user_id: userId, name: data.name, slug: data.slug, description: "" })
      .select("id")
      .single()

    if (error || !created) {
      toast.error("Erro ao criar restaurante. Tenta novamente.")
      return
    }

    setActiveRestaurantId(created.id)
    toast.success("Restaurante criado!")
    window.location.href = "/dashboard"
  }

  if (checking) {
    return (
      <DashboardShell>
        <div className="h-24 bg-white rounded-xl border border-[#E8E0D5] animate-pulse" />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="max-w-sm mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#C8622A] flex items-center justify-center mb-4 shadow-lg shadow-[#C8622A]/20">
            <UtensilsCrossed className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-dm-sans text-2xl font-bold text-[#1A1510]">Novo restaurante</h1>
          <p className="font-dm-sans text-sm text-[#A89880] mt-1">Adiciona mais um cardápio à tua conta</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E0D5] p-7 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-dm-sans font-medium text-[#1A1510] mb-1.5">
                Nome do Restaurante
              </label>
              <input
                {...register("name")}
                onChange={handleNameChange}
                placeholder="Ex: Tasca do Zé"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#E8E0D5] rounded-xl text-sm font-dm-sans text-[#1A1510] placeholder-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#C8622A]/30 focus:border-[#C8622A] transition"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600 font-dm-sans">{errors.name.message}</p>
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
                    O cardápio ficará em /{watch("slug")}
                  </p>
                )
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-[#C8622A] hover:bg-[#A84E1E] text-white font-dm-sans font-medium py-2.5"
            >
              {isSubmitting ? "A criar..." : "Criar Restaurante"}
            </Button>
          </form>
        </div>
      </div>
    </DashboardShell>
  )
}
