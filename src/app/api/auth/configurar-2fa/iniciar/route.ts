import { criarClienteServidor } from '@/lib/supabase/servidor'
import { ehAdmin } from '@/lib/seguranca/sessao'
import { registrarErro, ERRO_INTERNO, ERRO_ORIGEM, ERRO_SESSAO, origemValida, responder } from '@/lib/seguranca/api'

/** Gera um QR code novo. Só funciona enquanto não existe um 2FA confirmado. */
export async function POST(req: Request) {
  if (!origemValida(req)) return ERRO_ORIGEM()

  try {
    const supabase = await criarClienteServidor()
    const { data: u } = await supabase.auth.getUser()
    const usuario = u.user
    if (!usuario || !(await ehAdmin(usuario.id))) return ERRO_SESSAO()

    const { data: fatores } = await supabase.auth.mfa.listFactors()
    if ((fatores?.totp?.length ?? 0) > 0) return responder({ erro: 'ja_configurado' }, 403)

    // Remove tentativas anteriores que não foram confirmadas.
    for (const f of fatores?.all ?? []) {
      if (f.factor_type === 'totp' && f.status === 'unverified') {
        await supabase.auth.mfa.unenroll({ factorId: f.id })
      }
    }

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: `autenticador-${Date.now()}`,
      issuer: 'araujo',
    })
    if (error || !data) {
      registrarErro('auth/configurar-2fa/iniciar', error ?? 'enroll sem dados')
      return ERRO_INTERNO()
    }

    return responder({ fatorId: data.id, qrSvg: data.totp.qr_code, segredo: data.totp.secret })
  } catch (erro) {
    registrarErro('auth/configurar-2fa/iniciar', erro)
    return ERRO_INTERNO()
  }
}
