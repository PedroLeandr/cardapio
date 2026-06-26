import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { UtensilsCrossed } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { MesaMenuClient } from "@/components/menu/cart/MesaMenuClient"

interface Props {
  params: { slug: string; tableId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient()
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("name, description, logo_url")
    .eq("slug", params.slug)
    .single()

  if (!restaurant) return { title: "Cardápio não encontrado" }
  return {
    title: `${restaurant.name} — Pedido`,
    description: restaurant.description ?? undefined,
  }
}

export default async function MesaPage({ params }: Props) {
  const { slug, tableId } = params
  const supabase = await createClient()

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!restaurant) notFound()

  if (restaurant.plan !== "pro") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-white px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F5E6DC] flex items-center justify-center mb-5">
          <UtensilsCrossed className="w-8 h-8 text-[#C8622A]" />
        </div>
        <h1 className="font-playfair text-2xl font-bold text-[#1A1510] mb-2">{restaurant.name}</h1>
        <p className="font-dm-sans text-sm text-[#A89880] max-w-xs">
          Este cardápio ainda não está disponível online.
        </p>
      </div>
    )
  }

  const { data: table } = await supabase
    .from("tables")
    .select("*")
    .eq("id", tableId)
    .eq("restaurant_id", restaurant.id)
    .single()

  if (!table) notFound()

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("position")

  const catList = categories ?? []
  const catIds = catList.map((c) => c.id)

  const { data: items } = catIds.length > 0
    ? await supabase.from("items").select("*").in("category_id", catIds).order("position")
    : { data: [] }

  const categoriesWithItems = catList
    .map((cat) => ({
      ...cat,
      items: (items ?? []).filter((item) => item.category_id === cat.id && item.is_active),
    }))
    .filter((cat) => cat.items.length > 0)

  return (
    <MesaMenuClient
      restaurant={restaurant}
      table={table}
      categories={categoriesWithItems}
      tableId={tableId}
      slug={slug}
    />
  )
}
