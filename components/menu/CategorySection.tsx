import Link from "next/link"
import type { Category, Item } from "@/lib/mock-data"
import { ItemCard } from "./ItemCard"
import { generateSlug } from "@/lib/utils"
import { getCategoryIcon } from "@/lib/category-icons"

interface CategorySectionProps {
  category: Category & { items: Item[] }
  slug: string
}

export function CategorySection({ category, slug }: CategorySectionProps) {
  const hasItems = category.items.length > 0
  const Icon = getCategoryIcon(category.name)

  return (
    <section id={`section-${category.id}`} className="scroll-mt-36 md:scroll-mt-40">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="flex-1 h-px bg-white/15" />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C8622A] flex-shrink-0">
          <Icon className="w-3.5 h-3.5 text-white flex-shrink-0" />
          <h2 className="font-lato text-xs font-bold text-white uppercase tracking-widest">
            {category.name}
          </h2>
        </div>
        <div className="flex-1 h-px bg-white/15" />
      </div>

      {hasItems ? (
        <div className="grid grid-cols-1 gap-3">
          {category.items.map((item, idx) => (
            <Link key={item.id} href={`/${slug}/${generateSlug(item.name)}`} className="block">
              <ItemCard item={item} index={idx} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="font-lato text-white/50 text-sm">
            Sem itens nesta categoria de momento.
          </p>
        </div>
      )}
    </section>
  )
}
