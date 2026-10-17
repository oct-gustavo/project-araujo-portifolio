import 'server-only'
import { randomBytes, randomInt, scrypt as scryptCb, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { criarClienteAdmin } from '@/lib/supabase/admin'

const scrypt = promisify(scryptCb) as (senha: string, salt: Buffer, tamanho: number) => Promise<Buffer>

const QUANTIDADE = 10
// Sem 0/O, 1/I/L: evita confusão ao copiar do papel.
const ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

function normalizar(codigo: string): string {
  return codigo.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

function gerarUm(): string {
  let s = ''
  for (let i = 0; i < 8; i++) s += ALFABETO[randomInt(ALFABETO.length)]
  return `${s.slice(0, 4)}-${s.slice(4)}`
}

async function hashDe(codigo: string, saltHex: string): Promise<Buffer> {
  return scrypt(normalizar(codigo), Buffer.from(saltHex, 'hex'), 32)
}

/**
 * Gera 10 códigos novos, apaga os antigos e grava só os hashes.
 * Os códigos em texto são devolvidos uma única vez para mostrar na tela.
 */
export async function gerarESalvarCodigos(usuarioId: string): Promise<string[]> {
  const codigos = Array.from({ length: QUANTIDADE }, gerarUm)
  const linhas = await Promise.all(
    codigos.map(async (codigo) => {
      const salt = randomBytes(16).toString('hex')
      const hash = (await hashDe(codigo, salt)).toString('hex')
      return { usuario_id: usuarioId, hash, salt }
    }),
  )
  const admin = criarClienteAdmin()
  const { error: erroApagar } = await admin.from('codigos_backup').delete().eq('usuario_id', usuarioId)
  if (erroApagar) throw new Error(`Falha ao substituir códigos de backup: ${erroApagar.message}`)
  const { error } = await admin.from('codigos_backup').insert(linhas)
  if (error) throw new Error(`Falha ao salvar códigos de backup: ${error.message}`)
  return codigos
}

/** Confere um código e, se for válido, marca como usado. Cada código funciona uma vez. */
export async function consumirCodigo(usuarioId: string, codigo: string): Promise<boolean> {
  if (normalizar(codigo).length !== 8) return false
  const admin = criarClienteAdmin()
  const { data, error } = await admin
    .from('codigos_backup')
    .select('id, hash, salt')
    .eq('usuario_id', usuarioId)
    .is('usado_em', null)
  if (error) throw new Error(`Falha ao conferir código de backup: ${error.message}`)

  for (const linha of data ?? []) {
    const calculado = await hashDe(codigo, linha.salt)
    const gravado = Buffer.from(linha.hash, 'hex')
    if (gravado.length === calculado.length && timingSafeEqual(gravado, calculado)) {
      // "is usado_em null" evita que o mesmo código seja usado duas vezes ao mesmo tempo.
      const { data: marcado } = await admin
        .from('codigos_backup')
        .update({ usado_em: new Date().toISOString() })
        .eq('id', linha.id)
        .is('usado_em', null)
        .select('id')
      return (marcado?.length ?? 0) === 1
    }
  }
  return false
}

export async function contarCodigosRestantes(usuarioId: string): Promise<number> {
  const admin = criarClienteAdmin()
  const { count } = await admin
    .from('codigos_backup')
    .select('id', { count: 'exact', head: true })
    .eq('usuario_id', usuarioId)
    .is('usado_em', null)
  return count ?? 0
}
