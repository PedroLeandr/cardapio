import { redirect } from "next/navigation"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
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

const THEME_NAMES: Record<string, string> = {
  modern: "Moderno",
  classic: "Clássico",
  brasserie: "Brasserie",
  noite: "Noite",
  vibrante: "Vibrante",
}

interface Props {
  params: { designName: string }
}

export default async function DesignPreviewPage({ params }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!restaurant) redirect("/dashboard")

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("position")

  const { data: items } = await supabase
    .from("items")
    .select("*")
    .in("category_id", (categories ?? []).map((c) => c.id))
    .order("position")

  const categoriesWithItems = (categories ?? [])
    .map((cat) => ({
      ...cat,
      items: (items ?? []).filter((i) => i.category_id === cat.id),
    }))
    .filter((cat) => cat.items.length > 0)

  const theme = params.designName
  const themeName = THEME_NAMES[theme] ?? theme
  const accent = restaurant.accent_color ?? "#C8622A"

  const banner = (
    <div className="sticky top-0 z-50 flex items-center justify-between gap-3 px-4 py-3 bg-[#1A1510] border-b border-white/10 shadow-lg">
      <Link
        href="/dashboard/design"
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-dm-sans text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>
      <span className="font-dm-sans text-sm text-white/80">
        Pré-visualização · <span className="text-white font-semibold">{themeName}</span>
      </span>
      <Link
        href={`/dashboard/design?apply=${theme}`}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-dm-sans text-sm font-semibold text-white transition-colors"
        style={{ background: accent }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        Usar este design
      </Link>
    </div>
  )

  const linkBase = `/design/${theme}`

  if (theme === "classic") {
    return (
      <div style={{ "--accent": accent } as React.CSSProperties}>
        {banner}
        <div className="min-h-dvh flex flex-col bg-[#111111]">
          <ClassicMenuHeader restaurant={restaurant} />
          <ClassicMenuClient categories={categoriesWithItems} slug={restaurant.slug} linkBase={linkBase} />
          <footer className="py-4 border-t border-white/10 text-center">
            <p className="font-lato text-xs text-white/30">
              Powered by <a href="/" style={{ color: accent }}>Cardápios Digitais</a>
            </p>
          </footer>
        </div>
      </div>
    )
  }

  if (theme === "brasserie") {
    return (
      <div style={{ "--accent": accent } as React.CSSProperties}>
        {banner}
        <div className="min-h-dvh flex flex-col bg-[#F7F3EC]">
          <BrasserieMenuHeader restaurant={restaurant} />
          <div className="flex-1">
            <BrasserieMenuClient categories={categoriesWithItems} slug={restaurant.slug} linkBase={linkBase} />
          </div>
          <footer className="py-4 border-t border-[#D4C4A8] text-center">
            <p className="font-lato text-xs text-[#B8A890]">
              Powered by <a href="/" style={{ color: accent }}>Cardápios Digitais</a>
            </p>
          </footer>
        </div>
      </div>
    )
  }

  if (theme === "noite") {
    return (
      <div style={{ "--accent": accent } as React.CSSProperties}>
        {banner}
        <div className="min-h-dvh flex flex-col bg-[#0D0F14]">
          <NoiteMenuHeader restaurant={restaurant} />
          <div className="flex-1">
            <NoiteMenuClient categories={categoriesWithItems} slug={restaurant.slug} linkBase={linkBase} />
          </div>
          <footer className="py-4 border-t border-white/5 text-center">
            <p className="font-dm-sans text-xs text-white/20">
              Powered by <a href="/" style={{ color: accent }}>Cardápios Digitais</a>
            </p>
          </footer>
        </div>
      </div>
    )
  }

  if (theme === "vibrante") {
    return (
      <div style={{ "--accent": accent } as React.CSSProperties}>
        {banner}
        <div className="min-h-dvh flex flex-col bg-[#FFFDF9]">
          <VibranteMenuHeader restaurant={restaurant} />
          <VibranteMenuClient categories={categoriesWithItems} slug={restaurant.slug} linkBase={linkBase} />
          <footer className="py-4 border-t border-[#EEEAE3] text-center">
            <p className="font-dm-sans text-xs text-[#BBB]">
              Powered by <a href="/" style={{ color: accent }}>Cardápios Digitais</a>
            </p>
          </footer>
        </div>
      </div>
    )
  }

  // modern (default)
  return (
    <div style={{ "--accent": accent } as React.CSSProperties}>
      {banner}
      <div className="min-h-dvh flex flex-col bg-white">
        <MenuHeader restaurant={restaurant} />
        <div className="flex-1">
          <MenuClient categories={categoriesWithItems} slug={restaurant.slug} linkBase={linkBase} />
        </div>
        <footer className="py-5 border-t border-gray-100">
          <div className="max-w-lg mx-auto px-5 text-center">
            <p className="font-outfit text-xs text-gray-400">
              Powered by <a href="/" className="hover:opacity-80 transition-opacity" style={{ color: accent }}>Cardápios Digitais</a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
