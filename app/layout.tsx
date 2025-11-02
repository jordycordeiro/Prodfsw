import './globals.css'
import '@/components/theme/strip-escuro-text'
import '@/styles/prodoc-theme.css'   // habilita variantes de botões
import '@/styles/prodoc-bars.css'    // barras azuis, topbar e sidebar
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'     // ✅ sistema global de toasts

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prodoc',
  description: 'Documentação e prescrições rápidas para UPAs/UBSs',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        {/* ✅ container global do Sonner (para toast.success / toast.error) */}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  )
}
