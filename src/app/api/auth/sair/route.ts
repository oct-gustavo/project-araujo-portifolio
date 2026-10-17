import { criarClienteServidor } from '@/lib/supabase/servidor'
import { ERRO_ORIGEM, origemValida, responder } from '@/lib/seguranca/api'

export async function POST(req: Request) {
  if (!origemValida(req)) return ERRO_ORIGEM()
  const supabase = await criarClienteServidor()
  await supabase.auth.signOut()
  return responder({ ok: true })
}
