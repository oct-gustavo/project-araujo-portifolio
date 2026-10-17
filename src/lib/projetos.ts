/** Projetos do portfólio: usados na home (cards) e nas páginas /projetos/[slug]. */
export type Projeto = {
  slug: string
  nome: string
  segmento: string
  area: string
  real: boolean
  /** Link do site publicado (só projetos reais). Vazio = o botão "Ver o site no ar" não aparece. */
  siteNoAr?: string
  /** Ano de entrega (só projetos reais). Vazio = não aparece. */
  ano?: string
}

export const PROJETOS: Projeto[] = [
  { slug: 'patricia-rezende', nome: 'Patrícia Rezende', segmento: 'Corretora de imóveis', area: 'Imobiliário', real: true, siteNoAr: '', ano: '' },
  { slug: 'clinica-lumen', nome: 'Clínica Lumen', segmento: 'Odontologia', area: 'Saúde', real: false },
  { slug: 'atelie-norte', nome: 'Ateliê Norte', segmento: 'Arquitetura & interiores', area: 'Arquitetura', real: false },
  { slug: 'casa-alba', nome: 'Casa Alba', segmento: 'Restaurante', area: 'Gastronomia', real: false },
]

export const caminhoProjeto = (slug: string) => `/projetos/${slug}`
/** Página com cores, fontes e estilo de um conceito. */
export const caminhoDetalhes = (slug: string) => `/projetos/${slug}/detalhes`

export function projeto(slug: string): Projeto {
  const p = PROJETOS.find((x) => x.slug === slug)
  if (!p) throw new Error(`Projeto desconhecido: ${slug}`)
  return p
}

/** O próximo da lista (volta ao primeiro no fim). */
export function proximoProjeto(slug: string): Projeto {
  const i = PROJETOS.findIndex((x) => x.slug === slug)
  return PROJETOS[(i + 1) % PROJETOS.length]
}
