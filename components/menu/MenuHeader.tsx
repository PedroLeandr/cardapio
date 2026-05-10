import { UtensilsCrossed, Phone, MapPin } from "lucide-react"
import type { Restaurant } from "@/lib/mock-data"
import Image from "next/image"

interface MenuHeaderProps {
  restaurant: Restaurant
}

export function MenuHeader({ restaurant }: MenuHeaderProps) {
  const iconClass =
    "w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-200 hover:scale-105 active:scale-95"

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-black/80">
      <div className="max-w-3xl mx-auto px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {restaurant.logo_url ? (
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <Image
                  src={restaurant.logo_url}
                  alt={restaurant.name}
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.4)]">
                <UtensilsCrossed className="w-6 h-6 text-[#C8622A]" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-playfair text-xl md:text-2xl font-bold text-white leading-tight truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
              {restaurant.name}
            </h1>
            {restaurant.description && (
              <p className="font-lato text-sm text-white/65 mt-0.5 line-clamp-1 leading-relaxed">
                {restaurant.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {restaurant.phone && (
              <a href={`tel:${restaurant.phone}`} aria-label="Ligar" className={iconClass}>
                <Phone className="w-4 h-4 text-white" />
              </a>
            )}
            {restaurant.google_maps_url && (
              <a
                href={restaurant.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver localização"
                className={iconClass}
              >
                <MapPin className="w-4 h-4 text-white" />
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
