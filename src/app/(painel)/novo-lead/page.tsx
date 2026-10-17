import type { Metadata } from 'next'
import { Cabecalho } from '@/components/painel/Cabecalho'
import { EmConstrucao } from '@/components/painel/EmConstrucao'

export const metadata: Metadata = { title: 'novo lead · araújo_' }

export default function PaginaNovoLead() {
  return (
    <>
      <Cabecalho sobretitulo="Cadastro manual · a partir do Google Maps" titulo="Novo lead" />
      <EmConstrucao item={3} texto="Cadastro rápido com link do Maps, aviso de duplicado e checagem do site." />
    </>
  )
}
