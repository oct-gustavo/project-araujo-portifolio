import 'server-only'
import { NextResponse } from 'next/server'

const SEM_CACHE = { 'Cache-Control': 'no-store, max-age=0' }

export function responder(corpo: unknown, status = 200) {
  return NextResponse.json(corpo, { status, headers: SEM_CACHE })
}

/**
 * Proteção contra CSRF: só aceita POST vindo do próprio site.
 * O navegador sempre manda o cabeçalho Origin em POST via fetch.
 */
export function origemValida(req: Request): boolean {
  const origem = req.headers.get('origin')
  if (!origem) return false
  try {
    const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
    return new URL(origem).host === host
  } catch {
    return false
  }
}

export async function lerJson(req: Request): Promise<unknown> {
  try {
    return await req.json()
  } catch {
    return null
  }
}

/**
 * Mostra no terminal do servidor o motivo de um erro interno.
 * Só a mensagem e o código: nunca o corpo da requisição (senhas, códigos).
 */
export function registrarErro(rota: string, erro: unknown) {
  const e = erro as { message?: string; code?: string; cause?: { message?: string } }
  const detalhe = [e?.message, e?.code && `código ${e.code}`, e?.cause?.message && `causa: ${e.cause.message}`]
    .filter(Boolean)
    .join(' · ')
  console.error(`[api/${rota}] erro interno: ${detalhe || String(erro)}`)
}

export const ERRO_ORIGEM = () => responder({ erro: 'origem' }, 403)
export const ERRO_DADOS = () => responder({ erro: 'dados' }, 400)
export const ERRO_SESSAO = () => responder({ erro: 'sessao' }, 401)
export const ERRO_INTERNO = () => responder({ erro: 'interno' }, 500)

/** Resposta padrão para senha/código errado ou bloqueio. */
export function responderFalha(
  situacao: { restantes: number; bloqueadoAte: string | null },
  erro: 'credenciais' | 'codigo',
) {
  if (situacao.bloqueadoAte) return responder({ erro: 'bloqueado', bloqueadoAte: situacao.bloqueadoAte }, 429)
  return responder({ erro, restantes: situacao.restantes }, 401)
}
