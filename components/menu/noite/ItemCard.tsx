import Image from "next/image"
import { UtensilsCrossed } from "lucide-react"
import type { Item } from "@/lib/mock-data"
import { formatPrice } from "@/lib/utils"

export function ItemCard({ item }: { item: Item }) {
  const isSoldOut = !item.is_active

  return (
    <div
      className={`flex gap-4 p-4 rounded-2xl bg-[#161920] border border-white/5 ${
        isSoldOut ? "opacity-40" : "hover:border-white/10 transition-colors"
      }`}
    >
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
        <div>
          <p
            className={`font-dm-sans font-semibold text-[15px] leading-tight ${
              isSoldOut ? "line-through text-white/20" : "text-white"
            }`}
          >
            {item.name}
          </p>
          {item.description && (
            <p className="font-dm-sans text-xs text-white/35 mt-1 line-clamp-2 leading-snug">
              {item.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <p
            className="font-dm-sans font-bold text-sm"
            style={{ color: isSoldOut ? "rgba(255,255,255,0.15)" : "var(--accent)" }}
          >
            {formatPrice(item.price)}
          </p>
          {isSoldOut && (
            <span className="font-dm-sans text-[10px] font-semibold text-white/25 uppercase tracking-wider">
              Esgotado
            </span>
          )}
        </div>
      </div>
      {item.image_url ? (
        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className={`object-cover${isSoldOut ? " grayscale opacity-20" : ""}`}
          />
        </div>
      ) : (
        <div className="w-20 h-20 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
          <UtensilsCrossed className="w-7 h-7 text-white/10" />
        </div>
      )}
    </div>
  )
}
