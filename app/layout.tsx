import type { Metadata } from "next"
import { Playfair_Display, Lato, DM_Sans, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Cardápios Digitais — Menu QR para Restaurantes",
  description:
    "Cria o teu cardápio digital em minutos. Partilha por link ou QR code. Sem custos, sem complicações.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt"
      className={`${playfair.variable} ${lato.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased font-dm-sans">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1A1510",
              color: "#E8DDD0",
              borderRadius: "10px",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#C8622A",
                secondary: "#E8DDD0",
              },
            },
          }}
        />
      </body>
    </html>
  )
}
