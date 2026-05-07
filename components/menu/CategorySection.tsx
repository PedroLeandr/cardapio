import Link from "next/link"
import type { Category, Item } from "@/lib/mock-data"
import { ItemCard } from "./ItemCard"
import { generateSlug } from "@/lib/utils"

interface CategorySectionProps {
  category: Category & { items: Item[] }
  slug: string
}

export function CategorySection({ category, slug }: CategorySectionProps) {
  const hasItems = category.items.length > 0

  return (
    <section id={`section-${category.id}`} className="scroll-mt-48">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-1 h-8 rounded-full bg-[#C8622A]" />
        <h2 className="font-playfair text-2xl font-bold text-[#1A1510]">
          {category.name}
        </h2>
        <div className="flex-1 h-px bg-[#E8E0D5]" />
      </div>

      {hasItems ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {category.items.map((item, idx) => (
            <Link key={item.id} href={`/${slug}/${generateSlug(item.name)}`} className="block">
              <ItemCard item={item} index={idx} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="font-lato text-[#A89880] text-sm">
            Sem itens nesta categoria de momento.
          </p>
        </div>
      )}
    </section>
  )
}
