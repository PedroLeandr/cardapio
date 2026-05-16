import Link from "next/link"
import type { Category, Item } from "@/lib/mock-data"
import { ItemCard } from "./ItemCard"
import { generateSlug } from "@/lib/utils"

interface CategorySectionProps {
  category: Category & { items: Item[] }
  slug: string
  linkBase?: string
}

export function CategorySection({ category, slug, linkBase }: CategorySectionProps) {
  const base = linkBase ?? `/${slug}`

  return (
    <section className="mb-8">
      <h2 className="font-dm-sans font-bold text-sm text-[#111] mb-4">
        {category.name}
      </h2>
      {category.items.length > 0 ? (
        <div className="space-y-4">
          {category.items.map((item) => (
            <Link key={item.id} href={`${base}/${generateSlug(item.name)}`} className="block">
              <ItemCard item={item} />
            </Link>
          ))}
        </div>
      ) : (
        <p className="font-dm-sans text-sm text-[#BBB] py-8 text-center">
          Sem itens disponíveis.
        </p>
      )}
    </section>
  )
}
