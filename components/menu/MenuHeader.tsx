"use client"

import { useEffect, useState } from "react"
import { UtensilsCrossed } from "lucide-react"
import type { Restaurant } from "@/lib/mock-data"
import Image from "next/image"

interface MenuHeaderProps {
  restaurant: Restaurant
}

export function MenuHeader({ restaurant }: MenuHeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "bg-[#FAF8F4]/95 backdrop-blur-md shadow-[0_1px_0_0_#E8E0D5]" : "bg-[#FAF8F4]"}`}>
      <div className="max-w-3xl mx-auto px-6 py-5">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            {restaurant.logo_url ? (
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#E8E0D5] shadow-sm">
                <Image
                  src={restaurant.logo_url}
                  alt={restaurant.name}
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#F5E6DC] to-[#EDE0D3] border-2 border-[#E8D5C8] flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-[#C8622A]" />
              </div>
            )}
          </div>

          {/* Texto */}
          <div className="flex-1 min-w-0">
            <h1 className="font-playfair text-xl md:text-2xl font-bold text-[#1A1510] leading-tight truncate">
              {restaurant.name}
            </h1>
            {restaurant.description && (
              <p className="font-lato text-sm text-[#7A6A5A] mt-0.5 line-clamp-1 leading-relaxed">
                {restaurant.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
