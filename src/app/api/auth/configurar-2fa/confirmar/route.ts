import { z } from 'zod'
import { criarClienteServidor } from '@/lib/supabase/servidor'
import { ehAdmin } from '@/lib/seguranca/sessao'
import { gerarESalvarCodigos } from '@/lib/seguranca/codigos-backup'
import { chavesDaTentativa, consultarTentativas, limparFalhas, registrarFalha } from '@/lib/seguranca/tentativas'
import {
  registrarErro, ERRO_DADOS, ERRO_INTERNO, ERRO_ORIGEM, ERRO_SESSAO, lerJson, origemValida, responder, responderFalha,
} from '@/lib/seguranca/api'

const Esquema = z.object({ fatorId: z.string().uuid(), codigo: z.string().regex(/^\d{6}$/) })

/** Confirma o app com um código e devolve os códigos de backup (uma única vez). */
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
    if (situacao.bloqueadoAte) return responder({ erro: 'bloqueado', bloqueadoAte: situacao.bloqueadoAte }, 429)

    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: dados.data.fatorId,
      code: dados.data.codigo,
    })
    if (error) return responderFalha(await registrarFalha(chaves), 'codigo')

    const codigos = await gerarESalvarCodigos(usuario.id)
    await limparFalhas(chaves)
    return responder({ codigos })
  } catch (erro) {
    registrarErro('auth/configurar-2fa/confirmar', erro)
    return ERRO_INTERNO()
  }
}
