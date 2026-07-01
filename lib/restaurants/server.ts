import { cookies } from "next/headers"
import type { SupabaseClient } from "@supabase/supabase-js"
import { ACTIVE_RESTAURANT_COOKIE, pickActiveRestaurant } from "./shared"

export async function fetchActiveRestaurant(
  supabase: SupabaseClient,
  userId: string,
  columns = "*"
) {
  const cookieStore = await cookies()
  const activeId = cookieStore.get(ACTIVE_RESTAURANT_COOKIE)?.value ?? null

  const { data } = await supabase
    .from("restaurants")
    .select(columns)
    .eq("user_id", userId)
    .order("created_at", { ascending: true })

  const restaurants = (data ?? []) as any[]
  const restaurant = pickActiveRestaurant(restaurants, activeId)
  return { restaurant, restaurants }
}
