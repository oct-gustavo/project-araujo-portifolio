import { z } from 'zod'
import { criarClienteServidor } from '@/lib/supabase/servidor'
import { criarClienteAdmin } from '@/lib/supabase/admin'
import { ehAdmin } from '@/lib/seguranca/sessao'
import { consumirCodigo } from '@/lib/seguranca/codigos-backup'
import { chavesDaTentativa, consultarTentativas, limparFalhas, registrarFalha } from '@/lib/seguranca/tentativas'
import {
  registrarErro, ERRO_DADOS, ERRO_INTERNO, ERRO_ORIGEM, ERRO_SESSAO, lerJson, origemValida, responder, responderFalha,
} from '@/lib/seguranca/api'

const Esquema = z.object({ codigo: z.string().trim().min(8).max(20) })

/**
 * Código de backup = você perdeu o app autenticador.
 * Se o código for válido, o fator antigo é removido e você vai direto
 * configurar o 2FA de novo (com códigos de backup novos).
 */
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

    const valido = await consumirCodigo(usuario.id, dados.data.codigo)
    if (!valido) {
      const nova = await registrarFalha(chaves)
      if (nova.bloqueadoAte) await supabase.auth.signOut()
      return responderFalha(nova, 'codigo')
    }

    const admin = criarClienteAdmin()
    const { data: fatores } = await admin.auth.admin.mfa.listFactors({ userId: usuario.id })
    for (const fator of fatores?.factors ?? []) {
      if (fator.factor_type === 'totp') {
        await admin.auth.admin.mfa.deleteFactor({ id: fator.id, userId: usuario.id })
      }
    }

    await limparFalhas(chaves)
    return responder({ proxima: 'configurar' })
  } catch (erro) {
    registrarErro('auth/backup', erro)
    return ERRO_INTERNO()
  }
}
