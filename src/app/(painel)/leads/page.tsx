import type { Metadata } from 'next'
import { Cabecalho } from '@/components/painel/Cabecalho'
import { EmConstrucao } from '@/components/painel/EmConstrucao'

export const metadata: Metadata = { title: 'leads · araújo_' }

export default function PaginaLeads() {
  return (
    <>
      <Cabecalho sobretitulo="Sua lista de prospecção" titulo="Leads" />
      <EmConstrucao item={4} texto="Aqui vai ficar a lista com status, prioridade, histórico de contato e retornos agendados." />
    </>
  )
}
