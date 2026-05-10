"use client"

import { useEffect, useRef } from "react"
import { LayoutGrid } from "lucide-react"
import { getCategoryIcon } from "@/lib/category-icons"
import type { Category } from "@/lib/mock-data"

interface CategoryNavProps {
  categories: Category[]
  activeCategory: string
  onCategoryChange: (id: string) => void
}

export function CategoryNav({ categories, activeCategory, onCategoryChange }: CategoryNavProps) {
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const activeEl = navRef.current?.querySelector(`[data-id="${activeCategory}"]`) as HTMLElement
    if (activeEl && navRef.current) {
      const nav = navRef.current
      nav.scrollTo({
        left: activeEl.offsetLeft - nav.offsetWidth / 2 + activeEl.offsetWidth / 2,
        behavior: "smooth",
      })
    }
  }, [activeCategory])

  const btnBase =
    "flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-lato font-medium transition-all duration-200 whitespace-nowrap active:scale-95"
  const btnActive =
    "bg-[#C8622A] text-white shadow-[0_0_18px_rgba(200,98,42,0.55)] scale-[1.03]"
  const btnInactive =
    "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white hover:scale-[1.03]"

  return (
    <div className="fixed top-[88px] inset-x-0 z-30 bg-black/80 md:top-[96px]">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <div
          ref={navRef}
          className="flex gap-2 py-2.5 overflow-x-auto scrollbar-hide scroll-smooth md:py-3"
          style={{ scrollSnapType: "x mandatory" }}
        >
          <button
            data-id="all"
            onClick={() => onCategoryChange("all")}
            style={{ scrollSnapAlign: "start" }}
            className={`${btnBase} ${activeCategory === "all" ? btnActive : btnInactive}`}
          >
            <LayoutGrid className="w-3.5 h-3.5 flex-shrink-0" />
            Todos
          </button>

          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.name)
            return (
              <button
                key={cat.id}
                data-id={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                style={{ scrollSnapAlign: "start" }}
                className={`${btnBase} ${activeCategory === cat.id ? btnActive : btnInactive}`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                {cat.name}
              </button>
            )
          })}

          <span className="flex-shrink-0 w-1" />
        </div>
      </div>
    </div>
  )
}
