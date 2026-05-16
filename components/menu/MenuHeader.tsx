import { MapPin, Phone } from "lucide-react"
import type { Restaurant } from "@/lib/mock-data"
import Image from "next/image"

interface MenuHeaderProps {
  restaurant: Restaurant
}

export function MenuHeader({ restaurant }: MenuHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-[0_1px_16px_rgba(0,0,0,0.05)] overflow-hidden relative">
      {/* Background texture */}
      <div
        className="absolute inset-0 bg-center bg-cover pointer-events-none"
        style={{
          backgroundImage: "url('/fundo-sem-fundo.png')",
          opacity: 0.06,
        }}
      />
      <div className="relative max-w-lg mx-auto px-5 py-4">
        <div className="flex items-center justify-between relative">
          {/* Left: profile logo */}
          <div className="flex-shrink-0">
            {restaurant.logo_url ? (
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100 shadow-sm">
                <Image
                  src={restaurant.logo_url}
                  alt={restaurant.name}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--accent) 12%, white)", outline: "2px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}>
                <span className="font-outfit font-bold text-sm leading-none" style={{ color: "var(--accent)" }}>
                  {restaurant.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Center: name — absolutely centered */}
          <div className="absolute inset-x-0 flex justify-center pointer-events-none">
            <span className="font-outfit font-semibold text-gray-900 text-[15px] truncate max-w-[50%]">
              {restaurant.name}
            </span>
          </div>

          {/* Right: maps + phone */}
          <div className="flex-shrink-0 flex items-center gap-1">
            {restaurant.google_maps_url && (
              <a
                href={restaurant.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver localização"
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <MapPin className="w-5 h-5 text-gray-500" />
              </a>
            )}
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                aria-label="Ligar"
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <Phone className="w-5 h-5 text-gray-500" />
              </a>
            )}
          </div>
        </div>
        </div>
    </header>
  )
}
