import type { Metadata, Viewport } from 'next'
import '@/components/projetos/fontes'
import '@/components/site/site.css'
import { DetalhesConceito } from '@/components/projetos/detalhes/Detalhes'

export const metadata: Metadata = {
  title: 'Casa Alba — detalhes do conceito · Araújo',
  description: 'Cores, fontes, estilo e decisões de design do conceito de site para um restaurante.',
  robots: { index: true, follow: true },
}

export const viewport: Viewport = { themeColor: '#0A0C12' }

export default function Pagina() {
  return <DetalhesConceito slug="casa-alba" />
}
