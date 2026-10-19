import type { Metadata } from 'next'
import Link from 'next/link'
import '@fontsource-variable/epilogue/wght.css'
import '@fontsource-variable/epilogue/wght-italic.css'
import '@/components/site/site.css'
import '@/components/projetos/caso/caso.css'
import '@/components/site/nao-encontrada/nao-encontrada.css'
import { SimboloA } from '@/components/marca/Logo'
import { CaminhoTentado } from '@/components/site/nao-encontrada/CaminhoTentado'
import { PROJETOS, caminhoProjeto } from '@/lib/projetos'

export const metadata: Metadata = {
  title: 'Página não encontrada · Araújo',
  robots: { index: false, follow: true },
}

/** 404 no estilo do portfólio: endereço digitado errado ou página que não existe mais. */
export default function NaoEncontrada() {
  return (
    <div className="site nf" id="top">
      <header className="cs-nav">
        <div className="wrap cs-nav-in">
          <Link className="brand" href="/" aria-label="Araújo — início">
            <SimboloA tamanho={30} corA="#ECEDF4" corCursor="#B9A3F0" />
            <span className="brand-name">Araújo</span>
          </Link>
          <Link className="btn btn-ghost nav-cta" href="/#contato">
            Vamos conversar <span className="arr">→</span>
          </Link>
        </div>
      </header>

      <main className="nf-main" id="conteudo">
        <div className="nf-bg" />
        <div className="wrap nf-grid">
          <div>
            <p className="nf-cod">Erro 404 · página não encontrada</p>
            <h1 className="nf-t">
              Esta página <em>saiu do lugar.</em>
            </h1>
            <p className="nf-p">
              O endereço pode ter mudado ou ter sido digitado com algum erro.
              <CaminhoTentado />
            </p>
            <div className="nf-acoes">
              <Link className="btn btn-primary" href="/">
                Voltar ao início <span className="arr">→</span>
              </Link>
              <Link className="ulink" href="/#projetos">
                Ver os projetos <span className="arr">↓</span>
              </Link>
            </div>
            <nav className="nf-lista" aria-labelledby="nf-talvez">
              <h2 id="nf-talvez">Talvez você procure</h2>
              <ul>
                {PROJETOS.map((p) => (
                  <li key={p.slug}>
                    <Link href={caminhoProjeto(p.slug)}>
                      <span>{p.nome}</span>
                      <small>
                        {p.area} · {p.real ? 'projeto real' : 'conceito'}
                      </small>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="nf-arte" aria-hidden="true">
            <svg viewBox="0 0 100 100">
              <line className="nf-guia" x1="0" y1="92" x2="100" y2="92" />
              <line className="nf-guia" x1="40" y1="4" x2="40" y2="100" />
              <path className="nf-perna" d="M6 92 L40 26 L74 92 L61 92 L40 51 L19 92 Z" />
              <rect className="nf-barra" x="26" y="20" width="28" height="9" />
              <rect className="nf-cursor" x="78" y="83" width="18" height="9" />
            </svg>
          </div>
        </div>
      </main>
    </div>
  )
}
