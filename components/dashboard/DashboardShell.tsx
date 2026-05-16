"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderOpen,
  UtensilsCrossed,
  Settings,
  LogOut,
  Menu,
  X,
  Palette,
  Crown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"
import { PageLoader } from "./PageLoader"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/categories", label: "Categorias", icon: FolderOpen },
  { href: "/dashboard/items", label: "Itens", icon: UtensilsCrossed },
  { href: "/dashboard/design", label: "Design", icon: Palette },
  { href: "/dashboard/settings", label: "Configurações", icon: Settings },
]

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [plan, setPlan] = useState<"free" | "pro" | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from("restaurants")
        .select("plan")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => setPlan((data?.plan ?? "free") as "free" | "pro"))
    })
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success("Sessão terminada")
    window.location.href = "/login"
  }

  const PlanBadge = () => {
    if (!plan) return null
    return plan === "pro" ? (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30">
        <Crown className="w-3 h-3 text-amber-400" />
        <span className="font-dm-sans text-[11px] font-semibold text-amber-400">Pro</span>
      </div>
    ) : (
      <Link
        href="/dashboard/settings"
        className="flex items-center px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
      >
        <span className="font-dm-sans text-[11px] font-semibold text-[#7A6A5A]">Free</span>
      </Link>
    )
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#2A1E14]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#C8622A] flex items-center justify-center shadow-sm shadow-[#C8622A]/40">
            <UtensilsCrossed className="w-4 h-4 text-white" />
          </div>
          <span className="text-[#E8DDD0] font-dm-sans font-semibold text-sm tracking-tight">
            Cardápios Digitais
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/dashboard" ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-dm-sans font-medium transition-all duration-150 relative",
                isActive
                  ? "bg-[#2E2318] text-[#F5E6DC]"
                  : "text-[#7A6A5A] hover:bg-[#231A11] hover:text-[#C8A882]"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#C8622A] rounded-r-full" />
              )}
              <Icon className={cn("w-4 h-4 flex-shrink-0", isActive && "text-[#C8622A]")} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sair */}
      <div className="px-3 py-4 border-t border-[#2A1E14]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-dm-sans font-medium text-[#7A6A5A] hover:bg-[#231A11] hover:text-[#E8DDD0] transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </>
  )

  return (
    <div className="flex h-screen bg-[#F5F2EE] overflow-hidden">
      <PageLoader />
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-56 bg-[#1A1510] flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-56 bg-[#1A1510] transition-transform duration-200 ease-out md:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-5 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#7A6A5A] hover:text-[#E8DDD0] hover:bg-[#2E2318] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between gap-3 px-4 py-3.5 bg-white border-b border-[#E8E0D5] shadow-sm shadow-[#1A1510]/5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#1A1510] hover:bg-[#F2EFE9] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#C8622A] flex items-center justify-center">
                <UtensilsCrossed className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-dm-sans font-semibold text-[#1A1510] text-sm">
                Cardápios Digitais
              </span>
            </div>
          </div>
          {plan && (
            plan === "pro" ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-200">
                <Crown className="w-3 h-3 text-amber-600" />
                <span className="font-dm-sans text-[11px] font-semibold text-amber-700">Pro</span>
              </div>
            ) : (
              <Link
                href="/dashboard/settings"
                className="flex items-center px-2.5 py-1 rounded-full bg-[#F2EFE9] border border-[#E8E0D5] hover:bg-[#E8DDD0] transition-colors"
              >
                <span className="font-dm-sans text-[11px] font-semibold text-[#A89880]">Free</span>
              </Link>
            )
          )}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
