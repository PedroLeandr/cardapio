"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { DashboardShell } from "@/components/dashboard/DashboardShell"
import { Crown, Sparkles, Check, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { fetchActiveRestaurant } from "@/lib/restaurants/client"
import toast from "react-hot-toast"

const THEMES = [
  {
    id: "modern",
    name: "Moderno",
    description: "Fundo branco, cards com gradiente e imagem flutuante.",
    preview: (accent: string) => (
      <div className="w-full h-full bg-white flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-100">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white" style={{ background: accent }}>T</div>
          <span className="text-[7px] font-semibold text-gray-800">Tasca do Zé</span>
          <div className="w-5 h-5" />
        </div>
        <div className="px-2 py-1.5">
          <div className="flex items-center bg-gray-100 rounded-full h-4 px-1.5 gap-1">
            <span className="text-[5px] text-gray-400 flex-1">Pesquisar...</span>
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: accent }} />
          </div>
        </div>
        <div className="flex gap-1 px-2 mb-1">
          <div className="px-1.5 py-0.5 rounded-full text-[5px] font-medium text-white" style={{ background: accent }}>Entradas</div>
          <div className="px-1.5 py-0.5 rounded-full text-[5px] font-medium text-gray-500 bg-gray-100">Pratos</div>
        </div>
        <div className="flex gap-1.5 px-2 overflow-hidden" style={{ paddingTop: 10 }}>
          {[0, 1].map((i) => (
            <div key={i} className="flex-shrink-0 rounded-xl overflow-hidden relative" style={{ width: 44, height: 64, background: `linear-gradient(155deg, color-mix(in srgb, ${accent} 90%, white) 0%, color-mix(in srgb, ${accent} 55%, black) 100%)` }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/20 ring-1 ring-white" />
              <div className="absolute bottom-1.5 left-1.5 right-1.5">
                <div className="h-1.5 bg-white/80 rounded-full w-3/4 mb-0.5" />
                <div className="h-1 bg-white/50 rounded-full w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "classic",
    name: "Clássico",
    description: "Fundo escuro, lista alternada e tipografia serif.",
    preview: (accent: string) => (
      <div className="w-full h-full bg-[#111111] flex flex-col overflow-hidden">
        <div className="flex items-center gap-1.5 px-2 py-2 border-b border-white/10">
          <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-sm" style={{ background: accent }} />
          </div>
          <div>
            <div className="h-1.5 bg-white/70 rounded w-10 mb-0.5" />
            <div className="h-1 bg-white/30 rounded w-7" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1.5">
          <div className="flex-1 h-px bg-white/10" />
          <div className="px-1.5 py-0.5 rounded-full text-[5px] font-bold text-white uppercase" style={{ background: accent }}>Entradas</div>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center" style={{ height: 28 }}>
            {i % 2 === 0 ? (
              <>
                <div className="w-1/2 flex justify-center py-1">
                  <div className="w-7 h-7 rounded-full bg-white/10 ring-1 ring-white/20" />
                </div>
                <div className="w-1/2 px-2">
                  <div className="h-1.5 rounded mb-0.5" style={{ background: accent, width: "70%", opacity: 0.9 }} />
                  <div className="h-1 bg-white/20 rounded w-1/2" />
                </div>
              </>
            ) : (
              <>
                <div className="w-1/2 px-2 flex flex-col items-end">
                  <div className="h-1.5 rounded mb-0.5" style={{ background: accent, width: "70%", opacity: 0.9 }} />
                  <div className="h-1 bg-white/20 rounded w-1/2" />
                </div>
                <div className="w-1/2 flex justify-center py-1">
                  <div className="w-7 h-7 rounded-full bg-white/10 ring-1 ring-white/20" />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "brasserie",
    name: "Brasserie",
    description: "Papel quente, tipografia serif e cards artesanais.",
    preview: (accent: string) => (
      <div className="w-full h-full bg-[#F7F3EC] flex flex-col overflow-hidden">
        {/* Header centrado */}
        <div className="flex flex-col items-center px-2 py-2 border-b border-[#D4C4A8] gap-0.5">
          <div className="w-4 h-4 rounded-full flex items-center justify-center text-[5px] font-bold text-white" style={{ background: accent }}>T</div>
          <div className="h-1.5 bg-[#1A1008]/70 rounded w-10" style={{ fontStyle: "italic" }} />
          <div className="h-1 bg-[#8A7A6A]/50 rounded w-7" />
        </div>
        {/* Category divider */}
        <div className="flex items-center gap-1 px-2 py-1.5">
          <div className="flex-1 h-px bg-[#D4C4A8]" />
          <div className="h-1.5 bg-[#1A1008]/60 rounded w-8" />
          <div className="flex-1 h-px bg-[#D4C4A8]" />
        </div>
        {/* Items */}
        {[0, 1].map((i) => (
          <div key={i} className="flex gap-1.5 mx-2 mb-1.5 p-1.5 rounded-lg bg-[#EDE8DE]">
            <div className="w-7 h-7 rounded-md bg-[#D8D0C0] flex-shrink-0" />
            <div className="flex-1 flex flex-col justify-between">
              <div className="h-1.5 bg-[#1A1008]/60 rounded w-3/4" />
              <div className="h-1 bg-[#8A7A6A]/40 rounded w-1/2" />
              <div className="h-1.5 rounded w-6" style={{ background: accent, opacity: 0.9 }} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "noite",
    name: "Noite",
    description: "Fundo escuro, cards sombrios. Ideal para bares.",
    preview: (accent: string) => (
      <div className="w-full h-full bg-[#0D0F14] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-1.5 px-2 py-2 border-b border-white/5">
          <div className="w-4 h-4 rounded-md flex items-center justify-center text-[5px] font-bold text-white flex-shrink-0" style={{ background: accent }}>T</div>
          <div>
            <div className="h-1.5 bg-white/70 rounded w-10 mb-0.5" />
            <div className="h-1 bg-white/20 rounded w-6" />
          </div>
        </div>
        {/* Category */}
        <div className="px-2 pt-1.5 pb-1">
          <div className="h-1 bg-white/15 rounded w-8" />
        </div>
        {/* Items */}
        {[0, 1].map((i) => (
          <div key={i} className="flex gap-1.5 mx-2 mb-1.5 p-1.5 rounded-lg bg-[#161920] border border-white/5">
            <div className="flex-1 flex flex-col justify-between gap-0.5">
              <div className="h-1.5 bg-white/60 rounded w-3/4" />
              <div className="h-1 bg-white/20 rounded w-1/2" />
              <div className="h-1.5 rounded w-6" style={{ background: accent, opacity: 0.9 }} />
            </div>
            <div className="w-7 h-7 rounded-md bg-white/5 flex-shrink-0" />
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "vibrante",
    name: "Vibrante",
    description: "Cards com imagem a toda a largura e gradiente dramático.",
    preview: (accent: string) => (
      <div className="w-full h-full bg-[#FFFDF9] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-1.5 px-2 py-2 border-b border-[#EEEAE3]">
          <div className="w-4 h-4 rounded-md flex items-center justify-center text-[5px] font-bold text-white flex-shrink-0" style={{ background: accent }}>T</div>
          <div className="h-1.5 bg-[#111]/70 rounded w-10" />
        </div>
        {/* Category pills */}
        <div className="flex gap-1 px-2 py-1">
          <div className="px-1.5 py-0.5 rounded-full text-[5px] text-white" style={{ background: accent }}>Entradas</div>
          <div className="px-1.5 py-0.5 rounded-full text-[5px] bg-[#EEEAE3] text-[#666]">Pratos</div>
        </div>
        {/* Card */}
        <div className="mx-2 rounded-xl overflow-hidden bg-white border border-[#EEEAE3] shadow-sm">
          <div className="h-9 relative" style={{ background: `linear-gradient(to bottom, color-mix(in srgb, ${accent} 60%, #ccc), color-mix(in srgb, ${accent} 30%, black))` }}>
            <div className="absolute bottom-0 left-0 right-0 p-1">
              <div className="h-1.5 bg-white/80 rounded w-2/3" />
            </div>
          </div>
          <div className="px-1.5 py-1 flex items-center justify-between">
            <div className="h-1 bg-[#999]/40 rounded w-1/2" />
            <div className="h-1.5 rounded w-5" style={{ background: accent, opacity: 0.9 }} />
          </div>
        </div>
      </div>
    ),
  },
]

export default function DesignPage() {
  const [plan, setPlan] = useState<string>("free")
  const [restaurantId, setRestaurantId] = useState("")
  const [currentTheme, setCurrentTheme] = useState("modern")
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { restaurant } = await fetchActiveRestaurant(supabase, user.id, "id, plan, theme, accent_color")

      if (!restaurant) return
      setRestaurantId(restaurant.id)
      setPlan(restaurant.plan ?? "free")
      setCurrentTheme(restaurant.theme ?? "modern")
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    const applyTheme = searchParams.get("apply")
    if (applyTheme && restaurantId && !loading) {
      handleApply(applyTheme)
      router.replace("/dashboard/design")
    }
  }, [searchParams, restaurantId, loading])

  const handleApply = async (themeId: string) => {
    setApplying(themeId)
    const supabase = createClient()
    const { error } = await supabase
      .from("restaurants")
      .update({ theme: themeId })
      .eq("id", restaurantId)

    if (error) {
      toast.error("Erro ao aplicar design.")
    } else {
      setCurrentTheme(themeId)
      const name = THEMES.find((t) => t.id === themeId)?.name ?? themeId
      toast.success(`Design "${name}" aplicado!`)
    }
    setApplying(null)
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

  if (loading) {
    return (
      <DashboardShell>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white rounded-xl border border-[#E8E0D5] animate-pulse" />
          ))}
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="mb-8">
        <h1 className="font-dm-sans text-2xl font-bold text-[#1A1510]">Design</h1>
        <p className="font-dm-sans text-sm text-[#A89880] mt-1">Escolhe o visual do teu cardápio</p>
      </div>

      {plan !== "pro" ? (
        <div className="bg-white rounded-xl border border-[#E8E0D5] p-8 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center">
            <Crown className="w-7 h-7 text-amber-600" />
          </div>
          <div>
            <p className="font-dm-sans font-bold text-[#1A1510] text-lg">Funcionalidade Pro</p>
            <p className="font-dm-sans text-sm text-[#A89880] mt-1 max-w-xs">
              Escolhe entre designs exclusivos para o teu cardápio com o plano Pro.
            </p>
          </div>
          <button
            onClick={handleUpgrade}
            disabled={checkoutLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-dm-sans font-semibold transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            {checkoutLoading ? "A redirecionar..." : "Upgrade para Pro"}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E8E0D5] overflow-hidden">
          {THEMES.map((theme, idx) => {
            const isActive = currentTheme === theme.id
            const isApplying = applying === theme.id

            return (
              <div
                key={theme.id}
                className={`flex items-center gap-4 px-5 py-5 transition-colors ${idx !== 0 ? "border-t border-[#F2EFE9]" : ""} ${isActive ? "bg-[#FAF8F4]" : "hover:bg-[#FAF8F4]"}`}
              >
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-dm-sans font-semibold text-[#1A1510]">{theme.name}</p>
                  </div>
                  <p className="font-dm-sans text-sm text-[#A89880] leading-snug">{theme.description}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!isActive && (
                    <button
                      onClick={() => handleApply(theme.id)}
                      disabled={!!applying}
                      className="px-3 py-1.5 rounded-lg font-dm-sans text-sm font-semibold text-white transition-colors disabled:opacity-50 bg-[#C8622A] hover:bg-[#A84E1E]"
                    >
                      {isApplying ? "A aplicar..." : "Usar"}
                    </button>
                  )}
                  {isActive && (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                  )}
                  <Link
                    href={`/design/${theme.id}`}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A89880] hover:text-[#1A1510] hover:bg-[#F2EFE9] transition-colors"
                    title="Pré-visualizar"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </DashboardShell>
  )
}
