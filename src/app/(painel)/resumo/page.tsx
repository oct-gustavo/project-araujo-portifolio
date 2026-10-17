import type { Metadata } from 'next'
import { Cabecalho } from '@/components/painel/Cabecalho'
import { EmConstrucao } from '@/components/painel/EmConstrucao'

export const metadata: Metadata = { title: 'resumo · araújo_' }

export default function PaginaResumo() {
  return (
    <>
      <Cabecalho sobretitulo="Seu ritmo da semana" titulo="Resumo semanal" />
      <EmConstrucao item={5} texto="Números da semana, funil de contato, resultados por tipo de negócio e retornos agendados." />
    </>
  )
}
