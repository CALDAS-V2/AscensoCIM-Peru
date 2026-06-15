import React from 'react'
import { MessageCircle } from 'lucide-react'

export function Footer() {
  const whatsappNumber = '933700325'
  const whatsappUrl = `https://wa.me/51${whatsappNumber}?text=Hola%20,%20tengo%20una%20consulta%20sobre%20AscensoSim%20Perú`

  return (
    <>
      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © 2026 AscensoCIM Perú. Todos los derechos reservados.
              </p>
            </div>

            <div className="text-xs text-muted-foreground text-center md:text-right">
              <p>Plataforma de estudio para el ascenso en la PNP</p>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-110 z-40"
        title="Contactar por WhatsApp sobre AscensoCIM Perú"
      >
        <MessageCircle size={22} />
        <span className="hidden sm:inline">+51 {whatsappNumber}</span>
      </a>
    </>
  )
}
