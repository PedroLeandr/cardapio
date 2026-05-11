"use client"

import { useEffect, useState } from "react"
import { UtensilsCrossed } from "lucide-react"

export function PageLoader() {
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const hide = () => {
      setFading(true)
      setTimeout(() => setGone(true), 600)
    }

    if (document.readyState === "complete") {
      hide()
    } else {
      window.addEventListener("load", hide)
      return () => window.removeEventListener("load", hide)
    }
  }, [])

  if (gone) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#C8622A] flex flex-col items-center justify-center gap-6 transition-opacity duration-600 ${fading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
          <UtensilsCrossed className="w-8 h-8 text-white" />
        </div>
        <span className="font-dm-sans font-semibold text-white text-base tracking-tight">
          Cardápios Digitais
        </span>
      </div>

      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    </div>
  )
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#C8622A] flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
          <UtensilsCrossed className="w-8 h-8 text-white" />
        </div>
        <span className="font-dm-sans font-semibold text-white text-base tracking-tight">
          Cardápios Digitais
        </span>
      </div>

      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    </div>
  )
}
