import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { MenuHeader } from "@/components/menu/MenuHeader"
import { MenuClient } from "@/components/menu/MenuClient"
import { getMockMenuData } from "@/lib/mock-data"
import type { MenuData } from "@/lib/mock-data"

interface Props {
  params: { slug: string }
}

async function getMenuData(slug: string): Promise<MenuData | null> {
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
    icons: data.restaurant.logo_url ? { icon: data.restaurant.logo_url } : undefined,
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
    <div className="flex flex-col bg-white">
      <MenuHeader restaurant={restaurant} />
      <div className="flex-1">
        <MenuClient categories={activeCategoriesWithItems} slug={params.slug} />
      </div>

      <footer className="py-5 border-t border-gray-100">
        <div className="max-w-lg mx-auto px-5 text-center">
          <p className="font-outfit text-xs text-gray-400">
            Powered by{" "}
            <a href="/" className="text-[#C8622A] hover:text-[#E07840] transition-colors">
              Cardápios Digitais
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
