import Image from "next/image"
import { UtensilsCrossed } from "lucide-react"
import type { Item } from "@/lib/mock-data"
import { formatPrice } from "@/lib/utils"

export function ItemCard({ item }: { item: Item }) {
  const isSoldOut = !item.is_active

  return (
    <div className={`rounded-2xl bg-white overflow-hidden border border-[#EEEAE3] shadow-sm ${isSoldOut ? "opacity-50" : ""}`}>
      {/* Image */}
      <div className="relative h-44 bg-[#F0EDE6]">
        {item.image_url ? (
          <>
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className={`object-cover${isSoldOut ? " grayscale" : ""}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          </>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "color-mix(in srgb, var(--accent) 8%, #F0EDE6)" }}
          >
            <UtensilsCrossed
              className="w-10 h-10"
              style={{ color: "color-mix(in srgb, var(--accent) 35%, #CCC)" }}
            />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p
            className={`font-dm-sans font-bold text-[15px] leading-tight ${
              item.image_url ? "text-white" : "text-[#111]"
            } ${isSoldOut ? "line-through opacity-60" : ""}`}
          >
            {item.name}
          </p>
        </div>
        {isSoldOut && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm">
            <span className="font-dm-sans text-[10px] font-bold text-white uppercase tracking-wider">
              Esgotado
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-4 py-3 flex items-start justify-between gap-2">
        {item.description ? (
          <p className="font-dm-sans text-xs text-[#999] line-clamp-2 leading-snug flex-1">
            {item.description}
          </p>
        ) : (
          <div className="flex-1" />
        )}
        <p
          className="font-dm-sans font-bold text-sm flex-shrink-0"
          style={{ color: isSoldOut ? "#ccc" : "var(--accent)" }}
        >
          {formatPrice(item.price)}
        </p>
      </div>
    </div>
  )
}
