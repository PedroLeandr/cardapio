import Link from "next/link"
import type { Category, Item } from "@/lib/mock-data"
import { ItemCard } from "./ItemCard"
import { generateSlug } from "@/lib/utils"
import { getCategoryIcon } from "@/lib/category-icons"

interface CategorySectionProps {
  category: Category & { items: Item[] }
  slug: string
  linkBase?: string
}

export function CategorySection({ category, slug, linkBase }: CategorySectionProps) {
  const base = linkBase ?? `/${slug}`
  const hasItems = category.items.length > 0
  const Icon = getCategoryIcon(category.name)

  return (
    <section id={`section-${category.id}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-white/10" />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full flex-shrink-0" style={{ background: "var(--accent)" }}>
          <Icon className="w-3.5 h-3.5 text-white flex-shrink-0" />
          <h2 className="font-lato text-xs font-bold text-white uppercase tracking-widest">
            {category.name}
          </h2>
        </div>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {hasItems ? (
        <div className="grid grid-cols-1 gap-4">
          {category.items.map((item, idx) => (
            <Link key={item.id} href={`${base}/${generateSlug(item.name)}`} className="block">
              <ItemCard item={item} index={idx} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="font-lato text-white/40 text-sm">Sem itens nesta categoria de momento.</p>
        </div>
      )}
    </section>
  )
}
