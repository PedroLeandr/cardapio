import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { MenuHeader } from "@/components/menu/MenuHeader"
import { CategoryNav } from "@/components/menu/CategoryNav"
import { CategorySection } from "@/components/menu/CategorySection"
import { getMockMenuData } from "@/lib/mock-data"
import type { MenuData } from "@/lib/mock-data"

interface Props {
  params: { slug: string }
}

async function getMenuData(slug: string): Promise<MenuData | null> {
  // Dados de demo para desenvolvimento
  if (slug === "demo") return getMockMenuData()

  const supabase = await createClient()

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!restaurant) return null

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("position")

  if (!categories) return { restaurant, categories: [] }

  const { data: items } = await supabase
    .from("items")
    .select("*")
    .in("category_id", categories.map((c) => c.id))
    .eq("is_active", true)
    .order("position")

  const categoriesWithItems = categories.map((cat) => ({
    ...cat,
    items: (items ?? []).filter((item) => item.category_id === cat.id),
  }))

  return { restaurant, categories: categoriesWithItems }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getMenuData(params.slug)
  if (!data) return { title: "Cardápio não encontrado" }

  return {
    title: `${data.restaurant.name} — Cardápio Digital`,
    description: data.restaurant.description ?? undefined,
    openGraph: {
      title: `${data.restaurant.name} — Cardápio Digital`,
      description: data.restaurant.description ?? undefined,
      type: "website",
    },
  }
}

export default async function MenuPage({ params }: Props) {
  const data = await getMenuData(params.slug)

  if (!data) notFound()

  const { restaurant, categories } = data
  const activeCategoriesWithItems = categories.filter((cat) => cat.items.length > 0)

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <MenuHeader restaurant={restaurant} />

      {activeCategoriesWithItems.length > 0 && (
        <CategoryNav categories={activeCategoriesWithItems} />
      )}

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-14">
        {activeCategoriesWithItems.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-playfair text-xl text-[#A89880]">Cardápio em preparação...</p>
            <p className="font-lato text-sm text-[#A89880] mt-2">Volta em breve para ver os nossos pratos.</p>
          </div>
        ) : (
          activeCategoriesWithItems.map((cat) => (
            <CategorySection key={cat.id} category={cat} slug={params.slug} />
          ))
        )}
      </main>

      <footer className="mt-16 py-8 border-t border-[#E8E0D5]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-lato text-xs text-[#A89880]">
            Powered by{" "}
            <a href="/" className="text-[#C8622A] hover:text-[#A84E1E] transition-colors">
              Cardápios Digitais
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
