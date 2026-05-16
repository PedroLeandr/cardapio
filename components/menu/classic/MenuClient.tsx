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
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id ?? "all")

  const trimmed = query.trim().toLowerCase()
  const isSearching = trimmed.length > 0

  const searchResults = useMemo(() => {
    if (!trimmed) return []
    return categories.flatMap((cat) =>
      cat.items
        .filter((item) =>
          item.name.toLowerCase().includes(trimmed) ||
          item.description?.toLowerCase().includes(trimmed)
        )
        .map((item) => ({ item, categoryName: cat.name }))
    )
  }, [categories, trimmed])

  const displayedCategories = activeCategory === "all"
    ? categories
    : categories.filter((c) => c.id === activeCategory)

  return (
    <div className="flex-1 flex flex-col">
      {/* Category pills */}
      {categories.length > 0 && !isSearching && (
        <div className="sticky top-[73px] z-30 bg-black/70 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-3xl mx-auto px-4 py-2.5 flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex-shrink-0 px-3.5 py-1.5 rounded-full font-lato text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap"
                style={activeCategory === cat.id
                  ? { background: "var(--accent)", color: "white" }
                  : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }
                }
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-5 pb-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar no cardápio..."
            className="w-full pl-10 pr-10 py-2.5 bg-white/10 border border-white/20 rounded-xl font-lato text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto w-full px-4 py-6 space-y-10 flex-1">
        {isSearching ? (
          searchResults.length > 0 ? (
            <div className="space-y-3">
              <p className="font-lato text-xs text-white/40">
                {searchResults.length} {searchResults.length === 1 ? "resultado" : "resultados"} para &ldquo;{query.trim()}&rdquo;
              </p>
              {searchResults.map(({ item, categoryName }, idx) => (
                <div key={item.id}>
                  <p className="font-lato text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">{categoryName}</p>
                  <Link href={`${linkBase ?? `/${slug}`}/${generateSlug(item.name)}`} className="block">
                    <ItemCard item={item} index={idx} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="font-playfair text-xl text-white/50">Sem resultados</p>
              <p className="font-lato text-sm text-white/35 mt-2">Tenta outro termo de pesquisa.</p>
            </div>
          )
        ) : categories.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-playfair text-xl text-white/50">Cardápio em preparação...</p>
            <p className="font-lato text-sm text-white/35 mt-2">Volta em breve para ver os nossos pratos.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {displayedCategories.map((cat) => (
              <CategorySection key={cat.id} category={cat} slug={slug} linkBase={linkBase} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
