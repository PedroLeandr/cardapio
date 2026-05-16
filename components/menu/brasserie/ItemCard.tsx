import Image from "next/image"
import { UtensilsCrossed } from "lucide-react"
import type { Item } from "@/lib/mock-data"
import { formatPrice } from "@/lib/utils"

export function ItemCard({ item }: { item: Item }) {
  const isSoldOut = !item.is_active

  return (
    <div className={`flex gap-4 p-4 rounded-2xl bg-[#EDE8DE] ${isSoldOut ? "opacity-50" : "hover:bg-[#E8E2D6] transition-colors"}`}>
      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#D8D0C0]">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className={`object-cover${isSoldOut ? " grayscale" : ""}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UtensilsCrossed className="w-7 h-7 text-[#B8A890]" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p className={`font-playfair italic font-bold text-[17px] text-[#1A1008] leading-tight ${isSoldOut ? "line-through opacity-40" : ""}`}>
            {item.name}
          </p>
          {item.description && (
            <p className="font-lato text-xs text-[#8A7A6A] mt-1 line-clamp-2 leading-snug">
              {item.description}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <p
            className="font-playfair font-bold text-base"
            style={{ color: isSoldOut ? "#B8A890" : "var(--accent)" }}
          >
            {formatPrice(item.price)}
          </p>
          {isSoldOut && (
            <span className="font-lato text-[10px] font-bold text-[#B8A890] uppercase tracking-wider">
              Esgotado
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
