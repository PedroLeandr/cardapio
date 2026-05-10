"use client"

import { useState, useRef, useEffect } from "react"
import { Languages } from "lucide-react"

const LANGUAGES = [
  { code: "", label: "Português (original)" },
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

function getOriginalUrl(): string {
  try {
    const url = new URL(window.location.href)
    const u = url.searchParams.get("u")
    return u ? decodeURIComponent(u) : window.location.href
  } catch {
    return window.location.href
  }
}

function getActiveLang(): string {
  try {
    const url = new URL(window.location.href)
    return url.searchParams.get("tl") ?? ""
  } catch {
    return ""
  }
}

export function TranslateButton() {
  const [open, setOpen] = useState(false)
  const [activeLang, setActiveLang] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setActiveLang(getActiveLang())
  }, [])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const handleSelect = (code: string) => {
    const original = getOriginalUrl()
    if (code === "") {
      window.location.href = original
    } else {
      window.location.href = `https://translate.google.com/translate?sl=auto&tl=${code}&u=${encodeURIComponent(original)}`
    }
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Traduzir página"
        className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${
          activeLang
            ? "bg-[#C8622A]/70 border-[#C8622A]"
            : open
            ? "bg-white/25 border-white/20"
            : "bg-white/10 border-white/20 hover:bg-white/20"
        }`}
      >
        <Languages className="w-5 h-5 text-white" />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] right-0 z-50 bg-[#1A1510]/90 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-44 animate-in fade-in slide-in-from-top-2 duration-150">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code || "original"}
              onClick={() => handleSelect(lang.code)}
              className={`w-full text-left px-4 py-2.5 font-lato text-sm transition-colors ${
                activeLang === lang.code
                  ? "bg-[#C8622A]/25 text-white"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
