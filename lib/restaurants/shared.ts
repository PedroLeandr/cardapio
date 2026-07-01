export const ACTIVE_RESTAURANT_COOKIE = "active_restaurant_id"

export function pickActiveRestaurant<T extends { id: string }>(
  restaurants: T[],
  activeId?: string | null
): T | null {
  if (restaurants.length === 0) return null
  if (activeId) {
    const match = restaurants.find((r) => r.id === activeId)
    if (match) return match
  }
  return restaurants[0]
}
