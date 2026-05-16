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
  const Icon = getCategoryIcon(category.name)

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-[#D4C4A8]" />
        <div className="flex items-center gap-1.5">
          <Icon className="w-3 h-3 text-[#8A7A6A]" />
          <h2 className="font-playfair italic font-bold text-[13px] text-[#1A1008]">
            {category.name}
          </h2>
        </div>
        <div className="flex-1 h-px bg-[#D4C4A8]" />
      </div>
      {category.items.length > 0 ? (
        <div className="space-y-3">
          {category.items.map((item) => (
            <Link key={item.id} href={`${base}/${generateSlug(item.name)}`} className="block">
              <ItemCard item={item} />
            </Link>
          ))}
        </div>
      ) : (
        <p className="font-lato text-sm text-[#B8A890] py-8 text-center">
          Sem itens disponíveis.
        </p>
      )}
    </section>
  )
}
