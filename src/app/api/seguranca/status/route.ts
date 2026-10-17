import { exigirSessaoCompleta } from '@/lib/seguranca/sessao'
import { contarCodigosRestantes } from '@/lib/seguranca/codigos-backup'
import { registrarErro, ERRO_INTERNO, ERRO_SESSAO, responder } from '@/lib/seguranca/api'

export async function GET() {
  const sessao = await exigirSessaoCompleta()
  if (!sessao) return ERRO_SESSAO()
  try {
    return responder({ codigosRestantes: await contarCodigosRestantes(sessao.usuario.id) })
  } catch (erro) {
    registrarErro('seguranca/status', erro)
    return ERRO_INTERNO()
  }
}
