"use server"

import https from "https"

const RESERVED_SLUGS = new Set([
  "dashboard", "login", "register", "api", "admin", "demo",
  "app", "www", "settings", "help", "about", "contact",
  "support", "blog", "static", "assets", "public", "null",
  "undefined", "home", "index", "auth", "oauth", "callback",
])

function httpsReq(
  method: string,
  url: string,
  body: string | null,
  headers: Record<string, string>
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url)
    const extra: Record<string, unknown> = {}
    if (body) extra["Content-Length"] = Buffer.byteLength(body)

    const req = https.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method,
        family: 4,
        headers: { ...headers, ...extra },
      },
      (res) => {
        let data = ""
        res.on("data", (chunk) => (data += chunk))
        res.on("end", () => resolve({ status: res.statusCode ?? 0, body: data }))
      }
    )
    req.on("error", reject)
    if (body) req.write(body)
    req.end()
  })
}

async function deleteAuthUser(userId: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  await httpsReq("DELETE", `${url}/auth/v1/admin/users/${userId}`, null, {
    apikey: key,
    Authorization: `Bearer ${key}`,
  }).catch(() => {/* best-effort */})
}

export async function createRestaurant(userId: string, name: string, slug: string) {
  try {
    // Bloquear slugs reservados
    if (RESERVED_SLUGS.has(slug.toLowerCase())) {
      await deleteAuthUser(userId)
      return { error: "slug_reserved" }
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const headers = {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    }

    const { status, body } = await httpsReq(
      "POST",
      `${url}/rest/v1/restaurants`,
      JSON.stringify({ user_id: userId, name, slug, description: "" }),
      headers
    )

    if (status === 201 || status === 200) return { error: null }

    // Falhou — eliminar a conta criada (rollback)
    await deleteAuthUser(userId)

    let parsed: { code?: string; message?: string } = {}
    try { parsed = JSON.parse(body) } catch { /* ignore */ }

    if (parsed?.code === "23505") return { error: "slug_taken" }
    return { error: parsed?.message ?? `Erro ao criar restaurante (HTTP ${status})` }

  } catch (err) {
    console.error("createRestaurant exception:", err)
    // Tentar rollback mesmo em exceção
    try { await deleteAuthUser(userId) } catch { /* ignore */ }
    return { error: "Erro de ligação. Tenta novamente." }
  }
}
