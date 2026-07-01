"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import { UtensilsCrossed, Upload, X, ExternalLink, Phone, MapPin, Sparkles, Crown } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { DashboardShell } from "@/components/dashboard/DashboardShell"
import { createClient } from "@/lib/supabase/client"
import { fetchActiveRestaurant } from "@/lib/restaurants/client"
import { generateSlug } from "@/lib/utils"
import { deleteAccount } from "./actions"
import toast from "react-hot-toast"

const RESERVED_SLUGS = new Set([
  "dashboard", "login", "register", "api", "admin",
  "app", "www", "settings", "help", "about", "contact",
  "support", "blog", "static", "assets", "public", "null",
  "undefined", "home", "index", "auth", "oauth", "callback",
])

const settingsSchema = z.object({
  name: z.string().min(2, "Nome demasiado curto").max(80, "Nome demasiado longo"),
  slug: z
    .string()
    .min(2, "Slug demasiado curto")
    .max(50, "Slug demasiado longo")
    .regex(/^[a-z0-9-]+$/, "Apenas letras minúsculas, números e hífens")
    .refine((v) => !RESERVED_SLUGS.has(v.toLowerCase()), "Este URL é reservado. Escolhe outro."),
  description: z.string().max(300, "Máximo 300 caracteres").optional(),
  phone: z.string().max(30, "Número demasiado longo").optional(),
  google_maps_url: z.string().max(500, "URL demasiado longo").optional(),
})

type SettingsValues = z.infer<typeof settingsSchema>

