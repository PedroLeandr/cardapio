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
    <div className="max-w-2xl mx-auto px-5 pb-10">
      {/* Search */}
      <div className="mt-4 mb-5 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar no cardápio..."
          className="w-full pl-10 pr-9 py-2.5 bg-white/5 border border-white/10 rounded-xl font-dm-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category pills */}
      {!isSearching && categories.length > 1 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className="px-3.5 py-1.5 rounded-full font-dm-sans text-xs font-semibold transition-all"
              style={
                activeCategory === cat.id
                  ? { background: "var(--accent)", color: "white" }
                  : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)" }
              }
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {isSearching ? (
        searchResults.length > 0 ? (
          <div>
            <p className="font-dm-sans text-xs text-white/25 mb-4">
              {searchResults.length} resultado{searchResults.length !== 1 ? "s" : ""} para &ldquo;
              {query.trim()}&rdquo;
            </p>
            {searchResults.map(({ item, categoryName }) => (
              <div key={item.id} className="mb-3">
                <p className="font-dm-sans text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">
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
            <p className="font-dm-sans text-white/25 text-sm">
              Sem resultados para &ldquo;{query.trim()}&rdquo;
            </p>
          </div>
        )
      ) : categories.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-dm-sans text-white/30 text-base">Cardápio em preparação...</p>
        </div>
      ) : (
        <div>
          {displayedCategories.map((cat) => (
            <CategorySection key={cat.id} category={cat} slug={slug} linkBase={linkBase} />
          ))}
        </div>
      )}
    </div>
  )
}
