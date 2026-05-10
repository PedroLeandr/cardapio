"use client"

import { useState, useRef, useEffect } from "react"
import { Phone, MapPin, Languages } from "lucide-react"
import type { Restaurant } from "@/lib/mock-data"

const LANGUAGES = [
  { code: "pt", label: "Português" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "nl", label: "Nederlands" },
  { code: "zh-CN", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ar", label: "العربية" },
]

interface RestaurantActionsProps {
  restaurant: Restaurant
}

export function RestaurantActions({ restaurant }: RestaurantActionsProps) {
  const [translateOpen, setTranslateOpen] = useState(false)
  const translateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!translateOpen) return
    const handler = (e: MouseEvent) => {
      if (!translateRef.current?.contains(e.target as Node)) {
        setTranslateOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [translateOpen])

  const btnClass =
    "flex flex-col items-center gap-2 group outline-none"
  const iconClass =
    "w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center transition-all duration-200 group-hover:bg-white/20 group-hover:scale-105 group-active:scale-95"
  const labelClass =
    "font-lato text-[11px] text-white/60 group-hover:text-white/90 transition-colors"

  return (
    <div className="flex items-start justify-center gap-8 py-5">
      {restaurant.phone && (
        <a href={`tel:${restaurant.phone}`} className={btnClass}>
          <div className={iconClass}>
            <Phone className="w-5 h-5 text-white" />
          </div>
          <span className={labelClass}>Ligar</span>
        </a>
      )}

      {restaurant.google_maps_url && (
        <a
          href={restaurant.google_maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
        >
          <div className={iconClass}>
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className={labelClass}>Localização</span>
        </a>
      )}

      <div ref={translateRef} className="relative flex flex-col items-center">
        <button
          onClick={() => setTranslateOpen((v) => !v)}
          className={btnClass}
        >
          <div
            className={`${iconClass} ${
              translateOpen ? "bg-white/25 scale-105" : ""
            }`}
          >
            <Languages className="w-5 h-5 text-white" />
          </div>
          <span className={labelClass}>Traduzir</span>
        </button>

        {translateOpen && (
          <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 z-50 bg-[#1A1510]/90 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-40 animate-in fade-in slide-in-from-top-2 duration-150">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setTranslateOpen(false)}
                className="w-full text-left px-4 py-2.5 font-lato text-sm text-white/75 hover:bg-white/10 hover:text-white transition-colors"
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
