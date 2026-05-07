import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { X, UtensilsCrossed } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getMockMenuData } from "@/lib/mock-data"
import { generateSlug, formatPrice } from "@/lib/utils"

interface Props {
  params: { slug: string; itemSlug: string }
}

async function getItem(slug: string, itemSlug: string) {
  let allItems: { id: string; name: string; description: string | null; price: number; image_url: string | null; is_active: boolean; category_id: string }[] = []
  let restaurantName = ""

  if (slug === "demo") {
    const data = getMockMenuData()
    restaurantName = data.restaurant.name
    allItems = data.categories.flatMap((c) => c.items)
  } else {
    const supabase = await createClient()

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id, name")
      .eq("slug", slug)
      .single()

    if (!restaurant) return null
    restaurantName = restaurant.name

    const { data: categories } = await supabase
      .from("categories")
      .select("id")
      .eq("restaurant_id", restaurant.id)

    if (!categories?.length) return null

    const { data: items } = await supabase
      .from("items")
      .select("*")
      .in("category_id", categories.map((c) => c.id))

    allItems = items ?? []
  }

  const item = allItems.find((i) => generateSlug(i.name) === itemSlug)
  if (!item) return null

  return { item, restaurantName }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await getItem(params.slug, params.itemSlug)
  if (!result) return { title: "Item não encontrado" }
  return {
    title: `${result.item.name} — ${result.restaurantName}`,
    description: result.item.description ?? undefined,
    openGraph: {
      images: result.item.image_url ? [result.item.image_url] : [],
    },
  }
}

export default async function ItemDetailPage({ params }: Props) {
  const result = await getItem(params.slug, params.itemSlug)
  if (!result) notFound()

  const { item, restaurantName } = result
  const isSoldOut = !item.is_active

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-[#FAF8F4]/95 backdrop-blur-md border-b border-[#E8E0D5]">
        <div className="max-w-2xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link
            href={`/${params.slug}`}
            className="font-lato text-sm font-medium text-[#6B5E4E] hover:text-[#1A1510] transition-colors truncate max-w-[200px]"
          >
            ← {restaurantName}
          </Link>
          <Link
            href={`/${params.slug}`}
            className="w-8 h-8 rounded-full bg-[#F2EFE9] hover:bg-[#E8DDD0] flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-red-500" />
          </Link>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Imagem */}
        <div className="w-full aspect-square rounded-3xl overflow-hidden bg-[#F2EFE9] mb-7 shadow-sm">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              width={640}
              height={640}
              className={`w-full h-full object-cover ${isSoldOut ? "opacity-50 grayscale" : ""}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F5E6DC] to-[#EDE5DA]">
              <UtensilsCrossed className="w-20 h-20 text-[#C8A882]/50" />
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div>
          {isSoldOut && (
            <span className="inline-block text-xs px-3 py-1 rounded-full bg-[#F5F0EB] text-[#A89880] font-lato font-semibold tracking-wide uppercase border border-[#EAE0D5] mb-3">
              Esgotado
            </span>
          )}

          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="font-playfair text-3xl font-bold text-[#1A1510] leading-tight">
              {item.name}
            </h1>
            <p className={`font-lato text-2xl font-bold flex-shrink-0 mt-0.5 ${isSoldOut ? "text-[#A89880]" : "text-[#C8622A]"}`}>
              {formatPrice(item.price)}
            </p>
          </div>

          {item.description && (
            <p className="font-lato text-base text-[#6B5E4E] leading-relaxed mt-3">
              {item.description}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
