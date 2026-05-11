"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { FolderOpen } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"
import type { Category } from "@/lib/mock-data"

const categorySchema = z.object({
  name: z.string().min(1, "O nome é obrigatório").max(60, "Máximo 60 caracteres"),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface CategoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  restaurantId: string
  onSuccess: () => void
}

export function CategoryForm({ open, onOpenChange, category, restaurantId, onSuccess }: CategoryFormProps) {
  const isEditing = !!category

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: category?.name ?? "" },
  })

  useEffect(() => {
    reset({ name: category?.name ?? "" })
  }, [category, reset])

  const onSubmit = async (data: CategoryFormValues) => {
    const supabase = createClient()

    if (isEditing) {
      const { error } = await supabase
        .from("categories")
        .update({ name: data.name })
        .eq("id", category.id)
      if (error) { toast.error("Erro ao atualizar categoria."); return }
      toast.success("Categoria atualizada!")
    } else {
      const { data: existing } = await supabase
        .from("categories")
        .select("position")
        .eq("restaurant_id", restaurantId)
        .order("position", { ascending: false })
        .limit(1)
        .single()

      const nextPosition = (existing?.position ?? 0) + 1

      const { error } = await supabase.from("categories").insert({
        name: data.name,
        restaurant_id: restaurantId,
        position: nextPosition,
      })
      if (error) { toast.error("Erro ao criar categoria."); return }
      toast.success("Categoria criada!")
    }

    reset()
    onSuccess()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-[#FAF8F4] border border-[#E8E0D5] shadow-xl shadow-[#1A1510]/8 p-0 overflow-hidden">
        {/* Header com faixa laranja */}
        <div className="bg-[#C8622A] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <FolderOpen className="w-4.5 h-4.5 text-white" />
            </div>
            <DialogHeader className="gap-0.5">
              <DialogTitle className="font-dm-sans font-bold text-white text-base leading-tight">
                {isEditing ? "Editar Categoria" : "Nova Categoria"}
              </DialogTitle>
              <DialogDescription className="font-dm-sans text-white/70 text-xs">
                {isEditing ? "Altera o nome da categoria." : "Adiciona uma nova secção ao teu cardápio."}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Corpo do formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-xs font-dm-sans font-semibold text-[#6B5E4E] uppercase tracking-wider mb-2">
              Nome da Categoria
            </label>
            <input
              {...register("name")}
              autoFocus
              placeholder="Ex: Entradas, Pratos Principais..."
              className="w-full px-3.5 py-2.5 bg-white border border-[#E8E0D5] rounded-xl text-sm font-dm-sans text-[#1A1510] placeholder-[#C4B8A8] focus:outline-none focus:ring-2 focus:ring-[#C8622A]/25 focus:border-[#C8622A] transition shadow-sm"
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-600 font-dm-sans">{errors.name.message}</p>
            )}
          </div>

          <div className="flex gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-[#E8E0D5] text-[#6B5E4E] hover:bg-[#F2EFE9] font-dm-sans"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#C8622A] hover:bg-[#A84E1E] text-white font-dm-sans font-medium shadow-sm shadow-[#C8622A]/20"
            >
              {isSubmitting ? "A guardar..." : isEditing ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
