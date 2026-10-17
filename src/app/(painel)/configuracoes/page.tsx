import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { exigirSessaoCompleta } from '@/lib/seguranca/sessao'
import { lerConfiguracoes, listarTipos } from '@/lib/dados/configuracoes'
import { contarCodigosRestantes } from '@/lib/seguranca/codigos-backup'
import { TelaConfiguracoes } from './TelaConfiguracoes'

export const metadata: Metadata = { title: 'configurações · araújo_' }

export default async function PaginaConfiguracoes() {
  const sessao = await exigirSessaoCompleta()
  if (!sessao) redirect('/entrar')

  const [configuracoes, tipos, codigosRestantes] = await Promise.all([
    lerConfiguracoes(),
    listarTipos(),
    contarCodigosRestantes(sessao.usuario.id),
  ])

  return <TelaConfiguracoes inicial={{ configuracoes, tipos, codigosRestantes }} />
}
