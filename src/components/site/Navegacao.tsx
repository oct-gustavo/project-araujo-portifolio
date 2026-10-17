'use client'

import { useEffect, useState } from 'react'
import { SimboloA } from '@/components/marca/Logo'
import { PORTFOLIO } from '@/lib/portfolio'

const LINKS = [
  { href: '#sobre', rotulo: 'Sobre' },
  { href: '#projetos', rotulo: 'Projetos' },
  { href: '#solucoes', rotulo: 'Soluções' },
  { href: '#processo', rotulo: 'Processo' },
]

export function Navegacao() {
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    if (!aberto) return
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberto(false)
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [aberto])

  return (
    <header className="nav">
      <div className="wrap nav-in">
        <a className="brand" href="#top" aria-label={`${PORTFOLIO.marca} — início`}>
          <SimboloA tamanho={30} corA="#ECEDF4" corCursor="#B9A3F0" />
          <span className="brand-name">{PORTFOLIO.marca}</span>
          <span className="brand-tag">{PORTFOLIO.assinatura}</span>
        </a>
        <nav className="nav-links" aria-label="Principal">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.rotulo}
            </a>
          ))}
        </nav>
        <a className="btn btn-ghost nav-cta" href="#contato">
          Vamos conversar <span className="arr">→</span>
        </a>
        <button
          className="nav-menu"
          type="button"
          aria-expanded={aberto}
          aria-controls="menu-celular"
          onClick={() => setAberto((v) => !v)}
        >
          <i />
          {aberto ? 'Fechar' : 'Menu'}
        </button>
      </div>
      {aberto && (
        <nav className="mnav" id="menu-celular" aria-label="Menu">
          {[...LINKS, { href: '#contato', rotulo: 'Contato' }].map((l, i) => (
            <a key={l.href} href={l.href} onClick={() => setAberto(false)}>
              {l.rotulo} <span>{String(i + 1).padStart(2, '0')}</span>
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
