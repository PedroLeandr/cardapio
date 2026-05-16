"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import Link from "next/link"
import { CategorySection } from "./CategorySection"
import { ItemCard } from "./ItemCard"
import { generateSlug } from "@/lib/utils"
import { getCategoryIcon } from "@/lib/category-icons"
import type { Category, Item } from "@/lib/mock-data"

type CategoryWithItems = Category & { items: Item[] }

interface MenuClientProps {
  categories: CategoryWithItems[]
  slug: string
  linkBase?: string
}

export function MenuClient({ categories, slug, linkBase }: MenuClientProps) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0]?.id ?? "all"
  )

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
    <div className="bg-white">
      {/* Search bar */}
      <div className="px-5 pt-6 pb-4">
        <div className="relative flex items-center bg-[#F3F3F3] rounded-full h-[52px] shadow-[0_1px_6px_rgba(0,0,0,0.05)]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar..."
            className="flex-1 pl-5 pr-2 bg-transparent font-outfit text-[15px] text-gray-700 placeholder:text-gray-400 focus:outline-none"
          />
          <div className="mr-1.5 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--accent)", boxShadow: "0 3px 10px color-mix(in srgb, var(--accent) 45%, transparent)" }}>
            <Search className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Categories section */}
      {categories.length > 0 && !isSearching && (
        <div className="pt-2 pb-1">
          <h2 className="font-outfit font-bold text-gray-900 text-[17px] px-5 mb-3">
            Categorias
          </h2>
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide px-5 pb-1">
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.name)
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-outfit font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "text-white"
                      : "bg-[#F0F0F0] text-gray-500 hover:bg-gray-200"
                  }`}
                  style={isActive ? { background: "var(--accent)" } : {}}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {cat.name}
                </button>
              )
            })}

            <span className="flex-shrink-0 w-2" />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="pb-0 pt-4">
        {isSearching ? (
          searchResults.length > 0 ? (
            <div className="px-5 space-y-3">
              <p className="font-outfit text-xs text-gray-400">
                {searchResults.length}{" "}
                {searchResults.length === 1 ? "resultado" : "resultados"} para &ldquo;{query.trim()}&rdquo;
              </p>
              <div
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth"
                style={{
                  paddingTop: "48px",
                  paddingLeft: "calc(50% - 9rem)",
                  paddingRight: "calc(50% - 9rem)",
                }}
              >
                {searchResults.map(({ item }, idx) => (
                  <Link
                    key={item.id}
                    href={`${linkBase ?? `/${slug}`}/${generateSlug(item.name)}`}
                    className="block flex-shrink-0 snap-center snap-always"
                  >
                    <ItemCard item={item} index={idx} />
                  </Link>
                ))}
                <span className="flex-shrink-0 w-2" />
              </div>
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="font-outfit text-lg text-gray-400">Sem resultados</p>
              <p className="font-outfit text-sm text-gray-400 mt-1">
                Tenta outro termo de pesquisa.
              </p>
            </div>
          )
        ) : categories.length === 0 ? (
          <div className="py-20 text-center px-5">
            <p className="font-outfit text-lg text-gray-400">Cardápio em preparação...</p>
            <p className="font-outfit text-sm text-gray-400 mt-1">
              Volta em breve para ver os nossos pratos.
            </p>
          </div>
        ) : (
          <div key={activeCategory} className="space-y-10">
            {displayedCategories.map((cat) => (
              <CategorySection key={cat.id} category={cat} slug={slug} linkBase={linkBase} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
