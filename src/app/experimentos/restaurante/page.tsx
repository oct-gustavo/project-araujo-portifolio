import '@/components/experimentos/experimentos.css'
import { fontesRestaurante } from '@/components/experimentos/fontes'
import { metadadosExperimento, viewportExperimento } from '@/components/experimentos/metadados'
import { Restaurante } from '@/components/experimentos/Restaurante'

export const metadata = metadadosExperimento('restaurante')
export const viewport = viewportExperimento('#F6EFE3')

/** Site experimental (conceito com nomes e dados fictícios). Nada é enviado: tudo acontece no navegador. */
export default function Pagina() {
  return (
    <div className={`ex ex-rest ${fontesRestaurante}`}>
      <Restaurante />
    </div>
  )
}
