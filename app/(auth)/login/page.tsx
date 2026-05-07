"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { UtensilsCrossed, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
})

type LoginValues = z.infer<typeof loginSchema>

const inputClass = "w-full px-4 py-3 bg-[#F5F2EE] border border-[#E8E0D5] rounded-xl text-sm font-dm-sans text-[#1A1510] placeholder-[#B8A898] focus:outline-none focus:ring-2 focus:ring-[#C8622A]/25 focus:border-[#C8622A] focus:bg-white transition-all duration-150"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginValues) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      toast.error("Email ou senha incorretos.")
      return
    }
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Marca */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#C8622A] flex items-center justify-center mb-4 shadow-lg shadow-[#C8622A]/25">
            <UtensilsCrossed className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-playfair text-2xl font-bold text-[#1A1510]">Cardápios Digitais</h1>
          <p className="font-dm-sans text-sm text-[#A89880] mt-1">Acede ao teu painel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#E8E0D5] p-6 shadow-sm shadow-[#1A1510]/5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-dm-sans font-semibold text-[#6B5E4E] uppercase tracking-wide mb-2">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="o.teu@email.com"
                autoComplete="email"
                className={inputClass}
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-500 font-dm-sans">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-dm-sans font-semibold text-[#6B5E4E] uppercase tracking-wide mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B8A898] hover:text-[#6B5E4E] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-500 font-dm-sans">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#C8622A] hover:bg-[#A84E1E] active:bg-[#8C3E14] text-white font-dm-sans font-semibold h-11 rounded-xl mt-1 transition-colors"
            >
              {isSubmitting ? "A entrar..." : "Entrar"}
            </Button>
          </form>
        </div>

        <p className="text-center font-dm-sans text-sm text-[#A89880] mt-5">
          Não tens conta?{" "}
          <Link href="/register" className="text-[#C8622A] hover:text-[#A84E1E] font-semibold transition-colors">
            Regista-te grátis
          </Link>
        </p>
      </div>
    </div>
  )
}
