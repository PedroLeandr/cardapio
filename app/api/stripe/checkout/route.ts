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
    .select("id, stripe_customer_id")
    .eq("user_id", user.id)
    .single()

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurante não encontrado" }, { status: 404 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3333"

  // Reutiliza customer Stripe existente ou cria novo
  let customerId = restaurant.stripe_customer_id
  if (customerId) {
    // Verifica se o customer existe no ambiente atual (test vs live)
    try {
      await stripe.customers.retrieve(customerId)
    } catch {
      customerId = null
      await supabase
        .from("restaurants")
        .update({ stripe_customer_id: null })
        .eq("id", restaurant.id)
    }
  }
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { restaurant_id: restaurant.id, user_id: user.id },
    })
    customerId = customer.id

    await supabase
      .from("restaurants")
      .update({ stripe_customer_id: customerId })
      .eq("id", restaurant.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${siteUrl}/dashboard?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/dashboard/settings?upgrade=cancelled`,
    metadata: { restaurant_id: restaurant.id },
    subscription_data: {
      metadata: { restaurant_id: restaurant.id },
    },
  })

  return NextResponse.json({ url: session.url })
}
