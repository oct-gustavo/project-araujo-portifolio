import 'server-only'
import { createHmac } from 'node:crypto'
import { criarClienteAdmin } from '@/lib/supabase/admin'
import { SEGREDO_TENTATIVAS } from '@/lib/env-servidor'

export const MAX_TENTATIVAS = 3
export const MINUTOS_BLOQUEIO = 15
const JANELA_MS = 60 * 60 * 1000 // falhas com mais de 1h são esquecidas (igual ao SQL)

export type SituacaoTentativas = {
  restantes: number
  bloqueadoAte: string | null
}

/** Hash HMAC: o e-mail e o IP nunca ficam gravados em texto no banco. */
export function chaveDe(tipo: 'email' | 'ip', valor: string): string {
  return createHmac('sha256', SEGREDO_TENTATIVAS())
    .update(`${tipo}:${valor.trim().toLowerCase()}`)
    .digest('hex')
}

/** IP do visitante. Na Vercel, x-forwarded-for é preenchido pela própria plataforma. */
export function ipDaRequisicao(req: Request): string {
  const encaminhado = req.headers.get('x-forwarded-for')
  if (encaminhado) return encaminhado.split(',')[0].trim()
  return req.headers.get('x-real-ip')?.trim() || 'desconhecido'
}

export function chavesDaTentativa(req: Request, email: string): string[] {
  return [chaveDe('email', email), chaveDe('ip', ipDaRequisicao(req))]
}

/** Lê a situação atual sem somar nada. */
export async function consultarTentativas(chaves: string[]): Promise<SituacaoTentativas> {
  const admin = criarClienteAdmin()
  const { data, error } = await admin
    .from('tentativas_login')
    .select('falhas, bloqueado_ate, atualizado_em')
    .in('chave', chaves)
  if (error) throw new Error(`Falha ao consultar tentativas: ${error.message}`)

  const agora = Date.now()
  let bloqueadoAte: string | null = null
  let maiorFalhas = 0
  for (const linha of data ?? []) {
    const bloq = linha.bloqueado_ate ? new Date(linha.bloqueado_ate).getTime() : 0
    if (bloq > agora) {
      if (!bloqueadoAte || bloq > new Date(bloqueadoAte).getTime()) bloqueadoAte = linha.bloqueado_ate
      continue
    }
    const recente = agora - new Date(linha.atualizado_em).getTime() < JANELA_MS
    if (recente && !linha.bloqueado_ate) maiorFalhas = Math.max(maiorFalhas, linha.falhas)
  }
  return {
    restantes: bloqueadoAte ? 0 : Math.max(0, MAX_TENTATIVAS - maiorFalhas),
    bloqueadoAte,
  }
}

/** Soma uma falha em cada chave (e-mail e IP) e devolve a situação mais restritiva. */
export async function registrarFalha(chaves: string[]): Promise<SituacaoTentativas> {
  const admin = criarClienteAdmin()
  let restantes = MAX_TENTATIVAS
  let bloqueadoAte: string | null = null
  for (const chave of chaves) {
    const { data, error } = await admin.rpc('registrar_falha_login', {
      p_chave: chave,
      p_max: MAX_TENTATIVAS,
      p_minutos: MINUTOS_BLOQUEIO,
    })
    if (error) throw new Error(`Falha ao registrar tentativa: ${error.message}`)
    const linha = (data as { total_falhas: number; bloqueio_ate: string | null }[])[0]
    if (linha?.bloqueio_ate) {
      if (!bloqueadoAte || new Date(linha.bloqueio_ate) > new Date(bloqueadoAte)) bloqueadoAte = linha.bloqueio_ate
    }
    restantes = Math.min(restantes, Math.max(0, MAX_TENTATIVAS - (linha?.total_falhas ?? 0)))
  }
  return { restantes: bloqueadoAte ? 0 : restantes, bloqueadoAte }
}

/** Zera as falhas depois de um acesso completo (senha + 2FA). */
export async function limparFalhas(chaves: string[]): Promise<void> {
  const admin = criarClienteAdmin()
  await admin.from('tentativas_login').delete().in('chave', chaves)
}
