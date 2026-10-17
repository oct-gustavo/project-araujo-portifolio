'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import p from './painel.module.css'

const ICONES = {
  leads: <path d="M8 6h13M8 12h13M8 18h13M3 6h1M3 12h1M3 18h1" />,
  novo: <path d="M12 5v14M5 12h14" />,
  resumo: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  config: (
    <>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </>
  ),
}

const ITENS = [
  { href: '/leads', rotulo: 'Leads', icone: ICONES.leads },
  { href: '/novo-lead', rotulo: 'Novo lead', icone: ICONES.novo },
  { href: '/resumo', rotulo: 'Resumo semanal', icone: ICONES.resumo },
  { href: '/configuracoes', rotulo: 'Configurações', icone: ICONES.config },
]

export function LinksMenu() {
  const caminho = usePathname()
  return (
    <nav aria-label="Principal" className={p.menu}>
      {ITENS.map((item) => (
        <Link key={item.href} href={item.href} className={p.item} aria-current={caminho === item.href ? 'page' : undefined}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            {item.icone}
          </svg>
          <span>{item.rotulo}</span>
        </Link>
      ))}
    </nav>
  )
}
