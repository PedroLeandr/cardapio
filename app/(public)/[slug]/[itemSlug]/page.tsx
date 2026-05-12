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
  let logoUrl: string | null = null

  if (slug === "demo") {
    const data = getMockMenuData()
    restaurantName = data.restaurant.name
    logoUrl = data.restaurant.logo_url
    allItems = data.categories.flatMap((c) => c.items)
  } else {
    const supabase = await createClient()

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id, name, logo_url")
      .eq("slug", slug)
      .single()

    if (!restaurant) return null
    restaurantName = restaurant.name
    logoUrl = restaurant.logo_url ?? null

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

  return { item, restaurantName, logoUrl }
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

  const { item, restaurantName, logoUrl } = result
  const isSoldOut = !item.is_active

  const bgUrl = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80"

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fundo igual ao /[slug] */}
      <div
        className="fixed top-0 inset-x-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url('${bgUrl}')`, height: "100lvh" }}
      />
      <div
        className="fixed top-0 inset-x-0 -z-10 bg-black/65"
        style={{ height: "100lvh" }}
      />

      {/* Header — igual ao MenuHeader */}
      <header className="sticky top-0 z-40 bg-black/80">
        <div className="max-w-2xl mx-auto px-4 py-4 md:px-6 flex items-center gap-4">
          <div className="flex-shrink-0">
            {logoUrl ? (
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <Image src={logoUrl} alt={restaurantName} width={40} height={40} className="object-cover w-full h-full" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-[#C8622A]" />
              </div>
            )}
          </div>

          <Link
            href={`/${params.slug}`}
            className="flex-1 min-w-0 font-playfair text-lg font-bold text-white leading-tight truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] hover:text-white/80 transition-colors"
          >
            {restaurantName}
          </Link>

          <Link
            href={`/${params.slug}`}
            className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
            aria-label="Voltar ao cardápio"
          >
            <X className="w-4 h-4 text-white" />
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 md:px-6">
        {/* Imagem circular sobre banda laranja — igual ao ItemCard mas centrado */}
        <div className="relative flex justify-center items-center py-10 mt-6">
          {/* Banda laranja horizontal */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-44 bg-[#C8622A]" />

          {/* Círculo da imagem */}
          <div className="relative z-10 w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden bg-[#2a2a2a] ring-4 ring-white shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                width={224}
                height={224}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UtensilsCrossed className="w-16 h-16 text-white/20" />
              </div>
            )}
            {isSoldOut && (
              <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                <span className="text-white text-[11px] font-outfit font-bold uppercase tracking-[0.18em] text-center leading-tight px-3">
                  Esgotado
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo de texto */}
        <div className="text-center mt-6 pb-16 px-2">
          {isSoldOut && (
            <span className="inline-block text-[10px] px-3 py-1 rounded-full bg-red-500 text-white font-outfit font-bold tracking-widest uppercase mb-4">
              Esgotado
            </span>
          )}

          <h1 className="font-cormorant italic font-bold text-4xl md:text-5xl text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] mb-3">
            {item.name}
          </h1>

          <p className={`font-outfit font-bold text-2xl md:text-3xl mb-4 ${isSoldOut ? "line-through text-white/40" : "text-[#C8622A]"}`}>
            {formatPrice(item.price)}
          </p>

          {item.description && (
            <>
              <div className="flex items-center gap-3 justify-center mb-4">
                <div className="h-px w-12 bg-white/20" />
                <div className="w-1 h-1 rounded-full bg-[#C8622A]/60" />
                <div className="h-px w-12 bg-white/20" />
              </div>
              <p className="font-outfit text-base text-white/70 leading-relaxed max-w-md mx-auto">
                {item.description}
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
