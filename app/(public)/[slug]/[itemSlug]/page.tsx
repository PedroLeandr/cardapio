import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, X, UtensilsCrossed } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { generateSlug, formatPrice } from "@/lib/utils"
import { MenuHeader } from "@/components/menu/MenuHeader"

interface Props {
  params: { slug: string; itemSlug: string }
}

async function getItem(slug: string, itemSlug: string) {
  const supabase = await createClient()

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!restaurant) return null

  const { data: categories } = await supabase
    .from("categories")
    .select("id")
    .eq("restaurant_id", restaurant.id)

  if (!categories?.length) return null

  const { data: items } = await supabase
    .from("items")
    .select("*")
    .in("category_id", categories.map((c) => c.id))

  const item = (items ?? []).find((i) => generateSlug(i.name) === itemSlug)
  if (!item) return null

  return { item, restaurant }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await getItem(params.slug, params.itemSlug)
  if (!result) return { title: "Item não encontrado" }
  return {
    title: `${result.item.name} — ${result.restaurant.name}`,
    description: result.item.description ?? undefined,
    openGraph: {
      images: result.item.image_url ? [result.item.image_url] : [],
    },
  }
}

export default async function ItemDetailPage({ params }: Props) {
  const result = await getItem(params.slug, params.itemSlug)
  if (!result) notFound()

  const { item, restaurant } = result
  const isSoldOut = !item.is_active

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <MenuHeader restaurant={restaurant} />

      {/* Botões */}
      <div className="max-w-lg mx-auto w-full px-5 pt-4 pb-2 flex items-center justify-between">
        <Link
          href={`/${params.slug}`}
          aria-label="Voltar"
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={1.75} />
        </Link>
        <Link
          href={`/${params.slug}`}
          aria-label="Fechar"
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95"
        >
          <X className="w-5 h-5 text-gray-700" strokeWidth={1.75} />
        </Link>
      </div>

      <main className="flex-1 max-w-lg mx-auto w-full px-5 pb-4 flex flex-col">
        {/* Main card */}
        <div
          className="rounded-[36px] shadow-[0_6px_32px_rgba(0,0,0,0.15)] overflow-hidden relative flex flex-col flex-1"
          style={{ background: "linear-gradient(155deg, #D4703A 0%, #6B2A0A 100%)" }}
        >
          {/* Background texture */}
          <div
            className="absolute inset-0 bg-center bg-cover pointer-events-none"
            style={{
              backgroundImage: "url('/fundo-sem-fundo.png')",
              opacity: 0.20,
              filter: "brightness(0) invert(1)",
            }}
          />

          {/* Imagem */}
          {item.image_url ? (
            <div className="relative w-full h-52 shrink-0 bg-white">
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                className={`object-cover${isSoldOut ? " opacity-40 grayscale" : ""}`}
              />
              <div className="absolute inset-0 border-b-4 border-white pointer-events-none" />
            </div>
          ) : (
            <div className="w-full h-52 shrink-0 bg-black/10 flex items-center justify-center">
              <UtensilsCrossed className="w-16 h-16 text-white/30" />
            </div>
          )}

          <div className="relative flex flex-col flex-1 px-6 pt-6 pb-7">
            {/* Name */}
            <div className="mb-6">
              <h1 className="font-outfit font-bold text-white text-[26px] leading-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
                {item.name}
              </h1>
            </div>

            {/* About / Description — flex-1 pushes bottom section down */}
            <div className="flex-1">
              {item.description && (
                <div>
                  <h3 className="font-outfit font-bold text-white text-[16px] mb-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
                    Sobre
                  </h3>
                  <p className="font-outfit text-[15px] text-white leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.25)]">
                    {item.description}
                  </p>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/25 mt-6 mb-6" />

            {/* Price + availability — pinned to bottom */}
            <div className="flex items-center justify-between">
              <p
                className={`font-outfit font-bold text-[30px] leading-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)] ${
                  isSoldOut ? "line-through text-white/40" : "text-white"
                }`}
              >
                {formatPrice(item.price)}
              </p>
              <span className={`px-4 py-1.5 rounded-full font-outfit font-semibold text-[13px] ${
                isSoldOut ? "bg-black/20 text-white/50" : "bg-black/20 text-white"
              }`}>
                {isSoldOut ? "Esgotado" : "Disponível"}
              </span>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-3 text-center">
        <p className="font-outfit text-xs text-gray-400">
          Powered by{" "}
          <a href="/" className="text-[#C8622A] hover:text-[#E07840] transition-colors">
            Cardápios Digitais
          </a>
        </p>
      </footer>
    </div>
  )
}
