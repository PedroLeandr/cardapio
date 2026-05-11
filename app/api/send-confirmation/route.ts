import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  const admin = createAdminClient()
  const { error: metaError } = await admin.auth.admin.updateUserById(user.id, {
    user_metadata: { confirmation_code: code, confirmation_expires: expires },
  })
  if (metaError) return NextResponse.json({ error: "Erro ao guardar código." }, { status: 500 })

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  })

  try {
    await transporter.sendMail({
      from: `"Cardápios Digitais" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: "O teu código de confirmação",
      html: `
        <div style="font-family: 'DM Sans', sans-serif; max-width: 480px; margin: 0 auto; background: #FAF8F4; padding: 40px 32px; border-radius: 16px; border: 1px solid #E8E0D5;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="width: 56px; height: 56px; background: #C8622A; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/><path d="m2 22 3-3"/></svg>
            </div>
            <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #1A1510;">Confirma o teu email</h1>
            <p style="margin: 8px 0 0; color: #A89880; font-size: 14px;">Usa o código abaixo para activar a tua conta.</p>
          </div>
          <div style="background: white; border-radius: 12px; padding: 28px; text-align: center; border: 1px solid #E8E0D5; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; font-size: 12px; color: #A89880; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">O teu código</p>
            <p style="margin: 0; font-size: 40px; font-weight: 800; letter-spacing: 0.2em; color: #C8622A; font-family: monospace;">${code}</p>
          </div>
          <p style="margin: 0; font-size: 12px; color: #A89880; text-align: center;">Este código expira em <strong>10 minutos</strong>. Se não pediste isto, ignora este email.</p>
        </div>
      `,
    })
  } catch {
    return NextResponse.json({ error: "Erro ao enviar email." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
