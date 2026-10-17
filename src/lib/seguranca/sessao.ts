import 'server-only'
import type { User } from '@supabase/supabase-js'
import { criarClienteServidor } from '@/lib/supabase/servidor'
import { criarClienteAdmin } from '@/lib/supabase/admin'

export type EstadoSessao =
  | { tipo: 'anonimo' }
  | { tipo: 'parcial'; usuario: User; temTotp: boolean } // senha ok, falta o 2FA (ou configurar)
  | { tipo: 'completa'; usuario: User } // senha + 2FA (aal2)

export async function ehAdmin(usuarioId: string): Promise<boolean> {
  const admin = criarClienteAdmin()
  const { data } = await admin.from('usuarios_admin').select('id').eq('id', usuarioId).maybeSingle()
  return Boolean(data)
}

/** getUser() confere o token no servidor do Supabase (não confia só no cookie). */
export async function obterEstadoSessao(): Promise<EstadoSessao> {
  const supabase = await criarClienteServidor()
  const { data } = await supabase.auth.getUser()
  const usuario = data.user
  if (!usuario || !(await ehAdmin(usuario.id))) return { tipo: 'anonimo' }

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
  if (aal?.currentLevel === 'aal2') return { tipo: 'completa', usuario }
  return { tipo: 'parcial', usuario, temTotp: aal?.nextLevel === 'aal2' }
}

/** Para rotas de API do painel: devolve o usuário só se a sessão for de admin e passou pelo 2FA. */
export async function exigirSessaoCompleta(): Promise<{ usuario: User } | null> {
  const estado = await obterEstadoSessao()
  return estado.tipo === 'completa' ? { usuario: estado.usuario } : null
}