export default function SettingsPage() {
  const [restaurantId, setRestaurantId] = useState("")
  const [userId, setUserId] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [plan, setPlan] = useState<string>("free")
  const [portalLoading, setPortalLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "ok" | "taken">("idle")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const [deleting, setDeleting] = useState(false)
  const [currentSlug, setCurrentSlug] = useState("")
  const [otherRestaurantsCount, setOtherRestaurantsCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const slugTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SettingsValues>({ resolver: zodResolver(settingsSchema) })

  const watchedSlug = watch("slug")
  const watchedDescription = watch("description") ?? ""

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserId(user.id)
      setUserEmail(user.email ?? "")

      const { restaurant, restaurants } = await fetchActiveRestaurant(supabase, user.id)

      if (!restaurant) return
      setOtherRestaurantsCount(restaurants.length - 1)
      setRestaurantId(restaurant.id)
      setPlan(restaurant.plan ?? "free")
      setCurrentSlug(restaurant.slug)
      setLogoUrl(restaurant.logo_url ?? null)
      setLogoPreview(restaurant.logo_url ?? null)
      setValue("name", restaurant.name)
      setValue("slug", restaurant.slug)
      setValue("description", restaurant.description ?? "")
      setValue("phone", restaurant.phone ?? "")
      setValue("google_maps_url", restaurant.google_maps_url ?? "")
      setLoading(false)
    }
    load()
  }, [setValue])

  const checkSlug = useCallback(
    (value: string) => {
      if (slugTimerRef.current) clearTimeout(slugTimerRef.current)
      if (!value || value === currentSlug) { setSlugStatus("idle"); return }
      if (RESERVED_SLUGS.has(value.toLowerCase())) { setSlugStatus("taken"); return }
      setSlugStatus("checking")
      slugTimerRef.current = setTimeout(async () => {
        const supabase = createClient()
        const { data } = await supabase
          .from("restaurants")
          .select("id")
          .eq("slug", value)
          .neq("id", restaurantId)
          .maybeSingle()
        setSlugStatus(data ? "taken" : "ok")
      }, 500)
    },
    [currentSlug, restaurantId]
  )

  useEffect(() => {
    if (watchedSlug) checkSlug(watchedSlug)
  }, [watchedSlug, checkSlug])

  const handleLogoChange = (file: File) => {
    setLogoFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setLogoPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith("image/")) handleLogoChange(file)
  }

  const onSubmit = async (data: SettingsValues) => {
    if (slugStatus === "taken") { toast.error("O URL já está a ser usado."); return }
    setSaving(true)

    try {
      const supabase = createClient()
      let finalLogoUrl = logoUrl

      if (logoFile) {
        const ext = logoFile.name.split(".").pop()
        const path = `${restaurantId}/logo-${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from("menu-images")
          .upload(path, logoFile, { upsert: true })

        if (uploadError) {
          toast.error("Erro ao fazer upload do logo.")
          setSaving(false)
          return
        }

        const { data: urlData } = supabase.storage.from("menu-images").getPublicUrl(path)
        finalLogoUrl = urlData.publicUrl
        setLogoUrl(finalLogoUrl)
        setLogoFile(null)
      }

      const { error } = await supabase
        .from("restaurants")
        .update({
          name: data.name,
          slug: data.slug,
          description: data.description ?? "",
          logo_url: finalLogoUrl,
          phone: data.phone || null,
          google_maps_url: data.google_maps_url || null,
        })
        .eq("id", restaurantId)

      if (error) {
        toast.error("Erro ao guardar configurações.")
      } else {
        setCurrentSlug(data.slug)
        setSlugStatus("idle")
        toast.success("Configurações guardadas!")
      }
    } finally {
      setSaving(false)
    }
  }

  const handleUpgrade = async () => {
    setCheckoutLoading(true)
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error("Erro ao iniciar checkout.")
    } catch {
      toast.error("Erro ao iniciar checkout.")
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handlePortal = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error("Erro ao abrir portal.")
    } catch {
      toast.error("Erro ao abrir portal.")
    } finally {
      setPortalLoading(false)
    }
  }

  const handleDelete = async () => {
    if (deleteConfirm !== currentSlug) return
    setDeleting(true)
    const isLastRestaurant = otherRestaurantsCount === 0
    const result = await deleteAccount(userId, restaurantId, isLastRestaurant)
    if (result.error) {
      toast.error(result.error)
      setDeleting(false)
      return
    }
    if (isLastRestaurant) {
      toast.success("Conta eliminada.")
      window.location.href = "/"
    } else {
      toast.success("Restaurante eliminado.")
      document.cookie = "active_restaurant_id=; path=/; max-age=0"
      window.location.href = "/dashboard"
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white rounded-xl border border-[#E8E0D5] animate-pulse" />
          ))}
        </div>
      </DashboardShell>
    )
  }

  const menuUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/${watchedSlug}`

  return (
    <DashboardShell>
      <div className="mb-8">
        <h1 className="font-dm-sans text-2xl font-bold text-[#1A1510]">Configurações</h1>
        <p className="font-dm-sans text-sm text-[#A89880] mt-1">Gere as informações do teu restaurante</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Secção 1 — Restaurante */}
        <div className="bg-white rounded-xl border border-[#E8E0D5] p-6 space-y-5">
          <h2 className="font-dm-sans font-semibold text-sm text-[#A89880] uppercase tracking-wide">
            Informações do Restaurante
          </h2>

          {/* Logo */}
          <div>
            <label className="block text-sm font-dm-sans font-medium text-[#1A1510] mb-3">Logo</label>
            <div className="flex items-center gap-5">
              <div
                className="w-24 h-24 rounded-full border-2 border-dashed border-[#E8E0D5] overflow-hidden flex-shrink-0 cursor-pointer hover:border-[#C8622A] transition-colors bg-[#F2EFE9]"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {logoPreview ? (
                  <Image src={logoPreview} alt="Logo" width={96} height={96} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UtensilsCrossed className="w-8 h-8 text-[#A89880]" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-dm-sans font-medium text-[#6B5E4E] bg-[#F2EFE9] hover:bg-[#E8DDD0] rounded-lg transition-colors border border-[#E8E0D5]"
                >
                  <Upload className="w-4 h-4" />
                  Carregar imagem
                </button>
                {logoPreview && (
                  <button
                    type="button"
                    onClick={() => { setLogoPreview(null); setLogoFile(null); setLogoUrl(null) }}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-dm-sans font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Remover
                  </button>
                )}
                <p className="text-xs font-dm-sans text-[#A89880]">JPG, PNG ou WebP. Recomendado 256×256px.</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoChange(f) }}
            />
          </div>

          {/* Nome */}
          <div>
            <label className="block text-sm font-dm-sans font-medium text-[#1A1510] mb-1.5">
              Nome do Restaurante
            </label>
            <input
              {...register("name")}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#E8E0D5] rounded-xl text-sm font-dm-sans text-[#1A1510] placeholder-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#C8622A]/30 focus:border-[#C8622A] transition"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600 font-dm-sans">{errors.name.message}</p>}
          </div>

          {/* Descrição */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-dm-sans font-medium text-[#1A1510]">Descrição</label>
              <span className="text-xs font-dm-sans text-[#A89880]">{watchedDescription.length}/300</span>
            </div>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Descreve o teu restaurante em poucas palavras..."
              className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#E8E0D5] rounded-xl text-sm font-dm-sans text-[#1A1510] placeholder-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#C8622A]/30 focus:border-[#C8622A] transition resize-none"
            />
            {errors.description && <p className="mt-1 text-xs text-red-600 font-dm-sans">{errors.description.message}</p>}
          </div>
        </div>

        {/* Secção 2 — Contacto */}
        <div className="bg-white rounded-xl border border-[#E8E0D5] p-6 space-y-5">
          <h2 className="font-dm-sans font-semibold text-sm text-[#A89880] uppercase tracking-wide">
            Contacto
          </h2>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-dm-sans font-medium text-[#1A1510] mb-1.5">
              Número de Telefone
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89880] pointer-events-none" />
              <input
                {...register("phone")}
                type="tel"
                placeholder="+351 912 345 678"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F4] border border-[#E8E0D5] rounded-xl text-sm font-dm-sans text-[#1A1510] placeholder-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#C8622A]/30 focus:border-[#C8622A] transition"
              />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-red-600 font-dm-sans">{errors.phone.message}</p>}
            <p className="mt-1 text-xs text-[#A89880] font-dm-sans">Aparece no cardápio para os clientes ligarem diretamente.</p>
          </div>

          {/* Google Maps */}
          <div>
            <label className="block text-sm font-dm-sans font-medium text-[#1A1510] mb-1.5">
              Link do Google Maps
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89880] pointer-events-none" />
              <input
                {...register("google_maps_url")}
                type="url"
                placeholder="https://maps.app.goo.gl/..."
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F4] border border-[#E8E0D5] rounded-xl text-sm font-dm-sans text-[#1A1510] placeholder-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#C8622A]/30 focus:border-[#C8622A] transition"
              />
            </div>
            {errors.google_maps_url && <p className="mt-1 text-xs text-red-600 font-dm-sans">{errors.google_maps_url.message}</p>}
            <p className="mt-1 text-xs text-[#A89880] font-dm-sans">
              No Google Maps: abre a localização → toca em <strong className="text-[#6B5E4E]">Partilhar</strong> → <strong className="text-[#6B5E4E]">Copiar link</strong>. O link terá o formato <span className="font-mono">maps.app.goo.gl/...</span>
            </p>
          </div>
        </div>

        {/* Secção 3 — URL */}
        <div className="bg-white rounded-xl border border-[#E8E0D5] p-6 space-y-4">
          <h2 className="font-dm-sans font-semibold text-sm text-[#A89880] uppercase tracking-wide">
            URL do Cardápio
          </h2>

          <div>
            <label className="block text-sm font-dm-sans font-medium text-[#1A1510] mb-1.5">Endereço</label>
            <div className="flex items-center border border-[#E8E0D5] rounded-xl overflow-hidden bg-[#FAF8F4] focus-within:ring-2 focus-within:ring-[#C8622A]/30 focus-within:border-[#C8622A] transition">
              <span className="px-3 py-2.5 text-xs font-dm-sans text-[#A89880] border-r border-[#E8E0D5] bg-[#F2EFE9] whitespace-nowrap">
                cardap.io/
              </span>
              <input
                {...register("slug", {
                  onChange: (e) => {
                    const v = generateSlug(e.target.value)
                    setValue("slug", v)
                  },
                })}
                className="flex-1 px-3 py-2.5 bg-transparent text-sm font-mono text-[#1A1510] placeholder-[#A89880] focus:outline-none"
              />
            </div>
            {errors.slug ? (
              <p className="mt-1 text-xs text-red-600 font-dm-sans">{errors.slug.message}</p>
            ) : slugStatus === "taken" ? (
              <p className="mt-1 text-xs text-red-600 font-dm-sans">
                {RESERVED_SLUGS.has(watchedSlug?.toLowerCase()) ? "Este URL é reservado. Escolhe outro." : "Este URL já está a ser usado."}
              </p>
            ) : slugStatus === "ok" ? (
              <p className="mt-1 text-xs text-green-600 font-dm-sans">URL disponível.</p>
            ) : slugStatus === "checking" ? (
              <p className="mt-1 text-xs text-[#A89880] font-dm-sans">A verificar...</p>
            ) : null}
          </div>

          <div className="flex items-center gap-2 px-3 py-2.5 bg-[#F2EFE9] rounded-lg border border-[#E8E0D5]">
            <span className="flex-1 font-mono text-xs text-[#6B5E4E] truncate">{menuUrl}</span>
            <a
              href={menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-[#A89880] hover:text-[#C8622A] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Guardar */}
        <Button
          type="submit"
          disabled={saving || slugStatus === "taken"}
          className="w-full bg-[#C8622A] hover:bg-[#A84E1E] text-white font-dm-sans font-medium py-2.5"
        >
          {saving ? "A guardar..." : "Guardar Alterações"}
        </Button>
      </form>

      {/* Secção — Plano */}
      <div className="mt-6 bg-white rounded-xl border border-[#E8E0D5] p-6">
        <h2 className="font-dm-sans font-semibold text-sm text-[#A89880] uppercase tracking-wide mb-4">Plano</h2>
        {plan === "pro" ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center">
                <Crown className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="font-dm-sans font-semibold text-sm text-[#1A1510]">Plano Pro</p>
                <p className="font-dm-sans text-xs text-[#A89880]">Categorias e itens ilimitados</p>
              </div>
            </div>
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="px-3 py-1.5 text-xs font-dm-sans font-medium text-[#6B5E4E] border border-[#E8E0D5] rounded-lg hover:bg-[#F2EFE9] transition-colors disabled:opacity-50"
            >
              {portalLoading ? "A carregar..." : "Gerir subscrição"}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-dm-sans font-semibold text-sm text-[#1A1510]">Plano Gratuito</p>
              <p className="font-dm-sans text-xs text-[#A89880]">Máx. 3 categorias · Máx. 10 itens</p>
            </div>
            <button
              onClick={handleUpgrade}
              disabled={checkoutLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-xs font-dm-sans font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {checkoutLoading ? "A redirecionar..." : "Upgrade para Pro"}
            </button>
          </div>
        )}
      </div>

      {/* Secção — Conta */}
      <div className="mt-6 bg-white rounded-xl border border-[#E8E0D5] p-6 space-y-4">
        <h2 className="font-dm-sans font-semibold text-sm text-[#A89880] uppercase tracking-wide">Conta</h2>
        <div>
          <label className="block text-xs font-dm-sans text-[#A89880] mb-1">Email</label>
          <p className="font-dm-sans text-sm text-[#1A1510]">{userEmail}</p>
        </div>
        <button
          onClick={async () => {
            const supabase = createClient()
            await supabase.auth.signOut()
            window.location.href = "/login"
          }}
          className="text-sm font-dm-sans font-medium text-[#6B5E4E] hover:text-[#1A1510] transition-colors"
        >
          Terminar sessão
        </button>
      </div>

      {/* Secção 4 — Zona de Perigo */}
      <div className="mt-6 bg-white rounded-xl border border-red-200 p-6">
        <h2 className="font-dm-sans font-semibold text-sm text-red-600 uppercase tracking-wide mb-3">
          Zona de Perigo
        </h2>
        <p className="font-dm-sans text-sm text-[#6B5E4E] mb-4">
          {otherRestaurantsCount > 0
            ? "Elimina permanentemente este restaurante, todos os pratos e categorias. A tua conta e os teus outros restaurantes não são afetados. Esta ação é irreversível."
            : "Elimina permanentemente o teu restaurante, todos os pratos e categorias, e a tua conta. Esta ação é irreversível."}
        </p>
        <button
          onClick={() => setDeleteOpen(true)}
          className="px-4 py-2 text-sm font-dm-sans font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          {otherRestaurantsCount > 0 ? "Eliminar este restaurante" : "Eliminar restaurante e conta"}
        </button>
      </div>

      {/* Dialog de confirmação */}
      <Dialog open={deleteOpen} onOpenChange={(o) => { setDeleteOpen(o); if (!o) setDeleteConfirm("") }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-dm-sans text-[#1A1510]">Eliminar conta</DialogTitle>
            <DialogDescription className="font-dm-sans text-[#6B5E4E]">
              Esta ação é irreversível. Para confirmar, escreve{" "}
              <strong className="text-[#1A1510] font-mono">{currentSlug}</strong> no campo abaixo.
            </DialogDescription>
          </DialogHeader>
          <input
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder={currentSlug}
            className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#E8E0D5] rounded-xl text-sm font-mono text-[#1A1510] placeholder-[#A89880] focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition"
          />
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => { setDeleteOpen(false); setDeleteConfirm("") }}
              className="border-[#E8E0D5] text-[#6B5E4E] hover:bg-[#F2EFE9] font-dm-sans"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteConfirm !== currentSlug || deleting}
              className="bg-red-600 hover:bg-red-700 text-white font-dm-sans"
            >
              {deleting ? "A eliminar..." : "Eliminar tudo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
