import { redirect } from 'next/navigation'
import { obterEstadoSessao } from '@/lib/seguranca/sessao'
import { lerConfiguracoes } from '@/lib/dados/configuracoes'
import { registrarErro } from '@/lib/seguranca/api'
import { BarraLateral } from '@/components/painel/BarraLateral'
import p from '@/components/painel/painel.module.css'

/**
 * Segunda barreira (a primeira é o proxy): toda página do painel confere
 * no servidor que a sessão é de um admin e passou pelo 2FA.
 */
export default async function LayoutPainel({ children }: { children: React.ReactNode }) {
  const estado = await obterEstadoSessao()
  if (estado.tipo !== 'completa') redirect('/entrar')

  let metaSemanal = 50
  try {
    metaSemanal = (await lerConfiguracoes()).metaSemanal
  } catch (erro) {
    registrarErro('painel/layout', erro)
  }
  // Os leads entram no item 3; até lá a contagem da semana é 0.
  const cadastradosSemana = 0

  return (
    <div className={p.painel}>
      <BarraLateral metaSemanal={metaSemanal} cadastradosSemana={cadastradosSemana} />
      <main className={p.conteudo}>{children}</main>
    </div>
  )
}
