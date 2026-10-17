import type { MetadataRoute } from 'next'
import { PORTFOLIO } from '@/lib/portfolio'

/** Só o portfólio ("/") e as páginas de projeto podem ser indexados. O painel e a API ficam de fora. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/$', '/projetos/'],
      disallow: ['/entrar', '/configurar-2fa', '/leads', '/novo-lead', '/resumo', '/configuracoes', '/api/'],
    },
    ...(PORTFOLIO.url ? { host: PORTFOLIO.url } : {}),
  }
}
