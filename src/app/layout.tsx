import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { connection } from 'next/server'
import './globals.css'

export const metadata: Metadata = {
  title: 'araújo_',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = { themeColor: '#17121F' }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Renderização dinâmica: necessária para o nonce da Content-Security-Policy.
  await connection()
  return (
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
