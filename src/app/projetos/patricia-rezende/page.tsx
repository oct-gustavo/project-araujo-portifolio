import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/epilogue/wght.css'
import '@fontsource-variable/epilogue/wght-italic.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/600.css'
import '@fontsource/poppins/600.css'
import '@fontsource/source-sans-3/400.css'
import '@/components/site/site.css'
import { CasoPatricia } from '@/components/projetos/caso/CasoPatricia'

export const metadata: Metadata = {
  title: 'Patrícia Rezende — case · Araújo',
  description:
    'Catálogo de imóveis com painel exclusivo para a corretora: como foi pensado o site da Patrícia Rezende.',
  robots: { index: true, follow: true },
}

export const viewport: Viewport = { themeColor: '#0A0C12' }

export default function PaginaPatricia() {
  return <CasoPatricia />
}
