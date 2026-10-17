import 'server-only'
import { z } from 'zod'
import { criarClienteAdmin } from '@/lib/supabase/admin'

export type RegraSiteFraco = 'rigida' | 'branda'

export type Configuracoes = {
  metaSemanal: number
  cidadePadrao: string
  regraSiteFraco: RegraSiteFraco
}

export type TipoNegocio = { id: string; nome: string; ordem: number }

export const EsquemaConfiguracoes = z.object({
  metaSemanal: z.coerce.number().int().min(1).max(500),
  cidadePadrao: z.string().trim().max(80),
  regraSiteFraco: z.enum(['rigida', 'branda']),
})

export const EsquemaTipo = z.object({
  nome: z.string().trim().min(1).max(60),
})

const PADRAO: Configuracoes = { metaSemanal: 50, cidadePadrao: '', regraSiteFraco: 'rigida' }

export async function lerConfiguracoes(): Promise<Configuracoes> {
  const admin = criarClienteAdmin()
  const { data, error } = await admin
    .from('configuracoes')
    .select('meta_semanal, cidade_padrao, regra_site_fraco')
    .eq('id', 1)
    .maybeSingle()
  if (error) throw new Error(`Falha ao ler configurações: ${error.message}`)
  if (!data) return PADRAO
  return {
    metaSemanal: data.meta_semanal,
    cidadePadrao: data.cidade_padrao,
    regraSiteFraco: data.regra_site_fraco as RegraSiteFraco,
  }
}

export async function salvarConfiguracoes(c: Configuracoes): Promise<Configuracoes> {
  const admin = criarClienteAdmin()
  const { error } = await admin.from('configuracoes').upsert({
    id: 1,
    meta_semanal: c.metaSemanal,
    cidade_padrao: c.cidadePadrao,
    regra_site_fraco: c.regraSiteFraco,
    atualizado_em: new Date().toISOString(),
  })
  if (error) throw new Error(`Falha ao salvar configurações: ${error.message}`)
  return c
}

export async function listarTipos(): Promise<TipoNegocio[]> {
  const admin = criarClienteAdmin()
  const { data, error } = await admin
    .from('tipos_negocio')
    .select('id, nome, ordem')
    .order('ordem', { ascending: true })
    .order('criado_em', { ascending: true })
  if (error) throw new Error(`Falha ao listar tipos de negócio: ${error.message}`)
  return data ?? []
}

/** Devolve null se já existir um tipo com o mesmo nome (sem diferenciar maiúsculas). */
export async function adicionarTipo(nome: string): Promise<TipoNegocio | null> {
  const admin = criarClienteAdmin()
  const atuais = await listarTipos()
  if (atuais.some((t) => t.nome.trim().toLowerCase() === nome.trim().toLowerCase())) return null
  const ordem = atuais.reduce((max, t) => Math.max(max, t.ordem), 0) + 1
  const { data, error } = await admin
    .from('tipos_negocio')
    .insert({ nome: nome.trim(), ordem })
    .select('id, nome, ordem')
    .single()
  if (error) {
    if (error.code === '23505') return null
    throw new Error(`Falha ao adicionar tipo de negócio: ${error.message}`)
  }
  return data
}

export async function removerTipo(id: string): Promise<boolean> {
  const admin = criarClienteAdmin()
  const { data, error } = await admin.from('tipos_negocio').delete().eq('id', id).select('id')
  if (error) throw new Error(`Falha ao remover tipo de negócio: ${error.message}`)
  return (data?.length ?? 0) > 0
}
