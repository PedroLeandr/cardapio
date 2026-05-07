import Link from "next/link"
import { UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-[#F5E6DC] flex items-center justify-center mx-auto mb-6">
          <UtensilsCrossed className="w-8 h-8 text-[#C8622A]" />
        </div>
        <h1 className="font-playfair text-3xl font-bold text-[#1A1510] mb-2">
          Cardápio não encontrado
        </h1>
        <p className="font-lato text-[#6B5E4E] mb-8">
          Este restaurante ainda não criou o seu cardápio digital ou o endereço está incorreto.
        </p>
        <Link href="/">
          <Button className="bg-[#C8622A] hover:bg-[#A84E1E] text-white font-dm-sans">
            Voltar ao início
          </Button>
        </Link>
      </div>
    </div>
  )
}
