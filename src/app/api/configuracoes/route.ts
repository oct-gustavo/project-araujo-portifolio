import { exigirSessaoCompleta } from '@/lib/seguranca/sessao'
import { EsquemaConfiguracoes, lerConfiguracoes, salvarConfiguracoes } from '@/lib/dados/configuracoes'
import {
  registrarErro, ERRO_DADOS, ERRO_INTERNO, ERRO_ORIGEM, ERRO_SESSAO, lerJson, origemValida, responder,
} from '@/lib/seguranca/api'

export async function GET() {
  if (!(await exigirSessaoCompleta())) return ERRO_SESSAO()
  try {
    return responder(await lerConfiguracoes())
  } catch (erro) {
    registrarErro('configuracoes', erro)
    return ERRO_INTERNO()
  }
}

export async function PUT(req: Request) {
  if (!origemValida(req)) return ERRO_ORIGEM()
  if (!(await exigirSessaoCompleta())) return ERRO_SESSAO()
  const dados = EsquemaConfiguracoes.safeParse(await lerJson(req))
  if (!dados.success) return ERRO_DADOS()
  try {
    return responder(await salvarConfiguracoes(dados.data))
  } catch (erro) {
    registrarErro('configuracoes', erro)
    return ERRO_INTERNO()
  }
}
