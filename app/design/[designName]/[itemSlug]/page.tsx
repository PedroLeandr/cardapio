import { redirect, notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, X, UtensilsCrossed, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { generateSlug, formatPrice } from "@/lib/utils"
import { MenuHeader } from "@/components/menu/MenuHeader"
import { MenuHeader as ClassicMenuHeader } from "@/components/menu/classic/MenuHeader"
import { MenuHeader as BrasserieMenuHeader } from "@/components/menu/brasserie/MenuHeader"
import { MenuHeader as NoiteMenuHeader } from "@/components/menu/noite/MenuHeader"
import { MenuHeader as VibranteMenuHeader } from "@/components/menu/vibrante/MenuHeader"

const THEME_NAMES: Record<string, string> = {
  modern: "Moderno",
  classic: "Clássico",
  brasserie: "Brasserie",
  noite: "Noite",
  vibrante: "Vibrante",
}

interface Props {
  params: { designName: string; itemSlug: string }
}

export default async function DesignItemPreviewPage({ params }: Props) {
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
    .select("id")
    .eq("restaurant_id", restaurant.id)

  const { data: items } = await supabase
    .from("items")
    .select("*")
    .in("category_id", (categories ?? []).map((c) => c.id))

  const item = (items ?? []).find((i) => generateSlug(i.name) === params.itemSlug)
  if (!item) notFound()

  const theme = params.designName
  const themeName = THEME_NAMES[theme] ?? theme
  const accent = restaurant.accent_color ?? "#C8622A"
  const isSoldOut = !item.is_active
  const backHref = `/design/${theme}`

  const previewBanner = (
    <div className="sticky top-0 z-50 flex items-center justify-between gap-3 px-4 py-3 bg-[#1A1510] border-b border-white/10 shadow-lg">
      <Link href={backHref} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-dm-sans text-sm">
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

  return (
    <div style={{ "--accent": accent } as React.CSSProperties}>
      {previewBanner}

      {/* ── CLÁSSICO ── */}
      {theme === "classic" && (
        <div className="min-h-dvh bg-[#111111] flex flex-col">
          <ClassicMenuHeader restaurant={restaurant} />
          <div className="flex items-center justify-between px-5 pt-4 pb-2 max-w-3xl mx-auto w-full">
            <Link href={backHref} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" strokeWidth={1.75} />
            </Link>
            <Link href={backHref} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <X className="w-5 h-5 text-white" strokeWidth={1.75} />
            </Link>
          </div>
          <main className="flex-1 max-w-3xl mx-auto w-full px-5 pb-8 flex flex-col gap-6">
            <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-white/5">
              {item.image_url ? (
                <Image src={item.image_url} alt={item.name} fill className={`object-cover${isSoldOut ? " opacity-40 grayscale" : ""}`} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UtensilsCrossed className="w-16 h-16 text-white/15" />
                </div>
              )}
              {isSoldOut && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="font-lato font-bold text-white text-sm uppercase tracking-widest">Esgotado</span>
                </div>
              )}
            </div>
            <div>
              <h1 className="font-playfair italic font-bold text-3xl leading-tight mb-3" style={{ color: isSoldOut ? "rgba(255,255,255,0.3)" : "var(--accent)" }}>
                {item.name}
              </h1>
              {item.description && (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px bg-white/10 flex-1" />
                    <span className="font-lato text-xs font-bold text-white/40 uppercase tracking-widest">Sobre</span>
                    <div className="h-px bg-white/10 flex-1" />
                  </div>
                  <p className="font-lato text-white/60 text-[15px] leading-relaxed">{item.description}</p>
                </>
              )}
            </div>
            <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
              <p className={`font-playfair font-bold text-3xl ${isSoldOut ? "line-through text-white/25" : ""}`} style={isSoldOut ? {} : { color: "var(--accent)" }}>
                {formatPrice(item.price)}
              </p>
              <span className={`px-4 py-1.5 rounded-full font-lato font-bold text-xs uppercase tracking-wider ${isSoldOut ? "bg-white/5 text-white/30" : "bg-white/10 text-white/70"}`}>
                {isSoldOut ? "Esgotado" : "Disponível"}
              </span>
            </div>
          </main>
        </div>
      )}

      {/* ── BRASSERIE ── */}
      {theme === "brasserie" && (
        <div className="min-h-dvh bg-[#F7F3EC] flex flex-col">
          <BrasserieMenuHeader restaurant={restaurant} />
          <div className="flex items-center justify-between px-5 pt-4 pb-2 max-w-2xl mx-auto w-full">
            <Link href={backHref} className="w-10 h-10 rounded-full bg-[#EDE8DE] flex items-center justify-center hover:bg-[#D8D0C0] transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#1A1008]" strokeWidth={1.75} />
            </Link>
            <Link href={backHref} className="w-10 h-10 rounded-full bg-[#EDE8DE] flex items-center justify-center hover:bg-[#D8D0C0] transition-colors">
              <X className="w-5 h-5 text-[#1A1008]" strokeWidth={1.75} />
            </Link>
          </div>
          <main className="flex-1 max-w-2xl mx-auto w-full px-5 pb-8 flex flex-col gap-6">
            <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-[#EDE8DE]">
              {item.image_url ? (
                <Image src={item.image_url} alt={item.name} fill className={`object-cover${isSoldOut ? " opacity-40 grayscale" : ""}`} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UtensilsCrossed className="w-16 h-16 text-[#B8A890]" />
                </div>
              )}
              {isSoldOut && (
                <div className="absolute inset-0 bg-[#F7F3EC]/60 flex items-center justify-center">
                  <span className="font-lato font-bold text-[#8A7A6A] text-sm uppercase tracking-widest">Esgotado</span>
                </div>
              )}
            </div>
            <div>
              <h1 className="font-playfair italic font-bold text-3xl leading-tight text-[#1A1008] mb-3" style={isSoldOut ? { opacity: 0.4 } : {}}>
                {item.name}
              </h1>
              {item.description && (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px bg-[#D4C4A8] flex-1" />
                    <span className="font-lato text-xs font-bold text-[#8A7A6A] uppercase tracking-widest">Sobre</span>
                    <div className="h-px bg-[#D4C4A8] flex-1" />
                  </div>
                  <p className="font-lato text-[#8A7A6A] text-[15px] leading-relaxed">{item.description}</p>
                </>
              )}
            </div>
            <div className="mt-auto pt-6 border-t border-[#D4C4A8] flex items-center justify-between">
              <p className={`font-playfair font-bold text-3xl ${isSoldOut ? "line-through text-[#B8A890]" : ""}`} style={isSoldOut ? {} : { color: "var(--accent)" }}>
                {formatPrice(item.price)}
              </p>
              <span className={`px-4 py-1.5 rounded-full font-lato font-bold text-xs uppercase tracking-wider ${isSoldOut ? "bg-[#EDE8DE] text-[#B8A890]" : "bg-[#EDE8DE] text-[#8A7A6A]"}`}>
                {isSoldOut ? "Esgotado" : "Disponível"}
              </span>
            </div>
          </main>
        </div>
      )}

      {/* ── NOITE ── */}
      {theme === "noite" && (
        <div className="min-h-dvh bg-[#0D0F14] flex flex-col">
          <NoiteMenuHeader restaurant={restaurant} />
          <div className="flex items-center justify-between px-5 pt-4 pb-2 max-w-2xl mx-auto w-full">
            <Link href={backHref} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" strokeWidth={1.75} />
            </Link>
            <Link href={backHref} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
              <X className="w-5 h-5 text-white" strokeWidth={1.75} />
            </Link>
          </div>
          <main className="flex-1 max-w-2xl mx-auto w-full px-5 pb-8 flex flex-col gap-6">
            <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-white/5">
              {item.image_url ? (
                <Image src={item.image_url} alt={item.name} fill className={`object-cover${isSoldOut ? " opacity-20 grayscale" : ""}`} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UtensilsCrossed className="w-16 h-16 text-white/10" />
                </div>
              )}
              {item.image_url && <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F14]/60 to-transparent" />}
              {isSoldOut && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-dm-sans font-bold text-white/40 text-sm uppercase tracking-widest">Esgotado</span>
                </div>
              )}
            </div>
            <div>
              <h1 className={`font-dm-sans font-bold text-3xl leading-tight mb-3 ${isSoldOut ? "line-through text-white/20" : "text-white"}`}>
                {item.name}
              </h1>
              {item.description && (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px bg-white/10 flex-1" />
                    <span className="font-dm-sans text-xs font-bold text-white/25 uppercase tracking-widest">Sobre</span>
                    <div className="h-px bg-white/10 flex-1" />
                  </div>
                  <p className="font-dm-sans text-white/40 text-[15px] leading-relaxed">{item.description}</p>
                </>
              )}
            </div>
            <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
              <p className={`font-dm-sans font-bold text-3xl ${isSoldOut ? "line-through text-white/15" : ""}`} style={isSoldOut ? {} : { color: "var(--accent)" }}>
                {formatPrice(item.price)}
              </p>
              <span className={`px-4 py-1.5 rounded-full font-dm-sans font-bold text-xs uppercase tracking-wider ${isSoldOut ? "bg-white/5 text-white/20" : "bg-white/10 text-white/50"}`}>
                {isSoldOut ? "Esgotado" : "Disponível"}
              </span>
            </div>
          </main>
        </div>
      )}

      {/* ── VIBRANTE ── */}
      {theme === "vibrante" && (
        <div className="min-h-dvh bg-[#FFFDF9] flex flex-col">
          <VibranteMenuHeader restaurant={restaurant} />
          <div className="max-w-2xl mx-auto w-full px-5 pt-4 pb-2 flex items-center justify-between">
            <Link href={backHref} className="w-10 h-10 rounded-full bg-[#EEEAE3] flex items-center justify-center hover:bg-[#E0DDD6] transition-colors active:scale-95">
              <ArrowLeft className="w-5 h-5 text-[#333]" strokeWidth={1.75} />
            </Link>
            <Link href={backHref} className="w-10 h-10 rounded-full bg-[#EEEAE3] flex items-center justify-center hover:bg-[#E0DDD6] transition-colors active:scale-95">
              <X className="w-5 h-5 text-[#333]" strokeWidth={1.75} />
            </Link>
          </div>
          <main className="flex-1 max-w-2xl mx-auto w-full px-5 pb-8">
            <div className="rounded-2xl bg-white overflow-hidden border border-[#EEEAE3] shadow-md">
              {/* Image area */}
              <div className="relative h-72 bg-[#F0EDE6]">
                {item.image_url ? (
                  <>
                    <Image src={item.image_url} alt={item.name} fill className={`object-cover${isSoldOut ? " grayscale opacity-50" : ""}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--accent) 8%, #F0EDE6)" }}>
                    <UtensilsCrossed className="w-16 h-16" style={{ color: "color-mix(in srgb, var(--accent) 35%, #CCC)" }} />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h1 className={`font-dm-sans font-bold text-2xl leading-tight ${item.image_url ? "text-white" : "text-[#111]"} ${isSoldOut ? "line-through opacity-60" : ""}`}>
                    {item.name}
                  </h1>
                </div>
                {isSoldOut && (
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm">
                    <span className="font-dm-sans text-xs font-bold text-white uppercase tracking-wider">Esgotado</span>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-5 flex flex-col gap-4">
                {item.description && (
                  <>
                    <p className="font-dm-sans text-xs font-bold text-[#999] uppercase tracking-widest">Sobre</p>
                    <p className="font-dm-sans text-[15px] text-[#555] leading-relaxed">{item.description}</p>
                  </>
                )}
                <div className="pt-4 border-t border-[#EEEAE3] flex items-center justify-between">
                  <p className="font-dm-sans font-bold text-3xl" style={{ color: isSoldOut ? "#ccc" : "var(--accent)" }}>
                    {formatPrice(item.price)}
                  </p>
                  <span className={`px-4 py-1.5 rounded-full font-dm-sans font-semibold text-xs ${isSoldOut ? "bg-[#F5F5F5] text-[#BBB]" : "bg-[#EEEAE3] text-[#666]"}`}>
                    {isSoldOut ? "Esgotado" : "Disponível"}
                  </span>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ── MODERNO (default) ── */}
      {theme === "modern" && (
        <div className="h-dvh bg-white flex flex-col">
          <MenuHeader restaurant={restaurant} />
          <div className="max-w-lg mx-auto w-full px-5 pt-4 pb-2 flex items-center justify-between">
            <Link href={backHref} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95">
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={1.75} />
            </Link>
            <Link href={backHref} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95">
              <X className="w-5 h-5 text-gray-700" strokeWidth={1.75} />
            </Link>
          </div>
          <main className="flex-1 max-w-lg mx-auto w-full px-5 pb-4 flex flex-col">
            <div
              className="rounded-[36px] shadow-[0_6px_32px_rgba(0,0,0,0.15)] overflow-hidden relative flex flex-col flex-1"
              style={{ background: "linear-gradient(155deg, color-mix(in srgb, var(--accent) 90%, white) 0%, color-mix(in srgb, var(--accent) 55%, black) 100%)" }}
            >
              <div className="absolute inset-0 bg-center bg-cover pointer-events-none" style={{ backgroundImage: "url('/fundo-sem-fundo.png')", opacity: 0.20, filter: "brightness(0) invert(1)" }} />
              {item.image_url ? (
                <div className="relative w-full h-52 shrink-0 bg-white">
                  <Image src={item.image_url} alt={item.name} fill className={`object-cover${isSoldOut ? " opacity-40 grayscale" : ""}`} />
                  <div className="absolute inset-0 border-b-4 border-white pointer-events-none" />
                </div>
              ) : (
                <div className="w-full h-52 shrink-0 bg-black/10 flex items-center justify-center">
                  <UtensilsCrossed className="w-16 h-16 text-white/30" />
                </div>
              )}
              <div className="relative flex flex-col flex-1 px-6 pt-6 pb-7">
                <div className="mb-6">
                  <h1 className="font-outfit font-bold text-white text-[26px] leading-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">{item.name}</h1>
                </div>
                <div className="flex-1">
                  {item.description && (
                    <div>
                      <h3 className="font-outfit font-bold text-white text-[16px] mb-2">Sobre</h3>
                      <p className="font-outfit text-[15px] text-white leading-relaxed">{item.description}</p>
                    </div>
                  )}
                </div>
                <div className="h-px bg-white/25 mt-6 mb-6" />
                <div className="flex items-center justify-between">
                  <p className={`font-outfit font-bold text-[30px] leading-none ${isSoldOut ? "line-through text-white/40" : "text-white"}`}>
                    {formatPrice(item.price)}
                  </p>
                  <span className={`px-4 py-1.5 rounded-full font-outfit font-semibold text-[13px] ${isSoldOut ? "bg-black/20 text-white/50" : "bg-black/20 text-white"}`}>
                    {isSoldOut ? "Esgotado" : "Disponível"}
                  </span>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  )
}
