"use client"

import { useEffect, useRef } from "react"
import { Download, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import QRCode from "qrcode"

interface QRCodeDisplayProps {
  url: string
  slug: string
}

export function QRCodeDisplay({ url, slug }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 180,
        margin: 2,
        color: { dark: "#1A1510", light: "#FFFFFF" },
      })
    }
  }, [url])

  const handleDownload = () => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = `qr-${slug}.png`
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
    toast.success("QR code transferido!")
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    toast.success("Link copiado!")
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D5] p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <p className="font-dm-sans text-xs font-semibold text-[#A89880] uppercase tracking-widest">
          QR Code
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-dm-sans font-medium text-[#C8622A] hover:text-[#A84E1E] transition-colors"
        >
          Ver cardápio
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* QR canvas */}
      <div className="flex justify-center mb-4 flex-1 items-center">
        <div className="p-4 bg-[#FAF8F4] rounded-2xl border border-[#EAE4DC]">
          <canvas ref={canvasRef} width={180} height={180} />
        </div>
      </div>

      {/* URL */}
      <div className="px-3 py-2 bg-[#F5F2EE] rounded-xl border border-[#EAE4DC] mb-4">
        <p className="font-mono text-[11px] text-[#6B5E4E] break-all leading-relaxed">{url}</p>
      </div>

      {/* Botões */}
      <div className="flex gap-2">
        <Button
          onClick={handleDownload}
          className="flex-1 bg-[#C8622A] hover:bg-[#A84E1E] text-white text-sm gap-2 rounded-xl h-9"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </Button>
        <Button
          onClick={handleCopy}
          variant="outline"
          className="flex-1 border-[#E8E0D5] text-[#6B5E4E] hover:bg-[#F5F2EE] hover:border-[#D4C4B4] text-sm gap-2 rounded-xl h-9"
        >
          <Copy className="w-3.5 h-3.5" />
          Copiar link
        </Button>
      </div>
    </div>
  )
}
