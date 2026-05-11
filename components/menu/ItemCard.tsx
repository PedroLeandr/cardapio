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
      <div className="relative w-28 h-28 md:w-32 md:h-32">
        {reversed ? (
          <div
            className="absolute -top-5 -bottom-5 -left-5 bg-[#C8622A] rounded-l-full"
            style={{ right: "-100vw" }}
          />
        ) : (
          <div
            className="absolute -top-5 -bottom-5 -right-5 bg-[#C8622A] rounded-r-full"
            style={{ left: "-100vw" }}
          />
        )}
        <div className="relative z-10 w-full h-full rounded-full overflow-hidden bg-[#2a2a2a] ring-2 ring-white/20">
          {item.image_url ? (
            <div className={`w-full h-full ${isSoldOut ? "opacity-40 grayscale" : ""}`}>
              <Image
                src={item.image_url}
                alt={item.name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${isSoldOut ? "opacity-40 grayscale" : ""}`}>
              <UtensilsCrossed className="w-8 h-8 text-white/20 md:w-9 md:h-9" />
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const textHalf = (
    <div className="w-1/2 flex items-center justify-center py-5">
      <div className="relative w-full h-28 md:h-32">
        <div
          className="absolute -top-5 -bottom-5 bg-white"
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
          <div className="flex items-center gap-2">
            <h3 className={`font-cormorant italic font-bold text-[18px] leading-tight line-clamp-1 md:text-[20px] ${isSoldOut ? "text-black/25" : "text-[#C8622A]"}`}>
              {item.name}
            </h3>
            {isSoldOut && (
              <span className="flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded-full bg-black/8 text-black/30 font-outfit font-medium tracking-wide uppercase border border-black/10">
                Esgotado
              </span>
            )}
          </div>

          {item.description && (
            <p className="font-outfit text-[11px] text-black/50 line-clamp-2 leading-relaxed mt-1 md:text-[12px]">
              {item.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <div className="h-px flex-1 bg-[#C8622A]/20" />
            <p className={`font-outfit font-bold text-[13px] tracking-wide md:text-[14px] ${isSoldOut ? "text-black/25" : "text-[#C8622A]"}`}>
              {formatPrice(item.price)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div
      className="item-card-animate relative flex items-stretch hover:-translate-y-0.5 transition-all duration-200 group"
      style={{ ["--index" as string]: index }}
    >
      {reversed ? (
        <>
          {textHalf}
          {imageHalf}
        </>
      ) : (
        <>
          {imageHalf}
          {textHalf}
        </>
      )}
    </div>
  )
}
