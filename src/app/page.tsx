import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/epilogue/wght.css'
import '@fontsource-variable/epilogue/wght-italic.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/600.css'
import '@/components/site/site.css'
import { Abertura } from '@/components/site/Abertura'
import { Navegacao } from '@/components/site/Navegacao'
import { Contato, Hero, Impacto, Processo, Projetos, Rodape, Sobre, Solucoes } from '@/components/site/Secoes'
import { AssistenteConversa } from '@/components/site/AssistenteConversa'
import { PORTFOLIO } from '@/lib/portfolio'

const titulo = `${PORTFOLIO.marca} — Design & sites sob medida`
const descricao =
  'Sites e experiências digitais sob medida — modernos, elegantes e pensados para o jeito único de cada negócio.'

/** O portfólio é a única página indexável; o painel continua com noindex (layout raiz). */
export const metadata: Metadata = {
  ...(PORTFOLIO.url ? { metadataBase: new URL(PORTFOLIO.url), alternates: { canonical: '/' } } : {}),
  title: titulo,
  description: descricao,
  robots: { index: true, follow: true },
  openGraph: { title: titulo, description: descricao, locale: 'pt_BR', type: 'website' },
}

export const viewport: Viewport = { themeColor: '#0A0C12' }

/** Página pública: portfólio do estúdio. O painel fica em /entrar e /leads. */
export default function Portfolio() {
  return (
    <div className="site com-abertura" id="top">
      <Abertura />
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Navegacao />
      <main id="conteudo">
        <Hero />
        <Sobre />
        <Projetos />
        <Solucoes />
        <Processo />
        <Impacto />
        <Contato />
      </main>
      <Rodape />
      <AssistenteConversa />
    </div>
  )
}
