"use client"

import { useEffect, useState } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { DashboardShell } from "@/components/dashboard/DashboardShell"
import { CategoryForm } from "@/components/dashboard/CategoryForm"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, FolderOpen, GripVertical } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { UpgradeBanner } from "@/components/dashboard/UpgradeBanner"
import toast from "react-hot-toast"
import type { Category } from "@/lib/mock-data"

const FREE_CATEGORIES_LIMIT = 3

function SortableCategory({
  cat,
  idx,
  onEdit,
  onDelete,
}: {
  cat: Category
  idx: number
  onEdit: (cat: Category) => void
  onDelete: (cat: Category) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-4 px-5 py-4 transition-colors ${idx !== 0 ? "border-t border-[#F2EFE9]" : ""} ${isDragging ? "bg-[#FAF8F4] opacity-75 z-10 relative" : "hover:bg-[#FAF8F4]"}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 rounded text-[#C8B9A8] hover:text-[#A89880] transition touch-none"
        aria-label="Arrastar"
      >
        <GripVertical className="w-4 h-4" />
      </button>


      <div className="w-9 h-9 rounded-lg bg-[#F5E6DC] flex items-center justify-center flex-shrink-0">
        <FolderOpen className="w-4 h-4 text-[#C8622A]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-dm-sans font-medium text-[#1A1510] truncate">{cat.name}</p>
        <p className="font-dm-sans text-xs text-[#A89880]">{(cat as any).items?.[0]?.count ?? 0} itens</p>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={() => onEdit(cat)} className="p-2 rounded-lg text-[#A89880] hover:text-[#1A1510] hover:bg-[#F2EFE9] transition">
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(cat)} className="p-2 rounded-lg text-[#A89880] hover:text-red-600 hover:bg-red-50 transition">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [restaurantId, setRestaurantId] = useState<string>("")
  const [plan, setPlan] = useState<string>("free")
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const fetchCategories = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id, plan")
      .eq("user_id", user.id)
      .single()

    if (!restaurant) return
    setRestaurantId(restaurant.id)
    setPlan(restaurant.plan ?? "free")

    const { data } = await supabase
      .from("categories")
      .select("*, items(count)")
      .eq("restaurant_id", restaurant.id)
      .order("position")

    setCategories(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchCategories() }, [])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = categories.findIndex((c) => c.id === active.id)
    const newIndex = categories.findIndex((c) => c.id === over.id)
    const reordered = arrayMove(categories, oldIndex, newIndex)

    setCategories(reordered)

    const supabase = createClient()
    await Promise.all(
      reordered.map((cat, idx) =>
        supabase.from("categories").update({ position: idx }).eq("id", cat.id)
      )
    )
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const supabase = createClient()
    const { error } = await supabase.from("categories").delete().eq("id", deleteTarget.id)
    if (error) { toast.error("Erro ao eliminar categoria."); return }
    toast.success("Categoria eliminada.")
    setDeleteTarget(null)
    fetchCategories()
  }

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
          <h1 className="font-dm-sans text-2xl font-bold text-[#1A1510]">Categorias</h1>
          <p className="font-dm-sans text-sm text-[#A89880] mt-1">Organiza o teu cardápio em secções</p>
        </div>
        <Button
          onClick={() => { setEditingCategory(null); setFormOpen(true) }}
          disabled={plan === "free" && categories.length >= FREE_CATEGORIES_LIMIT}
          className="bg-[#C8622A] hover:bg-[#A84E1E] text-white font-dm-sans gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Nova Categoria
        </Button>
      </div>

      <UpgradeBanner type="categories" current={categories.length} limit={plan === "free" ? FREE_CATEGORIES_LIMIT : Infinity} />

      {categories.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E8E0D5] py-16 flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[#F2EFE9] flex items-center justify-center">
            <FolderOpen className="w-7 h-7 text-[#A89880]" />
          </div>
          <p className="font-dm-sans font-medium text-[#1A1510]">Sem categorias ainda</p>
          <p className="font-dm-sans text-sm text-[#A89880]">Cria a tua primeira categoria para começar</p>
          <Button
            onClick={() => setFormOpen(true)}
            disabled={plan === "free" && categories.length >= FREE_CATEGORIES_LIMIT}
            className="mt-2 bg-[#C8622A] hover:bg-[#A84E1E] text-white font-dm-sans gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Nova Categoria
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E8E0D5] overflow-hidden">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              {categories.map((cat, idx) => (
                <SortableCategory
                  key={cat.id}
                  cat={cat}
                  idx={idx}
                  onEdit={(c) => { setEditingCategory(c); setFormOpen(true) }}
                  onDelete={setDeleteTarget}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      <CategoryForm
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingCategory(null) }}
        category={editingCategory}
        restaurantId={restaurantId}
        onSuccess={() => { setEditingCategory(null); fetchCategories() }}
      />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-dm-sans text-[#1A1510]">Eliminar Categoria</DialogTitle>
            <DialogDescription className="font-dm-sans text-[#6B5E4E]">
              Tens a certeza que queres eliminar <strong className="text-[#1A1510]">{deleteTarget?.name}</strong>? Os pratos desta categoria também serão eliminados.
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
