import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { stripe } from "@/lib/stripe"
import { fetchActiveRestaurant } from "@/lib/restaurants/server"
import { DashboardShell } from "@/components/dashboard/DashboardShell"
import { QRCodeDisplay } from "@/components/dashboard/QRCodeDisplay"
import { FolderOpen, UtensilsCrossed, ExternalLink } from "lucide-react"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { upgrade?: string; session_id?: string }
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { restaurant } = await fetchActiveRestaurant(supabase, user.id)

  // Verificar upgrade após pagamento Stripe.
  // O webhook não alcança servidores locais, então verificamos aqui diretamente.
  if (
    searchParams.upgrade === "success" &&
    searchParams.session_id &&
    restaurant?.plan !== "pro"
  ) {
    try {
      const session = await stripe.checkout.sessions.retrieve(searchParams.session_id)
      if (
        session.payment_status === "paid" &&
        session.metadata?.restaurant_id === restaurant?.id
      ) {
        await createAdminClient()
          .from("restaurants")
          .update({
            plan: "pro",
            stripe_subscription_id: typeof session.subscription === "string"
              ? session.subscription
              : null,
          })
          .eq("id", restaurant!.id)

        if (restaurant) restaurant.plan = "pro"
      }
    } catch (e) {
      console.error("Stripe session verification failed:", e)
    }
  }

  if (!restaurant) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="font-dm-sans text-[#6B5E4E] mb-2">Restaurante não encontrado.</p>
          <p className="font-dm-sans text-sm text-[#A89880]">
            Faz logout e regista-te novamente para configurar o teu restaurante.
          </p>
        </div>
      </DashboardShell>
    )
  }

  const { data: cats } = await supabase
    .from("categories")
    .select("id")
    .eq("restaurant_id", restaurant.id)

  const catIds = (cats ?? []).map((c) => c.id)
  const categoriesCount = catIds.length

  const { count: itemsCount } = catIds.length > 0
    ? await supabase.from("items").select("*", { count: "exact", head: true }).in("category_id", catIds)
    : { count: 0 }

  const menuUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/${restaurant.slug}`

  return (
    <DashboardShell>
      <div className="mb-8">
        <p className="font-dm-sans text-sm text-[#A89880] mb-1">Bem-vindo de volta</p>
        <h1 className="font-dm-sans text-2xl font-bold text-[#1A1510]">{restaurant.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-[#E8E0D5] p-5">
            <h2 className="font-dm-sans font-semibold text-[#1A1510] mb-3 text-sm uppercase tracking-wide">
              Link do Cardápio
            </h2>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#F2EFE9] rounded-lg border border-[#E8E0D5] mb-3">
              <span className="flex-1 font-mono text-xs text-[#6B5E4E] truncate">{menuUrl}</span>
              <a
                href={menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-[#A89880] hover:text-[#C8622A] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="font-dm-sans text-xs text-[#A89880]">
              Partilha este link com os teus clientes ou imprime o QR code.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-[#E8E0D5] p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-[#F5E6DC] flex items-center justify-center">
                  <FolderOpen className="w-4 h-4 text-[#C8622A]" />
                </div>
                <span className="font-dm-sans text-xs text-[#A89880] font-medium uppercase tracking-wide">
                  Categorias
                </span>
              </div>
              <p className="font-dm-sans text-3xl font-bold text-[#1A1510]">{categoriesCount ?? 0}</p>
            </div>

            <div className="bg-white rounded-xl border border-[#E8E0D5] p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-[#F5E6DC] flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4 text-[#C8622A]" />
                </div>
                <span className="font-dm-sans text-xs text-[#A89880] font-medium uppercase tracking-wide">
                  Pratos
                </span>
              </div>
              <p className="font-dm-sans text-3xl font-bold text-[#1A1510]">{itemsCount ?? 0}</p>
            </div>
          </div>

          <div className="bg-[#F5E6DC] rounded-xl border border-[#E8D5C8] p-5">
            <h3 className="font-dm-sans font-semibold text-[#1A1510] text-sm mb-3">Próximos passos</h3>
            <ul className="space-y-2">
              {["Adiciona categorias ao teu cardápio", "Cria os teus pratos com imagens", "Partilha o link com os clientes"].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#C8622A] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-dm-sans font-bold">
                    {i + 1}
                  </span>
                  <span className="font-dm-sans text-sm text-[#6B5E4E]">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <QRCodeDisplay url={menuUrl} slug={restaurant.slug} />
        </div>
      </div>
    </DashboardShell>
  )
}
