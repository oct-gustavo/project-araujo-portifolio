import 'server-only'

function obrigatoria(nome: string, valor: string | undefined): string {
  if (!valor) throw new Error(`Variável de ambiente ausente: ${nome}`)
  return valor
}

export const SUPABASE_SERVICE_ROLE_KEY = (): string =>
  obrigatoria('SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY)

export const SEGREDO_TENTATIVAS = (): string => {
  const v = obrigatoria('SEGREDO_TENTATIVAS', process.env.SEGREDO_TENTATIVAS)
  if (v.length < 32) throw new Error('SEGREDO_TENTATIVAS precisa ter pelo menos 32 caracteres')
  return v
}
