import type { Metadata, Viewport } from 'next'
import '@/components/projetos/fontes'
import { Norte } from '@/components/projetos/norte/Norte'

export const metadata: Metadata = {
  title: 'Ateliê Norte — conceito · Araújo',
  description: 'Conceito de site para um escritório de arquitetura, com tour guiado explicando cada decisão.',
  robots: { index: true, follow: true },
}

export const viewport: Viewport = { themeColor: '#EDEDEA' }

export default function Pagina() {
  return <Norte />
}
