import type { SupabaseClient } from "@supabase/supabase-js"
import { ACTIVE_RESTAURANT_COOKIE, pickActiveRestaurant } from "./shared"

export function getActiveRestaurantId(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${ACTIVE_RESTAURANT_COOKIE}=([^;]*)`)
  )
  return match ? decodeURIComponent(match[1]) : null
}

export function setActiveRestaurantId(id: string) {
  document.cookie = `${ACTIVE_RESTAURANT_COOKIE}=${encodeURIComponent(id)}; path=/; max-age=${60 * 60 * 24 * 365}`
}

export async function fetchActiveRestaurant(
  supabase: SupabaseClient,
  userId: string,
  columns = "*"
) {
  const { data } = await supabase
    .from("restaurants")
    .select(columns)
    .eq("user_id", userId)
    .order("created_at", { ascending: true })

  const restaurants = (data ?? []) as any[]
  const restaurant = pickActiveRestaurant(restaurants, getActiveRestaurantId())
  return { restaurant, restaurants }
}
