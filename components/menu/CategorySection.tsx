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
    <section id={`section-${category.id}`}>
      {/* Category title */}
      <div className="flex items-center gap-2 px-5 mb-2">
        <h2 className="font-outfit font-bold text-gray-900 text-[17px]">
          {category.name}
        </h2>
        <Icon className="w-4 h-4 text-[#C8622A]" />
      </div>

      {hasItems ? (
        <div
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-6 snap-x snap-mandatory scroll-smooth"
          style={{
            paddingTop: "48px",
            paddingLeft: "calc(50% - 9rem)",
            paddingRight: "calc(50% - 9rem)",
          }}
        >
          {category.items.map((item, idx) => (
            <Link
              key={item.id}
              href={`/${slug}/${generateSlug(item.name)}`}
              className="block flex-shrink-0 snap-center snap-always"
            >
              <ItemCard item={item} index={idx} />
            </Link>
          ))}
          <span className="flex-shrink-0 w-2" />
        </div>
      ) : (
        <div className="py-10 text-center px-5">
          <p className="font-outfit text-gray-400 text-sm">
            Sem itens nesta categoria de momento.
          </p>
        </div>
      )}
    </section>
  )
}
