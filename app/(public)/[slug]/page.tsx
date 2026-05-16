import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { MenuHeader } from "@/components/menu/MenuHeader"
import { MenuClient } from "@/components/menu/MenuClient"
import { MenuHeader as ClassicMenuHeader } from "@/components/menu/classic/MenuHeader"
import { MenuClient as ClassicMenuClient } from "@/components/menu/classic/MenuClient"
import { MenuHeader as BrasserieMenuHeader } from "@/components/menu/brasserie/MenuHeader"
import { MenuClient as BrasserieMenuClient } from "@/components/menu/brasserie/MenuClient"
import { MenuHeader as NoiteMenuHeader } from "@/components/menu/noite/MenuHeader"
import { MenuClient as NoiteMenuClient } from "@/components/menu/noite/MenuClient"
import { MenuHeader as VibranteMenuHeader } from "@/components/menu/vibrante/MenuHeader"
import { MenuClient as VibranteMenuClient } from "@/components/menu/vibrante/MenuClient"
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
  const accent = restaurant.accent_color ?? "#C8622A"
  const theme = restaurant.theme ?? "modern"

  if (theme === "classic") {
    return (
      <div className="min-h-dvh flex flex-col bg-[#111111]" style={{ "--accent": accent } as React.CSSProperties}>
        <ClassicMenuHeader restaurant={restaurant} />
        <ClassicMenuClient categories={activeCategoriesWithItems} slug={params.slug} />
        <footer className="py-4 border-t border-white/10 text-center">
          <p className="font-lato text-xs text-white/30">
            Powered by <a href="/" style={{ color: accent }}>Cardápios Digitais</a>
          </p>
        </footer>
      </div>
    )
  }

  if (theme === "brasserie") {
    return (
      <div className="min-h-dvh flex flex-col bg-[#F7F3EC]" style={{ "--accent": accent } as React.CSSProperties}>
        <BrasserieMenuHeader restaurant={restaurant} />
        <div className="flex-1">
          <BrasserieMenuClient categories={activeCategoriesWithItems} slug={params.slug} />
        </div>
        <footer className="py-4 border-t border-[#D4C4A8] text-center">
          <p className="font-lato text-xs text-[#B8A890]">
            Powered by <a href="/" style={{ color: accent }}>Cardápios Digitais</a>
          </p>
        </footer>
      </div>
    )
  }

  if (theme === "noite") {
    return (
      <div className="min-h-dvh flex flex-col bg-[#0D0F14]" style={{ "--accent": accent } as React.CSSProperties}>
        <NoiteMenuHeader restaurant={restaurant} />
        <div className="flex-1">
          <NoiteMenuClient categories={activeCategoriesWithItems} slug={params.slug} />
        </div>
        <footer className="py-4 border-t border-white/5 text-center">
          <p className="font-dm-sans text-xs text-white/20">
            Powered by <a href="/" style={{ color: accent }}>Cardápios Digitais</a>
          </p>
        </footer>
      </div>
    )
  }

  if (theme === "vibrante") {
    return (
      <div className="min-h-dvh flex flex-col bg-[#FFFDF9]" style={{ "--accent": accent } as React.CSSProperties}>
        <VibranteMenuHeader restaurant={restaurant} />
        <VibranteMenuClient categories={activeCategoriesWithItems} slug={params.slug} />
        <footer className="py-4 border-t border-[#EEEAE3] text-center">
          <p className="font-dm-sans text-xs text-[#BBB]">
            Powered by <a href="/" style={{ color: accent }}>Cardápios Digitais</a>
          </p>
        </footer>
      </div>
    )
  }

  // modern (default)
  return (
    <div className="min-h-dvh flex flex-col bg-white" style={{ "--accent": accent } as React.CSSProperties}>
      <MenuHeader restaurant={restaurant} />
      <div className="flex-1">
        <MenuClient categories={activeCategoriesWithItems} slug={params.slug} />
      </div>
      <footer className="py-5 border-t border-gray-100">
        <div className="max-w-lg mx-auto px-5 text-center">
          <p className="font-outfit text-xs text-gray-400">
            Powered by{" "}
            <a href="/" className="hover:opacity-80 transition-opacity" style={{ color: accent }}>
              Cardápios Digitais
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
