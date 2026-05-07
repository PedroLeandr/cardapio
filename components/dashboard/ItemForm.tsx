"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImagePlus, X } from "lucide-react"
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

      if (uploadError) {
        toast.error("Erro ao fazer upload da imagem.")
        return
      }

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg bg-white overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-dm-sans text-[#1A1510]">{isEditing ? "Editar Item" : "Novo Item"}</SheetTitle>
          <SheetDescription className="font-dm-sans text-[#6B5E4E]">
            {isEditing ? "Altera os detalhes do prato." : "Adiciona um novo prato ao cardápio."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Imagem */}
          <div>
            <label className="block text-sm font-dm-sans font-medium text-[#1A1510] mb-1.5">Imagem</label>
            {imagePreview ? (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-[#E8E0D5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => { setImagePreview(null); setImageFile(null) }} className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center hover:bg-white">
                  <X className="w-3.5 h-3.5 text-[#1A1510]" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${dragOver ? "border-[#C8622A] bg-[#F5E6DC]" : "border-[#E8E0D5] bg-[#FAF8F4] hover:border-[#C8622A]/50 hover:bg-[#F5E6DC]/30"}`}
              >
                <ImagePlus className="w-6 h-6 text-[#A89880]" />
                <span className="text-xs font-dm-sans text-[#A89880]">Clica ou arrasta uma imagem</span>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
          </div>

          {/* Nome */}
          <div>
            <label className="block text-sm font-dm-sans font-medium text-[#1A1510] mb-1.5">Nome do Prato</label>
            <input {...register("name")} placeholder="Ex: Bacalhau à Brás" className="w-full px-3 py-2.5 bg-[#FAF8F4] border border-[#E8E0D5] rounded-lg text-sm font-dm-sans text-[#1A1510] placeholder-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#C8622A]/30 focus:border-[#C8622A] transition" />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-dm-sans font-medium text-[#1A1510] mb-1.5">
              Descrição <span className="text-[#A89880] font-normal">(opcional)</span>
            </label>
            <textarea {...register("description")} rows={3} placeholder="Breve descrição do prato..." className="w-full px-3 py-2.5 bg-[#FAF8F4] border border-[#E8E0D5] rounded-lg text-sm font-dm-sans text-[#1A1510] placeholder-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#C8622A]/30 focus:border-[#C8622A] transition resize-none" />
          </div>

          {/* Preço + Categoria */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-dm-sans font-medium text-[#1A1510] mb-1.5">Preço (€)</label>
              <input {...register("price")} type="number" step="0.01" min="0" placeholder="0.00" className="w-full px-3 py-2.5 bg-[#FAF8F4] border border-[#E8E0D5] rounded-lg text-sm font-dm-sans text-[#1A1510] placeholder-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#C8622A]/30 focus:border-[#C8622A] transition" />
              {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-dm-sans font-medium text-[#1A1510] mb-1.5">Categoria</label>
              <Select value={watch("category_id") ?? ""} onValueChange={(v) => setValue("category_id", v ?? "")}>
                <SelectTrigger className="bg-[#FAF8F4] border-[#E8E0D5] text-sm font-dm-sans text-[#1A1510]">
                  <SelectValue placeholder="Seleciona..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="font-dm-sans">{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && <p className="mt-1 text-xs text-red-600">{errors.category_id.message}</p>}
            </div>
          </div>

          {/* Disponibilidade */}
          <div className="flex items-center justify-between py-3 px-4 bg-[#FAF8F4] rounded-lg border border-[#E8E0D5]">
            <div>
              <p className="text-sm font-dm-sans font-medium text-[#1A1510]">Disponível</p>
              <p className="text-xs font-dm-sans text-[#A89880]">{isActive ? "Visível no cardápio" : "Marcado como esgotado"}</p>
            </div>
            <Switch checked={isActive} onCheckedChange={(v) => setValue("is_active", v)} className="data-[state=checked]:bg-[#C8622A]" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 border-[#E8E0D5] text-[#6B5E4E] hover:bg-[#F2EFE9] font-dm-sans">Cancelar</Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[#C8622A] hover:bg-[#A84E1E] text-white font-dm-sans">
              {isSubmitting ? "A guardar..." : isEditing ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
