"use client"

import { useState, useMemo } from "react"
import { Search, X } from "lucide-react"
import Link from "next/link"
import { CategoryNav } from "./CategoryNav"
import { CategorySection } from "./CategorySection"
import { ItemCard } from "./ItemCard"
import { generateSlug } from "@/lib/utils"
import type { Category, Item } from "@/lib/mock-data"

type CategoryWithItems = Category & { items: Item[] }

interface MenuClientProps {
  categories: CategoryWithItems[]
  slug: string
}

export function MenuClient({ categories, slug }: MenuClientProps) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("all")

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

  const displayedCategories =
    activeCategory === "all"
      ? categories
      : categories.filter((c) => c.id === activeCategory)

  return (
    <>
      {categories.length > 0 && (
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      )}

      {/* Espaçador para compensar header + nav fixos */}
      <div className="h-[140px] md:h-[152px]" />

      <div className="max-w-3xl mx-auto px-4 pt-4 pb-1 md:px-6">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar no cardápio..."
            className="w-full pl-10 pr-10 py-2.5 bg-white/10 border border-white/20 rounded-xl font-lato text-sm text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-[#C8622A]/50 focus-visible:border-[#C8622A]/60"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Limpar pesquisa"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-10 md:px-6 md:py-8 md:space-y-14">
        {isSearching ? (
          searchResults.length > 0 ? (
            <div className="space-y-3 fade-in">
              <p className="font-lato text-xs text-white/50">
                {searchResults.length}{" "}
                {searchResults.length === 1 ? "resultado" : "resultados"} para &ldquo;{query.trim()}&rdquo;
              </p>
              {searchResults.map(({ item, categoryName }, idx) => (
                <div key={item.id}>
                  <p className="font-lato text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                    {categoryName}
                  </p>
                  <Link href={`/${slug}/${generateSlug(item.name)}`} className="block">
                    <ItemCard item={item} index={idx} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center fade-in">
              <p className="font-playfair text-xl text-white/70">Sem resultados</p>
              <p className="font-lato text-sm text-white/50 mt-2">
                Tenta outro termo de pesquisa.
              </p>
            </div>
          )
        ) : categories.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-playfair text-xl text-white/70">Cardápio em preparação...</p>
            <p className="font-lato text-sm text-white/50 mt-2">
              Volta em breve para ver os nossos pratos.
            </p>
          </div>
        ) : (
          <div key={activeCategory} className="space-y-10 filter-fade-in md:space-y-14">
            {displayedCategories.map((cat) => (
              <CategorySection key={cat.id} category={cat} slug={slug} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
