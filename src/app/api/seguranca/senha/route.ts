import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_CHAVE_PUBLICA, SUPABASE_URL } from '@/lib/env'
import { criarClienteAdmin } from '@/lib/supabase/admin'
import { exigirSessaoCompleta } from '@/lib/seguranca/sessao'
import { chavesDaTentativa, consultarTentativas, limparFalhas, registrarFalha } from '@/lib/seguranca/tentativas'
import {
  registrarErro, ERRO_INTERNO, ERRO_ORIGEM, ERRO_SESSAO, lerJson, origemValida, responder, responderFalha,
} from '@/lib/seguranca/api'

const Esquema = z
  .object({
    senhaAtual: z.string().min(1).max(200),
    novaSenha: z.string().min(12).max(200),
  })
  .refine((d) => d.novaSenha !== d.senhaAtual, { path: ['novaSenha'] })

/**
 * Troca a senha. Confere a senha atual num cliente separado (sem mexer nos cookies,
 * para não derrubar a sessão com 2FA) e a senha errada conta no bloqueio de 3 tentativas.
 */
export async function POST(req: Request) {
  if (!origemValida(req)) return ERRO_ORIGEM()
  const sessao = await exigirSessaoCompleta()
  if (!sessao?.usuario.email) return ERRO_SESSAO()
  const dados = Esquema.safeParse(await lerJson(req))
  if (!dados.success) return responder({ erro: 'dados', detalhe: 'a nova senha precisa ter pelo menos 12 caracteres e ser diferente da atual' }, 400)

  try {
    const email = sessao.usuario.email
    const chaves = chavesDaTentativa(req, email)
    const situacao = await consultarTentativas(chaves)
    if (situacao.bloqueadoAte) return responder({ erro: 'bloqueado', bloqueadoAte: situacao.bloqueadoAte }, 429)

    const avulso = createClient(SUPABASE_URL(), SUPABASE_CHAVE_PUBLICA(), {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
    const { error: erroSenha } = await avulso.auth.signInWithPassword({ email, password: dados.data.senhaAtual })
    if (erroSenha) return responderFalha(await registrarFalha(chaves), 'credenciais')
    await avulso.auth.signOut({ scope: 'local' })

    const admin = criarClienteAdmin()
    const { error } = await admin.auth.admin.updateUserById(sessao.usuario.id, { password: dados.data.novaSenha })
    if (error) {
      if (/weak|pwned|password/i.test(error.message)) {
        return responder({ erro: 'dados', detalhe: 'o Supabase recusou a senha (fraca ou já vazada). escolha outra.' }, 400)
      }
      throw new Error(`Falha ao trocar senha: ${error.message}`)
    }

    await limparFalhas(chaves)
    return responder({ ok: true })
  } catch (erro) {
    registrarErro('seguranca/senha', erro)
    return ERRO_INTERNO()
  }
}
