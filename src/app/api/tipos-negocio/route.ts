import { exigirSessaoCompleta } from '@/lib/seguranca/sessao'
import { EsquemaTipo, adicionarTipo, listarTipos } from '@/lib/dados/configuracoes'
import {
  registrarErro, ERRO_DADOS, ERRO_INTERNO, ERRO_ORIGEM, ERRO_SESSAO, lerJson, origemValida, responder,
} from '@/lib/seguranca/api'

export async function GET() {
  if (!(await exigirSessaoCompleta())) return ERRO_SESSAO()
  try {
    return responder({ tipos: await listarTipos() })
  } catch (erro) {
    registrarErro('tipos-negocio', erro)
    return ERRO_INTERNO()
  }
}

export async function POST(req: Request) {
  if (!origemValida(req)) return ERRO_ORIGEM()
  if (!(await exigirSessaoCompleta())) return ERRO_SESSAO()
  const dados = EsquemaTipo.safeParse(await lerJson(req))
  if (!dados.success) return ERRO_DADOS()
  try {
    const tipo = await adicionarTipo(dados.data.nome)
    if (!tipo) return responder({ erro: 'duplicado' }, 409)
    return responder({ tipo }, 201)
  } catch (erro) {
    registrarErro('tipos-negocio', erro)
    return ERRO_INTERNO()
  }
}
