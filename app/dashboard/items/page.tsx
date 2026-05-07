"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { DashboardShell } from "@/components/dashboard/DashboardShell"
import { ItemForm } from "@/components/dashboard/ItemForm"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, UtensilsCrossed } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { formatPrice } from "@/lib/utils"
import toast from "react-hot-toast"
import type { Category, Item } from "@/lib/mock-data"

export default function ItemsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [restaurantId, setRestaurantId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null)

  const fetchData = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!restaurant) return
    setRestaurantId(restaurant.id)

    const { data: cats } = await supabase
      .from("categories")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .order("position")

    const catIds = (cats ?? []).map((c) => c.id)

    const its = catIds.length > 0
      ? (await supabase.from("items").select("*").in("category_id", catIds).order("position")).data
      : []

    setCategories(cats ?? [])
    setItems(its ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    const supabase = createClient()
    const { error } = await supabase.from("items").delete().eq("id", deleteTarget.id)
    if (error) { toast.error("Erro ao eliminar item."); return }
    toast.success("Item eliminado.")
    setDeleteTarget(null)
    fetchData()
  }

  const toggleActive = async (item: Item) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("items")
      .update({ is_active: !item.is_active })
      .eq("id", item.id)
    if (error) { toast.error("Erro ao atualizar item."); return }
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, is_active: !i.is_active } : i))
  }

  const itemsByCategory = categories
    .map((cat) => ({
      ...cat,
      items: items.filter((i) => i.category_id === cat.id).sort((a, b) => a.position - b.position),
    }))
    .filter((cat) => cat.items.length > 0)

  if (loading) {
    return (
      <DashboardShell>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-white rounded-xl border border-[#E8E0D5] animate-pulse" />
          ))}
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-dm-sans text-2xl font-bold text-[#1A1510]">Itens</h1>
          <p className="font-dm-sans text-sm text-[#A89880] mt-1">Gere os pratos do teu cardápio</p>
        </div>
        <Button
          onClick={() => { setEditingItem(null); setFormOpen(true) }}
          className="bg-[#C8622A] hover:bg-[#A84E1E] text-white font-dm-sans gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Item
        </Button>
      </div>

      {items.length === 0 && (
        <div className="bg-white rounded-xl border border-[#E8E0D5] py-16 flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[#F2EFE9] flex items-center justify-center">
            <UtensilsCrossed className="w-7 h-7 text-[#A89880]" />
          </div>
          <p className="font-dm-sans font-medium text-[#1A1510]">Sem pratos ainda</p>
          <p className="font-dm-sans text-sm text-[#A89880]">Adiciona o teu primeiro prato</p>
          <Button onClick={() => setFormOpen(true)} className="mt-2 bg-[#C8622A] hover:bg-[#A84E1E] text-white font-dm-sans gap-2">
            <Plus className="w-4 h-4" />
            Novo Item
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {itemsByCategory.map((cat) => (
          <div key={cat.id}>
            <h2 className="font-dm-sans font-semibold text-sm text-[#A89880] uppercase tracking-wide mb-3">{cat.name}</h2>
            <div className="bg-white rounded-xl border border-[#E8E0D5] overflow-hidden">
              {cat.items.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 px-5 py-3.5 hover:bg-[#FAF8F4] transition-colors ${idx !== 0 ? "border-t border-[#F2EFE9]" : ""}`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F2EFE9] flex-shrink-0">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} width={48} height={48} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UtensilsCrossed className="w-5 h-5 text-[#A89880]" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-dm-sans font-medium text-sm text-[#1A1510] truncate">{item.name}</p>
                      {!item.is_active && (
                        <Badge variant="secondary" className="text-xs bg-[#F5F0EB] text-[#A89880] border-none">Esgotado</Badge>
                      )}
                    </div>
                    <p className="font-dm-sans text-sm font-semibold text-[#C8622A] mt-0.5">{formatPrice(item.price)}</p>
                  </div>

                  <Switch
                    checked={item.is_active}
                    onCheckedChange={() => toggleActive(item)}
                    className="data-[state=checked]:bg-[#C8622A]"
                  />

                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditingItem(item); setFormOpen(true) }} className="p-2 rounded-lg text-[#A89880] hover:text-[#1A1510] hover:bg-[#F2EFE9] transition">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(item)} className="p-2 rounded-lg text-[#A89880] hover:text-red-600 hover:bg-red-50 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ItemForm
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingItem(null) }}
        item={editingItem}
        categories={categories}
        restaurantId={restaurantId}
        onSuccess={() => { setEditingItem(null); fetchData() }}
      />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-dm-sans text-[#1A1510]">Eliminar Prato</DialogTitle>
            <DialogDescription className="font-dm-sans text-[#6B5E4E]">
              Tens a certeza que queres eliminar <strong className="text-[#1A1510]">{deleteTarget?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} className="border-[#E8E0D5] text-[#6B5E4E] hover:bg-[#F2EFE9] font-dm-sans">Cancelar</Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-dm-sans">Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
