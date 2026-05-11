import { Cormorant_Garamond, Outfit } from "next/font/google"
import { PageLoader } from "@/components/dashboard/PageLoader"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${cormorant.variable} ${outfit.variable}`}>
      <PageLoader />
      {children}
    </div>
  )
}
