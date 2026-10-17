import 'server-only'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { SUPABASE_CHAVE_PUBLICA, SUPABASE_URL } from '@/lib/env'

/** Cliente com a sessão do usuário (cookies). Use em rotas de API e páginas do servidor. */
export async function criarClienteServidor() {
  const cookieStore = await cookies()
  return createServerClient(SUPABASE_URL(), SUPABASE_CHAVE_PUBLICA(), {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (lista) => {
        try {
          lista.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Chamado a partir de um Server Component: o proxy já renova a sessão.
        }
      },
    },
  })
}
