/** Sites experimentais (conceitos com nomes e dados fictícios), abertos pelos cartões da página inicial. */
export const EXPERIMENTOS = [
  {
    slug: 'imobiliaria',
    titulo: 'Imobiliária',
    negocio: 'Casa Exemplo',
    frase: 'Catálogo de imóveis com busca e contato direto com o corretor.',
  },
  {
    slug: 'barbearia',
    titulo: 'Barbearia',
    negocio: 'Barbearia Exemplo',
    frase: 'Serviços, preços e agendamento pelo WhatsApp.',
  },
  {
    slug: 'restaurante',
    titulo: 'Restaurante',
    negocio: 'Cantina Exemplo',
    frase: 'Cardápio sempre atualizado e pedido direto pelo WhatsApp.',
  },
] as const

export type SlugExperimento = (typeof EXPERIMENTOS)[number]['slug']

export const caminhoExperimento = (slug: SlugExperimento) => `/experimentos/${slug}`

export const experimento = (slug: SlugExperimento) => EXPERIMENTOS.find((e) => e.slug === slug)!

/** Valores em reais sem depender do ICU do servidor (mesmo texto no servidor e no navegador). */
export const reais = (valor: number) => `R$ ${String(valor).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
