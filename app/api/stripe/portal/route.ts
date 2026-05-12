import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single()

  if (!restaurant?.stripe_customer_id) {
    return NextResponse.json({ error: "Sem subscrição ativa" }, { status: 400 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3333"

  const session = await stripe.billingPortal.sessions.create({
    customer: restaurant.stripe_customer_id,
    return_url: `${siteUrl}/dashboard/settings`,
  })

  return NextResponse.json({ url: session.url })
}
