"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ImagePlus, UtensilsCrossed, X, CheckCircle2, XCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"
import type { Category, Item } from "@/lib/mock-data"

const itemSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório").max(80),
  description: z.string().max(300).optional(),
  price: z.string().min(1, "O preço é obrigatório").refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Preço inválido"),
  category_id: z.string().min(1, "Seleciona uma categoria"),
  is_active: z.boolean(),
})

type ItemFormValues = z.infer<typeof itemSchema>

interface ItemFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: Item | null
  categories: Category[]
  restaurantId: string
  onSuccess: () => void
}

export function ItemForm({ open, onOpenChange, item, categories, restaurantId, onSuccess }: ItemFormProps) {
  const isEditing = !!item
  const [imagePreview, setImagePreview] = useState<string | null>(item?.image_url ?? null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting }, reset } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: item?.name ?? "",
      description: item?.description ?? "",
      price: item?.price?.toString() ?? "",
      category_id: item?.category_id ?? "",
      is_active: item?.is_active ?? true,
    },
  })

  useEffect(() => {
    reset({
      name: item?.name ?? "",
      description: item?.description ?? "",
      price: item?.price?.toString() ?? "",
      category_id: item?.category_id ?? "",
      is_active: item?.is_active ?? true,
    })
    setImagePreview(item?.image_url ?? null)
    setImageFile(null)
  }, [item, reset])

  const isActive = watch("is_active")

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Ficheiro inválido. Usa uma imagem."); return }
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const onSubmit = async (data: ItemFormValues) => {
    const supabase = createClient()
    let imageUrl = item?.image_url ?? null

    if (imageFile) {
      const ext = imageFile.name.split(".").pop()
      const path = `${restaurantId}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(path, imageFile, { upsert: true })

      if (uploadError) { toast.error("Erro ao fazer upload da imagem."); return }

      const { data: urlData } = supabase.storage.from("menu-images").getPublicUrl(path)
      imageUrl = urlData.publicUrl
    }

    const payload = {
      name: data.name,
      description: data.description ?? "",
      price: Number(data.price),
      category_id: data.category_id,
      is_active: data.is_active,
      image_url: imageUrl,
    }

    if (isEditing) {
      const { error } = await supabase.from("items").update(payload).eq("id", item.id)
      if (error) { toast.error("Erro ao atualizar item."); return }
      toast.success("Item atualizado!")
    } else {
      const { data: existing } = await supabase
        .from("items")
        .select("position")
        .eq("category_id", data.category_id)
        .order("position", { ascending: false })
        .limit(1)
        .single()

      const { error } = await supabase.from("items").insert({
        ...payload,
        position: (existing?.position ?? 0) + 1,
      })
      if (error) { toast.error("Erro ao criar item."); return }
      toast.success("Item criado!")
    }

    reset()
    setImagePreview(null)
    setImageFile(null)
    onSuccess()
    onOpenChange(false)
  }

  const inputClass = "w-full px-3.5 py-2.5 bg-white border border-[#E8E0D5] rounded-xl text-sm font-dm-sans text-[#1A1510] placeholder-[#C4B8A8] focus:outline-none focus:ring-2 focus:ring-[#C8622A]/25 focus:border-[#C8622A] transition shadow-sm"
  const labelClass = "block text-xs font-dm-sans font-semibold text-[#6B5E4E] uppercase tracking-wider mb-2"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-[#FAF8F4] border border-[#E8E0D5] shadow-xl shadow-[#1A1510]/8 p-0 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header laranja */}
        <div className="bg-[#C8622A] px-6 py-5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <UtensilsCrossed className="w-4.5 h-4.5 text-white" />
            </div>
            <DialogHeader className="gap-0.5">
              <DialogTitle className="font-dm-sans font-bold text-white text-base leading-tight">
                {isEditing ? "Editar Item" : "Novo Item"}
              </DialogTitle>
              <DialogDescription className="font-dm-sans text-white/70 text-xs">
                {isEditing ? "Altera os detalhes do prato." : "Adiciona um novo prato ao cardápio."}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Corpo com scroll */}
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Imagem */}
          <div>
            <label className={labelClass}>Imagem</label>
            {imagePreview ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-[#E8E0D5] shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImagePreview(null); setImageFile(null) }}
                  className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-sm transition"
                >
                  <X className="w-3.5 h-3.5 text-[#1A1510]" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${dragOver ? "border-[#C8622A] bg-[#F5E6DC]" : "border-[#E8E0D5] bg-white hover:border-[#C8622A]/50 hover:bg-[#F5E6DC]/30"}`}
              >
                <ImagePlus className="w-6 h-6 text-[#A89880]" />
                <span className="text-xs font-dm-sans text-[#A89880]">Clica ou arrasta uma imagem</span>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
          </div>

          {/* Nome */}
          <div>
            <label className={labelClass}>Nome do Prato</label>
            <input {...register("name")} autoFocus placeholder="Ex: Bacalhau à Brás" className={inputClass} />
            {errors.name && <p className="mt-1.5 text-xs text-red-600 font-dm-sans">{errors.name.message}</p>}
          </div>

          {/* Descrição */}
          <div>
            <label className={labelClass}>
              Descrição <span className="text-[#A89880] normal-case font-normal tracking-normal">(opcional)</span>
            </label>
            <textarea {...register("description")} rows={3} placeholder="Breve descrição do prato..." className={`${inputClass} resize-none`} />
          </div>

          {/* Preço + Categoria */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Preço (€)</label>
              <input {...register("price")} type="number" step="0.01" min="0" placeholder="0.00" className={inputClass} />
              {errors.price && <p className="mt-1.5 text-xs text-red-600 font-dm-sans">{errors.price.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Categoria</label>
              <select
                {...register("category_id")}
                className={`${inputClass} ${!watch("category_id") ? "text-[#C4B8A8]" : ""}`}
              >
                <option value="" disabled hidden>Seleciona...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="text-[#1A1510]">{cat.name}</option>
                ))}
              </select>
              {errors.category_id && <p className="mt-1.5 text-xs text-red-600 font-dm-sans">{errors.category_id.message}</p>}
            </div>
          </div>

          {/* Disponibilidade */}
          <div>
            <label className={labelClass}>Disponibilidade</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setValue("is_active", true)}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-dm-sans font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200"
                    : "bg-white border-[#E8E0D5] text-[#A89880] hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Disponível
              </button>
              <button
                type="button"
                onClick={() => setValue("is_active", false)}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-dm-sans font-semibold transition-all duration-200 ${
                  !isActive
                    ? "bg-red-500 border-red-500 text-white shadow-md shadow-red-200"
                    : "bg-white border-[#E8E0D5] text-[#A89880] hover:border-red-300 hover:text-red-500 hover:bg-red-50"
                }`}
              >
                <XCircle className="w-4 h-4 flex-shrink-0" />
                Esgotado
              </button>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-2.5 pt-1 pb-1">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 border-[#E8E0D5] text-[#6B5E4E] hover:bg-[#F2EFE9] font-dm-sans">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[#C8622A] hover:bg-[#A84E1E] text-white font-dm-sans font-medium shadow-sm shadow-[#C8622A]/20">
              {isSubmitting ? "A guardar..." : isEditing ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
