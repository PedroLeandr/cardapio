import { UtensilsCrossed, ChevronRight } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { SkeletonImage } from "./SkeletonImage"
import type { Item } from "@/lib/mock-data"

interface ItemCardProps {
  item: Item
  index: number
}

export function ItemCard({ item }: ItemCardProps) {
  const isSoldOut = !item.is_active

  return (
    <div className="relative w-72 flex-shrink-0">
      {/* Floating circular image */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10 w-40 h-40 rounded-full overflow-hidden ring-[3px] ring-white shadow-[0_8px_28px_rgba(0,0,0,0.22)] bg-white">
        {item.image_url ? (
          <SkeletonImage
            src={item.image_url}
            alt={item.name}
            width={160}
            height={160}
            className={`w-full h-full object-cover ${isSoldOut ? "grayscale opacity-60" : ""}`}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.18)" }}
          >
            <UtensilsCrossed className={`w-9 h-9 ${isSoldOut ? "text-white/30" : "text-white/70"}`} />
          </div>
        )}
        {/* Sold-out overlay on image */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="font-outfit font-bold text-white text-[11px] uppercase tracking-widest text-center px-2 leading-tight drop-shadow">
              Esgotado
            </span>
          </div>
        )}
      </div>

      {/* Card */}
      <div
        className={`rounded-[28px] min-h-[380px] flex flex-col overflow-hidden relative ${
          isSoldOut
            ? "shadow-[0_6px_28px_rgba(0,0,0,0.1)]"
            : "shadow-[0_6px_28px_rgba(0,0,0,0.13)]"
        }`}
        style={{
          background: isSoldOut
            ? "linear-gradient(155deg, #9A6040 0%, #3D2010 100%)"
            : "linear-gradient(155deg, #D4703A 0%, #6B2A0A 100%)",
        }}
      >
        {/* Background texture */}
        <div
          className="absolute inset-0 bg-center bg-cover pointer-events-none"
          style={{
            backgroundImage: "url('/fundo-sem-fundo.png')",
            opacity: 0.20,
            filter: "brightness(0) invert(1)",
          }}
        />

        <div className="relative pt-32 px-5 pb-6 flex flex-col flex-1">
          {/* Name */}
          <h3 className={`font-outfit font-bold text-[21px] leading-snug line-clamp-1 ${isSoldOut ? "text-white/60" : "text-white"}`}>
            {item.name}
          </h3>

          {/* Description — flex-1 spacer always present */}
          <div className="flex-1 mt-3">
            {item.description && (
              <p className={`font-outfit text-[14px] leading-relaxed line-clamp-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] ${isSoldOut ? "text-white/45" : "text-white/85"}`}>
                {item.description}
              </p>
            )}
          </div>

          {/* Status badge — centered, always at bottom */}
          <div className="mt-4 flex justify-center">
            <span
              className={`inline-block font-outfit font-semibold text-[13px] px-4 py-1.5 rounded-full ${
                isSoldOut
                  ? "bg-white/15 text-white/50 border border-white/20"
                  : "bg-white/20 text-white/90"
              }`}
            >
              {isSoldOut ? "Esgotado" : "Disponível"}
            </span>
          </div>

          {/* Bottom row: price + action — always at bottom */}
          <div className="mt-4 flex items-end justify-between">
            <p
              className={`font-outfit font-bold text-[21px] ${
                isSoldOut ? "text-white/40 line-through" : "text-white"
              }`}
            >
              {formatPrice(item.price)}
            </p>

            {/* Action button with "!" */}
            <button
              aria-label="Ver detalhes"
              className={`w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.18)] hover:scale-105 active:scale-95 transition-transform ${isSoldOut ? "opacity-40" : ""}`}
            >
              <ChevronRight className="w-5 h-5 text-[#C8622A]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
