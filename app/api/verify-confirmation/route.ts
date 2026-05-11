import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(req: NextRequest) {
  const { code } = await req.json()
  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Código inválido." }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const admin = createAdminClient()
  const { data: adminUser, error } = await admin.auth.admin.getUserById(user.id)
  if (error || !adminUser) return NextResponse.json({ error: "Utilizador não encontrado." }, { status: 404 })

  const meta = adminUser.user.user_metadata ?? {}
  const storedCode: string = meta.confirmation_code ?? ""
  const expires: string = meta.confirmation_expires ?? ""

  if (!storedCode || !expires) {
    return NextResponse.json({ error: "Nenhum código pendente. Pede um novo." }, { status: 400 })
  }
  if (new Date(expires) < new Date()) {
    return NextResponse.json({ error: "Código expirado. Pede um novo." }, { status: 400 })
  }
  if (code.trim() !== storedCode) {
    return NextResponse.json({ error: "Código incorreto." }, { status: 400 })
  }

  // Clear code and mark confirmed
  await admin.auth.admin.updateUserById(user.id, {
    user_metadata: { confirmation_code: null, confirmation_expires: null, email_confirmed: true },
  })

  return NextResponse.json({ ok: true })
}
