import type { Metadata, Viewport } from 'next'
import '@/components/projetos/fontes'
import { Alba } from '@/components/projetos/alba/Alba'

export const metadata: Metadata = {
  title: 'Casa Alba — conceito · Araújo',
  description: 'Conceito de site para um restaurante, com tour guiado explicando cada decisão.',
  robots: { index: true, follow: true },
}

export const viewport: Viewport = { themeColor: '#141A18' }

export default function Pagina() {
  return <Alba />
}
