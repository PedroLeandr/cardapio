"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Item, CartItem } from "@/lib/mock-data"

interface CartContextType {
  sessionId: string | null
  cartItems: CartItem[]
  addItem: (item: Item) => Promise<void>
  removeItem: (cartItemId: string) => Promise<void>
  updateQty: (cartItemId: string, qty: number) => Promise<void>
  total: number
  count: number
  loading: boolean
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ tableId, children }: { tableId: string; children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()

      const { data: existing } = await supabase
        .from("cart_sessions")
        .select("id")
        .eq("table_id", tableId)
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      let sid = existing?.id

      if (!sid) {
        const { data: newSession } = await supabase
          .from("cart_sessions")
          .insert({ table_id: tableId })
          .select("id")
          .single()
        sid = newSession?.id
      }

      if (!sid) { setLoading(false); return }
      setSessionId(sid)

      const { data: items } = await supabase
        .from("cart_items")
        .select("*")
        .eq("cart_session_id", sid)
        .order("created_at")

      setCartItems((items ?? []) as CartItem[])
      setLoading(false)
    }
    init()
  }, [tableId])

  const addItem = useCallback(async (item: Item) => {
    if (!sessionId) return
    const supabase = createClient()
    const existing = cartItems.find((ci) => ci.item_id === item.id)

    if (existing) {
      const newQty = existing.quantity + 1
      await supabase.from("cart_items").update({ quantity: newQty }).eq("id", existing.id)
      setCartItems((prev) => prev.map((ci) => ci.id === existing.id ? { ...ci, quantity: newQty } : ci))
    } else {
      const { data } = await supabase
        .from("cart_items")
        .insert({ cart_session_id: sessionId, item_id: item.id, item_name: item.name, item_price: item.price, quantity: 1 })
        .select("*")
        .single()
      if (data) setCartItems((prev) => [...prev, data as CartItem])
    }
  }, [sessionId, cartItems])

  const removeItem = useCallback(async (cartItemId: string) => {
    const supabase = createClient()
    await supabase.from("cart_items").delete().eq("id", cartItemId)
    setCartItems((prev) => prev.filter((ci) => ci.id !== cartItemId))
  }, [])

  const updateQty = useCallback(async (cartItemId: string, qty: number) => {
    if (qty <= 0) { await removeItem(cartItemId); return }
    const supabase = createClient()
    await supabase.from("cart_items").update({ quantity: qty }).eq("id", cartItemId)
    setCartItems((prev) => prev.map((ci) => ci.id === cartItemId ? { ...ci, quantity: qty } : ci))
  }, [removeItem])

  const total = cartItems.reduce((sum, ci) => sum + ci.item_price * ci.quantity, 0)
  const count = cartItems.reduce((sum, ci) => sum + ci.quantity, 0)

  return (
    <CartContext.Provider value={{ sessionId, cartItems, addItem, removeItem, updateQty, total, count, loading }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}
