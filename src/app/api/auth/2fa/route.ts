import { z } from 'zod'
import { criarClienteServidor } from '@/lib/supabase/servidor'
import { ehAdmin } from '@/lib/seguranca/sessao'
import { chavesDaTentativa, consultarTentativas, limparFalhas, registrarFalha } from '@/lib/seguranca/tentativas'
import {
  registrarErro, ERRO_DADOS, ERRO_INTERNO, ERRO_ORIGEM, ERRO_SESSAO, lerJson, origemValida, responder, responderFalha,
} from '@/lib/seguranca/api'

const Esquema = z.object({ codigo: z.string().regex(/^\d{6}$/) })

export async function POST(req: Request) {
  if (!origemValida(req)) return ERRO_ORIGEM()
  const dados = Esquema.safeParse(await lerJson(req))
  if (!dados.success) return ERRO_DADOS()

  try {
    const supabase = await criarClienteServidor()
    const { data: u } = await supabase.auth.getUser()
    const usuario = u.user
    if (!usuario?.email || !(await ehAdmin(usuario.id))) return ERRO_SESSAO()

    const chaves = chavesDaTentativa(req, usuario.email)
    const situacao = await consultarTentativas(chaves)
    if (situacao.bloqueadoAte) {
      await supabase.auth.signOut()
      return responder({ erro: 'bloqueado', bloqueadoAte: situacao.bloqueadoAte }, 429)
    }

    const { data: fatores } = await supabase.auth.mfa.listFactors()
    const fator = fatores?.totp?.[0]
    if (!fator) return responder({ proxima: 'configurar' })

    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: fator.id, code: dados.data.codigo })
    if (error) {
      const nova = await registrarFalha(chaves)
      if (nova.bloqueadoAte) await supabase.auth.signOut()
      return responderFalha(nova, 'codigo')
    }

    await limparFalhas(chaves)
    return responder({ ok: true })
  } catch (erro) {
    registrarErro('auth/2fa', erro)
    return ERRO_INTERNO()
  }
}
