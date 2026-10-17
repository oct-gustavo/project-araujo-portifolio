import { z } from 'zod'
import { exigirSessaoCompleta } from '@/lib/seguranca/sessao'
import { removerTipo } from '@/lib/dados/configuracoes'
import { registrarErro, ERRO_DADOS, ERRO_INTERNO, ERRO_ORIGEM, ERRO_SESSAO, origemValida, responder } from '@/lib/seguranca/api'

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!origemValida(req)) return ERRO_ORIGEM()
  if (!(await exigirSessaoCompleta())) return ERRO_SESSAO()
  const { id } = await params
  if (!z.string().uuid().safeParse(id).success) return ERRO_DADOS()
  try {
    const removido = await removerTipo(id)
    return removido ? responder({ ok: true }) : responder({ erro: 'nao_encontrado' }, 404)
  } catch (erro) {
    registrarErro('tipos-negocio', erro)
    return ERRO_INTERNO()
  }
}
