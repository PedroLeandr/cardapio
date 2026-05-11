"use client"

import { useEffect, useRef, useState } from "react"
import { UtensilsCrossed, Mail, RotateCcw, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"

export default function ConfirmationPage() {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""))
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [confirmed, setConfirmed] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email)
    })
  }, [])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  const focusInput = (i: number) => inputRefs.current[i]?.focus()

  const handleChange = (i: number, val: string) => {
    const char = val.replace(/\D/g, "").slice(-1)
    const next = [...digits]
    next[i] = char
    setDigits(next)
    if (char && i < 5) focusInput(i + 1)
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (digits[i]) {
        const next = [...digits]
        next[i] = ""
        setDigits(next)
      } else if (i > 0) {
        focusInput(i - 1)
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      focusInput(i - 1)
    } else if (e.key === "ArrowRight" && i < 5) {
      focusInput(i + 1)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const chars = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("")
    const next = Array(6).fill("")
    chars.forEach((c, idx) => { next[idx] = c })
    setDigits(next)
    focusInput(Math.min(chars.length, 5))
  }

  const handleSubmit = async () => {
    const code = digits.join("")
    if (code.length < 6) { toast.error("Introduz os 6 dígitos."); return }

    setSubmitting(true)
    const res = await fetch("/api/verify-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
    const data = await res.json()
    setSubmitting(false)

    if (!res.ok || data.error) {
      toast.error(data.error ?? "Código inválido.")
      setDigits(Array(6).fill(""))
      focusInput(0)
      return
    }

    setConfirmed(true)
    setTimeout(() => { window.location.href = "/dashboard" }, 1800)
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    const res = await fetch("/api/send-confirmation", { method: "POST" })
    const data = await res.json()
    if (!res.ok || data.error) { toast.error(data.error ?? "Erro ao reenviar."); return }
    toast.success("Novo código enviado!")
    setResendCooldown(60)
    setDigits(Array(6).fill(""))
    focusInput(0)
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="w-20 h-20 rounded-full bg-[#C8622A]/10 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-[#C8622A]" />
          </div>
          <div>
            <h2 className="font-playfair text-2xl font-bold text-[#1A1510]">Email confirmado!</h2>
            <p className="font-dm-sans text-sm text-[#A89880] mt-1">A redirecionar para o dashboard…</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#C8622A] flex items-center justify-center mb-4 shadow-lg shadow-[#C8622A]/20">
            <UtensilsCrossed className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-playfair text-2xl font-bold text-[#1A1510]">Confirma o teu email</h1>
          <p className="font-dm-sans text-sm text-[#A89880] mt-1 text-center">
            Enviámos um código de 6 dígitos para
          </p>
          {email && (
            <div className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-[#F2EFE9] rounded-full border border-[#E8E0D5]">
              <Mail className="w-3.5 h-3.5 text-[#A89880] flex-shrink-0" />
              <span className="font-mono text-xs text-[#6B5E4E] truncate max-w-[220px]">{email}</span>
            </div>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#E8E0D5] p-7 shadow-sm shadow-[#1A1510]/5">
          <label className="block text-xs font-dm-sans font-semibold text-[#6B5E4E] uppercase tracking-wide mb-4 text-center">
            Código de confirmação
          </label>

          {/* OTP inputs */}
          <div className="flex gap-2.5 justify-center mb-6" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                autoFocus={i === 0}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onFocus={(e) => e.target.select()}
                className={`
                  w-11 h-14 text-center text-xl font-dm-sans font-bold rounded-xl border transition-all duration-150
                  focus:outline-none focus:ring-2 focus:ring-[#C8622A]/30 focus:border-[#C8622A]
                  ${d
                    ? "bg-[#FDF6F2] border-[#C8622A] text-[#C8622A]"
                    : "bg-[#FAF8F4] border-[#E8E0D5] text-[#1A1510]"
                  }
                `}
              />
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitting || digits.join("").length < 6}
            className="w-full bg-[#C8622A] hover:bg-[#A84E1E] active:bg-[#8C3E14] text-white font-dm-sans font-semibold h-11 rounded-xl transition-colors disabled:opacity-50"
          >
            {submitting ? "A verificar…" : "Confirmar email"}
          </Button>
        </div>

        {/* Resend */}
        <div className="text-center mt-5">
          <p className="font-dm-sans text-sm text-[#A89880]">
            Não recebeste o código?{" "}
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="text-[#C8622A] hover:text-[#A84E1E] font-semibold transition-colors disabled:text-[#A89880] disabled:cursor-default"
            >
              {resendCooldown > 0 ? (
                <span className="inline-flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" />
                  {resendCooldown}s
                </span>
              ) : "Reenviar"}
            </button>
          </p>
        </div>

      </div>
    </div>
  )
}
