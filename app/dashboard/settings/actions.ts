"use server"

import https from "https"

function httpsRequest(
  method: string,
  url: string,
  body: string | null,
  headers: Record<string, string>
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url)
    const reqHeaders: Record<string, string | number> = { ...headers }
    if (body) reqHeaders["Content-Length"] = Buffer.byteLength(body)

    const req = https.request(
      { hostname: parsed.hostname, path: parsed.pathname + parsed.search, method, family: 4, headers: reqHeaders },
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

export async function deleteAccount(userId: string, restaurantId: string) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const headers = {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    }

    // 1. Eliminar itens (via categorias do restaurante)
    await httpsRequest(
      "DELETE",
      `${supabaseUrl}/rest/v1/items?category_id=in.(select id from categories where restaurant_id=eq.${restaurantId})`,
      null,
      headers
    )

    // 1b. Obter ids das categorias e eliminar itens
    const catsRes = await httpsRequest(
      "GET",
      `${supabaseUrl}/rest/v1/categories?restaurant_id=eq.${restaurantId}&select=id`,
      null,
      headers
    )
    const cats: { id: string }[] = JSON.parse(catsRes.body)
    if (cats.length > 0) {
      const catIds = cats.map((c) => c.id).join(",")
      await httpsRequest(
        "DELETE",
        `${supabaseUrl}/rest/v1/items?category_id=in.(${catIds})`,
        null,
        headers
      )
    }

    // 2. Eliminar categorias
    await httpsRequest(
      "DELETE",
      `${supabaseUrl}/rest/v1/categories?restaurant_id=eq.${restaurantId}`,
      null,
      headers
    )

    // 3. Eliminar restaurante
    await httpsRequest(
      "DELETE",
      `${supabaseUrl}/rest/v1/restaurants?id=eq.${restaurantId}`,
      null,
      headers
    )

    // 4. Eliminar utilizador (Supabase Auth Admin API)
    const delUser = await httpsRequest(
      "DELETE",
      `${supabaseUrl}/auth/v1/admin/users/${userId}`,
      null,
      headers
    )

    if (delUser.status !== 200 && delUser.status !== 204) {
      console.error("deleteAccount user error:", delUser.status, delUser.body)
      return { error: "Erro ao eliminar conta de utilizador." }
    }

    return { error: null }
  } catch (err) {
    console.error("deleteAccount exception:", err)
    return { error: "Erro inesperado ao eliminar conta." }
  }
}
