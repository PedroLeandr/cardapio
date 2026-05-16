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
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-[#EEEAE3]">
      <div className="max-w-2xl mx-auto px-5 h-14 flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center text-[11px] font-bold text-white"
          style={{ background: "var(--accent)" }}
        >
          {restaurant.logo_url ? (
            <Image src={restaurant.logo_url} alt={restaurant.name} width={36} height={36} className="object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-dm-sans font-bold text-[#111] text-sm leading-tight truncate">
            {restaurant.name}
          </p>
          {restaurant.description && (
            <p className="font-dm-sans text-[11px] text-[#999] leading-tight truncate">
              {restaurant.description}
            </p>
          )}
        </div>
      </div>
    </header>
  )
}
