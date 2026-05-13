import Image from "next/image"
import Link from "next/link"
import { QrCode, Smartphone, Zap, ArrowRight, Check, X } from "lucide-react"
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
      "Acabou o prato do dia? Marca como esgotado e o cardápio atualiza automaticamente.",
  },
]

const steps = [
  {
    number: "01",
    title: "Cria a tua conta",
    description: "Cria a tua conta em menos de um minuto. Sem cartão de crédito.",
  },
  {
    number: "02",
    title: "Adiciona o teu menu",
    description: "Cria categorias e adiciona os teus pratos com descrições e preços.",
  },
  {
    number: "03",
    title: "Partilha com os clientes",
    description: "Faz download do QR code, imprime e coloca nas mesas. É mesmo assim.",
  },
]

const freeFeatures = [
  { text: "Até 3 categorias", included: true },
  { text: "Até 10 itens no menu", included: true },
  { text: "QR code para download", included: true },
  { text: "Link público do cardápio", included: true },
  { text: "Categorias ilimitadas", included: false },
  { text: "Itens ilimitados", included: false },
]

const proFeatures = [
  { text: "Categorias ilimitadas", included: true },
  { text: "Itens ilimitados", included: true },
  { text: "QR code para download", included: true },
  { text: "Link público do cardápio", included: true },
  { text: "Tradução automática do menu", included: true },
  { text: "Suporte prioritário", included: true },
]

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-[#FAF8F4]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 40%, rgba(200,98,42,0.06) 0%, transparent 55%), radial-gradient(circle at 85% 10%, rgba(200,98,42,0.04) 0%, transparent 45%)",
      }}
    >
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Cardápios Digitais"
            width={160}
            height={128}
            className="h-20 w-auto"
            priority
          />
        </Link>
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
      <section className="max-w-4xl mx-auto px-6 pt-14 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5E6DC] border border-[#E8D5C8] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8622A]" />
          <span className="font-dm-sans text-xs font-medium text-[#C8622A]">
            Plano gratuito disponível, sem cartão de crédito
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
          QR code ou link. Sem app, sem fricção, com uma experiência premium.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/register">
            <Button className="w-full sm:w-auto bg-[#C8622A] hover:bg-[#A84E1E] text-white font-dm-sans font-medium px-8 py-3 text-base gap-2">
              Criar o meu cardápio
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/cardapio-digital">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-[#E8E0D5] text-[#6B5E4E] hover:bg-[#F2EFE9] font-dm-sans font-medium px-8 py-3 text-base"
            >
              Ver exemplo ao vivo
            </Button>
          </Link>
        </div>
      </section>

      {/* Mockup */}
      <section className="max-w-3xl mx-auto px-6 mb-24 flex justify-center">
        <div className="relative w-[360px] h-[640px] rounded-[32px] overflow-hidden shadow-2xl ring-[6px] ring-black/10">
          <iframe
            src="/cardapio-digital"
            title="Preview do cardápio"
            style={{
              border: "none",
              display: "block",
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          />
        </div>
      </section>

      {/* Como funciona */}
      <section className="max-w-xl mx-auto px-6 py-20">
        <div
          className="border border-[#CFC0AD] p-[9px]"
          style={{ boxShadow: "0 24px 64px rgba(26,21,16,0.07), 0 4px 16px rgba(26,21,16,0.04)" }}
        >
          <div className="border border-[#CFC0AD] bg-[#FEFCF9] px-8 py-10 md:px-12 md:py-12">

            {/* Cabeçalho */}
            <div className="text-center mb-10">
              <p className="font-lato text-[9px] uppercase tracking-[0.6em] text-[#A89880] mb-4">
                Como funciona
              </p>
              <h2 className="font-playfair text-[1.9rem] md:text-[2.2rem] font-bold text-[#1A1510] leading-tight">
                Pronto em 3 passos
              </h2>
              <div className="flex items-center gap-3 mt-5">
                <div className="h-px flex-1 bg-[#E0D1C0]" />
                <span className="text-[#C8622A] text-[9px] tracking-widest">◆</span>
                <div className="h-px flex-1 bg-[#E0D1C0]" />
              </div>
            </div>

            {/* Passos */}
            {steps.map(({ number, title, description }, i) => (
              <div key={number}>
                <div className="flex items-start gap-5 py-6">
                  <span
                    className="font-playfair italic font-bold select-none flex-shrink-0 leading-[0.85] text-[#EDE3D8]"
                    style={{ fontSize: "3.8rem", width: "3rem" }}
                  >
                    {number}
                  </span>
                  <div className="flex-1 pt-1.5">
                    <h3 className="font-playfair font-semibold text-[1.05rem] text-[#1A1510] mb-1.5">
                      {title}
                    </h3>
                    <p className="font-lato text-sm text-[#7A6B5D] leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="h-px"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, #D8CBBF 0, #D8CBBF 5px, transparent 0, transparent 11px)",
                    }}
                  />
                )}
              </div>
            ))}

            {/* Ornamento de rodapé */}
            <div className="flex items-center justify-center gap-2 mt-9">
              <div className="h-px w-8 bg-[#E0D1C0]" />
              <div className="w-1 h-1 rounded-full bg-[#C8622A]/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#C8622A]" />
              <div className="w-1 h-1 rounded-full bg-[#C8622A]/40" />
              <div className="h-px w-8 bg-[#E0D1C0]" />
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl font-bold text-[#1A1510] mb-3">
            Tudo o que precisas
          </h2>
          <p className="font-lato text-[#6B5E4E]">Sem complicações, sem surpresas.</p>
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
              <h3 className="font-dm-sans font-semibold text-[#1A1510] mb-2">{title}</h3>
              <p className="font-dm-sans text-sm text-[#6B5E4E] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="font-playfair text-3xl font-bold text-[#1A1510] mb-3">
            Começa grátis. Cresce quando precisares.
          </h2>
          <p className="font-lato text-[#6B5E4E]">Sem compromisso, sem letras pequenas.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <div className="bg-white rounded-2xl border border-[#E8E0D5] p-8 flex flex-col">
            <div className="mb-7">
              <p className="font-dm-sans text-xs font-semibold text-[#6B5E4E] uppercase tracking-widest mb-2">
                Free
              </p>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="font-playfair text-4xl font-bold text-[#1A1510]">€0</span>
                <span className="font-dm-sans text-sm text-[#A89880]">para sempre</span>
              </div>
              <p className="font-dm-sans text-sm text-[#6B5E4E]">Para começar sem risco</p>
            </div>

            <ul className="space-y-3.5 mb-8 flex-1">
              {freeFeatures.map(({ text, included }) => (
                <li key={text} className="flex items-center gap-3">
                  {included ? (
                    <Check className="w-4 h-4 text-[#C8622A] flex-shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-[#D8CBBF] flex-shrink-0" />
                  )}
                  <span
                    className={`font-dm-sans text-sm ${
                      included ? "text-[#1A1510]" : "text-[#B8ADA0]"
                    }`}
                  >
                    {text}
                  </span>
                </li>
              ))}
            </ul>

            <Link href="/register" className="block">
              <Button
                variant="outline"
                className="w-full border-[#E8E0D5] text-[#1A1510] hover:bg-[#F2EFE9] font-dm-sans"
              >
                Criar conta grátis
              </Button>
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-white rounded-2xl border-2 border-[#C8622A] p-8 flex flex-col relative shadow-lg shadow-[#C8622A]/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-[#C8622A] text-white font-dm-sans text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
                Mais popular
              </span>
            </div>

            <div className="mb-7">
              <p className="font-dm-sans text-xs font-semibold text-[#C8622A] uppercase tracking-widest mb-2">
                Pro
              </p>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="font-playfair text-4xl font-bold text-[#1A1510]">€14,99</span>
                <span className="font-dm-sans text-sm text-[#A89880]">/ mês</span>
              </div>
              <p className="font-dm-sans text-sm text-[#6B5E4E]">Para restaurantes a crescer</p>
            </div>

            <ul className="space-y-3.5 mb-8 flex-1">
              {proFeatures.map(({ text }) => (
                <li key={text} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#C8622A] flex-shrink-0" />
                  <span className="font-dm-sans text-sm text-[#1A1510]">{text}</span>
                </li>
              ))}
            </ul>

            <Link href="/register" className="block">
              <Button className="w-full bg-[#C8622A] hover:bg-[#A84E1E] text-white font-dm-sans gap-2">
                Começar com Pro
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-[#1A1510] rounded-2xl p-8 md:p-12 text-center">
          <h2 className="font-playfair text-3xl font-bold text-[#E8DDD0] mb-3">
            Pronto para modernizar o teu cardápio?
          </h2>
          <p className="font-lato text-[#A89880] mb-8">
            Junta-te a restaurantes que já usam a plataforma. Começa hoje, grátis.
          </p>
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
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Cardápios Digitais"
              width={100}
              height={80}
              className="h-12 w-auto opacity-70"
            />
          </Link>
          <p className="font-dm-sans text-xs text-[#A89880]">
            © {new Date().getFullYear()} Cardápios Digitais. Feito em Portugal.
          </p>
        </div>
      </footer>
    </div>
  )
}
