import { UtensilsCrossed, Phone, MapPin } from "lucide-react"
import type { Restaurant } from "@/lib/mock-data"
import Image from "next/image"

interface MenuHeaderProps {
  restaurant: Restaurant
}

export function MenuHeader({ restaurant }: MenuHeaderProps) {
  const iconClass = "w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-200"

  return (
    <header className="sticky top-0 z-40 bg-black/85 backdrop-blur-md border-b border-white/10">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {restaurant.logo_url ? (
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                <Image src={restaurant.logo_url} alt={restaurant.name} width={48} height={48} className="object-cover w-full h-full" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5" style={{ color: "var(--accent)" }} />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-playfair text-xl font-bold text-white leading-tight truncate">
              {restaurant.name}
            </h1>
            {restaurant.description && (
              <p className="font-lato text-sm text-white/55 mt-0.5 line-clamp-1">
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
              <a href={restaurant.google_maps_url} target="_blank" rel="noopener noreferrer" aria-label="Ver localização" className={iconClass}>
                <MapPin className="w-4 h-4 text-white" />
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
