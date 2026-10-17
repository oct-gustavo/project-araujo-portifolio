// Variáveis públicas (podem ir para o navegador). As secretas ficam em env-servidor.ts.
function obrigatoria(nome: string, valor: string | undefined): string {
  if (!valor) throw new Error(`Variável de ambiente ausente: ${nome}`)
  return valor
}

export const SUPABASE_URL = (): string =>
  obrigatoria('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL)

/**
 * Chave pública do Supabase. O nome atual é "publishable" (sb_publishable_...);
 * o nome antigo "anon" continua aceito caso apareça.
 */
export const SUPABASE_CHAVE_PUBLICA = (): string =>
  obrigatoria(
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
