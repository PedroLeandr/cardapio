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
    <header className="sticky top-0 z-40 bg-[#F7F3EC]/95 backdrop-blur-md border-b border-[#D4C4A8]">
      <div className="max-w-2xl mx-auto px-5 py-4 flex flex-col items-center gap-1">
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-xs font-bold text-white"
          style={{ background: "var(--accent)" }}
        >
          {restaurant.logo_url ? (
            <Image src={restaurant.logo_url} alt={restaurant.name} width={40} height={40} className="object-cover" />
          ) : (
            initials
          )}
        </div>
        <p className="font-playfair italic font-bold text-[#1A1008] text-lg leading-tight text-center">
          {restaurant.name}
        </p>
        {restaurant.description && (
          <p className="font-lato text-[10px] text-[#8A7A6A] tracking-widest uppercase">
            {restaurant.description}
          </p>
        )}
      </div>
    </header>
  )
}
