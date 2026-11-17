import type { Metadata, Viewport } from 'next'
import { ICONE_SITE_SVG } from '@/components/marca/Logo'
import { experimento, type SlugExperimento } from '@/lib/experimentos'

/** Experimentos ficam fora da busca: são negócios fictícios e não devem parecer reais no Google. */
export function metadadosExperimento(slug: SlugExperimento): Metadata {
  const e = experimento(slug)
  return {
    title: `${e.negocio} | Experimento araújo_`,
    description: `Conceito de site para ${e.titulo.toLowerCase()}, com nomes e dados fictícios. ${e.frase}`,
    robots: { index: false, follow: false },
    icons: { icon: [{ url: `data:image/svg+xml,${encodeURIComponent(ICONE_SITE_SVG)}`, type: 'image/svg+xml' }] },
  }
}

export const viewportExperimento = (cor: string): Viewport => ({ themeColor: cor })
