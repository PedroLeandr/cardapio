"use client"

import { useState, useEffect } from "react"
import { SkeletonImage } from "./SkeletonImage"

interface ImageLightboxProps {
  src: string
  alt: string
  isSoldOut?: boolean
}

export function ImageLightbox({ src, alt, isSoldOut }: ImageLightboxProps) {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  function openLightbox() {
    setOpen(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
  }

  function closeLightbox() {
    setVisible(false)
    setTimeout(() => setOpen(false), 250)
  }

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <>
      <div className="relative w-full h-full cursor-zoom-in" onClick={openLightbox}>
        <SkeletonImage
          src={src}
          alt={alt}
          width={208}
          height={208}
          className={`w-full h-full object-cover ${isSoldOut ? "grayscale opacity-70" : ""}`}
        />
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 transition-all duration-250"
          style={{
            background: visible ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0)",
            backdropFilter: visible ? "blur(6px)" : "blur(0px)",
          }}
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl transition-all duration-250"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "scale(1)" : "scale(0.85)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <SkeletonImage
              src={src}
              alt={alt}
              fill
              className="object-cover"
            />
          </div>

          <button
            onClick={closeLightbox}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full bg-white text-gray-900 font-outfit font-semibold text-[15px] shadow-lg active:scale-95 transition-all duration-250"
            style={{ opacity: visible ? 1 : 0 }}
          >
            Fechar
          </button>
        </div>
      )}
    </>
  )
}
