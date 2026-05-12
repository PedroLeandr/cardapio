import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import Stripe from "stripe"

// Necessário para verificar a assinatura do webhook (body raw)
export const config = { api: { bodyParser: false } }

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "Sem assinatura" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 400 })
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const restaurantId = session.metadata?.restaurant_id
      if (!restaurantId) break

      await supabase
        .from("restaurants")
        .update({
          plan: "pro",
          stripe_subscription_id: session.subscription as string,
        })
        .eq("id", restaurantId)
      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      const restaurantId = subscription.metadata?.restaurant_id
      if (!restaurantId) break

      await supabase
        .from("restaurants")
        .update({ plan: "free", stripe_subscription_id: null })
        .eq("id", restaurantId)
      break
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription
      const restaurantId = subscription.metadata?.restaurant_id
      if (!restaurantId) break

      const isActive = subscription.status === "active" || subscription.status === "trialing"
      await supabase
        .from("restaurants")
        .update({ plan: isActive ? "pro" : "free" })
        .eq("id", restaurantId)
      break
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice
      const subId = typeof invoice.subscription === "string"
        ? invoice.subscription
        : invoice.subscription?.id

      if (!subId) break

      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("id")
        .eq("stripe_subscription_id", subId)
        .single()

      if (restaurant) {
        await supabase
          .from("restaurants")
          .update({ plan: "free" })
          .eq("id", restaurant.id)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
