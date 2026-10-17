import { exigirSessaoCompleta } from '@/lib/seguranca/sessao'
import { gerarESalvarCodigos } from '@/lib/seguranca/codigos-backup'
import { registrarErro, ERRO_INTERNO, ERRO_ORIGEM, ERRO_SESSAO, origemValida, responder } from '@/lib/seguranca/api'

/** Gera 10 códigos novos (os antigos deixam de valer). Os novos são mostrados uma única vez. */
export async function POST(req: Request) {
  if (!origemValida(req)) return ERRO_ORIGEM()
  const sessao = await exigirSessaoCompleta()
  if (!sessao) return ERRO_SESSAO()
  try {
    return responder({ codigos: await gerarESalvarCodigos(sessao.usuario.id) })
  } catch (erro) {
    registrarErro('seguranca/codigos-backup', erro)
    return ERRO_INTERNO()
  }
}
