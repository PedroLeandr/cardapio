"use client"

import { useEffect, useRef, useState } from "react"
import { DashboardShell } from "@/components/dashboard/DashboardShell"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, QrCode, ShoppingBag, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { formatPrice } from "@/lib/utils"
import toast from "react-hot-toast"
import QRCode from "qrcode"
import type { Table, CartItem } from "@/lib/mock-data"

interface TableWithCart extends Table {
  sessionId: string | null
  cartItems: CartItem[]
}

export default function MesasPage() {
  const [tables, setTables] = useState<TableWithCart[]>([])
  const [restaurantId, setRestaurantId] = useState("")
  const [restaurantSlug, setRestaurantSlug] = useState("")
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState("")
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const qrRefs = useRef<Record<string, HTMLCanvasElement | null>>({})

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3333"

  const fetchData = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id, slug")
      .eq("user_id", user.id)
      .single()

    if (!restaurant) return
    setRestaurantId(restaurant.id)
    setRestaurantSlug(restaurant.slug)

    const { data: tablesData } = await supabase
      .from("tables")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .order("created_at")

    if (!tablesData?.length) {
      setTables([])
      setLoading(false)
      return
    }

    const tableIds = tablesData.map((t) => t.id)

    const { data: sessions } = await supabase
      .from("cart_sessions")
      .select("id, table_id")
      .in("table_id", tableIds)
      .eq("status", "open")

    const sessionIds = (sessions ?? []).map((s) => s.id)

    const { data: cartItemsData } = sessionIds.length > 0
      ? await supabase.from("cart_items").select("*").in("cart_session_id", sessionIds)
      : { data: [] }

    const result: TableWithCart[] = tablesData.map((t) => {
      const session = (sessions ?? []).find((s) => s.table_id === t.id)
      const items = session
        ? (cartItemsData ?? []).filter((ci) => ci.cart_session_id === session.id)
        : []
      return { ...t, sessionId: session?.id ?? null, cartItems: items as CartItem[] }
    })

    setTables(result)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    tables.forEach((t) => {
      const canvas = qrRefs.current[t.id]
      if (canvas) {
        const url = `${siteUrl}/${restaurantSlug}/mesa/${t.id}`
        QRCode.toCanvas(canvas, url, { width: 120, margin: 1, color: { dark: "#1A1510", light: "#FFFFFF" } })
      }
    })
  }, [tables, restaurantSlug, siteUrl])

  const handleAdd = async () => {
    if (!newName.trim()) return
    setAdding(true)
    const supabase = createClient()
    const { error } = await supabase
      .from("tables")
      .insert({ restaurant_id: restaurantId, name: newName.trim() })

    if (error) { toast.error("Erro ao criar mesa."); setAdding(false); return }
    toast.success("Mesa criada!")
    setNewName("")
    setShowForm(false)
    setAdding(false)
    fetchData()
  }

  const handleDelete = async (tableId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("tables").delete().eq("id", tableId)
    if (error) { toast.error("Erro ao eliminar mesa."); return }
    toast.success("Mesa eliminada.")
    fetchData()
  }

  const handleClear = async (tableId: string, sessionId: string | null) => {
    if (!sessionId) return
    const supabase = createClient()
    await supabase.from("cart_sessions").update({ status: "closed" }).eq("id", sessionId)
    toast.success("Mesa limpa.")
    fetchData()
  }

  const handleDownloadQR = (tableId: string, tableName: string) => {
    const canvas = qrRefs.current[tableId]
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `qr-${tableName.toLowerCase().replace(/\s+/g, "-")}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
    toast.success("QR code transferido!")
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white rounded-xl border border-[#E8E0D5] animate-pulse" />
          ))}
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-dm-sans text-2xl font-bold text-[#1A1510]">Mesas</h1>
          <p className="font-dm-sans text-sm text-[#A89880] mt-1">Gere as mesas e vê os pedidos em aberto</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#C8622A] hover:bg-[#A84E1E] text-white font-dm-sans gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Mesa
        </Button>
      </div>

      {/* Form nova mesa */}
      {showForm && (
        <div className="bg-white rounded-xl border border-[#E8E0D5] p-5 mb-4 flex items-center gap-3">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Ex: Mesa 1, Esplanada 3..."
            className="flex-1 px-3.5 py-2.5 bg-[#FAF8F4] border border-[#E8E0D5] rounded-xl text-sm font-dm-sans text-[#1A1510] placeholder-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#C8622A]/30 focus:border-[#C8622A] transition"
          />
          <Button
            onClick={handleAdd}
            disabled={adding || !newName.trim()}
            className="bg-[#C8622A] hover:bg-[#A84E1E] text-white font-dm-sans"
          >
            {adding ? "A criar..." : "Criar"}
          </Button>
          <button
            onClick={() => { setShowForm(false); setNewName("") }}
            className="p-2 rounded-lg text-[#A89880] hover:bg-[#F2EFE9] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {tables.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E8E0D5] py-16 flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[#F2EFE9] flex items-center justify-center">
            <QrCode className="w-7 h-7 text-[#A89880]" />
          </div>
          <p className="font-dm-sans font-medium text-[#1A1510]">Sem mesas ainda</p>
          <p className="font-dm-sans text-sm text-[#A89880]">Cria a primeira mesa para gerar o QR code</p>
          <Button onClick={() => setShowForm(true)} className="mt-2 bg-[#C8622A] hover:bg-[#A84E1E] text-white font-dm-sans gap-2">
            <Plus className="w-4 h-4" />
            Nova Mesa
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {tables.map((t) => {
            const cartTotal = t.cartItems.reduce((sum, ci) => sum + ci.item_price * ci.quantity, 0)
            const cartCount = t.cartItems.reduce((sum, ci) => sum + ci.quantity, 0)
            const mesaUrl = `${siteUrl}/${restaurantSlug}/mesa/${t.id}`

            return (
              <div key={t.id} className="bg-white rounded-xl border border-[#E8E0D5] p-5">
                <div className="flex items-start gap-5">
                  {/* QR code */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className="p-2 bg-[#FAF8F4] rounded-xl border border-[#EAE4DC]">
                      <canvas
                        ref={(el) => { qrRefs.current[t.id] = el }}
                        width={120}
                        height={120}
                      />
                    </div>
                    <button
                      onClick={() => handleDownloadQR(t.id, t.name)}
                      className="text-xs font-dm-sans font-medium text-[#C8622A] hover:text-[#A84E1E] transition-colors"
                    >
                      Download QR
                    </button>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-dm-sans font-bold text-lg text-[#1A1510]">{t.name}</h3>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-2 rounded-lg text-[#A89880] hover:text-red-600 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="font-mono text-[11px] text-[#A89880] mb-4 truncate">{mesaUrl}</p>

                    {/* Carrinho ativo */}
                    {t.cartItems.length > 0 ? (
                      <div className="bg-[#FAF8F4] rounded-xl border border-[#EAE4DC] p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-[#C8622A]" />
                            <span className="font-dm-sans font-semibold text-sm text-[#1A1510]">
                              Pedido em aberto — {cartCount} {cartCount === 1 ? "item" : "itens"}
                            </span>
                          </div>
                          <button
                            onClick={() => handleClear(t.id, t.sessionId)}
                            className="text-xs font-dm-sans font-medium text-[#6B5E4E] hover:text-red-600 transition-colors border border-[#E8E0D5] px-2.5 py-1 rounded-lg hover:border-red-200 hover:bg-red-50"
                          >
                            Limpar mesa
                          </button>
                        </div>
                        <div className="space-y-1.5 mb-3">
                          {t.cartItems.map((ci) => (
                            <div key={ci.id} className="flex items-center justify-between text-sm">
                              <span className="font-dm-sans text-[#6B5E4E]">
                                <span className="font-semibold">{ci.quantity}×</span> {ci.item_name}
                              </span>
                              <span className="font-dm-sans font-semibold text-[#1A1510]">
                                {formatPrice(ci.item_price * ci.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between border-t border-[#E8E0D5] pt-2">
                          <span className="font-dm-sans font-semibold text-sm text-[#1A1510]">Total</span>
                          <span className="font-dm-sans font-bold text-base text-[#C8622A]">{formatPrice(cartTotal)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-[#A89880]">
                        <div className="w-2 h-2 rounded-full bg-[#D8CBBF]" />
                        <span className="font-dm-sans text-sm">Mesa livre</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </DashboardShell>
  )
}
