"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { generateSlug } from "@/lib/utils"
import { ItemCard } from "./ItemCard"
import type { Item } from "@/lib/mock-data"

// Pixels de scroll para avançar um card
const SCROLL_PER_CARD = 150

interface CardCarouselProps {
  items: Item[]
  slug: string
}

export function CardCarousel({ items, slug }: CardCarouselProps) {
  const [index, setIndex] = useState(0)
  const outerRef = useRef<HTMLDivElement>(null)
  const count = items.length

  useEffect(() => {
    if (count <= 1) return

    const handleScroll = () => {
      const outer = outerRef.current
      if (!outer) return
      const headerH = window.innerWidth >= 768 ? 152 : 140
      const rect = outer.getBoundingClientRect()
      const scrolledIn = headerH - rect.top
      const next = Math.min(count - 1, Math.max(0, Math.floor(scrolledIn / SCROLL_PER_CARD)))
      setIndex(next)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [count])

  if (count === 1) {
    return (
      <Link href={`/${slug}/${generateSlug(items[0].name)}`} className="block">
        <ItemCard item={items[0]} index={0} />
      </Link>
    )
  }

  // paddingBottom = espaço virtual de scroll para percorrer os cards.
  // O sticky desbloqueia automaticamente quando este espaço se esgota.
  const extraHeight = (count - 1) * SCROLL_PER_CARD

  // Tradução em % do track:
  //   track tem largura = count * 100% do container
  //   mover 1 card = mover (1/count)*100% do track = 100% do container  ✓
  const translatePct = -(index / count) * 100

  return (
    <div ref={outerRef} style={{ paddingBottom: `${extraHeight}px` }}>
      <div className="sticky top-[140px] md:top-[152px]">

        {/* Janela visível — esconde os cards fora do ecrã */}
        <div className="overflow-hidden">
          <div
            className="flex"
            style={{
              width: `${count * 100}%`,
              transform: `translateX(${translatePct}%)`,
              transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
              willChange: "transform",
            }}
          >
            {items.map((item, idx) => (
              <div key={item.id} style={{ width: `${100 / count}%`, flexShrink: 0 }}>
                <Link href={`/${slug}/${generateSlug(item.name)}`} className="block">
                  <ItemCard item={item} index={idx} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {items.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-5 bg-[#C8622A]" : "w-1.5 bg-white/35"
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
