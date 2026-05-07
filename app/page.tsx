import Link from "next/link"
import { UtensilsCrossed, QrCode, Smartphone, Zap, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: QrCode,
    title: "QR Code Automático",
    description:
      "Gera e faz download do QR code do teu cardápio com um clique. Imprime e coloca nas mesas.",
  },
  {
    icon: Smartphone,
    title: "Perfeito no Mobile",
    description:
      "Os teus clientes abrem o cardápio no telemóvel sem instalar nada. Rápido, bonito e intuitivo.",
  },
  {
    icon: Zap,
    title: "Atualiza em Segundos",
    description:
      "Acabou o prato do dia? Marca como esgotado e o cardápio atualiza-se automaticamente.",
  },
]

const benefits = [
  "Sem custos mensais",
  "Sem app para instalar",
  "Sem contrato",
  "Atualiza em tempo real",
  "QR code incluído",
  "Suporte em português",
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#C8622A] flex items-center justify-center shadow-md shadow-[#C8622A]/20">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <span className="font-playfair font-bold text-lg text-[#1A1510]">
            Cardápios Digitais
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="font-dm-sans text-sm text-[#6B5E4E] hover:text-[#1A1510] transition-colors"
          >
            Entrar
          </Link>
          <Link href="/register">
            <Button className="bg-[#C8622A] hover:bg-[#A84E1E] text-white font-dm-sans text-sm">
              Começar grátis
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5E6DC] border border-[#E8D5C8] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8622A]" />
          <span className="font-dm-sans text-xs font-medium text-[#C8622A]">
            100% gratuito — sem cartão de crédito
          </span>
        </div>

        <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-[#1A1510] leading-tight mb-6">
          O cardápio digital
          <br />
          <span className="text-[#C8622A]">que o teu restaurante</span>
          <br />
          merece
        </h1>

        <p className="font-lato text-lg text-[#6B5E4E] max-w-xl mx-auto mb-10 leading-relaxed">
          Cria o teu cardápio digital em minutos. Os teus clientes acedem pelo
          QR code ou link — sem app, sem fricção, com uma experiência premium.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/register">
            <Button className="w-full sm:w-auto bg-[#C8622A] hover:bg-[#A84E1E] text-white font-dm-sans font-medium px-8 py-3 text-base gap-2">
              Criar o meu cardápio
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/demo">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-[#E8E0D5] text-[#6B5E4E] hover:bg-[#F2EFE9] font-dm-sans font-medium px-8 py-3 text-base"
            >
              Ver exemplo ao vivo
            </Button>
          </Link>
        </div>
      </section>

      {/* Mockup do cardápio */}
      <section className="max-w-3xl mx-auto px-6 mb-20">
        <div className="bg-white rounded-2xl border border-[#E8E0D5] shadow-xl shadow-[#1A1510]/5 overflow-hidden">
          {/* Header mockup */}
          <div className="bg-[#FAF8F4] px-6 py-5 border-b border-[#E8E0D5]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F5E6DC] border-2 border-[#E8D5C8] flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-[#C8622A]" />
              </div>
              <div>
                <div className="h-5 w-32 bg-[#1A1510] rounded-md mb-1.5" />
                <div className="h-3 w-48 bg-[#E8E0D5] rounded-md" />
              </div>
            </div>
          </div>
          {/* Nav mockup */}
          <div className="bg-[#FAF8F4] px-6 py-3 border-b border-[#E8E0D5] flex gap-2">
            <div className="px-4 py-1.5 rounded-full bg-[#C8622A] text-white text-xs font-dm-sans font-medium">
              Entradas
            </div>
            <div className="px-4 py-1.5 rounded-full bg-[#F2EFE9] text-[#6B5E4E] text-xs font-dm-sans">
              Pratos Principais
            </div>
            <div className="px-4 py-1.5 rounded-full bg-[#F2EFE9] text-[#6B5E4E] text-xs font-dm-sans">
              Sobremesas
            </div>
          </div>
          {/* Items mockup */}
          <div className="px-6 py-5 space-y-3">
            {[
              { name: "Caldo Verde", price: "4,50 €", desc: "Sopa tradicional de couve galega com chouriço" },
              { name: "Pataniscas de Bacalhau", price: "8,50 €", desc: "Frituras de bacalhau com salsa fresca" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-4 bg-[#FAF8F4] rounded-xl border border-[#E8E0D5]">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#F5E6DC] to-[#F2EFE9] flex items-center justify-center flex-shrink-0">
                  <UtensilsCrossed className="w-6 h-6 text-[#A89880]" />
                </div>
                <div className="flex-1">
                  <p className="font-playfair font-semibold text-[#1A1510] text-sm">
                    {item.name}
                  </p>
                  <p className="font-lato text-xs text-[#6B5E4E] mt-0.5">
                    {item.desc}
                  </p>
                  <p className="font-lato font-semibold text-sm text-[#C8622A] mt-1.5">
                    {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl font-bold text-[#1A1510] mb-3">
            Tudo o que precisas
          </h2>
          <p className="font-lato text-[#6B5E4E]">
            Sem complicações, sem surpresas.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-[#E8E0D5] p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 rounded-xl bg-[#F5E6DC] flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-[#C8622A]" />
              </div>
              <h3 className="font-dm-sans font-semibold text-[#1A1510] mb-2">
                {title}
              </h3>
              <p className="font-dm-sans text-sm text-[#6B5E4E] leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-[#1A1510] rounded-2xl p-8 md:p-12 text-center">
          <h2 className="font-playfair text-3xl font-bold text-[#E8DDD0] mb-3">
            Grátis para sempre
          </h2>
          <p className="font-lato text-[#A89880] mb-8">
            Sem truques, sem planos premium escondidos.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10 max-w-lg mx-auto">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C8622A] flex-shrink-0" />
                <span className="font-dm-sans text-sm text-[#E8DDD0]">{b}</span>
              </div>
            ))}
          </div>
          <Link href="/register">
            <Button className="bg-[#C8622A] hover:bg-[#A84E1E] text-white font-dm-sans font-medium px-8 py-3 text-base gap-2">
              Criar o meu cardápio
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-[#E8E0D5]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#C8622A] flex items-center justify-center">
              <UtensilsCrossed className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-playfair font-bold text-sm text-[#1A1510]">
              Cardápios Digitais
            </span>
          </div>
          <p className="font-dm-sans text-xs text-[#A89880]">
            © {new Date().getFullYear()} Cardápios Digitais. Feito em Portugal.
          </p>
        </div>
      </footer>
    </div>
  )
}
