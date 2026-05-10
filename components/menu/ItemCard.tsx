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

  return (
    <div
      className="item-card-animate relative flex items-stretch hover:-translate-y-0.5 transition-all duration-200 group"
      style={{ ["--index" as string]: index }}
    >
      {/* Metade esquerda: texto */}
      <div className="w-1/2 flex flex-col justify-center px-4 py-5 gap-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`font-playfair font-bold text-[15px] leading-snug md:text-[16px] ${
              isSoldOut ? "text-white/30" : "text-white"
            }`}
          >
            {item.name}
          </h3>
          {isSoldOut && (
            <span className="flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/40 font-lato font-semibold tracking-wide uppercase border border-white/10">
              Esgotado
            </span>
          )}
        </div>

        {item.description && (
          <p className="font-lato text-[12px] text-[#aaaaaa] line-clamp-2 leading-relaxed md:text-[13px]">
            {item.description}
          </p>
        )}

        <p
          className={`font-lato font-bold text-[14px] md:text-[15px] ${
            isSoldOut ? "text-white/30" : "text-[#C8622A]"
          }`}
        >
          {formatPrice(item.price)}
        </p>
      </div>

      {/* Metade direita: imagem com faixa laranja a sangrar para a direita */}
      <div className="w-1/2 flex items-center justify-center py-5">
        <div className="relative w-28 h-28 md:w-32 md:h-32">
          {/* Faixa laranja: da borda esquerda da imagem até à borda direita do ecrã, rounded à esquerda */}
          <div
            className="absolute -top-5 -bottom-5 left-0 bg-[#C8622A] rounded-l-full"
            style={{ right: "-100vw" }}
          />
          {/* Imagem circular */}
          <div className="relative z-10 w-full h-full rounded-full overflow-hidden bg-[#2a2a2a] ring-2 ring-white/20">
            {item.image_url ? (
              <div
                className={`w-full h-full transition-transform duration-300 group-hover:scale-105 ${
                  isSoldOut ? "opacity-40 grayscale" : ""
                }`}
              >
                <Image
                  src={item.image_url}
                  alt={item.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center ${
                  isSoldOut ? "opacity-40 grayscale" : ""
                }`}
              >
                <UtensilsCrossed className="w-8 h-8 text-white/20 md:w-9 md:h-9" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
