import { UtensilsCrossed } from "lucide-react"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import type { Item } from "@/lib/mock-data"

interface ItemCardProps {
  item: Item
  index: number
}

export function ItemCard({ item, index }: ItemCardProps) {
  const isSoldOut = !item.is_active
  const reversed = index % 2 !== 0

  const imageHalf = (
    <div className="w-1/2 flex items-center justify-center py-5">
      <div className="relative w-28 h-28">
        {reversed ? (
          <div className="absolute -top-5 -bottom-5 -left-5 rounded-l-full" style={{ right: "-100vw", background: "var(--accent)" }} />
        ) : (
          <div className="absolute -top-5 -bottom-5 -right-5 rounded-r-full" style={{ left: "-100vw", background: "var(--accent)" }} />
        )}
        <div className="relative z-10 w-full h-full rounded-full overflow-hidden bg-[#2a2a2a] ring-2 ring-white/20">
          {item.image_url ? (
            <Image src={item.image_url} alt={item.name} width={112} height={112} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UtensilsCrossed className="w-8 h-8 text-white/20" />
            </div>
          )}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
              <span className="text-white text-[10px] font-lato font-bold uppercase tracking-[0.15em] text-center leading-tight px-2">
                Esgotado
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const textHalf = (
    <div className="w-1/2 flex items-center justify-center py-5">
      <div className="relative w-full h-28">
        <div
          className="absolute -top-5 -bottom-5 bg-white/5"
          style={reversed ? {
            left: "-100vw",
            right: "-50%",
            maskImage: "radial-gradient(circle 92px at 100% 50%, transparent 92px, black 93px)",
            WebkitMaskImage: "radial-gradient(circle 92px at 100% 50%, transparent 92px, black 93px)",
          } : {
            left: "-50%",
            right: "-100vw",
            maskImage: "radial-gradient(circle 92px at 0px 50%, transparent 92px, black 93px)",
            WebkitMaskImage: "radial-gradient(circle 92px at 0px 50%, transparent 92px, black 93px)",
          }}
        />
        <div className={`relative z-10 h-full flex flex-col justify-center gap-0 ${reversed ? "pr-5 pl-4" : "pl-5 pr-4"}`}>
          <h3 className="font-playfair italic font-bold text-[18px] leading-tight line-clamp-1" style={{ color: isSoldOut ? "rgba(255,255,255,0.3)" : "var(--accent)" }}>
            {item.name}
          </h3>

          {item.description && (
            <p className="font-lato text-[11px] text-white/45 line-clamp-2 leading-relaxed mt-1">
              {item.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2">
            {isSoldOut && (
              <span className="flex-shrink-0 text-[9px] px-2 py-0.5 rounded-full bg-red-500/80 text-white font-lato font-bold tracking-widest uppercase">
                Esgotado
              </span>
            )}
            <div className={`h-px bg-white/15 ${isSoldOut ? "w-3" : "flex-1"}`} />
            <p className={`font-lato font-bold text-[13px] tracking-wide ${isSoldOut ? "line-through opacity-30 text-white" : ""}`} style={isSoldOut ? {} : { color: "var(--accent)" }}>
              {formatPrice(item.price)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="relative flex items-stretch hover:-translate-y-0.5 transition-all duration-200">
      {reversed ? <>{textHalf}{imageHalf}</> : <>{imageHalf}{textHalf}</>}
    </div>
  )
}
