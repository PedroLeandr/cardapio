"use client"

import { useState } from "react"
import { Sparkles, Lock } from "lucide-react"
import toast from "react-hot-toast"

interface UpgradeBannerProps {
  type: "categories" | "items"
  current: number
  limit: number
}

const config = {
  categories: { label: "categorias" },
  items: { label: "itens" },
}

export function UpgradeBanner({ type, current, limit }: UpgradeBannerProps) {
  const [loading, setLoading] = useState(false)
  const { label } = config[type]

  if (current < limit) return null

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error("Erro ao iniciar checkout.")
      }
    } catch {
      toast.error("Erro ao iniciar checkout.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 flex items-start gap-4 mb-6">
      <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Lock className="w-4 h-4 text-amber-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-dm-sans font-semibold text-sm text-amber-900">
          Limite do plano gratuito atingido
        </p>
        <p className="font-dm-sans text-xs text-amber-700 mt-0.5">
          Estás a usar {current}/{limit} {label}. Faz upgrade para Pro e adiciona ilimitados.
        </p>
      </div>
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-xs font-dm-sans font-semibold transition-colors flex-shrink-0"
      >
        <Sparkles className="w-3.5 h-3.5" />
        {loading ? "A redirecionar..." : "Upgrade Pro"}
      </button>
    </div>
  )
}
