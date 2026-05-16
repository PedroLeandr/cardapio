import Image from "next/image"
import type { Restaurant } from "@/lib/mock-data"

export function MenuHeader({ restaurant }: { restaurant: Restaurant }) {
  const initials = restaurant.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-40 bg-[#0D0F14]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-2xl mx-auto px-5 h-14 flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center text-[11px] font-bold text-white"
          style={{ background: "var(--accent)" }}
        >
          {restaurant.logo_url ? (
            <Image src={restaurant.logo_url} alt={restaurant.name} width={32} height={32} className="object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="min-w-0">
          <p className="font-dm-sans font-bold text-white text-sm leading-tight truncate">
            {restaurant.name}
          </p>
          {restaurant.description && (
            <p className="font-dm-sans text-[11px] text-white/35 leading-tight truncate">
              {restaurant.description}
            </p>
          )}
        </div>
      </div>
    </header>
  )
}
