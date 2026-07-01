const MULTI_RESTAURANT_EMAILS = new Set([
  "pedroleandrovieiranascimento@gmail.com",
])

export function canManageMultipleRestaurants(email?: string | null): boolean {
  if (!email) return false
  return MULTI_RESTAURANT_EMAILS.has(email.toLowerCase())
}
