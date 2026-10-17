import { z } from 'zod'
import { criarClienteServidor } from '@/lib/supabase/servidor'
import { ehAdmin } from '@/lib/seguranca/sessao'
import { chavesDaTentativa, consultarTentativas, registrarFalha } from '@/lib/seguranca/tentativas'
import {
  registrarErro, ERRO_DADOS, ERRO_INTERNO, ERRO_ORIGEM, lerJson, origemValida, responder, responderFalha,
} from '@/lib/seguranca/api'

const Esquema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  senha: z.string().min(1).max(200),
})

function mascarar(email: string): string {
  const [nome, dominio = ''] = email.split('@')
  const fim = dominio.split('.').slice(1).join('.')
  return `${nome.slice(0, 2)}•••@•••${fim ? '.' + fim : ''}`
}

export async function POST(req: Request) {
  if (!origemValida(req)) return ERRO_ORIGEM()
  const dados = Esquema.safeParse(await lerJson(req))
  if (!dados.success) return ERRO_DADOS()
  const { email, senha } = dados.data

  try {
    const chaves = chavesDaTentativa(req, email)
    const situacao = await consultarTentativas(chaves)
    if (situacao.bloqueadoAte) return responder({ erro: 'bloqueado', bloqueadoAte: situacao.bloqueadoAte }, 429)

    const supabase = await criarClienteServidor()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha })

    // Mesma resposta para "e-mail não existe", "senha errada" e "não é admin".
    if (error || !data.user || !(await ehAdmin(data.user.id))) {
      if (data?.user) await supabase.auth.signOut()
      return responderFalha(await registrarFalha(chaves), 'credenciais')
    }

    const { data: fatores } = await supabase.auth.mfa.listFactors()
    const temTotp = (fatores?.totp?.length ?? 0) > 0
    return responder({ proxima: temTotp ? '2fa' : 'configurar', email: mascarar(email) })
  } catch (erro) {
    registrarErro('auth/login', erro)
    return ERRO_INTERNO()
  }
}
