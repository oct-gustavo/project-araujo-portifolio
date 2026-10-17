import type { Metadata, Viewport } from 'next'
import '@/components/projetos/fontes'
import { Lumen } from '@/components/projetos/lumen/Lumen'

export const metadata: Metadata = {
  title: 'Clínica Lumen — conceito · Araújo',
  description: 'Conceito de site para uma clínica odontológica, com tour guiado explicando cada decisão.',
  robots: { index: true, follow: true },
}

export const viewport: Viewport = { themeColor: '#F4F7F7' }

export default function Pagina() {
  return <Lumen />
}
