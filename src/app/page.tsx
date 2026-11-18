import type { Metadata, Viewport } from 'next'
import '@/components/site/pagina-unica.css'
import { classesFontes } from '@/components/site/fontes'
import { Cabecalho, ComoFunciona, Experimentos, Inicio, Orcamento, Rodape } from '@/components/site/PaginaUnica'
import { ICONE_SITE_PNG } from '@/components/marca/icone-site'
import { PORTFOLIO } from '@/lib/portfolio'

const titulo = 'araújo_ | Sites sob medida para corretores e negócios locais'
const descricao =
  'Sites sob medida para corretores de imóveis e negócios locais. Você conta o que precisa, recebe uma proposta e acompanha o site ficar pronto.'

/** A página única é a única indexável; o painel continua com noindex (layout raiz). */
export const metadata: Metadata = {
  ...(PORTFOLIO.url ? { metadataBase: new URL(PORTFOLIO.url), alternates: { canonical: '/' } } : {}),
  title: titulo,
  description: descricao,
  robots: { index: true, follow: true },
  icons: { icon: [{ url: ICONE_SITE_PNG, type: 'image/png' }] },
  openGraph: { title: titulo, description: descricao, locale: 'pt_BR', type: 'website', siteName: 'araújo_' },
}

export const viewport: Viewport = { themeColor: '#13111C' }

/** Página pública: pedido de orçamento. O painel fica em /entrar e /leads. */
export default function PaginaInicial() {
  return (
    <div className={`pu ${classesFontes}`}>
      <Cabecalho />
      <main>
        <Inicio />
        <Experimentos />
        <ComoFunciona />
        <Orcamento />
      </main>
      <Rodape />
    </div>
  )
}
