import type { MetadataRoute } from 'next'
import { PORTFOLIO } from '@/lib/portfolio'

/** Só a página de orçamento ("/") pode ser indexada. O painel e a API ficam de fora. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/$'],
      disallow: ['/entrar', '/configurar-2fa', '/leads', '/novo-lead', '/resumo', '/configuracoes', '/api/'],
    },
    ...(PORTFOLIO.url ? { host: PORTFOLIO.url } : {}),
  }
}
