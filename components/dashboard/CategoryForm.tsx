"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-dm-sans text-[#1A1510]">
            {isEditing ? "Editar Categoria" : "Nova Categoria"}
          </SheetTitle>
          <SheetDescription className="font-dm-sans text-[#6B5E4E]">
            {isEditing ? "Altera o nome da categoria." : "Adiciona uma nova secção ao teu cardápio."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-dm-sans font-medium text-[#1A1510] mb-1.5">
              Nome da Categoria
            </label>
            <input
              {...register("name")}
              placeholder="Ex: Entradas, Pratos Principais..."
              className="w-full px-3 py-2.5 bg-[#FAF8F4] border border-[#E8E0D5] rounded-lg text-sm font-dm-sans text-[#1A1510] placeholder-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#C8622A]/30 focus:border-[#C8622A] transition"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600 font-dm-sans">{errors.name.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 border-[#E8E0D5] text-[#6B5E4E] hover:bg-[#F2EFE9] font-dm-sans">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[#C8622A] hover:bg-[#A84E1E] text-white font-dm-sans">
              {isSubmitting ? "A guardar..." : isEditing ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
