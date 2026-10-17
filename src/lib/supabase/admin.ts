import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL } from '@/lib/env'
import { SUPABASE_SERVICE_ROLE_KEY } from '@/lib/env-servidor'

/**
 * Cliente com a chave service_role. Ignora o RLS: use só no servidor,
 * só para as tabelas internas (usuarios_admin, tentativas_login, codigos_backup)
 * e para a API de administração do Auth.
 */
export function criarClienteAdmin() {
  return createClient(SUPABASE_URL(), SUPABASE_SERVICE_ROLE_KEY(), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}
