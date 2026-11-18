import type { Metadata } from 'next'
import Link from 'next/link'
import '@/components/site/pagina-unica.css'
import { classesFontes } from '@/components/site/fontes'
import { LogoSite, Rodape } from '@/components/site/PaginaUnica'

export const metadata: Metadata = {
  title: 'Página não encontrada | araújo_',
  robots: { index: false, follow: true },
}

/** 404 no estilo da página única: endereço digitado errado ou página que não existe mais. */
export default function NaoEncontrada() {
  return (
    <div className={`pu ${classesFontes}`}>
      <header className="pu-wrap pu-cab">
        <Link className="pu-marca" href="/" aria-label="araújo_, início">
          <LogoSite altura={44} />
        </Link>
        <Link className="pu-btn pu-btn-cheio pu-btn-cab" href="/#orcamento">
          Pedir orçamento
        </Link>
      </header>
      <main className="pu-wrap pu-nf">
        <p className="pu-nf-cod">Erro 404</p>
        <h1 className="pu-h1">
          Esta página <em>não existe</em> mais.
        </h1>
        <p className="pu-lead">O endereço pode ter mudado ou ter sido digitado com algum erro.</p>
        <div className="pu-acoes">
          <Link className="pu-btn pu-btn-cheio pu-btn-grande" href="/">
            Voltar ao início
          </Link>
          <Link className="pu-btn pu-btn-contorno pu-btn-grande" href="/#orcamento">
            Pedir orçamento
          </Link>
        </div>
      </main>
      <Rodape />
    </div>
  )
}
