"use client"

import { useEffect, useRef, useState } from "react"
import type { Category } from "@/lib/mock-data"

interface CategoryNavProps {
  categories: Category[]
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const [activeId, setActiveId] = useState<string>(categories[0]?.id ?? "")
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    categories.forEach((cat) => {
      const el = document.getElementById(`section-${cat.id}`)
      if (!el) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(cat.id)
            }
          })
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [categories])

  const scrollToSection = (catId: string) => {
    const el = document.getElementById(`section-${catId}`)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setActiveId(catId)
  }

  useEffect(() => {
    const activeEl = navRef.current?.querySelector(`[data-id="${activeId}"]`) as HTMLElement
    if (activeEl && navRef.current) {
      const nav = navRef.current
      const elLeft = activeEl.offsetLeft
      const elWidth = activeEl.offsetWidth
      const navWidth = nav.offsetWidth
      nav.scrollTo({
        left: elLeft - navWidth / 2 + elWidth / 2,
        behavior: "smooth",
      })
    }
  }, [activeId])

  return (
    <div className="sticky top-[104px] z-30 bg-[#FAF8F4] border-b border-[#E8E0D5]">
      <div
        ref={navRef}
        className="flex gap-2 px-6 py-3 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            data-id={cat.id}
            onClick={() => scrollToSection(cat.id)}
            style={{ scrollSnapAlign: "start" }}
            className={`
              flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-lato font-medium transition-all duration-200 whitespace-nowrap
              ${
                activeId === cat.id
                  ? "bg-[#C8622A] text-white shadow-sm"
                  : "bg-[#F2EFE9] text-[#6B5E4E] hover:bg-[#E8DDD0]"
              }
            `}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
