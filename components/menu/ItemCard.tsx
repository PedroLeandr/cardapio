import { UtensilsCrossed, ChevronRight } from "lucide-react"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import type { Item } from "@/lib/mock-data"

interface ItemCardProps {
  item: Item
  index: number
}

export function ItemCard({ item, index }: ItemCardProps) {
  const isSoldOut = !item.is_active

  return (
    <div
      className="item-card-animate relative flex gap-4 p-4 bg-white rounded-2xl border border-[#E8E0D5] hover:border-[#D4C4B4] hover:shadow-[0_4px_20px_rgba(26,21,16,0.07)] hover:-translate-y-px transition-all duration-200 group"
      style={{ ["--index" as string]: index }}
    >
      {/* Imagem */}
      <div className="flex-shrink-0 w-[88px] h-[88px] rounded-xl overflow-hidden bg-[#F2EFE9]">
        {item.image_url ? (
          <div className={`w-full h-full transition-transform duration-300 group-hover:scale-[1.04] ${isSoldOut ? "opacity-40 grayscale" : ""}`}>
            <Image
              src={item.image_url}
              alt={item.name}
              width={88}
              height={88}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F5E6DC] to-[#EDE5DA] ${isSoldOut ? "opacity-40 grayscale" : ""}`}>
            <UtensilsCrossed className="w-7 h-7 text-[#C8A882]" />
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`font-playfair font-semibold text-[15px] leading-snug ${isSoldOut ? "text-[#A89880]" : "text-[#1A1510]"}`}>
              {item.name}
            </h3>
            {isSoldOut && (
              <span className="flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-[#F5F0EB] text-[#A89880] font-lato font-semibold tracking-wide uppercase border border-[#EAE0D5]">
                Esgotado
              </span>
            )}
          </div>
          {item.description && (
            <p className="font-lato text-[13px] text-[#7A6A5A] line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
        <p className={`font-lato font-bold text-[15px] mt-2 ${isSoldOut ? "text-[#A89880]" : "text-[#C8622A]"}`}>
          {formatPrice(item.price)}
        </p>
      </div>

      {/* Seta de navegação */}
      <div className="flex-shrink-0 flex items-center self-center">
        <ChevronRight className="w-4 h-4 text-[#D4C4B4] group-hover:text-[#C8622A] group-hover:translate-x-0.5 transition-all duration-200" />
      </div>
    </div>
  )
}
