"use client"

import { useState, useMemo } from "react"
import { Search, X } from "lucide-react"
import Link from "next/link"
import { CategorySection } from "./CategorySection"
import { ItemCard } from "./ItemCard"
import { generateSlug } from "@/lib/utils"
import type { Category, Item } from "@/lib/mock-data"

type CategoryWithItems = Category & { items: Item[] }

interface MenuClientProps {
  categories: CategoryWithItems[]
  slug: string
  linkBase?: string
}

export function MenuClient({ categories, slug, linkBase }: MenuClientProps) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const trimmed = query.trim().toLowerCase()
  const isSearching = trimmed.length > 0

  const searchResults = useMemo(() => {
    if (!trimmed) return []
    return categories.flatMap((cat) =>
      cat.items
        .filter(
          (item) =>
            item.name.toLowerCase().includes(trimmed) ||
            item.description?.toLowerCase().includes(trimmed)
        )
        .map((item) => ({ item, categoryName: cat.name }))
    )
  }, [categories, trimmed])

  const displayedCategories = activeCategory
    ? categories.filter((c) => c.id === activeCategory)
    : categories

  return (
    <div className="flex-1 flex flex-col">
      {/* Sticky category pills */}
      {!isSearching && categories.length > 1 && (
        <div className="sticky top-14 z-30 bg-[#FFFDF9]/90 backdrop-blur-sm border-b border-[#EEEAE3]">
          <div className="max-w-2xl mx-auto px-5 py-2.5 flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className="flex-shrink-0 px-3.5 py-1.5 rounded-full font-dm-sans text-xs font-semibold transition-all"
                style={
                  activeCategory === cat.id
                    ? { background: "var(--accent)", color: "white" }
                    : { background: "#EEEAE3", color: "#666" }
                }
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto w-full px-5 pb-10">
        {/* Search */}
        <div className="mt-4 mb-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BBB] pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#EEEAE3] rounded-xl font-dm-sans text-sm text-[#111] placeholder:text-[#BBB] focus:outline-none focus:border-[#DDD] transition shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BBB]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        {isSearching ? (
          searchResults.length > 0 ? (
            <div>
              <p className="font-dm-sans text-xs text-[#999] mb-4">
                {searchResults.length} resultado{searchResults.length !== 1 ? "s" : ""} para &ldquo;
                {query.trim()}&rdquo;
              </p>
              {searchResults.map(({ item, categoryName }) => (
                <div key={item.id} className="mb-4">
                  <p className="font-dm-sans text-[10px] font-bold text-[#999] uppercase tracking-wider mb-2">
                    {categoryName}
                  </p>
                  <Link
                    href={`${linkBase ?? `/${slug}`}/${generateSlug(item.name)}`}
                    className="block"
                  >
                    <ItemCard item={item} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="font-dm-sans text-[#BBB] text-sm">
                Sem resultados para &ldquo;{query.trim()}&rdquo;
              </p>
            </div>
          )
        ) : categories.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-dm-sans text-[#BBB] text-base">Cardápio em preparação...</p>
          </div>
        ) : (
          <div>
            {displayedCategories.map((cat) => (
              <CategorySection key={cat.id} category={cat} slug={slug} linkBase={linkBase} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
